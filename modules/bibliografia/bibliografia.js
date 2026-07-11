// =============================================================================
// SUITE VET - modules/bibliografia/bibliografia.js
// UI progresiva para citas y biblioteca digital; no inserta metadatos con HTML.
// =============================================================================

(function () {
  "use strict";

  const MODULE_LABELS = Object.freeze({
    fisio: "Fisiología"
  });
  let lastRenderSignature = null;

  document.addEventListener("DOMContentLoaded", initBibliography);
  document.addEventListener("suitevet:viewchange", (event) => {
    if (event.detail.view === "bibliografia") initBibliography();
  });
  document.addEventListener("suitevet:bibliographyready", initBibliography);

  function createText(tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = value == null ? "" : String(value);
    return element;
  }

  function resources() {
    return window.SuiteVetBibliography?.getResources?.() || [];
  }

  function initBibliography() {
    const root = document.getElementById("bibliografia-root");
    if (!root) return;
    if (!root.dataset.bibInitialized) {
      renderLayout(root);
      setupEvents(root);
      root.dataset.bibInitialized = "true";
    }
    renderResources(root);
  }

  function renderLayout(root) {
    // Estructura fija local. Los metadatos se agregan despues con textContent.
    root.innerHTML = `
      <div class="sv-bib-module">
        <header class="sv-bib-header-section sv-module-header">
          <h2>Referencias Bibliográficas &amp; Biblioteca</h2>
          <p class="sv-view-intro">Consulta las fuentes oficiales de estudio utilizadas para los contenidos de SUITE VET y descarga los libros en formato PDF.</p>
        </header>
        <div class="sv-subnav" aria-label="Secciones de Bibliografía">
          <button class="sv-tab sv-tab-active" data-bib-tab="referencias" type="button">Citas y Referencias</button>
          <button class="sv-tab" data-bib-tab="biblioteca" type="button">Biblioteca Digital (Descargas)</button>
        </div>
        <div class="sv-pane sv-pane-active sv-module-panel" id="bib-pane-referencias">
          <div class="sv-bib-toolbar">
            <div class="sv-format-selector-wrap">
              <span class="sv-format-label">Formato de Cita:</span>
              <div class="sv-format-toggle-pill" id="sv-format-toggle">
                <button type="button" class="sv-format-btn active" data-format="apa">APA</button>
                <button type="button" class="sv-format-btn" data-format="vancouver">Vancouver</button>
              </div>
            </div>
            <div class="sv-bib-filters" aria-label="Filtrar referencias"></div>
          </div>
          <div class="sv-bib-format-container format-apa" id="sv-citations-list"></div>
        </div>
        <div class="sv-pane sv-module-panel" id="bib-pane-biblioteca">
          <div class="sv-bookshelf-grid"></div>
        </div>
      </div>
    `;
  }

  function renderResources(root) {
    const items = resources();
    const filter = root.dataset.bibFilter || "all";
    const signature = JSON.stringify({
      filter,
      items: items.map((item) => [
        item.id, item.module_id, item.title, item.short_title, item.authors,
        item.year, item.edition, item.publisher, item.citation_apa,
        item.citation_vancouver, item.asset_key, item.file_available,
        item.rights_status, item.source_status
      ])
    });
    if (signature === lastRenderSignature) return;
    lastRenderSignature = signature;

    renderFilters(root, items, filter);
    renderCitations(root, items, filter);
    renderBookshelf(root, items);
  }

  function createEmpty(message, icon) {
    const empty = document.createElement("div");
    empty.className = "sv-empty";
    empty.append(createText("div", "sv-empty-icon", icon), createText("p", "", message));
    return empty;
  }

  function renderFilters(root, items, selectedFilter) {
    const container = root.querySelector(".sv-bib-filters");
    if (!container) return;
    const moduleIds = [...new Set(items.map((item) => item.module_id))];
    const activeFilter = selectedFilter === "all" || moduleIds.includes(selectedFilter)
      ? selectedFilter
      : "all";
    root.dataset.bibFilter = activeFilter;

    const filters = ["all", ...moduleIds].map((moduleId) => {
      const button = createText(
        "button",
        `sv-pill${moduleId === activeFilter ? " sv-pill-active" : ""}`,
        moduleId === "all" ? "Todos" : (MODULE_LABELS[moduleId] || moduleId)
      );
      button.type = "button";
      button.dataset.filter = moduleId;
      return button;
    });
    container.replaceChildren(...filters);
  }

  function createCitationCard(resource) {
    const card = document.createElement("div");
    card.className = "sv-card sv-bib-card";
    card.dataset.module = resource.module_id;
    card.dataset.resourceId = resource.id;

    const header = document.createElement("div");
    header.className = "sv-bib-card-header";
    const badge = createText("span", "sv-badge sv-badge-module", MODULE_LABELS[resource.module_id] || resource.module_id);
    badge.dataset.mod = resource.module_id;
    header.appendChild(badge);
    if (resource.edition || resource.year) {
      header.appendChild(createText(
        "span",
        "sv-bib-edition",
        `${resource.edition || ""}${resource.edition && resource.year ? " " : ""}${resource.year ? `(${resource.year})` : ""}`
      ));
    }

    const body = document.createElement("div");
    body.className = "sv-bib-card-body";
    body.appendChild(createText("p", "sv-citation-text sv-citation-apa", resource.citation_apa || "Cita APA por verificar."));
    body.appendChild(createText("p", "sv-citation-text sv-citation-vancouver", resource.citation_vancouver || "Cita Vancouver por verificar."));

    const footer = document.createElement("div");
    footer.className = "sv-bib-card-footer";
    const copy = createText("button", "sv-btn sv-btn-sm sv-btn-secondary sv-copy-citation-btn", "📋 Copiar cita");
    copy.type = "button";
    copy.dataset.citationId = resource.id;
    footer.appendChild(copy);
    const assetPath = window.SuiteVetBibliography?.getAssetPath?.(resource.asset_key);
    if (resource.file_available && assetPath) {
      const download = createText("a", "sv-btn sv-btn-sm sv-btn-ghost sv-bib-download-btn", "📥 Descargar PDF");
      download.href = assetPath;
      download.download = "";
      footer.appendChild(download);
    }

    card.append(header, body, footer);
    return card;
  }

  function renderCitations(root, items, filter) {
    const container = root.querySelector("#sv-citations-list");
    if (!container) return;
    const visibleItems = items.filter((item) => filter === "all" || item.module_id === filter);
    container.replaceChildren(...(visibleItems.length
      ? visibleItems.map(createCitationCard)
      : [createEmpty("No hay referencias registradas.", "📚")]));
  }

  function createBookCard(resource) {
    const card = document.createElement("div");
    card.className = "sv-book-card";
    const cover = document.createElement("div");
    cover.className = `sv-book-cover-3d sv-bib-cover-${resource.module_id}`;
    cover.appendChild(document.createElement("div")).className = "sv-book-spine";
    const coverContent = document.createElement("div");
    coverContent.className = "sv-book-cover-content";
    coverContent.append(
      createText("span", "sv-book-cover-badge", MODULE_LABELS[resource.module_id] || "General"),
      createText("h4", "sv-book-cover-title", resource.short_title || resource.title),
      createText("p", "sv-book-cover-author", resource.authors.join(", ")),
      createText("span", "sv-book-cover-year", resource.year || "")
    );
    cover.appendChild(coverContent);

    const details = document.createElement("div");
    details.className = "sv-book-details";
    details.append(
      createText("h3", "sv-book-title", resource.title),
      createText("p", "sv-book-author", resource.authors.join(", "))
    );
    const meta = document.createElement("div");
    meta.className = "sv-book-meta-info";
    if (resource.edition) meta.appendChild(createText("span", "", `Edición: ${resource.edition}`));
    if (resource.publisher) meta.appendChild(createText("span", "", `Editorial: ${resource.publisher}`));
    if (meta.childElementCount) details.appendChild(meta);
    if (resource.rights_status === "unverified" || resource.source_status === "unverified") {
      details.appendChild(createText("p", "sv-bib-rights-note", "Fuente o derechos por verificar"));
    }

    const assetPath = window.SuiteVetBibliography?.getAssetPath?.(resource.asset_key);
    if (resource.file_available && assetPath) {
      const download = createText("a", "sv-btn sv-btn-primary sv-btn-full sv-book-download-btn", "📥 Descargar libro (PDF)");
      download.href = assetPath;
      download.download = "";
      details.appendChild(download);
    } else {
      const unavailable = createText("button", "sv-btn sv-btn-ghost sv-btn-full", "No disponible");
      unavailable.type = "button";
      unavailable.disabled = true;
      details.appendChild(unavailable);
    }
    card.append(cover, details);
    return card;
  }

  function renderBookshelf(root, items) {
    const container = root.querySelector(".sv-bookshelf-grid");
    if (!container) return;
    container.replaceChildren(...(items.length
      ? items.map(createBookCard)
      : [createEmpty("No hay libros en la biblioteca.", "📖")]));
  }

  function setFormat(root, format) {
    const citations = root.querySelector("#sv-citations-list");
    if (!citations) return;
    citations.classList.toggle("format-apa", format === "apa");
    citations.classList.toggle("format-vancouver", format === "vancouver");
    root.querySelectorAll(".sv-format-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.format === format);
    });
  }

  async function copyCitation(root, button) {
    const resource = window.SuiteVetBibliography?.getResource?.(button.dataset.citationId);
    if (!resource) return;
    const isApa = root.querySelector("#sv-citations-list")?.classList.contains("format-apa");
    const citation = isApa ? resource.citation_apa : resource.citation_vancouver;
    if (!citation) return;

    try {
      await navigator.clipboard.writeText(citation);
      const originalText = button.textContent;
      button.textContent = "✓ ¡Copiado!";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("is-copied");
      }, 1500);
    } catch (_error) {
      button.textContent = "No se pudo copiar";
      window.setTimeout(() => { button.textContent = "📋 Copiar cita"; }, 1500);
    }
  }

  function setupEvents(root) {
    root.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-bib-tab], [data-format], [data-filter], .sv-copy-citation-btn");
      if (!target) return;

      if (target.dataset.bibTab) {
        root.querySelectorAll("[data-bib-tab]").forEach((tab) => tab.classList.toggle("sv-tab-active", tab === target));
        root.querySelectorAll(".sv-pane").forEach((pane) => {
          pane.classList.toggle("sv-pane-active", pane.id === `bib-pane-${target.dataset.bibTab}`);
        });
      } else if (target.dataset.format) {
        setFormat(root, target.dataset.format);
      } else if (target.dataset.filter) {
        root.dataset.bibFilter = target.dataset.filter;
        renderResources(root);
      } else if (target.classList.contains("sv-copy-citation-btn")) {
        void copyCitation(root, target);
      }
    });
  }
})();
