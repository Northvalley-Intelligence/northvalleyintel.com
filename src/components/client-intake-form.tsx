"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";

import {
  normalizeClientIntakeFormData,
  normalizeWebsiteUrl,
  validateClientIntakePayload,
  type ClientIntakeFieldErrors,
  type ClientIntakePayload,
} from "@/lib/client-intake";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

type SubmitStatus = "idle" | "submitting" | "sent" | "error";
type FieldName = keyof ClientIntakePayload | "photos";

const websiteStatusOptions = [
  "We already have a website",
  "We have a domain but no real website",
  "We are starting fresh",
  "Not sure",
];

const primaryActionOptions = [
  "Call us",
  "Request an estimate",
  "Book a consultation",
  "Send a message",
  "Visit the store or location",
];

const orderedFieldNames: FieldName[] = [
  "businessName",
  "contactName",
  "contactEmail",
  "phone",
  "currentWebsiteStatus",
  "currentWebsiteUrl",
  "oneSentenceDescription",
  "primaryOfferings",
  "bestFitCustomers",
  "primaryMarket",
  "primaryAction",
  "photos",
  "trustProof",
  "photosPermission",
  "goals",
  "styleNotes",
  "inspirationSites",
  "optionalTechnicalNotes",
  "consent",
];

export function ClientIntakeForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ClientIntakeFieldErrors>({});
  const [turnstileSiteKey, setTurnstileSiteKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef("");

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      const response = await fetch("/api/workflow-chat-config", {
        headers: { accept: "application/json" },
      });
      const config = (await response.json().catch(() => ({}))) as {
        turnstileSiteKey?: string;
      };

      if (!cancelled && config.turnstileSiteKey) {
        setTurnstileSiteKey(config.turnstileSiteKey);
      }
    }

    loadConfig().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) {
      return;
    }

    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const renderWidget = () => {
      if (
        !window.turnstile ||
        !turnstileRef.current ||
        turnstileWidgetId.current
      ) {
        return;
      }

      turnstileWidgetId.current = window.turnstile.render(
        turnstileRef.current,
        {
          sitekey: turnstileSiteKey,
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        },
      );
    };

    const interval = window.setInterval(renderWidget, 250);
    renderWidget();

    return () => window.clearInterval(interval);
  }, [turnstileSiteKey]);

  function getCurrentValidationErrors(): ClientIntakeFieldErrors {
    if (!formRef.current) {
      return {};
    }

    const formData = new FormData(formRef.current);
    const payload = normalizeClientIntakeFormData(formData);
    const validation = validateClientIntakePayload(payload);
    const files = formData
      .getAll("photos")
      .filter((value) => value instanceof File);

    if (files.length > 5) {
      validation.errors.photos = "Choose up to 5 photos.";
    }

    return validation.errors;
  }

  function validateFields(fieldNames: FieldName[]) {
    const validationErrors = getCurrentValidationErrors();

    setErrors((current) => {
      const next = { ...current };

      for (const fieldName of fieldNames) {
        if (validationErrors[fieldName]) {
          next[fieldName] = validationErrors[fieldName];
        } else {
          delete next[fieldName];
        }
      }

      return next;
    });

    return fieldNames.every((fieldName) => !validationErrors[fieldName]);
  }

  function validateFieldOnBlur(
    event: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const fieldName = event.currentTarget.name as FieldName;
    const isValid = validateFields([fieldName]);

    if (
      fieldName === "currentWebsiteUrl" &&
      isValid &&
      event.currentTarget instanceof HTMLInputElement &&
      event.currentTarget.value.trim()
    ) {
      event.currentTarget.value = normalizeWebsiteUrl(
        event.currentTarget.value,
      );
    }
  }

  function focusFirstError(fieldErrors: ClientIntakeFieldErrors) {
    const firstField = orderedFieldNames.find(
      (fieldName) => fieldErrors[fieldName],
    );

    if (!firstField || !formRef.current) {
      return;
    }

    const target = formRef.current.querySelector<HTMLElement>(
      `[name="${firstField}"]`,
    );
    const details = target?.closest("details");

    if (details instanceof HTMLDetailsElement) {
      details.open = true;
    }

    requestAnimationFrame(() => {
      target?.focus();
      target?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("turnstileToken", turnstileToken);
    const fieldErrors = getCurrentValidationErrors();

    try {
      const files = formData
        .getAll("photos")
        .filter((value) => value instanceof File);
      if (files.length > 5) {
        fieldErrors.photos = "Choose up to 5 photos.";
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        setStatus("error");
        setMessage("Please fix the highlighted fields before sending.");
        focusFirstError(fieldErrors);
        return;
      }

      setStatus("submitting");
      setErrors({});

      const response = await fetch("/api/client-intake", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        errors?: ClientIntakeFieldErrors;
      };

      if (!response.ok) {
        const serverErrors = data.errors || {};
        setErrors(serverErrors);
        focusFirstError(serverErrors);
        throw new Error(
          data.error || "The intake could not be sent. Please try again.",
        );
      }

      setStatus("sent");
      setMessage(
        data.message ||
          "Thanks. We received the details. We will review them before we meet and follow up if anything important is missing.",
      );
      setFileNames([]);
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "The intake could not be sent. Please try again.",
      );
    } finally {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
        setTurnstileToken("");
      }
    }
  }

  const disabled =
    status === "submitting" || Boolean(turnstileSiteKey && !turnstileToken);

  return (
    <form
      ref={formRef}
      className="grid gap-8"
      encType="multipart/form-data"
      noValidate
      onSubmit={submit}
    >
      {message ? (
        <p
          aria-live="polite"
          className={`flex items-start gap-3 rounded-md px-4 py-3 text-sm font-bold leading-6 ${
            status === "error"
              ? "bg-[#fff0e8] text-[#9a3f18]"
              : "bg-[#e8f6f1] text-[#236047]"
          }`}
        >
          {status === "sent" ? (
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={18}
            />
          ) : null}
          <span>{message}</span>
        </p>
      ) : null}

      <section className="grid gap-5">
        <SectionHeading
          eyebrow="Start here"
          title="The few details we need first"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <TextField
            error={errors.businessName}
            label="Business name"
            name="businessName"
            onBlur={validateFieldOnBlur}
            placeholder="Example: Resplendent Tea"
            required
          />
          <TextField
            error={errors.contactName}
            label="Best contact"
            name="contactName"
            onBlur={validateFieldOnBlur}
            placeholder="Your name"
            required
          />
          <TextField
            error={errors.contactEmail}
            label="Email"
            name="contactEmail"
            onBlur={validateFieldOnBlur}
            placeholder="owner@example.com"
            required
            type="email"
          />
          <TextField
            label="Phone"
            name="phone"
            onBlur={validateFieldOnBlur}
            placeholder="Best number, if useful"
            type="tel"
          />
        </div>
      </section>

      <section className="grid gap-5">
        <SectionHeading eyebrow="Website" title="What are we helping launch?" />
        <div className="grid gap-5 lg:grid-cols-2">
          <SelectField
            error={errors.currentWebsiteStatus}
            label="Current website status"
            name="currentWebsiteStatus"
            onBlur={validateFieldOnBlur}
            options={websiteStatusOptions}
            required
          />
          <TextField
            error={errors.currentWebsiteUrl}
            label="Current website or domain"
            inputMode="url"
            name="currentWebsiteUrl"
            onBlur={validateFieldOnBlur}
            placeholder="example.com"
          />
        </div>
        <TextAreaField
          error={errors.oneSentenceDescription}
          label="In one sentence, what does the business do?"
          name="oneSentenceDescription"
          onBlur={validateFieldOnBlur}
          placeholder="We help..."
          required
          rows={3}
        />
        <TextAreaField
          error={errors.primaryOfferings}
          label="Main products or services"
          name="primaryOfferings"
          onBlur={validateFieldOnBlur}
          placeholder="List the offers customers should understand first."
          required
          rows={4}
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <TextAreaField
            error={errors.bestFitCustomers}
            label="Best-fit customers"
            name="bestFitCustomers"
            onBlur={validateFieldOnBlur}
            placeholder="Who should this site attract?"
            required
            rows={4}
          />
          <TextAreaField
            error={errors.primaryMarket}
            label="Main city, neighborhood, or service area"
            name="primaryMarket"
            onBlur={validateFieldOnBlur}
            placeholder="Example: Marietta and nearby Cobb County"
            required
            rows={4}
          />
        </div>
        <SelectField
          error={errors.primaryAction}
          label="Most important action for visitors"
          name="primaryAction"
          onBlur={validateFieldOnBlur}
          options={primaryActionOptions}
          required
        />
      </section>

      <section className="grid gap-5">
        <SectionHeading eyebrow="Helpful" title="Photos and trust signals" />
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <label className="grid gap-3 rounded-md border border-north-line bg-white p-5">
            <span className="flex items-center gap-2 text-sm font-extrabold text-north-ink">
              <ImagePlus aria-hidden="true" size={18} />
              Photos for the site
              <span className="text-xs font-bold text-north-muted">
                Optional
              </span>
            </span>
            <input
              accept="image/*"
              className="min-h-12 rounded-md border border-dashed border-north-line px-3 py-3 text-sm font-semibold text-north-muted file:mr-4 file:rounded-md file:border-0 file:bg-north-ink file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              multiple
              name="photos"
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files || []);
                setFileNames(files.slice(0, 5).map((file) => file.name));
                if (files.length > 5) {
                  setErrors((current) => ({
                    ...current,
                    photos: "Choose up to 5 photos.",
                  }));
                } else {
                  setErrors((current) => {
                    const next = { ...current };
                    delete next.photos;
                    return next;
                  });
                }
              }}
              type="file"
            />
            {fileNames.length ? (
              <ul className="grid gap-1 text-sm font-semibold text-north-muted">
                {fileNames.map((fileName) => (
                  <li key={fileName}>{fileName}</li>
                ))}
              </ul>
            ) : null}
            {errors.photos ? <FieldError message={errors.photos} /> : null}
          </label>

          <TextAreaField
            label="Reviews, credentials, awards, or proof"
            name="trustProof"
            onBlur={validateFieldOnBlur}
            placeholder="Anything customers should trust: reviews, years in business, certifications, press, results."
            rows={6}
          />
        </div>
        <SelectField
          label="Can we use the uploaded photos on the website?"
          name="photosPermission"
          onBlur={validateFieldOnBlur}
          options={[
            "Yes, we own or have permission to use them",
            "Please review permission first",
            "Not uploading photos right now",
          ]}
        />
      </section>

      <details className="group rounded-md border border-north-line bg-white p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
          <span>
            <span className="block text-sm font-extrabold uppercase text-north-teal">
              Optional
            </span>
            <span className="mt-1 block text-xl font-black text-north-ink">
              Goals, style, and examples
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="shrink-0 transition group-open:rotate-180"
            size={22}
          />
        </summary>
        <div className="mt-5 grid gap-5">
          <TextAreaField
            label="What should the new website help improve?"
            name="goals"
            onBlur={validateFieldOnBlur}
            placeholder="Examples: more calls, clearer services, easier booking, better local visibility."
            rows={4}
          />
          <TextAreaField
            label="Style notes"
            name="styleNotes"
            onBlur={validateFieldOnBlur}
            placeholder="Words that should describe the site: calm, premium, local, modern, warm, precise."
            rows={4}
          />
          <TextAreaField
            label="Websites you like or dislike"
            name="inspirationSites"
            onBlur={validateFieldOnBlur}
            placeholder="Links are helpful, but a quick description is fine."
            rows={4}
          />
        </div>
      </details>

      <details className="group rounded-md border border-north-line bg-white p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
          <span>
            <span className="block text-sm font-extrabold uppercase text-north-teal">
              Optional technical details
            </span>
            <span className="mt-1 block text-xl font-black text-north-ink">
              Accounts, domain, and tools
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="shrink-0 transition group-open:rotate-180"
            size={22}
          />
        </summary>
        <div className="mt-5 grid gap-4">
          <div className="flex items-start gap-3 rounded-md bg-[#edf7f5] p-4 text-sm font-semibold leading-6 text-[#255149]">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={18}
            />
            <p>
              Do not enter passwords, API keys, login links, registrar access,
              or Google account credentials here. We will ask for access
              separately if the project needs it.
            </p>
          </div>
          <TextAreaField
            error={errors.optionalTechnicalNotes}
            label="Anything we should know later?"
            name="optionalTechnicalNotes"
            onBlur={validateFieldOnBlur}
            placeholder="Example: we use Shopify, Square, Google Business Profile, or an existing booking tool."
            rows={4}
          />
        </div>
      </details>

      {turnstileSiteKey ? (
        <div className="grid min-h-[88px] gap-2 rounded-md border border-north-line bg-white px-4 py-3">
          <p className="text-xs font-bold uppercase text-north-muted">
            Verification
          </p>
          <div ref={turnstileRef} />
        </div>
      ) : null}

      <label className="flex items-start gap-3 rounded-md border border-north-line bg-white p-4 text-sm font-semibold leading-6 text-north-muted">
        <input
          className="mt-1 h-4 w-4 shrink-0 accent-north-teal"
          name="consent"
          onChange={() => validateFields(["consent"])}
          required
          type="checkbox"
        />
        <span>
          Northvalley can use this intake to prepare for our conversation and
          follow up about missing details.
          {errors.consent ? <FieldError message={errors.consent} /> : null}
        </span>
      </label>

      <button
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md bg-north-ink px-6 py-4 text-base font-extrabold text-white shadow-[0_18px_34px_rgba(20,32,42,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-55"
        disabled={disabled}
        type="submit"
      >
        {status === "submitting" ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" size={19} />
            Sending intake
          </>
        ) : (
          <>
            Send website intake
            <Send aria-hidden="true" size={18} />
          </>
        )}
      </button>
    </form>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-sm font-extrabold uppercase text-north-teal">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-normal text-north-ink md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function RequiredMarker() {
  return <span className="text-xs font-bold text-north-teal">Required</span>;
}

function TextField({
  error,
  inputMode,
  label,
  name,
  onBlur,
  placeholder,
  required = false,
  type = "text",
}: {
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  label: string;
  name: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-bold text-north-ink">
      <span className="flex items-center justify-between gap-3">
        {label}
        {required ? <RequiredMarker /> : null}
      </span>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`min-h-12 rounded-md border bg-white px-3 text-base font-medium outline-none focus:border-north-teal ${
          error ? "border-[#d8614c]" : "border-north-line"
        }`}
        inputMode={inputMode}
        name={name}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        type={type}
      />
      {error ? <FieldError id={errorId} message={error} /> : null}
    </label>
  );
}

function TextAreaField({
  error,
  label,
  name,
  onBlur,
  placeholder,
  required = false,
  rows,
}: {
  error?: string;
  label: string;
  name: string;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  placeholder: string;
  required?: boolean;
  rows: number;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-bold text-north-ink">
      <span className="flex items-center justify-between gap-3">
        {label}
        {required ? <RequiredMarker /> : null}
      </span>
      <textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`rounded-md border bg-white px-3 py-3 text-base font-medium leading-7 outline-none focus:border-north-teal ${
          error ? "border-[#d8614c]" : "border-north-line"
        }`}
        name={name}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
      {error ? <FieldError id={errorId} message={error} /> : null}
    </label>
  );
}

function SelectField({
  error,
  label,
  name,
  onBlur,
  options,
  required = false,
}: {
  error?: string;
  label: string;
  name: string;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  options: string[];
  required?: boolean;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-bold text-north-ink">
      <span className="flex items-center justify-between gap-3">
        {label}
        {required ? <RequiredMarker /> : null}
      </span>
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`min-h-12 rounded-md border bg-white px-3 text-base font-medium outline-none focus:border-north-teal ${
          error ? "border-[#d8614c]" : "border-north-line"
        }`}
        defaultValue=""
        name={name}
        onBlur={onBlur}
        required={required}
      >
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <FieldError id={errorId} message={error} /> : null}
    </label>
  );
}

function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <span id={id} className="text-sm font-bold text-[#9a3f18]">
      {message}
    </span>
  );
}
