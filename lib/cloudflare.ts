import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Secrets aren't declared in wrangler.jsonc vars, so extend the generated CloudflareEnv. */
export interface Env extends CloudflareEnv {
  ANTHROPIC_API_KEY: string;
  RESEND_API_KEY: string;
  SESSION_SIGNING_SECRET: string;
  PII_ENCRYPTION_KEY: string;
  LEAD_WEBHOOK_URL?: string;
}

export function env(): Env {
  return getCloudflareContext().env as unknown as Env;
}

export function isChatEnabled(e: Env): boolean {
  return (e.CHAT_ENABLED as string) !== "false";
}
