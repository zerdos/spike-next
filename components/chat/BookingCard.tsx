"use client";

import { track } from "@/lib/analytics";

export function BookingCard({ url }: { url: string }) {
  return (
    <div className="rounded-xl border border-neutral-300 p-3 text-sm dark:border-neutral-700">
      <p className="mb-2">Ready to book a discovery call?</p>
      <a
        href={url}
        target="_blank"
        rel="noopener"
        onClick={() => track("booking_started")}
        className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        Open booking page →
      </a>
    </div>
  );
}
