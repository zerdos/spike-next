import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";
import legacyRedirects from "./config/legacy-redirects.json";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects as Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;
  },
};

export default nextConfig;
