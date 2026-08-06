/**
 * Durable throttle for the public MCP write path.
 *
 * Assistants cannot solve a Turnstile challenge, so the browser bot gate does
 * not apply here. This counts recent rows in the D1 database the project
 * already binds — the same approach workflow-chat uses — rather than adding
 * KV or Durable Objects. No new infrastructure, and it survives across Worker
 * isolates because the count lives in the database rather than in memory.
 *
 * The policy is deliberately separated from the database IO so the decision
 * can be exercised without a database.
 */

export type ThrottleCounts = {
  contactLastHour: number;
  ipLastHour: number;
  ipLastMinute: number;
};

export type ThrottlePolicy = {
  maxPerContactPerHour: number;
  maxPerIpPerHour: number;
  maxPerIpPerMinute: number;
};

export const defaultMcpThrottlePolicy: ThrottlePolicy = {
  maxPerContactPerHour: 3,
  maxPerIpPerHour: 10,
  maxPerIpPerMinute: 3,
};

export type ThrottleDecision =
  | { allowed: true }
  | { allowed: false; reason: string };

/** Pure decision. Given counts and a policy, allow or deny. */
export function evaluateThrottle(
  counts: ThrottleCounts,
  policy: ThrottlePolicy = defaultMcpThrottlePolicy,
): ThrottleDecision {
  if (counts.ipLastMinute >= policy.maxPerIpPerMinute) {
    return {
      allowed: false,
      reason: "Too many requests in the last minute. Please try again shortly.",
    };
  }

  if (counts.contactLastHour >= policy.maxPerContactPerHour) {
    return {
      allowed: false,
      reason:
        "This contact already has recent requests with Northvalley. We will follow up on those rather than create duplicates.",
    };
  }

  if (counts.ipLastHour >= policy.maxPerIpPerHour) {
    return {
      allowed: false,
      reason: "Too many requests in the last hour. Please try again later.",
    };
  }

  return { allowed: true };
}

type D1Like = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      first: <T>(column: string) => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
};

export async function hashIdentifier(value: string) {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function countRecentMcpRequests(
  db: D1Like,
  input: { contactHash: string; ipHash: string; now?: Date },
): Promise<ThrottleCounts> {
  const now = input.now ?? new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();

  const contactLastHour =
    (await db
      .prepare(
        "select count(*) as total from mcp_requests where created_at >= ? and contact_hash = ?",
      )
      .bind(oneHourAgo, input.contactHash)
      .first<number>("total")) ?? 0;

  const ipLastHour =
    (await db
      .prepare(
        "select count(*) as total from mcp_requests where created_at >= ? and ip_hash = ?",
      )
      .bind(oneHourAgo, input.ipHash)
      .first<number>("total")) ?? 0;

  const ipLastMinute =
    (await db
      .prepare(
        "select count(*) as total from mcp_requests where created_at >= ? and ip_hash = ?",
      )
      .bind(oneMinuteAgo, input.ipHash)
      .first<number>("total")) ?? 0;

  return { contactLastHour, ipLastHour, ipLastMinute };
}

export async function recordMcpRequest(
  db: D1Like,
  input: { tool: string; contactHash: string; ipHash: string; now?: Date },
) {
  await db
    .prepare(
      "insert into mcp_requests (tool, contact_hash, ip_hash, status, source, created_at) values (?, ?, ?, 'pending', 'mcp_assistant', ?)",
    )
    .bind(
      input.tool,
      input.contactHash,
      input.ipHash,
      (input.now ?? new Date()).toISOString(),
    )
    .run();
}
