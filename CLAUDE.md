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
- `npm run db:seed` — regenera `supabase/seed.sql` desde `collections.json`, `products.json`, `faqs.json` y `heroSlides.json`
- `postbuild` (automático tras `npm run build`): `dist/sitemap.xml` si existe la variable `SITE_URL`

## Estructura
public/
  products/      # fotos de producto, servidas tal cual en /products/<archivo>
  hero/          # fotos originales del carrusel (npm run brand:hero), servidas en /hero/<archivo>
src/
  assets/        # imágenes de la interfaz (logo, banners) importadas desde el código
  components/    # componentes reutilizables (Button, ProductCard, Header…)
  pages/         # una carpeta por ruta (Home, Shop, Product, Cart, Admin)
  context/       # ProductsContext, SettingsContext, ConsentContext (cookies), CartContext, AuthContext (solo /admin)
  lib/           # supabase.js (cliente; null si faltan las claves), analytics.js (GA4 + Meta Pixel)
  services/      # products, collections, settings, faqs y heroSlidesService: ÚNICOS lugares que hablan con Supabase
  data/          # products.json, collections.json, faqs.json, heroSlides.json (seed y modo local), selections.js
  hooks/         # hooks propios (useCart…)
fotos-originales/  # fotos originales pesadas, IGNORADA por Git, solo local
supabase/          # schema.sql (tablas, RLS, Storage), seed.sql (generado), functions/stock-alert (email)
scripts/           # generate-seed.mjs, generate-sitemap.mjs

El sitio original (Next.js) está respaldado en el repo aparte `lespitale-glitch/Monna_legacy`.
Solo se consulta como referencia: no copiar código de allí.

## Imágenes
- Fotos de producto en `public/products/`; en `products.json` se referencian como `/products/<archivo>`.
- Las fotos originales pesadas NO se suben a Git (ver `.gitignore`).
- Peso objetivo por foto: lado mayor ≤ 1600px, idealmente < 300 KB.

## Datos de producto (`src/data/products.json`)
`{ id, name, price, category, description, images[], isFeatured, isNew, collections? }`
(el stock no está en el JSON: se carga desde el panel; en modo local todo es "sin control")
- `id`: slug único; `name` en MAYÚSCULAS; `price` en ARS (número).
- `category`: "aros" | "collares" | "anillos" | "pulseras".
- `images[0]` es la foto principal; `images[1]` (opcional) se usa en el hover.
- `collections` (opcional): ids de colecciones (`src/data/collections.json`). En el frontend siempre es un array.

## Supabase
- La tabla usa snake_case (`is_featured`); el frontend usa camelCase (`isFeatured`). La conversión vive SOLO en la capa de servicios.
- Seguridad = políticas RLS de `supabase/schema.sql`. La administradora se identifica con `public.is_admin()` (tabla `admins`).
- En el frontend solo va la clave pública (anon/publishable) vía `.env.local`. NUNCA la `service_role`.
- Cambios de esquema: editar `schema.sql` de forma idempotente (`if not exists`, `drop policy if exists`) y volver a ejecutarlo.
- Fotos nuevas → bucket `products` del Storage; las originales siguen en `public/products/`.
- Sin `.env.local` la tienda usa `products.json` (modo local). Con claves, si Supabase falla se muestra "Reintentar" (no se cae a datos viejos).
- Los componentes leen el catálogo con `useProducts()`; nunca importan `products.json` ni `supabase` directamente.
- La consulta pública filtra `is_visible = true` explícitamente (con sesión de admin, RLS dejaría ver los ocultos).
- Colecciones: tabla `collections` (`id` slug, `name`, `description`, `theme` 'brand' | 'marina', `show_on_home`,
  `is_visible`, `position`). `products.collections text[]` guarda los ids (un producto puede estar en varias).
  Integridad por triggers: un producto no puede apuntar a una colección inexistente (23503) y al borrar una
  colección se quita sola de los productos. Ids reservados: novedades, destacados, dorados, plateados.
  RPC atómicas: `reorder_collections(ids)` y `set_collection_products(id, product_ids)`.
- Preguntas frecuentes: tabla `faqs` (`question`, `answer`, `keywords text[]`, `is_visible`, `position`; RPC `reorder_faqs`).
  Las respuestas aceptan comodines `{envios}`, `{retiro}`, `{instagram}` (`fillAnswer`, utils/faqText.js).
- Preguntas sin respuesta: tabla `bot_questions`. Anónimas: SOLO el texto (permiso de insert únicamente sobre la
  columna `question`); el trigger `before_bot_question` junta repetidas (`times_asked`) y frena más de 30/min.
  Solo la admin las lee. El frontend además quita emails/teléfonos (`sanitizeQuestion`) y guarda máx. 5 por visita.
- Inventario: `products.stock_mode` ('none' | 'tracked' | 'on_demand'), `stock`, `low_stock_threshold`.
  ±1 SIEMPRE con la RPC atómica `adjust_stock(id, delta)` (nunca baja de 0). El trigger `queue_stock_alert` agrega una fila
  a `stock_alerts` solo al CRUZAR el límite ('low') o llegar a 0 ('out'); un Database Webhook llama a la Edge Function
  `supabase/functions/stock-alert` (Resend). Secretos solo en Supabase (RESEND_API_KEY, ALERT_EMAIL_TO, WEBHOOK_SECRET).
  Disponibilidad en la tienda: `getAvailability` (utils/stock.js); "Últimas unidades" depende de `show_low_stock` (Ajustes).
  Carrito: tope = stock; los agotados quedan en la lista marcados y NO van en el pedido (`orderLines`).
- Carrusel del inicio: tabla `hero_slides` (`image`, `image_small`, `alt`, `eyebrow`, `title`, `highlight`, `cta_label`,
  `cta_link` solo '/…' o 'https://…', `is_visible`, `position`; RPC `reorder_hero_slides`). Fotos nuevas en `products/hero/`
  del bucket (grande 1600 + chica 800). `buildHeroSlides` (utils/heroSlides.js) las convierte al formato del slider (no hay placas fijas).
- Colores de la marca: `store_settings.brand_color_from` / `brand_color_to` ("#RRGGBB", por defecto los "deep" del logo).
  Se aplican como variables CSS `--brand-from` / `--brand-to` en `<html>` (`applyTheme`, utils/theme.js); tailwind.config.js
  las usa en `mango-deep`, `fucsia-deep` y `bg-brand-deep`, así que `btn-primary`, `text-gradient`, eyebrows y foco cambian
  solos. El panel exige contraste AA (≥ 4.5:1 contra blanco y `bone`); si llega un color que no pasa, se usan los del logo.
  `index.html` aplica en línea el último tema guardado en localStorage (`monna-theme`) antes de React: sin parpadeo.
- `ProductsContext` carga productos + colecciones + carrusel juntos (`Promise.all`) y expone `heroSlides`, `collections`, `selections`
  (colecciones + selecciones automáticas de `data/selections.js`) y `homeCollections`.

## Panel /admin
- Rutas cargadas con `lazy` en `router.jsx`: la tienda nunca descarga código del panel.
- Todo `import()` dinámico pasa por `importWithReload` (utils/lazyImport.js): si un deploy borró el archivo viejo,
  recarga la página una vez; si igual falla, `RouteError` ("Hay una versión nueva"). `errorElement` en tienda y panel.
- `useEffect` SIEMPRE con llaves: nunca devolver el resultado de una llamada (ej. `scrollIntoView()` devuelve una
  Promesa en Chrome nuevo y React la ejecutaría como limpieza → "l is not a function").
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
- Ajustes de la tienda (`/admin/ajustes`): tabla `store_settings` (una sola fila, id = 1) con WhatsApp, Instagram,
  envíos (texto, costo "desde") y puntos de retiro. La tienda los lee con `useSettings()`; NADA de números o
  usuarios fijos en los componentes (los valores por defecto viven en `DEFAULT_SETTINGS` de `config.js`).
  Los textos usan los valores por defecto mientras cargan; el botón de WhatsApp del carrito espera a
  `status === 'ready'` (nunca manda un pedido a un número viejo). Reglas en `utils/settings.js` (espejo de schema.sql).
- Colecciones (`/admin/colecciones`, `/nueva`, `/:id`): lista con Visible, En el inicio, ↑ ↓ (guardan al instante,
  optimista) y borrar. Formulario con color (tema), dónde se muestra y selector de productos (buscador +
  "Solo los elegidos", que congela la lista para no perder el foco). Reglas en `utils/collectionForm.js`.
  En el formulario de producto, casillas `CollectionsField`.
- Preguntas (`/admin/preguntas`, `/nueva`, `/:id`, `/sin-responder`): lista ordenable + "Probar el asistente"
  (usa el mismo motor). Desde "Sin responder" → "Crear respuesta" prellena la pregunta y al guardar la marca resuelta.
- Stock en la lista de productos: `StockControl` (−/+ con `aria-disabled` en 0 para no perder el foco),
  `StockAlertBanner` (stock bajo / agotados) y filtro Stock. En el formulario, `StockFields`.
- Listas ordenables del panel (colecciones, preguntas): hook genérico `useAdminSortableList`.
- Carrusel (`/admin/inicio`, `/nueva`, `/:id`): lista ordenable; formulario con foto (`HeroPhotoPicker`, se comprime y
  sube al guardar; al reemplazarla se borra la vieja del Storage), textos, destino del botón (`LinkPicker`) y vista previa
  en vivo con el mismo `HeroSlide` de la tienda. Reglas en `utils/heroSlideForm.js`.
- Menú del panel: `AdminNav` (Productos | Inicio | Colecciones | Preguntas | Ajustes); Productos abarca también el formulario y el orden.
- Cambios sin guardar: `useUnsavedChangesGuard(isDirty)` + `<UnsavedChangesDialog>` (producto, orden, colección y ajustes).
  En el formulario, `isFormDirty` (utils/productForm.js); mientras se guarda no se bloquea la navegación.

## Asistente (bot) de la tienda
- Sin IA y gratis: todo corre en el navegador. Motor en `utils/bot/` (funciones puras, probadas con un corpus de preguntas reales):
  `lexicon.js` (palabras vacías, sinónimos, categorías), `botText.js` (normalizar, raíz del plural, errores de tipeo con
  Damerau-Levenshtein), `faqMatcher.js` (puntaje por pesos + IDF; umbrales SURE/MAYBE), `productFinder.js` (categoría,
  terminación, precio, colección y nombres), `intents.js` (saludo, gracias, hablar con una persona), `botReply.js` (decide
  la respuesta) y `botMessages.js` (respuesta → mensajes, regalo, WhatsApp con la consulta).
- Nunca responder con seguridad algo dudoso: si no hay coincidencia clara → "¿Quisiste preguntar…?"; si no sabe → lo dice,
  ofrece WhatsApp y guarda la pregunta. Al cambiar el motor, correr el corpus y sumar los casos nuevos.
- UI: `BotLauncher` (botón "Ayuda", se apaga desde Ajustes con `bot_enabled`) carga `BotPanel` con `lazy` al abrirse.
  Panel no modal (`role="dialog"`), mensajes en `role="log"` (envolviendo la `<ol>`), Escape cierra y devuelve el foco.
- `/preguntas-frecuentes`: `<details>`, datos estructurados FAQPage (`utils/faqSchema.js`), enlace en el footer.

## Analítica (GA4 + Meta Pixel)
- IDs en Ajustes (`store_settings.ga4_id`, `meta_pixel_id`; vacíos = no se mide). Sin IDs no hay aviso de cookies.
- NADA se carga sin consentimiento: `CookieBanner` (Aceptar / Rechazar del mismo tamaño) guarda la elección en
  localStorage (`utils/consent.js`, con VERSION para volver a preguntar si cambia lo que se mide). "Preferencias de
  cookies" en el footer reabre el aviso.
- `AnalyticsManager` (solo en el Layout de la tienda) llama a `enableAnalytics` / `disableAnalytics` (lib/analytics.js).
  Al entrar al panel se desmonta y la medición se pausa (`ga-disable-ID`, `fbq('consent','revoke')`): /admin nunca se mide.
- Páginas vistas: GA4 las registra sola (medición mejorada); Meta a mano (`disablePushState`, `autoConfig` apagado).
- Eventos: `trackEvent(nombre, lines)` con nombres de GA4 (view_item, add_to_cart, begin_checkout, contact) que se
  traducen a Meta (ViewContent, AddToCart, InitiateCheckout, Contact). Si no está activa, no hace nada.

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

- **Logo:** `BrandLogo` = la imagen completa que entregó la dueña (`design/logo-completo.png`: "ayy que" arriba del arco
  y "Monna", donde la "M" es el símbolo). `npm run brand:logo` le quita el fondo crema → `src/assets/brand/logo.webp`.
  La "M" sola (`design/logo-m-original.jpg`) para favicon y espacios chicos. No redibujar ni recolorear el logo.
  El nombre de la marca es **Ayy Que Monna**.
- **Color** (tokens en `tailwind.config.js`, no usar hex sueltos):
  - Base: fondo `bone` (crema cálido), texto `ink`, secundario `stone`, bordes `line`.
  - Marca, SOLO decorativo (fondos, bordes, degradados, íconos grandes): `mango` #FD8927 y `fucsia` #F27084
    (los colores exactos del logo). Degradado de marca: `bg-brand` (mango → fucsia).
  - Marca para TEXTO y botones con texto blanco (pasan AA): `mango-deep` #C2410C, `fucsia-deep` #BE185D.
    Degradado de texto: `text-gradient` (mango-deep → fucsia-deep). Son variables CSS editables desde
    Ajustes → "Colores de la marca": NO escribir estos hex en los componentes, usar siempre los tokens.
  - Colecciones: cada una elige un tema, `brand` o `marina` (`COLLECTION_THEMES` en `utils/collections.js`,
    con las clases escritas completas para que Tailwind las genere). `marina` (decorativo) / `marina-deep` (texto).
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
