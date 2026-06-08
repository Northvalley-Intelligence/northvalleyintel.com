"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, CalendarDays, Send } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
  mode?: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
  },
];

const examples = [
  "We are not getting enough leads",
  "Visitors are not turning into customers",
  "Follow-up and scheduling are messy",
];

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

function getChatSessionId() {
  if (typeof window === "undefined") {
    return "anonymous";
  }

  const existing = window.localStorage.getItem("northvalley-chat-session");
  if (existing) {
    return existing;
  }

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem("northvalley-chat-session", next);
  return next;
}

export function EngagementChatMockup() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef("");

  useEffect(() => {
    let cancelled = false;

    async function loadChatConfig() {
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

    loadChatConfig().catch(() => undefined);

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

  async function sendMessage() {
    const content = input.trim();

    if (!content || submitting || (turnstileSiteKey && !turnstileToken)) {
      return;
    }

    const turnIndex = messages.filter((message) => message.role === "user").length;
    setInput("");
    setSubmitting(true);
    setMessages((current) => [...current, { role: "user", content }]);

    try {
      const response = await fetch("/api/workflow-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId: getChatSessionId(),
          message: content,
          turnstileToken,
          history: messages.slice(-8),
          turnIndex,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
        mode?: string;
      };

      if (!response.ok || !result.reply) {
        throw new Error(result.error || "The assistant could not respond.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: result.reply || "Let us set up some time to discuss and understand more.",
          mode: result.mode,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Let us set up some time to discuss and understand more.",
          mode: "fallback",
        },
      ]);
    } finally {
      setSubmitting(false);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
        setTurnstileToken("");
      }
    }
  }

  return (
    <div
      className="overflow-hidden rounded-lg border border-north-line bg-white shadow-[0_24px_60px_rgba(20,32,42,0.13)]"
      aria-label="Workflow conversation"
    >
      <div className="border-b border-north-line bg-[#f8faf9] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-north-ink text-white">
              <Bot aria-hidden="true" size={22} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-north-ink">
                Workflow assistant
              </p>
              <p className="text-xs font-semibold text-north-muted">
                Chat first, then schedule
              </p>
            </div>
          </div>
          <span className="rounded-md bg-[#e6f0ee] px-3 py-1.5 text-xs font-bold text-north-teal">
            Live chat
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-5">
        <div className="grid max-h-[260px] min-h-[96px] content-start gap-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[88%] rounded-lg ${
                message.role === "user"
                  ? "ml-auto rounded-tr-sm bg-north-ink p-4 text-white"
                  : "rounded-tl-sm bg-transparent px-1 py-0 text-[#384653]"
              }`}
            >
              <p
                className={`leading-6 ${
                  message.role === "user"
                    ? "text-sm"
                    : "text-sm font-extrabold text-north-ink"
                }`}
              >
                {message.content}
              </p>
            </div>
          ))}
          {submitting ? (
            <div className="max-w-[88%] rounded-lg rounded-tl-sm bg-[#eef2f3] p-4 text-[#384653]">
              <p className="text-sm leading-6">Thinking through the workflow...</p>
            </div>
          ) : null}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-north-muted">
            Write it the way you would explain it to a person.
          </p>
          <div className="flex items-end gap-2 rounded-lg border-2 border-north-ink bg-white p-2 shadow-[0_16px_36px_rgba(20,32,42,0.12)]">
            <textarea
            aria-label="Describe your workflow problem"
            className="min-h-24 flex-1 resize-none border-0 bg-transparent px-3 py-3 text-base leading-6 text-north-ink outline-none placeholder:text-[#6f7b82]"
            disabled={submitting}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type where you want help first..."
            rows={3}
            value={input}
            />
            <button
              aria-label="Send message"
              className="mb-1 grid h-11 w-11 shrink-0 place-items-center rounded-md bg-north-ink text-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={submitting || !input.trim() || Boolean(turnstileSiteKey && !turnstileToken)}
              onClick={sendMessage}
              type="button"
            >
              <Send aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
        {turnstileSiteKey ? (
          <div className="grid min-h-[88px] gap-2 rounded-lg border border-north-line bg-[#f8faf9] px-4 py-3">
            <p className="text-xs font-bold uppercase text-north-muted">
              Verification
            </p>
            <div ref={turnstileRef} />
          </div>
        ) : null}
        {messages.length === 1 ? (
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                className="rounded-md border border-north-line bg-white px-3 py-2 text-xs font-bold text-[#384653] hover:border-north-teal hover:text-north-teal"
                onClick={() => setInput(example)}
                type="button"
              >
                {example}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 rounded-lg border border-north-line bg-[#f8faf9] px-4 py-3 text-sm">
          <span className="flex items-center gap-2 font-semibold text-[#384653]">
            <CalendarDays
              aria-hidden="true"
              className="text-north-teal"
              size={17}
            />
            Next step: offer Eastern-time assessment windows
          </span>
        </div>
      </div>
    </div>
  );
}
