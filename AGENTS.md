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
- Cloudflare Pages deployment
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
- Production deploys must only happen from `main`.
- Do not deploy feature branches, PR branches, local dirty worktrees, detached commits, or unmerged code to production.
- `main` and production must stay in sync: code reaches production by merging to `main`, and production should reflect the current `main` commit.
- Do not merge code to `main` unless the required deployment path for `main` is expected to deploy successfully.
- `cloudflare-pages-preview` must pass as a required GitHub status check before merging to `main`.
- If the Cloudflare Pages deployment check is missing from branch protection, treat deployment enforcement as incomplete and restore that requirement before normal feature work continues.
- If production deployment fails after merge, treat the work as incomplete and either fix forward immediately or revert through a new reviewed/checked change.
- After merge to `main` and deployment, verify the live production site at the public domain.
- For UI/content changes, production verification should check the actual rendered page or deployed HTML/assets, not just source code.
- For bug fixes, production verification should reproduce the previous failure condition against production and confirm it now passes.
- Do not report a feature, bug fix, or content update as complete until the production check passes, or explicitly state that production verification is blocked and why.
- Keep GitHub and Cloudflare roles clear:
  - GitHub is the source of truth for code, PRs, review, and CI.
  - Cloudflare Pages builds and serves the deployed Next.js site from `main`.
  - Cloudflare DNS routes the domain to Cloudflare Pages.

## Brand Voice

Use calm, practical, operational language. Northvalley Intelligence helps businesses modernize intelligently without disrespecting existing teams, processes, or judgment.
