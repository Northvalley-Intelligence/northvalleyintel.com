import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { termsSections } from "@/lib/legal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using northvalleyintel.com and the Northvalley agent-native surface, including that submitted requests are requests rather than confirmed commitments.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | Northvalley Intelligence",
    description:
      "Terms for using northvalleyintel.com and the Northvalley agent-native surface.",
    url: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of use."
      intro="These terms cover this website and the agent-native surface. The short version: a request is a request. Nothing here books, confirms, charges, or commits either side to anything."
      sections={termsSections}
    />
  );
}
