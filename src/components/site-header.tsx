import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/#services", label: "Services" },
  { href: "/#assessments", label: "Getting Started" },
  { href: "/#website-assessment", label: "Website Check" },
  { href: "/#case-study", label: "Real Example" },
  { href: "/#people", label: "People" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-north-line/80 bg-north-paper/92 px-5 py-4 backdrop-blur md:px-10 lg:px-18">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link
          className="flex items-center gap-3 text-base font-bold text-north-ink"
          href="/"
          aria-label="Northvalley Intelligence home"
        >
          <Image
            src="/northvalley-logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="rounded-md"
          />
          <span>Northvalley Intelligence</span>
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-north-muted">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-north-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
