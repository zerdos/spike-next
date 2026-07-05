import { home } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";

export function TheShift() {
  const { shift } = home;
  return (
    <Section id="shift" title={shift.title}>
      <p className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">{shift.narrative}</p>
      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {shift.eras.map((era) => (
          <li
            key={era.name}
            className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
          >
            <h3 className="font-medium">{era.name}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{era.description}</p>
          </li>
        ))}
      </ol>
      <div
        className="mt-10 grid gap-6 sm:grid-cols-2"
        role="img"
        aria-label="Comparison of the operating and orchestrating organisation models"
      >
        {[shift.diagram.operate, shift.diagram.orchestrate].map((side, i) => (
          <div
            key={side.title}
            className={`rounded-2xl border p-6 ${
              i === 1
                ? "border-neutral-900 dark:border-neutral-100"
                : "border-neutral-200 dark:border-neutral-800"
            }`}
          >
            <h3 className="font-medium">{side.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              {side.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
