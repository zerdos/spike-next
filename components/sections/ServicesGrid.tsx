import { home } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";

export function ServicesGrid() {
  const { services } = home;
  return (
    <Section id="services" title={services.title}>
      <div className="grid gap-6 sm:grid-cols-2">
        {services.cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
          >
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {card.description}
            </p>
            <p className="mt-4 text-sm font-medium">{card.deliverable}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
