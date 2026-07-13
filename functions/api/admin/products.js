import { corsOptions, json, requireAdmin } from "../../_lib/auth.js";
import {
  countProducts,
  ensureSchema,
  loadCatalogFromDb,
  productToRow,
  rowToProduct,
} from "../../_lib/db.js";

export async function onRequestOptions() {
  return corsOptions();
}

async function seedFromStatic(request, db) {
  const url = new URL("/data/menu.json", request.url);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("No hay data/menu.json para inicializar");
  const data = await res.json();
  await ensureSchema(db);

  const stmts = [];
  let order = 0;
  const push = (type, item) => {
    const row = productToRow(item, type, order++);
    stmts.push(
      db
        .prepare(
          `INSERT OR REPLACE INTO products (
            id, type, name, description, price, image, category, tag, tag_style,
            heat, featured, spotlight, spotlight_rank, spotlight_label, kind, size,
            extra_group, flavors, pick, sort_order, active, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        )
        .bind(
          row.id,
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
          row.sort_order,
          row.active
        )
    );
  };

  (data.burritos || []).forEach((i) => push("burrito", i));
  (data.papas || []).forEach((i) => push("papas", i));
  (data.drinks || []).forEach((i) => push("drink", i));
  (data.extras || []).forEach((i) => push("extra", i));
  (data.custom || []).forEach((i) => push("custom", i));

  for (const c of data.categories || []) {
    stmts.push(
      db
        .prepare(
          `INSERT OR REPLACE INTO categories (id, label, scope, description, sort_order, active, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
        )
        .bind(
          c.id,
          c.label,
          c.scope,
          c.description || "",
          Number(c.sort_order) || 0,
          c.active === false ? 0 : 1
        )
    );
  }

  if (stmts.length) await db.batch(stmts);
  return stmts.length;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 no configurada (binding DB)." }, 500);

  const count = await countProducts(env.DB);
  if (count === 0) {
    await seedFromStatic(request, env.DB);
  }

  const { results } = await env.DB.prepare(
    `SELECT * FROM products ORDER BY type ASC, sort_order ASC, name ASC`
  ).all();

  return json({
    products: (results || []).map((row) => ({
      ...rowToProduct(row),
      type: row.type,
      active: !!row.active,
      sort_order: row.sort_order,
      description: row.description,
      updated_at: row.updated_at,
    })),
    catalog: await loadCatalogFromDb(env.DB),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 no configurada (binding DB)." }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  // Seed endpoint
  if (body?.action === "seed") {
    const n = await seedFromStatic(request, env.DB);
    return json({ ok: true, seeded: n });
  }

  const type = body.type;
  if (!["burrito", "papas", "drink", "extra", "custom"].includes(type)) {
    return json({ error: "type inválido" }, 400);
  }
  if (!body.id || !body.name) {
    return json({ error: "Nombre obligatorio" }, 400);
  }

  await ensureSchema(env.DB);
  const existing = await env.DB.prepare(`SELECT id FROM products WHERE id = ?`)
    .bind(body.id)
    .first();
  if (existing) {
    return json(
      { error: `Ya existe un producto similar (“${body.id}”). Cambia el nombre.` },
      400
    );
  }

  const maxOrder = await env.DB.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) AS m FROM products WHERE type = ?`
  )
    .bind(type)
    .first();
  const row = productToRow(body, type, Number(maxOrder?.m || 0) + 1);

  try {
    await env.DB.prepare(
      `INSERT INTO products (
        id, type, name, description, price, image, category, tag, tag_style,
        heat, featured, spotlight, spotlight_rank, spotlight_label, kind, size,
        extra_group, flavors, pick, sort_order, active, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
      .bind(
        row.id,
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
        row.sort_order,
        row.active
      )
      .run();
  } catch (err) {
    return json(
      {
        error: err.message?.includes("UNIQUE")
          ? "Ese producto ya existe. Cambia el nombre."
          : err.message || "No se pudo guardar",
      },
      400
    );
  }

  return json({ ok: true, product: rowToProduct({ ...row, description: row.description }) });
}
