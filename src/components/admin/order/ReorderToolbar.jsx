// Barra fija con el estado del orden y los botones Guardar / Descartar
function ReorderToolbar({ isDirty, isSaving, onSave, onDiscard }) {
  const status = isSaving ? 'Guardando…' : isDirty ? 'Cambios sin guardar' : 'Sin cambios'

  return (
    <div className="sticky top-16 z-10 -mx-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bone/95 px-6 py-4 backdrop-blur md:top-0">
      <p className="flex items-center gap-2 text-xs uppercase tracking-widest">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${isDirty ? 'bg-brand' : 'bg-line'} ${isSaving ? 'animate-pulse' : ''}`}
        />
        {status}
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={onDiscard} disabled={!isDirty || isSaving} className="btn-outline px-5 py-2">
          Descartar
        </button>
        <button type="button" onClick={onSave} disabled={!isDirty || isSaving} className="btn-primary px-5 py-2">
          {isSaving ? 'Guardando…' : 'Guardar orden'}
        </button>
      </div>
    </div>
  )
}

export default ReorderToolbar
