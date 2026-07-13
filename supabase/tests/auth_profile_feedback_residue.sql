begin;
create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;
select plan(1);

create or replace function pg_temp.feedback_residue_count()
returns bigint
language plpgsql
set search_path = ''
as $$
declare residue_count bigint := 0;
begin
  if to_regclass('public.user_feedback') is not null then
    execute $query$
      select count(*)
      from public.user_feedback
      where user_id in (
        '31000000-0000-4000-8000-000000000001'::uuid,
        '32000000-0000-4000-8000-000000000002'::uuid
      )
    $query$ into residue_count;
  end if;
  return residue_count;
end;
$$;

select is(
  (
    (select count(*) from auth.users
      where id in ('31000000-0000-4000-8000-000000000001', '32000000-0000-4000-8000-000000000002')
        or email in ('hito32-a@example.test', 'hito32-b@example.test'))
    + (select count(*) from auth.identities
      where user_id in ('31000000-0000-4000-8000-000000000001', '32000000-0000-4000-8000-000000000002'))
    + (select count(*) from auth.sessions
      where user_id in ('31000000-0000-4000-8000-000000000001', '32000000-0000-4000-8000-000000000002'))
    + (select count(*) from public.profiles
      where id in ('31000000-0000-4000-8000-000000000001', '32000000-0000-4000-8000-000000000002'))
    + (select count(*) from public.user_roles
      where user_id in ('31000000-0000-4000-8000-000000000001', '32000000-0000-4000-8000-000000000002'))
    + pg_temp.feedback_residue_count()
  ),
  0::bigint,
  'remote pgTAP rollback left zero users, identities, sessions, profiles, roles and feedback rows'
);

select * from finish();
rollback;
