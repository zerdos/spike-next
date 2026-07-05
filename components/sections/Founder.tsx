import { home } from "@/content/copy/home";
import { Section } from "@/components/ui/Section";

export function Founder() {
  const { founder } = home;
  return (
    <Section id="founder">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <img
          src={founder.image.src}
          alt={founder.image.alt}
          width={founder.image.width}
          height={founder.image.height}
          loading="lazy"
          className="h-40 w-40 rounded-2xl object-cover"
        />
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight">{founder.name}</h2>
          <p className="text-sm text-neutral-500">{founder.title}</p>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{founder.bio}</p>
          <ul className="mt-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            {founder.markers.map((marker) => (
              <li key={marker}>· {marker}</li>
            ))}
          </ul>
          <a
            href={founder.link.href}
            className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
          >
            {founder.link.label} →
          </a>
        </div>
      </div>
    </Section>
  );
}
