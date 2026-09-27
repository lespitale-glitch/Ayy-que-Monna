// "ANILLO OLA" → "Anillo Ola". Los nombres están en mayúsculas para el diseño,
// pero en los textos alternativos (alt) conviene escribirlos normal: algunos
// lectores de pantalla deletrean las palabras en mayúsculas como si fueran siglas.
export function toTitleCase(text) {
  return text.toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())
}

// Quita acentos y pasa a minúsculas: "Acuático" y "acuatico" coinciden al buscar
export function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
