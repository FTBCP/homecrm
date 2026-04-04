-- =============================================
-- HomeBase Phase 1 — Database Setup
-- Run this entire script in the Supabase SQL Editor
-- =============================================

-- 1. HOMES TABLE
create table if not exists homes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  address text not null,
  year_built integer,
  sqft integer,
  heating_type text,
  notes text,
  created_at timestamptz not null default now()
);

-- 2. PROVIDERS TABLE
create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  company text,
  trade text not null,
  phone text,
  email text,
  rating integer check (rating >= 1 and rating <= 5),
  recommended boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

-- 3. SERVICE_RECORDS TABLE
create table if not exists service_records (
  id uuid primary key default gen_random_uuid(),
  home_id uuid not null references homes(id) on delete cascade,
  provider_id uuid references providers(id) on delete set null,
  date date not null,
  category text not null,
  description text not null,
  cost numeric(10,2) not null,
  notes text,
  next_recommended_date date,
  created_at timestamptz not null default now()
);

-- 4. ROW LEVEL SECURITY
alter table homes enable row level security;
alter table providers enable row level security;
alter table service_records enable row level security;

-- Homes: users can only access their own homes
create policy "Users can view their own homes"
  on homes for select using (auth.uid() = user_id);
create policy "Users can create their own homes"
  on homes for insert with check (auth.uid() = user_id);
create policy "Users can update their own homes"
  on homes for update using (auth.uid() = user_id);
create policy "Users can delete their own homes"
  on homes for delete using (auth.uid() = user_id);

-- Providers: users can only access their own providers
create policy "Users can view their own providers"
  on providers for select using (auth.uid() = user_id);
create policy "Users can create their own providers"
  on providers for insert with check (auth.uid() = user_id);
create policy "Users can update their own providers"
  on providers for update using (auth.uid() = user_id);
create policy "Users can delete their own providers"
  on providers for delete using (auth.uid() = user_id);

-- Service records: users can only access records for homes they own
create policy "Users can view their own service records"
  on service_records for select using (
    home_id in (select id from homes where user_id = auth.uid())
  );
create policy "Users can create service records for their homes"
  on service_records for insert with check (
    home_id in (select id from homes where user_id = auth.uid())
  );
create policy "Users can update their own service records"
  on service_records for update using (
    home_id in (select id from homes where user_id = auth.uid())
  );
create policy "Users can delete their own service records"
  on service_records for delete using (
    home_id in (select id from homes where user_id = auth.uid())
  );
