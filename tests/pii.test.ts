import { describe, expect, it } from "vitest";
import { decryptPII, encryptPII } from "../lib/pii";

const KEY = "RzEfzb5nwlQc8W5WyieemMXfty2uP6tZrkNlkfo2Wm8="; // 32 random bytes, base64

describe("PII encryption (NFR-5 app-level encryption at rest)", () => {
  it("round-trips a lead payload", async () => {
    const lead = { name: "Ada Lovelace", email: "ada@example.com", company: "Analytical Engines" };
    const encrypted = await encryptPII(KEY, lead);
    expect(encrypted).not.toContain("Ada");
    expect(encrypted).not.toContain("ada@example.com");
    const decrypted = await decryptPII<typeof lead>(KEY, encrypted);
    expect(decrypted).toEqual(lead);
  });

  it("produces different ciphertext for the same input (random IV)", async () => {
    const lead = { name: "Ada Lovelace", email: "ada@example.com" };
    const a = await encryptPII(KEY, lead);
    const b = await encryptPII(KEY, lead);
    expect(a).not.toBe(b);
  });

  it("fails to decrypt with the wrong key", async () => {
    const otherKey = "b3RoZXJrZXlvdGhlcmtleW90aGVya2V5b3RoZXJrZXk9";
    const encrypted = await encryptPII(KEY, { name: "Ada" });
    await expect(decryptPII(otherKey, encrypted)).rejects.toThrow();
  });
});
