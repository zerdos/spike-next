import { home } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";

export function EngagementSteps() {
  const { engagement } = home;
  return (
    <Section id="engagement" title={engagement.title}>
      <ol className="grid gap-6 sm:grid-cols-3">
        {engagement.steps.map((step) => (
          <li
            key={step.title}
            className="flex flex-col rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
          >
            <p className="text-xs font-medium text-neutral-500">Step {step.step}</p>
            <h3 className="mt-1 text-lg font-medium">{step.title}</h3>
            <p className="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
              {step.description}
            </p>
            <a
              href="#get-started"
              data-chat-open
              className="mt-4 text-sm font-medium underline underline-offset-4"
            >
              {engagement.stepCta} →
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
}
