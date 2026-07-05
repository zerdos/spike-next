# spike.land

AI-native digital agency landing site. Next.js 16 (App Router) on Cloudflare Workers via
`@opennextjs/cloudflare`. See `AGENTS.md` for hard rules and layout, and
`~/.claude/plans/prd-spike-land-scalable-perlis.md` for the full build plan.

## Commands

```bash
npm run dev       # next dev — UI-only, no Cloudflare bindings
npm run preview   # kb + OpenNext build + multi-worker wrangler dev (main + chat-state DO)
                   # — the target for anything touching bindings/streaming
npm run lint      # biome check
npm run typecheck # tsc, root + workers/chat-state
npm run test      # vitest
npm run deploy    # kb + OpenNext build + wrangler deploy
```

Local secrets go in `.dev.vars` (gitignored): `ANTHROPIC_API_KEY`, `RESEND_API_KEY`,
`SESSION_SIGNING_SECRET`, `PII_ENCRYPTION_KEY` (base64 AES-256 key). In production these are
set with `wrangler secret put <NAME>`.

## Cost guardrails

The agent chat calls the Anthropic API on every turn. Three layers keep spend bounded:

1. **Per-session ceilings** (`wrangler.jsonc` vars `MAX_SESSION_TOKENS`, `MAX_SESSION_MESSAGES`,
   enforced in `app/api/chat/route.ts`): once a session's cumulative tokens or message count hits
   the limit, `/api/chat` returns 429 and the client falls back to the contact form.
2. **Per-IP rate limits** (`CHAT_RATE_LIMITER` / `CONTACT_RATE_LIMITER` bindings, 20 and 5
   requests/minute respectively, `lib/rate-limit.ts`): bounds request volume before any LLM call
   happens. If the binding is ever unavailable, `checkRateLimit` fails open and a Cloudflare WAF
   rate-limiting rule on the zone is the documented fallback.
3. **Org-level spend alerts**: set a monthly spend cap and 50/80/100% alerts in the Anthropic
   Console. This is the backstop layer and must be configured manually (no API for it) before
   launch.

`AGENT_MODEL` (default `claude-opus-4-8`) is a single env var — switching to a cheaper/faster
model (e.g. `claude-haiku-4-5`) needs no code change, only a redeploy, and should be re-validated
against the eval suite in `evals/` before shipping.

## Kill switch

`CHAT_ENABLED=false` (env var) makes `/api/chat` and `/api/chat/session` return 503, and the
client (`ChatLauncher`/`ChatPanel`) renders `FallbackContactForm` instead. Flip it in the
Cloudflare dashboard or via `wrangler.jsonc` + redeploy for an emergency disable with no code
change.
