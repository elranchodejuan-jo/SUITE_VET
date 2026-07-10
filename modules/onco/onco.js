(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("onco-root");
    if (!root) return;

    const D = window.VETONCO_DATA || {};
    const Fav = window.SuiteVet?.Favorites || null;
    const printArea = ensurePrintArea();
    const state = {
      page: "inicio",
      selectedProtocolId: D.protocols?.[0]?.id || "",
      bsa: {
        species: D.bsa?.species?.[0]?.id || "perro",
        weight: "",
        doseMgM2: ""
      },
      protocolForms: {}
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleInput);
    printArea.addEventListener("click", handlePrintClick);
    window.addEventListener("afterprint", closePrint);

    render();
    registerSearch();

    function render() {
      root.innerHTML = `
        <section class="onco-shell sv-module-shell">
          ${renderHeader()}
          ${renderSubnav()}
          ${renderPage()}
        </section>
      `;
      Fav?.bindWithin(root);
    }

    function renderHeader() {
      return `
        <section class="sv-module-header onco-header">
          <p class="onco-kicker">${escapeHtml(D.appName || "VetOnco")}</p>
          <h2>${escapeHtml(D.title || "Oncologia Veterinaria")}</h2>
          <p class="sv-view-intro">${escapeHtml(D.subtitle || "")}</p>
          <div class="onco-header-meta">
            <span>${escapeHtml(D.sourceNote || "")}</span>
            <span>${protocols().length} protocolos base</span>
          </div>
        </section>
      `;
    }

    function renderSubnav() {
      const tabs = [
        { id: "inicio", label: "Inicio", icon: "ON" },
        { id: "protocolos", label: "Protocolos", icon: String(protocols().length) },
        { id: "superficie", label: "Superficie corporal", icon: "SC" },
        { id: "creditos", label: "Creditos", icon: "CR" }
      ];

      return `
        <div class="sv-module-subnav onco-tabs" aria-label="Secciones de VetOnco">
          ${tabs.map((tab) => `
            <button type="button" class="sv-module-tab ${state.page === tab.id ? "is-active" : ""}" data-onco-page="${tab.id}">
              <span>${escapeHtml(tab.icon)}</span>
              <strong>${escapeHtml(tab.label)}</strong>
            </button>
          `).join("")}
        </div>
      `;
    }

    function renderPage() {
      if (state.page === "protocolos") return renderProtocols();
      if (state.page === "superficie") return renderSurfaceCalculator();
      if (state.page === "creditos") return renderCredits();
      return renderHome();
    }

    function renderHome() {
      return `
        <section class="onco-home-grid">
          <article class="onco-card onco-hero-card">
            <h3>VetOnco dentro de SUITE VET</h3>
            <p>
              Modulo consultivo para organizar protocolos oncologicos, calcular superficie corporal
              e imprimir una hoja con peso, dosis ingresada y dosis total a aplicar.
            </p>
            <div class="onco-action-row">
              <button type="button" class="sv-btn sv-btn-primary" data-onco-page="protocolos">Abrir protocolos</button>
              <button type="button" class="sv-btn sv-btn-secondary" data-onco-page="superficie">Calcular SC</button>
            </div>
          </article>
          <article class="onco-card">
            <h3>Protocolos incluidos</h3>
            <div class="onco-chip-grid">
              ${protocols().map((item) => `
                <button type="button" class="onco-chip" data-onco-open-protocol="${escapeAttr(item.id)}">
                  ${escapeHtml(item.title)}
                </button>
              `).join("")}
            </div>
          </article>
          <article class="onco-card onco-warning">
            <h3>Uso responsable</h3>
            <p>${escapeHtml(D.bsa?.disclaimer || "")}</p>
          </article>
        </section>
      `;
    }

    function renderProtocols() {
      const selected = selectedProtocol();
      return `
        <section class="onco-protocol-layout">
          <div class="onco-protocol-list" aria-label="Protocolos oncologicos">
            ${protocols().map((item) => renderProtocolCard(item)).join("")}
          </div>
          <article class="onco-card onco-protocol-detail">
            ${selected ? renderProtocolDetail(selected) : renderEmptyState("Selecciona un protocolo para verlo.")}
          </article>
        </section>
      `;
    }

    function renderProtocolCard(item) {
      const favData = {
        id: `onco-${item.id}`,
        titulo: item.title,
        modulo: "Oncologia",
        submodulo: item.system,
        tipo: "Protocolo calculable",
        descripcion: item.summary
      };

      return `
        <article
          class="onco-protocol-card ${state.selectedProtocolId === item.id ? "is-active" : ""}"
          data-fav-id="${escapeAttr(favData.id)}"
          data-fav-title="${escapeAttr(favData.titulo)}"
          data-fav-module="${escapeAttr(favData.modulo)}"
          data-fav-submodule="${escapeAttr(favData.submodulo)}"
          data-fav-type="${escapeAttr(favData.tipo)}"
          data-fav-description="${escapeAttr(favData.descripcion)}">
          <button type="button" class="onco-protocol-main" data-onco-open-protocol="${escapeAttr(item.id)}">
            <span class="onco-protocol-system">${escapeHtml(item.system)}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.status || "Calculable")}</small>
          </button>
        </article>
      `;
    }

    function renderProtocolDetail(item) {
      const form = formFor(item);
      const calc = calculateProtocol(item);
      return `
        <div class="onco-detail-header">
          <span class="onco-badge">${escapeHtml(item.system)}</span>
          <span class="onco-badge onco-badge-soft">${escapeHtml(item.status || "Calculable")}</span>
        </div>
        <div class="onco-detail-title-row">
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
          </div>
          <button type="button" class="sv-btn sv-btn-primary" data-onco-print-protocol="${escapeAttr(item.id)}">
            Imprimir protocolo
          </button>
        </div>
        <div class="onco-section-grid">
          ${(D.protocolSections || []).map((section) => `
            <div class="onco-section-slot">
              <strong>${escapeHtml(section.label || section)}</strong>
              <span>${escapeHtml(sectionText(item, section.id || section))}</span>
            </div>
          `).join("")}
        </div>
        <section class="onco-protocol-calc">
          <div class="onco-protocol-form">
            <label class="onco-field">
              <span>Paciente</span>
              <input type="text" value="${escapeAttr(form.patient)}" data-onco-protocol-field="patient" placeholder="Nombre del paciente" />
            </label>
            <label class="onco-field">
              <span>Tutor</span>
              <input type="text" value="${escapeAttr(form.owner)}" data-onco-protocol-field="owner" placeholder="Opcional" />
            </label>
            <label class="onco-field">
              <span>Medico tratante</span>
              <input type="text" value="${escapeAttr(form.clinician)}" data-onco-protocol-field="clinician" placeholder="Opcional" />
            </label>
            <label class="onco-field">
              <span>Fecha</span>
              <input type="date" value="${escapeAttr(form.date)}" data-onco-protocol-field="date" />
            </label>
            <label class="onco-field">
              <span>Especie</span>
              <select data-onco-protocol-field="species">
                ${speciesOptions().map((species) => `
                  <option value="${escapeAttr(species.id)}" ${form.species === species.id ? "selected" : ""}>
                    ${escapeHtml(species.label)} (K=${formatNum(species.k, 1)})
                  </option>
                `).join("")}
              </select>
            </label>
            <label class="onco-field">
              <span>Peso (kg)</span>
              <input type="number" min="0" step="0.01" inputmode="decimal" value="${escapeAttr(form.weight)}" data-onco-protocol-field="weight" placeholder="Ej. 18.5" />
            </label>
          </div>
          <div class="onco-protocol-summary" data-onco-protocol-summary>
            ${renderProtocolSummary(calc)}
          </div>
        </section>
        <section class="onco-dose-panel">
          <div class="onco-dose-head">
            <h4>Dosis a aplicar</h4>
            <span>Completa dosis validada por tu protocolo. El total se calcula automaticamente.</span>
          </div>
          <div class="onco-dose-table">
            ${form.regimen.map((row) => renderDoseRow(row, calc)).join("")}
          </div>
        </section>
        <section class="onco-safety">
          <h4>Seguridad antes de aplicar</h4>
          <ul>
            ${(item.safety || []).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
          </ul>
          <p>${escapeHtml(D.bsa?.disclaimer || "")}</p>
        </section>
      `;
    }

    function renderDoseRow(row, calc) {
      const total = calculateDoseTotal(row, calc);
      return `
        <div class="onco-dose-row" data-onco-dose-row="${escapeAttr(row.id)}">
          <label class="onco-field">
            <span>Farmaco</span>
            <input type="text" value="${escapeAttr(row.drug)}" data-onco-dose-field="drug" data-onco-regimen-id="${escapeAttr(row.id)}" />
          </label>
          <label class="onco-field">
            <span>Dosis</span>
            <input type="number" min="0" step="0.01" inputmode="decimal" value="${escapeAttr(row.doseMgM2)}" data-onco-dose-field="doseMgM2" data-onco-regimen-id="${escapeAttr(row.id)}" placeholder="mg/m2 o mg/kg" />
          </label>
          <label class="onco-field">
            <span>Unidad</span>
            <select data-onco-dose-field="unit" data-onco-regimen-id="${escapeAttr(row.id)}">
              <option value="mg/m2" ${row.unit === "mg/m2" ? "selected" : ""}>mg/m2</option>
              <option value="mg/kg" ${row.unit === "mg/kg" ? "selected" : ""}>mg/kg</option>
            </select>
          </label>
          <label class="onco-field">
            <span>Via</span>
            <input type="text" value="${escapeAttr(row.route)}" data-onco-dose-field="route" data-onco-regimen-id="${escapeAttr(row.id)}" placeholder="IV, VO, SC..." />
          </label>
          <label class="onco-field">
            <span>Intervalo</span>
            <input type="text" value="${escapeAttr(row.schedule)}" data-onco-dose-field="schedule" data-onco-regimen-id="${escapeAttr(row.id)}" placeholder="Segun protocolo" />
          </label>
          <div class="onco-dose-total" data-onco-dose-result="${escapeAttr(row.id)}">
            ${renderDoseTotal(total)}
          </div>
          <label class="onco-field onco-dose-notes">
            <span>Notas</span>
            <input type="text" value="${escapeAttr(row.notes)}" data-onco-dose-field="notes" data-onco-regimen-id="${escapeAttr(row.id)}" placeholder="Premedicacion, limite, monitoreo..." />
          </label>
        </div>
      `;
    }

    function renderDoseTotal(total) {
      if (!total) {
        return `
          <span class="onco-dose-total-label">Dosis total</span>
          <strong>Pendiente</strong>
        `;
      }
      return `
        <span class="onco-dose-total-label">Dosis total</span>
        <strong>${formatNum(total.value, 2)} mg</strong>
        <small>${escapeHtml(total.detail)}</small>
      `;
    }

    function renderProtocolSummary(calc) {
      if (!calc) return renderEmptyState("Ingresa el peso para calcular SC y dosis total.");
      return `
        <div>
          <span>Superficie corporal</span>
          <strong>${formatNum(calc.bsa, 3)} m2</strong>
        </div>
        <div>
          <span>Peso</span>
          <strong>${formatNum(calc.weight, 2)} kg</strong>
        </div>
        <div>
          <span>Constante</span>
          <strong>K=${formatNum(calc.k, 1)}</strong>
        </div>
      `;
    }

    function renderSurfaceCalculator() {
      const result = calculateBsa();
      return `
        <section class="onco-calculator-grid">
          <article class="onco-card">
            <h3>Superficie corporal</h3>
            <p class="onco-muted">${escapeHtml(D.bsa?.formula || "")}</p>
            <div class="onco-form-grid">
              <label class="onco-field">
                <span>Especie</span>
                <select data-onco-bsa="species">
                  ${speciesOptions().map((item) => `
                    <option value="${escapeAttr(item.id)}" ${state.bsa.species === item.id ? "selected" : ""}>
                      ${escapeHtml(item.label)} (K=${formatNum(item.k)})
                    </option>
                  `).join("")}
                </select>
              </label>
              <label class="onco-field">
                <span>Peso (kg)</span>
                <input type="number" min="0" step="0.01" inputmode="decimal" value="${escapeAttr(state.bsa.weight)}" data-onco-bsa="weight" placeholder="Ej. 18.5" />
              </label>
              <label class="onco-field">
                <span>Dosis opcional (mg/m2)</span>
                <input type="number" min="0" step="0.01" inputmode="decimal" value="${escapeAttr(state.bsa.doseMgM2)}" data-onco-bsa="doseMgM2" placeholder="Solo si ya tienes protocolo" />
              </label>
            </div>
          </article>
          <article class="onco-card onco-result-card" data-onco-bsa-result>
            ${result ? renderBsaResult(result) : renderEmptyState("Ingresa el peso para calcular superficie corporal.")}
          </article>
          <article class="onco-card onco-warning onco-calculator-note">
            <h3>Nota clinica</h3>
            <p>${escapeHtml(D.bsa?.disclaimer || "")}</p>
          </article>
        </section>
      `;
    }

    function renderBsaResult(result) {
      return `
        <h3>Resultado</h3>
        <div class="onco-result-number">${formatNum(result.bsa, 3)} m2</div>
        <div class="onco-result-lines">
          <span>Peso: <strong>${formatNum(result.weight, 2)} kg</strong></span>
          <span>Constante K: <strong>${formatNum(result.k, 1)}</strong></span>
          ${result.totalDose !== null ? `<span>Dosis total estimada: <strong>${formatNum(result.totalDose, 2)} mg</strong></span>` : ""}
        </div>
        <p class="onco-muted">Formula aplicada: ${escapeHtml(D.bsa?.formula || "")}</p>
      `;
    }

    function renderCredits() {
      return `
        <section class="onco-card onco-credits">
          <h3>Dise&ntilde;ado por</h3>
          <div class="onco-credit-list">
            ${(D.credits || []).map((name) => `<span>${escapeHtml(name)}</span>`).join("")}
          </div>
          <p class="onco-muted">${escapeHtml(D.sourceNote || "")}</p>
        </section>
      `;
    }

    function renderEmptyState(message) {
      return `
        <div class="onco-empty">
          <strong>${escapeHtml(message)}</strong>
        </div>
      `;
    }

    function handleClick(event) {
      const printBtn = event.target.closest("[data-onco-print-protocol]");
      if (printBtn) {
        const item = protocols().find((protocolItem) => protocolItem.id === printBtn.dataset.oncoPrintProtocol);
        if (item) openProtocolPrint(item);
        return;
      }

      const pageBtn = event.target.closest("[data-onco-page]");
      if (pageBtn) {
        state.page = pageBtn.dataset.oncoPage;
        render();
        return;
      }

      const protocolBtn = event.target.closest("[data-onco-open-protocol]");
      if (protocolBtn) {
        state.selectedProtocolId = protocolBtn.dataset.oncoOpenProtocol;
        state.page = "protocolos";
        render();
      }
    }

    function handleInput(event) {
      const protocolField = event.target.closest("[data-onco-protocol-field]");
      if (protocolField) {
        const item = selectedProtocol();
        const form = formFor(item);
        form[protocolField.dataset.oncoProtocolField] = protocolField.value;
        refreshProtocolCalculations(item);
        return;
      }

      const doseField = event.target.closest("[data-onco-dose-field]");
      if (doseField) {
        const item = selectedProtocol();
        const form = formFor(item);
        const row = form.regimen.find((entry) => entry.id === doseField.dataset.oncoRegimenId);
        if (row) {
          row[doseField.dataset.oncoDoseField] = doseField.value;
          refreshProtocolCalculations(item);
        }
        return;
      }

      const field = event.target.closest("[data-onco-bsa]");
      if (!field) return;
      const key = field.dataset.oncoBsa;
      if (!(key in state.bsa)) return;

      state.bsa[key] = field.value;
      const resultCard = root.querySelector("[data-onco-bsa-result]");
      if (!resultCard) {
        render();
        return;
      }

      const result = calculateBsa();
      resultCard.innerHTML = result
        ? renderBsaResult(result)
        : renderEmptyState("Ingresa el peso para calcular superficie corporal.");
    }

    function handlePrintClick(event) {
      if (event.target.closest("[data-onco-print-close]") || event.target === printArea) {
        closePrint();
        return;
      }
      if (event.target.closest("[data-onco-print-now]")) {
        window.print();
      }
    }

    function refreshProtocolCalculations(item) {
      if (!item) return;
      const calc = calculateProtocol(item);
      const summary = root.querySelector("[data-onco-protocol-summary]");
      if (summary) summary.innerHTML = renderProtocolSummary(calc);
      formFor(item).regimen.forEach((row) => {
        const cell = root.querySelector(`[data-onco-dose-result="${cssEscape(row.id)}"]`);
        if (cell) cell.innerHTML = renderDoseTotal(calculateDoseTotal(row, calc));
      });
    }

    function openProtocolPrint(item) {
      const form = formFor(item);
      const calc = calculateProtocol(item);
      printArea.innerHTML = `
        <div class="onco-print-shell" role="dialog" aria-modal="true" aria-label="Imprimir protocolo oncologico">
          <div class="onco-print-toolbar">
            <div>
              <h3>Imprimir protocolo</h3>
              <p>${escapeHtml(item.title)}${form.patient ? ` - ${escapeHtml(form.patient)}` : ""}</p>
            </div>
            <div class="onco-print-actions">
              <button class="sv-btn sv-btn-secondary" type="button" data-onco-print-close>Volver</button>
              <button class="sv-btn sv-btn-primary" type="button" data-onco-print-now>Imprimir / PDF</button>
            </div>
          </div>
          <div class="onco-print-preview">
            <article class="onco-print-doc">
              ${renderPrintableProtocol(item, form, calc)}
            </article>
          </div>
        </div>
      `;
      document.body.classList.add("onco-printing");
      printArea.classList.add("is-open");
      printArea.setAttribute("aria-hidden", "false");
      printArea.scrollTo({ top: 0, behavior: "auto" });
    }

    function renderPrintableProtocol(item, form, calc) {
      return `
        <header class="onco-print-header">
          <p>${escapeHtml(D.appName || "VetOnco")} - SUITE VET</p>
          <h1>${escapeHtml(item.title)}</h1>
          <span>${escapeHtml(item.system)}</span>
        </header>
        <section class="onco-print-section">
          <h2>Datos del paciente</h2>
          ${printRows([
            ["Paciente", form.patient || "No especificado"],
            ["Tutor", form.owner || "No especificado"],
            ["Medico tratante", form.clinician || "No especificado"],
            ["Fecha", form.date || "No especificada"],
            ["Especie", speciesLabel(form.species)],
            ["Peso", calc ? `${formatNum(calc.weight, 2)} kg` : "Pendiente"],
            ["Superficie corporal", calc ? `${formatNum(calc.bsa, 3)} m2` : "Pendiente"]
          ])}
        </section>
        <section class="onco-print-section">
          <h2>Protocolo y dosis</h2>
          <table>
            <thead>
              <tr>
                <th>Farmaco</th>
                <th>Dosis</th>
                <th>Dosis total</th>
                <th>Via</th>
                <th>Intervalo</th>
              </tr>
            </thead>
            <tbody>
              ${form.regimen.map((row) => {
                const total = calculateDoseTotal(row, calc);
                return `
                  <tr>
                    <td>${escapeHtml(row.drug || "Pendiente")}</td>
                    <td>${row.doseMgM2 ? `${escapeHtml(row.doseMgM2)} ${escapeHtml(row.unit || "mg/m2")}` : "Pendiente"}</td>
                    <td>${total ? `${formatNum(total.value, 2)} mg` : "Pendiente"}</td>
                    <td>${escapeHtml(row.route || "Pendiente")}</td>
                    <td>${escapeHtml(row.schedule || "Pendiente")}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </section>
        <section class="onco-print-section">
          <h2>Notas del protocolo</h2>
          ${printRows((D.protocolSections || []).map((section) => [
            section.label || section,
            sectionText(item, section.id || section)
          ]))}
        </section>
        <section class="onco-print-section">
          <h2>Seguridad</h2>
          <ul>
            ${(item.safety || []).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
          </ul>
          <p class="onco-print-muted">${escapeHtml(D.bsa?.disclaimer || "")}</p>
        </section>
      `;
    }

    function registerSearch() {
      if (!window.SuiteVet?.registerSearch) return;
      window.SuiteVet.registerSearch("oncologia", (query) => {
        const q = normalize(query);
        return protocols()
          .filter((item) => normalize(`${item.title} ${item.system} ${item.summary}`).includes(q))
          .map((item) => ({
            title: item.title,
            subtitle: `Oncologia - ${item.system}`,
            moduleId: "Oncologia",
            action: () => {
              state.page = "protocolos";
              state.selectedProtocolId = item.id;
              window.SuiteVet.showView("oncologia");
              render();
            }
          }));
      });
    }

    function calculateBsa() {
      const weight = parsePositive(state.bsa.weight);
      if (!Number.isFinite(weight)) return null;
      const species = speciesOptions().find((item) => item.id === state.bsa.species) || speciesOptions()[0];
      const k = Number(species?.k || 10);
      const bsa = (k * Math.pow(weight, 2 / 3)) / 100;
      const dose = parsePositive(state.bsa.doseMgM2);
      return {
        weight,
        k,
        bsa,
        totalDose: Number.isFinite(dose) ? dose * bsa : null
      };
    }

    function calculateProtocol(item) {
      const form = formFor(item);
      const weight = parsePositive(form.weight);
      if (!Number.isFinite(weight)) return null;
      const species = speciesOptions().find((entry) => entry.id === form.species) || speciesOptions()[0];
      const k = Number(species?.k || 10);
      return {
        weight,
        k,
        bsa: (k * Math.pow(weight, 2 / 3)) / 100
      };
    }

    function calculateDoseTotal(row, calc) {
      if (!calc) return null;
      const dose = parsePositive(row.doseMgM2);
      if (!Number.isFinite(dose)) return null;
      if (row.unit === "mg/kg") {
        return {
          value: dose * calc.weight,
          detail: `${formatNum(dose, 2)} mg/kg x ${formatNum(calc.weight, 2)} kg`
        };
      }
      return {
        value: dose * calc.bsa,
        detail: `${formatNum(dose, 2)} mg/m2 x ${formatNum(calc.bsa, 3)} m2`
      };
    }

    function selectedProtocol() {
      return protocols().find((item) => item.id === state.selectedProtocolId) || protocols()[0] || null;
    }

    function protocols() {
      return Array.isArray(D.protocols) ? D.protocols : [];
    }

    function speciesOptions() {
      return Array.isArray(D.bsa?.species) ? D.bsa.species : [];
    }

    function speciesLabel(id) {
      return speciesOptions().find((item) => item.id === id)?.label || id || "No especificada";
    }

    function sectionText(item, sectionId) {
      return item.sections?.[sectionId] || "Completar con contenido validado para este protocolo.";
    }

    function formFor(item) {
      const id = item?.id || "default";
      if (!state.protocolForms[id]) {
        state.protocolForms[id] = {
          patient: "",
          owner: "",
          clinician: "",
          date: todayIso(),
          species: D.bsa?.species?.[0]?.id || "perro",
          weight: "",
          regimen: (item.regimen || []).map((row) => ({ ...row, doseMgM2: row.doseMgM2 ?? "" }))
        };
      }
      return state.protocolForms[id];
    }

    function ensurePrintArea() {
      let area = document.getElementById("onco-print-area");
      if (!area) {
        area = document.createElement("div");
        area.id = "onco-print-area";
        area.className = "onco-print-area";
        area.setAttribute("aria-hidden", "true");
        document.body.appendChild(area);
      }
      return area;
    }

    function closePrint() {
      document.body.classList.remove("onco-printing");
      printArea.classList.remove("is-open");
      printArea.setAttribute("aria-hidden", "true");
      printArea.innerHTML = "";
    }
  });

  function printRows(rows) {
    return `
      <table>
        <tbody>
          ${rows.map(([label, value]) => `
            <tr>
              <th>${escapeHtml(label)}</th>
              <td>${escapeHtml(value)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function parsePositive(value) {
    const n = Number(String(value || "").replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function formatNum(value, decimals = 2) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString("es-EC", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0
    });
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return window.CSS.escape(value);
    return String(value || "").replace(/["\\]/g, "\\$&");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();
