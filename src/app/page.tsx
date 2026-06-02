import {
  BrainCircuit,
  CalendarCheck2,
  CheckCircle2,
  ExternalLink,
  Languages,
  MapPinned,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

import { OperationsVisual } from "@/components/operations-visual";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import {
  assessments,
  industries,
  medinaCaseStudy,
  medinaOutcomes,
  medinaPrinciples,
  services,
  siteConfig,
  teamMembers,
} from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.legalName,
  url: siteConfig.url,
  email: siteConfig.email,
  areaServed: ["Marietta", "Atlanta", "United States"],
  description: siteConfig.description,
  serviceType: [
    "Operational AI Assessment",
    "Knowledge Chaos Assessment",
    "Workflow Intelligence Consulting",
    "Small Business Operations System",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Assessment-led implementation examples",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Medina Clean operations case study",
          url: medinaCaseStudy.url,
        },
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="bg-[linear-gradient(130deg,rgba(23,123,112,0.12),transparent_38%),linear-gradient(315deg,rgba(31,95,139,0.12),transparent_42%)] px-5 py-16 md:px-10 md:py-24 lg:px-18">
          <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                Boutique operational AI consultancy
              </p>
              <h1 className="max-w-5xl text-[clamp(3rem,8vw,5.9rem)] font-black leading-[0.97] tracking-normal text-north-ink">
                Operational AI for Real-World Businesses
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#42505d] md:text-2xl">
                Northvalley Intelligence helps service and field-operation
                businesses turn scattered workflows, tribal knowledge, and
                customer coordination into practical operating systems.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={`mailto:${siteConfig.email}?subject=Operational AI Assessment`}
                >
                  Schedule an assessment
                </ButtonLink>
                <ButtonLink href="#assessments" variant="secondary">
                  Explore assessments
                </ButtonLink>
              </div>
            </div>
            <OperationsVisual />
          </div>
        </section>

        <section className="border-y border-north-line bg-white px-5 py-5 md:px-10 lg:px-18">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
            {industries.map((industry) => (
              <span
                key={industry}
                className="rounded-md bg-[#eef3f3] px-3 py-2 text-sm font-semibold text-[#33414d]"
              >
                {industry}
              </span>
            ))}
          </div>
        </section>

        <section
          id="services"
          className="px-5 py-20 md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                Services
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                Practical modernization, built around how work actually moves.
              </h2>
            </div>
            <div className="grid gap-4">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="rounded-lg border border-north-line bg-white p-6"
                >
                  <span className="text-sm font-black text-north-amber">
                    {service.number}
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-north-muted">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="assessments"
          className="bg-[#eef2f3] px-5 py-20 md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                Assessments
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                An assessment-first approach for operational clarity.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {assessments.map((assessment) => (
                <article
                  key={assessment.title}
                  className="rounded-lg border border-north-line bg-white p-7"
                >
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-md bg-north-ink text-white">
                    {assessment.title.startsWith("Operational") ? (
                      <BrainCircuit aria-hidden="true" size={24} />
                    ) : (
                      <SearchCheck aria-hidden="true" size={24} />
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold">
                    {assessment.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-north-muted">
                    {assessment.description}
                  </p>
                  <ul className="mt-6 grid gap-3">
                    {assessment.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[#384653]">
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-north-green"
                          size={18}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="case-study"
          className="bg-north-ink px-5 py-20 text-white md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-[#77c0b7]">
                First Use Case
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                {medinaCaseStudy.name}: from website request to operating
                foundation
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#c6d0d8]">
                {medinaCaseStudy.context}
              </p>
              <p className="mt-5 text-lg leading-8 text-[#c6d0d8]">
                {medinaCaseStudy.summary}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={medinaCaseStudy.url}
                  variant="light"
                  showIcon={false}
                >
                  View Medina Clean
                  <ExternalLink
                    aria-hidden="true"
                    size={17}
                    strokeWidth={2.4}
                  />
                </ButtonLink>
                <ButtonLink
                  href={medinaCaseStudy.sourceUrl}
                  variant="light"
                  showIcon={false}
                >
                  Read the background
                  <ExternalLink
                    aria-hidden="true"
                    size={17}
                    strokeWidth={2.4}
                  />
                </ButtonLink>
              </div>
            </div>
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {medinaOutcomes.map((outcome, index) => {
                  const Icon = [
                    Languages,
                    MessageSquareText,
                    ShieldCheck,
                    CalendarCheck2,
                  ][index];

                  return (
                    <article
                      key={outcome.label}
                      className="rounded-lg border border-white/12 bg-white/8 p-5"
                    >
                      <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-[#e6c26e] text-north-ink">
                        <Icon aria-hidden="true" size={22} />
                      </div>
                      <h3 className="text-lg font-extrabold text-white">
                        {outcome.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#dbe5eb]">
                        {outcome.detail}
                      </p>
                    </article>
                  );
                })}
              </div>
              <div className="mt-5 rounded-lg border border-white/12 bg-white/8 p-5">
                <h3 className="text-lg font-extrabold">
                  What made it a Northvalley project
                </h3>
                <ul className="mt-4 grid gap-3">
                  {medinaPrinciples.map((principle) => (
                    <li
                      key={principle}
                      className="flex gap-3 text-sm leading-6 text-[#dbe5eb]"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[#77c0b7]"
                        size={18}
                      />
                      <span>{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-north-line bg-white px-5 py-16 md:px-10 md:py-20 lg:px-18">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                Implementation Notes
              </p>
              <h2 className="text-[clamp(1.8rem,3vw,2.7rem)] font-black leading-tight tracking-normal">
                The important work was operational shape, not just screens.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                [
                  "Assessment",
                  "Clarified the real workflow around leads, pricing, recurring customers, language, and follow-up.",
                ],
                [
                  "Build",
                  "Delivered a practical public site and private admin surface on low-cost infrastructure.",
                ],
                [
                  "Next layer",
                  "Created a foundation for scheduling, reminders, calendar coordination, and customer memory to improve over time.",
                ],
              ].map(([title, body]) => (
                <article
                  key={title}
                  className="rounded-lg border border-north-line bg-[#f8faf9] p-5"
                >
                  <h3 className="text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-north-muted">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-10 md:py-28 lg:px-18">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
              Brand Philosophy
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
              Modernization with respect for the people already doing the work.
            </h2>
            <p className="mt-5 max-w-4xl text-xl leading-8 text-north-muted">
              The goal is not to replace judgment with automation. The goal is
              operational clarity: preserved knowledge, cleaner handoffs,
              stronger follow-through, and AI systems that support the business.
            </p>
          </div>
        </section>

        <section
          id="people"
          className="border-t border-north-line bg-[#f8faf9] px-5 py-20 md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                People
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                Experienced builders for practical operational systems.
              </h2>
              <p className="mt-5 text-lg leading-8 text-north-muted">
                Northvalley Intelligence combines product judgment, AI depth,
                and hands-on implementation experience for businesses that need
                clear systems more than software theater.
              </p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="rounded-lg border border-north-line bg-white p-6"
                >
                  <div className="mb-5 overflow-hidden rounded-md border border-north-line bg-[#eef2f3]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={628}
                      height={835}
                      className="aspect-[4/3] w-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold">{member.name}</h3>
                    <p className="mt-1 text-sm font-bold uppercase text-north-teal">
                      {member.role}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-north-muted">
                    {member.description}
                  </p>
                  <a
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-north-ink hover:text-north-teal"
                    href={member.url}
                  >
                    View profile
                    <ExternalLink
                      aria-hidden="true"
                      size={16}
                      strokeWidth={2.4}
                    />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="border-t border-north-line bg-white px-5 py-14 md:px-10 lg:px-18"
        >
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase text-north-teal">
                <MapPinned aria-hidden="true" size={17} />
                {siteConfig.location}
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight tracking-normal">
                Start with an assessment conversation.
              </h2>
              <p className="mt-3 text-lg leading-8 text-north-muted">
                For operational businesses ready to modernize workflows and
                knowledge systems with practical AI.
              </p>
            </div>
            <ButtonLink
              className="w-full sm:w-auto"
              href={`mailto:${siteConfig.email}?subject=Operational AI Assessment`}
            >
              {siteConfig.email}
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="bg-[#111820] px-5 py-6 text-sm text-[#cbd5dc] md:px-10 lg:px-18">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 sm:flex-row">
          <span>{siteConfig.legalName}</span>
          <span>Operational knowledge and workflow intelligence</span>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
