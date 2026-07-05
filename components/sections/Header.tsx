import Link from "next/link";
import { home } from "@/content/copy/home";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  return (
    <header className="border-b border-neutral-200 py-4 dark:border-neutral-800">
      <Container className="flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          spike.land
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm">
          <Link href="/method" className="hover:underline underline-offset-4">
            Method
          </Link>
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          <ButtonLink
            href={home.hero.secondaryCta.href}
            className="!px-4 !py-2"
            data-cta="nav-book-call"
          >
            Book a call
          </ButtonLink>
        </nav>
      </Container>
    </header>
  );
}
