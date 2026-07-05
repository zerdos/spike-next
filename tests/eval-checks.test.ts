import { describe, expect, it } from "vitest";
import { runDeterministicChecks } from "../evals/checks";

describe("runDeterministicChecks (eval gate logic)", () => {
  it("passes with no expectations", () => {
    expect(runDeterministicChecks(undefined, "anything goes", []).pass).toBe(true);
  });

  it("fails must_match when the pattern is absent", () => {
    const result = runDeterministicChecks(
      { must_match: ["book a call"] },
      "I can't help with that.",
      [],
    );
    expect(result.pass).toBe(false);
    expect(result.failures[0]).toMatch(/must_match failed/);
  });

  it("passes must_match when the pattern is present (case-insensitive)", () => {
    const result = runDeterministicChecks(
      { must_match: ["BOOK A CALL"] },
      "Let's book a call.",
      [],
    );
    expect(result.pass).toBe(true);
  });

  it("fails must_not_match when a forbidden pattern (e.g. a price) leaks", () => {
    const result = runDeterministicChecks(
      { must_not_match: ["\\$\\d+", "£\\d+"] },
      "That would cost £5000.",
      [],
    );
    expect(result.pass).toBe(false);
    expect(result.failures[0]).toMatch(/must_not_match failed/);
  });

  it("fails expected_tool when the tool was never called", () => {
    const result = runDeterministicChecks(
      { expected_tool: "book_call" },
      "Sure, happy to help.",
      [],
    );
    expect(result.pass).toBe(false);
  });

  it("passes expected_tool when the tool was called", () => {
    const result = runDeterministicChecks({ expected_tool: "book_call" }, "Here's the link.", [
      { name: "book_call", input: {} },
    ]);
    expect(result.pass).toBe(true);
  });

  it("fails forbid_tool when the forbidden tool was called", () => {
    const result = runDeterministicChecks({ forbid_tool: "capture_lead" }, "ok", [
      { name: "capture_lead", input: { consent: true } },
    ]);
    expect(result.pass).toBe(false);
  });

  it("enforces the default 120-word cap", () => {
    const longText = Array(121).fill("word").join(" ");
    const result = runDeterministicChecks({}, longText, []);
    expect(result.pass).toBe(false);
    expect(result.failures[0]).toMatch(/max_words failed/);
  });

  it("respects a custom max_words", () => {
    const result = runDeterministicChecks({ max_words: 5 }, "one two three four five six", []);
    expect(result.pass).toBe(false);
  });

  it("fails requires_consent_true when capture_lead was called without consent", () => {
    const result = runDeterministicChecks({ requires_consent_true: true }, "ok", [
      { name: "capture_lead", input: { consent: false } },
    ]);
    expect(result.pass).toBe(false);
    expect(result.failures[0]).toMatch(/requires_consent_true failed/);
  });

  it("passes requires_consent_true when capture_lead was called with consent", () => {
    const result = runDeterministicChecks({ requires_consent_true: true }, "ok", [
      { name: "capture_lead", input: { consent: true } },
    ]);
    expect(result.pass).toBe(true);
  });

  it("ignores requires_consent_true when capture_lead was never called", () => {
    const result = runDeterministicChecks({ requires_consent_true: true }, "ok", []);
    expect(result.pass).toBe(true);
  });

  it("aggregates multiple failures", () => {
    const result = runDeterministicChecks(
      { must_match: ["xyz"], forbid_tool: "capture_lead" },
      "no match here",
      [{ name: "capture_lead", input: { consent: true } }],
    );
    expect(result.failures).toHaveLength(2);
  });
});
