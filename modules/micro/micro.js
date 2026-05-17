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
      calcTarget: null
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
          <div class="micro-stats">
            ${stat("Agares", data.agares.length)}
            ${stat("Caldos", data.caldos.length)}
            ${stat("Pruebas", data.pruebas.length)}
            ${stat("Antibióticos", data.antibioticos.length)}
            ${stat("Bacterias", data.microorganismos.length)}
          </div>
        </header>

        <div class="micro-subnav" id="micro-subnav">
          ${panes.map((p) => `
            <button class="micro-tab ${p.id === state.pane ? "is-active" : ""}" data-pane="${p.id}" type="button">
              <span>${p.icon}</span>${p.label}
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

      <div id="micro-print-area" class="micro-print-area"></div>
    `;

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
      printArea: root.querySelector("#micro-print-area")
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
      const close = e.target.closest("[data-micro-close]");
      if (close) {
        closeModals();
        return;
      }

      if (e.target === els.fichaModal || e.target === els.calcModal) {
        closeModals();
        return;
      }

      const ficha = e.target.closest("[data-micro-ficha]");
      if (ficha) {
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

      const printFicha = e.target.closest("[data-micro-print-ficha]");
      if (printFicha) {
        printFichaDoc(printFicha.dataset.pane, printFicha.dataset.id);
        return;
      }
    });

    els.calcContent.addEventListener("input", updateCalcResult);
    els.calcContent.addEventListener("change", updateCalcResult);

    renderFilters();
    render();
    registerGlobalSearch();

    function stat(label, value) {
      return `<div class="micro-stat"><strong>${value}</strong><span>${label}</span></div>`;
    }

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
            <button class="sv-btn sv-btn-primary" type="button" data-micro-calc data-pane="antibioticos" data-id="${item.id}">Calcular medio</button>
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
          ${pane !== "microorganismos" ? `<button class="sv-btn sv-btn-primary" type="button" data-micro-calc data-pane="${pane}" data-id="${item.id}">Calcular medio</button>` : ""}
          <button class="sv-btn sv-btn-secondary" type="button" data-micro-print-ficha data-pane="${pane}" data-id="${item.id}">
            ${pane === "antibioticos" ? "Pasaporte del antibiótico" : pane === "microorganismos" ? "Pasaporte del microorganismo" : "Imprimir ficha"}
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
      let targetPane = pane;
      let target = findItem(pane, id);
      if (!target) return;

      if (pane !== "agares" && pane !== "caldos") {
        const mediumId = (target.mediosIds || target.agaresIds || getRelations(target, pane).agares || [])[0];
        target = indexes.agares[mediumId] || indexes.caldos[mediumId];
        targetPane = indexes.agares[mediumId] ? "agares" : "caldos";
        if (!target) {
          toast("Este elemento no tiene un medio asociado para calcular.");
          return;
        }
      }

      state.calcTarget = { pane: targetPane, id: target.id };
      const isAgar = targetPane === "agares";
      const perfiles = isAgar
        ? D.perfilesPlaca || []
        : [{ id: "tubo10", label: "Tubo / alícuota", detalle: "10 mL", volumenMl: 10 }, { id: "frasco100", label: "Frasco pequeño", detalle: "100 mL", volumenMl: 100 }];

      els.calcContent.innerHTML = `
        <div class="micro-modal-head">
          <div>
            <span class="micro-kicker">CALCULADORA DE PREPARACIÓN</span>
            <h3>${escapeHtml(target.nombre)}</h3>
            <p>${formatNumber(target.gramosPorLitro)} g/L · pH ${escapeHtml(target.phFinal || "—")}</p>
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
          <label>
            <span>Volumen manual por unidad (mL)</span>
            <input class="sv-input" id="micro-calc-volume" type="number" min="1" step="0.1" />
          </label>
        </div>
        <div id="micro-calc-result" class="micro-calc-result-panel"></div>
        <div class="micro-modal-actions">
          <button class="sv-btn sv-btn-secondary" type="button" data-micro-ficha data-pane="${targetPane}" data-id="${target.id}">Ficha técnica</button>
          <button class="sv-btn sv-btn-primary" type="button" data-micro-print-prep>Imprimir preparación</button>
        </div>
      `;
      els.calcModal.classList.add("is-open");
      updateCalcResult();
    }

    function updateCalcResult() {
      if (!state.calcTarget) return;
      const target = findItem(state.calcTarget.pane, state.calcTarget.id);
      const profile = Number(root.querySelector("#micro-calc-profile")?.value || 0);
      const count = Number(root.querySelector("#micro-calc-count")?.value || 0);
      const custom = Number(root.querySelector("#micro-calc-volume")?.value || 0);
      const perUnit = custom > 0 ? custom : profile;
      const totalMl = Math.max(0, count * perUnit);
      const grams = target ? target.gramosPorLitro * totalMl / 1000 : 0;
      const result = root.querySelector("#micro-calc-result");
      if (!result || !target) return;

      result.innerHTML = `
        <div>${quick("Volumen total", `${formatNumber(totalMl)} mL`)}</div>
        <div>${quick("Masa a pesar", `${formatNumber(grams, 3)} g`)}</div>
        <div>${quick("Agua destilada", `${formatNumber(totalMl)} mL`)}</div>
        <div>${quick("Unidades", `${count || 0}`)}</div>
        ${target.preparacion?.noAutoclave ? `<div class="micro-alert">Alerta: este medio no debe autoclaverse.</div>` : ""}
      `;
    }

    function printPreparation() {
      const target = state.calcTarget && findItem(state.calcTarget.pane, state.calcTarget.id);
      if (!target) return;
      const profileText = root.querySelector("#micro-calc-profile")?.selectedOptions?.[0]?.textContent || "";
      const count = Number(root.querySelector("#micro-calc-count")?.value || 0);
      const profile = Number(root.querySelector("#micro-calc-profile")?.value || 0);
      const custom = Number(root.querySelector("#micro-calc-volume")?.value || 0);
      const perUnit = custom > 0 ? custom : profile;
      const totalMl = Math.max(0, count * perUnit);
      const grams = target.gramosPorLitro * totalMl / 1000;

      printDocument(
        `Preparación de ${target.nombre}`,
        `
          ${printHeader("Preparación de medio", target.nombre)}
          <section class="micro-print-section">
            <h2>Preparación</h2>
            <table>
              <tr><th>Volumen total</th><td>${formatNumber(totalMl)} mL</td></tr>
              <tr><th>Masa a pesar</th><td>${formatNumber(grams, 3)} g</td></tr>
              <tr><th>pH final</th><td>${escapeHtml(target.phFinal || "—")}</td></tr>
              <tr><th>Número estimado</th><td>${count}</td></tr>
              <tr><th>Tipo</th><td>${escapeHtml(profileText)}</td></tr>
            </table>
            ${target.preparacion?.noAutoclave ? `<div class="micro-print-alert">NO AUTOCLAVAR ESTE MEDIO</div>` : ""}
          </section>
          <section class="micro-print-section">
            <h2>Instrucciones paso a paso</h2>
            <ol>${(target.preparacion?.pasos || []).map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
          </section>
          <section class="micro-print-section">
            <h2>Composición por litro</h2>
            ${compositionTable(target.composicion, true)}
          </section>
          <section class="micro-print-section">
            <h2>Observaciones</h2>
            <p>${escapeHtml(target.notasLab || target.observaciones || "")}</p>
          </section>
          <section class="micro-print-section micro-print-notes">
            <h2>Notas de campo</h2>
            <div><span>Preparado por</span><i></i></div>
            <div><span>Lote</span><i></i></div>
            <div><span>Contaminación detectada</span><i></i></div>
            <div><span>Fecha de vencimiento</span><i></i></div>
          </section>
        `
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
      const rel = getRelations(item, pane);

      printDocument(title, `
        ${printHeader(paneById[pane].badge, pane === "microorganismos" ? item.nombreCientifico : item.nombre)}
        <section class="micro-print-section">
          <h2>Resumen técnico</h2>
          ${renderFichaMain(item, pane)}
        </section>
        <section class="micro-print-section">
          <h2>Conexiones del ecosistema</h2>
          ${printRelationList(rel)}
        </section>
      `);
    }

    function closeModals() {
      els.fichaModal.classList.remove("is-open");
      els.calcModal.classList.remove("is-open");
    }

    function printDocument(title, html) {
      const previousTitle = document.title;
      els.printArea.innerHTML = `<article class="micro-print-doc">${html}</article>`;
      document.body.classList.add("micro-printing");
      document.title = title;

      const cleanup = () => {
        document.body.classList.remove("micro-printing");
        els.printArea.innerHTML = "";
        document.title = previousTitle;
        window.removeEventListener("afterprint", cleanup);
      };

      window.addEventListener("afterprint", cleanup);
      window.print();
      setTimeout(cleanup, 2000);
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
