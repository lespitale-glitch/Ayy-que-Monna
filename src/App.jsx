// Página temporal de la Fase 1: solo comprueba que las fuentes y colores de marca funcionan.
function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs uppercase tracking-widest text-stone">Bijouterie</p>
      <h1 className="text-5xl md:text-7xl">Ayy Que Monna</h1>
      <span className="h-px w-16 bg-gold" aria-hidden="true" />
      <p className="text-sm uppercase tracking-widest text-stone">Nueva tienda muy pronto</p>
    </main>
  )
}

export default App
