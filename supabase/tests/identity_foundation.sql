begin;
create extension if not exists pgtap with schema extensions;
select plan(20);

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

set local role anon;
select is((select count(*) from public.profiles), 0::bigint, '2. anonymous cannot read profiles');
reset role;

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
    $$update public.profiles set career = 'Veterinary Medicine' where id = auth.uid()$$,
    '5. user A updates own profile'
);
update public.profiles set career = 'Unauthorized change'
where id = '20000000-0000-4000-8000-000000000002';
reset role;
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
reset role;

select is((
    select count(*) from public.profiles
    where id = '10000000-0000-4000-8000-000000000001'
), 1::bigint, '13. auth trigger creates profile');
select is((
    select count(*) from public.user_roles
    where user_id = '10000000-0000-4000-8000-000000000001' and role = 'student'
), 1::bigint, '14. auth trigger assigns student');
select is((
    select count(*) from public.user_roles
    where user_id = '10000000-0000-4000-8000-000000000001' and role = 'super_admin'
), 0::bigint, '15. privileged role metadata is ignored');
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
    '16. deleting auth user cascades identity rows'
);

set local role authenticated;
select ok(public.has_role('student'), '17. has_role(student) is true');
select ok(not public.has_role('admin'), '18. has_role(admin) is false by default');
update public.profiles set semester = '3'
where id = auth.uid();
reset role;
select ok(
    (
        select updated_at > created_at from public.profiles
        where id = '10000000-0000-4000-8000-000000000001'
    ),
    '19. updated_at advances after update'
);

set local role anon;
select ok(
    not has_function_privilege('anon', 'public.handle_new_user()', 'EXECUTE')
    and not has_function_privilege('anon', 'public.set_updated_at()', 'EXECUTE')
    and not has_function_privilege('anon', 'public.normalize_profile_fields()', 'EXECUTE')
    and not has_function_privilege('anon', 'public.has_role(public.app_role)', 'EXECUTE'),
    '20. anonymous cannot execute identity functions'
);
reset role;

select * from finish();
rollback;
