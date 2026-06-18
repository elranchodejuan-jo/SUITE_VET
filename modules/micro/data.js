// =============================================================================
// SUITE VET / FITBET 2.2 - modules/micro/data.js
// Ensamblador de datos del ecosistema microbiologico.
// =============================================================================

(function () {
  "use strict";

  const parts = window.MICRO_DATA_PARTS || {};
  const required = [
    "perfilesPlaca",
    "agares",
    "caldos",
    "pruebas",
    "antibioticos",
    "microorganismos"
  ];

  const missing = required.filter((key) => !Array.isArray(parts[key]));
  if (missing.length) {
    console.warn("[SUITE VET Micro] Faltan archivos de datos:", missing.join(", "));
  }

  window.MICRO_DATA = {
    perfilesPlaca: parts.perfilesPlaca || [],
    agares: parts.agares || [],
    caldos: parts.caldos || [],
    pruebas: parts.pruebas || [],
    antibioticos: parts.antibioticos || [],
    microorganismos: parts.microorganismos || []
  };
})();
