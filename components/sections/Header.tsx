import Link from "next/link";
import { home } from "@/content/copy/home";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-surface-overlay py-4 backdrop-blur-md">
      <Container className="flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          spike.land
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm">
          <Link
            href="/method"
            className="text-ink-muted motion-safe:transition-colors hover:text-ink"
          >
            Method
          </Link>
          <Link
            href="/about"
            className="text-ink-muted motion-safe:transition-colors hover:text-ink"
          >
            About
          </Link>
          <ButtonLink href={home.hero.secondaryCta.href} size="sm" data-cta="nav-book-call">
            Book a call
          </ButtonLink>
        </nav>
      </Container>
    </header>
  );
}
