import Anthropic from "@anthropic-ai/sdk";
import { buildSystemBlocks } from "./system-prompt.ts";
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
  /** Sent back to the model as the tool_result. */
  modelResult: string;
  /** Rendered by the chat client (e.g. a booking card). */
  clientData?: unknown;
}>;

export type TurnResult = {
  /** Messages to append to the stored transcript (user turn included). */
  appended: Anthropic.MessageParam[];
  usage: { input: number; output: number };
};

/**
 * Runs one visitor turn: streams model output, executes tool calls (max 3
 * rounds), and reports everything as AgentEvents. The caller persists
 * `TurnResult.appended` and forwards events to the SSE stream.
 */
export async function* runAgentTurn(params: {
  apiKey: string;
  model: string;
  history: Anthropic.MessageParam[];
  userMessage: string;
  executeTool: ToolExecutor;
}): AsyncGenerator<AgentEvent, TurnResult> {
  const client = new Anthropic({ apiKey: params.apiKey });
  const usage = { input: 0, output: 0 };

  const userTurn: Anthropic.MessageParam = { role: "user", content: params.userMessage };
  const appended: Anthropic.MessageParam[] = [userTurn];
  const messages: Anthropic.MessageParam[] = [...params.history, userTurn];

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const stream = client.messages.stream({
      model: params.model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: buildSystemBlocks(),
      tools: toolDefinitions,
      messages,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield { type: "token", text: event.delta.text };
      }
    }

    const final = await stream.finalMessage();
    usage.input += final.usage.input_tokens;
    usage.output += final.usage.output_tokens;

    const assistantTurn: Anthropic.MessageParam = { role: "assistant", content: final.content };
    messages.push(assistantTurn);
    appended.push(assistantTurn);

    if (final.stop_reason !== "tool_use") break;

    const toolUses = final.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const toolUse of toolUses) {
      const { modelResult, clientData } = await params.executeTool(toolUse.name, toolUse.input);
      yield { type: "tool", name: toolUse.name, data: clientData ?? null };
      results.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: modelResult,
      });
    }

    const resultTurn: Anthropic.MessageParam = { role: "user", content: results };
    messages.push(resultTurn);
    appended.push(resultTurn);
  }

  yield { type: "done", usage };
  return { appended, usage };
}
