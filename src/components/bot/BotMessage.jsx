import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import BotProducts from './BotProducts.jsx'

const chipClass =
  'rounded-full border border-fucsia bg-white px-3 py-1.5 text-left text-xs text-fucsia-deep transition-colors duration-300 ease-soft hover:bg-fucsia/10'

// Un mensaje de la conversación: burbuja + (opcional) productos, enlaces y opciones
function BotMessage({ message, onChoose, onNavigate }) {
  if (message.from === 'user') {
    return (
      <li className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2 text-sm text-bone">
          <span className="sr-only">Vos: </span>
          {message.text}
        </p>
      </li>
    )
  }

  return (
    <li className="space-y-3">
      <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3 text-sm leading-relaxed">
        <span className="sr-only">Asistente: </span>
        {message.title && <p className="mb-1 font-medium">{message.title}</p>}
        <p>{message.text}</p>
      </div>

      {message.products && <BotProducts products={message.products} onNavigate={onNavigate} />}

      {(message.link || message.whatsappUrl || message.faqLink) && (
        <div className="flex flex-wrap gap-2">
          {message.whatsappUrl && (
            <a href={message.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-4 py-2 text-[11px]">
              <MessageCircle size={14} strokeWidth={1.5} aria-hidden="true" />
              Escribir por WhatsApp
            </a>
          )}
          {message.link && (
            <Link to={message.link.to} onClick={onNavigate} className="btn-outline px-4 py-2 text-[11px]">
              {message.link.label}
            </Link>
          )}
          {message.faqLink && (
            <Link to="/preguntas-frecuentes" onClick={onNavigate} className="btn-outline px-4 py-2 text-[11px]">
              Preguntas frecuentes
            </Link>
          )}
        </div>
      )}

      {message.chips && (
        <ul className="flex flex-wrap gap-2" aria-label="Opciones">
          {message.chips.map((chip) => (
            <li key={chip.label}>
              <button type="button" onClick={() => onChoose(chip)} className={chipClass}>
                {chip.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default BotMessage
