import { useEffect, useRef } from 'react'

// Diálogo de confirmación con el elemento nativo <dialog>: el navegador se ocupa
// de mantener el foco adentro, cerrar con Escape y oscurecer el fondo.
function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel, isBusy = false }) {
  const dialogRef = useRef(null)

  // Sincroniza la prop "open" con el diálogo real del navegador
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        // Escape: dejamos que el padre decida (no cerrar mientras se está borrando)
        event.preventDefault()
        if (!isBusy) onCancel()
      }}
      aria-labelledby="confirm-title"
      className="w-[calc(100%-2rem)] max-w-md border border-line bg-bone p-8 backdrop:bg-ink/40"
    >
      <h2 id="confirm-title" className="text-2xl">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-relaxed text-stone">{children}</div>
      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          autoFocus
          className="border border-line px-5 py-3 text-xs uppercase tracking-widest hover:border-ink disabled:opacity-40"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isBusy}
          className="bg-ink px-5 py-3 text-xs uppercase tracking-widest text-bone hover:bg-ink/85 disabled:opacity-60"
        >
          {isBusy ? 'Eliminando…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
