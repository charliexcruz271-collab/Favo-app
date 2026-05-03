-- ============================================================
-- FAVO APP — Esquema de base de datos para Supabase
-- Ejecuta esto en: Supabase → SQL Editor → New Query
-- ============================================================

-- 1. USUARIOS
create table public.usuarios (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  codigo        text unique not null,
  nombre        text not null,
  telefono      text not null,
  carrera       text not null,
  semestre      text not null,
  tipo          text not null check (tipo in ('cliente','prestador','ambos')),
  rating_prom   numeric(3,2) default 5.0,
  total_favores int default 0,
  avatar_url    text,
  created_at    timestamptz default now()
);

-- 2. HABILIDADES del prestador
create table public.habilidades (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid references public.usuarios(id) on delete cascade,
  categoria   text not null,  -- musica, idiomas, arte, etc.
  detalle     text,           -- "Guitarra clásica", "Inglés B2"
  otras       text,
  created_at  timestamptz default now()
);

-- 3. CATEGORÍAS de favores (datos fijos)
create table public.categorias (
  id          text primary key,  -- academico, diseno, tech, etc.
  nombre      text not null,
  icon        text not null,
  precio_min  int not null,
  precio_max  int not null,
  anti_plagio boolean default false
);

insert into public.categorias values
  ('academico',  'Académico',            '📚', 10000, 50000,  true),
  ('diseno',     'Diseño',               '🎨', 15000, 80000,  true),
  ('tech',       'Tech',                 '💻', 15000, 100000, false),
  ('mandados',   'Mandados y Trámites',  '🏃', 3000,  25000,  false),
  ('habilidades','Habilidades',          '🏋️', 10000, 50000,  false),
  ('prestamo',   'Préstamo de objetos',  '📦', 5000,  40000,  false);

-- 4. FAVORES (solicitudes)
create table public.favores (
  id              uuid primary key default gen_random_uuid(),
  cliente_id      uuid references public.usuarios(id),
  prestador_id    uuid references public.usuarios(id),
  categoria_id    text references public.categorias(id),
  descripcion     text not null,
  carrera_filtro  text,
  precio_oferta   int not null,
  precio_final    int,
  hora_inicio     time,
  fecha_limite    date,
  hora_limite     time,
  estado          text default 'pendiente'
    check (estado in ('pendiente','negociando','aceptado','en_curso','completado','cancelado')),
  created_at      timestamptz default now()
);

-- 5. NEGOCIACIONES (ofertas y contraofertas)
create table public.negociaciones (
  id          uuid primary key default gen_random_uuid(),
  favor_id    uuid references public.favores(id) on delete cascade,
  usuario_id  uuid references public.usuarios(id),
  tipo        text check (tipo in ('oferta','contraoferta')),
  monto       int not null,
  aceptado    boolean default false,
  created_at  timestamptz default now()
);

-- 6. MENSAJES de chat
create table public.mensajes (
  id          uuid primary key default gen_random_uuid(),
  favor_id    uuid references public.favores(id) on delete cascade,
  remitente   uuid references public.usuarios(id),
  contenido   text not null,
  leido       boolean default false,
  created_at  timestamptz default now()
);

-- 7. CALIFICACIONES
create table public.calificaciones (
  id              uuid primary key default gen_random_uuid(),
  favor_id        uuid references public.favores(id),
  calificador_id  uuid references public.usuarios(id),
  calificado_id   uuid references public.usuarios(id),
  estrellas       int check (estrellas between 1 and 5),
  resena          text,
  created_at      timestamptz default now()
);

-- 8. TRANSACCIONES
create table public.transacciones (
  id            uuid primary key default gen_random_uuid(),
  favor_id      uuid references public.favores(id),
  pagador_id    uuid references public.usuarios(id),
  receptor_id   uuid references public.usuarios(id),
  monto_total   int not null,
  comision_favo int not null,  -- lo que se queda la app
  monto_neto    int not null,  -- lo que recibe el prestador
  estado        text default 'retenido'
    check (estado in ('retenido','liberado','reembolsado')),
  created_at    timestamptz default now()
);

-- 9. OBJETOS en préstamo
create table public.objetos (
  id          uuid primary key default gen_random_uuid(),
  dueno_id    uuid references public.usuarios(id),
  nombre      text not null,
  descripcion text,
  foto_url    text,
  precio_dia  int not null,
  deposito    int not null,
  disponible  boolean default true,
  created_at  timestamptz default now()
);

-- 10. UBICACIONES en tiempo real
create table public.ubicaciones (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid references public.usuarios(id) unique,
  lat         numeric(10,7),
  lng         numeric(10,7),
  activo      boolean default false,
  updated_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — seguridad por usuario
-- ============================================================

alter table public.usuarios       enable row level security;
alter table public.favores        enable row level security;
alter table public.mensajes       enable row level security;
alter table public.negociaciones  enable row level security;
alter table public.calificaciones enable row level security;
alter table public.transacciones  enable row level security;
alter table public.objetos        enable row level security;
alter table public.ubicaciones    enable row level security;

-- Usuarios: cualquiera puede ver perfiles
create policy "Perfiles públicos" on public.usuarios
  for select using (true);

create policy "Usuario crea su perfil" on public.usuarios
  for insert with check (auth.uid() = id);

create policy "Usuario edita su perfil" on public.usuarios
  for update using (auth.uid() = id);

-- Favores: el cliente o prestador pueden ver sus favores
create policy "Ver favores propios" on public.favores
  for select using (
    auth.uid() = cliente_id or auth.uid() = prestador_id
  );

create policy "Crear favor" on public.favores
  for insert with check (auth.uid() = cliente_id);

create policy "Actualizar favor" on public.favores
  for update using (
    auth.uid() = cliente_id or auth.uid() = prestador_id
  );

-- Mensajes: solo participantes del favor
create policy "Ver mensajes del favor" on public.mensajes
  for select using (
    exists (
      select 1 from public.favores f
      where f.id = favor_id
      and (auth.uid() = f.cliente_id or auth.uid() = f.prestador_id)
    )
  );

create policy "Enviar mensajes" on public.mensajes
  for insert with check (auth.uid() = remitente);

-- Objetos: públicos para ver, solo dueño edita
create policy "Ver objetos" on public.objetos
  for select using (true);

create policy "Gestionar objeto propio" on public.objetos
  for all using (auth.uid() = dueno_id);

-- Ubicaciones: solo cuando activo
create policy "Ver ubicación activa" on public.ubicaciones
  for select using (activo = true);

create policy "Actualizar propia ubicación" on public.ubicaciones
  for all using (auth.uid() = usuario_id);

-- ============================================================
-- POLÍTICAS ADICIONALES — ejecutar en Supabase SQL Editor
-- ============================================================

-- Permitir que prestadores acepten favores pendientes
drop policy if exists "Actualizar favor" on public.favores;
create policy "Actualizar favor" on public.favores
  for update using (
    auth.uid() = cliente_id or
    auth.uid() = prestador_id or
    (estado = 'pendiente' and exists (
      select 1 from public.usuarios
      where id = auth.uid() and tipo in ('prestador','ambos')
    ))
  );

-- Negociaciones: insertar y ver
create policy "Insertar negociacion" on public.negociaciones
  for insert with check (auth.uid() = usuario_id);

create policy "Ver negociaciones" on public.negociaciones
  for select using (
    auth.uid() = usuario_id
    or exists (
      select 1 from public.favores
      where id = favor_id and auth.uid() = cliente_id
    )
  );

-- Transacciones: ver las propias e insertar al aceptar un favor
create policy "Ver transacciones propias" on public.transacciones
  for select using (auth.uid() = pagador_id or auth.uid() = receptor_id);

create policy "Insertar transaccion" on public.transacciones
  for insert with check (
    exists (
      select 1 from public.favores
      where id = favor_id
        and (auth.uid() = cliente_id or auth.uid() = prestador_id)
    )
  );

-- Habilitar realtime para postgres_changes
alter publication supabase_realtime add table public.favores;
alter publication supabase_realtime add table public.negociaciones;
