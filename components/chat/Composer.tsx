"use client";

import { useState } from "react";

export function Composer({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-edge p-3">
      <label htmlFor="chat-composer" className="sr-only">
        Message Spike
      </label>
      <textarea
        id="chat-composer"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        rows={1}
        maxLength={2000}
        placeholder="Ask about our services, method, or how we work…"
        disabled={disabled}
        // biome-ignore lint/a11y/noAutofocus: chat opens on explicit user action, focus belongs in the composer
        autoFocus
        className="max-h-32 flex-1 resize-none rounded-xl border border-edge-strong bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || value.trim() === ""}
        className="rounded-full bg-linear-to-r from-accent-bright to-cyan px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}
