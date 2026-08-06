import { readFileSync } from "node:fs";

/**
 * Directory submission readiness.
 *
 *   npm run test:directory
 *     Static checks: manifest shape, privacy completeness, challenge route.
 *
 *   MCP_CONTRACT_URL=https://northvalleyintel.com/mcp npm run test:directory
 *     Additionally compares the manifest's annotations against the LIVE server.
 *     Directory scans do this comparison themselves, and a mismatch makes them
 *     skip the justifications without telling you.
 */

const manifest = JSON.parse(
  readFileSync("deploy/chatgpt-app-submission.json", "utf8"),
);
const legal = readFileSync("src/lib/legal.ts", "utf8");
const middleware = readFileSync("functions/_middleware.ts", "utf8");
const site = readFileSync("src/lib/site.ts", "utf8");

const hints = ["readOnlyHint", "destructiveHint", "openWorldHint"];
const toolNames = Object.keys(manifest.tools || {});

const checks = [
  {
    name: "manifest declares the apps-sdk schema URL the portal accepts",
    pass:
      manifest.$schema ===
        "https://developers.openai.com/apps-sdk/schemas/chatgpt-app-submission.v1.json" &&
      manifest.schema_version === 1,
  },
  {
    name: "app_info is complete and within length limits",
    pass:
      Boolean(manifest.app_info?.display_name) &&
      Boolean(manifest.app_info?.subtitle) &&
      manifest.app_info.subtitle.length <= 30 &&
      Boolean(manifest.app_info?.description) &&
      manifest.app_info.description.length <= 4000 &&
      Boolean(manifest.app_info?.category),
  },
  {
    name: "every tool sets all three annotation hints explicitly",
    pass:
      toolNames.length > 0 &&
      toolNames.every((tool) =>
        hints.every(
          (hint) =>
            typeof manifest.tools[tool].annotations?.[hint] === "boolean",
        ),
      ),
  },
  {
    name: "every hint has a justification string",
    pass: toolNames.every((tool) =>
      hints.every(
        (hint) =>
          typeof manifest.tools[tool].justifications?.[hint] === "string" &&
          manifest.tools[tool].justifications[hint].length > 20,
      ),
    ),
  },
  {
    name: "at least five test cases and three negative test cases",
    pass:
      (manifest.test_cases || []).length >= 5 &&
      (manifest.negative_test_cases || []).length >= 3,
  },
  {
    name: "test cases are fully formed",
    pass: [
      ...(manifest.test_cases || []),
      ...(manifest.negative_test_cases || []),
    ].every(
      (testCase) =>
        testCase.description &&
        testCase.user_prompt &&
        Array.isArray(testCase.tools_triggered) &&
        testCase.expected_output,
    ),
  },
  {
    name: "the listing is framed as lead capture, not commerce",
    pass:
      /no payment is collected/i.test(manifest.app_info.description) &&
      /nothing is scheduled, confirmed, purchased, or committed/i.test(
        manifest.app_info.description,
      ),
  },
  {
    name: "negative cases cover confirmation, paid content, and credentials",
    pass:
      (manifest.negative_test_cases || []).some((testCase) =>
        /not confirmed|not booked|never confirm/i.test(
          testCase.expected_output,
        ),
      ) &&
      (manifest.negative_test_cases || []).some((testCase) =>
        /paid engagement|no findings/i.test(testCase.expected_output),
      ) &&
      (manifest.negative_test_cases || []).some((testCase) =>
        /credential|password/i.test(testCase.expected_output),
      ),
  },
  {
    name: "privacy policy covers every element the directories require",
    pass:
      /What we collect/i.test(legal) &&
      /Why we use it/i.test(legal) &&
      /Who receives it/i.test(legal) &&
      /How long we keep it/i.test(legal) &&
      /hello@northvalleyintel\.com/.test(legal) &&
      // Retention needs actual timelines, not a vague promise.
      /\b\d+\s*(days|months)\b/i.test(legal),
  },
  {
    name: "privacy policy names the actual third-party recipients",
    pass:
      /Cloudflare/.test(legal) && /Resend/.test(legal) && /assessment\./.test(legal),
  },
  {
    name: "terms state that a request is not a commitment",
    pass:
      /Requests are requests/i.test(legal) &&
      /does not create a contract/i.test(legal) &&
      /No payment is collected/i.test(legal),
  },
  {
    name: "the domain challenge is served from middleware and returns a bare token",
    pass:
      middleware.includes("/.well-known/openai-apps-challenge") &&
      middleware.includes("OPENAI_APPS_CHALLENGE_TOKEN") &&
      middleware.includes('"content-type": "text/plain"') &&
      !middleware.includes("JSON.stringify(token"),
  },
  {
    name: "privacy and terms are discoverable in the sitemap",
    pass: site.includes("/privacy") && site.includes("/terms"),
  },
];

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

let failures = checks.filter((check) => !check.pass).length;

const liveUrl = process.env.MCP_CONTRACT_URL;

if (!liveUrl) {
  console.log(
    "\nSKIP live annotation comparison. Set MCP_CONTRACT_URL to compare the manifest against the deployed server.",
  );
} else {
  failures += await compareWithLiveServer(liveUrl);
}

if (failures) {
  process.exitCode = 1;
}

async function compareWithLiveServer(url) {
  let failed = 0;
  const report = (name, pass, detail = "") => {
    console.log(
      `${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`,
    );
    if (!pass) failed += 1;
  };

  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };

  const parse = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      const line = text.split("\n").find((l) => l.startsWith("data:"));
      return line ? JSON.parse(line.slice(5).trim()) : null;
    }
  };

  await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "directory-validator", version: "1.0.0" },
      },
    }),
  });

  const listed = await parse(
    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      }),
    }),
  );

  const liveTools = listed?.result?.tools || [];
  console.log(`\nLive server: ${url}`);

  report(
    "manifest tool set matches the live server exactly",
    liveTools.length === toolNames.length &&
      liveTools.every((tool) => toolNames.includes(tool.name)),
    `live=[${liveTools.map((t) => t.name).join(", ")}]`,
  );

  for (const tool of liveTools) {
    const declared = manifest.tools[tool.name]?.annotations;
    const live = tool.annotations || {};
    if (!declared) continue;
    report(
      `annotations match for ${tool.name}`,
      hints.every((hint) => declared[hint] === live[hint]),
      `manifest=${JSON.stringify(declared)} live=${JSON.stringify(
        hints.reduce((acc, h) => ({ ...acc, [h]: live[h] }), {}),
      )}`,
    );
  }

  return failed;
}
