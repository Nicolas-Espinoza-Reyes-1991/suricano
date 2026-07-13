import { corsOptions, json, requireAdmin } from "../../../_lib/auth.js";
import { ensureSchema, rowToCategory } from "../../../_lib/db.js";

export async function onRequestOptions() {
  return corsOptions();
}

export async function onRequestPut(context) {
  const { request, env, params } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 no configurada" }, 500);

  const id = params.id;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const existing = await env.DB.prepare(`SELECT * FROM categories WHERE id = ?`)
    .bind(id)
    .first();
  if (!existing) return json({ error: "Categoría no encontrada" }, 404);

  const scope = body.scope || existing.scope;
  if (!["burrito", "papas", "section"].includes(scope)) {
    return json({ error: "scope inválido" }, 400);
  }

  await ensureSchema(env.DB);
  await env.DB.prepare(
    `UPDATE categories SET
      label = ?, scope = ?, description = ?, sort_order = ?, active = ?,
      updated_at = datetime('now')
     WHERE id = ?`
  )
    .bind(
      body.label ?? existing.label,
      scope,
      body.description ?? existing.description,
      body.sort_order != null ? Number(body.sort_order) : existing.sort_order,
      body.active === false ? 0 : 1,
      id
    )
    .run();

  const row = await env.DB.prepare(`SELECT * FROM categories WHERE id = ?`).bind(id).first();
  return json({ ok: true, category: rowToCategory(row) });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 no configurada" }, 500);

  const id = params.id;
  // Soft-check: products using this category
  const used = await env.DB.prepare(
    `SELECT COUNT(*) AS c FROM products WHERE category = ? AND active = 1`
  )
    .bind(id)
    .first();
  if (Number(used?.c || 0) > 0) {
    return json(
      {
        error: `Hay ${used.c} producto(s) usando esta categoría. Muévelos o desactívala.`,
      },
      400
    );
  }

  await env.DB.prepare(`DELETE FROM categories WHERE id = ?`).bind(id).run();
  return json({ ok: true });
}
