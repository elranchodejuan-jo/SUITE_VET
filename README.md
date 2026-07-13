# SUITE VET 2.0

Suite Vet mantiene su frontend en HTML, CSS y JavaScript clásico y añade una frontera de dominio versionada con FastAPI. La migración es progresiva: los contratos globales `window.SuiteVet` y `window.Recetario`, los datos veterinarios, `localStorage`, impresión y PDF continúan sin cambios.

## Requisitos

- Node.js 20.19 o superior.
- npm 10 o superior.
- Python 3.12 o superior compatible con `backend/pyproject.toml`.

## Inicio local

```powershell
npm install
npm run dev
```

Vite mostrará la URL local. Para validar la salida de producción:

```powershell
npm test
npm run build
npm run preview
```

`dist/` y `node_modules/` son salidas locales ignoradas por Git. La configuración de Vite conserva los scripts clásicos y copia el runtime estático (`shared/`, `modules/` y `assets/`) al build sin convertir los módulos clínicos a ES Modules.

## Arquitectura frontend actual

- `index.html`: shell, vistas y orden de carga de scripts globales.
- `shared/`: router, shell responsive, sistema visual, Favoritos, Categorías y Recetario.
- `modules/`: datos y controladores de cada área clínica.
- `test/`: regresiones con `node:test`.
- Persistencia: `localStorage`.
- Impresión y PDF: vistas de impresión del navegador, sin cambios en este hito.

## Breakpoints del shell

- Escritorio: más de 900 px; sidebar estable y colapsable.
- Tablet/drawer: 900 px o menos; navegación superpuesta con backdrop.
- Celular: 640 px o menos; búsqueda desplegable y acciones esenciales.
- Celular estrecho: 420 px o menos; espaciado compacto sin reducir targets táctiles.

## Matriz visual del Hito 1.1

Comprobada en el navegador integrado con el servidor local de Vite:

- `360 × 800` y `390 × 844`: topbar móvil completa, drawer cerrado fuera de pantalla, búsqueda desplegable, controles de 44 px y una sola columna.
- `768 × 1024` y `900 × 900`: drawer inclusivo hasta 900 px, búsqueda utilizable en la topbar y contenido en dos columnas cuando corresponde.
- `1024 × 768` y `1440 × 900`: sidebar persistente, marca completa en escritorio amplio y contenido correctamente dimensionado.

En los seis tamaños se comprobó `scrollWidth <= clientWidth`. También se probaron apertura y cierre del drawer, backdrop, Escape, restauración de foco, cierre al seleccionar un módulo, búsqueda global, temas claro/oscuro y navegación por Inicio, Farmacología, Microbiología, Nutrición, Clínica, Semiología y VetOnco. La consola no presentó errores ni advertencias durante el recorrido.

## Sistema visual de módulos (Hito 1.2)

- `shared/tokens.css` es la fuente única para color, tipografía local, escala 4–40 px, radios, sombras, foco, movimiento, densidad y colores temáticos.
- `shared/components.css` y `shared/styles/` definen headers de módulo, paneles, tarjetas, botones, campos, chips, alertas, tablas, resultados y estados vacíos.
- `shared/ui-system.js` mejora progresivamente tabs y modales: roles ARIA, flechas, Home/End, Escape, focus trap, restauración de foco y bloqueo de scroll.
- `shared/responsive.css` alinea el responsive interno con `900`, `640` y `420` px; las tablas densas usan wrappers con scroll local y el documento no debe desbordar.
- Claro y oscuro comparten los mismos tokens semánticos. Los colores de módulo se usan como acento, no como fondo dominante.

Un módulo nuevo debe reutilizar `sv-module-shell`, `sv-module-header`, `sv-module-subnav`, `sv-module-panel`, `sv-module-toolbar`, `sv-card`, `sv-field`, `sv-btn` y `sv-table-wrap`. Los selectores propios quedan reservados para identidad o comportamiento específico; impresión, PDF, datos y cálculos permanecen en sus contratos actuales.

## Fundación backend (Hito 2.1)

- `backend/app/main.py`: factory y entrada ASGI de FastAPI.
- `backend/app/core/`: settings `SUITEVET_` y respuestas de error JSON.
- `backend/app/api/v1/`: router versionado y endpoint de salud.
- `backend/app/schemas/`: contratos Pydantic de la API.
- `backend/tests/`: pruebas aisladas con `pytest` y `TestClient`.
- `shared/api-client.js`: cliente clásico bajo `window.SuiteVetAPI`, sin peticiones automáticas.
- `vite.config.mjs`: proxy de desarrollo `/api` hacia `http://127.0.0.1:8000`.

Este hito no incluye base de datos, usuarios, autenticación, IA ni migración de catálogos.

## Desarrollo con dos terminales

Primera instalación del backend desde la raíz, en PowerShell:

```powershell
py -3.12 -m venv backend/.venv
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[test]"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

En una segunda terminal, desde la raíz del repositorio:

```powershell
npm install
npm run dev
```

URLs locales:

- Frontend: `http://localhost:5173/`
- Salud: `http://127.0.0.1:8000/api/v1/health`
- Swagger: `http://127.0.0.1:8000/docs`
- OpenAPI: `http://127.0.0.1:8000/openapi.json`

El frontend puede iniciar sin el backend. `window.SuiteVetAPI.getHealth()` solo consulta la API cuando un consumidor lo solicita explícitamente.

## Catálogo versionado de módulos (Hito 2.2)

- `backend/app/data/modules.json` es la fuente autoritativa estática del registro de módulos.
- `GET /api/v1/catalog/modules` lista el catálogo ordenado y `GET /api/v1/catalog/modules/{slug}` consulta por slug o ID.
- `shared/module-catalog.js` entrega un fallback inmediato y solo adopta la respuesta API si pasa el mismo contrato de rutas, temas, iconos y texto seguro.
- Sidebar, inicio y etiquetas del buscador consumen el catálogo sin cambiar los contratos globales, las rutas existentes ni el estado activo.

El fallback frontend debe mantenerse en paridad con el JSON autoritativo hasta que la migración permita depender del backend. Una caída, timeout o respuesta inválida de la API conserva la SPA operativa con el catálogo local.

## Bibliografía académica versionada (Hito 2.3)

- `backend/app/data/bibliography.json` registra únicamente metadatos académicos ya presentes en la aplicación.
- `GET /api/v1/bibliography/resources` y `GET /api/v1/bibliography/resources/{slug}` entregan solo metadatos; no distribuyen ni extraen PDFs.
- `shared/bibliography.js` conserva un fallback local inmediato y acepta una respuesta API solo cuando no modifica título, autores, citas ni `asset_key` del recurso local.
- Los archivos se resuelven por una whitelist local de `asset_key`; no se aceptan rutas de API, URLs externas ni traversal.

El recurso actual conserva `review_status: draft`, `rights_status: unverified` y `source_status: unverified`, porque el repositorio no prueba revisión editorial, autorización de distribución ni fuente externa. Para añadir un recurso, primero documenta sus metadatos y citas demostrables, registra una clave de asset permitida si el archivo ya existe localmente y extiende las pruebas de paridad. La futura migración a PostgreSQL sustituirá el repositorio estático sin retirar el fallback hasta que la API sea la fuente confiable.

## Pruebas

```powershell
npm test
npm run build
cd backend
.\.venv\Scripts\python.exe -m pytest
```

Las variables admitidas se documentan con valores seguros en `backend/.env.example`. Un `.env` real permanece ignorado por Git. Para detalles de instalación, configuración y solución de problemas, consulta `backend/README.md`.

Si PowerShell bloquea `Activate.ps1`, no es necesario cambiar la política global: ejecuta directamente `backend\.venv\Scripts\python.exe`. Si bloquea `npm.ps1`, usa `npm.cmd` con los mismos argumentos.

## Autenticación, perfil y comentarios (Hito 3.2)

La SPA conserva todos los módulos públicos para visitantes. Supabase Auth gestiona registro, confirmación por correo, inicio, cierre, recuperación y persistencia de sesión; Suite Vet no guarda tokens manualmente. Perfil y Comentarios requieren sesión. El rol se consulta en `public.user_roles`, nunca en metadata del cliente.

Configura únicamente variables públicas en un `.env.local` ignorado por Git:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Luego ejecuta `npm install` y `npm run dev`. Los callbacks permitidos son la raíz publicada de Suite Vet y las raíces `http://localhost:5173/` y `http://127.0.0.1:5173/`. Si faltan variables, la SPA pública continúa operativa y la cuenta muestra un aviso controlado.

El perfil admite nombre, apellido, username, carrera, semestre e institución desde catálogos cerrados. `display_name` permanece por compatibilidad y `avatar_path` se reserva para un hito futuro. Los catálogos se ampliarán posteriormente desde administración.

Comentarios acepta exactamente Comentario, Recomendación o Error observado, texto de 10–2000 caracteres y calificación 1–5. El autor solo inserta y consulta sus filas; no puede editarlas, aprobarlas ni responderlas. Super Admin puede listar, filtrar, aprobar y responder, pero no alterar autor, asunto, texto o calificación originales.

No se crea un Super Admin automáticamente. La promoción futura debe hacerse solo para el UUID de una cuenta ya confirmada, mediante una operación administrativa autorizada que inserte `super_admin` en `public.user_roles`; nunca desde frontend, metadata ni una migración con correo personal.

### GitHub Pages

El repositorio mantiene `base: "./"`. Para publicar autenticación, el proceso de build debe proporcionar `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` y desplegar `dist/`. No agregues valores reales al repositorio. Mientras Pages sirva directamente la fuente sin reemplazar esos placeholders, los módulos públicos funcionarán pero la autenticación permanecerá deshabilitada de forma segura. Tras configurar el despliegue, verifica registro y recuperación manualmente sin repetir correos: el proveedor integrado del plan Free está limitado y puede responder 429.

Nunca uses en frontend `sb_secret`, `service_role`, JWT privados, contraseñas de base, connection strings, access tokens ni refresh tokens. Ante problemas, confirma solo que las variables existen, que el host corresponde al proyecto Suite Vet y que las Redirect URLs coinciden; no imprimas sus valores.
