// =============================================================================
// SUITE VET 2.0 — modules/casos-360/casos.js
// Controlador Principal y Motor del Módulo Casos 360
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("casos360-root");
    if (!root) return;

    // Dependencias globales
    const D = window.CASOS_360_DATA || {};
    const Fav = window.SuiteVet?.Favorites || null;

    // ---------------------------------------------------------------------------
    // 1. ESTADO DE LA APLICACIÓN
    // ---------------------------------------------------------------------------
    const state = {
      page: "listado", // listado, reproductor, resultado, progreso, admin, repasar
      scenarios: [], // Todos los escenarios (semillas + personalizados)
      currentScenario: null, // Escenario que se está jugando
      currentStageIndex: 0, // Índice de la etapa actual en el reproductor
      attempt: null, // Intento actual (CaseAttempt)
      remediations: [], // Elementos de remediación activos
      filters: { query: "", species: "", system: "", difficulty: "", status: "" },
      notesDraft: "", // Bloc de notas temporal
      adminSelectedId: "", // ID del caso seleccionado en admin
      adminJsonDraft: "", // Texto JSON en el editor admin
      testResults: null // Resultados de las pruebas unitarias
    };

    // Inicializar datos
    initData();

    // Registrar buscador global
    registerGlobalSearch();

    // Escuchar cambios de vista del router principal
    document.addEventListener("suitevet:viewchange", (e) => {
      if (e.detail.view === "casos360") {
        initData();
        state.page = "listado";
        render();
      }
    });

    // Conectar delegación de eventos del DOM
    root.addEventListener("click", handleClicks);
    root.addEventListener("input", handleInputs);
    root.addEventListener("change", handleInputs);

    // Renderizado inicial
    render();

    // ---------------------------------------------------------------------------
    // 2. INICIALIZACIÓN DE DATOS (LOCALSTORAGE PERSISTENCIA)
    // ---------------------------------------------------------------------------
    function initData() {
      // 1. Cargar escenarios personalizados
      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem(D.storageKeyCustomCases)) || [];
      } catch (err) {
        console.error("Error al cargar casos personalizados:", err);
      }

      // Combinar semillas con personalizados
      const seeds = D.seedScenarios || [];
      const customMapped = custom.filter(c => !seeds.some(s => s.id === c.id));
      state.scenarios = [...seeds, ...customMapped];

      // 2. Cargar remediaciones
      try {
        state.remediations = JSON.parse(localStorage.getItem(D.storageKeyRemediations)) || [];
      } catch (err) {
        console.error("Error al cargar remediaciones:", err);
      }
    }

    function saveCustomCases(cases) {
      localStorage.setItem(D.storageKeyCustomCases, JSON.stringify(cases));
      initData();
    }

    function saveRemediations(items) {
      localStorage.setItem(D.storageKeyRemediations, JSON.stringify(items));
      state.remediations = items;
    }

    function getAttempts() {
      try {
        return JSON.parse(localStorage.getItem(D.storageKeyAttempts)) || [];
      } catch (e) {
        return [];
      }
    }

    function saveAttempt(attempt) {
      const attempts = getAttempts();
      attempts.unshift(attempt);
      localStorage.setItem(D.storageKeyAttempts, JSON.stringify(attempts));
    }

    // ---------------------------------------------------------------------------
    // 3. RENDERIZADO DE VISTAS (TEMPLATE LITERALS)
    // ---------------------------------------------------------------------------
    function render() {
      root.innerHTML = `
        <section class="c360-shell sv-module-shell">
          ${renderHeader()}
          ${renderTabs()}
          ${renderPage()}
        </section>
      `;
      // Vincular favoritos si existe la librería
      Fav?.bindWithin(root);
    }

    function renderHeader() {
      return `
        <section class="sv-module-header c360-header">
          <p class="c360-kicker">SUITE VET</p>
          <h2>Casos 360</h2>
          <p class="sv-view-intro">
            Simulador clínico multimodal con evaluación objetiva por competencias, diagnóstico diferencial priorizado y remediación adaptativa.
          </p>
        </section>
      `;
    }

    function renderTabs() {
      const activeTab = state.page;
      return `
        <div class="sv-module-subnav c360-tabs" aria-label="Secciones de Casos 360">
          <button type="button" class="sv-module-tab ${activeTab === "listado" ? "is-active" : ""}" data-c360-nav="listado">
            <span class="c360-tab-icon">🗂️</span>
            <strong>Biblioteca</strong>
          </button>
          <button type="button" class="sv-module-tab ${activeTab === "repasar" ? "is-active" : ""}" data-c360-nav="repasar">
            <span class="c360-tab-icon">🎯</span>
            <strong>Repasar (${state.remediations.length})</strong>
          </button>
          <button type="button" class="sv-module-tab ${activeTab === "progreso" ? "is-active" : ""}" data-c360-nav="progreso">
            <span class="c360-tab-icon">📊</span>
            <strong>Mi Progreso</strong>
          </button>
          <button type="button" class="sv-module-tab ${activeTab === "admin" ? "is-active" : ""}" data-c360-nav="admin">
            <span class="c360-tab-icon">🛠️</span>
            <strong>Admin</strong>
          </button>
        </div>
      `;
    }

    function renderPage() {
      if (state.page === "reproductor") return renderPlayer();
      if (state.page === "resultado") return renderResults();
      if (state.page === "repasar") return renderRemediation();
      if (state.page === "progreso") return renderDashboard();
      if (state.page === "admin") return renderAdmin();
      return renderList(); // Default listado
    }

    // ---------------------------------------------------------------------------
    // 3.A. VISTA: LISTADO DE CASOS
    // ---------------------------------------------------------------------------
    function renderList() {
      const attempts = getAttempts();
      const queryNorm = state.filters.query.toLowerCase().trim();

      const filtered = state.scenarios.filter((sc) => {
        // Filtrar query
        if (queryNorm) {
          const matchTitle = sc.title.toLowerCase().includes(queryNorm);
          const matchDesc = sc.shortDescription.toLowerCase().includes(queryNorm);
          const matchSys = sc.system.toLowerCase().includes(queryNorm);
          if (!matchTitle && !matchDesc && !matchSys) return false;
        }
        // Filtrar especie
        if (state.filters.species && sc.species !== state.filters.species) return false;
        // Filtrar sistema
        if (state.filters.system && sc.system !== state.filters.system) return false;
        // Filtrar dificultad
        if (state.filters.difficulty && sc.difficulty !== state.filters.difficulty) return false;
        // Filtrar estado del intento
        if (state.filters.status) {
          const finished = attempts.some(a => a.caseId === sc.id && a.status === "completed");
          const inProgress = attempts.some(a => a.caseId === sc.id && a.status === "in_progress");
          if (state.filters.status === "completado" && !finished) return false;
          if (state.filters.status === "progreso" && (!inProgress || finished)) return false;
          if (state.filters.status === "no_iniciado" && (finished || inProgress)) return false;
        }
        return true;
      });

      const listHtml = filtered.length
        ? filtered.map((sc) => {
            const completed = attempts.some(a => a.caseId === sc.id && a.status === "completed");
            const inProgress = attempts.some(a => a.caseId === sc.id && a.status === "in_progress");
            let badgeClass = "sv-badge-gray";
            let badgeText = "No Iniciado";
            let progressFill = "0%";

            if (completed) {
              badgeClass = "sv-badge-green";
              badgeText = "Completado";
              progressFill = "100%";
            } else if (inProgress) {
              badgeClass = "sv-badge-blue";
              badgeText = "En Progreso";
              progressFill = "50%";
            }

            const latestAttempt = attempts.find(a => a.caseId === sc.id && a.status === "completed");
            const scoreText = latestAttempt ? `| Score: ${Math.round(latestAttempt.finalScore)}%` : "";

            const favData = {
              id: `casos360-${sc.id}`,
              titulo: sc.title,
              modulo: "Casos 360",
              submodulo: "Casos clínicos",
              tipo: "Caso Clínico",
              descripcion: `${sc.system} · ${sc.difficulty}`
            };

            return `
              <article class="sv-card c360-scenario-card sv-fade-in" data-module="casos360"
                data-fav-id="${esc(favData.id)}"
                data-fav-title="${esc(favData.titulo)}"
                data-fav-module="${esc(favData.modulo)}"
                data-fav-submodule="${esc(favData.submodulo)}"
                data-fav-type="${esc(favData.tipo)}"
                data-fav-description="${esc(favData.descripcion)}">
                <div class="c360-sc-header">
                  <div class="c360-sc-icon">${esc(sc.coverImage || "📋")}</div>
                  <span class="sv-badge ${badgeClass}">${badgeText}</span>
                </div>
                <h3 class="sv-card-title">${esc(sc.title)}</h3>
                <span class="sv-card-subtitle">${esc(sc.system)} · Dificultad: ${esc(sc.difficulty)}</span>
                <p class="sv-card-body p">${esc(sc.shortDescription)}</p>
                <div class="c360-sc-meta">
                  <span>⏱️ ${sc.estimatedMinutes} min</span>
                  <span>🧬 ${sc.species.toUpperCase()}</span>
                  <span>${scoreText}</span>
                </div>
                <div class="c360-sc-progress-bar" title="Progreso del caso">
                  <div class="c360-sc-progress-fill" style="width: ${progressFill}"></div>
                </div>
                <div class="sv-card-footer">
                  <button type="button" class="sv-btn sv-btn-sm sv-btn-primary" data-c360-play="${esc(sc.id)}">
                    ${completed ? "Reintentar" : inProgress ? "Continuar" : "Iniciar Caso"}
                  </button>
                </div>
              </article>
            `;
          }).join("")
        : `
          <div class="sv-empty">
            <div class="sv-empty-icon">📂</div>
            No se encontraron casos clínicos que coincidan con los filtros aplicados.
          </div>
        `;

      const systemsHtml = D.seedScenarios.reduce((acc, s) => {
        if (!acc.includes(s.system)) acc.push(s.system);
        return acc;
      }, []).map(sys => `<option value="${esc(sys)}" ${state.filters.system === sys ? "selected" : ""}>${esc(sys)}</option>`).join("");

      return `
        <section class="sv-toolbar">
          <input type="text" class="sv-input" style="flex: 2; min-width: 200px;" placeholder="Buscar por título, sistema o descriptor..." data-c360-filter="query" value="${esc(state.filters.query)}" />
          <select class="sv-select" style="flex: 1;" data-c360-filter="species">
            <option value="">Especie (Todas)</option>
            <option value="canino" ${state.filters.species === "canino" ? "selected" : ""}>Canino</option>
            <option value="felino" ${state.filters.species === "felino" ? "selected" : ""}>Felino</option>
            <option value="bovino" ${state.filters.species === "bovino" ? "selected" : ""}>Bovino</option>
            <option value="equino" ${state.filters.species === "equino" ? "selected" : ""}>Equino</option>
            <option value="porcino" ${state.filters.species === "porcino" ? "selected" : ""}>Porcino</option>
            <option value="ovino" ${state.filters.species === "ovino" ? "selected" : ""}>Ovino</option>
            <option value="caprino" ${state.filters.species === "caprino" ? "selected" : ""}>Caprino</option>
            <option value="ave" ${state.filters.species === "ave" ? "selected" : ""}>Ave</option>
          </select>
          <select class="sv-select" style="flex: 1;" data-c360-filter="system">
            <option value="">Sistema (Todos)</option>
            ${systemsHtml}
          </select>
          <select class="sv-select" style="flex: 1;" data-c360-filter="difficulty">
            <option value="">Dificultad (Todas)</option>
            <option value="Fácil" ${state.filters.difficulty === "Fácil" ? "selected" : ""}>Fácil</option>
            <option value="Media" ${state.filters.difficulty === "Media" ? "selected" : ""}>Media</option>
            <option value="Alta" ${state.filters.difficulty === "Alta" ? "selected" : ""}>Alta</option>
          </select>
          <select class="sv-select" style="flex: 1;" data-c360-filter="status">
            <option value="">Estado (Todos)</option>
            <option value="no_iniciado" ${state.filters.status === "no_iniciado" ? "selected" : ""}>No Iniciado</option>
            <option value="progreso" ${state.filters.status === "progreso" ? "selected" : ""}>En Progreso</option>
            <option value="completado" ${state.filters.status === "completado" ? "selected" : ""}>Completado</option>
          </select>
        </section>

        <section class="c360-grid">
          ${listHtml}
        </section>
      `;
    }

    // ---------------------------------------------------------------------------
    // 3.B. VISTA: REPRODUCTOR DE CASO (3 COLUMNAS)
    // ---------------------------------------------------------------------------
    function renderPlayer() {
      const sc = state.currentScenario;
      const stages = sc.stages || [];
      const stage = stages[state.currentStageIndex];

      return `
        <div class="c360-player-container sv-fade-in">
          
          <!-- COLUMNA IZQUIERDA: Ficha del Paciente -->
          <aside class="sv-card c360-patient-column c360-card-sticky">
            <div class="c360-patient-photo">${esc(sc.coverImage || "📋")}</div>
            <h3>Ficha del Paciente</h3>
            <ul class="c360-patient-info">
              <li><strong>Especie:</strong> <span>${esc(sc.species.toUpperCase())}</span></li>
              <li><strong>Sistema:</strong> <span>${esc(sc.system)}</span></li>
              <li><strong>Dificultad:</strong> <span>${esc(sc.difficulty)}</span></li>
              <li><strong>Etapa actual:</strong> <span>${state.currentStageIndex + 1} / ${stages.length}</span></li>
            </ul>
            <div class="sv-card-footer" style="flex-direction:column; gap:0.4rem; align-items:stretch;">
              <strong>Objetivos de Aprendizaje:</strong>
              <ul style="padding-left:1rem; font-size:0.75rem; color:var(--sv-text-secondary);">
                ${sc.learningObjectives.map(o => `<li>${esc(o)}</li>`).join("")}
              </ul>
            </div>
            <button class="sv-btn sv-btn-danger sv-btn-sm sv-btn-full" type="button" data-c360-action="abandonar">Salir del Caso</button>
          </aside>

          <!-- COLUMNA CENTRAL: Interacción Clínica -->
          <main class="sv-card c360-main-column c360-gameplay-card">
            <div class="c360-game-header">
              <span class="c360-stage-indicator">ETAPA ${state.currentStageIndex + 1}: ${esc(stage.type.toUpperCase().replace("_", " "))}</span>
              <span class="sv-badge c360-badge-purple-sv">${esc(sc.title)}</span>
            </div>

            <h2 class="c360-stage-title">${esc(stage.title)}</h2>
            <p class="c360-prompt-text">${esc(stage.prompt)}</p>

            ${renderStageInteraction(stage)}

            <div class="c360-actions-strip">
              <button class="sv-btn sv-btn-ghost" type="button" data-c360-action="anterior" ${state.currentStageIndex === 0 ? "disabled" : ""}>Anterior</button>
              <span style="font-size:0.8rem; color:var(--sv-text-muted);">Completa esta etapa para continuar</span>
              <button class="sv-btn sv-btn-primary" type="button" data-c360-action="siguiente">
                ${state.currentStageIndex === stages.length - 1 ? "Finalizar Caso" : "Siguiente"}
              </button>
            </div>
          </main>

          <!-- COLUMNA DERECHA: Bloc de Notas Clínico -->
          <aside class="sv-card c360-notes-column c360-card-sticky">
            <div class="c360-notes-area">
              <h3>Bloc de Notas Clínico</h3>
              <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-bottom:0.4rem;">
                Registra observaciones, análisis de laboratorio y notas que consideres críticas para el caso.
              </p>
              <textarea class="sv-input c360-notes-textarea" placeholder="Escribe tus notas aquí..." data-c360-notes-input>${esc(state.notesDraft)}</textarea>
              <div class="sv-card-footer" style="font-size:0.72rem; color:var(--sv-text-muted);">
                Las notas se guardan automáticamente durante el intento.
              </div>
            </div>
          </aside>

        </div>
      `;
    }

    function renderStageInteraction(stage) {
      const answers = state.attempt.responses[stage.id] || {};

      if (stage.type === "motivo_consulta") {
        return `
          <div class="c360-asset-box">
            <div class="c360-asset-header">
              <span>📄 DOCUMENTACIÓN INICIAL</span>
            </div>
            <div class="c360-asset-content">
              <p class="c360-asset-text">${esc(stage.asset.content)}</p>
            </div>
          </div>
        `;
      }

      if (stage.type === "anamnesis" || stage.type === "examen_fisico" || stage.type === "plan_terapeutico" || stage.type === "tutor_recs") {
        return `
          <div class="c360-options-list">
            ${stage.choices.map((choice) => {
              const selected = !!answers[choice.id];
              return `
                <label class="c360-option-label ${selected ? "is-selected" : ""}">
                  <input type="checkbox" data-c360-choice-id="${esc(choice.id)}" ${selected ? "checked" : ""} />
                  <span>${esc(choice.text)}</span>
                </label>
              `;
            }).join("")}
          </div>
        `;
      }

      if (stage.type === "pruebas_complementarias") {
        // En pruebas, al seleccionar la prueba se revela el activo multimodal de inmediato
        return `
          <div class="c360-options-list">
            <p style="font-size:0.8rem; color:var(--sv-text-muted);">Solicita una prueba para desplegar su resultado:</p>
            ${stage.choices.map((choice) => {
              const selected = !!answers[choice.id];
              let assetReveal = "";

              if (selected && choice.asset) {
                assetReveal = renderAsset(choice.asset);
              }

              return `
                <div style="border: 1px solid ${selected ? "var(--sv-casos360-color)" : "var(--sv-border)"}; border-radius:0.8rem; overflow:hidden; margin-bottom:0.4rem;">
                  <label class="c360-option-label ${selected ? "is-selected" : ""}" style="border:none; border-radius:0;">
                    <input type="checkbox" data-c360-choice-id="${esc(choice.id)}" ${selected ? "checked" : ""} />
                    <strong>${esc(choice.text)}</strong>
                  </label>
                  ${assetReveal}
                </div>
              `;
            }).join("")}
          </div>
        `;
      }

      if (stage.type === "interpretacion") {
        const textVal = state.attempt.interpretations[stage.id] || "";
        return `
          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
            <label class="c360-form-field">
              <span>Escribe tu razonamiento clínico paso a paso:</span>
              <textarea class="sv-input" rows="8" placeholder="Ingresa tu interpretación detallada sobre la anamnesis, examen físico y pruebas..." data-c360-interpret-text="${esc(stage.id)}">${esc(textVal)}</textarea>
            </label>
            <span style="font-size:0.75rem; color:var(--sv-text-muted);">Mínimo 15 palabras para cumplir con la rúbrica docente.</span>
          </div>
        `;
      }

      if (stage.type === "diagnosticos_diferenciales") {
        // Lista ordenada (arrastrable / ordenable)
        const userOrder = state.attempt.differentialsOrder[stage.id] || stage.choices.map(c => c.id);
        const choicesMap = new Map(stage.choices.map(c => [c.id, c]));

        return `
          <div class="c360-sortable-list">
            ${userOrder.map((id, index) => {
              const choice = choicesMap.get(id);
              if (!choice) return "";
              return `
                <div class="c360-sort-item">
                  <span><strong>${index + 1}.</strong> ${esc(choice.text)}</span>
                  <div class="c360-sort-controls">
                    <button type="button" class="c360-sort-btn" data-c360-sort-move="up" data-c360-sort-id="${esc(id)}">▲</button>
                    <button type="button" class="c360-sort-btn" data-c360-sort-move="down" data-c360-sort-id="${esc(id)}">▼</button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `;
      }

      if (stage.type === "reflection") {
        const textVal = state.attempt.interpretations[stage.id] || "";
        const confidence = state.attempt.confidenceBeforeSubmit || 80;
        return `
          <div style="display:flex; flex-direction:column; gap:1.2rem; margin-top:0.5rem;">
            <label class="c360-form-field">
              <span>Selecciona tu nivel de confianza clínica antes de cerrar el caso (0-100%):</span>
              <div style="display:flex; align-items:center; gap:1rem;">
                <input type="range" class="sv-input" style="flex:1; padding:0;" min="0" max="100" step="5" data-c360-confidence-slider value="${confidence}" />
                <strong style="font-size:1.2rem; min-width:3.5rem; text-align:right;">${confidence}%</strong>
              </div>
            </label>
            <label class="c360-form-field">
              <span>Reflexión Final sobre tu aprendizaje en este caso:</span>
              <textarea class="sv-input" rows="5" placeholder="¿Qué conceptos reforzaste? ¿Qué decisiones te generaron mayor dificultad?" data-c360-interpret-text="${esc(stage.id)}">${esc(textVal)}</textarea>
            </label>
            <span style="font-size:0.75rem; color:var(--sv-text-muted);">Mínimo 10 palabras de reflexión autocrítica.</span>
          </div>
        `;
      }

      return ``;
    }

    function renderAsset(asset) {
      if (asset.type === "image") {
        return `
          <div class="c360-asset-box" style="margin: 0 0.8rem 0.8rem; border-top: none; border-radius: 0 0 0.8rem 0.8rem;">
            <div class="c360-asset-header">
              <span>🖼️ RESULTADO VISUAL: ${esc(asset.title)}</span>
            </div>
            <div class="c360-asset-content">
              <img src="${esc(asset.fileUrl)}" class="c360-asset-image" alt="${esc(asset.title)}" onerror="this.src='https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80';this.onerror=null;" />
            </div>
          </div>
        `;
      }
      if (asset.type === "lab_table") {
        return `
          <div class="c360-asset-box" style="margin: 0 0.8rem 0.8rem; border-top: none; border-radius: 0 0 0.8rem 0.8rem;">
            <div class="c360-asset-header">
              <span>📊 ANÁLISIS DE LABORATORIO: ${esc(asset.title)}</span>
            </div>
            <div class="c360-asset-content" style="padding:0;">
              <table class="c360-asset-table">
                <thead>
                  <tr>
                    ${asset.content[0].map(h => `<th>${esc(h)}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${asset.content.slice(1).map(row => `
                    <tr>
                      ${row.map(cell => `<td>${esc(cell)}</td>`).join("")}
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }
      if (asset.type === "timeline_event") {
        return `
          <div class="c360-asset-box" style="margin: 0 0.8rem 0.8rem; border-top: none; border-radius: 0 0 0.8rem 0.8rem;">
            <div class="c360-asset-header">
              <span>📅 EVENTO EN LA LÍNEA DE TIEMPO: ${esc(asset.title)}</span>
            </div>
            <div class="c360-asset-content">
              <div class="c360-asset-timeline">
                <div class="c360-timeline-icon">🔔</div>
                <p class="c360-asset-text" style="margin:0;">${esc(asset.content)}</p>
              </div>
            </div>
          </div>
        `;
      }
      return ``;
    }

    // ---------------------------------------------------------------------------
    // 3.C. VISTA: FEEDBACK Y RESULTADO DEL INTENTO
    // ---------------------------------------------------------------------------
    function renderResults() {
      const att = state.attempt;
      const sc = state.currentScenario;
      if (!att || !sc) return `<div class="sv-empty">No hay intento activo.</div>`;

      // Calcular errores críticos
      const safetyHtml = att.safetyErrors.length
        ? att.safetyErrors.map(err => `
            <div class="c360-safety-alert">
              <span class="c360-safety-icon">⚠️</span>
              <div>
                <strong>ALERTA DE SEGURIDAD CLÍNICA</strong>
                <p style="margin-top:0.2rem; font-size:0.85rem;">${esc(err)}</p>
              </div>
            </div>
          `).join("")
        : `
          <div class="c360-safety-alert" style="background:rgba(34, 197, 94, 0.1); border-color:var(--sv-success);">
            <span class="c360-safety-icon" style="color:var(--sv-success);">✔️</span>
            <div>
              <strong>PRÁCTICA SEGURA</strong>
              <p style="margin-top:0.2rem; font-size:0.85rem; color:var(--sv-text-secondary);">No se cometieron errores críticos de seguridad ni de bioseguridad en este intento.</p>
            </div>
          </div>
        `;

      // Competencias
      const compBreakdown = att.competencyBreakdown || {};
      const compList = D.competencies.map((c) => {
        const val = compBreakdown[c.code] !== undefined ? Math.round(compBreakdown[c.code]) : 100;
        return `
          <div class="c360-competency-item">
            <div class="c360-comp-header">
              <span>${esc(c.label)}</span>
              <span>${val}%</span>
            </div>
            <div class="c360-progress-bg">
              <div class="c360-progress-fill c360-comp-color-${c.code}" style="width:${val}%;"></div>
            </div>
          </div>
        `;
      }).join("");

      // Desglose por etapas
      const stageScores = att.stageScores || {};
      const breakdownHtml = sc.stages.map((st, i) => {
        if (st.type === "motivo_consulta") return "";
        const score = stageScores[st.id] !== undefined ? Math.round(stageScores[st.id]) : 0;
        return `
          <div style="display:flex; justify-content:between; border-bottom:1px dashed var(--sv-border-subtle); padding:0.4rem 0;">
            <span style="font-size:0.85rem;">Etapa ${i+1}: ${esc(st.title)}</span>
            <strong style="color: ${score >= 70 ? "var(--sv-success)" : score >= 40 ? "var(--sv-warning)" : "var(--sv-danger)"};">${score}%</strong>
          </div>
        `;
      }).join("");

      // Generar detalles de rúbrica detallada (Qué hizo bien, omitió o fue riesgoso)
      const rubricDetailsHtml = sc.stages.map((st) => {
        if (st.type === "motivo_consulta" || st.type === "interpretacion" || st.type === "reflection") return "";
        const userResp = att.responses[st.id] || {};

        if (st.type === "diagnosticos_diferenciales") {
          const userOrderIds = att.differentialsOrder[st.id] || [];
          const items = st.choices.map((c) => {
            const userRank = userOrderIds.indexOf(c.id) + 1;
            const diffRank = c.priority;
            const isCorrect = userRank === diffRank;
            return `
              <li style="font-size:0.8rem; margin-bottom:0.25rem;">
                <strong>${esc(c.text)}</strong>: 
                Orden de prioridad correcto: ${diffRank} | Tu orden: ${userRank}
                <span class="c360-feedback-badge ${isCorrect ? "c360-badge-correct" : "c360-badge-omission"}">
                  ${isCorrect ? "Correcto" : "Desviado"}
                </span>
                <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-top:0.1rem;">${esc(c.feedback)}</p>
              </li>
            `;
          }).join("");
          return `
            <div style="margin-bottom:0.8rem;">
              <h4>${esc(st.title)}</h4>
              <ul style="padding-left:1.2rem; margin-top:0.3rem;">${items}</ul>
            </div>
          `;
        }

        // Checklist stages
        const items = st.choices.map((choice) => {
          const selected = !!userResp[choice.id];
          const isCorrect = choice.correct;
          const isRisk = choice.penalty || choice.safetyCritical;

          let badgeText = "";
          let badgeClass = "";

          if (selected && isCorrect) {
            badgeText = "Correcto";
            badgeClass = "c360-badge-correct";
          } else if (!selected && isCorrect) {
            badgeText = "Omisión Relevante";
            badgeClass = "c360-badge-omission";
          } else if (selected && !isCorrect) {
            badgeText = isRisk ? "Acción de Riesgo" : "Acción Innecesaria";
            badgeClass = isRisk ? "c360-badge-risk" : "c360-badge-unnecessary";
          } else {
            return ""; // Decisión correcta de omitir una incorrecta no requiere feedback ruidoso
          }

          return `
            <li style="font-size:0.8rem; margin-bottom:0.25rem;">
              <strong>${selected ? "[X]" : "[  ]"} ${esc(choice.text)}</strong> 
              <span class="c360-feedback-badge ${badgeClass}">${badgeText}</span>
              <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-top:0.1rem;">${esc(choice.feedback)}</p>
            </li>
          `;
        }).join("");

        return `
          <div style="margin-bottom:0.8rem;">
            <h4>${esc(st.title)}</h4>
            <ul style="padding-left:1.2rem; margin-top:0.3rem;">${items}</ul>
          </div>
        `;
      }).join("");

      return `
        <div class="c360-result-grid sv-fade-in">
          
          <!-- Columna Izquierda: Puntaje y Competencias -->
          <div style="display:flex; flex-direction:column; gap:1.2rem;">
            <div class="sv-card c360-score-card">
              <h3>Score de Desempeño Final</h3>
              <div class="c360-score-number">${Math.round(att.finalScore)} / 100</div>
              <p style="font-size:0.85rem; color:var(--sv-text-secondary);">${att.feedbackSummary}</p>
            </div>

            <div class="sv-card">
              <h3>Evaluación Longitudinal de Competencias</h3>
              <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-bottom:0.8rem;">Desglose del nivel alcanzado por cada competencia en este caso clínico.</p>
              <div class="c360-competency-list">
                ${compList}
              </div>
            </div>
            
            <div class="sv-card">
              <h3>Desglose por Sección Docente</h3>
              <div style="display:flex; flex-direction:column; gap:0.4rem; margin-top:0.5rem;">
                ${breakdownHtml}
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Alertas de Seguridad y Retroalimentación Rúbrica -->
          <div style="display:flex; flex-direction:column; gap:1.2rem;">
            <div class="sv-card">
              <h3>Seguridad y Bioseguridad Clínica</h3>
              <div style="margin-top:0.5rem;">
                ${safetyHtml}
              </div>
            </div>

            <div class="sv-card" style="max-height:480px; overflow-y:auto;">
              <h3>Retroalimentación Detallada de Rúbrica</h3>
              <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-bottom:0.8rem;">Revisión de cada decisión y su consecuencia clínica esperada.</p>
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                ${rubricDetailsHtml}
              </div>
            </div>
          </div>

        </div>

        <div class="c360-actions-strip" style="justify-content:flex-end; margin-top:1.5rem;">
          <button class="sv-btn sv-btn-secondary" type="button" data-c360-nav="listado">Volver a la Biblioteca</button>
          <button class="sv-btn sv-btn-primary" type="button" data-c360-nav="repasar">Ver Mis Conceptos a Repasar</button>
        </div>
      `;
    }

    // ---------------------------------------------------------------------------
    // 3.D. VISTA: REMEDIACIÓN ADAPTATIVA
    // ---------------------------------------------------------------------------
    function renderRemediation() {
      const items = state.remediations;

      const itemsHtml = items.length
        ? items.map((rem, index) => {
            return `
              <div class="c360-remediation-item sv-fade-in">
                <div class="c360-rem-meta">
                  <span>Módulo: ${esc(rem.topic)}</span> | <span>Nivel: ${rem.masteryLevel}</span>
                </div>
                <p style="font-size:0.85rem; font-weight:bold; color:var(--sv-text-primary);">${esc(rem.prompt)}</p>
                <details class="c360-rem-box">
                  <summary style="cursor:pointer; color:var(--sv-casos360-color); font-weight:bold;">Ver Fundamento Clínico</summary>
                  <p style="margin-top:0.3rem; line-height:1.4; color:var(--sv-text-secondary);">${esc(rem.answer)}</p>
                </details>
                <div style="margin-top:auto; padding-top:0.5rem; text-align:right;">
                  <button type="button" class="sv-btn sv-btn-sm sv-btn-ghost" data-c360-remediation-done="${index}">Marcar Entendido</button>
                </div>
              </div>
            `;
          }).join("")
        : `
          <div class="sv-empty">
            <div class="sv-empty-icon">🎉</div>
            ¡Felicidades! No tienes conceptos clínicos pendientes de revisión.
          </div>
        `;

      return `
        <div class="sv-card c360-remediation-card">
          <h3>Panel de Repaso y Remediación Adaptativa</h3>
          <p class="p" style="margin-top:0.25rem;">
            Aquí se generan automáticamente fundamentos clínicos sobre los criterios críticos fallados, diagnósticos omitidos o decisiones tomadas con baja confianza. Repásalos para afianzar tus competencias.
          </p>
        </div>

        <section class="c360-remediation-grid">
          ${itemsHtml}
        </section>
      `;
    }

    // ---------------------------------------------------------------------------
    // 3.E. VISTA: DASHBOARD LONGITUDINAL DE COMPETENCIAS
    // ---------------------------------------------------------------------------
    function renderDashboard() {
      const attempts = getAttempts().filter(a => a.status === "completed");

      if (attempts.length === 0) {
        return `
          <div class="sv-empty">
            <div class="sv-empty-icon">📊</div>
            Aún no has completado ningún caso clínico. Resuelve al menos un caso para ver tus estadísticas longitudinales de progreso.
          </div>
        `;
      }

      // Estadísticas básicas
      const totalCompleted = attempts.length;
      const totalScoreSum = attempts.reduce((acc, a) => acc + a.finalScore, 0);
      const avgScore = totalScoreSum / totalCompleted;

      // Alertas de seguridad
      const totalSafetyAlerts = attempts.reduce((acc, a) => acc + (a.safetyErrors || []).length, 0);

      // Progreso por especie
      const speciesStats = {};
      attempts.forEach((a) => {
        const sp = a.species || "desconocido";
        if (!speciesStats[sp]) speciesStats[sp] = { sum: 0, count: 0 };
        speciesStats[sp].sum += a.finalScore;
        speciesStats[sp].count++;
      });
      const speciesListHtml = Object.entries(speciesStats).map(([sp, stat]) => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--sv-border-subtle); padding:0.4rem 0;">
          <span style="font-size:0.85rem; text-transform:capitalize;">🐾 ${sp}</span>
          <strong>${Math.round(stat.sum / stat.count)}% <small style="font-weight:normal; color:var(--sv-text-muted);">(${stat.count} intento/s)</small></strong>
        </div>
      `).join("");

      // Progreso por sistema
      const systemStats = {};
      attempts.forEach((a) => {
        const sys = a.system || "Multisistémico";
        if (!systemStats[sys]) systemStats[sys] = { sum: 0, count: 0 };
        systemStats[sys].sum += a.finalScore;
        systemStats[sys].count++;
      });
      const systemListHtml = Object.entries(systemStats).map(([sys, stat]) => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--sv-border-subtle); padding:0.4rem 0;">
          <span style="font-size:0.85rem;">🏥 ${sys}</span>
          <strong>${Math.round(stat.sum / stat.count)}% <small style="font-weight:normal; color:var(--sv-text-muted);">(${stat.count})</small></strong>
        </div>
      `).join("");

      // Promedio por competencia
      const compSums = {};
      const compCounts = {};
      attempts.forEach((a) => {
        const breakdown = a.competencyBreakdown || {};
        Object.entries(breakdown).forEach(([code, value]) => {
          if (!compSums[code]) {
            compSums[code] = 0;
            compCounts[code] = 0;
          }
          compSums[code] += value;
          compCounts[code]++;
        });
      });

      const compListHtml = D.competencies.map((c) => {
        const val = compCounts[c.code] ? Math.round(compSums[c.code] / compCounts[c.code]) : 0;
        return `
          <div class="c360-competency-item">
            <div class="c360-comp-header">
              <span>${esc(c.label)}</span>
              <span>${val}%</span>
            </div>
            <div class="c360-progress-bg">
              <div class="c360-progress-fill c360-comp-color-${c.code}" style="width:${val}%;"></div>
            </div>
          </div>
        `;
      }).join("");

      // Calibración Confianza vs Precisión (Inspección visual)
      // Agrupamos los puntos para renderizarlos en la cuadrícula de dispersión
      const calibrationPointsHtml = attempts.map((a) => {
        const x = a.confidenceBeforeSubmit || 80; // Eje X Confianza
        const y = a.finalScore; // Eje Y Precisión / Score
        // Mapear de 0-100 a 0-200 píxeles aproximados
        const leftPct = x;
        const bottomPct = y;
        return `
          <div class="c360-calib-point" style="left:${leftPct}%; bottom:${bottomPct}%;" title="Caso: ${esc(a.title)} | Confianza: ${x}% | Score: ${Math.round(y)}%"></div>
        `;
      }).join("");

      // Evaluar estado de calibración promedio
      let calibrationText = "Consistente (Calibrado)";
      let calibrationDesc = "Tus niveles de confianza son coherentes con tu precisión clínica.";
      let calibrationClass = "sv-badge-green";

      const avgConfidence = attempts.reduce((acc, a) => acc + (a.confidenceBeforeSubmit || 80), 0) / totalCompleted;
      const difference = avgConfidence - avgScore;

      if (difference > 15) {
        calibrationText = "Sobreconfiado (Overconfident)";
        calibrationDesc = "Reportas un nivel de confianza significativamente mayor al de tus resultados clínicos. Se recomienda un repaso más riguroso.";
        calibrationClass = "sv-badge-red";
      } else if (difference < -15) {
        calibrationText = "Inseguro (Underconfident)";
        calibrationDesc = "Tus puntajes reales son altos pero estimas tu confianza muy baja. Cree más en tu criterio clínico.";
        calibrationClass = "sv-badge-yellow";
      }

      return `
        <div class="c360-dash-summary sv-fade-in">
          <div class="c360-dash-stat">
            <strong>${totalCompleted}</strong>
            <span>Casos Resueltos</span>
          </div>
          <div class="c360-dash-stat">
            <strong>${Math.round(avgScore)}%</strong>
            <span>Promedio General</span>
          </div>
          <div class="c360-dash-stat" style="border-color:${totalSafetyAlerts > 0 ? "var(--sv-danger)" : "var(--sv-border)"};">
            <strong style="color:${totalSafetyAlerts > 0 ? "var(--sv-danger)" : "var(--sv-text-primary)"}">${totalSafetyAlerts}</strong>
            <span>Alertas de Seguridad</span>
          </div>
        </div>

        <div class="c360-result-grid sv-fade-in">
          <!-- Columna Izquierda: Competencias Longitudinales -->
          <div style="display:flex; flex-direction:column; gap:1.2rem;">
            <div class="sv-card">
              <h3>Competencias Clínicas Globales</h3>
              <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-bottom:0.8rem;">Promedio ponderado del desarrollo de competencias a lo largo del tiempo.</p>
              <div class="c360-competency-list">
                ${compListHtml}
              </div>
            </div>

            <div class="sv-card">
              <h3>Progreso por Especie</h3>
              <div style="display:flex; flex-direction:column; gap:0.4rem; margin-top:0.5rem;">
                ${speciesListHtml}
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Calibración Confianza/Precisión y Sistemas -->
          <div style="display:flex; flex-direction:column; gap:1.2rem;">
            <div class="sv-card">
              <h3>Calibración Confianza vs Precisión</h3>
              <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-bottom:0.8rem;">Relación entre tu confianza estimada (Eje X) y la precisión obtenida (Eje Y).</p>
              
              <div class="c360-calibration-container">
                <div class="c360-calibration-grid-visual">
                  <div class="c360-calib-diagonal"></div>
                  ${calibrationPointsHtml}
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--sv-text-muted); margin-top:0.2rem;">
                  <span>0% Confianza ➔</span>
                  <span>100% Confianza</span>
                </div>
              </div>

              <div style="margin-top:0.8rem; display:flex; flex-direction:column; gap:0.4rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span class="sv-badge ${calibrationClass}">${calibrationText}</span>
                  <span style="font-size:0.8rem;">Diferencia media: ${Math.round(difference)} puntos</span>
                </div>
                <p style="font-size:0.8rem; color:var(--sv-text-secondary);">${calibrationDesc}</p>
              </div>
            </div>

            <div class="sv-card">
              <h3>Progreso por Sistema Afectado</h3>
              <div style="display:flex; flex-direction:column; gap:0.4rem; margin-top:0.5rem;">
                ${systemListHtml}
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:1.5rem; text-align:right;">
          <button class="sv-btn sv-btn-ghost sv-btn-sm" type="button" data-c360-action="limpiar-historial">Borrar Historial de Intentos</button>
        </div>
      `;
    }

    // ---------------------------------------------------------------------------
    // 3.F. VISTA: PANEL DE ADMINISTRACIÓN / EDITOR DE CASOS
    // ---------------------------------------------------------------------------
    function renderAdmin() {
      // Opciones para cargar caso en editor
      const options = state.scenarios.map(s => `<option value="${esc(s.id)}" ${state.adminSelectedId === s.id ? "selected" : ""}>${esc(s.title)} (${esc(s.species)})</option>`).join("");

      let testResultsHtml = "";
      if (state.testResults) {
        testResultsHtml = `
          <div class="sv-card c360-test-panel sv-fade-in" style="margin-top:1.2rem;">
            <h3>Resultados de la Suite de Pruebas Unitarias</h3>
            <p style="font-size:0.75rem; color:var(--sv-text-muted); margin-bottom:0.8rem;">Ejecución de simulaciones deterministas de flujo, scoring e inserciones.</p>
            <div style="display:flex; flex-direction:column; gap:0.4rem;">
              ${state.testResults.map(r => `
                <div class="c360-test-row">
                  <span>🧪 ${esc(r.name)}</span>
                  <span class="${r.pass ? "c360-test-status-ok" : "c360-test-status-fail"}">
                    ${r.pass ? "PASSED" : "FAILED: " + r.error}
                  </span>
                </div>
              `).join("")}
            </div>
            <button class="sv-btn sv-btn-sm sv-btn-ghost" style="margin-top:0.8rem; align-self:flex-start;" type="button" data-c360-action="limpiar-pruebas">Cerrar Reporte</button>
          </div>
        `;
      }

      return `
        <div class="c360-admin-grid sv-fade-in">
          
          <!-- Lado Izquierdo: Importación/Exportación de JSON -->
          <div class="sv-card" style="gap:1rem;">
            <h3>Importar / Exportar Casos Clínicos</h3>
            <p class="p" style="margin-top:-0.5rem; font-size:0.8rem; color:var(--sv-text-muted);">
              Usa esta consola para clonar, hacer backup o pegar estructuras en formato JSON válidas para la plataforma.
            </p>

            <label class="c360-form-field">
              <span>Selecciona un escenario existente para exportar:</span>
              <select class="sv-select" data-c360-admin-select>
                <option value="">-- Nuevo Escenario Clínico --</option>
                ${options}
              </select>
            </label>

            <label class="c360-form-field">
              <span>Estructura del Caso (JSON):</span>
              <textarea class="sv-input c360-json-textarea" placeholder="Pega el esquema JSON aquí o selecciona un caso arriba para exportarlo..." data-c360-admin-json>${esc(state.adminJsonDraft)}</textarea>
            </label>

            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button type="button" class="sv-btn sv-btn-primary" data-c360-admin-btn="guardar">Validar e Importar Caso</button>
              <button type="button" class="sv-btn sv-btn-secondary" data-c360-admin-btn="duplicar" ${!state.adminSelectedId ? "disabled" : ""}>Duplicar Seleccionado</button>
              <button type="button" class="sv-btn sv-btn-danger" data-c360-admin-btn="eliminar" ${!state.adminSelectedId ? "disabled" : ""}>Eliminar Seleccionado</button>
            </div>
          </div>

          <!-- Lado Derecho: Controles Docentes y Pruebas Unitarias -->
          <div style="display:flex; flex-direction:column; gap:1.2rem;">
            <div class="sv-card">
              <h3>Controles Docentes</h3>
              <p style="font-size:0.8rem; color:var(--sv-text-muted);">Acciones globales de gestión del simulador.</p>
              
              <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.5rem;">
                <button type="button" class="sv-btn sv-btn-secondary sv-btn-full" data-c360-action="correr-pruebas">
                  🧪 Ejecutar Suite de Pruebas Unitarias/Integración
                </button>
                <button type="button" class="sv-btn sv-btn-ghost sv-btn-full" data-c360-action="restablecer-semillas">
                  🔄 Restablecer Casos Semilla Originales
                </button>
              </div>
            </div>

            <div class="sv-card">
              <h3>Guía de Formato de Assets (Multimodales)</h3>
              <p style="font-size:0.78rem; color:var(--sv-text-secondary); line-height:1.4;">
                El motor de Casos 360 soporta elementos enriquecidos en la etapa de <strong>Pruebas Complementarias</strong>. Declara el campo <code>asset</code> dentro de las opciones con estas estructuras:
              </p>
              <ul style="padding-left:1.2rem; font-size:0.75rem; color:var(--sv-text-muted); margin-top:0.4rem; display:flex; flex-direction:column; gap:0.3rem;">
                <li><strong>Imágenes</strong>: <code>{"type": "image", "title": "Nombre", "fileUrl": "url_imagen"}</code></li>
                <li><strong>Tablas de Laboratorio</strong>: <code>{"type": "lab_table", "title": "Título", "content": [["Encab1", "Encab2"], ["Fila1Col1", "Fila1Col2"]]}</code></li>
                <li><strong>Evento Histórico</strong>: <code>{"type": "timeline_event", "title": "Fecha", "content": "Detalle del evento"}</code></li>
              </ul>
            </div>
          </div>
        </div>

        ${testResultsHtml}
      `;
    }

    // ---------------------------------------------------------------------------
    // 4. LÓGICA DE JUEGO Y MOTOR DE EVALUACIÓN DETERMINISTA
    // ---------------------------------------------------------------------------
    function startAttempt(scenarioId) {
      const sc = state.scenarios.find(s => s.id === scenarioId);
      if (!sc) return;

      state.currentScenario = sc;
      state.currentStageIndex = 0;
      state.notesDraft = "";
      state.attempt = {
        id: `att-${Date.now()}-${Math.round(Math.random()*1000)}`,
        caseId: sc.id,
        title: sc.title,
        species: sc.species,
        system: sc.system,
        status: "in_progress",
        startedAt: new Date().toISOString(),
        submittedAt: null,
        responses: {}, // stageId -> { choiceId -> boolean }
        differentialsOrder: {}, // stageId -> [choiceId1, choiceId2, ...]
        interpretations: {}, // stageId -> text
        confidenceBeforeSubmit: 80,
        finalScore: 0,
        stageScores: {},
        competencyBreakdown: {},
        safetyErrors: [],
        feedbackSummary: ""
      };

      // Inicializar el orden de diferenciales si existe la etapa
      sc.stages.forEach((st) => {
        if (st.type === "diagnosticos_diferenciales") {
          state.attempt.differentialsOrder[st.id] = st.choices.map(c => c.id);
        }
      });

      state.page = "reproductor";
      render();
      notify(`Iniciando caso clínico: ${sc.title}`);
    }

    function moveStage(direction) {
      const sc = state.currentScenario;
      if (!sc) return;
      const stages = sc.stages || [];

      // Validar etapa actual si es requerida antes de avanzar
      const currentStage = stages[state.currentStageIndex];
      if (direction === "siguiente" && currentStage.required) {
        if (currentStage.type === "interpretacion" || currentStage.type === "reflection") {
          const textVal = state.attempt.interpretations[currentStage.id] || "";
          const words = textVal.trim().split(/\s+/).filter(Boolean).length;
          const minWords = currentStage.type === "interpretacion" ? 15 : 10;
          if (words < minWords) {
            notify(`Debes completar la reflexión escribiendo al menos ${minWords} palabras.`);
            return;
          }
        }
      }

      if (direction === "siguiente") {
        if (state.currentStageIndex < stages.length - 1) {
          state.currentStageIndex++;
          render();
        } else {
          // Finalizar caso clínico (Cálculo de score y evaluación)
          submitAttempt();
        }
      } else {
        if (state.currentStageIndex > 0) {
          state.currentStageIndex--;
          render();
        }
      }
    }

    function submitAttempt() {
      const att = state.attempt;
      const sc = state.currentScenario;
      att.submittedAt = new Date().toISOString();
      att.status = "completed";

      // Ejecutar motor de evaluación determinista
      evaluateAttempt(att, sc);

      // Guardar intento
      saveAttempt(att);

      // Generar remediaciones adaptativas
      generateRemediations(att, sc);

      // Redirigir a vista de resultados
      state.page = "resultado";
      render();
      notify("Caso clínico completado. Revisando tu evaluación...");
    }

    function evaluateAttempt(att, sc) {
      let totalWeightedScore = 0;
      const stageScores = {};
      const compEarned = {};
      const compMax = {};

      // Inicializar competencias
      D.competencies.forEach(c => {
        compEarned[c.code] = 0;
        compMax[c.code] = 0;
      });

      // Rúbricas por etapa
      sc.stages.forEach((stage) => {
        if (stage.type === "motivo_consulta") return;

        let stageScore = 100; // Porcentaje por etapa (0-100)
        let weight = stage.scoringWeight || 15; // Peso de la etapa sobre el total (15% por defecto)

        if (stage.type === "anamnesis" || stage.type === "examen_fisico" || stage.type === "pruebas_complementarias" || stage.type === "plan_terapeutico" || stage.type === "tutor_recs") {
          const userResp = att.responses[stage.id] || {};
          let maxPositivePoints = 0;
          let userPoints = 0;

          stage.choices.forEach((choice) => {
            const comp = choice.competencyCode || "COMP-RAZ";

            if (choice.correct) {
              maxPositivePoints += choice.score || 10;
              compMax[comp] += choice.score || 10;
              if (userResp[choice.id]) {
                userPoints += choice.score || 10;
                compEarned[comp] += choice.score || 10;
              } else {
                // Omisión
                if (choice.safetyCritical) {
                  att.safetyErrors.push(`Omitiste un paso crítico de bioseguridad/seguridad: "${choice.text}".`);
                }
              }
            } else {
              // Incorrecta
              if (userResp[choice.id]) {
                const penalty = Math.abs(choice.score || 5);
                userPoints -= penalty; // Restar penalidad

                if (choice.safetyCritical || choice.penalty) {
                  compEarned[comp] = Math.max(0, compEarned[comp] - penalty);
                  if (choice.safetyCritical) {
                    att.safetyErrors.push(`Cometiste un error crítico de seguridad clínica al seleccionar: "${choice.text}".`);
                  }
                }
              }
            }
          });

          // Evitar puntajes negativos por etapa
          const rawScore = Math.max(0, userPoints);
          stageScore = maxPositivePoints > 0 ? (rawScore / maxPositivePoints) * 100 : 100;
        }

        else if (stage.type === "diagnosticos_diferenciales") {
          const userOrder = att.differentialsOrder[stage.id] || [];
          let penaltySum = 0;

          // Rango de diferenciales correcto
          stage.choices.forEach((c) => {
            const correctIndex = c.priority - 1;
            const userIndex = userOrder.indexOf(c.id);
            if (userIndex !== -1) {
              penaltySum += Math.abs(userIndex - correctIndex);
            }
          });

          // Máxima penalización para 4 elementos es 8
          const maxPenalty = 8;
          const accuracy = Math.max(0, 1 - (penaltySum / maxPenalty));
          stageScore = accuracy * 100;

          // Sumar a competencia
          const comp = stage.competencyCode || "COMP-RAZ";
          compMax[comp] += 15;
          compEarned[comp] += accuracy * 15;
        }

        else if (stage.type === "interpretacion" || stage.type === "reflection") {
          const textVal = att.interpretations[stage.id] || "";
          const words = textVal.trim().split(/\s+/).filter(Boolean).length;
          const minWords = stage.type === "interpretacion" ? 15 : 10;

          stageScore = words >= minWords ? 100 : 0;

          // Sumar a competencia
          const comp = stage.competencyCode || "COMP-RAZ";
          compMax[comp] += weight;
          if (stageScore === 100) {
            compEarned[comp] += weight;
          }
        }

        stageScores[stage.id] = stageScore;
        totalWeightedScore += stageScore * (weight / 100);
      });

      // Si cometió errores críticos de seguridad, penalización severa del 20%
      if (att.safetyErrors.length > 0) {
        totalWeightedScore = Math.max(0, totalWeightedScore - 20);
      }

      // Guardar resultados en el intento
      att.finalScore = Math.min(100, Math.max(0, totalWeightedScore));
      att.stageScores = stageScores;

      // Calcular porcentajes de competencias
      const competencyBreakdown = {};
      D.competencies.forEach((c) => {
        const total = compMax[c.code] || 10;
        const earned = compEarned[c.code] || 0;
        competencyBreakdown[c.code] = Math.min(100, Math.max(0, (earned / total) * 100));
      });

      // Forzar competencia de Seguridad Clínica a 0 si hubo errores
      if (att.safetyErrors.length > 0) {
        competencyBreakdown["COMP-SEG"] = 0;
      } else {
        competencyBreakdown["COMP-SEG"] = 100;
      }
      att.competencyBreakdown = competencyBreakdown;

      // Resumen docente
      if (att.finalScore >= 90) {
        att.feedbackSummary = "¡Excelente desempeño clínico! Demostraste gran criterio en el diagnóstico y tratamiento, respetando los estándares de seguridad.";
      } else if (att.finalScore >= 70) {
        att.feedbackSummary = "Buen desempeño general. Tienes bases sólidas pero hay detalles terapéuticos o de bioseguridad que debes pulir.";
      } else {
        att.feedbackSummary = "Atención: Tu puntaje refleja brechas importantes en el razonamiento clínico o la seguridad del paciente. Repasa el panel de remediación.";
      }
    }

    // ---------------------------------------------------------------------------
    // 5. REMEDIACIÓN ADAPTATIVA
    // ---------------------------------------------------------------------------
    function generateRemediations(att, sc) {
      const items = [...state.remediations];

      sc.stages.forEach((stage) => {
        if (stage.type === "motivo_consulta" || stage.type === "interpretacion" || stage.type === "reflection") return;

        if (stage.type === "diagnosticos_diferenciales") {
          const userOrder = att.differentialsOrder[stage.id] || [];
          stage.choices.forEach((choice) => {
            const correctIndex = choice.priority - 1;
            const userIndex = userOrder.indexOf(choice.id);
            // Si el diferencial está desplazado por más de 1 posición, generar remediación
            if (userIndex !== -1 && Math.abs(userIndex - correctIndex) > 1) {
              const keyId = `rem-${sc.id}-${choice.id}`;
              if (!items.some(x => x.id === keyId)) {
                items.push({
                  id: keyId,
                  userId: "default-user",
                  caseId: sc.id,
                  criterionId: choice.id,
                  topic: stage.title,
                  prompt: `¿Cuál es el sustento clínico y la prioridad real de: "${choice.text}" en un cuadro de ${sc.title}?`,
                  answer: choice.feedback,
                  nextReviewAt: new Date(Date.now() + 86400000).toISOString(), // +24 Horas
                  masteryLevel: 1
                });
              }
            }
          });
          return;
        }

        // Checklist stages
        const userResp = att.responses[stage.id] || {};
        stage.choices.forEach((choice) => {
          const selected = !!userResp[choice.id];
          const isCorrect = choice.correct;
          const isSafety = choice.safetyCritical;

          // Generar remediación si falló (acción errónea o de riesgo, u omisión)
          let failed = false;
          let reason = "";

          if (!selected && isCorrect) {
            failed = true;
            reason = "Omisión crítica";
          } else if (selected && !isCorrect) {
            failed = true;
            reason = isSafety ? "Acción riesgosa tomada" : "Decisión innecesaria";
          }

          if (failed) {
            const keyId = `rem-${sc.id}-${choice.id}`;
            // Evitar duplicados
            if (!items.some(x => x.id === keyId)) {
              items.push({
                id: keyId,
                userId: "default-user",
                caseId: sc.id,
                criterionId: choice.id,
                topic: `${stage.title} (${reason})`,
                prompt: `¿Por qué es importante considerar o evitar: "${choice.text}" en ${sc.title}?`,
                answer: choice.feedback,
                nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
                masteryLevel: 1
              });
            }
          }
        });
      });

      // Remediación por baja confianza
      if (att.confidenceBeforeSubmit <= 60) {
        const keyId = `rem-${sc.id}-low-conf`;
        if (!items.some(x => x.id === keyId)) {
          items.push({
            id: keyId,
            userId: "default-user",
            caseId: sc.id,
            criterionId: "low-confidence",
            topic: "Autoevaluación de Confianza",
            prompt: `Repaso integral de los objetivos del caso de ${sc.title} debido a baja confianza clínica reportada.`,
            answer: `Revisa los objetivos clave: ${sc.learningObjectives.join(". ") || ""}`,
            nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
            masteryLevel: 1
          });
        }
      }

      saveRemediations(items);
    }

    // ---------------------------------------------------------------------------
    // 6. DELEGACIÓN DE EVENTOS EN EL DOM (CLICK, INPUT)
    // ---------------------------------------------------------------------------
    function handleClicks(event) {
      // Navegación interna de pestañas
      const navBtn = event.target.closest("[data-c360-nav]");
      if (navBtn) {
        state.page = navBtn.dataset.c360Nav;
        if (state.page === "admin") {
          state.adminSelectedId = "";
          state.adminJsonDraft = "";
          state.testResults = null;
        }
        render();
        return;
      }

      // Jugar un caso clínico
      const playBtn = event.target.closest("[data-c360-play]");
      if (playBtn) {
        startAttempt(playBtn.dataset.c360Play);
        return;
      }

      // Acciones del reproductor
      const actionBtn = event.target.closest("[data-c360-action]");
      if (actionBtn) {
        const act = actionBtn.dataset.c360Action;
        if (act === "siguiente") return moveStage("siguiente");
        if (act === "anterior") return moveStage("anterior");
        if (act === "abandonar") {
          if (confirm("¿Seguro que deseas salir? El progreso actual de este intento se perderá.")) {
            state.page = "listado";
            state.currentScenario = null;
            state.attempt = null;
            render();
          }
          return;
        }
        if (act === "limpiar-historial") {
          if (confirm("¿Estás seguro de que deseas borrar todo el historial de intentos? Esto reiniciará tus estadísticas.")) {
            localStorage.removeItem(D.storageKeyAttempts);
            render();
            notify("Historial de intentos eliminado.");
          }
          return;
        }
        if (act === "restablecer-semillas") {
          if (confirm("¿Deseas restablecer los casos predeterminados y eliminar casos personalizados?")) {
            localStorage.removeItem(D.storageKeyCustomCases);
            state.adminSelectedId = "";
            state.adminJsonDraft = "";
            initData();
            render();
            notify("Casos restaurados.");
          }
          return;
        }
        if (act === "correr-pruebas") {
          runTests();
          return;
        }
        if (act === "limpiar-pruebas") {
          state.testResults = null;
          render();
          return;
        }
      }

      // Selección de opciones en Checklist
      const checkboxOpt = event.target.closest("[data-c360-choice-id]");
      if (checkboxOpt) {
        const choiceId = checkboxOpt.dataset.c360ChoiceId;
        const stageId = state.currentScenario.stages[state.currentStageIndex].id;
        state.attempt.responses[stageId] = state.attempt.responses[stageId] || {};
        state.attempt.responses[stageId][choiceId] = checkboxOpt.checked;
        render();
        return;
      }

      // Ordenar diagnósticos diferenciales
      const sortMove = event.target.closest("[data-c360-sort-move]");
      if (sortMove) {
        const move = sortMove.dataset.c360SortMove;
        const diffId = sortMove.dataset.c360SortId;
        const stageId = state.currentScenario.stages[state.currentStageIndex].id;
        const currentOrder = state.attempt.differentialsOrder[stageId] || [];

        const idx = currentOrder.indexOf(diffId);
        if (idx !== -1) {
          if (move === "up" && idx > 0) {
            currentOrder[idx] = currentOrder[idx - 1];
            currentOrder[idx - 1] = diffId;
          } else if (move === "down" && idx < currentOrder.length - 1) {
            currentOrder[idx] = currentOrder[idx + 1];
            currentOrder[idx + 1] = diffId;
          }
          state.attempt.differentialsOrder[stageId] = currentOrder;
          render();
        }
        return;
      }

      // Remediación - Marcar como entendido
      const remDone = event.target.closest("[data-c360-remediation-done]");
      if (remDone) {
        const index = parseInt(remDone.dataset.c360RemediationDone, 10);
        const list = [...state.remediations];
        list.splice(index, 1);
        saveRemediations(list);
        render();
        notify("Concepto clínico archivado.");
        return;
      }

      // Acciones del Admin JSON Editor
      const adminBtn = event.target.closest("[data-c360-admin-btn]");
      if (adminBtn) {
        const action = adminBtn.dataset.c360AdminBtn;
        if (action === "guardar") return handleAdminImport();
        if (action === "duplicar") return handleAdminDuplicate();
        if (action === "eliminar") return handleAdminDelete();
      }
    }

    function handleInputs(event) {
      const target = event.target;

      // Guardar filtro
      if (target.dataset.c360Filter) {
        state.filters[target.dataset.c360Filter] = target.value;
        render();
        return;
      }

      // Bloc de notas
      if (target.dataset.c360NotesInput !== undefined) {
        state.notesDraft = target.value;
        return;
      }

      // Slider de confianza
      if (target.dataset.c360ConfidenceSlider !== undefined) {
        state.attempt.confidenceBeforeSubmit = parseInt(target.value, 10);
        // Actualizar el valor numérico en el reproductor sin re-renderizar todo
        const valEl = target.nextElementSibling;
        if (valEl) valEl.textContent = `${target.value}%`;
        return;
      }

      // Textareas de reflexión/interpretación
      if (target.dataset.c360InterpretText) {
        const stageId = target.dataset.c360InterpretText;
        state.attempt.interpretations[stageId] = target.value;
        return;
      }

      // Cambiar selector de caso en admin
      if (target.dataset.c360AdminSelect !== undefined) {
        state.adminSelectedId = target.value;
        if (state.adminSelectedId) {
          const found = state.scenarios.find(s => s.id === state.adminSelectedId);
          state.adminJsonDraft = found ? JSON.stringify(found, null, 2) : "";
        } else {
          state.adminJsonDraft = "";
        }
        render();
        return;
      }

      // Borrador JSON en editor
      if (target.dataset.c360AdminJson !== undefined) {
        state.adminJsonDraft = target.value;
        return;
      }
    }

    // ---------------------------------------------------------------------------
    // 7. GESTIÓN DOCENTE Y COMPARTICIÓN DE CASOS (JSON IMPORT/EXPORT)
    // ---------------------------------------------------------------------------
    function handleAdminImport() {
      const raw = state.adminJsonDraft.trim();
      if (!raw) {
        notify("El campo JSON está vacío.");
        return;
      }

      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        notify(`Error de sintaxis JSON: ${err.message}`);
        return;
      }

      // Validar esquema básico
      const errors = validateScenarioSchema(parsed);
      if (errors.length > 0) {
        alert(`Esquema inválido:\n- ${errors.join("\n- ")}`);
        return;
      }

      // Guardar
      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem(D.storageKeyCustomCases)) || [];
      } catch (e) {}

      // Reemplazar o agregar
      const idx = custom.findIndex(c => c.id === parsed.id);
      if (idx !== -1) {
        custom[idx] = parsed;
      } else {
        custom.unshift(parsed);
      }

      saveCustomCases(custom);
      state.adminSelectedId = parsed.id;
      notify(`Caso clínico "${parsed.title}" importado/guardado correctamente.`);
      render();
    }

    function handleAdminDuplicate() {
      if (!state.adminSelectedId) return;
      const found = state.scenarios.find(s => s.id === state.adminSelectedId);
      if (!found) return;

      const dup = JSON.parse(JSON.stringify(found));
      dup.id = `${dup.id}-copy-${Math.round(Math.random()*100)}`;
      dup.title = `${dup.title} (Copia)`;

      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem(D.storageKeyCustomCases)) || [];
      } catch (e) {}

      custom.unshift(dup);
      saveCustomCases(custom);
      state.adminSelectedId = dup.id;
      state.adminJsonDraft = JSON.stringify(dup, null, 2);
      notify(`Caso duplicado correctamente.`);
      render();
    }

    function handleAdminDelete() {
      if (!state.adminSelectedId) return;
      // Las semillas no se pueden eliminar de forma permanente del array estático,
      // pero podemos filtrar el localstorage de personalizados.
      const isSeed = D.seedScenarios.some(s => s.id === state.adminSelectedId);
      if (isSeed) {
        alert("Los casos semilla del sistema no se pueden eliminar. Solo los personalizados.");
        return;
      }

      if (confirm("¿Estás seguro de que deseas eliminar permanentemente este caso personalizado?")) {
        let custom = [];
        try {
          custom = JSON.parse(localStorage.getItem(D.storageKeyCustomCases)) || [];
        } catch (e) {}

        custom = custom.filter(c => c.id !== state.adminSelectedId);
        saveCustomCases(custom);
        state.adminSelectedId = "";
        state.adminJsonDraft = "";
        notify("Caso eliminado correctamente.");
        render();
      }
    }

    function validateScenarioSchema(data) {
      const errs = [];
      if (!data.id) errs.push("Falta 'id' único.");
      if (!data.title) errs.push("Falta 'title'.");
      if (!data.species) errs.push("Falta 'species'.");
      if (!data.system) errs.push("Falta 'system'.");
      if (!data.difficulty) errs.push("Falta 'difficulty'.");
      if (!Array.isArray(data.stages)) {
        errs.push("'stages' debe ser un array.");
      } else {
        data.stages.forEach((st, idx) => {
          if (!st.id) errs.push(`Etapa en índice ${idx} no tiene 'id'.`);
          if (!st.type) errs.push(`Etapa en índice ${idx} no tiene 'type'.`);
          if (!st.title) errs.push(`Etapa en índice ${idx} no tiene 'title'.`);
        });
      }
      return errs;
    }

    // ---------------------------------------------------------------------------
    // 8. BUSCADOR GLOBAL Y NAVEGACIÓN DESDE EL BUSCADOR
    // ---------------------------------------------------------------------------
    function registerGlobalSearch() {
      if (window.SuiteVet?.registerSearch) {
        window.SuiteVet.registerSearch("casos360", (query) => {
          const q = query.toLowerCase().trim();
          const matches = [];

          state.scenarios.forEach((sc) => {
            if (sc.title.toLowerCase().includes(q) || sc.system.toLowerCase().includes(q)) {
              matches.push({
                title: `Caso 360: ${sc.title}`,
                subtitle: `${sc.system} · Dificultad: ${sc.difficulty}`,
                moduleId: "casos360",
                action: () => {
                  window.SuiteVet.showView("casos360");
                  startAttempt(sc.id);
                }
              });
            }
          });

          return matches;
        });
      }
    }

    // ---------------------------------------------------------------------------
    // 9. AUTOMATED TEST SUITE (browser integrated runner)
    // ---------------------------------------------------------------------------
    function runTests() {
      const results = [];
      const assert = (condition, msg) => {
        if (!condition) throw new Error(msg);
      };

      // 1. Test List rendering exists
      try {
        const testListEl = renderList();
        assert(typeof testListEl === "string" && testListEl.includes("sv-toolbar"), "Falla al renderizar listado.");
        results.push({ name: "Render de Listado de Casos", pass: true });
      } catch (e) {
        results.push({ name: "Render de Listado de Casos", pass: false, error: e.message });
      }

      // 2. Test Attempt initialization
      try {
        const seedId = "canino-gastroenteritis";
        startAttempt(seedId);
        assert(state.currentScenario.id === seedId, "El escenario actual no coincide.");
        assert(state.attempt !== null, "El intento clínico es nulo.");
        assert(state.attempt.status === "in_progress", "El estado del intento no es 'in_progress'.");
        results.push({ name: "Flujo Inicial de Intento", pass: true });
      } catch (e) {
        results.push({ name: "Flujo Inicial de Intento", pass: false, error: e.message });
      }

      // 3. Test scoring engine and safety critical errors
      try {
        const sc = state.scenarios.find(s => s.id === "canino-gastroenteritis");
        const mockAttempt = {
          responses: {
            "c2-anamnesis": { "cq1": true, "cq2": true }, // correctas
            "c2-terapeutico": { "ctx1": true, "ctx2": true } // seleccionó oral (riesgo) y fluidoterapia (correcta)
          },
          differentialsOrder: {
            "c2-diferenciales": ["cd1", "cd2", "cd3", "cd4"] // orden perfecto
          },
          interpretations: {
            "c2-interpretacion": "Esta es una interpretación clínica simulada que supera quince palabras para pasar la rúbrica.",
            "c2-reflexion": "Esta es una reflexión autocrítica simulada de más de diez palabras."
          },
          confidenceBeforeSubmit: 90,
          safetyErrors: [],
          finalScore: 0
        };

        evaluateAttempt(mockAttempt, sc);

        // Debería tener una alerta de seguridad (NPO violado en ctx1)
        assert(mockAttempt.safetyErrors.length > 0, "No se detectó el error crítico de terapia oral.");
        assert(mockAttempt.safetyErrors.some(x => x.includes("oral")), "El texto del error crítico no contiene detalles esperados.");
        assert(mockAttempt.competencyBreakdown["COMP-SEG"] === 0, "Seguridad clínica debería estar en 0% por el error.");
        assert(mockAttempt.finalScore < 100, "El score no fue penalizado por el error de seguridad.");
        results.push({ name: "Motor de Rúbricas e Identificación de Seguridad", pass: true });
      } catch (e) {
        results.push({ name: "Motor de Rúbricas e Identificación de Seguridad", pass: false, error: e.message });
      }

      // 4. Test Adaptive Remediation generator
      try {
        const sc = state.scenarios.find(s => s.id === "canino-gastroenteritis");
        const mockAttempt = {
          responses: {
            "c2-anamnesis": { "cq1": true, "cq5": true }, // cq5 es incorrecto (marca shampoo)
            "c2-terapeutico": { "ctx1": false }
          },
          differentialsOrder: {
            "c2-diferenciales": ["cd4", "cd3", "cd2", "cd1"] // orden totalmente incorrecto
          },
          interpretations: {},
          confidenceBeforeSubmit: 40, // baja confianza
          safetyErrors: [],
          finalScore: 0
        };

        // Guardar remediaciones iniciales antes del test
        const originalRemediations = [...state.remediations];
        state.remediations = [];

        generateRemediations(mockAttempt, sc);

        assert(state.remediations.length > 0, "No se generaron remediaciones.");
        // Debería tener remediación de baja confianza
        assert(state.remediations.some(r => r.criterionId === "low-confidence"), "No se generó la remediación de baja confianza.");
        // Debería tener remediación por diferencial incorrecto o elección incorrecta
        assert(state.remediations.some(r => r.id.includes("cd")), "No se generó remediación por orden incorrecto de diferenciales.");

        // Restaurar
        state.remediations = originalRemediations;

        results.push({ name: "Generación de Remediaciones Adaptativas", pass: true });
      } catch (e) {
        results.push({ name: "Generación de Remediaciones Adaptativas", pass: false, error: e.message });
      }

      // 5. Test complete seed playthrough (perfect answers)
      try {
        const sc = state.scenarios.find(s => s.id === "bovino-respiratorio");
        const mockAttempt = {
          responses: {
            "b1-anamnesis": { "bq1": true, "bq2": true, "bq4": true },
            "b1-examen": { "bm1": true, "bm2": true, "bm4": true, "bm5": true },
            "b1-pruebas": { "bt1": true, "bt2": true, "bt3": true },
            "b1-terapeutico": { "btx1": true, "btx2": true, "btx4": true },
            "b1-tutor": { "br1": true, "br2": true, "br4": true }
          },
          differentialsOrder: {
            "b1-diferenciales": ["bd1", "bd2", "bd3", "bd4"]
          },
          interpretations: {
            "b1-interpretacion": "Esta es la interpretación clínica simulada para el ternero con bronconeumonía con suficientes palabras.",
            "b1-reflexion": "Esta es la reflexión autocrítica para el ternero bovino con suficientes palabras."
          },
          confidenceBeforeSubmit: 95,
          safetyErrors: [],
          finalScore: 0
        };

        evaluateAttempt(mockAttempt, sc);

        assert(mockAttempt.safetyErrors.length === 0, "Se registraron errores clínicos en un caso perfecto.");
        assert(mockAttempt.finalScore >= 95, `El puntaje del intento perfecto fue muy bajo: ${mockAttempt.finalScore}%`);
        results.push({ name: "Simulación de Playthrough del Caso Semilla Bovino", pass: true });
      } catch (e) {
        results.push({ name: "Simulación de Playthrough del Caso Semilla Bovino", pass: false, error: e.message });
      }

      // Restaurar estado a pestaña admin con resultados
      state.page = "admin";
      state.currentScenario = null;
      state.attempt = null;
      state.testResults = results;
      render();
      notify("Suite de pruebas completada.");
    }

    // ---------------------------------------------------------------------------
    // AUXILIARES
    // ---------------------------------------------------------------------------
    function esc(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function notify(msg) {
      // Intentar usar el sistema de notificaciones globales si está definido en otros módulos,
      // sino alert o consola silenciosa
      console.log(`[Casos 360] Notification: ${msg}`);
      
      let container = document.getElementById("sv-notification-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "sv-notification-container";
        container.style.position = "fixed";
        container.style.bottom = "2rem";
        container.style.right = "2rem";
        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "0.5rem";
        document.body.appendChild(container);
      }

      const toast = document.createElement("div");
      toast.style.background = "var(--sv-bg-surface)";
      toast.style.color = "var(--sv-text-primary)";
      toast.style.borderLeft = "4px solid var(--sv-casos360-color)";
      toast.style.padding = "0.8rem 1.2rem";
      toast.style.borderRadius = "0.4rem";
      toast.style.boxShadow = "var(--sv-shadow-md)";
      toast.style.fontSize = "0.85rem";
      toast.style.fontWeight = "500";
      toast.style.animation = "sv-fadeIn 0.2s ease";
      toast.textContent = msg;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  });
})();
