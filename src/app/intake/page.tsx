import type { Metadata } from "next";
import { ArrowLeft, Clock3, FileCheck2, HelpCircle } from "lucide-react";
import Link from "next/link";

import { ClientIntakeForm } from "@/components/client-intake-form";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Intake",
  description:
    "A short Northvalley intake for collecting business details before a website planning conversation.",
  alternates: {
    canonical: "/intake",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const checklist = [
  {
    icon: Clock3,
    title: "Usually 8 to 12 minutes",
    detail: "Answer what you know. Optional details can stay blank.",
  },
  {
    icon: FileCheck2,
    title: "Before we meet",
    detail: "We review this first so the conversation starts faster.",
  },
  {
    icon: HelpCircle,
    title: "Not sure?",
    detail: "Send the basics. We will ask for anything important later.",
  },
];

export default function IntakePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f8faf9]">
        <section className="px-5 py-6 md:px-10 md:py-8 lg:px-18">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.36fr] lg:items-start">
            <div className="rounded-lg border border-north-line bg-[#f7f6f0] p-5 shadow-[0_24px_70px_rgba(20,32,42,0.08)] md:p-8">
              <Link
                className="inline-flex items-center gap-2 text-sm font-extrabold text-north-teal hover:text-north-ink"
                href="/"
              >
                <ArrowLeft aria-hidden="true" size={17} />
                Northvalley Intelligence
              </Link>
              <p className="mt-6 text-sm font-extrabold uppercase text-north-teal">
                Website intake
              </p>
              <h1 className="mt-2 max-w-3xl text-[clamp(1.8rem,4vw,3rem)] font-black leading-tight tracking-normal text-north-ink">
                Share the basics before we meet.
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-north-muted">
                This saves time in the first conversation. Start with what the
                business offers, who it serves, where it works, and what a
                visitor should do next.
              </p>
              <div className="mt-7">
                <ClientIntakeForm />
              </div>
            </div>

            <aside className="grid gap-5 lg:sticky lg:top-28">
              <div className="grid gap-3">
                {checklist.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      className="flex items-start gap-3 rounded-md border border-north-line bg-[#f8faf9] p-4"
                      key={item.title}
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-north-ink text-white">
                        <Icon aria-hidden="true" size={19} />
                      </div>
                      <div>
                        <p className="font-extrabold text-north-ink">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-north-muted">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-md border border-north-line bg-white p-5">
                <p className="text-sm font-extrabold uppercase text-north-teal">
                  What happens next
                </p>
                <ol className="mt-4 grid gap-4 text-sm font-semibold leading-6 text-north-muted">
                  <li>
                    <span className="font-extrabold text-north-ink">1.</span> We
                    review the details before the meeting.
                  </li>
                  <li>
                    <span className="font-extrabold text-north-ink">2.</span> We
                    prepare better questions and note anything missing.
                  </li>
                  <li>
                    <span className="font-extrabold text-north-ink">3.</span> We
                    use the conversation to confirm priorities and next steps.
                  </li>
                </ol>
              </div>

              <div className="rounded-md border border-north-line bg-north-ink p-5 text-white">
                <p className="text-sm font-extrabold uppercase text-[#8ee0d4]">
                  Need help?
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/82">
                  Send the basics and leave anything uncertain blank. We will
                  sort out the rest when we talk.
                </p>
                <a
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-extrabold text-north-ink hover:bg-[#edf7f5]"
                  href={`mailto:${siteConfig.email}`}
                >
                  Email Northvalley
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
