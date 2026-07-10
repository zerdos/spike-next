import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { home } from "@/content/copy/home";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How spike.land processes personal data, including agent chat transcripts.",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      "spike.land is an AI-native digital agency operated by Zoltan Erdos, Brighton, United Kingdom. We are the data controller for personal data processed through this website. Contact: " +
        home.footer.email +
        ".",
    ],
  },
  {
    heading: "The agent chat",
    body: [
      "The chat on this site is powered by an AI agent, and it is clearly labelled as such. When you use it, your messages are processed to generate responses and — only with your explicit consent — to capture your contact details so we can follow up.",
      "Chat messages are sent to Google (our AI model provider and sub-processor, via the Gemini API) to generate responses. Google processes this data on our instructions and does not use it to train models.",
      "Chat transcripts are stored for up to 90 days and then deleted automatically. Contact details you consent to share (name, email) are encrypted at rest and used solely to respond to your enquiry.",
    ],
  },
  {
    heading: "Contact forms and booking",
    body: [
      "Details you submit through the contact form are emailed to us so we can reply, and are not used for marketing.",
      "Call booking is handled by Cal.com. If you arrive at the booking page from the chat and consented to it, your name and email may pre-fill the form. Cal.com's own privacy policy applies to data you submit there.",
    ],
  },
  {
    heading: "Analytics",
    body: [
      "We use cookieless, privacy-friendly analytics to understand how the site is used (pages viewed, sections reached, chat opened). No cookies are set for analytics, no personal data is collected by it, and no data is shared with advertising networks.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under UK GDPR you have the right to access, correct, or erase personal data we hold about you, and to object to or restrict processing. To exercise any right — including erasure of a chat transcript — email " +
        home.footer.email +
        " and we will respond within one month.",
      "If you are unhappy with how we handle your data you can complain to the Information Commissioner's Office (ico.org.uk).",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="prose-neutral max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Privacy policy</h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: 5 July 2026</p>
        {sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="mt-3 text-ink-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </Container>
  );
}
