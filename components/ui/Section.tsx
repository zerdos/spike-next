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
    <section id={id} data-section={id} className={`scroll-mt-20 py-16 sm:py-24 ${className}`}>
      <Container className="reveal">
        {title ? (
          <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
            <span
              aria-hidden
              className="mb-4 block h-1 w-10 rounded-full bg-linear-to-r from-accent to-cyan"
            />
            {title}
          </h2>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
