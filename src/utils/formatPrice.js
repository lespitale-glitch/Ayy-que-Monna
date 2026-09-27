// Intl.NumberFormat es una herramienta nativa de JavaScript para dar formato
// a números según el país. Lo creamos una sola vez (fuera de la función)
// porque crearlo en cada llamada es más lento.
const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

// formatPrice(6500) → "$ 6.500"
export function formatPrice(value) {
  return arsFormatter.format(value)
}
