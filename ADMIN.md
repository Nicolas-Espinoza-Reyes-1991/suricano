# Panel admin El Suricano (Cloudflare · gratis)

## Qué incluye
- `/admin` — panel privado para editar burritos, papas, bebidas y extras
- `/api/menu` — carta pública (D1 o fallback `data/menu.json`)
- Auth con `ADMIN_PASSWORD` (token 12 h)

## Setup en Cloudflare (una vez)

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Crea la base D1:
   ```bash
   npm run db:create
   ```
   Copia el `database_id` en `wrangler.toml`.

3. Migra y siembra datos:
   ```bash
   npm run db:migrate:remote
   npm run db:seed:remote
   ```

4. En **Cloudflare Dashboard → Pages → tu proyecto → Settings**:
   - **Environment variables**: `ADMIN_PASSWORD` = tu clave secreta
   - **D1 bindings**: binding name `DB` → database `suricano-db`
   - (Si usas `wrangler.toml` en despliegue, el binding ya viene definido)

5. Publica el sitio (git push / Pages deploy).

6. Entra a `https://TU-DOMINIO/admin` con tu clave.

## Local
```bash
npm run db:migrate:local
npm run db:seed:local
# luego define ADMIN_PASSWORD en .dev.vars
echo ADMIN_PASSWORD=mi-clave > .dev.vars
npm run dev
```

## Notas
- Las imágenes siguen en `img_carta/...` (solo editas la ruta/URL).
- Si D1 no está lista, la web pública usa `data/menu.json` o el fallback de `main.js`.
- Opcional: protege `/admin` además con Cloudflare Access (gratis).
