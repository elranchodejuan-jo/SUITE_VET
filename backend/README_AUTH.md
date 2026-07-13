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
- `private.has_role(required_role)`, helper interno no expuesto que consulta exclusivamente los roles de `auth.uid()` y no admite un UUID del cliente.

No existen políticas de inserción o eliminación para clientes. `authenticated` solo recibe `SELECT` y actualización de columnas editables del perfil; no puede modificar `id`, timestamps ni `user_roles`. El helper privilegiado de roles vive en un esquema privado y no concede ejecución directa a `PUBLIC`, `anon`, `authenticated` ni `service_role`.

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

La carpeta `supabase/` está vinculada localmente al proyecto independiente Suite Vet con ref `ibkbbzyrnaaqrjiidfjl`. Antes de cualquier operación remota se debe confirmar ese identificador y ejecutar primero un dry-run:

```powershell
npx supabase login
npx supabase db push --dry-run
npx supabase db push
npx supabase test db
```

No se debe pegar el access token, contraseña, connection string ni claves privadas en chats o logs. Security Advisor y las políticas RLS deben revisarse después de aplicar cada migración. Las pruebas pgTAP que crean identidades temporales deben ejecutarse en una única transacción terminada con `ROLLBACK` y requieren autorización expresa previa.

## Flujo del Hito 3.2

El navegador inicia sesión directamente con Supabase Auth usando únicamente Project URL y publishable key. La confirmación y recuperación regresan a una URL de la allowlist; el servicio limpia de la barra de direcciones los parámetros sensibles una vez procesados. La biblioteca oficial administra persistencia y renovación de sesión.

La migración incremental `20260713000100_auth_profile_feedback.sql` amplía `profiles` de forma compatible y crea `user_feedback`. RLS limita perfiles y comentarios a su propietario. Las únicas columnas administrativas actualizables son `approved` y `response`, exclusivamente cuando la fila supera la política de Super Admin basada en `user_roles`. El texto, asunto, calificación y autor son inmutables.

`GET /api/v1/auth/me` continúa siendo la comprobación mínima para APIs protegidas: verifica criptográficamente el Bearer JWT y no participa en el login de la SPA. GitHub Pages y todo el contenido público siguen funcionando aunque FastAPI no esté desplegado.

La cuenta del propietario no se crea ni se promueve durante este hito. Cuando exista una cuenta confirmada y haya autorización explícita, un administrador de base puede insertar su UUID confirmado en `public.user_roles` con rol `super_admin`; nunca se introduce un correo, UUID real o privilegio automático en código versionado.

## Hito 3.3: fundación SaaS y Centro de Control

La migración incremental `20260713000200_saas_admin_foundation.sql` añade una proyección administrativa mínima de cuentas y los contratos de planes, entitlements, suscripciones, pagos manuales, telemetría orientativa, auditoría y configuración SaaS no sensible. El plan Free se asigna de forma idempotente a usuarios académicos y el plan Plus se crea sin precio, sin checkout y sin beneficios inventados. Las cuentas con rol `super_admin` quedan fuera de suscripciones comerciales y de métricas de clientes.

GitHub Pages continúa accediendo directamente a Supabase con Auth, grants mínimos y RLS. FastAPI no es una dependencia de las operaciones administrativas mientras no exista una frontera pública de servidor. Por ello, suspensión, eliminación, restablecimiento administrativo de contraseñas, cambio de correo y administración de roles permanecen fuera de alcance.

Los importes usan `bigint` en centavos y USD. Un ingreso solo existe mientras el estado actual del pago sea `verified`; `pending`, `rejected` y `refunded` no se suman. Las auditorías se insertan exclusivamente mediante triggers controlados y nunca contienen comentarios completos, secretos ni datos clínicos. La telemetría admite únicamente navegación de alto nivel y no es fuente de facturación ni seguridad.

La reversión conceptual consiste en detener primero las escrituras del Centro de Control, retirar sus triggers y políticas, conservar/exportar los registros financieros y de auditoría requeridos, y solo después eliminar en orden dependiente las tablas nuevas. No se incluye una migración `down` destructiva ni `CASCADE`, porque este repositorio conserva migraciones aplicadas como historia inmutable y cualquier reversión de producción requiere revisión y autorización explícitas.

Para rotar claves JWT, rotarlas desde Supabase, conservar la clave anterior durante la ventana indicada por el proveedor y verificar que el JWKS publique ambas durante la transición. FastAPI renovará claves por `kid`; no se almacenan claves privadas en Suite Vet.
