import { home } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";

export function Proof() {
  const { proof } = home;
  return (
    <Section id="proof" title={proof.title}>
      <div className="grid gap-6 sm:grid-cols-3">
        {proof.cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {card.tag}
            </p>
            <h3 className="mt-2 text-lg font-medium">{card.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{card.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
