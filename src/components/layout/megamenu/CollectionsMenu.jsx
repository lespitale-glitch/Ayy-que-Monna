import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import MegaMenuList from './MegaMenuList.jsx'
import MegaMenuProducts from './MegaMenuProducts.jsx'
import { useProducts } from '../../../hooks/useProducts.js'

const CLOSE_DELAY = 150 // ms: margen para mover el mouse del botón al panel sin que se cierre

// "Colecciones" del Header (escritorio): un botón que despliega un panel a todo el ancho.
// Se abre con hover, clic o teclado; se cierra con Escape, al salir el foco o al navegar.
function CollectionsMenu({ linkClass }) {
  const [isOpen, setIsOpen] = useState(false)
  const { selections } = useProducts()
  // null = ninguna elegida todavía: se muestra la primera (las colecciones llegan después de cargar)
  const [activeSlug, setActiveSlug] = useState(null)
  const currentSlug = activeSlug ?? selections[0].slug
  const closeTimer = useRef(null)
  // Si el mouse ya lo abrió, el clic no debe cerrarlo (hover y clic llegan casi juntos)
  const openedByHover = useRef(false)
  const buttonRef = useRef(null)
  const { pathname } = useLocation()

  const openByHover = () => {
    clearTimeout(closeTimer.current)
    if (!isOpen) openedByHover.current = true
    setIsOpen(true)
  }
  const close = () => {
    openedByHover.current = false
    setIsOpen(false)
  }
  const handleClick = () => {
    if (openedByHover.current) {
      openedByHover.current = false // queda abierto; el próximo clic lo cierra
      return
    }
    setIsOpen((v) => !v)
  }
  const closeSoon = () => {
    closeTimer.current = setTimeout(close, CLOSE_DELAY)
  }
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const onKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      close()
      buttonRef.current.focus() // el foco vuelve al botón que abrió el menú
    }
  }

  return (
    // El <li> contiene botón y panel: pasar el mouse de uno al otro no lo cierra
    <li
      onMouseEnter={openByHover}
      onMouseLeave={closeSoon}
      onKeyDown={onKeyDown}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && close()}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mega-colecciones"
        onClick={handleClick}
        className={`${linkClass({ isActive: pathname.startsWith('/seleccion') })} flex items-center gap-1`}
      >
        Colecciones
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`transition-transform duration-300 ease-soft ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Truco de grid (0fr → 1fr) para desplegar la altura de forma suave */}
      <div
        id="mega-colecciones"
        inert={!isOpen}
        className={`absolute inset-x-0 top-full grid border-line bg-bone transition-all duration-500 ease-soft ${
          isOpen ? 'grid-rows-[1fr] border-b opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-6 py-10">
            <div className="col-span-4">
              <p className="mb-4 px-4 text-xs font-medium uppercase tracking-widest text-fucsia-deep">
                Selección especial
              </p>
              <MegaMenuList selections={selections} activeSlug={currentSlug} onActivate={setActiveSlug} onNavigate={close} />
            </div>
            <div className="col-span-8">
              <MegaMenuProducts selections={selections} slug={currentSlug} onNavigate={close} />
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CollectionsMenu
