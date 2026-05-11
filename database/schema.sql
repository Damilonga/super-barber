create extension if not exists "pgcrypto";

create type user_role as enum ('super_admin', 'barbearia_admin');
create type barbershop_status as enum ('ativa', 'inativa', 'bloqueada');
create type appointment_status as enum (
  'agendado',
  'confirmado',
  'atendido',
  'cancelado',
  'ausente'
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  role user_role not null default 'barbearia_admin',
  barbershop_id uuid,
  first_access boolean not null default true,
  status text not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role user_role not null default 'barbearia_admin',
  barbershop_id uuid,
  first_access boolean not null default true,
  status text not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.barbershops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_name text not null,
  email text not null,
  phone text not null,
  address text,
  logo_url text,
  primary_color text not null default '#2563eb',
  secondary_color text not null default '#0f172a',
  public_intro text,
  plan text not null default 'Start',
  status barbershop_status not null default 'ativa',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_barbershop_id_fkey
  foreign key (barbershop_id) references public.barbershops(id) on delete set null;

alter table public.users
  add constraint users_barbershop_id_fkey
  foreign key (barbershop_id) references public.barbershops(id) on delete set null;

create table public.barbers (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  name text not null,
  photo_url text,
  phone text,
  specialties text[] not null default '{}',
  status text not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  status text not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.available_hours (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  barber_id uuid not null references public.barbers(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  interval_minutes integer not null default 30,
  active boolean not null default true
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  barber_id uuid not null references public.barbers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status appointment_status not null default 'agendado',
  value numeric(10, 2) not null check (value >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (barber_id, appointment_date, start_time)
);

create index idx_barbershops_slug on public.barbershops(slug);
create index idx_users_email on public.users(email);
create index idx_users_barbershop_id on public.users(barbershop_id);
create index idx_sessions_user_id on public.sessions(user_id);
create index idx_sessions_expires_at on public.sessions(expires_at);
create index idx_barbers_barbershop_id on public.barbers(barbershop_id);
create index idx_services_barbershop_id on public.services(barbershop_id);
create index idx_appointments_barbershop_date on public.appointments(barbershop_id, appointment_date);
create index idx_appointments_barber_date on public.appointments(barber_id, appointment_date);

-- As permissoes serao aplicadas na camada de backend do Next.js.
-- RLS pode ser adicionada depois com roles especificas do Neon.
