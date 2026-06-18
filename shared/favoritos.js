// =============================================================================
// SUITE VET - Favoritos globales
// Marca tarjetas con long press y centraliza preparaciones/etiquetas favoritas.
// =============================================================================

(function () {
  "use strict";

  window.SuiteVet = window.SuiteVet || {};

  const STORAGE_KEY = "suiteVetFavorites";
  const PRESS_MS = 700;
  const MOVE_TOLERANCE = 14;
  const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, label, [role='button'], [contenteditable='true']";
  let currentSort = "recientes";

  function getFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveFavorites(favorites) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(favorites) ? favorites : []));
    } catch (error) {
      console.warn("[SuiteVet] No se pudieron guardar favoritos:", error);
      showToast("No se pudo guardar favoritos en este navegador.");
    }
  }

  function normalizeFavorite(item) {
    const raw = item || {};
    const id = String(raw.id || raw.favId || slugify(raw.titulo || raw.title || "favorito"));
    const titulo = String(raw.titulo || raw.title || raw.nombre || "Favorito");

    return {
      id,
      titulo,
      modulo: String(raw.modulo || "SUITE VET"),
      submodulo: String(raw.submodulo || raw.categoria || "General"),
      tipo: String(raw.tipo || "Tarjeta"),
      descripcion: String(raw.descripcion || ""),
      fechaAgregado: raw.fechaAgregado || new Date().toISOString(),
      data: raw.data && typeof raw.data === "object" ? raw.data : {}
    };
  }

  function addFavorite(item) {
    const favorite = normalizeFavorite(item);
    const favorites = getFavorites().filter((entry) => entry.id !== favorite.id);
    favorites.unshift(favorite);
    saveFavorites(favorites);
    notifyFavoritesChange(favorite.id);
    return favorite;
  }

  function removeFavorite(id) {
    const favoriteId = String(id || "");
    const favorites = getFavorites();
    const next = favorites.filter((entry) => entry.id !== favoriteId);
    saveFavorites(next);
    notifyFavoritesChange(favoriteId);
  }

  function isFavorite(id) {
    const favoriteId = String(id || "");
    return getFavorites().some((entry) => entry.id === favoriteId);
  }

  function toggleFavorite(item, options = {}) {
    const favorite = normalizeFavorite(item);
    const exists = isFavorite(favorite.id);

    if (exists) {
      removeFavorite(favorite.id);
      showToast(options.removedMessage || "Eliminado de favoritos");
      return { added: false, favorite };
    }

    const saved = addFavorite(favorite);
    showToast(options.addedMessage || "Agregado a favoritos");
    return { added: true, favorite: saved };
  }

  function clearFavorites() {
    saveFavorites([]);
    notifyFavoritesChange("");
  }

  function bindWithin(scope = document) {
    if (!scope) return;
    if (scope.matches?.("[data-fav-id]")) bindCard(scope);
    scope.querySelectorAll?.("[data-fav-id]").forEach(bindCard);
  }

  function bindCard(card) {
    if (!card || card.dataset.favoriteBound === "true") {
      refreshCard(card);
      return;
    }

    card.dataset.favoriteBound = "true";
    card.classList.add("sv-favorite-source");

    let timer = null;
    let startX = 0;
    let startY = 0;
    let suppressClick = false;

    function pointFromEvent(event) {
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      return {
        x: touch ? touch.clientX : event.clientX,
        y: touch ? touch.clientY : event.clientY
      };
    }

    function startPress(event) {
      if (event.type === "mousedown" && event.button !== 0) return;
      if (event.target?.closest?.(INTERACTIVE_SELECTOR)) return;

      const point = pointFromEvent(event);
      startX = point.x || 0;
      startY = point.y || 0;
      clearTimeout(timer);
      card.classList.add("sv-longpress-ready");

      timer = setTimeout(() => {
        timer = null;
        suppressClick = true;
        card.classList.add("sv-longpress-fired");
        toggleFavorite(favoriteFromElement(card));
        window.setTimeout(() => card.classList.remove("sv-longpress-fired"), 260);
        window.setTimeout(() => { suppressClick = false; }, 450);
      }, PRESS_MS);
    }

    function cancelPress() {
      clearTimeout(timer);
      timer = null;
      card.classList.remove("sv-longpress-ready");
    }

    function movePress(event) {
      if (!timer) return;
      const point = pointFromEvent(event);
      const dx = Math.abs((point.x || 0) - startX);
      const dy = Math.abs((point.y || 0) - startY);
      if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) cancelPress();
    }

    card.addEventListener("mousedown", startPress);
    card.addEventListener("mouseup", cancelPress);
    card.addEventListener("mouseleave", cancelPress);
    card.addEventListener("mousemove", movePress);
    card.addEventListener("touchstart", startPress, { passive: true });
    card.addEventListener("touchend", cancelPress);
    card.addEventListener("touchcancel", cancelPress);
    card.addEventListener("touchmove", movePress, { passive: true });
    card.addEventListener("click", (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
    }, true);

    refreshCard(card);
  }

  function favoriteFromElement(card) {
    const data = parseJson(card.dataset.favData);
    return {
      id: card.dataset.favId,
      titulo: card.dataset.favTitle || card.dataset.favTitulo || card.textContent?.trim() || "Favorito",
      modulo: card.dataset.favModule || card.dataset.favModulo || "SUITE VET",
      submodulo: card.dataset.favSubmodule || card.dataset.favSubmodulo || "General",
      tipo: card.dataset.favType || card.dataset.favTipo || "Tarjeta",
      descripcion: card.dataset.favDescription || card.dataset.favDescripcion || "",
      data
    };
  }

  function refreshAll() {
    document.querySelectorAll("[data-fav-id]").forEach(refreshCard);
    updateTopbarState();
    renderIfOpen();
  }

  function refreshCard(card) {
    if (!card?.dataset?.favId) return;
    const active = isFavorite(card.dataset.favId);
    card.classList.toggle("sv-is-favorite", active);

    let star = Array.from(card.children || []).find((child) => child.classList?.contains("sv-favorite-star"));
    if (active && !star) {
      star = document.createElement("span");
      star.className = "sv-favorite-star";
      star.setAttribute("aria-hidden", "true");
      star.textContent = "\u2605";
      card.appendChild(star);
    }

    if (!active && star) star.remove();
  }

  function renderView(sortBy = currentSort) {
    const root = document.getElementById("favoritos-root");
    if (!root) return;

    currentSort = sortBy;
    const favorites = getFavorites();
    const sorted = sortFavorites(favorites, sortBy);
    const total = favorites.length;

    root.innerHTML = `
      <section class="sv-favorites-shell">
        <header class="sv-favorites-header">
          <div>
            <span class="sv-favorites-kicker">SUITE VET</span>
            <h2>Favoritos</h2>
            <p>Elementos guardados para estudiar rapido desde Fisiologia, Farmacologia y Microbiologia.</p>
          </div>
          <strong class="sv-favorites-total">${total}</strong>
        </header>

        <div class="sv-favorites-toolbar">
          <label>
            <span>Ordenar por</span>
            <select id="sv-favorites-sort" class="sv-select">
              <option value="recientes"${sortBy === "recientes" ? " selected" : ""}>Recientes</option>
              <option value="modulo"${sortBy === "modulo" ? " selected" : ""}>Modulo</option>
              <option value="submodulo"${sortBy === "submodulo" ? " selected" : ""}>Submodulo</option>
              <option value="tipo"${sortBy === "tipo" ? " selected" : ""}>Tipo</option>
            </select>
          </label>
        </div>

        <div class="sv-favorites-content">
          ${total ? renderFavoritesList(sorted, sortBy) : renderEmptyState()}
        </div>
      </section>
    `;

    root.querySelector("#sv-favorites-sort")?.addEventListener("change", (event) => {
      renderView(event.target.value);
    });

    root.querySelectorAll("[data-fav-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        removeFavorite(button.dataset.favRemove);
        showToast("Eliminado de favoritos");
      });
    });
  }

  function renderFavoritesList(favorites, sortBy) {
    if (sortBy === "recientes") {
      return `<div class="sv-favorites-grid">${favorites.map(renderFavoriteCard).join("")}</div>`;
    }

    const grouped = groupBy(favorites, (entry) => entry[sortBy] || "Sin clasificar");
    return Array.from(grouped.entries()).map(([groupName, items]) => `
      <section class="sv-favorites-group">
        <h3>${escapeHtml(groupName)}</h3>
        <div class="sv-favorites-grid">${items.map(renderFavoriteCard).join("")}</div>
      </section>
    `).join("");
  }

  function renderFavoriteCard(favorite) {
    const fecha = formatFavoriteDate(favorite.fechaAgregado);
    const meta = [favorite.modulo, favorite.submodulo, favorite.tipo].filter(Boolean).join(" · ");
    return `
      <article class="sv-favorite-card">
        <div class="sv-favorite-card-head">
          <span class="sv-favorite-card-star">&#9733;</span>
          <div>
            <h3>${escapeHtml(favorite.titulo)}</h3>
            <p>${escapeHtml(meta)}</p>
          </div>
        </div>
        ${favorite.descripcion ? `<p class="sv-favorite-card-desc">${escapeHtml(favorite.descripcion)}</p>` : ""}
        <div class="sv-favorite-card-foot">
          <time>${escapeHtml(fecha)}</time>
          <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-fav-remove="${escapeAttr(favorite.id)}">Eliminar</button>
        </div>
      </article>
    `;
  }

  function renderEmptyState() {
    return `
      <div class="sv-favorites-empty">
        <strong>&#9734;</strong>
        <h3>Aun no hay favoritos</h3>
        <p>Manten presionada una tarjeta por un momento para guardarla aqui.</p>
      </div>
    `;
  }

  function sortFavorites(favorites, sortBy) {
    const list = [...favorites];
    if (sortBy === "modulo" || sortBy === "submodulo" || sortBy === "tipo") {
      return list.sort((a, b) =>
        String(a[sortBy] || "").localeCompare(String(b[sortBy] || ""), "es") ||
        String(a.titulo || "").localeCompare(String(b.titulo || ""), "es")
      );
    }

    return list.sort((a, b) => new Date(b.fechaAgregado || 0) - new Date(a.fechaAgregado || 0));
  }

  function groupBy(items, getKey) {
    const groups = new Map();
    items.forEach((item) => {
      const key = getKey(item);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return groups;
  }

  function notifyFavoritesChange(id) {
    document.dispatchEvent(new CustomEvent("suitevet:favoriteschange", { detail: { id } }));
  }

  function updateTopbarState() {
    const button = document.getElementById("sv-favorites-toggle");
    const countEl = document.getElementById("sv-favorites-count");
    const count = getFavorites().length;

    if (button) {
      button.classList.toggle("has-favorites", count > 0);
      button.classList.toggle("is-active", window.SuiteVet?.currentView === "favoritos");
      button.setAttribute("title", count ? `Favoritos (${count})` : "Favoritos");
      button.setAttribute("aria-label", count ? `Abrir favoritos, ${count} guardados` : "Abrir favoritos");
    }

    if (countEl) {
      countEl.textContent = String(count);
      countEl.hidden = count === 0;
    }
  }

  function renderIfOpen() {
    if (window.SuiteVet?.currentView === "favoritos") renderView(currentSort);
  }

  function showToast(message) {
    const old = document.getElementById("sv-toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.id = "sv-toast";
    toast.className = "sv-toast sv-fade-in";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2400);
  }

  function parseJson(value) {
    if (!value) return {};
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "favorito";
  }

  function formatFavoriteDate(value) {
    const date = new Date(value || Date.now());
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
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

  document.addEventListener("DOMContentLoaded", () => {
    bindWithin(document);
    updateTopbarState();
    renderView(currentSort);

    document.getElementById("sv-favorites-toggle")?.addEventListener("click", () => {
      window.SuiteVet?.showView?.("favoritos");
    });
  });

  document.addEventListener("suitevet:favoriteschange", refreshAll);
  document.addEventListener("suitevet:viewchange", (event) => {
    updateTopbarState();
    if (event.detail?.view === "favoritos") renderView(currentSort);
  });

  window.SuiteVet.Favorites = {
    STORAGE_KEY,
    getFavorites,
    saveFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    bindCard,
    bindWithin,
    refreshAll,
    renderView,
    showToast,
    slugify
  };
})();
