import type { Metadata } from "next";
import { ArrowLeft, Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ClientIntakeForm } from "@/components/client-intake-form";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Launch Intake",
  description:
    "A short Northvalley website launch intake for collecting the business details, photos, service area, and conversion goals needed before a client website build.",
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
    detail: "Answer the essentials first. Extra context is optional.",
  },
  {
    icon: FileCheck2,
    title: "Built for the launch package",
    detail: "Your answers become the starting facts for the website build.",
  },
  {
    icon: ShieldCheck,
    title: "No passwords here",
    detail: "Access details are handled separately if the project needs them.",
  },
];

export default function IntakePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f8faf9]">
        <section className="border-b border-north-line bg-white px-5 py-8 md:px-10 lg:px-18">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <Link
                className="inline-flex items-center gap-2 text-sm font-extrabold text-north-teal hover:text-north-ink"
                href="/"
              >
                <ArrowLeft aria-hidden="true" size={17} />
                Northvalley Intelligence
              </Link>
              <p className="mt-8 text-sm font-extrabold uppercase text-north-teal">
                Website launch intake
              </p>
              <h1 className="mt-3 max-w-3xl text-[clamp(2.25rem,5vw,4.75rem)] font-black leading-[1] tracking-normal text-north-ink">
                Tell us what the new site needs to know.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-north-muted md:text-xl">
                Start with the practical details: what you offer, who you serve,
                where you work, and what visitors should do next. Photos and
                technical notes are optional.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
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
          </div>
        </section>

        <section className="px-5 py-10 md:px-10 md:py-14 lg:px-18">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.68fr_0.32fr] lg:items-start">
            <div className="rounded-lg border border-north-line bg-[#f7f6f0] p-5 shadow-[0_24px_70px_rgba(20,32,42,0.08)] md:p-8">
              <ClientIntakeForm />
            </div>

            <aside className="grid gap-5 lg:sticky lg:top-28">
              <div className="rounded-md border border-north-line bg-white p-5">
                <p className="text-sm font-extrabold uppercase text-north-teal">
                  What happens next
                </p>
                <ol className="mt-4 grid gap-4 text-sm font-semibold leading-6 text-north-muted">
                  <li>
                    <span className="font-extrabold text-north-ink">1.</span> We
                    review the intake and flag anything missing.
                  </li>
                  <li>
                    <span className="font-extrabold text-north-ink">2.</span> We
                    prepare the website mission, build brief, and content list.
                  </li>
                  <li>
                    <span className="font-extrabold text-north-ink">3.</span> We
                    confirm launch priorities before the build starts.
                  </li>
                </ol>
              </div>

              <div className="rounded-md border border-north-line bg-north-ink p-5 text-white">
                <p className="text-sm font-extrabold uppercase text-[#8ee0d4]">
                  Need help?
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/82">
                  Send the basics and leave anything uncertain blank. We will
                  sort out details with you before they become website copy.
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
