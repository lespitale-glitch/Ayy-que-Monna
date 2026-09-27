// Indicador de carga del panel (mientras se verifica la sesión)
function AdminLoader() {
  return (
    <div role="status" className="flex min-h-screen items-center justify-center">
      <p className="animate-pulse text-xs uppercase tracking-widest text-stone">Verificando sesión…</p>
    </div>
  )
}

export default AdminLoader
