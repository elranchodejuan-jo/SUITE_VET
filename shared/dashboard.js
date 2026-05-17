// =============================================================================
// SUITE VET - Dashboard principal
// Calcula metricas desde los datos cargados de cada modulo.
// =============================================================================

(function () {
  "use strict";

  function len(value) {
    return Array.isArray(value) ? value.length : 0;
  }

  function computeCounts() {
    const fisio = window.FISIO_DATA || {};
    const farma = window.FARMA_DATA || {};
    const micro = window.MICRO_DATA || {};
    const pato = window.PATO_DATA || {};

    const fisioCount =
      len(fisio.hormonas) +
      len(fisio.vitaminas) +
      len(fisio.glosario);

    const farmaCount = len(farma.farmacos);

    const microCount =
      len(micro.agares) +
      len(micro.caldos) +
      len(micro.pruebas) +
      len(micro.antibioticos) +
      len(micro.microorganismos);

    const patoCount = len(pato.lesiones);

    return {
      fisio: fisioCount,
      farma: farmaCount,
      micro: microCount,
      pato: patoCount,
      total: fisioCount + farmaCount + microCount + patoCount
    };
  }

  function writeCount(key, value) {
    document.querySelectorAll(`[data-dashboard-count="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  }

  function initDashboard() {
    const counts = computeCounts();

    writeCount("fisio", counts.fisio);
    writeCount("farma", counts.farma);
    writeCount("micro", counts.micro);
    writeCount("pato", counts.pato);

    document.querySelectorAll("[data-dashboard-total]").forEach((el) => {
      el.textContent = counts.total;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDashboard);
  } else {
    initDashboard();
  }

  window.SuiteVet = window.SuiteVet || {};
  window.SuiteVet.updateDashboard = initDashboard;
})();
