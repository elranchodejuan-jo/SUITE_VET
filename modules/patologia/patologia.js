// =============================================================================
// SUITE VET 2.0 — modules/patologia/patologia.js
// Módulo de Patología Veterinaria.
// Para agregar un módulo nuevo, sigue este mismo patrón.
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("patologia-root");
    if (!root) return;

    const lesiones = (window.PATO_DATA || {}).lesiones || [];

    // Sistemas y tipos únicos para filtros
    const sistemas = [...new Set(lesiones.map((l) => l.sistema))];
    const tipos    = [...new Set(lesiones.map((l) => l.tipo))];

    root.innerHTML = `
      <h2>Patología</h2>
      <p class="sv-view-intro">
        Atlas de lesiones, hallazgos macroscópicos y diagnóstico diferencial veterinario.
      </p>

      <div class="sv-toolbar">
        <input
          type="text"
          id="pato-search"
          class="sv-input"
          placeholder="Buscar lesión, hallazgo o especie…"
          style="max-width:320px;"
          autocomplete="off"
        />
        <select id="pato-filtro-sistema" class="sv-select" style="max-width:180px;">
          <option value="">Todos los sistemas</option>
          ${sistemas.map((s) => `<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join("")}
        </select>
        <select id="pato-filtro-tipo" class="sv-select" style="max-width:160px;">
          <option value="">Todos los tipos</option>
          ${tipos.map((t) => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join("")}
        </select>
      </div>

      <div class="sv-grid" id="pato-lista"></div>
    `;

    const searchInput   = root.querySelector("#pato-search");
    const filtroSistema = root.querySelector("#pato-filtro-sistema");
    const filtroTipo    = root.querySelector("#pato-filtro-tipo");
    const lista         = root.querySelector("#pato-lista");

    function norm(s) {
      return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function render() {
      const q   = norm(searchInput?.value  || "");
      const sis = filtroSistema?.value || "";
      const tip = filtroTipo?.value    || "";

      const filtrados = lesiones.filter((l) => {
        const blob = norm(`${l.nombre} ${l.descripcion} ${l.etiologia} ${(l.especie || []).join(" ")}`);
        return (!q || blob.includes(q)) && (!sis || l.sistema === sis) && (!tip || l.tipo === tip);
      });

      lista.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔬</div>No se encontraron lesiones con ese criterio.</div>`
        : filtrados.map((l) => `
          <article class="sv-card pato-card sv-fade-in">
            <div class="sv-card-header">
              <span class="sv-card-title">${l.nombre}</span>
              <span class="pato-badge-sistema">${l.sistema}</span>
            </div>
            <span class="sv-card-subtitle">${(l.especie || []).join(" · ")}</span>
            <div class="sv-card-body">
              <p><strong>Descripción:</strong> ${l.descripcion}</p>
              <p><strong>Etiología:</strong> ${l.etiologia}</p>
              <p><strong>Hallazgos:</strong> ${l.hallazgos}</p>
              <p><strong>Diagnóstico:</strong> ${l.diagnostico}</p>
              <p><strong>Pronóstico:</strong> ${l.pronostico}</p>
            </div>
            <div class="sv-card-footer">
              <span class="pato-badge-tipo">${l.tipo}</span>
            </div>
          </article>`).join("");
    }

    searchInput?.addEventListener("input",   render);
    filtroSistema?.addEventListener("change", render);
    filtroTipo?.addEventListener("change",    render);

    render();

    // Buscador global
    if (window.SuiteVet?.registerSearch) {
      window.SuiteVet.registerSearch("pato", (q) =>
        lesiones
          .filter((l) =>
            `${l.nombre} ${l.descripcion} ${(l.especie || []).join(" ")}`.toLowerCase().includes(q)
          )
          .map((l) => ({
            title:    l.nombre,
            subtitle: `${l.sistema} · ${l.tipo}`,
            moduleId: "pato",
            action: () => {
              window.SuiteVet.showView("patologia");
              if (searchInput) { searchInput.value = l.nombre; render(); }
            }
          }))
      );
    }
  });
})();
