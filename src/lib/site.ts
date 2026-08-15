export const siteConfig = {
  name: "Northvalley Intelligence",
  legalName: "Northvalley Intelligence LLC",
  domain: "northvalleyintel.com",
  url: "https://northvalleyintel.com",
  email: "hello@northvalleyintel.com",
  tagline: "Local growth systems and practical AI for service businesses",
  description:
    "Northvalley Intelligence helps local service businesses in Cobb, Paulding, and Douglas counties get found, convert leads, and clean up the workflows behind the work.",
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
};

export const aeoAnswers = [
  {
    question: "What does Northvalley Intelligence do?",
    answer:
      "Northvalley Intelligence helps local service businesses improve the full path from being found, to converting leads, to organizing the work after a customer reaches out. Behind that work, we build practical custom software and AI-agent systems around how the business actually operates.",
  },
  {
    question: "Who is Northvalley Intelligence for?",
    answer:
      "We focus on practical service businesses such as cleaners, plumbers, HVAC companies, electricians, landscapers, restoration teams, consultants, realtors, and field-service operators.",
  },
  {
    question: "Where does Northvalley Intelligence work?",
    answer:
      "Our local assessment work is focused on Cobb, Paulding, and Douglas counties, including Marietta and the surrounding Atlanta metro service areas.",
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
      "Northvalley Intelligence company site for local growth, website assessment, practical AI, and workflow modernization.",
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
  "Cleaning",
  "HVAC",
  "Plumbing",
  "Landscaping",
  "Electrical",
  "Restoration",
  "Logistics",
  "Field operations",
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

export const leadDiscoveryPoints = [
  {
    title: "Be findable before customers are ready to call",
    description:
      "Many customers search early: neighborhoods, local options, comparisons, costs, questions, and trusted providers. We look at whether the business shows up for those moments.",
  },
  {
    title: "Be understandable to AI search and chat",
    description:
      "Google still matters, but people now ask ChatGPT, Gemini, Perplexity, and other assistants for local recommendations. We look at whether the website gives those systems clear, trustworthy information to work with.",
  },
  {
    title: "Show why the local business is different",
    description:
      "Small service businesses should not compete only on generic pages. We help turn local experience, customer knowledge, and practical guidance into trust-building content.",
  },
  {
    title: "Give visitors a clear next step",
    description:
      "A lead path should be simple: consultation request, estimate, guide, valuation, service check, or another action that matches how the business actually sells.",
  },
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
  note: "A one-page teaser is emailed free. The complete assessment is a paid engagement.",
  href: "#website-assessment",
  cta: "Request the free teaser",
};

export const assessments = [
  {
    title: "Operational AI Assessment",
    description:
      "Review the workflows that drive revenue and service delivery, then identify where AI can support coordination, accuracy, and follow-through.",
    items: [
      "Lead intake and qualification",
      "Scheduling and dispatch",
      "Customer communication",
      "Retention and recurring work",
    ],
  },
  {
    title: "Knowledge Chaos Assessment",
    description:
      "Find fragmented knowledge across documents, inboxes, CRMs, notes, and staff experience, then define a path toward searchable intelligence.",
    items: [
      "Institutional knowledge mapping",
      "Information source analysis",
      "Retrieval-ready knowledge bases",
      "Operational memory systems",
    ],
  },
];

export const teamMembers = [
  {
    name: "Ferosh Jacob",
    role: "Founder",
    url: "https://feroshjacob.github.io/",
    links: [
      {
        label: "Read blog",
        url: "https://feroshjacob.github.io/posts/",
      },
    ],
    image: "/people-ferosh-jacob.png",
    description:
      "Leads Northvalley Intelligence with a focus on practical AI systems, operational software, and assessment-led modernization.",
  },
  {
    name: "Theresa Burt",
    role: "Business Liaison",
    url: "https://www.linkedin.com/in/theresaburt",
    image: "/people-theresa-burt.png",
    description:
      "Connects small-business conversations to practical next steps, helping owners explain where operations feel stuck and what support would be useful.",
  },
  {
    name: "Glen Soans",
    role: "AI Expert",
    url: "https://www.linkedin.com/in/glen-soans-4a050923",
    image: "/people-glen-soans.png",
    description:
      "Works across information retrieval and data science, with experience since 2015 in autocomplete and search systems for large retailers including Home Depot and GPC/NAPA.",
  },
];

export const clientWork = [
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
