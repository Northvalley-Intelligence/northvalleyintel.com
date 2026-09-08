import type { Metadata } from "next";
import { CheckCircle2, ExternalLink, MapPinned, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ContactEmailLink } from "@/components/contact-email";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { owner, siteConfig, teamMembers } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Northvalley Intelligence",
  description:
    "Who runs Northvalley Intelligence, the published credentials behind the work, where the business is based, and how an engagement starts.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Northvalley Intelligence",
    description:
      "Who runs Northvalley Intelligence, the published credentials behind the work, and how an engagement starts.",
    url: `${siteConfig.url}/about`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${siteConfig.url}/about#page`,
  url: `${siteConfig.url}/about`,
  name: "About Northvalley Intelligence",
  about: { "@id": `${siteConfig.url}/#organization` },
  mainEntity: {
    "@type": "Person",
    "@id": `${siteConfig.url}/about#owner`,
    name: owner.name,
    jobTitle: owner.role,
    url: owner.url,
    image: `${siteConfig.url}${owner.image}`,
    description: owner.summary,
    sameAs: [owner.url, owner.blogUrl],
    // Only degrees already published on owner.url are asserted here.
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "The University of Alabama" },
      { "@type": "CollegeOrUniversity", name: "Clarkson University" },
    ],
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Marietta",
        addressRegion: "GA",
        addressCountry: "US",
      },
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%)] px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase text-north-teal">
                <MapPinned aria-hidden="true" size={17} />
                {owner.location}
              </p>
              <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.03] tracking-normal text-north-ink">
                Who you are actually hiring.
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#42505d]">
                {owner.summary}
              </p>
              <p className="mt-4 text-lg leading-8 text-[#42505d]">
                Northvalley Intelligence builds practical, workflow-shaped
                software and AI-agent systems for service businesses, and works
                across Cobb, Paulding, and Douglas counties and the wider
                Atlanta metro. The published client work sits on the{" "}
                <Link
                  className="font-bold text-north-teal"
                  href="/#client-work"
                >
                  home page
                </Link>
                , and the cities we serve each have a page under{" "}
                <Link
                  className="font-bold text-north-teal"
                  href="/service-areas"
                >
                  service areas
                </Link>
                .
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/intake">Start the conversation</ButtonLink>
                <a
                  className="inline-flex items-center gap-2 text-lg font-bold text-north-ink hover:text-north-teal"
                  href={siteConfig.phoneHref}
                >
                  <Phone aria-hidden="true" size={19} strokeWidth={2.4} />
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-north-line bg-white p-5 shadow-[0_24px_60px_rgba(20,32,42,0.1)]">
              <Image
                src={owner.image}
                alt={`${owner.name}, ${owner.role} of Northvalley Intelligence.`}
                width={628}
                height={835}
                sizes="(min-width: 1024px) 380px, 100vw"
                className="w-full rounded-md object-cover"
              />
              <p className="mt-4 text-xl font-extrabold text-north-ink">
                {owner.name}
              </p>
              <p className="text-sm font-bold uppercase text-north-teal">
                {owner.role}
              </p>
              <a
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-north-teal hover:text-north-ink"
                href={owner.blogUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Read the blog
                <ExternalLink aria-hidden="true" size={15} strokeWidth={2.4} />
              </a>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:px-10 md:py-16 lg:px-18">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold text-north-ink">
                Background and credentials
              </h2>
              {/*
                Every line comes from owner.credentials, which is sourced from
                Ferosh Jacob's own published biography at
                https://feroshjacob.github.io/. Nothing here is inferred, and no
                award, certification, or client statistic is claimed that is not
                already published somewhere citable.
              */}
              <ul className="mt-5 grid gap-3">
                {owner.credentials.map((item) => (
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
              <p className="mt-5 text-sm leading-6 text-north-muted">
                Sourced from Ferosh&apos;s published biography at{" "}
                <a
                  className="font-bold text-north-teal hover:text-north-ink"
                  href={owner.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  feroshjacob.github.io
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-north-ink">
                How the work is approached
              </h2>
              <ul className="mt-5 grid gap-3">
                {owner.approach.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-north-line pl-4 text-base leading-7 text-north-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="people"
          className="border-t border-north-line bg-[#f8faf9] px-5 py-14 md:px-10 md:py-16 lg:px-18"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-extrabold text-north-ink">
              Who you will work with
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="rounded-lg border border-north-line bg-white p-5"
                >
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} at Northvalley Intelligence.`}
                    width={628}
                    height={835}
                    sizes="(min-width: 768px) 300px, 100vw"
                    className="aspect-[3/4] w-full rounded-md object-cover"
                  />
                  <p className="mt-4 text-lg font-extrabold text-north-ink">
                    {member.name}
                  </p>
                  <p className="text-sm font-bold uppercase text-north-teal">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-north-muted">
                    {member.description}
                  </p>
                  <a
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-north-teal hover:text-north-ink"
                    href={member.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Profile
                    <ExternalLink
                      aria-hidden="true"
                      size={15}
                      strokeWidth={2.4}
                    />
                  </a>
                </article>
              ))}
            </div>

            {/*
              PHOTO SLOT — awaiting real photographs from Ferosh.

              The 2026-09-07 evaluation flagged "real team, owner, project, or
              gallery photos were not clear" as a Trust Signals failure. The
              portraits above are the existing brand assets. What is still
              missing is photographs of the actual work and workplace. When
              Ferosh supplies them, drop them in public/work/ and replace this
              block with the gallery; do not fill it with stock imagery.
            */}
            <div className="mt-8 rounded-lg border border-dashed border-north-line bg-white p-6">
              <p className="text-sm font-extrabold uppercase text-north-teal">
                Photos of the work
              </p>
              <p className="mt-2 text-base leading-7 text-north-muted">
                Photographs from real engagements are being added here. Until
                they are, the proof lives in the{" "}
                <Link className="font-bold text-north-teal" href="/#case-study">
                  case studies
                </Link>{" "}
                — full write-ups of what was actually built, for named clients.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-north-line bg-white px-5 py-14 md:px-10 lg:px-18">
          <div className="mx-auto flex max-w-5xl flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-black leading-tight tracking-normal">
                Start with a conversation.
              </h2>
              <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-lg font-bold">
                <a
                  className="inline-flex items-center gap-2 text-north-ink hover:text-north-teal"
                  href={siteConfig.phoneHref}
                >
                  <Phone aria-hidden="true" size={19} strokeWidth={2.4} />
                  {siteConfig.phone}
                </a>
                <ContactEmailLink className="text-north-teal hover:text-north-ink" />
              </p>
            </div>
            <ButtonLink className="w-full sm:w-auto" href="/intake">
              Start the conversation
            </ButtonLink>
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
