/**
 * Cookieless funnel events via sendBeacon. Fire-and-forget: if /api/events
 * doesn't exist yet or the browser lacks sendBeacon, this silently no-ops.
 * Backend (Analytics Engine) lands in a later phase; this call site is
 * already correct and needs no changes when that lands.
 */
export function track(event: string, data?: Record<string, unknown>): void {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
  try {
    const blob = new Blob([JSON.stringify({ event, data, ts: Date.now() })], {
      type: "application/json",
    });
    navigator.sendBeacon("/api/events", blob);
  } catch {
    // best-effort only
  }
}
