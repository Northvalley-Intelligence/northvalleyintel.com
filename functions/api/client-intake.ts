import {
  buildClientIntakeNotificationText,
  intakeFileSummary,
  isAllowedIntakeFile,
  normalizeClientIntakeFormData,
  validateClientIntakePayload,
} from "../../src/lib/client-intake";

type FunctionContext = {
  request: Request;
  env: Record<string, unknown>;
  waitUntil?: (promise: Promise<unknown>) => void;
};

const maxFiles = 5;

export async function onRequestPost({ request, env }: FunctionContext) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return json(
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
    return json(
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
    return json(
      { error: "Please complete the verification and try again." },
      403,
    );
  }

  if (envString(env, "CLIENT_INTAKE_TEST_MODE") === "true") {
    return json({
      status: "sent",
      message:
        "Thanks. We received the details. We will review them before we meet and follow up if anything important is missing.",
    });
  }

  const apiKey = envString(env, "RESEND_API_KEY");
  if (!apiKey) {
    return json(
      {
        error:
          "The intake form is not fully configured yet. Please email Northvalley directly.",
      },
      503,
    );
  }

  const submittedAt = new Date().toISOString();
  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: safeFileName(file.name),
      content: base64Encode(new Uint8Array(await file.arrayBuffer())),
    })),
  );

  const response = await fetchWithTimeout(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from:
          envString(env, "CLIENT_INTAKE_FROM") ||
          envString(env, "CHAT_NOTIFY_FROM") ||
          "Northvalley Intelligence <alerts@northvalleyintel.com>",
        to: [
          envString(env, "CLIENT_INTAKE_NOTIFY_TO") ||
            envString(env, "CHAT_NOTIFY_TO") ||
            envString(env, "ASSESSMENT_HOST_EMAIL") ||
            "hello@northvalleyintel.com",
        ],
        reply_to: payload.contactEmail,
        subject: `Website intake: ${payload.businessName}`,
        text: buildClientIntakeNotificationText({
          payload,
          files: intakeFileSummary(files),
          submittedAt,
        }),
        attachments,
      }),
    },
    8000,
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.warn("client_intake_resend_failed", {
      status: response.status,
      error: errorBody.slice(0, 240),
    });

    return json(
      {
        error:
          "The intake could not be delivered. Please email Northvalley directly.",
      },
      502,
    );
  }

  return json({
    status: "sent",
    message:
      "Thanks. We received the details. We will review them before we meet and follow up if anything important is missing.",
  });
}

export function onRequestGet() {
  return json({ error: "Method not allowed." }, 405);
}

async function verifyTurnstile(
  env: Record<string, unknown>,
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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json",
    },
    status,
  });
}

function envString(env: Record<string, unknown>, key: string) {
  const value = env[key];
  return typeof value === "string" ? value.trim() : "";
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function base64Encode(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.slice(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-z0-9._-]/gi, "_").slice(0, 120) || "photo";
}
