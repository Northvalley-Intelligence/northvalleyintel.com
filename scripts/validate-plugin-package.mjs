import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Plugin package validator (handoff 04, 2026-09-30).
 *
 * OpenAI's current submission portal (platform.openai.com/plugins) accepts a
 * ZIP of this "Agent Plugins" package (plugin.json + mcp.json + skills/ +
 * assets/, schema hosted at agent-plugins.org) — see
 * streams/complimentary-report-horizonpetwastesolutions-com/attachments/
 * skill-update-notes-codex-plugins.md (read 2026-09-30) and the reference
 * implementation this package was copied from:
 * horizonpetwastesolutions.com's plugin/ + tests/codex-plugin.test.ts
 * (ACCEPTED by OpenAI 2026-09-30 21:46, after 5 portal rounds).
 *
 * This is a STATIC packaging check: every path a manifest references must
 * resolve on disk, the declared MCP URL must match the live business URL,
 * and the category must be one of the documented Title-Case dashboard
 * titles. It does not grade prose like OpenAI's reviewers do — pair it with
 * `npm run test:mcp-contract` (MCP_CONTRACT_URL=... for the live mode) to
 * check the live server's actual tool behavior and annotations.
 *
 *   npm run test:plugin-package
 *     Static checks only. Cheap, runs in CI.
 *
 *   MCP_CONTRACT_URL=https://northvalleyintel.com/mcp npm run test:plugin-package
 *     Additionally confirms the live server's tool set matches the set this
 *     package's SKILL.md documents, so a renamed/added/removed tool fails
 *     here instead of at the next OpenAI review (the Horizon submission was
 *     rejected mid-round for exactly this: a renamed tool the package text
 *     still called by its old name).
 */

const PLUGIN_ROOT = path.resolve(process.cwd(), "plugin");

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(PLUGIN_ROOT, relPath), "utf8"));
}

function resolveRelative(relPath) {
  if (!relPath.startsWith("./")) {
    throw new Error(`${relPath} must start with "./"`);
  }
  return path.join(PLUGIN_ROOT, relPath.slice(2));
}

// Title-Case category titles documented at
// developers.openai.com/plugins/deploy/submission-errors (read 2026-09-30,
// via board handoff 62). A category outside this set is rejected with
// "Select a valid category." The "couldn't confirm the selected category"
// banner is a separate, non-blocking WARNING on the same page — submit
// anyway if this check passes.
const VALID_CATEGORIES = [
  "Productivity",
  "Creativity",
  "Developer Tools",
  "Business & Operations",
  "Data & Analytics",
  "Communication",
  "Education & Research",
  "Security",
  "Finance",
  "Healthcare",
  "Travel",
  "Entertainment",
  "Other",
];

const manifest = readJson("plugin.json");
const mcpManifest = readJson("mcp.json");
const liveToolNames = ["list_services", "request_assessment", "request_consult"];

const checks = [
  {
    name: "plugin.json carries the portable Agent Plugins $schema",
    pass: manifest.$schema === "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  },
  {
    // r4 (2026-10-02): the portal refused to accept a plugin ZIP update against the old
    // "app-6a73fe0b6b2c8191a31801bfab5599f2" entry — that entry wraps the pre-plugin "MCP app"
    // (v1.0.2, rejected Sep 19, never published), which cannot take a plugin ZIP until it is
    // published first. This package instead goes in as a FRESH plugin entry (as Horizon did),
    // so the name reverts to the kebab-case plugin name, not the legacy app id.
    name: "name is kebab-case and matches the fresh plugin entry name (northvalley-intelligence)",
    pass:
      manifest.name === "northvalley-intelligence" &&
      /^[a-z0-9]+(-[a-z0-9]+)*$/.test(manifest.name),
  },
  {
    name: "version is semantic versioning and matches the live server (1.0.5)",
    pass: manifest.version === "1.0.5" && /^\d+\.\d+\.\d+$/.test(manifest.version),
  },
  {
    name: "has a non-empty description",
    pass: typeof manifest.description === "string" && manifest.description.length > 0,
  },
  {
    name: "carries a root-level skills pointer that resolves to a real directory",
    pass:
      manifest.skills === "./skills/" &&
      existsSync(resolveRelative(manifest.skills.slice(0, -1))),
  },
  {
    name: "extensions.com.openai.interface carries the required listing fields",
    pass: (() => {
      const iface = manifest.extensions?.["com.openai"]?.interface;
      if (!iface) return false;
      const required = [
        "displayName",
        "shortDescription",
        "longDescription",
        "developerName",
        "category",
        "supportURL",
      ];
      return (
        required.every((field) => typeof iface[field] === "string" && iface[field].length > 0) &&
        Array.isArray(iface.capabilities) &&
        iface.capabilities.length > 0
      );
    })(),
  },
  {
    name: "category is a member of the documented Title-Case dashboard titles",
    pass: VALID_CATEGORIES.includes(manifest.extensions?.["com.openai"]?.interface?.category),
  },
  {
    name: "defaultPrompt has at most 3 entries of at most 128 characters each",
    pass: (() => {
      const prompts = manifest.extensions?.["com.openai"]?.interface?.defaultPrompt || [];
      return prompts.length <= 3 && prompts.every((prompt) => prompt.length <= 128);
    })(),
  },
  {
    // Portal message (Ferosh 2026-10-01 08:33): "Subtitle must be 30 characters or fewer."
    name: "shortDescription (the portal's \"subtitle\") is 30 characters or fewer",
    pass: (() => {
      const shortDescription = manifest.extensions?.["com.openai"]?.interface?.shortDescription;
      return typeof shortDescription === "string" && shortDescription.length <= 30;
    })(),
  },
  {
    // Portal message (Ferosh 2026-10-01 08:33): "Remove pricing, subscription offers, and
    // temporary promotions from the description." Checked across every listing text field
    // this package carries plus the skill's own description/body — a pricing word repeated
    // anywhere in the listing surface is the same violation.
    name: "no pricing/promotion words (free, paid, discount, promo, trial, subscription) in any listing text",
    pass: (() => {
      const BANNED = ["free", "paid", "discount", "promo", "trial", "subscription"];
      const iface = manifest.extensions?.["com.openai"]?.interface || {};
      const texts = [
        manifest.description,
        iface.shortDescription,
        iface.longDescription,
        ...(iface.defaultPrompt || []),
      ];
      const skillPath = path.join(PLUGIN_ROOT, "skills", "northvalley-intelligence", "SKILL.md");
      if (existsSync(skillPath)) {
        texts.push(readFileSync(skillPath, "utf8"));
      }
      const hit = (text) =>
        typeof text === "string" && BANNED.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
      return !texts.some(hit);
    })(),
  },
  {
    name: "websiteURL / supportURL / privacyPolicyURL / termsOfServiceURL are HTTPS URLs on the live site",
    pass: (() => {
      const iface = manifest.extensions?.["com.openai"]?.interface;
      if (!iface) return false;
      const urls = [iface.websiteURL, iface.supportURL, iface.privacyPolicyURL, iface.termsOfServiceURL];
      return (
        urls.every((url) => typeof url === "string" && url.startsWith("https://northvalleyintel.com")) &&
        iface.privacyPolicyURL === "https://northvalleyintel.com/privacy" &&
        iface.termsOfServiceURL === "https://northvalleyintel.com/terms"
      );
    })(),
  },
  {
    name: "developerName and root author are Northvalley (the verified submitting org), not a client",
    pass:
      manifest.extensions?.["com.openai"]?.interface?.developerName === "Northvalley Intelligence" &&
      manifest.author?.name === "Northvalley Intelligence",
  },
  {
    name: "composerIcon and logo are './'-relative and resolve to real files under plugin/assets/",
    pass: (() => {
      const iface = manifest.extensions?.["com.openai"]?.interface;
      if (!iface) return false;
      return [iface.composerIcon, iface.logo].every((assetPath) =>
        existsSync(resolveRelative(assetPath)),
      );
    })(),
  },
  {
    name: "screenshots (if any) all resolve to real files",
    pass: (manifest.extensions?.["com.openai"]?.interface?.screenshots || []).every((shot) =>
      existsSync(resolveRelative(shot)),
    ),
  },
  {
    name: "mcp.json carries the portable Agent Plugins mcp $schema",
    pass: mcpManifest.$schema === "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  },
  {
    name: "mcp.json declares exactly one streamable-http server pointing at the live /mcp endpoint",
    pass: (() => {
      const servers = Object.values(mcpManifest.mcpServers || {});
      return (
        servers.length === 1 &&
        servers[0].type === "streamable-http" &&
        servers[0].url === "https://northvalleyintel.com/mcp"
      );
    })(),
  },
  {
    name: "the mcp.json server key matches the plugin.json name",
    pass: Object.keys(mcpManifest.mcpServers || {}).join(",") === manifest.name,
  },
  {
    name: "plugin/skills/northvalley-intelligence/SKILL.md exists with required frontmatter",
    pass: (() => {
      const skillPath = path.join(PLUGIN_ROOT, "skills", "northvalley-intelligence", "SKILL.md");
      if (!existsSync(skillPath)) return false;
      const raw = readFileSync(skillPath, "utf8");
      const match = raw.match(/^---\n([\s\S]*?)\n---/);
      if (!match) return false;
      const frontmatter = match[1];
      const hasName = /^name:\s*northvalley-intelligence\s*$/m.test(frontmatter);
      const descLine = frontmatter.match(/^description:\s*(.+)$/m);
      return hasName && Boolean(descLine) && descLine[1].length > 0;
    })(),
  },
  {
    name: "SKILL.md names all three live tools somewhere in the body",
    pass: (() => {
      const skillPath = path.join(PLUGIN_ROOT, "skills", "northvalley-intelligence", "SKILL.md");
      if (!existsSync(skillPath)) return false;
      const raw = readFileSync(skillPath, "utf8");
      return liveToolNames.every((tool) => raw.includes(tool));
    })(),
  },
  {
    name: "plugin.json, mcp.json, assets/, and skills/ all exist at the plugin root",
    pass:
      existsSync(path.join(PLUGIN_ROOT, "plugin.json")) &&
      existsSync(path.join(PLUGIN_ROOT, "mcp.json")) &&
      existsSync(path.join(PLUGIN_ROOT, "assets")) &&
      existsSync(path.join(PLUGIN_ROOT, "skills")),
  },
];

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

let failures = checks.filter((check) => !check.pass).length;

const liveUrl = process.env.MCP_CONTRACT_URL;

if (!liveUrl) {
  console.log(
    "\nSKIP live tool-set comparison. Set MCP_CONTRACT_URL to the deployed /mcp URL to compare against the live server.",
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
    console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
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
      const line = text.split("\n").find((entry) => entry.startsWith("data:"));
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
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "plugin-package-validator", version: "1.0.0" } },
    }),
  });

  const listed = await parse(
    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }),
    }),
  );

  const live = (listed?.result?.tools || []).map((tool) => tool.name);
  console.log(`\nLive server: ${url}`);

  report(
    "SKILL.md's documented tool set matches the live server exactly (no silent rename/add/remove)",
    live.length === liveToolNames.length && liveToolNames.every((tool) => live.includes(tool)),
    `live=[${live.join(", ")}]`,
  );

  return failed;
}
