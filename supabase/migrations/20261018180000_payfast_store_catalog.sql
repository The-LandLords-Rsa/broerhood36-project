create table if not exists public.store_catalog (
  sku text primary key,
  name text not null,
  category text not null,
  price numeric(12, 2) not null check (price > 0),
  is_available boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.store_catalog enable row level security;

revoke all on public.store_catalog from anon, authenticated;
grant all on public.store_catalog to service_role;

alter table public.orders
  add column if not exists payfast_payment_id text;

create unique index if not exists orders_payfast_payment_id_unique
  on public.orders (payfast_payment_id)
  where payfast_payment_id is not null;
