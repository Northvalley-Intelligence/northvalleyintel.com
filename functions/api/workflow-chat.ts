import {
  buildCalendarRequest,
  buildFallbackWorkflowChatResponse,
  buildContactCaptureReply,
  buildOpenAiWorkflowChatRequest,
  buildQualificationReply,
  buildUnsupportedLocationReply,
  buildProviderHeaders,
  classifyWorkflowChatIntent,
  getWorkflowChatAttemptConfigs,
  hasUnsupportedLocation,
  normalizeWorkflowChatRequest,
  parseOpenAiChatResponse,
  sanitizeWorkflowReply,
  shouldRequestContact,
  shouldRequestQualification,
} from "../../src/lib/workflow-chat";

type FunctionContext = {
  request: Request;
  env: WorkflowChatFunctionEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
};

type D1Database = {
  prepare: (query: string) => {
    first: <T = unknown>() => Promise<T | null>;
    bind: (...values: unknown[]) => {
      run: () => Promise<unknown>;
      first: <T = unknown>() => Promise<T | null>;
    };
  };
};

type WorkflowChatFunctionEnv = {
  [key: string]: unknown;
  WORKFLOW_CHAT_DB?: D1Database;
};

type CalendarInviteInput = {
  attendeeEmail: string;
  summary: string;
  description: string;
  startsAt: string;
};

export async function onRequestPost({ request, env, waitUntil }: FunctionContext) {
  const body = await request.json().catch(() => null);
  const chatRequest = normalizeWorkflowChatRequest(body);

  if (!chatRequest) {
    return json({ error: "Message is required." }, 400);
  }

  const clientIp = request.headers.get("cf-connecting-ip") || "local";
  const ipHash = await hashValue(clientIp);

  const turnstile = await verifyTurnstile(env, chatRequest.turnstileToken, clientIp);
  if (!turnstile.ok) {
    return json({ error: "Please complete the verification and try again." }, 403);
  }

  const rateLimit = await checkRateLimit(env, chatRequest.sessionId, ipHash);
  if (!rateLimit.ok) {
    return json(
      {
        error:
          "Too many chat messages in a short time. Please wait a bit and try again.",
      },
      429,
    );
  }

  const deterministic = buildFallbackWorkflowChatResponse(chatRequest);
  const calendarRequest = buildCalendarRequest(chatRequest.message);
  const configs = getWorkflowChatAttemptConfigs(
    envStringRecord(env),
    chatRequest.turnIndex,
  );
  const intent = classifyWorkflowChatIntent(chatRequest.message);
  let calendarInvite: "created" | "not_configured" | "not_requested" =
    calendarRequest ? "not_configured" : "not_requested";

  if (calendarRequest) {
    const calendarResult = await createCalendarInvite(env, calendarRequest);
    calendarInvite = calendarResult.created ? "created" : "not_configured";
  }

  if (hasUnsupportedLocation(chatRequest)) {
    const result = {
      ...deterministic,
      reply: buildUnsupportedLocationReply(
        chatRequest.message,
        chatRequest.history,
      ),
      calendarInvite,
    };
    queueChatFollowUps(waitUntil, env, chatRequest, result, intent, ipHash);
    return json(result);
  }

  if (shouldRequestContact(chatRequest)) {
    const result = {
      ...deterministic,
      reply: buildContactCaptureReply(chatRequest.message, chatRequest.history),
      calendarInvite,
    };
    queueChatFollowUps(waitUntil, env, chatRequest, result, intent, ipHash);
    return json(result);
  }

  if (shouldRequestQualification(chatRequest)) {
    const result = {
      ...deterministic,
      reply: buildQualificationReply(chatRequest.message, chatRequest.history),
      calendarInvite,
    };
    queueChatFollowUps(waitUntil, env, chatRequest, result, intent, ipHash);
    return json(result);
  }

  if (configs.length === 0) {
    const result = {
      ...deterministic,
      calendarInvite,
      reply:
        calendarInvite === "created"
          ? "Thanks. We created a calendar invite for the assessment conversation."
          : deterministic.reply,
    };
    queueChatFollowUps(waitUntil, env, chatRequest, result, intent, ipHash);
    return json(result);
  }

  for (const config of configs) {
    try {
      const response = await fetchWithTimeout(config.baseUrl, {
        method: "POST",
        headers: buildProviderHeaders(config),
        body: JSON.stringify(
          buildOpenAiWorkflowChatRequest(
            chatRequest.message,
            chatRequest.history,
            config.model,
            {
              disableThinking: config.provider === "local",
              maxTokens: config.provider === "local" ? 900 : undefined,
            },
          ),
        ),
      }, config.provider === "local" ? 30000 : 6000);

      if (!response.ok) {
        throw new Error(`provider_${response.status}`);
      }

      const parsed = parseOpenAiChatResponse(await response.json());
      const reply =
        calendarInvite === "created"
          ? "Thanks. We created a calendar invite for the assessment conversation."
          : sanitizeWorkflowReply(chatRequest.message, parsed.content);

      const result = {
        reply,
        mode: "llm",
        provider: config.provider,
        model: config.model,
        calendarInvite,
      } as const;
      queueChatFollowUps(waitUntil, env, chatRequest, result, intent, ipHash);
      return json(result);
    } catch (error) {
      console.warn(
        "workflow_chat_provider_failed",
        config.provider,
        error instanceof Error ? error.message : "unknown_error",
      );
      // Try the next configured provider before using the deterministic fallback.
    }
  }

  const result = {
    ...deterministic,
    calendarInvite,
    reply:
      calendarInvite === "created"
        ? "Thanks. We created a calendar invite for the assessment conversation."
        : deterministic.reply,
  };
  queueChatFollowUps(waitUntil, env, chatRequest, result, intent, ipHash);
  return json(result);
}

export async function onRequestGet() {
  return json({ error: "Method not allowed." }, 405);
}

async function createCalendarInvite(
  env: WorkflowChatFunctionEnv,
  input: CalendarInviteInput,
) {
  if (envString(env, "GOOGLE_CALENDAR_ENABLED") !== "true") {
    return { created: false };
  }

  if (!input.startsAt) {
    return { created: false };
  }

  const calendarId = envString(env, "GOOGLE_CALENDAR_ID");
  const accessToken =
    envString(env, "GOOGLE_CALENDAR_ACCESS_TOKEN") ||
    (await getRefreshedAccessToken(env));

  if (!calendarId || !accessToken) {
    return { created: false };
  }

  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
  const hostEmail =
    envString(env, "ASSESSMENT_HOST_EMAIL") || "ferosh@northvalleyintel.com";

  const response = await fetchWithTimeout(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId,
    )}/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: {
          dateTime: startsAt.toISOString(),
          timeZone: "America/New_York",
        },
        end: {
          dateTime: endsAt.toISOString(),
          timeZone: "America/New_York",
        },
        attendees: [{ email: input.attendeeEmail }, { email: hostEmail }],
      }),
    },
    6000,
  );

  return { created: response.ok };
}

async function verifyTurnstile(
  env: WorkflowChatFunctionEnv,
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

async function checkRateLimit(
  env: WorkflowChatFunctionEnv,
  sessionId: string,
  ipHash: string,
) {
  if (!env.WORKFLOW_CHAT_DB) {
    return { ok: true };
  }

  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const minuteLimit = Number(envString(env, "CHAT_RATE_LIMIT_PER_MINUTE") || "6");
  const hourLimit = Number(envString(env, "CHAT_RATE_LIMIT_PER_HOUR") || "30");

  const minuteCount = await env.WORKFLOW_CHAT_DB.prepare(
    `select count(*) as count
     from workflow_chat_turns
     where created_at >= ?
       and (session_id = ? or ip_hash = ?)`,
  )
    .bind(oneMinuteAgo, sessionId, ipHash)
    .first<{ count: number }>();
  const hourCount = await env.WORKFLOW_CHAT_DB.prepare(
    `select count(*) as count
     from workflow_chat_turns
     where created_at >= ?
       and (session_id = ? or ip_hash = ?)`,
  )
    .bind(oneHourAgo, sessionId, ipHash)
    .first<{ count: number }>();

  return {
    ok:
      Number(minuteCount?.count || 0) < minuteLimit &&
      Number(hourCount?.count || 0) < hourLimit,
  };
}

async function getRefreshedAccessToken(env: WorkflowChatFunctionEnv) {
  const clientId = envString(env, "GOOGLE_CALENDAR_CLIENT_ID");
  const clientSecret = envString(env, "GOOGLE_CALENDAR_CLIENT_SECRET");
  const refreshToken = envString(env, "GOOGLE_CALENDAR_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    return "";
  }

  const response = await fetchWithTimeout("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  }, 6000);

  if (!response.ok) {
    return "";
  }

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
  };
  return data.access_token || "";
}

function queueChatFollowUps(
  waitUntil: FunctionContext["waitUntil"],
  env: WorkflowChatFunctionEnv,
  chatRequest: NonNullable<ReturnType<typeof normalizeWorkflowChatRequest>>,
  result: {
    reply: string;
    mode: string;
    provider: string;
    model: string;
    calendarInvite?: string;
  },
  intent: string,
  ipHash: string,
) {
  const tasks = Promise.allSettled([
    storeChatTurn(env, chatRequest, result, intent, ipHash),
    sendChatNotification(env, chatRequest, result, intent),
  ]);

  if (waitUntil) {
    waitUntil(tasks);
    return;
  }

  tasks.catch(() => undefined);
}

async function storeChatTurn(
  env: WorkflowChatFunctionEnv,
  chatRequest: NonNullable<ReturnType<typeof normalizeWorkflowChatRequest>>,
  result: {
    reply: string;
    mode: string;
    provider: string;
    model: string;
    calendarInvite?: string;
  },
  intent: string,
  ipHash: string,
) {
  if (!env.WORKFLOW_CHAT_DB) {
    return;
  }

  await env.WORKFLOW_CHAT_DB.prepare(
    `insert into workflow_chat_turns (
      session_id,
      turn_index,
      intent,
      user_message,
      assistant_reply,
      response_mode,
      provider,
      model,
      calendar_invite,
      ip_hash,
      history_json,
      created_at
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      chatRequest.sessionId,
      chatRequest.turnIndex,
      intent,
      chatRequest.message,
      result.reply,
      result.mode,
      result.provider,
      result.model,
      result.calendarInvite || "not_requested",
      ipHash,
      JSON.stringify(chatRequest.history),
      new Date().toISOString(),
    )
    .run();
}

async function sendChatNotification(
  env: WorkflowChatFunctionEnv,
  chatRequest: NonNullable<ReturnType<typeof normalizeWorkflowChatRequest>>,
  result: {
    reply: string;
    mode: string;
    provider: string;
    model: string;
    calendarInvite?: string;
  },
  intent: string,
) {
  const apiKey = envString(env, "RESEND_API_KEY");
  const notifyTo =
    envString(env, "CHAT_NOTIFY_TO") || envString(env, "ASSESSMENT_HOST_EMAIL");
  const notifyFrom =
    envString(env, "CHAT_NOTIFY_FROM") ||
    "Northvalley Intelligence <alerts@northvalleyintel.com>";

  if (!apiKey || !notifyTo) {
    return;
  }

  await fetchWithTimeout(
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
        subject: `New Northvalley chat: ${intent.replaceAll("_", " ")}`,
        text: buildNotificationText(chatRequest, result, intent),
      }),
    },
    6000,
  );
}

function buildNotificationText(
  chatRequest: NonNullable<ReturnType<typeof normalizeWorkflowChatRequest>>,
  result: {
    reply: string;
    mode: string;
    provider: string;
    model: string;
    calendarInvite?: string;
  },
  intent: string,
) {
  const history = chatRequest.history
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  return [
    "A visitor engaged with the Northvalley workflow chat.",
    "",
    `Intent: ${intent}`,
    `Session: ${chatRequest.sessionId}`,
    `Turn: ${chatRequest.turnIndex}`,
    `Mode: ${result.mode}`,
    `Provider: ${result.provider}`,
    `Calendar: ${result.calendarInvite || "not_requested"}`,
    "",
    "Recent history:",
    history || "No prior turns.",
    "",
    "Visitor message:",
    chatRequest.message,
    "",
    "Assistant reply:",
    result.reply,
  ].join("\n");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

function envString(env: WorkflowChatFunctionEnv, key: string) {
  const value = env[key];
  return typeof value === "string" ? value : "";
}

function envStringRecord(env: WorkflowChatFunctionEnv) {
  const record: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string") {
      record[key] = value;
    }
  }

  return record;
}

async function hashValue(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await Promise.race([
      fetch(input, { ...init, signal: controller.signal }),
      new Promise<Response>((_, reject) => {
        setTimeout(() => reject(new Error("provider_timeout")), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
