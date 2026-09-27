import { createClient } from '@supabase/supabase-js'

// Vite expone las variables que empiezan con VITE_ en import.meta.env.
// Se leen de .env.local (desarrollo) o de las variables del hosting (Vercel).
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

// Si faltan las claves, exportamos null y la tienda usa products.json (ver productsService).
export const supabase = isSupabaseConfigured ? createClient(url, key) : null
