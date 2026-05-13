// =============================================================================
// SUITE VET — modules/fisio/fisio.js
// Módulo de Fisiología: hormonas, vitaminas, glosario clínico.
// Los datos vienen de modules/fisio/data.js (window.FISIO_DATA)
// =============================================================================

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1. ESPERAR A QUE EL DOM ESTÉ LISTO
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("fisio-root");
    if (!root) return;

    const data = window.FISIO_DATA || { hormonas: [], vitaminas: [], glosario: [] };

    // ---------------------------------------------------------------------------
    // 2. INYECTAR HTML DEL MÓDULO
    // ---------------------------------------------------------------------------
    root.innerHTML = `
      <h2>Fisiología</h2>
      <p class="sv-view-intro">
        Módulo de estudio de fisiología veterinaria.
        Elige entre hormonas, vitaminas o el glosario clínico.
      </p>

      <!-- SUBNAV -->
      <div class="sv-subnav" id="fisio-subnav">
        <button class="sv-tab sv-tab-active" data-pane="hormonas">Hormonas</button>
        <button class="sv-tab" data-pane="vitaminas">Vitaminas</button>
        <button class="sv-tab" data-pane="glosario">Glosario clínico</button>
      </div>

      <!-- PANE: HORMONAS -->
      <div id="fisio-pane-hormonas" class="sv-pane sv-pane-active">
        <div class="sv-toolbar">
          <input type="text" id="fisio-search-hormona" class="sv-input" placeholder="Buscar por nombre o siglas (ej. progesterona, LH, T4)…" style="max-width:360px;" />
        </div>
        <div class="sv-toolbar" style="flex-wrap:wrap; gap:0.4rem;" id="fisio-filtros-sistema"></div>
        <div class="sv-grid" id="fisio-lista-hormonas"></div>
      </div>

      <!-- PANE: VITAMINAS -->
      <div id="fisio-pane-vitaminas" class="sv-pane">
        <div class="sv-toolbar">
          <input type="text" id="fisio-search-vitamina" class="sv-input" placeholder="Buscar vitamina (A, B1, K2, D2, tiamina, cobalamina…)" style="max-width:360px;" />
        </div>
        <div class="sv-grid" id="fisio-lista-vitaminas"></div>
      </div>

      <!-- PANE: GLOSARIO -->
      <div id="fisio-pane-glosario" class="sv-pane">
        <div class="sv-toolbar">
          <input type="text" id="fisio-search-glosario" class="sv-input" placeholder="Buscar término (ej. disuria, poliuria, prurito)…" style="max-width:360px;" />
          <select id="fisio-filtro-glosario-sistema" class="sv-select" style="max-width:200px;">
            <option value="">Todos los sistemas</option>
            <option value="Urinario">Urinario</option>
            <option value="Digestivo">Digestivo</option>
            <option value="Respiratorio">Respiratorio</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Neurológico">Neurológico</option>
            <option value="Dermatológico">Dermatológico</option>
            <option value="Sistémico">Sistémico</option>
          </select>
        </div>
        <div class="sv-grid" id="fisio-lista-glosario"></div>
      </div>
    `;

    // ---------------------------------------------------------------------------
    // 3. SUBNAV (TABS)
    // ---------------------------------------------------------------------------
    const tabs  = root.querySelectorAll(".sv-tab[data-pane]");
    const panes = root.querySelectorAll(".sv-pane");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t)  => t.classList.remove("sv-tab-active"));
        panes.forEach((p) => p.classList.remove("sv-pane-active"));
        tab.classList.add("sv-tab-active");
        root.querySelector(`#fisio-pane-${tab.dataset.pane}`)?.classList.add("sv-pane-active");
      });
    });

    // ---------------------------------------------------------------------------
    // 4. HORMONAS
    // ---------------------------------------------------------------------------
    const sistemas = [...new Set(data.hormonas.map((h) => h.sistemaKey).filter(Boolean))];
    const filtrosEl = root.querySelector("#fisio-filtros-sistema");
    let filtroSistema = "todos";

    // Botón "Todos"
    const btnTodos = document.createElement("button");
    btnTodos.className = "sv-pill sv-pill-active";
    btnTodos.textContent = "Todos";
    btnTodos.dataset.sistema = "todos";
    filtrosEl.appendChild(btnTodos);

    sistemas.forEach((s) => {
      const btn = document.createElement("button");
      btn.className = "sv-pill";
      btn.textContent = s.replace(/-/g, "/").replace(/\b\w/g, (c) => c.toUpperCase());
      btn.dataset.sistema = s;
      filtrosEl.appendChild(btn);
    });

    filtrosEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".sv-pill");
      if (!btn) return;
      filtroSistema = btn.dataset.sistema;
      filtrosEl.querySelectorAll(".sv-pill").forEach((b) => b.classList.remove("sv-pill-active"));
      btn.classList.add("sv-pill-active");
      renderHormonas();
    });

    const searchHormona = root.querySelector("#fisio-search-hormona");
    searchHormona?.addEventListener("input", renderHormonas);

    function renderHormonas() {
      const lista = root.querySelector("#fisio-lista-hormonas");
      const q = (searchHormona?.value || "").trim().toLowerCase();

      const filtradas = data.hormonas.filter((h) => {
        const pasaSistema = filtroSistema === "todos" || h.sistemaKey === filtroSistema;
        const base = `${h.nombre} ${h.sigla || ""} ${h.sistema}`.toLowerCase();
        return pasaSistema && (!q || base.includes(q));
      });

      lista.innerHTML = filtradas.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtradas.map(cardHormona).join("");
    }

    function cardHormona(h) {
      return `
        <article class="sv-card fisio-card-hormona sv-fade-in">
          <div class="sv-card-header">
            <span class="sv-card-title">${h.nombre}</span>
            <span class="fisio-badge-sistema">${h.sistema}</span>
          </div>
          ${h.sigla && h.sigla !== "-" ? `<span class="sv-card-subtitle">Sigla: ${h.sigla}</span>` : ""}
          <div class="sv-card-body">
            <p class="fisio-campo"><strong>Origen:</strong> ${h.origenLiberacion}</p>
            <p class="fisio-campo"><strong>Función principal:</strong> ${h.funcionPrincipal}</p>
            <p class="fisio-campo"><strong>Función secundaria:</strong> ${h.funcionSecundaria}</p>
            <p class="fisio-campo"><strong>Patología:</strong> ${h.patologia}</p>
          </div>
          <div class="fisio-card-footer">
            <p class="fisio-campo"><strong>Especie:</strong> ${h.especieVariacion}</p>
            <p class="fisio-campo"><strong>Farmacología:</strong> ${h.afeccionesFarmaco}</p>
          </div>
        </article>`;
    }

    // ---------------------------------------------------------------------------
    // 5. VITAMINAS
    // ---------------------------------------------------------------------------
    const searchVitamina = root.querySelector("#fisio-search-vitamina");
    searchVitamina?.addEventListener("input", renderVitaminas);

    function renderVitaminas() {
      const lista = root.querySelector("#fisio-lista-vitaminas");
      const q = (searchVitamina?.value || "").trim().toLowerCase();

      const filtradas = data.vitaminas.filter((v) => {
        const base = `${v.nombre} ${v.sigla || ""} ${v.otrosNombres || ""} ${v.tipo || ""}`.toLowerCase();
        return !q || base.includes(q);
      });

      lista.innerHTML = filtradas.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtradas.map(cardVitamina).join("");
    }

    function cardVitamina(v) {
      return `
        <article class="sv-card fisio-card-vitamina sv-fade-in">
          <div class="sv-card-header">
            <span class="sv-card-title">${v.nombre}</span>
            <span class="sv-badge sv-badge-purple">${v.tipo}</span>
          </div>
          ${v.otrosNombres ? `<span class="sv-card-subtitle">${v.otrosNombres}</span>` : ""}
          <div class="sv-card-body">
            <p class="fisio-campo"><strong>Función:</strong> ${v.funcion}</p>
            <p class="fisio-campo"><strong>Hipovitaminosis:</strong> ${v.hipovitaminosis}</p>
            <p class="fisio-campo"><strong>Hipervitaminosis:</strong> ${v.hipervitaminosis}</p>
          </div>
          <div class="fisio-card-footer">
            <p class="fisio-campo"><strong>Especie:</strong> ${v.variacionEspecies}</p>
            <p class="fisio-campo"><strong>Farmacología:</strong> ${v.afeccionesFarmaco}</p>
          </div>
        </article>`;
    }

    // ---------------------------------------------------------------------------
    // 6. GLOSARIO
    // ---------------------------------------------------------------------------
    const searchGlosario = root.querySelector("#fisio-search-glosario");
    const filtroSistemaGlosario = root.querySelector("#fisio-filtro-glosario-sistema");

    searchGlosario?.addEventListener("input", renderGlosario);
    filtroSistemaGlosario?.addEventListener("change", renderGlosario);

    function renderGlosario() {
      const lista = root.querySelector("#fisio-lista-glosario");
      const q = (searchGlosario?.value || "").trim().toLowerCase();
      const sis = filtroSistemaGlosario?.value || "";

      // Si hay datos locales en data.glosario los usamos; si no, mostramos aviso de API
      if (!data.glosario || data.glosario.length === 0) {
        lista.innerHTML = `<div class="sv-empty"><div class="sv-empty-icon">🌐</div>El glosario se carga desde el servidor local (localhost:3000).<br>Inicia el servidor para verlo.</div>`;
        return;
      }

      const filtrados = data.glosario.filter((g) => {
        const base = `${g.termino || ""} ${g.definicion || ""} ${g.sistema || ""}`.toLowerCase();
        const pasaSistema = !sis || g.sistema === sis;
        return pasaSistema && (!q || base.includes(q));
      });

      lista.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtrados.map(cardGlosario).join("");
    }

    function cardGlosario(g) {
      return `
        <article class="sv-card fisio-card-glosario sv-fade-in">
          <div class="sv-card-header">
            <span class="sv-card-title">${g.termino}</span>
            <span class="sv-badge sv-badge-cyan">${g.sistema || ""}</span>
          </div>
          <div class="sv-card-body">
            <p class="fisio-campo">${g.definicion || ""}</p>
          </div>
        </article>`;
    }

    // ---------------------------------------------------------------------------
    // 7. RENDER INICIAL
    // ---------------------------------------------------------------------------
    renderHormonas();
    renderVitaminas();
    renderGlosario();

    // ---------------------------------------------------------------------------
    // 8. REGISTRO EN BUSCADOR GLOBAL
    // ---------------------------------------------------------------------------
    if (window.SuiteVet?.registerSearch) {
      window.SuiteVet.registerSearch("fisio", (q) => {
        const results = [];
        data.hormonas.forEach((h) => {
          if (`${h.nombre} ${h.sigla} ${h.sistema}`.toLowerCase().includes(q)) {
            results.push({
              title: h.nombre,
              subtitle: h.sistema,
              moduleId: "fisio",
              action: () => {
                window.SuiteVet.showView("fisiologia");
                if (searchHormona) { searchHormona.value = h.nombre; renderHormonas(); }
              }
            });
          }
        });
        data.vitaminas.forEach((v) => {
          if (`${v.nombre} ${v.sigla} ${v.otrosNombres}`.toLowerCase().includes(q)) {
            results.push({
              title: v.nombre,
              subtitle: v.tipo,
              moduleId: "fisio",
              action: () => {
                window.SuiteVet.showView("fisiologia");
                tabs.forEach((t)  => t.classList.remove("sv-tab-active"));
                panes.forEach((p) => p.classList.remove("sv-pane-active"));
                root.querySelector('[data-pane="vitaminas"]')?.classList.add("sv-tab-active");
                root.querySelector("#fisio-pane-vitaminas")?.classList.add("sv-pane-active");
                if (searchVitamina) { searchVitamina.value = v.nombre; renderVitaminas(); }
              }
            });
          }
        });
        return results;
      });
    }
  });
})();
