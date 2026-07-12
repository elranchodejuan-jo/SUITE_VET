# Hito 3.1: identidad, RLS y JWT

Supabase Auth será el emisor de identidad y PostgreSQL administrado. FastAPI no implementa login, registro ni logout: recibe un access token, obtiene la clave pública correspondiente desde JWKS y verifica firma, algoritmo, expiración, issuer, audience y `sub` UUID antes de construir `CurrentUser`.

## Claves y variables

El frontend futuro solo utilizará `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. La publishable key identifica el proyecto y está diseñada para clientes públicos; la seguridad de datos depende de Auth y RLS.

El backend usa únicamente estas variables locales:

```text
SUITEVET_SUPABASE_URL=
SUITEVET_SUPABASE_JWKS_URL=
SUITEVET_SUPABASE_ISSUER=
SUITEVET_SUPABASE_AUDIENCE=authenticated
```

`sb_secret`, `service_role`, claves privadas JWT, contraseñas, access tokens personales y connection strings nunca deben aparecer en `VITE_*`, Git, chats o capturas. Este hito no necesita ninguna clave secreta.

## Esquema y autorización

La migración `supabase/migrations/20260712000100_identity_foundation.sql` crea:

- `profiles`, con campos académicos sin email ni privilegios;
- `user_roles`, separado del perfil;
- `app_role`: `student`, `reviewer`, `admin`, `super_admin`;
- trigger idempotente sobre `auth.users`, que ignora cualquier rol solicitado por metadata y asigna solo `student`;
- normalización de strings y `updated_at` no manipulable;
- RLS para lectura/actualización del perfil propio y lectura de roles propios;
- `has_role(required_role)`, que consulta exclusivamente los roles de `auth.uid()`.

No existen políticas de inserción o eliminación para clientes. `authenticated` solo recibe `SELECT` y actualización de columnas editables del perfil; no puede modificar `id`, timestamps ni `user_roles`.

## Endpoint protegido

`GET /api/v1/auth/me` requiere `Authorization: Bearer <JWT>`. Devuelve únicamente `id`, `email` opcional validado, `audience` y `token_role`. `token_role` es informativo y no sustituye `user_roles`/RLS. La caché JWKS dura cinco minutos, renueva una vez ante un `kid` desconocido y usa timeout y límite de respuesta.

## Ejecución local

```powershell
uv venv .venv --python 3.12
uv --system-certs pip install --python .venv\Scripts\python.exe -e ".[test]"
.venv\Scripts\python.exe -m pytest
```

Desde la raíz del repositorio, las pruebas frontend siguen ejecutándose con `npm test` y `npm run build`.

## Supabase CLI y remoto

La carpeta `supabase/` está versionada, pero no está vinculada a ningún proyecto remoto. Cuando el propietario haya creado el proyecto independiente **Suite Vet Dev**, debe ejecutar localmente:

```powershell
npx supabase login
npx supabase link --project-ref <PROJECT_REF_DE_SUITE_VET_DEV>
npx supabase db push --dry-run
npx supabase db push
npx supabase test db
```

No se debe pegar el access token ni el project ref completo en chats. Antes de `db push`, confirmar en terminal que el proyecto es Suite Vet Dev y no Cartilla Digital. Security Advisor y las políticas RLS deben revisarse después de aplicar la migración.

Para rotar claves JWT, rotarlas desde Supabase, conservar la clave anterior durante la ventana indicada por el proveedor y verificar que el JWKS publique ambas durante la transición. FastAPI renovará claves por `kid`; no se almacenan claves privadas en Suite Vet.
