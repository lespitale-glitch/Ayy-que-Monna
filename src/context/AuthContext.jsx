import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { NOT_ADMIN } from '../utils/authErrors.js'

// Sesión de la administradora. Solo envuelve las rutas /admin (la tienda no lo necesita).
export function AuthProvider({ children }) {
  // undefined = todavía no sabemos si hay sesión; null = no hay sesión.
  // Sin Supabase configurado no puede haber sesión, así que arrancamos en null.
  const [session, setSession] = useState(isSupabaseConfigured ? undefined : null)
  // Resultado de is_admin() para un usuario concreto
  const [adminCheck, setAdminCheck] = useState({ userId: null, isAdmin: false })

  // 1. Leer la sesión guardada y escuchar cambios (login, logout, token renovado)
  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    // Al desmontar dejamos de escuchar
    return () => data.subscription.unsubscribe()
  }, [])

  // 2. Cada vez que cambia el usuario, preguntamos a la base si es administradora.
  //    La decisión real la toman las políticas RLS; esto solo sirve para la interfaz.
  const userId = session?.user?.id ?? null
  useEffect(() => {
    if (!userId) return
    let ignore = false
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (!ignore) setAdminCheck({ userId, isAdmin: !error && data === true })
    })
    return () => {
      ignore = true
    }
  }, [userId])

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Una cuenta válida pero que no está en la tabla admins no debe quedar logueada
    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin')
    if (rpcError || !isAdmin) {
      await supabase.auth.signOut()
      throw Object.assign(new Error('La cuenta no es administradora'), { code: NOT_ADMIN })
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  // Valores "derivados": se calculan en cada render a partir del estado
  const checkedCurrentUser = adminCheck.userId === userId
  const isLoading = session === undefined || (userId !== null && !checkedCurrentUser)
  const isAdmin = userId !== null && checkedCurrentUser && adminCheck.isAdmin

  const value = useMemo(
    () => ({
      isConfigured: isSupabaseConfigured,
      isLoading,
      isAdmin,
      user: session?.user ?? null,
      signIn,
      signOut,
    }),
    [isLoading, isAdmin, session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
