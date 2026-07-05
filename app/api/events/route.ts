import { z } from "zod";
import { env } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

// Cookieless funnel events (FR-4). No PII is ever accepted here — values are
// short labels (section ids, cta names), never names/emails/free text.
const ALLOWED_EVENTS = new Set([
  "chat_opened",
  "first_message_sent",
  "lead_captured",
  "booking_started",
  "booking_completed",
  "scroll_depth",
  "section_visible",
  "cta_click",
]);

const eventSchema = z.object({
  event: z.string(),
  data: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  ts: z.number().optional(),
});

export async function POST(request: Request) {
  const e = env();
  const json = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(json);

  // Beacons are fire-and-forget from the client; never surface an error status.
  if (!parsed.success || !ALLOWED_EVENTS.has(parsed.data.event)) {
    return new Response(null, { status: 204 });
  }

  e.FUNNEL_EVENTS?.writeDataPoint({
    blobs: [parsed.data.event, JSON.stringify(parsed.data.data ?? {})],
    doubles: [parsed.data.ts ?? Date.now()],
    indexes: [parsed.data.event],
  });

  return new Response(null, { status: 204 });
}
