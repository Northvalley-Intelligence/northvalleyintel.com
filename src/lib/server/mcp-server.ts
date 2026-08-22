/**
 * The Northvalley agent-native MCP surface.
 *
 * Three tools: one read, two writes. Both writes submit a REQUEST and return a
 * pending status. No code path in this file emits a confirmed state — Northvalley
 * confirms the work, never the assistant. That invariant is repeated in every
 * tool description and in the server instructions because assistants read them.
 *
 * There is deliberately no service-area tool. Northvalley works with clients
 * anywhere in the US; the Cobb/Paulding/Douglas focus is an input to the
 * lead-growth analysis inside an assessment, not a boundary on who it will work
 * with. Location is collected as a field, never as an eligibility check.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { featuredOffering, featuredService, services, siteConfig } from "../site";
import { runAbuseGate } from "./mcp-abuse";
import { sendNotificationEmail, type ServerEnv } from "./notify";

const PENDING_STATUS = "pending_review" as const;

const readAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: false,
} as const;

const writeAnnotations = {
  readOnlyHint: false,
  destructiveHint: false,
  openWorldHint: true,
} as const;

export const serverInstructions = [
  "Northvalley Intelligence builds practical custom software and agent-native service surfaces for operational small businesses.",
  "",
  "Use list_services to explain what Northvalley does before submitting anything.",
  "Use request_assessment when someone wants their website reviewed.",
  "Use request_consult when someone wants to talk about custom software or an agent-native surface for their own business.",
  "",
  "Both request tools SUBMIT A REQUEST for Northvalley to review. They never confirm, schedule, or commit to anything. Always tell the person their request is pending review and that Northvalley will follow up by email. Never state or imply that a meeting, assessment, or engagement is confirmed.",
  "Northvalley works with clients anywhere in the United States. Never tell anyone they are outside a service area.",
  "Never ask anyone for a password, API key, access token, or account login.",
].join("\n");

export function buildMcpServer(env: ServerEnv, clientIp: string) {
  const server = new McpServer(
    { name: "northvalley-intelligence", version: "1.0.0" },
    { instructions: serverInstructions },
  );

  server.registerTool(
    "list_services",
    {
      title: "List Northvalley services",
      description:
        "List what Northvalley Intelligence offers, including the Website Growth Assessment and agent-native service delivery. Call this before request_assessment or request_consult so the person knows what they are asking for.",
      annotations: readAnnotations,
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              company: siteConfig.legalName,
              positioning: siteConfig.positioning,
              agentNativeServiceDelivery: {
                title: featuredService.title,
                summary:
                  "Northvalley builds agent-native service delivery: a business becomes reachable from inside AI assistants such as Claude, ChatGPT, and Gemini, answering what it offers and submitting a request for the owner to review. This connector is Northvalley's own agent-native service delivery running live.",
              },
              worksWith:
                "Northvalley works with clients anywhere in the United States. There is no service-area restriction on who can submit a request.",
              localAnalysisFocus: siteConfig.serviceArea,
              services: services.map((service) => ({
                title: service.title,
                description: service.description,
              })),
              websiteGrowthAssessment: {
                title: featuredOffering.title,
                summary: featuredOffering.summary,
                reviewAreas: featuredOffering.items,
                pricing:
                  "A one-page teaser is emailed free. The complete assessment is a paid engagement arranged separately, and its findings are never returned through this interface.",
              },
              note: "The Website Growth Assessment teaser is emailed as a one-page PDF. The complete assessment is a paid engagement and is never returned through this interface.",
            },
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerTool(
    "request_assessment",
    {
      title: "Request a Website Growth Assessment",
      description:
        "Submit a REQUEST for a Website Growth Assessment of a business website. Northvalley reviews the request and emails a one-page teaser report. This tool never returns assessment findings, scores, or report content — it only submits the request. Tell the person their request is pending review.",
      annotations: writeAnnotations,
      inputSchema: {
        email: z
          .string()
          .email()
          .describe("Email address where Northvalley should send the teaser."),
        websiteUrl: z
          .string()
          .min(3)
          .describe("The business website to review, for example example.com."),
        businessName: z
          .string()
          .optional()
          .describe("Business name, if known."),
        location: z
          .string()
          .optional()
          .describe(
            "City or area the business serves. Used as context inside the analysis, never as an eligibility check.",
          ),
        doNotFill: z
          .string()
          .optional()
          .describe("Leave empty. Used to detect automated submissions."),
        sharedSecret: z
          .string()
          .optional()
          .describe("Only required if Northvalley issued you one."),
      },
    },
    async (args) => {
      const gate = await runAbuseGate({
        env,
        tool: "request_assessment",
        contact: args.email,
        clientIp,
        doNotFill: args.doNotFill,
        sharedSecret: args.sharedSecret,
        freeText: [args.businessName ?? "", args.location ?? ""],
      });

      if (!gate.ok) {
        return rejection(gate.reason);
      }

      const delivery = await sendNotificationEmail({
        env,
        toEnvKeys: [
          "ASSESSMENT_TEASER_NOTIFY_TO",
          "ASSESSMENT_HOST_EMAIL",
          "CHAT_NOTIFY_TO",
        ],
        subject: `Assessment request from an AI assistant: ${args.websiteUrl}`,
        replyTo: args.email,
        text: [
          "A Website Growth Assessment was requested from inside an AI assistant.",
          "",
          "This is a request pending review, not a confirmed engagement.",
          "",
          `Website: ${args.websiteUrl}`,
          `Email: ${args.email}`,
          `Business: ${args.businessName || "Not provided"}`,
          `Location: ${args.location || "Not provided"}`,
          "",
          "Source: mcp_assistant",
        ].join("\n"),
      });

      if (!delivery.ok) {
        return rejection(
          "The request could not be delivered right now. Please email hello@northvalleyintel.com directly.",
        );
      }

      await gate.commit();

      return pending(
        `The assessment request for ${args.websiteUrl} is pending review. Northvalley will review it and email the one-page teaser to ${args.email}. Nothing is confirmed yet. No assessment findings or scores are included in this response — the complete assessment is a separate paid engagement.`,
        { website: args.websiteUrl, email: args.email },
      );
    },
  );

  server.registerTool(
    "request_consult",
    {
      title: "Request a consultation with Northvalley",
      description:
        "Submit a REQUEST to talk with Northvalley about custom software, workflow problems, or making a business reachable from inside AI assistants. This does not book or confirm a meeting. Northvalley reviews the request and follows up by email. Tell the person their request is pending review.",
      annotations: writeAnnotations,
      inputSchema: {
        name: z.string().min(1).describe("Who is asking."),
        email: z.string().email().describe("Where Northvalley should reply."),
        business: z
          .string()
          .optional()
          .describe("Business name and what it does."),
        need: z
          .string()
          .min(1)
          .describe(
            "What the person wants help with, in their own words. Do not include credentials.",
          ),
        preferredTimes: z
          .string()
          .optional()
          .describe(
            "Times that tend to work. This is a preference only; nothing is scheduled by this tool.",
          ),
        doNotFill: z
          .string()
          .optional()
          .describe("Leave empty. Used to detect automated submissions."),
        sharedSecret: z
          .string()
          .optional()
          .describe("Only required if Northvalley issued you one."),
      },
    },
    async (args) => {
      const gate = await runAbuseGate({
        env,
        tool: "request_consult",
        contact: args.email,
        clientIp,
        doNotFill: args.doNotFill,
        sharedSecret: args.sharedSecret,
        freeText: [args.need, args.business ?? "", args.preferredTimes ?? ""],
      });

      if (!gate.ok) {
        return rejection(gate.reason);
      }

      const delivery = await sendNotificationEmail({
        env,
        subject: `Consult request from an AI assistant: ${args.name}`,
        replyTo: args.email,
        text: [
          "Someone requested a consultation from inside an AI assistant.",
          "",
          "This is a request pending review, not a confirmed meeting.",
          "",
          `Name: ${args.name}`,
          `Email: ${args.email}`,
          `Business: ${args.business || "Not provided"}`,
          `Preferred times: ${args.preferredTimes || "Not provided"}`,
          "",
          "What they need",
          args.need,
          "",
          "Source: mcp_assistant",
        ].join("\n"),
      });

      if (!delivery.ok) {
        return rejection(
          "The request could not be delivered right now. Please email hello@northvalleyintel.com directly.",
        );
      }

      await gate.commit();

      return pending(
        `The consultation request about "${args.need}" is pending review. Northvalley will follow up with ${args.name} by email at ${args.email}. Nothing is scheduled or confirmed yet.`,
        { name: args.name, email: args.email },
      );
    },
  );

  return server;
}

function pending(message: string, details: Record<string, string>) {
  return {
    content: [{ type: "text" as const, text: message }],
    structuredContent: {
      status: PENDING_STATUS,
      confirmed: false,
      message,
      ...details,
    },
  };
}

function rejection(reason: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: reason }],
  };
}
