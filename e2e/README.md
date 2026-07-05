# E2E suite

Runs against `npm run preview` (real OpenNext/workerd build, main worker + `chat-state` DO) —
bindings and SSE streaming only behave correctly there, never `next dev`. Chat network calls are
mocked with `page.route` (no live LLM in E2E); the live model only runs in `evals/`.

```bash
npx playwright test          # full suite
npx playwright test chat     # one spec file
```

## FR → test traceability

| Requirement | Covered by |
|---|---|
| FR-1.1 Launcher placement, hero CTA, mobile full-screen | `chat.spec.ts` |
| FR-1.2 Capabilities (explain, qualify, capture, book, "don't know") | `evals/golden/{correctness,handoff,refusal}.yaml` |
| FR-1.3 KB-only grounding | `evals/golden/correctness.yaml`, `refusal.yaml` (fake-client case) |
| FR-1.4 Streaming, first token ≤1.5s p50 | Manual/production check against the deployed worker (see plan; not CI-automatable without a live deploy) |
| FR-1.5 Session persistence, no account | `tests/session.test.ts` |
| FR-1.6 Lead handoff ≤1 min (transcript + summary) | `tests/lead-schema.test.ts`, `tests/eval-checks.test.ts`, `evals/golden/handoff.yaml` |
| FR-1.7 Human escape hatch | `chat.spec.ts` ("Email instead" header link), `MessageList` escalate card links |
| FR-1.8 Abuse & cost control | `tests/rate-limit.test.ts`; live-verified against local wrangler dev in the P4 build |
| FR-1.9 AI disclosure, consent gate | `chat.spec.ts` (disclosure text), `tests/lead-schema.test.ts` (consent:true required) |
| FR-1.10 Fallback (kill switch / API down) | `fallback.spec.ts` |
| FR-2 Booking links + prefill | `booking.spec.ts` |
| FR-3 Lead notifications | `lib/email.ts` (graceful-failure unit-covered via P2/P4 manual verification); real delivery requires `RESEND_API_KEY` in production |
| FR-4 Cookieless analytics | `AnalyticsObserver` + `/api/events`; live-verified against local wrangler dev in the P4 build |
| FR-5 SEO | `lighthouserc.json` (SEO ≥ 0.95); JSON-LD verified via curl in the P1 build |
| FR-6 Contact fallback (honeypot) | `contact.spec.ts` |
| FR-7 Legacy redirects, 301 | `tests/redirects.test.ts` (table integrity), `redirects.spec.ts` (live sampling) |
| NFR-1 Performance | `lighthouserc.json` (perf ≥ 0.90) |
| NFR-2 Accessibility | `lighthouserc.json` (a11y ≥ 0.95); `role="log"`/`aria-live`, keyboard (Escape, autofocus) in `ChatPanel`/`Composer` |
| NFR-3 Responsive / mobile full-screen | `chat.spec.ts` (375×700 viewport) |
| NFR-4 Chat degrades independently | `fallback.spec.ts` |
| NFR-5 Security (no client-side keys, PII encrypted) | `tests/pii.test.ts`, `tests/session.test.ts` |
| NFR-6 Privacy/UK GDPR | `/privacy` content (manual review) |
| NFR-7 Dark mode | CSS only (`prefers-color-scheme`); manual visual check |

Agent eval gate (correctness/refusal/injection/tone/handoff) is documented separately in
`evals/run-evals.ts` and `.github/workflows/evals.yml`.
