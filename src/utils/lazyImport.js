// Cargar partes del código "a demanda" (import()) sin romperse después de un deploy.
//
// Cada deploy cambia los nombres de los archivos (ej: AdminFaqs-Djs_6QQB.js) y borra los viejos.
// Si alguien tenía la tienda abierta desde antes, su pestaña pide un archivo que ya no existe.
// Solución: recargar la página UNA vez para traer la versión nueva.

const KEY = 'ayyquemonna_chunk_reload'
const WINDOW_MS = 10000 // si ya recargamos hace menos de 10 s, no insistimos (evita recargar sin fin)

// ¿Es el error de "no se encontró una parte del código"? (cada navegador lo escribe distinto)
export const isChunkLoadError = (error) =>
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(
    error?.message ?? '',
  )

function reloadedRecently() {
  try {
    return Date.now() - Number(sessionStorage.getItem(KEY) ?? 0) < WINDOW_MS
  } catch {
    return true // sin sessionStorage no podemos evitar el bucle: mejor no recargar
  }
}

export async function importWithReload(importer) {
  try {
    return await importer()
  } catch (error) {
    if (isChunkLoadError(error) && !reloadedRecently()) {
      try {
        sessionStorage.setItem(KEY, String(Date.now()))
      } catch {
        // no se pudo guardar: igual recargamos una vez
      }
      window.location.reload()
      return new Promise(() => {}) // queda "cargando" mientras la página se recarga
    }
    throw error // si igual falla, lo muestra RouteError
  }
}
