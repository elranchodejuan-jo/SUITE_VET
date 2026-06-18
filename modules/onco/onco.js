(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("onco-root");
    if (!root) return;

    const D = window.VETONCO_DATA || {};
    const Fav = window.SuiteVet?.Favorites || null;
    const state = {
      page: "inicio",
      selectedProtocolId: D.protocols?.[0]?.id || "",
      bsa: {
        species: D.bsa?.species?.[0]?.id || "perro",
        weight: "",
        doseMgM2: ""
      }
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleInput);

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
              Se integro la estructura original de la app Android como un modulo consultivo:
              lista de protocolos oncologicos, calculador de superficie corporal y creditos.
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
        tipo: "Protocolo base",
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
            <small>${escapeHtml(item.status)}</small>
          </button>
        </article>
      `;
    }

    function renderProtocolDetail(item) {
      return `
        <div class="onco-detail-header">
          <span class="onco-badge">${escapeHtml(item.system)}</span>
          <span class="onco-badge onco-badge-soft">${escapeHtml(item.status)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <div class="onco-section-grid">
          ${(D.protocolSections || []).map((section) => `
            <div class="onco-section-slot">
              <strong>${escapeHtml(section)}</strong>
              <span>Campo listo para completar con contenido validado.</span>
            </div>
          `).join("")}
        </div>
        <p class="onco-muted">
          La app Android original solo traia el nombre de este protocolo. Deje esta ficha preparada
          para cargar el esquema clinico cuando tengas la fuente completa.
        </p>
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

    function selectedProtocol() {
      return protocols().find((item) => item.id === state.selectedProtocolId) || protocols()[0] || null;
    }

    function protocols() {
      return Array.isArray(D.protocols) ? D.protocols : [];
    }

    function speciesOptions() {
      return Array.isArray(D.bsa?.species) ? D.bsa.species : [];
    }
  });

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

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
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
