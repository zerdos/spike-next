import { home } from "@/content/copy/home";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export function Proof() {
  const { proof } = home;
  return (
    <Section id="proof" title={proof.title}>
      <div className="grid gap-6 sm:grid-cols-3">
        {proof.cards.map((card) => (
          <Card as="article" key={card.title}>
            <p className="text-xs font-medium uppercase tracking-wider text-accent-text">
              {card.tag}
            </p>
            <h3 className="mt-2 text-lg font-medium">{card.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{card.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
