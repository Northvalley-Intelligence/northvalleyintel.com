/**
 * Content for the ChatGPT booking demo case study.
 *
 * Accuracy rules, do not loosen:
 * - The recording shows a booking REQUEST. Rosa reviews and confirms. Nothing
 *   here may imply an automatically confirmed appointment.
 * - $150 is a STARTING estimate for 3 bedrooms / 2 baths every 2 weeks.
 *   Confirmed against Medina Clean's live pricing rules on 2026-08-05:
 *   5 rooms x $30 = $150. The $120 figure on the agent-native flyer is
 *   2 bed / 2 bath (4 rooms x $30) and is also correct.
 * - The demo used placeholder customer details, not a real customer.
 * - OpenAI's naming has moved across "plugin", "app" and "connector". The
 *   recording says connector; keep that primary and mention the alternatives
 *   once for search coverage.
 */

export const chatgptBookingDemo = {
  slug: "chatgpt-booking-medina-clean",
  eyebrow: "Agent-Native Case Study",
  title:
    "Booking Inside ChatGPT: How a Woodstock Cleaning Company Answers Customers Who Never Visit Its Website",
  lede: "A customer asks ChatGPT for a house cleaning near Woodstock, Georgia. ChatGPT checks Medina Clean's real service area, quotes from their real pricing rules, and files a real booking request — in under a minute, without the customer ever opening the website.",
  body: [
    "This is an unedited screen recording of Medina Clean answering four customer questions from inside ChatGPT. Nothing in the answers is generated from memory — every number comes out of the business's own system through a connector built and run by Northvalley Intelligence.",
    "Rosa, the owner, still reviews and confirms every job. The assistant handles intake; a human closes. You are not replacing your website — you are adding a door into it.",
  ],
  youTubeId: "SuqicQ11nU8",
  youTubeWatchUrl: "https://youtu.be/SuqicQ11nU8",
  embedUrl: "https://www.youtube.com/embed/SuqicQ11nU8",
  thumbnailUrl: "https://i.ytimg.com/vi/SuqicQ11nU8/maxresdefault.jpg",
  uploadDate: "2026-08-05",
  durationIso: "PT55S",
  durationLabel: "55 seconds",
  demoDataNote:
    "The booking in this recording uses placeholder customer details, not a real customer.",
  terminologyNote:
    "OpenAI has called this a plugin, an app, and a connector at different times. The recording says connector.",
};

export type TranscriptEntry = {
  time: string;
  heading: string;
  lines: { speaker?: string; text: string }[];
  toolCalled?: string;
};

export const chatgptBookingTranscript: TranscriptEntry[] = [
  {
    time: "0:00",
    heading: "Title",
    lines: [
      {
        text: "Your website answers the people who find it. Answer the ones who never visit. Medina Clean, live inside ChatGPT. Four questions, answered by their own service area, pricing and booking system.",
      },
    ],
  },
  {
    time: "0:04",
    heading: "Service area",
    lines: [
      {
        speaker: "Customer",
        text: "Using Medina Clean, is 30188 in the service area?",
      },
      {
        speaker: "ChatGPT",
        text: "Yes — 30188 is in Medina Clean's service area. Medina Clean confirms that ZIP code 30188 is within the current service area.",
      },
    ],
    toolCalled: "check_service_area",
  },
  {
    time: "0:13",
    heading: "Starting estimate",
    lines: [
      {
        speaker: "Customer",
        text: "Using Medina Clean, get a starting estimate for a 3-bedroom, 2-bath cleaning every 2 weeks.",
      },
      {
        speaker: "Medina Clean card",
        text: "Medina Clean starting estimate — $150 USD — 5 rooms. Starting estimate, Rosa confirms the final price.",
      },
      {
        speaker: "ChatGPT",
        text: "The Medina Clean starting estimate for a 3-bedroom, 2-bath cleaning every 2 weeks is $150 starting estimate.",
      },
    ],
    toolCalled: "get_estimate",
  },
  {
    time: "0:24",
    heading: "Booking request",
    lines: [
      {
        speaker: "Customer",
        text: "Using Medina Clean, book it — name Demo Test, phone (470) 555-0148, address 100 Main St, Woodstock GA 30188, 3 bed / 2 bath every 2 weeks, prefer weekday mornings.",
      },
      { speaker: "ChatGPT", text: "Checking service area eligibility…" },
      {
        speaker: "ChatGPT",
        text: "Your Medina Clean booking request has been submitted. Request details — Name: Demo Test. Phone: (470) 555-0148. Address: 100 Main St, Woodstock, GA 30188. Service: Every 2 weeks. Home size: 3 bedrooms / 2 bathrooms. Preferred time: Weekday mornings. Status: Pending review. Rosa will review the request, confirm the address and preferred timing, and contact you to finalize the appointment. This request is not yet a confirmed appointment.",
      },
    ],
    toolCalled: "request_appointment",
  },
  {
    time: "0:42",
    heading: "Spanish",
    lines: [
      { speaker: "Customer", text: "¿Puedes hacerlo en español?" },
      {
        speaker: "ChatGPT",
        text: "¡Sí! Puedo hacerlo en español. A partir de ahora responderé en español y puedo ayudarte con las solicitudes de Medina Clean en español.",
      },
    ],
  },
  {
    time: "0:50",
    heading: "Close",
    lines: [
      {
        text: "Same question. Same assistant. Only one can answer it. Every answer in this recording came out of Medina Clean's own systems, through a connector Northvalley Intelligence built and runs.",
      },
    ],
  },
];

export const chatgptBookingFaq = [
  {
    question: "Can customers book my business directly inside ChatGPT?",
    answer:
      "They can submit a real booking request. In this recording the request reaches the business's own queue with a pending-review status, and the owner confirms it.",
  },
  {
    question: "Does ChatGPT make up the price?",
    answer:
      "No. The $150 starting estimate is returned by the business's pricing rules through a connector. Without that connection, an assistant can only point back at your website.",
  },
  {
    question: "Is the appointment confirmed automatically?",
    answer:
      "No. The request is logged as pending. Rosa reviews the address and preferred time and contacts the customer to finalize it.",
  },
  {
    question: "Does it work in other languages?",
    answer:
      "Yes. The last question in the recording is asked in Spanish and answered in Spanish through the same tools.",
  },
  {
    question: "Do I need to replace my website?",
    answer:
      "No. The connector uses the same intake path your website form already uses — same records, same notification.",
  },
  {
    question: "What does it take to set up?",
    answer:
      "Connecting a business is a one-time setup. Northvalley Intelligence builds and runs the connector.",
  },
];

export const chatgptBookingClips = [
  { name: "Is ZIP 30188 in the service area?", startOffset: 4, endOffset: 13 },
  {
    name: "Starting estimate for 3 bed / 2 bath",
    startOffset: 13,
    endOffset: 24,
  },
  { name: "Booking request into operations", startOffset: 24, endOffset: 42 },
  { name: "The same request in Spanish", startOffset: 42, endOffset: 50 },
];
