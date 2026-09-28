import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { DEFAULT_SETTINGS } from '../config.js'

const COLUMNS = 'whatsapp_number, instagram_handle, shipping_enabled, shipping_note, shipping_from, pickup_points, bot_enabled, show_low_stock'

// snake_case (base) ↔ camelCase (frontend): la traducción vive solo en los servicios
export function fromSettingsRow(row) {
  return {
    whatsappNumber: row.whatsapp_number,
    instagramHandle: row.instagram_handle ?? '',
    shippingEnabled: row.shipping_enabled,
    shippingNote: row.shipping_note ?? '',
    shippingFrom: row.shipping_from ?? null,
    pickupPoints: row.pickup_points ?? [],
    botEnabled: row.bot_enabled ?? true,
    showLowStock: row.show_low_stock ?? true,
  }
}

export function toSettingsRow(settings) {
  return {
    whatsapp_number: settings.whatsappNumber,
    instagram_handle: settings.instagramHandle,
    shipping_enabled: settings.shippingEnabled,
    shipping_note: settings.shippingNote,
    shipping_from: settings.shippingFrom,
    pickup_points: settings.pickupPoints,
    bot_enabled: settings.botEnabled,
    show_low_stock: settings.showLowStock,
  }
}

// Sin Supabase → los ajustes por defecto de config.js (modo local)
export async function fetchSettings() {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS

  // maybeSingle: devuelve null (en vez de error) si la fila todavía no existe
  const { data, error } = await supabase.from('store_settings').select(COLUMNS).eq('id', 1).maybeSingle()
  if (error) throw error
  return data ? fromSettingsRow(data) : DEFAULT_SETTINGS
}

// Solo la administradora puede actualizar (política RLS "Admin: editar ajustes")
export async function updateSettings(settings) {
  if (!isSupabaseConfigured) throw new Error('Supabase no está configurado')

  const { data, error } = await supabase
    .from('store_settings')
    .update(toSettingsRow(settings))
    .eq('id', 1)
    .select(COLUMNS)
    // Si RLS bloquea el cambio no hay error, pero vuelven 0 filas: .single() lo convierte en error
    .single()
  if (error) throw error
  return fromSettingsRow(data)
}
