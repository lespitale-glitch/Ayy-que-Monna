// "ANILLO OLA" → "Anillo Ola". Los nombres están en mayúsculas para el diseño,
// pero en los textos alternativos (alt) conviene escribirlos normal: algunos
// lectores de pantalla deletrean las palabras en mayúsculas como si fueran siglas.
export function toTitleCase(text) {
  return text.toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())
}
