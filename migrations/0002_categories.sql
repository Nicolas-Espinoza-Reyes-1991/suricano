CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  scope TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_categories_scope ON categories(scope);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

INSERT OR IGNORE INTO categories (id, label, scope, description, sort_order, active) VALUES
  ('solo', 'Solo', 'burrito', 'Burritos sin papas', 1, 1),
  ('papas', 'Combo + papas', 'burrito', 'Burritos con papas', 2, 1),
  ('size-1', 'Individual', 'papas', 'Porción 1 persona', 1, 1),
  ('size-2', 'Para 2', 'papas', 'Porción para compartir', 2, 1),
  ('size-4', 'XL · 4', 'papas', 'Porción XL', 3, 1);
