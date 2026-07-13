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
  const DEFAULT_VIEW = "landing";
  const ROUTE_QUERY_PARAM = "sv_view";
  const AUTH_CALLBACK_QUERY_KEYS = new Set(["code", "token_hash", "type", "error", "error_code"]);
  const AUTH_CALLBACK_HASH = /(?:access_token|refresh_token|error(?:_code|_description)?|type)=/i;

  function viewExists(viewName) {
    return Boolean(document.getElementById(`view-${viewName}`));
  }

  function isSensitiveAuthCallbackUrl() {
    const params = new URLSearchParams(window.location?.search || "");
    return Array.from(params.keys()).some((key) => AUTH_CALLBACK_QUERY_KEYS.has(key)) ||
      AUTH_CALLBACK_HASH.test(window.location?.hash || "");
  }

  function readRouteView() {
    if (isSensitiveAuthCallbackUrl()) return DEFAULT_VIEW;
    if ((window.location?.hash || "").toLowerCase() === "#/admin" && viewExists("admin")) return "admin";
    const params = new URLSearchParams(window.location?.search || "");
    const requested = params.get(ROUTE_QUERY_PARAM);
    if (requested === "feedback-admin" && viewExists("admin")) return "admin";
    return requested && viewExists(requested) ? requested : DEFAULT_VIEW;
  }

  function updateBrowserRoute(viewName) {
    if (!window.history?.pushState || !window.location || isSensitiveAuthCallbackUrl() || !viewExists(viewName)) return;
    const url = new URL(window.location.href);
    if (viewName === "admin") {
      url.searchParams.delete(ROUTE_QUERY_PARAM);
      url.hash = "/admin";
    } else {
      if (viewName === DEFAULT_VIEW) url.searchParams.delete(ROUTE_QUERY_PARAM);
      else url.searchParams.set(ROUTE_QUERY_PARAM, viewName);
      if (url.hash.toLowerCase() === "#/admin") url.hash = "";
    }
    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) window.history.pushState({ suiteVetView: viewName }, "", next);
  }

  function showView(viewName, options = {}) {
    if (viewName === "feedback-admin" && viewExists("admin")) viewName = "admin";
    const views   = document.querySelectorAll(".sv-view");

    views.forEach((v) => {
      const isActive = v.id === `view-${viewName}`;
      v.classList.toggle("sv-view-active", isActive);
      v.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    syncActiveNavigation(viewName);

    window.SuiteVet.currentView = viewName;
    if (options.updateHistory !== false) updateBrowserRoute(viewName);
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
  window.SuiteVet.currentView = DEFAULT_VIEW;

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

  const CATALOG_ICON_TEXT = Object.freeze({
    home: "IN",
    physiology: "FI",
    pharmacology: "Rx",
    microbiology: "MB",
    pathology: "PT",
    nutrition: "🐷🐔🐮",
    clinic: "CI",
    semiology: "SA",
    cases360: "360",
    oncology: "ON",
    bibliography: "📚",
    favorites: "FV",
    about: "i",
    recipe: "Rx",
    cartilla: "CD",
    cattle: "CT"
  });
  const HOME_ICON_TEXT = Object.freeze({
    physiology: "💗",
    pharmacology: "💉",
    microbiology: "🧫",
    pathology: "🔬",
    nutrition: "🐷🐔🐮",
    clinic: "🩺",
    semiology: "👁️",
    cases360: "🧬",
    oncology: "ON",
    cattle: "🐄"
  });
  const SEARCH_ICON_TEXT = Object.freeze({
    physiology: "💗",
    pharmacology: "💉",
    microbiology: "🧫",
    pathology: "🔬",
    nutrition: "🐮",
    clinic: "🩺",
    semiology: "👁️",
    cases360: "🧬",
    oncology: "ON",
    bibliography: "📚"
  });
  const MENU_THEME_CLASS = Object.freeze({
    fisio: "sv-menu-icon-fisio",
    farma: "sv-menu-icon-farma",
    micro: "sv-menu-icon-micro",
    pato: "sv-menu-icon-pato",
    nutri: "sv-menu-icon-nutri",
    clinica: "sv-menu-icon-clinica",
    semiologia: "sv-menu-icon-semiologia",
    casos360: "sv-menu-icon-casos360",
    onco: "sv-menu-icon-onco",
    biblio: "sv-menu-icon-bib",
    favoritos: "sv-menu-icon-fav",
    muted: "sv-menu-icon-about"
  });
  const HOME_THEME_CLASS = Object.freeze({
    fisio: "sv-home-card-fisio",
    farma: "sv-home-card-farma",
    micro: "sv-home-card-micro",
    pato: "sv-home-card-pato",
    nutri: "sv-home-card-nutri",
    clinica: "sv-home-card-clinica",
    semiologia: "sv-home-card-semiologia",
    casos360: "sv-home-card-casos360",
    onco: "sv-home-card-onco"
  });

  function catalogItems() {
    return window.SuiteVetCatalog?.getItems?.() || [];
  }

  function createCatalogText(tagName, className, value) {
    return Safety.createTextElement(document, tagName, className, value);
  }

  function createMenuItem(item) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sv-menu-item";

    if (item.status === "active" && item.route) {
      button.classList.add("sv-menu-route");
      button.dataset.view = item.route;
    } else {
      button.classList.add("sv-disabled");
      button.disabled = true;
    }

    const icon = createCatalogText("span", "sv-menu-icon", CATALOG_ICON_TEXT[item.icon_id] || "•");
    const themeClass = MENU_THEME_CLASS[item.theme];
    if (themeClass) icon.classList.add(themeClass);

    const copy = document.createElement("span");
    copy.appendChild(createCatalogText("strong", "", item.name));
    copy.appendChild(createCatalogText("small", "", item.description));
    button.append(icon, copy);
    return button;
  }

  function hydrateModuleMenu(panel) {
    if (!panel) return;

    const header = document.createElement("div");
    header.className = "sv-sidebar-header";
    header.appendChild(createCatalogText("strong", "", "SUITE VET"));

    const closeButton = createCatalogText("button", "sv-icon-btn sv-drawer-close", "×");
    closeButton.type = "button";
    closeButton.dataset.drawerClose = "";
    closeButton.setAttribute("aria-label", "Cerrar navegación");
    header.appendChild(closeButton);

    const title = createCatalogText("p", "sv-menu-title", "Módulos SUITE VET");
    const nodes = [header, title];

    catalogItems().filter((item) => item.visible_in_sidebar).forEach((item) => {
      if (item.id === "about") {
        const divider = document.createElement("div");
        divider.className = "sv-menu-divider";
        divider.setAttribute("aria-hidden", "true");
        nodes.push(divider);
      }
      const menuItem = createMenuItem(item);
      if (item.id === "about") menuItem.classList.add("sv-menu-about");
      nodes.push(menuItem);
    });

    panel.replaceChildren(...nodes);
  }

  function createHomeCard(item) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sv-home-card";
    const themeClass = HOME_THEME_CLASS[item.theme];
    if (themeClass) button.classList.add(themeClass);

    if (item.status === "active" && item.route) {
      button.dataset.goView = item.route;
    } else {
      button.classList.add("sv-home-card-coming", "sv-disabled");
      button.disabled = true;
    }

    const iconClass = item.icon_id === "nutrition"
      ? "sv-home-card-icon sv-home-card-icon-nutri"
      : "sv-home-card-icon";
    button.appendChild(createCatalogText("div", iconClass, HOME_ICON_TEXT[item.icon_id] || "•"));
    button.appendChild(createCatalogText("div", "sv-home-card-title", item.name));
    button.appendChild(createCatalogText("div", "sv-home-card-text", item.home_description || item.description));
    if (item.badge) {
      const badge = createCatalogText("span", "sv-coming-tag", item.badge);
      if (item.id === "casos360") badge.classList.add("sv-coming-tag-casos360");
      button.appendChild(badge);
    }
    return button;
  }

  function hydrateHomeCatalog() {
    const grid = document.getElementById("sv-home-catalog");
    if (!grid) return;
    const cards = catalogItems()
      .filter((item) => item.visible_on_home)
      .map(createHomeCard);
    grid.replaceChildren(...cards);
  }

  function syncActiveNavigation(viewName = window.SuiteVet.currentView) {
    document.querySelectorAll(".sv-nav-btn[data-view], .sv-menu-route[data-view]").forEach((button) => {
      const isActive = button.dataset.view === viewName;
      button.classList.toggle("sv-nav-active", isActive);
      button.classList.toggle("sv-menu-active", isActive);
      if (isActive) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  function hydrateCatalogUI() {
    hydrateModuleMenu(document.getElementById("sv-menu-panel"));
    hydrateHomeCatalog();
    syncActiveNavigation();
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
    hydrateCatalogUI();
    syncShellMode();

    // â€” Botones de nav principal â€”
    document.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-go-view], .sv-nav-btn[data-view], .sv-menu-route[data-view]");
      if (!target) return;
      const view = target.dataset.goView || target.dataset.view;
      if (!view) return;
      const moveFocusToContent = SHELL_DRAWER_MEDIA.matches && target.classList.contains("sv-menu-route");
      showView(view);
      if (moveFocusToContent) {
        document.getElementById("sv-main-content")?.focus({ preventScroll: true });
      }
    });

    // â€” Tarjetas de inicio (data-go-view) â€”
    // â€” MenÃº hamburguesa â€”
    const menuToggle = document.getElementById("sv-menu-toggle");

    if (menuToggle) {
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu(e.currentTarget);
      });
    }

    menuPanel?.addEventListener("click", (event) => {
      if (event.target.closest?.("[data-drawer-close]")) closeMenu();
    });
    document.addEventListener("keydown", trapDrawerFocus);

    const searchToggle = document.getElementById("sv-search-toggle");
    if (searchToggle) {
      searchToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSearch();
      });
    }

    document.getElementById("sv-drawer-search")?.addEventListener("click", () => {
      closeMenu({ restoreFocus: false });
      if (SHELL_COMPACT_SEARCH_MEDIA.matches) toggleSearch();
    });

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
    showView(readRouteView(), { updateHistory: false });
  });

  window.addEventListener("popstate", () => {
    if (document.readyState !== "loading") showView(readRouteView(), { updateHistory: false });
  });

  document.addEventListener("suitevet:catalogready", () => {
    hydrateCatalogUI();
  });

  // ---------------------------------------------------------------------------
  // 7. RENDER DE RESULTADOS GLOBALES
  // ---------------------------------------------------------------------------
  function renderGlobalResults(results, container, input) {
    container.innerHTML = "";

    if (results.length === 0) {
      container.appendChild(
        Safety.createTextElement(document, "div", "sv-search-no-results", "Sin resultados")
      );
      container.classList.add("sv-search-open");
      return;
    }

    // Agrupar por mÃ³dulo
    const grupos = {};
    results.forEach((r) => {
      if (!grupos[r.moduleId]) grupos[r.moduleId] = [];
      grupos[r.moduleId].push(r);
    });

    for (const [moduleId, items] of Object.entries(grupos)) {
      const catalogItem = window.SuiteVetCatalog?.find?.(moduleId);
      const icon = catalogItem ? SEARCH_ICON_TEXT[catalogItem.icon_id] : "";
      const label = catalogItem ? `${icon ? `${icon} ` : ""}${catalogItem.short_name}` : moduleId;
      const group = document.createElement("div");
      group.className = "sv-search-group";
      group.appendChild(
        Safety.createTextElement(document, "div", "sv-search-group-label", label)
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

