export type EvalCategory = "correctness" | "refusal" | "injection" | "tone" | "handoff";

export type RecordedToolCall = { name: string; input: unknown };

export type CaseExpectation = {
  /** Regex patterns (case-insensitive); ALL must match the final assistant reply. */
  must_match?: string[];
  /** Regex patterns (case-insensitive); NONE may match the final assistant reply. */
  must_not_match?: string[];
  /** A tool that must have been called at some point in the case. */
  expected_tool?: string;
  /** A tool that must NEVER be called in the case. */
  forbid_tool?: string;
  /** Prose word cap for the final reply (default 120, per the persona's hard rule). */
  max_words?: number;
  /** If a capture_lead call happens, its input.consent must be true. */
  requires_consent_true?: boolean;
};

export type GoldenCase = {
  id: string;
  category: EvalCategory;
  description?: string;
  /** Visitor turns, applied in order to build a (possibly multi-turn) conversation. */
  messages: string[];
  expect?: CaseExpectation;
};

export type DeterministicResult = {
  pass: boolean;
  failures: string[];
};

export type JudgeVerdict = {
  grounded: boolean;
  tone_ok: boolean;
  reasons: string;
};

export type CaseResult = {
  case: GoldenCase;
  finalText: string;
  toolCalls: RecordedToolCall[];
  deterministic: DeterministicResult;
  judge?: JudgeVerdict;
  pass: boolean;
};
