const smartCashSheetOutcome =
  "A personal cash-flow app on the web, with iOS and Android apps that share its backend. Northvalley runs its engineering: bank-data import, subscriptions and billing, the safety rules around its in-app money coach, and a release process with a staging environment and scenario tests before each production release.";

export const siteConfig = {
  name: "Northvalley Intelligence",
  legalName: "Northvalley Intelligence LLC",
  domain: "northvalleyintel.com",
  url: "https://northvalleyintel.com",
  email: "hello@northvalleyintel.com",
  // The number published on the Google Business Profile. The site and the
  // listing must show the same number or the two assets stop corroborating
  // each other, which is what the 2026-09-07 evaluation flagged.
  phone: "(470) 781-4143",
  phoneHref: "tel:+14707814143",
  // E.164 form, for schema.org telephone.
  telephone: "+1-470-781-4143",
  // The business's own Google Business Profile listing. Used for sameAs,
  // hasMap, and the visible "Find us on Google" footer link, so the website
  // and the listing point at each other.
  mapsUrl: "https://maps.google.com/?cid=18103596615723406363",
  // The business's LinkedIn company page. The numeric public company URL —
  // no vanity slug is set yet. Used for sameAs and the footer link.
  linkedinUrl: "https://www.linkedin.com/company/119623922/",
  // The business's Clutch profile. Used for sameAs and the footer link.
  clutchUrl: "https://clutch.co/profile/northvalley-intelligence",
  tagline:
    "Custom software, built and integrated — web, mobile, and the systems behind them.",
  description:
    "Northvalley Intelligence is a software consultancy with three services: software development, agentic applications, and data science, machine learning and data cleansing. We design, build and integrate software for organizations that need it to work with the systems they already run.",
  positioning:
    "Northvalley Intelligence is a custom software company using AI agents to make practical, workflow-shaped software more accessible. The website speaks in customer language because owners usually start with lead, follow-up, scheduling, and workflow problems rather than software requirements.",
  location: "Marietta / Atlanta",
  serviceArea: [
    "Marietta",
    "Cobb County",
    "Paulding County",
    "Douglas County",
    "Atlanta metro",
  ],
  // Site-wide meta keywords, referenced from the root layout's metadata.
  // "AI consultant" / "software consultant" (plus the geo-qualified variants)
  // are the exact query terms competitors carry in their own names but this
  // site did not carry anywhere in copy or meta prior to 2026-09-18.
  keywords: [
    "local business AI consulting",
    "website growth assessment",
    "AI search optimization",
    "answer engine optimization",
    "lead generation assessment",
    "workflow automation",
    "Cobb County business",
    "Paulding County business",
    "Douglas County business",
    "Marietta business consultant",
    "AI consultant",
    "software consultant",
    "AI consultant Marietta GA",
    "software consultant Cobb County",
  ],
};

/**
 * The four services, worded the same way here, on the service-area pages, and
 * on the Google Business Profile. Google matches a query against a listed
 * service, so the two surfaces must not drift apart.
 */
export const coreServices = [
  {
    name: "Custom software",
    detail:
      "Practical, workflow-shaped software built around how the business already runs, rather than a package it has to bend itself into.",
  },
  {
    name: "Workflow automation",
    detail:
      "Follow-up, scheduling, customer information, team handoffs, and repeated work organized so the business can keep up with itself.",
  },
  {
    name: "AI assistants and agents",
    detail:
      "Make the business answer for itself where customers now ask: what it covers, how pricing works, and a request that reaches the owner. The owner approves every job.",
  },
  {
    name: "Website growth assessment",
    detail:
      "A review of how nearby customers and AI answer engines find, understand, and trust the business, and where the path from interest to contact breaks down.",
  },
];

/**
 * The capability map on the homepage (#capabilities), plus the facts strip
 * under it. Wording is the approved copy deck of 2026-10-08; llms.txt and
 * source-website-assessment.json carry the same tiles word for word.
 */
export const capabilitiesIntro = {
  eyebrow: "Capabilities",
  title: "What we build.",
  lead: "Northvalley Intelligence is a software consultancy with three services: software development, agentic applications, and data science, machine learning and data cleansing. We design, build and integrate software for organizations that need it to work with the systems they already run. We work with clients anywhere in the United States, remotely from Marietta, Georgia.",
};

export const capabilities = [
  {
    label: "Core — software development",
    tiles: [
      {
        title: "Web and mobile applications",
        description:
          "Browser-based applications, the phone apps (iOS and Android) that share their backend, and the services behind them: accounts, payments, data, reporting.",
        proof:
          "Smart Cash Sheet: a personal cash-flow app on the web with iOS and Android apps that share its backend. Northvalley runs its engineering: bank-data import, subscriptions and billing, and the release process. See Client Work.",
        proofHref: "#client-work",
        icon: "app",
      },
      {
        title: "Custom integrations",
        description:
          "Software that connects to the systems you already use — external APIs, vendor platforms and line-of-business systems — and puts their data to work in one place.",
        proof:
          "For Canon Insurance Advisers: a retention board that surfaces policies at risk of lapsing before they end.",
        icon: "integration",
      },
      {
        title: "Agentic applications",
        description:
          "Software agents that take actions inside a business's own systems, with voice and chat front ends and agent-callable backends (MCP).",
        proof:
          "A working demo of a voice-first field companion for a pest-control route: the technician speaks, the agent reads and updates the CRM through an agent-callable backend.",
        icon: "agent",
      },
    ],
  },
  {
    label: "Data science and cleansing — led by the founder",
    tiles: [
      {
        title: "Data science, machine learning and data cleansing",
        description:
          "Data cleansing, entity normalization and matching, ontology, ranking and search relevance, and machine learning models, on messy real-world data.",
        proof:
          'Founder Ferosh Jacob, Ph.D.: at CareerBuilder (2013–2015), a machine learning-based school and company normalization system and candidate-profile matching across data sources; at The Home Depot (2015–2021), machine learning ranking models, a search-evaluation framework and a product ontology; at Genuine Parts Company (2024–2026), catalog, search and discovery with generative AI and classical machine learning; publications since 2010, including the 2016 Springer chapter "Data Science and Big Data Analytics at CareerBuilder".',
        proofHref: "/about#credentials",
        icon: "search",
      },
      {
        title: "LLM fine-tuning",
        description:
          "Adapting open-source language models to a specific task, trained and run on local hardware (GPU or CPU) so data stays in-house.",
        proof:
          "A published experiment by the founder: a LoRA-tuned Llama-3.2-3B and a fine-tuned cross-encoder that grade e-commerce search relevance, both ahead of the prompted baseline on two public datasets; presented with Jiho Noh (Kennesaw State University) at SCD 2026.",
        icon: "model",
      },
    ],
  },
];

/**
 * The /government page (handoff 06). One page for federal, state and local
 * buyers. Identifiers are never invented: the UEI is shown (on file); CAGE and
 * SAM status read "Registration in progress" until they exist. Past performance repeats only
 * what the Client Work cards already say (outcome only, no client data).
 */
export const governmentPage = {
  path: "/government",
  title: "Northvalley Intelligence for Government Buyers",
  description:
    "Custom software, agentic applications, and data science and data cleansing for federal, state and local buyers. NAICS 541511, PSC DA01, DH01 and DD01. Marietta, Georgia.",
  summary:
    "Northvalley Intelligence builds software for organizations that need it to work with the systems they already run: web and mobile applications with custom integrations, agentic applications, and data science, machine learning and data cleansing.",
  competencies: [
    {
      title: "Software development",
      description:
        "Web and mobile applications plus custom integrations with the systems a buyer already runs.",
    },
    {
      title: "Agentic applications",
      description:
        "Software agents that take actions inside a business's own systems, with voice and chat front ends and agent-callable backends (MCP).",
    },
    {
      title: "Data science, machine learning and data cleansing",
      description:
        "Data cleansing, entity normalization and matching, ontology, ranking and search relevance, and machine learning models, on messy real-world data.",
    },
  ],
  differentiators: [
    "The founder does the hands-on work on every engagement.",
    "Depth in data science and search: 12 years in search, catalog and data-driven systems, including machine learning ranking and data normalization.",
    "Models can be trained and run on local hardware, so data stays in-house where a client needs it.",
  ],
  // How an engagement runs (finding 8b, owner-approved wording).
  process: [
    "Conversation with the founder.",
    "Written scope and acceptance criteria.",
    "Build in short increments on a staging environment.",
    "Release through CI, with documentation and handover.",
  ],
  buyers: [
    {
      label: "Federal",
      text: "NAICS, PSC and the Unique Entity ID are in the company data below. The CAGE code and SAM.gov status will be added when SAM registration completes.",
    },
    {
      label: "State",
      text: "Custom software, integrations and data work delivered remotely from Georgia to state agencies anywhere in the United States.",
    },
    {
      label: "Local",
      text: "A Marietta, Georgia firm. Local government buyers can meet in person and get a direct line to the founder.",
    },
  ],
  pastPerformance: [
    {
      name: "Canon Insurance Advisers",
      lines: [
        "Client: Canon Insurance Advisers, LLC (Georgia insurance agency).",
        "Role: direct engagement, founder as sole developer.",
        "Period: July 2026 to present (currently active).",
        "Scope: a retention board that flags pending cancellations, non-renewals and steep renewal increases before the policy ends.",
        "Reference: available on request.",
      ],
    },
    {
      name: "Smart Cash Sheet",
      lines: [
        "Client: Smart Cash Sheet.",
        "Role: ongoing engineering.",
        "Period: September 2026 to present (currently active).",
        `Scope: ${smartCashSheetOutcome}`,
        "Reference: available on request.",
      ],
    },
  ],
  companyData: [
    { label: "Legal name", value: "Northvalley Intelligence LLC" },
    {
      label: "Entity",
      value: "Georgia limited liability company, founded June 2026",
    },
    { label: "Location", value: "Marietta, Georgia" },
    {
      label: "NAICS (primary)",
      value: "541511 — Custom Computer Programming Services",
    },
    {
      label: "NAICS (secondary)",
      value: "541512 — Computer Systems Design Services",
    },
    {
      label: "PSC",
      value:
        "DA01 — IT and Telecom - Business Application/Application Development Support Services (Labor); DH01 — IT and Telecom - Platform Support Services: Database, Mainframe, Middleware (Labor); DD01 — IT and Telecom - Service Delivery Support Services: ITSM, Operations Center, Project/PM (Labor)",
    },
    { label: "Contracting role", value: "Prime contractor or subcontractor" },
    { label: "Unique Entity ID (UEI)", value: "JX76HA57NCJ8" },
    { label: "CAGE code", value: "Registration in progress" },
    { label: "SAM.gov status", value: "Registration in progress" },
  ],
};

// A plain row of cells; append { label, value } entries to add more later.
export const companyFacts = [
  { label: "Legal name", value: "Northvalley Intelligence LLC" },
  { label: "Based in", value: "Marietta, Georgia" },
  {
    label: "Works with",
    value: "Clients anywhere in the United States, remotely",
    wide: true,
  },
  {
    label: "Contact",
    // Rendered as three lines: name, mailto link, tel link.
    value: "Ferosh Jacob, Founder",
    email: "ferosh@northvalleyintel.com",
    phone: siteConfig.phone,
    phoneHref: siteConfig.phoneHref,
    wide: true,
  },
];

/**
 * Crawlable service-area pages, one per city.
 *
 * Distinct from siteConfig.serviceArea, which is the coarse county-level list
 * used for schema areaServed on the homepage. This list is the page-level one:
 * a search engine or an answer engine needs a page it can point at to resolve
 * the business to a place. The cities are the Cobb and Douglas ones the
 * business actually serves; nothing here claims a client, a project, or a
 * statistic in any of them.
 */
export const serviceAreas = [
  {
    slug: "marietta",
    city: "Marietta",
    county: "Cobb County",
    note: "Marietta is where Northvalley is based, so a conversation here is a short drive rather than a ticket queue.",
  },
  {
    slug: "smyrna",
    city: "Smyrna",
    county: "Cobb County",
    note: "Smyrna is a short drive from the Marietta base, inside the same Cobb County service area.",
  },
  {
    slug: "kennesaw",
    city: "Kennesaw",
    county: "Cobb County",
    note: "Kennesaw sits just north of the Marietta base, inside the same Cobb County service area.",
  },
  {
    slug: "acworth",
    city: "Acworth",
    county: "Cobb County",
    note: "Acworth is at the northwest edge of Cobb County, within the area Northvalley works in person.",
  },
  {
    slug: "powder-springs",
    city: "Powder Springs",
    county: "Cobb County",
    note: "Powder Springs sits between the Cobb and Douglas parts of the service area.",
  },
  {
    slug: "austell",
    city: "Austell",
    county: "Cobb County",
    note: "Austell sits on the Cobb and Douglas county line, inside the service area on both sides.",
  },
  {
    slug: "mableton",
    city: "Mableton",
    county: "Cobb County",
    note: "Mableton is in south Cobb County, within the area Northvalley works in person.",
  },
  {
    slug: "vinings",
    city: "Vinings",
    county: "Cobb County",
    note: "Vinings is in southeast Cobb County, close to the Atlanta side of the service area.",
  },
  {
    slug: "douglasville",
    city: "Douglasville",
    county: "Douglas County",
    note: "Douglasville is the largest city in Douglas County and the western end of the service area.",
  },
  {
    slug: "lithia-springs",
    city: "Lithia Springs",
    county: "Douglas County",
    note: "Lithia Springs is in northeast Douglas County, between Douglasville and the Cobb line.",
  },
  {
    slug: "winston",
    city: "Winston",
    county: "Douglas County",
    note: "Winston is in southwest Douglas County, at the far end of the service area.",
  },
];

/**
 * The about / owner page.
 *
 * Credentials are only what is already published on a citable public source:
 * Ferosh Jacob's own site, https://feroshjacob.github.io/, which the Person
 * owner.url link already points to. Nothing here is inferred.
 *
 * No founding year is stated. It could not be verified against the Georgia
 * Secretary of State record (ecorp.sos.ga.gov and the Bizapedia mirror both
 * sit behind a bot challenge), and the 2026-09-07 evaluation asked for years
 * in business, not for a guess. Add the year here once the LLC registration
 * date is confirmed from the state record.
 */
export const missionVisionValues = {
  vision:
    "Northvalley will be the software partner organizations trust to build systems that work with the tools they already run.",
  mission:
    "Northvalley Intelligence designs, builds and integrates custom software, web and mobile, for organizations that need it to work with the systems they already run.",
  values: [
    {
      title: "Hands-on",
      text: "The founder does the hands-on work on every engagement.",
    },
    {
      title: "Start from the real question",
      text: "We begin with the client's problem, not a package.",
    },
    {
      title: "Claim only what we can show",
      text: "Proof lines on the site come from real work; nothing is inferred.",
    },
    {
      title: "Data stays yours",
      text: "We run models on local hardware where the client needs data kept in-house, and we reject sensitive personal data at the system level.",
    },
  ],
};

export const owner = {
  name: "Ferosh Jacob",
  role: "Founder",
  location: "Marietta, Georgia",
  url: "https://feroshjacob.github.io/",
  blogUrl: "https://feroshjacob.github.io/posts/",
  image: "/people-ferosh-jacob.webp",
  summary:
    "Northvalley Intelligence was founded in Marietta, Georgia in June 2026 by Ferosh Jacob. Every engagement starts with a conversation with him, not an account manager.",
  // Source for every line below: https://feroshjacob.github.io/ (self-published
  // biography, linked from the Person entry on this site since launch).
  credentials: [
    "Ph.D. in computer science, The University of Alabama",
    "M.S. in computer science, Clarkson University",
    "Software engineering and AI leader working across search, relevance, data science, and practical AI systems",
    "Career from software engineer to staff engineer and senior engineering manager, in the retail, healthcare, recruiting and automotive-parts domains",
    "Search relevance and product ranking at The Home Depot (2015–2021); 22 years in software, 12 in search, catalog and data-driven systems",
    "Part-time Assistant Professor, Kennesaw State University, since 2017",
    "Refereed publications since 2009, including a 2016 Springer chapter on data science at CareerBuilder; Ph.D. internship at Pacific Northwest National Laboratory (2012)",
  ],
};

export const aeoAnswers = [
  {
    question: "What does Northvalley Intelligence do?",
    answer:
      "Northvalley Intelligence is a software consultancy in Marietta, Georgia with three services: software development (web and mobile, custom integrations), agentic applications, and data science, machine learning and data cleansing. For local service businesses it also improves the path from being found, to converting leads, to running the work.",
  },
  {
    question: "Who is Northvalley Intelligence for?",
    answer:
      "We focus on practical service businesses such as cleaners, plumbers, HVAC companies, electricians, landscapers, restoration teams, consultants, realtors, and field-service operators.",
  },
  {
    question: "Where does Northvalley Intelligence work?",
    answer:
      "Software consulting is done remotely for clients anywhere in the United States. Local assessment and marketing work is focused on Cobb, Paulding, and Douglas counties, including Marietta and the surrounding Atlanta metro service areas.",
  },
  {
    question: "How is the website assessment different from a website doctor?",
    answer:
      "The assessment is not a generic SEO score, security scan, or technical checklist. It looks at whether nearby customers and AI answer engines can understand the business, trust it, and take the next step.",
  },
  {
    question: "What does the assessment review?",
    answer:
      "The assessment reviews local visibility, AI-answer readiness, trust proof, service-area clarity, calls to action, contact friction, and the lead path from interest to follow-up. That helps us see where better workflow, automation, or custom software could actually help.",
  },
  {
    question: "What happens after a website assessment request?",
    answer:
      "We email a one-page teaser report. The complete paid assessment includes page-level evidence, exact missing signals, scoring logic, and prioritized fixes.",
  },
  {
    question:
      "Can Northvalley make a business usable from inside an AI assistant?",
    answer:
      "Yes. We build agent-native service surfaces so a customer can ask an assistant whether a business covers their area, what a service costs, and to request a time, and have that request reach the owner. The assistant submits a request; the owner reviews and confirms it. Medina Clean, a bilingual cleaning service near Woodstock, Georgia, runs this today.",
  },
];

export const primaryPages = [
  {
    url: siteConfig.url,
    label: "Home",
    description:
      "Northvalley Intelligence is a software consultancy: software development, agentic applications, and data science and data cleansing, with a labelled local-business line.",
  },
  {
    url: `${siteConfig.url}/case-studies`,
    label: "Case studies",
    description:
      "Index of the Medina Clean write-ups: the operating-foundation case study and the recorded booking demonstration.",
  },
  {
    url: `${siteConfig.url}/case-studies/medina-clean`,
    label: "Medina Clean case study",
    description:
      "Native executive case study showing how a service-business website request became a practical operating foundation.",
  },
  {
    url: `${siteConfig.url}/case-studies/chatgpt-booking-medina-clean`,
    label: "Booking inside ChatGPT",
    description:
      "Recorded demonstration and full transcript of a cleaning business answering service-area, pricing, booking-request, and Spanish-language questions from inside ChatGPT.",
  },
  {
    url: `${siteConfig.url}/case-studies/medina-clean/rosas-story`,
    label: "Rosa's story",
    description:
      "Native case-study article about Medina Clean and the operational context behind the project.",
  },
  {
    url: `${siteConfig.url}/case-studies/medina-clean/website-ai-chat`,
    label: "Website and AI chat",
    description:
      "Native case-study article about the public website and practical AI chat workflow.",
  },
  {
    url: `${siteConfig.url}/case-studies/medina-clean/lead-workflow`,
    label: "Lead workflow",
    description:
      "Native case-study article about lead intake, follow-up, and workflow support.",
  },
  {
    url: `${siteConfig.url}/privacy`,
    label: "Privacy policy",
    description:
      "What Northvalley collects, why, who receives it, how long it is kept, and how to ask for removal.",
  },
  {
    url: `${siteConfig.url}/terms`,
    label: "Terms of use",
    description:
      "Terms for the website and the agent-native surface, including that submitted requests are requests rather than confirmed commitments.",
  },
  {
    url: `${siteConfig.url}/source-website-assessment.json`,
    label: "Website assessment source data",
    description:
      "Machine-readable source facts for website assessment and answer-engine crawlers.",
  },
  {
    url: `${siteConfig.url}/llms.txt`,
    label: "LLM source guide",
    description:
      "Plain-text guide for AI crawlers and answer engines summarizing Northvalley source pages.",
  },
  {
    url: `${siteConfig.url}/about`,
    label: "About Northvalley Intelligence",
    description:
      "Who runs Northvalley Intelligence, the published credentials behind the work, and how an engagement starts.",
  },
  {
    url: `${siteConfig.url}/government`,
    label: "Government buyers",
    description:
      "Capabilities, company data (NAICS, PSC), and past performance for federal, state and local buyers of custom software, agentic applications, and data science and data cleansing.",
  },
  {
    url: `${siteConfig.url}/service-areas`,
    label: "Service areas",
    description:
      "The Cobb, Paulding and Douglas county service areas of Northvalley Intelligence in Marietta, Georgia.",
  },
  ...serviceAreas.map((area) => ({
    url: `${siteConfig.url}/service-areas/${area.slug}`,
    label: `${area.city}, GA`,
    description: `Custom software, workflow automation, AI assistants, and the free one-page teaser of the website growth assessment for ${area.city}, Georgia businesses in ${area.county}.`,
  })),
];

/**
 * How a visitor connects Northvalley's own agent surface to their assistant.
 *
 * This is the one place an endpoint URL belongs in customer-facing copy: it is
 * a functional affordance, not positioning. Marketing copy elsewhere stays in
 * customer language and carries no protocol detail.
 */
export const agentConnect = {
  endpoint: "https://northvalleyintel.com/mcp",
  summary:
    "Northvalley runs the same kind of surface it builds for clients. Add it to your assistant and you can ask what we do, request a website assessment, or ask for a consultation without leaving the chat.",
  note: "Requests come to us for review. Nothing is scheduled or confirmed automatically.",
  steps: [
    {
      assistant: "Claude",
      detail: "Settings → Connectors → Add custom connector → paste the URL.",
    },
    {
      assistant: "ChatGPT",
      detail:
        "Settings → Connectors → Advanced → Developer mode → paste the URL.",
    },
    {
      assistant: "Gemini",
      detail: "Connected apps → add the URL.",
    },
  ],
};

export const industries = [
  "Cleaners",
  "Plumbers",
  "HVAC companies",
  "Electricians",
  "Landscapers",
  "Restoration teams",
  "Consultants",
  "Realtors",
  "Field-service operators",
];

export const services = [
  {
    number: "01",
    title: "Help the Right People Find You",
    description:
      "We look at how customers discover the business through Google, AI search, referrals, local content, and service-area pages.",
  },
  {
    number: "02",
    title: "Turn Interest Into Real Leads",
    description:
      "We make the next step clear, capture the right details, and help move people from interest to consultation, estimate, booking, or sale.",
  },
  {
    number: "03",
    title: "Clean Up the Work Behind It",
    description:
      "We organize follow-up, scheduling, customer information, team handoffs, and repeated work so the business can keep up.",
  },
];

/**
 * The flagship offering. Presented ahead of the capability areas rather than as
 * one item among them, because it is what Northvalley leads with.
 */
export const featuredService = {
  eyebrow: "Flagship service",
  title: "Be Reachable Where Customers Ask",
  summary:
    "Customers increasingly start with an AI assistant instead of a search box, and a list of names is a dead end. We make the business answer for itself there: what it covers, what it costs, and a request that reaches the owner. The owner approves every job.",
  points: [
    {
      label: "Answers from your own system",
      detail:
        "Service area, pricing, and availability come out of the business's real rules, not a guess.",
    },
    {
      label: "The owner still decides",
      detail:
        "Requests arrive for review. Nothing is confirmed or scheduled without the owner.",
    },
    {
      label: "Built onto what you already have",
      detail:
        "It uses the intake the business already runs. No second system, no duplicate records.",
    },
    {
      label: "In your customers' language",
      detail:
        "The same questions answered in English or Spanish, through the same rules.",
    },
  ],
  proofHref: "#agent-native",
  proofCta: "See it working",
};

/**
 * The two points from the former "When Leads Are Slow" section that were not
 * already in the three service cards. Rendered under card 01.
 */
export const findabilityExtras = [
  "Be understandable to AI search and chat: Google still matters, but people also ask ChatGPT, Gemini and Perplexity, so the website needs clear, trustworthy information for them to use.",
  "Show why the local business is different: local experience, customer knowledge and practical guidance, turned into content that builds trust.",
];

/**
 * The Website Growth Assessment is presented as a named offering inside the
 * Services section rather than as its own top-level entry point. The email
 * gate, the emailed one-page teaser, and the paid complete report are
 * unchanged; only where it sits in the information architecture moved.
 */
export const featuredOffering = {
  title: "Website Growth Assessment",
  summary:
    "Review how nearby customers and AI answer engines find, understand, and trust the business, then show where the path from interest to contact breaks down.",
  items: [
    "Local visibility and AI-answer readiness",
    "Trust proof and service-area clarity",
    "Calls to action and contact friction",
    "The lead path from interest to follow-up",
  ],
  // Moved here from the Capabilities tile (finding 7): this product belongs to
  // the local-business line.
  productNote:
    "Northvalley built and operates this product: an automated analysis of a business's public pages, combined with search-demand and local-ranking data, delivered as a scored report.",
  note: "A one-page teaser is emailed free. The complete assessment is a paid engagement.",
  href: "#website-assessment",
  cta: "Request the free teaser",
};

export const clientWork = [
  {
    name: "Smart Cash Sheet",
    client: "Smart Cash Sheet",
    url: "https://smartcashsheet.com",
    image: "/client-work/smart-cash-sheet.jpg",
    alt: "Smart Cash Sheet website preview.",
    focus: "Web and mobile application engineering",
    outcome: smartCashSheetOutcome,
    signals: [
      "Web and mobile app",
      "Bank data and billing",
      "Release engineering",
    ],
  },
  {
    name: "Resplendent Tea Experience",
    client: "Terri Hitzig",
    url: "https://resplendenttea.com/",
    image: "/client-work/resplendent-tea.jpg",
    alt: "Resplendent Tea Experience website preview.",
    focus: "Local service presentation",
    outcome:
      "A clear public presence for catered afternoon tea experiences, custom pastries, events, service areas, and quote requests.",
    signals: ["Service clarity", "Event inquiries", "Local Atlanta reach"],
  },
  {
    name: "Medina Clean",
    client: "Rosa Medina",
    url: "https://medinaclean.com/",
    image: "/client-work/medina-clean.jpg",
    alt: "Medina Clean website preview.",
    caseStudyHref: "/case-studies/medina-clean",
    focus: "Lead intake, operating foundation, and assistant reach",
    outcome:
      "A bilingual service-business platform that connects public trust, appointment requests, guided estimates, reviews, and future scheduling support. Customers can now also check the service area, get a starting price, and request a cleaning from inside an AI assistant, with the owner confirming every job.",
    signals: [
      "Bilingual service",
      "Guided estimates",
      "Reachable in AI assistants",
    ],
  },
  {
    name: "Oscar's Package Store",
    client: "James Jacob",
    url: "https://www.oscarsliquorstore.com/",
    image: "/client-work/oscars-liquor-store.jpg",
    alt: "Oscar's Package Store website preview.",
    focus: "Local landmark and customer convenience",
    outcome:
      "A practical local business presence around store trust, selection, drive-through convenience, hours, directions, and direct calling.",
    signals: ["Local trust", "Directions and calls", "Store information"],
  },
  {
    name: "Clarity Mesh LLC",
    client: "Clarity Mesh LLC",
    url: "https://claritymesh-com.pages.dev/",
    image: "/client-work/clarity-mesh.jpg",
    alt: "Clarity Mesh LLC website preview.",
    focus: "Expertise-led positioning",
    outcome:
      "A focused professional services presence that explains architecture, modernization, cloud, data, search, and delivery expertise.",
    signals: [
      "Expert positioning",
      "Service clarity",
      "Consulting credibility",
    ],
  },
  {
    name: "C&J Welding",
    client: "C&J Welding and Fabricating, Inc.",
    url: "https://www.cjwelding.net/material-shapes",
    image: "/client-work/cj-welding-material-shapes.png",
    alt: "C&J Welding material shapes reference page preview.",
    focus: "Service reference and quote support",
    outcome:
      "A practical reference page that helps welding and fabrication customers identify material shapes before a quote conversation.",
    signals: ["Material references", "Quote preparation", "Smyrna shop"],
  },
  {
    // Confidentiality constraint, do not relax without the client's say-so:
    // describe the retention board by OUTCOME only. Never publish how it
    // obtains its data, never name the carriers involved, and keep the
    // deployment hostnames off public surfaces. Those details are
    // commercially sensitive for Canon, not for Northvalley.
    name: "Canon Insurance Advisers",
    client: "Canon Insurance Advisers, LLC",
    url: "https://canonadvisers.com/",
    image: "/client-work/canon-insurance-advisers.jpg",
    alt: "Canon Insurance Advisers website preview.",
    focus: "Insurance practice presence and client retention",
    outcome:
      "A public website for a Georgia insurance practice covering trucking, home, auto, and life lines, with a clear path from a coverage question to a quote conversation. Alongside it, a retention board that surfaces policies at risk of lapsing, including pending cancellations, non-renewals, and steep renewal increases, so the agency can reach the client before the policy ends rather than after.",
    signals: ["Coverage clarity", "Quote requests", "Retention before lapse"],
  },
  {
    // The CFR is always written with the article, never as bare "CFR".
    // This was a complimentary evaluation, not a paid engagement, and the
    // wording must not imply otherwise.
    name: "The CFR",
    client: "The Center for Family Resources",
    url: "https://thecfr.org/",
    image: "/client-work/the-cfr.jpg",
    alt: "The Center for Family Resources website preview.",
    focus: "Complimentary evaluation for a Cobb County nonprofit",
    outcome:
      "A complimentary website and experience evaluation for a Marietta nonprofit serving families facing housing loss, along with a set of Google Business Profile photos to help neighbors find and recognize them.",
    signals: [
      "Complimentary evaluation",
      "Nonprofit support",
      "Cobb County families",
    ],
  },
  {
    name: "Horizon Pet Waste Solutions",
    client: "Horizon Pet Waste Solutions",
    url: "https://www.horizonpetwastesolutions.com",
    image: "/client-work/horizon-pet-waste.jpg",
    alt: "Horizon Pet Waste Solutions website home page preview.",
    focus: "Website rebuild and assistant reach",
    outcome:
      "A one-person pet waste removal business had a single Google Sites page. We rebuilt it as a fast, plain-spoken site: plans with starting prices, a service-area page for the towns he serves, articles answering the questions customers actually search, and a quote request that reaches his inbox. The site also answers AI assistants directly — plans, pricing and service area — and can prepare a quote request for the owner to review. Nothing is booked without him.",
    signals: ["Website rebuild", "Local search content", "Agent-ready"],
  },
];

export const clientTestimonials = [
  {
    client: "Terri Hitzig",
    company: "Resplendent Tea Experience",
    quote: "Website Genius",
    image: "/client-work/terri-website-genius.png",
    alt: "Screenshot of Terri Hitzig saying, Website Genius.",
  },
  {
    client: "Rosa Medina",
    company: "Medina Clean",
    quote: "You are making my dream come true.",
    image: "/client-work/rosa-dream-come-true.jpg",
    alt: "Screenshot of Rosa Medina saying, You are making my dream come true.",
  },
];

export const medinaCaseStudy = {
  name: "Medina Clean",
  client: "Rosa Medina",
  url: "https://www.medinaclean.com",
  sourceUrl:
    "https://feroshjacob.github.io/posts/2026/06/01/the-end-of-software-scarcity-part-2-rosas-story",
  context:
    "A growing cleaning business near Woodstock, Georgia needed affordable software that respected how the owner already worked: direct customer communication, bilingual service, recurring clients, and practical scheduling constraints.",
  summary:
    "Northvalley Intelligence helped turn a website request into the foundation for a tailored operating system: public lead capture, guided estimates, bilingual content, appointment intake, moderated reviews, client records, recurring cleaning tasks, crew scheduling, and a private admin dashboard.",
};

export const medinaOutcomes = [
  {
    label: "Public presence",
    detail:
      "A bilingual website for Medina Clean with service pages, rate guidance, referral messaging, reviews, and appointment requests.",
  },
  {
    label: "Lead handling",
    detail:
      "Guided estimate and appointment flows collect the details Rosa needs before deciding whether a job is a fit.",
  },
  {
    label: "Operational memory",
    detail:
      "Client records preserve language preference, contact details, cleaning frequency, pricing, notes, and recurring service context.",
  },
  {
    label: "Scheduling support",
    detail:
      "Admin tools help create the next recurring cleaning, find an available crew slot, block unavailable time, and review calendar activity.",
  },
  {
    label: "Reachable inside AI assistants",
    detail:
      "A customer asking an assistant for a cleaner used to get a list of names and a dead end. Medina Clean now answers for itself: whether it covers the address, what services exist, how pricing works, a starting estimate, and a request for a time. Rosa reviews every request and confirms it herself, in English or Spanish. It was built onto the booking process she already had, so there is no second system to check.",
  },
];

export const medinaPrinciples = [
  "Start from the business owner’s real question, not a generic software package.",
  "Keep public marketing, lead intake, and private operations connected.",
  "Use low-cost infrastructure first, with deterministic rules around pricing, service area, and booking facts.",
  "Build in English and Spanish so customer communication matches the way the business actually serves clients.",
];

export const workflowSteps = [
  "Lead intake from forms, calls, SMS, and social channels",
  "Customer qualification and recurring appointment setup",
  "Crew coordination with service context and preferences",
  "Review, referral, and retention follow-up",
];
