import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'
import MobileMenu from './MobileMenu.jsx'
import CartButton from '../cart/CartButton.jsx'
import SearchButton from '../search/SearchButton.jsx'
import SearchModal from '../search/SearchModal.jsx'
import { CATEGORIES } from '../../config.js'

const NAV_LINKS = [
  { to: '/tienda', label: 'Tienda', end: true },
  ...CATEGORIES.map((c) => ({ to: `/tienda/${c.slug}`, label: c.label })),
]

// NavLink recibe una función en className: React Router nos dice si el link
// está activo y así podemos subrayar la página actual.
const linkClass = ({ isActive }) =>
  `text-xs uppercase tracking-widest transition-colors duration-300 ease-soft hover:text-ink ${
    isActive ? 'text-ink underline decoration-fucsia decoration-2 underline-offset-8' : 'text-stone'
  }`

function Header() {
  // useState guarda si el menú móvil está abierto (true) o cerrado (false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  // Con el menú abierto, la tecla Escape lo cierra
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event) => event.key === 'Escape' && setIsOpen(false)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/95 backdrop-blur">
      {/* Celular: 3 columnas (menú | logo | íconos) para que el logo quede centrado.
          Escritorio: logo a la izquierda y navegación + íconos a la derecha. */}
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:flex md:h-20 md:justify-between md:px-6">
        {/* Botón de menú: solo visible en móvil */}
        <button
          type="button"
          className="justify-self-start p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="menu-movil"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>

        <Logo onClick={closeMenu} />

        <div className="flex items-center justify-end gap-10">
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end} className={linkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1">
            <SearchButton onClick={() => setIsSearchOpen(true)} />
            <CartButton />
          </div>
        </div>
      </div>

      {isOpen && <MobileMenu links={NAV_LINKS} linkClass={linkClass} onNavigate={closeMenu} />}
      <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}

export default Header
