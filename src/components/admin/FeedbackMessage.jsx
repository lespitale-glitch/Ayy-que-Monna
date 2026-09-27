// Resultado de la última acción del panel. aria-live: los lectores de pantalla
// lo anuncian sin mover el foco; los errores además usan role="alert".
function FeedbackMessage({ message }) {
  return (
    <div aria-live="polite" className="mt-6 min-h-6">
      {message && (
        <p
          role={message.type === 'error' ? 'alert' : undefined}
          className={`border-l-2 px-4 py-2 text-sm ${message.type === 'error' ? 'border-ink bg-white' : 'border-fucsia'}`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}

export default FeedbackMessage
