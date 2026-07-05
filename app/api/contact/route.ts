import { NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  // The chat kill-switch fallback form submits via fetch and wants a JSON
  // reply instead of a redirect to /about (there's no such page in-modal).
  const wantsJson = request.headers.get("accept")?.includes("application/json") ?? false;
  const form = await request.formData();

  const respond = (ok: boolean) => {
    if (wantsJson) return NextResponse.json({ ok });
    return NextResponse.redirect(
      new URL(`/about?sent=${ok ? "1" : "0"}#contact`, request.url),
      303,
    );
  };

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (typeof form.get("website") === "string" && form.get("website") !== "") {
    return respond(true);
  }

  const parsed = contactSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    message: form.get("message"),
  });

  if (!parsed.success) {
    return respond(false);
  }

  const { name, email, message } = parsed.data;
  const ok = await sendLeadEmail({
    subject: `Contact form: ${name}`,
    text: `Source: ${wantsJson ? "chat fallback form" : "contact form (/about)"}\nName: ${name}\nEmail: ${email}\n\n${message}`,
    replyTo: email,
  });

  return respond(ok);
}
