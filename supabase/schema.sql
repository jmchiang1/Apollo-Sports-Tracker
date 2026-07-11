-- Apollo Launch Cockpit — cloud sync schema.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to re-run.
--
-- The table is namespaced (apollo_*) so this can share a Supabase project with
-- other apps without colliding with their tables.

-- One JSON blob per user, holding the whole app state (task status/notes, capital).
create table if not exists public.apollo_app_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Lock the table down: a user may only ever touch their own row.
alter table public.apollo_app_state enable row level security;

drop policy if exists "apollo_app_state select own" on public.apollo_app_state;
drop policy if exists "apollo_app_state insert own" on public.apollo_app_state;
drop policy if exists "apollo_app_state update own" on public.apollo_app_state;
drop policy if exists "apollo_app_state delete own" on public.apollo_app_state;

create policy "apollo_app_state select own" on public.apollo_app_state
  for select using (auth.uid() = user_id);

create policy "apollo_app_state insert own" on public.apollo_app_state
  for insert with check (auth.uid() = user_id);

create policy "apollo_app_state update own" on public.apollo_app_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "apollo_app_state delete own" on public.apollo_app_state
  for delete using (auth.uid() = user_id);
