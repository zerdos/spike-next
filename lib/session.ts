/**
 * HMAC-signed chat session ids. The signature proves the id was minted by us,
 * so the Durable Object namespace can't be enumerated by guessing ids.
 * No cookie, no account, no PII — the client keeps {id, sig} in sessionStorage.
 */

const encoder = new TextEncoder();

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function mintSession(secret: string): Promise<{ id: string; sig: string }> {
  const id = crypto.randomUUID();
  const key = await hmacKey(secret);
  const sig = toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(id)));
  return { id, sig };
}

export async function verifySession(secret: string, id: string, sig: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f]{64}$/.test(sig)) return false;
  const key = await hmacKey(secret);
  const bytes = new Uint8Array(sig.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(sig.slice(i * 2, i * 2 + 2), 16);
  }
  return crypto.subtle.verify("HMAC", key, bytes, encoder.encode(id));
}
