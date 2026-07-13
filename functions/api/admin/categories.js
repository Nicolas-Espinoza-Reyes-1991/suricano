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

  const label = String(body.label || "").trim();
  const scope = String(body.scope || "").trim();
  let id = String(body.id || label || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!id || !label) return json({ error: "El nombre es obligatorio" }, 400);
  if (!["burrito", "papas", "section"].includes(scope)) {
    return json({ error: "Tipo inválido" }, 400);
  }

  await ensureSchema(env.DB);
  const existing = await env.DB.prepare(`SELECT id FROM categories WHERE id = ?`)
    .bind(id)
    .first();
  if (existing) {
    return json(
      { error: `Ya existe “${id}”. Usa otro nombre o edita el existente.` },
      400
    );
  }

  const max = await env.DB.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) AS m FROM categories WHERE scope = ?`
  )
    .bind(scope)
    .first();

  try {
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
  } catch (err) {
    return json(
      { error: err.message?.includes("UNIQUE")
          ? "Ese nombre ya está en uso. Prueba otro."
          : err.message || "No se pudo crear" },
      400
    );
  }

  const row = await env.DB.prepare(`SELECT * FROM categories WHERE id = ?`).bind(id).first();
  return json({ ok: true, category: rowToCategory(row) });
}
