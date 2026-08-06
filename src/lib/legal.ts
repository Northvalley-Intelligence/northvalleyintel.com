/**
 * Privacy and terms content.
 *
 * The privacy policy must cover categories of data, purposes, recipients,
 * retention timelines, and a contact route. Both the OpenAI and Anthropic
 * directory reviews reject incomplete privacy policies outright, and a policy
 * that omits recipients or retention is the common failure.
 *
 * Keep this accurate to what the software actually does. Every claim below is
 * checked against the real intake paths: the website form, the assessment
 * teaser request, the workflow chat, and the MCP tools.
 */

export const legalUpdated = "August 6, 2026";

export const privacySections = [
  {
    heading: "Who this covers",
    body: [
      "This policy describes how Northvalley Intelligence LLC handles information submitted through northvalleyintel.com, including the website forms, the Website Growth Assessment request, and the agent-native surface at northvalleyintel.com/mcp used by AI assistants.",
      "It does not cover the separate websites and systems Northvalley builds for client businesses. Those are operated by the client and governed by the client's own policy.",
    ],
  },
  {
    heading: "What we collect",
    body: [
      "We collect only what a request needs in order to be answered. There is no advertising tracking, no data brokerage, and no sale of personal information.",
    ],
    points: [
      "Contact details you provide: name, email address, and phone number when you supply one.",
      "Business details you provide: business name, website address, services, customers, market, and what you want help with.",
      "Assessment request details: the website address to review and the email address the teaser is sent to.",
      "Images you attach to a client intake, when you choose to attach them.",
      "Technical request data needed to operate the service: IP address, and for the agent-native surface a one-way hash of your email address and IP address used to rate-limit abuse.",
    ],
  },
  {
    heading: "Why we use it",
    body: [
      "To respond to your request, prepare for a conversation, produce a requested assessment, and follow up about missing details. We do not use submitted information to train models.",
    ],
  },
  {
    heading: "Who receives it",
    body: [
      "Information is shared only with the service providers needed to deliver the request, and only for that purpose.",
    ],
    points: [
      "Cloudflare, Inc. — website hosting, request routing, bot protection, and the database that stores rate-limit records.",
      "Resend (Plus Five Five, Inc.) — delivery of notification and assessment email.",
      "Northvalley Intelligence staff — the people who read and answer your request.",
      "The assessment service at assessment.northvalleyintel.com, operated by Northvalley, when you request a Website Growth Assessment.",
      "We disclose information otherwise only where legally required.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Retention is tied to the purpose the information was collected for.",
    ],
    points: [
      "Request and notification email: retained in the Northvalley mailbox for up to 24 months, then deleted.",
      "Agent-native rate-limit records: hashed email and IP only, retained 90 days, then deleted. These records contain no readable contact details.",
      "Workflow chat transcripts: retained up to 12 months for quality review, then deleted.",
      "Attachments submitted with a client intake: retained for the duration of the engagement, and deleted within 90 days of a request to remove them.",
      "Records we are required to keep for tax or legal reasons are retained for the period the law requires.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to hello@northvalleyintel.com and we will respond within 30 days. There is no account to close and no marketing list you are added to automatically.",
    ],
  },
  {
    heading: "Requests made through AI assistants",
    body: [
      "When you use the Northvalley agent-native surface inside an assistant such as Claude, ChatGPT, or Gemini, the assistant sends us only the fields the tool asks for. We receive the request; we do not receive your wider conversation.",
      "Those tools submit a request for Northvalley to review. Nothing is scheduled, confirmed, purchased, or committed automatically.",
      "The assistant provider has its own privacy policy covering your use of the assistant itself. That is separate from this one.",
    ],
  },
  {
    heading: "Children",
    body: [
      "Northvalley provides services to businesses. The site is not directed at children and we do not knowingly collect information from anyone under 13.",
    ],
  },
  {
    heading: "Changes and contact",
    body: [
      "If this policy changes materially we will update the date at the top of this page. Questions, requests, and complaints go to hello@northvalleyintel.com, or Northvalley Intelligence LLC, Marietta, Georgia, United States.",
    ],
  },
];

export const termsSections = [
  {
    heading: "What these terms cover",
    body: [
      "These terms apply to your use of northvalleyintel.com, including the website forms and the agent-native surface at northvalleyintel.com/mcp. Consulting engagements are governed by a separate written agreement, which takes precedence over these terms where the two differ.",
    ],
  },
  {
    heading: "Requests are requests",
    body: [
      "Submitting a form, or asking an AI assistant to submit a request on your behalf, does not create a contract, book a meeting, reserve time, or commit Northvalley to perform work. Northvalley reviews each request and responds. Any engagement begins only when both parties agree to it in writing.",
      "No payment is collected through this website or through the agent-native surface.",
    ],
  },
  {
    heading: "The Website Growth Assessment",
    body: [
      "The one-page teaser report is provided free as a summary. The complete assessment is a paid engagement with its own scope and terms. Assessment findings are informational and reflect what was observable at the time of review. They are not a guarantee of search ranking, lead volume, or revenue.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Use the site and the agent-native surface for genuine business enquiries.",
    ],
    points: [
      "Do not submit credentials. Never send passwords, API keys, access tokens, or account logins through any Northvalley form or tool. Requests containing them are rejected.",
      "Do not submit information about other people without a lawful basis for doing so.",
      "Do not attempt to overwhelm, probe, or circumvent the rate limits on public request paths.",
      "Do not present Northvalley responses as confirmed bookings or commitments.",
    ],
  },
  {
    heading: "Availability",
    body: [
      "The site and the agent-native surface are provided as they are, without a service-level commitment. Public request paths are rate-limited and may reject a request that exceeds those limits.",
    ],
  },
  {
    heading: "Content and liability",
    body: [
      "Site content, case studies, and recorded demonstrations belong to Northvalley Intelligence LLC or to the clients who consented to their publication. Client names and recordings appear with permission.",
      "To the extent permitted by law, Northvalley is not liable for indirect or consequential losses arising from use of this website or the agent-native surface.",
    ],
  },
  {
    heading: "Governing law and contact",
    body: [
      "These terms are governed by the laws of the State of Georgia, United States. Questions go to hello@northvalleyintel.com.",
    ],
  },
];
