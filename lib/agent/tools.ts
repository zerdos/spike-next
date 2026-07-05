import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  company: z.string().trim().max(200).optional(),
  role: z.string().trim().max(200).optional(),
  problem_area: z.string().trim().max(500).optional(),
  ai_usage: z.string().trim().max(500).optional(),
  timeline: z.string().trim().max(200).optional(),
  consent: z.literal(true),
});

export type Lead = z.infer<typeof leadSchema>;

export const bookCallSchema = z.object({
  name: z.string().trim().max(200).optional(),
  email: z.string().trim().email().max(320).optional(),
});

export const escalateSchema = z.object({
  reason: z.string().trim().min(1).max(500),
});

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: "capture_lead",
    description:
      "Store the visitor's contact details and qualification summary so Zoltan can follow up. Call ONLY after the visitor has explicitly agreed to share their details for follow-up. consent must be true.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Visitor's name" },
        email: { type: "string", description: "Visitor's email address" },
        company: { type: "string", description: "Company name if shared" },
        role: { type: "string", description: "Visitor's role if shared" },
        problem_area: { type: "string", description: "The business problem discussed" },
        ai_usage: { type: "string", description: "Current AI usage described by the visitor" },
        timeline: { type: "string", description: "Timeline if shared" },
        consent: {
          type: "boolean",
          description: "True only if the visitor explicitly agreed to be contacted",
        },
      },
      required: ["name", "email", "consent"],
      additionalProperties: false,
    },
  },
  {
    name: "book_call",
    description:
      "Offer the visitor a discovery-call booking link with Zoltan. Include name/email prefill ONLY if the visitor already shared them in this conversation and agreed to booking.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name to prefill, if consented" },
        email: { type: "string", description: "Email to prefill, if consented" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "escalate_to_human",
    description:
      "Hand the visitor to a human. Use for pricing negotiation, legal or contract questions, complaints, or anything outside the knowledge base. Surfaces email and booking options to the visitor.",
    input_schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Why escalation is needed (short)" },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
];
