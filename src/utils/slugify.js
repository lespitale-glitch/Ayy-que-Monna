// "Collar Acuático Dorado" → "collar-acuatico-dorado"
// Mismo formato que exige la base de datos: minúsculas, números y guiones simples.
export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // todo lo que no sea letra o número → guion
    .replace(/^-+|-+$/g, '') // sin guiones al principio ni al final
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
