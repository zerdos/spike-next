import { home } from "@/content/copy/home";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export function MethodSummary() {
  const { method } = home;
  return (
    <Section id="method" title={method.title}>
      <p className="max-w-2xl text-lg text-ink-muted">{method.framing}</p>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {method.principles.map((principle, i) => (
          <Card as="li" key={principle.name} className="p-5">
            <p className="font-mono text-xs font-medium text-accent-text">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 font-medium">{principle.name}</h3>
            <p className="mt-2 text-sm text-ink-muted">{principle.summary}</p>
          </Card>
        ))}
      </ol>
      <div className="mt-10 max-w-xl">
        <h3 className="text-sm font-medium text-ink-muted">Where the effort goes</h3>
        <dl className="mt-3 space-y-2">
          {method.effortSplit.map((slice) => (
            <div key={slice.label} className="flex items-center gap-3">
              <dt className="w-20 text-sm">{slice.label}</dt>
              <dd className="flex flex-1 items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-edge" aria-hidden>
                  <div
                    className="h-2 rounded-full bg-linear-to-r from-accent to-cyan"
                    style={{ width: `${slice.percent}%` }}
                  />
                </div>
                <span className="text-xs text-ink-muted">{slice.percent}%</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <a
        href={method.link.href}
        className="mt-8 inline-block text-sm font-medium text-accent-text underline underline-offset-4 motion-safe:transition-colors hover:text-ink"
      >
        {method.link.label} →
      </a>
    </Section>
  );
}
