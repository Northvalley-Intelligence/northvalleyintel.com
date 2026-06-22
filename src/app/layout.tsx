import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Local business consulting",
  keywords: [
    "local business AI consulting",
    "website growth assessment",
    "AI search optimization",
    "answer engine optimization",
    "lead generation assessment",
    "workflow automation",
    "Cobb County business",
    "Paulding County business",
    "Douglas County business",
    "Marietta business consultant",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/json": "/source-website-assessment.json",
      "text/plain": "/llms.txt",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    other: {
      "msvalidate.01": "7F36D3DB13BB994DD9C10CA3F85AEDEA",
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} brand card`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og.svg"],
  },
  icons: {
    icon: "/brand-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1NJPFKQC56"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1NJPFKQC56');
          `}
        </Script>
      </body>
    </html>
  );
}
