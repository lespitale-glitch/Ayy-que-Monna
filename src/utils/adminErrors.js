// Traduce errores de Supabase/PostgreSQL a mensajes claros para el panel.
export function getAdminErrorMessage(error) {
  const text = `${error?.message ?? ''} ${error?.details ?? ''}`
  // 23514 = una regla (CHECK) de la tabla rechazó el cambio
  if (error?.code === '23514' && text.includes('products_visible_needs_image')) {
    return 'Un producto visible necesita al menos una foto.'
  }
  if (error?.code === '23514') return 'Algún dato no es válido (revisa precio, categoría o colección).'
  if (error?.code === '42501' || error?.code === 'PGRST116' || /permis/i.test(text)) {
    return 'No tienes permisos para este cambio. Vuelve a iniciar sesión.'
  }
  if (/failed to fetch|network/i.test(text)) return 'Sin conexión con el servidor. Revisa tu internet.'
  return 'No se pudo guardar el cambio. Intenta de nuevo.'
}
