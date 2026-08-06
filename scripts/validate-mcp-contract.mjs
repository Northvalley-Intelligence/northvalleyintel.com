import { readFileSync } from "node:fs";

/**
 * MCP contract validator.
 *
 * Two modes:
 *
 *   npm run test:mcp-contract
 *     Static contract checks against the source. Cheap, runs in CI.
 *
 *   MCP_CONTRACT_URL=https://northvalleyintel.com/mcp npm run test:mcp-contract
 *     Additionally drives the live endpoint with SEQUENTIAL requests
 *     (initialize, then a separate tools/list, then a separate tools/call).
 *     This is the only way to catch a stateless-handshake regression: an
 *     in-memory client holds one connection open and would pass while
 *     production is broken.
 */

const files = {
  server: readFileSync("src/lib/server/mcp-server.ts", "utf8"),
  endpoint: readFileSync("functions/mcp.ts", "utf8"),
  abuse: readFileSync("src/lib/server/mcp-abuse.ts", "utf8"),
  throttle: readFileSync("src/lib/server/mcp-throttle.ts", "utf8"),
  schema: readFileSync("database/mcp-requests.sql", "utf8"),
  wrangler: readFileSync("wrangler.toml", "utf8"),
  pkg: readFileSync("package.json", "utf8"),
};

const tools = ["list_services", "request_assessment", "request_consult"];
const writeTools = ["request_assessment", "request_consult"];

const checks = [
  {
    name: "the published tool set is exactly the three intended tools",
    pass:
      tools.every((tool) => files.server.includes(`"${tool}"`)) &&
      // A service-area gate would wrongly turn away clients: Northvalley works
      // anywhere in the US.
      !files.server.includes("check_service_area"),
  },
  {
    name: "every tool declares a title and an action-oriented description",
    pass:
      (files.server.match(/title:/g) || []).length >= tools.length &&
      (files.server.match(/description:/g) || []).length >= tools.length &&
      files.server.includes("Call this before request_assessment"),
  },
  {
    name: "all three annotation hints are set explicitly on read and write tools",
    pass:
      /readOnlyHint: true/.test(files.server) &&
      /readOnlyHint: false/.test(files.server) &&
      (files.server.match(/destructiveHint: false/g) || []).length >= 2 &&
      /openWorldHint: false/.test(files.server) &&
      /openWorldHint: true/.test(files.server),
  },
  {
    name: "write tools return a pending status and never a confirmed one",
    pass:
      files.server.includes('PENDING_STATUS = "pending_review"') &&
      files.server.includes("confirmed: false") &&
      !/confirmed:\s*true/.test(files.server) &&
      !/status:\s*["']confirmed["']/.test(files.server),
  },
  {
    name: "request-not-confirmed is stated in the server instructions",
    pass:
      files.server.includes("never confirm") &&
      files.server.includes("pending review") &&
      writeTools.every((tool) => {
        const index = files.server.indexOf(`"${tool}"`);
        return (
          index > -1 &&
          /REQUEST/.test(files.server.slice(index, index + 1200))
        );
      }),
  },
  {
    name: "no tool can return complete assessment report content",
    pass:
      files.server.includes("never returned through this interface") &&
      files.server.includes("never returns assessment findings") &&
      !files.server.includes("reportUrl"),
  },
  {
    name: "the write path is gated and fails closed without the throttle store",
    pass:
      files.abuse.includes("containsBlockedCredentialTerms") &&
      files.abuse.includes("doNotFill") &&
      files.abuse.includes("MCP_SHARED_SECRET") &&
      files.abuse.includes("evaluateThrottle") &&
      /if \(!db\)/.test(files.abuse) &&
      files.abuse.includes("not fully configured"),
  },
  {
    name: "the throttle is durable and its policy is separable from the database",
    pass:
      files.throttle.includes("export function evaluateThrottle") &&
      files.throttle.includes("mcp_requests") &&
      files.schema.includes("create table if not exists mcp_requests") &&
      files.schema.includes("contact_hash"),
  },
  {
    name: "contact details are hashed rather than stored in the clear",
    pass:
      files.throttle.includes("hashIdentifier") &&
      files.throttle.includes("SHA-256") &&
      !files.schema.includes("email text"),
  },
  {
    name: "the endpoint uses the web-standard stateless transport",
    pass:
      files.endpoint.includes("WebStandardStreamableHTTPServerTransport") &&
      files.endpoint.includes("server/webStandardStreamableHttp.js") &&
      // The SDK default transport is built on Node http req/res and does not
      // fit a Pages Function. The word boundary matters: it must not match
      // inside WebStandardStreamableHTTPServerTransport.
      !/\bStreamableHTTPServerTransport\b/.test(files.endpoint) &&
      files.endpoint.includes("sessionIdGenerator: undefined") &&
      files.endpoint.includes("enableJsonResponse: true"),
  },
  {
    name: "the endpoint answers OPTIONS and rejects GET",
    pass:
      files.endpoint.includes("onRequestOptions") &&
      files.endpoint.includes("onRequestGet") &&
      files.endpoint.includes("405"),
  },
  {
    name: "nodejs_compat is enabled so the SDK bundles",
    pass: files.wrangler.includes('compatibility_flags = ["nodejs_compat"]'),
  },
  {
    name: "the MCP SDK is pinned rather than floating on latest",
    pass:
      /"@modelcontextprotocol\/sdk":\s*"\d+\.\d+\.\d+"/.test(files.pkg) &&
      /"zod":\s*"\d+\.\d+\.\d+"/.test(files.pkg),
  },
];

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

let failures = checks.filter((check) => !check.pass).length;

const liveUrl = process.env.MCP_CONTRACT_URL;

if (!liveUrl) {
  console.log(
    "\nSKIP live stateless-handshake check. Set MCP_CONTRACT_URL to the deployed /mcp URL to run it.",
  );
  console.log(
    "Static checks alone do NOT prove the deployed endpoint works. The handshake must be driven live before the endpoint is announced.",
  );
} else {
  failures += await runLiveChecks(liveUrl);
}

if (failures) {
  process.exitCode = 1;
}

async function post(url, body, sessionId) {
  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (sessionId) {
    headers["mcp-session-id"] = sessionId;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    const dataLine = text
      .split("\n")
      .find((line) => line.startsWith("data:"));
    if (dataLine) {
      parsed = JSON.parse(dataLine.slice(5).trim());
    }
  }

  return { response, parsed, text };
}

async function runLiveChecks(url) {
  console.log(`\nLive endpoint: ${url}`);
  let failed = 0;

  const report = (name, pass, detail = "") => {
    console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
    if (!pass) failed += 1;
  };

  const getResponse = await fetch(url, { method: "GET" });
  report("live GET is rejected with 405", getResponse.status === 405, `got ${getResponse.status}`);

  const init = await post(url, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "northvalley-contract-validator", version: "1.0.0" },
    },
  });
  report(
    "live initialize succeeds",
    init.response.ok && Boolean(init.parsed?.result),
    `status ${init.response.status}`,
  );

  const sessionId = init.response.headers.get("mcp-session-id") || undefined;

  // Deliberately a separate HTTP request. In production this lands on a fresh
  // isolate that never saw the initialize above.
  const list = await post(
    url,
    { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
    sessionId,
  );
  const listed = (list.parsed?.result?.tools || []).map((tool) => tool.name);
  report(
    "live tools/list works on a separate request (stateless handshake)",
    list.response.ok && listed.length > 0,
    listed.length ? listed.join(", ") : list.text.slice(0, 120),
  );
  report(
    "live tool set matches the published contract",
    tools.every((tool) => listed.includes(tool)) && listed.length === tools.length,
  );

  for (const tool of list.parsed?.result?.tools || []) {
    const a = tool.annotations || {};
    report(
      `live annotations complete for ${tool.name}`,
      typeof a.readOnlyHint === "boolean" &&
        typeof a.destructiveHint === "boolean" &&
        typeof a.openWorldHint === "boolean",
      JSON.stringify(a),
    );
  }

  const call = await post(
    url,
    {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "list_services", arguments: {} },
    },
    sessionId,
  );
  const callText = JSON.stringify(call.parsed?.result || {});
  report(
    "live tools/call works on a separate request",
    call.response.ok && callText.includes("Northvalley"),
    `status ${call.response.status}`,
  );

  const badWrite = await post(
    url,
    {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: { name: "request_consult", arguments: { name: "contract test" } },
    },
    sessionId,
  );
  const badText = JSON.stringify(badWrite.parsed || {});
  report(
    "live write path fails closed on an incomplete payload",
    badText.includes("error") || badText.includes("isError"),
  );

  return failed;
}
