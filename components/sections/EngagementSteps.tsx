import { home } from "@/content/copy/home";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export function EngagementSteps() {
  const { engagement } = home;
  return (
    <Section id="engagement" title={engagement.title}>
      <ol className="grid gap-6 sm:grid-cols-3">
        {engagement.steps.map((step) => (
          <Card as="li" key={step.title} className="flex flex-col">
            <p className="text-xs font-medium text-accent-text">Step {step.step}</p>
            <h3 className="mt-1 text-lg font-medium">{step.title}</h3>
            <p className="mt-2 flex-1 text-sm text-ink-muted">{step.description}</p>
            <a
              href="#get-started"
              data-chat-open
              className="mt-4 text-sm font-medium text-accent-text underline underline-offset-4 motion-safe:transition-colors hover:text-ink"
            >
              {engagement.stepCta} →
            </a>
          </Card>
        ))}
      </ol>
    </Section>
  );
}
