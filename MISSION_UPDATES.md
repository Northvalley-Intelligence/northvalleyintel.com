# Mission Updates

## 2026-06-12

- Added a Phase 1 goal for an email-gated Website Growth Assessment teaser.
- Defined the staging rule: PR preview first, no production merge or deployment until founder validation.
- Local QA gates passed: lint, typecheck, assessment teaser validation, chat regression with local-only Turnstile bypass, static build, rendered-page smoke test, and protected assessment endpoint smoke test.
- Staging PR preview passed quality and Cloudflare Pages preview checks.
- Staging smoke tests passed for rendered Website Check copy, Turnstile config, protected assessment endpoint behavior, and Ferosh blog link rendering.

## 2026-06-15

- Added machine-readable assessment source data at `/source-website-assessment.json`.
- Added `/llms.txt`, `/robots.txt`, and `/sitemap.xml` support for crawlers and answer engines.
- Strengthened metadata with crawl directives, JSON/text alternates, keywords, publisher/creator signals, and local county focus.
- Added visible plain-answer content and FAQ structured data for AEO.
- Local SEO/AEO validation, lint, typecheck, assessment-teaser validation, and static build passed.
- Clarified positioning: Northvalley is a custom software company using AI agents to make practical software more accessible, while the website remains written in customer language around leads, follow-up, scheduling, and workflow problems.

## 2026-06-19

- Added a client website launch intake at `/intake`.
- Added a Pages Function at `/api/client-intake` that validates the smallest required field set, rejects secrets, accepts up to five images, honors Turnstile when configured, and sends the intake privately through Resend.
- Added middleware so `intake.northvalleyintel.com` redirects to the intake form once that custom domain is routed to this Pages project.
- Added `npm run test:client-intake` and local Pages validation for rendered page content, required-field errors, photo-count errors, successful test-mode submission, and subdomain-host redirect behavior.
- Remaining production work: deploy from `main`, configure or verify the Cloudflare Pages custom domain for `intake.northvalleyintel.com`, and smoke-test the live URL before telling a client it is ready.
