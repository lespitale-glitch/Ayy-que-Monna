-- =============================================================================
-- Ayy Que Monna — Esquema de base de datos (Supabase / PostgreSQL)
-- =============================================================================
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO este archivo → Run.
-- Es seguro ejecutarlo más de una vez (usa "if not exists" y "drop ... if exists").
--
-- Modelo de seguridad (RLS = Row Level Security):
--   · Cualquier visitante puede LEER los productos visibles.
--   · Solo la administradora (registrada en public.admins) puede crear, editar,
--     ocultar, borrar y reordenar productos, y subir/borrar fotos del Storage.
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
  collection  text check (collection in ('marina')),        -- null = sin colección
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
