// Botón tipo "píldora" que se puede activar o desactivar (aria-pressed lo anuncia)
function FilterChip({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors duration-300 ease-soft ${
        pressed ? 'border-transparent bg-brand-deep text-on-brand' : 'border-line bg-white hover:border-fucsia'
      }`}
    >
      {children}
    </button>
  )
}

export default FilterChip
