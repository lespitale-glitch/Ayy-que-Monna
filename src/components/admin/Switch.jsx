// Interruptor accesible: un <button> con role="switch" y aria-checked,
// así los lectores de pantalla anuncian "activado / desactivado".
// Si showLabel es false, la etiqueta solo la leen los lectores de pantalla (útil en la tabla).
function Switch({ checked, onChange, label, disabled = false, showLabel = true }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={showLabel ? undefined : label}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className="group inline-flex items-center gap-2 disabled:cursor-wait disabled:opacity-50"
    >
      <span
        aria-hidden="true"
        className={`relative inline-block h-5 w-9 border transition-colors duration-300 ease-soft ${
          checked ? 'border-ink bg-ink' : 'border-stone bg-white'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 transition-all duration-300 ease-soft ${
            checked ? 'left-[18px] bg-bone' : 'left-0.5 bg-stone'
          }`}
        />
      </span>
      {showLabel && <span className="text-xs uppercase tracking-widest">{label}</span>}
    </button>
  )
}

export default Switch
