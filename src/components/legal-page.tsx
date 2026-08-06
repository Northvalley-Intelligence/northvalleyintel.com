import { SiteHeader } from "@/components/site-header";
import { legalUpdated } from "@/lib/legal";
import { siteConfig } from "@/lib/site";

type Section = {
  heading: string;
  body: string[];
  points?: string[];
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%)] px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
              {eyebrow}
            </p>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black leading-[1.02] tracking-normal text-north-ink">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#42505d]">{intro}</p>
            <p className="mt-4 text-sm font-semibold text-north-muted">
              Last updated {legalUpdated}
            </p>
          </div>
        </section>

        <section className="px-5 py-14 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto grid max-w-4xl gap-10">
            {sections.map((section) => (
              <article key={section.heading}>
                <h2 className="text-2xl font-extrabold text-north-ink">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-base leading-7 text-north-muted"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.points ? (
                  <ul className="mt-4 grid gap-3">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="border-l-2 border-north-line pl-4 text-base leading-7 text-north-muted"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-[#111820] px-5 py-6 text-sm text-[#cbd5dc] md:px-10 lg:px-18">
        <div className="mx-auto flex max-w-4xl flex-col justify-between gap-2 sm:flex-row">
          <span>{siteConfig.legalName}</span>
          <span>{siteConfig.email}</span>
        </div>
      </footer>
    </>
  );
}
