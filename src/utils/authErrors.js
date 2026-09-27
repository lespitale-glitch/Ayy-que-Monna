// Traduce los errores de Supabase Auth a mensajes claros en español.
export const NOT_ADMIN = 'not_admin'

export function getAuthErrorMessage(error) {
  if (error?.code === NOT_ADMIN) return 'Esta cuenta no tiene acceso al panel.'
  if (error?.code === 'invalid_credentials' || /invalid login credentials/i.test(error?.message ?? '')) {
    return 'Email o contraseña incorrectos.'
  }
  if (error?.code === 'email_not_confirmed') return 'El email todavía no fue confirmado en Supabase.'
  if (error?.status === 429) return 'Demasiados intentos. Espera unos minutos y vuelve a probar.'
  if (error?.name === 'AuthRetryableFetchError' || error?.status === 0) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión.'
  }
  return 'No se pudo iniciar sesión. Intenta de nuevo.'
}
