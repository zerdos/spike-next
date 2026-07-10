"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { Composer } from "./Composer";
import { FallbackContactForm } from "./FallbackContactForm";
import { MessageList } from "./MessageList";
import { useAgentChat } from "./useAgentChat";

const DISCLOSURE =
  "Hi, I'm Spike — spike.land's AI agent. I can talk through our services, method, and how we work, and I'll always say when something needs Zoltan directly.";

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { items, status, fallback, sendMessage, ensureSession } = useAgentChat();
  const [checkingAvailability, setCheckingAvailability] = useState(true);

  useEffect(() => {
    track("chat_opened");
    // Probe availability immediately on open rather than waiting for the
    // first send to fail — the kill switch/an outage should show the
    // fallback form right away (FR-1.10), not after a wasted round trip.
    ensureSession().finally(() => setCheckingAvailability(false));
  }, [ensureSession]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const displayItems = fallback
    ? items
    : [{ id: "disclosure", kind: "system" as const, text: DISCLOSURE }, ...items];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Spike, spike.land's AI agent"
      className="fixed inset-0 z-50 flex flex-col bg-surface motion-safe:animate-[rise-in_0.25s_ease-out] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-2xl sm:border sm:border-edge sm:shadow-2xl"
    >
      <header className="flex items-center justify-between border-b border-edge px-4 py-3">
        <div>
          <p className="text-sm font-medium">Spike</p>
          <p className="text-xs text-ink-muted">AI agent · spike.land</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/about#contact"
            className="text-xs underline underline-offset-4 text-ink-muted motion-safe:transition-colors hover:text-ink"
          >
            Email instead
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="rounded-full p-1 text-ink-muted motion-safe:transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>
      </header>

      {checkingAvailability ? (
        <div className="flex-1" aria-hidden="true" />
      ) : fallback ? (
        <FallbackContactForm />
      ) : (
        <>
          <MessageList items={displayItems} />
          <Composer disabled={status === "streaming"} onSend={sendMessage} />
        </>
      )}
    </div>
  );
}
