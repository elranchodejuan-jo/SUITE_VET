// =============================================================================
// SUITE VET / FITBET 2.2 — modules/micro/micro.js
// Ecosistema microbiologico interactivo y relacional.
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("micro-root");
    if (!root) return;

    const D = window.MICRO_DATA || {};
    const data = {
      agares: D.agares || [],
      caldos: D.caldos || [],
      pruebas: D.pruebas || [],
      antibioticos: D.antibioticos || [],
      microorganismos: D.microorganismos || []
    };

    const panes = [
      { id: "agares", label: "Agares", singular: "agar", badge: "AGAR", icon: "🧫" },
      { id: "caldos", label: "Caldos", singular: "caldo", badge: "CALDO", icon: "🧪" },
      { id: "pruebas", label: "Pruebas bioquímicas", singular: "prueba", badge: "PRUEBA", icon: "⚗️" },
      { id: "antibioticos", label: "Antibióticos", singular: "antibiótico", badge: "ANTIBIÓTICO", icon: "💊" },
      { id: "microorganismos", label: "Atlas bacteriano", singular: "microorganismo", badge: "BACTERIA", icon: "🦠" }
    ];

    const paneById = Object.fromEntries(panes.map((p) => [p.id, p]));
    const indexes = {};
    Object.entries(data).forEach(([key, list]) => {
      indexes[key] = Object.fromEntries(list.map((item) => [item.id, item]));
    });

    const state = {
      pane: "agares",
      query: "",
      primary: "",
      secondary: "",
      selectedId: null,
      calcTarget: null,
      calcOrigin: null,
      labelContext: null,
      printFavorite: null
    };

    const microStorage = {
      responsable: "suitevet_micro_responsable",
      paralelo: "suitevet_micro_paralelo",
      preparaciones: "suitevet_micro_preparaciones",
      etiquetas: "suitevet_micro_etiquetas",
      guardados: "suitevet_micro_guardados"
    };

    root.innerHTML = `
      <section class="micro-shell sv-module-shell">
        <header class="micro-hero sv-module-header">
          <div>
            <span class="micro-kicker">SUITE VET / FITBET 2.2</span>
            <h2>Microbiología</h2>
            <p class="sv-view-intro">
              Atlas microbiológico, calculadora de laboratorio y biblioteca diagnóstica conectada.
            </p>
          </div>
        </header>

        <div class="micro-subnav sv-module-subnav" id="micro-subnav" data-tabpanel="micro-content" aria-label="Secciones de Microbiologia">
          ${panes.map((p) => `
            <button class="micro-tab sv-module-tab ${p.id === state.pane ? "is-active" : ""}" data-pane="${p.id}" type="button">
              <span>${p.icon}</span>
              <strong>${p.label}</strong>
              <b>${data[p.id]?.length || 0}</b>
            </button>
          `).join("")}
        </div>

        <div class="micro-toolbar sv-module-toolbar">
          <label class="sv-field">
            <span class="sv-label">Buscar</span>
            <input id="micro-search" class="sv-input" type="text" placeholder="Medio, prueba, antibiotico o microorganismo..." autocomplete="off" />
          </label>
          <label class="sv-field">
            <span class="sv-label">Filtro principal</span>
            <select id="micro-filter-primary" class="sv-select"></select>
          </label>
          <label class="sv-field">
            <span class="sv-label">Filtro secundario</span>
            <select id="micro-filter-secondary" class="sv-select"></select>
          </label>
        </div>

        <div id="micro-context" class="micro-context sv-module-context"></div>
        <div id="micro-content" class="micro-grid sv-module-panel"></div>
      </section>

      <div id="micro-ficha-modal" class="micro-modal-overlay" aria-hidden="true">
        <div class="micro-modal" role="dialog" aria-modal="true" aria-label="Ficha de Microbiologia" tabindex="-1">
          <div id="micro-ficha-content"></div>
        </div>
      </div>

      <div id="micro-calc-modal" class="micro-modal-overlay" aria-hidden="true">
        <div class="micro-modal micro-modal-calc" role="dialog" aria-modal="true" aria-label="Calculadora de preparacion microbiologica" tabindex="-1">
          <div id="micro-calc-content"></div>
        </div>
      </div>

      <div id="micro-label-modal" class="micro-modal-overlay" aria-hidden="true">
        <div class="micro-modal micro-modal-label" role="dialog" aria-modal="true" aria-label="Etiquetas de laboratorio" tabindex="-1">
          <div id="micro-label-content"></div>
        </div>
      </div>

      <div id="micro-saved-modal" class="micro-modal-overlay" aria-hidden="true">
        <div class="micro-modal micro-modal-saved" role="dialog" aria-modal="true" aria-label="Guardados de Microbiologia" tabindex="-1">
          <div id="micro-saved-content"></div>
        </div>
      </div>

      <button id="micro-fab-lab" class="sv-fab micro-fab-lab sv-fab-hidden" type="button" data-micro-open-saved title="Guardados de Microbiologia">
        Lab
        <span id="micro-fab-badge" class="sv-fab-badge" data-count="0">0</span>
      </button>
    `;

    const printArea = ensureGlobalPrintArea();

    const els = {
      subnav: root.querySelector("#micro-subnav"),
      search: root.querySelector("#micro-search"),
      primary: root.querySelector("#micro-filter-primary"),
      secondary: root.querySelector("#micro-filter-secondary"),
      context: root.querySelector("#micro-context"),
      content: root.querySelector("#micro-content"),
      fichaModal: root.querySelector("#micro-ficha-modal"),
      fichaContent: root.querySelector("#micro-ficha-content"),
      calcModal: root.querySelector("#micro-calc-modal"),
      calcContent: root.querySelector("#micro-calc-content"),
      labelModal: root.querySelector("#micro-label-modal"),
      labelContent: root.querySelector("#micro-label-content"),
      savedModal: root.querySelector("#micro-saved-modal"),
      savedContent: root.querySelector("#micro-saved-content"),
      labFab: root.querySelector("#micro-fab-lab"),
      labBadge: root.querySelector("#micro-fab-badge"),
      printArea
    };

    els.subnav.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pane]");
      if (!btn) return;
      switchPane(btn.dataset.pane);
    });

    els.search.addEventListener("input", () => {
      state.query = els.search.value;
      state.selectedId = null;
      render();
    });

    els.primary.addEventListener("change", () => {
      state.primary = els.primary.value;
      render();
    });

    els.secondary.addEventListener("change", () => {
      state.secondary = els.secondary.value;
      render();
    });

    root.addEventListener("click", (e) => {
      const closePrint = e.target.closest("[data-micro-print-close]");
      if (closePrint || e.target === els.printArea) {
        closePrintView();
        return;
      }

      const printNow = e.target.closest("[data-micro-print-now]");
      if (printNow) {
        runMicroPrint();
        return;
      }

      const printFavorite = e.target.closest("[data-micro-print-favorite]");
      if (printFavorite) {
        toggleMicroPrintFavorite();
        return;
      }

      const closeLabel = e.target.closest("[data-micro-label-close]");
      if (closeLabel) {
        cerrarModalEtiqueta();
        return;
      }

      const closeSaved = e.target.closest("[data-micro-saved-close]");
      if (closeSaved) {
        cerrarPanelGuardadosMicrobiologia();
        return;
      }

      const close = e.target.closest("[data-micro-close]");
      if (close) {
        closeModals();
        return;
      }

      if (e.target === els.fichaModal || e.target === els.calcModal || e.target === els.labelModal || e.target === els.savedModal) {
        closeModals();
        return;
      }

      const ficha = e.target.closest("[data-micro-ficha]");
      if (ficha) {
        closeModals();
        openFicha(ficha.dataset.pane, ficha.dataset.id);
        return;
      }

      const calc = e.target.closest("[data-micro-calc]");
      if (calc) {
        openCalc(calc.dataset.pane, calc.dataset.id);
        return;
      }

      const jump = e.target.closest("[data-micro-jump]");
      if (jump) {
        closeModals();
        switchPane(jump.dataset.pane, jump.dataset.id);
        return;
      }

      const printPrep = e.target.closest("[data-micro-print-prep]");
      if (printPrep) {
        printPreparation();
        return;
      }

      const savePrep = e.target.closest("[data-micro-save-prep]");
      if (savePrep) {
        guardarPreparacionActual();
        return;
      }

      const labelAction = e.target.closest("[data-micro-label-action]");
      if (labelAction) {
        abrirModalEtiqueta(labelAction.dataset.microLabelAction || "print");
        return;
      }

      const openSaved = e.target.closest("[data-micro-open-saved]");
      if (openSaved) {
        abrirPanelGuardadosMicrobiologia();
        return;
      }

      const labelSubmit = e.target.closest("[data-micro-label-submit]");
      if (labelSubmit) {
        ejecutarAccionEtiqueta(labelSubmit.dataset.microLabelSubmit || "print");
        return;
      }

      const labelFavorite = e.target.closest("[data-micro-label-favorite]");
      if (labelFavorite) {
        toggleMicroLabelFavorite();
        return;
      }

      const printSaved = e.target.closest("[data-micro-print-saved]");
      if (printSaved) {
        imprimirGuardadoMicrobiologia(printSaved.dataset.id);
        return;
      }

      const editSavedLabel = e.target.closest("[data-micro-edit-saved-label]");
      if (editSavedLabel) {
        abrirEtiquetaGuardadaParaEditar(editSavedLabel.dataset.id);
        return;
      }

      const deleteSaved = e.target.closest("[data-micro-delete-saved]");
      if (deleteSaved) {
        eliminarGuardadoMicrobiologia(deleteSaved.dataset.id);
        return;
      }

      const printFicha = e.target.closest("[data-micro-print-ficha]");
      if (printFicha) {
        printFichaDoc(printFicha.dataset.pane, printFicha.dataset.id);
        return;
      }
    });

    els.printArea.addEventListener("click", (e) => {
      const closePrint = e.target.closest("[data-micro-print-close]");
      if (closePrint || e.target === els.printArea) {
        closePrintView();
        return;
      }

      const printNow = e.target.closest("[data-micro-print-now]");
      if (printNow) {
        runMicroPrint();
        return;
      }

      const printFavorite = e.target.closest("[data-micro-print-favorite]");
      if (printFavorite) {
        toggleMicroPrintFavorite();
      }
    });

    els.calcContent.addEventListener("input", updateCalcResult);
    els.calcContent.addEventListener("change", updateCalcResult);
    els.labelContent.addEventListener("input", handleLabelFormInput);
    els.labelContent.addEventListener("change", handleLabelFormChange);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.printArea.classList.contains("is-open")) {
        closePrintView();
        return;
      }

      if (e.key === "Escape") {
        closeModals();
      }
    });

    document.addEventListener("suitevet:viewchange", (e) => {
      actualizarVisibilidadFabMicro(e.detail?.view || "");
    });

    renderFilters();
    render();
    renderMicroSavedBadge();
    actualizarVisibilidadFabMicro(window.SuiteVet?.currentView || "home");
    registerGlobalSearch();

    function switchPane(pane, selectedId = null) {
      if (!data[pane]) return;
      state.pane = pane;
      state.primary = "";
      state.secondary = "";
      state.selectedId = selectedId;
      els.search.value = selectedId ? "" : els.search.value;
      if (selectedId) state.query = "";
      renderFilters();
      render();

      if (selectedId) {
        requestAnimationFrame(() => {
          const card = root.querySelector(`[data-micro-card="${selectedId}"]`);
          card?.scrollIntoView({ behavior: "smooth", block: "center" });
          card?.classList.add("micro-card-focus");
          setTimeout(() => card?.classList.remove("micro-card-focus"), 1200);
        });
      }
    }

    function renderFilters() {
      const pane = state.pane;
      const primaryOptions = getPrimaryOptions(pane);
      const secondaryOptions = getSecondaryOptions(pane);

      els.primary.innerHTML = primaryOptions.map((opt) =>
        `<option value="${escapeAttr(opt.value)}">${escapeHtml(opt.label)}</option>`
      ).join("");

      els.secondary.innerHTML = secondaryOptions.map((opt) =>
        `<option value="${escapeAttr(opt.value)}">${escapeHtml(opt.label)}</option>`
      ).join("");

      els.primary.value = state.primary;
      els.secondary.value = state.secondary;
    }

    function render() {
      const pane = state.pane;
      const list = filterList(pane);
      const meta = paneById[pane];

      els.subnav.querySelectorAll(".micro-tab").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.pane === pane);
      });

      els.context.innerHTML = `
        <div>
          <span>${meta.icon}</span>
          <strong>${meta.label}</strong>
          <small>${list.length} resultado${list.length === 1 ? "" : "s"} conectado${list.length === 1 ? "" : "s"}</small>
        </div>
        <p>${contextText(pane)}</p>
      `;

      els.content.innerHTML = list.length
        ? list.map((item) => renderCard(item, pane)).join("")
        : `<div class="sv-empty"><div class="sv-empty-icon">🔎</div>Sin resultados en este submódulo.</div>`;
      window.SuiteVet?.Favorites?.bindWithin(els.content);
    }

    function filterList(pane) {
      const q = norm(state.query);
      return data[pane].filter((item) => {
        const text = norm(JSON.stringify(item));
        const passQ = !q || text.includes(q);
        const passPrimary = !state.primary || primaryValueMatch(pane, item, state.primary);
        const passSecondary = !state.secondary || secondaryValueMatch(pane, item, state.secondary);
        const passSelected = !state.selectedId || item.id === state.selectedId;
        return passQ && passPrimary && passSecondary && passSelected;
      });
    }

    function renderCard(item, pane) {
      if (pane === "microorganismos") return renderMicroorganismCard(item);
      if (pane === "antibioticos") return renderAntibioticCard(item);
      if (pane === "pruebas") return renderTestCard(item);
      return renderMediaCard(item, pane);
    }

    function favoriteAttrs(item, pane, overrides = {}) {
      const title = overrides.title || printableName(item, pane);
      const meta = paneById[pane] || {};
      const description = overrides.description || item.objetivo || item.utilidadDiagnostica || item.mecanismo || item.importancia || item.subtitulo || "";
      const id = overrides.id || `microbiologia-${pane}-${item.id || slugText(title)}`;

      return [
        `data-fav-id="${escapeAttr(id)}"`,
        `data-fav-title="${escapeAttr(title)}"`,
        `data-fav-module="Microbiologia"`,
        `data-fav-submodule="${escapeAttr(meta.label || pane)}"`,
        `data-fav-type="Tarjeta"`,
        `data-fav-description="${escapeAttr(description)}"`
      ].join(" ");
    }

    function renderMediaCard(item, pane) {
      const meta = paneById[pane];
      const rel = getRelations(item, pane);
      return `
        <article class="micro-card sv-module-card micro-card-${meta.singular} sv-fade-in" data-micro-card="${item.id}" ${favoriteAttrs(item, pane)}>
          <div class="micro-card-visual" data-kind="${meta.singular}">
            <span>${meta.icon}</span>
            <i></i><i></i><i></i>
          </div>
          <div class="micro-card-head">
            <div>
              <h3>${escapeHtml(item.nombre)}</h3>
              <p>${escapeHtml(item.subtitulo || item.alternativo || "")}</p>
            </div>
            <span class="micro-type-badge">${meta.badge}</span>
          </div>
          <div class="micro-tag-row">${(item.tipos || []).map(tag).join("")}</div>
          <div class="micro-quick-grid">
            ${quick("Dosis estándar", `${formatNumber(item.gramosPorLitro)} g/L`)}
            ${quick("pH final", item.phFinal || "—")}
          </div>
          <div class="micro-use">
            <span>Uso principal</span>
            <p>${escapeHtml(item.objetivo || "")}</p>
          </div>
          ${relationPreview(rel)}
          <div class="micro-card-actions">
            <button class="sv-btn sv-btn-secondary" type="button" data-micro-ficha data-pane="${pane}" data-id="${item.id}">Ficha técnica</button>
            <button class="sv-btn sv-btn-primary" type="button" data-micro-calc data-pane="${pane}" data-id="${item.id}">Calcular medio</button>
          </div>
        </article>
      `;
    }

    function renderTestCard(item) {
      const rel = getRelations(item, "pruebas");
      return `
        <article class="micro-card sv-module-card micro-card-prueba sv-fade-in" data-micro-card="${item.id}" ${favoriteAttrs(item, "pruebas")}>
          <div class="micro-card-visual" data-kind="prueba"><span>⚗️</span><i></i><i></i><i></i></div>
          <div class="micro-card-head">
            <div>
              <h3>${escapeHtml(item.nombre)}</h3>
              <p>${escapeHtml(item.subtitulo || item.alternativo || "")}</p>
            </div>
            <span class="micro-type-badge">PRUEBA</span>
          </div>
          <div class="micro-tag-row">${(item.tipos || []).map(tag).join("")}</div>
          <div class="micro-quick-grid">
            ${quick("Reactivos", (item.reactivos || []).slice(0, 2).join(", ") || "—")}
            ${quick("Lectura positiva", item.interpretacionPositiva || "—")}
          </div>
          <div class="micro-use">
            <span>Uso principal</span>
            <p>${escapeHtml(item.utilidadDiagnostica || item.fundamento || "")}</p>
          </div>
          ${relationPreview(rel)}
          <div class="micro-card-actions">
            <button class="sv-btn sv-btn-secondary" type="button" data-micro-ficha data-pane="pruebas" data-id="${item.id}">Ficha técnica</button>
            <button class="sv-btn sv-btn-primary" type="button" data-micro-calc data-pane="pruebas" data-id="${item.id}">Calcular medio</button>
          </div>
        </article>
      `;
    }

    function renderAntibioticCard(item) {
      const rel = getRelations(item, "antibioticos");
      return `
        <article class="micro-card sv-module-card micro-card-antibiotico sv-fade-in" data-micro-card="${item.id}" ${favoriteAttrs(item, "antibioticos")}>
          <div class="micro-card-visual" data-kind="antibiotico"><span>💊</span><i></i><i></i><i></i></div>
          <div class="micro-card-head">
            <div>
              <h3>${escapeHtml(item.nombre)}</h3>
              <p>${escapeHtml(item.subtitulo || item.familia || "")}</p>
            </div>
            <span class="micro-type-badge">ANTIBIÓTICO</span>
          </div>
          <div class="micro-tag-row">
            ${tag(item.familia)}
            ${tag(item.tipoAccion)}
            ${tag(item.espectroKey || "espectro")}
          </div>
          <div class="micro-quick-grid">
            ${quick("Disco", item.siglaDisco || "—")}
            ${quick("Familia", item.familia || "—")}
          </div>
          <div class="micro-use">
            <span>Mecanismo de acción</span>
            <p>${escapeHtml(item.mecanismo || "")}</p>
          </div>
          ${relationPreview(rel)}
          <div class="micro-card-actions">
            <button class="sv-btn sv-btn-secondary" type="button" data-micro-ficha data-pane="antibioticos" data-id="${item.id}">Ficha técnica</button>
            <button class="sv-btn sv-btn-primary" type="button" data-micro-print-ficha data-pane="antibioticos" data-id="${item.id}">Imprimir pasaporte</button>
          </div>
        </article>
      `;
    }

    function renderMicroorganismCard(item) {
      const rel = getRelations(item, "microorganismos");
      return `
        <article class="micro-card sv-module-card micro-card-microorganismo sv-fade-in" data-micro-card="${item.id}" ${favoriteAttrs(item, "microorganismos", { title: item.nombreCientifico, description: item.importancia || item.subtitulo || "" })}>
          <div class="micro-card-visual" data-kind="microorganismo"><span>🦠</span><i></i><i></i><i></i></div>
          <div class="micro-card-head">
            <div>
              <h3><em>${escapeHtml(item.nombreCientifico)}</em></h3>
              <p>${escapeHtml(item.subtitulo || item.familia || "")}</p>
            </div>
            <span class="micro-type-badge ${item.gramKey === "grampositivo" ? "is-pos" : "is-neg"}">${escapeHtml(item.gramTexto)}</span>
          </div>
          <div class="micro-tag-row">
            ${tag(item.morfologiaKey)}
            ${tag(item.familia)}
            ${(item.sistemasClave || []).slice(0, 3).map(tag).join("")}
          </div>
          <div class="micro-quick-grid">
            ${quick("Reservorio", item.reservorio || "—")}
            ${quick("Zoonosis", item.zoonosis || "—")}
          </div>
          <div class="micro-use">
            <span>Importancia clínica</span>
            <p>${escapeHtml(item.importancia || "")}</p>
          </div>
          ${relationPreview(rel)}
          <div class="micro-card-actions">
            <button class="sv-btn sv-btn-secondary" type="button" data-micro-ficha data-pane="microorganismos" data-id="${item.id}">Ficha técnica</button>
            <button class="sv-btn sv-btn-primary" type="button" data-micro-print-ficha data-pane="microorganismos" data-id="${item.id}">Pasaporte</button>
          </div>
        </article>
      `;
    }

    function openFicha(pane, id) {
      const item = findItem(pane, id);
      if (!item) return;
      const meta = paneById[pane];
      const rel = getRelations(item, pane);

      els.fichaContent.innerHTML = `
        <div class="micro-modal-head">
          <div>
            <span class="micro-kicker">${meta.badge}</span>
            <h3>${pane === "microorganismos" ? `<em>${escapeHtml(item.nombreCientifico)}</em>` : escapeHtml(item.nombre)}</h3>
            <p>${escapeHtml(item.subtitulo || item.alternativo || item.familia || "")}</p>
          </div>
          <button class="micro-icon-btn" type="button" data-micro-close aria-label="Cerrar">×</button>
        </div>
        <div class="micro-modal-body">
          ${renderFichaMain(item, pane)}
          ${renderRelationCenter(rel)}
        </div>
        <div class="micro-modal-actions">
          ${pane !== "microorganismos" && pane !== "antibioticos" ? `<button class="sv-btn sv-btn-primary" type="button" data-micro-calc data-pane="${pane}" data-id="${item.id}">Calcular medio</button>` : ""}
          <button class="sv-btn ${pane === "antibioticos" || pane === "microorganismos" ? "sv-btn-primary" : "sv-btn-secondary"}" type="button" data-micro-print-ficha data-pane="${pane}" data-id="${item.id}">
            ${pane === "antibioticos" ? "Imprimir pasaporte" : pane === "microorganismos" ? "Imprimir pasaporte" : "Imprimir ficha"}
          </button>
        </div>
      `;
      els.fichaModal.classList.add("is-open");
    }

    function renderFichaMain(item, pane) {
      if (pane === "agares" || pane === "caldos") {
        return `
          <div class="micro-detail-grid">
            ${detailBlock("Objetivo microbiológico", item.objetivo)}
            ${detailBlock("Interpretación visual", item.interpretacionVisual)}
            ${detailBlock("Color esperado", item.colorColonias || "No diferencial")}
            ${detailBlock("Notas de laboratorio", item.notasLab)}
          </div>
          <div class="micro-panel">
            <h4>Preparación</h4>
            ${item.preparacion?.noAutoclave ? `<div class="micro-alert">No autoclave este medio. Riesgo de pérdida de selectividad o degradación.</div>` : ""}
            <ol>${(item.preparacion?.pasos || []).map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
          </div>
          ${compositionTable(item.composicion)}
          ${listPanel("Bacterias inhibidas", item.bacteriasInhibidas)}
          ${listPanel("Riesgos biológicos", item.riesgosBiologicos)}
        `;
      }

      if (pane === "pruebas") {
        return `
          <div class="micro-detail-grid">
            ${detailBlock("Fundamento", item.fundamento)}
            ${detailBlock("Principio bioquímico", item.principioBioquimico)}
            ${detailBlock("Interpretación positiva", item.interpretacionPositiva)}
            ${detailBlock("Interpretación negativa", item.interpretacionNegativa)}
          </div>
          ${listPanel("Reactivos", item.reactivos)}
          ${listPanel("Errores comunes", item.erroresComunes)}
          ${detailBlock("Utilidad diagnóstica", item.utilidadDiagnostica, true)}
        `;
      }

      if (pane === "antibioticos") {
        return `
          <div class="micro-detail-grid">
            ${detailBlock("Familia", item.familia)}
            ${detailBlock("Tipo de acción", item.tipoAccion)}
            ${detailBlock("Mecanismo", item.mecanismo)}
            ${detailBlock("Espectro", item.espectro)}
            ${detailBlock("Uso clínico", item.usoClinico)}
            ${detailBlock("Interpretación CLSI/BRCAST", item.interpretacion)}
          </div>
          ${detailBlock("Resistencia antimicrobiana", item.resistencia, true)}
          ${detailBlock("Observaciones", item.observaciones, true)}
        `;
      }

      return `
        <div class="micro-detail-grid">
          ${detailBlock("Reservorio", item.reservorio)}
          ${detailBlock("Importancia clínica", item.importancia)}
          ${detailBlock("Patogenicidad", item.patogenicidad)}
          ${detailBlock("Zoonosis", item.zoonosis)}
        </div>
        ${listPanel("Toxinas / factores", item.toxinas)}
        ${listPanel("Resistencias relevantes", item.resistencia)}
        ${detailBlock("Observaciones clínicas", item.observacionesClinicas, true)}
        ${detailBlock("Notas de laboratorio", item.notasLab, true)}
      `;
    }

    function renderRelationCenter(rel) {
      return `
        <div class="micro-relation-center">
          <h4>Centro de navegación microbiológico</h4>
          ${rel.bacterias?.length ? relationSection("Bacterias relacionadas", "microorganismos", rel.bacterias) : ""}
          ${rel.agares?.length ? relationSection("Agares relacionados", "agares", rel.agares) : ""}
          ${rel.caldos?.length ? relationSection("Caldos relacionados", "caldos", rel.caldos) : ""}
          ${rel.pruebas?.length ? relationSection("Pruebas bioquímicas", "pruebas", rel.pruebas) : ""}
          ${rel.antibioticos?.length ? relationSection("Antibióticos frecuentes", "antibioticos", rel.antibioticos) : ""}
          ${rel.resistentes?.length ? relationSection("Bacterias resistentes", "microorganismos", rel.resistentes, "danger") : ""}
        </div>
      `;
    }

    function openCalc(pane, id) {
      const origin = { pane, id };
      let targetPane = pane;
      let target = findItem(pane, id);
      if (!target) return;

      if (pane !== "agares" && pane !== "caldos") {
        const rel = getRelations(target, pane);
        const mediumId = [
          ...(target.mediosIds || []),
          ...(target.agaresIds || []),
          ...(target.caldosIds || []),
          ...(rel.agares || []),
          ...(rel.caldos || [])
        ].find((candidateId) => indexes.agares[candidateId] || indexes.caldos[candidateId]);
        target = indexes.agares[mediumId] || indexes.caldos[mediumId];
        targetPane = indexes.agares[mediumId] ? "agares" : "caldos";
        if (!target) {
          toast("Este elemento no tiene un medio asociado para calcular.");
          return;
        }
      }

      state.calcTarget = { pane: targetPane, id: target.id };
      state.calcOrigin = origin;
      const isAgar = targetPane === "agares";
      const originItem = findItem(origin.pane, origin.id);
      const originContext = originItem && originItem.id !== target.id
        ? `Medio asociado a ${printableName(originItem, origin.pane)} · `
        : "";
      const perfiles = isAgar
        ? D.perfilesPlaca || []
        : [{ id: "tubo10", label: "Tubo / alícuota", detalle: "10 mL", volumenMl: 10 }, { id: "frasco100", label: "Frasco pequeño", detalle: "100 mL", volumenMl: 100 }];

      els.calcContent.innerHTML = `
        <div class="micro-modal-head">
          <div>
            <span class="micro-kicker">CALCULADORA DE PREPARACIÓN</span>
            <h3>${escapeHtml(target.nombre)}</h3>
            <p>${escapeHtml(originContext)}${formatNumber(target.gramosPorLitro)} g/L · pH ${escapeHtml(target.phFinal || "—")}</p>
          </div>
          <button class="micro-icon-btn" type="button" data-micro-close aria-label="Cerrar">×</button>
        </div>
        <div class="micro-calc-form">
          <label>
            <span>${isAgar ? "Tipo de placa" : "Tipo de preparación"}</span>
            <select class="sv-select" id="micro-calc-profile">
              ${perfiles.map((p) => `<option value="${p.volumenMl}">${escapeHtml(p.label)} (${escapeHtml(p.detalle)})</option>`).join("")}
            </select>
          </label>
          <label>
            <span>${isAgar ? "Cantidad de placas" : "Cantidad de tubos/lotes"}</span>
            <input class="sv-input" id="micro-calc-count" type="number" min="1" value="${isAgar ? 10 : 1}" />
          </label>
          <div class="micro-calc-note">
            El volumen por unidad se calcula con el perfil elegido. Se muestra un margen extra sugerido del 10% para pérdidas por manejo.
          </div>
        </div>
        <div id="micro-calc-result" class="micro-calc-result-panel"></div>
        <div class="micro-modal-actions micro-calc-actions">
          <div class="micro-action-group">
            <span>Consulta</span>
            <button class="sv-btn sv-btn-secondary" type="button" data-micro-ficha data-pane="${origin.pane}" data-id="${origin.id}">Ficha tecnica</button>
          </div>
          <div class="micro-action-group">
            <span>Acciones de preparacion</span>
            <button class="sv-btn sv-btn-primary" type="button" data-micro-print-prep>Imprimir preparacion</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-micro-save-prep>Guardar preparacion</button>
          </div>
          <div class="micro-action-group">
            <span>Acciones de etiquetas</span>
            <button class="sv-btn sv-btn-primary" type="button" data-micro-label-action="print">Imprimir etiqueta</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-micro-label-action="save">Guardar etiqueta</button>
          </div>
          <div class="micro-action-group is-full">
            <span>Accion completa</span>
            <button class="sv-btn sv-btn-primary" type="button" data-micro-label-action="combo">Imprimir preparacion + etiqueta</button>
          </div>
        </div>
      `;
      els.calcModal.classList.add("is-open");
      updateCalcResult();
    }

    function updateCalcResult() {
      const calc = getCalcSnapshot();
      const result = root.querySelector("#micro-calc-result");
      if (!result || !calc) return;

      result.innerHTML = `
        <div>${quick("Volumen total", `${formatNumber(calc.totalMl)} mL`)}</div>
        <div>${quick("Masa exacta", `${formatNumber(calc.grams, 3)} g`)}</div>
        <div>${quick("Agua destilada", `${formatNumber(calc.totalMl)} mL`)}</div>
        <div>${quick("Unidades", `${calc.count || 0}`)}</div>
        <div>${quick("Volumen con 10% extra", `${formatNumber(calc.totalWithMargin)} mL`)}</div>
        <div>${quick("Masa con 10% extra", `${formatNumber(calc.gramsWithMargin, 3)} g`)}</div>
        ${calc.target.preparacion?.noAutoclave ? `<div class="micro-alert">Alerta: este medio no debe autoclaverse.</div>` : ""}
      `;
    }

    function getCalcSnapshot() {
      if (!state.calcTarget) return null;
      const target = findItem(state.calcTarget.pane, state.calcTarget.id);
      if (!target) return null;
      const origin = state.calcOrigin && findItem(state.calcOrigin.pane, state.calcOrigin.id);
      const profileEl = root.querySelector("#micro-calc-profile");
      const count = Number(root.querySelector("#micro-calc-count")?.value || 0);
      const perUnit = Number(profileEl?.value || 0);
      const totalMl = Math.max(0, count * perUnit);
      const grams = target.gramosPorLitro * totalMl / 1000;
      const totalWithMargin = totalMl * 1.1;
      const gramsWithMargin = target.gramosPorLitro * totalWithMargin / 1000;

      return {
        target,
        targetPane: state.calcTarget.pane,
        origin,
        originPane: state.calcOrigin?.pane,
        profileText: profileEl?.selectedOptions?.[0]?.textContent || "",
        count,
        perUnit,
        totalMl,
        grams,
        totalWithMargin,
        gramsWithMargin,
        marginPercent: 10
      };
    }

    function printPreparation() {
      const calc = getCalcSnapshot();
      if (!calc) return;

      printDocument(
        `Preparación de ${calc.target.nombre}`,
        renderPrintablePreparation(calc),
        { favorite: buildPreparationFavorite(calc) }
      );
    }

    function printFichaDoc(pane, id) {
      const item = findItem(pane, id);
      if (!item) return;
      const title = pane === "microorganismos"
        ? `Pasaporte del microorganismo: ${item.nombreCientifico}`
        : pane === "antibioticos"
          ? `Pasaporte del antibiótico: ${item.nombre}`
          : `Ficha técnica: ${item.nombre}`;
      printDocument(title, renderPrintableFicha(item, pane), {
        docClass: pane === "antibioticos" ? "is-antibiotic-passport" : ""
      });
    }

    function abrirModalEtiqueta(action = "print", savedLabel = null) {
      const calc = savedLabel ? restoreCalcSnapshot(savedLabel.calculo || savedLabel.datosTecnicos?.calculo) : getCalcSnapshot();
      if (!calc) {
        toast("Calcula una preparacion antes de generar etiquetas.");
        return;
      }

      const remembered = getRememberedMicroUser();
      const savedForm = savedLabel?.formulario || {};
      const preparationType = getPreparationType(calc);
      const labelOptions = buildInitialLabelOptions(calc, savedLabel);
      const subject = getLabelSubject(calc);
      const primaryAction = action === "combo" ? "combo" : action === "save" ? "save" : "print";

      state.labelContext = {
        action,
        calc,
        savedId: savedLabel?.id || null
      };

      els.labelContent.innerHTML = `
        <div class="micro-modal-head">
          <div>
            <span class="micro-kicker">ETIQUETAS DE LABORATORIO</span>
            <h3>${escapeHtml(subject.nombre)}</h3>
            <p>${escapeHtml(subject.categoria)} · ${formatNumber(calc.totalMl)} mL preparados · ${calc.count || 1} unidad${Number(calc.count) === 1 ? "" : "es"}</p>
          </div>
          <button class="micro-icon-btn" type="button" data-micro-label-close aria-label="Cerrar">×</button>
        </div>
        <div class="micro-label-modal-body">
          <form class="micro-label-form" autocomplete="off">
            <label>
              <span>Responsable</span>
              <input id="micro-label-responsable" class="sv-input" type="text" value="${escapeAttr(savedForm.responsable || remembered.responsable)}" placeholder="Nombre del estudiante o responsable" />
            </label>
            <label>
              <span>Paralelo / curso / semestre</span>
              <input id="micro-label-paralelo" class="sv-input" type="text" value="${escapeAttr(savedForm.paralelo || remembered.paralelo)}" placeholder="Ej. 2do MVZ" />
            </label>
            <div class="micro-label-type-block is-wide">
              <span>Tipo de etiqueta</span>
              <div class="micro-label-type-grid" id="micro-label-options">
                ${labelOptions.map((option) => renderLabelOptionRow(option)).join("")}
              </div>
              <small id="micro-label-type-help" class="micro-label-type-help">
                ${escapeHtml(getLabelOptionsHelp(preparationType))}
              </small>
            </div>
            <label>
              <span>Lote / codigo de lote</span>
              <input id="micro-label-lote" class="sv-input" type="text" value="${escapeAttr(savedForm.lote || savedLabel?.lote || generarLoteMicro())}" placeholder="SV-MIC-2026-001" />
            </label>
            <label class="is-wide">
              <span>Observaciones opcionales</span>
              <textarea id="micro-label-observaciones" class="sv-input micro-label-textarea" rows="3" placeholder="Solo si debe aparecer en la etiqueta">${escapeHtml(savedForm.observaciones || savedLabel?.observaciones || "")}</textarea>
            </label>
          </form>
          <aside class="micro-label-preview-panel">
            <div class="micro-label-preview-head">
              <span>Vista previa</span>
              <strong id="micro-label-preview-count"></strong>
            </div>
            <div id="micro-label-preview" class="micro-label-preview"></div>
          </aside>
        </div>
        <div class="micro-modal-actions micro-label-actions">
          <button class="sv-btn sv-btn-secondary" type="button" data-micro-label-close>Cancelar</button>
          ${primaryAction !== "save" ? `<button class="sv-btn sv-btn-secondary" type="button" data-micro-label-submit="save">Guardar etiqueta</button>` : ""}
          ${primaryAction !== "print" ? `<button class="sv-btn sv-btn-secondary" type="button" data-micro-label-submit="print">Imprimir etiqueta</button>` : ""}
          <button class="sv-favorite-action micro-label-favorite-btn" type="button" data-micro-label-favorite aria-label="Guardar etiqueta en favoritos" title="Favorito">&#9733;</button>
          <button class="sv-btn sv-btn-primary" type="button" data-micro-label-submit="${primaryAction}">
            ${primaryAction === "combo" ? "Imprimir preparacion + etiqueta" : primaryAction === "save" ? "Guardar etiqueta" : "Imprimir etiqueta"}
          </button>
        </div>
      `;

      els.labelModal.classList.add("is-open");
      actualizarVistaPreviaEtiqueta();
    }

    function cerrarModalEtiqueta() {
      els.labelModal.classList.remove("is-open");
      els.labelContent.innerHTML = "";
      state.labelContext = null;
    }

    function handleLabelFormInput(e) {
      if (e.target?.matches?.("[data-label-quantity]")) {
        normalizeLabelQuantityInput(e.target);
      }
      actualizarVistaPreviaEtiqueta();
    }

    function handleLabelFormChange(e) {
      if (e.target?.matches?.("[data-label-quantity]")) {
        normalizeLabelQuantityInput(e.target);
      }
      actualizarVistaPreviaEtiqueta();
    }

    function actualizarVistaPreviaEtiqueta() {
      if (!state.labelContext) return;
      const calc = state.labelContext.calc;
      const form = obtenerDatosFormularioEtiqueta();
      const preview = root.querySelector("#micro-label-preview");
      const previewCount = root.querySelector("#micro-label-preview-count");

      const labels = generarDatosEtiqueta(calc, obtenerDatosFormularioEtiqueta());
      const first = labels[0];
      actualizarEstadoOpcionesEtiqueta(form.labelOptions);
      syncMicroLabelFavoriteButton(calc, form);

      if (!preview) return;
      if (!first) {
        preview.innerHTML = `
          <div class="micro-label-preview-empty">
            Selecciona al menos un tipo de etiqueta para generar la vista previa.
          </div>
        `;
        if (previewCount) previewCount.textContent = "0 etiquetas";
        return;
      }

      preview.innerHTML = `
        ${generarHTMLEtiqueta(first)}
        <p class="micro-label-preview-summary">
          Se generaran ${labels.length} etiqueta${labels.length === 1 ? "" : "s"} en total en hoja A4. Si no entran en una pagina, continuaran automaticamente en paginas adicionales.
        </p>
        ${renderLabelSelectionSummary(form.labelOptions)}
      `;
      if (previewCount) {
        previewCount.textContent = `${labels.length} etiqueta${labels.length === 1 ? "" : "s"} en total`;
      }
    }

    function obtenerDatosFormularioEtiqueta() {
      const responsable = root.querySelector("#micro-label-responsable")?.value.trim() || "";
      const paralelo = root.querySelector("#micro-label-paralelo")?.value.trim() || "";
      const observaciones = root.querySelector("#micro-label-observaciones")?.value.trim() || "";
      const labelOptions = getLabelOptionsFromForm();
      const firstSelected = labelOptions.find((option) => option.checked);
      const lote = root.querySelector("#micro-label-lote")?.value.trim() || "";

      saveRememberedMicroUser({ responsable, paralelo });
      return {
        responsable,
        paralelo,
        observaciones,
        labelOptions,
        tipoEtiqueta: firstSelected?.id || "",
        cantidadManual: firstSelected?.quantity || 1,
        lote
      };
    }

    function ejecutarAccionEtiqueta(action) {
      if (!state.labelContext) return;
      const calc = state.labelContext.calc;
      const form = obtenerDatosFormularioEtiqueta();
      const labels = generarDatosEtiqueta(calc, form);

      if (!labels.length) {
        toast("Selecciona al menos un tipo de etiqueta para imprimir.");
        return;
      }

      if (action === "save") {
        guardarEtiqueta(calc, form, { id: state.labelContext.savedId });
        cerrarModalEtiqueta();
        return;
      }

      if (action === "combo") {
        printDocument(
          `Preparacion y etiquetas de ${calc.target.nombre}`,
          `${renderPrintablePreparation(calc)}${generarHojaEtiquetas(calc, form, { includeHeader: false })}`,
          { docClass: "is-prep-with-labels" }
        );
        return;
      }

      imprimirEtiqueta(calc, form);
    }

    function imprimirEtiqueta(calc, datosFormulario) {
      const labels = generarDatosEtiqueta(calc, datosFormulario);
      if (!labels.length) {
        toast("Selecciona al menos un tipo de etiqueta para imprimir.");
        return;
      }
      const subject = getLabelSubject(calc);
      printDocument(
        `Etiquetas de ${subject.nombre}`,
        generarHojaEtiquetas(calc, datosFormulario),
        { docClass: "is-label-sheet" }
      );
    }

    function buildPreparationFavorite(calc, datosFormulario = {}) {
      const subject = getLabelSubject(calc);
      const submodulo = paneById[subject.pane]?.label || subject.categoria || "Microbiologia";
      const volumeText = `${formatNumber(calc.totalMl)} mL`;
      const id = `prep-microbiologia-${subject.pane}-${calc.target?.id || slugText(subject.nombre)}-${slugText(volumeText)}-${calc.count || 1}u`;

      return {
        id,
        titulo: `Preparacion de ${subject.nombre} - ${volumeText}`,
        modulo: "Microbiologia",
        submodulo,
        tipo: "Preparacion",
        descripcion: "Preparacion calculada para impresion.",
        data: {
          medio: subject.nombre,
          tipoMedio: subject.categoria,
          volumen: volumeText,
          cantidad: calc.count || "",
          volumenPorUnidad: `${formatNumber(calc.perUnit)} mL`,
          responsable: datosFormulario.responsable || "",
          paralelo: datosFormulario.paralelo || "",
          fecha: formatDateOnly(new Date()),
          lote: datosFormulario.lote || "",
          observaciones: datosFormulario.observaciones || "",
          calculo: serializeCalcSnapshot(calc)
        }
      };
    }

    function buildLabelFavorite(calc, datosFormulario) {
      const labels = generarDatosEtiqueta(calc, datosFormulario);
      if (!labels.length) return null;

      const subject = getLabelSubject(calc);
      const selectedOptions = getSelectedLabelOptions(datosFormulario.labelOptions);
      const optionKey = selectedOptions.map((option) => `${option.id}-${option.quantity}`).join("-");
      const id = `label-microbiologia-${subject.pane}-${calc.origin?.id || calc.target?.id || slugText(subject.nombre)}-${slugText(optionKey || "etiqueta")}-${slugText(datosFormulario.lote || "sin-lote")}`;

      return {
        id,
        titulo: `Etiqueta - ${subject.nombre}`,
        modulo: "Microbiologia",
        submodulo: "Etiquetas",
        tipo: "Etiqueta",
        descripcion: "Etiqueta guardada desde el formulario de microbiologia.",
        data: {
          laboratorio: "SUITE VET",
          medio: subject.nombre,
          responsable: datosFormulario.responsable || "",
          paralelo: datosFormulario.paralelo || "",
          fecha: labels[0]?.fecha || formatDateOnly(new Date()),
          lote: datosFormulario.lote || "",
          tipoEtiqueta: selectedOptions.map((option) => `${option.label} (${option.quantity})`).join(", "),
          tipoEnvase: selectedOptions.map((option) => option.label).join(", "),
          observaciones: datosFormulario.observaciones || "",
          cantidadEtiquetas: labels.length,
          tiposSeleccionados: selectedOptions,
          codigos: labels.map((label) => label.codigo),
          calculo: serializeCalcSnapshot(calc)
        }
      };
    }

    function toggleMicroPrintFavorite() {
      if (!state.printFavorite) return;
      window.SuiteVet?.Favorites?.toggleFavorite?.(state.printFavorite, {
        addedMessage: "Preparacion agregada a favoritos",
        removedMessage: "Preparacion eliminada de favoritos"
      });
      syncMicroPrintFavoriteButton();
    }

    function syncMicroPrintFavoriteButton() {
      const btn = els.printArea?.querySelector("[data-micro-print-favorite]");
      if (!btn || !state.printFavorite) return;
      const active = Boolean(window.SuiteVet?.Favorites?.isFavorite?.(state.printFavorite.id));
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    }

    function toggleMicroLabelFavorite() {
      if (!state.labelContext) return;
      const form = obtenerDatosFormularioEtiqueta();
      const favorite = buildLabelFavorite(state.labelContext.calc, form);
      if (!favorite) {
        toast("Selecciona al menos un tipo de etiqueta para guardar en favoritos.");
        return;
      }

      window.SuiteVet?.Favorites?.toggleFavorite?.(favorite, {
        addedMessage: "Etiqueta agregada a favoritos",
        removedMessage: "Etiqueta eliminada de favoritos"
      });
      syncMicroLabelFavoriteButton(state.labelContext.calc, form);
    }

    function syncMicroLabelFavoriteButton(calc, datosFormulario) {
      const btn = root.querySelector("[data-micro-label-favorite]");
      if (!btn || !calc) return;
      const favorite = buildLabelFavorite(calc, datosFormulario);
      const active = favorite ? Boolean(window.SuiteVet?.Favorites?.isFavorite?.(favorite.id)) : false;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.disabled = !favorite;
    }

    function guardarPreparacionActual() {
      const calc = getCalcSnapshot();
      if (!calc) {
        toast("Calcula una preparacion antes de guardarla.");
        return;
      }
      guardarPreparacion(calc, { ...getRememberedMicroUser(), lote: generarLoteMicro() });
    }

    function guardarPreparacion(calc, datosFormulario = {}) {
      const subject = getLabelSubject(calc);
      const saved = obtenerGuardadosMicrobiologia();
      const item = {
        id: uniqueMicroId("prep"),
        tipo: "preparacion",
        modulo: "Microbiologia",
        categoria: subject.categoria,
        categoriaKey: subject.pane,
        nombre: subject.nombre,
        nombreMedio: calc.target.nombre,
        fecha: formatDateOnly(new Date()),
        fechaHora: new Date().toISOString(),
        lote: datosFormulario.lote || generarLoteMicro(),
        volumenTotal: `${formatNumber(calc.totalMl)} mL`,
        cantidadPlacas: calc.targetPane === "agares" ? calc.count : null,
        cantidadTubos: calc.targetPane === "caldos" || subject.pane === "pruebas" ? calc.count : null,
        cantidadUnidades: calc.count,
        tamanoPlaca: calc.targetPane === "agares" ? calc.profileText : "",
        volumenPorUnidad: `${formatNumber(calc.perUnit)} mL`,
        responsable: datosFormulario.responsable || "",
        paralelo: datosFormulario.paralelo || "",
        datosTecnicos: {
          calculo: serializeCalcSnapshot(calc)
        },
        calculo: serializeCalcSnapshot(calc)
      };

      saved.preparaciones.push(item);
      persistirGuardadosMicrobiologia(saved);
      renderMicroSavedBadge(true);
      renderPanelGuardadosMicrobiologia();
      toast(`Preparacion guardada: ${subject.nombre}`);
      return item;
    }

    function guardarEtiqueta(calc, datosFormulario, options = {}) {
      const labels = generarDatosEtiqueta(calc, datosFormulario);
      if (!labels.length) {
        toast("No hay etiquetas para guardar.");
        return null;
      }

      const subject = getLabelSubject(calc);
      const selectedOptions = getSelectedLabelOptions(datosFormulario.labelOptions);
      const saved = obtenerGuardadosMicrobiologia();
      const item = {
        id: options.id || uniqueMicroId("etiq"),
        tipo: "etiqueta",
        modulo: "Microbiologia",
        categoria: subject.categoria,
        categoriaKey: subject.pane,
        nombre: subject.nombre,
        fecha: formatDateOnly(new Date()),
        fechaHora: new Date().toISOString(),
        lote: datosFormulario.lote || "",
        tipoEtiqueta: selectedOptions.map((option) => `${option.label} (${option.quantity})`).join(", "),
        tipoEtiquetaKey: selectedOptions.map((option) => option.id).join(","),
        cantidadEtiquetas: labels.length,
        responsable: datosFormulario.responsable || "",
        paralelo: datosFormulario.paralelo || "",
        observaciones: datosFormulario.observaciones || "",
        codigos: labels.map((label) => label.codigo),
        formulario: {
          ...datosFormulario,
          labelOptions: datosFormulario.labelOptions || [],
          tiposSeleccionados: selectedOptions.map((option) => ({
            id: option.id,
            label: option.label,
            quantity: option.quantity,
            suffix: option.suffix
          })),
          cantidadTotal: labels.length
        },
        datosTecnicos: {
          calculo: serializeCalcSnapshot(calc),
          primeraEtiqueta: labels[0]
        },
        calculo: serializeCalcSnapshot(calc)
      };

      const existingIndex = saved.etiquetas.findIndex((entry) => entry.id === item.id);
      if (existingIndex >= 0) {
        saved.etiquetas[existingIndex] = item;
      } else {
        saved.etiquetas.push(item);
      }

      persistirGuardadosMicrobiologia(saved);
      renderMicroSavedBadge(true);
      renderPanelGuardadosMicrobiologia();
      toast(`Etiqueta guardada: ${subject.nombre}`);
      return item;
    }

    function obtenerGuardadosMicrobiologia() {
      const preparaciones = readStorageArray(microStorage.preparaciones);
      const etiquetas = readStorageArray(microStorage.etiquetas);
      return { preparaciones, etiquetas };
    }

    function persistirGuardadosMicrobiologia(saved) {
      writeStorageArray(microStorage.preparaciones, saved.preparaciones);
      writeStorageArray(microStorage.etiquetas, saved.etiquetas);
      writeStorageArray(microStorage.guardados, [
        ...saved.preparaciones.map((item) => ({ ...item, tipo: "preparacion" })),
        ...saved.etiquetas.map((item) => ({ ...item, tipo: "etiqueta" }))
      ]);
    }

    function abrirPanelGuardadosMicrobiologia() {
      renderPanelGuardadosMicrobiologia();
      els.savedModal.classList.add("is-open");
    }

    function cerrarPanelGuardadosMicrobiologia() {
      els.savedModal.classList.remove("is-open");
      els.savedContent.innerHTML = "";
    }

    function renderPanelGuardadosMicrobiologia() {
      if (!els.savedContent) return;
      const saved = obtenerGuardadosMicrobiologia();
      const total = saved.preparaciones.length + saved.etiquetas.length;
      els.savedContent.innerHTML = `
        <div class="micro-modal-head">
          <div>
            <span class="micro-kicker">MICRO LAB</span>
            <h3>Guardados de Microbiologia</h3>
            <p>${total} elemento${total === 1 ? "" : "s"} guardado${total === 1 ? "" : "s"} localmente.</p>
          </div>
          <button class="micro-icon-btn" type="button" data-micro-saved-close aria-label="Cerrar">×</button>
        </div>
        <div class="micro-saved-body">
          ${renderSavedSection("Preparaciones guardadas", saved.preparaciones, "preparacion")}
          ${renderSavedSection("Etiquetas guardadas", saved.etiquetas, "etiqueta")}
        </div>
      `;
    }

    function renderSavedSection(title, items, type) {
      if (!items.length) {
        return `
          <section class="micro-saved-section">
            <h4>${escapeHtml(title)}</h4>
            <p class="micro-saved-empty">Todavia no hay ${type === "preparacion" ? "preparaciones" : "etiquetas"} guardadas.</p>
          </section>
        `;
      }

      return `
        <section class="micro-saved-section">
          <h4>${escapeHtml(title)}</h4>
          <div class="micro-saved-list">
            ${[...items].sort((a, b) => String(b.fechaHora).localeCompare(String(a.fechaHora))).map((item) => renderSavedItem(item, type)).join("")}
          </div>
        </section>
      `;
    }

    function renderSavedItem(item, type) {
      const details = type === "preparacion"
        ? `${item.volumenTotal || "Volumen no registrado"} · ${item.fecha || ""}`
        : `${item.tipoEtiqueta || "Etiqueta"} · ${item.cantidadEtiquetas || 0} etiqueta${Number(item.cantidadEtiquetas) === 1 ? "" : "s"}`;
      return `
        <article class="micro-saved-item">
          <div>
            <strong>${escapeHtml(item.nombre || "Sin nombre")}</strong>
            <span>${escapeHtml(details)}</span>
            <small>${escapeHtml([item.responsable, item.paralelo, item.lote].filter(Boolean).join(" · "))}</small>
          </div>
          <div class="micro-saved-actions">
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-micro-print-saved data-id="${escapeAttr(item.id)}">Imprimir</button>
            ${type === "etiqueta" ? `<button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-micro-edit-saved-label data-id="${escapeAttr(item.id)}">Editar</button>` : ""}
            <button class="sv-btn sv-btn-sm sv-btn-danger" type="button" data-micro-delete-saved data-id="${escapeAttr(item.id)}">Eliminar</button>
          </div>
        </article>
      `;
    }

    function eliminarGuardadoMicrobiologia(id) {
      const saved = obtenerGuardadosMicrobiologia();
      const before = saved.preparaciones.length + saved.etiquetas.length;
      saved.preparaciones = saved.preparaciones.filter((item) => item.id !== id);
      saved.etiquetas = saved.etiquetas.filter((item) => item.id !== id);
      if (saved.preparaciones.length + saved.etiquetas.length === before) return;
      persistirGuardadosMicrobiologia(saved);
      renderMicroSavedBadge();
      renderPanelGuardadosMicrobiologia();
      toast("Guardado eliminado.");
    }

    function imprimirGuardadoMicrobiologia(id) {
      const saved = obtenerGuardadosMicrobiologia();
      const prep = saved.preparaciones.find((item) => item.id === id);
      if (prep) {
        const calc = restoreCalcSnapshot(prep.calculo || prep.datosTecnicos?.calculo);
        printDocument(`Preparacion guardada: ${prep.nombre}`, renderPrintablePreparation(calc), {
          favorite: buildPreparationFavorite(calc, prep)
        });
        return;
      }

      const etiqueta = saved.etiquetas.find((item) => item.id === id);
      if (etiqueta) {
        const calc = restoreCalcSnapshot(etiqueta.calculo || etiqueta.datosTecnicos?.calculo);
        const form = etiqueta.formulario || formFromSavedEtiqueta(etiqueta);
        imprimirEtiqueta(calc, form);
      }
    }

    function abrirEtiquetaGuardadaParaEditar(id) {
      const etiqueta = obtenerGuardadosMicrobiologia().etiquetas.find((item) => item.id === id);
      if (!etiqueta) return;
      cerrarPanelGuardadosMicrobiologia();
      abrirModalEtiqueta("print", etiqueta);
    }

    function renderMicroSavedBadge(animate = false) {
      const saved = obtenerGuardadosMicrobiologia();
      const total = saved.preparaciones.length + saved.etiquetas.length;
      if (els.labBadge) {
        els.labBadge.textContent = total;
        els.labBadge.dataset.count = String(total);
      }
      if (animate) {
        els.labFab?.classList.add("sv-pulse");
        setTimeout(() => els.labFab?.classList.remove("sv-pulse"), 350);
      }
    }

    function actualizarVisibilidadFabMicro(viewName) {
      const visible = viewName === "microbiologia";
      els.labFab?.classList.toggle("sv-fab-hidden", !visible);
      if (!visible) cerrarPanelGuardadosMicrobiologia();
    }

    function generarHojaEtiquetas(calc, datosFormulario, options = {}) {
      const labels = generarDatosEtiqueta(calc, datosFormulario);
      const subject = getLabelSubject(calc);
      const header = options.includeHeader === false ? "" : printHeader("Etiquetas de laboratorio", subject.nombre);
      const selectedOptions = getSelectedLabelOptions(datosFormulario.labelOptions);

      return `
        ${header}
        <section class="micro-print-section micro-label-print-section">
          <h2>Etiquetas de laboratorio para recortar</h2>
          <p class="micro-print-muted">Se generaran ${labels.length} etiqueta${labels.length === 1 ? "" : "s"} distribuidas automaticamente en hoja A4.</p>
          ${renderPrintableLabelSummary(selectedOptions)}
          ${groupLabelsByType(labels).map((group) => `
            <div class="micro-label-sheet-group">
              <h3>${escapeHtml(group.label)} · ${group.labels.length} etiqueta${group.labels.length === 1 ? "" : "s"}</h3>
              <div class="micro-label-sheet micro-label-sheet-${escapeAttr(group.type)}">
                ${group.labels.map((label) => generarHTMLEtiqueta(label)).join("")}
              </div>
            </div>
          `).join("")}
        </section>
      `;
    }

    function generarDatosEtiqueta(calc, datosFormulario = {}) {
      const subject = getLabelSubject(calc);
      const fecha = formatDateOnly(new Date());
      const selectedOptions = getSelectedLabelOptions(datosFormulario.labelOptions || fallbackLabelOptions(calc, datosFormulario));

      return selectedOptions.flatMap((option) => {
        const tipo = normalizeLabelType(option.id);
        const cantidad = clampLabelCount(option.quantity);
        const observaciones = buildLabelObservations(calc, tipo, datosFormulario.observaciones);

        return Array.from({ length: cantidad }, (_, index) => ({
          nombre: subject.nombre,
          categoria: subject.categoria,
          tipo,
          tipoEtiqueta: option.label || labelTypeName(tipo),
          labelIcon: option.icon || "",
          labelSuffix: option.suffix || getLabelSuffix(tipo),
          fecha,
          responsable: datosFormulario.responsable || "",
          paralelo: datosFormulario.paralelo || "",
          lote: datosFormulario.lote || "",
          observaciones,
          modulo: "Microbiologia",
          app: "SUITE VET",
          indice: index + 1,
          total: cantidad,
          cantidadTotalSeleccionada: selectedOptions.reduce((sum, item) => sum + clampLabelCount(item.quantity), 0),
          secuencia: labelSequence(tipo, index + 1, cantidad),
          codigo: generarCodigoEtiqueta(subject.nombre, option.suffix || tipo, index),
          volumenTotal: `${formatNumber(calc.totalMl)} mL`,
          volumenUnidad: `${formatNumber(calc.perUnit)} mL`
        }));
      });
    }

    function generarHTMLEtiqueta(label) {
      const obs = label.observaciones?.length
        ? `<div class="micro-lab-label-obs"><span>Obs.</span>${label.observaciones.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>`
        : "";
      const lote = label.lote ? `<span>Lote: ${escapeHtml(label.lote)}</span>` : "";
      const volume = label.tipo === "frasco"
        ? `<span>Vol. total: ${escapeHtml(label.volumenTotal)}</span>`
        : "";

      return `
        <article class="micro-lab-label micro-lab-label-${escapeAttr(label.tipo)}">
          <header>
            <strong>${escapeHtml(label.nombre)}</strong>
            <b>${escapeHtml(label.codigo)}</b>
          </header>
          <div class="micro-lab-label-grid">
            <span>Tipo: ${escapeHtml(label.categoria)}</span>
            <span>Etiqueta: ${escapeHtml(label.tipoEtiqueta)}</span>
            <span>Fecha: ${escapeHtml(label.fecha)}</span>
            ${label.responsable ? `<span>Resp.: ${escapeHtml(label.responsable)}</span>` : ""}
            ${label.paralelo ? `<span>Paralelo: ${escapeHtml(label.paralelo)}</span>` : ""}
            <span>${escapeHtml(label.secuencia)}</span>
            <span>Cantidad: ${escapeHtml(label.total)} etiqueta${label.total === 1 ? "" : "s"}</span>
            ${volume}
            ${lote}
          </div>
          ${obs}
          <footer>
            <span>Modulo: ${escapeHtml(label.modulo)}</span>
            <span>${escapeHtml(label.app)}</span>
          </footer>
        </article>
      `;
    }

    function generarCodigoEtiqueta(nombre, tipoEtiqueta, index) {
      const clean = norm(nombre)
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      const initials = clean.length > 1
        ? clean.slice(0, 2).map((word) => word[0]).join("")
        : (clean[0] || "sv").slice(0, 2);
      const typeCode = getLabelCodeSuffix(tipoEtiqueta);
      return `${initials.toUpperCase()}-${typeCode}-${String(index + 1).padStart(3, "0")}`;
    }

    function getAvailableLabelOptions(preparationType) {
      const type = norm(preparationType);

      if (type.includes("agar")) {
        return [
          { id: "petri", label: "Caja Petri", icon: "🧫", defaultChecked: true, defaultQuantitySource: "calculated", suffix: "P" },
          { id: "frasco", label: "Matraz / Frasco", icon: "⚗️", defaultChecked: false, defaultQuantitySource: "one", suffix: "F" }
        ];
      }

      if (type.includes("caldo")) {
        return [
          { id: "tubo", label: "Tubo de ensayo", icon: "🧪", defaultChecked: true, defaultQuantitySource: "calculated", suffix: "T" },
          { id: "frasco", label: "Matraz / Frasco", icon: "⚗️", defaultChecked: false, defaultQuantitySource: "one", suffix: "F" }
        ];
      }

      if (type.includes("prueba") || type.includes("bioquim") || type.includes("antibi")) {
        return [
          { id: "tubo", label: "Tubo de ensayo", icon: "🧪", defaultChecked: true, defaultQuantitySource: "calculated", suffix: "T" },
          { id: "frasco", label: "Matraz / Frasco", icon: "⚗️", defaultChecked: false, defaultQuantitySource: "one", suffix: "F" }
        ];
      }

      return [
        { id: "frasco", label: "Matraz / Frasco", icon: "⚗️", defaultChecked: true, defaultQuantitySource: "one", suffix: "F" }
      ];
    }

    function buildInitialLabelOptions(calc, savedLabel = null) {
      const preparationType = getPreparationType(calc);
      const calculatedQuantity = getCalculatedLabelQuantity(calc);
      const savedForm = savedLabel?.formulario || {};
      const savedOptions = Array.isArray(savedForm.labelOptions) ? savedForm.labelOptions : null;
      const savedMap = new Map();

      if (savedOptions) {
        savedOptions.forEach((option) => savedMap.set(normalizeLabelType(option.id), option));
      } else if (savedLabel || savedForm.tipoEtiqueta) {
        const oldType = normalizeLabelType(savedForm.tipoEtiqueta || savedLabel?.tipoEtiquetaKey || "auto");
        const resolvedType = oldType === "auto" ? getAutoLabelType(preparationType) : oldType;
        savedMap.set(resolvedType, {
          id: resolvedType,
          checked: true,
          quantity: savedForm.cantidadManual || savedLabel?.cantidadEtiquetas || calculatedQuantity
        });
      }

      const options = getAvailableLabelOptions(preparationType).map((option) => {
        const saved = savedMap.get(option.id);
        const defaultQuantity = option.defaultQuantitySource === "calculated" ? calculatedQuantity : 1;
        return {
          ...option,
          checked: saved ? Boolean(saved.checked) : savedMap.size ? false : option.defaultChecked,
          quantity: saved ? clampLabelCount(saved.quantity) : defaultQuantity
        };
      });

      if (!savedMap.size && !options.some((option) => option.checked) && options[0]) {
        options[0].checked = true;
      }

      return options;
    }

    function renderLabelOptionRow(option) {
      return `
        <div class="micro-label-option-row${option.checked ? " is-selected" : ""}" data-label-option-row="${escapeAttr(option.id)}" data-label="${escapeAttr(option.label)}" data-icon="${escapeAttr(option.icon)}" data-suffix="${escapeAttr(option.suffix)}">
          <label class="micro-label-option-check">
            <input type="checkbox" data-label-option value="${escapeAttr(option.id)}"${option.checked ? " checked" : ""} />
            <span class="micro-label-option-box"></span>
            <i>${option.icon}</i>
            <strong>${escapeHtml(option.label)}</strong>
          </label>
          <label class="micro-label-option-quantity">
            <span>Cantidad</span>
            <input class="sv-input" type="number" min="1" max="999" step="1" data-label-quantity data-label-type="${escapeAttr(option.id)}" value="${escapeAttr(option.quantity)}" />
          </label>
        </div>
      `;
    }

    function getLabelOptionsFromForm() {
      return Array.from(root.querySelectorAll("[data-label-option-row]")).map((row) => {
        const id = normalizeLabelType(row.dataset.labelOptionRow);
        const quantityInput = row.querySelector("[data-label-quantity]");
        return {
          id,
          label: row.dataset.label || labelTypeName(id),
          icon: row.dataset.icon || "",
          suffix: row.dataset.suffix || getLabelCodeSuffix(id),
          checked: Boolean(row.querySelector("[data-label-option]")?.checked),
          quantity: clampLabelCount(quantityInput?.value || 1)
        };
      });
    }

    function getSelectedLabelOptions(options = []) {
      return (Array.isArray(options) ? options : [])
        .map((option) => {
          const id = normalizeLabelType(option.id);
          return {
            ...option,
            id,
            label: option.label || labelTypeName(id),
            suffix: option.suffix || getLabelCodeSuffix(id),
            quantity: clampLabelCount(option.quantity)
          };
        })
        .filter((option) => option.checked && option.id !== "auto");
    }

    function fallbackLabelOptions(calc, datosFormulario = {}) {
      const options = buildInitialLabelOptions(calc, null);
      const selectedType = normalizeLabelType(datosFormulario.tipoEtiqueta || "");
      if (!datosFormulario.tipoEtiqueta || selectedType === "auto") return options;

      return options.map((option) => ({
        ...option,
        checked: option.id === selectedType,
        quantity: option.id === selectedType ? clampLabelCount(datosFormulario.cantidadManual || 1) : option.quantity
      }));
    }

    function groupLabelsByType(labels) {
      const groups = new Map();
      labels.forEach((label) => {
        if (!groups.has(label.tipo)) {
          groups.set(label.tipo, { type: label.tipo, label: label.tipoEtiqueta, labels: [] });
        }
        groups.get(label.tipo).labels.push(label);
      });
      return Array.from(groups.values());
    }

    function renderLabelSelectionSummary(options = []) {
      const selected = getSelectedLabelOptions(options);
      if (!selected.length) return "";
      return `
        <div class="micro-label-selection-summary">
          <span>Incluye:</span>
          ${selected.map((option) => `<p>${escapeHtml(option.quantity)} etiqueta${option.quantity === 1 ? "" : "s"} para ${escapeHtml(option.label)}</p>`).join("")}
        </div>
      `;
    }

    function renderPrintableLabelSummary(options = []) {
      const selected = getSelectedLabelOptions(options);
      if (!selected.length) return "";
      return `
        <div class="micro-print-label-summary">
          ${selected.map((option) => `<p>${escapeHtml(option.quantity)} etiqueta${option.quantity === 1 ? "" : "s"} para ${escapeHtml(option.label)}</p>`).join("")}
        </div>
      `;
    }

    function actualizarEstadoOpcionesEtiqueta(options = []) {
      root.querySelectorAll("[data-label-option-row]").forEach((row) => {
        const checked = Boolean(row.querySelector("[data-label-option]")?.checked);
        row.classList.toggle("is-selected", checked);
      });

      const help = root.querySelector("#micro-label-type-help");
      if (!help) return;

      const selected = getSelectedLabelOptions(options);
      const base = getLabelOptionsHelp(getPreparationType(state.labelContext?.calc || {}));
      help.innerHTML = selected.length
        ? `${escapeHtml(base)} <strong>Seleccionado: ${selected.map((option) => `${option.quantity} ${option.label}`).join(" + ")}</strong>`
        : `${escapeHtml(base)} <strong>Selecciona al menos un tipo de etiqueta.</strong>`;
    }

    function getLabelOptionsHelp(preparationType) {
      const type = norm(preparationType);
      if (type.includes("agar")) {
        return "Sugerencia: en agares se suelen imprimir etiquetas para cajas Petri y, si lo necesitas, una etiqueta adicional para el matraz o frasco de preparacion.";
      }
      if (type.includes("caldo")) {
        return "Sugerencia: en caldos se suelen imprimir etiquetas para tubos de ensayo y, si lo necesitas, una etiqueta adicional para el frasco de preparacion.";
      }
      if (type.includes("prueba") || type.includes("bioquim")) {
        return "Sugerencia: en pruebas bioquimicas se suelen imprimir etiquetas para tubos de ensayo y, si lo necesitas, una etiqueta adicional para el frasco de preparacion.";
      }
      return "Sugerencia: imprime la etiqueta del frasco de preparacion y ajusta la cantidad si necesitas copias adicionales.";
    }

    function obtenerCantidadEtiquetas(calc, tipoEtiqueta, datosFormulario = {}) {
      if (datosFormulario.usarCantidadAutomatica === false) {
        return clampLabelCount(datosFormulario.cantidadManual);
      }
      return getCalculatedLabelQuantity(calc);
    }

    function resolveLabelType(value, calc) {
      return getResolvedLabelType(value, getPreparationType(calc));
    }

    function getAutoLabelType(preparationType) {
      const type = norm(preparationType);

      if (type.includes("agar")) return "petri";
      if (type.includes("caldo")) return "tubo";
      if (type.includes("prueba")) return "tubo";
      if (type.includes("bioquim")) return "tubo";
      if (type.includes("antibi")) return "tubo";

      return "frasco";
    }

    function getResolvedLabelType(selectedLabelType, preparationType) {
      const selected = normalizeLabelType(selectedLabelType);
      if (selected === "auto") return getAutoLabelType(preparationType);
      return selected;
    }

    function getPreparationType(calc) {
      return getLabelSubject(calc).categoria || "";
    }

    function normalizeLabelType(value) {
      const type = String(value || "auto").toLowerCase();
      if (type === "matraz") return "frasco";
      return ["auto", "petri", "tubo", "frasco"].includes(type) ? type : "auto";
    }

    function getLabelCodeSuffix(resolvedLabelType) {
      const suffix = String(resolvedLabelType || "").toUpperCase();
      if (["P", "T", "F", "G"].includes(suffix)) return suffix;
      if (resolvedLabelType === "petri") return "P";
      if (resolvedLabelType === "tubo") return "T";
      if (resolvedLabelType === "frasco") return "F";
      return "G";
    }

    function getLabelSuffix(labelType) {
      return getLabelCodeSuffix(labelType);
    }

    function getCalculatedLabelQuantity(calc) {
      return clampLabelCount(calc?.count || 1);
    }

    function normalizeLabelQuantityInput(input) {
      if (!input) return;
      const parsed = Number(input.value);
      if (!Number.isFinite(parsed) || parsed < 1) {
        input.value = "1";
        return;
      }
      input.value = String(clampLabelCount(parsed));
    }

    function getLabelSubject(calc) {
      const useOrigin = calc.origin && calc.originPane === "pruebas" && calc.origin.id !== calc.target.id;
      const pane = useOrigin ? calc.originPane : calc.targetPane;
      const item = useOrigin ? calc.origin : calc.target;
      return {
        pane,
        nombre: printableName(item, pane),
        categoria: labelCategory(pane)
      };
    }

    function labelCategory(pane) {
      if (pane === "agares") return "AGAR";
      if (pane === "caldos") return "CALDO";
      if (pane === "pruebas") return "PRUEBA BIOQUIMICA";
      return "MICROBIOLOGIA";
    }

    function labelTypeName(type) {
      const names = {
        petri: "Caja Petri",
        tubo: "Tubo de ensayo",
        frasco: "Matraz / Frasco"
      };
      return names[type] || "Etiqueta";
    }

    function labelSequence(type, index, total) {
      return `${getCounterLabel(type)} ${index}/${total}`;
    }

    function getCounterLabel(labelType) {
      if (labelType === "petri") return "Placa";
      if (labelType === "tubo") return "Tubo";
      if (labelType === "frasco") return "Frasco";
      return "Etiqueta";
    }

    function buildLabelObservations(calc, type, userNotes) {
      const notes = [];
      if (type === "frasco" && Number(calc.totalMl) > 200) {
        notes.push("Dividir la preparacion en otro envase.");
      }
      if (userNotes) notes.push(userNotes);
      return notes;
    }

    function serializeCalcSnapshot(calc) {
      return {
        targetPane: calc.targetPane,
        targetId: calc.target?.id || "",
        target: {
          id: calc.target?.id || "",
          nombre: calc.target?.nombre || "",
          objetivo: calc.target?.objetivo || "",
          phFinal: calc.target?.phFinal || "",
          gramosPorLitro: calc.target?.gramosPorLitro || 0,
          preparacion: calc.target?.preparacion || {},
          composicion: calc.target?.composicion || [],
          notasLab: calc.target?.notasLab || "",
          observaciones: calc.target?.observaciones || "",
          riesgosBiologicos: calc.target?.riesgosBiologicos || []
        },
        originPane: calc.originPane || calc.targetPane,
        originId: calc.origin?.id || "",
        origin: calc.origin ? {
          id: calc.origin.id,
          nombre: calc.origin.nombre,
          nombreCientifico: calc.origin.nombreCientifico
        } : null,
        profileText: calc.profileText,
        count: calc.count,
        perUnit: calc.perUnit,
        totalMl: calc.totalMl,
        grams: calc.grams,
        totalWithMargin: calc.totalWithMargin,
        gramsWithMargin: calc.gramsWithMargin,
        marginPercent: calc.marginPercent
      };
    }

    function restoreCalcSnapshot(value) {
      const stored = value || {};
      const target = stored.target || findItem(stored.targetPane, stored.targetId);
      const origin = stored.origin || (stored.originPane && stored.originId ? findItem(stored.originPane, stored.originId) : null);
      return {
        target: target || { nombre: "Preparacion guardada", gramosPorLitro: 0, preparacion: {} },
        targetPane: stored.targetPane || "agares",
        origin,
        originPane: stored.originPane || stored.targetPane || "agares",
        profileText: stored.profileText || "",
        count: Number(stored.count) || 1,
        perUnit: Number(stored.perUnit) || 0,
        totalMl: Number(stored.totalMl) || 0,
        grams: Number(stored.grams) || 0,
        totalWithMargin: Number(stored.totalWithMargin) || Number(stored.totalMl || 0) * 1.1,
        gramsWithMargin: Number(stored.gramsWithMargin) || 0,
        marginPercent: Number(stored.marginPercent) || 10
      };
    }

    function formFromSavedEtiqueta(etiqueta) {
      const form = {
        responsable: etiqueta.responsable || "",
        paralelo: etiqueta.paralelo || "",
        observaciones: etiqueta.observaciones || "",
        tipoEtiqueta: normalizeLabelType(etiqueta.formulario?.tipoEtiqueta || etiqueta.tipoEtiquetaKey || "auto"),
        usarCantidadAutomatica: false,
        cantidadManual: etiqueta.cantidadEtiquetas || 1,
        lote: etiqueta.lote || ""
      };
      if (Array.isArray(etiqueta.formulario?.labelOptions)) {
        form.labelOptions = etiqueta.formulario.labelOptions;
      }
      return form;
    }

    function getRememberedMicroUser() {
      return {
        responsable: readLocalValue(microStorage.responsable),
        paralelo: readLocalValue(microStorage.paralelo)
      };
    }

    function saveRememberedMicroUser(data) {
      writeLocalValue(microStorage.responsable, data.responsable || "");
      writeLocalValue(microStorage.paralelo, data.paralelo || "");
    }

    function generarLoteMicro() {
      const saved = obtenerGuardadosMicrobiologia();
      const number = saved.preparaciones.length + saved.etiquetas.length + 1;
      return `SV-MIC-${new Date().getFullYear()}-${String(number).padStart(3, "0")}`;
    }

    function uniqueMicroId(prefix) {
      return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    function formatDateOnly(date) {
      return new Intl.DateTimeFormat("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);
    }

    function clampLabelCount(value) {
      const n = Math.floor(Number(value));
      if (!Number.isFinite(n) || n < 1) return 1;
      return Math.min(n, 999);
    }

    function readStorageArray(key) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function writeStorageArray(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        toast("No se pudo guardar localmente. Revisa el almacenamiento del navegador.");
      }
    }

    function readLocalValue(key) {
      try {
        return localStorage.getItem(key) || "";
      } catch {
        return "";
      }
    }

    function writeLocalValue(key, value) {
      try {
        localStorage.setItem(key, value || "");
      } catch {
        // localStorage puede estar bloqueado en navegadores con restricciones.
      }
    }

    function renderPrintablePreparation(calc) {
      const target = calc.target;
      const category = calc.targetPane === "agares" ? "AGAR" : "CALDO";
      const originLabel = calc.origin && calc.origin.id !== target.id
        ? `${paneById[calc.originPane]?.label || "Origen"}: ${printableName(calc.origin, calc.originPane)}`
        : "Preparación directa";

      return `
        ${printHeader(`Preparación de ${category.toLowerCase()}`, target.nombre)}
        <section class="micro-print-section">
          <h2>Identificación</h2>
          ${printRows([
            ["Nombre", target.nombre],
            ["Categoría", category],
            ["Contexto", originLabel],
            ["Uso principal", target.objetivo],
            ["pH final", target.phFinal],
            ["Dosis estándar", `${formatNumber(target.gramosPorLitro)} g/L`]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Cantidades calculadas</h2>
          ${printRows([
            ["Perfil elegido", calc.profileText],
            ["Unidades solicitadas", calc.count],
            ["Volumen por unidad", `${formatNumber(calc.perUnit)} mL`],
            ["Volumen total", `${formatNumber(calc.totalMl)} mL`],
            ["Masa exacta", `${formatNumber(calc.grams, 3)} g`],
            ["Agua destilada", `${formatNumber(calc.totalMl)} mL`],
            [`Volumen con ${calc.marginPercent}% extra`, `${formatNumber(calc.totalWithMargin)} mL`],
            [`Masa con ${calc.marginPercent}% extra`, `${formatNumber(calc.gramsWithMargin, 3)} g`]
          ])}
          <p class="micro-print-muted">El margen extra es una recomendación operativa para pérdidas por calentamiento, trasvase o servido; ajustar según protocolo interno.</p>
          ${target.preparacion?.noAutoclave ? `<div class="micro-print-alert">NO AUTOCLAVAR ESTE MEDIO</div>` : ""}
        </section>
        <section class="micro-print-section">
          <h2>Procedimiento paso a paso</h2>
          ${printOrderedList(target.preparacion?.pasos)}
        </section>
        <section class="micro-print-section">
          <h2>Condiciones de preparación</h2>
          ${printRows([
            ["Esterilización", target.preparacion?.esterilizacion],
            ["Temperatura recomendada", target.preparacion?.temperatura],
            ["Advertencia térmica", target.preparacion?.noAutoclave ? "No autoclave; consultar ficha técnica oficial del fabricante." : "Autoclavar solo si el protocolo del fabricante lo indica."]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Composición o base de preparación</h2>
          ${compositionTable(target.composicion, true) || printParagraph("Consultar ficha técnica oficial del fabricante.")}
        </section>
        <section class="micro-print-section">
          <h2>Observaciones y bioseguridad</h2>
          ${printParagraph(target.notasLab || target.observaciones || "Información pendiente de validar.")}
          ${printList(target.riesgosBiologicos)}
        </section>
        <section class="micro-print-section">
          <h2>Fuente bibliográfica o técnica</h2>
          ${printList(sourceList(target, calc.targetPane))}
        </section>
        <section class="micro-print-section micro-print-notes">
          <h2>Notas de campo</h2>
          <div><span>Preparado por</span><i></i></div>
          <div><span>Lote</span><i></i></div>
          <div><span>Contaminación detectada</span><i></i></div>
          <div><span>Fecha de vencimiento</span><i></i></div>
        </section>
      `;
    }

    function renderPrintableFicha(item, pane) {
      if (pane === "antibioticos") return renderAntibioticPassport(item);
      if (pane === "microorganismos") return renderMicroorganismPassport(item);
      if (pane === "pruebas") return renderTestSheet(item);
      return renderMediaSheet(item, pane);
    }

    function renderMediaSheet(item, pane) {
      const category = paneById[pane]?.badge || "MEDIO";
      const rel = getRelations(item, pane);
      return `
        ${printHeader(`Ficha técnica ${category.toLowerCase()}`, item.nombre)}
        <section class="micro-print-section">
          <h2>Identificación</h2>
          ${printRows([
            ["Nombre", item.nombre],
            ["Categoría", category],
            ["Nombre alternativo", item.alternativo],
            ["Tipos", item.tipos],
            ["Uso veterinario/microbiológico", item.objetivo],
            ["pH final", item.phFinal],
            ["Dosis estándar", item.gramosPorLitro ? `${formatNumber(item.gramosPorLitro)} g/L` : ""]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Fundamento, interpretación y aplicaciones</h2>
          ${printRows([
            ["Fundamento / objetivo", item.objetivo],
            ["Interpretación", item.interpretacionVisual],
            ["Color o lectura esperada", item.colorColonias],
            ["Bacterias relacionadas", relationNames("microorganismos", rel.bacterias)],
            ["Pruebas relacionadas", relationNames("pruebas", rel.pruebas)]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Composición</h2>
          ${compositionTable(item.composicion, true) || printParagraph("Consultar ficha técnica oficial.")}
        </section>
        <section class="micro-print-section">
          <h2>Precauciones</h2>
          ${item.preparacion?.noAutoclave ? `<div class="micro-print-alert">NO AUTOCLAVAR ESTE MEDIO</div>` : ""}
          ${printRows([
            ["Esterilización", item.preparacion?.esterilizacion],
            ["Temperatura recomendada", item.preparacion?.temperatura],
            ["Observaciones", item.notasLab || item.observaciones]
          ])}
          ${printList(item.riesgosBiologicos)}
        </section>
        <section class="micro-print-section">
          <h2>Bibliografía o fuente confiable</h2>
          ${printList(sourceList(item, pane))}
        </section>
      `;
    }

    function renderTestSheet(item) {
      const rel = getRelations(item, "pruebas");
      return `
        ${printHeader("Ficha técnica prueba", item.nombre)}
        <section class="micro-print-section">
          <h2>Identificación</h2>
          ${printRows([
            ["Nombre", item.nombre],
            ["Categoría", "PRUEBA BIOQUÍMICA"],
            ["Nombre alternativo", item.alternativo],
            ["Tipos", item.tipos],
            ["Uso veterinario/microbiológico", item.utilidadDiagnostica]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Fundamento e interpretación</h2>
          ${printRows([
            ["Fundamento", item.fundamento],
            ["Principio bioquímico", item.principioBioquimico],
            ["Interpretación positiva", item.interpretacionPositiva],
            ["Interpretación negativa", item.interpretacionNegativa],
            ["Reactivos", item.reactivos]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Aplicaciones y precauciones</h2>
          ${printRows([
            ["Bacterias relacionadas", relationNames("microorganismos", rel.bacterias)],
            ["Medios relacionados", relationNames("agares", rel.agares).concat(relationNames("caldos", rel.caldos))],
            ["Pruebas complementarias", relationNames("pruebas", rel.pruebas)],
            ["Errores comunes", item.erroresComunes]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Bibliografía o fuente confiable</h2>
          ${printList(sourceList(item, "pruebas"))}
        </section>
      `;
    }

    function renderAntibioticPassport(item) {
      const rel = getRelations(item, "antibioticos");
      return `
        ${printHeader("Pasaporte del antibiótico", item.nombre)}
        <section class="micro-print-section">
          <h2>Identificación farmacológica</h2>
          ${printRows([
            ["Nombre del antibiótico", item.nombre],
            ["Grupo farmacológico", item.familia],
            ["Clasificación", item.tipoAccion],
            ["Sigla de disco", item.siglaDisco],
            ["Espectro de acción", item.espectro]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Mecanismo, uso y resistencia</h2>
          ${printRows([
            ["Mecanismo de acción", item.mecanismo],
            ["Uso veterinario", item.usoClinico],
            ["Interpretación", item.interpretacion],
            ["Resistencia antimicrobiana", item.resistencia],
            ["Observaciones clínicas", item.observaciones]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Perfil microbiológico</h2>
          ${printRows([
            ["Bacterias sensibles", relationNames("microorganismos", rel.bacterias)],
            ["Bacterias resistentes o con resistencia frecuente", relationNames("microorganismos", rel.resistentes)],
            ["Pruebas relacionadas", relationNames("pruebas", rel.pruebas)]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Precauciones</h2>
          ${printParagraph(item.observaciones || "Usar según cultivo, antibiograma y criterio veterinario.")}
        </section>
        <section class="micro-print-section">
          <h2>Bibliografía o fuente confiable</h2>
          ${printList(sourceList(item, "antibioticos"))}
        </section>
      `;
    }

    function renderMicroorganismPassport(item) {
      const rel = getRelations(item, "microorganismos");
      return `
        ${printHeader("Pasaporte del microorganismo", item.nombreCientifico)}
        <section class="micro-print-section">
          <h2>Identificación bacteriana</h2>
          ${printRows([
            ["Nombre de la bacteria", item.nombreCientifico],
            ["Clasificación Gram", item.gramTexto],
            ["Morfología", item.morfologiaKey],
            ["Tipo de agrupación", item.agrupacion || "Información pendiente de validar"],
            ["Familia", item.familia],
            ["Reservorio", item.reservorio],
            ["Zoonosis", item.zoonosis]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Imágenes de referencia</h2>
          <div class="micro-print-image-grid">
            <div class="micro-print-placeholder"><strong>Imagen en placa</strong><span>Morfología de colonia pendiente</span></div>
            <div class="micro-print-placeholder"><strong>Imagen microscópica</strong><span>Tinción Gram / microscopía pendiente</span></div>
          </div>
        </section>
        <section class="micro-print-section">
          <h2>Cultivo e identificación</h2>
          ${printRows([
            ["Medios de cultivo recomendados", relationNames("agares", rel.agares).concat(relationNames("caldos", rel.caldos))],
            ["Características de colonia", item.notasLab || "Información pendiente de validar"],
            ["Pruebas bioquímicas importantes", relationNames("pruebas", rel.pruebas)]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Importancia veterinaria</h2>
          ${printRows([
            ["Enfermedades asociadas en animales", item.importancia],
            ["Patogenicidad", item.patogenicidad],
            ["Sistemas afectados", item.sistemasClave],
            ["Toxinas / factores", item.toxinas],
            ["Observaciones clínicas", item.observacionesClinicas]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Bioseguridad y antimicrobianos</h2>
          ${printRows([
            ["Bioseguridad", item.zoonosis || "Manipular según nivel de bioseguridad del laboratorio."],
            ["Resistencias relevantes", item.resistencia],
            ["Antibióticos relacionados", relationNames("antibioticos", rel.antibioticos)]
          ])}
        </section>
        <section class="micro-print-section">
          <h2>Bibliografía o fuente confiable</h2>
          ${printList(sourceList(item, "microorganismos"))}
        </section>
      `;
    }

    function closeModals() {
      els.fichaModal.classList.remove("is-open");
      els.calcModal.classList.remove("is-open");
      els.labelModal.classList.remove("is-open");
      els.savedModal.classList.remove("is-open");
      state.labelContext = null;
    }

    function ensureGlobalPrintArea() {
      let area = document.getElementById("micro-print-area");
      if (!area) {
        area = document.createElement("div");
        area.id = "micro-print-area";
        document.body.appendChild(area);
      }
      area.classList.add("micro-print-area");
      area.setAttribute("aria-hidden", "true");
      return area;
    }

    function printDocument(title, html, options = {}) {
      if (!els.printArea) {
        toast("No se encontro la vista de impresion.");
        return;
      }

      const docClass = options.docClass ? ` ${escapeAttr(options.docClass)}` : "";
      state.printFavorite = options.favorite || null;
      const favoriteActive = state.printFavorite && window.SuiteVet?.Favorites?.isFavorite?.(state.printFavorite.id);
      const favoriteButton = state.printFavorite
        ? `<button class="sv-favorite-action micro-print-favorite-btn${favoriteActive ? " is-active" : ""}" type="button" data-micro-print-favorite aria-label="Guardar preparacion en favoritos" title="Favorito">&#9733;</button>`
        : "";
      closeModals();
      document.body.classList.add("micro-printing");
      els.printArea.classList.add("is-open");
      els.printArea.removeAttribute("aria-hidden");
      els.printArea.innerHTML = `
        <div class="micro-print-shell" role="dialog" aria-modal="true" aria-label="${escapeAttr(title)}">
          <div class="micro-print-toolbar no-print">
            <div>
              <span class="micro-kicker">Vista imprimible</span>
              <h3>${escapeHtml(title)}</h3>
              <p>Revisa el documento compacto y luego genera PDF o imprime desde tu dispositivo.</p>
            </div>
            <div class="micro-print-actions">
              <button class="sv-btn sv-btn-secondary" type="button" data-micro-print-close>Volver</button>
              ${favoriteButton}
              <button class="sv-btn sv-btn-primary" type="button" data-micro-print-now>Imprimir / PDF</button>
            </div>
          </div>
          <div class="micro-print-preview">
            <article class="micro-print-doc${docClass}">${html}</article>
          </div>
        </div>
      `;
      els.printArea.scrollTo({ top: 0, behavior: "auto" });
    }

    function closePrintView() {
      if (!els.printArea) return;
      window.removeEventListener("afterprint", closePrintView);
      document.body.classList.remove("micro-printing");
      els.printArea.classList.remove("is-open");
      els.printArea.setAttribute("aria-hidden", "true");
      els.printArea.innerHTML = "";
      state.printFavorite = null;
    }

    function runMicroPrint() {
      if (!els.printArea?.classList.contains("is-open")) return;
      window.addEventListener("afterprint", closePrintView, { once: true });
      window.print();
    }

    function printHeader(kind, title) {
      const now = new Date();
      return `
        <header class="micro-print-header">
          <div>
            <h1>SUITE VET</h1>
            <p>Módulo de Microbiología</p>
          </div>
          <div>
            <strong>${escapeHtml(kind)}</strong>
            <span>${escapeHtml(title)}</span>
            <small>${now.toLocaleDateString()} · ${now.toLocaleTimeString()}</small>
          </div>
        </header>
      `;
    }

    function registerGlobalSearch() {
      if (!window.SuiteVet?.registerSearch) return;
      window.SuiteVet.registerSearch("micro", (q) => {
        const results = [];
        panes.forEach((pane) => {
          data[pane.id].forEach((item) => {
            const title = pane.id === "microorganismos" ? item.nombreCientifico : item.nombre;
            if (norm(JSON.stringify(item)).includes(norm(q))) {
              results.push({
                title,
                subtitle: `${pane.icon} ${pane.label}`,
                moduleId: "micro",
                action: () => {
                  window.SuiteVet.showView("microbiologia");
                  switchPane(pane.id, item.id);
                }
              });
            }
          });
        });
        return results;
      });
    }

    function getRelations(item, pane) {
      if (pane === "agares" || pane === "caldos") {
        return {
          bacterias: item.relaciones?.bacterias || item.bacteriasObjetivoIds || [],
          agares: item.relaciones?.agares || [],
          caldos: item.relaciones?.caldos || [],
          pruebas: item.relaciones?.pruebas || [],
          antibioticos: item.relaciones?.antibioticos || []
        };
      }
      if (pane === "pruebas") {
        return {
          bacterias: item.bacteriasIds || [],
          agares: (item.mediosIds || []).filter((id) => indexes.agares[id]),
          caldos: (item.mediosIds || []).filter((id) => indexes.caldos[id]),
          pruebas: item.pruebasComplementariasIds || [],
          antibioticos: []
        };
      }
      if (pane === "antibioticos") {
        return {
          bacterias: item.bacteriasSensiblesIds || [],
          resistentes: item.bacteriasResistentesIds || [],
          agares: (item.mediosIds || []).filter((id) => indexes.agares[id]),
          caldos: (item.mediosIds || []).filter((id) => indexes.caldos[id]),
          pruebas: item.pruebasRelacionadasIds || [],
          antibioticos: []
        };
      }
      return {
        bacterias: [],
        agares: item.agaresIds || [],
        caldos: item.caldosIds || [],
        pruebas: item.pruebasIds || [],
        antibioticos: item.antibioticosIds || []
      };
    }

    function relationPreview(rel) {
      const chips = [];
      if (rel.bacterias?.length) chips.push(...rel.bacterias.slice(0, 2).map((id) => linkChip("microorganismos", id)));
      if (rel.agares?.length) chips.push(...rel.agares.slice(0, 1).map((id) => linkChip("agares", id)));
      if (rel.caldos?.length) chips.push(...rel.caldos.slice(0, 1).map((id) => linkChip("caldos", id)));
      if (rel.pruebas?.length) chips.push(...rel.pruebas.slice(0, 2).map((id) => linkChip("pruebas", id)));
      if (rel.antibioticos?.length) chips.push(...rel.antibioticos.slice(0, 2).map((id) => linkChip("antibioticos", id)));
      if (!chips.length) return "";
      return `<div class="micro-link-cloud">${chips.join("")}</div>`;
    }

    function relationSection(title, pane, ids, tone = "") {
      return `
        <section>
          <h5>${escapeHtml(title)}</h5>
          <div class="micro-link-cloud">
            ${ids.map((id) => linkChip(pane, id, tone)).join("")}
          </div>
        </section>
      `;
    }

    function linkChip(pane, id, tone = "") {
      const item = findItem(pane, id);
      if (!item) return "";
      const label = pane === "microorganismos" ? item.nombreCientifico : item.nombre;
      return `<button class="micro-link-chip ${tone ? `is-${tone}` : ""}" type="button" data-micro-jump data-pane="${pane}" data-id="${id}">${escapeHtml(label)}</button>`;
    }

    function detailBlock(title, text, wide = false) {
      if (!text || (Array.isArray(text) && text.length === 0)) return "";
      const content = Array.isArray(text) ? text.join(", ") : text;
      return `<div class="micro-detail ${wide ? "is-wide" : ""}"><span>${escapeHtml(title)}</span><p>${escapeHtml(content)}</p></div>`;
    }

    function listPanel(title, list) {
      if (!list || !list.length) return "";
      return `<div class="micro-panel"><h4>${escapeHtml(title)}</h4><ul>${list.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>`;
    }

    function compositionTable(list, print = false) {
      if (!list || !list.length) return "";
      return `
        <div class="${print ? "" : "micro-panel"}">
          ${print ? "" : "<h4>Composición por litro</h4>"}
          ${print ? "" : '<div class="sv-table-wrap">'}
            <table class="micro-table ${print ? "" : "sv-table"}">
              <thead><tr><th>Ingrediente</th><th>Cantidad</th></tr></thead>
              <tbody>${list.map((row) => `<tr><td>${escapeHtml(row.ingrediente)}</td><td>${escapeHtml(row.cantidad)}</td></tr>`).join("")}</tbody>
            </table>
          ${print ? "" : "</div>"}
        </div>
      `;
    }

    function printRelationList(rel) {
      const blocks = [
        ["Bacterias", "microorganismos", rel.bacterias],
        ["Bacterias resistentes", "microorganismos", rel.resistentes],
        ["Agares", "agares", rel.agares],
        ["Caldos", "caldos", rel.caldos],
        ["Pruebas", "pruebas", rel.pruebas],
        ["Antibióticos", "antibioticos", rel.antibioticos]
      ].filter(([, , ids]) => ids?.length);

      if (!blocks.length) return "<p>Sin relaciones registradas.</p>";
      return blocks.map(([title, pane, ids]) => `
        <h3>${title}</h3>
        <p>${ids.map((id) => escapeHtml(labelFor(pane, id))).join(" · ")}</p>
      `).join("");
    }

    function printRows(rows) {
      return `
        <table>
          <tbody>
            ${rows.map(([label, value]) => `
              <tr>
                <th>${escapeHtml(label)}</th>
                <td>${escapeHtml(valueText(value))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    function printOrderedList(list) {
      const values = Array.isArray(list) && list.length ? list : ["Consultar procedimiento validado por el laboratorio o ficha técnica oficial."];
      return `<ol>${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
    }

    function printList(list) {
      const values = Array.isArray(list) && list.length ? list : [valueText(list)];
      return `<ul class="micro-print-list">${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }

    function printParagraph(value) {
      return `<p>${escapeHtml(valueText(value))}</p>`;
    }

    function relationNames(pane, ids) {
      return (ids || []).map((id) => labelFor(pane, id)).filter(Boolean);
    }

    function printableName(item, pane) {
      if (!item) return "Información pendiente de validar";
      return pane === "microorganismos" ? item.nombreCientifico : item.nombre;
    }

    function sourceList(item, pane) {
      if (Array.isArray(item?.fuentes) && item.fuentes.length) return item.fuentes;
      if (pane === "agares" || pane === "caldos") {
        return [
          "Consultar ficha técnica oficial del fabricante del medio utilizado y el lote vigente.",
          "Manual de microbiología de laboratorio validado por la institución."
        ];
      }
      if (pane === "pruebas") {
        return [
          "Manual de pruebas bioquímicas del laboratorio o protocolo institucional validado.",
          "ASM / manuales reconocidos de identificación bacteriana; confirmar con ficha del reactivo usado."
        ];
      }
      if (pane === "antibioticos") {
        return [
          "CLSI VET01/VET08 o norma veterinaria vigente para interpretación de sensibilidad.",
          "Ficha técnica del antimicrobiano y criterio clínico veterinario local."
        ];
      }
      return [
        "Manual de microbiología veterinaria y protocolos institucionales de bioseguridad.",
        "WOAH, CDC, Merck Veterinary Manual o fuente técnica vigente según microorganismo."
      ];
    }

    function valueText(value) {
      if (Array.isArray(value)) return value.length ? value.join(", ") : "Información pendiente de validar";
      if (value === 0) return "0";
      return value ? String(value) : "Información pendiente de validar";
    }

    function quick(label, value) {
      return `<div class="micro-quick"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
    }

    function tag(value) {
      if (!value) return "";
      return `<span class="micro-tag">${escapeHtml(String(value).replace(/-/g, " "))}</span>`;
    }

    function findItem(pane, id) {
      return indexes[pane]?.[id] || null;
    }

    function labelFor(pane, id) {
      const item = findItem(pane, id);
      if (!item) return id;
      return pane === "microorganismos" ? item.nombreCientifico : item.nombre;
    }

    function getPrimaryOptions(pane) {
      if (pane === "antibioticos") {
        return [{ value: "", label: "Todas las familias" }, ...uniqueOptions(data.antibioticos.map((a) => [a.familiaKey, a.familia]))];
      }
      if (pane === "microorganismos") {
        return [{ value: "", label: "Gram: todos" }, { value: "grampositivo", label: "Gram positivo" }, { value: "gramnegativo", label: "Gram negativo" }];
      }
      return [{ value: "", label: "Todos los tipos" }, ...uniqueOptions(data[pane].flatMap((i) => (i.tipos || []).map((t) => [norm(t), t])))];
    }

    function getSecondaryOptions(pane) {
      if (pane === "antibioticos") {
        return [{ value: "", label: "Todo el espectro" }, ...uniqueOptions(data.antibioticos.map((a) => [a.espectroKey, a.espectroKey]))];
      }
      if (pane === "microorganismos") {
        return [{ value: "", label: "Todos los sistemas" }, ...uniqueOptions(data.microorganismos.flatMap((m) => (m.sistemasClave || []).map((s) => [s, s])))];
      }
      const relBacteriaIds = data[pane].flatMap((item) => getRelations(item, pane).bacterias || []);
      return [{ value: "", label: "Todas las bacterias" }, ...uniqueOptions(relBacteriaIds.map((id) => [id, labelFor("microorganismos", id)]))];
    }

    function primaryValueMatch(pane, item, value) {
      if (pane === "antibioticos") return item.familiaKey === value;
      if (pane === "microorganismos") return item.gramKey === value;
      return (item.tipos || []).some((t) => norm(t) === value);
    }

    function secondaryValueMatch(pane, item, value) {
      if (pane === "antibioticos") return item.espectroKey === value;
      if (pane === "microorganismos") return (item.sistemasClave || []).includes(value);
      return (getRelations(item, pane).bacterias || []).includes(value);
    }

    function uniqueOptions(pairs) {
      const seen = new Set();
      return pairs
        .filter(([value]) => value)
        .filter(([value]) => {
          if (seen.has(value)) return false;
          seen.add(value);
          return true;
        })
        .map(([value, label]) => ({ value, label: String(label).replace(/-/g, " ") }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    function contextText(pane) {
      const map = {
        agares: "Cada agar funciona como puerta de entrada hacia bacterias, caldos, pruebas y antibióticos.",
        caldos: "Los caldos conectan preenriquecimiento, recuperación e identificación.",
        pruebas: "Las pruebas bioquímicas enlazan interpretación clínica con medios y bacterias.",
        antibioticos: "Cada antibiótico muestra sensibilidad, resistencia y medio de antibiograma.",
        microorganismos: "El atlas reúne medio recomendado, pruebas, resistencias y antibióticos por bacteria."
      };
      return map[pane] || "";
    }

    function formatNumber(value, decimals = 2) {
      const n = Number(value);
      if (!Number.isFinite(n)) return "0";
      return n % 1 === 0 ? String(n) : n.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
    }

    function norm(value) {
      return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function slugText(value) {
      return norm(value)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "favorito";
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

    function toast(message) {
      const old = document.getElementById("sv-toast");
      if (old) old.remove();
      const el = document.createElement("div");
      el.id = "sv-toast";
      el.className = "sv-toast sv-fade-in";
      el.textContent = message;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2600);
    }
  });
})();
