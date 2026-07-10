import { home } from "@/content/copy/home";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function FinalCta() {
  const { finalCta, hero } = home;
  return (
    <Section id="get-started" className="relative isolate overflow-hidden text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-15"
      />
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{finalCta.title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-ink-muted">{finalCta.sub}</p>
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
