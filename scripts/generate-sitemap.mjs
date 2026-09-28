// Genera dist/sitemap.xml (y suma la línea "Sitemap:" a dist/robots.txt) después de cada build.
// Uso: se ejecuta solo con "npm run build" (script "postbuild").
//
// Necesita la variable SITE_URL con el dominio real (ej: https://ayyquemonna.com.ar).
// En Vercel: Settings → Environment Variables. Sin SITE_URL no genera nada: un sitemap
// con un dominio equivocado le daría a Google direcciones que no existen.
//
// Productos y colecciones: si están las claves de Supabase, los lee de ahí (solo los visibles);
// si no, usa los JSON de src/data.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'

const SITE_URL = process.env.SITE_URL?.replace(/\/+$/, '')
const DIST = new URL('../dist/', import.meta.url)
const CATEGORIES = ['aros', 'collares', 'anillos', 'pulseras']
const AUTO_SELECTIONS = ['novedades', 'destacados', 'dorados', 'plateados']

const readJson = (file) => JSON.parse(readFileSync(new URL(`../src/data/${file}`, import.meta.url), 'utf8'))

// Lee una tabla de Supabase con la clave pública (las políticas RLS solo devuelven lo visible)
async function fromSupabase(table) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const response = await fetch(`${url}/rest/v1/${table}?select=id&is_visible=eq.true`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  if (!response.ok) throw new Error(`${table}: HTTP ${response.status}`)
  return (await response.json()).map((row) => row.id)
}

async function loadIds() {
  try {
    const [products, collections] = await Promise.all([fromSupabase('products'), fromSupabase('collections')])
    if (products && collections) return { products, collections, source: 'Supabase' }
  } catch (error) {
    console.warn(`sitemap: no se pudo leer Supabase (${error.message}); uso los JSON locales`)
  }
  return { products: readJson('products.json').map((p) => p.id), collections: readJson('collections.json').map((c) => c.id), source: 'JSON' }
}

if (!SITE_URL) {
  console.log('sitemap: falta SITE_URL, no se genera (ver scripts/generate-sitemap.mjs)')
} else if (!existsSync(DIST)) {
  console.log('sitemap: no existe dist/, primero hay que ejecutar vite build')
} else {
  const { products, collections, source } = await loadIds()
  const paths = [
    '/',
    '/tienda',
    '/preguntas-frecuentes',
    ...CATEGORIES.map((c) => `/tienda/${c}`),
    ...[...collections, ...AUTO_SELECTIONS].map((s) => `/seleccion/${s}`),
    ...products.map((id) => `/producto/${id}`),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}
</urlset>
`
  writeFileSync(new URL('sitemap.xml', DIST), xml)
  appendFileSync(new URL('robots.txt', DIST), `\nSitemap: ${SITE_URL}/sitemap.xml\n`)
  console.log(`sitemap: ${paths.length} direcciones (${source}) → dist/sitemap.xml`)
}
