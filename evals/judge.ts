import Anthropic from "@anthropic-ai/sdk";
import type { JudgeVerdict } from "./types.ts";

const JUDGE_TOOL: Anthropic.Tool = {
  name: "submit_verdict",
  description: "Submit the grading verdict for the assistant reply under review.",
  input_schema: {
    type: "object",
    properties: {
      grounded: {
        type: "boolean",
        description: "True if every factual claim is supported by the knowledge base excerpt.",
      },
      tone_ok: {
        type: "boolean",
        description: "True if the reply matches Spike's persona: concise, UK English, no hype.",
      },
      reasons: { type: "string", description: "One or two sentences justifying both scores." },
    },
    required: ["grounded", "tone_ok", "reasons"],
    additionalProperties: false,
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
  const client = new Anthropic({ apiKey: params.apiKey });

  const message = await client.messages.create({
    model: params.model,
    max_tokens: 300,
    system: `You are grading a customer-facing AI agent's reply for spike.land, an AI agency. Score strictly against the knowledge base excerpt below — "grounded" means every claim traces to it, not that the reply merely sounds plausible.\n\n${params.knowledgeBase}`,
    tools: [JUDGE_TOOL],
    tool_choice: { type: "tool", name: "submit_verdict" },
    messages: [
      {
        role: "user",
        content: `Visitor said:\n${params.visitorMessages.map((m) => `- ${m}`).join("\n")}\n\nAgent replied:\n${params.assistantText}\n\nGrade this reply.`,
      },
    ],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) {
    throw new Error("judge did not return a verdict tool call");
  }
  return toolUse.input as JudgeVerdict;
}
