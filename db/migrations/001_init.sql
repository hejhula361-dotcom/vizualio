-- Vizualio (Supabase Postgres) - initial schema
-- Run this in Supabase SQL editor.

-- Extensions (uuid helpers)
create extension if not exists "pgcrypto";

-- Enums
do $$
begin
  create type public.user_role as enum ('superadmin', 'admin', 'editor');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum ('new', 'in_progress', 'waiting_client', 'done', 'delivered', 'cancelled');
exception
  when duplicate_object then null;
end $$;

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admin users (managed via NextAuth GitHub allowlist)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  image_url text,
  role public.user_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;

-- Clients (created by admins)
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at
before update on public.clients
for each row
execute function public.set_updated_at();

create index if not exists idx_clients_email on public.clients(email);
alter table public.clients enable row level security;

-- Client credentials (username + password_hash)
create table if not exists public.client_auth (
  id uuid primary key default gen_random_uuid(),
  client_id uuid unique not null references public.clients(id) on delete cascade,
  username text unique not null,
  password_hash text not null,
  must_change_password boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_client_auth_updated_at on public.client_auth;
create trigger trg_client_auth_updated_at
before update on public.client_auth
for each row
execute function public.set_updated_at();

alter table public.client_auth enable row level security;

-- Projects per client
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  project_name text not null,
  order_status public.order_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  delivered_at timestamptz
);

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_projects_status on public.projects(order_status);
alter table public.projects enable row level security;

-- Project photos (uploaded by admin, delivered to client)
create table if not exists public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  uploaded_by_user_id uuid references public.users(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

create index if not exists idx_project_photos_project_id on public.project_photos(project_id);
alter table public.project_photos enable row level security;

-- Ratings (1 per project)
create table if not exists public.project_ratings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.projects(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_project_ratings_updated_at on public.project_ratings;
create trigger trg_project_ratings_updated_at
before update on public.project_ratings
for each row
execute function public.set_updated_at();

create index if not exists idx_project_ratings_client_id on public.project_ratings(client_id);
alter table public.project_ratings enable row level security;

-- Inquiries (contact form submissions)
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_type text,
  idea text not null,
  message text,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);
alter table public.inquiries enable row level security;

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content jsonb,
  cover_image_path text,
  published boolean not null default false,
  published_at timestamptz,
  author_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

create index if not exists idx_blog_posts_published on public.blog_posts(published, published_at desc);
alter table public.blog_posts enable row level security;

-- RLS policies
-- Note: We primarily use server-side access (SUPABASE_SERVICE_ROLE_KEY), which bypasses RLS.
-- Still, for public blog rendering you may want a safe read policy:
drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts"
on public.blog_posts
for select
to anon
using (published = true);

