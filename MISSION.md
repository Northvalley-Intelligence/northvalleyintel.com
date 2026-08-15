# Mission

Northvalley Intelligence is a custom software company built around the idea that AI agents make practical, workflow-shaped software accessible to more businesses. The website is a way to reach business owners in their language: getting found, converting leads, and cleaning up the work behind the service.

## Current Phase

Phase 2: Agent-native service delivery.

## Current Phase Goal

Offer and operate agent-native service surfaces for operational small businesses — so a customer can get real answers about a service, a starting price where one applies, and a request in front of the owner, from inside the assistant they already use, with the owner still approving the work. Northvalley's own site runs the capability it sells.

Phase 1 (assessment-led growth entry point) closed on 2026-08-06 when the intake subdomain DNS record went live and a controlled production intake submission was confirmed delivered.

## What Matters Most

- The business owner stays in control. Agent surfaces submit **requests**, never confirmed commitments. Enforced in code, not only in copy.
- Agent-native is not a chatbot. Northvalley does not sell conversation; it sells a service that is reachable where customers already are.
- Reuse over rebuild. An agent lane is an additional front door onto an intake that already works — never a second intake.
- The complete assessment stays a paid service. No agent surface renders the full report.
- Any public agent endpoint is a contract: versioned, contract-tested, and driven live against the public domain before it is announced anywhere.
- Explain the work in plain, business-focused language. Protocol and endpoint detail belongs in the machine-readable surfaces, not on customer-facing pages.
- Keep the analysis grounded in local lead growth for Cobb, Paulding, and Douglas counties, while remembering Northvalley works with clients anywhere in the US. The county focus is an input to the analysis, never an eligibility gate.
- Describe client work by outcome. Never publish a client's internal mechanism, their vendors, or their private hostnames — that exposes the client, not Northvalley.
- Never overstate an engagement. Complimentary work is described as complimentary.
- Validate locally, then in a PR preview, then against the live public domain. A change is not done until the production check passes.

## Current Risks

- Customer-facing email delivery depends on a verified Northvalley sending domain. Owner-facing notifications can succeed while customer-facing mail fails, so delivery must be tested to an address outside the domain.
- The sibling assessment service must remain reachable from the Pages Function, including from the agent-native request path.
- `request_assessment` submits a request but does not yet trigger the teaser pipeline. Connecting the two is deferred until customer-facing delivery is proven.
- Cloudflare Pages preview may not expose every production secret, so secret-dependent paths need a controlled production test.

## Next

Confirm customer-facing teaser delivery to an address outside the domain, then connect `request_assessment` to the teaser pipeline. Track the OpenAI directory submission to a decision.
