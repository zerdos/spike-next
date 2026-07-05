import { describe, expect, it } from "vitest";
import { mintSession, verifySession } from "../lib/session";

const SECRET = "test-secret";

describe("session signing (FR-1.5)", () => {
  it("mints a verifiable session", async () => {
    const session = await mintSession(SECRET);
    expect(session.id).toMatch(/^[0-9a-f-]{36}$/);
    await expect(verifySession(SECRET, session.id, session.sig)).resolves.toBe(true);
  });

  it("rejects a tampered signature", async () => {
    const session = await mintSession(SECRET);
    const tampered = `${session.sig.slice(0, -1)}${session.sig.at(-1) === "0" ? "1" : "0"}`;
    await expect(verifySession(SECRET, session.id, tampered)).resolves.toBe(false);
  });

  it("rejects a session minted with a different secret", async () => {
    const session = await mintSession(SECRET);
    await expect(verifySession("other-secret", session.id, session.sig)).resolves.toBe(false);
  });

  it("rejects malformed input without touching crypto", async () => {
    await expect(verifySession(SECRET, "not-a-uuid", "bad-sig")).resolves.toBe(false);
  });
});
