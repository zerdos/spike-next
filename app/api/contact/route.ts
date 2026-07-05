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
  const form = await request.formData();

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (typeof form.get("website") === "string" && form.get("website") !== "") {
    return NextResponse.redirect(new URL("/about?sent=1#contact", request.url), 303);
  }

  const parsed = contactSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    message: form.get("message"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/about?sent=0#contact", request.url), 303);
  }

  const { name, email, message } = parsed.data;
  const ok = await sendLeadEmail({
    subject: `Contact form: ${name}`,
    text: `Source: contact form (/about)\nName: ${name}\nEmail: ${email}\n\n${message}`,
    replyTo: email,
  });

  return NextResponse.redirect(new URL(`/about?sent=${ok ? "1" : "0"}#contact`, request.url), 303);
}
