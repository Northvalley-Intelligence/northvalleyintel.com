import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Write-ups of Northvalley Intelligence client work: the Medina Clean operating-foundation case study and the recorded booking demonstration.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Case Studies | Northvalley Intelligence",
    description:
      "Write-ups of Northvalley Intelligence client work for Medina Clean.",
    url: `${siteConfig.url}/case-studies`,
  },
};

const writeUps = [
  {
    href: "/case-studies/medina-clean",
    title: "Medina Clean: from website request to operating foundation",
    text: "How a cleaning business website request became a practical operating foundation: bilingual public presence, guided estimates, lead handling and scheduling support.",
  },
  {
    href: "/case-studies/chatgpt-booking-medina-clean",
    title: "Booking inside ChatGPT",
    text: "A recorded demonstration with the full transcript: a customer asks an assistant for a cleaning, and the request reaches the owner for review.",
  },
];

export default function CaseStudiesIndexPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%)] px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.03] tracking-normal text-north-ink">
              Case studies.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#42505d]">
              Write-ups of published client work. The full list of client work
              is on the{" "}
              <Link className="font-bold text-north-teal" href="/#client-work">
                home page
              </Link>
              .
            </p>
            <ul className="mt-10 grid gap-5">
              {writeUps.map((item) => (
                <li
                  key={item.href}
                  className="rounded-lg border border-north-line bg-white p-6"
                >
                  <Link
                    className="text-xl font-black text-north-ink hover:text-north-teal"
                    href={item.href}
                  >
                    {item.title}
                  </Link>
                  <p className="mt-2 leading-7 text-north-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter width="max-w-4xl" />
    </>
  );
}
