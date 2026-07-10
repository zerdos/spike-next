import { home } from "@/content/copy/home";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const { footer } = home;
  return (
    <footer className="border-t border-edge py-12 text-sm text-ink-muted">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            <a
              href={`mailto:${footer.email}`}
              className="underline underline-offset-4 motion-safe:transition-colors hover:text-ink"
            >
              {footer.email}
            </a>
          </p>
          <p>{footer.location}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-6">
          <a
            href={home.hero.secondaryCta.href}
            data-cta="footer-book-call"
            className="underline underline-offset-4 motion-safe:transition-colors hover:text-ink"
          >
            Book a call
          </a>
          <a
            href={footer.linkedin}
            rel="me noopener"
            target="_blank"
            className="motion-safe:transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={footer.github}
            rel="me noopener"
            target="_blank"
            className="motion-safe:transition-colors hover:text-ink"
          >
            GitHub
          </a>
          {footer.legal.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="motion-safe:transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
