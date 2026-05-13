// =============================================================================
// SUITE VET — shared/router.js
// Navegación global, toggle de tema dark/light y buscador global.
// TODOS los módulos se comunican a través de window.SuiteVet.
// =============================================================================

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1. OBJETO GLOBAL
  // ---------------------------------------------------------------------------
  window.SuiteVet = window.SuiteVet || {};

  // ---------------------------------------------------------------------------
  // 2. TEMA (dark / light)
  // ---------------------------------------------------------------------------
  const THEME_KEY = "suitevet_theme";

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("sv-theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem(THEME_KEY, theme);
    window.SuiteVet.theme = theme;
  }

  function toggleTheme() {
    const current = getTheme();
    applyTheme(current === "dark" ? "light" : "dark");
  }

  window.SuiteVet.applyTheme  = applyTheme;
  window.SuiteVet.toggleTheme = toggleTheme;
  window.SuiteVet.getTheme    = getTheme;

  // Aplicar tema inmediatamente (antes del DOMContentLoaded para evitar flash)
  applyTheme(getTheme());

  // ---------------------------------------------------------------------------
  // 3. NAVEGACIÓN DE VISTAS
  // ---------------------------------------------------------------------------
  function showView(viewName) {
    const views   = document.querySelectorAll(".sv-view");
    const navBtns = document.querySelectorAll(".sv-nav-btn[data-view]");

    views.forEach((v) =>
      v.classList.toggle("sv-view-active", v.id === `view-${viewName}`)
    );

    navBtns.forEach((btn) =>
      btn.classList.toggle("sv-nav-active", btn.dataset.view === viewName)
    );

    window.SuiteVet.currentView = viewName;
    closeMenu();

    // Emitir evento para que los módulos sepan cuándo se activan
    document.dispatchEvent(
      new CustomEvent("suitevet:viewchange", { detail: { view: viewName } })
    );
  }

  window.SuiteVet.showView    = showView;
  window.SuiteVet.currentView = "home";

  // ---------------------------------------------------------------------------
  // 4. MENÚ HAMBURGUESA
  // ---------------------------------------------------------------------------
  function openMenu() {
    const panel  = document.getElementById("sv-menu-panel");
    const toggle = document.getElementById("sv-menu-toggle");
    if (panel)  panel.classList.add("sv-menu-open");
    if (toggle) toggle.classList.add("is-open");
  }

  function closeMenu() {
    const panel  = document.getElementById("sv-menu-panel");
    const toggle = document.getElementById("sv-menu-toggle");
    if (panel)  panel.classList.remove("sv-menu-open");
    if (toggle) toggle.classList.remove("is-open");
  }

  function toggleMenu() {
    const panel = document.getElementById("sv-menu-panel");
    if (!panel) return;
    panel.classList.contains("sv-menu-open") ? closeMenu() : openMenu();
  }

  window.SuiteVet.closeMenu = closeMenu;

  // ---------------------------------------------------------------------------
  // 5. BUSCADOR GLOBAL
  // ---------------------------------------------------------------------------
  // Cada módulo se registra con: SuiteVet.registerSearch(moduleId, searchFn)
  // searchFn(query) → array de resultados: [{title, subtitle, moduleId, action}]

  const _searchRegistry = {};

  function registerSearch(moduleId, searchFn) {
    _searchRegistry[moduleId] = searchFn;
  }

  async function globalSearch(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    const results = [];

    for (const [moduleId, fn] of Object.entries(_searchRegistry)) {
      try {
        const r = fn(q);
        if (Array.isArray(r)) results.push(...r);
      } catch (e) {
        console.warn(`[SuiteVet] Error buscando en módulo ${moduleId}:`, e);
      }
    }
    return results;
  }

  window.SuiteVet.registerSearch = registerSearch;
  window.SuiteVet.globalSearch   = globalSearch;

  // ---------------------------------------------------------------------------
  // 6. DOMContentLoaded — conectar eventos
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {

    // — Botones de nav principal —
    document.querySelectorAll(".sv-nav-btn[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => showView(btn.dataset.view));
    });

    // — Tarjetas de inicio (data-go-view) —
    document.querySelectorAll("[data-go-view]").forEach((card) => {
      card.addEventListener("click", () => showView(card.dataset.goView));
    });

    // — Menú hamburguesa —
    const menuToggle = document.getElementById("sv-menu-toggle");
    const menuPanel  = document.getElementById("sv-menu-panel");

    if (menuToggle) {
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    document.addEventListener("click", (e) => {
      if (!menuPanel) return;
      if (!menuPanel.contains(e.target) && e.target !== menuToggle) {
        closeMenu();
      }
    });

    // — Toggle de tema —
    const themeBtn = document.getElementById("sv-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", toggleTheme);
    }

    // — Buscador global —
    const globalInput   = document.getElementById("sv-search-global");
    const globalResults = document.getElementById("sv-search-results");

    if (globalInput && globalResults) {
      let debounce;

      globalInput.addEventListener("input", () => {
        clearTimeout(debounce);
        const q = globalInput.value.trim();

        if (q.length < 2) {
          globalResults.classList.remove("sv-search-open");
          globalResults.innerHTML = "";
          return;
        }

        debounce = setTimeout(async () => {
          const results = await globalSearch(q);
          renderGlobalResults(results, globalResults, globalInput);
        }, 220);
      });

      // Cerrar al hacer click fuera
      document.addEventListener("click", (e) => {
        if (!globalInput.contains(e.target) && !globalResults.contains(e.target)) {
          globalResults.classList.remove("sv-search-open");
        }
      });
    }

    // Vista por defecto
    showView("home");
  });

  // ---------------------------------------------------------------------------
  // 7. RENDER DE RESULTADOS GLOBALES
  // ---------------------------------------------------------------------------
  function renderGlobalResults(results, container, input) {
    container.innerHTML = "";

    if (results.length === 0) {
      container.innerHTML = `<div class="sv-search-no-results">Sin resultados</div>`;
      container.classList.add("sv-search-open");
      return;
    }

    // Agrupar por módulo
    const grupos = {};
    results.forEach((r) => {
      if (!grupos[r.moduleId]) grupos[r.moduleId] = [];
      grupos[r.moduleId].push(r);
    });

    const labels = {
      fisio: "🫀 Fisiología",
      farma: "💉 Farmacología",
      micro: "🧫 Microbiología",
      pato:  "🔬 Patología",
    };

    for (const [moduleId, items] of Object.entries(grupos)) {
      const group = document.createElement("div");
      group.className = "sv-search-group";
      group.innerHTML = `<div class="sv-search-group-label">${labels[moduleId] || moduleId}</div>`;

      items.slice(0, 5).forEach((item) => {
        const el = document.createElement("button");
        el.className = "sv-search-item";
        el.innerHTML = `
          <span class="sv-search-item-title">${item.title}</span>
          ${item.subtitle ? `<span class="sv-search-item-sub">${item.subtitle}</span>` : ""}
        `;
        el.addEventListener("click", () => {
          if (typeof item.action === "function") item.action();
          container.classList.remove("sv-search-open");
          if (input) input.value = "";
        });
        group.appendChild(el);
      });

      container.appendChild(group);
    }

    container.classList.add("sv-search-open");
  }

})();
