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
      calcOrigin: null
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
        <div class="micro-modal-actions">
          <button class="sv-btn sv-btn-secondary" type="button" data-micro-ficha data-pane="${origin.pane}" data-id="${origin.id}">Ficha técnica</button>
          <button class="sv-btn sv-btn-primary" type="button" data-micro-print-prep>Imprimir preparación</button>
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
      printDocument(title, renderPrintableFicha(item, pane));
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
    }

    function printDocument(title, html) {
      const documentHtml = buildMicroPrintDocument(title, html);
      const printWindow = window.open("", "_blank", "width=980,height=1200");

      if (printWindow?.document) {
        writeAndPrint(printWindow, documentHtml, () => {
          try { printWindow.close(); } catch (_) {}
        });
        return;
      }

      printDocumentInFrame(title, documentHtml);
    }

    function printDocumentInFrame(title, documentHtml) {
      const frame = document.createElement("iframe");
      frame.title = title;
      frame.setAttribute("aria-hidden", "true");
      frame.style.position = "fixed";
      frame.style.left = "-10000px";
      frame.style.top = "0";
      frame.style.width = "210mm";
      frame.style.height = "297mm";
      frame.style.border = "0";
      frame.style.opacity = "0";
      frame.style.pointerEvents = "none";

      document.body.appendChild(frame);
      const frameWindow = frame.contentWindow;
      const frameDocument = frame.contentDocument || frameWindow?.document;
      if (!frameWindow || !frameDocument) {
        frame.remove();
        toast("No se pudo abrir la vista de impresión.");
        return;
      }

      writeAndPrint(frameWindow, documentHtml, () => setTimeout(() => frame.remove(), 250));
    }

    function writeAndPrint(targetWindow, documentHtml, cleanupAfterPrint) {
      let printed = false;
      let cleanupTimer = null;

      const cleanup = () => {
        clearTimeout(cleanupTimer);
        targetWindow.removeEventListener("afterprint", cleanup);
        cleanupAfterPrint();
      };

      const startPrint = () => {
        if (printed) return;
        printed = true;
        targetWindow.focus();
        targetWindow.print();
      };

      const targetDocument = targetWindow.document;
      targetDocument.open();
      targetDocument.write(documentHtml);
      targetDocument.close();
      targetWindow.addEventListener("afterprint", cleanup, { once: true });
      targetWindow.onload = () => setTimeout(startPrint, 80);
      cleanupTimer = setTimeout(cleanup, 120000);
      setTimeout(startPrint, 220);
    }

    function buildMicroPrintDocument(title, html) {
      return `
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${escapeHtml(title)}</title>
            <style>${microPrintStyles()}</style>
          </head>
          <body>
            <article class="micro-print-doc">${html}</article>
          </body>
        </html>
      `;
    }

    function microPrintStyles() {
      return `
        @page { margin: 12mm; size: A4 portrait; }
        * { box-sizing: border-box; }
        html, body { background: #ffffff; color: #0f172a; margin: 0; padding: 0; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.45; }
        .micro-print-doc { background: #ffffff; color: #0f172a; margin: 0 auto; max-width: 190mm; padding: 0; }
        .micro-print-header { align-items: flex-start; border-bottom: 3px solid #0f766e; display: flex; gap: 12mm; justify-content: space-between; margin-bottom: 9mm; padding-bottom: 5mm; }
        .micro-print-header h1 { color: #0f766e; font-family: Georgia, "Times New Roman", serif; font-size: 27px; line-height: 1; margin: 0 0 2mm; }
        .micro-print-header p, .micro-print-header small, .micro-print-header span { color: #475569; display: block; margin: 0; }
        .micro-print-header strong { color: #0f172a; display: block; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
        .micro-print-section { break-inside: avoid; margin-bottom: 7mm; page-break-inside: avoid; }
        .micro-print-section h2 { border-bottom: 1px solid #cbd5e1; color: #0f172a; font-size: 15px; margin: 0 0 3mm; padding-bottom: 1.5mm; }
        .micro-print-section h3 { color: #0f766e; font-size: 13px; margin: 4mm 0 1mm; }
        .micro-print-section p { color: #0f172a; margin: 2mm 0; }
        table, .micro-table { border-collapse: collapse; width: 100%; }
        th, td, .micro-table th, .micro-table td { border: 1px solid #cbd5e1; color: #0f172a; font-size: 11.5px; padding: 6px 8px; text-align: left; vertical-align: top; }
        th, .micro-table th { background: #f1f5f9; color: #334155; font-weight: 700; width: 34%; }
        ol { margin: 0; padding-left: 18px; }
        ol li { margin: 1.6mm 0; }
        .micro-print-alert { background: #fee2e2; border: 1px solid #ef4444; color: #991b1b; font-weight: 700; margin-top: 3mm; padding: 8px 10px; }
        .micro-print-muted { color: #64748b; font-size: 11px; margin-top: 7px; }
        .micro-print-list { margin: 2mm 0 0; padding-left: 18px; }
        .micro-print-list li { color: #0f172a; font-size: 11.5px; margin: 1.5mm 0; }
        .micro-print-image-grid { display: grid; gap: 7mm; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .micro-print-placeholder { align-items: center; border: 1px dashed #94a3b8; color: #475569; display: flex; flex-direction: column; gap: 3mm; justify-content: center; min-height: 50mm; text-align: center; }
        .micro-print-placeholder strong { color: #0f172a; font-size: 12px; text-transform: uppercase; }
        .micro-print-notes div { align-items: center; display: flex; gap: 10px; margin: 6mm 0; }
        .micro-print-notes span { color: #475569; min-width: 145px; }
        .micro-print-notes i { border-bottom: 1px solid #0f172a; flex: 1; height: 1px; }
        @media print { html, body { width: 210mm; } .micro-print-doc { max-width: none; } }
      `;
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
