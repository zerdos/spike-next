"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { Composer } from "./Composer";
import { FallbackContactForm } from "./FallbackContactForm";
import { MessageList } from "./MessageList";
import { useAgentChat } from "./useAgentChat";

const DISCLOSURE =
  "Hi, I'm Spike — spike.land's AI agent. I can talk through our services, method, and how we work, and I'll always say when something needs Zoltan directly.";

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { items, status, fallback, sendMessage } = useAgentChat();

  useEffect(() => {
    track("chat_opened");
  }, []);

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
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-neutral-950 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-2xl sm:border sm:border-neutral-200 sm:shadow-2xl sm:dark:border-neutral-800"
    >
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div>
          <p className="text-sm font-medium">Spike</p>
          <p className="text-xs text-neutral-500">AI agent · spike.land</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/about#contact"
            className="text-xs underline underline-offset-4 text-neutral-500"
          >
            Email instead
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="rounded-full p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      </header>

      {fallback ? (
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
