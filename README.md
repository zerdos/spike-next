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
npm run deploy    # kb + OpenNext build + deploy chat-state THEN the main worker (order matters:
                   # the main worker's cross-script Durable Object binding needs spike-chat-state
                   # to already exist on the account)
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

## Launch checklist (cutover from the current spike.land Astro site)

This site replaces the existing Astro platform site at the spike.land apex. Nothing below has
been done by this build — it's the sequence to follow when going live, in order:

1. **Secrets**: `wrangler secret put` for `ANTHROPIC_API_KEY`, `RESEND_API_KEY`,
   `SESSION_SIGNING_SECRET` (any long random string), `PII_ENCRYPTION_KEY` (32 random bytes,
   base64 — e.g. `openssl rand -base64 32`). Never reuse the placeholder values from `.dev.vars`.
2. **Cal.com**: confirm the `spike-land/discovery` event type exists and availability is
   configured; update the `CAL_LINK` var in `wrangler.jsonc` if the slug differs.
3. **Deploy**: `npm run deploy` deploys both workers (`spike-chat-state` first, then `spike-digital`)
   to their `*.workers.dev` URLs; smoke-test every route + the chat end-to-end there before touching
   DNS. Verify with `wrangler secret list --name spike-digital` that step 1's secrets actually landed
   before expecting the chat to work — a fresh deploy with no secrets set will 500 on
   `/api/chat/session`, which is expected until step 1 is done.
4. **Eval gate**: run `npm run eval` (or trigger the `Agent Evals` GitHub Action manually) against
   the deployed model/KB and confirm the hard gate (refusal/injection/handoff) passes 100% and the
   soft gate (correctness/tone) clears 90% — this is the launch-blocking check from the PRD.
5. **Lighthouse**: `npx lhci autorun` against the deployed URL (not just local) — confirm
   perf ≥ 90 / a11y ≥ 95 / SEO ≥ 95 hold under real network conditions.
6. **First-token latency**: from a UK vantage point, time 10 real chat turns against the deployed
   worker; confirm p50 ≤ 1.5s (this is only meaningful against the real deployment, never `next dev`
   or local `wrangler dev`).
7. **DNS cutover**: point the `spike.land` apex at this Worker (Cloudflare custom domain), replacing
   the current Astro site's routing. Do this only after steps 3–6 pass — it's a production DNS
   change affecting live traffic and search rankings, not something to do speculatively.
8. **Verify redirects live**: sample the same URLs `e2e/redirects.spec.ts` checks, against the real
   domain, to confirm all ~68 legacy entries in `config/legacy-redirects.json` 301 correctly.
9. **Search Console**: submit the new sitemap, monitor the redirected URLs for crawl errors over
   the following week.
10. **Retire the Astro site**: once traffic and search results confirm the cutover is clean, decommission
    `packages/spike-web` in the old monorepo (or repurpose it at a `platform.spike.land` subdomain
    per the PRD's open question on the MCP platform's future — a product decision, not this repo's).

Steps 7 and 10 are irreversible-ish (DNS propagation, losing the old site's live traffic path) and
should only be executed with explicit sign-off — this repo does not perform them automatically.
