const endpoint = process.env.WORKFLOW_CHAT_TEST_URL || "http://127.0.0.1:3103";

const tests = [
  {
    name: "unsupported-new-orleans",
    message: "new orleans",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "I am a baker, can you help me find business?",
      },
      {
        role: "assistant",
        content:
          "Could you tell me what local area you serve? Also, where are you hoping to find new customers today?",
      },
      {
        role: "user",
        content: "website",
      },
    ],
    assert: includesAll(["may not be a fit", "Atlanta"]),
  },
  {
    name: "plumber-website-help",
    message: "I am a plumber, can you help me fix my website?",
    assert: includesAll(["plumber", "local area"]),
    not: ["phone number", "email for one of us"],
  },
  {
    name: "plumber-qualified-contact",
    message: "Marietta, I need help with the website",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "I am a plumber, can you help me fix my website?",
      },
      {
        role: "assistant",
        content:
          "You are in the right place. We can look at whether the website helps the right local customers understand what you do, where you serve, why they should trust you, and what step to take next. Are you serving Marietta, Atlanta, or another local area?",
      },
    ],
    assert: includesAny(["phone number", "email"]),
  },
  {
    name: "hair-dresser-remembers-trade",
    message: "I don't know, friends maybe",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "hair dresser here, can you help me get more clients?",
      },
      {
        role: "assistant",
        content:
          "That sounds like a lead-generation problem. Good-fit leads should match the services, locations, and jobs the business actually wants more of. Where should good leads come from today?",
      },
    ],
    assert: includesAny(["hair", "local area", "area"]),
    not: ["what kind of service business are you running"],
  },
  {
    name: "closet-designer-referrals",
    message: "referrals actually",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "I am a closet designer, can you help me find more clients?",
      },
      {
        role: "assistant",
        content:
          "That sounds like a lead-generation problem. Where should good leads come from today?",
      },
    ],
    assert: includesAny(["closet", "referral", "local area", "area"]),
  },
  {
    name: "pest-controller-getting-found",
    message: "getting found?",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content:
          "I am local pest controller, I need to find more clients, where to start?",
      },
    ],
    assert: includesAny(["pest", "Google", "AI search", "local area", "area"]),
  },
  {
    name: "hvac-google-leads",
    message: "We are an HVAC company and need more Google leads",
    assert: includesAll(["HVAC"]),
    not: ["phone number", "email for one of us"],
  },
  {
    name: "cleaning-schedule-clutter",
    message:
      "We are a cleaning company and our recurring schedule is getting messy",
    assert: includesAny(["cleaning", "schedule", "recurring"]),
    not: ["phone number", "email for one of us"],
  },
  {
    name: "unknown-trade-location-no-contact",
    message: "I serve Atlanta",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "I need more leads",
      },
      {
        role: "assistant",
        content:
          "That sounds like a lead-generation problem. Where should good leads come from today?",
      },
    ],
    assert: includesAny(["kind of service", "service business", "what service"]),
    not: ["phone number", "email for one of us"],
  },
  {
    name: "known-trade-missing-location-no-contact",
    message: "referrals",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "I am an electrician and need more leads",
      },
      {
        role: "assistant",
        content:
          "For an electrician, that sounds like a lead-generation problem.",
      },
    ],
    assert: includesAny(["electrician", "local area", "area"]),
    not: ["phone number", "email for one of us"],
  },
  {
    name: "electrician-qualified-contact",
    message: "I serve Marietta",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "I am an electrician and need more leads",
      },
      {
        role: "assistant",
        content:
          "For an electrician, that sounds like a lead-generation problem.",
      },
      {
        role: "user",
        content: "referrals",
      },
    ],
    assert: includesAny(["phone number", "email"]),
  },
  {
    name: "contact-pushback",
    message: "tell me what you know about plumbing?",
    history: [
      {
        role: "assistant",
        content:
          "Where should we start: getting found, converting leads, or cleaning up the work after someone reaches out?",
      },
      {
        role: "user",
        content: "can you help me fix my website?",
      },
      {
        role: "assistant",
        content:
          "You are in the right place. We can look at whether the website helps the right local customers understand what you do, where you serve, why they should trust you, and what step to take next. Are you serving Marietta, Atlanta, or another local area?",
      },
      {
        role: "user",
        content: "Atlanta, I am a plumber",
      },
      {
        role: "assistant",
        content:
          "Since you are a plumber, this is worth a real conversation. Could you share the best phone number or email for one of us to reach out?",
      },
    ],
    assert: includesAll(["not plumbers", "plumber"]),
  },
  {
    name: "pricing-unknown",
    message: "How much does this cost?",
    assert: includesAny([
      "set up some time",
      "discuss",
      "understand",
      "service",
    ]),
  },
];

let failures = 0;

for (const [index, test] of tests.entries()) {
  const response = await fetch(`${endpoint}/api/workflow-chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      sessionId: `suite-${index}`,
      message: test.message,
      history: test.history || [],
      turnIndex: test.turnIndex || 0,
    }),
  });
  const data = await response.json();
  const reply = String(data.reply || "");
  const ok =
    response.ok &&
    test.assert(reply) &&
    !(test.not || []).some((phrase) =>
      reply.toLowerCase().includes(phrase.toLowerCase()),
    );

  if (!ok) {
    failures += 1;
  }

  console.log(`${ok ? "PASS" : "FAIL"} ${test.name}: ${reply}`);
}

if (failures) {
  process.exit(1);
}

function includesAll(phrases) {
  return (reply) =>
    phrases.every((phrase) =>
      reply.toLowerCase().includes(phrase.toLowerCase()),
    );
}

function includesAny(phrases) {
  return (reply) =>
    phrases.some((phrase) =>
      reply.toLowerCase().includes(phrase.toLowerCase()),
    );
}
