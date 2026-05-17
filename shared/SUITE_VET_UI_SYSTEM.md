# SUITE VET UI System

Base visual oficial para modulos actuales y futuros de SUITE VET.

## Archivos base

- `shared/tokens.css`: colores, tipografias, sombras, espacios, radios y tiempos.
- `shared/components.css`: componentes reutilizables.
- `shared/dashboard.css`: portada operativa del sistema.
- `shared/liquid-glass.css`: capa visual Liquid Lab Glass para pantalla.
- `shared/responsive.css`: adaptacion global para laptop, TV, tablet y celular.

Los estilos de impresion y PDFs se mantienen en sus archivos actuales. No mover reglas `@media print` a esta guia.

## Componentes estandar

### Layout

- `.sv-section`
- `.sv-section-head`
- `.sv-section-title`
- `.sv-kicker`
- `.sv-lead`
- `.sv-panel`
- `.sv-panel-header`
- `.sv-panel-body`
- `.sv-panel-footer`
- `.sv-stack`
- `.sv-cluster`
- `.sv-cluster-between`
- `.sv-actions`

### Tarjetas

- `.sv-card`
- `.sv-card-compact`
- `.sv-card-interactive`
- `.sv-card-metric`
- `.sv-card-header`
- `.sv-card-title`
- `.sv-card-subtitle`
- `.sv-card-body`
- `.sv-card-footer`

### Botones

- `.sv-btn`
- `.sv-btn-primary`
- `.sv-btn-secondary`
- `.sv-btn-ghost`
- `.sv-btn-danger`
- `.sv-btn-success`
- `.sv-btn-warning`
- `.sv-btn-info`
- `.sv-btn-soft`
- `.sv-btn-icon`
- `.sv-btn-sm`
- `.sv-btn-lg`
- `.sv-btn-block`

### Chips y badges

- `.sv-chip`
- `.sv-chip-active` o `.sv-chip.is-active`
- `.sv-chip-success`
- `.sv-chip-warning`
- `.sv-chip-danger`
- `.sv-chip-info`
- `.sv-badge`

### Formularios

- `.sv-form-grid`
- `.sv-field`
- `.sv-label`
- `.sv-help`
- `.sv-input`
- `.sv-select`
- `.sv-textarea`
- `.sv-form-actions`

### Alertas

- `.sv-alert`
- `.sv-alert-info`
- `.sv-alert-success`
- `.sv-alert-warning`
- `.sv-alert-danger`

### Tablas

- `.sv-table-wrap`
- `.sv-table`
- `.sv-table-compact`

### Modales

- `.sv-modal`
- `.sv-modal-sm`
- `.sv-modal-md`
- `.sv-modal-lg`
- `.sv-modal-xl`
- `.sv-modal-close`

## Regla de uso

Los modulos nuevos deben iniciar con estas clases compartidas. Las clases propias del modulo se usan solo para identidad, color o comportamiento especifico.
