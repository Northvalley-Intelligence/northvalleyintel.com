import Link from "next/link";

import { ContactEmailLink } from "@/components/contact-email";
import { siteConfig } from "@/lib/site";

/**
 * The one footer.
 *
 * The home page, the case-study shell, and the legal pages each carried their
 * own near-copy before, which is how the site ended up publishing no phone
 * number and no link to its own Google Business Profile on any of them. One
 * component means the phone, the profile link, and the service-area and about
 * links land everywhere at once.
 */
export function SiteFooter({ width = "max-w-7xl" }: { width?: string }) {
  return (
    <footer className="bg-[#111820] px-5 py-7 text-sm text-[#cbd5dc] md:px-10 lg:px-18">
      <div
        className={`mx-auto flex ${width} flex-col justify-between gap-4 sm:flex-row sm:items-center`}
      >
        <div className="flex flex-col gap-1">
          <span className="font-bold text-white">{siteConfig.legalName}</span>
          <span>Marietta, Georgia — Cobb, Paulding, and Douglas counties</span>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <a
              className="font-bold text-white hover:text-[#8ee0d4]"
              href={siteConfig.phoneHref}
            >
              {siteConfig.phone}
            </a>
            <ContactEmailLink className="hover:text-white" />
            <a
              className="hover:text-white"
              href={siteConfig.mapsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Find us on Google
            </a>
          </span>
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <Link className="hover:text-white" href="/about">
              About
            </Link>
            <Link className="hover:text-white" href="/service-areas">
              Service areas
            </Link>
            <Link className="hover:text-white" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-white" href="/terms">
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
