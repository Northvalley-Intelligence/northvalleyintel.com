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

## 2026-06-20

- Verified the client intake is deployed on `main` and live at `https://northvalleyintel.com/intake`.
- Verified the production intake API fails closed for an incomplete submission.
- Confirmed Cloudflare Pages has `intake.northvalleyintel.com` attached, but the domain is still pending because the DNS CNAME record is not set.
- Required DNS record before client use: `CNAME intake -> northvalleyintel-com.pages.dev`.
- Improved the intake flow so the form is first, field errors appear during progress, and bare domains such as `sample.com` and `www.sample.com` are accepted.
- Added Terri Hitzig's "Website Genius" testimonial to the client proof section and AEO source files.

## 2026-08-06

- Recorded work completed since 07-01 that had not been captured: a Microsoft site verification meta tag with a matching SEO/AEO assertion (06-22), and the C&J Welding client-work card across site data, `source-website-assessment.json`, and `llms.txt` (07-01), production-verified at the time of merge.
- Created the `intake` DNS record. `intake.northvalleyintel.com` now resolves, redirects to the intake form, and serves over HTTPS with its own certificate. The finding had been open 46 days.
- Ran a controlled production intake submission through the real customer path, including a live Turnstile challenge and a file attachment, and confirmed private delivery with the attachment intact. This check had never been run.
- Closed Phase 1 and opened Phase 2, agent-native service delivery. Reconciled `MISSION.md` with the wider goal already recorded in `.mde/state.json`; the client website launch intake is recorded as a Phase 1 deliverable.
- Defined `.mde/validation-strategy.json`, the project's first, after four generations without one. Backfilled generation records for the 06-22 and 07-01 work and added the missing MDE artifacts.
- Found and fixed a live defect: the Website Growth Assessment teaser was almost certainly never reaching prospects. Production sent from a shared Resend sandbox address that only delivers to the account owner, so the admin notification arrived while the requester's report was rejected, and the only record was a console warning inside a background task. The sandbox fallback is removed, an unusable sender now fails loudly, and an undelivered teaser raises an alert to Northvalley naming the stranded requester.
- Extracted one shared intake delivery path and one credential-rejection guard, so the website form and the agent-native surface use the same code rather than forked copies.
- Published Northvalley's own agent-native surface at `northvalleyintel.com/mcp`, offering service listing, assessment requests, and consultation requests. Both write tools return a pending status for review; no code path emits a confirmed state. Verified against the deployed endpoint with sequential requests, and again after release.
- Added agent-native service delivery as the flagship service, moved the Website Growth Assessment under Services as a named offering, and published a recorded demonstration with a full transcript at `/case-studies/chatgpt-booking-medina-clean`. Pricing in the recording was confirmed against Medina Clean's live rules before publishing.
- Added `/privacy` and `/terms`, prepared the ChatGPT directory submission package, and submitted it. Domain verification, the manifest, icons, and the demo recording are all in place.

## 2026-08-14

- Added two clients to the client-work section, following the existing pattern rather than a new one.
- The CFR, The Center for Family Resources: a complimentary website and experience evaluation for a Cobb County nonprofit in Marietta serving families facing housing loss, plus a set of Google Business Profile photos. Recorded as complimentary, not a paid engagement.
- Canon Insurance Advisers: their public website, and a retention board that surfaces policies at risk of lapsing so the agency can reach the client before the policy ends. Described by outcome only; the client's internal mechanism, their vendors, and their private hostnames stay off public surfaces.
- Added assertions that fail the build if client internals reach a public surface, or if complimentary work starts reading as paid.
- Verified in production: both cards render on the homepage and in the machine-readable surfaces, both preview images serve, and none of the withheld details appear anywhere in the deployed output.
- Open: customer-facing teaser delivery is still unproven to an address outside the Northvalley domain, and the OpenAI directory submission is awaiting review.
