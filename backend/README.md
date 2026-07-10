# Suite Vet API

Fundación FastAPI del Hito 2.1. Actúa como frontera de dominio versionada y, por ahora, solo publica salud de proceso y documentación OpenAPI. No accede a datos veterinarios, base de datos, autenticación ni servicios de IA.

## Requisitos

- Python 3.12 o una versión compatible con `pyproject.toml`.
- Un entorno virtual local en `backend/.venv`.

## Instalación en PowerShell

Desde la raíz del repositorio:

```powershell
py -3.12 -m venv backend/.venv
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[test]"
```

No instales las dependencias globalmente. Si la activación está bloqueada por la política de PowerShell, usa el intérprete directamente:

```powershell
backend\.venv\Scripts\python.exe -m pip install -e "backend[test]"
```

## Ejecución

Terminal 1, dentro de `backend/`:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Terminal 2, desde la raíz:

```powershell
npm run dev
```

El proxy de Vite envía solo `/api/*` a `http://127.0.0.1:8000`. El build de producción no empaqueta Python ni `backend/.venv`.

## Endpoints y documentación

- `GET /api/v1/health`: estado determinista del proceso.
- `/docs`: Swagger durante desarrollo y pruebas.
- `/openapi.json`: contrato OpenAPI.
- Una ruta inexistente devuelve un error JSON sin traceback.

## Configuración

Los settings se cargan mediante `pydantic-settings`, usan el prefijo `SUITEVET_` y se cachean por proceso. La factory `create_app(settings)` permite reemplazarlos en pruebas.

| Variable | Valor de desarrollo |
| --- | --- |
| `SUITEVET_APP_NAME` | `Suite Vet API` |
| `SUITEVET_SERVICE_NAME` | `suite-vet-api` |
| `SUITEVET_APP_VERSION` | `0.1.0` |
| `SUITEVET_ENVIRONMENT` | `development` |
| `SUITEVET_DEBUG` | `false` |
| `SUITEVET_API_V1_PREFIX` | `/api/v1` |
| `SUITEVET_CORS_ORIGINS` | lista JSON con los dos orígenes Vite locales |
| `SUITEVET_HOST` | `127.0.0.1` |
| `SUITEVET_PORT` | `8000` |

Copia `backend/.env.example` a `backend/.env` solo para configuración local. Nunca confirmes el `.env` real. Los orígenes CORS deben ser explícitos; `*` se rechaza.

## Pruebas

Desde `backend/`:

```powershell
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m compileall -q app tests
.\.venv\Scripts\python.exe -c "from app.main import app; print(app.title)"
```

Las pruebas usan `TestClient`: no requieren Internet, servidor externo, claves ni base de datos.

## Estructura

```text
backend/
|-- app/
|   |-- api/v1/endpoints/health.py
|   |-- core/config.py
|   |-- core/errors.py
|   |-- schemas/health.py
|   `-- main.py
|-- tests/
|-- .env.example
|-- pyproject.toml
`-- README.md
```
