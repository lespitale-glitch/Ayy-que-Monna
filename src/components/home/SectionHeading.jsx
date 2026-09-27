// Título de sección reutilizable: una línea pequeña arriba ("eyebrow") y el título en serif.
function SectionHeading({ eyebrow, title, children, align = 'left' }) {
  return (
    <header className={align === 'center' ? 'text-center' : ''}>
      {eyebrow && <p className="text-xs font-medium uppercase tracking-widest text-fucsia-deep">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl md:text-5xl">{title}</h2>
      {children}
    </header>
  )
}

export default SectionHeading
