import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import localProducts from '../data/products.json'

// Columnas que necesita la tienda (pedir solo lo necesario hace la respuesta más liviana)
const PUBLIC_COLUMNS = 'id, name, description, price, category, images, is_featured, is_new, collection, position'

// La base usa snake_case (is_featured) y el frontend camelCase (isFeatured).
// Esta es la ÚNICA función que traduce de un formato al otro.
export function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: row.price,
    category: row.category,
    images: row.images ?? [],
    isFeatured: row.is_featured,
    isNew: row.is_new,
    // Solo agregamos "collection" si tiene valor, igual que en products.json
    ...(row.collection ? { collection: row.collection } : {}),
  }
}

// Carga el catálogo público.
// - Sin claves de Supabase → products.json (útil en desarrollo).
// - Con claves → Supabase. Si falla, se lanza el error para que la tienda muestre
//   "reintentar" en lugar de productos viejos o que ya se ocultaron.
export async function fetchCatalog() {
  if (!isSupabaseConfigured) {
    return { products: localProducts, source: 'local' }
  }

  const { data, error } = await supabase
    .from('products')
    .select(PUBLIC_COLUMNS)
    // RLS ya filtra los ocultos para visitantes, pero si la administradora tiene
    // la sesión abierta en este navegador vería todo: por eso filtramos también aquí.
    .eq('is_visible', true)
    .order('position', { ascending: true })

  if (error) throw error
  return { products: data.map(fromRow), source: 'supabase' }
}
