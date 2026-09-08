/**
 * Abuse gate for the public MCP write path.
 *
 * Turnstile protects the browser forms but cannot run inside an assistant, so
 * the write path substitutes: credential rejection, sensitive-personal-data
 * rejection, a honeypot, an optional shared secret, and a durable D1 throttle.
 * A write path without a durable throttle is not shippable.
 *
 * The sensitive-data check is server-side on purpose. The tool descriptions
 * and server instructions already tell an assistant not to send health,
 * financial or Social Security details, but instructions are advice: an
 * assistant can ignore them and a caller can bypass them entirely by speaking
 * JSON-RPC directly. Anything the server must not carry is refused here.
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

export type SensitiveDataKind = "ssn" | "card" | "bank" | "health";

export type SensitiveDataResult = { hit: boolean; kind?: SensitiveDataKind };

export const sensitiveDataRejectionReason =
  "Do not include sensitive personal information — no Social Security, payment-card, bank-account, or health details. Remove them and send the request again.";

/**
 * A US Social Security number, with or without separators.
 *
 * The negative lookaheads encode the SSA's own invalid ranges (area 000, 666
 * and 900-999; group 00; serial 0000). They matter here as false-positive
 * control, not as validation: without them any nine-digit run — an order
 * number, a account reference — would be refused.
 *
 * The leading \b is load-bearing. It stops the pattern from matching a
 * nine-digit window inside a longer digit run, so a ten-digit phone number
 * typed without separators stays allowed.
 */
const ssnPattern =
  /\b(?!000|666|9\d\d)\d{3}[- ]?(?!00)\d{2}[- ]?(?!0000)\d{4}\b/;

/** "SSN: 12345", "social security number 123 45 6789" — labelled, so any digits count. */
const labelledSsnPattern =
  /\b(?:ssn|social security(?:\s+number)?)\b[^0-9]{0,20}\d{3}/i;

/**
 * A candidate payment-card number: 13-19 digits, single spaces or dashes
 * allowed between them, not embedded in a longer digit run. Length alone is
 * not enough to refuse on — every match is then put through Luhn, which is
 * what separates a card from a long reference number.
 */
const cardCandidatePattern = /(?<!\d)\d(?:[ -]?\d){12,18}(?!\d)/g;

/** "routing number 021000021", "account number: 123456789". */
const labelledBankPattern =
  /\b(?:routing|account)\s+number\b[\s\S]{0,40}?\d{8}/i;

/** IBAN: country code, check digits, then the basic bank account number. */
const ibanPattern = /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/;

/**
 * Explicit health disclosures only.
 *
 * Deliberately phrase-level rather than word-level. "cancer" or "condition"
 * on their own appear in ordinary business copy ("we treat cancer patients",
 * "the condition of the site"), and refusing those would break the legitimate
 * write path this gate exists to protect.
 */
const healthPatterns = [
  /\bmy diagnosis\b/i,
  /\bdiagnosed with\b/i,
  /\bmedical condition\b/i,
  /\bprescription for\b/i,
  /\bmental health condition\b/i,
  /\bHIV\b/,
  /\bcancer treatment\b/i,
];

/** Standard Luhn checksum. Returns false for anything that is not all digits. */
function passesLuhn(digits: string) {
  if (!/^\d+$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let double = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let value = digits.charCodeAt(index) - 48;

    if (double) {
      value *= 2;
      if (value > 9) {
        value -= 9;
      }
    }

    sum += value;
    double = !double;
  }

  return sum % 10 === 0;
}

function containsLuhnValidCard(text: string) {
  cardCandidatePattern.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = cardCandidatePattern.exec(text)) !== null) {
    if (passesLuhn(match[0].replace(/[ -]/g, ""))) {
      return true;
    }
  }

  return false;
}

/**
 * Deterministic sensitive-personal-data detection for the public write path.
 *
 * Northvalley needs an email, a website and a sentence about the problem.
 * Nothing else belongs in these fields, so the server refuses the categories a
 * pattern can recognise with confidence rather than trusting the tool
 * descriptions to keep them out. Disclaimer text is advice to an assistant;
 * this is the enforcement.
 */
export function containsSensitivePersonalData(
  ...texts: string[]
): SensitiveDataResult {
  const combined = texts.filter(Boolean).join(" \n ");

  if (!combined.trim()) {
    return { hit: false };
  }

  if (ssnPattern.test(combined) || labelledSsnPattern.test(combined)) {
    return { hit: true, kind: "ssn" };
  }

  if (containsLuhnValidCard(combined)) {
    return { hit: true, kind: "card" };
  }

  if (labelledBankPattern.test(combined) || ibanPattern.test(combined)) {
    return { hit: true, kind: "bank" };
  }

  if (healthPatterns.some((pattern) => pattern.test(combined))) {
    return { hit: true, kind: "health" };
  }

  return { hit: false };
}

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

  // Refused here, before any delivery. The rejected text is never echoed back
  // in the reason and never reaches sendNotificationEmail, so a Social
  // Security or card number pasted into a tool call does not end up in a
  // Northvalley inbox or a Resend log.
  if (containsSensitivePersonalData(...input.freeText).hit) {
    return {
      ok: false,
      reason: sensitiveDataRejectionReason,
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
