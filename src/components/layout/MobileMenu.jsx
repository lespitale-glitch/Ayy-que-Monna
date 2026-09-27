import { NavLink } from 'react-router-dom'

// Menú desplegable del celular (se muestra debajo del Header)
function MobileMenu({ links, linkClass, onNavigate }) {
  return (
    <nav id="menu-movil" aria-label="Principal" className="border-t border-line md:hidden">
      <ul className="flex flex-col gap-6 px-6 py-8">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.end} className={linkClass} onClick={onNavigate}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileMenu
