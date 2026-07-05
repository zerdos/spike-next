import { home } from "@/content/copy/home";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function FinalCta() {
  const { finalCta, hero } = home;
  return (
    <Section id="get-started" className="text-center">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{finalCta.title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">{finalCta.sub}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button type="button" data-chat-open>
          {hero.primaryCta.label}
        </Button>
        <ButtonLink variant="secondary" href={hero.secondaryCta.href} data-cta="final-book-call">
          {hero.secondaryCta.label}
        </ButtonLink>
      </div>
    </Section>
  );
}
