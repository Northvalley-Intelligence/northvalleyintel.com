import {
  BrainCircuit,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileCheck2,
  FileSearch,
  Globe2,
  MessagesSquare,
  Languages,
  MapPinned,
  MessageSquareText,
  MousePointerClick,
  Quote,
  Route,
  SearchCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import Image from "next/image";

import { EngagementChatMockup } from "@/components/engagement-chat-mockup";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { WebsiteAssessmentTeaserForm } from "@/components/website-assessment-teaser-form";
import { medinaCleanCaseStudy } from "@/lib/case-studies";
import {
  aeoAnswers,
  assessments,
  clientTestimonials,
  clientWork,
  industries,
  leadDiscoveryPoints,
  medinaCaseStudy,
  medinaOutcomes,
  medinaPrinciples,
  services,
  siteConfig,
  teamMembers,
} from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  logo: `${siteConfig.url}/northvalley-logo.png`,
  image: `${siteConfig.url}/assessment-flow.png`,
  sameAs: ["https://feroshjacob.github.io/posts/"],
  areaServed: siteConfig.serviceArea.map((area) => ({
    "@type": area.includes("County") ? "AdministrativeArea" : "City",
    name: area,
  })),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marietta",
    addressRegion: "GA",
    addressCountry: "US",
  },
  knowsAbout: [
    "Local business lead generation",
    "AI search optimization",
    "Answer engine optimization",
    "Website growth assessments",
    "Workflow automation",
    "Operational AI",
    "Lead conversion workflows",
  ],
  description: siteConfig.description,
  serviceType: [
    "Local Business Lead Generation Assessment",
    "Lead Conversion Workflow Consulting",
    "Operational AI Assessment",
    "Website Growth Assessment",
    "Workflow Intelligence Consulting",
  ],
  review: clientTestimonials.map((testimonial) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: testimonial.client,
    },
    itemReviewed: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    reviewBody: testimonial.quote,
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Assessment-led implementation examples",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Medina Clean operations case study",
          url: `${siteConfig.url}${medinaCleanCaseStudy.href}`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Local website growth teaser report",
          url: `${siteConfig.url}/#website-assessment`,
        },
      },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: aeoAnswers.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="border-b border-north-line bg-north-ink">
          <div className="mx-auto max-w-[1600px]">
            <Image
              src="/assessment-flow.png"
              alt="A Northvalley assessment flow showing Understand, Qualify, and Schedule."
              width={1536}
              height={1024}
              className="w-full object-cover"
            />
          </div>
        </section>

        <section
          id="workflow-chat"
          className="bg-[linear-gradient(180deg,#f8faf9,white)] px-5 py-16 md:px-10 md:py-20 lg:px-18"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase text-north-teal">
                Local growth and practical AI support
              </p>
              <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1] tracking-normal text-north-ink">
                Let&apos;s untangle the work.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#42505d] md:text-xl">
                We help local businesses get found, turn interest into real
                leads, and clean up the workflow that happens after someone
                reaches out.
              </p>
              <div className="mt-5 grid gap-3 text-sm font-semibold text-[#384653] sm:grid-cols-3">
                {[
                  "Find better leads",
                  "Convert interest",
                  "Clean up the work",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-md border border-north-line bg-white/70 px-3 py-2"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="shrink-0 text-north-green"
                      size={17}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#workflow-chat">
                  Share what is not working
                </ButtonLink>
                <ButtonLink href="#assessments" variant="secondary">
                  See how we start
                </ButtonLink>
              </div>
              <p className="mt-8 text-xs font-extrabold uppercase text-north-teal">
                Common service businesses we support
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <span
                    key={industry}
                    className="rounded-md bg-[#eef3f3] px-3 py-2 text-sm font-semibold text-[#33414d]"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
            <EngagementChatMockup />
          </div>
        </section>

        <section
          aria-label="Workflow divider"
          className="bg-white px-5 py-10 md:px-10 lg:px-18"
        >
          <div className="mx-auto flex max-w-5xl items-center gap-5">
            <div className="h-px flex-1 bg-north-line" />
            <div className="flex items-center gap-3 text-sm font-extrabold uppercase text-north-teal">
              <span className="h-2.5 w-2.5 rounded-full bg-north-teal" />
              Find
              <span className="h-px w-10 bg-north-line" />
              Convert
              <span className="h-px w-10 bg-north-line" />
              Simplify
              <span className="h-2.5 w-2.5 rounded-full bg-north-amber" />
            </div>
            <div className="h-px flex-1 bg-north-line" />
          </div>
        </section>

        <section
          id="services"
          className="bg-[#f8faf9] px-5 py-20 md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                Services
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                From getting found to getting the work done.
              </h2>
              <p className="mt-5 text-lg leading-8 text-north-muted">
                We look at the full path for a local business: how customers
                find you, what makes them reach out, and what has to happen
                behind the scenes to serve them well.
              </p>
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="relative pl-8">
                <div className="absolute bottom-8 left-[1.05rem] top-8 w-px bg-north-line" />
                {[
                  {
                    label: "Get found",
                    detail:
                      "Google, AI search, referrals, local pages, and service questions",
                    icon: SearchCheck,
                  },
                  {
                    label: "Convert leads",
                    detail:
                      "Clear offers, trust signals, forms, calls, estimates, and booking",
                    icon: MessageSquareText,
                  },
                  {
                    label: "Run the work",
                    detail:
                      "Follow-up, scheduling, customer details, handoffs, and repeat work",
                    icon: Route,
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="relative grid gap-2 pb-10 last:pb-0"
                    >
                      <div className="absolute -left-8 top-0 grid h-9 w-9 place-items-center rounded-full border border-north-line bg-white text-north-teal shadow-sm">
                        <Icon aria-hidden="true" size={18} />
                      </div>
                      <p className="text-xs font-black uppercase text-north-amber">
                        Step {index + 1}
                      </p>
                      <h3 className="text-2xl font-extrabold">{item.label}</h3>
                      <p className="max-w-md text-base leading-7 text-north-muted">
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-7">
                {services.map((service, index) => {
                  const Icon = [SearchCheck, MousePointerClick, ClipboardList][
                    index
                  ];

                  return (
                    <article
                      key={service.title}
                      className="grid gap-4 border-b border-north-line pb-7 last:border-b-0 last:pb-0 sm:grid-cols-[3.5rem_1fr]"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-north-ink text-white">
                        <Icon aria-hidden="true" size={22} />
                      </div>
                      <div>
                        <span className="text-sm font-black text-north-amber">
                          {service.number}
                        </span>
                        <h3 className="mt-1 text-2xl font-extrabold">
                          {service.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-north-muted">
                          {service.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
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
                Getting Started
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                We start by understanding what is happening now.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {assessments.map((assessment) => (
                <article
                  key={assessment.title}
                  className="grid gap-5 border-t border-north-line pt-7 md:grid-cols-[3.5rem_1fr]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-north-ink shadow-sm">
                    {assessment.title.startsWith("Operational") ? (
                      <BrainCircuit aria-hidden="true" size={24} />
                    ) : (
                      <SearchCheck aria-hidden="true" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">
                      {assessment.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-north-muted">
                      {assessment.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                      {assessment.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm font-semibold text-[#384653]"
                        >
                          <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-north-green"
                            size={17}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 md:px-10 md:py-28 lg:px-18">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                When Leads Are Slow
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                Sometimes the problem is being found and trusted.
              </h2>
              <p className="mt-5 text-lg leading-8 text-north-muted">
                For realtors, cleaners, contractors, consultants, and other
                service businesses, more software will not fix a weak lead path.
                We look at how people discover the business, what makes them
                trust it, and what they are asked to do next.
              </p>
            </div>

            <div className="grid gap-8">
              {leadDiscoveryPoints.map((point, index) => {
                const Icon = [
                  FileSearch,
                  MessagesSquare,
                  Store,
                  MousePointerClick,
                ][index];

                return (
                  <article
                    key={point.title}
                    className="grid gap-4 border-b border-north-line pb-7 last:border-b-0 last:pb-0 sm:grid-cols-[3.5rem_1fr]"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eef3f3] text-north-teal">
                      <Icon aria-hidden="true" size={22} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold">{point.title}</h3>
                      <p className="mt-3 text-base leading-7 text-north-muted">
                        {point.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="website-assessment"
          className="border-y border-north-line bg-[#f8faf9] px-5 py-20 md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                Website Check
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                See whether your website is helping local customers choose you.
              </h2>
              <p className="mt-5 text-lg leading-8 text-north-muted">
                This is not a generic SEO score, security scan, or technical
                website doctor. We look at the public signals that matter when a
                nearby customer is deciding who to call, trust, or ask for a
                quote.
              </p>
              <p className="mt-4 text-base leading-7 text-north-muted">
                The teaser report gives a short read on local visibility, trust,
                AI-answer readiness, and the path from interest to lead. The
                complete paid assessment includes the evidence trail, page-level
                findings, scoring logic, and a prioritized fix plan.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {[
                  {
                    label: "Local demand",
                    detail: "Focused on Cobb, Paulding, and Douglas counties.",
                    icon: MapPinned,
                  },
                  {
                    label: "AI discovery",
                    detail:
                      "Checks whether public pages are clear enough for answer engines.",
                    icon: Globe2,
                  },
                  {
                    label: "Lead path",
                    detail:
                      "Looks for trust proof, calls to action, and contact friction.",
                    icon: FileCheck2,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.label}
                      className="border-t border-north-line pt-5"
                    >
                      <Icon
                        aria-hidden="true"
                        className="text-north-teal"
                        size={24}
                      />
                      <h3 className="mt-4 text-lg font-extrabold">
                        {item.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-north-muted">
                        {item.detail}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div>
              <WebsiteAssessmentTeaserForm />
              <p className="mt-4 text-sm leading-6 text-north-muted">
                We email the one-page teaser instead of showing the full report
                in the browser. Public website pages only.
              </p>
            </div>
          </div>
        </section>

        <section
          id="local-ai-answers"
          className="bg-white px-5 py-20 md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                Plain Answers
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                Useful facts for owners, search engines, and AI assistants.
              </h2>
              <p className="mt-5 text-lg leading-8 text-north-muted">
                We write the site so people and answer engines can understand
                who we help, where we work, and what kind of problems we solve.
                That is part of the work we help local businesses do too.
              </p>
            </div>
            <div className="grid gap-6">
              {aeoAnswers.map((item) => (
                <article
                  key={item.question}
                  className="border-b border-north-line pb-6 last:border-b-0 last:pb-0"
                >
                  <h3 className="text-xl font-extrabold text-north-ink">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-north-muted">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="client-work"
          className="border-y border-north-line bg-[#f8faf9] px-5 py-20 md:px-10 md:py-28 lg:px-18"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                  Client Work
                </p>
                <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
                  Public proof from real businesses.
                </h2>
              </div>
              <p className="max-w-3xl text-lg leading-8 text-north-muted">
                These are not shown as website trophies. They are examples of
                practical customer-facing systems: clear offers, trust signals,
                calls, quote paths, service details, and the first pieces of a
                larger business workflow.
              </p>
            </div>

            <div className="mt-14 grid gap-9 lg:grid-cols-2">
              {clientWork.map((client) => (
                <article
                  key={client.name}
                  className="border-t border-north-line pt-7"
                >
                  <a
                    className="group block"
                    href={client.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="overflow-hidden rounded-lg border border-north-line bg-white shadow-[0_22px_55px_rgba(20,32,42,0.10)]">
                      <div className="flex h-10 items-center gap-2 border-b border-north-line bg-[#f4f7f6] px-4">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#d8614c]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e6c26e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-north-green" />
                        <span className="ml-3 truncate text-xs font-bold text-north-muted">
                          {client.url.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                      <Image
                        src={client.image}
                        alt={client.alt}
                        width={1440}
                        height={1000}
                        className="aspect-[16/10] w-full object-cover object-top transition duration-500 group-hover:scale-[1.015]"
                      />
                    </div>
                  </a>

                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase text-north-amber">
                        {client.focus}
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold">
                        {client.name}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-north-teal">
                        {client.client}
                      </p>
                    </div>
                    <a
                      className="inline-flex items-center gap-2 text-sm font-bold text-north-ink hover:text-north-teal"
                      href={client.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Visit site
                      <ExternalLink
                        aria-hidden="true"
                        size={15}
                        strokeWidth={2.4}
                      />
                    </a>
                  </div>
                  <p className="mt-4 text-base leading-7 text-north-muted">
                    {client.outcome}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {client.signals.map((signal) => (
                      <li
                        key={signal}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#384653] shadow-sm"
                      >
                        {signal}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-16 grid gap-8 border-t border-north-line pt-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div>
                <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
                  What Clients Say
                </p>
                <h3 className="text-[clamp(1.8rem,3vw,2.7rem)] font-black leading-tight tracking-normal">
                  The work should feel useful to the owner first.
                </h3>
              </div>
              <div className="grid gap-6">
                {clientTestimonials.map((testimonial) => (
                  <figure
                    key={testimonial.client}
                    className="grid gap-6 rounded-lg border border-north-line bg-white p-5 shadow-[0_20px_50px_rgba(20,32,42,0.10)] md:grid-cols-[0.92fr_1.08fr] md:items-center"
                  >
                    <div>
                      <Quote
                        aria-hidden="true"
                        className="text-north-teal"
                        size={30}
                      />
                      <blockquote className="mt-4 text-2xl font-extrabold leading-tight text-north-ink">
                        {testimonial.quote}
                      </blockquote>
                      <figcaption className="mt-4 text-sm font-bold text-north-muted">
                        {testimonial.client}, {testimonial.company}
                      </figcaption>
                    </div>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.alt}
                      width={1300}
                      height={698}
                      className="w-full rounded-md border border-north-line object-cover"
                    />
                  </figure>
                ))}
              </div>
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
                Real Example
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
                  href={medinaCleanCaseStudy.href}
                  variant="light"
                  showIcon={false}
                >
                  Read the case study
                </ButtonLink>
              </div>
            </div>
            <div>
              <div className="grid gap-5">
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
                      className="grid gap-4 border-b border-white/12 pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[3rem_1fr]"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-[#e6c26e] text-north-ink">
                        <Icon aria-hidden="true" size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          {outcome.label}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#dbe5eb]">
                          {outcome.detail}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="mt-8 border-t border-white/12 pt-6">
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
            <div className="grid gap-6 md:grid-cols-3">
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
                  className="border-l-2 border-north-teal pl-5"
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
            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="border-t border-north-line pt-6"
                >
                  <div className="mb-5 overflow-hidden rounded-lg bg-[#eef2f3]">
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
                  {"links" in member && member.links?.length ? (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {member.links.map((link) => (
                        <a
                          key={link.url}
                          className="inline-flex items-center gap-2 text-sm font-bold text-north-teal hover:text-north-ink"
                          href={link.url}
                        >
                          {link.label}
                          <ExternalLink
                            aria-hidden="true"
                            size={15}
                            strokeWidth={2.4}
                          />
                        </a>
                      ))}
                    </div>
                  ) : null}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
