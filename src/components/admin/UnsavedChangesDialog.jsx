import ConfirmDialog from './ConfirmDialog.jsx'

// Diálogo "¿Salir sin guardar?" conectado al blocker de useUnsavedChangesGuard
function UnsavedChangesDialog({ blocker, children }) {
  return (
    <ConfirmDialog
      open={blocker.state === 'blocked'}
      title="¿Salir sin guardar?"
      confirmLabel="Salir sin guardar"
      onConfirm={() => blocker.proceed()}
      onCancel={() => blocker.reset()}
    >
      <p>{children}</p>
    </ConfirmDialog>
  )
}

export default UnsavedChangesDialog
