import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { buildMcpServer } from "../src/lib/server/mcp-server";
import { jsonResponse, type ServerEnv } from "../src/lib/server/notify";

/**
 * The Northvalley agent-native MCP endpoint.
 *
 * Uses WebStandardStreamableHTTPServerTransport rather than the SDK default,
 * which is built on Node http req/res. A Cloudflare Pages Function receives a
 * Web Request and returns a Web Response, which is exactly what the
 * web-standard transport targets.
 *
 * Stateless: a fresh server and transport are built per request. A real client
 * sends initialize and tools/call as separate HTTP requests that land on
 * different isolates, so nothing may be carried between them in memory. An
 * in-memory test uses one persistent connection and cannot detect a regression
 * here — this has to be exercised against the deployed endpoint.
 */

type FunctionContext = {
  request: Request;
  env: ServerEnv;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, mcp-session-id, mcp-protocol-version",
  "access-control-expose-headers": "mcp-session-id",
  "access-control-max-age": "86400",
};

export async function onRequestPost({ request, env }: FunctionContext) {
  const clientIp = request.headers.get("cf-connecting-ip") || "unknown";

  const server = buildMcpServer(env, clientIp);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);

    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.warn("mcp_request_failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return jsonResponse(
      {
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error." },
        id: null,
      },
      500,
    );
  }
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function onRequestGet() {
  return jsonResponse(
    { error: "Method not allowed. This MCP endpoint accepts POST." },
    405,
  );
}
