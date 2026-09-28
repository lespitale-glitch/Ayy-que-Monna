import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { removeStorageImages, uploadProductImage } from './productsService.js'
import localSlides from '../data/heroSlides.json'

const COLUMNS = 'id, image, image_small, alt, eyebrow, title, highlight, cta_label, cta_link, is_visible, position'

// snake_case (base) ↔ camelCase (frontend): la traducción vive solo en los servicios
export function fromHeroRow(row) {
  return {
    id: row.id,
    image: row.image,
    imageSmall: row.image_small ?? null,
    alt: row.alt ?? '',
    eyebrow: row.eyebrow ?? '',
    title: row.title,
    highlight: row.highlight ?? '',
    ctaLabel: row.cta_label,
    ctaLink: row.cta_link,
    isVisible: row.is_visible ?? true,
    position: row.position ?? 0,
  }
}

const COLUMN_BY_FIELD = {
  image: 'image',
  imageSmall: 'image_small',
  alt: 'alt',
  eyebrow: 'eyebrow',
  title: 'title',
  highlight: 'highlight',
  ctaLabel: 'cta_label',
  ctaLink: 'cta_link',
  isVisible: 'is_visible',
  position: 'position',
}

export function toHeroRow(changes) {
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

// Tienda: diapositivas visibles en orden. Sin Supabase → heroSlides.json (modo local).
export async function fetchHeroSlides() {
  if (!isSupabaseConfigured) return localSlides.map((s, i) => ({ ...s, isVisible: true, position: i + 1 }))
  const { data, error } = await supabase
    .from('hero_slides')
    .select(COLUMNS)
    .eq('is_visible', true) // con sesión de admin, RLS dejaría ver también las ocultas
    .order('position', { ascending: true })
  if (error) throw error
  return data.map(fromHeroRow)
}

// ---------------------------------------------------------------------------
// Panel (las políticas RLS exigen sesión de administradora)
// ---------------------------------------------------------------------------

export async function fetchAdminHeroSlides() {
  requireSupabase()
  const { data, error } = await supabase.from('hero_slides').select(COLUMNS).order('position', { ascending: true })
  if (error) throw error
  return data.map(fromHeroRow)
}

// Sube la foto grande y la chica a la carpeta "hero" del bucket y devuelve sus URLs
export async function uploadHeroImages({ large, small }) {
  const image = await uploadProductImage(large, 'hero')
  try {
    const imageSmall = await uploadProductImage(small, 'hero')
    return { image, imageSmall }
  } catch (error) {
    await removeStorageImages([image]) // no dejar una foto suelta si la segunda falla
    throw error
  }
}

// Borra del Storage las fotos que ya no se usan (las de /hero/ en public no se tocan)
export const removeHeroImages = (slide) => removeStorageImages([slide.image, slide.imageSmall].filter(Boolean))

export async function createHeroSlide(slide) {
  requireSupabase()
  const { data: last, error: positionError } = await supabase
    .from('hero_slides')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (positionError) throw positionError

  const { data, error } = await supabase
    .from('hero_slides')
    .insert(toHeroRow({ ...slide, position: (last?.position ?? 0) + 1 }))
    .select(COLUMNS)
    .single()
  if (error) throw error
  return fromHeroRow(data)
}

export async function updateHeroSlide(id, changes) {
  requireSupabase()
  const { data, error } = await supabase.from('hero_slides').update(toHeroRow(changes)).eq('id', id).select(COLUMNS).single()
  if (error) throw error
  return fromHeroRow(data)
}

// Borra la diapositiva y sus fotos del Storage
export async function deleteHeroSlide(slide) {
  requireSupabase()
  const { data, error } = await supabase.from('hero_slides').delete().eq('id', slide.id).select('id')
  if (error) throw error
  if (data.length === 0) throw new Error('No se eliminó la diapositiva (¿sin permisos?)')
  await removeHeroImages(slide)
}

export async function reorderHeroSlides(ids) {
  requireSupabase()
  const { error } = await supabase.rpc('reorder_hero_slides', { slide_ids: ids })
  if (error) throw error
}
