"use client";

import { useState } from "react";

export function FallbackContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });
      const data = (await res.json()) as { ok: boolean };
      setState(data.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p role="status" className="p-4 text-sm">
        Thanks — your message is on its way. We reply within one working day.
      </p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="mb-4 text-sm text-ink-muted">
        Chat isn't available right now — send us a message instead and we'll reply by email.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="fallback-name" className="block text-xs font-medium">
            Your name
          </label>
          <input
            id="fallback-name"
            name="name"
            required
            maxLength={200}
            autoComplete="name"
            className="mt-1 w-full rounded-xl border border-edge-strong bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="fallback-email" className="block text-xs font-medium">
            Email address
          </label>
          <input
            id="fallback-email"
            name="email"
            type="email"
            required
            maxLength={320}
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-edge-strong bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="fallback-message" className="block text-xs font-medium">
            What are you working on?
          </label>
          <textarea
            id="fallback-message"
            name="message"
            required
            maxLength={4000}
            rows={4}
            className="mt-1 w-full rounded-xl border border-edge-strong bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="fallback-website">Website</label>
          <input id="fallback-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {state === "error" ? (
          <p role="alert" className="text-xs text-red-400">
            Something went wrong. Please email us directly instead.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={state === "sending"}
          className="w-full rounded-full bg-linear-to-r from-accent-bright to-cyan px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
