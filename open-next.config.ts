import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Pure SSG for marketing routes — no ISR, so no incremental cache / queue needed.
export default defineCloudflareConfig({});
