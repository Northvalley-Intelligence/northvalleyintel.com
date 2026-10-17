import type { Metadata } from "next";
import { CheckCircle2, MapPinned, Phone } from "lucide-react";
import Link from "next/link";

import { ContactEmailLink } from "@/components/contact-email";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { companyFacts, governmentPage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: governmentPage.title,
  description: governmentPage.description,
  alternates: { canonical: governmentPage.path },
  openGraph: {
    title: governmentPage.title,
    description: governmentPage.description,
    url: `${siteConfig.url}${governmentPage.path}`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}${governmentPage.path}#page`,
  url: `${siteConfig.url}${governmentPage.path}`,
  name: governmentPage.title,
  description: governmentPage.description,
  about: { "@id": `${siteConfig.url}/#organization` },
  mainEntity: {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    naics: "541511",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marietta",
      addressRegion: "GA",
      addressCountry: "US",
    },
    knowsAbout: governmentPage.competencies.map((item) => item.title),
  },
};

export default function GovernmentPage() {
  const contact = companyFacts.find((fact) => fact.label === "Contact");

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%)] px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase text-north-teal">
              <MapPinned aria-hidden="true" size={17} />
              Marietta, Georgia
            </p>
            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.03] tracking-normal text-north-ink">
              Northvalley Intelligence for government buyers.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#42505d]">
              {governmentPage.summary}
            </p>
            <p className="mt-4 text-sm font-bold">
              <a
                className="text-north-teal underline underline-offset-4 hover:text-north-ink"
                href="/northvalley-capability-statement.pdf"
              >
                Download the capability statement (PDF)
              </a>
            </p>
          </div>
        </section>

        <section
          id="competencies"
          className="px-5 py-14 md:px-10 md:py-16 lg:px-18"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-extrabold text-north-ink">
              Core competencies
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {governmentPage.competencies.map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-north-line bg-white p-6"
                >
                  <h3 className="text-xl font-black leading-tight text-north-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-north-muted">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
            <h3 className="mt-10 text-xl font-extrabold text-north-ink">
              How an engagement runs
            </h3>
            <ol className="mt-4 grid gap-3 md:grid-cols-2">
              {governmentPage.process.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 text-base leading-7 text-north-muted"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-north-ink text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="differentiators"
          className="border-t border-north-line bg-[#f8faf9] px-5 py-14 md:px-10 md:py-16 lg:px-18"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-extrabold text-north-ink">
              Differentiators
            </h2>
            <ul className="mt-5 grid gap-3">
              {governmentPage.differentiators.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base leading-7 text-north-muted"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-north-green"
                    size={18}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="buyers" className="px-5 py-14 md:px-10 md:py-16 lg:px-18">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-extrabold text-north-ink">
              Federal, state and local
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {governmentPage.buyers.map((item) => (
                <div
                  key={item.label}
                  className="border-l-2 border-north-line pl-4"
                >
                  <h3 className="text-sm font-black uppercase text-north-teal">
                    {item.label}
                  </h3>
                  <p className="mt-2 leading-7 text-north-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="past-performance"
          className="border-t border-north-line bg-[#f8faf9] px-5 py-14 md:px-10 md:py-16 lg:px-18"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-extrabold text-north-ink">
              Past performance
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {governmentPage.pastPerformance.map((item) => (
                <article
                  key={item.name}
                  className="rounded-lg border border-north-line bg-white p-6"
                >
                  <h3 className="text-xl font-black leading-tight text-north-ink">
                    {item.name}
                  </h3>
                  <ul className="mt-3 grid gap-2">
                    {item.lines.map((line) => {
                      const split = line.indexOf(": ");
                      return (
                        <li key={line} className="leading-7 text-north-muted">
                          {split === -1 ? (
                            line
                          ) : (
                            <>
                              <span className="font-bold text-north-ink">
                                {line.slice(0, split)}:
                              </span>{" "}
                              {line.slice(split + 2)}
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))}
            </div>
            <p className="mt-5 text-base leading-7 text-north-muted">
              Public write-ups:{" "}
              <Link
                className="font-bold text-north-teal hover:underline"
                href="/#client-work"
              >
                Client Work
              </Link>
            </p>
          </div>
        </section>

        <section
          id="company-data"
          className="px-5 py-14 md:px-10 md:py-16 lg:px-18"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-extrabold text-north-ink">
              Company data
            </h2>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-lg border border-north-line bg-north-line">
              {governmentPage.companyData.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 bg-[#f8faf9] p-4 md:grid-cols-[14rem_1fr] md:p-5"
                >
                  <dt className="text-xs font-black uppercase text-north-amber-dark">
                    {row.label}
                  </dt>
                  <dd className="text-sm font-semibold leading-6 text-north-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink
              href="/northvalley-capability-statement.pdf"
              variant="secondary"
              className="mt-6"
            >
              Download the capability statement (PDF)
            </ButtonLink>
            <p className="mt-3 text-sm leading-6 text-north-muted">
              One page, mirrors this page. Updated when the page changes.
            </p>
          </div>
        </section>

        <section
          id="contact"
          className="border-t border-north-line bg-[#f8faf9] px-5 py-14 md:px-10 md:py-16 lg:px-18"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-extrabold text-north-ink">Contact</h2>
            {contact ? (
              <p className="mt-4 text-lg leading-8 text-north-ink">
                <span className="block font-bold">{contact.value}</span>
                <span className="block">
                  <ContactEmailLink
                    address={(contact as { email?: string }).email}
                    className="font-bold text-north-teal hover:underline"
                  />{" "}
                  <span className="text-base font-bold text-north-muted">
                    (direct)
                  </span>
                </span>
                <a
                  className="inline-flex items-center gap-2 font-bold text-north-teal hover:underline"
                  href={(contact as { phoneHref?: string }).phoneHref}
                >
                  <Phone aria-hidden="true" size={17} strokeWidth={2.4} />
                  {(contact as { phone?: string }).phone}
                </a>
              </p>
            ) : null}
            <div className="mt-6">
              <ButtonLink href="/intake">Start the conversation</ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter width="max-w-5xl" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
