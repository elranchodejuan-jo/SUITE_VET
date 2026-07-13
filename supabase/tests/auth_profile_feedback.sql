begin;
create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;
select plan(25);

insert into auth.users (
  id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
('31000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'hito32-a@example.test', '', '{}', '{}', now(), now()),
('32000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'hito32-b@example.test', '', '{}', '{}', now(), now());

select ok(
  (select relrowsecurity from pg_class where oid = 'public.user_feedback'::regclass),
  '1. feedback RLS is enabled'
);

select ok(
  not has_table_privilege('anon', 'public.profiles', 'SELECT'),
  '2. anon cannot read profiles'
);
select ok(
  not has_table_privilege('anon', 'public.user_feedback', 'SELECT'),
  '3. anon cannot read feedback'
);
select ok(
  not has_table_privilege('anon', 'public.user_feedback', 'INSERT'),
  '4. anon cannot insert feedback'
);

select set_config('request.jwt.claim.sub', '32000000-0000-4000-8000-000000000002', true);
set local role authenticated;
select is((select count(*) from public.profiles where id = auth.uid()), 1::bigint, '5. user reads own profile');
select is((select count(*) from public.profiles where id = '31000000-0000-4000-8000-000000000001'), 0::bigint, '6. user cannot read another profile');
select lives_ok(
  $$update public.profiles set first_name = 'Ana', last_name = 'Vega', username = '  Student_B  ', career = 'Medicina Veterinaria', semester = 'Séptimo', institution = 'Universidad Técnica de Machala', display_name = 'Ana Vega' where id = auth.uid()$$,
  '7. user updates only the own academic profile'
);
select is((select username from public.profiles where id = auth.uid()), 'student_b', '8. username is normalized to lowercase');
select throws_ok(
  $$update public.profiles set id = '33000000-0000-4000-8000-000000000003' where id = auth.uid()$$,
  '42501', null, '9. user cannot change profile id'
);
select lives_ok(
  $$insert into public.user_feedback (subject, message, rating) values ('comment', 'Comentario propio y válido', 5)$$,
  '10. user creates own feedback'
);
select throws_ok(
  $$insert into public.user_feedback (user_id, subject, message, rating) values ('31000000-0000-4000-8000-000000000001', 'comment', 'Foreign user feedback attempt', 5)$$,
  '42501', null, '11. user cannot insert feedback for another user'
);
select is((select count(*) from public.user_feedback), 1::bigint, '12. user reads only own feedback');
update public.user_feedback set approved = true;
set local role postgres;
select ok(
  not (select approved from public.user_feedback where user_id = '32000000-0000-4000-8000-000000000002'),
  '13. normal user cannot approve own feedback'
);

select set_config('request.jwt.claim.sub', '31000000-0000-4000-8000-000000000001', true);
set local role authenticated;
select is((select count(*) from public.user_feedback), 0::bigint, '14. normal user cannot read another user feedback');
select throws_ok(
  $$insert into public.user_roles (user_id, role) values (auth.uid(), 'super_admin')$$,
  '42501', null, '15. user cannot self-assign super_admin'
);
set local role postgres;

select throws_ok(
  $$update public.profiles set username = 'STUDENT_B' where id = '31000000-0000-4000-8000-000000000001'$$,
  '23505', null, '16. username is unique without case sensitivity'
);

select set_config('request.jwt.claim.sub', '32000000-0000-4000-8000-000000000002', true);
set local role authenticated;
select throws_ok(
  $$insert into public.user_feedback (subject, message, rating) values ('comment', 'Invalid rating value', 6)$$,
  '23514', null, '17. rating outside 1-5 is rejected'
);
select throws_ok(
  $$insert into public.user_feedback (subject, message, rating) values ('unknown', 'Unknown subject value', 4)$$,
  '23514', null, '18. unknown subject is rejected'
);
select throws_ok(
  $$insert into public.user_feedback (subject, message, rating) values ('comment', repeat('x', 2001), 4)$$,
  '23514', null, '19. oversized feedback is rejected'
);
set local role postgres;

insert into public.user_roles (user_id, role, granted_by)
values ('31000000-0000-4000-8000-000000000001', 'super_admin', null);
select set_config('request.jwt.claim.sub', '31000000-0000-4000-8000-000000000001', true);
set local role authenticated;
select is((select count(*) from public.user_feedback), 1::bigint, '20. Super Admin reads all feedback');
select lives_ok(
  $$update public.user_feedback set approved = true where user_id = '32000000-0000-4000-8000-000000000002'$$,
  '21. Super Admin approves feedback'
);
select lives_ok(
  $$update public.user_feedback set response = 'Respuesta administrativa segura' where user_id = '32000000-0000-4000-8000-000000000002'$$,
  '22. Super Admin responds to feedback'
);
select throws_ok(
  $$update public.user_feedback set message = 'Altered original' where user_id = '32000000-0000-4000-8000-000000000002'$$,
  '42501', null, '23. Super Admin cannot change original message'
);
select throws_ok(
  $$update public.user_feedback set user_id = auth.uid() where user_id = '32000000-0000-4000-8000-000000000002'$$,
  '42501', null, '24. Super Admin cannot change feedback author'
);
set local role postgres;

select ok(
  not has_function_privilege('authenticated', 'private.has_role(public.app_role)', 'EXECUTE')
  and not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef and has_function_privilege('authenticated', p.oid, 'EXECUTE')
  ),
  '25. private helper remains hardened and no privileged public function is exposed'
);

select * from finish();
rollback;
