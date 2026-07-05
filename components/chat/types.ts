export type ChatItem =
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "assistant"; text: string }
  | { id: string; kind: "system"; text: string }
  | { id: string; kind: "booking"; url: string }
  | { id: string; kind: "lead-confirmed" }
  | { id: string; kind: "escalate"; reason: string };
