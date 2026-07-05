import type { SessionState, StoredMessage } from "@/workers/chat-state";
import type { Env } from "./cloudflare";

/**
 * The wrangler-generated CHAT_SESSION binding type is a generic
 * DurableObjectNamespace (cross-script bindings can't infer the class shape).
 * This re-declares ChatSessionDO's public RPC surface so calls are typed here.
 */
interface ChatSessionStub {
  getState(): Promise<SessionState>;
  appendTurn(appended: StoredMessage[], usage: { input: number; output: number }): Promise<void>;
  storeLead(encryptedLead: string): Promise<void>;
  getTranscriptText(): Promise<string>;
}

export function getChatSessionStub(env: Env, sessionId: string): ChatSessionStub {
  const id = env.CHAT_SESSION.idFromName(sessionId);
  const stub = env.CHAT_SESSION.get(id);
  return stub as unknown as ChatSessionStub;
}
