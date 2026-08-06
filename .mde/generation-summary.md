# Generation Summary — northvalleyintel.com

Rolling record of what each generation changed and whether the codebase improved or merely grew.
Written 2026-08-05; generations 1–6 reconstructed from existing records, git, and handoffs.

## Generation 1 — 2026-06-12 — Assessment teaser

Email-gated Website Growth Assessment teaser: request API, Turnstile-gated form, one-page PDF, Resend
delivery with Northvalley CC, homepage positioning. Established the staging rule (PR preview first,
no production merge until founder validation) and the decision that the teaser is emailed rather than
rendered, so the complete report stays a paid service.

Gate: passed local and staging. Evidence: strong.

## Generation 2 — 2026-06-15 — SEO/AEO source layer

`/source-website-assessment.json`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, crawl directives and
alternates, visible plain-answer content, FAQ structured data. Clarified positioning: a custom
software company using AI agents, with the public site written in customer language.

Gate: passed local. Evidence: adequate. This generation created the machine-readable surfaces that
every later client-work addition has extended.

## Generation 3 — 2026-06-19/20 — Client website launch intake

`/intake` plus the `/api/client-intake` Pages Function: minimal required fields, secret rejection, up
to five images, Turnstile when configured, private Resend delivery. Deployed and production-verified
on the main domain; the API was confirmed to fail closed.

Gate: partial pass. The subdomain check failed — `intake.northvalleyintel.com` was attached to Pages
but pending, with the CNAME never created. **This finding then sat open for six weeks.** It is the
single most instructive failure in the project's history: every local and CI check passed while a
customer-facing URL was dead.

## Generation 4 — 2026-06-20 — Intake usability and Terri testimonial

Form-first layout, blur-time validation, bare-domain acceptance, Terri Hitzig testimonial in the
client proof section and AEO source files.

Gate: pass with known subdomain warning, 1/2. Evidence: strong local.

## Generation 5 — 2026-06-22 — Microsoft site verification *(backfilled)*

Microsoft site verification meta tag in `src/app/layout.tsx` with a matching assertion added to
`scripts/validate-seo-aeo.mjs` in the same commit — the right pattern. Merged as PR #18.

Gate: not recorded. Evidence: reconstructed from git. **Shipped to production with no generation
record.**

## Generation 6 — 2026-07-01 — C&J Welding client work *(backfilled)*

C&J Welding and Fabricating, Inc. added to the client-work proof section across `src/lib/site.ts`,
`public/source-website-assessment.json`, and `public/llms.txt`, with a screenshot asset. PR #19 passed
required checks, merged, and production verification covered five URLs.

Gate: pass, 1/2. Evidence: strong production. Skipped `test:assessment-teaser` and
`test:client-intake` after editing `src/lib/site.ts`, a shared surface — the same partial-suite miss
recorded twice in the medinaclean build.

## Hygiene pass — 2026-08-05 — Phase 2 preparation

Not an implementation generation. Wrote the project's first `validation-strategy.json` after four
generations without one, backfilled generations 5 and 6 and the C&J validation run, and added
`project.json`, `findings.json`, and `validator-effectiveness.json`. Recorded six Phase 2 decisions.

Findings raised: the Cloudflare token in `.env.local` cannot create DNS records (zero zone access),
`resend-sender-domain` raised from Medium to High because the MCP write path generates mail to
arbitrary customer addresses, and a factual conflict between two authorities over whether the
medinaclean OpenAI directory submission actually happened.

## Trajectory

Six generations in, the codebase has grown in a controlled way: one Pages Function per capability, a
consistent three-surface pattern for client proof, and bespoke validators rather than a test-runner
dependency. The recurring weakness is not code quality but **follow-through on deployment findings** —
a failed deployment check was allowed to persist as a warning for six weeks while other work shipped
past it. The Phase 2 strategy makes a pending custom domain a phase-exit blocker for that reason.
