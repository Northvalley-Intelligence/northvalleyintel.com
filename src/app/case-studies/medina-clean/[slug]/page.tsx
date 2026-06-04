import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import {
  ArticleCards,
  CaseStudyShell,
  ContactBand,
} from "@/components/case-studies/case-study-shell";
import { ButtonLink } from "@/components/ui/button";
import {
  getMedinaArticle,
  medinaCleanArticles,
  medinaCleanCaseStudy,
} from "@/lib/case-studies";
import { siteConfig } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return medinaCleanArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getMedinaArticle(slug);

  if (!article) {
    return {};
  }

  const path = `/case-studies/medina-clean/${article.slug}`;

  return {
    title: `${article.title} | Medina Clean Case Study`,
    description: article.summary,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${article.title} | ${siteConfig.name}`,
      description: article.summary,
      url: `${siteConfig.url}${path}`,
      images: [{ url: article.image, width: 1200, height: 800 }],
      type: "article",
    },
  };
}

export default async function MedinaCleanArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;
  const article = getMedinaArticle(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${article.title} | Medina Clean Case Study`,
    description: article.summary,
    datePublished: article.published,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/case-studies/medina-clean/${article.slug}`,
  };

  return (
    <CaseStudyShell
      eyebrow={article.eyebrow}
      title={article.title}
      description={article.summary}
      image={article.image}
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/case-studies/medina-clean">
            Case study hub
          </ButtonLink>
          <ButtonLink
            href={article.sourceUrl}
            variant="secondary"
            showIcon={false}
          >
            Original article
            <ExternalLink aria-hidden="true" size={17} strokeWidth={2.4} />
          </ButtonLink>
        </div>
      }
    >
      <article className="bg-white px-5 py-16 md:px-10 md:py-24 lg:px-18">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.28fr_0.72fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-north-line bg-[#f8faf9] p-5">
              <p className="text-xs font-extrabold uppercase text-north-teal">
                Medina Clean
              </p>
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="font-bold text-north-ink">Published</dt>
                  <dd className="mt-1 text-north-muted">
                    {article.published}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-north-ink">Format</dt>
                  <dd className="mt-1 text-north-muted">
                    Native Northvalley case-study page
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-north-ink">Series</dt>
                  <dd className="mt-1 text-north-muted">
                    {medinaCleanCaseStudy.name}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
          <div className="grid gap-12">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[clamp(1.8rem,3vw,2.7rem)] font-black leading-tight tracking-normal">
                  {section.heading}
                </h2>
                <div className="mt-5 grid gap-5">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-lg leading-8 text-north-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.points ? (
                  <ul className="mt-7 grid gap-3 md:grid-cols-2">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-lg border border-north-line bg-[#f8faf9] p-4 text-sm font-semibold leading-6 text-[#384653]"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="border-y border-north-line bg-[#eef2f3] px-5 py-16 md:px-10 md:py-24 lg:px-18">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
              Continue the series
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight tracking-normal">
              See the surrounding operational story.
            </h2>
          </div>
          <ArticleCards />
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
