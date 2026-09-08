import type { Metadata } from "next";
import { ArrowLeft, MapPinned, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { coreServices, serviceAreas, siteConfig } from "@/lib/site";

type Params = { city: string };

/** Static export: every city page is generated at build time. */
export function generateStaticParams(): Params[] {
  return serviceAreas.map((area) => ({ city: area.slug }));
}

function findArea(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city } = await params;
  const area = findArea(city);

  if (!area) {
    return {};
  }

  const title = `Custom Software & AI for ${area.city}, GA`;
  const description = `Northvalley Intelligence builds custom software, workflow automation, and AI assistants for ${area.city}, Georgia businesses in ${area.county}, from Marietta. Free website growth assessment.`;

  return {
    title,
    description,
    alternates: { canonical: `/service-areas/${area.slug}` },
    openGraph: {
      title: `${title} | Northvalley Intelligence`,
      description,
      url: `${siteConfig.url}/service-areas/${area.slug}`,
    },
  };
}

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city } = await params;
  const area = findArea(city);

  if (!area) {
    notFound();
  }

  const pageUrl = `${siteConfig.url}/service-areas/${area.slug}`;

  // LocalBusiness with areaServed set to this one city, contained in its
  // county. This is the machine-resolvable "we work here" signal the
  // 2026-09-07 evaluation reported missing in both Local Visibility and AI
  // Discoverability.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${pageUrl}#localbusiness`,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    parentOrganization: { "@id": `${siteConfig.url}/#organization` },
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    logo: `${siteConfig.url}/northvalley-logo.png`,
    image: `${siteConfig.url}/assessment-flow.webp`,
    sameAs: ["https://feroshjacob.github.io/posts/", siteConfig.mapsUrl],
    hasMap: siteConfig.mapsUrl,
    description: `Custom software, workflow automation, AI assistants, and website growth assessments for businesses in ${area.city}, Georgia.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marietta",
      addressRegion: "GA",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: area.city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: area.county,
        containedInPlace: {
          "@type": "State",
          name: "Georgia",
        },
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Northvalley Intelligence services in ${area.city}, GA`,
      itemListElement: coreServices.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.detail,
          areaServed: { "@type": "City", name: area.city },
        },
      })),
    },
  };

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%)] px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto max-w-4xl">
            <Link
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-north-teal hover:text-north-ink"
              href="/service-areas"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              All service areas
            </Link>
            <p className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase text-north-teal">
              <MapPinned aria-hidden="true" size={17} />
              {area.county}, Georgia
            </p>
            <h1 className="text-[clamp(2rem,4.6vw,3.6rem)] font-black leading-[1.05] tracking-normal text-north-ink">
              Custom software &amp; AI for {area.city}, GA businesses
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#42505d]">
              Northvalley Intelligence is a custom software company based in
              Marietta, Georgia. We work with {area.city} businesses in{" "}
              {area.county} on the whole path a customer takes: being found,
              turning interest into a real lead, and organizing the follow-up,
              scheduling, and repeated work that happens after someone reaches
              out.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#42505d]">
              {area.note} Work happens remotely and in person as it suits the
              business, and every engagement starts with a conversation with the
              owner of the firm rather than an account manager.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#42505d]">
              There is no {area.city}-specific product. The four services below
              are shaped around how each business actually operates. The free
              website growth assessment is what tells us which one is worth
              doing first.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/#website-assessment">
                Request the free assessment
              </ButtonLink>
              <a
                className="inline-flex items-center gap-2 text-lg font-bold text-north-ink hover:text-north-teal"
                href={siteConfig.phoneHref}
              >
                <Phone aria-hidden="true" size={19} strokeWidth={2.4} />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-extrabold text-north-ink">
              What we do for {area.city} businesses
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {coreServices.map((service) => (
                <article
                  key={service.name}
                  className="rounded-lg border border-north-line bg-white p-5"
                >
                  <h3 className="text-lg font-extrabold text-north-ink">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-north-muted">
                    {service.detail}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-base leading-7 text-north-muted">
              Northvalley&apos;s published client work is listed on the{" "}
              <Link className="font-bold text-north-teal" href="/#client-work">
                home page
              </Link>
              , and who does the work is on the{" "}
              <Link className="font-bold text-north-teal" href="/about">
                about page
              </Link>
              . Nothing on this page claims a project or a customer in{" "}
              {area.city} that is not listed there.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter width="max-w-4xl" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
