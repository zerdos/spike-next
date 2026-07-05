/**
 * Per-IP rate limiting via the Workers rate-limiting binding. If the binding
 * is ever unavailable (beta feature), fail open rather than blocking traffic —
 * a Cloudflare WAF rate-limiting rule on the zone is the documented fallback.
 */
export async function checkRateLimit(limiter: RateLimit, request: Request): Promise<boolean> {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  try {
    const { success } = await limiter.limit({ key: ip });
    return success;
  } catch (error) {
    console.error("rate limiter unavailable, failing open", error);
    return true;
  }
}
