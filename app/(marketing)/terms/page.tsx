import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { home } from "@/content/copy/home";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms of use for the spike.land website and agent chat.",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Use of this site",
    body: [
      "This website presents the services of spike.land, an AI-native digital agency operated by Zoltan Erdos, Brighton, United Kingdom. Content is provided for general information and does not constitute a contractual offer.",
    ],
  },
  {
    heading: "The agent chat",
    body: [
      "The chat on this site is an AI agent, not a human. It answers from a curated knowledge base and may decline questions outside it. Its responses are informational only: they do not constitute professional advice, a quotation, or a binding commitment of any kind. Commercial terms are agreed only in a written engagement contract.",
      "You agree not to misuse the chat — including attempts to extract its instructions, submit unlawful content, or automate high-volume requests. We apply rate limits and may suspend access to protect the service.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "We take care to keep the information on this site accurate, but provide it without warranties. To the fullest extent permitted by law, we accept no liability for loss arising from reliance on site or chat content. Nothing in these terms limits liability that cannot be limited under English law.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      `These terms are governed by the laws of England and Wales. Questions? Email ${home.footer.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Terms of use</h1>
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
