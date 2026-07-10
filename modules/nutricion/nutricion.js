(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("nutricion-root");
    if (!root) return;

    const D = window.NUTRICION_DATA || {};
    const Fav = window.SuiteVet?.Favorites;
    const STORAGE_KEY = "suitevet_nutricion_guardados";
    const PRINT_FOOTER = "Herramienta educativa veterinaria. Verificar con criterios profesionales y tablas oficiales.";

    const state = {
      page: "home",
      section: "aprender",
      globalQuery: "",
      filters: {},
      queries: {},
      calcs: {
        weende: {},
        water: { especie: "bovino", etapa: "Mantenimiento", clima: "Templado" },
        etiqueta: { especie: "", etapa: "" },
        comparador: { a: "maiz", b: "pasta_soya", c: "" },
        racion: { especie: "Bovinos", etapa: "Mantenimiento", rows: defaultRationRows() },
        costo: {}
      }
    };

    const pageAliases = {
      "materia-seca": "weende",
      "eln": "weende",
      "base-fresca-seca": "weende",
      "costo-kg": "formulacion",
      "deficiencias": "trastornos",
      "excesos": "trastornos",
      "signos": "trastornos"
    };

    const submoduleById = Object.fromEntries((D.submodulos || []).map((item) => [item.id, item]));
    const sectionById = Object.fromEntries((D.secciones || []).map((item) => [item.id, item]));
    const printArea = ensurePrintArea();

    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleInput);

    printArea.addEventListener("click", (event) => {
      if (event.target.closest("[data-nutri-print-close]") || event.target === printArea) closePrintView();
      if (event.target.closest("[data-nutri-print-now]")) window.print();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && printArea.classList.contains("is-open")) closePrintView();
    });

    document.addEventListener("suitevet:viewchange", (event) => {
      updateSavedFab(event.detail?.view || "");
    });

    document.addEventListener("suitevet:favoriteschange", () => {
      if (window.SuiteVet?.currentView === "nutricion") render();
    });

    render();
    registerGlobalSearch();

    function render() {
      const current = currentContentPage();
      root.innerHTML = `
        <section class="nutri-shell sv-module-shell">
          ${renderModuleNav(current)}
          ${renderGlobalResults()}
          <div id="nutri-tabpanel" class="sv-module-panel">
            ${renderSubmodule(current)}
          </div>
        </section>
        <button id="nutri-fab-saved" class="sv-fab nutricion-fab" type="button" data-nutri-page="guardados" title="Guardados de Nutricion">
          Guardados
          <span class="sv-fab-badge" data-count="${getSaved().length}">${getSaved().length}</span>
        </button>
      `;

      Fav?.bindWithin(root);
      updateSavedFab(window.SuiteVet?.currentView || "home");
    }

    function currentContentPage() {
      if (state.page === "guardados") return "guardados";
      if (state.page === "home") return firstSubmoduleForSection(state.section) || "aminoacidos";
      return state.page;
    }

    function renderModuleNav(current) {
      const activeSection = activeSectionId(current);
      const submodules = submodulesForSection(activeSection);
      return `
        <div class="nutri-subnav sv-module-subnav nutri-section-tabs" data-tabpanel="nutri-tabpanel" aria-label="Secciones de Nutricion Animal">
          ${(D.secciones || []).map((section) => `
            <button class="nutri-tab sv-module-tab ${section.id === activeSection ? "is-active" : ""}" type="button"
              data-nutri-section-pill="${escapeAttr(section.id)}">
              <span>${icon(section.icono)}</span>
              <strong>${escapeHtml(section.titulo)}</strong>
              <b>${section.submodulos?.length || 0}</b>
            </button>
          `).join("")}
        </div>

        <div class="nutri-subnav sv-module-subnav nutri-module-tabs" data-tabpanel="nutri-tabpanel" aria-label="Submodulos de Nutricion Animal">
          ${submodules.map((mod) => `
            <button class="nutri-tab sv-module-tab nutri-module-pill ${mod.id === current ? "is-active" : ""}" type="button"
              data-nutri-page="${escapeAttr(mod.id)}" title="${escapeAttr(mod.descripcion)}">
              <span>${icon(mod.icono)}</span>
              <strong>${escapeHtml(mod.titulo)}</strong>
              <b>${escapeHtml(navCountLabel(mod))}</b>
            </button>
          `).join("")}
        </div>

        <label class="nutri-global-search sv-field">
          <span class="sv-label">Busqueda global de Nutricion Animal</span>
          <input
              id="nutri-global-search"
              class="sv-input"
              type="text"
              value="${escapeAttr(state.globalQuery)}"
              placeholder="Buscar en todas las bases..."
              autocomplete="off"
            />
        </label>
      `;
    }

    function renderGlobalResults() {
      const q = norm(state.globalQuery);
      if (q.length < 2) return "";
      const results = buildSearchItems()
        .filter((item) => norm(item.blob).includes(q))
        .slice(0, 24);

      if (!results.length) {
        return `<div class="nutri-search-panel"><div class="sv-empty"><div class="sv-empty-icon">?</div>Sin resultados globales.</div></div>`;
      }

      return `
        <section class="nutri-search-panel">
          <div class="nutri-panel-head">
            <div>
              <span class="nutri-kicker">Busqueda global</span>
              <h3>${results.length} resultado${results.length === 1 ? "" : "s"}</h3>
            </div>
            <button class="sv-btn sv-btn-ghost" type="button" data-nutri-clear-global>Limpiar</button>
          </div>
          <div class="nutri-result-list">
            ${results.map((item) => `
              <button class="nutri-result-item" type="button" data-nutri-page="${escapeAttr(item.page)}" data-nutri-focus="${escapeAttr(item.id)}">
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.subtitle)}</span>
              </button>
            `).join("")}
          </div>
        </section>
      `;
    }

    function renderHome() {
      return `
        <section class="nutri-section-grid">
          ${(D.secciones || []).map(renderSectionCard).join("")}
        </section>

        <section class="nutri-submodule-board">
          <div class="nutri-panel-head">
            <div>
              <span class="nutri-kicker">Submodulos</span>
              <h3>Nutricion Animal Lab</h3>
            </div>
            <span class="nutri-count">${(D.submodulos || []).length}</span>
          </div>
          <div class="nutri-submodule-grid">
            ${(D.submodulos || []).map(renderSubmoduleButton).join("")}
          </div>
        </section>
      `;
    }

    function renderSectionCard(section) {
      const count = section.submodulos?.length || 0;
      return `
        <article class="sv-card sv-module-card nutri-section-card" data-nutri-section="${escapeAttr(section.id)}">
          <div class="sv-card-header">
            <div class="nutri-section-title">
              <span class="nutri-icon">${icon(section.icono)}</span>
              <div>
                <span class="sv-card-title">${escapeHtml(section.titulo)}</span>
                <span class="sv-card-subtitle">${count} submodulos</span>
              </div>
            </div>
            ${statusBadge(section.estado)}
          </div>
          <div class="sv-card-body">
            <p>${escapeHtml(section.descripcion)}</p>
          </div>
          <div class="sv-card-footer">
            <button class="sv-btn sv-btn-primary" type="button" data-nutri-open-section="${escapeAttr(section.id)}">Abrir</button>
          </div>
        </article>
      `;
    }

    function renderSubmoduleButton(mod) {
      return `
        <button class="nutri-submodule-card" type="button" data-nutri-page="${escapeAttr(mod.id)}">
          <span class="nutri-icon">${icon(mod.icono)}</span>
          <strong>${escapeHtml(mod.titulo)}</strong>
          <small>${escapeHtml(mod.categoria)} · ${escapeHtml(mod.descripcion)}</small>
          ${statusBadge(mod.estado)}
        </button>
      `;
    }

    function renderSubmodule(page) {
      if (page === "guardados") return renderSavedPanel();

      const canonical = pageAliases[page] || page;
      const meta = submoduleById[page] || submoduleById[canonical] || {
        titulo: "Submodulo",
        descripcion: "Dato pendiente",
        estado: "Beta",
        icono: "book-open"
      };

      const body = renderSubmoduleBody(page, canonical);
      return `
        <section class="nutri-page">
          <div class="nutri-context sv-module-context">
            <div>
              <span class="nutri-icon">${icon(meta.icono)}</span>
              <strong>${escapeHtml(meta.titulo)}</strong>
              <small>${escapeHtml(contextCountLabel(page, canonical))}</small>
            </div>
            <p>${escapeHtml(meta.descripcion || "")}</p>
            ${statusBadge(meta.estado || "Beta")}
          </div>
          ${body}
        </section>
      `;
    }

    function renderSubmoduleBody(page, canonical) {
      if (canonical === "weende") return renderWeendePage(page);
      if (canonical === "agua") return renderWaterPage();
      if (canonical === "etiquetas") return renderLabelInterpreter();
      if (canonical === "comparador") return renderFoodComparator();
      if (canonical === "formulacion") return renderRationPage(page);
      if (canonical === "costo-animal") return renderCostPerAnimal();
      if (page === "prevencion" || page === "recomendaciones") return renderPendingClinical(page);
      return renderDataPage(page, canonical);
    }

    function renderDataPage(page, canonical) {
      const items = getPageItems(page, canonical);
      const q = norm(state.queries[page] || "");
      const filter = state.filters[page] || "todos";
      const filters = getFilters(page, canonical, items);
      const filtered = items.filter((item) => {
        const favId = favoriteId(page, item);
        if (filter === "favoritos" && !Fav?.isFavorite?.(favId)) return false;
        if (filter !== "todos" && filter !== "favoritos" && !matchesFilter(page, canonical, item, filter)) return false;
        return !q || norm(JSON.stringify(item)).includes(q);
      });

      return `
        ${renderLocalToolbar(page, filters, items, canonical)}
        <div class="nutri-card-grid">
          ${filtered.length ? filtered.map((item) => renderDataCard(page, canonical, item)).join("") : emptyState("Sin resultados en este submodulo.")}
        </div>
      `;
    }

    function renderLocalToolbar(page, filters, items, canonical) {
      return `
        <div class="nutri-toolbar sv-module-toolbar">
          <label class="sv-field">
            <span class="sv-label">Buscar dentro del submodulo</span>
            <input class="sv-input" type="text" data-nutri-search="${escapeAttr(page)}"
              value="${escapeAttr(state.queries[page] || "")}"
              placeholder="Nombre, termino o categoria..." autocomplete="off" />
          </label>
          <div class="nutri-chip-row">
            ${filters.map((filter) => `
              <button class="nutri-chip ${(state.filters[page] || "todos") === filter.id ? "is-active" : ""}"
                type="button" data-nutri-filter="${escapeAttr(filter.id)}" data-nutri-filter-page="${escapeAttr(page)}">
                <span>${escapeHtml(filter.label)}</span>
                <b>${filterCount(page, canonical, items, filter.id)}</b>
              </button>
            `).join("")}
          </div>
        </div>
      `;
    }

    function renderDataCard(page, canonical, item) {
      const title = titleFor(page, item);
      const subtitle = subtitleFor(page, canonical, item);
      const favId = favoriteId(page, item);
      const description = descriptionFor(page, canonical, item);

      return `
        <article class="sv-card sv-module-card nutri-card sv-fade-in"
          data-nutri-item="${escapeAttr(item.id || title)}"
          data-fav-id="${escapeAttr(favId)}"
          data-fav-title="${escapeAttr(title)}"
          data-fav-module="Nutricion Animal"
          data-fav-submodule="${escapeAttr(submoduleById[page]?.titulo || submoduleById[canonical]?.titulo || page)}"
          data-fav-type="Tarjeta"
          data-fav-description="${escapeAttr(description)}">
          <div class="sv-card-header">
            <div>
              <span class="sv-card-title">${escapeHtml(title)}</span>
              <span class="sv-card-subtitle">${escapeHtml(subtitle)}</span>
            </div>
          </div>
          <div class="sv-card-body">
            ${renderCardBody(page, canonical, item)}
          </div>
          <div class="sv-card-footer nutri-card-footer-actions">
            <button class="nutri-print-pill" type="button" title="Imprimir ficha"
              data-nutri-print-card data-page="${escapeAttr(page)}" data-id="${escapeAttr(item.id || title)}">
              <span aria-hidden="true">&#x2399;</span>
              Imprimir
            </button>
          </div>
        </article>
      `;
    }

    function renderCardBody(page, canonical, item) {
      if (canonical === "aminoacidos") {
        return `
          ${field("Tipo", item.tipo)}
          ${field("Funcion", item.funcion)}
          ${field("Importancia", item.importanciaAnimales)}
          ${field("Especies clave", joinList(item.especiesClave))}
          ${field("Fuentes", joinList(item.fuentes))}
          ${field("Deficiencia", item.deficiencia)}
          ${renderRecognition(item.comoReconocer)}
        `;
      }

      if (canonical === "nutrientes") {
        return `
          ${field("Funcion", item.funcion)}
          ${item.energiaPorGramoKcal ? field("Energia", `${item.energiaPorGramoKcal} kcal/g`) : ""}
          ${field("Fuentes", joinList(item.fuentes))}
          ${field("Rumiantes", item.rumiantes)}
          ${field("Monogastricos", item.monogastricos)}
          ${field("Deficiencia", item.deficiencia)}
          ${field("Exceso", item.exceso)}
          ${field("Nota clinica", item.notaClinica)}
          ${renderRecognition(item.comoReconocer)}
        `;
      }

      if (canonical === "acidos-grasos") {
        return `
          ${field("Tipo", item.tipo)}
          ${field("Familia", item.familia)}
          ${field("Fuentes", joinList(item.fuentes))}
          ${field("Funcion", item.funcion)}
          ${field("Uso nutricional", item.usoNutricional)}
          ${field("Especies", joinList(item.especiesImportantes))}
          ${renderRecognition(item.comoReconocer)}
        `;
      }

      if (canonical === "vitaminas-minerales") {
        return `
          ${field("Tipo", item.tipo)}
          ${field("Funcion", item.funcion)}
          ${field("Fuentes", joinList(item.fuentes))}
          ${field("Deficiencia", item.deficiencia)}
          ${field("Exceso / toxicidad", item.exceso)}
          ${field("Especies sensibles", joinList(item.especiesSensibles))}
          ${field("Nota clinica", item.notaClinica)}
          ${renderRecognition(item.comoReconocer)}
        `;
      }

      if (canonical === "ingredientes") {
        return `
          <div class="nutri-mini-table">
            ${metric("MS", item.materiaSeca)}
            ${metric("PC", item.proteinaCruda)}
            ${metric("Fibra", item.fibraCruda)}
            ${metric("Grasa", item.extractoEtereo)}
            ${metric("Energia", item.energia)}
          </div>
          ${field("Categoria", item.categoria)}
          ${field("Especies", joinList(item.especiesRecomendadas))}
          ${field("Limite de inclusion", item.limiteInclusion)}
          ${field("Riesgos", joinList(item.riesgos))}
          ${field("Observaciones", item.observaciones)}
          ${renderRecognition(item.comoReconocer)}
        `;
      }

      if (canonical === "digestion") {
        return `
          ${field("Tipo digestivo", item.tipoDigestivo)}
          ${field("Organos", joinList(item.organos))}
          ${field("Nutrientes mejor aprovechados", joinList(item.nutrientesMejorAprovechados))}
          ${field("Particularidad", item.particularidad)}
          ${field("Riesgos", joinList(item.riesgos))}
          ${field("Ejemplo", item.ejemplo)}
        `;
      }

      if (canonical === "fermentacion-ruminal") {
        return `
          ${field("Tipo", item.tipo)}
          ${field("Origen", item.origen)}
          ${field("Funcion", item.funcion)}
          ${field("Importancia", item.importancia)}
          ${field("Alerta", item.alerta)}
        `;
      }

      if (canonical === "trastornos") {
        return `
          ${field("Tipo", item.tipo)}
          ${field("Especies afectadas", joinList(item.especiesAfectadas))}
          ${field("Causa nutricional", item.causaNutricional)}
          ${field("Signos clinicos", joinList(item.signosClinicos))}
          ${field("Prevencion", item.prevencion)}
          ${field("Correccion nutricional", item.correccionNutricional)}
          <div class="nutri-alert">${escapeHtml(item.alertaVeterinaria || D.trastornosAdvertencia)}</div>
          ${renderRecognition(item.comoReconocer)}
        `;
      }

      if (canonical === "weende") {
        return `
          ${field("Abreviatura", item.abreviatura)}
          ${field("Descripcion", item.descripcion)}
          ${field("Que mide", item.queMide)}
          ${field("Formula", item.formula)}
          ${field("Importancia", item.importancia)}
          ${field("Interpretacion", item.interpretacion)}
          ${field("Como reconocer", item.comoReconocer)}
          ${field("Metodologia", item.metodologia)}
        `;
      }

      return field("Dato", descriptionFor(page, canonical, item));
    }

    function renderWeendePage(page) {
      return `
        <div class="nutri-two-col">
          <section class="nutri-panel sv-module-panel">
            <div class="nutri-panel-head">
              <div>
                <span class="nutri-kicker">Analisis proximal</span>
                <h3>Fracciones de Weende</h3>
              </div>
            </div>
            <div class="nutri-card-grid is-compact">
              ${(D.weende || []).map((item) => renderDataCard("weende", "weende", item)).join("")}
            </div>
          </section>
          <section class="nutri-panel sv-module-panel">
            ${renderWeendeCalculator(page)}
            ${renderBaseConverter()}
          </section>
        </div>
      `;
    }

    function renderWeendeCalculator(page) {
      const v = state.calcs.weende;
      const result = calcWeende(v);
      return `
        <div class="nutri-calculator">
          <div class="nutri-panel-head">
            <div>
              <span class="nutri-kicker">Calculadora</span>
              <h3>${page === "eln" ? "ELN" : "Materia seca / Weende"}</h3>
            </div>
          </div>
          <div class="nutri-form-grid">
            ${input("Peso muestra humeda (g)", "weende", "muestraHumeda", v.muestraHumeda)}
            ${input("Peso muestra parcialmente seca (g)", "weende", "muestraParcialSeca", v.muestraParcialSeca)}
            ${input("Peso muestra seca (g)", "weende", "muestraSeca", v.muestraSeca)}
            ${input("% Humedad si ya lo tienes", "weende", "humedad", v.humedad)}
            ${input("% Cenizas", "weende", "cenizas", v.cenizas)}
            ${input("% Proteina cruda", "weende", "proteina", v.proteina)}
            ${input("% Extracto etereo", "weende", "eter", v.eter)}
            ${input("% Fibra cruda", "weende", "fibra", v.fibra)}
          </div>
          ${renderCalcResult("Resultado Weende", result.lines, result.alerts)}
          <div class="nutri-action-row">
            <button class="sv-btn sv-btn-ghost" type="button" data-nutri-calc-clear="weende">Limpiar</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-copy="weende">Copiar resultado</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-save="weende">Guardar calculo</button>
            <button class="sv-btn sv-btn-primary" type="button" data-nutri-calc-print="weende">Imprimir ficha</button>
          </div>
        </div>
      `;
    }

    function renderBaseConverter() {
      const v = state.calcs.weende;
      const ms = number(v.baseMs);
      const bf = number(v.baseFresca);
      const bs = number(v.baseSeca);
      const toDry = finite(ms) && finite(bf) && ms > 0 ? (bf * 100) / ms : null;
      const toFresh = finite(ms) && finite(bs) ? (bs * ms) / 100 : null;
      return `
        <div class="nutri-calculator is-secondary">
          <div class="nutri-panel-head">
            <div>
              <span class="nutri-kicker">Conversion</span>
              <h3>Base fresca / base seca</h3>
            </div>
          </div>
          <div class="nutri-form-grid">
            ${input("% Materia seca", "weende", "baseMs", v.baseMs)}
            ${input("Nutriente en base fresca (%)", "weende", "baseFresca", v.baseFresca)}
            ${input("Nutriente en base seca (%)", "weende", "baseSeca", v.baseSeca)}
          </div>
          ${renderCalcResult("Conversion", [
            ["Base seca estimada", finite(toDry) ? `${fmt(toDry)}%` : "Dato pendiente"],
            ["Base fresca estimada", finite(toFresh) ? `${fmt(toFresh)}%` : "Dato pendiente"]
          ], ["Usa materia seca real del alimento para comparar correctamente."])}
        </div>
      `;
    }

    function renderWaterPage() {
      const v = state.calcs.water;
      const result = calcWater(v);
      return `
        <div class="nutri-two-col">
          <section class="nutri-panel sv-module-panel">
            <div class="nutri-panel-head">
              <div>
                <span class="nutri-kicker">Agua</span>
                <h3>Datos fuente del PDF</h3>
              </div>
            </div>
            ${field("Fuentes de agua", joinList(D.agua?.fuentesAgua))}
            ${field("Forrajes verdes y ensilados", D.agua?.humedadAlimentos?.forrajesVerdesEnsilados)}
            ${field("Alimentos secos", D.agua?.humedadAlimentos?.alimentosSecos)}
            ${field("Alerta humedad", D.agua?.humedadAlimentos?.alertaHumedad)}
            ${field("Agua metabolica", `Carbohidratos: ${D.agua?.aguaMetabolica?.carbohidratos}; grasa: ${D.agua?.aguaMetabolica?.grasa}; proteina: ${D.agua?.aguaMetabolica?.proteina}.`)}
            ${field("Restriccion", `${D.agua?.restriccion?.moderada} ${D.agua?.restriccion?.severa}`)}
          </section>
          <section class="nutri-panel sv-module-panel">
            <div class="nutri-calculator">
              <div class="nutri-panel-head">
                <div>
                  <span class="nutri-kicker">Calculadora</span>
                  <h3>Consumo de agua</h3>
                </div>
              </div>
              <div class="nutri-form-grid">
                <label><span>Especie</span><select class="sv-select" data-calc-bucket="water" data-calc-field="especie">
                  ${(D.agua?.especies || []).map((e) => `<option value="${escapeAttr(e.id)}"${v.especie === e.id ? " selected" : ""}>${escapeHtml(e.nombre)}</option>`).join("")}
                </select></label>
                ${input("Peso vivo (kg)", "water", "peso", v.peso)}
                <label><span>Etapa productiva</span><select class="sv-select" data-calc-bucket="water" data-calc-field="etapa">
                  ${(D.agua?.etapas || []).map((e) => `<option value="${escapeAttr(e)}"${v.etapa === e ? " selected" : ""}>${escapeHtml(e)}</option>`).join("")}
                </select></label>
                <label><span>Clima</span><select class="sv-select" data-calc-bucket="water" data-calc-field="clima">
                  ${(D.agua?.climas || []).map((e) => `<option value="${escapeAttr(e)}"${v.clima === e ? " selected" : ""}>${escapeHtml(e)}</option>`).join("")}
                </select></label>
                ${input("Consumo de materia seca (kg/dia)", "water", "materiaSeca", v.materiaSeca)}
                ${input("Produccion de leche (kg o L/dia)", "water", "leche", v.leche)}
                ${input("Postura de huevos (%)", "water", "postura", v.postura)}
              </div>
              ${renderCalcResult("Consumo estimado", result.lines, result.alerts)}
              <div class="nutri-action-row">
                <button class="sv-btn sv-btn-ghost" type="button" data-nutri-calc-clear="water">Limpiar</button>
                <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-save="water">Guardar calculo</button>
                <button class="sv-btn sv-btn-primary" type="button" data-nutri-calc-print="water">Imprimir ficha</button>
              </div>
            </div>
          </section>
        </div>
      `;
    }

    function renderLabelInterpreter() {
      const v = state.calcs.etiqueta;
      const result = calcLabel(v);
      return `
        <section class="nutri-panel sv-module-panel">
          <div class="nutri-calculator">
            <div class="nutri-panel-head">
              <div>
                <span class="nutri-kicker">Balanceado</span>
                <h3>Interpretador de etiquetas</h3>
              </div>
            </div>
            <div class="nutri-form-grid">
              ${textInput("Especie", "etiqueta", "especie", v.especie)}
              ${textInput("Etapa", "etiqueta", "etapa", v.etapa)}
              ${input("% Proteina cruda", "etiqueta", "proteinaCruda", v.proteinaCruda)}
              ${input("% Grasa / extracto etereo", "etiqueta", "grasa", v.grasa)}
              ${input("% Fibra cruda", "etiqueta", "fibraCruda", v.fibraCruda)}
              ${input("% Humedad", "etiqueta", "humedad", v.humedad)}
              ${input("% Cenizas", "etiqueta", "cenizas", v.cenizas)}
              ${input("% ELN si esta disponible", "etiqueta", "eln", v.eln)}
              ${input("Energia si esta disponible", "etiqueta", "energia", v.energia)}
            </div>
            ${renderCalcResult("Interpretacion", result.lines, result.alerts)}
            <div class="nutri-action-row">
              <button class="sv-btn sv-btn-ghost" type="button" data-nutri-calc-clear="etiqueta">Limpiar</button>
              <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-save="etiqueta">Guardar interpretacion</button>
              <button class="sv-btn sv-btn-primary" type="button" data-nutri-calc-print="etiqueta">Imprimir ficha</button>
            </div>
          </div>
        </section>
      `;
    }

    function renderFoodComparator() {
      const v = state.calcs.comparador;
      const items = [v.a, v.b, v.c].filter(Boolean).map((id) => findById(D.ingredientes, id)).filter(Boolean);
      const conclusions = compareFoods(items);
      return `
        <section class="nutri-panel sv-module-panel">
          <div class="nutri-panel-head">
            <div>
              <span class="nutri-kicker">Comparador</span>
              <h3>Comparador de alimentos</h3>
            </div>
          </div>
          <div class="nutri-form-grid">
            ${ingredientSelect("Ingrediente A", "comparador", "a", v.a)}
            ${ingredientSelect("Ingrediente B", "comparador", "b", v.b)}
            ${ingredientSelect("Ingrediente C", "comparador", "c", v.c, true)}
          </div>
          ${renderComparisonTable(items)}
          ${renderCalcResult("Conclusiones automaticas", conclusions.map((x, i) => [`Conclusion ${i + 1}`, x]), [])}
          <div class="nutri-action-row">
            <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-save="comparador">Guardar comparacion</button>
            <button class="sv-btn sv-btn-primary" type="button" data-nutri-calc-print="comparador">Imprimir ficha</button>
          </div>
        </section>
      `;
    }

    function renderRationPage(page) {
      const v = state.calcs.racion;
      const result = calcRation(v);
      return `
        <section class="nutri-panel sv-module-panel">
          <div class="nutri-calculator">
            <div class="nutri-panel-head">
              <div>
                <span class="nutri-kicker">${page === "costo-kg" ? "Costo" : "Raciones"}</span>
                <h3>Formulacion simple de raciones</h3>
              </div>
              <button class="sv-btn sv-btn-secondary" type="button" data-ration-add>Agregar ingrediente</button>
            </div>
            <div class="nutri-form-grid">
              <label><span>Especie</span><select class="sv-select" data-calc-bucket="racion" data-calc-field="especie">
                ${(D.raciones?.especies || []).map((e) => `<option value="${escapeAttr(e)}"${v.especie === e ? " selected" : ""}>${escapeHtml(e)}</option>`).join("")}
              </select></label>
              <label><span>Etapa</span><select class="sv-select" data-calc-bucket="racion" data-calc-field="etapa">
                ${(D.raciones?.etapas || []).map((e) => `<option value="${escapeAttr(e)}"${v.etapa === e ? " selected" : ""}>${escapeHtml(e)}</option>`).join("")}
              </select></label>
            </div>
            <div class="nutri-ration-table">
              <div class="nutri-ration-row is-head"><span>Ingrediente</span><span>% inclusion</span><span>Costo/kg</span><span></span></div>
              ${(v.rows || []).map((row, index) => renderRationRow(row, index)).join("")}
            </div>
            ${renderCalcResult("Resultado de racion", result.lines, result.alerts)}
            <div class="nutri-action-row">
              <button class="sv-btn sv-btn-ghost" type="button" data-nutri-calc-clear="racion">Limpiar formulario</button>
              <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-copy="racion">Copiar racion</button>
              <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-save="racion">Guardar racion</button>
              <button class="sv-btn sv-btn-primary" type="button" data-nutri-calc-print="racion">Imprimir ficha</button>
            </div>
          </div>
        </section>
      `;
    }

    function renderCostPerAnimal() {
      const v = state.calcs.costo;
      const result = calcCost(v);
      return `
        <section class="nutri-panel sv-module-panel">
          <div class="nutri-calculator">
            <div class="nutri-panel-head">
              <div>
                <span class="nutri-kicker">Costos</span>
                <h3>Costo por animal/dia</h3>
              </div>
            </div>
            <div class="nutri-form-grid">
              ${input("Costo por kg de alimento", "costo", "costoKg", v.costoKg)}
              ${input("Consumo diario por animal (kg)", "costo", "consumoDiario", v.consumoDiario)}
              ${input("Numero de animales", "costo", "animales", v.animales)}
              ${input("Dias de alimentacion", "costo", "dias", v.dias)}
            </div>
            ${renderCalcResult("Costo estimado", result.lines, result.alerts)}
            <div class="nutri-action-row">
              <button class="sv-btn sv-btn-ghost" type="button" data-nutri-calc-clear="costo">Limpiar</button>
              <button class="sv-btn sv-btn-secondary" type="button" data-nutri-calc-save="costo">Guardar calculo</button>
              <button class="sv-btn sv-btn-primary" type="button" data-nutri-calc-print="costo">Imprimir ficha</button>
            </div>
          </div>
        </section>
      `;
    }

    function renderPendingClinical(page) {
      const title = page === "prevencion" ? "Prevencion nutricional" : "Recomendaciones por especie";
      return `
        <section class="nutri-panel sv-module-panel">
          <div class="sv-empty">
            <div class="sv-empty-icon">+</div>
            <h3>${escapeHtml(title)}</h3>
            <p>Dato pendiente. Esta vista queda preparada para integrar tablas y diapositivas adicionales sin mezclar datos de otros submodulos.</p>
          </div>
        </section>
      `;
    }

    function renderSavedPanel() {
      const saved = getSaved();
      return `
        <section class="nutri-page">
          <div class="nutri-context sv-module-context">
            <div>
              <span class="nutri-icon">GD</span>
              <strong>Guardados de Nutricion Animal</strong>
              <small>${saved.length} guardado${saved.length === 1 ? "" : "s"}</small>
            </div>
            <p>Calculos, interpretaciones, raciones y comparaciones guardadas para consulta rapida.</p>
            <span class="nutri-count">${saved.length}</span>
          </div>
          <div class="nutri-saved-list">
            ${saved.length ? saved.map(renderSavedItem).join("") : emptyState("Todavia no hay guardados en Nutricion Animal.")}
          </div>
        </section>
      `;
    }

    function renderSavedItem(item) {
      return `
        <article class="sv-card sv-module-card nutri-saved-item">
          <div class="sv-card-header">
            <div>
              <span class="sv-card-title">${escapeHtml(item.nombre)}</span>
              <span class="sv-card-subtitle">${escapeHtml(item.tipo)} · ${formatDate(item.fecha)}</span>
            </div>
          </div>
          <div class="sv-card-body">
            ${(item.resultado?.lines || []).slice(0, 5).map(([label, value]) => field(label, value)).join("")}
          </div>
          <div class="sv-card-footer">
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-saved-copy="${escapeAttr(item.id)}">Copiar</button>
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-saved-print="${escapeAttr(item.id)}">Imprimir</button>
            <button class="sv-btn sv-btn-sm sv-btn-danger" type="button" data-saved-delete="${escapeAttr(item.id)}">Eliminar</button>
          </div>
        </article>
      `;
    }

    function handleClick(event) {
      const clearGlobal = event.target.closest("[data-nutri-clear-global]");
      if (clearGlobal) {
        state.globalQuery = "";
        render();
        return;
      }

      const section = event.target.closest("[data-nutri-open-section]");
      if (section) {
        const first = (D.secciones || []).find((item) => item.id === section.dataset.nutriOpenSection)?.submodulos?.[0];
        state.section = section.dataset.nutriOpenSection || state.section;
        state.page = first || "home";
        render();
        return;
      }

      const sectionPill = event.target.closest("[data-nutri-section-pill]");
      if (sectionPill) {
        const sectionId = sectionPill.dataset.nutriSectionPill;
        state.section = sectionId;
        state.page = firstSubmoduleForSection(sectionId) || "home";
        render();
        return;
      }

      const pageBtn = event.target.closest("[data-nutri-page]");
      if (pageBtn) {
        const nextPage = pageBtn.dataset.nutriPage || "home";
        state.page = nextPage;
        const nextSection = sectionForPage(nextPage);
        if (nextSection) state.section = nextSection;
        const focus = pageBtn.dataset.nutriFocus;
        if (focus) state.queries[state.page] = titleFor(state.page, findItemForPage(state.page, focus) || { nombre: focus });
        render();
        return;
      }

      const filterBtn = event.target.closest("[data-nutri-filter]");
      if (filterBtn) {
        state.filters[filterBtn.dataset.nutriFilterPage] = filterBtn.dataset.nutriFilter;
        render();
        return;
      }

      const favBtn = event.target.closest("[data-nutri-fav]");
      if (favBtn) {
        Fav?.toggleFavorite?.({
          id: favBtn.dataset.nutriFav,
          titulo: favBtn.dataset.title,
          modulo: "Nutricion Animal",
          submodulo: favBtn.dataset.submodule,
          tipo: "Tarjeta",
          descripcion: favBtn.dataset.description
        });
        render();
        return;
      }

      const printCard = event.target.closest("[data-nutri-print-card]");
      if (printCard) {
        const item = findItemForPage(printCard.dataset.page, printCard.dataset.id);
        if (item) printItem(printCard.dataset.page, item);
        return;
      }

      const clear = event.target.closest("[data-nutri-calc-clear]");
      if (clear) {
        clearCalc(clear.dataset.nutriCalcClear);
        render();
        return;
      }

      const save = event.target.closest("[data-nutri-calc-save]");
      if (save) {
        saveCalc(save.dataset.nutriCalcSave);
        render();
        return;
      }

      const print = event.target.closest("[data-nutri-calc-print]");
      if (print) {
        printCalc(print.dataset.nutriCalcPrint);
        return;
      }

      const copy = event.target.closest("[data-nutri-calc-copy]");
      if (copy) {
        copyCalc(copy.dataset.nutriCalcCopy);
        return;
      }

      const addRow = event.target.closest("[data-ration-add]");
      if (addRow) {
        state.calcs.racion.rows.push({ ingrediente: "", inclusion: "", costo: "" });
        render();
        return;
      }

      const removeRow = event.target.closest("[data-ration-remove]");
      if (removeRow) {
        state.calcs.racion.rows.splice(Number(removeRow.dataset.rationRemove), 1);
        render();
        return;
      }

      const savedDelete = event.target.closest("[data-saved-delete]");
      if (savedDelete) {
        saveSaved(getSaved().filter((item) => item.id !== savedDelete.dataset.savedDelete));
        render();
        return;
      }

      const savedPrint = event.target.closest("[data-saved-print]");
      if (savedPrint) {
        const item = getSaved().find((entry) => entry.id === savedPrint.dataset.savedPrint);
        if (item) openPrint(item.nombre, renderSavedPrint(item));
        return;
      }

      const savedCopy = event.target.closest("[data-saved-copy]");
      if (savedCopy) {
        const item = getSaved().find((entry) => entry.id === savedCopy.dataset.savedCopy);
        if (item) copyText(linesToText(item.resultado?.lines || []));
      }
    }

    function handleInput(event) {
      const global = event.target.closest("#nutri-global-search");
      if (global) {
        state.globalQuery = global.value;
        render();
        return;
      }

      const search = event.target.closest("[data-nutri-search]");
      if (search) {
        state.queries[search.dataset.nutriSearch] = search.value;
        render();
        return;
      }

      const calcField = event.target.closest("[data-calc-bucket][data-calc-field]");
      if (calcField) {
        const bucket = calcField.dataset.calcBucket;
        state.calcs[bucket] = state.calcs[bucket] || {};
        state.calcs[bucket][calcField.dataset.calcField] = calcField.value;
        render();
        return;
      }

      const rationField = event.target.closest("[data-ration-field]");
      if (rationField) {
        const index = Number(rationField.dataset.rationIndex);
        const fieldName = rationField.dataset.rationField;
        state.calcs.racion.rows[index] = state.calcs.racion.rows[index] || {};
        state.calcs.racion.rows[index][fieldName] = rationField.value;
        render();
      }
    }

    function getPageItems(page, canonical) {
      if (canonical === "aminoacidos") return D.aminoacidos || [];
      if (canonical === "nutrientes") return D.nutrientes || [];
      if (canonical === "acidos-grasos") return D.acidosGrasos || [];
      if (canonical === "vitaminas-minerales") return flattenVitaminsMinerals();
      if (canonical === "ingredientes") return D.ingredientes || [];
      if (canonical === "digestion") return D.digestionEspecies || [];
      if (canonical === "fermentacion-ruminal") return D.fermentacionRuminal || [];
      if (canonical === "weende") return D.weende || [];
      if (canonical === "trastornos") {
        const list = D.trastornosNutricionales || [];
        if (page === "deficiencias") return list.filter((item) => norm(item.tipo).includes("deficiencia"));
        if (page === "excesos") return list.filter((item) => norm(item.tipo).includes("exceso"));
        return list;
      }
      return [];
    }

    function activeSectionId(page) {
      return sectionForPage(page) || state.section || "aprender";
    }

    function sectionForPage(page) {
      if (!page || page === "home" || page === "guardados") return "";
      const found = (D.secciones || []).find((section) => (section.submodulos || []).includes(page));
      return found?.id || "";
    }

    function firstSubmoduleForSection(sectionId) {
      return sectionById[sectionId]?.submodulos?.[0] || "";
    }

    function submodulesForSection(sectionId) {
      return (sectionById[sectionId]?.submodulos || [])
        .map((id) => submoduleById[id])
        .filter(Boolean);
    }

    function navCountLabel(mod) {
      const count = itemCountForPage(mod.id);
      if (count) return String(count);
      return mod.estado === "Disponible" ? "Lab" : mod.estado || "Beta";
    }

    function contextCountLabel(page, canonical) {
      const count = itemCountForPage(page);
      if (count) return `${count} resultado${count === 1 ? "" : "s"}`;
      if (["agua", "etiquetas", "comparador", "formulacion", "costo-kg", "costo-animal"].includes(canonical) || page === "costo-kg") {
        return "Herramienta interactiva";
      }
      return "Dato pendiente";
    }

    function itemCountForPage(page) {
      const canonical = pageAliases[page] || page;
      return getPageItems(page, canonical).length;
    }

    function filterCount(page, canonical, items, filter) {
      if (filter === "todos") return items.length;
      if (filter === "favoritos") return items.filter((item) => Fav?.isFavorite?.(favoriteId(page, item))).length;
      return items.filter((item) => matchesFilter(page, canonical, item, filter)).length;
    }

    function getFilters(page, canonical, items) {
      const base = [{ id: "todos", label: "Todos" }, { id: "favoritos", label: "Favoritos" }];
      if (canonical === "aminoacidos") {
        return base.concat([
          { id: "esencial", label: "Esenciales" },
          { id: "no-esencial", label: "No esenciales" },
          { id: "semi-esencial", label: "Semi esenciales" },
          { id: "aves", label: "Aves" },
          { id: "cerdos", label: "Cerdos" },
          { id: "rumiantes", label: "Rumiantes" },
          { id: "mascotas", label: "Mascotas" }
        ]);
      }
      if (canonical === "vitaminas-minerales") {
        return base.concat([
          { id: "vitaminas-liposolubles", label: "Liposolubles" },
          { id: "vitaminas-hidrosolubles", label: "Hidrosolubles" },
          { id: "macrominerales", label: "Macrominerales" },
          { id: "microminerales", label: "Microminerales" }
        ]);
      }
      const values = new Set();
      items.forEach((item) => {
        if (canonical === "ingredientes") values.add(item.categoria);
        else if (canonical === "acidos-grasos") values.add(item.tipo), values.add(item.familia);
        else if (canonical === "trastornos") values.add(item.tipo);
        else if (item.tipo) values.add(item.tipo);
      });
      return base.concat([...values].filter(Boolean).map((value) => ({ id: slug(value), label: value })));
    }

    function matchesFilter(page, canonical, item, filter) {
      const f = norm(filter);
      if (canonical === "aminoacidos") {
        if (f.includes("semi")) return norm(item.tipo).includes("semi");
        if (f.includes("no-esencial")) return norm(item.tipo).includes("no esencial");
        if (f.includes("esencial")) return norm(item.tipo) === "esencial";
        if (f === "rumiantes") return (item.especiesClave || []).some((x) => ["bovinos", "rumiantes"].includes(norm(x)));
        if (f === "mascotas") return (item.especiesClave || []).some((x) => ["caninos", "felinos", "mascotas"].includes(norm(x)));
        return (item.especiesClave || []).some((x) => norm(x) === f);
      }
      if (canonical === "vitaminas-minerales") return item.grupo === filter;
      if (canonical === "ingredientes") return slug(item.categoria) === filter || (item.especiesRecomendadas || []).some((x) => slug(x) === filter);
      if (canonical === "acidos-grasos") return slug(item.tipo) === filter || slug(item.familia) === filter;
      if (canonical === "trastornos") return slug(item.tipo) === filter || (item.especiesAfectadas || []).some((x) => slug(x) === filter);
      return slug(item.tipo) === filter;
    }

    function flattenVitaminsMinerals() {
      const groups = D.vitaminasMinerales || {};
      return [
        ["vitaminas-liposolubles", "Vitaminas liposolubles", groups.vitaminasLiposolubles || []],
        ["vitaminas-hidrosolubles", "Vitaminas hidrosolubles", groups.vitaminasHidrosolubles || []],
        ["macrominerales", "Macrominerales", groups.macrominerales || []],
        ["microminerales", "Microminerales", groups.microminerales || []]
      ].flatMap(([grupo, grupoLabel, list]) => list.map((item) => ({ ...item, grupo, grupoLabel })));
    }

    function calcWeende(v) {
      const humeda = number(v.muestraHumeda);
      const parcial = number(v.muestraParcialSeca);
      const seca = number(v.muestraSeca);
      const mps = finite(humeda) && finite(parcial) && humeda > 0 ? (parcial * 100) / humeda : null;
      const ms = finite(parcial) && finite(seca) && parcial > 0 ? (seca * 100) / parcial : null;
      const humedad = finite(ms) ? 100 - ms : number(v.humedad);
      const cenizas = number(v.cenizas);
      const proteina = number(v.proteina);
      const eter = number(v.eter);
      const fibra = number(v.fibra);
      const eln = [humedad, cenizas, proteina, eter, fibra].every(finite)
        ? 100 - (humedad + cenizas + proteina + eter + fibra)
        : null;
      const alerts = ["Calculo educativo. Verificar con analisis bromatologico y criterios profesionales."];
      if (finite(eln) && (eln < 0 || eln > 100)) alerts.push("El ELN calculado esta fuera de 0-100%; revisa los porcentajes ingresados.");
      return {
        lines: [
          ["% MPS", finite(mps) ? `${fmt(mps)}%` : "Dato pendiente"],
          ["% MS", finite(ms) ? `${fmt(ms)}%` : "Dato pendiente"],
          ["% Humedad", finite(humedad) ? `${fmt(humedad)}%` : "Dato pendiente"],
          ["% ELN", finite(eln) ? `${fmt(eln)}%` : "Dato pendiente"]
        ],
        alerts
      };
    }

    function calcWater(v) {
      const species = findById(D.agua?.especies || [], v.especie);
      const ms = number(v.materiaSeca);
      const milk = number(v.leche);
      let min = 0;
      let max = 0;
      let hasBase = false;
      const alerts = [D.agua?.advertencia || "Calculo orientativo."];
      const factors = [];

      if (finite(ms) && species?.litrosPorKgMs) {
        min += ms * species.litrosPorKgMs.min;
        max += ms * species.litrosPorKgMs.max;
        hasBase = true;
      }
      if (finite(milk) && species?.litrosPorLitroLeche) {
        min += milk * species.litrosPorLitroLeche.min;
        max += milk * species.litrosPorLitroLeche.max;
        hasBase = true;
        factors.push("Lactancia / produccion de leche");
      }
      if (norm(v.clima).includes("calido")) factors.push("Clima calido");
      if (norm(v.etapa).includes("postura")) factors.push("Postura de huevos");
      if (!species?.litrosPorKgMs && !species?.litrosPorLitroLeche) {
        alerts.push("Dato pendiente: el PDF no aporta coeficiente exacto para esta especie en la calculadora.");
      }

      return {
        lines: [
          ["Especie", species?.nombre || "Dato pendiente"],
          ["Consumo estimado", hasBase ? `${fmt(min)} - ${fmt(max)} L/dia` : "Dato pendiente"],
          ["Factores que aumentan requerimiento", factors.length ? factors.join(", ") : joinList(D.agua?.factoresAumento)],
          ["Alertas de riesgo", joinList(D.agua?.alertas)],
          ["Recomendacion educativa", "Asegurar agua limpia, fresca, disponible y revisar sales, proteina, clima y etapa productiva."]
        ],
        alerts
      };
    }

    function calcLabel(v) {
      const base = D.etiquetasBalanceado || {};
      const t = base.umbralesEducativos || {};
      const lines = [
        ["Proteina cruda", classify(number(v.proteinaCruda), t.proteinaCruda, base.rangosGenerales?.proteinaCruda)],
        ["Grasa", classify(number(v.grasa), t.grasa, base.rangosGenerales?.grasa)],
        ["Fibra cruda", classify(number(v.fibraCruda), t.fibraCruda, base.rangosGenerales?.fibraCruda)],
        ["Humedad", finite(number(v.humedad)) && number(v.humedad) > (t.humedad?.elevada || 14) ? base.rangosGenerales?.humedad?.elevada : base.rangosGenerales?.humedad?.normal],
        ["Datos faltantes", missingLabelFields(v).join(", ") || "Sin faltantes basicos"],
        ["Posible uso", inferUse(v)]
      ];
      return { lines, alerts: [base.advertencia || "Interpretacion educativa."] };
    }

    function calcRation(v) {
      const rows = (v.rows || []).filter((row) => row.ingrediente && finite(number(row.inclusion)));
      const total = rows.reduce((sum, row) => sum + number(row.inclusion), 0);
      const cost = rows.reduce((sum, row) => sum + (number(row.inclusion) / 100) * (number(row.costo) || 0), 0);
      const nutrients = ["proteinaCruda", "fibraCruda", "extractoEtereo"].map((fieldName) => {
        let complete = true;
        const value = rows.reduce((sum, row) => {
          const ing = findById(D.ingredientes || [], row.ingrediente);
          if (!finite(number(ing?.[fieldName]))) complete = false;
          return sum + (number(row.inclusion) / 100) * (number(ing?.[fieldName]) || 0);
        }, 0);
        return [fieldName, complete ? `${fmt(value)}%` : "Dato pendiente"];
      });
      const alerts = [D.raciones?.advertencia || "Formulacion educativa."];
      if (Math.abs(total - 100) > 0.01) alerts.push("La suma de inclusion debe ser 100%.");
      return {
        lines: [
          ["Total inclusion", `${fmt(total)}%`],
          ["Costo final por kg", finite(cost) ? `$${fmt(cost)}` : "Dato pendiente"],
          ["Aporte proteina cruda", nutrients[0][1]],
          ["Aporte fibra cruda", nutrients[1][1]],
          ["Aporte grasa", nutrients[2][1]]
        ],
        alerts
      };
    }

    function calcCost(v) {
      const costoKg = number(v.costoKg);
      const consumo = number(v.consumoDiario);
      const animales = number(v.animales);
      const dias = number(v.dias);
      const animalDia = finite(costoKg) && finite(consumo) ? costoKg * consumo : null;
      const totalDia = finite(animalDia) && finite(animales) ? animalDia * animales : null;
      const lote = finite(totalDia) && finite(dias) ? totalDia * dias : null;
      return {
        lines: [
          ["Costo diario por animal", finite(animalDia) ? `$${fmt(animalDia)}` : "Dato pendiente"],
          ["Costo diario total", finite(totalDia) ? `$${fmt(totalDia)}` : "Dato pendiente"],
          ["Costo semanal", finite(totalDia) ? `$${fmt(totalDia * 7)}` : "Dato pendiente"],
          ["Costo mensual", finite(totalDia) ? `$${fmt(totalDia * 30)}` : "Dato pendiente"],
          ["Costo por lote", finite(lote) ? `$${fmt(lote)}` : "Dato pendiente"]
        ],
        alerts: ["Calculo economico orientativo. Revisar consumo real, desperdicio y cambios de precio."]
      };
    }

    function compareFoods(items) {
      if (items.length < 2) return ["Selecciona al menos 2 ingredientes."];
      const conclusions = [];
      const checks = [
        ["proteinaCruda", "aporta mas proteina"],
        ["energia", "es mas energetico"],
        ["fibraCruda", "tiene mayor fibra"]
      ];
      checks.forEach(([fieldName, text]) => {
        const withData = items.filter((item) => finite(number(item[fieldName])));
        if (withData.length < 2) conclusions.push("Faltan datos para una comparacion completa.");
        else {
          const top = withData.sort((a, b) => number(b[fieldName]) - number(a[fieldName]))[0];
          conclusions.push(`${top.nombre} ${text}.`);
        }
      });
      return [...new Set(conclusions)];
    }

    function saveCalc(type) {
      const payload = calcPayload(type);
      const name = `${payload.title} - ${new Date().toLocaleDateString("es-EC")}`;
      const entry = {
        id: `nutri-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        fecha: new Date().toISOString(),
        nombre: name,
        tipo: payload.title,
        datos: payload.data,
        resultado: payload.result
      };
      const next = [entry, ...getSaved()];
      saveSaved(next);
      Fav?.showToast?.("Guardado en Nutricion Animal");
    }

    function printCalc(type) {
      const payload = calcPayload(type);
      openPrint(payload.title, renderResultPrint(payload.title, payload.result.lines, payload.result.alerts));
    }

    function copyCalc(type) {
      const payload = calcPayload(type);
      copyText(linesToText(payload.result.lines));
    }

    function calcPayload(type) {
      if (type === "weende") return { title: "Analisis proximal de Weende", data: state.calcs.weende, result: calcWeende(state.calcs.weende) };
      if (type === "water") return { title: "Consumo de agua", data: state.calcs.water, result: calcWater(state.calcs.water) };
      if (type === "etiqueta") return { title: "Interpretador de etiqueta", data: state.calcs.etiqueta, result: calcLabel(state.calcs.etiqueta) };
      if (type === "comparador") {
        const v = state.calcs.comparador;
        const items = [v.a, v.b, v.c].filter(Boolean).map((id) => findById(D.ingredientes, id)).filter(Boolean);
        return { title: "Comparacion de alimentos", data: v, result: { lines: compareFoods(items).map((x, i) => [`Conclusion ${i + 1}`, x]), alerts: [] } };
      }
      if (type === "racion") return { title: "Racion simple", data: state.calcs.racion, result: calcRation(state.calcs.racion) };
      if (type === "costo") return { title: "Costo por animal/dia", data: state.calcs.costo, result: calcCost(state.calcs.costo) };
      return { title: "Calculo nutricional", data: {}, result: { lines: [], alerts: [] } };
    }

    function clearCalc(type) {
      if (type === "racion") state.calcs.racion = { especie: "Bovinos", etapa: "Mantenimiento", rows: defaultRationRows() };
      else if (type === "water") state.calcs.water = { especie: "bovino", etapa: "Mantenimiento", clima: "Templado" };
      else state.calcs[type] = {};
    }

    function printItem(page, item) {
      const canonical = pageAliases[page] || page;
      const title = titleFor(page, item);
      openPrint(title, `
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(subtitleFor(page, canonical, item))}</p>
        <div>${renderCardBody(page, canonical, item)}</div>
      `);
    }

    function openPrint(title, bodyHtml) {
      document.body.classList.add("nutricion-printing");
      printArea.classList.add("is-open");
      printArea.setAttribute("aria-hidden", "false");
      printArea.innerHTML = `
        <div class="nutri-print-shell">
          <div class="nutri-print-toolbar no-print">
            <div>
              <span class="nutri-kicker">Vista imprimible</span>
              <h3>${escapeHtml(title)}</h3>
            </div>
            <div class="nutri-print-actions">
              <button class="sv-btn sv-btn-secondary" type="button" data-nutri-print-close>Volver</button>
              <button class="sv-btn sv-btn-primary" type="button" data-nutri-print-now>Imprimir / PDF</button>
            </div>
          </div>
          <article class="nutri-print-doc">
            <header>
              <h1>SUITE VET — Nutricion Animal</h1>
              <p>${escapeHtml(title)}</p>
            </header>
            <main>${bodyHtml}</main>
            <footer>${PRINT_FOOTER}</footer>
          </article>
        </div>
      `;
      printArea.scrollTo({ top: 0, behavior: "auto" });
    }

    function closePrintView() {
      document.body.classList.remove("nutricion-printing");
      printArea.classList.remove("is-open");
      printArea.setAttribute("aria-hidden", "true");
      printArea.innerHTML = "";
    }

    function registerGlobalSearch() {
      if (!window.SuiteVet?.registerSearch) return;
      window.SuiteVet.registerSearch("nutricion", (q) =>
        buildSearchItems()
          .filter((item) => norm(item.blob).includes(norm(q)))
          .slice(0, 20)
          .map((item) => ({
            title: item.title,
            subtitle: item.subtitle,
            moduleId: "nutricion",
            action: () => {
              window.SuiteVet.showView("nutricion");
              state.page = item.page;
              state.queries[item.page] = item.title;
              render();
            }
          }))
      );
    }

    function buildSearchItems() {
      const items = [];
      (D.submodulos || []).forEach((mod) => {
        items.push({ id: mod.id, page: mod.id, title: mod.titulo, subtitle: `Submodulo · ${mod.categoria}`, blob: JSON.stringify(mod) });
      });
      const pages = ["aminoacidos", "nutrientes", "acidos-grasos", "vitaminas-minerales", "ingredientes", "digestion", "fermentacion-ruminal", "trastornos"];
      pages.forEach((page) => {
        getPageItems(page, page).forEach((item) => {
          items.push({
            id: item.id || titleFor(page, item),
            page,
            title: titleFor(page, item),
            subtitle: submoduleById[page]?.titulo || page,
            blob: JSON.stringify(item)
          });
        });
      });
      (D.weende || []).forEach((item) => items.push({ id: item.id, page: "weende", title: item.nombre, subtitle: "Analisis proximal", blob: JSON.stringify(item) }));
      return items;
    }

    function renderCalcResult(title, lines, alerts) {
      return `
        <div class="nutri-result-box">
          <h4>${escapeHtml(title)}</h4>
          <div class="nutri-result-grid">
            ${lines.map(([label, value]) => `
              <div class="nutri-result-line">
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(valueText(value))}</strong>
              </div>
            `).join("")}
          </div>
          ${(alerts || []).map((alert) => `<div class="nutri-alert">${escapeHtml(alert)}</div>`).join("")}
        </div>
      `;
    }

    function renderResultPrint(title, lines, alerts) {
      return `
        <h2>${escapeHtml(title)}</h2>
        <table>${lines.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(valueText(value))}</td></tr>`).join("")}</table>
        ${(alerts || []).map((alert) => `<p class="nutri-print-alert">${escapeHtml(alert)}</p>`).join("")}
      `;
    }

    function renderSavedPrint(item) {
      return renderResultPrint(item.nombre, item.resultado?.lines || [], item.resultado?.alerts || []);
    }

    function renderComparisonTable(items) {
      if (!items.length) return emptyState("Selecciona ingredientes para comparar.");
      const rows = [
        ["Materia seca", "materiaSeca"],
        ["Proteina cruda", "proteinaCruda"],
        ["Fibra", "fibraCruda"],
        ["Grasa", "extractoEtereo"],
        ["Energia", "energia"],
        ["Costo/kg", "costoKg"],
        ["Uso recomendado", "observaciones"],
        ["Riesgos", "riesgos"]
      ];
      return `
        <div class="nutri-table-wrap sv-table-wrap">
          <table class="nutri-table sv-table">
            <thead><tr><th>Campo</th>${items.map((item) => `<th>${escapeHtml(item.nombre)}</th>`).join("")}</tr></thead>
            <tbody>
              ${rows.map(([label, key]) => `<tr><th>${escapeHtml(label)}</th>${items.map((item) => `<td>${escapeHtml(valueText(Array.isArray(item[key]) ? item[key].join(", ") : item[key]))}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    function renderRationRow(row, index) {
      return `
        <div class="nutri-ration-row">
          <select class="sv-select" data-ration-index="${index}" data-ration-field="ingrediente">
            <option value="">Elegir ingrediente</option>
            ${(D.ingredientes || []).map((item) => `<option value="${escapeAttr(item.id)}"${row.ingrediente === item.id ? " selected" : ""}>${escapeHtml(item.nombre)}</option>`).join("")}
          </select>
          <input class="sv-input" type="number" min="0" step="0.01" value="${escapeAttr(row.inclusion)}" data-ration-index="${index}" data-ration-field="inclusion" />
          <input class="sv-input" type="number" min="0" step="0.01" value="${escapeAttr(row.costo)}" data-ration-index="${index}" data-ration-field="costo" />
          <button class="nutri-icon-button" type="button" data-ration-remove="${index}" title="Quitar">×</button>
        </div>
      `;
    }

    function ingredientSelect(label, bucket, fieldName, value, optional = false) {
      return `
        <label><span>${escapeHtml(label)}</span><select class="sv-select" data-calc-bucket="${bucket}" data-calc-field="${fieldName}">
          ${optional ? `<option value="">Sin tercer ingrediente</option>` : ""}
          ${(D.ingredientes || []).map((item) => `<option value="${escapeAttr(item.id)}"${value === item.id ? " selected" : ""}>${escapeHtml(item.nombre)}</option>`).join("")}
        </select></label>
      `;
    }

    function input(label, bucket, fieldName, value) {
      return `<label><span>${escapeHtml(label)}</span><input class="sv-input" type="number" step="any" value="${escapeAttr(value)}" data-calc-bucket="${bucket}" data-calc-field="${fieldName}" /></label>`;
    }

    function textInput(label, bucket, fieldName, value) {
      return `<label><span>${escapeHtml(label)}</span><input class="sv-input" type="text" value="${escapeAttr(value)}" data-calc-bucket="${bucket}" data-calc-field="${fieldName}" /></label>`;
    }

    function field(label, value) {
      return `<p class="nutri-field"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(valueText(value))}</p>`;
    }

    function metric(label, value) {
      return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(valueText(value))}</strong></div>`;
    }

    function renderRecognition(obj) {
      if (!obj || typeof obj !== "object") return "";
      const rows = Object.entries(obj)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => field(labelize(key), Array.isArray(value) ? value.join(", ") : value))
        .join("");
      return rows ? `<div class="nutri-recognition"><span>Como reconocer</span>${rows}</div>` : "";
    }

    function statusBadge(status) {
      const cls = slug(status);
      return `<span class="nutri-status is-${cls}">${escapeHtml(status || "Beta")}</span>`;
    }

    function emptyState(text) {
      return `<div class="sv-empty"><div class="sv-empty-icon">+</div>${escapeHtml(text)}</div>`;
    }

    function titleFor(page, item) {
      return item?.nombre || item?.especie || item?.termino || item?.titulo || "Dato pendiente";
    }

    function subtitleFor(page, canonical, item) {
      if (canonical === "aminoacidos") return `${item.abreviatura || ""} · ${item.letra || ""} · ${item.tipo || ""}`;
      if (canonical === "vitaminas-minerales") return item.grupoLabel || item.tipo || "";
      if (canonical === "ingredientes") return item.categoria || "";
      if (canonical === "digestion") return item.tipoDigestivo || "";
      if (canonical === "trastornos") return item.tipo || "";
      return item.tipo || item.familia || item.abreviatura || "";
    }

    function descriptionFor(page, canonical, item) {
      return item?.funcion || item?.descripcion || item?.observaciones || item?.particularidad || item?.causaNutricional || item?.importancia || "";
    }

    function favoriteId(page, item) {
      return `nutricion-${page}-${slug(item.id || titleFor(page, item))}`;
    }

    function findItemForPage(page, id) {
      const canonical = pageAliases[page] || page;
      return getPageItems(page, canonical).find((item) => String(item.id || titleFor(page, item)) === String(id));
    }

    function findById(list, id) {
      return (list || []).find((item) => item.id === id) || null;
    }

    function classify(value, thresholds, labels) {
      if (!finite(value)) return "Dato pendiente";
      if (thresholds?.bajo !== undefined && value < thresholds.bajo) return labels?.bajo || "Bajo";
      if (thresholds?.alto !== undefined && value > thresholds.alto) return labels?.alto || "Alto";
      return labels?.medio || "Medio";
    }

    function missingLabelFields(v) {
      return [
        ["proteinaCruda", "proteina cruda"],
        ["grasa", "grasa"],
        ["fibraCruda", "fibra cruda"],
        ["humedad", "humedad"],
        ["cenizas", "cenizas"]
      ].filter(([key]) => !finite(number(v[key]))).map(([, label]) => label);
    }

    function inferUse(v) {
      const protein = number(v.proteinaCruda);
      const fat = number(v.grasa);
      const fiber = number(v.fibraCruda);
      if (!finite(protein) && !finite(fat) && !finite(fiber)) return "Dato pendiente";
      if (finite(protein) && protein > 22) return "Crecimiento, lactancia, postura o engorde segun especie; confirmar con etiqueta completa.";
      if (finite(fiber) && fiber > 12) return "Raciones con mayor fibra o mantenimiento; confirmar segun especie.";
      return "Mantenimiento o uso general segun especie y etapa; confirmar con tabla especifica.";
    }

    function getSaved() {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function saveSaved(items) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function updateSavedFab(view) {
      const fab = document.getElementById("nutri-fab-saved");
      if (!fab) return;
      const count = getSaved().length;
      fab.classList.toggle("sv-fab-hidden", view !== "nutricion");
      const badge = fab.querySelector(".sv-fab-badge");
      if (badge) {
        badge.textContent = String(count);
        badge.dataset.count = String(count);
      }
    }

    function ensurePrintArea() {
      let area = document.getElementById("nutricion-print-area");
      if (!area) {
        area = document.createElement("div");
        area.id = "nutricion-print-area";
        area.className = "nutricion-print-area";
        area.setAttribute("aria-hidden", "true");
        document.body.appendChild(area);
      }
      return area;
    }

    function defaultRationRows() {
      return [
        { ingrediente: "maiz", inclusion: "", costo: "" },
        { ingrediente: "pasta_soya", inclusion: "", costo: "" },
        { ingrediente: "afrecho", inclusion: "", costo: "" }
      ];
    }

    function linesToText(lines) {
      return lines.map(([label, value]) => `${label}: ${valueText(value)}`).join("\n");
    }

    function copyText(text) {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => Fav?.showToast?.("Copiado"));
      else Fav?.showToast?.(text);
    }

    function number(value) {
      if (value === "" || value === null || value === undefined) return null;
      const n = Number(String(value).replace(",", "."));
      return Number.isFinite(n) ? n : null;
    }

    function finite(value) {
      return Number.isFinite(value);
    }

    function fmt(value) {
      return Number(value).toFixed(2).replace(/\.?0+$/, "");
    }

    function joinList(value) {
      return Array.isArray(value) ? value.join(", ") : value;
    }

    function valueText(value) {
      if (Array.isArray(value)) return value.length ? value.join(", ") : "Dato pendiente";
      if (value === 0) return "0";
      return value === null || value === undefined || value === "" ? "Dato pendiente" : String(value);
    }

    function formatDate(value) {
      const date = new Date(value || Date.now());
      return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("es-EC", { dateStyle: "short", timeStyle: "short" }).format(date);
    }

    function labelize(value) {
      return String(value || "")
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function icon(name) {
      const map = {
        "book-open": "BO",
        calculator: "∑",
        scale: "kg",
        stethoscope: "+",
        dna: "AA",
        layers: "N",
        droplets: "AG",
        sparkles: "VM",
        route: "DG",
        activity: "FR",
        flask: "W",
        percent: "%",
        "minus-square": "ELN",
        repeat: "↔",
        water: "H2O",
        tag: "ET",
        wheat: "MP",
        columns: "CMP",
        "pie-chart": "R",
        coins: "$",
        wallet: "$/d",
        "alert-triangle": "!",
        "trending-down": "DEF",
        "trending-up": "EXC",
        "list-plus": "S",
        shield: "PV",
        "clipboard-list": "RX"
      };
      return map[name] || "NA";
    }

    function slug(value) {
      return norm(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
    }

    function norm(value) {
      return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function escapeAttr(value) {
      return escapeHtml(value);
    }
  });
})();
