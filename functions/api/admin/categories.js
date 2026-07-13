import { corsOptions, json, requireAdmin } from "../../_lib/auth.js";
import { ensureSchema, loadCategories, rowToCategory } from "../../_lib/db.js";

export async function onRequestOptions() {
  return corsOptions();
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 no configurada" }, 500);

  const categories = await loadCategories(env.DB, { includeInactive: true });
  return json({ categories });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 no configurada" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const id = String(body.id || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, "-");
  const label = String(body.label || "").trim();
  const scope = String(body.scope || "").trim();

  if (!id || !label) return json({ error: "id y label son obligatorios" }, 400);
  if (!["burrito", "papas", "section"].includes(scope)) {
    return json({ error: "scope inválido (burrito|papas|section)" }, 400);
  }

  await ensureSchema(env.DB);
  const max = await env.DB.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) AS m FROM categories WHERE scope = ?`
  )
    .bind(scope)
    .first();

  await env.DB.prepare(
    `INSERT INTO categories (id, label, scope, description, sort_order, active, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(
      id,
      label,
      scope,
      body.description || "",
      Number(body.sort_order) || Number(max?.m || 0) + 1,
      body.active === false ? 0 : 1
    )
    .run();

  const row = await env.DB.prepare(`SELECT * FROM categories WHERE id = ?`).bind(id).first();
  return json({ ok: true, category: rowToCategory(row) });
}
