# PRD — Ayy Que Monna (rediseño)

## Visión
Modernizar la tienda de bijouterie Ayy Que Monna con una estética elegante y minimalista
(referencia: gortaristudio.com), conservando todos los productos e imágenes originales,
y sumar gestión de catálogo y newsletter.

## Usuarios
- **Clienta:** navega el catálogo, ve detalle, compra desde el móvil.
- **Administradora:** gestiona productos y su orden sin tocar código.

## Fase 1 — Setup ✅ (cerrada)
- [x] Repositorio Git conectado a GitHub y primer commit en `main`
- [x] Crear CLAUDE.md y PRD.md
- [x] Scaffold Vite + React + Tailwind + linter
- [x] Configurar tokens de diseño (colores, fuentes, espaciados)
- [x] `.gitignore` (node_modules, dist, .env, .DS_Store, ._*, temporales, fotos originales)
- [x] Sitio original respaldado en el repo `Monna_legacy`
- [x] `products.json` con los 67 productos reales del sitio original
- [x] 67 fotos en `public/products/`, verificadas contra `products.json`
**Hecho cuando:** `npm run dev` levanta una página con fuentes y colores de marca.

## Fase 2 — Frontend e-commerce
- [x] Rutas (React Router), Layout con Header y Footer, `formatPrice`
- [x] Icono de carrito con contador en el Header
- [ ] Home: hero con imagen grande, colecciones destacadas, grid de novedades
- [x] Tienda: ProductCard (4:5, hover, precio ARS) y grid con filtro por categoría
- [x] Página de producto: galería con miniaturas, precio, descripción, cantidad, etiqueta Marina y 404
- [x] "Agregar al carrito" conectado al CartContext (abre el panel)
- [x] Carrito lateral (drawer) con persistencia en localStorage (`ayyquemonna_cart`)
- [x] Checkout por WhatsApp (mensaje con detalle y total)
- [ ] Reemplazar `WHATSAPP_NUMBER` placeholder por el número real antes del deploy
- [ ] Responsive, accesible y con imágenes optimizadas
**Hecho cuando:** se puede navegar y armar un carrito con todos los productos originales.

## Fase 3 — Panel Admin con Drag & Drop
- [ ] Ruta `/admin` protegida con login
- [ ] CRUD de productos (crear, editar, borrar, subir imágenes)
- [ ] Reordenar productos y colecciones con drag & drop (dnd-kit)
- [ ] Backend/persistencia: por decidir (Supabase, Firebase, etc.)
**Hecho cuando:** la administradora cambia el orden en el panel y se refleja en la tienda.

## Fase 4 — Newsletter
- [ ] Formulario de suscripción en el footer y en un modal discreto
- [ ] Integración con proveedor (por decidir: Mailchimp, Brevo, Resend)
- [ ] Mensajes de confirmación y validación de email
**Hecho cuando:** una suscripción queda registrada en el proveedor.

## Fuera de alcance (por ahora)
Multi-idioma, cuentas de cliente, gestión de stock avanzada.

## Preguntas abiertas
- Proveedor de backend y de newsletter
- Dominio y hosting (Vercel/Netlify)
