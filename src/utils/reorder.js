// Funciones puras para reordenar el catálogo (no dependen de React ni de Supabase).

// Devuelve un array NUEVO con el elemento de la posición "from" movido a "to".
// Si alguna posición no existe, devuelve el mismo array sin cambios.
export function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1) // lo sacamos de su lugar…
  next.splice(to, 0, item) // …y lo insertamos en el nuevo
  return next
}

// Lista de ids en el orden actual (es lo que recibe reorder_products en Supabase)
export const getIds = (products) => products.map((product) => product.id)

// ¿El orden actual es distinto del guardado?
export function hasOrderChanged(savedIds, currentIds) {
  return savedIds.length !== currentIds.length || savedIds.some((id, i) => id !== currentIds[i])
}

// Reordena los productos siguiendo una lista de ids (para "Descartar cambios")
export function sortByIds(products, ids) {
  const position = new Map(ids.map((id, i) => [id, i]))
  return [...products].sort((a, b) => (position.get(a.id) ?? Infinity) - (position.get(b.id) ?? Infinity))
}
