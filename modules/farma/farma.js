// =============================================================================
// SUITE VET 2.0 — modules/farma/farma.js
// Lógica del módulo de Farmacología.
// Datos en: modules/farma/data.js (window.FARMA_DATA)
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("farma-root");
    if (!root) return;

    const farmacos = (window.FARMA_DATA || {}).farmacos || [];

    // -------------------------------------------------------------------------
    // 1. INYECTAR HTML
    // -------------------------------------------------------------------------
    // Grupos únicos para los filtros
    const grupos = [...new Set(farmacos.map((f) => f.grupo))];
    const opcionesGrupo = grupos.map((g) => `<option value="${g}">${g}</option>`).join("");

    root.innerHTML = `
      <h2>Farmacología</h2>
      <p class="sv-view-intro">
        Vademécum veterinario con calculadora de dosis por especie y peso.
        Calcula la dosis y agrégala directamente al recetario.
      </p>

      <div class="sv-toolbar">
        <input
          type="text"
          id="farma-search"
          class="sv-input"
          placeholder="Buscar por nombre, grupo o comercial…"
          style="max-width:360px;"
          autocomplete="off"
        />
        <select id="farma-filtro-grupo" class="sv-select" style="max-width:200px;">
          <option value="">Todos los grupos</option>
          ${opcionesGrupo}
        </select>
      </div>

      <div class="sv-grid" id="farma-lista"></div>
    `;

    // -------------------------------------------------------------------------
    // 2. FILTROS — BUG FIX: ahora sí están conectados
    // -------------------------------------------------------------------------
    const searchInput  = root.querySelector("#farma-search");
    const filtroGrupo  = root.querySelector("#farma-filtro-grupo");
    const lista        = root.querySelector("#farma-lista");

    function getQuery()  { return (searchInput?.value  || "").trim().toLowerCase(); }
    function getGrupo()  { return (filtroGrupo?.value  || ""); }

    searchInput?.addEventListener("input",  renderFarmacos);
    filtroGrupo?.addEventListener("change", renderFarmacos);

    // -------------------------------------------------------------------------
    // 3. RENDER DE TARJETAS
    // -------------------------------------------------------------------------
    function renderFarmacos() {
      const q     = getQuery();
      const grupo = getGrupo();

      const filtrados = farmacos.filter((f) => {
        const blob = `${f.principio} ${f.grupo} ${f.comerciales.join(" ")} ${f.mecanismo}`.toLowerCase();
        const pasaQ     = !q     || blob.includes(q);
        const pasaGrupo = !grupo || f.grupo === grupo;
        return pasaQ && pasaGrupo;
      });

      lista.innerHTML = "";

      if (filtrados.length === 0) {
        lista.innerHTML = `
          <div class="sv-empty">
            <div class="sv-empty-icon">💊</div>
            No se encontraron fármacos con ese criterio.
          </div>`;
        return;
      }

      filtrados.forEach((f) => {
        lista.appendChild(crearTarjeta(f));
      });
    }

    // -------------------------------------------------------------------------
    // 4. CREAR TARJETA CON CALCULADORA
    // -------------------------------------------------------------------------
    function crearTarjeta(f) {
      const art = document.createElement("article");
      art.className = "sv-card farma-card sv-fade-in";

      // Opciones de especie
      const opcionesEsp = f.especies
        .map((e, i) => `<option value="${i}">${e.nombre}</option>`)
        .join("");

      art.innerHTML = `
        <div class="sv-card-header">
          <span class="sv-card-title">${f.principio}</span>
          <span class="farma-badge-grupo">${f.grupo}</span>
        </div>

        <div class="sv-card-body">
          <p><strong>Concentración:</strong> ${f.concentracion} ${f.unidad}</p>
          <p><strong>Mecanismo:</strong> ${f.mecanismo}</p>
          <p><strong>Contraindicaciones:</strong> <span style="color:var(--sv-danger)">${f.contraindicaciones}</span></p>
          <div class="farma-comerciales">
            ${f.comerciales.map((c) => `<span class="farma-comercial-tag">${c}</span>`).join("")}
          </div>
        </div>

        <div class="farma-calc-area">
          <div class="farma-calc-row">
            <div>
              <span class="farma-calc-label">Especie / Indicación</span>
              <select class="sv-select _esp">${opcionesEsp}</select>
            </div>
            <div>
              <span class="farma-calc-label">Peso del animal (kg)</span>
              <input type="number" class="sv-input _peso" placeholder="0" min="0" step="0.1" />
            </div>
          </div>
          <div class="farma-resultado _resultado"></div>
          <button class="sv-btn sv-btn-primary sv-btn-full _btn-receta" style="display:none;">
            📋 Agregar a Receta
          </button>
        </div>
      `;

      // Lógica de la calculadora
      const selEsp    = art.querySelector("._esp");
      const inputPeso = art.querySelector("._peso");
      const divRes    = art.querySelector("._resultado");
      const btnReceta = art.querySelector("._btn-receta");

      let _dosisActual  = null;
      let _especieActual = null;
      let _retiroActual  = null;

      function calcular() {
        const peso = parseFloat(inputPeso.value);
        const espIdx = parseInt(selEsp.value, 10);

        if (!peso || peso <= 0) {
          divRes.classList.remove("visible");
          btnReceta.style.display = "none";
          return;
        }

        const esp = f.especies[espIdx];
        const dosisTotal = peso * esp.dosisMgKg;
        const ml = dosisTotal / f.concentracion;

        _dosisActual   = `${ml.toFixed(2)} mL`;
        _especieActual = esp.nombre;
        _retiroActual  = esp.retiroCarne > 0 || esp.retiroLeche > 0
          ? `🥩 Carne: ${esp.retiroCarne} días | 🥛 Leche: ${esp.retiroLeche} días`
          : "";

        divRes.classList.add("visible");
        divRes.innerHTML = `
          <div class="farma-dosis-valor">${_dosisActual}</div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <span class="sv-badge sv-badge-blue">${esp.via}</span>
            <span class="sv-badge sv-badge-gray">${esp.nombre}</span>
          </div>
          ${_retiroActual ? `<div class="farma-retiro-box">⏱ ${_retiroActual}</div>` : ""}
          <p class="farma-nota-especie">"${esp.nota}"</p>
        `;

        btnReceta.style.display = "block";
      }

      selEsp.addEventListener("change", calcular);
      inputPeso.addEventListener("input", calcular);

      btnReceta.addEventListener("click", () => {
        if (!_dosisActual) return;
        if (window.Recetario?.agregarItem) {
          window.Recetario.agregarItem(
            f,
            _dosisActual,
            f.especies[parseInt(selEsp.value, 10)].via,
            _especieActual,
            _retiroActual
          );
        }
      });

      return art;
    }

    // -------------------------------------------------------------------------
    // 5. RENDER INICIAL
    // -------------------------------------------------------------------------
    renderFarmacos();

    // -------------------------------------------------------------------------
    // 6. REGISTRO EN BUSCADOR GLOBAL
    // -------------------------------------------------------------------------
    if (window.SuiteVet?.registerSearch) {
      window.SuiteVet.registerSearch("farma", (q) =>
        farmacos
          .filter((f) =>
            `${f.principio} ${f.grupo} ${f.comerciales.join(" ")}`.toLowerCase().includes(q)
          )
          .map((f) => ({
            title:    f.principio,
            subtitle: f.grupo,
            moduleId: "farma",
            action: () => {
              window.SuiteVet.showView("farmacologia");
              if (searchInput) { searchInput.value = f.principio; renderFarmacos(); }
            }
          }))
      );
    }
  });
})();
