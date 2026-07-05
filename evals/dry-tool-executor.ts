import { bookCallSchema, escalateSchema, leadSchema } from "../lib/agent/tools.ts";
import { buildCalUrl } from "../lib/cal.ts";
import type { ToolExecutor } from "../lib/agent/run-turn.ts";
import type { RecordedToolCall } from "./types.ts";

/**
 * Same ToolExecutor contract as production (lib/agent/tool-executor.ts), but
 * with every side effect (DO storage, Resend email, webhook) stripped out —
 * evals must never send real emails or touch real storage. Every call is
 * recorded so checks.ts can assert on it (e.g. requires_consent_true).
 */
export function createDryToolExecutor(recorded: RecordedToolCall[]): ToolExecutor {
  return async (name, input) => {
    recorded.push({ name, input });

    switch (name) {
      case "capture_lead": {
        const parsed = leadSchema.safeParse(input);
        return {
          modelResult: parsed.success
            ? "Lead captured and Zoltan has been notified. Thank the visitor and offer to book a call now."
            : "Invalid lead payload — ask the visitor to confirm their name and email, and that they consent to being contacted.",
          clientData: { leadCaptured: parsed.success },
        };
      }
      case "book_call": {
        const parsed = bookCallSchema.safeParse(input);
        const url = buildCalUrl("spike-land/discovery", parsed.success ? parsed.data : {});
        return { modelResult: `Booking link ready: ${url}`, clientData: { bookingUrl: url } };
      }
      case "escalate_to_human": {
        const parsed = escalateSchema.safeParse(input);
        const reason = parsed.success ? parsed.data.reason : "unspecified";
        return {
          modelResult: `Escalation noted (${reason}). Tell the visitor this needs Zoltan directly and offer email or a call.`,
          clientData: { escalated: true, reason },
        };
      }
      default:
        return { modelResult: `Unknown tool ${name}` };
    }
  };
}
