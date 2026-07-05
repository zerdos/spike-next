import { home } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";

export function MethodSummary() {
  const { method } = home;
  return (
    <Section id="method" title={method.title}>
      <p className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">{method.framing}</p>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {method.principles.map((principle, i) => (
          <li
            key={principle.name}
            className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"
          >
            <p className="text-xs font-medium text-neutral-500">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 font-medium">{principle.name}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {principle.summary}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-10 max-w-xl">
        <h3 className="text-sm font-medium text-neutral-500">Where the effort goes</h3>
        <dl className="mt-3 space-y-2">
          {method.effortSplit.map((slice) => (
            <div key={slice.label} className="flex items-center gap-3">
              <dt className="w-20 text-sm">{slice.label}</dt>
              <dd className="flex flex-1 items-center gap-2">
                <div
                  className="h-2 rounded-full bg-neutral-900 dark:bg-neutral-100"
                  style={{ width: `${slice.percent}%` }}
                  aria-hidden
                />
                <span className="text-xs text-neutral-500">{slice.percent}%</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <a
        href={method.link.href}
        className="mt-8 inline-block text-sm font-medium underline underline-offset-4"
      >
        {method.link.label} →
      </a>
    </Section>
  );
}
