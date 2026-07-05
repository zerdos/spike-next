import { home } from "@/content/copy/home";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const { hero } = home;
  return (
    <section id="hero" data-section="hero" className="py-24 sm:py-32">
      <Container className="flex flex-col items-start gap-6">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {hero.h1}
        </h1>
        <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">{hero.sub}</p>
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
