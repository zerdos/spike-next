"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), {
  ssr: false,
});

/**
 * The only client island on marketing pages. Listens globally for
 * [data-chat-open] clicks (hero CTA, engagement steps, final CTA) so those
 * stay plain server-rendered links until this mounts and intercepts them.
 */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest("[data-chat-open]");
      if (target) {
        event.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat with Spike, our AI agent"
          className="fixed bottom-6 right-6 z-50 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-lg motion-safe:transition-transform motion-safe:hover:scale-105 dark:bg-white dark:text-neutral-900"
        >
          Chat with Spike
        </button>
      )}
      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}
