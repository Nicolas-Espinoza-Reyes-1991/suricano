const enc = new TextEncoder();

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
      ...extraHeaders,
    },
  });
}

export function corsOptions() {
  return json({ ok: true }, 204);
}

/** Create a session token valid for 12 hours */
export async function createToken(password) {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const payload = `suricano:${exp}`;
  const sig = await hmac(password, payload);
  return btoa(`${payload}.${sig}`);
}

export async function verifyToken(password, token) {
  if (!password || !token) return false;
  try {
    const raw = atob(token.replace(/^Bearer\s+/i, "").trim());
    const [payload, sig] = raw.split(".");
    if (!payload || !sig) return false;
    const [, expStr] = payload.split(":");
    const exp = Number(expStr);
    if (!exp || Date.now() > exp) return false;
    const expected = await hmac(password, payload);
    return expected === sig;
  } catch {
    return false;
  }
}

export async function requireAdmin(request, env) {
  const password = env.ADMIN_PASSWORD;
  if (!password) {
    return { ok: false, response: json({ error: "ADMIN_PASSWORD no configurada en Cloudflare." }, 500) };
  }
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const valid = await verifyToken(password, token);
  if (!valid) {
    return { ok: false, response: json({ error: "No autorizado" }, 401) };
  }
  return { ok: true };
}
