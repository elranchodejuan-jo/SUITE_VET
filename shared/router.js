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
    const navBtns = document.querySelectorAll(".sv-nav-btn[data-view], .sv-menu-route[data-view]");

    views.forEach((v) =>
      v.classList.toggle("sv-view-active", v.id === `view-${viewName}`)
    );

    navBtns.forEach((btn) => {
      btn.classList.toggle("sv-nav-active", btn.dataset.view === viewName);
      btn.classList.toggle("sv-menu-active", btn.dataset.view === viewName);
    });

    window.SuiteVet.currentView = viewName;
    closeMenu();
    closeSearch(false);

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
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    const panel  = document.getElementById("sv-menu-panel");
    const toggle = document.getElementById("sv-menu-toggle");
    if (panel)  panel.classList.remove("sv-menu-open");
    if (toggle) toggle.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const panel = document.getElementById("sv-menu-panel");
    if (!panel) return;
    panel.classList.contains("sv-menu-open") ? closeMenu() : openMenu();
  }

  window.SuiteVet.closeMenu = closeMenu;

  function hydrateModuleMenu(panel) {
    if (!panel) return;
    panel.innerHTML = `
      <p class="sv-menu-title">M&oacute;dulos SUITE VET</p>
      <button class="sv-menu-item sv-menu-route" data-view="home" type="button">
        <span class="sv-menu-icon">IN</span>
        <span>
          <strong>Inicio</strong>
          <small>Vista principal de la plataforma</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="fisiologia" type="button">
        <span class="sv-menu-icon sv-menu-icon-fisio">FI</span>
        <span>
          <strong>Fisiolog&iacute;a</strong>
          <small>Hormonas, vitaminas y glosario</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="farmacologia" type="button">
        <span class="sv-menu-icon sv-menu-icon-farma">Rx</span>
        <span>
          <strong>Farmacolog&iacute;a</strong>
          <small>Vadem&eacute;cum, dosis y recetario</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="microbiologia" type="button">
        <span class="sv-menu-icon sv-menu-icon-micro">MB</span>
        <span>
          <strong>Microbiolog&iacute;a</strong>
          <small>Agares, caldos, pruebas y atlas</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="patologia" type="button">
        <span class="sv-menu-icon sv-menu-icon-pato">PT</span>
        <span>
          <strong>Patolog&iacute;a</strong>
          <small>Lesiones y diagn&oacute;stico diferencial</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="favoritos" type="button">
        <span class="sv-menu-icon sv-menu-icon-fav">FV</span>
        <span>
          <strong>Favoritos</strong>
          <small>Recursos guardados</small>
        </span>
      </button>
      <button class="sv-menu-item sv-disabled" type="button" disabled>
        <span class="sv-menu-icon">CD</span>
        <span>
          <strong>Cartilla Digital</strong>
          <small>Pr&oacute;ximamente</small>
        </span>
      </button>
      <button class="sv-menu-item sv-disabled" type="button" disabled>
        <span class="sv-menu-icon">CT</span>
        <span>
          <strong>CATTLE</strong>
          <small>Pr&oacute;ximamente</small>
        </span>
      </button>
      <div class="sv-menu-divider" aria-hidden="true"></div>
      <button class="sv-menu-item sv-menu-route sv-menu-about" data-view="about" type="button">
        <span class="sv-menu-icon sv-menu-icon-about">i</span>
        <span>
          <strong>Sobre SUITE VET</strong>
          <small>Proyecto, creador y cr&eacute;ditos</small>
        </span>
      </button>
    `;
  }

  function openSearch() {
    const wrap = document.querySelector(".sv-search-wrap");
    const btn = document.getElementById("sv-search-toggle");
    const input = document.getElementById("sv-search-global");
    if (!wrap) return;
    wrap.classList.add("sv-search-visible");
    wrap.setAttribute("aria-hidden", "false");
    if (btn) {
      btn.classList.add("is-active");
      btn.setAttribute("aria-expanded", "true");
    }
    window.setTimeout(() => input && input.focus(), 0);
  }

  function closeSearch(clearValue = false) {
    const wrap = document.querySelector(".sv-search-wrap");
    const btn = document.getElementById("sv-search-toggle");
    const input = document.getElementById("sv-search-global");
    const results = document.getElementById("sv-search-results");
    if (!wrap) return;
    wrap.classList.remove("sv-search-visible");
    wrap.setAttribute("aria-hidden", "true");
    if (btn) {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-expanded", "false");
    }
    if (results) {
      results.classList.remove("sv-search-open");
      results.innerHTML = "";
    }
    if (clearValue && input) input.value = "";
  }

  function toggleSearch() {
    const wrap = document.querySelector(".sv-search-wrap");
    if (!wrap) return;
    wrap.classList.contains("sv-search-visible") ? closeSearch(false) : openSearch();
  }

  window.SuiteVet.openSearch = openSearch;
  window.SuiteVet.closeSearch = closeSearch;

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
    const menuPanel = document.getElementById("sv-menu-panel");
    hydrateModuleMenu(menuPanel);

    // — Botones de nav principal —
    document.querySelectorAll(".sv-nav-btn[data-view], .sv-menu-route[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => showView(btn.dataset.view));
    });

    // — Tarjetas de inicio (data-go-view) —
    document.querySelectorAll("[data-go-view]").forEach((card) => {
      card.addEventListener("click", () => showView(card.dataset.goView));
    });

    // — Menú hamburguesa —
    const menuToggle = document.getElementById("sv-menu-toggle");

    if (menuToggle) {
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    const searchToggle = document.getElementById("sv-search-toggle");
    if (searchToggle) {
      searchToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSearch();
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

      globalInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeSearch(false);
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
          closeSearch(false);
        });
        group.appendChild(el);
      });

      container.appendChild(group);
    }

    container.classList.add("sv-search-open");
  }

})();
