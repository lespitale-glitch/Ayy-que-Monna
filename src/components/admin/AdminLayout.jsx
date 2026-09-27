import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ExternalLink, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

// Estructura común de las páginas protegidas del panel
function AdminLayout() {
  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Al cerrar sesión, ProtectedRoute detecta que ya no hay sesión y redirige al login
  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-bone">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <Link to="/admin" className="whitespace-nowrap font-serif text-xl font-light">
            Ayy Que <span className="italic">Monna</span>
            <span className="ml-3 hidden font-sans text-[10px] uppercase tracking-widest text-stone sm:inline">Panel</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden text-xs text-stone md:inline">{user?.email}</span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone hover:text-ink"
            >
              <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden sm:inline">Ver tienda</span>
              <span className="sr-only sm:hidden">Ver tienda</span>
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2 border border-ink px-3 py-2 text-xs sm:px-4 uppercase tracking-widest transition-colors duration-300 ease-soft hover:bg-ink hover:text-bone disabled:opacity-50"
            >
              <LogOut size={14} strokeWidth={1.5} aria-hidden="true" />
              {/* En móvil solo se ve el icono; el texto sigue disponible para lectores de pantalla */}
              <span className="sr-only sm:not-sr-only">{isSigningOut ? 'Saliendo…' : 'Cerrar sesión'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
