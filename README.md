# Northvalley Intelligence Website

This is the parent website for Northvalley Intelligence LLC. It is the public
front door for the company and the programmer-facing entry point for how the
site is built, validated, and deployed.

Northvalley Intelligence helps local service businesses grow and modernize in
plain operational terms: getting found, converting leads, scheduling work,
following up, and cleaning up messy internal workflows. The website should speak
to business owners in that language, while the source code and machine-readable
content can explain the broader direction more directly.

## What We Do

Today the site introduces Northvalley through practical business problems:

- local lead growth and website assessment
- chat-based intake for business pain points
- examples and case studies written for business operators
- workflow cleanup around leads, scheduling, handoffs, and follow-up
- AI and automation positioned as tools, not as the headline

The assessment flow is intentionally email-gated. Visitors can request a teaser
report, while the complete website growth assessment remains a paid service.

## What We Are Building Toward

Northvalley is growing as a custom software company. The goal is to build
cost-effective custom software faster for real businesses by combining:

- practical discovery with owners and operators
- AI agents where they reduce delivery cost or repeated work
- small, useful software surfaces instead of oversized systems
- validation that proves the work advances the business mission

The site is one way to meet customers where they are. It should keep talking
about leads, customers, scheduling, follow-up, documents, and workflow pressure,
while the company behind it builds durable custom software around those needs.

## How We Build: MDE

This project uses Mission-Driven Engineering (MDE). MDE is a file-first
operating discipline for building with AI agents without losing mission,
validation, memory, or accountability.

Public MDE repo:
[Northvalley-Intelligence/mde](https://github.com/Northvalley-Intelligence/mde)

In short, MDE means:

- start with the mission, not only the code request
- keep human, agent, and deployment artifacts separate
- define project-specific validation instead of relying on generic checks
- treat BDDs as part of functional validation, not the whole quality model
- require a Validation Gate before phase exit
- capture reusable learning in project outboxes before promoting it centrally

The central `mde` repo is shared operating memory and reusable discipline. It is
not a monorepo. Each project, including this one, owns its implementation and
keeps only explicit cross-project learning in `.mde/outbox`.

## MDE In This Repo

This website is already an MDE-aware project. Key local artifacts:

- `MISSION.md`: current product mission and phase goal
- `MISSION_UPDATES.md`: concise human-readable mission history
- `.mde/`: structured agent state, BDD index, risk register, progress, and
  generation evidence
- `docs/operations/mde-status.md`: readable status of active validation coverage
- `deploy/release-checks.json`: expected release checks

When working here, read `AGENTS.md`, `MISSION.md`, and the relevant `.mde/`
state before making changes. Do not re-adopt MDE from scratch; continue the
existing project state.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- Cloudflare Pages deployment
- Cloudflare DNS
- Cloudflare Pages Functions for chat and assessment intake
- Cloudflare D1 for chat storage and rate limiting
- Resend for email notifications

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

Run the checks relevant to the change. The common baseline is:

```bash
npm run lint
npm run typecheck
npm run build
```

Feature-specific checks include:

```bash
npm run test:chat
npm run test:assessment-teaser
npm run test:seo-aeo
```

## Deployment

Production deploys only from `main` through the GitHub workflow. Do not deploy
production manually from a feature branch, dirty worktree, detached commit, or
unmerged local build.

The deployment target is Cloudflare Pages. Cloudflare also manages DNS for
`northvalleyintel.com`.

See [docs/deployment.md](docs/deployment.md).
