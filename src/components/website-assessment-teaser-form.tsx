"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Send } from "lucide-react";

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

export function WebsiteAssessmentTeaserForm() {
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [turnstileSiteKey, setTurnstileSiteKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
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
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || turnstileWidgetId.current) {
        return;
      }

      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    const interval = window.setInterval(renderWidget, 250);
    renderWidget();

    return () => window.clearInterval(interval);
  }, [turnstileSiteKey]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/website-assessment-teaser", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          businessName,
          websiteUrl,
          email,
          turnstileToken,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "The assessment request could not be sent.");
      }

      setStatus("sent");
      setMessage(
        data.message ||
          "We are preparing the teaser report and will email it when the assessment finishes.",
      );
      setBusinessName("");
      setWebsiteUrl("");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "The assessment request could not be sent.",
      );
    } finally {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
        setTurnstileToken("");
      }
    }
  }

  const disabled =
    status === "submitting" ||
    !websiteUrl.trim() ||
    !email.trim() ||
    Boolean(turnstileSiteKey && !turnstileToken);

  return (
    <form
      className="grid gap-4 rounded-lg border border-north-line bg-white p-5 shadow-[0_24px_60px_rgba(20,32,42,0.12)]"
      onSubmit={submit}
    >
      <div className="flex items-center gap-3 border-b border-north-line pb-4">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-north-ink text-white">
          <FileText aria-hidden="true" size={21} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-north-ink">
            Request a teaser report
          </p>
          <p className="text-xs font-semibold text-north-muted">
            We email the one-page PDF when the scan completes.
          </p>
        </div>
      </div>

      <label className="grid gap-2 text-sm font-bold text-north-ink">
        Business name
        <input
          className="min-h-12 rounded-md border border-north-line px-3 text-base font-medium outline-none focus:border-north-teal"
          name="businessName"
          onChange={(event) => setBusinessName(event.target.value)}
          placeholder="Example: Marietta Lawn Care"
          type="text"
          value={businessName}
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-north-ink">
        Website
        <input
          className="min-h-12 rounded-md border border-north-line px-3 text-base font-medium outline-none focus:border-north-teal"
          inputMode="url"
          name="websiteUrl"
          onChange={(event) => setWebsiteUrl(event.target.value)}
          placeholder="examplebusiness.com"
          required
          type="text"
          value={websiteUrl}
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-north-ink">
        Email for the teaser PDF
        <input
          className="min-h-12 rounded-md border border-north-line px-3 text-base font-medium outline-none focus:border-north-teal"
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="owner@examplebusiness.com"
          required
          type="email"
          value={email}
        />
      </label>

      {turnstileSiteKey ? (
        <div className="grid min-h-[88px] gap-2 rounded-lg border border-north-line bg-[#f8faf9] px-4 py-3">
          <p className="text-xs font-bold uppercase text-north-muted">
            Verification
          </p>
          <div ref={turnstileRef} />
        </div>
      ) : null}

      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-north-ink px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,32,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        type="submit"
      >
        {status === "submitting" ? "Preparing..." : "Email the teaser report"}
        <Send aria-hidden="true" size={17} />
      </button>

      {message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            status === "error"
              ? "bg-[#fff0e8] text-[#9a3f18]"
              : "bg-[#e8f6f7] text-north-teal"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
