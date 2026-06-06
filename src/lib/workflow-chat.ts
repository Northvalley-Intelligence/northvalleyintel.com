export type WorkflowChatRequest = {
  sessionId: string;
  message: string;
  turnstileToken: string;
  history: Array<{
    role: "assistant" | "user";
    content: string;
  }>;
  turnIndex: number;
};

export type WorkflowChatResponse = {
  reply: string;
  mode: "llm" | "deterministic_fallback";
  provider: string;
  model: string;
  calendarInvite?: "created" | "not_configured" | "not_requested";
};

export type WorkflowChatModelConfig = {
  enabled: boolean;
  provider: string;
  model: string;
  baseUrl: string;
  apiKey?: string;
  appUrl?: string;
  appTitle?: string;
};

type WorkflowChatEnv = Record<string, string | undefined>;

type OpenAiUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
};

const setupLine = "Let us set up some time to discuss and understand more.";

const siteContext = `
Northvalley Intelligence is a boutique operational AI consultancy for real-world small businesses.
We help local service businesses get found, turn interest into real leads, and clean up the workflows behind the work.
We can help business owners reason through lead problems, but we should first distinguish no-lead problems from lead-handling problems.
Core services:
- Help the right people find you: Google, AI search, referrals, local content, and service-area pages.
- Turn interest into real leads: clear next steps, trust signals, consultation requests, estimates, booking, and sales handoff.
- Clean up the work behind it: follow-up, scheduling, customer communication, documentation, handoffs, and repeated work.
Service area:
- Northvalley is focused on Marietta, Atlanta, Cobb County, and nearby Georgia service-area businesses.
- If a visitor gives a location outside the supported service area, be honest that it may not be a fit and do not keep qualifying them as a lead.
Assessment model:
- Operational AI Assessment covers lead intake and qualification, scheduling and dispatch, customer communication, retention, and recurring work.
- Knowledge Chaos Assessment covers institutional knowledge mapping, information source analysis, retrieval-ready knowledge bases, and operational memory.
Lead-generation assessment framing:
- When a service business says it is not getting leads, first treat it as a discoverability, differentiation, trust, and lead-path problem, not a follow-up workflow problem.
- Many customers search before they are ready to call: local comparisons, neighborhoods, service questions, costs, guides, and trusted providers.
- SEO for Google still matters, but many people now ask AI assistants such as ChatGPT, Gemini, Perplexity, and Google AI experiences for recommendations and answers. A business website should be clear enough for those systems to understand what the business does, where it serves, why it is trustworthy, and what next step a visitor should take.
- Northvalley can help review whether the business is findable in those moments, whether the site explains why the local business is different, and whether visitors have a clear next step such as consultation, estimate, guide, valuation, or service check.
- Do not assume a specific industry unless the visitor names it. Examples can include realtors, cleaners, contractors, consultants, and local service providers.
Industries named on the website: cleaning, HVAC, plumbing, landscaping, electrical, restoration, logistics, field operations.
Medina Clean case study:
- A growing cleaning business near Woodstock, Georgia needed affordable software around bilingual service, recurring clients, practical scheduling, and direct customer communication.
- Northvalley helped turn a website request into public lead capture, guided estimates, appointment intake, reviews, client records, recurring cleaning tasks, crew scheduling, and a private admin dashboard.
Team:
- Ferosh Jacob, Founder.
- Theresa Burt, Business Liaison.
- Glen Soans, AI Expert.
Tone:
- Calm, practical, welcoming to small-business owners.
- Avoid hype, flashy AI claims, and pretending to know details not provided by the visitor.
Scheduling goal:
- If a visitor is interested or the answer is unclear, invite them to schedule an assessment conversation during Eastern business hours.
`;

export function normalizeWorkflowChatRequest(body: unknown): WorkflowChatRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const message = clean(record.message, 1200);

  if (!message) {
    return null;
  }

  return {
    sessionId: normalizeSessionId(record.sessionId),
    message,
    turnstileToken: clean(record.turnstileToken, 3000),
    history: normalizeHistory(record.history),
    turnIndex: normalizeTurnIndex(record.turnIndex),
  };
}

export function buildFallbackWorkflowChatResponse(
  request: WorkflowChatRequest,
): WorkflowChatResponse {
  return {
    reply: shouldRequestContact(request)
      ? buildContactCaptureReply(request.message, request.history)
      : shouldRequestQualification(request)
        ? buildQualificationReply(request.message, request.history)
      : buildDeterministicReply(request.message, request.history),
    mode: "deterministic_fallback",
    provider: "rules",
    model: "northvalley-guardrails",
    calendarInvite: "not_requested",
  };
}

export function shouldRequestContact(request: WorkflowChatRequest) {
  const qualification = getLeadQualification(request.message, request.history);
  return (
    request.history.length >= 3 &&
    Boolean(
      qualification.businessType &&
        qualification.location &&
        qualification.helpNeed,
    )
  );
}

export function shouldRequestQualification(request: WorkflowChatRequest) {
  const qualification = getLeadQualification(request.message, request.history);
  const hasAnyQualification = Boolean(
    qualification.businessType || qualification.helpNeed || qualification.location,
  );
  const hasAllQualification = Boolean(
    qualification.businessType &&
      qualification.location &&
      qualification.helpNeed,
  );
  const shouldCompleteStrongPartial =
    Boolean(qualification.businessType && qualification.helpNeed) ||
    Boolean(qualification.location && qualification.helpNeed);

  return (
    hasAnyQualification &&
    !hasAllQualification &&
    (request.history.length >= 3 || shouldCompleteStrongPartial)
  );
}

export function hasUnsupportedLocation(request: WorkflowChatRequest) {
  const qualification = getLeadQualification(request.message, request.history);
  return Boolean(qualification.unsupportedLocation);
}

export function buildUnsupportedLocationReply(
  message: string,
  history: WorkflowChatRequest["history"] = [],
) {
  const qualification = getLeadQualification(message, history);
  const location = qualification.unsupportedLocation || "that area";

  return `Thanks for sharing that. We are focused on Marietta, Atlanta, Cobb County, and nearby Georgia service-area businesses, so ${location} may not be a fit for us right now. If you also serve the Atlanta area, tell us that and we can continue.`;
}

export function buildContactCaptureReply(
  message: string,
  history: WorkflowChatRequest["history"] = [],
) {
  if (hasContactInfo(message)) {
    return "Thank you. We have enough context to follow up respectfully. One of us will reach out using the contact information you shared.";
  }

  const businessType = extractBusinessType([message, ...history.map((item) => item.content)]);
  const context = businessType
    ? `Since you are ${withArticle(businessType)}, this is worth a real conversation.`
    : "This is worth a real conversation.";

  if (isContactPushbackQuestion(message.toLowerCase())) {
    const serviceContext = getServiceContext(businessType);
    const businessContext = businessType
      ? `We are not plumbers, but we do understand the business side for ${withArticle(businessType)}: ${serviceContext.leadExample.toLowerCase()}`
      : "We focus on the business side: getting found, converting leads, and cleaning up follow-up.";

    return `${businessContext} To make this useful for your situation, could you share the best phone number or email for one of us to reach out?`;
  }

  return `${context} Could you share the best phone number or email for one of us to reach out? We will use it only to follow up about this request.`;
}

export function buildQualificationReply(
  message: string,
  history: WorkflowChatRequest["history"] = [],
) {
  const qualification = getLeadQualification(message, history);

  if (!qualification.businessType) {
    return "Before we ask for contact details, what kind of service business are you running?";
  }

  if (!qualification.helpNeed) {
    return `Before we ask for contact details, what do you want help with as ${withArticle(qualification.businessType)}: getting found, converting leads, the website, follow-up, scheduling, or cluttered information?`;
  }

  return `That makes sense for ${withArticle(qualification.businessType)}. What local area do you serve, for example Marietta, Atlanta, or another nearby market?`;
}

export function getWorkflowChatAttemptConfigs(
  env: WorkflowChatEnv,
  turnIndex: number,
) {
  const providers = clean(env.AI_CHAT_PROVIDER_CHAIN, 160)
    .split(",")
    .map((provider) => provider.trim().toLowerCase())
    .filter(Boolean);
  const chain = providers.length ? providers : ["gemini", "openrouter"];
  const configs = chain
    .map((provider) => getNamedProviderConfig(env, provider))
    .filter((config) => config.enabled && config.baseUrl && config.model);

  if (configs.length < 2) {
    return configs;
  }

  const startIndex = Math.abs(turnIndex) % configs.length;
  return [...configs.slice(startIndex), ...configs.slice(0, startIndex)];
}

export function buildProviderHeaders(config: WorkflowChatModelConfig) {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (config.apiKey) {
    headers.authorization = `Bearer ${config.apiKey}`;
  }

  if (config.provider === "openrouter") {
    headers["HTTP-Referer"] = config.appUrl || "https://northvalleyintel.com";
    headers["X-Title"] = config.appTitle || "Northvalley Intelligence";
  }

  return headers;
}

export function buildOpenAiWorkflowChatRequest(
  message: string,
  history: WorkflowChatRequest["history"],
  model: string,
  options: { disableThinking?: boolean; maxTokens?: number } = {},
) {
  return {
    model,
    temperature: 0.15,
    max_tokens: options.maxTokens || 260,
    ...(options.disableThinking ? { think: false } : {}),
    messages: [
      {
        role: "system",
        content:
          `You are Northvalley Intelligence's website assistant. Answer only from this website context.\n${siteContext}\nRules:\n` +
          "- Keep replies under 90 words.\n" +
          "- Sound like a practical intake conversation, not a script.\n" +
          "- Do not invent pricing, availability, client results, credentials, guarantees, integrations, or calendar slots.\n" +
          "- If the visitor asks something not answered by the context, say: Let us set up some time to discuss and understand more.\n" +
          "- If the visitor describes a workflow problem, acknowledge it and ask one useful follow-up question.\n" +
          "- Before asking for phone or email, identify the visitor's service trade, local area served, and the help they need.\n" +
          "- If the visitor serves outside Marietta, Atlanta, Cobb County, or nearby Georgia, say it may not be a fit and ask whether they also serve the Atlanta area.\n" +
          "- If the visitor says they are not getting leads, do not discuss lead intake yet. Ask where leads are supposed to come from today, such as website, Google, referrals, social media, partner venues, or ads.\n" +
          "- Use the visitor's stated business type when they provide one, but do not invent industry details beyond practical examples.\n" +
          "- If the visitor says they are a solo owner or it is just them, acknowledge that directly and keep the next question simple.\n" +
          "- If the visitor wants to meet, ask for name, email, business name, and a preferred Eastern-time business-hours window.\n" +
          "- Do not claim an appointment is scheduled unless the system says a calendar invite was created.",
      },
      {
        role: "user",
        content: `Recent conversation:\n${historyForPrompt(history)}\n\nLatest visitor message with contact details redacted when present:\n${redactSensitiveText(message)}`,
      },
    ],
  };
}

export function parseOpenAiChatResponse(data: unknown) {
  const record = data as {
    choices?: Array<{ message?: { content?: unknown } }>;
    usage?: OpenAiUsage;
  };
  const content = clean(record.choices?.[0]?.message?.content, 1400);
  if (!content) {
    throw new Error("empty_model_response");
  }

  return {
    content,
    usage: record.usage || {},
  };
}

export function shouldRejectWorkflowReply(reply: string) {
  const normalized = reply.toLowerCase();

  return (
    /\$[0-9]|guarantee|guaranteed|certified|24\/7|same-day|we already scheduled|your appointment is scheduled/.test(
      normalized,
    ) ||
    /example\.com|replace with actual|\[[^\]]+\]/i.test(reply)
  );
}

export function shouldForceSetupReply(message: string, reply: string) {
  const normalized = message.toLowerCase();
  const asksUnknown =
    /price|cost|how much|available|availability|integrate|integration|software do you use|do you work with|can you build|timeline/.test(
      normalized,
    );

  if (!asksUnknown) {
    return false;
  }

  return !reply.toLowerCase().includes("set up");
}

export function sanitizeWorkflowReply(message: string, reply: string) {
  if (shouldRejectWorkflowReply(reply) || shouldForceSetupReply(message, reply)) {
    return setupLine;
  }

  return reply;
}

export function buildCalendarRequest(message: string) {
  const email = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const wantsMeeting = /meet|meeting|schedule|appointment|calendar|talk|consult|assessment/i.test(
    message,
  );

  if (!email || !wantsMeeting) {
    return null;
  }

  return {
    attendeeEmail: email,
    summary: "Northvalley Intelligence assessment conversation",
    description: `Workflow assessment request from website chat.\n\nVisitor message:\n${message.slice(0, 1200)}`,
    startsAt: extractPreferredEasternStart(message),
  };
}

export function classifyWorkflowChatIntent(message: string) {
  const normalized = message.toLowerCase();

  if (/meet|meeting|schedule|appointment|calendar|talk|consult|assessment/.test(normalized)) {
    return "schedule_request";
  }

  if (isNoLeadProblem(normalized)) {
    return "no_leads";
  }

  if (isAiSearchQuestion(normalized) || isDiscoverabilityQuestion(normalized)) {
    return "lead_generation";
  }

  if (isConversionProblem(normalized)) {
    return "lead_conversion";
  }

  if (/lead|facebook|call|text|inbox|follow|inquir/.test(normalized)) {
    return "lead_handling";
  }

  if (/schedul|dispatch|crew|calendar|appointment|booking/.test(normalized)) {
    return "scheduling";
  }

  if (/note|spreadsheet|document|crm|memory|knowledge|tribal/.test(normalized)) {
    return "knowledge";
  }

  if (/price|cost|how much|timeline|available|availability|integrat|build/.test(normalized)) {
    return "needs_discussion";
  }

  return "general_workflow";
}

function getNamedProviderConfig(
  env: WorkflowChatEnv,
  provider: string,
): WorkflowChatModelConfig {
  if (provider === "local" || provider === "llama" || provider === "ollama") {
    const baseUrl =
      clean(env.LOCAL_LLM_BASE_URL, 240) ||
      clean(env.OLLAMA_BASE_URL, 240) ||
      "";

    return {
      enabled: Boolean(baseUrl),
      provider: "local",
      model:
        clean(env.LOCAL_LLM_MODEL || env.OLLAMA_MODEL, 120) ||
        "llama3.1",
      baseUrl,
      apiKey: clean(env.LOCAL_LLM_API_KEY, 1000) || undefined,
      appUrl: clean(env.AI_CHAT_APP_URL || env.NEXT_PUBLIC_SITE_URL, 240) || undefined,
      appTitle: clean(env.AI_CHAT_APP_TITLE, 80) || "Northvalley Intelligence",
    };
  }

  if (provider === "gemini") {
    return {
      enabled: Boolean(clean(env.GEMINI_API_KEY, 1000)),
      provider: "gemini",
      model: clean(env.GEMINI_MODEL, 120) || "gemini-2.5-flash",
      baseUrl:
        clean(env.GEMINI_BASE_URL, 240) ||
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      apiKey: clean(env.GEMINI_API_KEY, 1000) || undefined,
      appUrl: clean(env.AI_CHAT_APP_URL || env.NEXT_PUBLIC_SITE_URL, 240) || undefined,
      appTitle: clean(env.AI_CHAT_APP_TITLE, 80) || "Northvalley Intelligence",
    };
  }

  if (provider === "openrouter") {
    return {
      enabled: Boolean(clean(env.OPENROUTER_API_KEY, 1000)),
      provider: "openrouter",
      model:
        clean(env.OPENROUTER_MODEL || env.AI_CHAT_MODEL, 120) ||
        "google/gemini-2.5-flash",
      baseUrl:
        clean(env.OPENROUTER_BASE_URL, 240) ||
        "https://openrouter.ai/api/v1/chat/completions",
      apiKey: clean(env.OPENROUTER_API_KEY, 1000) || undefined,
      appUrl: clean(env.AI_CHAT_APP_URL || env.NEXT_PUBLIC_SITE_URL, 240) || undefined,
      appTitle: clean(env.AI_CHAT_APP_TITLE, 80) || "Northvalley Intelligence",
    };
  }

  return {
    enabled: false,
    provider,
    model: "",
    baseUrl: "",
  };
}

function buildDeterministicReply(
  message: string,
  history: WorkflowChatRequest["history"] = [],
) {
  const normalized = message.toLowerCase();
  const businessType = extractBusinessType([message, ...history.map((item) => item.content)]);
  const serviceContext = getServiceContext(businessType);
  const businessLeadPrefix = businessType
    ? `For ${withArticle(businessType)}, that `
    : "That ";
  const leadSource = extractLeadSource(normalized);
  const answeringLeadSource =
    history.some((item) => /where should good leads come from/i.test(item.content)) &&
    Boolean(leadSource);

  if (/^(hi|hello|hey|help|start|not sure|i am not sure|where do i start)\b/.test(normalized)) {
    return "We can start in one of three places: getting found by the right local customers, turning interest into real leads, or cleaning up follow-up and scheduling. Which one feels most urgent right now?";
  }

  if (isMeetingRequest(normalized)) {
    return "We can set up an assessment conversation during Eastern business hours. Please share your name, email, business name, and a couple of preferred times.";
  }

  if (isWebsiteHelpQuestion(normalized)) {
    return `${businessType ? `You are in the right place. For ${withArticle(businessType)}, we` : "You are in the right place. We"} can look at whether the website helps the right local customers understand what you do, where you serve, why they should trust you, and what step to take next. Are you serving Marietta, Atlanta, or another local area?`;
  }

  if (isAskingWhatWeNeed(normalized)) {
    return "Good place to start. We need three basics first: what service trade you are in, what local area you serve, and what kind of help you want most: getting found, fixing the website, converting leads, follow-up, scheduling, or cleaning up scattered information.";
  }

  if (isNoLeadProblem(normalized) || isLeadGrowthQuestion(normalized)) {
    return `${businessLeadPrefix}sounds like a lead-generation problem, not a follow-up problem yet. ${serviceContext.leadExample} Where should good leads come from today: your website, Google, referrals, social media, partner relationships, or paid ads?`;
  }

  if (answeringLeadSource) {
    return buildLeadSourceFollowUp(leadSource, businessType);
  }

  if (isAiSearchQuestion(normalized)) {
    return "AI search readiness means your site clearly explains what you do, where you serve, who you help, proof that you are trustworthy, and the next step to contact you. Is the bigger concern Google visibility, ChatGPT-style answers, or both?";
  }

  if (isDiscoverabilityQuestion(normalized)) {
    return `${businessType ? `For ${withArticle(businessType)}, being found` : "Being found"} usually starts with making the business clear to people and search systems: what you do, where you serve, why customers should trust you, and what step they should take next. ${serviceContext.discoveryQuestion}`;
  }

  if (isConversionProblem(normalized)) {
    return `${businessType ? `For ${withArticle(businessType)}, that` : "That"} sounds like a lead-conversion problem. We would look at what visitors see, whether they trust the business, and whether the next step is obvious. Where are people dropping off today: ${serviceContext.conversionPlaces}?`;
  }

  if (/\b(just me|only me|solo|by myself|one person|no team|it is me|it's me)\b/.test(normalized)) {
    return "That makes sense. When you are the whole team, the first useful step is usually finding where attention is leaking. Is the bigger issue being found, getting inquiries to respond, or turning inquiries into booked calls?";
  }

  if (/lead|facebook|call|text|inbox|follow|inquir/.test(normalized)) {
    return `${businessType ? `For ${withArticle(businessType)}, lead intake` : "Lead intake"} and follow-up are common places where small businesses lose time. What happens today after a new lead comes in: ${serviceContext.followUpPlaces}?`;
  }

  if (/schedul|dispatch|crew|calendar|appointment|booking/.test(normalized)) {
    return `${businessType ? `For ${withArticle(businessType)}, scheduling pressure` : "Scheduling pressure"} usually means the workflow depends on too much memory or manual coordination. ${serviceContext.schedulingQuestion}`;
  }

  if (/note|spreadsheet|document|crm|memory|knowledge|tribal/.test(normalized)) {
    return `${businessType ? `For ${withArticle(businessType)}, that` : "That"} sounds like operational knowledge getting scattered. ${serviceContext.knowledgeQuestion}`;
  }

  if (/price|cost|how much|timeline|available|availability|integrat|build/.test(normalized)) {
    return setupLine;
  }

  return "That is useful context. We usually start by finding which part of the path is weakest: getting found, converting interest, or managing the work after someone reaches out. Which one should we look at first?";
}

function buildLeadSourceFollowUp(leadSource: string, businessType: string) {
  const serviceContext = getServiceContext(businessType);

  if (leadSource === "referrals") {
    if (businessType.includes("closet")) {
      return "For a closet designer, referrals usually come from people who already see home projects: past clients, interior designers, realtors, builders, remodelers, or professional organizers. Which referral group do you already have some connection with?";
    }

    return `${businessType ? `For ${withArticle(businessType)}, referrals` : "Referrals"} are a good fit, but they need a system. We would look at who already trusts your work, what proof they can share, and how easy it is for them to introduce you. ${serviceContext.referralQuestion}`;
  }

  if (leadSource === "website" || leadSource === "google") {
    return `${businessType ? `For ${withArticle(businessType)}, we` : "We"} would check whether people can quickly understand your service area, the problems you solve, examples of your work, proof they can trust you, and the next step to contact you. What location or type of customer matters most?`;
  }

  if (leadSource === "social") {
    return `${businessType ? `For ${withArticle(businessType)}, social` : "Social"} can help when it shows real work, useful advice, and a clear path to inquire. Which platform already gets the most attention: Instagram, Facebook, LinkedIn, or something else?`;
  }

  if (leadSource === "ads") {
    return "Paid ads can create attention, but the page and follow-up still have to convert it. Where would the ad send someone today, and what action would they be asked to take?";
  }

  return "That gives us a starting point. We would check whether that channel makes the business clear, trustworthy, and easy to contact. What type of customer would be the best fit?";
}

function getServiceContext(businessType: string) {
  const normalized = businessType.toLowerCase();

  if (/pest|extermin/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may be homeowners, landlords, property managers, restaurants, or offices with recurring pest issues.",
      discoveryQuestion:
        "Are you trying to reach homeowners, property managers, restaurants, or another local segment?",
      conversionPlaces: "inspection requests, phone calls, quote forms, service plans, or emergency calls",
      followUpPlaces: "inspection, quote, treatment plan, service date, or recurring prevention",
      schedulingQuestion:
        "Who tracks inspections, treatment visits, callbacks, and recurring prevention today?",
      knowledgeQuestion:
        "Where do treatment notes, property access details, pest history, and follow-up reminders live today?",
      referralQuestion:
        "Do referrals usually come from property managers, realtors, landlords, restaurants, or past customers?",
    };
  }

  if (/closet|cabinet|designer|design/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may come from homeowners planning storage projects, remodelers, interior designers, realtors, or past clients.",
      discoveryQuestion:
        "Are you trying to reach homeowners directly, remodelers, interior designers, realtors, or another referral partner?",
      conversionPlaces: "portfolio views, consultation requests, measurements, design calls, estimates, or booked installs",
      followUpPlaces: "consultation, measurement, design review, estimate, deposit, or install date",
      schedulingQuestion:
        "Who tracks consultations, measurements, design revisions, estimates, and install dates today?",
      knowledgeQuestion:
        "Where do room measurements, design preferences, photos, estimates, and install notes live today?",
      referralQuestion:
        "Which referral group is closest today: past clients, interior designers, realtors, builders, remodelers, or professional organizers?",
    };
  }

  if (/clean|maid|janitorial/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may be recurring home cleaning clients, offices, move-out cleans, short-term rentals, or property managers.",
      discoveryQuestion:
        "Are you trying to reach recurring homeowners, offices, short-term rentals, move-out customers, or property managers?",
      conversionPlaces: "quote requests, service-area pages, recurring-cleaning offers, phone calls, or booking forms",
      followUpPlaces: "quote, walkthrough, first clean, recurring schedule, crew assignment, or reminder",
      schedulingQuestion:
        "Who tracks recurring visits, crew availability, customer preferences, and reschedules today?",
      knowledgeQuestion:
        "Where do customer preferences, access notes, pricing, supplies, and recurring schedule details live today?",
      referralQuestion:
        "Do referrals usually come from current customers, realtors, property managers, offices, or local community groups?",
    };
  }

  if (/hvac|heating|air conditioning|ac\b/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may be emergency repairs, maintenance plans, replacements, seasonal tune-ups, or property managers.",
      discoveryQuestion:
        "Are you trying to reach repair calls, replacement buyers, maintenance-plan customers, or property managers?",
      conversionPlaces: "emergency calls, quote forms, maintenance-plan pages, replacement estimates, or booking",
      followUpPlaces: "service call, diagnostic, estimate, part order, maintenance plan, or install date",
      schedulingQuestion:
        "Who tracks technicians, emergency calls, maintenance visits, parts, and install windows today?",
      knowledgeQuestion:
        "Where do equipment details, service history, warranty notes, parts, and maintenance reminders live today?",
      referralQuestion:
        "Do referrals usually come from past customers, property managers, builders, realtors, or other trades?",
    };
  }

  if (/plumb/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may be emergency calls, remodel work, water-heater replacements, inspections, or property managers.",
      discoveryQuestion:
        "Are you trying to reach emergency repair customers, remodel projects, property managers, or replacement jobs?",
      conversionPlaces: "emergency calls, quote forms, inspection requests, water-heater pages, or booking",
      followUpPlaces: "service call, diagnosis, estimate, parts, permit needs, or return visit",
      schedulingQuestion:
        "Who tracks emergency calls, technician availability, parts, estimates, and return visits today?",
      knowledgeQuestion:
        "Where do job notes, photos, parts, customer history, property access, and warranty details live today?",
      referralQuestion:
        "Do referrals usually come from past customers, property managers, remodelers, realtors, or other trades?",
    };
  }

  if (/hair|salon|barber|stylist/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may be local clients looking for cuts, color, styling, regular appointments, bridal work, or referrals from happy customers.",
      discoveryQuestion:
        "Are you trying to reach nearby clients, bridal parties, regular color clients, or referral customers?",
      conversionPlaces: "booking links, service pages, Instagram, Google profile, reviews, or consultation requests",
      followUpPlaces: "consultation, booking, reminder, rebooking, review request, or referral",
      schedulingQuestion:
        "Who tracks appointments, cancellations, rebooking reminders, and client preferences today?",
      knowledgeQuestion:
        "Where do client preferences, formulas, appointment notes, photos, and rebooking reminders live today?",
      referralQuestion:
        "Do referrals usually come from friends, current clients, bridal parties, local groups, or social media?",
    };
  }

  if (/landscap|lawn|tree/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may be recurring lawn care clients, seasonal cleanups, landscape projects, HOAs, or property managers.",
      discoveryQuestion:
        "Are you trying to reach recurring maintenance customers, project work, HOAs, or property managers?",
      conversionPlaces: "estimate requests, service-area pages, seasonal offers, project photos, or booking",
      followUpPlaces: "estimate, property visit, crew schedule, recurring route, materials, or seasonal reminder",
      schedulingQuestion:
        "Who tracks routes, crew capacity, weather changes, estimates, and recurring maintenance today?",
      knowledgeQuestion:
        "Where do property notes, photos, plant choices, route details, pricing, and seasonal reminders live today?",
      referralQuestion:
        "Do referrals usually come from neighbors, HOAs, property managers, builders, or current customers?",
    };
  }

  if (/electric/.test(normalized)) {
    return {
      leadExample:
        "Good-fit leads may be panel upgrades, service calls, remodel work, EV charger installs, or property managers.",
      discoveryQuestion:
        "Are you trying to reach service calls, panel upgrades, EV charger installs, remodels, or property managers?",
      conversionPlaces: "service calls, quote forms, project photos, inspection requests, or booking",
      followUpPlaces: "service call, estimate, permit, parts, inspection, or install date",
      schedulingQuestion:
        "Who tracks electricians, estimates, parts, permits, inspections, and return visits today?",
      knowledgeQuestion:
        "Where do job notes, photos, panel details, permits, parts, and inspection status live today?",
      referralQuestion:
        "Do referrals usually come from builders, remodelers, realtors, property managers, or past customers?",
    };
  }

  return {
    leadExample:
      "Good-fit leads should match the services, locations, and jobs the business actually wants more of.",
    discoveryQuestion:
      "What kind of local customer are you trying to reach?",
    conversionPlaces: "website visits, calls, forms, estimates, or booking",
    followUpPlaces: "call, form, estimate, appointment, or follow-up",
    schedulingQuestion: "Who currently owns the schedule?",
    knowledgeQuestion: "Where does the most important information live today?",
    referralQuestion: "Who currently sends you the best referrals?",
  };
}

function normalizeHistory(value: unknown): WorkflowChatRequest["history"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const role =
        record.role === "assistant"
          ? "assistant"
          : record.role === "user"
            ? "user"
            : null;
      const content = clean(record.content, 500);

      return role && content ? { role, content } : null;
    })
    .filter((item): item is WorkflowChatRequest["history"][number] => Boolean(item))
    .slice(-8);
}

function normalizeSessionId(value: unknown) {
  const sessionId = clean(value, 80);

  if (/^[a-zA-Z0-9_-]{8,80}$/.test(sessionId)) {
    return sessionId;
  }

  return "anonymous";
}

function historyForPrompt(history: WorkflowChatRequest["history"]) {
  if (!history.length) {
    return "No prior turns.";
  }

  return history
    .map((message) => `${message.role}: ${redactSensitiveText(message.content)}`)
    .join("\n");
}

function isNoLeadProblem(normalized: string) {
  return (
    /(not getting|no|zero|few|not enough|need more|lack of|struggling to get|hard to get).{0,40}(lead|leads|inquir|inquiries|booking|bookings|client|clients|cleint|cleints|customer|customers)/.test(
      normalized,
    ) ||
    /(lead|leads|inquir|inquiries|booking|bookings|client|clients|cleint|cleints|customer|customers).{0,40}(not coming|not getting|dry|slow|few|zero|none|no)/.test(
      normalized,
    )
  );
}

function isLeadGrowthQuestion(normalized: string) {
  return (
    /(how|help|need|want|trying).{0,35}(get|find|create|generate|bring in|attract).{0,25}(lead|leads|client|clients|cleint|cleints|customer|customers|business)/.test(
      normalized,
    ) ||
    /(more|better).{0,20}(lead|leads|client|clients|cleint|cleints|customer|customers|business)/.test(
      normalized,
    )
  );
}

function isAskingWhatWeNeed(normalized: string) {
  return /(what|which).{0,20}(need|info|information|details).{0,20}(from me|from us|to start)|what do you need/.test(
    normalized,
  );
}

function isContactPushbackQuestion(normalized: string) {
  return /(what|tell me).{0,30}(know|understand|do)|why.{0,20}(phone|email|contact)|before.{0,20}(phone|email|contact)/.test(
    normalized,
  );
}

function getLeadQualification(
  message: string,
  history: WorkflowChatRequest["history"] = [],
) {
  const values = [message, ...history.map((item) => item.content)];

  return {
    businessType: extractBusinessType(values),
    location: extractLocation(values),
    unsupportedLocation: extractUnsupportedLocation(values),
    helpNeed: extractHelpNeed(values),
  };
}

function extractUnsupportedLocation(values: string[]) {
  const text = values.join(" ").toLowerCase();
  const unsupported =
    [
      "new orleans",
      "louisiana",
      "la",
      "nashville",
      "charlotte",
      "miami",
      "tampa",
      "dallas",
      "austin",
      "houston",
      "chicago",
      "new york",
    ].find((location) => {
      if (location === "la") {
        return /\bla\b/.test(text);
      }

      return text.includes(location);
    }) || "";

  return unsupported;
}

function extractLocation(values: string[]) {
  const text = values.join(" ").toLowerCase();
  const knownLocation =
    [
      "marietta",
      "atlanta",
      "woodstock",
      "kennesaw",
      "east cobb",
      "west cobb",
      "cobb county",
      "roswell",
      "alpharetta",
      "smyrna",
      "georgia",
      "ga",
    ].find((location) => text.includes(location)) || "";

  if (knownLocation) {
    return knownLocation;
  }

  const match = text.match(
    /\b(?:in|near|around|serving|serve|service area is)\s+([a-z][a-z\s-]{2,35})(?:[,.?!]|$)/,
  );

  return match ? clean(match[1], 40).replace(/\s+/g, " ") : "";
}

function extractHelpNeed(values: string[]) {
  const text = values.join(" ").toLowerCase();

  if (isWebsiteHelpQuestion(text)) {
    return "website";
  }
  if (isNoLeadProblem(text) || isLeadGrowthQuestion(text) || isDiscoverabilityQuestion(text)) {
    return "lead_generation";
  }
  if (isConversionProblem(text)) {
    return "lead_conversion";
  }
  if (/schedul|dispatch|crew|calendar|appointment|booking/.test(text)) {
    return "scheduling";
  }
  if (/note|spreadsheet|document|crm|memory|knowledge|tribal|clutter|scattered/.test(text)) {
    return "workflow_clutter";
  }
  if (/follow|inbox|call|text|quote request|inquir/.test(text)) {
    return "follow_up";
  }

  return "";
}

function extractLeadSource(normalized: string) {
  if (/\b(referral|referrals|word of mouth|past client|past clients)\b/.test(normalized)) {
    return "referrals";
  }
  if (/\b(website|site)\b/.test(normalized)) {
    return "website";
  }
  if (/\b(google|seo|search|local search|local pages)\b/.test(normalized)) {
    return "google";
  }
  if (/\b(instagram|facebook|social|linkedin|tiktok)\b/.test(normalized)) {
    return "social";
  }
  if (/\b(ads|adwords|paid ads|paid search)\b/.test(normalized)) {
    return "ads";
  }
  if (/\b(partner|partners|partnership|partnerships)\b/.test(normalized)) {
    return "partners";
  }
  return "";
}

function extractBusinessType(values: string[]) {
  const textValues = values.map((value) => value.toLowerCase());
  const patterns = [
    /\b(?:i am|i'm|we are|we're)\s+(?:a|an)\s+([a-z][a-z\s-]{2,45}?)(?:[,.?!]| can | and | who | that | looking | need | where |$)/,
    /\b(?:i am|i'm|we are|we're)\s+(local\s+[a-z][a-z\s-]{2,45}?)(?:[,.?!]| can | and | who | that | looking | need | where |$)/,
    /\b(?:my|our)\s+business\s+(?:is|does)\s+([a-z][a-z\s-]{2,45}?)(?:[,.?!]| and | who | that | looking |$)/,
  ];
  const match = textValues
    .flatMap((text) => patterns.map((pattern) => text.match(pattern)))
    .find(Boolean);

  if (match) {
    return clean(match[1], 48).replace(/\s+/g, " ");
  }

  const text = textValues.join(" ");
  if (/\b(plumbing|plumping)\b/.test(text)) {
    return "plumber";
  }
  if (/\b(hair\s*dresser|hairdresser|hair stylist|hairstylist|salon|barber)\b/.test(text)) {
    return "hairdresser";
  }

  const knownBusiness =
    [
      "local pest controller",
      "pest controller",
      "closet designer",
      "hvac company",
      "cleaning company",
      "landscaping company",
      "electrician",
      "plumber",
    ].find((label) => text.includes(label)) || "";

  return knownBusiness;
}

function withArticle(value: string) {
  if (/^(hvac|ac|electrician)/i.test(value)) {
    return `an ${value}`;
  }

  return /^[aeiou]/i.test(value) ? `an ${value}` : `a ${value}`;
}

function isMeetingRequest(normalized: string) {
  return (
    /meet|meeting|consult|consultation|assessment|talk to|talk with/.test(normalized) ||
    /schedule.{0,24}(time|call|meeting|assessment|consultation|appointment)/.test(
      normalized,
    ) ||
    /(book|set up).{0,24}(call|meeting|assessment|consultation|appointment)/.test(
      normalized,
    )
  );
}

function isAiSearchQuestion(normalized: string) {
  return /\b(chatgpt|gemini|perplexity|ai search|ai overview|ai overviews|answer engine|agent|agents)\b/.test(
    normalized,
  );
}

function isWebsiteHelpQuestion(normalized: string) {
  return /\b(website|site|web site|homepage|landing page)\b/.test(normalized) &&
    /\b(fix|improve|update|redo|help|better|work|working|convert|conversion)\b/.test(
      normalized,
    );
}

function isDiscoverabilityQuestion(normalized: string) {
  return (
    /\b(how|help|want|need|trying|start).{0,35}(be found|get found|getting found|show up|rank|visible|visibility|discover|discovered)\b/.test(
      normalized,
    ) ||
    /\b(be found|get found|getting found|show up|rank|visible|visibility|discover|discovered)\b/.test(
      normalized,
    ) ||
    /\b(google|seo|chatgpt|gemini|perplexity|ai search|ai overview|local search)\b/.test(
      normalized,
    )
  );
}

function isConversionProblem(normalized: string) {
  return (
    /(visitor|visitors|traffic|website|site|people|prospect|prospects|lead|leads).{0,45}(not|dont|don't|doesnt|doesn't|won't|wont|no).{0,35}(call|submit|contact|book|buy|convert|turn into|become|schedule)/.test(
      normalized,
    ) ||
    /(not|dont|don't|doesnt|doesn't|won't|wont|no).{0,35}(convert|turn into|become|book|buy|schedule).{0,35}(customer|customers|client|clients|lead|leads|business)/.test(
      normalized,
    ) ||
    /(estimate|estimates|quote|quotes|inquiry|inquiries).{0,35}(not|dont|don't|doesnt|doesn't|won't|wont|no).{0,35}(close|book|convert|turn into|become)/.test(
      normalized,
    )
  );
}

function extractPreferredEasternStart(message: string) {
  const normalized = message.toLowerCase();
  const hourMatch = normalized.match(/\b(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\s*(am|pm)\b/);
  if (!hourMatch) {
    return "";
  }

  let hour = Number(hourMatch[1]);
  const minute = Number(hourMatch[2] || "0");
  const meridiem = hourMatch[3];

  if (meridiem === "pm" && hour !== 12) {
    hour += 12;
  }
  if (meridiem === "am" && hour === 12) {
    hour = 0;
  }

  if (hour < 9 || hour >= 17) {
    return "";
  }

  const now = new Date();
  const next = new Date(now);
  const weekdayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const requestedWeekday = weekdayNames.findIndex((day) =>
    normalized.includes(day),
  );

  if (normalized.includes("tomorrow")) {
    next.setDate(next.getDate() + 1);
  } else if (requestedWeekday >= 0) {
    const daysAhead = (requestedWeekday - next.getDay() + 7) % 7 || 7;
    next.setDate(next.getDate() + daysAhead);
  } else {
    next.setDate(next.getDate() + 1);
  }

  if (next.getDay() === 0 || next.getDay() === 6) {
    return "";
  }

  next.setHours(hour, minute, 0, 0);
  return next.toISOString();
}

export function redactSensitiveText(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, "[phone]")
    .replace(
      /\b\d{2,6}\s+[A-Za-z0-9 .'-]{3,80}(street|st|road|rd|drive|dr|lane|ln|avenue|ave|court|ct|circle|cir)\b/gi,
      "[street address]",
    );
}

function hasContactInfo(value: string) {
  return (
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value) ||
    /\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(value)
  );
}

function normalizeTurnIndex(value: unknown) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    return 0;
  }

  return Math.min(number, 1000);
}

function clean(value: unknown, max: number) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
