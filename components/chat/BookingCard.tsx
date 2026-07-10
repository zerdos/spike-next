"use client";

import { track } from "@/lib/analytics";

export function BookingCard({ url }: { url: string }) {
  return (
    <div className="rounded-xl border border-edge-strong bg-surface-raised p-3 text-sm">
      <p className="mb-2">Ready to book a discovery call?</p>
      <a
        href={url}
        target="_blank"
        rel="noopener"
        onClick={() => track("booking_started")}
        className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent-bright to-cyan px-4 py-2 text-xs font-semibold text-on-accent"
      >
        Open booking page →
      </a>
    </div>
  );
}
