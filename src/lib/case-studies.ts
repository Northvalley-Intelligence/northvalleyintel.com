import {
  CalendarCheck2,
  FileText,
  MessageSquareText,
  PanelsTopLeft,
  type LucideIcon,
} from "lucide-react";

export type CaseStudyArticle = {
  slug: string;
  title: string;
  eyebrow: string;
  published: string;
  readTime: string;
  summary: string;
  sourceUrl: string;
  image: string;
  icon: LucideIcon;
  sections: {
    heading: string;
    body: string[];
    points?: string[];
  }[];
};

export const medinaCleanArticles: CaseStudyArticle[] = [
  {
    slug: "rosas-story",
    title: "Rosa's Story",
    eyebrow: "Case Study Origin",
    published: "June 1, 2026",
    readTime: "3 minute read",
    sourceUrl:
      "https://feroshjacob.github.io/posts/2026/06/01/the-end-of-software-scarcity-part-2-rosas-story",
    image: "/case-study-rosa-story.svg",
    icon: FileText,
    summary:
      "How a small cleaning-business website request helped us test whether tailored operational software is becoming practical for very small businesses.",
    sections: [
      {
        heading: "The business question",
        body: [
          "Rosa Medina runs a growing cleaning business with recurring customers, direct client communication, and practical scheduling constraints. She had wanted a website for years, but the expected cost made it feel out of reach.",
          "The initial question was simple: could AI help create a professional website she could actually afford?",
        ],
      },
      {
        heading: "The larger experiment",
        body: [
          "The website was only the entry point. The more important question was whether modern AI-assisted development could support the business around the website: leads, estimates, communication, follow-up, and operational memory.",
          "That made this a useful Northvalley case study for our team. It started with a real business owner, a real constraint, and a practical workflow rather than a generic software demo.",
        ],
        points: [
          "Public presence for a local service business",
          "Lead intake that captures useful service context",
          "English and Spanish content for the way customers communicate",
          "A foundation for future scheduling and client-management tools",
        ],
      },
      {
        heading: "What changed",
        body: [
          "The conversation shifted from whether custom software was affordable to what should be built next. That shift matters because small businesses have historically adapted themselves to whatever generic tools they could afford.",
          "The Medina Clean project suggests the path we want to help more businesses take: software that starts with the owner’s actual workflow and grows from there.",
        ],
      },
    ],
  },
  {
    slug: "website-ai-chat",
    title: "Website and AI Chat",
    eyebrow: "Public Experience",
    published: "June 8, 2026",
    readTime: "Native preview",
    sourceUrl:
      "https://feroshjacob.github.io/posts/2026/06/08/the-end-of-software-scarcity-part-2-website-ai-chat",
    image: "/case-study-website-chat.svg",
    icon: MessageSquareText,
    summary:
      "How we think a public website can move beyond brochureware into guided intake, customer education, and practical bilingual support.",
    sections: [
      {
        heading: "The job of the website",
        body: [
          "For a local service business, we believe the website should help a prospective customer understand services, service area, price signals, and the next step without forcing the owner to answer the same questions repeatedly.",
          "That does not require a flashy AI-first experience. It requires clear content, trustworthy intake, and a way to collect the facts the business owner needs before accepting work.",
        ],
      },
      {
        heading: "Where AI belongs",
        body: [
          "AI support is most useful when it helps customers navigate real service decisions: what kind of cleaning they need, whether recurring service makes sense, what details affect an estimate, and how to request an appointment.",
          "The assistant should support the operating model. It should not become the brand, override business rules, or make commitments the owner has not approved.",
        ],
        points: [
          "Answer common service questions using approved content",
          "Collect structured intake details before handoff",
          "Respect language preference",
          "Escalate ambiguous or high-risk requests to the owner",
        ],
      },
      {
        heading: "The Northvalley lesson",
        body: [
          "We see a website as more valuable when it is connected to the business workflow behind it. The public page, intake form, and assistant should all feed the same operational understanding instead of creating another disconnected channel.",
        ],
      },
    ],
  },
  {
    slug: "lead-workflow",
    title: "Lead Workflow",
    eyebrow: "Operating System",
    published: "June 15, 2026",
    readTime: "Native preview",
    sourceUrl:
      "https://feroshjacob.github.io/posts/2026/06/15/the-end-of-software-scarcity-part-2-lead-workflow",
    image: "/case-study-lead-workflow.svg",
    icon: CalendarCheck2,
    summary:
      "How we connect lead intake, qualification, recurring appointments, and follow-up into a lightweight operating system for a service business.",
    sections: [
      {
        heading: "The workflow behind the lead",
        body: [
          "A lead is not just a form submission. For a cleaning business, it can imply service type, home size, frequency, location, preferred language, availability, pricing context, and whether the request fits the business.",
          "Capturing those details consistently creates leverage. The owner can make better decisions, respond faster, and avoid rebuilding context from text messages, memory, and scattered notes.",
        ],
      },
      {
        heading: "From intake to operations",
        body: [
          "The next layer is connecting the public request to private operational tools: customer records, recurring service preferences, crew availability, follow-up reminders, and review or referral moments.",
          "This is where a small business starts to get software that reflects its real operating model instead of a generic CRM that has to be bent into shape.",
        ],
        points: [
          "Structured lead and appointment records",
          "Recurring service context",
          "Scheduling constraints and blocked time",
          "Follow-up tasks after estimate, service, and review moments",
        ],
      },
      {
        heading: "The practical boundary",
        body: [
          "The goal is not to automate judgment away from the business owner. The goal is to preserve context, reduce avoidable coordination work, and make the next action clearer.",
        ],
      },
    ],
  },
];

export const medinaCleanCaseStudy = {
  name: "Medina Clean",
  href: "/case-studies/medina-clean",
  title: "Medina Clean: from website request to operating foundation",
  description:
    "A native Northvalley case-study series on affordable, workflow-shaped software for a growing cleaning business.",
  visualIcon: PanelsTopLeft,
};

export function getMedinaArticle(slug: string) {
  return medinaCleanArticles.find((article) => article.slug === slug);
}
