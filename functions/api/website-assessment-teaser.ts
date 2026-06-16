import {
  buildAssessmentTeaserEmailText,
  buildAssessmentTeaserFileName,
  buildAssessmentTeaserPdf,
  normalizeAssessmentTeaserRequest,
  type AssessmentReportSummary,
  type AssessmentTeaserRequest,
} from "../../src/lib/assessment-teaser";

type FunctionContext = {
  request: Request;
  env: Record<string, unknown>;
  waitUntil?: (promise: Promise<unknown>) => void;
};

type AssessmentJobResponse = {
  scanId?: string;
  statusUrl?: string;
  error?: string;
};

type AssessmentStatusResponse = {
  scan?: {
    status?: string;
    error?: string;
    report?: AssessmentReportSummary;
  };
  error?: string;
};

export async function onRequestPost({ request, env, waitUntil }: FunctionContext) {
  const body = await request.json().catch(() => null);
  const teaserRequest = normalizeAssessmentTeaserRequest(body);

  if (!teaserRequest) {
    return json(
      {
        error:
          "Please enter a valid public website and the email address where we should send the teaser report.",
      },
      400,
    );
  }

  const clientIp = request.headers.get("cf-connecting-ip") || "";
  const turnstile = await verifyTurnstile(env, teaserRequest.turnstileToken, clientIp);
  if (!turnstile.ok) {
    return json({ error: "Please complete the verification and try again." }, 403);
  }

  const assessmentBaseUrl =
    envString(env, "ASSESSMENT_API_BASE_URL") ||
    "https://assessment.northvalleyintel.com";
  const queued = await queueAssessment(assessmentBaseUrl, teaserRequest.websiteUrl);

  if (!queued.scanId) {
    return json(
      {
        error:
          queued.error ||
          "We could not start the website assessment. Please check the website URL and try again.",
      },
      502,
    );
  }

  const adminNotification = sendAssessmentRequestNotification({
    env,
    teaserRequest,
    assessmentBaseUrl,
    scanId: queued.scanId,
    statusUrl: queued.statusUrl || `/api/scans/${queued.scanId}`,
  }).catch((error) => {
    console.warn("assessment_teaser_admin_notification_failed", {
      error: error instanceof Error ? error.message : String(error),
      websiteUrl: teaserRequest.websiteUrl,
    });
  });

  const followUp = completeAndSendTeaser({
    env,
    assessmentBaseUrl,
    teaserRequest,
    scanId: queued.scanId,
    statusUrl: queued.statusUrl || `/api/scans/${queued.scanId}`,
  }).catch((error) => {
    console.warn("assessment_teaser_followup_failed", {
      error: error instanceof Error ? error.message : String(error),
      websiteUrl: teaserRequest.websiteUrl,
    });
  });

  if (waitUntil) {
    waitUntil(adminNotification);
    waitUntil(followUp);
  } else {
    adminNotification.catch(() => undefined);
    followUp.catch(() => undefined);
  }

  return json(
    {
      status: "queued",
      message:
        "We are preparing the teaser report and will email it when the assessment finishes.",
    },
    202,
  );
}

export function onRequestGet() {
  return json({ error: "Method not allowed." }, 405);
}

async function completeAndSendTeaser(input: {
  env: Record<string, unknown>;
  assessmentBaseUrl: string;
  teaserRequest: AssessmentTeaserRequest;
  scanId: string;
  statusUrl: string;
}) {
  const report = await waitForAssessmentReport(
    input.assessmentBaseUrl,
    input.statusUrl,
  );

  if (!report) {
    await sendAssessmentEmail({
      env: input.env,
      request: input.teaserRequest,
      subject: "Northvalley Website Growth Assessment request",
      text: buildAssessmentTeaserEmailText({
        request: input.teaserRequest,
        status: "failed",
        message:
          "The automated scan did not finish quickly enough for the teaser email. We have the request and can review it manually.",
      }),
    });
    return;
  }

  const pdf = buildAssessmentTeaserPdf({
    request: input.teaserRequest,
    report,
  });

  await sendAssessmentEmail({
    env: input.env,
    request: input.teaserRequest,
    subject: `Website Growth Assessment teaser for ${report.domain}`,
    text: buildAssessmentTeaserEmailText({
      request: input.teaserRequest,
      report,
      status: "completed",
    }),
    attachment: {
      filename: buildAssessmentTeaserFileName(report),
      content: base64Encode(pdf),
    },
  });
}

async function sendAssessmentRequestNotification(input: {
  env: Record<string, unknown>;
  teaserRequest: AssessmentTeaserRequest;
  assessmentBaseUrl: string;
  scanId: string;
  statusUrl: string;
}) {
  const apiKey = envString(input.env, "RESEND_API_KEY");
  const notifyTo =
    envString(input.env, "ASSESSMENT_TEASER_NOTIFY_TO") ||
    envString(input.env, "CHAT_NOTIFY_TO") ||
    envString(input.env, "ASSESSMENT_HOST_EMAIL");
  const notifyFrom =
    envString(input.env, "ASSESSMENT_TEASER_FROM") ||
    envString(input.env, "CHAT_NOTIFY_FROM") ||
    "Northvalley Intelligence <alerts@northvalleyintel.com>";

  if (!apiKey || !notifyTo) {
    return;
  }

  const statusUrl = input.statusUrl.startsWith("http")
    ? input.statusUrl
    : `${input.assessmentBaseUrl.replace(/\/$/, "")}${input.statusUrl}`;

  const response = await fetchWithTimeout(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: notifyFrom,
        to: [notifyTo],
        subject: `New website assessment request: ${input.teaserRequest.websiteUrl}`,
        text: buildAssessmentRequestNotificationText({
          request: input.teaserRequest,
          scanId: input.scanId,
          statusUrl,
        }),
      }),
    },
    8000,
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Resend rejected the assessment request notification with status ${response.status}: ${errorBody.slice(0, 240)}`,
    );
  }
}

function buildAssessmentRequestNotificationText(input: {
  request: AssessmentTeaserRequest;
  scanId: string;
  statusUrl: string;
}) {
  return [
    "Someone requested a Northvalley website assessment teaser.",
    "",
    `Business: ${input.request.businessName || "Not provided"}`,
    `Website: ${input.request.websiteUrl}`,
    `Requester email: ${input.request.email}`,
    `Scan ID: ${input.scanId}`,
    `Assessment status: ${input.statusUrl}`,
    "",
    "This notification is sent as soon as the assessment is queued. The visitor-facing teaser email is sent separately when the scan finishes.",
  ].join("\n");
}

async function queueAssessment(baseUrl: string, websiteUrl: string) {
  const response = await fetchWithTimeout(
    `${baseUrl.replace(/\/$/, "")}/api/scans`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: websiteUrl }),
    },
    8000,
  );
  const data = (await response.json().catch(() => ({}))) as AssessmentJobResponse;

  if (!response.ok) {
    return { error: data.error || "Assessment queue request failed." };
  }

  return data;
}

async function waitForAssessmentReport(baseUrl: string, statusUrl: string) {
  const target = statusUrl.startsWith("http")
    ? statusUrl
    : `${baseUrl.replace(/\/$/, "")}${statusUrl}`;

  for (let attempt = 0; attempt < 14; attempt += 1) {
    await delay(attempt === 0 ? 2500 : 4000);
    const response = await fetchWithTimeout(
      target,
      { headers: { accept: "application/json" } },
      8000,
    );
    const data = (await response.json().catch(() => ({}))) as AssessmentStatusResponse;
    const scan = data.scan;

    if (scan?.status === "completed" && scan.report) {
      return scan.report;
    }

    if (scan?.status === "failed" || scan?.status === "insufficient_evidence") {
      return null;
    }
  }

  return null;
}

async function sendAssessmentEmail(input: {
  env: Record<string, unknown>;
  request: AssessmentTeaserRequest;
  subject: string;
  text: string;
  attachment?: {
    filename: string;
    content: string;
  };
}) {
  const apiKey = envString(input.env, "RESEND_API_KEY");
  const from =
    envString(input.env, "ASSESSMENT_TEASER_FROM") ||
    envString(input.env, "CHAT_NOTIFY_FROM") ||
    "Northvalley Intelligence <onboarding@resend.dev>";
  const cc =
    envString(input.env, "ASSESSMENT_TEASER_CC") ||
    "contact@northvalleyintel.com";

  if (!apiKey) {
    return;
  }

  const body: Record<string, unknown> = {
    from,
    to: [input.request.email],
    cc: [cc],
    subject: input.subject,
    text: input.text,
  };

  if (input.attachment) {
    body.attachments = [input.attachment];
  }

  const response = await fetchWithTimeout(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
    8000,
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Resend rejected the assessment teaser email with status ${response.status}: ${errorBody.slice(0, 240)}`,
    );
  }
}

async function verifyTurnstile(
  env: Record<string, unknown>,
  token: string,
  clientIp: string,
) {
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

  const data = (await response.json().catch(() => ({}))) as { success?: boolean };
  return { ok: data.success === true };
}

function envString(env: Record<string, unknown>, key: string) {
  const value = env[key];
  return typeof value === "string" ? value.trim() : "";
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
