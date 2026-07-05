import { describe, expect, it } from "vitest";
import legacyRedirects from "../config/legacy-redirects.json";

type RedirectEntry = {
  source: string;
  destination: string;
  permanent: boolean;
};

describe("legacy redirect table (FR-7)", () => {
  const entries = legacyRedirects as RedirectEntry[];

  it("every entry is a permanent redirect to /", () => {
    for (const entry of entries) {
      expect(entry.permanent).toBe(true);
      expect(entry.destination).toBe("/");
    }
  });

  it("never contains a root catch-all that would shadow live routes", () => {
    for (const entry of entries) {
      expect(entry.source).not.toMatch(/^\/:[a-zA-Z]+\*?$/);
    }
  });

  it("never redirects the new site's own routes", () => {
    const liveRoutes = ["/", "/method", "/about", "/privacy", "/terms"];
    const sources = entries.map((e) => e.source);
    for (const route of liveRoutes) {
      expect(sources).not.toContain(route);
    }
  });

  it("has no duplicate sources", () => {
    const sources = entries.map((e) => e.source);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
