import { NavLink } from 'react-router-dom'
import MobileCollections from './MobileCollections.jsx'

// Menú desplegable del celular (se muestra debajo del Header)
function MobileMenu({ links, linkClass, onNavigate }) {
  return (
    <nav id="menu-movil" aria-label="Principal" className="border-t border-line md:hidden">
      <ul className="flex flex-col gap-6 px-6 py-8">
        <li>
          <NavLink to={links[0].to} end={links[0].end} className={linkClass} onClick={onNavigate}>
            {links[0].label}
          </NavLink>
        </li>
        <MobileCollections linkClass={linkClass} onNavigate={onNavigate} />
        {links.slice(1).map((link) => (
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
