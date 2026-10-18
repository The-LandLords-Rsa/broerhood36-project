create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  description text,
  images jsonb not null default '[]'::jsonb,
  is_rental boolean not null default false,
  rental_price_per_day numeric,
  sizes text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_whatsapp text not null,
  customer_email text,
  customer_address text,
  total numeric not null check (total >= 0),
  status text not null default 'pending',
  order_details jsonb not null default '[]'::jsonb,
  is_rental boolean not null default false,
  rental_start date,
  rental_end date,
  courier_name text,
  tracking_number text,
  estimated_delivery text,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.orders add column if not exists courier_name text;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists estimated_delivery text;
alter table public.orders add column if not exists rental_start date;
alter table public.orders add column if not exists rental_end date;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  whatsapp text,
  address text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.profiles enable row level security;

create or replace function public.is_store_owner()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'broer.hood.36@gmail.com'
$$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('products', 'orders', 'profiles')
  loop
    execute format('drop policy %I on %I.%I', existing_policy.policyname, existing_policy.schemaname, existing_policy.tablename);
  end loop;
end
$$;

create policy "public can read products"
  on public.products for select
  using (true);

create policy "owners can manage products"
  on public.products for all
  using (public.is_store_owner())
  with check (public.is_store_owner());

create policy "customers can submit orders"
  on public.orders for insert
  with check (
    (user_id is null or user_id = auth.uid())
    and status <> 'payment_confirmed'
  );

create policy "customers and owners can read orders"
  on public.orders for select
  using (
    user_id = auth.uid()
    or lower(coalesce(customer_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or public.is_store_owner()
  );

create policy "owners can update orders"
  on public.orders for update
  using (public.is_store_owner())
  with check (public.is_store_owner());

create policy "owners can delete orders"
  on public.orders for delete
  using (public.is_store_owner());

create policy "customers can read own profiles"
  on public.profiles for select
  using (
    id = auth.uid()
    or public.is_store_owner()
  );

create policy "customers can manage own profiles"
  on public.profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read images" on storage.objects;
drop policy if exists "allow upload images" on storage.objects;
drop policy if exists "allow update images" on storage.objects;
drop policy if exists "allow delete images" on storage.objects;
drop policy if exists "owners manage product images" on storage.objects;

create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "owners manage product images"
  on storage.objects for all
  using (bucket_id = 'product-images' and public.is_store_owner())
  with check (bucket_id = 'product-images' and public.is_store_owner());
