import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { aboutPage } from "@/content/copy/about";
import { home } from "@/content/copy/home";

export const metadata: Metadata = {
  title: "About",
  description:
    "spike.land is an AI-native digital agency run by Zoltan Erdos — twenty years of enterprise delivery, now applied to agentic transformation.",
};

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;
  const { founder } = home;
  const { contact } = aboutPage;

  return (
    <Container className="py-16 sm:py-24">
      <article className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{aboutPage.title}</h1>
        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
          <img
            src={founder.image.src}
            alt={founder.image.alt}
            width={founder.image.width}
            height={founder.image.height}
            className="h-40 w-40 rounded-2xl object-cover"
          />
          <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
            {aboutPage.story.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <p className="text-sm">{aboutPage.education}</p>
          </div>
        </div>

        <section id="contact" className="mt-16 max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight">{contact.title}</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {contact.sub}{" "}
            <a href={`mailto:${home.footer.email}`} className="underline underline-offset-4">
              {home.footer.email}
            </a>
          </p>

          {sent === "1" ? (
            <p
              className="mt-6 rounded-xl border border-neutral-300 p-4 text-sm dark:border-neutral-700"
              role="status"
            >
              {contact.successMessage}
            </p>
          ) : sent === "0" ? (
            <p
              className="mt-6 rounded-xl border border-red-300 p-4 text-sm dark:border-red-800"
              role="alert"
            >
              {contact.errorMessage}
            </p>
          ) : (
            <form method="post" action="/api/contact" className="mt-6 space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium">
                  {contact.fields.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  maxLength={200}
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2 dark:border-neutral-700"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium">
                  {contact.fields.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2 dark:border-neutral-700"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium">
                  {contact.fields.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={4000}
                  rows={5}
                  className="mt-1 w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-2 dark:border-neutral-700"
                />
              </div>
              {/* Honeypot: hidden from humans, bots fill it in. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <Button type="submit">{contact.fields.submit}</Button>
            </form>
          )}
        </section>
      </article>
    </Container>
  );
}
