import {
  buildClientIntakeNotificationText,
  intakeFileSummary,
  isAllowedIntakeFile,
  normalizeClientIntakeFormData,
  validateClientIntakePayload,
} from "../../src/lib/client-intake";
import {
  base64Encode,
  envString,
  fetchWithTimeout,
  jsonResponse,
  safeFileName,
  sendNotificationEmail,
  type ServerEnv,
} from "../../src/lib/server/notify";

type FunctionContext = {
  request: Request;
  env: ServerEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
};

const maxFiles = 5;

export async function onRequestPost({ request, env }: FunctionContext) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return jsonResponse(
      { error: "Please complete the intake form and try again." },
      400,
    );
  }

  const payload = normalizeClientIntakeFormData(formData);
  const validation = validateClientIntakePayload(payload);
  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length > maxFiles) {
    validation.errors.photos = "Choose up to 5 photos.";
  }

  for (const file of files) {
    if (!isAllowedIntakeFile(file)) {
      validation.errors.photos =
        "Photos must be image files and each file must be 4 MB or smaller.";
      break;
    }
  }

  if (Object.keys(validation.errors).length > 0) {
    return jsonResponse(
      {
        error: "Please fix the highlighted fields and send the intake again.",
        errors: validation.errors,
      },
      400,
    );
  }

  const clientIp = request.headers.get("cf-connecting-ip") || "local";
  const turnstile = await verifyTurnstile(
    env,
    payload.turnstileToken,
    clientIp,
  );
  if (!turnstile.ok) {
    return jsonResponse(
      { error: "Please complete the verification and try again." },
      403,
    );
  }

  if (envString(env, "CLIENT_INTAKE_TEST_MODE") === "true") {
    return jsonResponse({
      status: "sent",
      message:
        "Thanks. We received the details. We will review them before we meet and follow up if anything important is missing.",
    });
  }

  const submittedAt = new Date().toISOString();
  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: safeFileName(file.name),
      content: base64Encode(new Uint8Array(await file.arrayBuffer())),
    })),
  );

  const delivery = await sendNotificationEmail({
    env,
    subject: `Website intake: ${payload.businessName}`,
    text: buildClientIntakeNotificationText({
      payload,
      files: intakeFileSummary(files),
      submittedAt,
    }),
    replyTo: payload.contactEmail,
    attachments,
  });

  if (!delivery.ok && delivery.reason === "not_configured") {
    return jsonResponse(
      {
        error:
          "The intake form is not fully configured yet. Please email Northvalley directly.",
      },
      503,
    );
  }

  if (!delivery.ok) {
    console.warn("client_intake_resend_failed", {
      status: delivery.status,
      error: delivery.detail,
    });

    return jsonResponse(
      {
        error:
          "The intake could not be delivered. Please email Northvalley directly.",
      },
      502,
    );
  }

  return jsonResponse({
    status: "sent",
    message:
      "Thanks. We received the details. We will review them before we meet and follow up if anything important is missing.",
  });
}

export function onRequestGet() {
  return jsonResponse({ error: "Method not allowed." }, 405);
}

async function verifyTurnstile(
  env: ServerEnv,
  token: string,
  clientIp: string,
) {
  if (
    envString(env, "CLIENT_INTAKE_TEST_BYPASS_TURNSTILE") === "true" &&
    (clientIp === "local" || clientIp === "127.0.0.1" || clientIp === "::1")
  ) {
    return { ok: true };
  }

  const secret = envString(env, "TURNSTILE_SECRET_KEY");

  if (!secret) {
    return { ok: true };
  }

  if (!token) {
    return { ok: false };
  }

  const response = await fetchWithTimeout(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: clientIp,
      }),
    },
    5000,
  );

  if (!response.ok) {
    return { ok: false };
  }

  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
  };
  return { ok: data.success === true };
}
