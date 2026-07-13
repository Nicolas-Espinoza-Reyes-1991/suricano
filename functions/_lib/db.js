/** @param {import('@cloudflare/workers-types').D1Database | undefined} db */

const DEFAULT_CATEGORIES = [
  { id: "solo", label: "Solo", scope: "burrito", description: "Burritos sin papas", sort_order: 1 },
  { id: "papas", label: "Combo + papas", scope: "burrito", description: "Burritos con papas", sort_order: 2 },
  { id: "size-1", label: "Individual", scope: "papas", description: "Porción 1 persona", sort_order: 1 },
  { id: "size-2", label: "Para 2", scope: "papas", description: "Porción para compartir", sort_order: 2 },
  { id: "size-4", label: "XL · 4", scope: "papas", description: "Porción XL", sort_order: 3 },
];

export async function ensureSchema(db) {
  if (!db) return;
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        price INTEGER NOT NULL DEFAULT 0,
        image TEXT NOT NULL DEFAULT '',
        category TEXT,
        tag TEXT,
        tag_style TEXT,
        heat INTEGER NOT NULL DEFAULT 0,
        featured INTEGER NOT NULL DEFAULT 0,
        spotlight INTEGER NOT NULL DEFAULT 0,
        spotlight_rank INTEGER,
        kind TEXT,
        size INTEGER,
        extra_group TEXT,
        flavors TEXT,
        pick INTEGER,
        sort_order INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        spotlight_label TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        scope TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    )
    .run();

  const catCount = await db.prepare(`SELECT COUNT(*) AS c FROM categories`).first();
  if (Number(catCount?.c || 0) === 0) {
    const stmts = DEFAULT_CATEGORIES.map((c, i) =>
      db
        .prepare(
          `INSERT OR IGNORE INTO categories (id, label, scope, description, sort_order, active, updated_at)
           VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`
        )
        .bind(c.id, c.label, c.scope, c.description || "", c.sort_order ?? i + 1)
    );
    if (stmts.length) await db.batch(stmts);
  }
}

export function rowToCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    label: row.label,
    scope: row.scope,
    description: row.description || "",
    sort_order: Number(row.sort_order) || 0,
    active: row.active !== 0 && row.active !== false,
  };
}

export function rowToProduct(row) {
  if (!row) return null;
  const item = {
    id: row.id,
    name: row.name,
    desc: row.description || "",
    price: Number(row.price) || 0,
    image: row.image || "",
    featured: !!row.featured,
  };

  if (row.type === "burrito") {
    item.category = row.category || "solo";
    item.tag = row.tag || "";
    item.tagStyle = row.tag_style || "";
    item.heat = Number(row.heat) || 0;
    item.spotlight = !!row.spotlight;
    if (row.spotlight_rank != null) item.spotlightRank = Number(row.spotlight_rank);
    if (row.spotlight_label) item.spotlightLabel = row.spotlight_label;
  } else if (row.type === "papas") {
    item.kind = "papas";
    item.size = Number(row.size) || 1;
    if (row.tag) item.tag = row.tag;
    if (row.tag_style) item.tagStyle = row.tag_style;
    if (row.desc || row.description) item.desc = row.description;
  } else if (row.type === "drink") {
    item.kind = "drink";
    if (row.tag) item.tag = row.tag;
    if (row.tag_style) item.tagStyle = row.tag_style;
    if (row.description) item.desc = row.description;
  } else if (row.type === "extra") {
    item.group = row.extra_group || "salsas";
    if (row.kind) item.kind = row.kind;
    if (row.flavors) {
      try {
        item.flavors = JSON.parse(row.flavors);
      } catch {
        item.flavors = [];
      }
    }
    if (row.pick != null) item.pick = Number(row.pick);
  } else if (row.type === "custom") {
    item.kind = "custom";
    item.category = row.category || "";
    item.tag = row.tag || "";
    item.tagStyle = row.tag_style || "";
  }

  return item;
}

export function productToRow(product, type, sortOrder = 0) {
  return {
    id: product.id,
    type,
    name: product.name,
    description: product.desc || product.description || "",
    price: Number(product.price) || 0,
    image: product.image || "",
    category: product.category || null,
    tag: product.tag || null,
    tag_style: product.tagStyle || null,
    heat: Number(product.heat) || 0,
    featured: product.featured ? 1 : 0,
    spotlight: product.spotlight ? 1 : 0,
    spotlight_rank: product.spotlightRank ?? null,
    spotlight_label: product.spotlightLabel || null,
    kind: product.kind || null,
    size: product.size ?? null,
    extra_group: product.group || product.extra_group || null,
    flavors: product.flavors ? JSON.stringify(product.flavors) : null,
    pick: product.pick ?? null,
    sort_order: sortOrder,
    active: product.active === false ? 0 : 1,
  };
}

export async function loadCategories(db, { includeInactive = false } = {}) {
  await ensureSchema(db);
  const sql = includeInactive
    ? `SELECT * FROM categories ORDER BY scope ASC, sort_order ASC, label ASC`
    : `SELECT * FROM categories WHERE active = 1 ORDER BY scope ASC, sort_order ASC, label ASC`;
  const { results } = await db.prepare(sql).all();
  return (results || []).map(rowToCategory);
}

export async function loadCatalogFromDb(db) {
  await ensureSchema(db);
  const { results } = await db
    .prepare(
      `SELECT * FROM products WHERE active = 1 ORDER BY type ASC, sort_order ASC, name ASC`
    )
    .all();

  const burritos = [];
  const papas = [];
  const drinks = [];
  const extras = [];
  const custom = [];

  for (const row of results || []) {
    const item = rowToProduct(row);
    if (!item) continue;
    if (row.type === "burrito") burritos.push(item);
    else if (row.type === "papas") papas.push(item);
    else if (row.type === "drink") drinks.push(item);
    else if (row.type === "extra") extras.push(item);
    else if (row.type === "custom") custom.push(item);
  }

  const categories = await loadCategories(db);

  return {
    burritos,
    papas,
    drinks,
    extras,
    custom,
    categories,
    extraGroups: [
      { id: "proteinas", label: "Proteínas" },
      { id: "vegetales", label: "Vegetales" },
      { id: "salsas", label: "Salsas" },
      { id: "potes", label: "Potes de aderezo" },
    ],
    source: "d1",
    updatedAt: new Date().toISOString(),
  };
}

export async function countProducts(db) {
  await ensureSchema(db);
  const row = await db.prepare(`SELECT COUNT(*) AS c FROM products`).first();
  return Number(row?.c || 0);
}
