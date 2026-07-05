/** Builds a Cal.com booking link, optionally prefilled with consented name/email. */
export function buildCalUrl(calLink: string, params?: { name?: string; email?: string }): string {
  const url = new URL(`https://cal.com/${calLink}`);
  if (params?.name) url.searchParams.set("name", params.name);
  if (params?.email) url.searchParams.set("email", params.email);
  return url.toString();
}
