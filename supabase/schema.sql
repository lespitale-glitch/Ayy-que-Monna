-- =============================================================================
-- Ayy Que Monna — Esquema de base de datos (Supabase / PostgreSQL)
-- =============================================================================
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO este archivo → Run.
-- Es seguro ejecutarlo más de una vez (usa "if not exists" y "drop ... if exists").
--
-- Modelo de seguridad (RLS = Row Level Security):
--   · Cualquier visitante puede LEER los productos visibles.
--   · Solo la administradora (registrada en public.admins) puede crear, editar,
--     ocultar, borrar y reordenar productos y colecciones, y subir/borrar fotos del Storage.
-- La "anon key" del frontend es pública por diseño: lo que protege los datos son estas políticas.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Tabla de productos
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  -- Slug legible que se usa en la URL: /producto/anillo-ola
  id          text primary key
              check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null check (length(trim(name)) > 0),
  description text not null default '',
  price       integer not null check (price > 0),           -- en pesos argentinos (ARS)
  category    text not null
              check (category in ('aros', 'collares', 'anillos', 'pulseras')),
  -- Rutas a las fotos: '/products/x.jpg' (fotos originales en public/)
  -- o URLs completas del Storage de Supabase (fotos nuevas del panel).
  images      text[] not null default '{}',
  is_featured boolean not null default false,
  is_new      boolean not null default false,
  collections text[] not null default '{}',                 -- ids de colecciones (sección 7)
  is_visible  boolean not null default true,                -- false = oculto en la tienda
  position    integer not null default 0,                   -- orden del catálogo (drag & drop)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- Un producto visible tiene que tener al menos una foto
  constraint products_visible_needs_image
    check (not is_visible or cardinality(images) >= 1)
);

create index if not exists products_position_idx on public.products (position);

-- Mantiene updated_at al día en cada edición
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 2. Administradora
-- -----------------------------------------------------------------------------
-- Lista de usuarios con permisos de administración. Tiene RLS activado y
-- ninguna política: nadie puede leerla ni modificarla desde la API pública.
-- El alta se hace a mano desde el SQL Editor (ver README, Paso 0).
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- ¿El usuario con sesión iniciada es administrador?
-- "security definer" permite consultar public.admins aunque la tabla esté cerrada.
-- El frontend lo llama con supabase.rpc('is_admin').
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- -----------------------------------------------------------------------------
-- 3. Permisos y políticas RLS de products
-- -----------------------------------------------------------------------------
alter table public.products enable row level security;

-- Permisos base de la API (RLS decide después qué filas se ven o se modifican)
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Público: ver productos visibles" on public.products;
create policy "Público: ver productos visibles"
  on public.products for select
  to anon, authenticated
  using (is_visible);

drop policy if exists "Admin: ver todos los productos" on public.products;
create policy "Admin: ver todos los productos"
  on public.products for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin: crear productos" on public.products;
create policy "Admin: crear productos"
  on public.products for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admin: editar productos" on public.products;
create policy "Admin: editar productos"
  on public.products for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin: borrar productos" on public.products;
create policy "Admin: borrar productos"
  on public.products for delete
  to authenticated
  using ((select public.is_admin()));


-- -----------------------------------------------------------------------------
-- 4. Reordenar el catálogo (drag & drop) en una sola operación
-- -----------------------------------------------------------------------------
-- Recibe los ids en el orden nuevo y guarda position = 1, 2, 3...
-- "security invoker": corre con los permisos de quien lo llama, así que las
-- políticas RLS de arriba también se aplican aquí.
create or replace function public.reorder_products(product_ids text[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  update public.products as p
  set position = o.ord
  from unnest(product_ids) with ordinality as o (id, ord)
  where p.id = o.id;
end;
$$;

revoke execute on function public.reorder_products(text[]) from public, anon;
grant execute on function public.reorder_products(text[]) to authenticated;


-- -----------------------------------------------------------------------------
-- 5. Storage: bucket "products" para las fotos nuevas subidas desde el panel
-- -----------------------------------------------------------------------------
-- Bucket público: cualquiera puede VER una foto con su URL.
-- Límite de 5 MB por archivo y solo formatos de imagen.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- No hay política de lectura pública: las URLs públicas funcionan igual en un
-- bucket público, y así nadie puede LISTAR todos los archivos del bucket.
drop policy if exists "Admin: ver fotos del bucket" on storage.objects;
create policy "Admin: ver fotos del bucket"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "Admin: subir fotos" on storage.objects;
create policy "Admin: subir fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "Admin: reemplazar fotos" on storage.objects;
create policy "Admin: reemplazar fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'products' and (select public.is_admin()))
  with check (bucket_id = 'products' and (select public.is_admin()));

drop policy if exists "Admin: borrar fotos" on storage.objects;
create policy "Admin: borrar fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));


-- -----------------------------------------------------------------------------
-- 6. Ajustes de la tienda (una sola fila, editable desde /admin/ajustes)
-- -----------------------------------------------------------------------------
create table if not exists public.store_settings (
  -- Siempre id = 1: la tabla tiene exactamente una fila
  id               smallint primary key default 1 check (id = 1),
  -- Código de país + área + número, sin "+" ni espacios (ej. 5491112345678)
  whatsapp_number  text not null check (whatsapp_number ~ '^[0-9]{10,15}$'),
  -- Usuario de Instagram sin "@"
  instagram_handle text not null default '' check (instagram_handle ~ '^[A-Za-z0-9._]{0,30}$'),
  shipping_enabled boolean not null default true,         -- ¿se hacen envíos?
  shipping_note    text not null default '' check (length(shipping_note) <= 300),
  shipping_from    integer check (shipping_from is null or shipping_from >= 0), -- "desde $…" (opcional)
  pickup_points    text[] not null default '{}'           -- puntos de retiro gratis
                   check (cardinality(pickup_points) <= 10),
  updated_at       timestamptz not null default now()
);

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at
  before update on public.store_settings
  for each row execute function public.set_updated_at();

-- Valores iniciales (los del sitio original). "on conflict do nothing": no pisa lo que se
-- haya cambiado desde el panel si este archivo se vuelve a ejecutar.
insert into public.store_settings (id, whatsapp_number, instagram_handle, shipping_note, shipping_from, pickup_points)
values (
  1,
  '5491112345678', -- ⚠️ número de prueba: cambiarlo desde /admin/ajustes
  'ayyquemonna',
  'Enviamos a todo el país. El costo del envío está a cargo de quien compra y varía según la ubicación.',
  6000,
  array['Ballester', 'Carapachay', 'Belgrano']
)
on conflict (id) do nothing;

alter table public.store_settings enable row level security;
grant select on public.store_settings to anon, authenticated;
grant update on public.store_settings to authenticated;

drop policy if exists "Público: ver ajustes" on public.store_settings;
create policy "Público: ver ajustes"
  on public.store_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin: editar ajustes" on public.store_settings;
create policy "Admin: editar ajustes"
  on public.store_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));


-- -----------------------------------------------------------------------------
-- 7. Colecciones (editables desde /admin/colecciones)
-- -----------------------------------------------------------------------------
-- Un producto puede estar en varias colecciones: products.collections guarda sus ids.
create table if not exists public.collections (
  id           text primary key
               check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         text not null check (length(trim(name)) between 1 and 40),
  description  text not null default '' check (length(description) <= 300),
  -- Color de acento: 'brand' (naranja y fucsia) o 'marina' (turquesa)
  theme        text not null default 'brand' check (theme in ('brand', 'marina')),
  show_on_home boolean not null default true,   -- sección propia en el inicio
  is_visible   boolean not null default true,   -- false = oculta en la tienda
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- Estas direcciones ya las usan las selecciones automáticas (/seleccion/novedades…)
  constraint collections_reserved_id
    check (id not in ('novedades', 'destacados', 'dorados', 'plateados'))
);

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

-- Bases creadas con la versión anterior del archivo no tienen esta columna
alter table public.products add column if not exists collections text[] not null default '{}';

-- Migración desde la versión anterior (columna fija products.collection = 'marina').
-- Solo hace algo si esa columna todavía existe; después la borra.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'collection'
  ) then
    insert into public.collections (id, name, description, theme)
    select distinct
      p.collection,
      initcap(p.collection),
      case when p.collection = 'marina'
        then 'Perlas, conchas y destellos turquesa para llevar el océano con vos.' else '' end,
      case when p.collection = 'marina' then 'marina' else 'brand' end
    from public.products as p
    where p.collection is not null
    on conflict (id) do nothing;

    update public.products
    set collections = array[collection]
    where collection is not null and cardinality(collections) = 0;

    alter table public.products drop column collection;
  end if;
end;
$$;

-- Un producto solo puede apuntar a colecciones que existen
create or replace function public.check_product_collections()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from unnest(new.collections) as c (id)
    where not exists (select 1 from public.collections as col where col.id = c.id)
  ) then
    raise exception 'El producto usa una colección que no existe' using errcode = '23503';
  end if;
  return new;
end;
$$;

drop trigger if exists products_check_collections on public.products;
create trigger products_check_collections
  before insert or update of collections on public.products
  for each row execute function public.check_product_collections();

-- Al borrar una colección, se quita sola de los productos que la tenían
create or replace function public.remove_deleted_collection()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.products
  set collections = array_remove(collections, old.id)
  where old.id = any (collections);
  return old;
end;
$$;

drop trigger if exists collections_remove_from_products on public.collections;
create trigger collections_remove_from_products
  after delete on public.collections
  for each row execute function public.remove_deleted_collection();

alter table public.collections enable row level security;
grant select on public.collections to anon, authenticated;
grant insert, update, delete on public.collections to authenticated;

drop policy if exists "Público: ver colecciones visibles" on public.collections;
create policy "Público: ver colecciones visibles"
  on public.collections for select
  to anon, authenticated
  using (is_visible);

drop policy if exists "Admin: ver todas las colecciones" on public.collections;
create policy "Admin: ver todas las colecciones"
  on public.collections for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin: crear colecciones" on public.collections;
create policy "Admin: crear colecciones"
  on public.collections for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admin: editar colecciones" on public.collections;
create policy "Admin: editar colecciones"
  on public.collections for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin: borrar colecciones" on public.collections;
create policy "Admin: borrar colecciones"
  on public.collections for delete
  to authenticated
  using ((select public.is_admin()));

-- Guarda el orden de las colecciones (igual que reorder_products)
create or replace function public.reorder_collections(collection_ids text[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  update public.collections as c
  set position = o.ord
  from unnest(collection_ids) with ordinality as o (id, ord)
  where c.id = o.id;
end;
$$;

revoke execute on function public.reorder_collections(text[]) from public, anon;
grant execute on function public.reorder_collections(text[]) to authenticated;

-- Define QUÉ productos tiene una colección, en una sola operación:
-- la agrega a los de la lista y la quita de los demás.
create or replace function public.set_collection_products(collection_id text, product_ids text[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  update public.products
  set collections = array_remove(collections, collection_id)
  where collection_id = any (collections) and not (id = any (product_ids));

  update public.products
  set collections = collections || collection_id
  where id = any (product_ids) and not (collection_id = any (collections));
end;
$$;

revoke execute on function public.set_collection_products(text, text[]) from public, anon;
grant execute on function public.set_collection_products(text, text[]) to authenticated;



-- -----------------------------------------------------------------------------
-- 8. Preguntas frecuentes (bot y página /preguntas-frecuentes)
-- -----------------------------------------------------------------------------
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null check (length(trim(question)) between 3 and 200),
  -- Puede incluir {envios}, {retiro} e {instagram}: la tienda los completa con los Ajustes
  answer     text not null check (length(trim(answer)) between 1 and 1000),
  -- Palabras o frases con las que la gente suele preguntar esto (ayudan al bot a encontrarla)
  keywords   text[] not null default '{}' check (cardinality(keywords) <= 30),
  is_visible boolean not null default true,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

alter table public.faqs enable row level security;
grant select on public.faqs to anon, authenticated;
grant insert, update, delete on public.faqs to authenticated;

drop policy if exists "Público: ver preguntas visibles" on public.faqs;
create policy "Público: ver preguntas visibles"
  on public.faqs for select
  to anon, authenticated
  using (is_visible);

drop policy if exists "Admin: ver todas las preguntas" on public.faqs;
create policy "Admin: ver todas las preguntas"
  on public.faqs for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin: crear preguntas" on public.faqs;
create policy "Admin: crear preguntas"
  on public.faqs for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admin: editar preguntas" on public.faqs;
create policy "Admin: editar preguntas"
  on public.faqs for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin: borrar preguntas" on public.faqs;
create policy "Admin: borrar preguntas"
  on public.faqs for delete
  to authenticated
  using ((select public.is_admin()));

create or replace function public.reorder_faqs(faq_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  update public.faqs as f
  set position = o.ord
  from unnest(faq_ids) with ordinality as o (id, ord)
  where f.id = o.id;
end;
$$;

revoke execute on function public.reorder_faqs(uuid[]) from public, anon;
grant execute on function public.reorder_faqs(uuid[]) to authenticated;


-- -----------------------------------------------------------------------------
-- 9. Preguntas que el bot no supo responder (anónimas)
-- -----------------------------------------------------------------------------
-- Solo se guarda el texto de la pregunta y la fecha: nada que identifique a la persona
-- (ni usuario, ni IP). Cualquiera puede AGREGAR; solo la administradora puede verlas.
create table if not exists public.bot_questions (
  id          bigint generated always as identity primary key,
  question    text not null check (length(question) between 2 and 300),
  times_asked integer not null default 1 check (times_asked >= 1),
  is_resolved boolean not null default false,
  created_at  timestamptz not null default now(),
  last_asked  timestamptz not null default now()
);

-- Antes de guardar: frena abusos y junta las preguntas repetidas.
-- "security definer" le permite contar y actualizar filas que el visitante no puede ver.
create or replace function public.before_bot_question()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Límite general contra el spam: como máximo 30 preguntas nuevas por minuto
  if (select count(*) from public.bot_questions where last_asked > now() - interval '1 minute') >= 30 then
    raise exception 'Demasiadas preguntas seguidas' using errcode = '54000';
  end if;

  -- Si la misma pregunta ya está pendiente, sumamos una vez más en lugar de repetirla
  update public.bot_questions
  set times_asked = times_asked + 1, last_asked = now()
  where not is_resolved and lower(trim(question)) = lower(trim(new.question));
  if found then
    return null; -- null = no insertar la fila nueva
  end if;

  new.question := trim(new.question);
  new.times_asked := 1;
  new.is_resolved := false;
  return new;
end;
$$;

drop trigger if exists bot_questions_before_insert on public.bot_questions;
create trigger bot_questions_before_insert
  before insert on public.bot_questions
  for each row execute function public.before_bot_question();

alter table public.bot_questions enable row level security;
-- Solo se da permiso sobre la columna "question": el resto lo completa la base
grant insert (question) on public.bot_questions to anon, authenticated;
grant select, update, delete on public.bot_questions to authenticated;

drop policy if exists "Público: enviar preguntas sin respuesta" on public.bot_questions;
create policy "Público: enviar preguntas sin respuesta"
  on public.bot_questions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admin: ver preguntas sin respuesta" on public.bot_questions;
create policy "Admin: ver preguntas sin respuesta"
  on public.bot_questions for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin: editar preguntas sin respuesta" on public.bot_questions;
create policy "Admin: editar preguntas sin respuesta"
  on public.bot_questions for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin: borrar preguntas sin respuesta" on public.bot_questions;
create policy "Admin: borrar preguntas sin respuesta"
  on public.bot_questions for delete
  to authenticated
  using ((select public.is_admin()));

-- Interruptor del bot en Ajustes
alter table public.store_settings add column if not exists bot_enabled boolean not null default true;

-- Avisa a la API de Supabase que la estructura cambió (columnas nuevas o borradas)
notify pgrst, 'reload schema';
