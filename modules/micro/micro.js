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
      labelContext: null
    };

    const microStorage = {
      responsable: "suitevet_micro_responsable",
      paralelo: "suitevet_micro_paralelo",
      preparaciones: "suitevet_micro_preparaciones",
      etiquetas: "suitevet_micro_etiquetas",
      guardados: "suitevet_micro_guardados"
    };

    root.innerHTML = `
      <section class="micro-shell">
        <header class="micro-hero">
          <div>
            <span class="micro-kicker">SUITE VET / FITBET 2.2</span>
            <h2>Microbiología</h2>
            <p class="sv-view-intro">
              Atlas microbiológico, calculadora de laboratorio y biblioteca diagnóstica conectada.
            </p>
          </div>
        </header>

        <div class="micro-subnav" id="micro-subnav">
          ${panes.map((p) => `
            <button class="micro-tab ${p.id === state.pane ? "is-active" : ""}" data-pane="${p.id}" type="button">
              <span>${p.icon}</span>
              <strong>${p.label}</strong>
              <b>${data[p.id]?.length || 0}</b>
            </button>
          `).join("")}
        </div>

        <div class="micro-toolbar">
          <input id="micro-search" class="sv-input" type="text" placeholder="Buscar en el ecosistema microbiológico..." autocomplete="off" />
          <select id="micro-filter-primary" class="sv-select"></select>
          <select id="micro-filter-secondary" class="sv-select"></select>
        </div>

        <div id="micro-context" class="micro-context"></div>
        <div id="micro-content" class="micro-grid"></div>
      </section>

      <div id="micro-ficha-modal" class="micro-modal-overlay">
        <div class="micro-modal">
          <div id="micro-ficha-content"></div>
        </div>
      </div>

      <div id="micro-calc-modal" class="micro-modal-overlay">
        <div class="micro-modal micro-modal-calc">
          <div id="micro-calc-content"></div>
        </div>
      </div>

      <div id="micro-label-modal" class="micro-modal-overlay">
        <div class="micro-modal micro-modal-label">
          <div id="micro-label-content"></div>
        </div>
      </div>

      <div id="micro-saved-modal" class="micro-modal-overlay">
        <div class="micro-modal micro-modal-saved">
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
      }
    });

    els.calcContent.addEventListener("input", updateCalcResult);
    els.calcContent.addEventListener("change", updateCalcResult);
    els.labelContent.addEventListener("input", actualizarVistaPreviaEtiqueta);
    els.labelContent.addEventListener("change", actualizarVistaPreviaEtiqueta);

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

    function renderMediaCard(item, pane) {
      const meta = paneById[pane];
      const rel = getRelations(item, pane);
      return `
        <article class="micro-card micro-card-${meta.singular} sv-fade-in" data-micro-card="${item.id}">
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
        <article class="micro-card micro-card-prueba sv-fade-in" data-micro-card="${item.id}">
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
        <article class="micro-card micro-card-antibiotico sv-fade-in" data-micro-card="${item.id}">
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
        <article class="micro-card micro-card-microorganismo sv-fade-in" data-micro-card="${item.id}">
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
        renderPrintablePreparation(calc)
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
      const tipoInicial = savedForm.tipoEtiqueta || "auto";
      const tipoResuelto = resolveLabelType(tipoInicial, calc);
      const cantidadAutomatica = obtenerCantidadEtiquetas(calc, tipoResuelto, { usarCantidadAutomatica: true });
      const cantidadManual = savedForm.cantidadManual || savedLabel?.cantidadEtiquetas || cantidadAutomatica;
      const usarCantidadAutomatica = savedForm.usarCantidadAutomatica !== false;
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
            <label>
              <span>Tipo de etiqueta</span>
              <select id="micro-label-type" class="sv-select">
                <option value="auto"${tipoInicial === "auto" ? " selected" : ""}>Automatico segun el calculo actual</option>
                <option value="petri"${tipoInicial === "petri" ? " selected" : ""}>Caja Petri</option>
                <option value="tubo"${tipoInicial === "tubo" ? " selected" : ""}>Tubo de ensayo</option>
                <option value="matraz"${tipoInicial === "matraz" ? " selected" : ""}>Matraz</option>
              </select>
            </label>
            <label>
              <span>Lote / codigo de lote</span>
              <input id="micro-label-lote" class="sv-input" type="text" value="${escapeAttr(savedForm.lote || savedLabel?.lote || generarLoteMicro())}" placeholder="SV-MIC-2026-001" />
            </label>
            <div class="micro-check-row">
              <input id="micro-label-auto-count" type="checkbox"${usarCantidadAutomatica ? " checked" : ""} />
              <label for="micro-label-auto-count">Usar cantidad calculada automaticamente</label>
            </div>
            <label>
              <span>Cantidad de etiquetas</span>
              <input id="micro-label-count" class="sv-input" type="number" min="1" max="999" value="${escapeAttr(cantidadManual)}" />
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

    function actualizarVistaPreviaEtiqueta() {
      if (!state.labelContext) return;
      const calc = state.labelContext.calc;
      const form = obtenerDatosFormularioEtiqueta();
      const tipo = resolveLabelType(form.tipoEtiqueta, calc);
      const countInput = root.querySelector("#micro-label-count");
      const autoCount = root.querySelector("#micro-label-auto-count");
      const preview = root.querySelector("#micro-label-preview");
      const previewCount = root.querySelector("#micro-label-preview-count");

      if (countInput) {
        countInput.disabled = tipo === "matraz" || Boolean(autoCount?.checked);
        if (tipo === "matraz") countInput.value = "1";
        if (autoCount?.checked && tipo !== "matraz") {
          countInput.value = String(obtenerCantidadEtiquetas(calc, tipo, { usarCantidadAutomatica: true }));
        }
      }

      const labels = generarDatosEtiqueta(calc, obtenerDatosFormularioEtiqueta());
      const first = labels[0];
      if (!preview || !first) return;

      preview.innerHTML = `
        ${generarHTMLEtiqueta(first)}
        <p class="micro-label-preview-summary">
          Se generaran ${labels.length} etiqueta${labels.length === 1 ? "" : "s"} en hoja A4. Si no entran en una pagina, continuaran automaticamente en paginas adicionales.
        </p>
      `;
      if (previewCount) {
        previewCount.textContent = `${labels.length} etiqueta${labels.length === 1 ? "" : "s"}`;
      }
    }

    function obtenerDatosFormularioEtiqueta() {
      const responsable = root.querySelector("#micro-label-responsable")?.value.trim() || "";
      const paralelo = root.querySelector("#micro-label-paralelo")?.value.trim() || "";
      const observaciones = root.querySelector("#micro-label-observaciones")?.value.trim() || "";
      const tipoEtiqueta = root.querySelector("#micro-label-type")?.value || "auto";
      const usarCantidadAutomatica = Boolean(root.querySelector("#micro-label-auto-count")?.checked);
      const cantidadManual = clampLabelCount(root.querySelector("#micro-label-count")?.value || 1);
      const lote = root.querySelector("#micro-label-lote")?.value.trim() || "";

      saveRememberedMicroUser({ responsable, paralelo });
      return {
        responsable,
        paralelo,
        observaciones,
        tipoEtiqueta,
        usarCantidadAutomatica,
        cantidadManual,
        lote
      };
    }

    function ejecutarAccionEtiqueta(action) {
      if (!state.labelContext) return;
      const calc = state.labelContext.calc;
      const form = obtenerDatosFormularioEtiqueta();

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
      const subject = getLabelSubject(calc);
      printDocument(
        `Etiquetas de ${subject.nombre}`,
        generarHojaEtiquetas(calc, datosFormulario),
        { docClass: "is-label-sheet" }
      );
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
        tipoEtiqueta: labelTypeName(labels[0].tipo),
        tipoEtiquetaKey: labels[0].tipo,
        cantidadEtiquetas: labels.length,
        responsable: datosFormulario.responsable || "",
        paralelo: datosFormulario.paralelo || "",
        observaciones: datosFormulario.observaciones || "",
        codigos: labels.map((label) => label.codigo),
        formulario: { ...datosFormulario, tipoEtiqueta: labels[0].tipo },
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
        printDocument(`Preparacion guardada: ${prep.nombre}`, renderPrintablePreparation(calc));
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
      const tipo = labels[0]?.tipo || resolveLabelType(datosFormulario.tipoEtiqueta, calc);
      const header = options.includeHeader === false ? "" : printHeader("Etiquetas de laboratorio", subject.nombre);

      return `
        ${header}
        <section class="micro-print-section micro-label-print-section">
          <h2>Etiquetas de laboratorio para recortar</h2>
          <p class="micro-print-muted">Se generaran ${labels.length} etiqueta${labels.length === 1 ? "" : "s"} distribuidas automaticamente en hoja A4.</p>
          <div class="micro-label-sheet micro-label-sheet-${escapeAttr(tipo)}">
            ${labels.map((label) => generarHTMLEtiqueta(label)).join("")}
          </div>
        </section>
      `;
    }

    function generarDatosEtiqueta(calc, datosFormulario = {}) {
      const tipo = resolveLabelType(datosFormulario.tipoEtiqueta, calc);
      const cantidad = obtenerCantidadEtiquetas(calc, tipo, datosFormulario);
      const subject = getLabelSubject(calc);
      const fecha = formatDateOnly(new Date());
      const observaciones = buildLabelObservations(calc, tipo, datosFormulario.observaciones);

      return Array.from({ length: cantidad }, (_, index) => ({
        nombre: subject.nombre,
        categoria: subject.categoria,
        tipo,
        tipoEtiqueta: labelTypeName(tipo),
        fecha,
        responsable: datosFormulario.responsable || "",
        paralelo: datosFormulario.paralelo || "",
        lote: datosFormulario.lote || "",
        observaciones,
        modulo: "Microbiologia",
        app: "SUITE VET",
        indice: index + 1,
        total: cantidad,
        secuencia: labelSequence(tipo, index + 1, cantidad),
        codigo: generarCodigoEtiqueta(subject.nombre, tipo, index),
        volumenTotal: `${formatNumber(calc.totalMl)} mL`,
        volumenUnidad: `${formatNumber(calc.perUnit)} mL`
      }));
    }

    function generarHTMLEtiqueta(label) {
      const obs = label.observaciones?.length
        ? `<div class="micro-lab-label-obs"><span>Obs.</span>${label.observaciones.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>`
        : "";
      const lote = label.lote ? `<span>Lote: ${escapeHtml(label.lote)}</span>` : "";
      const volume = label.tipo === "matraz"
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
            <span>Fecha: ${escapeHtml(label.fecha)}</span>
            ${label.responsable ? `<span>Resp.: ${escapeHtml(label.responsable)}</span>` : ""}
            ${label.paralelo ? `<span>Paralelo: ${escapeHtml(label.paralelo)}</span>` : ""}
            <span>${escapeHtml(label.secuencia)}</span>
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
      const typeCode = { petri: "P", tubo: "T", matraz: "M" }[tipoEtiqueta] || "L";
      return `${initials.toUpperCase()}-${typeCode}-${String(index + 1).padStart(3, "0")}`;
    }

    function obtenerCantidadEtiquetas(calc, tipoEtiqueta, datosFormulario = {}) {
      if (tipoEtiqueta === "matraz") return 1;
      if (datosFormulario.usarCantidadAutomatica === false) {
        return clampLabelCount(datosFormulario.cantidadManual);
      }
      return clampLabelCount(calc.count || 1);
    }

    function resolveLabelType(value, calc) {
      if (["petri", "tubo", "matraz"].includes(value)) return value;
      const profile = norm(calc.profileText || "");
      if (profile.includes("tubo") || profile.includes("alicuota") || profile.includes("frasco")) return "tubo";
      if (calc.targetPane === "agares") return "petri";
      return "tubo";
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
        matraz: "Matraz"
      };
      return names[type] || "Etiqueta";
    }

    function labelSequence(type, index, total) {
      if (type === "petri") return `Placa ${index}/${total}`;
      if (type === "tubo") return `Tubo ${index}/${total}`;
      return "Matraz 1/1";
    }

    function buildLabelObservations(calc, type, userNotes) {
      const notes = [];
      if (type === "matraz" && Number(calc.totalMl) > 200) {
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
      return {
        responsable: etiqueta.responsable || "",
        paralelo: etiqueta.paralelo || "",
        observaciones: etiqueta.observaciones || "",
        tipoEtiqueta: etiqueta.tipoEtiquetaKey || "auto",
        usarCantidadAutomatica: false,
        cantidadManual: etiqueta.cantidadEtiquetas || 1,
        lote: etiqueta.lote || ""
      };
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
      closeModals();
      ensureMicroPrintOverride();
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
      document.body.classList.remove("micro-printing");
      els.printArea.classList.remove("is-open");
      els.printArea.setAttribute("aria-hidden", "true");
      els.printArea.innerHTML = "";
      removeMicroPrintOverride();
    }

    function runMicroPrint() {
      if (!els.printArea?.classList.contains("is-open")) return;
      window.print();
    }

    function ensureMicroPrintOverride() {
      let style = document.getElementById("micro-print-override");
      if (style) return;
      style = document.createElement("style");
      style.id = "micro-print-override";
      style.textContent = `
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          html, body, body.micro-printing { background: #fff !important; }
          body.micro-printing > *:not(#micro-print-area) { display: none !important; }
          body.micro-printing #micro-print-area,
          body.micro-printing #micro-print-area * { visibility: visible !important; }
          body.micro-printing #micro-print-area {
            background: #fff !important;
            display: block !important;
            inset: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            position: static !important;
            width: 100% !important;
          }
          body.micro-printing .micro-print-toolbar,
          body.micro-printing .micro-print-actions,
          body.micro-printing .no-print { display: none !important; }
          body.micro-printing .micro-print-shell,
          body.micro-printing .micro-print-preview {
            display: block !important;
            margin: 0 !important;
            max-width: none !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
          }
          body.micro-printing .micro-print-doc {
            background: #fff !important;
            box-shadow: none !important;
            column-count: 2 !important;
            column-gap: 10mm !important;
            color: #0f172a !important;
            display: block !important;
            font-size: 11pt !important;
            line-height: 1.35 !important;
            margin: 0 !important;
            min-height: auto !important;
            min-width: 0 !important;
            padding: 0 !important;
            width: auto !important;
          }
          body.micro-printing .micro-print-doc.is-antibiotic-passport {
            column-count: 1 !important;
            column-gap: 0 !important;
            font-size: 11pt !important;
          }
          body.micro-printing .micro-print-doc.is-label-sheet,
          body.micro-printing .micro-print-doc.is-prep-with-labels {
            column-count: 1 !important;
            column-gap: 0 !important;
          }
          body.micro-printing .micro-print-header {
            column-span: all;
            margin-bottom: 4mm !important;
            padding-bottom: 3mm !important;
          }
          body.micro-printing .micro-print-header h1 { font-size: 20pt !important; }
          body.micro-printing .micro-print-header p,
          body.micro-printing .micro-print-header span,
          body.micro-printing .micro-print-header small { font-size: 11pt !important; }
          body.micro-printing .micro-print-header strong { font-size: 11pt !important; }
          body.micro-printing .micro-print-section {
            break-inside: avoid;
            margin-bottom: 4mm !important;
            page-break-inside: avoid;
          }
          body.micro-printing .micro-print-section h2 {
            font-size: 12pt !important;
            margin: 0 0 1.8mm !important;
            padding-bottom: 1mm !important;
          }
          body.micro-printing .micro-print-section th,
          body.micro-printing .micro-print-section td,
          body.micro-printing .micro-print-section .micro-table th,
          body.micro-printing .micro-print-section .micro-table td {
            font-size: 11pt !important;
            padding: 3.5px 5px !important;
          }
          body.micro-printing .micro-print-list { margin-top: 1mm !important; padding-left: 13px !important; }
          body.micro-printing .micro-print-list li,
          body.micro-printing .micro-print-section ol li {
            font-size: 11pt !important;
            margin: 0.8mm 0 !important;
          }
          body.micro-printing .micro-print-muted { font-size: 11pt !important; margin-top: 1mm !important; }
          body.micro-printing .micro-print-alert { font-size: 11pt !important; margin-top: 1.5mm !important; padding: 5px 7px !important; }
          body.micro-printing .micro-print-placeholder { min-height: 32mm !important; }
          body.micro-printing .micro-print-notes div { margin: 3mm 0 !important; }
          body.micro-printing .micro-label-sheet {
            break-inside: auto !important;
            display: grid !important;
            page-break-inside: auto !important;
          }
          body.micro-printing .micro-label-sheet-petri { grid-template-columns: repeat(3, 58mm) !important; gap: 3mm !important; }
          body.micro-printing .micro-label-sheet-tubo { grid-template-columns: repeat(4, 43mm) !important; gap: 2.5mm !important; }
          body.micro-printing .micro-label-sheet-matraz { grid-template-columns: repeat(2, 80mm) !important; gap: 4mm !important; }
          body.micro-printing .micro-lab-label {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    function removeMicroPrintOverride() {
      document.getElementById("micro-print-override")?.remove();
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
          <table class="micro-table">
            <thead><tr><th>Ingrediente</th><th>Cantidad</th></tr></thead>
            <tbody>${list.map((row) => `<tr><td>${escapeHtml(row.ingrediente)}</td><td>${escapeHtml(row.cantidad)}</td></tr>`).join("")}</tbody>
          </table>
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
