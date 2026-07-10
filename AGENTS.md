# SUITE VET 2.0

## Arquitectura actual

SPA estatica en HTML, CSS y JavaScript clasico. `index.html` carga datos y controladores de `modules/`; `shared/` contiene router, estilos, Favoritos, Categorias y Recetario. La persistencia actual usa `localStorage` y los PDF se generan con vistas de impresion del navegador.

## Reglas de trabajo

- Migrar progresivamente. Conservar temporalmente `window.SuiteVet`, `window.Recetario` y las APIs globales existentes.
- No inventar, completar ni alterar contenido clinico, dosis o formulas sin fuente y revision profesional.
- Proteger Recetario, payloads, impresion/PDF y estilos de impresion.
- No exponer secretos. Nunca confirmar archivos `.env`, credenciales, tokens o claves.
- No hacer push sin autorizacion explicita.
- Despues de cada cambio ejecutar `git diff --check`, `node --check` sobre todos los JS y `node --test`.

## Definicion de terminado

Un cambio esta terminado cuando respeta el alcance, conserva contratos y contenido protegido, incluye pruebas de regresion proporcionales al riesgo, pasa todas las validaciones, no agrega archivos accidentales y deja documentadas las comprobaciones visuales pendientes.
