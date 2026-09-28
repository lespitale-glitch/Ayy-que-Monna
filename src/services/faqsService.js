import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import localFaqs from '../data/faqs.json'

const COLUMNS = 'id, question, answer, keywords, is_visible, position'

// snake_case (base) ↔ camelCase (frontend): la traducción vive solo en los servicios
export function fromFaqRow(row) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    keywords: row.keywords ?? [],
    isVisible: row.is_visible ?? true,
    position: row.position ?? 0,
  }
}

const COLUMN_BY_FIELD = { question: 'question', answer: 'answer', keywords: 'keywords', isVisible: 'is_visible', position: 'position' }

export function toFaqRow(changes) {
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

// Tienda (bot y /preguntas-frecuentes): solo las visibles. Sin Supabase → faqs.json.
export async function fetchFaqs() {
  if (!isSupabaseConfigured) return localFaqs.map((f, i) => fromFaqRow({ ...f, position: i + 1 }))
  const { data, error } = await supabase
    .from('faqs')
    .select(COLUMNS)
    .eq('is_visible', true) // con sesión de admin, RLS dejaría ver también las ocultas
    .order('position', { ascending: true })
  if (error) throw error
  return data.map(fromFaqRow)
}

// Guarda de forma anónima una pregunta que el bot no supo responder.
// Solo se envía el texto (la base completa la fecha). Sin Supabase no hace nada.
export async function logUnansweredQuestion(question) {
  if (!isSupabaseConfigured) return
  // Sin .select(): el visitante puede agregar filas, pero no leerlas
  const { error } = await supabase.from('bot_questions').insert({ question })
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Panel (las políticas RLS exigen sesión de administradora)
// ---------------------------------------------------------------------------

export async function fetchAdminFaqs() {
  requireSupabase()
  const { data, error } = await supabase.from('faqs').select(COLUMNS).order('position', { ascending: true })
  if (error) throw error
  return data.map(fromFaqRow)
}

export async function createFaq(faq) {
  requireSupabase()
  const { data: last, error: positionError } = await supabase
    .from('faqs')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (positionError) throw positionError

  const { data, error } = await supabase
    .from('faqs')
    .insert(toFaqRow({ ...faq, position: (last?.position ?? 0) + 1 }))
    .select(COLUMNS)
    .single()
  if (error) throw error
  return fromFaqRow(data)
}

export async function updateFaq(id, changes) {
  requireSupabase()
  const { data, error } = await supabase.from('faqs').update(toFaqRow(changes)).eq('id', id).select(COLUMNS).single()
  if (error) throw error
  return fromFaqRow(data)
}

export async function deleteFaq(id) {
  requireSupabase()
  const { data, error } = await supabase.from('faqs').delete().eq('id', id).select('id')
  if (error) throw error
  if (data.length === 0) throw new Error('No se eliminó ninguna pregunta (¿sin permisos?)')
}

export async function reorderFaqs(ids) {
  requireSupabase()
  const { error } = await supabase.rpc('reorder_faqs', { faq_ids: ids })
  if (error) throw error
}

// --- Preguntas sin respuesta ---

const fromQuestionRow = (row) => ({
  id: row.id,
  question: row.question,
  timesAsked: row.times_asked,
  isResolved: row.is_resolved,
  lastAsked: row.last_asked,
})

export async function fetchBotQuestions() {
  requireSupabase()
  const { data, error } = await supabase
    .from('bot_questions')
    .select('id, question, times_asked, is_resolved, last_asked')
    .order('last_asked', { ascending: false })
    .limit(200)
  if (error) throw error
  return data.map(fromQuestionRow)
}

export async function setBotQuestionResolved(id, isResolved) {
  requireSupabase()
  const { data, error } = await supabase
    .from('bot_questions')
    .update({ is_resolved: isResolved })
    .eq('id', id)
    .select('id, question, times_asked, is_resolved, last_asked')
    .single()
  if (error) throw error
  return fromQuestionRow(data)
}

export async function deleteBotQuestion(id) {
  requireSupabase()
  const { data, error } = await supabase.from('bot_questions').delete().eq('id', id).select('id')
  if (error) throw error
  if (data.length === 0) throw new Error('No se eliminó la pregunta (¿sin permisos?)')
}
