# AGENTS.md

## Project Philosophy

Northvalley Intelligence focuses on operational AI for real-world businesses.

Avoid:

- flashy AI aesthetics
- hype-driven language
- generic startup visuals
- chatbot-first positioning
- overengineered abstractions

Prioritize:

- operational clarity
- calm professionalism
- modern but grounded UI
- performance
- accessibility
- SEO quality
- practical language for operational SMBs

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- shadcn/ui-style component conventions
- Vercel deployment
- Cloudflare DNS

## Code Standards

- Keep components modular.
- Prefer server components unless interactivity is required.
- Optimize for readability.
- Keep content grounded in the assessment-first consulting model.
- Use semantic HTML before custom ARIA.
- Keep Lighthouse, accessibility, and SEO considerations in scope.
- Avoid adding dependencies unless they reduce real implementation complexity.

## Prod TDD / Definition of Done

For each feature, bug fix, or content change, treat production verification as part of the work.

- Start by identifying the expected behavior and the verification that currently fails or is missing.
- Verify locally first: run the relevant local check, test, build, or page inspection before deploying.
- A change is not complete just because it passes locally or is committed.
- After merge or deployment, verify the live production site at the public domain.
- For UI/content changes, production verification should check the actual rendered page or deployed HTML/assets, not just source code.
- For bug fixes, production verification should reproduce the previous failure condition against production and confirm it now passes.
- Do not report a feature, bug fix, or content update as complete until the production check passes, or explicitly state that production verification is blocked and why.
- Keep GitHub, Vercel, and Cloudflare roles clear:
  - GitHub is the source of truth for code, PRs, review, and CI.
  - Vercel builds and serves the deployed Next.js site.
  - Cloudflare controls DNS and routes the domain to Vercel; it does not contain the application code.

## Brand Voice

Use calm, practical, operational language. Northvalley Intelligence helps businesses modernize intelligently without disrespecting existing teams, processes, or judgment.
