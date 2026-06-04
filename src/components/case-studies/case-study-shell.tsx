import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { medinaCleanArticles } from "@/lib/case-studies";
import { siteConfig } from "@/lib/site";

type CaseStudyShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  actions?: React.ReactNode;
};

export function CaseStudyShell({
  children,
  eyebrow,
  title,
  description,
  image = "/case-study-rosa-story.svg",
  actions,
}: CaseStudyShellProps) {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%),linear-gradient(315deg,rgba(183,121,31,0.13),transparent_44%)] px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <Link
                href="/#case-study"
                className="mb-6 inline-flex text-sm font-bold text-north-teal hover:text-north-ink"
              >
                Back to case study
              </Link>
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                {eyebrow}
              </p>
              <h1 className="max-w-5xl text-[clamp(2.6rem,6vw,5.1rem)] font-black leading-[0.98] tracking-normal text-north-ink">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#42505d] md:text-xl">
                {description}
              </p>
              {actions ? <div className="mt-8">{actions}</div> : null}
            </div>
            <div className="overflow-hidden rounded-lg border border-north-line bg-white shadow-[0_24px_60px_rgba(20,32,42,0.12)]">
              <Image
                src={image}
                alt=""
                width={960}
                height={640}
                priority
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        </section>
        {children}
      </main>
      <footer className="bg-[#111820] px-5 py-6 text-sm text-[#cbd5dc] md:px-10 lg:px-18">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 sm:flex-row">
          <span>{siteConfig.legalName}</span>
          <span>Operational knowledge and workflow intelligence</span>
        </div>
      </footer>
    </>
  );
}

export function ArticleCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {medinaCleanArticles.map((article) => {
        const Icon = article.icon;

        return (
          <article
            key={article.slug}
            className="rounded-lg border border-north-line bg-white p-6"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-md bg-north-ink text-white">
              <Icon aria-hidden="true" size={23} />
            </div>
            <p className="text-xs font-extrabold uppercase text-north-teal">
              {article.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">{article.title}</h2>
            <p className="mt-3 text-sm leading-6 text-north-muted">
              {article.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold uppercase text-[#667482]">
              <span>{article.published}</span>
              <span>{article.readTime}</span>
            </div>
            <Link
              href={`/case-studies/medina-clean/${article.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-north-ink hover:text-north-teal"
            >
              Read native page
              <ExternalLink aria-hidden="true" size={16} strokeWidth={2.4} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function ContactBand() {
  return (
    <section className="border-t border-north-line bg-white px-5 py-14 md:px-10 lg:px-18">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
            Assessment first
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight tracking-normal">
            Start with the workflow before choosing the software.
          </h2>
        </div>
        <ButtonLink
          className="w-full sm:w-auto"
          href={`mailto:${siteConfig.email}?subject=Operational AI Assessment`}
        >
          Schedule an assessment
        </ButtonLink>
      </div>
    </section>
  );
}
