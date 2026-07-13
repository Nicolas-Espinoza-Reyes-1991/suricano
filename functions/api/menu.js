import { json, corsOptions } from "../_lib/auth.js";
import { countProducts, loadCatalogFromDb } from "../_lib/db.js";

async function loadStaticMenu(request) {
  const url = new URL("/data/menu.json", request.url);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("No se pudo leer data/menu.json");
  const data = await res.json();
  return {
    ...data,
    custom: data.custom || [],
    categories: data.categories || [
      { id: "solo", label: "Solo", scope: "burrito", sort_order: 1, active: true },
      { id: "papas", label: "Combo + papas", scope: "burrito", sort_order: 2, active: true },
      { id: "size-1", label: "Individual", scope: "papas", sort_order: 1, active: true },
      { id: "size-2", label: "Para 2", scope: "papas", sort_order: 2, active: true },
      { id: "size-4", label: "XL · 4", scope: "papas", sort_order: 3, active: true },
    ],
    source: "json",
  };
}

export async function onRequestOptions() {
  return corsOptions();
}

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    if (env.DB) {
      const count = await countProducts(env.DB);
      if (count > 0) {
        const catalog = await loadCatalogFromDb(env.DB);
        return json(catalog);
      }
    }
    const catalog = await loadStaticMenu(request);
    return json(catalog);
  } catch (err) {
    return json({ error: err.message || "Error al cargar menú" }, 500);
  }
}
