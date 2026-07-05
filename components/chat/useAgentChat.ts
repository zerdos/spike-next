"use client";

import { useCallback, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { ChatItem } from "./types";

type SessionInfo = { id: string; sig: string };

const STORAGE_KEY = "spike-chat-session";

function readStoredSession(): SessionInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionInfo) : null;
  } catch {
    return null;
  }
}

export function useAgentChat() {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const [fallback, setFallback] = useState(false);
  const sessionRef = useRef<SessionInfo | null>(null);
  const firstMessageSent = useRef(false);

  const ensureSession = useCallback(async (): Promise<SessionInfo | null> => {
    if (sessionRef.current) return sessionRef.current;
    const stored = readStoredSession();
    if (stored) {
      sessionRef.current = stored;
      return stored;
    }
    try {
      const res = await fetch("/api/chat/session", { method: "POST" });
      if (!res.ok) {
        setFallback(true);
        return null;
      }
      const session = (await res.json()) as SessionInfo;
      sessionRef.current = session;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    } catch {
      setFallback(true);
      return null;
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const session = await ensureSession();
      if (!session) return;

      if (!firstMessageSent.current) {
        firstMessageSent.current = true;
        track("first_message_sent");
      }

      const userId = crypto.randomUUID();
      setItems((prev) => [...prev, { id: userId, kind: "user", text }]);
      setStatus("streaming");

      const assistantId = crypto.randomUUID();
      setItems((prev) => [...prev, { id: assistantId, kind: "assistant", text: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.id, sig: session.sig, message: text }),
        });

        if (res.status === 503 || res.status === 429) {
          setFallback(true);
          return;
        }
        if (!res.ok || !res.body) {
          throw new Error(`chat request failed: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const raw of events) {
            if (!raw.trim()) continue;
            const lines = raw.split("\n");
            const eventLine = lines.find((l) => l.startsWith("event: "));
            const dataLine = lines.find((l) => l.startsWith("data: "));
            if (!eventLine || !dataLine) continue;
            const eventName = eventLine.slice("event: ".length);
            const data = JSON.parse(dataLine.slice("data: ".length));

            if (eventName === "token") {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === assistantId && item.kind === "assistant"
                    ? { ...item, text: item.text + data.text }
                    : item,
                ),
              );
            } else if (eventName === "tool") {
              if (data.name === "book_call" && data.data?.bookingUrl) {
                track("booking_started");
                setItems((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), kind: "booking", url: data.data.bookingUrl },
                ]);
              } else if (data.name === "capture_lead" && data.data?.leadCaptured) {
                track("lead_captured");
                setItems((prev) => [...prev, { id: crypto.randomUUID(), kind: "lead-confirmed" }]);
              } else if (data.name === "escalate_to_human") {
                setItems((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), kind: "escalate", reason: data.data?.reason ?? "" },
                ]);
              }
            } else if (eventName === "error") {
              setItems((prev) => [
                ...prev,
                { id: crypto.randomUUID(), kind: "system", text: data.message },
              ]);
            }
          }
        }
      } catch (error) {
        console.error("chat stream failed", error);
        setItems((prev) => [
          ...prev,
          { id: crypto.randomUUID(), kind: "system", text: "Connection lost. Please try again." },
        ]);
      } finally {
        setStatus("idle");
      }
    },
    [ensureSession],
  );

  return { items, status, fallback, sendMessage, ensureSession };
}
