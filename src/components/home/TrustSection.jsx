import { Gem, MapPin, MessageCircle, Truck } from 'lucide-react'
import Reveal from '../Reveal.jsx'
import { useSettings } from '../../hooks/useSettings.js'
import { joinList, shippingSummary } from '../../utils/settings.js'

// Información real de la tienda. Envíos y retiro salen de los ajustes (/admin/ajustes);
// si no hay envíos o puntos de retiro, ese bloque no se muestra.
function getItems(settings) {
  const shipping = shippingSummary(settings)
  const { pickupPoints } = settings
  return [
    { icon: Gem, title: 'Acero quirúrgico', text: 'Todas nuestras piezas son de acero quirúrgico.' },
    shipping && { icon: Truck, title: 'Envíos', text: shipping },
    pickupPoints.length > 0 && {
      icon: MapPin,
      title: 'Retiro gratis',
      text: `Puntos de retiro en ${joinList(pickupPoints)}.`,
    },
    {
      icon: MessageCircle,
      title: 'Atención personalizada',
      text: 'Coordinamos envío y pago por transferencia directo con vos, por WhatsApp.',
    },
  ].filter(Boolean)
}

function TrustSection() {
  const items = getItems(useSettings())

  return (
    <section aria-label="Por qué comprar en Ayy Que Monna" className="mx-auto max-w-7xl px-6 py-24">
      <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* "Icon" en mayúscula: así JSX lo trata como componente y lo puede dibujar */}
        {items.map(({ icon: Icon, title, text }) => (
          <Reveal as="li" key={title} className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
              <Icon size={26} strokeWidth={1.5} className="text-fucsia-deep" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-sans text-xs uppercase tracking-widest">{title}</h3>
            <p className="mx-auto mt-3 max-w-60 text-sm leading-relaxed text-stone">{text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export default TrustSection
