import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { privacySections } from "@/lib/legal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Northvalley Intelligence collects, why, who receives it, how long it is kept, and how to ask for it to be removed.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Northvalley Intelligence",
    description:
      "What Northvalley Intelligence collects, why, who receives it, how long it is kept, and how to ask for it to be removed.",
    url: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="What we collect, and what we do with it."
      intro="Northvalley collects only what a request needs in order to be answered. We do not sell personal information, we do not run advertising trackers, and we do not use what you send us to train models."
      sections={privacySections}
    />
  );
}
