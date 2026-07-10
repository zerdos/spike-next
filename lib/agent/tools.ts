import { Type, type FunctionDeclaration } from "@google/genai";
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

export const toolDefinitions: FunctionDeclaration[] = [
  {
    name: "capture_lead",
    description:
      "Store the visitor's contact details and qualification summary so Zoltan can follow up. Call ONLY after the visitor has explicitly agreed to share their details for follow-up. consent must be true.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Visitor's name" },
        email: { type: Type.STRING, description: "Visitor's email address" },
        company: { type: Type.STRING, description: "Company name if shared" },
        role: { type: Type.STRING, description: "Visitor's role if shared" },
        problem_area: { type: Type.STRING, description: "The business problem discussed" },
        ai_usage: {
          type: Type.STRING,
          description: "Current AI usage described by the visitor",
        },
        timeline: { type: Type.STRING, description: "Timeline if shared" },
        consent: {
          type: Type.BOOLEAN,
          description: "True only if the visitor explicitly agreed to be contacted",
        },
      },
      required: ["name", "email", "consent"],
    },
  },
  {
    name: "book_call",
    description:
      "Offer the visitor a discovery-call booking link with Zoltan. Include name/email prefill ONLY if the visitor already shared them in this conversation and agreed to booking.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name to prefill, if consented" },
        email: { type: Type.STRING, description: "Email to prefill, if consented" },
      },
    },
  },
  {
    name: "escalate_to_human",
    description:
      "Hand the visitor to a human. Use for pricing negotiation, legal or contract questions, complaints, or anything outside the knowledge base. Surfaces email and booking options to the visitor.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        reason: { type: Type.STRING, description: "Why escalation is needed (short)" },
      },
      required: ["reason"],
    },
  },
];
