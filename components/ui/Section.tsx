import { Container } from "./Container";

export function Section({
  id,
  title,
  children,
  className = "",
}: {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} data-section={id} className={`py-16 sm:py-24 ${className}`}>
      <Container>
        {title ? (
          <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
