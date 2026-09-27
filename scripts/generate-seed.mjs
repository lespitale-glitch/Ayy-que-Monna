// Genera supabase/seed.sql a partir de src/data/products.json.
// Uso: npm run db:seed
//
// El seed usa "on conflict do nothing": si un producto ya existe en la base
// (por ejemplo, porque se editó desde el panel), NO se sobrescribe.
import { readFileSync, writeFileSync } from 'node:fs'

const products = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url), 'utf8'))

// En SQL las comillas simples se escapan duplicándolas: 'Pulsera D''Ana'
const text = (value) => `'${String(value).replaceAll("'", "''")}'`
const textArray = (values) => `array[${values.map(text).join(', ')}]::text[]`
const nullable = (value) => (value == null ? 'null' : text(value))

const rows = products.map((p, index) =>
  [
    text(p.id),
    text(p.name),
    text(p.description ?? ''),
    Number(p.price),
    text(p.category),
    textArray(p.images),
    p.isFeatured,
    p.isNew,
    nullable(p.collection),
    true, // is_visible
    index + 1, // position: se respeta el orden actual del catálogo
  ].join(', '),
)

const sql = `-- =============================================================================
-- Ayy Que Monna — Carga inicial de productos
-- =============================================================================
-- ARCHIVO GENERADO por scripts/generate-seed.mjs a partir de src/data/products.json.
-- No editar a mano: modificar el JSON y ejecutar "npm run db:seed".
--
-- Cómo usarlo: Supabase → SQL Editor → pegar este archivo → Run
-- (DESPUÉS de haber ejecutado schema.sql).
-- Es seguro ejecutarlo de nuevo: los productos que ya existen no se modifican.
-- Productos: ${products.length}
-- =============================================================================

insert into public.products
  (id, name, description, price, category, images, is_featured, is_new, collection, is_visible, position)
values
${rows.map((row) => `  (${row})`).join(',\n')}
on conflict (id) do nothing;
`

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log(`supabase/seed.sql generado con ${products.length} productos`)
