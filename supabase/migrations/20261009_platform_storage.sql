-- Run this migration in the Supabase SQL editor before enabling the platform client.
create table if not exists public.platform_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null unique check (display_name in ('Juan Valencia', 'Luis Hernando Barrios'))
);

create table if not exists public.platform_state (
  id smallint primary key default 1 check (id = 1),
  revision bigint not null default 0,
  data jsonb not null default '{"cases":[],"caseFields":[],"caseColumnOrder":[],"deletedCases":[],"tasks":[],"alerts":[],"payments":[],"documents":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

insert into public.platform_state (id) values (1) on conflict (id) do nothing;

alter table public.platform_members enable row level security;
alter table public.platform_state enable row level security;

revoke all on public.platform_members from anon, authenticated;
revoke all on public.platform_state from anon, authenticated;
grant select on public.platform_members to authenticated;
grant select on public.platform_state to authenticated;

create policy "Members can read their own membership"
  on public.platform_members for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Members can read shared platform data"
  on public.platform_state for select to authenticated
  using (exists (
    select 1 from public.platform_members
    where user_id = (select auth.uid())
  ));

create or replace function public.save_platform_state(expected_revision bigint, next_data jsonb)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_revision bigint;
begin
  if auth.uid() is null or not exists (
    select 1 from public.platform_members where user_id = auth.uid()
  ) then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  if jsonb_typeof(next_data) <> 'object'
    or jsonb_typeof(next_data -> 'cases') <> 'array'
    or jsonb_typeof(next_data -> 'tasks') <> 'array'
    or jsonb_typeof(next_data -> 'payments') <> 'array'
    or jsonb_typeof(next_data -> 'documents') <> 'array'
  then
    raise exception 'Datos incompletos' using errcode = '22023';
  end if;

  update public.platform_state
  set data = next_data,
      revision = revision + 1,
      updated_at = now(),
      updated_by = auth.uid()
  where id = 1 and revision = expected_revision
  returning revision into new_revision;

  if new_revision is null then
    raise exception 'revision_conflict' using errcode = 'P0001';
  end if;
  return new_revision;
end;
$$;

revoke all on function public.save_platform_state(bigint, jsonb) from public, anon, authenticated;
grant execute on function public.save_platform_state(bigint, jsonb) to authenticated;
