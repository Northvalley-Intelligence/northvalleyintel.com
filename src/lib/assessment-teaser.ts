export type AssessmentTeaserRequest = {
  email: string;
  websiteUrl: string;
  businessName: string;
  turnstileToken: string;
};

export type AssessmentCategory = {
  label: string;
  score: number;
  scoreStatus?: "scored" | "unavailable";
  businessImpact?: string;
  recommendedFix?: string;
};

export type AssessmentReportSummary = {
  domain: string;
  url: string;
  grade: string;
  overallScore: number;
  executiveSummary: string;
  categories: AssessmentCategory[];
  topBusinessProblems: string[];
  topRecommendedFixes: string[];
  evidenceQuality?: {
    confidence?: string;
    summary?: string;
    pagesWithReadableText?: number;
  };
  crawlMetadata?: {
    pagesCrawled?: number;
  };
};

export function normalizeAssessmentTeaserRequest(
  body: unknown,
): AssessmentTeaserRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const email = clean(record.email, 180).toLowerCase();
  const websiteUrl = clean(record.websiteUrl, 500);
  const businessName = clean(record.businessName, 120);
  const turnstileToken = clean(record.turnstileToken, 3000);

  if (!isValidEmail(email) || !websiteUrl) {
    return null;
  }

  return {
    email,
    websiteUrl,
    businessName,
    turnstileToken,
  };
}

export function buildAssessmentTeaserEmailText(input: {
  request: AssessmentTeaserRequest;
  report?: AssessmentReportSummary;
  status: "queued" | "completed" | "failed";
  message?: string;
}) {
  if (input.status !== "completed" || !input.report) {
    return [
      "Website Growth Assessment request",
      "",
      `Website: ${input.request.websiteUrl}`,
      `Business: ${input.request.businessName || "Not provided"}`,
      "",
      input.message ||
        "The assessment could not generate a teaser report automatically. Northvalley will review the request.",
    ].join("\n");
  }

  const report = input.report;
  const strongest = strongestCategory(report.categories);
  const weakest = weakestCategories(report.categories, 2);

  return [
    "Your Northvalley Website Growth Assessment teaser is attached.",
    "",
    `Website: ${report.domain}`,
    `Score: ${Math.round(report.overallScore)}/100 (${report.grade})`,
    strongest ? `Strongest visible area: ${strongest.label}` : "",
    weakest.length
      ? `Biggest visible opportunities: ${weakest.map((item) => item.label).join(", ")}`
      : "",
    "",
    "This one-page teaser is intentionally limited. The paid assessment includes the page-level evidence, exact failing checks, priority fix sequence, and implementation readout.",
    "",
    "Northvalley focuses this analysis on local lead growth in Cobb, Paulding, and Douglas counties: being found, being trusted, and making the next step obvious for nearby customers.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildAssessmentTeaserPdf(input: {
  request: AssessmentTeaserRequest;
  report: AssessmentReportSummary;
}) {
  const report = input.report;
  const score = Math.round(report.overallScore);
  const strongest = strongestCategory(report.categories);
  const weakest = weakestCategories(report.categories, 4);
  const pages = report.crawlMetadata?.pagesCrawled;
  const confidence = report.evidenceQuality?.confidence;
  const lines: PdfLine[] = [
    { text: "Northvalley Intelligence Website Growth Assessment", size: 18, bold: true },
    {
      text: `Teaser report for ${input.request.businessName || report.domain}`,
      size: 11,
    },
    { text: `Website: ${report.url}`, size: 9 },
    { text: "" },
    {
      text: `${score}/100  |  Grade ${report.grade}  |  ${strongest?.label || "Lead Readiness"} opportunity`,
      size: 16,
      bold: true,
    },
    { text: "" },
    {
      text: "What this report does",
      size: 13,
      bold: true,
    },
    {
      text:
        "This assessment looks at whether a local business website can help nearby customers find the business, trust it quickly, and take the next step. It is not a generic SEO score, security scan, or technical website doctor.",
    },
    {
      text:
        "Northvalley evaluates public website signals against local buying behavior in Cobb, Paulding, and Douglas counties, including service-area clarity, AI-answer readiness, trust proof, mobile contact paths, and lead conversion friction.",
    },
    { text: "" },
    { text: "Executive read", size: 13, bold: true },
    { text: report.executiveSummary },
    { text: "" },
    { text: "Selected signals, not the full report", size: 13, bold: true },
    ...weakest.map((category) => ({
      text: `${category.label}: ${Math.round(category.score)}/100. ${
        category.businessImpact || "This area may be limiting local lead capture."
      }`,
    })),
    { text: "" },
    { text: "What the paid report includes", size: 13, bold: true },
    {
      text:
        "Page-level evidence, exact missing signals, confidence notes, scoring logic, priority fixes, and an implementation readout focused on what is most likely to improve local lead generation.",
    },
    { text: "" },
    {
      text: `Evidence sampled: ${pages ?? "public pages"} pages. Confidence: ${
        confidence || "reported in full assessment"
      }.`,
      size: 9,
    },
    {
      text:
        "To purchase the complete assessment and executive readout, reply to this email or contact ferosh@northvalleyintel.com.",
      size: 10,
      bold: true,
    },
  ];

  return buildPdf(lines);
}

export function buildAssessmentTeaserFileName(report: AssessmentReportSummary) {
  return `${report.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-website-growth-teaser.pdf`;
}

export function strongestCategory(categories: AssessmentCategory[]) {
  return [...categories]
    .filter((category) => category.scoreStatus !== "unavailable")
    .sort((a, b) => b.score - a.score)[0];
}

export function weakestCategories(categories: AssessmentCategory[], count: number) {
  return [...categories]
    .filter((category) => category.scoreStatus !== "unavailable")
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type PdfLine = {
  text: string;
  size?: number;
  bold?: boolean;
};

function buildPdf(lines: PdfLine[]) {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 54;
  const maxWidth = 88;
  const stream: string[] = ["BT", `${margin} ${pageHeight - margin} Td`];
  let currentY = pageHeight - margin;

  for (const line of wrapPdfLines(lines, maxWidth)) {
    const size = line.size || 10;
    const leading = Math.round(size * 1.45);

    if (currentY - leading < margin) {
      break;
    }

    if (!line.text) {
      stream.push(`0 -${leading} Td`);
      currentY -= leading;
      continue;
    }

    stream.push(`/${line.bold ? "F2" : "F1"} ${size} Tf`);
    stream.push(`(${escapePdfText(line.text)}) Tj`);
    stream.push(`0 -${leading} Td`);
    currentY -= leading;
  }

  stream.push("ET");
  const content = stream.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

function wrapPdfLines(lines: PdfLine[], maxWidth: number) {
  const wrapped: PdfLine[] = [];

  for (const line of lines) {
    if (!line.text || line.text.length <= maxWidth) {
      wrapped.push(line);
      continue;
    }

    const words = line.text.split(" ");
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxWidth) {
        wrapped.push({ ...line, text: current });
        current = word;
      } else {
        current = next;
      }
    }
    if (current) {
      wrapped.push({ ...line, text: current });
    }
  }

  return wrapped;
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "");
}
