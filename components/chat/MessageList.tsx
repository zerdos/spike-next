import { useEffect, useRef } from "react";
import { home } from "@/content/copy/home";
import { BookingCard } from "./BookingCard";
import { LeadConsentCard } from "./LeadConsentCard";
import type { ChatItem } from "./types";

export function MessageList({ items }: { items: ChatItem[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, []);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
    >
      {items.map((item) => {
        switch (item.kind) {
          case "user":
            return (
              <p
                key={item.id}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-linear-to-r from-accent-bright to-cyan px-4 py-2 text-sm font-medium text-on-accent"
              >
                {item.text}
              </p>
            );
          case "assistant":
            return (
              <p
                key={item.id}
                className="max-w-[85%] rounded-2xl rounded-bl-sm border border-edge bg-surface-raised px-4 py-2 text-sm"
              >
                {item.text}
                {item.text === "" ? <span className="sr-only">Spike is typing…</span> : null}
              </p>
            );
          case "system":
            return (
              <p key={item.id} className="text-center text-xs text-ink-muted">
                {item.text}
              </p>
            );
          case "booking":
            return <BookingCard key={item.id} url={item.url} />;
          case "lead-confirmed":
            return <LeadConsentCard key={item.id} />;
          case "escalate":
            return (
              <div
                key={item.id}
                className="space-y-2 rounded-xl border border-edge-strong bg-surface-raised p-3 text-sm"
              >
                <p>This needs Zoltan directly.</p>
                <div className="flex gap-4">
                  <a href="/about#contact" className="underline underline-offset-4">
                    Email us
                  </a>
                  <a href={home.hero.secondaryCta.href} className="underline underline-offset-4">
                    Book a call
                  </a>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
      <div ref={endRef} />
    </div>
  );
}
