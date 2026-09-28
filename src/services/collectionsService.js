import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import localCollections from '../data/collections.json'

const COLUMNS = 'id, name, description, theme, show_on_home, is_visible, position'

// snake_case (base) ↔ camelCase (frontend): la traducción vive solo en los servicios
export function fromCollectionRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    theme: row.theme ?? 'brand',
    showOnHome: row.show_on_home ?? true,
    isVisible: row.is_visible ?? true,
    position: row.position ?? 0,
  }
}

const COLUMN_BY_FIELD = {
  id: 'id',
  name: 'name',
  description: 'description',
  theme: 'theme',
  showOnHome: 'show_on_home',
  isVisible: 'is_visible',
  position: 'position',
}

export function toCollectionRow(changes) {
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

// Tienda: colecciones visibles en orden. Sin Supabase → collections.json (modo local).
export async function fetchCollections() {
  if (!isSupabaseConfigured) {
    return localCollections.map((c, index) => fromCollectionRow({ ...toCollectionRow(c), position: index + 1 }))
  }
  const { data, error } = await supabase
    .from('collections')
    .select(COLUMNS)
    .eq('is_visible', true) // con sesión de admin, RLS dejaría ver también las ocultas
    .order('position', { ascending: true })
  if (error) throw error
  return data.map(fromCollectionRow)
}

// ---------------------------------------------------------------------------
// Panel (las políticas RLS exigen sesión de administradora)
// ---------------------------------------------------------------------------

export async function fetchAdminCollections() {
  requireSupabase()
  const { data, error } = await supabase.from('collections').select(COLUMNS).order('position', { ascending: true })
  if (error) throw error
  return data.map(fromCollectionRow)
}

// Nueva colección al final de la lista
export async function createCollection(collection) {
  requireSupabase()
  const { data: last, error: positionError } = await supabase
    .from('collections')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (positionError) throw positionError

  const { data, error } = await supabase
    .from('collections')
    .insert(toCollectionRow({ ...collection, position: (last?.position ?? 0) + 1 }))
    .select(COLUMNS)
    .single()
  if (error) throw error
  return fromCollectionRow(data)
}

export async function updateCollection(id, changes) {
  requireSupabase()
  const { data, error } = await supabase
    .from('collections')
    .update(toCollectionRow(changes))
    .eq('id', id)
    .select(COLUMNS)
    .single() // error si no se actualizó ninguna fila (por ejemplo, sin permisos)
  if (error) throw error
  return fromCollectionRow(data)
}

// La base la quita sola de los productos que la tenían (trigger en schema.sql)
export async function deleteCollection(id) {
  requireSupabase()
  const { data, error } = await supabase.from('collections').delete().eq('id', id).select('id')
  if (error) throw error
  if (data.length === 0) throw new Error('No se eliminó ninguna colección (¿sin permisos?)')
}

// Orden completo en una sola operación (función reorder_collections)
export async function reorderCollections(ids) {
  requireSupabase()
  const { error } = await supabase.rpc('reorder_collections', { collection_ids: ids })
  if (error) throw error
}

// Define qué productos tiene la colección (función set_collection_products): atómico
export async function setCollectionProducts(collectionId, productIds) {
  requireSupabase()
  const { error } = await supabase.rpc('set_collection_products', {
    collection_id: collectionId,
    product_ids: productIds,
  })
  if (error) throw error
}
