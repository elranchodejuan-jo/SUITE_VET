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
    hormonas: normalizeIds(parts.hormonas || [], "hormona"),
    vitaminas: normalizeIds(parts.vitaminas || [], "vitamina"),
    glosario: normalizeIds(parts.glosario || [], "glosario")
  };

  function normalizeIds(list, prefix) {
    const seen = new Set();
    return list.map((item, index) => {
      const base = item.id || item.nombre || item.sigla || `${prefix}-${index + 1}`;
      let id = slug(base) || `${prefix}-${index + 1}`;
      let suffix = 2;
      while (seen.has(id)) {
        id = `${slug(base) || prefix}-${suffix}`;
        suffix += 1;
      }
      seen.add(id);
      return { id, ...item };
    });
  }

  function slug(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
})();
