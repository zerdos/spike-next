import { describe, expect, it } from "vitest";
import { leadSchema } from "../lib/agent/tools";

describe("capture_lead tool schema (FR-1.9 consent gate)", () => {
  it("accepts a valid lead with explicit consent", () => {
    const result = leadSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when consent is false", () => {
    const result = leadSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is missing", () => {
    const result = leadSchema.safeParse({ name: "Ada Lovelace", email: "ada@example.com" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({
      name: "Ada Lovelace",
      email: "not-an-email",
      consent: true,
    });
    expect(result.success).toBe(false);
  });
});
