begin;

-- Hito 3.3: fundacion SaaS incremental. No elimina ni recrea contratos previos.

create table public.account_directory (
  user_id uuid primary key references auth.users (id) on delete restrict,
  email text check (email is null or (char_length(email) <= 320 and email !~ '[[:cntrl:]<>]')),
  email_confirmed_at timestamptz,
  auth_created_at timestamptz not null,
  last_sign_in_at timestamptz,
  role public.app_role not null default 'student',
  updated_at timestamptz not null default now()
);

comment on table public.account_directory is
  'Proyeccion administrativa minima de auth.users; no contiene credenciales, tokens ni metadata de proveedores.';

create index account_directory_created_idx
  on public.account_directory (auth_created_at desc);
create index account_directory_role_idx
  on public.account_directory (role, auth_created_at desc);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z][a-z0-9-]{1,39}$'),
  name text not null check (char_length(btrim(name)) between 1 and 80 and name !~ '[[:cntrl:]<>]'),
  description text check (description is null or (char_length(description) <= 500 and description !~ '[[:cntrl:]<>]')),
  currency text not null default 'USD' check (currency = 'USD'),
  price_cents bigint check (price_cents is null or price_cents >= 0),
  billing_interval text not null default 'none' check (billing_interval in ('none', 'monthly', 'yearly')),
  is_active boolean not null default true,
  is_public boolean not null default false,
  is_purchasable boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plans_purchase_configuration check (
    is_purchasable = false or (price_cents is not null and price_cents > 0 and billing_interval <> 'none')
  )
);

create index plans_public_order_idx
  on public.plans (is_public, is_active, sort_order, slug);

create table public.plan_entitlements (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete restrict,
  capability_key text not null check (capability_key ~ '^[a-z][a-z0-9_.-]{1,79}$'),
  value_type text not null check (value_type in ('boolean', 'integer', 'text')),
  value jsonb not null,
  label text not null check (char_length(btrim(label)) between 1 and 120 and label !~ '[[:cntrl:]<>]'),
  description text check (description is null or (char_length(description) <= 500 and description !~ '[[:cntrl:]<>]')),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, capability_key),
  constraint plan_entitlements_value_shape check (
    (value_type = 'boolean' and jsonb_typeof(value) = 'boolean')
    or (value_type = 'integer' and jsonb_typeof(value) = 'number' and value::text ~ '^-?[0-9]+$')
    or (value_type = 'text' and jsonb_typeof(value) = 'string' and octet_length(value::text) <= 402)
  )
);

create index plan_entitlements_plan_order_idx
  on public.plan_entitlements (plan_id, is_active, sort_order, capability_key);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  plan_id uuid not null references public.plans (id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled', 'expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  canceled_at timestamptz,
  source text not null default 'automatic_free' check (source in ('automatic_free', 'backfill', 'manual_admin', 'future_gateway')),
  assigned_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_dates_valid check (
    (ends_at is null or ends_at >= starts_at)
    and ((status = 'canceled' and canceled_at is not null) or (status <> 'canceled' and canceled_at is null))
  )
);

create unique index subscriptions_one_active_per_user_idx
  on public.subscriptions (user_id)
  where status = 'active';
create index subscriptions_user_history_idx
  on public.subscriptions (user_id, created_at desc);
create index subscriptions_plan_status_idx
  on public.subscriptions (plan_id, status, starts_at desc);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  plan_id uuid not null references public.plans (id) on delete restrict,
  amount_cents bigint not null check (amount_cents > 0),
  currency text not null default 'USD' check (currency = 'USD'),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected', 'refunded')),
  payment_method text not null check (payment_method ~ '^manual_[a-z][a-z0-9_]{1,31}$'),
  reference text check (reference is null or (char_length(reference) <= 120 and reference !~ '[[:cntrl:]<>]')),
  note text check (note is null or (char_length(note) <= 500 and note !~ '[[:cntrl:]<>]')),
  paid_at timestamptz,
  verified_at timestamptz,
  verified_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_verification_metadata check (
    (status in ('verified', 'refunded') and verified_at is not null and verified_by is not null)
    or (status in ('pending', 'rejected') and verified_at is null and verified_by is null)
  )
);

create unique index payments_reference_unique_idx
  on public.payments (lower(reference))
  where reference is not null;
create index payments_status_created_idx
  on public.payments (status, created_at desc);
create index payments_user_created_idx
  on public.payments (user_id, created_at desc);
create index payments_verified_idx
  on public.payments (verified_at desc)
  where status = 'verified';

create table public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete restrict,
  event_type text not null check (event_type in (
    'login', 'module_open', 'plan_page_open', 'feedback_submit', 'academic_navigation'
  )),
  resource_key text check (resource_key is null or resource_key ~ '^[a-z0-9][a-z0-9_./-]{0,79}$'),
  session_key text check (session_key is null or session_key ~ '^[A-Za-z0-9_-]{12,64}$'),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  constraint usage_events_metadata_size check (
    jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 1024
  )
);

create unique index usage_events_frontend_dedupe_idx
  on public.usage_events (
    user_id,
    event_type,
    coalesce(resource_key, ''),
    date_trunc('minute', occurred_at at time zone 'UTC')
  );
create index usage_events_period_idx
  on public.usage_events (occurred_at desc, event_type);
create index usage_events_user_period_idx
  on public.usage_events (user_id, occurred_at desc);

comment on table public.usage_events is
  'Telemetria orientativa de alto nivel. No es fuente de facturacion, seguridad ni datos clinicos.';

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users (id) on delete set null,
  action text not null check (action ~ '^[a-z][a-z0-9_.-]{2,79}$'),
  entity_type text not null check (entity_type ~ '^[a-z][a-z0-9_.-]{1,79}$'),
  entity_id text check (entity_id is null or (char_length(entity_id) <= 160 and entity_id !~ '[[:cntrl:]<>]')),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  constraint audit_events_metadata_size check (
    jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 2048
  )
);

create index audit_events_period_idx
  on public.audit_events (occurred_at desc, action);
create index audit_events_actor_period_idx
  on public.audit_events (actor_user_id, occurred_at desc);

create table public.saas_settings (
  key text primary key check (key ~ '^[a-z][a-z0-9_.-]{2,79}$'),
  value_type text not null check (value_type in ('boolean', 'text', 'currency')),
  value jsonb not null,
  description text check (description is null or (char_length(description) <= 300 and description !~ '[[:cntrl:]<>]')),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saas_settings_value_shape check (
    (value_type = 'boolean' and jsonb_typeof(value) = 'boolean')
    or (value_type = 'currency' and value = '"USD"'::jsonb)
    or (value_type = 'text' and jsonb_typeof(value) = 'string' and octet_length(value::text) <= 1002)
  )
);

-- Semillas de producto demostradas. Plus queda sin precio y sin compra.
insert into public.plans (
  slug, name, description, currency, price_cents, billing_interval,
  is_active, is_public, is_purchasable, sort_order
) values
  ('free', 'Free', 'Plan académico inicial de Suite Vet.', 'USD', 0, 'none', true, true, false, 10),
  ('plus', 'Plus', 'Próximamente. Precio y beneficios definitivos pendientes de configuración.', 'USD', null, 'none', true, true, false, 20)
on conflict (slug) do update set
  name = excluded.name,
  currency = excluded.currency,
  price_cents = case when public.plans.slug = 'plus' then public.plans.price_cents else excluded.price_cents end,
  is_active = true,
  is_public = true,
  is_purchasable = case when public.plans.slug = 'plus' then public.plans.is_purchasable else false end,
  sort_order = excluded.sort_order;

insert into public.saas_settings (key, value_type, value, description, is_public) values
  ('default_currency', 'currency', '"USD"'::jsonb, 'Moneda inicial de importes SaaS.', true),
  ('plus_available', 'boolean', 'false'::jsonb, 'Disponibilidad comercial del plan Plus.', true),
  ('manual_payments_enabled', 'boolean', 'true'::jsonb, 'Permite registrar pagos manuales desde el Centro de Control.', false),
  ('plus_availability_message', 'text', '"Próximamente"'::jsonb, 'Mensaje público mientras Plus no está disponible.', true)
on conflict (key) do nothing;

-- Proyeccion minima y backfill de las cuentas existentes, sin correos hardcodeados.
insert into public.account_directory (
  user_id, email, email_confirmed_at, auth_created_at, last_sign_in_at, role, updated_at
)
select
  account.id,
  account.email,
  account.email_confirmed_at,
  account.created_at,
  account.last_sign_in_at,
  coalesce(
    (
      select assigned.role
      from public.user_roles as assigned
      where assigned.user_id = account.id
      order by array_position(
        array['super_admin', 'admin', 'reviewer', 'student']::public.app_role[],
        assigned.role
      )
      limit 1
    ),
    'student'::public.app_role
  ),
  now()
from auth.users as account
on conflict (user_id) do update set
  email = excluded.email,
  email_confirmed_at = excluded.email_confirmed_at,
  last_sign_in_at = excluded.last_sign_in_at,
  role = excluded.role,
  updated_at = now();

-- Free se asigna a cuentas academicas existentes. Super Admin queda fuera.
insert into public.subscriptions (user_id, plan_id, status, starts_at, source)
select account.id, free_plan.id, 'active', account.created_at, 'backfill'
from auth.users as account
cross join public.plans as free_plan
where free_plan.slug = 'free'
  and not exists (
    select 1 from public.user_roles as role_row
    where role_row.user_id = account.id
      and role_row.role = 'super_admin'::public.app_role
  )
  and not exists (
    select 1 from public.subscriptions as active_subscription
    where active_subscription.user_id = account.id
      and active_subscription.status = 'active'
  );

create or replace function public.set_saas_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.created_at := old.created_at;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

revoke all on function public.set_saas_updated_at() from public, anon, authenticated, service_role;

create trigger plans_set_updated_at before update on public.plans
for each row execute function public.set_saas_updated_at();
create trigger plan_entitlements_set_updated_at before update on public.plan_entitlements
for each row execute function public.set_saas_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions
for each row execute function public.set_saas_updated_at();
create trigger saas_settings_set_updated_at before update on public.saas_settings
for each row execute function public.set_saas_updated_at();

create or replace function private.sync_account_directory_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
set row_security = off
as $$
declare
  effective_role public.app_role;
  free_plan_id uuid;
begin
  select assigned.role
  into effective_role
  from public.user_roles as assigned
  where assigned.user_id = new.id
  order by array_position(
    array['super_admin', 'admin', 'reviewer', 'student']::public.app_role[],
    assigned.role
  )
  limit 1;

  effective_role := coalesce(effective_role, 'student'::public.app_role);

  insert into public.account_directory (
    user_id, email, email_confirmed_at, auth_created_at, last_sign_in_at, role, updated_at
  ) values (
    new.id, new.email, new.email_confirmed_at, new.created_at, new.last_sign_in_at,
    effective_role, clock_timestamp()
  )
  on conflict (user_id) do update set
    email = excluded.email,
    email_confirmed_at = excluded.email_confirmed_at,
    last_sign_in_at = excluded.last_sign_in_at,
    role = excluded.role,
    updated_at = clock_timestamp();

  if tg_op = 'INSERT' and effective_role <> 'super_admin'::public.app_role then
    select id into free_plan_id from public.plans where slug = 'free' and is_active;
    if free_plan_id is not null then
      insert into public.subscriptions (user_id, plan_id, status, starts_at, source)
      values (new.id, free_plan_id, 'active', new.created_at, 'automatic_free')
      on conflict (user_id) where status = 'active' do nothing;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.sync_account_directory_from_auth()
from public, anon, authenticated, service_role;

create trigger suite_vet_saas_account_sync
after insert or update of email, email_confirmed_at, last_sign_in_at on auth.users
for each row execute function private.sync_account_directory_from_auth();

create or replace function private.sync_account_directory_role()
returns trigger
language plpgsql
security definer
set search_path = ''
set row_security = off
as $$
declare
  target_user_id uuid;
  effective_role public.app_role;
  free_plan_id uuid;
begin
  if tg_op = 'DELETE' then
    target_user_id := old.user_id;
  else
    target_user_id := new.user_id;
  end if;

  select assigned.role
  into effective_role
  from public.user_roles as assigned
  where assigned.user_id = target_user_id
  order by array_position(
    array['super_admin', 'admin', 'reviewer', 'student']::public.app_role[],
    assigned.role
  )
  limit 1;

  effective_role := coalesce(effective_role, 'student'::public.app_role);
  update public.account_directory
  set role = effective_role, updated_at = clock_timestamp()
  where user_id = target_user_id;

  if effective_role = 'super_admin'::public.app_role then
    update public.subscriptions
    set status = 'canceled', ends_at = clock_timestamp(), canceled_at = clock_timestamp()
    where user_id = target_user_id and status = 'active';
  elsif not exists (
    select 1 from public.subscriptions
    where user_id = target_user_id and status = 'active'
  ) then
    select id into free_plan_id from public.plans where slug = 'free' and is_active;
    if free_plan_id is not null then
      insert into public.subscriptions (user_id, plan_id, status, source)
      values (target_user_id, free_plan_id, 'active', 'automatic_free')
      on conflict (user_id) where status = 'active' do nothing;
    end if;
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function private.sync_account_directory_role()
from public, anon, authenticated, service_role;

create trigger user_roles_sync_account_directory
after insert or update or delete on public.user_roles
for each row execute function private.sync_account_directory_role();

create or replace function public.assign_user_plan(target_user_id uuid, target_plan_slug text)
returns public.subscriptions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_plan public.plans;
  current_subscription public.subscriptions;
  created_subscription public.subscriptions;
begin
  if not exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = auth.uid()
      and own_role.role = 'super_admin'::public.app_role
  ) then
    raise exception 'super admin role required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.account_directory as target_account
    where target_account.user_id = target_user_id
      and target_account.role <> 'super_admin'::public.app_role
  ) then
    raise exception 'target account is not an academic customer' using errcode = '22023';
  end if;

  select * into selected_plan
  from public.plans
  where slug = lower(btrim(target_plan_slug)) and is_active;

  if selected_plan.id is null then
    raise exception 'active plan not found' using errcode = '22023';
  end if;

  select * into current_subscription
  from public.subscriptions
  where user_id = target_user_id and status = 'active'
  for update;

  if current_subscription.id is not null and current_subscription.plan_id = selected_plan.id then
    return current_subscription;
  end if;

  if current_subscription.id is not null then
    update public.subscriptions
    set status = 'canceled', ends_at = clock_timestamp(), canceled_at = clock_timestamp()
    where id = current_subscription.id;
  end if;

  insert into public.subscriptions (
    user_id, plan_id, status, starts_at, source, assigned_by
  ) values (
    target_user_id, selected_plan.id, 'active', clock_timestamp(), 'manual_admin', auth.uid()
  )
  returning * into created_subscription;

  return created_subscription;
end;
$$;

revoke all on function public.assign_user_plan(uuid, text)
from public, anon, authenticated, service_role;
grant execute on function public.assign_user_plan(uuid, text) to authenticated;

create or replace function private.protect_subscription_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'active' then
      raise exception 'new subscriptions must start active' using errcode = '22023';
    end if;
    if exists (
      select 1 from public.user_roles as assigned
      where assigned.user_id = new.user_id
        and assigned.role = 'super_admin'::public.app_role
    ) then
      raise exception 'internal super admin accounts cannot receive commercial subscriptions' using errcode = '22023';
    end if;
    if new.source = 'manual_admin' and new.assigned_by is distinct from auth.uid() then
      raise exception 'manual assignment actor mismatch' using errcode = '42501';
    end if;
    return new;
  end if;

  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.plan_id is distinct from old.plan_id
    or new.starts_at is distinct from old.starts_at
    or new.source is distinct from old.source
    or new.assigned_by is distinct from old.assigned_by
    or new.created_at is distinct from old.created_at then
    raise exception 'subscription assignment fields are immutable' using errcode = '42501';
  end if;

  if new.status is distinct from old.status and not (
    (old.status = 'active' and new.status in ('past_due', 'canceled', 'expired'))
    or (old.status = 'past_due' and new.status in ('active', 'canceled', 'expired'))
  ) then
    raise exception 'invalid subscription status transition' using errcode = '22023';
  end if;

  return new;
end;
$$;

revoke all on function private.protect_subscription_write()
from public, anon, authenticated, service_role;

create trigger subscriptions_protect_write
before insert or update on public.subscriptions
for each row execute function private.protect_subscription_write();

create or replace function private.protect_payment_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.reference := nullif(btrim(new.reference), '');
  new.note := nullif(btrim(new.note), '');

  if tg_op = 'INSERT' then
    if new.status <> 'pending' or new.verified_at is not null or new.verified_by is not null then
      raise exception 'new payments must start pending' using errcode = '22023';
    end if;
    return new;
  end if;

  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.subscription_id is distinct from old.subscription_id
    or new.plan_id is distinct from old.plan_id
    or new.amount_cents is distinct from old.amount_cents
    or new.currency is distinct from old.currency
    or new.payment_method is distinct from old.payment_method
    or new.reference is distinct from old.reference
    or new.paid_at is distinct from old.paid_at
    or new.created_at is distinct from old.created_at then
    raise exception 'payment financial fields are immutable' using errcode = '42501';
  end if;

  if new.status is distinct from old.status then
    if not (
      (old.status = 'pending' and new.status in ('verified', 'rejected'))
      or (old.status = 'verified' and new.status = 'refunded')
    ) then
      raise exception 'invalid payment status transition' using errcode = '22023';
    end if;

    if new.status = 'verified' then
      new.verified_at := clock_timestamp();
      new.verified_by := auth.uid();
    elsif new.status = 'rejected' then
      new.verified_at := null;
      new.verified_by := null;
    else
      new.verified_at := old.verified_at;
      new.verified_by := old.verified_by;
    end if;
  else
    new.verified_at := old.verified_at;
    new.verified_by := old.verified_by;
  end if;

  new.updated_at := clock_timestamp();
  return new;
end;
$$;

revoke all on function private.protect_payment_write()
from public, anon, authenticated, service_role;

create trigger payments_protect_write
before insert or update on public.payments
for each row execute function private.protect_payment_write();

create or replace function private.validate_usage_event()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  metadata_entry record;
begin
  if new.event_type in ('module_open', 'academic_navigation') and new.resource_key is null then
    raise exception 'resource key required for navigation events' using errcode = '22023';
  end if;

  for metadata_entry in select key, value from jsonb_each(new.metadata)
  loop
    if metadata_entry.key not in ('source', 'viewport', 'plan_slug')
      or jsonb_typeof(metadata_entry.value) <> 'string'
      or octet_length(metadata_entry.value::text) > 162 then
      raise exception 'usage metadata is not allowlisted' using errcode = '22023';
    end if;
  end loop;

  return new;
end;
$$;

revoke all on function private.validate_usage_event()
from public, anon, authenticated, service_role;

create trigger usage_events_validate
before insert or update on public.usage_events
for each row execute function private.validate_usage_event();

create or replace function private.audit_saas_change()
returns trigger
language plpgsql
security definer
set search_path = ''
set row_security = off
as $$
declare
  audit_action text;
  audit_entity_id text;
  audit_metadata jsonb := '{}'::jsonb;
begin
  if tg_table_name = 'subscriptions' then
    audit_action := case when tg_op = 'INSERT' then 'subscription.assigned' else 'subscription.status_changed' end;
    audit_entity_id := new.id::text;
    audit_metadata := jsonb_build_object(
      'user_id', new.user_id,
      'plan_id', new.plan_id,
      'status', new.status,
      'previous_status', case when tg_op = 'UPDATE' then old.status else null end,
      'source', new.source
    );
  elsif tg_table_name = 'payments' then
    audit_action := case
      when tg_op = 'INSERT' then 'payment.created'
      when new.status = 'verified' then 'payment.verified'
      when new.status = 'rejected' then 'payment.rejected'
      when new.status = 'refunded' then 'payment.refunded'
      else 'payment.updated'
    end;
    audit_entity_id := new.id::text;
    audit_metadata := jsonb_build_object(
      'user_id', new.user_id,
      'plan_id', new.plan_id,
      'status', new.status,
      'previous_status', case when tg_op = 'UPDATE' then old.status else null end,
      'amount_cents', new.amount_cents,
      'currency', new.currency
    );
  elsif tg_table_name = 'plans' then
    audit_action := 'plan.updated';
    audit_entity_id := new.id::text;
    audit_metadata := jsonb_build_object(
      'slug', new.slug,
      'price_configured', new.price_cents is not null,
      'is_public', new.is_public,
      'is_purchasable', new.is_purchasable
    );
  elsif tg_table_name = 'plan_entitlements' then
    audit_action := case when tg_op = 'DELETE' then 'plan_entitlement.deleted' else 'plan_entitlement.changed' end;
    audit_entity_id := coalesce(new.id, old.id)::text;
    audit_metadata := jsonb_build_object(
      'plan_id', coalesce(new.plan_id, old.plan_id),
      'capability_key', coalesce(new.capability_key, old.capability_key)
    );
  elsif tg_table_name = 'saas_settings' then
    audit_action := 'saas_setting.updated';
    audit_entity_id := new.key;
    audit_metadata := jsonb_build_object('key', new.key, 'value_type', new.value_type);
  elsif tg_table_name = 'user_feedback' then
    audit_action := case
      when new.response is distinct from old.response then 'feedback.response_changed'
      else 'feedback.moderation_changed'
    end;
    audit_entity_id := new.id::text;
    audit_metadata := jsonb_build_object(
      'approved', new.approved,
      'responded', new.response is not null
    );
  else
    raise exception 'unsupported audit source';
  end if;

  insert into public.audit_events (
    actor_user_id, action, entity_type, entity_id, metadata
  ) values (
    auth.uid(), audit_action, tg_table_name, audit_entity_id, jsonb_strip_nulls(audit_metadata)
  );

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function private.audit_saas_change()
from public, anon, authenticated, service_role;

create trigger subscriptions_audit
after insert or update on public.subscriptions
for each row execute function private.audit_saas_change();
create trigger payments_audit
after insert or update on public.payments
for each row execute function private.audit_saas_change();
create trigger plans_audit
after update on public.plans
for each row execute function private.audit_saas_change();
create trigger plan_entitlements_audit
after insert or update or delete on public.plan_entitlements
for each row execute function private.audit_saas_change();
create trigger saas_settings_audit
after update on public.saas_settings
for each row execute function private.audit_saas_change();
create trigger user_feedback_saas_audit
after update on public.user_feedback
for each row
when (old.approved is distinct from new.approved or old.response is distinct from new.response)
execute function private.audit_saas_change();

-- RLS explicito en toda tabla expuesta.
alter table public.account_directory enable row level security;
alter table public.plans enable row level security;
alter table public.plan_entitlements enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.usage_events enable row level security;
alter table public.audit_events enable row level security;
alter table public.saas_settings enable row level security;

create policy account_directory_select_super_admin
on public.account_directory for select to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy plans_select_public_or_super_admin
on public.plans for select to anon, authenticated
using (
  (is_public and is_active)
  or exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy plans_insert_super_admin
on public.plans for insert to authenticated
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy plans_update_super_admin
on public.plans for update to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
)
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy plan_entitlements_select_visible
on public.plan_entitlements for select to anon, authenticated
using (
  exists (
    select 1 from public.plans as visible_plan
    where visible_plan.id = plan_id and visible_plan.is_public and visible_plan.is_active
  )
  or exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy plan_entitlements_insert_super_admin
on public.plan_entitlements for insert to authenticated
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy plan_entitlements_update_super_admin
on public.plan_entitlements for update to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
)
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy plan_entitlements_delete_super_admin
on public.plan_entitlements for delete to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy subscriptions_select_own_or_super_admin
on public.subscriptions for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy subscriptions_insert_super_admin
on public.subscriptions for insert to authenticated
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy subscriptions_update_super_admin
on public.subscriptions for update to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
)
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy payments_select_own_or_super_admin
on public.payments for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy payments_insert_super_admin
on public.payments for insert to authenticated
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy payments_update_super_admin
on public.payments for update to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
)
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy usage_events_insert_own
on public.usage_events for insert to authenticated
with check (user_id = (select auth.uid()));
create policy usage_events_select_super_admin
on public.usage_events for select to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy audit_events_select_super_admin
on public.audit_events for select to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy saas_settings_select_visible
on public.saas_settings for select to anon, authenticated
using (
  is_public
  or exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);
create policy saas_settings_update_super_admin
on public.saas_settings for update to authenticated
using (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
)
with check (
  exists (
    select 1 from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

-- Privilegios minimos; anon solo puede leer definiciones publicas de producto/configuracion.
revoke all on table public.account_directory from public, anon, authenticated;
grant select on table public.account_directory to authenticated;

revoke all on table public.plans from public, anon, authenticated;
grant select on table public.plans to anon, authenticated;
grant insert, update on table public.plans to authenticated;

revoke all on table public.plan_entitlements from public, anon, authenticated;
grant select on table public.plan_entitlements to anon, authenticated;
grant insert, update, delete on table public.plan_entitlements to authenticated;

revoke all on table public.subscriptions from public, anon, authenticated;
grant select, insert, update on table public.subscriptions to authenticated;

revoke all on table public.payments from public, anon, authenticated;
grant select, insert, update on table public.payments to authenticated;

revoke all on table public.usage_events from public, anon, authenticated;
grant select on table public.usage_events to authenticated;
grant insert (event_type, resource_key, session_key, metadata) on table public.usage_events to authenticated;
grant usage, select on sequence public.usage_events_id_seq to authenticated;

revoke all on table public.audit_events from public, anon, authenticated;
grant select on table public.audit_events to authenticated;
revoke all on sequence public.audit_events_id_seq from public, anon, authenticated;

revoke all on table public.saas_settings from public, anon, authenticated;
grant select on table public.saas_settings to anon, authenticated;
grant update (value, description, is_public) on table public.saas_settings to authenticated;

-- Reafirmar el hardening previo: el helper privado sigue sin ejecucion directa.
revoke all on function private.has_role(public.app_role)
from public, anon, authenticated, service_role;

comment on function public.assign_user_plan(uuid, text) is
  'Cambio atomico de plan con SECURITY INVOKER, grants minimos y RLS. No aplica bloqueos de modulos.';
comment on table public.audit_events is
  'Auditoria inmutable generada por triggers; ningun cliente puede insertar, actualizar o eliminar eventos.';

commit;
