// =============================================================================
// SUITE VET â€” shared/router.js
// NavegaciÃ³n global, toggle de tema dark/light y buscador global.
// TODOS los mÃ³dulos se comunican a travÃ©s de window.SuiteVet.
// =============================================================================

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1. OBJETO GLOBAL
  // ---------------------------------------------------------------------------
  window.SuiteVet = window.SuiteVet || {};
  const Safety = window.SuiteVetSafety;

  if (!Safety) {
    throw new Error("[SuiteVet] No se cargaron las utilidades de seguridad.");
  }

  // ---------------------------------------------------------------------------
  // 2. TEMA (dark / light)
  // ---------------------------------------------------------------------------
  const THEME_KEY = "suitevet_theme";
  const SHELL_DRAWER_MEDIA = window.matchMedia("(max-width: 900px)");
  const SHELL_COMPACT_SEARCH_MEDIA = window.matchMedia("(max-width: 640px)");
  const DRAWER_FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
  let lastMenuTrigger = null;

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("sv-theme-toggle");
    if (btn) {
      const nextThemeLabel = theme === "dark" ? "claro" : "oscuro";
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute("aria-label", `Cambiar a tema ${nextThemeLabel}`);
      btn.title = `Cambiar a tema ${nextThemeLabel}`;
    }
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
  // 3. NAVEGACIÃ“N DE VISTAS
  // ---------------------------------------------------------------------------
  function showView(viewName) {
    const views   = document.querySelectorAll(".sv-view");
    const navBtns = document.querySelectorAll(".sv-nav-btn[data-view], .sv-menu-route[data-view]");

    views.forEach((v) => {
      const isActive = v.id === `view-${viewName}`;
      v.classList.toggle("sv-view-active", isActive);
      v.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    navBtns.forEach((btn) => {
      const isActive = btn.dataset.view === viewName;
      btn.classList.toggle("sv-nav-active", isActive);
      btn.classList.toggle("sv-menu-active", isActive);
      if (isActive) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    window.SuiteVet.currentView = viewName;
    if (SHELL_DRAWER_MEDIA.matches) {
      closeMenu({ restoreFocus: false });
    }
    closeSearch(false);

    // Emitir evento para que los mÃ³dulos sepan cuÃ¡ndo se activan
    document.dispatchEvent(
      new CustomEvent("suitevet:viewchange", { detail: { view: viewName } })
    );
  }

  window.SuiteVet.showView    = showView;
  window.SuiteVet.currentView = "home";

  // ---------------------------------------------------------------------------
  // 4. MENÃš HAMBURGUESA
  // ---------------------------------------------------------------------------
  function setMenuInteractivity(panel, enabled) {
    if (!panel) return;
    panel.inert = !enabled;
    panel.setAttribute("aria-hidden", enabled ? "false" : "true");
  }

  function openMenu(trigger = document.activeElement) {
    if (!SHELL_DRAWER_MEDIA.matches) return;

    const panel = document.getElementById("sv-menu-panel");
    const toggle = document.getElementById("sv-menu-toggle");
    const backdrop = document.getElementById("sv-sidebar-backdrop");
    if (!panel) return;

    lastMenuTrigger = trigger instanceof HTMLElement ? trigger : toggle;
    panel.classList.add("sv-menu-open");
    setMenuInteractivity(panel, true);
    document.body.classList.add("sv-drawer-open");

    if (toggle) {
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar navegación");
    }
    if (backdrop) backdrop.classList.add("sv-backdrop-active");

    window.setTimeout(() => {
      const target = panel.querySelector("[aria-current='page']") || panel.querySelector("[data-drawer-close]") || panel.querySelector(DRAWER_FOCUSABLE);
      target?.focus({ preventScroll: true });
    }, 50);
  }

  function closeMenu({ restoreFocus = true } = {}) {
    const panel = document.getElementById("sv-menu-panel");
    const toggle = document.getElementById("sv-menu-toggle");
    const backdrop = document.getElementById("sv-sidebar-backdrop");
    const focusTarget = lastMenuTrigger;

    panel?.classList.remove("sv-menu-open");
    document.body.classList.remove("sv-drawer-open");

    if (toggle) {
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir navegación");
    }
    if (backdrop) backdrop.classList.remove("sv-backdrop-active");

    if (SHELL_DRAWER_MEDIA.matches) setMenuInteractivity(panel, false);
    else setMenuInteractivity(panel, true);

    lastMenuTrigger = null;
    if (restoreFocus && focusTarget?.isConnected) {
      window.setTimeout(() => focusTarget.focus({ preventScroll: true }), 0);
    }
  }

  function toggleMenu(trigger) {
    const panel = document.getElementById("sv-menu-panel");
    if (!panel) return;
    
    if (!SHELL_DRAWER_MEDIA.matches) {
      const container = document.querySelector(".sv-app-container");
      const toggle = document.getElementById("sv-menu-toggle");
      if (container) {
        const isCollapsed = container.classList.toggle("sv-sidebar-collapsed");
        localStorage.setItem("suitevet_sidebar_collapsed", isCollapsed ? "true" : "false");
        if (toggle) {
          toggle.classList.toggle("is-collapsed", isCollapsed);
          toggle.setAttribute("aria-label", isCollapsed ? "Expandir navegación" : "Contraer navegación");
        }
      }
    } else {
      panel.classList.contains("sv-menu-open") ? closeMenu() : openMenu(trigger);
    }
  }

  function syncShellMode() {
    const panel = document.getElementById("sv-menu-panel");
    const toggle = document.getElementById("sv-menu-toggle");
    const backdrop = document.getElementById("sv-sidebar-backdrop");
    const container = document.querySelector(".sv-app-container");
    const isCollapsed = localStorage.getItem("suitevet_sidebar_collapsed") === "true";

    panel?.classList.remove("sv-menu-open");
    toggle?.classList.remove("is-open");
    backdrop?.classList.remove("sv-backdrop-active");
    document.body.classList.remove("sv-drawer-open");
    lastMenuTrigger = null;

    if (SHELL_DRAWER_MEDIA.matches) {
      container?.classList.remove("sv-sidebar-collapsed");
      toggle?.classList.remove("is-collapsed");
      setMenuInteractivity(panel, false);
    } else {
      container?.classList.toggle("sv-sidebar-collapsed", isCollapsed);
      toggle?.classList.toggle("is-collapsed", isCollapsed);
      setMenuInteractivity(panel, true);
    }

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", SHELL_DRAWER_MEDIA.matches ? "Abrir navegación" : (isCollapsed ? "Expandir navegación" : "Contraer navegación"));
    }

    closeSearch(false);
  }

  function trapDrawerFocus(event) {
    const panel = document.getElementById("sv-menu-panel");
    if (!SHELL_DRAWER_MEDIA.matches || !panel?.classList.contains("sv-menu-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(panel.querySelectorAll(DRAWER_FOCUSABLE)).filter((element) => !element.hidden);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  window.SuiteVet.closeMenu = closeMenu;

  function hydrateModuleMenu(panel) {
    if (!panel) return;
    panel.innerHTML = `
      <div class="sv-sidebar-header">
        <strong>SUITE VET</strong>
        <button class="sv-icon-btn sv-drawer-close" type="button" data-drawer-close aria-label="Cerrar navegaci&oacute;n">&times;</button>
      </div>
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
      <button class="sv-menu-item sv-menu-route" data-view="nutricion" type="button">
        <span class="sv-menu-icon sv-menu-icon-nutri">🐷🐔🐮</span>
        <span>
          <strong>Nutrici&oacute;n Animal</strong>
          <small>Nutrientes, raciones y cl&iacute;nica nutricional</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="clinica" type="button">
        <span class="sv-menu-icon sv-menu-icon-clinica">CI</span>
        <span>
          <strong>Clinica Integrada</strong>
          <small>Casos clinicos guiados para razonamiento veterinario</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="semiologia" type="button">
        <span class="sv-menu-icon sv-menu-icon-semiologia">SA</span>
        <span>
          <strong>Semiologia &amp; Anamnesis Pro</strong>
          <small>Entrenador de anamnesis, examen fisico y OSCE</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="casos360" type="button">
        <span class="sv-menu-icon sv-menu-icon-casos360" style="background:var(--sv-casos360-color, #8b5cf6); color:#fff;">360</span>
        <span>
          <strong>Casos 360</strong>
          <small>Casos cl&iacute;nicos con evaluaci&oacute;n por competencias</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="oncologia" type="button">
        <span class="sv-menu-icon sv-menu-icon-onco" style="background:var(--sv-onco-color, #c026d3); color:#fff;">ON</span>
        <span>
          <strong>Oncolog&iacute;a</strong>
          <small>VetOnco, protocolos base y superficie corporal</small>
        </span>
      </button>
      <button class="sv-menu-item sv-menu-route" data-view="bibliografia" type="button">
        <span class="sv-menu-icon sv-menu-icon-bib">📚</span>
        <span>
          <strong>Bibliograf&iacute;a</strong>
          <small>Referencias y biblioteca de libros</small>
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

  function closeSearch(clearValue = false, restoreToggleFocus = false) {
    const wrap = document.querySelector(".sv-search-wrap");
    const btn = document.getElementById("sv-search-toggle");
    const input = document.getElementById("sv-search-global");
    const results = document.getElementById("sv-search-results");
    if (!wrap) return;
    const isCompact = SHELL_COMPACT_SEARCH_MEDIA.matches;
    wrap.classList.toggle("sv-search-visible", !isCompact);
    wrap.setAttribute("aria-hidden", isCompact ? "true" : "false");
    if (btn) {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-expanded", "false");
    }
    if (results) {
      results.classList.remove("sv-search-open");
      results.innerHTML = "";
    }
    if (clearValue && input) input.value = "";
    if (restoreToggleFocus && isCompact) btn?.focus({ preventScroll: true });
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
  // Cada mÃ³dulo se registra con: SuiteVet.registerSearch(moduleId, searchFn)
  // searchFn(query) â†’ array de resultados: [{title, subtitle, moduleId, action}]

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
  // 6. DOMContentLoaded â€” conectar eventos
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const menuPanel = document.getElementById("sv-menu-panel");
    hydrateModuleMenu(menuPanel);
    syncShellMode();

    // â€” Botones de nav principal â€”
    document.querySelectorAll(".sv-nav-btn[data-view], .sv-menu-route[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const moveFocusToContent = SHELL_DRAWER_MEDIA.matches && btn.classList.contains("sv-menu-route");
        showView(btn.dataset.view);
        if (moveFocusToContent) {
          document.getElementById("sv-main-content")?.focus({ preventScroll: true });
        }
      });
    });

    // â€” Tarjetas de inicio (data-go-view) â€”
    document.querySelectorAll("[data-go-view]").forEach((card) => {
      card.addEventListener("click", () => showView(card.dataset.goView));
    });

    // â€” MenÃº hamburguesa â€”
    const menuToggle = document.getElementById("sv-menu-toggle");

    if (menuToggle) {
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu(e.currentTarget);
      });
    }

    menuPanel?.querySelector("[data-drawer-close]")?.addEventListener("click", () => closeMenu());
    document.addEventListener("keydown", trapDrawerFocus);

    const searchToggle = document.getElementById("sv-search-toggle");
    if (searchToggle) {
      searchToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSearch();
      });
    }

    document.addEventListener("click", (e) => {
      if (!SHELL_DRAWER_MEDIA.matches || !menuPanel?.classList.contains("sv-menu-open")) return;
      if (!menuPanel.contains(e.target) && !menuToggle?.contains(e.target)) {
        closeMenu();
      }
    });

    const backdrop = document.getElementById("sv-sidebar-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        closeMenu();
      });
    }

    if (typeof SHELL_DRAWER_MEDIA.addEventListener === "function") {
      SHELL_DRAWER_MEDIA.addEventListener("change", syncShellMode);
      SHELL_COMPACT_SEARCH_MEDIA.addEventListener("change", () => closeSearch(false));
    } else {
      SHELL_DRAWER_MEDIA.addListener(syncShellMode);
      SHELL_COMPACT_SEARCH_MEDIA.addListener(() => closeSearch(false));
    }

    // â€” Toggle de tema â€”
    const themeBtn = document.getElementById("sv-theme-toggle");
    if (themeBtn) {
      applyTheme(getTheme());
      themeBtn.addEventListener("click", toggleTheme);
    }

    // â€” Buscador global â€”
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
        if (e.key === "Escape") closeSearch(false, true);
        if (e.key === "ArrowDown") {
          const firstResult = globalResults.querySelector(".sv-search-item");
          if (firstResult) {
            e.preventDefault();
            firstResult.focus();
          }
        }
      });

      globalResults.addEventListener("keydown", (e) => {
        const items = Array.from(globalResults.querySelectorAll(".sv-search-item"));
        const currentIndex = items.indexOf(document.activeElement);
        if (e.key === "Escape") {
          e.preventDefault();
          closeSearch(false, true);
        } else if (e.key === "ArrowDown" && items.length) {
          e.preventDefault();
          items[(currentIndex + 1) % items.length].focus();
        } else if (e.key === "ArrowUp" && items.length) {
          e.preventDefault();
          if (currentIndex <= 0) globalInput.focus();
          else items[currentIndex - 1].focus();
        }
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

    // Agrupar por mÃ³dulo
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
      nutricion: "Nutrición Animal",
      clinica: "Clinica Integrada",
      semiologia: "Semiologia & Anamnesis Pro",
      casos360: "🧬 Casos 360",
      bibliografia: "📚 Bibliografía & Biblioteca",
    };

    for (const [moduleId, items] of Object.entries(grupos)) {
      const group = document.createElement("div");
      group.className = "sv-search-group";
      group.appendChild(
        Safety.createTextElement(document, "div", "sv-search-group-label", labels[moduleId] || moduleId)
      );

      items.slice(0, 5).forEach((item) => {
        const el = document.createElement("button");
        el.className = "sv-search-item";
        el.type = "button";
        el.setAttribute("role", "option");
        el.appendChild(
          Safety.createTextElement(document, "span", "sv-search-item-title", item.title)
        );
        if (item.subtitle) {
          el.appendChild(
            Safety.createTextElement(document, "span", "sv-search-item-sub", item.subtitle)
          );
        }
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

