import { getCloudflareContext } from "@opennextjs/cloudflare";

type LeadEmail = {
  subject: string;
  text: string;
  replyTo?: string;
};

/**
 * Sends a lead/contact notification to the founder via Resend.
 * Returns false (never throws) when the API key is missing or the send fails,
 * so callers can degrade gracefully.
 */
export async function sendLeadEmail({ subject, text, replyTo }: LeadEmail): Promise<boolean> {
  const { env } = getCloudflareContext();
  const apiKey = (env as Record<string, unknown>).RESEND_API_KEY as string | undefined;
  const to = (env as Record<string, unknown>).LEAD_NOTIFY_EMAIL as string | undefined;

  if (!apiKey || !to) {
    console.warn("sendLeadEmail: RESEND_API_KEY or LEAD_NOTIFY_EMAIL not configured");
    return false;
  }

  const send = () =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "spike.land leads <leads@spike.land>",
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

  try {
    let response = await send();
    if (!response.ok) {
      response = await send(); // one immediate retry
    }
    if (!response.ok) {
      console.error("sendLeadEmail: Resend responded", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("sendLeadEmail failed", error);
    return false;
  }
}
