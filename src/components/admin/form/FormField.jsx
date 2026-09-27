// Envuelve un campo con su etiqueta, ayuda y mensaje de error.
// El campo (children) recibe sus props de accesibilidad con fieldA11y().
function FormField({ id, label, hint, error, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs uppercase tracking-widest">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-ink">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
