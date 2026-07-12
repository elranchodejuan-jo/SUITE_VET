create type public.app_role as enum ('student', 'reviewer', 'admin', 'super_admin');

create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text check (display_name is null or char_length(display_name) <= 120),
    institution text check (institution is null or char_length(institution) <= 160),
    career text check (career is null or char_length(career) <= 160),
    semester text check (semester is null or char_length(semester) <= 40),
    avatar_path text check (
        avatar_path is null
        or avatar_path ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,63}(/[A-Za-z0-9][A-Za-z0-9_.-]{0,127}){1,4}$'
    ),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.user_roles (
    user_id uuid not null references auth.users (id) on delete cascade,
    role public.app_role not null,
    granted_by uuid references auth.users (id) on delete set null,
    created_at timestamptz not null default now(),
    primary key (user_id, role)
);

create or replace function public.normalize_profile_fields()
returns trigger language plpgsql security invoker set search_path = pg_catalog as $$
begin
  new.display_name := nullif(btrim(new.display_name), '');
  new.institution := nullif(btrim(new.institution), '');
  new.career := nullif(btrim(new.career), '');
  new.semester := nullif(btrim(new.semester), '');
  new.avatar_path := nullif(btrim(new.avatar_path), '');
  return new;
end;
$$;
revoke all on function public.normalize_profile_fields() from public, anon, authenticated;
create trigger profiles_normalize_fields before insert or update on public.profiles
for each row execute function public.normalize_profile_fields();

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = pg_catalog as $$
begin
  new.created_at := old.created_at;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
revoke all on function public.set_updated_at() from public, anon, authenticated;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
set row_security = off
as $$
declare safe_display_name text;
begin
  if jsonb_typeof(new.raw_user_meta_data -> 'display_name') = 'string' then
    safe_display_name := nullif(
      btrim(left(regexp_replace(new.raw_user_meta_data ->> 'display_name', '[[:cntrl:]]', '', 'g'), 120)),
      ''
    );
  end if;
  insert into public.profiles (id, display_name) values (new.id, safe_display_name)
    on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'student')
    on conflict (user_id, role) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.has_role(required_role public.app_role)
returns boolean language sql stable security definer set search_path = pg_catalog as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = required_role);
$$;
revoke all on function public.has_role(public.app_role) from public, anon;
grant execute on function public.has_role(public.app_role) to authenticated;
revoke all on type public.app_role from public, anon, authenticated;
grant usage on type public.app_role to authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());
create policy user_roles_select_own on public.user_roles for select to authenticated using (user_id = auth.uid());

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, institution, career, semester, avatar_path) on table public.profiles to authenticated;
revoke all on table public.user_roles from anon, authenticated;
grant select on table public.user_roles to authenticated;
