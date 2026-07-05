import { expect, test } from "@playwright/test";
import legacyRedirects from "../config/legacy-redirects.json" with { type: "json" };

type RedirectEntry = { source: string; destination: string; statusCode: number };

// One concrete sample per wildcard pattern.
const patternSamples: Record<string, string> = {
  "/blog/:slug*": "/blog/some-old-post",
  "/apps/:slug*": "/apps/bugbook",
  "/music/:slug*": "/music/neon-horizon",
  "/learn/:slug*": "/learn/getting-started",
  "/create/:slug*": "/create/app",
  "/dashboard/:slug*": "/dashboard/settings",
  "/playground/:slug*": "/playground/some-tool",
  "/tool/:slug*": "/tool/some-tool",
};

test.describe("legacy redirects (FR-7)", () => {
  for (const [pattern, sample] of Object.entries(patternSamples)) {
    test(`pattern ${pattern} -> /`, async ({ page }) => {
      await page.goto(sample);
      expect(new URL(page.url()).pathname).toBe("/");
    });
  }

  const entries = legacyRedirects as RedirectEntry[];
  const literalSamples = entries.filter((e) => !e.source.includes(":")).slice(0, 6);

  for (const entry of literalSamples) {
    test(`literal ${entry.source} -> /`, async ({ page }) => {
      await page.goto(entry.source);
      expect(new URL(page.url()).pathname).toBe("/");
    });
  }
});
