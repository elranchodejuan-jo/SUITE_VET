# SUITE VET 2.0

## Arquitectura actual

SPA estatica en HTML, CSS y JavaScript clasico. `index.html` carga datos y controladores de `modules/`; `shared/` contiene router, estilos, Favoritos, Categorias y Recetario. La persistencia actual usa `localStorage` y los PDF se generan con vistas de impresion del navegador.

## Reglas de trabajo

- Migrar progresivamente. Conservar temporalmente `window.SuiteVet`, `window.Recetario` y las APIs globales existentes.
- No inventar, completar ni alterar contenido clinico, dosis o formulas sin fuente y revision profesional.
- Proteger Recetario, payloads, impresion/PDF y estilos de impresion.
- No exponer secretos. Nunca confirmar archivos `.env`, credenciales, tokens o claves.
- Supabase/Auth: solo variables de ejemplo vacías; `sb_secret`, `service_role`, JWT private keys, passwords y connection strings nunca entran en Git ni frontend.
- Toda identidad nueva debe verificar JWT criptográficamente en FastAPI y aplicar RLS explícito; no confiar en roles de metadata ni del cliente.
- No aplicar migraciones Supabase sin confirmar nombre y project ref del proyecto independiente Suite Vet; nunca reutilizar Cartilla Digital.
- Cambios de esquema Supabase solo mediante `supabase/migrations/` versionado, con pruebas SQL transaccionales cuando el entorno lo permita.
- No hacer push sin autorizacion explicita.
- Registrar cada modulo nuevo en `backend/app/data/modules.json` y mantener unicos sus IDs, slugs y rutas.
- Conservar `shared/module-catalog.js` como fallback local mientras dure la migracion progresiva al backend.
- En Bibliografia, migrar solo metadatos y citas demostrados; no completar campos desconocidos.
- No marcar recursos bibliograficos, fuentes ni derechos como verificados sin evidencia en el repositorio.
- Resolver archivos bibliograficos exclusivamente mediante una whitelist local de `asset_key` y conservar el fallback durante la migracion.
- Despues de cada cambio ejecutar `git diff --check`, `node --check` sobre todos los JS y `node --test`.

## Definicion de terminado

Un cambio esta terminado cuando respeta el alcance, conserva contratos y contenido protegido, incluye pruebas de regresion proporcionales al riesgo, pasa todas las validaciones, no agrega archivos accidentales y deja documentadas las comprobaciones visuales pendientes.
