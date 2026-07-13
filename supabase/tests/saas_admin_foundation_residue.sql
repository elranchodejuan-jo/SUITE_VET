begin;
create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;
select plan(1);

create temporary table hito33_residue_total (
  total bigint not null
) on commit drop;

do $$
declare
  temporary_ids constant uuid[] := array[
    '41000000-0000-4000-8000-000000000001'::uuid,
    '42000000-0000-4000-8000-000000000002'::uuid
  ];
  total_count bigint := 0;
  partial_count bigint := 0;
  check_row record;
begin
  select count(*) into partial_count
  from auth.users
  where id = any(temporary_ids)
     or email in ('hito33-admin@example.test', 'hito33-student@example.test');
  total_count := total_count + partial_count;

  select count(*) into partial_count from auth.identities where user_id = any(temporary_ids);
  total_count := total_count + partial_count;
  select count(*) into partial_count from auth.sessions where user_id = any(temporary_ids);
  total_count := total_count + partial_count;
  select count(*) into partial_count from public.profiles where id = any(temporary_ids);
  total_count := total_count + partial_count;
  select count(*) into partial_count from public.user_roles where user_id = any(temporary_ids);
  total_count := total_count + partial_count;
  select count(*) into partial_count from public.user_feedback where user_id = any(temporary_ids);
  total_count := total_count + partial_count;

  for check_row in
    select *
    from (values
      ('public.account_directory', 'select count(*) from public.account_directory where user_id = any($1)'),
      ('public.subscriptions', 'select count(*) from public.subscriptions where user_id = any($1)'),
      ('public.payments', 'select count(*) from public.payments where user_id = any($1)'),
      ('public.usage_events', 'select count(*) from public.usage_events where user_id = any($1)'),
      ('public.audit_events', 'select count(*) from public.audit_events where actor_user_id = any($1) or metadata ->> ''user_id'' = any($1::text[])')
    ) as checks(relation_name, query_text)
  loop
    if to_regclass(check_row.relation_name) is not null then
      execute check_row.query_text into partial_count using temporary_ids;
      total_count := total_count + partial_count;
    end if;
  end loop;

  insert into hito33_residue_total (total) values (total_count);
end;
$$;

select is(
  (select total from hito33_residue_total),
  0::bigint,
  'remote pgTAP rollback left zero Hito 3.3 users, identities, sessions, profiles, roles, SaaS rows, telemetry, audit and feedback'
);

select * from finish();
rollback;
