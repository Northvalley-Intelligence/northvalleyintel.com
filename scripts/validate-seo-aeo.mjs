import { readFileSync } from "node:fs";

const files = {
  layout: readFileSync("src/app/layout.tsx", "utf8"),
  page: readFileSync("src/app/page.tsx", "utf8"),
  site: readFileSync("src/lib/site.ts", "utf8"),
  source: readFileSync("public/source-website-assessment.json", "utf8"),
  llms: readFileSync("public/llms.txt", "utf8"),
  robots: readFileSync("src/app/robots.ts", "utf8"),
  sitemap: readFileSync("src/app/sitemap.ts", "utf8"),
};

const source = JSON.parse(files.source);

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
];

const failures = checks.filter((check) => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

if (failures.length) {
  process.exitCode = 1;
}
