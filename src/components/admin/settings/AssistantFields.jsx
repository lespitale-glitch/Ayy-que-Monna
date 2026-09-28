import { Link } from 'react-router-dom'
import Switch from '../Switch.jsx'

// Interruptor del asistente de preguntas frecuentes (el botón "Ayuda" de la tienda)
function AssistantFields({ values, setField, disabled }) {
  return (
    <fieldset className="grid content-start gap-4">
      <legend className="font-display text-2xl">Asistente</legend>
      <Switch
        checked={values.botEnabled}
        onChange={(value) => setField('botEnabled', value)}
        label="Mostrar el asistente en la tienda"
        disabled={disabled}
      />
      <p className="text-xs text-stone">
        Responde con tus{' '}
        <Link to="/admin/preguntas" className="text-ink underline underline-offset-4">
          preguntas frecuentes
        </Link>
        , busca productos y ofrece seguir por WhatsApp. La página /preguntas-frecuentes se ve igual aunque lo apagues.
      </p>
    </fieldset>
  )
}

export default AssistantFields
