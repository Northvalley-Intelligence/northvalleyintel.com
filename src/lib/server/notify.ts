/**
 * Server-only delivery helpers shared by every Northvalley intake path.
 *
 * Both the website form route (functions/api/client-intake.ts) and the
 * agent-native MCP write path call these, so there is one delivery path, one
 * set of env fallbacks, and one place where a Resend failure is interpreted.
 * Do not fork this logic per entry point.
 *
 * This module is imported only by Cloudflare Pages Functions. It must never be
 * imported by a client component: it reads secrets from the Function env.
 */

export type ServerEnv = Record<string, unknown>;

export type NotificationAttachment = {
  filename: string;
  content: string;
};

export type SendNotificationInput = {
  env: ServerEnv;
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: NotificationAttachment[];
  fromEnvKeys?: string[];
  toEnvKeys?: string[];
  /** Explicit recipients. Overrides toEnvKeys when set. */
  to?: string[];
  cc?: string[];
  timeoutMs?: number;
};

export type SendNotificationResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" }
  | { ok: false; reason: "delivery_failed"; status: number; detail: string };

const defaultFromEnvKeys = ["CLIENT_INTAKE_FROM", "CHAT_NOTIFY_FROM"];
const defaultToEnvKeys = [
  "CLIENT_INTAKE_NOTIFY_TO",
  "CHAT_NOTIFY_TO",
  "ASSESSMENT_HOST_EMAIL",
];
const fallbackFrom = "Northvalley Intelligence <alerts@northvalleyintel.com>";
const fallbackTo = "hello@northvalleyintel.com";

export function envString(env: ServerEnv, key: string) {
  const value = env[key];
  return typeof value === "string" ? value.trim() : "";
}

export function firstEnvString(
  env: ServerEnv,
  keys: string[],
  fallback: string,
) {
  for (const key of keys) {
    const value = envString(env, key);
    if (value) {
      return value;
    }
  }

  return fallback;
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json",
    },
    status,
  });
}

export async function fetchWithTimeout(
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

/**
 * Sends a private Northvalley notification through Resend.
 *
 * Fails closed: a missing RESEND_API_KEY returns not_configured rather than
 * silently reporting success, so no caller can tell a requester their message
 * was delivered when it never left the edge.
 */
export async function sendNotificationEmail(
  input: SendNotificationInput,
): Promise<SendNotificationResult> {
  const {
    env,
    subject,
    text,
    replyTo,
    attachments,
    fromEnvKeys = defaultFromEnvKeys,
    toEnvKeys = defaultToEnvKeys,
    to,
    cc,
    timeoutMs = 8000,
  } = input;

  const apiKey = envString(env, "RESEND_API_KEY");

  if (!apiKey) {
    return { ok: false, reason: "not_configured" };
  }

  const response = await fetchWithTimeout(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: firstEnvString(env, fromEnvKeys, fallbackFrom),
        to: to && to.length ? to : [firstEnvString(env, toEnvKeys, fallbackTo)],
        ...(cc && cc.length ? { cc } : {}),
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text,
        ...(attachments && attachments.length ? { attachments } : {}),
      }),
    },
    timeoutMs,
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    return {
      ok: false,
      reason: "delivery_failed",
      status: response.status,
      detail: errorBody.slice(0, 240),
    };
  }

  return { ok: true };
}

export function base64Encode(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.slice(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export function safeFileName(fileName: string) {
  return fileName.replace(/[^a-z0-9._-]/gi, "_").slice(0, 120) || "photo";
}
