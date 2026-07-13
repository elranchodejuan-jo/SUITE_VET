begin;
create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;
select plan(34);

insert into auth.users (
    id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'user-a@example.test', '', '{}', '{"display_name":"  User A  ","role":"super_admin"}', now(), now()),
('20000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'user-b@example.test', '', '{}', '{"display_name":"User B"}', now(), now());

select ok(
    (
        select relrowsecurity from pg_class
        where oid = 'public.profiles'::regclass
    )
    and (
        select relrowsecurity from pg_class
        where oid = 'public.user_roles'::regclass
    ),
    '1. RLS is enabled on both identity tables'
);

select ok(
    not has_table_privilege('anon', 'public.profiles', 'SELECT'),
    '2. anonymous cannot read profiles'
);

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
set local role authenticated;
select is((
    select count(*) from public.profiles
    where id = auth.uid()
), 1::bigint, '3. user A reads own profile');
select is((
    select count(*) from public.profiles
    where id = '20000000-0000-4000-8000-000000000002'
), 0::bigint, '4. user A cannot read user B profile');
select lives_ok(
    $$update public.profiles set career = 'Medicina Veterinaria' where id = auth.uid()$$,
    '5. user A updates own profile'
);
update public.profiles set career = 'Unauthorized change'
where id = '20000000-0000-4000-8000-000000000002';
set local role postgres;
select is((
    select career from public.profiles
    where id = '20000000-0000-4000-8000-000000000002'
), null, '6. user A cannot update user B');

set local role authenticated;
select throws_ok(
    $$update public.profiles set id = '30000000-0000-4000-8000-000000000003' where id = auth.uid()$$,
    '42501',
    null,
    '7. user cannot modify profile id'
);
select throws_ok(
    $$insert into public.profiles (id) values ('30000000-0000-4000-8000-000000000003')$$,
    '42501',
    null,
    '8. user cannot insert arbitrary profile'
);
select is((
    select count(*) from public.user_roles
    where user_id = auth.uid()
), 1::bigint, '9. user reads own roles');
select is((
    select count(*) from public.user_roles
    where user_id = '20000000-0000-4000-8000-000000000002'
), 0::bigint, '10. user cannot read roles of another user');
select throws_ok(
    $$insert into public.user_roles (user_id, role) values (auth.uid(), 'admin')$$,
    '42501',
    null,
    '11. user cannot self-assign admin'
);
select throws_ok(
    $$insert into public.user_roles (user_id, role) values (auth.uid(), 'super_admin')$$,
    '42501',
    null,
    '12. user cannot self-assign super_admin'
);
select throws_ok(
    $$update public.user_roles set role = 'admin' where user_id = auth.uid()$$,
    '42501',
    null,
    '13. user cannot update own role'
);
select throws_ok(
    $$delete from public.user_roles where user_id = auth.uid()$$,
    '42501',
    null,
    '14. user cannot delete own role'
);
set local role postgres;

select is((
    select count(*) from public.profiles
    where id = '10000000-0000-4000-8000-000000000001'
), 1::bigint, '15. auth trigger creates profile');
select is((
    select count(*) from public.user_roles
    where user_id = '10000000-0000-4000-8000-000000000001' and role = 'student'
), 1::bigint, '16. auth trigger assigns student');
select is((
    select count(*) from public.user_roles
    where user_id = '10000000-0000-4000-8000-000000000001' and role = 'super_admin'
), 0::bigint, '17. privileged role metadata is ignored');
delete from auth.users
where id = '20000000-0000-4000-8000-000000000002';
select ok(
    not exists (
        select 1 from public.profiles
        where id = '20000000-0000-4000-8000-000000000002'
    )
    and not exists (
        select 1 from public.user_roles
        where user_id = '20000000-0000-4000-8000-000000000002'
    ),
    '18. deleting auth user cascades identity rows'
);

set local role authenticated;
select throws_ok(
    $$select private.has_role('student')$$,
    '42501',
    null,
    '19. authenticated cannot execute the private role helper directly'
);
set local role postgres;
select ok(
    to_regprocedure('public.has_role(public.app_role)') is null,
    '20. the role helper is absent from the exposed public schema'
);
select ok(
    to_regprocedure('private.has_role(uuid,public.app_role)') is null,
    '21. no helper overload accepts a client-supplied user id'
);
select ok(private.has_role('student'), '22. helper is true for the current user role');
select ok(not private.has_role('admin'), '23. helper is false for an unassigned role');

set local role authenticated;
update public.profiles set semester = 'Tercero'
where id = auth.uid();
set local role postgres;
select ok(
    (
        select updated_at > created_at from public.profiles
        where id = '10000000-0000-4000-8000-000000000001'
    ),
    '24. updated_at advances after update'
);

select ok(
    not has_function_privilege('anon', 'private.has_role(public.app_role)', 'EXECUTE'),
    '25. anonymous cannot execute the private role helper'
);
select ok(
    not has_function_privilege('authenticated', 'private.has_role(public.app_role)', 'EXECUTE'),
    '26. authenticated has no direct execute grant on the private helper'
);
select ok(
    not has_function_privilege('service_role', 'private.has_role(public.app_role)', 'EXECUTE'),
    '27. service_role has no unnecessary direct execute grant'
);
select ok(
    not has_schema_privilege('anon', 'private', 'USAGE')
    and not has_schema_privilege('authenticated', 'private', 'USAGE')
    and not has_schema_privilege('service_role', 'private', 'USAGE')
    and not has_schema_privilege('anon', 'private', 'CREATE')
    and not has_schema_privilege('authenticated', 'private', 'CREATE')
    and not has_schema_privilege('service_role', 'private', 'CREATE'),
    '28. client roles cannot use or create objects in the private schema'
);
select ok(
    (
        select p.prosecdef
            and p.provolatile = 's'
            and p.prorettype = 'boolean'::regtype
            and p.pronargs = 1
            and p.proargtypes[0] = 'public.app_role'::regtype
            and cardinality(p.proconfig) = 1
            and p.proconfig[1] in ('search_path=', 'search_path=""')
        from pg_proc as p
        where p.oid = 'private.has_role(public.app_role)'::regprocedure
    ),
    '29. private helper is stable, boolean, single-role and uses an empty search_path'
);
select ok(
    (
        select owner.rolname not in ('anon', 'authenticated', 'service_role')
            and (
                owner.rolsuper
                or owner.rolbypassrls
                or p.proowner = roles_table.relowner
            )
            and not roles_table.relforcerowsecurity
        from pg_proc as p
        join pg_roles as owner on owner.oid = p.proowner
        join pg_class as roles_table on roles_table.oid = 'public.user_roles'::regclass
        where p.oid = 'private.has_role(public.app_role)'::regprocedure
    ),
    '30. helper owner can evaluate roles without recursive RLS and is not a client role'
);
select is(
    (
        select count(*)
        from pg_proc as p
        join pg_namespace as n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.prosecdef
          and (
              has_function_privilege('anon', p.oid, 'EXECUTE')
              or has_function_privilege('authenticated', p.oid, 'EXECUTE')
          )
    ),
    0::bigint,
    '31. exposed schema has no client-executable security definer function'
);
select is(
    (
        select count(*)
        from pg_policies
        where schemaname = 'public'
          and tablename in ('profiles', 'user_roles')
    ),
    3::bigint,
    '32. all existing identity policies remain installed'
);

create temporary table user_roles (
    user_id uuid,
    role public.app_role
);
insert into pg_temp.user_roles (user_id, role)
values ('10000000-0000-4000-8000-000000000001', 'admin');
set local search_path = pg_temp, extensions, public, pg_catalog;
select ok(
    not private.has_role('admin'),
    '33. a same-named object on search_path cannot spoof role authorization'
);
set local search_path = extensions, public, pg_catalog;
drop table pg_temp.user_roles;

select ok(
    not has_function_privilege('anon', 'public.handle_new_user()', 'EXECUTE')
    and not has_function_privilege('anon', 'public.set_updated_at()', 'EXECUTE')
    and not has_function_privilege('anon', 'public.normalize_profile_fields()', 'EXECUTE'),
    '34. anonymous still cannot execute identity trigger functions'
);

select * from finish();
rollback;
