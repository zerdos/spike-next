import { DurableObject } from "cloudflare:workers";

/**
 * Transcript entry. `role` and `content` mirror Gemini's Content/Part shape
 * verbatim (role is "user" or "model") since stored messages are replayed
 * directly as API history on the next turn — not just used for display.
 */
export type StoredMessage = { role: "user" | "model"; content: unknown };

export type SessionState = {
  messages: StoredMessage[];
  totalTokens: number;
  messageCount: number;
  leadCaptured: boolean;
};

const RETENTION_MS = 90 * 24 * 60 * 60 * 1000; // 90 days, matches the privacy policy

/**
 * One DO per chat session: single-writer transcript, atomic token/message
 * ceilings, encrypted lead storage, and a 90-day self-destruct alarm.
 */
export class ChatSessionDO extends DurableObject {
  async getState(): Promise<SessionState> {
    const [messages, totalTokens, messageCount, lead] = await Promise.all([
      this.ctx.storage.get<StoredMessage[]>("messages"),
      this.ctx.storage.get<number>("totalTokens"),
      this.ctx.storage.get<number>("messageCount"),
      this.ctx.storage.get<string>("lead"),
    ]);
    return {
      messages: messages ?? [],
      totalTokens: totalTokens ?? 0,
      messageCount: messageCount ?? 0,
      leadCaptured: lead !== undefined,
    };
  }

  async appendTurn(
    appended: StoredMessage[],
    usage: { input: number; output: number },
  ): Promise<void> {
    const state = await this.getState();
    if (state.messages.length === 0) {
      // First write: schedule transcript deletion at the retention limit.
      await this.ctx.storage.setAlarm(Date.now() + RETENTION_MS);
    }
    await this.ctx.storage.put({
      messages: [...state.messages, ...appended],
      totalTokens: state.totalTokens + usage.input + usage.output,
      messageCount: state.messageCount + 1,
    });
  }

  /** Stores an AES-GCM-encrypted lead payload (encrypted by the caller). */
  async storeLead(encryptedLead: string): Promise<void> {
    await this.ctx.storage.put("lead", encryptedLead);
  }

  /** Plain-text transcript of visitor-visible turns, for the lead email. */
  async getTranscriptText(): Promise<string> {
    const state = await this.getState();
    const lines: string[] = [];
    for (const message of state.messages) {
      if (typeof message.content === "string") {
        lines.push(`${message.role === "user" ? "Visitor" : "Spike"}: ${message.content}`);
      } else if (Array.isArray(message.content)) {
        for (const part of message.content as { text?: string }[]) {
          if (part.text) {
            lines.push(`${message.role === "user" ? "Visitor" : "Spike"}: ${part.text}`);
          }
        }
      }
    }
    return lines.join("\n");
  }

  async alarm(): Promise<void> {
    await this.ctx.storage.deleteAll();
  }
}

export default {
  async fetch(): Promise<Response> {
    return new Response("spike-chat-state: DO host worker", { status: 200 });
  },
};
