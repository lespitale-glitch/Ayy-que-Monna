import { useAuth } from '../../hooks/useAuth.js'

// Página provisoria: la lista de productos con sus controles llega en el Paso 4.
function AdminDashboard() {
  const { user } = useAuth()

  return (
    <section>
      <p className="text-xs uppercase tracking-widest text-stone">Panel de administración</p>
      <h1 className="mt-3 break-words text-4xl">Hola{user?.email ? `, ${user.email}` : ''}</h1>
      <p className="mt-6 text-sm text-stone">La gestión de productos estará disponible en el próximo paso.</p>
    </section>
  )
}

export default AdminDashboard
