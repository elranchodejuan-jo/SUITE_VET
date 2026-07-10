// =============================================================================
// SUITE VET - shared/ui-system.js
// Accesibilidad progresiva para tabs y dialogos sin cambiar contratos de modulo.
// =============================================================================

(function () {
  "use strict";

  const TABLIST_SELECTOR = ".sv-module-subnav, .sv-subnav, .semi-inline-tabs";
  const TAB_SELECTOR = "button.sv-module-tab, button.sv-tab, button.semi-inline-tab";
  const OVERLAY_SELECTOR = ".sv-modal-overlay, .micro-modal-overlay, .sv-about-photo-lightbox";
  const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const dialogState = new WeakMap();
  let syncQueued = false;

  function safeId(value) {
    return String(value || "item")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "item";
  }

  function tabsWithin(tablist) {
    return Array.from(tablist.querySelectorAll(TAB_SELECTOR))
      .filter((tab) => tab.closest(TABLIST_SELECTOR) === tablist);
  }

  function tabKey(tab) {
    const keys = [
      "pane", "bibTab", "farmaSubmodule", "nutriSectionPill", "nutriPage",
      "clPage", "semiPage", "vitalNav", "anMode", "c360Nav", "oncoPage"
    ];
    const key = keys.find((name) => tab.dataset[name]);
    return key ? `${key}-${tab.dataset[key]}` : tab.textContent?.trim() || "tab";
  }

  function controlledPanelId(tab, tablist) {
    if (tab.getAttribute("aria-controls")) return tab.getAttribute("aria-controls");
    if (tablist.dataset.tabpanel) return tablist.dataset.tabpanel;
    if (tab.dataset.bibTab) return `bib-pane-${tab.dataset.bibTab}`;
    if (tab.dataset.pane && tablist.id === "fisio-subnav") return `fisio-pane-${tab.dataset.pane}`;
    if (tab.dataset.pane && tablist.id === "micro-subnav") return "micro-content";
    return "";
  }

  function enhanceTablist(tablist, index) {
    const tabs = tabsWithin(tablist);
    if (tabs.length < 2) return;

    const root = tablist.closest("[id$='-root']") || tablist.closest(".sv-view");
    const rootId = safeId(root?.id || `suitevet-tabs-${index + 1}`);
    const activeTab = tabs.find((tab) => tab.classList.contains("is-active") || tab.classList.contains("sv-tab-active"));
    const focusTab = activeTab || tabs[0];

    tablist.setAttribute("role", "tablist");
    if (!tablist.hasAttribute("aria-label")) {
      const heading = root?.querySelector("h2, h3")?.textContent?.trim() || "Modulo";
      tablist.setAttribute("aria-label", `Secciones de ${heading}`);
    }

    tabs.forEach((tab) => {
      const selected = tab === activeTab;
      const panelId = controlledPanelId(tab, tablist);
      if (!tab.id) tab.id = `${rootId}-${safeId(tabKey(tab))}-tab`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.setAttribute("tabindex", tab === focusTab ? "0" : "-1");
      if (panelId) tab.setAttribute("aria-controls", panelId);

      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("tabindex", "0");
      if (tablist.dataset.tabpanel) {
        if (selected) panel.setAttribute("aria-labelledby", tab.id);
      } else {
        panel.setAttribute("aria-labelledby", tab.id);
        panel.setAttribute("aria-hidden", selected ? "false" : "true");
      }
    });
  }

  function syncTabs() {
    document.querySelectorAll(TABLIST_SELECTOR).forEach(enhanceTablist);
  }

  function overlayIsOpen(overlay) {
    if (overlay.hidden) return false;
    if (overlay.classList.contains("sv-modal-overlay")) return overlay.classList.contains("sv-modal-active");
    return overlay.classList.contains("is-open");
  }

  function focusableWithin(dialog) {
    return Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
      if (!(element instanceof HTMLElement)) return false;
      return !element.hidden && element.getAttribute("aria-hidden") !== "true" && element.getClientRects().length > 0;
    });
  }

  function syncDialogs() {
    let anyOpen = false;

    document.querySelectorAll(OVERLAY_SELECTOR).forEach((overlay) => {
      const dialog = overlay.matches("[role='dialog']") ? overlay : overlay.querySelector("[role='dialog']");
      const open = overlayIsOpen(overlay);
      const previous = dialogState.get(overlay) || { open: false, returnFocus: null };

      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      overlay.inert = !open;
      anyOpen = anyOpen || open;

      if (open && !previous.open) {
        previous.open = true;
        previous.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialogState.set(overlay, previous);
        window.requestAnimationFrame(() => {
          if (!dialog || !overlayIsOpen(overlay) || dialog.contains(document.activeElement)) return;
          const first = focusableWithin(dialog)[0];
          (first || dialog).focus({ preventScroll: true });
        });
      } else if (!open && previous.open) {
        previous.open = false;
        dialogState.set(overlay, previous);
        if (previous.returnFocus?.isConnected) {
          window.requestAnimationFrame(() => previous.returnFocus?.focus({ preventScroll: true }));
        }
      }
    });

    document.body.classList.toggle("sv-dialog-open", anyOpen);
  }

  function openOverlays() {
    return Array.from(document.querySelectorAll(OVERLAY_SELECTOR)).filter(overlayIsOpen);
  }

  function closeButtonFor(overlay) {
    return overlay.querySelector([
      "[data-creator-lightbox-close]",
      "[data-legal-close]",
      "#sv-receta-cerrar",
      "[data-micro-label-close]",
      "[data-micro-saved-close]",
      "[data-micro-close]"
    ].join(","));
  }

  function handleTabKeys(event) {
    const tab = event.target instanceof Element ? event.target.closest("[role='tab']") : null;
    if (!tab) return false;
    const tablist = tab.closest("[role='tablist']");
    if (!tablist) return false;
    const tabs = tabsWithin(tablist).filter((item) => !item.disabled);
    const current = tabs.indexOf(tab);
    if (current < 0) return false;

    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return false;

    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
    return true;
  }

  function handleDialogKeys(event) {
    const overlays = openOverlays();
    const overlay = overlays[overlays.length - 1];
    if (!overlay) return;
    const dialog = overlay.matches("[role='dialog']") ? overlay : overlay.querySelector("[role='dialog']");
    if (!dialog) return;

    if (event.key === "Escape") {
      const close = closeButtonFor(overlay);
      if (close) {
        event.preventDefault();
        close.click();
        scheduleSync();
      }
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = focusableWithin(dialog);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

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

  function scheduleSync() {
    if (syncQueued) return;
    syncQueued = true;
    window.requestAnimationFrame(() => {
      syncQueued = false;
      syncTabs();
      syncDialogs();
    });
  }

  function init() {
    syncTabs();
    syncDialogs();
    document.addEventListener("click", scheduleSync);
    document.addEventListener("input", scheduleSync);
    document.addEventListener("change", scheduleSync);
    document.addEventListener("suitevet:viewchange", scheduleSync);
    document.addEventListener("keydown", (event) => {
      if (!handleTabKeys(event)) handleDialogKeys(event);
    });
  }

  window.SuiteVetUI = Object.freeze({ refresh: scheduleSync });
  document.addEventListener("DOMContentLoaded", init);
})();
