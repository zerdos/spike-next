import { readFileSync } from "node:fs";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

// Read via fs rather than a JSON import specifier: under "type": "module" a
// raw `import x from "./file.json"` needs an import attribute, and that
// requirement is enforced inconsistently across Next's config loader,
// wrangler dev, and workerd. Reading + JSON.parse sidesteps it everywhere.
const legacyRedirects = JSON.parse(
  readFileSync(new URL("./config/legacy-redirects.json", import.meta.url), "utf8"),
);

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects as Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;
  },
};

export default nextConfig;
