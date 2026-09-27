# CLAUDE.md — Ayy Que Monna

Tienda online de bijouterie. Identidad colorida y jovial (logo original de Ayy Que Monna) sobre una base limpia y espaciada.
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
  context/       # ProductsContext (catálogo), CartContext, AuthContext (solo /admin)
  lib/           # supabase.js (cliente; null si faltan las claves)
  services/      # productsService.js: ÚNICO lugar que habla con Supabase
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
- Sin `.env.local` la tienda usa `products.json` (modo local). Con claves, si Supabase falla se muestra "Reintentar" (no se cae a datos viejos).
- Los componentes leen el catálogo con `useProducts()`; nunca importan `products.json` ni `supabase` directamente.
- La consulta pública filtra `is_visible = true` explícitamente (con sesión de admin, RLS dejaría ver los ocultos).

## Panel /admin
- Rutas cargadas con `lazy` en `router.jsx`: la tienda nunca descarga código del panel.
- `AdminRoot` (AuthProvider + meta noindex) → `/admin/login` | `ProtectedRoute` → `AdminLayout` → páginas.
- `isAdmin` sale de `supabase.rpc('is_admin')`; una cuenta válida que no es admin se desloguea al instante.
- Indexación: meta `noindex` + cabecera `X-Robots-Tag` (vercel.json). `/admin` NO se bloquea en robots.txt (si no, el buscador no ve el noindex).
- Escrituras del panel: `productsService` (`updateProduct`, `deleteProduct`) + hook `useAdminProducts` con actualización optimista y reversión si falla.
- Errores de Supabase → mensajes en español con `getAdminErrorMessage` (utils/adminErrors.js).
- Eliminar borra también las fotos del bucket (`getStoragePath`); las de `public/products/` no se tocan.
- Formulario (`/admin/productos/nuevo` y `/:id`): validación en `utils/productForm.js` (espejo de las reglas de `schema.sql`).
- Fotos nuevas: se comprimen al elegirlas (`compressImage`, WebP, lado mayor ≤ 1600px) y se SUBEN recién al guardar; si el guardado falla se borran. Nombre de archivo aleatorio (`crypto.randomUUID()`).
- El id (slug) solo se elige al crear; al editar es de solo lectura (enlaces y carritos dependen de él).
- Orden del catálogo (`/admin/orden`): dnd-kit (`@dnd-kit/core`, `sortable`, `modifiers`), solo en ese chunk.
  Se arrastra desde el asa (mouse, dedo con 200 ms de espera, teclado con Espacio + flechas) y SIEMPRE hay
  botones ↑ ↓ (WCAG 2.2, 2.5.7). Anuncios del lector de pantalla en español (`dndAnnouncements.js`).
  Los cambios se guardan juntos con "Guardar orden" → `reorderProducts(ids)` → `reorder_products()` (atómico,
  lista completa incluidos los ocultos). Aviso al salir con cambios sin guardar (`useBlocker` + `beforeunload`).
  Lógica pura en `utils/reorder.js` (`moveItem`, `hasOrderChanged`, `sortByIds`).

## Reglas de arquitectura
- Componentes funcionales, uno por archivo, nombre en PascalCase.
- Componentes pequeños: si pasa de ~150 líneas, dividir.
- Nada de lógica de negocio dentro del JSX; va en hooks o utilidades.
- Imágenes con `loading="lazy"` y `alt` descriptivo (nombres con `toTitleCase`, no en mayúsculas). Imágenes decorativas: `alt=""` + `aria-hidden`.
- Accesibilidad: HTML semántico (`header`, `main`, `nav`, `button`), foco visible, contraste AA.
- Mobile-first: diseñar primero para 375px.
- Comentarios breves en español explicando el *porqué* (pensados para aprender JS).
- Trabajo por fases (ver PRD.md): no adelantar funcionalidades de fases futuras.

## Normas de diseño (identidad Ayy Que Monna)
**Filosofía:** colorida y jovial como la marca original, pero con el orden y el aire del rediseño.
El producto sigue siendo el protagonista: el color acompaña, no compite.

- **Logo:** `src/assets/brand/` (generado por `npm run brand:logo` desde el logo original). Wordmark "monna" en el Header
  y el Footer; la "M" sola para favicon y espacios chicos. No redibujar ni recolorear el logo.
- **Color** (tokens en `tailwind.config.js`, no usar hex sueltos):
  - Base: fondo `bone` (crema cálido), texto `ink`, secundario `stone`, bordes `line`.
  - Marca, SOLO decorativo (fondos, bordes, degradados, íconos grandes): `mango` #FD8927 y `fucsia` #F27084
    (los colores exactos del logo). Degradado de marca: `bg-brand` (mango → fucsia).
  - Marca para TEXTO y botones con texto blanco (pasan AA): `mango-deep` #C2410C, `fucsia-deep` #BE185D.
    Degradado de texto: `text-gradient` (mango-deep → fucsia-deep).
  - Colección Marina: `marina` (decorativo) y `marina-deep` (texto).
  - Regla de contraste: mango, fucsia y marina NUNCA como color de texto ni como fondo de texto blanco (no pasan AA).
- **Tipografía:**
  - Títulos: `font-display` (Comfortaa, redondeada como el logotipo), peso 400–700.
  - Texto/UI: `font-sans` (Geist), 14–16px.
  - Fuentes autoalojadas con `@fontsource-variable` (importadas en `main.jsx`): no usar Google Fonts.
  - Acentos: palabras clave de los títulos con `text-gradient`. Eyebrows y navegación en MAYÚSCULAS con `tracking-widest`.
- **Espaciado:** generoso (secciones `py-24`+). Grid de 12 columnas, márgenes amplios.
- **Imágenes:** grandes y protagonistas, proporción uniforme (`aspect-product`, 4:5), esquinas `rounded-2xl`.
  Hover = cambio suave a segunda imagen.
- **Componentes:**
  - Botones redondeados (`rounded-full`): primario `btn-primary` (degradado deep + texto blanco), secundario `btn-outline`.
    Definidos en `src/index.css` (@layer components): usar esas clases en vez de repetir utilidades.
  - Tarjetas y paneles `rounded-2xl`; etiquetas `rounded-full`. Sin sombras marcadas.
  - Iconos lineales (Lucide, stroke 1.25–1.5).
- **Animación:** sutil — transiciones 300–500ms (`ease-soft`), fade-in al hacer scroll con `<Reveal>` (usa `motion-safe:`).
  Carruseles con autoplay: pausa al hover/foco, botón de pausa visible y sin autoplay con "reducir movimiento".
- **Copy:** breve, en español rioplatense (vos) en la tienda. Nombres de producto en MAYÚSCULAS, precio debajo en `stone`.
- **Testimonios:** solo reseñas reales con permiso de la clienta. Nunca inventar reseñas (publicidad engañosa).
