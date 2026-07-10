// =============================================================================
// SUITE VET 2.0 - modules/bibliografia/bibliografia.js
// Controlador para el módulo de Referencias Bibliográficas y Biblioteca Digital.
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initBibliografia();
  });

  // Escuchar cambio de vista para re-inicializar si es necesario
  document.addEventListener("suitevet:viewchange", (e) => {
    if (e.detail.view === "bibliografia") {
      initBibliografia();
    }
  });

  function initBibliografia() {
    const root = document.getElementById("bibliografia-root");
    if (!root) return;

    // Solo renderizar si el contenedor está vacío
    if (!root.innerHTML.trim()) {
      renderLayout(root);
      setupEvents(root);
    }
  }

  const MODULOS_ETIQUETAS = {
    fisio: "Fisiología",
    farma: "Farmacología",
    micro: "Microbiología",
    patologia: "Patología",
    nutricion: "Nutrición Animal",
    clinica: "Clínica Integrada",
    semiologia: "Semiología Pro",
    casos360: "Casos 360",
    favoritos: "Favoritos"
  };

  function renderLayout(root) {
    const data = window.BIBLIOGRAFIA_DATA || [];
    
    // Obtener los módulos que tienen libros para crear filtros dinámicos
    const modulosConLibros = [...new Set(data.map(item => item.modulo))];

    // Crear píldoras de filtro
    let filterPillsHtml = `<button class="sv-pill sv-pill-active" data-filter="all">Todos</button>`;
    modulosConLibros.forEach(mod => {
      const label = MODULOS_ETIQUETAS[mod] || mod.toUpperCase();
      filterPillsHtml += `<button class="sv-pill" data-filter="${mod}">${label}</button>`;
    });

    root.innerHTML = `
      <div class="sv-bib-module">
        <header class="sv-bib-header-section sv-module-header">
          <h2>Referencias Bibliográficas & Biblioteca</h2>
          <p class="sv-view-intro">Consulta las fuentes oficiales de estudio utilizadas para los contenidos de SUITE VET y descarga los libros en formato PDF.</p>
        </header>

        <!-- Sub-navegación / Pestañas -->
        <div class="sv-subnav" aria-label="Secciones de Bibliografia">
          <button class="sv-tab sv-tab-active" data-bib-tab="referencias" type="button">Citas y Referencias</button>
          <button class="sv-tab" data-bib-tab="biblioteca" type="button">Biblioteca Digital (Descargas)</button>
        </div>

        <!-- Panel 1: Referencias -->
        <div class="sv-pane sv-pane-active sv-module-panel" id="bib-pane-referencias">
          <div class="sv-bib-toolbar">
            <!-- Selector de formato APA/Vancouver -->
            <div class="sv-format-selector-wrap">
              <span class="sv-format-label">Formato de Cita:</span>
              <div class="sv-format-toggle-pill" id="sv-format-toggle">
                <button type="button" class="sv-format-btn active" data-format="apa">APA</button>
                <button type="button" class="sv-format-btn" data-format="vancouver">Vancouver</button>
              </div>
            </div>

            <!-- Filtros de Módulo -->
            <div class="sv-bib-filters">
              ${filterPillsHtml}
            </div>
          </div>

          <!-- Contenedor del listado de Citas -->
          <div class="sv-bib-format-container format-apa" id="sv-citations-list">
            ${renderCitations(data)}
          </div>
        </div>

        <!-- Panel 2: Biblioteca Digital -->
        <div class="sv-pane sv-module-panel" id="bib-pane-biblioteca">
          <div class="sv-bookshelf-grid">
            ${renderBookshelf(data)}
          </div>
        </div>
      </div>
    `;
  }

  function renderCitations(data) {
    if (!data.length) {
      return `
        <div class="sv-empty">
          <div class="sv-empty-icon">📚</div>
          <p>No hay referencias registradas.</p>
        </div>
      `;
    }

    return data.map((book) => {
      const tagLabel = MODULOS_ETIQUETAS[book.modulo] || book.modulo.toUpperCase();
      return `
        <div class="sv-card sv-bib-card" data-modulo="${book.modulo}">
          <div class="sv-bib-card-header">
            <span class="sv-badge sv-badge-module" data-mod="${book.modulo}">${tagLabel}</span>
            <span class="sv-bib-edition">${book.edicion} (${book.ano})</span>
          </div>
          <div class="sv-bib-card-body">
            <!-- Formato APA -->
            <p class="sv-citation-text sv-citation-apa">${book.apa}</p>
            <!-- Formato Vancouver -->
            <p class="sv-citation-text sv-citation-vancouver">${book.vancouver}</p>
          </div>
          <div class="sv-bib-card-footer">
            <button class="sv-btn sv-btn-sm sv-btn-secondary sv-copy-citation-btn" data-citation-id="${book.id}">
              📋 Copiar cita
            </button>
            ${book.descargaUrl ? `
              <a href="${book.descargaUrl}" download class="sv-btn sv-btn-sm sv-btn-ghost sv-bib-download-btn">
                📥 Descargar PDF
              </a>
            ` : ""}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderBookshelf(data) {
    if (!data.length) {
      return `
        <div class="sv-empty">
          <div class="sv-empty-icon">📖</div>
          <p>No hay libros en la biblioteca.</p>
        </div>
      `;
    }

    return data.map((book) => {
      return `
        <div class="sv-book-card">
          <!-- Portada Simulada en 3D -->
          <div class="sv-book-cover-3d" style="background: ${book.portadaGradient || 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}">
            <div class="sv-book-spine"></div>
            <div class="sv-book-cover-content">
              <span class="sv-book-cover-badge">${MODULOS_ETIQUETAS[book.modulo] || 'General'}</span>
              <h4 class="sv-book-cover-title">${book.tituloCorto || book.titulo}</h4>
              <p class="sv-book-cover-author">${book.autores}</p>
              <span class="sv-book-cover-year">${book.ano}</span>
            </div>
          </div>
          
          <!-- Detalles del Libro -->
          <div class="sv-book-details">
            <h3 class="sv-book-title">${book.titulo}</h3>
            <p class="sv-book-author">${book.autores}</p>
            <div class="sv-book-meta-info">
              <span>Edición: <strong>${book.edicion}</strong></span>
              <span>Editorial: <strong>${book.editorial}</strong></span>
            </div>
            ${book.descargaUrl ? `
              <a href="${book.descargaUrl}" download class="sv-btn sv-btn-primary sv-btn-full sv-book-download-btn">
                📥 Descargar libro (PDF)
              </a>
            ` : `
              <button class="sv-btn sv-btn-ghost sv-btn-full" disabled>No disponible</button>
            `}
          </div>
        </div>
      `;
    }).join("");
  }

  function setupEvents(root) {
    // 1. Alternar Pestañas (Referencias vs Biblioteca)
    const tabs = root.querySelectorAll("[data-bib-tab]");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("sv-tab-active"));
        tab.classList.add("sv-tab-active");

        const targetPaneId = `bib-pane-${tab.dataset.bibTab}`;
        root.querySelectorAll(".sv-pane").forEach(pane => {
          pane.classList.toggle("sv-pane-active", pane.id === targetPaneId);
        });
      });
    });

    // 2. Alternar Formato APA / Vancouver
    const toggle = root.querySelector("#sv-format-toggle");
    const citationsList = root.querySelector("#sv-citations-list");
    if (toggle && citationsList) {
      toggle.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-format]");
        if (!btn) return;

        toggle.querySelectorAll(".sv-format-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const format = btn.dataset.format;
        if (format === "apa") {
          citationsList.classList.remove("format-vancouver");
          citationsList.classList.add("format-apa");
        } else {
          citationsList.classList.remove("format-apa");
          citationsList.classList.add("format-vancouver");
        }
      });
    }

    // 3. Filtrar Referencias por Módulo
    const filterPills = root.querySelectorAll(".sv-bib-filters .sv-pill");
    filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        filterPills.forEach(p => p.classList.remove("sv-pill-active"));
        pill.classList.add("sv-pill-active");

        const filterValue = pill.dataset.filter;
        const cards = root.querySelectorAll(".sv-bib-card");
        cards.forEach(card => {
          if (filterValue === "all" || card.dataset.modulo === filterValue) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });

    // 4. Copiar Cita al Portapapeles
    root.addEventListener("click", async (e) => {
      const copyBtn = e.target.closest(".sv-copy-citation-btn");
      if (!copyBtn) return;

      const citationId = copyBtn.dataset.citationId;
      const bookData = (window.BIBLIOGRAFIA_DATA || []).find(b => b.id === citationId);
      if (!bookData) return;

      // Obtener el formato actualmente activo
      const isApaActive = citationsList && citationsList.classList.contains("format-apa");
      // Remover etiquetas HTML si la cita tiene etiquetas como <i>
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = isApaActive ? bookData.apa : bookData.vancouver;
      const citationText = tempDiv.textContent || tempDiv.innerText || "";

      try {
        await navigator.clipboard.writeText(citationText);
        
        // Efecto visual temporal en el botón
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "✓ ¡Copiado!";
        copyBtn.style.background = "var(--sv-success)";
        copyBtn.style.color = "#ffffff";
        copyBtn.style.borderColor = "var(--sv-success)";

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = "";
          copyBtn.style.color = "";
          copyBtn.style.borderColor = "";
        }, 1500);
      } catch (err) {
        console.error("No se pudo copiar la cita: ", err);
        alert("Ocurrió un error al copiar la cita.");
      }
    });
  }

})();
