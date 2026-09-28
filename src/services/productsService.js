import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import localProducts from '../data/products.json'

const STORAGE_BUCKET = 'products'

// Columnas que necesita la tienda (pedir solo lo necesario hace la respuesta más liviana)
const PUBLIC_COLUMNS = 'id, name, description, price, category, images, is_featured, is_new, collections, position, stock_mode, stock, low_stock_threshold'
// El panel además necesita saber si el producto está visible
const ADMIN_COLUMNS = `${PUBLIC_COLUMNS}, is_visible`

// Nombres en el frontend (camelCase) → columnas de la base (snake_case)
const COLUMN_BY_FIELD = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  category: 'category',
  images: 'images',
  isFeatured: 'is_featured',
  isNew: 'is_new',
  collections: 'collections',
  stockMode: 'stock_mode',
  stock: 'stock',
  lowStockThreshold: 'low_stock_threshold',
  isVisible: 'is_visible',
  position: 'position',
}

// La base usa snake_case (is_featured) y el frontend camelCase (isFeatured).
// fromRow y toRow son los ÚNICOS lugares que traducen de un formato al otro.
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
    collections: row.collections ?? [], // ids de colecciones (siempre un array, aunque esté vacío)
    stockMode: row.stock_mode ?? 'none',
    stock: row.stock ?? 0,
    lowStockThreshold: row.low_stock_threshold ?? 2,
    isVisible: row.is_visible ?? true,
    position: row.position,
  }
}

// Convierte cambios parciales del frontend ({ isNew: true }) a columnas ({ is_new: true })
export function toRow(changes) {
  const row = {}
  for (const [field, value] of Object.entries(changes)) {
    const column = COLUMN_BY_FIELD[field]
    if (!column) throw new Error(`Campo desconocido: ${field}`)
    row[column] = value
  }
  return row
}

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase no está configurado')
}

// ---------------------------------------------------------------------------
// Tienda pública
// ---------------------------------------------------------------------------

// - Sin claves de Supabase → products.json (útil en desarrollo).
// - Con claves → Supabase. Si falla, se lanza el error para que la tienda muestre
//   "reintentar" en lugar de productos viejos o que ya se ocultaron.
export async function fetchCatalog() {
  if (!isSupabaseConfigured) {
    // products.json no tiene colecciones en todos ni datos de stock: completamos los valores por defecto
    const products = localProducts.map((p) => ({
      stockMode: 'none',
      stock: 0,
      lowStockThreshold: 2,
      ...p,
      collections: p.collections ?? [],
    }))
    return { products, source: 'local' }
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

// ---------------------------------------------------------------------------
// Panel de administración (las políticas RLS exigen sesión de administradora)
// ---------------------------------------------------------------------------

// Todos los productos, visibles y ocultos, en el orden del catálogo
export async function fetchAdminProducts() {
  requireSupabase()
  const { data, error } = await supabase
    .from('products')
    .select(ADMIN_COLUMNS)
    .order('position', { ascending: true })

  if (error) throw error
  return data.map(fromRow)
}

// Actualiza solo los campos recibidos y devuelve el producto como quedó en la base
export async function updateProduct(id, changes) {
  requireSupabase()
  const { data, error } = await supabase
    .from('products')
    .update(toRow(changes))
    .eq('id', id)
    .select(ADMIN_COLUMNS)
    // .single() da error si no se actualizó ninguna fila (por ejemplo, sin permisos)
    .single()

  if (error) throw error
  return fromRow(data)
}

// Un producto por id (incluye ocultos). Devuelve null si no existe.
export async function fetchAdminProduct(id) {
  requireSupabase()
  const { data, error } = await supabase.from('products').select(ADMIN_COLUMNS).eq('id', id).maybeSingle()

  if (error) throw error
  return data ? fromRow(data) : null
}

// Crea un producto al final del catálogo (después se puede reordenar con drag & drop)
export async function createProduct(product) {
  requireSupabase()
  const { data: last, error: positionError } = await supabase
    .from('products')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (positionError) throw positionError

  const { data, error } = await supabase
    .from('products')
    .insert(toRow({ ...product, position: (last?.position ?? 0) + 1 }))
    .select(ADMIN_COLUMNS)
    .single()

  if (error) throw error
  return fromRow(data)
}

// Guarda el orden completo del catálogo en UNA sola operación (función reorder_products
// de schema.sql): o se guardan todas las posiciones, o ninguna.
export async function reorderProducts(ids) {
  requireSupabase()
  const { error } = await supabase.rpc('reorder_products', { product_ids: ids })
  if (error) throw error
}

// Suma o resta unidades en una sola operación (función adjust_stock de schema.sql).
// Devuelve el stock nuevo; nunca baja de 0.
export async function adjustStock(id, delta) {
  requireSupabase()
  const { data, error } = await supabase.rpc('adjust_stock', { product_id: id, delta })
  if (error) throw error
  return data
}

// ---------------------------------------------------------------------------
// Fotos (Storage)
// ---------------------------------------------------------------------------

// Sube una foto ya comprimida y devuelve su URL pública.
// El nombre es aleatorio (no depende del id del producto, que todavía puede cambiar).
// folder: subcarpeta opcional dentro del bucket (ej: 'hero' para el carrusel del inicio)
export async function uploadProductImage(blob, folder = '') {
  requireSupabase()
  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${folder ? `${folder}/` : ''}${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: '31536000', // el nombre nunca se reutiliza: el navegador puede guardarla 1 año
    upsert: false,
  })
  if (error) throw error

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

// Si la foto está en nuestro bucket, devuelve su ruta dentro del bucket; si no, null.
// Ej: https://x.supabase.co/storage/v1/object/public/products/abc.webp → "abc.webp"
export function getStoragePath(imageUrl) {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`
  const index = imageUrl.indexOf(marker)
  return index === -1 ? null : decodeURIComponent(imageUrl.slice(index + marker.length))
}

// Borra del Storage las fotos de la lista que sean nuestras (ignora las de public/products/).
// Si falla, solo lo avisa en consola: el producto ya quedó guardado o borrado.
export async function removeStorageImages(imageUrls) {
  const paths = imageUrls.map(getStoragePath).filter(Boolean)
  if (paths.length === 0) return

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths)
  if (error) console.warn('No se pudieron borrar algunas fotos del Storage:', error)
}

// Borra el producto y sus fotos del Storage
export async function deleteProduct(product) {
  requireSupabase()
  const { data, error } = await supabase.from('products').delete().eq('id', product.id).select('id')

  if (error) throw error
  if (data.length === 0) throw new Error('No se eliminó ningún producto (¿sin permisos?)')

  await removeStorageImages(product.images)
}
