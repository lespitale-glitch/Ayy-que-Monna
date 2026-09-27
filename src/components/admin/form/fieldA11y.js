// aria-invalid marca el campo con error; aria-describedby conecta el campo con
// el texto de ayuda o de error, así el lector de pantalla lo lee al enfocarlo.
export function fieldA11y(id, { error, hint } = {}) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  }
}

export const inputClass =
  'block w-full border bg-white px-4 text-sm outline-none transition-colors duration-300 ease-soft focus:border-ink aria-[invalid=true]:border-ink aria-[invalid=true]:border-2 border-line'
