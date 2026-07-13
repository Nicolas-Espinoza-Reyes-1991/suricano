import { corsOptions, json, requireAdmin } from "../../../_lib/auth.js";
import { ensureSchema, productToRow, rowToProduct } from "../../../_lib/db.js";

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

  const existing = await env.DB.prepare(`SELECT * FROM products WHERE id = ?`)
    .bind(id)
    .first();
  if (!existing) return json({ error: "Producto no encontrado" }, 404);

  const type = body.type || existing.type;
  const merged = {
    ...rowToProduct(existing),
    ...body,
    id,
    group: body.group ?? body.extra_group ?? existing.extra_group,
  };
  const row = productToRow(merged, type, existing.sort_order);

  await ensureSchema(env.DB);
  await env.DB.prepare(
    `UPDATE products SET
      type = ?, name = ?, description = ?, price = ?, image = ?, category = ?,
      tag = ?, tag_style = ?, heat = ?, featured = ?, spotlight = ?,
      spotlight_rank = ?, spotlight_label = ?, kind = ?, size = ?,
      extra_group = ?, flavors = ?, pick = ?, active = ?,
      updated_at = datetime('now')
     WHERE id = ?`
  )
    .bind(
      row.type,
      row.name,
      row.description,
      row.price,
      row.image,
      row.category,
      row.tag,
      row.tag_style,
      row.heat,
      row.featured,
      row.spotlight,
      row.spotlight_rank,
      row.spotlight_label,
      row.kind,
      row.size,
      row.extra_group,
      row.flavors,
      row.pick,
      body.active === false ? 0 : 1,
      id
    )
    .run();

  const updated = await env.DB.prepare(`SELECT * FROM products WHERE id = ?`)
    .bind(id)
    .first();

  return json({
    ok: true,
    product: { ...rowToProduct(updated), type: updated.type, active: !!updated.active },
  });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 no configurada" }, 500);

  const id = params.id;
  const result = await env.DB.prepare(`DELETE FROM products WHERE id = ?`)
    .bind(id)
    .run();

  return json({ ok: true, deleted: result.meta?.changes || 0 });
}
