# CLAUDE.md — Ayy Que Monna

Tienda online de bijouterie. Rediseño minimalista y editorial inspirado en Gortari Studio.
Se conservan los productos, textos e imágenes originales de la web anterior.

## Stack técnico
- **React 19 + Vite** (JavaScript, sin TypeScript de momento: la dueña del proyecto está aprendiendo JS)
- **Tailwind CSS v3** para estilos (tokens de diseño en `tailwind.config.js`)
- **React Router** para navegación
- **dnd-kit** para el drag & drop del panel admin (Fase 3)
- Estado: `useState`/`useContext` (carrito en un `CartContext`). No usar Redux.
- Datos: al principio, JSON local en `src/data/products.json`; backend se decide en Fase 3.

## Comandos
- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — linter (oxlint, viene con la plantilla de Vite)

## Estructura
src/
  assets/        # muestra de imágenes OPTIMIZADAS (NO subir originales pesados)
  components/    # componentes reutilizables (Button, ProductCard, Header…)
  pages/         # una carpeta por ruta (Home, Shop, Product, Cart, Admin)
  context/       # CartContext, etc.
  data/          # products.json
  hooks/         # hooks propios (useCart…)
fotos-originales/  # fotos originales (~500 MB), IGNORADA por Git, solo local
legacy/            # copia de la web HTML/CSS original, solo referencia (sin imágenes pesadas)

## Imágenes
- Las fotos originales pesadas NO se suben a Git (ver `.gitignore`).
- En `src/assets/` solo van versiones optimizadas: WebP, lado mayor ≤ 1600px, idealmente < 300 KB.

## Reglas de arquitectura
- Componentes funcionales, uno por archivo, nombre en PascalCase.
- Componentes pequeños: si pasa de ~150 líneas, dividir.
- Nada de lógica de negocio dentro del JSX; va en hooks o utilidades.
- Imágenes con `loading="lazy"` y `alt` descriptivo.
- Accesibilidad: HTML semántico (`header`, `main`, `nav`, `button`), foco visible, contraste AA.
- Mobile-first: diseñar primero para 375px.
- Comentarios breves en español explicando el *porqué* (pensados para aprender JS).
- Trabajo por fases (ver PRD.md): no adelantar funcionalidades de fases futuras.

## Normas de diseño (estilo Gortari Studio)
**Filosofía:** el producto es el protagonista. Mucho aire, poco ruido.

- **Color:** paleta neutra (tokens en `tailwind.config.js`, no usar hex sueltos).
  - Fondo `bone` #FAF8F5 (hueso), texto `ink` #1A1A1A, secundario `stone` #8A8580, bordes `line` #E8E4DF.
  - Un único acento cálido y discreto: `gold` #B89B72, solo en detalles.
- **Tipografía:**
  - Títulos: serif elegante (Cormorant Garamond), peso ligero.
  - Texto/UI: sans-serif limpia (Inter / Helvetica Neue), 14–16px.
  - Navegación y botones en MAYÚSCULAS pequeñas con `tracking-widest`.
- **Espaciado:** generoso (secciones `py-24`+). Grid de 12 columnas, márgenes amplios.
- **Imágenes:** grandes y protagonistas, proporción uniforme (`aspect-product`, 4:5) en la grilla. Hover = cambio suave a segunda imagen.
- **Componentes:**
  - Botones rectangulares, sin sombras, borde fino 1px o relleno negro sólido.
  - Sin degradados, sin sombras marcadas, sin bordes redondeados grandes (máx. `rounded-sm`).
  - Iconos lineales finos (Lucide, stroke 1.25–1.5).
- **Animación:** sutil — transiciones 300–500ms (`ease-soft`), fade-in al hacer scroll. Nunca rebotes ni efectos llamativos.
- **Copy:** breve, en español. Nombres de producto en MAYÚSCULAS, precio debajo en `stone`.
