// =============================================================================
// SUITE VET 2.0 — modules/farma/farma.js
// Versión con sistema de categorías visuales integrado.
// Requiere: shared/categorias.js cargado previamente.
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("farma-root");
    if (!root) return;

    const farmacos = (window.FARMA_DATA || {}).farmacos || [];
    const Cat = window.SuiteVet?.Categorias;

    if (!Cat) {
      console.warn("[Farma] shared/categorias.js no está cargado. El módulo funcionará sin colores.");
    }

    // -------------------------------------------------------------------------
    // 1. INYECTAR HTML
    // -------------------------------------------------------------------------
    root.innerHTML = `
      <h2>Farmacología</h2>
      <p class="sv-view-intro">
        Vademécum veterinario con calculadora de dosis por especie y peso.
        Cada fármaco está clasificado visualmente por su categoría farmacológica.
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
      </div>

      <!-- CHIPS DE FILTRO POR CATEGORÍA -->
      <div class="cat-chip-grid" id="farma-chips"></div>

      <div class="sv-grid" id="farma-lista"></div>
    `;

    // -------------------------------------------------------------------------
    // 2. RENDERIZAR CHIPS DE FILTRO POR CATEGORÍA
    // -------------------------------------------------------------------------
    const chipsContainer = root.querySelector("#farma-chips");
    let categoriaActiva = "todas";

    if (Cat && chipsContainer) {
      // Detectar qué categorías hay en los datos actuales
      const categoriasUsadas = new Set(
        farmacos.map(f => f.categoria || f.grupoKey).filter(Boolean)
      );

      // Chip "Todas"
      chipsContainer.innerHTML = `
        <button class="cat-chip is-active" data-cat="todas">
          <span>Todas</span>
          <span style="opacity:0.6">${farmacos.length}</span>
        </button>
      `;

      // Un chip por cada categoría usada, agrupado por familia
      Cat.familias().forEach(fam => {
        const cats = Cat.listByFamilia(fam.id).filter(c => categoriasUsadas.has(c.id));
        if (cats.length === 0) return;

        cats.forEach(c => {
          const count = farmacos.filter(f => (f.categoria || f.grupoKey) === c.id).length;
          const chip = document.createElement("button");
          chip.className = "cat-chip";
          chip.setAttribute("data-categoria", c.id);
          chip.dataset.cat = c.id;
          chip.innerHTML = `
            <span>${c.icon}</span>
            <span>${c.label}</span>
            <span style="opacity:0.6">${count}</span>
          `;
          chipsContainer.appendChild(chip);
        });
      });

      // Listener
      chipsContainer.addEventListener("click", (e) => {
        const chip = e.target.closest(".cat-chip");
        if (!chip) return;
        chipsContainer.querySelectorAll(".cat-chip").forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        categoriaActiva = chip.dataset.cat;
        renderFarmacos();
      });
    }

    // -------------------------------------------------------------------------
    // 3. RENDER DE TARJETAS
    // -------------------------------------------------------------------------
    const searchInput = root.querySelector("#farma-search");
    const lista       = root.querySelector("#farma-lista");

    searchInput?.addEventListener("input", renderFarmacos);

    function renderFarmacos() {
      const q = (searchInput?.value || "").trim().toLowerCase();

      const filtrados = farmacos.filter(f => {
        const blob = `${f.principio} ${f.grupo} ${f.comerciales.join(" ")} ${f.mecanismo}`.toLowerCase();
        const pasaQ   = !q || blob.includes(q);
        const catId   = f.categoria || f.grupoKey;
        const pasaCat = categoriaActiva === "todas" || catId === categoriaActiva;
        return pasaQ && pasaCat;
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

      filtrados.forEach(f => lista.appendChild(crearTarjeta(f)));
    }

    // -------------------------------------------------------------------------
    // 4. CREAR TARJETA CON IDENTIDAD DE CATEGORÍA
    // -------------------------------------------------------------------------
    function crearTarjeta(f) {
      const art   = document.createElement("article");
      const catId = f.categoria || f.grupoKey || "default";
      const cat   = Cat ? Cat.get(catId) : { label: f.grupo, icon: "💊", riesgoBase: 0 };

      // Aplicar identidad visual de categoría
      art.className = "cat-card sv-card sv-fade-in";
      art.setAttribute("data-categoria", catId);

      // ── Opciones de especie con dosis/kg visible ──────────────────────────────
      // Formato: "Canino — 5 mg/kg" para que el veterinario vea la dosis de un vistazo
      const opcionesEsp = f.especies
        .map((e, i) => `<option value="${i}">${e.nombre} — ${e.dosisMgKg} mg/kg</option>`)
        .join("");

      // ── Detectar alertas automáticas ─────────────────────────────────────────
      const alertas = [];
      const contraTxt = (f.contraindicaciones || "").toLowerCase();
      if (contraTxt.includes("mdr1") || contraTxt.includes("collie"))          alertas.push("mdr1");
      if (contraTxt.includes("gestación") || contraTxt.includes("gestacion")) alertas.push("gestacion");
      if (contraTxt.includes("renal"))                                          alertas.push("nefrotoxico");
      if (contraTxt.includes("hepático") || contraTxt.includes("hepato"))     alertas.push("hepatotoxico");

      // ── Determinar si la presentación es líquida o sólida ───────────────────
      const esLiquido = !f.unidad.toLowerCase().includes("tableta") &&
                        !f.unidad.toLowerCase().includes("cápsula") &&
                        !f.unidad.toLowerCase().includes("comprimido");
      const labelResultado = esLiquido ? "mL" : "tabletas";

      const riesgo = f.riesgo || cat.riesgoBase || 1;

      art.innerHTML = `
        <div class="sv-card-header">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            ${Cat ? Cat.iconCircle(catId) : ''}
            <div>
              <div class="sv-card-title">${f.principio}</div>
              <div class="sv-card-subtitle">${f.grupo}</div>
            </div>
          </div>
          ${Cat ? Cat.badge(catId) : ''}
        </div>

        <div class="sv-card-body">
          <p><strong>Mecanismo:</strong> ${f.mecanismo}</p>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-top:0.4rem;">
            ${Cat ? Cat.riesgoBadge(riesgo) : ''}
            ${f.comerciales.map(c => `<span class="farma-comercial-tag">${c}</span>`).join("")}
          </div>
        </div>

        ${alertas.length > 0 && Cat ? Cat.alerta(alertas) : ''}

        <div class="farma-calc-area">

          <!-- FILA 1: Especie (con dosis/kg) + Peso ───────────────────────── -->
          <div class="farma-calc-row">
            <div style="flex:2; min-width:160px;">
              <span class="farma-calc-label">Especie / Dosis por kg</span>
              <select class="sv-select _esp">${opcionesEsp}</select>
            </div>
            <div style="flex:1; min-width:100px;">
              <span class="farma-calc-label">Peso (kg)</span>
              <input type="number" class="sv-input _peso"
                placeholder="Ej. 25" min="0" step="0.1" />
            </div>
          </div>

          <!-- FILA 2: Presentación disponible ─────────────────────────────── -->
          <div class="farma-calc-row">
            <div style="flex:1;">
              <span class="farma-calc-label">Presentación disponible</span>
              <div class="farma-conc-wrap">
                <input type="number" class="sv-input _conc"
                  value="${f.concentracion}"
                  min="0.001" step="any"
                  title="Modifica si tienes una presentación diferente" />
                <span class="farma-conc-unit">${f.unidad}</span>
              </div>
            </div>
            <div style="flex:1;" class="_dosis-por-especie-wrap">
              <span class="farma-calc-label">Dosis para esta especie</span>
              <div class="_dosis-esp-info farma-dosis-esp-info">
                ← elige especie
              </div>
            </div>
          </div>

          <div class="farma-resultado _resultado"></div>
          <button class="sv-btn sv-btn-primary sv-btn-full _btn-receta" style="display:none;">
            📋 Agregar a Receta
          </button>
        </div>
      `;

      // ── Referencias al DOM ───────────────────────────────────────────────────
      const selEsp       = art.querySelector("._esp");
      const inputPeso    = art.querySelector("._peso");
      const inputConc    = art.querySelector("._conc");
      const divRes       = art.querySelector("._resultado");
      const btnReceta    = art.querySelector("._btn-receta");
      const dosisEspInfo = art.querySelector("._dosis-esp-info");

      let _dosisActual = null, _especieActual = null, _retiroActual = null;

      // ── Actualizar info de dosis/especie al cambiar el select ────────────────
      function actualizarInfoEspecie() {
        const espIdx = parseInt(selEsp.value, 10);
        const esp    = f.especies[espIdx];
        if (!esp || !dosisEspInfo) return;

        const conc = parseFloat(inputConc?.value) || f.concentracion;
        const dosisUnitaria = esLiquido
          ? `${esp.dosisMgKg} mg/kg × kg ÷ ${conc} ${f.unidad}`
          : `${esp.dosisMgKg} mg/kg × kg ÷ ${conc} ${f.unidad}`;

        dosisEspInfo.innerHTML = `
          <strong style="color:var(--sv-text-primary)">${esp.dosisMgKg} mg/kg</strong>
          <span style="opacity:0.6;font-size:0.75rem;display:block;margin-top:1px;">vía ${esp.via}</span>
        `;
      }

      // ── Calcular resultado ───────────────────────────────────────────────────
      function calcular() {
        const peso   = parseFloat(inputPeso.value);
        const conc   = parseFloat(inputConc.value);
        const espIdx = parseInt(selEsp.value, 10);
        const esp    = f.especies[espIdx];

        // Actualizar siempre la info de especie
        actualizarInfoEspecie();

        if (!peso || peso <= 0 || !conc || conc <= 0) {
          divRes.classList.remove("visible");
          btnReceta.style.display = "none";
          return;
        }

        // Cálculo en 2 pasos para mostrar el paso intermedio
        const mgTotales = peso * esp.dosisMgKg;
        const resultado = mgTotales / conc;

        // Formato del resultado según tipo de presentación
        const resultadoTexto = esLiquido
          ? `${resultado.toFixed(2)} mL`
          : `${resultado.toFixed(2)} tabletas`;

        _dosisActual   = resultadoTexto;
        _especieActual = esp.nombre.split(" — ")[0]; // Nombre sin la dosis/kg
        _retiroActual  = (esp.retiroCarne > 0 || esp.retiroLeche > 0)
          ? `🥩 Carne: ${esp.retiroCarne} días | 🥛 Leche: ${esp.retiroLeche} días`
          : "";

        divRes.classList.add("visible");
        divRes.innerHTML = `
          <div class="farma-dosis-valor">${_dosisActual}</div>
          <div class="farma-calc-pasos">
            <span>${peso} kg × ${esp.dosisMgKg} mg/kg</span>
            <span class="farma-calc-paso-igual">=</span>
            <strong>${mgTotales % 1 === 0 ? mgTotales : mgTotales.toFixed(2)} mg</strong>
            <span class="farma-calc-paso-igual">÷</span>
            <span>${conc} ${f.unidad}</span>
            <span class="farma-calc-paso-igual">=</span>
            <strong style="color:var(--sv-success)">${_dosisActual}</strong>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-top:0.3rem;">
            <span class="cat-badge cat-badge-solid" data-categoria="${catId}">${esp.via}</span>
            <span class="sv-badge sv-badge-gray">${_especieActual}</span>
          </div>
          ${_retiroActual ? `<div class="farma-retiro-box">⏱ ${_retiroActual}</div>` : ""}
          <p class="farma-nota-especie">"${esp.nota}"</p>
        `;
        btnReceta.style.display = "block";
      }

      // Inicializar info de especie al cargar
      actualizarInfoEspecie();

      selEsp.addEventListener("change", calcular);
      inputPeso.addEventListener("input", calcular);
      inputConc.addEventListener("input", calcular);

      btnReceta.addEventListener("click", () => {
        if (!_dosisActual) return;
        window.Recetario?.agregarItem(
          f, _dosisActual, f.especies[parseInt(selEsp.value, 10)].via, _especieActual, _retiroActual
        );
      });

      return art;
    }

    // -------------------------------------------------------------------------
    // 5. RENDER INICIAL
    // -------------------------------------------------------------------------
    renderFarmacos();

    // -------------------------------------------------------------------------
    // 6. BUSCADOR GLOBAL
    // -------------------------------------------------------------------------
    if (window.SuiteVet?.registerSearch) {
      window.SuiteVet.registerSearch("farma", (q) =>
        farmacos
          .filter(f => `${f.principio} ${f.grupo} ${f.comerciales.join(" ")}`.toLowerCase().includes(q))
          .map(f => ({
            title: f.principio,
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