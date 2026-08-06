import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import {
  CaseStudyShell,
  ContactBand,
} from "@/components/case-studies/case-study-shell";
import { ButtonLink } from "@/components/ui/button";
import {
  chatgptBookingClips,
  chatgptBookingDemo,
  chatgptBookingFaq,
  chatgptBookingTranscript,
} from "@/lib/chatgpt-booking-demo";
import { siteConfig } from "@/lib/site";

const pageUrl = `${siteConfig.url}/case-studies/${chatgptBookingDemo.slug}`;

export const metadata: Metadata = {
  title: "Booking Inside ChatGPT: A Woodstock Cleaning Company, Live",
  description: chatgptBookingDemo.lede,
  alternates: { canonical: `/case-studies/${chatgptBookingDemo.slug}` },
  openGraph: {
    title: chatgptBookingDemo.title,
    description: chatgptBookingDemo.lede,
    url: pageUrl,
    type: "video.other",
    images: [{ url: chatgptBookingDemo.thumbnailUrl, width: 1280, height: 720 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoObject",
      name: "How a Local Business Takes Bookings Inside ChatGPT",
      description:
        "Unedited screen recording of Medina Clean, a house cleaning company in Woodstock, GA, answering service-area, pricing, booking and Spanish-language questions from inside ChatGPT via a connector built by Northvalley Intelligence.",
      thumbnailUrl: chatgptBookingDemo.thumbnailUrl,
      uploadDate: chatgptBookingDemo.uploadDate,
      duration: chatgptBookingDemo.durationIso,
      embedUrl: chatgptBookingDemo.embedUrl,
      inLanguage: ["en", "es"],
      mainEntityOfPage: pageUrl,
      publisher: {
        "@type": "Organization",
        name: siteConfig.legalName,
        url: siteConfig.url,
      },
      about: {
        "@type": "LocalBusiness",
        name: "Medina Clean",
        url: "https://medinaclean.com",
        areaServed: {
          "@type": "PostalAddress",
          addressLocality: "Woodstock",
          addressRegion: "GA",
          postalCode: "30188",
        },
      },
      hasPart: chatgptBookingClips.map((clip) => ({
        "@type": "Clip",
        name: clip.name,
        startOffset: clip.startOffset,
        endOffset: clip.endOffset,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: chatgptBookingFaq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function ChatgptBookingCaseStudyPage() {
  return (
    <CaseStudyShell
      eyebrow={chatgptBookingDemo.eyebrow}
      title={chatgptBookingDemo.title}
      description={chatgptBookingDemo.lede}
      image="/case-study-website-chat.svg"
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#recording">Watch the recording</ButtonLink>
          <ButtonLink
            href="https://medinaclean.com"
            variant="secondary"
            showIcon={false}
          >
            View Medina Clean
            <ExternalLink aria-hidden="true" size={17} strokeWidth={2.4} />
          </ButtonLink>
        </div>
      }
    >
      <section
        id="recording"
        className="px-5 py-16 md:px-10 md:py-24 lg:px-18"
      >
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-lg border border-north-line bg-black shadow-[0_24px_60px_rgba(20,32,42,0.12)]">
            <iframe
              className="aspect-video w-full"
              src={chatgptBookingDemo.embedUrl}
              title="Medina Clean taking a booking request inside ChatGPT"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-sm text-north-muted">
            {chatgptBookingDemo.durationLabel}. No narration.{" "}
            {chatgptBookingDemo.demoDataNote}
          </p>

          <div className="mt-10 grid gap-5">
            {chatgptBookingDemo.body.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-north-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-north-line bg-[#eef2f3] p-6">
            <h2 className="text-xl font-extrabold">
              What the recording does and does not show
            </h2>
            <ul className="mt-4 grid gap-3 text-base leading-7 text-north-muted">
              <li>
                It shows a booking <strong>request</strong> with a pending-review
                status. Rosa reviews the address and preferred timing, then
                contacts the customer to finalize. It is not a confirmed
                appointment.
              </li>
              <li>
                The $150 figure is a <strong>starting</strong> estimate for 3
                bedrooms and 2 bathrooms every 2 weeks. Rosa confirms the final
                price after seeing the property.
              </li>
              <li>{chatgptBookingDemo.demoDataNote}</li>
              <li>{chatgptBookingDemo.terminologyNote}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-north-line bg-white px-5 py-16 md:px-10 md:py-24 lg:px-18">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
            Full transcript
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
            Everything said in the recording.
          </h2>
          <div className="mt-10 grid gap-8">
            {chatgptBookingTranscript.map((entry) => (
              <article
                key={entry.time}
                className="grid gap-3 border-t border-north-line pt-6 sm:grid-cols-[5rem_1fr]"
              >
                <div>
                  <p className="text-sm font-black text-north-amber">
                    {entry.time}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase text-[#667482]">
                    {entry.heading}
                  </p>
                </div>
                <div className="grid gap-3">
                  {entry.lines.map((line) => (
                    <p
                      key={line.text}
                      className="text-base leading-7 text-north-muted"
                    >
                      {line.speaker ? (
                        <span className="font-bold text-north-ink">
                          {line.speaker}:{" "}
                        </span>
                      ) : null}
                      {line.text}
                    </p>
                  ))}
                  {entry.toolCalled ? (
                    <p className="text-sm font-semibold text-north-teal">
                      Tool called: {entry.toolCalled}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eef2f3] px-5 py-16 md:px-10 md:py-24 lg:px-18">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-extrabold uppercase text-north-teal">
            Common questions
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight tracking-normal">
            What owners ask about this.
          </h2>
          <div className="mt-10 grid gap-5">
            {chatgptBookingFaq.map((item) => (
              <article
                key={item.question}
                className="rounded-lg border border-north-line bg-white p-6"
              >
                <h3 className="text-xl font-extrabold">{item.question}</h3>
                <p className="mt-3 text-base leading-7 text-north-muted">
                  {item.answer}
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
