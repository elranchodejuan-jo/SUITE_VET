# SUITE VET 2.0

SPA estática construida con HTML, CSS y JavaScript clásico. Vite se usa únicamente como servidor de desarrollo y herramienta de compilación; los contratos globales `window.SuiteVet` y `window.Recetario` se conservan durante la migración progresiva.

## Requisitos

- Node.js 20.19 o superior.
- npm 10 o superior.

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

## Pendientes para el Hito 1.2

- Revisar y unificar progresivamente los breakpoints internos de cada módulo.
- Completar la auditoría de accesibilidad de modales, pestañas y widgets complejos.
- Profundizar las pruebas visuales y de interacción por módulo sin alterar contenido clínico, cálculos ni impresión.
