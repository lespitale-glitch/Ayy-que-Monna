# CLAUDE.md — Ayy Que Monna

Tienda online de bijouterie. Rediseño minimalista y editorial inspirado en Gortari Studio.
Se conservan los productos, textos e imágenes originales de la web anterior.

## Stack técnico
- **React 19 + Vite** (JavaScript, sin TypeScript de momento: la dueña del proyecto está aprendiendo JS)
- **Tailwind CSS v3** para estilos (tokens de diseño en `tailwind.config.js`)
- **React Router** para navegación
- **dnd-kit** para el drag & drop del panel admin (Fase 3)
- Estado: `useState`/`useContext` (carrito en un `CartContext`). No usar Redux.
- Datos: **Supabase** (PostgreSQL + Auth + Storage) desde la Fase 3. `src/data/products.json` queda como fuente del seed inicial.

## Comandos
- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — linter (oxlint, viene con la plantilla de Vite)
- `npm run db:seed` — regenera `supabase/seed.sql` desde `products.json`

## Estructura
public/
  products/      # fotos de producto, servidas tal cual en /products/<archivo>
src/
  assets/        # imágenes de la interfaz (logo, banners) importadas desde el código
  components/    # componentes reutilizables (Button, ProductCard, Header…)
  pages/         # una carpeta por ruta (Home, Shop, Product, Cart, Admin)
  context/       # CartContext, etc.
  data/          # products.json
  hooks/         # hooks propios (useCart…)
fotos-originales/  # fotos originales pesadas, IGNORADA por Git, solo local
supabase/          # schema.sql (tabla, RLS, Storage) y seed.sql (generado)
scripts/           # generate-seed.mjs

El sitio original (Next.js) está respaldado en el repo aparte `lespitale-glitch/Monna_legacy`.
Solo se consulta como referencia: no copiar código de allí.

## Imágenes
- Fotos de producto en `public/products/`; en `products.json` se referencian como `/products/<archivo>`.
- Las fotos originales pesadas NO se suben a Git (ver `.gitignore`).
- Peso objetivo por foto: lado mayor ≤ 1600px, idealmente < 300 KB.

## Datos de producto (`src/data/products.json`)
`{ id, name, price, category, description, images[], isFeatured, isNew, collection? }`
- `id`: slug único; `name` en MAYÚSCULAS; `price` en ARS (número).
- `category`: "aros" | "collares" | "anillos" | "pulseras".
- `images[0]` es la foto principal; `images[1]` (opcional) se usa en el hover.
- `collection` (opcional): hoy solo `"marina"`.

## Supabase
- La tabla usa snake_case (`is_featured`); el frontend usa camelCase (`isFeatured`). La conversión vive SOLO en la capa de servicios.
- Seguridad = políticas RLS de `supabase/schema.sql`. La administradora se identifica con `public.is_admin()` (tabla `admins`).
- En el frontend solo va la clave pública (anon/publishable) vía `.env.local`. NUNCA la `service_role`.
- Cambios de esquema: editar `schema.sql` de forma idempotente (`if not exists`, `drop policy if exists`) y volver a ejecutarlo.
- Fotos nuevas → bucket `products` del Storage; las originales siguen en `public/products/`.

## Reglas de arquitectura
- Componentes funcionales, uno por archivo, nombre en PascalCase.
- Componentes pequeños: si pasa de ~150 líneas, dividir.
- Nada de lógica de negocio dentro del JSX; va en hooks o utilidades.
- Imágenes con `loading="lazy"` y `alt` descriptivo (nombres con `toTitleCase`, no en mayúsculas). Imágenes decorativas: `alt=""` + `aria-hidden`.
- Accesibilidad: HTML semántico (`header`, `main`, `nav`, `button`), foco visible, contraste AA.
- Mobile-first: diseñar primero para 375px.
- Comentarios breves en español explicando el *porqué* (pensados para aprender JS).
- Trabajo por fases (ver PRD.md): no adelantar funcionalidades de fases futuras.

## Normas de diseño (estilo Gortari Studio)
**Filosofía:** el producto es el protagonista. Mucho aire, poco ruido.

- **Color:** paleta neutra (tokens en `tailwind.config.js`, no usar hex sueltos).
  - Fondo `bone` #FAF8F5 (hueso), texto `ink` #1A1A1A, secundario `stone` #716C67, bordes `line` #E8E4DF.
  - Un único acento cálido y discreto: `gold` #B89B72, solo en bordes y líneas finas. Nunca como color de texto (no pasa AA).
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
- **Animación:** sutil — transiciones 300–500ms (`ease-soft`), fade-in al hacer scroll con el componente `<Reveal>` (usa `motion-safe:` para respetar "reducir movimiento"). Nunca rebotes ni efectos llamativos.
- **Copy:** breve, en español. Nombres de producto en MAYÚSCULAS, precio debajo en `stone`.
