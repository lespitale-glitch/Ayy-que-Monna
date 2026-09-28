// Traduce errores de Supabase/PostgreSQL a mensajes claros para el panel.
export function getAdminErrorMessage(error) {
  const text = `${error?.message ?? ''} ${error?.details ?? ''}`
  // 23514 = una regla (CHECK) de la tabla rechazó el cambio
  if (error?.code === '23514' && text.includes('products_visible_needs_image')) {
    return 'Un producto visible necesita al menos una foto.'
  }
  // 23505 = ya existe una fila con esa clave (id repetido)
  if (error?.code === '23505' && text.includes('collections')) return 'Ya existe una colección con ese id. Elige otro.'
  // 23503 = el producto apunta a una colección que ya no existe (trigger de schema.sql)
  if (error?.code === '23503') return 'Alguna colección elegida ya no existe. Recarga la página.'
  if (error?.code === '23514' && text.includes('collections_reserved_id')) {
    return 'Ese id ya lo usa una selección automática de la tienda. Elige otro.'
  }
  if (error?.code === '23505') return 'Ya existe un producto con ese id. Elige otro.'
  if (error?.statusCode === '413' || /payload too large|maximum allowed size/i.test(text)) {
    return 'La foto supera el tamaño máximo permitido (5 MB).'
  }
  if (/mime type/i.test(text)) return 'Formato de foto no permitido (usa JPG, PNG o WebP).'
  // Las reglas de store_settings se llaman store_settings_<columna>_check
  if (error?.code === '23514' && text.includes('store_settings')) {
    return 'Algún ajuste no es válido. Revisa el número de WhatsApp y el usuario de Instagram.'
  }
  if (error?.code === '23514' && text.includes('faqs')) {
    return 'Revisa la pregunta (3 a 200 caracteres), la respuesta (hasta 1000) y las palabras clave (hasta 30).'
  }
  if (error?.code === '23514' && text.includes('hero_slides')) {
    return 'Revisa los textos (título hasta 60 caracteres) y a dónde lleva el botón.'
  }
  if (error?.code === '23514') return 'Algún dato no es válido (revisa precio, categoría o colección).'
  if (error?.code === '42501' || error?.code === 'PGRST116' || /permis/i.test(text)) {
    return 'No tienes permisos para este cambio. Vuelve a iniciar sesión.'
  }
  if (/failed to fetch|network/i.test(text)) return 'Sin conexión con el servidor. Revisa tu internet.'
  return 'No se pudo guardar el cambio. Intenta de nuevo.'
}
