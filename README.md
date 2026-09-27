# Ayy Que Monna

Tienda online de bijouterie: React 19 + Vite + Tailwind CSS, con Supabase como backend del panel de administración.

- `PRD.md`: fases del proyecto y estado de cada una.
- `CLAUDE.md`: stack, arquitectura y normas de diseño.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y completar con los datos de Supabase (ver Paso 0)
npm run dev                  # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run lint` | Revisa el código con oxlint |
| `npm run db:seed` | Regenera `supabase/seed.sql` a partir de `src/data/products.json` |

---

## Paso 0: configuración inicial de Supabase

Se hace **una sola vez**. Toma unos 15 minutos. Los nombres de los menús de Supabase pueden
cambiar un poco con el tiempo; si algo no coincide, busca la opción equivalente.

### 1. Crear el proyecto
1. Entra a [supabase.com](https://supabase.com) e inicia sesión (puedes usar tu cuenta de GitHub).
2. **New project** y completa:
   - **Name:** `ayy-que-monna`
   - **Database password:** genera una segura y **guárdala** en un gestor de contraseñas.
   - **Region:** `South America (São Paulo)`, la más cercana a Argentina.
3. Espera 1 o 2 minutos a que el proyecto termine de crearse.

### 2. Crear la base de datos
1. Menú lateral → **SQL Editor** → **New query**.
2. Copia **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql), pégalo y toca **Run**.
   Tiene que decir *Success. No rows returned*.
3. Otra **New query**: pega **todo** [`supabase/seed.sql`](supabase/seed.sql) y toca **Run**.
4. Verifica en **Table Editor** → `products` que haya **67 filas**.
5. En **Storage** tiene que aparecer el bucket **`products`**, marcado como *Public*.

> Los dos archivos se pueden volver a ejecutar sin romper nada. El seed **no** pisa
> productos que ya existan, así que no se pierden las ediciones hechas desde el panel.

### 3. Crear la cuenta de administradora
1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Escribe el email y una contraseña segura, y marca **Auto Confirm User**.
3. Vuelve al **SQL Editor** y ejecuta esto, cambiando el email por el que usaste:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'tu-email@ejemplo.com';
   ```
   Tiene que decir *Success. 1 row affected*. Si dice *0 rows*, revisa que el email sea exactamente el mismo.

### 4. Cerrar el registro público (importante)
El panel es para una sola persona: nadie más debería poder crearse una cuenta.
1. **Authentication** → **Sign In / Providers** (en versiones anteriores: *Settings*).
2. Desactiva **Allow new users to sign up** y guarda.

> Aunque alguien lograra registrarse, no podría modificar nada: solo pueden escribir
> los usuarios que están en la tabla `admins`. Cerrar el registro es una segunda capa de seguridad.

### 5. Conectar la app
1. **Project Settings** → **API** (o **API Keys**).
2. Copia:
   - **Project URL**, algo como `https://abcdefghijklmnop.supabase.co`
   - la clave **anon public**, o la **publishable key** (`sb_publishable_...`) en proyectos nuevos
3. Crea el archivo `.env.local` en la raíz del proyecto (copiando `.env.example`) y complétalo:
   ```bash
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Reinicia `npm run dev`: Vite solo lee `.env.local` al arrancar.

> ⚠️ **Nunca** uses la clave **service_role** / **secret** en este proyecto: saltea todas las
> reglas de seguridad. La clave *anon/publishable* sí es pública por diseño; lo que protege los
> datos son las políticas RLS de `schema.sql`.

---

## Deploy en Vercel

1. En [vercel.com](https://vercel.com): **Add New… → Project** e importa este repositorio.
   Vercel detecta Vite automáticamente.
2. En **Environment Variables** carga `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, con los mismos valores que `.env.local`.
3. **Deploy**.

`vercel.json` redirige todas las rutas a `index.html`. Sin esa regla, abrir directamente una
dirección como `/tienda/aros` o `/admin` daría error 404, porque esas páginas las arma React
Router en el navegador y no existen como archivos en el servidor.

### Antes de publicar
- [ ] Reemplazar `WHATSAPP_NUMBER` en `src/config.js` por el número real de la tienda.
- [ ] Verificar que el registro público de Supabase esté desactivado (Paso 0.4).
