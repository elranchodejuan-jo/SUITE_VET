// =============================================================================
// SUITE VET 2.0 - modules/fisio/data.js
// Ensamblador de datos del modulo de Fisiologia.
// =============================================================================

(function () {
  "use strict";

  const parts = window.FISIO_DATA_PARTS || {};
  const required = ["hormonas", "vitaminas", "glosario"];
  const missing = required.filter((key) => !Array.isArray(parts[key]));

  if (missing.length) {
    console.warn("[SUITE VET Fisio] Faltan archivos de datos:", missing.join(", "));
  }

  window.FISIO_DATA = {
    hormonas: parts.hormonas || [],
    vitaminas: parts.vitaminas || [],
    glosario: parts.glosario || []
  };
})();
