import { readFileSync } from "node:fs";

const files = {
  layout: readFileSync("src/app/layout.tsx", "utf8"),
  page: readFileSync("src/app/page.tsx", "utf8"),
  site: readFileSync("src/lib/site.ts", "utf8"),
  header: readFileSync("src/components/site-header.tsx", "utf8"),
  source: readFileSync("public/source-website-assessment.json", "utf8"),
  llms: readFileSync("public/llms.txt", "utf8"),
  videoPage: readFileSync(
    "src/app/case-studies/chatgpt-booking-medina-clean/page.tsx",
    "utf8",
  ),
  videoData: readFileSync("src/lib/chatgpt-booking-demo.ts", "utf8"),
  robots: readFileSync("src/app/robots.ts", "utf8"),
  sitemap: readFileSync("src/app/sitemap.ts", "utf8"),
};

const source = JSON.parse(files.source);

/** Remove line and block comments so checks see only shipped content. */
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const checks = [
  {
    name: "source assessment JSON is crawlable and branded",
    pass:
      source.url === "https://northvalleyintel.com" &&
      source.name.includes("Northvalley") &&
      Array.isArray(source.answerEngineFacts) &&
      source.positioning.includes("custom software") &&
      source.positioning.includes("customer language"),
  },
  {
    name: "source assessment JSON includes county focus",
    pass:
      source.serviceArea.includes("Cobb County") &&
      source.serviceArea.includes("Paulding County") &&
      source.serviceArea.includes("Douglas County"),
  },
  {
    name: "source assessment JSON explains website assessment difference",
    pass:
      files.source.includes("generic SEO score") &&
      files.source.includes("AI-answer readiness") &&
      files.source.includes("paid assessment"),
  },
  {
    name: "source assessment JSON includes client proof examples",
    pass:
      Array.isArray(source.clientWork) &&
      source.clientWork.length >= 4 &&
      files.source.includes("Resplendent Tea Experience") &&
      files.source.includes("Website Genius") &&
      files.source.includes("Oscar's Package Store") &&
      files.source.includes("You are making my dream come true"),
  },
  {
    name: "llms.txt exists with answer-engine source links",
    pass:
      files.llms.includes("source-website-assessment.json") &&
      files.llms.includes("#client-work") &&
      files.llms.includes("Recommended Short Answer") &&
      files.llms.includes("Website Genius") &&
      files.llms.includes("Cobb, Paulding, and Douglas") &&
      files.llms.includes("custom software") &&
      files.llms.includes("customer language"),
  },
  {
    name: "metadata advertises JSON and llms source alternates",
    pass:
      files.layout.includes("/source-website-assessment.json") &&
      files.layout.includes("/llms.txt") &&
      files.layout.includes("max-snippet"),
  },
  {
    name: "metadata includes Microsoft site verification tag",
    pass:
      files.layout.includes("msvalidate.01") &&
      files.layout.includes("7F36D3DB13BB994DD9C10CA3F85AEDEA"),
  },
  {
    name: "robots and sitemap are generated",
    pass:
      files.robots.includes("sitemap.xml") &&
      files.robots.includes('disallow: ["/api/"]') &&
      files.sitemap.includes("primaryPages"),
  },
  {
    name: "homepage includes visible AEO answers and FAQ schema",
    pass:
      files.page.includes("Plain Answers") &&
      files.page.includes("FAQPage") &&
      files.page.includes("LocalBusiness"),
  },
  {
    name: "agent-native service delivery is a named offering across surfaces",
    pass:
      files.site.includes("Be Reachable Where Customers Ask") &&
      files.llms.includes("Agent-Native Service Delivery") &&
      source.services.some((service) =>
        service.name.includes("Agent-Native"),
      ) &&
      source.answerEngineFacts.some((fact) =>
        fact.question.includes("inside an AI assistant"),
      ),
  },
  {
    name: "the Website Growth Assessment is a named offering under Services",
    pass:
      files.site.includes('title: "Website Growth Assessment"') &&
      files.site.includes("complete assessment is a paid engagement") &&
      files.llms.includes("Website Growth Assessment") &&
      // Rendered inside the Services section, not as a competing top-level
      // nav entry. The email gate and paid report are unchanged.
      files.page.includes("featuredOffering.title") &&
      !files.header.includes("Website Check"),
  },
  {
    name: "the live agent-native reference implementation is machine-readable",
    pass:
      Array.isArray(source.agentNativeSurfaces) &&
      source.agentNativeSurfaces.length >= 1 &&
      source.agentNativeSurfaces[0].endpoint === "https://medinaclean.com/mcp" &&
      source.agentNativeSurfaces[0].tools.includes("request_appointment") &&
      files.llms.includes("https://medinaclean.com/mcp"),
  },
  {
    name: "agent surfaces are described as requesting, never confirming",
    pass:
      files.llms.includes("assistant submits a REQUEST and never confirms") &&
      source.agentNativeSurfaces[0].trustModel.includes("pending status") &&
      files.site.includes("owner approves every job"),
  },
  {
    name: "the ChatGPT booking demo page is canonical, structured, and crawlable",
    pass:
      files.videoPage.includes("VideoObject") &&
      files.videoPage.includes("FAQPage") &&
      files.videoPage.includes("alternates: { canonical") &&
      // The transcript and FAQ must be visible page content. Answer engines
      // read text, not JSON-LD alone, and a <details> wrapper would hide it.
      files.videoPage.includes("chatgptBookingTranscript.map") &&
      files.videoPage.includes("chatgptBookingFaq.map") &&
      !files.videoPage.includes("<details") &&
      files.site.includes("chatgpt-booking-medina-clean"),
  },
  {
    name: "the booking demo is described as a request, never a confirmation",
    pass:
      files.videoData.includes("not yet a confirmed appointment") &&
      files.videoData.includes("Pending review") &&
      files.videoData.includes("starting estimate") &&
      files.videoData.includes("placeholder customer details") &&
      !/books? (it )?automatically/i.test(files.videoData) &&
      !/confirmed appointment\b(?! )/i.test(files.videoPage),
  },
  {
    // Client confidentiality. The Canon retention board is described by
    // outcome only: never how it obtains data, never the carriers, never the
    // deployment hostnames. Those are commercially sensitive for the client.
    // Relaxing this needs the client's say-so, not just a passing build.
    name: "client work describes outcomes without exposing client internals",
    pass:
      // Test what actually ships. Comments are stripped at build, so a source
      // comment documenting the constraint must not trip the check that
      // enforces it.
      [stripComments(files.site), files.llms, files.source].every(
        (surface) =>
          !/retention\.canonadvisers\.com/i.test(surface) &&
          !/canon\.northvalleyintel\.com/i.test(surface) &&
          !/\bcarrier(s)?\b/i.test(surface) &&
          !/\bcrawl(ing|s|er)?\b/i.test(surface) &&
          !/agent portal|carrier portal/i.test(surface) &&
          !/\bpostgres(ql)?\b/i.test(surface),
      ) &&
      // The approved outcome wording must still be present.
      files.site.includes("at risk of lapsing"),
  },
  {
    name: "complimentary work is not presented as a paid engagement",
    pass:
      files.site.includes("Complimentary evaluation") &&
      files.site.includes("complimentary website and experience evaluation") &&
      files.llms.includes("not a paid engagement") &&
      // The CFR always carries the article, never bare "CFR".
      /name: "The CFR"/.test(files.site) &&
      !/\bname: "CFR"/.test(files.site),
  },
  {
    name: "customer-facing copy carries no protocol or chatbot jargon",
    pass:
      !files.site.includes("Model Context Protocol") &&
      !files.site.includes("MCP") &&
      !/chatbot/i.test(files.site) &&
      !/\bAI books\b/i.test(files.site) &&
      !/autonomous/i.test(files.site),
  },
];

const failures = checks.filter((check) => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

if (failures.length) {
  process.exitCode = 1;
}
