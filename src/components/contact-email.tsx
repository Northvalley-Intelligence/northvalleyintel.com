import { siteConfig } from "@/lib/site";

/**
 * Cloudflare Email Obfuscation rewrites any mailto: href and any visible email
 * address it finds in the HTML into a /cdn-cgi/l/email-protection link. On this
 * site that destination 404s, which is the broken internal link the 2026-09-07
 * evaluation found on the home page ("Broken internal link found on the home
 * page: the destination /cdn-cgi/l/email-protection returns 404").
 *
 * The documented opt-out is a pair of HTML comments around the region to leave
 * alone. React will not render a bare comment node, so the whole region is
 * emitted as raw HTML instead. Every rendered address and every mailto anchor
 * on the site goes through this file, so the markers cannot be forgotten on a
 * new surface.
 */

/** Escape a value that is about to be interpolated into raw HTML. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailOff(inner: string) {
  return `<!--email_off-->${inner}<!--/email_off-->`;
}

/**
 * Prose that may mention the address inline — the legal pages do, three times.
 * Returns HTML with only the address wrapped, so the surrounding sentence is
 * untouched. Callers render it with dangerouslySetInnerHTML.
 */
export function protectEmails(text: string) {
  return escapeHtml(text)
    .split(siteConfig.email)
    .join(emailOff(siteConfig.email));
}

/** The address as plain text, protected from the rewriter. */
export function ContactEmailText({ className }: { className?: string }) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{
        __html: emailOff(escapeHtml(siteConfig.email)),
      }}
    />
  );
}

/**
 * The address as a mailto link, protected from the rewriter.
 *
 * Note this is deliberately no longer the primary contact call to action —
 * that path is the /intake form. This stays for visitors who prefer email.
 */
export function ContactEmailLink({
  className,
  subject,
}: {
  className?: string;
  subject?: string;
}) {
  const href = subject
    ? `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${siteConfig.email}`;

  const anchor = `<a class="${escapeHtml(className ?? "")}" href="${escapeHtml(
    href,
  )}">${escapeHtml(siteConfig.email)}</a>`;

  return (
    <span
      className="contents"
      dangerouslySetInnerHTML={{ __html: emailOff(anchor) }}
    />
  );
}
