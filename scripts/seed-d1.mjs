import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const menu = JSON.parse(fs.readFileSync(path.join(root, "data/menu.json"), "utf8"));
const remote = process.argv.includes("--remote");
const flag = remote ? "--remote" : "--local";

function esc(v) {
  if (v == null) return "NULL";
  if (typeof v === "number") return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

const rows = [];
let order = 0;

function add(type, item) {
  const flavors = item.flavors ? JSON.stringify(item.flavors) : null;
  rows.push(`INSERT OR REPLACE INTO products (
    id, type, name, description, price, image, category, tag, tag_style,
    heat, featured, spotlight, spotlight_rank, spotlight_label, kind, size,
    extra_group, flavors, pick, sort_order, active, updated_at
  ) VALUES (
    ${esc(item.id)}, ${esc(type)}, ${esc(item.name)}, ${esc(item.desc || "")},
    ${Number(item.price) || 0}, ${esc(item.image || "")}, ${esc(item.category || null)},
    ${esc(item.tag || null)}, ${esc(item.tagStyle || null)}, ${Number(item.heat) || 0},
    ${item.featured ? 1 : 0}, ${item.spotlight ? 1 : 0},
    ${item.spotlightRank == null ? "NULL" : Number(item.spotlightRank)},
    ${esc(item.spotlightLabel || null)}, ${esc(item.kind || null)},
    ${item.size == null ? "NULL" : Number(item.size)},
    ${esc(item.group || null)}, ${esc(flavors)},
    ${item.pick == null ? "NULL" : Number(item.pick)},
    ${order++}, 1, datetime('now')
  );`);
}

(menu.burritos || []).forEach((i) => add("burrito", i));
(menu.papas || []).forEach((i) => add("papas", i));
(menu.drinks || []).forEach((i) => add("drink", i));
(menu.extras || []).forEach((i) => add("extra", i));

const sqlPath = path.join(root, "migrations", "_seed_generated.sql");
fs.writeFileSync(sqlPath, rows.join("\n") + "\n");
console.log(`Seed SQL: ${rows.length} productos (${flag})`);

execFileSync(
  "npx",
  ["wrangler", "d1", "execute", "suricano-db", flag, `--file=${sqlPath}`],
  { stdio: "inherit", cwd: root, shell: true }
);
