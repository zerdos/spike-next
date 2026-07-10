<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# spike.land — AI-native agency landing site

Greenfield Next.js 16 (App Router) site deployed to Cloudflare Workers via `@opennextjs/cloudflare`.
Purpose: generate booked discovery calls; centerpiece is a KB-grounded AI agent chat ("Spike").
Full spec: PRD + approved plan in `~/.claude/plans/prd-spike-land-scalable-perlis.md`.

## Commands
- `npm run dev` — next dev (bindings unavailable; UI work only)
- `npm run preview` — OpenNext build + workerd preview (**the** target for anything touching bindings/streaming; E2E runs against this)
- `npm run lint` / `npm run format` — Biome
- `npm run typecheck` / `npm run test` — tsc / vitest
- `npm run deploy` — OpenNext build + wrangler deploy

## Hard rules (from the approved plan)
- Marketing routes are pure SSG server components. The ONLY client island on marketing pages is `ChatLauncher` (~2KB), which lazy-imports `ChatPanel`. Marketing JS budget ≤ 120KB gz — no client-side UI libraries.
- Never `export const runtime = "edge"` (OpenNext runs Next's Node runtime in workerd).
- Bindings via `getCloudflareContext()` from `@opennextjs/cloudflare`; `process.env` is build-time only. No runtime `fs` — the agent KB is compiled by `scripts/build-kb.ts` into `lib/agent/kb.generated.ts` (gitignored).
- Redirects live in `config/legacy-redirects.json` (imported by `next.config.ts`); all destinations `/`, all permanent. Never add a root catch-all.
- Chat: SSE from `/api/chat` (`force-dynamic`, return ReadableStream without awaiting completion). System prompt must be byte-stable (Gemini applies implicit caching automatically to a stable prompt prefix, which is load-bearing for the ≤1.5s first-token NFR); nothing volatile in it.
- Agent may only state facts present in `content/agent-kb/*.md`. Never prices, guarantees, client names outside KB. Tool inputs are zod-validated server-side regardless of what the model sends.
- PII (name/email) is AES-GCM encrypted before storage; no PII in URLs or analytics events.
- Images: pre-sized AVIF/WebP + plain `<img>` with explicit width/height (no next/image optimizer on Workers).

## Layout
- `app/(marketing)/` pages · `app/api/` route handlers · `components/{sections,chat,ui}/`
- `content/copy/` typed page copy · `content/agent-kb/` agent knowledge base (markdown)
- `lib/agent/` prompt, tools, streaming loop · `workers/chat-state/` ChatSessionDO worker
- `evals/` golden-question agent evals (CI gate) · `e2e/` Playwright · `tests/` vitest

## Asset source
Old platform monorepo: `~/Developer/spike-land-ai/spike.land` (BAZDMEG docs, CV, case-study material, redirect inventory, proven SSE patterns in `src/edge-api/main/api/routes/spike-chat.ts`).
