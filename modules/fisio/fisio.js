// =============================================================================
// SUITE VET 2.0 — modules/fisio/fisio.js
// Módulo de Fisiología: colores por sistema fisiológico + vitaminas por tipo.
//
// BUGS CORREGIDOS:
//   #1 — Badge usa hex + "40" para opacidad → reemplazado por rgba() explícito
//   #2 — Hover perdía glow del sistema → se pasan --card-color y --card-glow
//   #3 — data.js puede tener sigla undefined → guard robusto
//   #4 — length sobre arrays opcionales → fallback seguro
//   #5 — Separación clara de listeners de hormonas vs vitaminas
// =============================================================================

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // MAPA DE COLORES POR SISTEMA FISIOLÓGICO
  // Para agregar un sistema: añadir clave con color, bg, glow, icon, label
  // ---------------------------------------------------------------------------
  const SISTEMA_VISUAL = {
    "homeostasis": {
      color: "#8b5cf6",
      bg:    "rgba(139,92,246,0.12)",
      glow:  "rgba(139,92,246,0.26)",
      icon:  "HI",
      label: "Homeostasis"
    },
    "digestivo": {
      color: "#14b8a6",
      bg:    "rgba(20,184,166,0.12)",
      glow:  "rgba(20,184,166,0.28)",
      icon:  "🍽️",
      label: "Digestivo"
    },
    "respiratorio": {
      color: "#0ea5e9",
      bg:    "rgba(14,165,233,0.12)",
      glow:  "rgba(14,165,233,0.26)",
      icon:  "RS",
      label: "Respiratorio"
    },
    "respiratorio-cardiaco": {
      color: "#0ea5e9",
      bg:    "rgba(14,165,233,0.12)",
      glow:  "rgba(14,165,233,0.26)",
      icon:  "🫁",
      label: "Resp./Cardíaco"
    },
    "cardiovascular-linfatico": {
      color: "#fb7185",
      bg:    "rgba(251,113,133,0.12)",
      glow:  "rgba(251,113,133,0.26)",
      icon:  "CL",
      label: "Cardio/Linfático"
    },
    "hematologico": {
      color: "#ef4444",
      bg:    "rgba(239,68,68,0.12)",
      glow:  "rgba(239,68,68,0.26)",
      icon:  "HB",
      label: "Hematológico"
    },
    "hepatico": {
      color: "#84cc16",
      bg:    "rgba(132,204,22,0.12)",
      glow:  "rgba(132,204,22,0.24)",
      icon:  "HP",
      label: "Hepático"
    },
    "dolor-nocicepcion": {
      color: "#f43f5e",
      bg:    "rgba(244,63,94,0.12)",
      glow:  "rgba(244,63,94,0.25)",
      icon:  "DN",
      label: "Dolor/Nocicepción"
    },
    "muscular": {
      color: "#d97706",
      bg:    "rgba(217,119,6,0.12)",
      glow:  "rgba(217,119,6,0.24)",
      icon:  "MU",
      label: "Muscular"
    },
    "enterico": {
      color: "#22c55e",
      bg:    "rgba(34,197,94,0.12)",
      glow:  "rgba(34,197,94,0.24)",
      icon:  "SE",
      label: "Entérico"
    },
    "clinico-general": {
      color: "#94a3b8",
      bg:    "rgba(148,163,184,0.12)",
      glow:  "rgba(148,163,184,0.20)",
      icon:  "CG",
      label: "Clínico general"
    },
    "cardiaco-circulatorio": {
      color: "#e11d48",
      bg:    "rgba(225,29,72,0.12)",
      glow:  "rgba(225,29,72,0.26)",
      icon:  "❤️",
      label: "Cardíaco/Circulat."
    },
    "nervioso-neuroendocrino": {
      color: "#a78bfa",
      bg:    "rgba(167,139,250,0.12)",
      glow:  "rgba(167,139,250,0.26)",
      icon:  "🧠",
      label: "Nervioso"
    },
    "renal": {
      color: "#38bdf8",
      bg:    "rgba(56,189,248,0.12)",
      glow:  "rgba(56,189,248,0.26)",
      icon:  "🫘",
      label: "Renal"
    },
    "renal-metabolico": {
      color: "#6366f1",
      bg:    "rgba(99,102,241,0.12)",
      glow:  "rgba(99,102,241,0.26)",
      icon:  "⚗️",
      label: "Renal/Metabólico"
    },
    "reproductivo": {
      color: "#ec4899",
      bg:    "rgba(236,72,153,0.12)",
      glow:  "rgba(236,72,153,0.26)",
      icon:  "🔬",
      label: "Reproductivo"
    },
    "endocrino-metabolico": {
      color: "#f59e0b",
      bg:    "rgba(245,158,11,0.12)",
      glow:  "rgba(245,158,11,0.26)",
      icon:  "⚡",
      label: "Endocrino"
    },
    "inmunologico": {
      color: "#10b981",
      bg:    "rgba(16,185,129,0.12)",
      glow:  "rgba(16,185,129,0.26)",
      icon:  "🛡️",
      label: "Inmunológico"
    },
    "oseo-piel": {
      color: "#f97316",
      bg:    "rgba(249,115,22,0.12)",
      glow:  "rgba(249,115,22,0.26)",
      icon:  "🦴",
      label: "Óseo/Piel"
    }
  };

  const SISTEMA_DEFAULT = {
    color: "#9ca3af",
    bg:    "rgba(156,163,175,0.12)",
    glow:  "rgba(156,163,175,0.18)",
    icon:  "🔬",
    label: "General"
  };

  // ---------------------------------------------------------------------------
  // MAPA DE TIPOS DE VITAMINA
  // ---------------------------------------------------------------------------
  const VITAMINA_VISUAL = {
    "liposoluble":  {
      badgeClass:  "fisio-badge-vitamina fisio-badge-liposoluble",
      icon:        "☀️",
      label:       "Liposoluble",
      cardColor:   "#f59e0b",
      cardGlow:    "rgba(245,158,11,0.26)"
    },
    "hidrosoluble": {
      badgeClass:  "fisio-badge-vitamina fisio-badge-hidrosoluble",
      icon:        "💧",
      label:       "Hidrosoluble",
      cardColor:   "#06b6d4",
      cardGlow:    "rgba(6,182,212,0.26)"
    }
  };

  // ---------------------------------------------------------------------------
  // HELPERS — robustos ante campos undefined
  // ---------------------------------------------------------------------------
  function getSistema(key) {
    return SISTEMA_VISUAL[key || ""] || SISTEMA_DEFAULT;
  }

  function getVitamina(tipoKey) {
    const k = (tipoKey || "").toLowerCase().trim();
    return VITAMINA_VISUAL[k] || VITAMINA_VISUAL["liposoluble"];
  }

  // BUG FIX #1: genera el color del borde del badge de forma segura (rgba explícito)
  function badgeBorderColor(hexColor) {
    // Extrae R, G, B de hex de 6 dígitos y retorna rgba con 0.25 de opacidad
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return "rgba(156,163,175,0.3)";
    return `rgba(${r},${g},${b},0.30)`;
  }

  function favSlug(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "favorito";
  }

  function favEscape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function favoriteAttrs({ id, titulo, submodulo, descripcion }) {
    return [
      `data-fav-id="${favEscape(id)}"`,
      `data-fav-title="${favEscape(titulo)}"`,
      `data-fav-module="Fisiologia"`,
      `data-fav-submodule="${favEscape(submodulo)}"`,
      `data-fav-type="Tarjeta"`,
      `data-fav-description="${favEscape(descripcion)}"`
    ].join(" ");
  }

  function bindFavorites(container) {
    window.SuiteVet?.Favorites?.bindWithin(container);
  }

  // ---------------------------------------------------------------------------
  // DOM READY
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("fisio-root");
    if (!root) return;

    // BUG FIX #4: fallback seguro si FISIO_DATA aún no cargó
    const data = window.FISIO_DATA || {};
    const hormonas  = Array.isArray(data.hormonas)  ? data.hormonas  : [];
    const vitaminas = Array.isArray(data.vitaminas)  ? data.vitaminas : [];
    const glosario  = Array.isArray(data.glosario)   ? data.glosario  : [];

    // -------------------------------------------------------------------------
    // 1. HTML DEL MÓDULO
    // -------------------------------------------------------------------------
    root.innerHTML = `
      <h2>Fisiología</h2>
      <p class="sv-view-intro">
        Hormonas por sistema fisiológico, vitaminas y glosario clínico veterinario.
      </p>

      <div class="sv-subnav" id="fisio-subnav">
        <button class="sv-tab sv-tab-active" data-pane="hormonas">
          Hormonas
          <span style="opacity:0.55;font-size:0.75em;margin-left:0.2rem">(${hormonas.length})</span>
        </button>
        <button class="sv-tab" data-pane="vitaminas">
          Vitaminas
          <span style="opacity:0.55;font-size:0.75em;margin-left:0.2rem">(${vitaminas.length})</span>
        </button>
        <button class="sv-tab" data-pane="glosario">
          Glosario
          <span style="opacity:0.55;font-size:0.75em;margin-left:0.2rem">(${glosario.length})</span>
        </button>
      </div>

      <!-- ── PANE HORMONAS ── -->
      <div id="fisio-pane-hormonas" class="sv-pane sv-pane-active">
        <div class="sv-toolbar">
          <input type="text" id="fisio-search-hormona" class="sv-input"
            placeholder="Buscar por nombre, sigla o sistema…"
            style="max-width:400px;" autocomplete="off" />
        </div>
        <div id="fisio-filtros-sistema" style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem;"></div>
        <div class="sv-grid" id="fisio-lista-hormonas"></div>
      </div>

      <!-- ── PANE VITAMINAS ── -->
      <div id="fisio-pane-vitaminas" class="sv-pane">
        <div class="sv-toolbar" id="fisio-toolbar-vitaminas">
          <input type="text" id="fisio-search-vitamina" class="sv-input"
            placeholder="Buscar vitamina (A, B1, K2, tiamina, cobalamina…)"
            style="max-width:340px;" autocomplete="off" />
          <button class="fisio-pill-sistema sv-pill-active" data-tipo="todas"
            style="--fisio-pill-color:var(--sv-accent);--fisio-pill-bg:var(--sv-bg-elevated);--fisio-pill-glow:var(--sv-accent-shadow)">
            Todas
          </button>
          <button class="fisio-pill-sistema" data-tipo="liposoluble"
            style="--fisio-pill-color:#f59e0b;--fisio-pill-bg:rgba(245,158,11,0.12);--fisio-pill-glow:rgba(245,158,11,0.28)">
            <span class="fisio-pill-dot"></span>☀️ Liposolubles
          </button>
          <button class="fisio-pill-sistema" data-tipo="hidrosoluble"
            style="--fisio-pill-color:#06b6d4;--fisio-pill-bg:rgba(6,182,212,0.12);--fisio-pill-glow:rgba(6,182,212,0.28)">
            <span class="fisio-pill-dot"></span>💧 Hidrosolubles
          </button>
        </div>
        <div class="sv-grid" id="fisio-lista-vitaminas"></div>
      </div>

      <!-- ── PANE GLOSARIO ── -->
      <div id="fisio-pane-glosario" class="sv-pane">
        <div class="sv-toolbar">
          <input type="text" id="fisio-search-glosario" class="sv-input"
            placeholder="Buscar término (ej. disuria, poliuria, prurito)…"
            style="max-width:340px;" autocomplete="off" />
        </div>
        <div id="fisio-filtros-glosario" style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem;"></div>
        <div class="sv-grid" id="fisio-lista-glosario"></div>
      </div>
    `;

    // -------------------------------------------------------------------------
    // 2. TABS DE SUBNAV
    // -------------------------------------------------------------------------
    const tabs  = root.querySelectorAll(".sv-tab[data-pane]");
    const panes = root.querySelectorAll(".sv-pane");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t  => t.classList.remove("sv-tab-active"));
        panes.forEach(p => p.classList.remove("sv-pane-active"));
        tab.classList.add("sv-tab-active");
        root.querySelector(`#fisio-pane-${tab.dataset.pane}`)?.classList.add("sv-pane-active");
      });
    });

    // -------------------------------------------------------------------------
    // 3. HORMONAS — pills de filtro con color por sistema
    // -------------------------------------------------------------------------
    const filtrosEl     = root.querySelector("#fisio-filtros-sistema");
    const searchHormona = root.querySelector("#fisio-search-hormona");
    let filtroSistema   = "todos";

    // Obtener sistemas en orden lógico (según el mapa) filtrando solo los que hay en datos
    const sistemasOrdenados = Object.keys(SISTEMA_VISUAL);
    const sistemasEnDatos   = new Set(hormonas.map(h => h.sistemaKey).filter(Boolean));

    // Pill "Todos"
    const pillTodos = document.createElement("button");
    pillTodos.className = "fisio-pill-sistema sv-pill-active";
    pillTodos.dataset.sistema = "todos";
    pillTodos.style.setProperty("--fisio-pill-color", "var(--sv-accent)");
    pillTodos.style.setProperty("--fisio-pill-bg",    "var(--sv-bg-elevated)");
    pillTodos.style.setProperty("--fisio-pill-glow",  "var(--sv-accent-shadow)");
    pillTodos.innerHTML = `Todos <span style="opacity:0.55">${hormonas.length}</span>`;
    filtrosEl.appendChild(pillTodos);

    // Un pill por sistema con su color
    sistemasOrdenados.forEach(sistKey => {
      if (!sistemasEnDatos.has(sistKey)) return;
      const sv    = getSistema(sistKey);
      const count = hormonas.filter(h => h.sistemaKey === sistKey).length;

      const pill  = document.createElement("button");
      pill.className    = "fisio-pill-sistema";
      pill.dataset.sistema = sistKey;
      // BUG FIX: usar setProperty en lugar de cssText para mayor compatibilidad
      pill.style.setProperty("--fisio-pill-color", sv.color);
      pill.style.setProperty("--fisio-pill-bg",    sv.bg);
      pill.style.setProperty("--fisio-pill-glow",  sv.glow);
      pill.innerHTML = `
        <span class="fisio-pill-dot"></span>
        <span>${sv.icon} ${sv.label}</span>
        <span style="opacity:0.55">${count}</span>
      `;
      filtrosEl.appendChild(pill);
    });

    // Listener unificado en el contenedor (event delegation)
    filtrosEl.addEventListener("click", e => {
      const pill = e.target.closest(".fisio-pill-sistema[data-sistema]");
      if (!pill) return;
      filtroSistema = pill.dataset.sistema;
      filtrosEl.querySelectorAll(".fisio-pill-sistema").forEach(p => p.classList.remove("sv-pill-active"));
      pill.classList.add("sv-pill-active");
      renderHormonas();
    });

    searchHormona?.addEventListener("input", renderHormonas);

    function renderHormonas() {
      const lista = root.querySelector("#fisio-lista-hormonas");
      if (!lista) return;
      const q = (searchHormona?.value || "").trim().toLowerCase();

      const filtradas = hormonas.filter(h => {
        const pasaSistema = filtroSistema === "todos" || h.sistemaKey === filtroSistema;
        const blob = `${h.nombre} ${h.sigla || ""} ${h.sistema || ""}`.toLowerCase();
        return pasaSistema && (!q || blob.includes(q));
      });

      lista.innerHTML = filtradas.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtradas.map(cardHormona).join("");
      bindFavorites(lista);
    }

    function cardHormona(h) {
      const sv = getSistema(h.sistemaKey);

      // BUG FIX #3: guard robusto — sigla puede ser undefined, null o "-"
      const siglaTexto = h.sigla && h.sigla.trim() !== "-" ? h.sigla.trim() : null;
      const siglaHtml  = siglaTexto
        ? `<span class="sv-card-subtitle">Sigla: <strong style="color:${sv.color}">${siglaTexto}</strong></span>`
        : "";

      // BUG FIX #1: color del borde del badge usando rgba explícito
      const badgeBorder = badgeBorderColor(sv.color);

      return `
        <article class="sv-card fisio-card-hormona sv-fade-in"
          ${favoriteAttrs({
            id: `fisiologia-hormonas-${h.id || favSlug(h.nombre)}`,
            titulo: h.nombre,
            submodulo: "Hormonas",
            descripcion: h.funcionPrincipal || h.sistema || ""
          })}
          style="--card-color:${sv.color}; --card-glow:${sv.glow};">
          <div class="sv-card-header">
            <span class="sv-card-title">
              <span style="margin-right:0.35rem">${sv.icon}</span>${h.nombre}
            </span>
            <span class="fisio-badge-sistema"
              style="background:${sv.bg};color:${sv.color};border-color:${badgeBorder};">
              ${sv.label}
            </span>
          </div>
          ${siglaHtml}
          <div class="sv-card-body">
            <p class="fisio-campo"><strong>Origen:</strong> ${h.origenLiberacion || "—"}</p>
            <p class="fisio-campo"><strong>Función principal:</strong> ${h.funcionPrincipal || "—"}</p>
            <p class="fisio-campo"><strong>Función secundaria:</strong> ${h.funcionSecundaria || "—"}</p>
            <p class="fisio-campo"><strong>Patología:</strong> ${h.patologia || "—"}</p>
          </div>
          <div class="fisio-card-footer">
            <p class="fisio-campo"><strong>Especie:</strong> ${h.especieVariacion || "—"}</p>
            <p class="fisio-campo"><strong>Farmacología:</strong> ${h.afeccionesFarmaco || "—"}</p>
          </div>
        </article>`;
    }

    // -------------------------------------------------------------------------
    // 4. VITAMINAS — diferenciadas por tipo (amarillo / cian)
    // -------------------------------------------------------------------------
    const toolbarVitaminas = root.querySelector("#fisio-toolbar-vitaminas");
    const searchVitamina   = root.querySelector("#fisio-search-vitamina");
    let filtroTipoVit      = "todas";

    // BUG FIX #5: listener solo en el toolbar de vitaminas, separado del de hormonas
    toolbarVitaminas?.addEventListener("click", e => {
      const pill = e.target.closest(".fisio-pill-sistema[data-tipo]");
      if (!pill) return;
      filtroTipoVit = pill.dataset.tipo;
      toolbarVitaminas.querySelectorAll(".fisio-pill-sistema[data-tipo]").forEach(p => p.classList.remove("sv-pill-active"));
      pill.classList.add("sv-pill-active");
      renderVitaminas();
    });

    searchVitamina?.addEventListener("input", renderVitaminas);

    function renderVitaminas() {
      const lista = root.querySelector("#fisio-lista-vitaminas");
      if (!lista) return;
      const q = (searchVitamina?.value || "").trim().toLowerCase();

      const filtradas = vitaminas.filter(v => {
        const blob    = `${v.nombre} ${v.sigla || ""} ${v.otrosNombres || ""} ${v.tipo || ""}`.toLowerCase();
        const tipoKey = (v.tipoKey || v.tipo || "").toLowerCase();
        const pasaTipo = filtroTipoVit === "todas" || tipoKey === filtroTipoVit;
        return (!q || blob.includes(q)) && pasaTipo;
      });

      lista.innerHTML = filtradas.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtradas.map(cardVitamina).join("");
      bindFavorites(lista);
    }

    function cardVitamina(v) {
      const tipoKey = (v.tipoKey || v.tipo || "").toLowerCase();
      const vv      = getVitamina(tipoKey);

      return `
        <article class="sv-card fisio-card-vitamina sv-fade-in"
          ${favoriteAttrs({
            id: `fisiologia-vitaminas-${v.id || favSlug(v.nombre)}`,
            titulo: v.nombre,
            submodulo: "Vitaminas",
            descripcion: v.funcion || v.tipo || ""
          })}
          style="--card-color:${vv.cardColor}; --card-glow:${vv.cardGlow};">
          <div class="sv-card-header">
            <span class="sv-card-title">
              <span style="margin-right:0.35rem">${vv.icon}</span>${v.nombre}
            </span>
            <span class="${vv.badgeClass}">${vv.label}</span>
          </div>
          ${v.otrosNombres ? `<span class="sv-card-subtitle">${v.otrosNombres}</span>` : ""}
          <div class="sv-card-body">
            <p class="fisio-campo"><strong>Función:</strong> ${v.funcion || "—"}</p>
            <p class="fisio-campo"><strong>Hipovitaminosis:</strong> ${v.hipovitaminosis || "—"}</p>
            <p class="fisio-campo"><strong>Hipervitaminosis:</strong> ${v.hipervitaminosis || "—"}</p>
          </div>
          <div class="fisio-card-footer">
            <p class="fisio-campo"><strong>Especie:</strong> ${v.variacionEspecies || "—"}</p>
            <p class="fisio-campo"><strong>Farmacología:</strong> ${v.afeccionesFarmaco || "—"}</p>
          </div>
        </article>`;
    }

    // -------------------------------------------------------------------------
    // 5. GLOSARIO
    // -------------------------------------------------------------------------
    const searchGlosario  = root.querySelector("#fisio-search-glosario");
    const filtrosGlosario = root.querySelector("#fisio-filtros-glosario");
    let filtroGlosario    = "todos";
    const glosarioIndex   = Object.fromEntries(glosario.map(g => [g.id, g]));

    renderFiltrosGlosario();

    filtrosGlosario?.addEventListener("click", e => {
      const pill = e.target.closest(".fisio-pill-sistema[data-sistema-glosario]");
      if (!pill) return;
      filtroGlosario = pill.dataset.sistemaGlosario;
      filtrosGlosario.querySelectorAll(".fisio-pill-sistema[data-sistema-glosario]").forEach(p => p.classList.remove("sv-pill-active"));
      pill.classList.add("sv-pill-active");
      renderGlosario();
    });

    searchGlosario?.addEventListener("input", renderGlosario);

    function renderFiltrosGlosario() {
      if (!filtrosGlosario) return;

      const sistemasEnGlosario = new Set(glosario.map(g => g.sistemaKey).filter(Boolean));
      const keysOrdenadas = Object.keys(SISTEMA_VISUAL).filter(key => sistemasEnGlosario.has(key));
      const keysExtra = [...sistemasEnGlosario].filter(key => !keysOrdenadas.includes(key));
      const keysFinales = [...keysOrdenadas, ...keysExtra];

      const total = glosario.length;
      const pills = [
        `<button class="fisio-pill-sistema sv-pill-active" data-sistema-glosario="todos"
          style="--fisio-pill-color:var(--sv-accent);--fisio-pill-bg:var(--sv-bg-elevated);--fisio-pill-glow:var(--sv-accent-shadow)">
          Todos <span style="opacity:0.65">${total}</span>
        </button>`
      ];

      keysFinales.forEach(key => {
        const sv = getSistema(key);
        const count = glosario.filter(g => g.sistemaKey === key).length;
        pills.push(`
          <button class="fisio-pill-sistema" data-sistema-glosario="${key}"
            style="--fisio-pill-color:${sv.color};--fisio-pill-bg:${sv.bg};--fisio-pill-glow:${sv.glow}">
            <span class="fisio-pill-dot"></span>${sv.label} <span style="opacity:0.65">${count}</span>
          </button>`);
      });

      filtrosGlosario.innerHTML = pills.join("");
    }

    function renderGlosario() {
      const lista = root.querySelector("#fisio-lista-glosario");
      if (!lista) return;

      if (glosario.length === 0) {
        lista.innerHTML = `<div class="sv-empty"><div class="sv-empty-icon">📖</div>
          El glosario se agrega en <code>modules/fisio/data/glosariodata.js</code>.</div>`;
        return;
      }

      const q = (searchGlosario?.value || "").trim().toLowerCase();

      const filtrados = glosario.filter(g => {
        const pasaSistema = filtroGlosario === "todos" || g.sistemaKey === filtroGlosario;
        const blob = `${g.termino || ""} ${g.sigla || ""} ${(g.sinonimos || []).join(" ")} ${g.tipo || ""} ${g.definicion || ""} ${g.importanciaClinica || ""} ${g.sistema || ""} ${(g.relacionados || []).join(" ")}`.toLowerCase();
        return pasaSistema && (!q || blob.includes(q));
      });

      lista.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtrados.map(cardGlosario).join("");
      bindFavorites(lista);
    }

    function cardGlosario(g) {
      const sv = getSistema(g.sistemaKey);
      const badgeBorder = badgeBorderColor(sv.color);
      const siglaHtml = g.sigla
        ? `<span class="sv-card-subtitle">Sigla: <strong style="color:${sv.color}">${g.sigla}</strong></span>`
        : "";
      const sinonimosHtml = Array.isArray(g.sinonimos) && g.sinonimos.length
        ? `<span class="sv-card-subtitle">Tambien buscado como: ${g.sinonimos.join(", ")}</span>`
        : "";
      const relacionados = Array.isArray(g.relacionados) && g.relacionados.length
        ? `<div class="fisio-glosario-chips">${g.relacionados.map(r => `<span class="fisio-glosario-chip">${labelRelacionado(r)}</span>`).join("")}</div>`
        : "";

      return `
        <article class="sv-card fisio-card-glosario sv-fade-in"
          ${favoriteAttrs({
            id: `fisiologia-nombres-clinicos-${g.id || favSlug(g.termino)}`,
            titulo: g.termino || "",
            submodulo: "Nombres clinicos",
            descripcion: g.definicion || g.importanciaClinica || ""
          })}
          style="--card-color:${sv.color}; --card-glow:${sv.glow};">
          <div class="sv-card-header">
            <span class="sv-card-title">
              <span style="margin-right:0.35rem">${sv.icon}</span>${g.termino || ""}
            </span>
            <span class="fisio-badge-sistema"
              style="background:${sv.bg};color:${sv.color};border-color:${badgeBorder};">
              ${sv.label}
            </span>
          </div>
          ${siglaHtml}
          ${sinonimosHtml}
          ${g.tipo ? `<span class="fisio-glosario-tipo">${g.tipo}</span>` : ""}
          <div class="sv-card-body">
            <p class="fisio-campo">${g.definicion || ""}</p>
            <p class="fisio-campo"><strong>Importancia clínica:</strong> ${g.importanciaClinica || "—"}</p>
          </div>
          ${relacionados}
        </article>`;
    }

    function labelRelacionado(value) {
      const item = glosarioIndex[value];
      if (item?.termino) return item.termino;
      return String(value || "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    // -------------------------------------------------------------------------
    // 6. RENDER INICIAL
    // -------------------------------------------------------------------------
    renderHormonas();
    renderVitaminas();
    renderGlosario();

    // -------------------------------------------------------------------------
    // 7. BUSCADOR GLOBAL
    // -------------------------------------------------------------------------
    if (window.SuiteVet?.registerSearch) {
      window.SuiteVet.registerSearch("fisio", q => {
        const results = [];

        hormonas.forEach(h => {
          if (`${h.nombre} ${h.sigla || ""} ${h.sistema || ""}`.toLowerCase().includes(q)) {
            const sv = getSistema(h.sistemaKey);
            results.push({
              title:    h.nombre,
              subtitle: `${sv.icon} ${h.sistema || sv.label}`,
              moduleId: "fisio",
              action: () => {
                window.SuiteVet.showView("fisiologia");
                if (searchHormona) {
                  searchHormona.value = h.nombre;
                  renderHormonas();
                }
              }
            });
          }
        });

        vitaminas.forEach(v => {
          if (`${v.nombre} ${v.sigla || ""} ${v.otrosNombres || ""} ${v.tipo || ""}`.toLowerCase().includes(q)) {
            const vv = getVitamina((v.tipoKey || v.tipo || "").toLowerCase());
            results.push({
              title:    v.nombre,
              subtitle: `${vv.icon} ${v.tipo || "Vitamina"}`,
              moduleId: "fisio",
              action: () => {
                window.SuiteVet.showView("fisiologia");
                tabs.forEach(t  => t.classList.remove("sv-tab-active"));
                panes.forEach(p => p.classList.remove("sv-pane-active"));
                root.querySelector('[data-pane="vitaminas"]')?.classList.add("sv-tab-active");
                root.querySelector("#fisio-pane-vitaminas")?.classList.add("sv-pane-active");
                if (searchVitamina) {
                  searchVitamina.value = v.nombre;
                  renderVitaminas();
                }
              }
            });
          }
        });

        glosario.forEach(g => {
          const blob = `${g.termino || ""} ${g.sigla || ""} ${(g.sinonimos || []).join(" ")} ${g.tipo || ""} ${g.sistema || ""} ${g.definicion || ""} ${g.importanciaClinica || ""} ${(g.relacionados || []).join(" ")}`.toLowerCase();
          if (blob.includes(q)) {
            const sv = getSistema(g.sistemaKey);
            results.push({
              title:    g.termino,
              subtitle: `${sv.icon} Glosario · ${sv.label}`,
              moduleId: "fisio",
              action: () => {
                window.SuiteVet.showView("fisiologia");
                tabs.forEach(t  => t.classList.remove("sv-tab-active"));
                panes.forEach(p => p.classList.remove("sv-pane-active"));
                root.querySelector('[data-pane="glosario"]')?.classList.add("sv-tab-active");
                root.querySelector("#fisio-pane-glosario")?.classList.add("sv-pane-active");
                filtroGlosario = "todos";
                filtrosGlosario?.querySelectorAll(".fisio-pill-sistema[data-sistema-glosario]").forEach(p => p.classList.remove("sv-pill-active"));
                filtrosGlosario?.querySelector('[data-sistema-glosario="todos"]')?.classList.add("sv-pill-active");
                if (searchGlosario) {
                  searchGlosario.value = g.termino;
                  renderGlosario();
                }
              }
            });
          }
        });

        return results;
      });
    }
  });

})();
