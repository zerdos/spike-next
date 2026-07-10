import { home } from "@/content/copy/home";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export function TheShift() {
  const { shift } = home;
  return (
    <Section id="shift" title={shift.title}>
      <p className="max-w-2xl text-lg text-ink-muted">{shift.narrative}</p>
      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {shift.eras.map((era) => (
          <Card as="li" key={era.name}>
            <h3 className="font-medium">{era.name}</h3>
            <p className="mt-2 text-sm text-ink-muted">{era.description}</p>
          </Card>
        ))}
      </ol>
      <div
        className="mt-10 grid gap-6 sm:grid-cols-2"
        role="img"
        aria-label="Comparison of the operating and orchestrating organisation models"
      >
        {[shift.diagram.operate, shift.diagram.orchestrate].map((side, i) => (
          <Card
            key={side.title}
            glow={false}
            className={i === 1 ? "border-accent/50 bg-accent/5 shadow-glow-sm" : ""}
          >
            <h3 className="font-medium">{side.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {side.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
