import { describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "../lib/rate-limit";

function fakeLimiter(success: boolean) {
  return { limit: vi.fn().mockResolvedValue({ success }) } as unknown as RateLimit;
}

function fakeRequest(ip = "203.0.113.1") {
  return new Request("https://spike.land/api/chat", {
    headers: { "cf-connecting-ip": ip },
  });
}

describe("checkRateLimit (FR-1.8 abuse control)", () => {
  it("allows requests under the limit", async () => {
    await expect(checkRateLimit(fakeLimiter(true), fakeRequest())).resolves.toBe(true);
  });

  it("blocks requests over the limit", async () => {
    await expect(checkRateLimit(fakeLimiter(false), fakeRequest())).resolves.toBe(false);
  });

  it("fails open if the limiter binding throws", async () => {
    const limiter = {
      limit: vi.fn().mockRejectedValue(new Error("binding unavailable")),
    } as unknown as RateLimit;
    await expect(checkRateLimit(limiter, fakeRequest())).resolves.toBe(true);
  });
});
