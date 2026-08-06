/**
 * Abuse gate for the public MCP write path.
 *
 * Turnstile protects the browser forms but cannot run inside an assistant, so
 * the write path substitutes: credential rejection, a honeypot, an optional
 * shared secret, and a durable D1 throttle. A write path without a durable
 * throttle is not shippable.
 */

import { containsBlockedCredentialTerms } from "./secret-guard";
import {
  countRecentMcpRequests,
  evaluateThrottle,
  hashIdentifier,
  recordMcpRequest,
} from "./mcp-throttle";
import { envString, type ServerEnv } from "./notify";

export type AbuseGateInput = {
  env: ServerEnv;
  tool: string;
  contact: string;
  clientIp: string;
  /** Honeypot. Any value means an automated filler completed a hidden field. */
  doNotFill?: string;
  sharedSecret?: string;
  freeText: string[];
};

export type AbuseGateResult =
  | { ok: true; commit: () => Promise<void> }
  | { ok: false; reason: string };

export async function runAbuseGate(
  input: AbuseGateInput,
): Promise<AbuseGateResult> {
  if (input.doNotFill && input.doNotFill.trim()) {
    return {
      ok: false,
      reason: "This request looks automated and was not submitted.",
    };
  }

  if (containsBlockedCredentialTerms(...input.freeText)) {
    return {
      ok: false,
      reason:
        "Do not include passwords, API keys, access tokens, or account logins. Remove those details and send the request again.",
    };
  }

  const expectedSecret = envString(input.env, "MCP_SHARED_SECRET");
  if (expectedSecret && input.sharedSecret !== expectedSecret) {
    return {
      ok: false,
      reason: "This request could not be verified.",
    };
  }

  const db = input.env.WORKFLOW_CHAT_DB as
    | Parameters<typeof countRecentMcpRequests>[0]
    | undefined;

  // Fail closed. Without the database there is no durable throttle, and an
  // unthrottled public path that emails Northvalley is not acceptable.
  if (!db) {
    return {
      ok: false,
      reason:
        "The request path is not fully configured right now. Please email hello@northvalleyintel.com directly.",
    };
  }

  const contactHash = await hashIdentifier(input.contact);
  const ipHash = await hashIdentifier(input.clientIp);

  const counts = await countRecentMcpRequests(db, { contactHash, ipHash });
  const decision = evaluateThrottle(counts);

  if (!decision.allowed) {
    return { ok: false, reason: decision.reason };
  }

  return {
    ok: true,
    commit: () =>
      recordMcpRequest(db, { tool: input.tool, contactHash, ipHash }),
  };
}
