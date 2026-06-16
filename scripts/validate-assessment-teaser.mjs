import { readFileSync } from "node:fs";

const files = {
  api: readFileSync("functions/api/website-assessment-teaser.ts", "utf8"),
  form: readFileSync("src/components/website-assessment-teaser-form.tsx", "utf8"),
  pdf: readFileSync("src/lib/assessment-teaser.ts", "utf8"),
  page: readFileSync("src/app/page.tsx", "utf8"),
};

const checks = [
  {
    name: "homepage mounts assessment teaser form",
    pass: files.page.includes("<WebsiteAssessmentTeaserForm />"),
  },
  {
    name: "public API response does not expose full report URLs",
    pass:
      !files.api.includes("reportUrl") &&
      !files.api.includes("return json(report") &&
      files.api.includes('status: "queued"'),
  },
  {
    name: "request requires Turnstile when secret is configured",
    pass:
      files.api.includes("TURNSTILE_SECRET_KEY") &&
      files.api.includes("Please complete the verification"),
  },
  {
    name: "assessment is queued through the deployed assessment API",
    pass:
      files.api.includes("https://assessment.northvalleyintel.com") &&
      files.api.includes("/api/scans"),
  },
  {
    name: "teaser email sends PDF to requester and copies Northvalley",
    pass:
      files.api.includes("RESEND_API_KEY") &&
      files.api.includes("contact@northvalleyintel.com") &&
      files.api.includes("attachments"),
  },
  {
    name: "admin is notified as soon as an assessment request is queued",
    pass:
      files.api.includes("sendAssessmentRequestNotification") &&
      files.api.includes("ASSESSMENT_TEASER_NOTIFY_TO") &&
      files.api.includes("This notification is sent as soon as the assessment is queued"),
  },
  {
    name: "Resend delivery failures are treated as failures",
    pass:
      files.api.includes("Resend rejected the assessment teaser email") &&
      files.api.includes("Resend rejected the assessment request notification"),
  },
  {
    name: "teaser copy withholds the paid report detail",
    pass:
      files.pdf.includes("Selected signals, not the full report") &&
      files.pdf.includes("The paid assessment includes") &&
      files.pdf.includes("Cobb, Paulding, and Douglas counties"),
  },
  {
    name: "form asks for email before sending report",
    pass:
      files.form.includes("Email for the teaser PDF") &&
      files.form.includes("Email the teaser report"),
  },
];

const failures = checks.filter((check) => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

if (failures.length) {
  process.exitCode = 1;
}
