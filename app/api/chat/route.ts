import { z } from "zod";
import { createToolExecutor } from "@/lib/agent/tool-executor";
import { runAgentTurn } from "@/lib/agent/run-turn";
import { getChatSessionStub } from "@/lib/chat-session-client";
import { env, isChatEnabled } from "@/lib/cloudflare";
import { verifySession } from "@/lib/session";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  sessionId: z.string(),
  sig: z.string(),
  message: z.string().trim().min(1).max(4000),
});

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  const e = env();

  if (!isChatEnabled(e)) {
    return Response.json({ error: "chat_disabled", fallback: "contact_form" }, { status: 503 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const { sessionId, sig, message } = parsed.data;

  const validSession = await verifySession(e.SESSION_SIGNING_SECRET, sessionId, sig);
  if (!validSession) {
    return Response.json({ error: "invalid_session" }, { status: 401 });
  }

  const session = getChatSessionStub(e, sessionId);
  const state = await session.getState();

  const maxTokens = Number(e.MAX_SESSION_TOKENS);
  const maxMessages = Number(e.MAX_SESSION_MESSAGES);
  if (state.totalTokens >= maxTokens || state.messageCount >= maxMessages) {
    return Response.json({ error: "session_limit_reached", fallback: "contact_form" }, { status: 429 });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const generator = runAgentTurn({
          apiKey: e.ANTHROPIC_API_KEY,
          model: e.AGENT_MODEL,
          history: state.messages as never[],
          userMessage: message,
          executeTool: createToolExecutor(e, session),
        });

        let next = await generator.next();
        while (!next.done) {
          const agentEvent = next.value;
          if (agentEvent.type === "token") {
            controller.enqueue(encoder.encode(sseEvent("token", { text: agentEvent.text })));
          } else if (agentEvent.type === "tool") {
            controller.enqueue(
              encoder.encode(sseEvent("tool", { name: agentEvent.name, data: agentEvent.data })),
            );
          } else if (agentEvent.type === "done") {
            controller.enqueue(encoder.encode(sseEvent("done", { usage: agentEvent.usage })));
          }
          next = await generator.next();
        }

        const result = next.value;
        await session.appendTurn(result.appended as never[], result.usage);
      } catch (error) {
        console.error("chat turn failed", error);
        controller.enqueue(
          encoder.encode(sseEvent("error", { message: "Something went wrong. Please try again." })),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
