begin;
create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;
select plan(50);

insert into auth.users (
  id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data,
  email_confirmed_at, created_at, updated_at
) values
('41000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'hito33-admin@example.test', '', '{}', '{}', now(), now(), now()),
('42000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'hito33-student@example.test', '', '{}', '{}', now(), now(), now());

select ok(
  (select count(*) = 8 from information_schema.tables
   where table_schema = 'public' and table_name in (
     'account_directory', 'plans', 'plan_entitlements', 'subscriptions',
     'payments', 'usage_events', 'audit_events', 'saas_settings'
   )),
  '1. all eight SaaS tables exist'
);
select ok(
  (select count(*) = 8 from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname in (
     'account_directory', 'plans', 'plan_entitlements', 'subscriptions',
     'payments', 'usage_events', 'audit_events', 'saas_settings'
   ) and c.relrowsecurity),
  '2. RLS is enabled on every SaaS table'
);
select ok(
  (select count(*) = 8 from pg_constraint constraint_row
   where constraint_row.contype = 'p' and constraint_row.conrelid in (
     'public.account_directory'::regclass, 'public.plans'::regclass,
     'public.plan_entitlements'::regclass, 'public.subscriptions'::regclass,
     'public.payments'::regclass, 'public.usage_events'::regclass,
     'public.audit_events'::regclass, 'public.saas_settings'::regclass
   )),
  '3. every SaaS table has a primary key'
);
select ok(
  to_regclass('public.subscriptions_one_active_per_user_idx') is not null
  and to_regclass('public.payments_reference_unique_idx') is not null
  and to_regclass('public.usage_events_frontend_dedupe_idx') is not null,
  '4. critical uniqueness indexes exist'
);
select ok(
  exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'payments' and column_name = 'amount_cents' and data_type = 'bigint')
  and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'plans' and column_name = 'price_cents' and data_type = 'bigint'),
  '5. money is stored as integer cents'
);

select ok(not has_table_privilege('anon', 'public.account_directory', 'SELECT'), '6. anon cannot read account directory');
select ok(not has_table_privilege('anon', 'public.subscriptions', 'SELECT'), '7. anon cannot read subscriptions');
select ok(not has_table_privilege('anon', 'public.payments', 'SELECT'), '8. anon cannot read payments');
select ok(not has_table_privilege('anon', 'public.usage_events', 'SELECT'), '9. anon cannot read telemetry');
select ok(not has_table_privilege('anon', 'public.audit_events', 'SELECT'), '10. anon cannot read audit');
select ok(has_table_privilege('anon', 'public.plans', 'SELECT'), '11. anon has only targeted access to public plan definitions');

select is((select price_cents from public.plans where slug = 'free'), 0::bigint, '12. Free has zero price');
select ok(
  (select price_cents is null and is_active and is_public and not is_purchasable from public.plans where slug = 'plus'),
  '13. Plus is visible but has no invented price or checkout'
);
select is(
  (select count(*) from public.subscriptions where user_id = '42000000-0000-4000-8000-000000000002' and status = 'active' and plan_id = (select id from public.plans where slug = 'free')),
  1::bigint,
  '14. a new academic user receives Free automatically'
);

insert into public.user_roles (user_id, role)
values ('41000000-0000-4000-8000-000000000001', 'super_admin');
select is(
  (select count(*) from public.subscriptions where user_id = '41000000-0000-4000-8000-000000000001' and status = 'active'),
  0::bigint,
  '15. Super Admin has no active commercial subscription'
);
select is(
  (select role from public.account_directory where user_id = '41000000-0000-4000-8000-000000000001'),
  'super_admin'::public.app_role,
  '16. account directory tracks the authoritative role without email authorization'
);

select set_config('request.jwt.claim.sub', '42000000-0000-4000-8000-000000000002', true);
set local role authenticated;
select is((select count(*) from public.account_directory), 0::bigint, '17. student cannot read account directory rows');
select is((select count(*) from public.subscriptions), 1::bigint, '18. student sees only the own subscription');
select is((select count(*) from public.payments), 0::bigint, '19. student initially sees only own empty payment history');
select throws_ok(
  $$select public.assign_user_plan('42000000-0000-4000-8000-000000000002', 'plus')$$,
  '42501', null, '20. student cannot assign a plan'
);
select throws_ok(
  $$insert into public.subscriptions (user_id, plan_id, source) values (auth.uid(), (select id from public.plans where slug = 'plus'), 'manual_admin')$$,
  '42501', null, '21. student cannot insert subscriptions directly'
);
select throws_ok(
  $$insert into public.payments (user_id, plan_id, amount_cents, payment_method) values (auth.uid(), (select id from public.plans where slug = 'plus'), 1000, 'manual_other')$$,
  '42501', null, '22. student cannot create a payment'
);
select is((select count(*) from public.audit_events), 0::bigint, '23. student cannot read audit events');
select throws_ok(
  $$insert into public.audit_events (action, entity_type) values ('forged.event', 'test')$$,
  '42501', null, '24. student cannot forge audit events'
);
select lives_ok(
  $$insert into public.usage_events (event_type, resource_key, session_key, metadata) values ('module_open', 'fisiologia', 'sessionkey_1234567890', '{}'::jsonb)$$,
  '25. student can insert allowlisted own telemetry'
);
select throws_ok(
  $$insert into public.usage_events (user_id, event_type, resource_key) values ('41000000-0000-4000-8000-000000000001', 'module_open', 'fisiologia')$$,
  '42501', null, '26. student cannot forge telemetry for another user'
);
select throws_ok(
  $$insert into public.usage_events (event_type, resource_key, metadata) values ('module_open', 'fisiologia', '{"patient":"forbidden"}'::jsonb)$$,
  '22023', null, '27. telemetry rejects non-allowlisted metadata'
);
select lives_ok(
  $$insert into public.user_feedback (subject, message, rating) values ('comment', 'Comentario temporal del Hito 3.3', 5)$$,
  '28. existing student feedback flow remains functional'
);
set local role postgres;

select set_config('request.jwt.claim.sub', '41000000-0000-4000-8000-000000000001', true);
set local role authenticated;
select is(
  (
    select count(*)
    from public.account_directory
    where user_id in ('41000000-0000-4000-8000-000000000001', '42000000-0000-4000-8000-000000000002')
  ),
  2::bigint,
  '29. Super Admin reads the temporary account directory rows without assuming the real account count'
);
select lives_ok(
  $$select (public.assign_user_plan('42000000-0000-4000-8000-000000000002', 'plus')).id$$,
  '30. Super Admin assigns Plus through the atomic RPC'
);
select is(
  (select plan.slug from public.subscriptions subscription join public.plans plan on plan.id = subscription.plan_id where subscription.user_id = '42000000-0000-4000-8000-000000000002' and subscription.status = 'active'),
  'plus',
  '31. Plus becomes the single active plan'
);
select is(
  (select count(*) from public.subscriptions where user_id = '42000000-0000-4000-8000-000000000002' and status = 'active'),
  1::bigint,
  '32. user cannot have two active subscriptions'
);
select lives_ok(
  $$select (public.assign_user_plan('42000000-0000-4000-8000-000000000002', 'free')).id$$,
  '33. plan can be changed atomically back to Free'
);
select is(
  (select count(*) from public.subscriptions where user_id = '42000000-0000-4000-8000-000000000002' and status = 'active'),
  1::bigint,
  '34. atomic plan change still leaves one active subscription'
);

select lives_ok(
  $$insert into public.payments (user_id, plan_id, amount_cents, payment_method, reference, paid_at) values ('42000000-0000-4000-8000-000000000002', (select id from public.plans where slug = 'plus'), 1000, 'manual_transfer', 'HITO33-UNIQUE', now())$$,
  '35. Super Admin creates a pending manual payment'
);
select throws_ok(
  $$insert into public.payments (user_id, plan_id, amount_cents, payment_method) values ('42000000-0000-4000-8000-000000000002', (select id from public.plans where slug = 'plus'), 0, 'manual_other')$$,
  '23514', null, '36. zero-value payment is rejected'
);
select throws_ok(
  $$insert into public.payments (user_id, plan_id, amount_cents, payment_method, reference) values ('42000000-0000-4000-8000-000000000002', (select id from public.plans where slug = 'plus'), 1200, 'manual_other', 'hito33-unique')$$,
  '23505', null, '37. external payment reference is unique case-insensitively'
);
select is((select coalesce(sum(amount_cents), 0) from public.payments where status = 'verified'), 0::numeric, '38. pending payments do not count as verified income');
select lives_ok(
  $$update public.payments set status = 'verified' where reference = 'HITO33-UNIQUE'$$,
  '39. Super Admin verifies a pending payment'
);
select is((select sum(amount_cents) from public.payments where status = 'verified'), 1000::numeric, '40. verified income includes only current verified payments');
select ok(
  exists (select 1 from public.audit_events where action = 'payment.verified' and entity_type = 'payments'),
  '41. payment verification creates immutable audit'
);
select throws_ok(
  $$update public.payments set status = 'rejected' where reference = 'HITO33-UNIQUE'$$,
  '22023', null, '42. invalid financial transition is rejected'
);
select lives_ok(
  $$update public.payments set status = 'refunded' where reference = 'HITO33-UNIQUE'$$,
  '43. verified payment can be refunded'
);
select is((select coalesce(sum(amount_cents), 0) from public.payments where status = 'verified'), 0::numeric, '44. refunded payment no longer counts as verified income');

set local role postgres;
select set_config('request.jwt.claim.sub', '42000000-0000-4000-8000-000000000002', true);
set local role authenticated;
select is((select count(*) from public.payments), 1::bigint, '45. student sees the own payment history after it exists');
update public.payments set note = 'forged student update';
set local role postgres;
select ok((select note is null from public.payments where reference = 'HITO33-UNIQUE'), '46. student cannot modify the own payment');

select set_config('request.jwt.claim.sub', '41000000-0000-4000-8000-000000000001', true);
set local role authenticated;
select lives_ok(
  $$update public.user_feedback set approved = true, response = 'Respuesta administrativa temporal' where user_id = '42000000-0000-4000-8000-000000000002'$$,
  '47. Super Admin moderates existing feedback without duplicating its table'
);
select ok(
  exists (select 1 from public.audit_events where action in ('feedback.response_changed', 'feedback.moderation_changed') and entity_type = 'user_feedback'),
  '48. feedback moderation produces audit without copying message bodies'
);
set local role postgres;
select ok(
  not has_function_privilege('authenticated', 'private.has_role(public.app_role)', 'EXECUTE')
  and not has_function_privilege('authenticated', 'private.sync_account_directory_from_auth()', 'EXECUTE')
  and not has_function_privilege('authenticated', 'private.sync_account_directory_role()', 'EXECUTE')
  and not has_function_privilege('authenticated', 'private.protect_subscription_write()', 'EXECUTE')
  and not has_function_privilege('authenticated', 'private.protect_payment_write()', 'EXECUTE')
  and not has_function_privilege('authenticated', 'private.audit_saas_change()', 'EXECUTE'),
  '49. private trigger helpers have no direct client execution'
);
select ok(
  not (select prosecdef from pg_proc where oid = 'public.assign_user_plan(uuid,text)'::regprocedure)
  and not exists (
    select 1
    from unnest(array['anon', 'authenticated']) as api_role(role_name)
    cross join unnest(array['auth.users', 'auth.identities', 'auth.sessions']) as auth_table(table_name)
    cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE']) as operation(privilege_name)
    where has_table_privilege(api_role.role_name, auth_table.table_name, operation.privilege_name)
  )
  and not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'v' and c.relname like 'saas_%'
  ),
  '50. RPC is SECURITY INVOKER and API roles cannot read auth tables or definer views'
);

select * from finish();
rollback;
