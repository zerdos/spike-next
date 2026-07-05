import { NextResponse } from "next/server";
import { env, isChatEnabled } from "@/lib/cloudflare";
import { mintSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const e = env();
  if (!isChatEnabled(e)) {
    return NextResponse.json({ error: "chat_disabled" }, { status: 503 });
  }
  const session = await mintSession(e.SESSION_SIGNING_SECRET);
  return NextResponse.json(session);
}
