import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'
import CartButton from '../cart/CartButton.jsx'
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
        {/* Botón de menú: solo visible en móvil */}
        <button
          type="button"
          className="-ml-2 p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="menu-movil"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>

        <Logo onClick={closeMenu} />

        <div className="flex items-center gap-10">
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
          <CartButton />
        </div>
      </div>

      {isOpen && (
        <nav id="menu-movil" aria-label="Principal" className="border-t border-line md:hidden">
          <ul className="flex flex-col gap-6 px-6 py-8">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass} onClick={closeMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
