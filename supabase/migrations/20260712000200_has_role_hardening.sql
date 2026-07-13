begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated, service_role;

create or replace function private.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles as assigned_role
    where assigned_role.user_id = auth.uid()
      and assigned_role.role = required_role
  );
$$;

revoke all on function private.has_role(public.app_role)
from public, anon, authenticated, service_role;

drop function if exists public.has_role(public.app_role);

commit;
