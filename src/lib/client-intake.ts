export type ClientIntakeFieldErrors = Record<string, string>;

export type ClientIntakePayload = {
  businessName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  currentWebsiteStatus: string;
  currentWebsiteUrl: string;
  oneSentenceDescription: string;
  primaryOfferings: string;
  bestFitCustomers: string;
  primaryMarket: string;
  primaryAction: string;
  photosPermission: string;
  goals: string;
  trustProof: string;
  styleNotes: string;
  inspirationSites: string;
  optionalTechnicalNotes: string;
  consent: boolean;
  turnstileToken: string;
};

type RequiredTextField =
  | "businessName"
  | "contactName"
  | "contactEmail"
  | "currentWebsiteStatus"
  | "oneSentenceDescription"
  | "primaryOfferings"
  | "bestFitCustomers"
  | "primaryMarket"
  | "primaryAction";

const requiredTextFields: RequiredTextField[] = [
  "businessName",
  "contactName",
  "contactEmail",
  "currentWebsiteStatus",
  "oneSentenceDescription",
  "primaryOfferings",
  "bestFitCustomers",
  "primaryMarket",
  "primaryAction",
];

const blockedTechnicalTerms = [
  "password",
  "api key",
  "secret",
  "token",
  "registrar login",
  "cloudflare token",
  "google password",
];

export function validateClientIntakePayload(payload: ClientIntakePayload) {
  const errors: ClientIntakeFieldErrors = {};

  for (const field of requiredTextFields) {
    if (!payload[field].trim()) {
      errors[field] = "Please add this so we can prepare before we meet.";
    }
  }

  if (!isValidEmail(payload.contactEmail)) {
    errors.contactEmail = "Enter a valid email address.";
  }

  if (
    payload.currentWebsiteUrl &&
    !isLikelyWebsite(payload.currentWebsiteUrl)
  ) {
    errors.currentWebsiteUrl =
      "Enter a website like example.com or https://example.com.";
  }

  if (!payload.consent) {
    errors.consent =
      "Confirm that Northvalley can use this intake to prepare for the conversation.";
  }

  const combined = [
    payload.optionalTechnicalNotes,
    payload.goals,
    payload.trustProof,
    payload.styleNotes,
  ]
    .join(" ")
    .toLowerCase();

  if (blockedTechnicalTerms.some((term) => combined.includes(term))) {
    errors.optionalTechnicalNotes =
      "Do not include passwords, API keys, access tokens, or account logins in this form.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  };
}

export function normalizeClientIntakeFormData(formData: FormData) {
  const payload: ClientIntakePayload = {
    businessName: formValue(formData, "businessName"),
    contactName: formValue(formData, "contactName"),
    contactEmail: formValue(formData, "contactEmail"),
    phone: formValue(formData, "phone"),
    currentWebsiteStatus: formValue(formData, "currentWebsiteStatus"),
    currentWebsiteUrl: normalizeWebsiteUrl(
      formValue(formData, "currentWebsiteUrl"),
    ),
    oneSentenceDescription: formValue(formData, "oneSentenceDescription"),
    primaryOfferings: formValue(formData, "primaryOfferings"),
    bestFitCustomers: formValue(formData, "bestFitCustomers"),
    primaryMarket: formValue(formData, "primaryMarket"),
    primaryAction: formValue(formData, "primaryAction"),
    photosPermission: formValue(formData, "photosPermission"),
    goals: formValue(formData, "goals"),
    trustProof: formValue(formData, "trustProof"),
    styleNotes: formValue(formData, "styleNotes"),
    inspirationSites: formValue(formData, "inspirationSites"),
    optionalTechnicalNotes: formValue(formData, "optionalTechnicalNotes"),
    consent:
      formData.get("consent") === "on" || formData.get("consent") === "true",
    turnstileToken: formValue(formData, "turnstileToken"),
  };

  return payload;
}

export function buildClientIntakeNotificationText(input: {
  payload: ClientIntakePayload;
  files: Array<{ name: string; size: number; type: string }>;
  submittedAt: string;
}) {
  const { payload, files, submittedAt } = input;

  return [
    "A client submitted the Northvalley pre-meeting website intake.",
    "",
    `Submitted: ${submittedAt}`,
    "",
    "Required meeting-prep facts",
    `Business: ${payload.businessName}`,
    `Primary contact: ${payload.contactName}`,
    `Email: ${payload.contactEmail}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Website status: ${payload.currentWebsiteStatus}`,
    `Current website: ${payload.currentWebsiteUrl || "Not provided"}`,
    `What they do: ${payload.oneSentenceDescription}`,
    `Primary offerings: ${payload.primaryOfferings}`,
    `Best-fit customers: ${payload.bestFitCustomers}`,
    `Primary market: ${payload.primaryMarket}`,
    `Primary website action: ${payload.primaryAction}`,
    "",
    "Optional context",
    `Goals: ${payload.goals || "Not provided"}`,
    `Trust proof: ${payload.trustProof || "Not provided"}`,
    `Style notes: ${payload.styleNotes || "Not provided"}`,
    `Inspiration sites: ${payload.inspirationSites || "Not provided"}`,
    `Photo permission: ${payload.photosPermission || "Not provided"}`,
    `Technical notes: ${payload.optionalTechnicalNotes || "Not provided"}`,
    "",
    "Uploaded files",
    files.length
      ? files
          .map(
            (file, index) =>
              `${index + 1}. ${file.name} (${file.type || "unknown"}, ${file.size} bytes)`,
          )
          .join("\n")
      : "No files uploaded.",
  ].join("\n");
}

export function intakeFileSummary(files: File[]) {
  return files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
  }));
}

export function isAllowedIntakeFile(file: File) {
  return file.type.startsWith("image/") && file.size <= 4 * 1024 * 1024;
}

export function normalizeWebsiteUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isLikelyWebsite(value: string) {
  try {
    const url = new URL(normalizeWebsiteUrl(value));
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)
    );
  } catch {
    return false;
  }
}
