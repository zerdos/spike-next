import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { home } from "@/content/copy/home";
import { methodPage } from "@/content/copy/method";

export const metadata: Metadata = {
  title: "The BAZDMEG method",
  description:
    "BAZDMEG is an operating system for agentic delivery: requirements as the product, discipline before automation, tested to the edges, orchestrated not operated.",
};

export default function MethodPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {methodPage.title}
        </h1>
        <p className="mt-6 text-lg text-ink-muted">{methodPage.intro}</p>
        <p className="mt-4 text-ink-muted">{methodPage.origin}</p>

        <ol className="mt-12 space-y-10">
          {methodPage.principles.map((principle, i) => (
            <li key={principle.name}>
              <h2 className="text-2xl font-semibold tracking-tight">
                <span className="mr-3 font-mono text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {principle.name}
              </h2>
              <p className="mt-3 text-ink-muted">{principle.body}</p>
            </li>
          ))}
        </ol>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">{methodPage.effort.title}</h2>
          <p className="mt-3 text-ink-muted">{methodPage.effort.body}</p>
          <dl className="mt-6 space-y-3">
            {methodPage.effort.split.map((slice) => (
              <div key={slice.label} className="flex items-center gap-3">
                <dt className="w-20 text-sm font-medium">{slice.label}</dt>
                <dd className="flex flex-1 items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-edge" aria-hidden>
                    <div
                      className="h-2 rounded-full bg-linear-to-r from-accent to-cyan"
                      style={{ width: `${slice.percent}%` }}
                    />
                  </div>
                  <span className="text-xs whitespace-nowrap text-ink-muted">
                    {slice.percent}% — {slice.note}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 rounded-2xl border border-edge bg-surface-raised p-8">
          <h2 className="text-xl font-semibold tracking-tight">{methodPage.cta.title}</h2>
          <p className="mt-2 text-ink-muted">{methodPage.cta.sub}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button type="button" data-chat-open>
              Talk to our agent
            </Button>
            <ButtonLink variant="secondary" href={home.hero.secondaryCta.href}>
              Book a call
            </ButtonLink>
          </div>
        </section>
      </article>
    </Container>
  );
}
