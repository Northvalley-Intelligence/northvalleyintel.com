import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import {
  ArticleCards,
  CaseStudyShell,
  ContactBand,
} from "@/components/case-studies/case-study-shell";
import { ButtonLink } from "@/components/ui/button";
import { medinaCleanCaseStudy } from "@/lib/case-studies";
import {
  medinaCaseStudy,
  medinaOutcomes,
  medinaPrinciples,
  siteConfig,
} from "@/lib/site";

export const metadata: Metadata = {
  title: medinaCleanCaseStudy.title,
  description: medinaCleanCaseStudy.description,
  alternates: {
    canonical: "/case-studies/medina-clean",
  },
  openGraph: {
    title: medinaCleanCaseStudy.title,
    description: medinaCleanCaseStudy.description,
    url: `${siteConfig.url}/case-studies/medina-clean`,
    images: [{ url: "/case-study-rosa-story.svg", width: 1200, height: 800 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: medinaCleanCaseStudy.title,
  description: medinaCleanCaseStudy.description,
  author: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
  },
  mainEntityOfPage: `${siteConfig.url}/case-studies/medina-clean`,
};

export default function MedinaCleanCaseStudyPage() {
  return (
    <CaseStudyShell
      eyebrow="Native Case Study"
      title={medinaCleanCaseStudy.title}
      description={medinaCleanCaseStudy.description}
      image="/case-study-rosa-story.svg"
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#series">Read the series</ButtonLink>
          <ButtonLink
            href={medinaCaseStudy.url}
            variant="secondary"
            showIcon={false}
          >
            View Medina Clean
            <ExternalLink aria-hidden="true" size={17} strokeWidth={2.4} />
          </ButtonLink>
        </div>
      }
    >
      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-18">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
              Operating context
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
              A practical software project for a real service business.
            </h2>
          </div>
          <div className="grid gap-5">
            <p className="text-lg leading-8 text-north-muted">
              {medinaCaseStudy.context}
            </p>
            <p className="text-lg leading-8 text-north-muted">
              {medinaCaseStudy.summary}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#eef2f3] px-5 py-16 md:px-10 md:py-24 lg:px-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
              Outcomes
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
              The case study is organized around the business workflow.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {medinaOutcomes.map((outcome) => (
              <article
                key={outcome.label}
                className="rounded-lg border border-north-line bg-white p-6"
              >
                <h3 className="text-xl font-extrabold">{outcome.label}</h3>
                <p className="mt-3 text-sm leading-6 text-north-muted">
                  {outcome.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="series"
        className="border-y border-north-line bg-white px-5 py-16 md:px-10 md:py-24 lg:px-18"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
              Article series
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
              Three native pages, one operating story.
            </h2>
          </div>
          <ArticleCards />
        </div>
      </section>

      <section className="bg-north-ink px-5 py-16 text-white md:px-10 md:py-24 lg:px-18">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase text-[#77c0b7]">
              Principles
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
              What makes it a Northvalley project.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {medinaPrinciples.map((principle) => (
              <article
                key={principle}
                className="rounded-lg border border-white/12 bg-white/8 p-5"
              >
                <p className="text-sm leading-6 text-[#dbe5eb]">
                  {principle}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </CaseStudyShell>
  );
}
