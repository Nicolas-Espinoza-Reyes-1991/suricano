import { createToken, corsOptions, json } from "../../_lib/auth.js";

export async function onRequestOptions() {
  return corsOptions();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const password = env.ADMIN_PASSWORD;
  if (!password) {
    return json(
      {
        error:
          "Falta ADMIN_PASSWORD. Configúrala en Cloudflare Pages → Settings → Environment variables.",
      },
      500
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  if (!body?.password || body.password !== password) {
    return json({ error: "Clave incorrecta" }, 401);
  }

  const token = await createToken(password);
  return json({ token, expiresInHours: 12 });
}
