import { MapPin, MessageCircle, Truck } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings.js'
import { joinList } from '../../utils/settings.js'

// Condiciones de envío y retiro en la página de producto (se editan desde /admin/ajustes)
function ShippingInfo() {
  const { shippingEnabled, shippingNote, pickupPoints } = useSettings()

  const items = [
    shippingEnabled && shippingNote && { icon: Truck, text: shippingNote },
    pickupPoints.length > 0 && { icon: MapPin, text: `Retiro gratis en ${joinList(pickupPoints)}.` },
    { icon: MessageCircle, text: 'Pedidos y consultas por WhatsApp.' },
  ].filter(Boolean) // quita los "false" de las condiciones que no se cumplen

  return (
    <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-stone">
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex gap-3">
          <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-fucsia-deep" aria-hidden="true" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  )
}

export default ShippingInfo
