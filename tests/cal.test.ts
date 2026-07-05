import { describe, expect, it } from "vitest";
import { buildCalUrl } from "../lib/cal";

describe("buildCalUrl (FR-2 booking prefill)", () => {
  it("builds a bare link with no prefill", () => {
    expect(buildCalUrl("spike-land/discovery")).toBe("https://cal.com/spike-land/discovery");
  });

  it("prefills name and email when provided", () => {
    const url = new URL(
      buildCalUrl("spike-land/discovery", { name: "Ada Lovelace", email: "ada@example.com" }),
    );
    expect(url.origin + url.pathname).toBe("https://cal.com/spike-land/discovery");
    expect(url.searchParams.get("name")).toBe("Ada Lovelace");
    expect(url.searchParams.get("email")).toBe("ada@example.com");
  });

  it("omits params that aren't provided", () => {
    const url = new URL(buildCalUrl("spike-land/discovery", { name: "Ada Lovelace" }));
    expect(url.searchParams.has("email")).toBe(false);
  });
});
