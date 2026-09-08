/**
 * Abuse-gate tests for the public MCP write path.
 *
 * Run with:  npx tsx --test src/lib/server/__tests__/mcp-abuse.test.ts
 *
 * The repo has no test runner wired into package.json or CI (quality is lint,
 * typecheck and build, plus the bespoke scripts/validate-*.mjs contract
 * scripts). These use node:test through tsx so they add no dependency.
 *
 * Two layers:
 *
 *   1. containsSensitivePersonalData in isolation — the detectors, including
 *      the false positives that must stay ALLOWED. A guard that refuses
 *      ordinary business text is a worse defect than the one it fixes.
 *   2. The real JSON-RPC path — functions/mcp.ts onRequestPost driven with a
 *      tools/call body, asserting both that the refusal comes back and that
 *      NOTHING was sent. globalThis.fetch is stubbed, which is the only route
 *      sendNotificationEmail can use to reach Resend, so a zero call count is
 *      proof no email left the edge.
 */

import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { onRequestPost } from "../../../../functions/mcp";
import {
  containsSensitivePersonalData,
  runAbuseGate,
  sensitiveDataRejectionReason,
} from "../mcp-abuse";
import type { ServerEnv } from "../notify";

describe("containsSensitivePersonalData", () => {
  // [label, text, expected kind or null when more than one detector legitimately
  // fires — "…account 123456789" is both bank-labelled and SSN-shaped, and which
  // one reports it does not matter: the request is refused either way.]
  const rejected: Array<[string, string, string | null]> = [
    ["a bare SSN", "my SSN is 123-45-6789 if you need it", "ssn"],
    ["an unseparated SSN", "ssn 123456789", "ssn"],
    ["a spaced SSN", "social security number 123 45 6789", "ssn"],
    ["a Luhn-valid card", "card 4111 1111 1111 1111 exp 12/29", "card"],
    ["a dashed Luhn-valid card", "4111-1111-1111-1111", "card"],
    [
      "bank routing and account numbers",
      "routing number 021000021 account 123456789",
      null,
    ],
    [
      "a routing number with a non-SSN-shaped account",
      "routing number 021000021, account 4471002298",
      "bank",
    ],
    ["an IBAN", "pay from GB33BUKB20201555555555 please", "bank"],
    ["a stated diagnosis", "I was diagnosed with diabetes last year", "health"],
    [
      "a named medical condition",
      "my medical condition limits my hours",
      "health",
    ],
    ["an HIV disclosure", "I am HIV positive, is that a problem", "health"],
  ];

  for (const [label, text, kind] of rejected) {
    it(`flags ${label}`, () => {
      const result = containsSensitivePersonalData(text);
      assert.equal(result.hit, true, `expected a hit for: ${text}`);
      if (kind) {
        assert.equal(result.kind, kind);
      }
    });
  }

  const allowed: Array<[string, string]> = [
    [
      "a phone number and a ZIP",
      "Call me at (470) 781-4143, we are in Marietta 30064.",
    ],
    ["an unseparated phone number", "reach me on 4707814143 any afternoon"],
    [
      "a 16-digit number that fails Luhn",
      "our internal job reference is 1234567812345678",
    ],
    [
      "a website URL carrying digits",
      "please review https://example.com/2024/services-123456789012",
    ],
    [
      "an ordinary consult request",
      "I run a plumbing company and I lose leads because nobody follows up.",
    ],
    [
      "ordinary business copy using health words",
      "We are a clinic and our patients ask about cancer screening and prescription refills.",
    ],
    ["an order reference", "order number 4471 placed on 2026-09-08"],
    ["empty free text", ""],
  ];

  for (const [label, text] of allowed) {
    it(`allows ${label}`, () => {
      assert.deepEqual(
        containsSensitivePersonalData(text),
        { hit: false },
        `expected no hit for: ${text}`,
      );
    });
  }

  it("scans every free-text field, not just the first", () => {
    const result = containsSensitivePersonalData(
      "Acme Plumbing",
      "weekday mornings",
      "my SSN is 123-45-6789",
    );
    assert.equal(result.hit, true);
    assert.equal(result.kind, "ssn");
  });
});

/**
 * A D1 stand-in. The gate fails closed without a database, so the throttle has
 * to be satisfiable for the credential/sensitive checks to be reached at all.
 * Returns zero counts (nothing recent) and records writes so a test can assert
 * that a refused request left no row behind.
 */
function fakeDb() {
  const writes: string[] = [];

  return {
    writes,
    prepare(query: string) {
      return {
        bind(...values: unknown[]) {
          return {
            async first<T>(): Promise<T | null> {
              return 0 as unknown as T;
            },
            async run() {
              writes.push(`${query} :: ${JSON.stringify(values)}`);
              return {};
            },
          };
        },
      };
    },
  };
}

function gateEnv(db: ReturnType<typeof fakeDb>): ServerEnv {
  return {
    WORKFLOW_CHAT_DB: db,
    RESEND_API_KEY: "test-key-not-a-real-secret",
  };
}

describe("runAbuseGate", () => {
  it("refuses sensitive personal data with the guidance reason", async () => {
    const db = fakeDb();
    const result = await runAbuseGate({
      env: gateEnv(db),
      tool: "request_consult",
      contact: "jo@example.com",
      clientIp: "203.0.113.10",
      freeText: ["my SSN is 123-45-6789 and I need help"],
    });

    assert.equal(result.ok, false);
    assert.equal(
      result.ok === false ? result.reason : "",
      sensitiveDataRejectionReason,
    );
    assert.equal(db.writes.length, 0, "a refused request must not be recorded");
  });

  it("does not echo the rejected text back in the reason", async () => {
    const db = fakeDb();
    const result = await runAbuseGate({
      env: gateEnv(db),
      tool: "request_consult",
      contact: "jo@example.com",
      clientIp: "203.0.113.10",
      freeText: ["4111 1111 1111 1111"],
    });

    assert.equal(result.ok, false);
    const reason = result.ok === false ? result.reason : "";
    assert.ok(
      !reason.includes("4111"),
      "the card digits leaked into the reason",
    );
  });

  it("still refuses credentials", async () => {
    const db = fakeDb();
    const result = await runAbuseGate({
      env: gateEnv(db),
      tool: "request_consult",
      contact: "jo@example.com",
      clientIp: "203.0.113.11",
      freeText: ["here is my hosting password hunter2"],
    });

    assert.equal(result.ok, false);
    assert.match(
      result.ok === false ? result.reason : "",
      /passwords, API keys, access tokens/,
    );
  });

  it("still allows an ordinary request", async () => {
    const db = fakeDb();
    const result = await runAbuseGate({
      env: gateEnv(db),
      tool: "request_consult",
      contact: "dana@example.com",
      clientIp: "203.0.113.12",
      freeText: [
        "I run a plumbing company and I lose leads because nobody follows up.",
        "Acme Plumbing",
        "(470) 781-4143, weekday mornings",
      ],
    });

    assert.equal(result.ok, true);
  });
});

describe("MCP JSON-RPC write path", () => {
  const realFetch = globalThis.fetch;
  let outboundEmails = 0;

  after(() => {
    globalThis.fetch = realFetch;
  });

  /**
   * Stubs the only outbound call sendNotificationEmail makes. Counting it is
   * the assertion that matters: a refusal must leave the counter at zero.
   */
  function stubResend() {
    outboundEmails = 0;
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("api.resend.com")) {
        outboundEmails += 1;
        return new Response(JSON.stringify({ id: "stubbed" }), { status: 200 });
      }
      throw new Error(`unexpected outbound fetch in test: ${url}`);
    }) as typeof fetch;
  }

  async function callTool(name: string, args: Record<string, unknown>) {
    const db = fakeDb();
    const request = new Request("https://northvalleyintel.com/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "cf-connecting-ip": "203.0.113.20",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name, arguments: args },
      }),
    });

    const response = await onRequestPost({ request, env: gateEnv(db) });
    const text = await response.text();
    const payload = text.startsWith("{")
      ? JSON.parse(text)
      : JSON.parse(
          (
            text.split("\n").find((line) => line.startsWith("data:")) ??
            "data:{}"
          )
            .slice(5)
            .trim(),
        );

    return { payload, db };
  }

  it("rejects request_consult carrying an SSN and sends nothing", async () => {
    stubResend();
    const { payload, db } = await callTool("request_consult", {
      name: "Jo Patel",
      email: "jo@example.com",
      need: "my SSN is 123-45-6789 and I need help with my website leads",
    });

    assert.equal(payload.result?.isError, true);
    assert.equal(
      payload.result?.content?.[0]?.text,
      sensitiveDataRejectionReason,
    );
    assert.equal(outboundEmails, 0, "a refused request must send no email");
    assert.equal(db.writes.length, 0, "a refused request must not be recorded");
    assert.ok(
      !JSON.stringify(payload).includes("123-45-6789"),
      "the SSN was echoed back to the caller",
    );
  });

  it("accepts an ordinary request_consult", async () => {
    stubResend();
    const { payload, db } = await callTool("request_consult", {
      name: "Dana Reed",
      email: "dana@example.com",
      need: "I run a plumbing company and I lose leads because nobody follows up.",
    });

    assert.notEqual(payload.result?.isError, true);
    assert.equal(payload.result?.structuredContent?.status, "pending_review");
    assert.equal(payload.result?.structuredContent?.confirmed, false);
    assert.equal(outboundEmails, 1);
    assert.equal(db.writes.length, 1, "an accepted request is recorded");
  });

  it("rejects request_assessment carrying a payment card and sends nothing", async () => {
    stubResend();
    const { payload } = await callTool("request_assessment", {
      email: "owner@example.com",
      websiteUrl: "example.com",
      businessName: "Acme",
      location: "bill it to 4111 1111 1111 1111",
    });

    assert.equal(payload.result?.isError, true);
    assert.equal(
      payload.result?.content?.[0]?.text,
      sensitiveDataRejectionReason,
    );
    assert.equal(outboundEmails, 0, "a refused request must send no email");
  });
});
