import { home } from "@/content/copy/home";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const { footer } = home;
  return (
    <footer className="border-t border-neutral-200 py-12 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            <a href={`mailto:${footer.email}`} className="underline underline-offset-4">
              {footer.email}
            </a>
          </p>
          <p>{footer.location}</p>
        </div>
        <nav aria-label="Footer" className="flex gap-6">
          <a href={footer.linkedin} rel="me noopener" target="_blank">
            LinkedIn
          </a>
          <a href={footer.github} rel="me noopener" target="_blank">
            GitHub
          </a>
          {footer.legal.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
