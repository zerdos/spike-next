import { home } from "@/content/copy/home";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export function ServicesGrid() {
  const { services } = home;
  return (
    <Section id="services" title={services.title}>
      <div className="grid gap-6 sm:grid-cols-2">
        {services.cards.map((card) => (
          <Card as="article" key={card.title}>
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{card.description}</p>
            <p className="mt-4 text-sm font-medium text-accent-text">{card.deliverable}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
