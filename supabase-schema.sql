-- MORA PEDIDOS — base de datos online
-- Ejecutá todo este archivo en Supabase > SQL Editor.

create table if not exists public.mora_settings (
  id bigint primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.mora_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  created_at timestamptz not null default now(),
  status text not null default 'nuevo' check (status in ('nuevo','confirmado','preparando','listo','enviado','entregado','cancelado')),
  total numeric not null default 0,
  customer jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  message text not null default '',
  metadata jsonb not null default '{}'::jsonb
);

alter table public.mora_settings enable row level security;
alter table public.mora_orders enable row level security;

drop policy if exists "Public can read Mora settings" on public.mora_settings;
create policy "Public can read Mora settings"
on public.mora_settings for select
using (true);

drop policy if exists "Authenticated can manage Mora settings" on public.mora_settings;
create policy "Authenticated can manage Mora settings"
on public.mora_settings for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create Mora orders" on public.mora_orders;
create policy "Public can create Mora orders"
on public.mora_orders for insert
with check (true);

drop policy if exists "Authenticated can manage Mora orders" on public.mora_orders;
create policy "Authenticated can manage Mora orders"
on public.mora_orders for all
 to authenticated
using (true)
with check (true);

insert into public.mora_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
