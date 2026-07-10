import { home } from "@/content/copy/home";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const { hero } = home;
  return (
    <section
      id="hero"
      data-section="hero"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-accent opacity-30 blur-3xl motion-safe:animate-[blob-drift_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-16 -right-32 h-80 w-80 rounded-full bg-cyan opacity-20 blur-3xl motion-safe:animate-[blob-drift_18s_ease-in-out_infinite_alternate-reverse]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--edge)_1px,transparent_1px),linear-gradient(to_bottom,var(--edge)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)] opacity-40" />
      </div>
      <Container className="stagger flex flex-col items-start gap-6">
        <h1 className="max-w-3xl bg-linear-to-b from-ink to-ink/70 bg-clip-text text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-6xl">
          {hero.h1}
        </h1>
        <p className="max-w-xl text-lg text-ink-muted">{hero.sub}</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {/* Without chat JS this anchors to the final CTA; ChatLauncher intercepts it. */}
          <ButtonLink href="#get-started" data-chat-open>
            {hero.primaryCta.label}
          </ButtonLink>
          <ButtonLink variant="secondary" href={hero.secondaryCta.href} data-cta="hero-book-call">
            {hero.secondaryCta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
