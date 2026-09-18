import type { Metadata } from "next";
import { MapPinned } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { serviceAreas, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "The Cobb and Douglas county cities Northvalley Intelligence serves from Marietta, Georgia, with a page for each.",
  alternates: { canonical: "/service-areas" },
  openGraph: {
    title: "Service Areas | Northvalley Intelligence",
    description:
      "The Cobb and Douglas county cities Northvalley Intelligence serves from Marietta, Georgia.",
    url: `${siteConfig.url}/service-areas`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteConfig.url}/service-areas#page`,
  name: "Northvalley Intelligence service areas",
  url: `${siteConfig.url}/service-areas`,
  about: { "@id": `${siteConfig.url}/#organization` },
  hasPart: serviceAreas.map((area) => ({
    "@type": "WebPage",
    name: `${area.city}, GA`,
    url: `${siteConfig.url}/service-areas/${area.slug}`,
  })),
};

export default function ServiceAreasPage() {
  // All three counties from the Google Business Profile description get a
  // visible, matching header here (Cobb, Paulding, Douglas) — previously
  // only Cobb and Douglas (the ones with city pages) had a section, and
  // Paulding lived only in the schema's areaServed array and a footnote.
  const counties = ["Cobb County", "Paulding County", "Douglas County"];

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%)] px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase text-north-teal">
              <MapPinned aria-hidden="true" size={17} />
              Service areas
            </p>
            <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.02] tracking-normal text-north-ink">
              Where Northvalley works.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#42505d]">
              Northvalley Intelligence is a custom software company based in
              Marietta, Georgia. We work with service businesses across Cobb and
              Douglas counties on the path from being found, to turning interest
              into real leads, to organizing the work that happens after someone
              reaches out.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#42505d]">
              There is no city-specific product. Each page below says the same
              honest thing: what we do, that we do it from Marietta, and how to
              start. The free website growth assessment is what tells us which
              piece is worth doing first for a particular business.
            </p>
            <div className="mt-8">
              <ButtonLink href="/#website-assessment">
                Request the free assessment
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto grid max-w-4xl gap-10">
            {counties.map((county) => {
              const areas = serviceAreas.filter(
                (area) => area.county === county,
              );

              return (
                <div key={county}>
                  <h2 className="text-2xl font-extrabold text-north-ink">
                    Software consultant &amp; AI consultant serving {county}
                  </h2>
                  {areas.length > 0 ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {areas.map((area) => (
                        <Link
                          key={area.slug}
                          href={`/service-areas/${area.slug}`}
                          className="rounded-md border border-north-line bg-white p-4 hover:border-north-teal"
                        >
                          <span className="font-extrabold text-north-ink">
                            {area.city}, GA
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-north-muted">
                            {area.note}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-base leading-7 text-north-muted">
                      Northvalley works with {county} businesses on the same
                      custom software, workflow automation, and AI consulting
                      path described above, from the Marietta base &mdash;
                      there is no dedicated {county} city page yet.
                    </p>
                  )}
                </div>
              );
            })}
            <p className="text-base leading-7 text-north-muted">
              Northvalley also works with businesses in the wider Atlanta
              metro, and remotely beyond it. If a city is not listed, ask.
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
