import { GoogleGenAI, type Content, type Part } from "@google/genai";
import { buildSystemInstruction } from "./system-prompt.ts";
import { toolDefinitions } from "./tools.ts";

const MAX_TOOL_ITERATIONS = 3;
// Backs the ≤120-words-per-reply rule; also the per-turn cost ceiling.
const MAX_OUTPUT_TOKENS = 400;

export type AgentEvent =
  | { type: "token"; text: string }
  | { type: "tool"; name: string; data: unknown }
  | { type: "done"; usage: { input: number; output: number } }
  | { type: "error"; message: string };

export type ToolExecutor = (
  name: string,
  input: unknown,
) => Promise<{
  /** Sent back to the model as the functionResponse. */
  modelResult: string;
  /** Rendered by the chat client (e.g. a booking card). */
  clientData?: unknown;
}>;

export type TurnResult = {
  /** Messages to append to the stored transcript (user turn included). */
  appended: Content[];
  usage: { input: number; output: number };
};

/** Merges consecutive text parts so stored history doesn't fragment into many single-word parts. */
function mergeTextParts(parts: Part[]): Part[] {
  const merged: Part[] = [];
  for (const part of parts) {
    const prev = merged[merged.length - 1];
    if (part.text !== undefined && prev?.text !== undefined) {
      prev.text += part.text;
    } else {
      merged.push({ ...part });
    }
  }
  return merged;
}

/**
 * Runs one visitor turn: streams model output, executes tool calls (max 3
 * rounds), and reports everything as AgentEvents. The caller persists
 * `TurnResult.appended` and forwards events to the SSE stream.
 */
export async function* runAgentTurn(params: {
  apiKey: string;
  model: string;
  history: Content[];
  userMessage: string;
  executeTool: ToolExecutor;
}): AsyncGenerator<AgentEvent, TurnResult> {
  const client = new GoogleGenAI({ apiKey: params.apiKey });
  const usage = { input: 0, output: 0 };

  const userTurn: Content = { role: "user", parts: [{ text: params.userMessage }] };
  const appended: Content[] = [userTurn];
  const messages: Content[] = [...params.history, userTurn];

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const stream = await client.models.generateContentStream({
      model: params.model,
      contents: messages,
      config: {
        systemInstruction: buildSystemInstruction(),
        tools: [{ functionDeclarations: toolDefinitions }],
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    });

    const accumulatedParts: Part[] = [];
    // usageMetadata on each chunk is cumulative for the call, not a delta —
    // keep only the latest one and apply it once after the loop.
    let usageThisCall: { input: number; output: number } | undefined;
    for await (const chunk of stream) {
      const candidateParts = chunk.candidates?.[0]?.content?.parts ?? [];
      for (const part of candidateParts) {
        if (part.text) {
          yield { type: "token", text: part.text };
        }
        accumulatedParts.push(part);
      }
      if (chunk.usageMetadata) {
        usageThisCall = {
          input: chunk.usageMetadata.promptTokenCount ?? 0,
          output: chunk.usageMetadata.candidatesTokenCount ?? 0,
        };
      }
    }
    usage.input += usageThisCall?.input ?? 0;
    usage.output += usageThisCall?.output ?? 0;

    const assistantTurn: Content = { role: "model", parts: mergeTextParts(accumulatedParts) };
    messages.push(assistantTurn);
    appended.push(assistantTurn);

    const functionCalls = accumulatedParts.filter((part) => part.functionCall !== undefined);
    if (functionCalls.length === 0) break;

    const responseParts: Part[] = [];
    for (const { functionCall } of functionCalls) {
      if (!functionCall) continue;
      const { modelResult, clientData } = await params.executeTool(
        functionCall.name ?? "",
        functionCall.args ?? {},
      );
      yield { type: "tool", name: functionCall.name ?? "", data: clientData ?? null };
      responseParts.push({
        functionResponse: {
          id: functionCall.id,
          name: functionCall.name,
          response: { output: modelResult },
        },
      });
    }

    const resultTurn: Content = { role: "user", parts: responseParts };
    messages.push(resultTurn);
    appended.push(resultTurn);
  }

  yield { type: "done", usage };
  return { appended, usage };
}
