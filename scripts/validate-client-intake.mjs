import { readFileSync } from "node:fs";

const files = {
  page: readFileSync("src/app/intake/page.tsx", "utf8"),
  form: readFileSync("src/components/client-intake-form.tsx", "utf8"),
  api: readFileSync("functions/api/client-intake.ts", "utf8"),
  lib: readFileSync("src/lib/client-intake.ts", "utf8"),
  middleware: readFileSync("functions/_middleware.ts", "utf8"),
};

const requiredFields = [
  "businessName",
  "contactName",
  "contactEmail",
  "currentWebsiteStatus",
  "oneSentenceDescription",
  "primaryOfferings",
  "bestFitCustomers",
  "primaryMarket",
  "primaryAction",
  "consent",
];

const checks = [
  {
    name: "intake page renders the real form",
    pass:
      files.page.includes("<ClientIntakeForm />") &&
      files.page.includes("Share the basics before we meet"),
  },
  {
    name: "intake page is not indexed as a public marketing page",
    pass:
      files.page.includes("index: false") &&
      files.page.includes("follow: false"),
  },
  {
    name: "small mandatory field set is enforced",
    pass: requiredFields.every(
      (field) => files.form.includes(field) && files.lib.includes(field),
    ),
  },
  {
    name: "form is visible first and explains meeting-prep purpose",
    pass:
      files.page.includes("lg:grid-cols-[1fr_0.36fr]") &&
      files.page.includes("This saves time in the first conversation") &&
      files.page.includes("review the details before the meeting"),
  },
  {
    name: "client-side validation runs on blur without native URL blocking",
    pass:
      files.form.includes("noValidate") &&
      files.form.includes("validateFieldOnBlur") &&
      files.form.includes('inputMode="url"') &&
      !files.form.includes('type="url"') &&
      files.lib.includes("normalizeWebsiteUrl") &&
      files.lib.includes("https://${trimmed}"),
  },
  {
    name: "optional technical section is collapsed and warns against secrets",
    pass:
      files.form.includes("<details") &&
      files.form.includes("Optional technical details") &&
      files.form.includes("Do not enter passwords") &&
      files.lib.includes("api key") &&
      files.lib.includes("cloudflare token"),
  },
  {
    name: "photo upload accepts up to five images",
    pass:
      files.form.includes('name="photos"') &&
      files.form.includes("multiple") &&
      files.form.includes("Choose up to 5 photos") &&
      files.api.includes("const maxFiles = 5") &&
      files.lib.includes('file.type.startsWith("image/")'),
  },
  {
    name: "submission endpoint sends privately and fails closed",
    pass:
      files.api.includes("RESEND_API_KEY") &&
      files.api.includes("CLIENT_INTAKE_NOTIFY_TO") &&
      files.api.includes("reply_to: payload.contactEmail") &&
      files.api.includes("not fully configured yet") &&
      files.api.includes("review them before we meet"),
  },
  {
    name: "Turnstile verification is honored when configured",
    pass:
      files.api.includes("TURNSTILE_SECRET_KEY") &&
      files.api.includes("Please complete the verification"),
  },
  {
    name: "intake subdomain root redirects to form route",
    pass:
      files.middleware.includes("intake.northvalleyintel.com") &&
      files.middleware.includes('url.pathname = "/intake"'),
  },
];

const failures = checks.filter((check) => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
}

if (failures.length) {
  process.exitCode = 1;
}
