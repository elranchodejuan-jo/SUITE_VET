begin;

-- Hito 3.2: ampliar el perfil sin invalidar filas existentes ni eliminar display_name.
alter table public.profiles
  add column first_name text,
  add column last_name text,
  add column username text;

alter table public.profiles
  add constraint profiles_first_name_format check (
    first_name is null or (
      char_length(first_name) between 1 and 80
      and first_name ~ '^[[:alpha:]][[:alpha:][:space:].''-]*$'
      and first_name !~ '[[:cntrl:]<>]'
    )
  ) not valid,
  add constraint profiles_last_name_format check (
    last_name is null or (
      char_length(last_name) between 1 and 80
      and last_name ~ '^[[:alpha:]][[:alpha:][:space:].''-]*$'
      and last_name !~ '[[:cntrl:]<>]'
    )
  ) not valid,
  add constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9][a-z0-9_]{2,29}$'
  ) not valid,
  add constraint profiles_career_catalog check (
    career is null or career in (
      'Medicina Veterinaria', 'Agronomía', 'Acuicultura', 'Zootecnia', 'Otra carrera'
    )
  ) not valid,
  add constraint profiles_semester_catalog check (
    semester is null or semester in (
      'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo',
      'Octavo', 'Noveno', 'Décimo', 'Egresado', 'Graduado', 'Otro'
    )
  ) not valid,
  add constraint profiles_institution_catalog check (
    institution is null or institution in (
      'Universidad Técnica de Machala', 'Universidad de Guayaquil',
      'Universidad Católica de Cuenca', 'Universidad de Cuenca',
      'Universidad Nacional de Loja', 'Otra institución'
    )
  ) not valid;

create unique index profiles_username_unique_ci
  on public.profiles (lower(username))
  where username is not null;

create or replace function public.normalize_profile_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.first_name := nullif(btrim(new.first_name), '');
  new.last_name := nullif(btrim(new.last_name), '');
  new.username := lower(nullif(btrim(new.username), ''));
  new.display_name := nullif(btrim(new.display_name), '');
  new.institution := nullif(btrim(new.institution), '');
  new.career := nullif(btrim(new.career), '');
  new.semester := nullif(btrim(new.semester), '');
  new.avatar_path := nullif(btrim(new.avatar_path), '');
  return new;
end;
$$;

revoke all on function public.normalize_profile_fields() from public, anon, authenticated, service_role;

grant update (first_name, last_name, username) on table public.profiles to authenticated;

-- Super Admin solo puede leer los nombres mínimos necesarios para identificar autores.
create policy profiles_select_feedback_admin
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create table public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  subject text not null check (subject in ('comment', 'recommendation', 'observed_error')),
  message text not null check (
    char_length(message) between 10 and 2000
    and message !~ '[[:cntrl:]<>]'
  ),
  rating smallint not null check (rating between 1 and 5),
  approved boolean not null default false,
  approved_at timestamptz,
  approved_by uuid references auth.users (id) on delete set null,
  response text check (
    response is null or (
      char_length(response) between 1 and 2000
      and response !~ '[[:cntrl:]<>]'
    )
  ),
  responded_at timestamptz,
  responded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_feedback_approval_metadata check (
    (approved = false and approved_at is null and approved_by is null)
    or (approved = true and approved_at is not null and approved_by is not null)
  ),
  constraint user_feedback_response_metadata check (
    (response is null and responded_at is null and responded_by is null)
    or (response is not null and responded_at is not null and responded_by is not null)
  )
);

comment on table public.user_feedback is
  'Comentarios autenticados. El autor no puede editar; solo Super Admin aprueba o responde mediante RLS.';
comment on column public.user_feedback.subject is 'Valor interno versionado; la interfaz lo traduce al español.';
comment on column public.user_feedback.message is 'Texto original inmutable después de insertar.';

create index user_feedback_user_created_idx
  on public.user_feedback (user_id, created_at desc);
create index user_feedback_admin_filters_idx
  on public.user_feedback (subject, rating, created_at desc);

create or replace function public.protect_user_feedback_update()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.subject is distinct from old.subject
    or new.message is distinct from old.message
    or new.rating is distinct from old.rating
    or new.created_at is distinct from old.created_at then
    raise exception 'feedback original fields are immutable' using errcode = '42501';
  end if;

  new.response := nullif(btrim(new.response), '');
  new.updated_at := clock_timestamp();

  if new.approved is distinct from old.approved then
    if new.approved then
      new.approved_at := clock_timestamp();
      new.approved_by := auth.uid();
    else
      new.approved_at := null;
      new.approved_by := null;
    end if;
  else
    new.approved_at := old.approved_at;
    new.approved_by := old.approved_by;
  end if;

  if new.response is distinct from old.response then
    if new.response is null then
      new.responded_at := null;
      new.responded_by := null;
    else
      new.responded_at := clock_timestamp();
      new.responded_by := auth.uid();
    end if;
  else
    new.responded_at := old.responded_at;
    new.responded_by := old.responded_by;
  end if;

  return new;
end;
$$;

revoke all on function public.protect_user_feedback_update() from public, anon, authenticated, service_role;

create trigger user_feedback_protect_update
before update on public.user_feedback
for each row execute function public.protect_user_feedback_update();

alter table public.user_feedback enable row level security;

create policy user_feedback_insert_own
on public.user_feedback
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy user_feedback_select_own
on public.user_feedback
for select
to authenticated
using (user_id = (select auth.uid()));

create policy user_feedback_select_super_admin
on public.user_feedback
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

create policy user_feedback_update_super_admin
on public.user_feedback
for update
to authenticated
using (
  exists (
    select 1
    from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
)
with check (
  exists (
    select 1
    from public.user_roles as own_role
    where own_role.user_id = (select auth.uid())
      and own_role.role = 'super_admin'::public.app_role
  )
);

revoke all on table public.user_feedback from public, anon, authenticated;
grant select on table public.user_feedback to authenticated;
grant insert (subject, message, rating) on table public.user_feedback to authenticated;
grant update (approved, response) on table public.user_feedback to authenticated;

commit;
