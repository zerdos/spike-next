import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  Type,
  type FunctionDeclaration,
} from "@google/genai";
import type { JudgeVerdict } from "./types.ts";

const JUDGE_TOOL: FunctionDeclaration = {
  name: "submit_verdict",
  description: "Submit the grading verdict for the assistant reply under review.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      grounded: {
        type: Type.BOOLEAN,
        description: "True if every factual claim is supported by the knowledge base excerpt.",
      },
      tone_ok: {
        type: Type.BOOLEAN,
        description: "True if the reply matches Spike's persona: concise, UK English, no hype.",
      },
      reasons: { type: Type.STRING, description: "One or two sentences justifying both scores." },
    },
    required: ["grounded", "tone_ok", "reasons"],
  },
};

/**
 * LLM-as-judge for the "correctness" and "tone" categories only — refusal,
 * injection, and handoff are graded deterministically (see checks.ts) so a
 * confused judge can't wave through a real failure.
 */
export async function judgeResponse(params: {
  apiKey: string;
  model: string;
  knowledgeBase: string;
  visitorMessages: string[];
  assistantText: string;
}): Promise<JudgeVerdict> {
  const client = new GoogleGenAI({ apiKey: params.apiKey });

  const response = await client.models.generateContent({
    model: params.model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Visitor said:\n${params.visitorMessages.map((m) => `- ${m}`).join("\n")}\n\nAgent replied:\n${params.assistantText}\n\nGrade this reply.`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: {
        parts: [
          {
            text: `You are grading a customer-facing AI agent's reply for spike.land, an AI agency. Score strictly against the knowledge base excerpt below — "grounded" means every claim traces to it, not that the reply merely sounds plausible.\n\n${params.knowledgeBase}`,
          },
        ],
      },
      tools: [{ functionDeclarations: [JUDGE_TOOL] }],
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY,
          allowedFunctionNames: ["submit_verdict"],
        },
      },
      maxOutputTokens: 300,
    },
  });

  const toolCall = response.candidates?.[0]?.content?.parts?.find(
    (part) => part.functionCall?.name === "submit_verdict",
  )?.functionCall;
  if (!toolCall) {
    throw new Error("judge did not return a verdict tool call");
  }
  return toolCall.args as unknown as JudgeVerdict;
}
