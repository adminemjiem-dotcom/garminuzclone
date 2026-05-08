
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "user_roles read self" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "user_roles admin write" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Trigger: first user becomes admin automatically
create or replace function public.handle_new_user_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.user_roles where role = 'admin') = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_admin();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text default '',
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger categories_updated before update on public.categories
  for each row execute function public.set_updated_at();

-- Products
create table public.products (
  id text primary key,
  name text not null,
  tagline text default '',
  price bigint not null default 0,
  category text references public.categories(slug) on update cascade on delete set null,
  image_path text default '',
  featured boolean not null default false,
  description text default '',
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products public read" on public.products for select using (true);
create policy "products admin write" on public.products for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();
create index products_category_idx on public.products(category);

-- Banners
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text default '',
  image_path text not null,
  link_product_id text references public.products(id) on delete set null,
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.banners enable row level security;
create policy "banners public read active" on public.banners for select using (active = true or public.has_role(auth.uid(), 'admin'));
create policy "banners admin write" on public.banners for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger banners_updated before update on public.banners
  for each row execute function public.set_updated_at();

-- Branches / store locations
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  phone text default '',
  hours text default '',
  map_url text default '',
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.branches enable row level security;
create policy "branches public read" on public.branches for select using (true);
create policy "branches admin write" on public.branches for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger branches_updated before update on public.branches
  for each row execute function public.set_updated_at();

-- Site settings (single row, id = 1)
create table public.site_settings (
  id int primary key default 1,
  phone text default '',
  email text default '',
  address text default '',
  facebook_url text default '',
  instagram_url text default '',
  youtube_url text default '',
  telegram_url text default '',
  telegram_chat_id text default '',
  telegram_bot_token text default '',
  footer_text text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
alter table public.site_settings enable row level security;

-- Public-readable view that excludes the bot token
create view public.site_settings_public with (security_invoker = true) as
  select id, phone, email, address, facebook_url, instagram_url, youtube_url,
         telegram_url, footer_text, updated_at
  from public.site_settings;

-- Only admins can read the full row (with secret token)
create policy "site_settings admin read" on public.site_settings for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "site_settings public read sans secrets" on public.site_settings for select to anon
  using (false);  -- forced through view
create policy "site_settings admin write" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create trigger site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id) values (1);

-- Storage bucket for media (product/banner images)
insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;

create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin write" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
