import type { getChatSessionStub } from "@/lib/chat-session-client";
import { buildCalUrl } from "@/lib/cal";
import type { Env } from "@/lib/cloudflare";
import { sendLeadEmail } from "@/lib/email";
import { encryptPII } from "@/lib/pii";
import { bookCallSchema, escalateSchema, leadSchema } from "./tools";
import type { ToolExecutor } from "./run-turn";

type ChatSessionStub = ReturnType<typeof getChatSessionStub>;

export function createToolExecutor(env: Env, session: ChatSessionStub): ToolExecutor {
  return async (name, input) => {
    switch (name) {
      case "capture_lead": {
        const parsed = leadSchema.safeParse(input);
        if (!parsed.success) {
          return {
            modelResult:
              "Invalid lead payload — ask the visitor to confirm their name and email, and that they consent to being contacted.",
          };
        }
        const lead = parsed.data;
        const encrypted = await encryptPII(env.PII_ENCRYPTION_KEY, lead);
        await session.storeLead(encrypted);

        const transcript = await session.getTranscriptText();
        const emailed = await sendLeadEmail({
          subject: `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
          text: [
            "Source: agent chat",
            `Name: ${lead.name}`,
            `Email: ${lead.email}`,
            lead.company ? `Company: ${lead.company}` : null,
            lead.role ? `Role: ${lead.role}` : null,
            lead.problem_area ? `Problem area: ${lead.problem_area}` : null,
            lead.ai_usage ? `Current AI usage: ${lead.ai_usage}` : null,
            lead.timeline ? `Timeline: ${lead.timeline}` : null,
            "",
            "--- Transcript ---",
            transcript,
          ]
            .filter((line) => line !== null)
            .join("\n"),
          replyTo: lead.email,
        });

        if (env.LEAD_WEBHOOK_URL) {
          await fetch(env.LEAD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source: "agent_chat", name: lead.name, company: lead.company }),
          }).catch(() => {});
        }

        return {
          modelResult: emailed
            ? "Lead captured and Zoltan has been notified. Thank the visitor and offer to book a call now."
            : "Lead captured, but the notification email failed to send. Still confirm to the visitor that their details were saved and suggest booking a call directly as a backup.",
          clientData: { leadCaptured: true },
        };
      }

      case "book_call": {
        const parsed = bookCallSchema.safeParse(input);
        const params = parsed.success ? parsed.data : {};
        const url = buildCalUrl(env.CAL_LINK, params);
        return {
          modelResult: `Booking link ready: ${url}`,
          clientData: { bookingUrl: url },
        };
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
