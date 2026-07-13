import { json, corsOptions } from "../_lib/auth.js";
import { countProducts, loadCatalogFromDb } from "../_lib/db.js";

async function loadStaticMenu(request) {
  const url = new URL("/data/menu.json", request.url);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("No se pudo leer data/menu.json");
  const data = await res.json();
  return { ...data, source: "json" };
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
