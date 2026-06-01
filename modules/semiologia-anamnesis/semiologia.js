(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("semiologia-root");
    if (!root) return;

    const D = window.SEMIOLOGIA_DATA || {};
    const Fav = window.SuiteVet?.Favorites || null;
    const Pdf = window.SuiteVet?.SemiologiaPdf || null;
    const S = D.storage || {};

    const state = {
      page: "inicio",
      anamnesisMode: "aprendizaje",
      anamnesis: createAnamnesisState(),
      sim: createSimulationState(),
      exam: createExamState(),
      parametros: createParameterState(),
      maneuvers: { query: "", species: "", system: "", difficulty: "", type: "" },
      osce: createOsceState(),
      logbook: loadJson(S.logbook, []),
      logbookDraft: createLogbookDraft(),
      templates: loadTemplates(),
      savedAnamnesis: loadJson(S.anamnesis, []),
      savedExams: loadJson(S.examenes, []),
      osceHistory: loadJson(S.osce, []),
      templateSearch: ""
    };

    ensureAnamnesisQuestions();
    startOsceTimerLoop();
    registerGlobalSearch();
    mountBridgeFunctions();

    root.addEventListener("click", onClick);
    root.addEventListener("input", onInput);
    root.addEventListener("change", onInput);

    render();

    function render() {
      root.innerHTML = `
        <section class="semi-shell sv-module-shell">
          ${renderHeader()}
          ${renderTabs()}
          ${renderPage()}
        </section>
      `;
      Fav?.bindWithin(root);
    }

    function renderHeader() {
      return `
        <section class="sv-module-header semi-header">
          <p class="semi-kicker">SUITE VET</p>
          <h2>${esc(D.moduleLabel || "Semiologia & Anamnesis Pro")}</h2>
          <p class="sv-view-intro">${esc(D.intro || "")}</p>
        </section>
      `;
    }

    function renderTabs() {
      const tabs = [{ id: "inicio", label: "Inicio", icon: "IN" }].concat((D.homeSections || []).map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon
      })));
      return `
        <div class="sv-module-subnav semi-tabs" aria-label="Secciones de Semiologia y Anamnesis Pro">
          ${tabs.map((tab) => `
            <button type="button" class="sv-module-tab ${state.page === tab.id ? "is-active" : ""}" data-semi-page="${esc(tab.id)}">
              <span>${esc(tab.icon)}</span>
              <strong>${esc(tab.label)}</strong>
            </button>
          `).join("")}
        </div>
      `;
    }

    function renderPage() {
      if (state.page === "anamnesis") return renderAnamnesis();
      if (state.page === "examen") return renderExamen();
      if (state.page === "maniobras") return renderManiobras();
      if (state.page === "osce") return renderOsce();
      if (state.page === "parametros") return renderParametros();
      if (state.page === "logbook") return renderLogbook();
      if (state.page === "casos") return renderCasos();
      if (state.page === "plantillas") return renderPlantillas();
      return renderHome();
    }

    function renderHome() {
      return `
        <section class="semi-home">
          <div class="semi-home-grid">
            ${(D.homeSections || []).map((item) => `
              <button type="button" class="semi-home-card" data-semi-go="${esc(item.id)}">
                <em>${esc(item.icon)}</em>
                <strong>${esc(item.label)}</strong>
                <span>${esc(item.description)}</span>
              </button>
            `).join("")}
          </div>
          <section class="semi-card">
            <h3>Que aprenderas aqui?</h3>
            <div class="semi-chip-grid">
              ${(D.learningChips || []).map((chip) => `<span class="sv-badge sv-badge-blue">${esc(chip)}</span>`).join("")}
            </div>
          </section>
        </section>
      `;
    }

    function renderAnamnesis() {
      return `
        <section class="semi-anamnesis">
          <div class="semi-inline-tabs">
            <button class="semi-inline-tab ${state.anamnesisMode === "aprendizaje" ? "is-active" : ""}" data-an-mode="aprendizaje">Modo Aprendizaje</button>
            <button class="semi-inline-tab ${state.anamnesisMode === "simulacion" ? "is-active" : ""}" data-an-mode="simulacion">Modo Simulacion</button>
          </div>
          ${state.anamnesisMode === "simulacion" ? renderSimulacion() : renderAprendizaje()}
        </section>
      `;
    }

    function renderAprendizaje() {
      const a = state.anamnesis;
      const essentialIds = essentialQuestionIds();
      const answered = essentialIds.filter((id) => cleanText(a.questions[id]?.answer)).length;
      const pct = essentialIds.length ? Math.round((answered / essentialIds.length) * 100) : 0;
      const traffic = trafficState(pct, essentialIds);
      const flags = detectRedFlags();
      const visibleQuestions = getVisibleQuestionEntries();
      const summary = cleanText(a.summary);

      return `
        <section class="semi-card">
          <h3>Entrenador de Anamnesis - Modo Aprendizaje</h3>
          <p class="semi-subtitle">Formulario guiado por pasos con preguntas esenciales, sugerencias por sistema y alertas clinicas.</p>
        </section>

        <details class="semi-section" open>
          <summary>1. Tipo de consulta y datos basicos</summary>
          <div class="semi-form-grid semi-form-grid-3">
            ${selectField("Tipo de consulta", "consultType", D.consultTypes || [], a.consultType)}
            ${speciesField(a.species)}
            ${textField("Nombre o ID del paciente", "patientName", a.patientName)}
            ${textField("Edad", "age", a.age)}
            ${textField("Sexo", "sex", a.sex)}
            ${textField("Raza", "breed", a.breed)}
            ${textField("Peso", "weight", a.weight)}
            ${textField("Propietario/responsable", "owner", a.owner)}
            <label class="semi-field">
              <span>Sistema principal sospechado</span>
              <select class="sv-select" data-an-field="system">
                <option value="">Selecciona</option>
                ${(D.systems || []).map((item) => `<option value="${esc(item.id)}" ${item.id === a.system ? "selected" : ""}>${esc(item.label)}</option>`).join("")}
              </select>
            </label>
          </div>
          ${textareaField("Motivo de consulta", "reason", a.reason, "Describe la preocupacion principal reportada por el responsable.")}
        </details>

        <details class="semi-section" open>
          <summary>2. Preguntas esenciales de anamnesis</summary>
          <div class="semi-question-list">
            ${visibleQuestions.map(renderQuestionCard).join("")}
          </div>
        </details>

        <details class="semi-section" open>
          <summary>3. Progreso, semaforo y red flags</summary>
          <div class="semi-progress">
            <div class="semi-progress-head">
              <strong>Anamnesis completada: ${pct}%</strong>
              <span class="semi-muted">${answered}/${essentialIds.length} preguntas esenciales respondidas</span>
            </div>
            <div class="semi-progress-track">
              <div class="semi-progress-value" style="width:${pct}%"></div>
            </div>
            <div class="semi-traffic">
              <span class="semi-light ${traffic === "red" ? "is-red" : ""}">Rojo</span>
              <span class="semi-light ${traffic === "yellow" ? "is-yellow" : ""}">Amarillo</span>
              <span class="semi-light ${traffic === "green" ? "is-green" : ""}">Verde</span>
            </div>
          </div>
          <div class="semi-red-flag-list">
            ${flags.length ? flags.map((flag) => `
              <article class="semi-red-flag">
                <strong>${esc(flag.title)}</strong>
                <p>${esc(flag.recommendation)}</p>
              </article>
            `).join("") : `<p class="semi-muted">Sin red flags detectadas con la informacion actual.</p>`}
          </div>
        </details>

        <details class="semi-section" open>
          <summary>4. Resumen automatico de anamnesis</summary>
          <div class="semi-actions">
            <button class="sv-btn sv-btn-secondary" type="button" data-an-action="generate-summary">Generar resumen de anamnesis</button>
            <button class="sv-btn sv-btn-ghost" type="button" data-an-action="copy-summary">Copiar resumen</button>
            <button class="sv-btn sv-btn-ghost" type="button" data-an-action="send-clinica">Enviar a Clinica Integrada</button>
            <button class="sv-btn sv-btn-primary" type="button" data-an-action="save">Guardar anamnesis</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-an-action="print">Descargar/Imprimir PDF</button>
          </div>
          ${textareaField("Resumen editable", "summary", summary, "Genera el resumen automatico y ajustalo segun criterio clinico.")}
          ${textareaField("Observaciones", "notes", a.notes, "Notas adicionales para seguimiento clinico y docente.")}
          ${state.savedAnamnesis.length ? `<p class="semi-muted">Registros guardados: ${state.savedAnamnesis.length}</p>` : ""}
        </details>
      `;
    }

    function renderQuestionCard(entry) {
      const q = entry.value;
      return `
        <article class="semi-question-card ${q.asked ? "is-asked" : ""} ${q.important ? "is-important" : ""}">
          <h5>${esc(entry.label)}</h5>
          <textarea class="sv-input" data-an-question-answer="${esc(entry.id)}" placeholder="Registrar respuesta...">${esc(q.answer || "")}</textarea>
          <div class="semi-question-actions">
            <button type="button" class="semi-mini-btn ${q.asked ? "is-on" : ""}" data-an-action="toggle-asked" data-qid="${esc(entry.id)}">Marcar como preguntada</button>
            <button type="button" class="semi-mini-btn ${q.important ? "is-on" : ""}" data-an-action="toggle-important" data-qid="${esc(entry.id)}">Marcar como importante</button>
            <button type="button" class="semi-mini-btn" data-an-action="mark-response" data-qid="${esc(entry.id)}">Agregar respuesta</button>
            <button type="button" class="semi-mini-btn ${q.includeSummary ? "is-on" : ""}" data-an-action="toggle-summary" data-qid="${esc(entry.id)}">Agregar a resumen</button>
          </div>
        </article>
      `;
    }

    function renderSimulacion() {
      const s = state.sim;
      const cases = D.simulationCases || [];
      const activeCase = cases.find((item) => item.id === s.caseId) || null;
      const askedIds = new Set((s.asked || []).map((item) => item.keyId).filter(Boolean));
      const made = askedIds.size;
      const total = activeCase ? activeCase.keyQuestions.length : 0;
      const omitted = activeCase ? activeCase.keyQuestions.filter((q) => !askedIds.has(q.id)).map((q) => q.label) : [];
      const bias = interviewBiasLabel();
      const orderTip = interviewOrderTip();
      const redFlags = detectRedFlagsFromTexts((s.asked || []).map((item) => item.response || ""));
      return `
        <section class="semi-card">
          <h3>Entrenador de Anamnesis - Modo Simulacion</h3>
          <p class="semi-subtitle">Selecciona un caso oculto y realiza preguntas clave para evaluar tu secuencia de entrevista.</p>
          <div class="semi-form-grid semi-form-grid-3">
            <label class="semi-field">
              <span>Caso simulado</span>
              <select class="sv-select" data-sim-field="caseId">
                <option value="">Selecciona un caso</option>
                ${cases.map((item) => `<option value="${esc(item.id)}" ${item.id === s.caseId ? "selected" : ""}>${esc(item.title)}</option>`).join("")}
              </select>
            </label>
            <label class="semi-field">
              <span>Pregunta manual</span>
              <input class="sv-input" type="text" data-sim-field="draftQuestion" value="${esc(s.draftQuestion)}" placeholder="Escribe una pregunta libre..." />
            </label>
            <div class="semi-actions">
              <button type="button" class="sv-btn sv-btn-secondary" data-sim-action="ask-manual">Preguntar</button>
              <button type="button" class="sv-btn sv-btn-ghost" data-sim-action="retry">Reintentar simulacion</button>
            </div>
          </div>
        </section>

        ${activeCase ? `
          <section class="semi-sim-layout">
            <article class="semi-sim-col">
              <h4>Ficha visible del caso</h4>
              <p><strong>Especie:</strong> ${esc(speciesLabel(activeCase.species))}</p>
              <p><strong>Motivo:</strong> ${esc(activeCase.motive)}</p>
              <p><strong>Propietario:</strong> ${esc(activeCase.owner)}</p>
              <div class="semi-chip-grid">
                ${activeCase.keyQuestions.map((q) => `
                  <button type="button" class="semi-mini-btn ${askedIds.has(q.id) ? "is-on" : ""}" data-sim-ask="${esc(q.id)}">${esc(q.label)}</button>
                `).join("")}
              </div>
            </article>

            <article class="semi-sim-col">
              <h4>Respuestas del propietario simulado</h4>
              <div class="semi-sim-responses">
                ${(s.asked || []).length ? s.asked.map((entry) => `
                  <div class="semi-sim-response">
                    <b>${esc(entry.question)}</b>
                    <span>${esc(entry.response)}</span>
                  </div>
                `).join("") : `<p class="semi-muted">Aun no hay preguntas realizadas.</p>`}
              </div>
            </article>
          </section>

          <section class="semi-card">
            <h4>Evaluacion de simulacion</h4>
            <div class="semi-form-grid semi-form-grid-3">
              <div class="semi-note"><strong>Preguntas esenciales realizadas</strong><span>${made}/${total}</span></div>
              <div class="semi-note"><strong>Preguntas omitidas</strong><span>${omitted.length}</span></div>
              <div class="semi-note"><strong>Red flags detectadas</strong><span>${redFlags.length}</span></div>
            </div>
            <div class="semi-note">
              <strong>Sesgo de entrevista</strong>
              <span>${esc(bias)}</span>
            </div>
            <div class="semi-note">
              <strong>Orden de entrevista</strong>
              <span>${esc(orderTip)}</span>
            </div>
            ${omitted.length ? `<p class="semi-muted"><strong>Pendientes:</strong> ${esc(omitted.join(", "))}</p>` : ""}
            ${redFlags.length ? `<p class="semi-muted"><strong>Red flags:</strong> ${esc(redFlags.map((f) => f.title).join(", "))}</p>` : ""}
            <div class="semi-actions">
              <button type="button" class="sv-btn sv-btn-ghost" data-sim-action="toggle-guide">Ver guia docente</button>
              <button type="button" class="sv-btn sv-btn-primary" data-sim-action="send-clinica">Enviar caso a Clinica Integrada</button>
            </div>
            ${s.showGuide ? `<div class="semi-note"><strong>Guia docente</strong><span>${esc(activeCase.guide)}</span></div>` : ""}
          </section>
        ` : `
          <section class="semi-card">
            <div class="sv-empty">
              <div class="sv-empty-icon">OS</div>
              Selecciona un caso para iniciar la entrevista simulada.
            </div>
          </section>
        `}
      `;
    }

    function renderExamen() {
      const e = state.exam;
      const steps = visibleExamSteps();
      const done = steps.filter((s) => e.steps[s.id]?.done).length;
      const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
      return `
        <section class="semi-card">
          <h3>Examen Fisico Guiado</h3>
          <p class="semi-subtitle">Sigue un checklist por especie y registra hallazgos para construir una lista de problemas clinicos.</p>
          <div class="semi-form-grid semi-form-grid-3">
            ${textField("Paciente/ID", "exam.patientName", e.patientName)}
            ${selectField("Especie", "exam.species", (D.species || []).map((item) => ({ value: item.id, label: item.label })), e.species, "Selecciona")}
            ${selectField("Modo de examen", "exam.mode", (D.examSpeciesModes || []).map((item) => ({ value: item.id, label: item.label })), e.mode, "Selecciona")}
            ${textField("Temperatura", "exam.vitals.temperatura", e.vitals.temperatura)}
            ${textField("Frecuencia cardiaca", "exam.vitals.fc", e.vitals.fc)}
            ${textField("Frecuencia respiratoria", "exam.vitals.fr", e.vitals.fr)}
            ${textField("TLLC", "exam.vitals.tllc", e.vitals.tllc)}
          </div>
          <div class="semi-progress">
            <div class="semi-progress-head">
              <strong>Examen fisico completado: ${pct}%</strong>
              <span class="semi-muted">${done}/${steps.length} pasos marcados</span>
            </div>
            <div class="semi-progress-track"><div class="semi-progress-value" style="width:${pct}%"></div></div>
          </div>
        </section>

        <section class="semi-step-list">
          ${steps.map((step) => renderStepCard(step)).join("")}
        </section>

        <section class="semi-card">
          <h4>Problemas clinicos seleccionados</h4>
          <div class="semi-chip-grid">
            ${e.problems.length ? e.problems.map((p) => `<span class="sv-badge sv-badge-yellow">${esc(p)}</span>`).join("") : `<span class="semi-muted">Sin problemas agregados.</span>`}
          </div>
          <div class="semi-actions">
            <button class="sv-btn sv-btn-secondary" type="button" data-ex-action="generate-report">Generar reporte de examen fisico</button>
            <button class="sv-btn sv-btn-primary" type="button" data-ex-action="save">Guardar examen</button>
            <button class="sv-btn sv-btn-ghost" type="button" data-ex-action="send-clinica">Enviar a Clinica Integrada</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-ex-action="print">Descargar/Imprimir PDF</button>
          </div>
          ${textareaField("Reporte editable", "exam.report", e.report, "Genera el reporte y ajusta texto clinico segun hallazgos.")}
        </section>
      `;
    }

    function renderStepCard(step) {
      const row = state.exam.steps[step.id] || { done: false, finding: "" };
      return `
        <article class="semi-step-card">
          <div class="semi-card-head">
            <h5>${esc(step.name)}</h5>
            <span class="semi-status-badge sv-badge ${row.done ? "sv-badge-green" : "sv-badge-gray"}">${row.done ? "Realizado" : "Pendiente"}</span>
          </div>
          <div class="semi-step-meta">
            <span><strong>Que hacer:</strong> ${esc(step.do || "Aplicar tecnica semiologica correspondiente.")}</span>
            <span><strong>Que observar:</strong> ${esc(step.observe || "Registrar cambios relevantes por sistema.")}</span>
            <span><strong>Hallazgo esperado:</strong> ${esc(step.normal || "Valor/rango normal.")}</span>
            <span><strong>Hallazgos anormales:</strong> ${esc(step.abnormal || "Alteraciones clinicas frecuentes.")}</span>
            <span><strong>Error frecuente:</strong> ${esc(step.error || "No registrar hallazgo de forma objetiva.")}</span>
          </div>
          <textarea class="sv-input" data-ex-step-field="${esc(step.id)}" placeholder="Registrar hallazgo...">${esc(row.finding || "")}</textarea>
          <div class="semi-actions">
            <button class="semi-mini-btn ${row.done ? "is-on" : ""}" data-ex-step-done="${esc(step.id)}">Marcar como realizado</button>
            <button class="semi-mini-btn" data-ex-step-problem="${esc(step.id)}">Agregar a problemas clinicos</button>
          </div>
        </article>
      `;
    }

    function renderParametros() {
      const p = state.parametros;
      const specie = p.species || "canino";
      const range = (D.normalParameters || {})[specie] || {};
      return `
        <section class="semi-card">
          <h3>Parametros Normales por Especie</h3>
          <div class="semi-form-grid semi-form-grid-3">
            <label class="semi-field">
              <span>Especie</span>
              <select class="sv-select" data-param-field="species">
                ${(D.species || []).filter((item) => item.id !== "otro").map((item) => `<option value="${esc(item.id)}" ${item.id === specie ? "selected" : ""}>${esc(item.label)}</option>`).join("")}
              </select>
            </label>
            ${textField("Temperatura", "param.value.temperatura", p.values.temperatura)}
            ${textField("Frecuencia cardiaca", "param.value.fc", p.values.fc)}
            ${textField("Frecuencia respiratoria", "param.value.fr", p.values.fr)}
            ${textField("TLLC", "param.value.tllc", p.values.tllc)}
            ${range.ruminal ? textField("Movimientos ruminales/2 min", "param.value.ruminal", p.values.ruminal) : ""}
            ${range.motilidad ? textField("Motilidad intestinal", "param.value.motilidad", p.values.motilidad) : ""}
          </div>
          <div class="semi-actions">
            <button class="sv-btn sv-btn-secondary" type="button" data-param-action="interpret">Interpretar parametros</button>
          </div>
          <p class="semi-muted">${esc(range.notes || "")}</p>
        </section>
        <section class="semi-card">
          <h4>Resultados</h4>
          <div class="semi-maniobras-grid">
            ${(p.results || []).length ? p.results.map((item) => `
              <article class="sv-card">
                <div class="sv-card-header">
                  <span class="sv-card-title">${esc(item.label)}</span>
                  <span class="sv-badge ${badgeByStatus(item.status)}">${esc(item.statusLabel)}</span>
                </div>
                <div class="sv-card-body">
                  <p><strong>Valor:</strong> ${esc(item.value)}</p>
                  <p><strong>Interpretacion:</strong> ${esc(item.message)}</p>
                </div>
              </article>
            `).join("") : `<p class="semi-muted">Ingresa valores y presiona \"Interpretar parametros\".</p>`}
          </div>
        </section>
      `;
    }

    function renderManiobras() {
      const f = state.maneuvers;
      const items = (D.maneuvers || []).filter((item) => {
        const blob = norm(`${item.name} ${item.system} ${item.species} ${item.type} ${item.difficulty} ${item.objective}`);
        const queryOk = !f.query || blob.includes(norm(f.query));
        const speciesOk = !f.species || norm(item.species).includes(norm(f.species));
        const systemOk = !f.system || norm(item.system) === norm(f.system);
        const diffOk = !f.difficulty || norm(item.difficulty) === norm(f.difficulty);
        const typeOk = !f.type || norm(item.type) === norm(f.type);
        return queryOk && speciesOk && systemOk && diffOk && typeOk;
      });
      return `
        <section class="semi-card">
          <h3>Banco de Maniobras Semiologicas</h3>
          <div class="semi-form-grid semi-form-grid-3">
            <input class="sv-input" type="text" data-man-field="query" value="${esc(f.query)}" placeholder="Buscar maniobra..." />
            <select class="sv-select" data-man-field="species">
              <option value="">Todas las especies</option>
              ${["Canino", "Felino", "Bovino", "Equino", "Porcino", "Ovino", "Caprino", "Ave", "Todas"].map((v) => `<option value="${esc(v)}" ${f.species === v ? "selected" : ""}>${esc(v)}</option>`).join("")}
            </select>
            <select class="sv-select" data-man-field="system">
              <option value="">Todos los sistemas</option>
              ${Array.from(new Set((D.maneuvers || []).map((m) => m.system))).map((v) => `<option value="${esc(v)}" ${f.system === v ? "selected" : ""}>${esc(v)}</option>`).join("")}
            </select>
            <select class="sv-select" data-man-field="difficulty">
              <option value="">Todas las dificultades</option>
              ${["Basica", "Intermedia", "Avanzada"].map((v) => `<option value="${esc(v)}" ${f.difficulty === v ? "selected" : ""}>${esc(v)}</option>`).join("")}
            </select>
            <select class="sv-select" data-man-field="type">
              <option value="">Todos los tipos</option>
              ${["Inspeccion", "Palpacion", "Percusion", "Auscultacion", "Medicion", "Registro"].map((v) => `<option value="${esc(v)}" ${f.type === v ? "selected" : ""}>${esc(v)}</option>`).join("")}
            </select>
          </div>
        </section>
        <section class="semi-maniobras-grid">
          ${items.length ? items.map((item) => renderManeuverCard(item)).join("") : `<div class="sv-empty"><div class="sv-empty-icon">BM</div>Sin maniobras para ese filtro.</div>`}
        </section>
      `;
    }

    function renderManeuverCard(item) {
      const id = `man-${item.id}`;
      const favData = JSON.stringify({ id, titulo: item.name, modulo: "Semiologia & Anamnesis Pro", submodulo: "Maniobras", tipo: item.type, descripcion: item.objective });
      return `
        <article class="sv-card" data-module="semiologia" data-fav-id="${esc(id)}" data-fav-title="${esc(item.name)}" data-fav-module="Semiologia & Anamnesis Pro" data-fav-submodule="Maniobras" data-fav-type="${esc(item.type)}" data-fav-description="${esc(item.objective)}" data-fav-data="${esc(favData)}">
          <div class="semi-card-head">
            <h4>${esc(item.name)}</h4>
            <span class="sv-badge ${badgeBySystem(item.system)}">${esc(item.system)}</span>
          </div>
          <p class="semi-muted">${esc(item.species)} · ${esc(item.type)} · ${esc(item.difficulty)}</p>
          <div class="sv-card-body">
            <p><strong>Objetivo:</strong> ${esc(item.objective)}</p>
            <p><strong>Como se realiza:</strong> ${esc(item.how)}</p>
            <p><strong>Normal:</strong> ${esc(item.normal)}</p>
            <p><strong>Anormal:</strong> ${esc(item.abnormal)}</p>
            <p><strong>Error frecuente:</strong> ${esc(item.errors)}</p>
            <p><strong>Seguridad:</strong> ${esc(item.safety)}</p>
          </div>
          <div class="semi-actions">
            <button type="button" class="sv-btn sv-btn-ghost sv-btn-sm" data-man-action="fav" data-man-id="${esc(item.id)}">Favorito</button>
            <button type="button" class="sv-btn sv-btn-secondary sv-btn-sm" data-man-action="osce" data-man-id="${esc(item.id)}">Agregar a practica OSCE</button>
          </div>
        </article>
      `;
    }

    function renderOsce() {
      const stations = D.osceStations || [];
      const selected = stations.find((s) => s.id === state.osce.stationId) || stations[0] || null;
      if (!selected && stations.length) state.osce.stationId = stations[0].id;
      const score = selected ? computeOsceScore(selected) : emptyScore();
      return `
        <section class="semi-card">
          <h3>Estaciones OSCE</h3>
          <div class="semi-form-grid semi-form-grid-3">
            <label class="semi-field">
              <span>Nueva estacion OSCE</span>
              <select class="sv-select" data-osce-field="stationId">
                ${stations.map((s) => `<option value="${esc(s.id)}" ${s.id === state.osce.stationId ? "selected" : ""}>${esc(s.title)}</option>`).join("")}
              </select>
            </label>
            <div class="semi-timer">
              <strong>${esc(formatClock(state.osce.elapsedSec))}</strong>
              <button class="sv-btn sv-btn-ghost sv-btn-sm" type="button" data-osce-action="${state.osce.running ? "pause-timer" : "start-timer"}">${state.osce.running ? "Pausar" : "Iniciar"} cronometro</button>
              <button class="sv-btn sv-btn-ghost sv-btn-sm" type="button" data-osce-action="reset-timer">Reiniciar</button>
            </div>
          </div>
        </section>

        ${selected ? `
          <section class="semi-card">
            <h4>${esc(selected.title)}</h4>
            <p class="semi-muted">Tiempo sugerido: ${selected.timeMin} min · Objetivo: ${esc(selected.objective)}</p>
            <p class="semi-muted"><strong>Materiales:</strong> ${esc((selected.materials || []).join(", "))}</p>
            <p class="semi-muted"><strong>Instrucciones:</strong> ${esc(selected.instructions)}</p>
            <div class="semi-osce-checklist">
              ${(selected.checklist || []).map((item) => renderOsceItem(item)).join("")}
            </div>
          </section>

          <section class="semi-osce-score">
            <strong>Puntaje total: ${score.total}/${score.max} (${score.percentLabel}) - ${score.result}</strong>
            ${score.feedback.length ? `<p class="semi-muted">${esc(score.feedback.join(" | "))}</p>` : `<p class="semi-muted">Buen trabajo. Sin alertas principales en la rubrica.</p>`}
            <label class="semi-field">
              <span>Comentarios</span>
              <textarea class="sv-input" data-osce-field="comments" placeholder="Observaciones de la estacion...">${esc(state.osce.comments)}</textarea>
            </label>
            <div class="semi-actions">
              <button class="sv-btn sv-btn-primary" type="button" data-osce-action="save-attempt">Guardar intento</button>
              <button class="sv-btn sv-btn-secondary" type="button" data-osce-action="print-rubric">Generar PDF de rubrica</button>
            </div>
          </section>
        ` : ""}

        <section class="semi-card">
          <h4>Historial de intentos</h4>
          ${state.osceHistory.length ? `
            <table class="semi-logbook-table">
              <thead><tr><th>Fecha</th><th>Estacion</th><th>Puntaje</th><th>Resultado</th></tr></thead>
              <tbody>
                ${state.osceHistory.slice(0, 10).map((item) => `
                  <tr>
                    <td>${esc(shortDate(item.date))}</td>
                    <td>${esc(item.stationTitle)}</td>
                    <td>${esc(item.percentLabel)}</td>
                    <td>${esc(item.result)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<p class="semi-muted">Aun no hay intentos guardados.</p>`}
          ${state.osce.customManeuvers.length ? `<p class="semi-muted"><strong>Maniobras agregadas desde banco:</strong> ${esc(state.osce.customManeuvers.join(", "))}</p>` : ""}
        </section>
      `;
    }

    function renderOsceItem(item) {
      const val = Number(state.osce.scores[item.id] || 0);
      return `
        <label class="semi-osce-item">
          <span>${esc(item.label)}</span>
          <span class="semi-osce-radios">
            <label><input type="radio" name="osce-${esc(item.id)}" value="0" data-osce-score="${esc(item.id)}" ${val === 0 ? "checked" : ""} /> 0</label>
            <label><input type="radio" name="osce-${esc(item.id)}" value="1" data-osce-score="${esc(item.id)}" ${val === 1 ? "checked" : ""} /> 1</label>
            <label><input type="radio" name="osce-${esc(item.id)}" value="2" data-osce-score="${esc(item.id)}" ${val === 2 ? "checked" : ""} /> 2</label>
          </span>
        </label>
      `;
    }

    function renderLogbook() {
      const d = state.logbookDraft;
      const stats = logbookStats();
      return `
        <section class="semi-card">
          <h3>Registro de Habilidades Clinicas (Logbook)</h3>
          <div class="semi-form-grid semi-form-grid-3">
            <label class="semi-field">
              <span>Habilidad</span>
              <select class="sv-select" data-log-field="skillName">
                <option value="">Selecciona habilidad</option>
                ${(D.skills || []).map((item) => `<option value="${esc(item.name)}" ${item.name === d.skillName ? "selected" : ""}>${esc(item.name)}</option>`).join("")}
              </select>
            </label>
            ${textField("Categoria", "log.category", d.category)}
            ${textField("Especie", "log.species", d.species)}
            <label class="semi-field">
              <span>Estado</span>
              <select class="sv-select" data-log-field="state">
                ${(D.skillStates || []).map((value) => `<option value="${esc(value)}" ${value === d.state ? "selected" : ""}>${esc(value)}</option>`).join("")}
              </select>
            </label>
            <label class="semi-field">
              <span>Fecha</span>
              <input class="sv-input" type="date" data-log-field="date" value="${esc(d.date)}" />
            </label>
            ${textField("Autoevaluacion (1-5)", "log.selfScore", d.selfScore)}
            ${textareaField("Comentario", "log.comment", d.comment, "Reflexion sobre la practica realizada.")}
            ${textareaField("Evidencia opcional", "log.evidence", d.evidence, "Detalle breve de la evidencia observada.")}
          </div>
          <div class="semi-actions">
            <button class="sv-btn sv-btn-primary" type="button" data-log-action="save">Guardar</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-log-action="print">Generar PDF de progreso clinico</button>
          </div>
        </section>

        <section class="semi-card">
          <h4>Progreso</h4>
          <div class="semi-form-grid semi-form-grid-3">
            <div class="semi-note"><strong>Total de habilidades</strong><span>${stats.total}</span></div>
            <div class="semi-note"><strong>Observadas</strong><span>${stats.observado}</span></div>
            <div class="semi-note"><strong>Practicadas</strong><span>${stats.practicado}</span></div>
            <div class="semi-note"><strong>Con supervision</strong><span>${stats.supervision}</span></div>
            <div class="semi-note"><strong>Realizadas solo</strong><span>${stats.solo}</span></div>
            <div class="semi-note"><strong>Porcentaje de avance</strong><span>${stats.progressLabel}</span></div>
          </div>
        </section>

        <section class="semi-card">
          <h4>Registros guardados</h4>
          ${state.logbook.length ? `
            <table class="semi-logbook-table">
              <thead><tr><th>Fecha</th><th>Habilidad</th><th>Estado</th><th>Autoeval</th><th>Comentario</th></tr></thead>
              <tbody>
                ${state.logbook.slice(0, 20).map((item) => `
                  <tr>
                    <td>${esc(item.date)}</td>
                    <td>${esc(item.skillName)}</td>
                    <td>${esc(item.state)}</td>
                    <td>${esc(item.selfScore)}</td>
                    <td>${esc(item.comment || "")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<p class="semi-muted">Aun no hay habilidades registradas.</p>`}
        </section>
      `;
    }

    function renderCasos() {
      const cases = D.caseLibrary || [];
      return `
        <section class="semi-card">
          <h3>Biblioteca de Casos de Practica</h3>
          <p class="semi-subtitle">Entrena anamnesis y examen fisico antes de transferir informacion a Clinica Integrada.</p>
        </section>
        <section class="semi-cases-grid">
          ${cases.map((item) => `
            <article class="sv-card" data-module="semiologia">
              <div class="semi-card-head">
                <h4>${esc(item.title)}</h4>
                <span class="sv-badge ${badgeBySystem(item.system)}">${esc(item.level)}</span>
              </div>
              <p class="semi-muted">${esc(item.species)} · ${esc(item.system)}</p>
              <div class="sv-card-body">
                <p><strong>Objetivo:</strong> ${esc(item.objective)}</p>
                <p><strong>Motivo:</strong> ${esc(item.motive)}</p>
                <p><strong>Preguntas clave:</strong> ${esc((item.keyQuestions || []).join(", "))}</p>
                <p><strong>Hallazgos:</strong> ${esc(item.findings)}</p>
                <p><strong>Problemas:</strong> ${esc((item.problems || []).join(", "))}</p>
                <p><strong>Red flags:</strong> ${esc((item.redFlags || []).join(", "))}</p>
                <p><strong>Guia docente:</strong> ${esc(item.guide)}</p>
              </div>
              <div class="semi-actions">
                <button class="sv-btn sv-btn-secondary sv-btn-sm" type="button" data-case-action="anamnesis" data-case-id="${esc(item.id)}">Practicar anamnesis</button>
                <button class="sv-btn sv-btn-ghost sv-btn-sm" type="button" data-case-action="examen" data-case-id="${esc(item.id)}">Practicar examen fisico</button>
                <button class="sv-btn sv-btn-primary sv-btn-sm" type="button" data-case-action="clinica" data-case-id="${esc(item.id)}">Enviar a Clinica Integrada</button>
              </div>
            </article>
          `).join("")}
        </section>
      `;
    }

    function renderPlantillas() {
      const q = norm(state.templateSearch || "");
      const list = (D.templates || []).filter((item) => norm(`${item.title} ${item.content}`).includes(q));
      return `
        <section class="semi-card">
          <h3>Plantillas y PDF Clinico</h3>
          <div class="semi-form-grid semi-form-grid-2">
            <input class="sv-input" type="text" data-tpl-field="search" value="${esc(state.templateSearch)}" placeholder="Buscar plantilla..." />
            <span class="semi-muted">Plantillas editables para anamnesis, examen, OSCE, progreso y SOAP.</span>
          </div>
        </section>
        <section class="semi-template-grid">
          ${list.map((tpl) => `
            <article class="sv-card">
              <h4>${esc(tpl.title)}</h4>
              <textarea class="sv-input" data-tpl-content="${esc(tpl.id)}" rows="10">${esc(state.templates[tpl.id] ?? tpl.content)}</textarea>
              <div class="semi-actions">
                <button class="sv-btn sv-btn-ghost sv-btn-sm" type="button" data-tpl-action="copy" data-tpl-id="${esc(tpl.id)}">Copiar</button>
                <button class="sv-btn sv-btn-secondary sv-btn-sm" type="button" data-tpl-action="use" data-tpl-id="${esc(tpl.id)}">Usar en nuevo registro</button>
                <button class="sv-btn sv-btn-primary sv-btn-sm" type="button" data-tpl-action="save" data-tpl-id="${esc(tpl.id)}">Guardar</button>
                <button class="sv-btn sv-btn-secondary sv-btn-sm" type="button" data-tpl-action="print" data-tpl-id="${esc(tpl.id)}">Imprimir/Descargar PDF</button>
              </div>
            </article>
          `).join("")}
        </section>
      `;
    }

    function onClick(event) {
      const t = event.target.closest("[data-semi-page],[data-semi-go],[data-an-mode],[data-an-action],[data-sim-action],[data-sim-ask],[data-ex-action],[data-ex-step-done],[data-ex-step-problem],[data-param-action],[data-man-action],[data-osce-action],[data-log-action],[data-case-action],[data-tpl-action]");
      if (!t) return;

      if (t.dataset.semiPage) {
        state.page = t.dataset.semiPage;
        render();
        return;
      }
      if (t.dataset.semiGo) {
        state.page = t.dataset.semiGo;
        render();
        return;
      }
      if (t.dataset.anMode) {
        state.anamnesisMode = t.dataset.anMode;
        render();
        return;
      }
      if (t.dataset.simAsk) {
        askSimulationQuestionById(t.dataset.simAsk);
        render();
        return;
      }

      if (t.dataset.anAction) {
        handleAnamnesisAction(t.dataset.anAction, t.dataset.qid);
        render();
        return;
      }
      if (t.dataset.simAction) {
        handleSimulationAction(t.dataset.simAction);
        render();
        return;
      }
      if (t.dataset.exStepDone) {
        const row = state.exam.steps[t.dataset.exStepDone] || { done: false, finding: "" };
        row.done = !row.done;
        state.exam.steps[t.dataset.exStepDone] = row;
        render();
        return;
      }
      if (t.dataset.exStepProblem) {
        const step = visibleExamSteps().find((item) => item.id === t.dataset.exStepProblem);
        if (step) addUnique(state.exam.problems, step.name);
        notify("Problema clinico agregado.");
        render();
        return;
      }
      if (t.dataset.exAction) {
        handleExamAction(t.dataset.exAction);
        render();
        return;
      }
      if (t.dataset.paramAction) {
        if (t.dataset.paramAction === "interpret") handleParamInterpret();
        render();
        return;
      }
      if (t.dataset.manAction) {
        handleManeuverAction(t.dataset.manAction, t.dataset.manId);
        render();
        return;
      }
      if (t.dataset.osceAction) {
        handleOsceAction(t.dataset.osceAction);
        render();
        return;
      }
      if (t.dataset.logAction) {
        handleLogbookAction(t.dataset.logAction);
        render();
        return;
      }
      if (t.dataset.caseAction) {
        handleCaseAction(t.dataset.caseAction, t.dataset.caseId);
        render();
        return;
      }
      if (t.dataset.tplAction) {
        handleTemplateAction(t.dataset.tplAction, t.dataset.tplId);
        render();
      }
    }

    function onInput(event) {
      const target = event.target;

      if (target.matches("[data-an-field]")) {
        const key = target.dataset.anField;
        state.anamnesis[key] = target.value;
        ensureAnamnesisQuestions();
        return;
      }
      if (target.matches("[data-an-question-answer]")) {
        const qid = target.dataset.anQuestionAnswer;
        if (!state.anamnesis.questions[qid]) return;
        state.anamnesis.questions[qid].answer = target.value;
        if (cleanText(target.value)) state.anamnesis.questions[qid].asked = true;
        return;
      }
      if (target.matches("[data-sim-field]")) {
        const key = target.dataset.simField;
        state.sim[key] = target.value;
        if (key === "caseId") resetSimulation(target.value);
        return;
      }
      if (target.matches("[data-ex-field]")) {
        const key = target.dataset.exField;
        applyExamField(key, target.value);
        return;
      }
      if (target.matches("[data-ex-step-field]")) {
        const id = target.dataset.exStepField;
        state.exam.steps[id] = state.exam.steps[id] || { done: false, finding: "" };
        state.exam.steps[id].finding = target.value;
        return;
      }
      if (target.matches("[data-param-field]")) {
        const key = target.dataset.paramField;
        if (key === "species") {
          state.parametros.species = target.value;
          state.parametros.results = [];
        } else if (key.startsWith("value.")) {
          state.parametros.values[key.slice(6)] = target.value;
        }
        return;
      }
      if (target.matches("[data-log-field]")) {
        const key = target.dataset.logField;
        state.logbookDraft[key] = target.value;
        if (key === "skillName") fillSkillMeta();
        return;
      }
      if (target.matches("[data-man-field]")) {
        state.maneuvers[target.dataset.manField] = target.value;
        render();
        return;
      }
      if (target.matches("[data-osce-field]")) {
        const key = target.dataset.osceField;
        state.osce[key] = target.value;
        if (key === "stationId") {
          state.osce.scores = {};
          state.osce.comments = "";
          state.osce.elapsedSec = 0;
          state.osce.running = false;
        }
        render();
        return;
      }
      if (target.matches("[data-osce-score]")) {
        state.osce.scores[target.dataset.osceScore] = Number(target.value || 0);
        render();
        return;
      }
      if (target.matches("[data-tpl-field='search']")) {
        state.templateSearch = target.value;
        render();
        return;
      }
      if (target.matches("[data-tpl-content]")) {
        state.templates[target.dataset.tplContent] = target.value;
        return;
      }
    }

    function handleAnamnesisAction(action, qid) {
      if (qid && state.anamnesis.questions[qid]) {
        const q = state.anamnesis.questions[qid];
        if (action === "toggle-asked") q.asked = !q.asked;
        if (action === "toggle-important") q.important = !q.important;
        if (action === "toggle-summary") q.includeSummary = !q.includeSummary;
        if (action === "mark-response") q.asked = true;
      }
      if (action === "generate-summary") {
        state.anamnesis.summary = generateAnamnesisSummary();
      }
      if (action === "copy-summary") {
        copyToClipboard(state.anamnesis.summary || "").then(() => notify("Resumen copiado."));
      }
      if (action === "save") {
        saveAnamnesis();
      }
      if (action === "send-clinica") {
        enviarAnamnesisAClinicaIntegrada(buildAnamnesisPayload());
      }
      if (action === "print") {
        Pdf?.printDocument("anamnesis", buildAnamnesisPdfData());
      }
    }

    function handleSimulationAction(action) {
      if (action === "ask-manual") {
        const question = cleanText(state.sim.draftQuestion);
        if (!question) return notify("Escribe una pregunta para continuar.");
        askSimulationQuestion(question);
        state.sim.draftQuestion = "";
      }
      if (action === "retry") {
        resetSimulation(state.sim.caseId);
      }
      if (action === "toggle-guide") {
        state.sim.showGuide = !state.sim.showGuide;
      }
      if (action === "send-clinica") {
        const selected = currentSimulationCase();
        if (!selected) return;
        crearCasoDesdeSemiologia({
          source: "simulacion",
          caseId: selected.id,
          title: selected.title,
          species: selected.species,
          motive: selected.motive,
          asked: state.sim.asked.slice()
        });
      }
    }

    function handleExamAction(action) {
      if (action === "generate-report") {
        state.exam.report = generateExamReport();
      }
      if (action === "save") {
        const payload = buildExamPayload();
        state.savedExams.unshift(payload);
        persistJson(S.examenes, state.savedExams);
        notify("Examen fisico guardado.");
      }
      if (action === "send-clinica") {
        enviarExamenFisicoAClinicaIntegrada(buildExamPayload());
      }
      if (action === "print") {
        Pdf?.printDocument("examen", buildExamPdfData());
      }
    }

    function handleManeuverAction(action, id) {
      const item = (D.maneuvers || []).find((entry) => entry.id === id);
      if (!item) return;
      if (action === "fav") {
        Fav?.toggleFavorite({
          id: `man-${item.id}`,
          titulo: item.name,
          modulo: "Semiologia & Anamnesis Pro",
          submodulo: "Maniobras",
          tipo: item.type,
          descripcion: item.objective
        });
      }
      if (action === "osce") {
        addUnique(state.osce.customManeuvers, item.name);
        notify("Maniobra agregada al plan OSCE.");
      }
    }

    function handleOsceAction(action) {
      if (action === "start-timer") {
        state.osce.running = true;
        state.osce.lastTick = Date.now();
      }
      if (action === "pause-timer") {
        state.osce.running = false;
      }
      if (action === "reset-timer") {
        state.osce.running = false;
        state.osce.elapsedSec = 0;
      }
      if (action === "save-attempt") {
        const selected = (D.osceStations || []).find((entry) => entry.id === state.osce.stationId);
        if (!selected) return;
        const score = computeOsceScore(selected);
        const attempt = {
          id: `OSCE-${Date.now()}`,
          date: new Date().toISOString(),
          stationId: selected.id,
          stationTitle: selected.title,
          scoreTotal: score.total,
          scoreMax: score.max,
          percent: score.percent,
          percentLabel: score.percentLabel,
          result: score.result,
          feedback: score.feedback,
          comments: state.osce.comments,
          elapsedSec: state.osce.elapsedSec,
          scores: deepClone(state.osce.scores)
        };
        state.osceHistory.unshift(attempt);
        persistJson(S.osce, state.osceHistory);
        notify("Intento OSCE guardado.");
      }
      if (action === "print-rubric") {
        const selected = (D.osceStations || []).find((entry) => entry.id === state.osce.stationId);
        if (!selected) return;
        const score = computeOsceScore(selected);
        const rows = (selected.checklist || []).map((item) => {
          const v = Number(state.osce.scores[item.id] || 0);
          return { label: item.label, statusLabel: v === 2 ? "Realizado correctamente" : v === 1 ? "Realizado parcialmente" : "No realizado" };
        });
        Pdf?.printDocument("osce", {
          stationTitle: selected.title,
          timeMin: selected.timeMin,
          timeLabel: formatClock(state.osce.elapsedSec),
          scoreTotal: `${score.total}/${score.max}`,
          percentLabel: score.percentLabel,
          resultLabel: score.result,
          feedback: score.feedback,
          items: rows,
          comments: state.osce.comments,
          updatedAt: Date.now()
        });
      }
    }

    function handleLogbookAction(action) {
      if (action === "save") {
        if (!cleanText(state.logbookDraft.skillName)) return notify("Selecciona una habilidad.");
        const entry = {
          id: `LOG-${Date.now()}`,
          skillName: state.logbookDraft.skillName,
          category: state.logbookDraft.category,
          species: state.logbookDraft.species,
          state: state.logbookDraft.state,
          date: state.logbookDraft.date || todayISODate(),
          comment: state.logbookDraft.comment,
          evidence: state.logbookDraft.evidence,
          selfScore: clampInt(state.logbookDraft.selfScore, 1, 5)
        };
        state.logbook.unshift(entry);
        persistJson(S.logbook, state.logbook);
        state.logbookDraft = createLogbookDraft();
        notify("Habilidad registrada en logbook.");
      }
      if (action === "print") {
        const stats = logbookStats();
        Pdf?.printDocument("progreso", { summary: stats, entries: state.logbook.slice(0, 30), updatedAt: Date.now() });
      }
    }

    function handleCaseAction(action, id) {
      const item = (D.caseLibrary || []).find((row) => row.id === id);
      if (!item) return;
      if (action === "anamnesis") {
        state.page = "anamnesis";
        state.anamnesisMode = "aprendizaje";
        state.anamnesis.species = speciesIdFromLabel(item.species);
        state.anamnesis.system = systemIdFromLabel(item.system);
        state.anamnesis.reason = item.motive || "";
        ensureAnamnesisQuestions();
      }
      if (action === "examen") {
        state.page = "examen";
        state.exam.species = speciesIdFromLabel(item.species);
      }
      if (action === "clinica") {
        crearCasoDesdeSemiologia({
          source: "biblioteca",
          title: item.title,
          species: speciesIdFromLabel(item.species),
          motive: item.motive,
          problems: item.problems || [],
          redFlags: item.redFlags || []
        });
      }
    }

    function handleTemplateAction(action, id) {
      const base = (D.templates || []).find((item) => item.id === id);
      if (!base) return;
      const text = state.templates[id] ?? base.content;
      if (action === "copy") {
        copyToClipboard(text).then(() => notify("Plantilla copiada."));
      }
      if (action === "use") {
        if (id.includes("anamnesis")) {
          state.page = "anamnesis";
          state.anamnesis.summary = text;
        } else if (id.includes("examen")) {
          state.page = "examen";
          state.exam.report = text;
        } else if (id.includes("soap")) {
          state.page = "anamnesis";
          state.anamnesis.notes = text;
        } else {
          state.anamnesis.notes = text;
        }
      }
      if (action === "save") {
        persistJson(S.plantillas, state.templates);
        notify("Plantilla guardada.");
      }
      if (action === "print") {
        Pdf?.printDocument("anamnesis", {
          patient: {},
          consultType: "Plantilla",
          system: "General",
          reason: base.title,
          summary: text,
          questions: [],
          redFlags: [],
          notes: "Documento plantilla"
        });
      }
    }

    function ensureAnamnesisQuestions() {
      const map = state.anamnesis.questions;
      (D.essentialBlocks || []).forEach((block) => {
        (block.questions || []).forEach((label, idx) => {
          const id = `ess-${block.id}-${idx}`;
          if (!map[id]) map[id] = questionState();
        });
      });

      if (showProductionQuestions()) {
        (D.productionQuestions || []).forEach((label, idx) => {
          const id = `prod-${idx}`;
          if (!map[id]) map[id] = questionState();
        });
      }

      const sys = state.anamnesis.system;
      const questions = (D.systemQuestions || {})[sys] || [];
      questions.forEach((label, idx) => {
        const id = `sys-${sys}-${idx}`;
        if (!map[id]) map[id] = questionState();
      });
    }

    function showProductionQuestions() {
      const consult = norm(state.anamnesis.consultType);
      const species = state.anamnesis.species;
      return consult.includes("lote") || (D.productionSpecies || []).includes(species);
    }

    function getVisibleQuestionEntries() {
      const out = [];
      (D.essentialBlocks || []).forEach((block) => {
        (block.questions || []).forEach((label, idx) => {
          const id = `ess-${block.id}-${idx}`;
          out.push({ id, label, value: state.anamnesis.questions[id] || questionState(), group: block.id });
        });
      });
      if (showProductionQuestions()) {
        (D.productionQuestions || []).forEach((label, idx) => {
          const id = `prod-${idx}`;
          out.push({ id, label, value: state.anamnesis.questions[id] || questionState(), group: "produccion" });
        });
      }
      const sys = state.anamnesis.system;
      ((D.systemQuestions || {})[sys] || []).forEach((label, idx) => {
        const id = `sys-${sys}-${idx}`;
        out.push({ id, label, value: state.anamnesis.questions[id] || questionState(), group: "sistema" });
      });
      return out;
    }

    function essentialQuestionIds() {
      const ids = [];
      (D.essentialBlocks || []).forEach((block) => {
        (block.questions || []).forEach((_label, idx) => ids.push(`ess-${block.id}-${idx}`));
      });
      return ids;
    }

    function trafficState(pct, ids) {
      const critical = ids.slice(0, 4).some((id) => !cleanText(state.anamnesis.questions[id]?.answer));
      if (critical || pct < 45) return "red";
      if (pct < 80) return "yellow";
      return "green";
    }

    function detectRedFlags() {
      const bag = gatherAnamnesisText();
      return detectRedFlagsFromTexts([bag]);
    }

    function detectRedFlagsFromTexts(texts) {
      const bag = norm((texts || []).join(" "));
      return (D.redFlagRules || []).filter((rule) => (rule.matchAny || []).some((term) => bag.includes(norm(term))));
    }

    function gatherAnamnesisText() {
      const parts = [state.anamnesis.reason, state.anamnesis.summary, state.anamnesis.notes];
      Object.values(state.anamnesis.questions || {}).forEach((q) => parts.push(q.answer));
      return parts.filter(Boolean).join(" ");
    }

    function generateAnamnesisSummary() {
      const a = state.anamnesis;
      const selected = getVisibleQuestionEntries().filter((entry) => {
        const q = entry.value;
        return q.includeSummary || q.important || (q.asked && cleanText(q.answer));
      });
      const signs = selected.slice(0, 6).map((entry) => `${entry.label}: ${entry.value.answer || "sin dato"}`);
      return `Paciente ${speciesLabel(a.species) || "[especie]"}, ${a.age || "[edad]"}, ${a.sex || "[sexo]"}, con motivo de consulta ${a.reason || "[motivo]"}. Segun el responsable, presenta: ${signs.join("; ") || "[signos]"}.\nAntecedentes relevantes y manejo: ${a.notes || "[completar]"}.\nResumen generado para analisis clinico y transferencia a Clinica Integrada.`;
    }

    function saveAnamnesis() {
      const payload = buildAnamnesisPayload();
      state.savedAnamnesis.unshift(payload);
      persistJson(S.anamnesis, state.savedAnamnesis);
      notify("Anamnesis guardada.");
    }

    function buildAnamnesisPayload() {
      return {
        id: `AN-${Date.now()}`,
        updatedAt: new Date().toISOString(),
        consultType: state.anamnesis.consultType,
        system: state.anamnesis.system,
        systemLabel: systemLabel(state.anamnesis.system),
        reason: state.anamnesis.reason,
        summary: state.anamnesis.summary,
        notes: state.anamnesis.notes,
        environmentSummary: state.anamnesis.notes,
        patient: {
          name: state.anamnesis.patientName,
          species: state.anamnesis.species,
          speciesLabel: speciesLabel(state.anamnesis.species),
          age: state.anamnesis.age,
          sex: state.anamnesis.sex,
          breed: state.anamnesis.breed,
          weight: state.anamnesis.weight,
          owner: state.anamnesis.owner
        },
        questions: getVisibleQuestionEntries().map((entry) => ({
          id: entry.id,
          label: entry.label,
          answer: entry.value.answer || "",
          asked: !!entry.value.asked,
          important: !!entry.value.important
        })),
        redFlags: detectRedFlags()
      };
    }

    function buildAnamnesisPdfData() {
      return buildAnamnesisPayload();
    }

    function resetSimulation(caseId) {
      state.sim = createSimulationState();
      state.sim.caseId = caseId || "";
    }

    function currentSimulationCase() {
      return (D.simulationCases || []).find((item) => item.id === state.sim.caseId) || null;
    }

    function askSimulationQuestionById(id) {
      const active = currentSimulationCase();
      if (!active) return;
      const q = (active.keyQuestions || []).find((item) => item.id === id);
      if (!q) return;
      addSimulationEntry(q.label, q.response, q.id);
    }

    function askSimulationQuestion(text) {
      const active = currentSimulationCase();
      if (!active) return notify("Selecciona un caso simulado primero.");
      const qNorm = norm(text);
      const match = (active.keyQuestions || []).find((item) => (item.keywords || []).some((k) => qNorm.includes(norm(k))));
      if (match) addSimulationEntry(text, match.response, match.id);
      else addSimulationEntry(text, "No tengo ese dato especifico. Puedes preguntar por inicio, evolucion, antecedentes, manejo o signos clave.", "");
    }

    function addSimulationEntry(question, response, keyId) {
      state.sim.asked.push({ question, response, keyId });
    }

    function interviewBiasLabel() {
      const total = state.sim.asked.length;
      if (!total) return "Sin suficientes preguntas para evaluar sesgo.";
      const closed = state.sim.asked.filter((entry) => /^\s*(es|hay|tiene|si|no)\b/i.test(entry.question)).length;
      const ratio = closed / total;
      if (ratio > 0.7) return "Sesgo alto hacia preguntas cerradas. Intenta preguntas abiertas para explorar mejor.";
      if (ratio > 0.45) return "Sesgo moderado. Combina preguntas abiertas y cerradas.";
      return "Buen balance de entrevista. Mantienes apertura diagnostica.";
    }

    function interviewOrderTip() {
      const first = state.sim.asked.slice(0, 2).map((entry) => norm(entry.question)).join(" ");
      if (!first) return "Inicia la entrevista explorando inicio, evolucion y signos principales.";
      if (!/(inicio|empezo|cuando|evolucion)/.test(first)) return "Mejora el orden: primero caracteriza inicio y evolucion.";
      return "Orden adecuado de entrevista: inicias caracterizando el problema actual.";
    }

    function createExamState() {
      return {
        patientName: "",
        species: "canino",
        mode: "canino-felino",
        vitals: { temperatura: "", fc: "", fr: "", tllc: "" },
        steps: {},
        problems: [],
        report: ""
      };
    }

    function applyExamField(path, value) {
      if (path === "exam.patientName") state.exam.patientName = value;
      if (path === "exam.species") state.exam.species = speciesIdFromLabel(value);
      if (path === "exam.mode") state.exam.mode = examModeIdFromLabel(value);
      if (path === "exam.vitals.temperatura") state.exam.vitals.temperatura = value;
      if (path === "exam.vitals.fc") state.exam.vitals.fc = value;
      if (path === "exam.vitals.fr") state.exam.vitals.fr = value;
      if (path === "exam.vitals.tllc") state.exam.vitals.tllc = value;
    }

    function visibleExamSteps() {
      const rows = deepClone((D.physicalExamSteps || {}).general || []);
      const mode = state.exam.mode;
      const extra = [];
      if (mode === "bovino") extra.push(...((D.physicalExamSteps || {}).bovino || []).map(simpleExtraStep));
      if (mode === "equino") extra.push(...((D.physicalExamSteps || {}).equino || []).map(simpleExtraStep));
      if (mode === "porcino") extra.push(...((D.physicalExamSteps || {}).porcino || []).map(simpleExtraStep));
      if (mode === "ave") extra.push(...((D.physicalExamSteps || {}).ave || []).map(simpleExtraStep));
      return rows.concat(extra);
    }

    function simpleExtraStep(name) {
      return {
        id: `extra-${slug(name)}`,
        name,
        do: `Realizar evaluacion de ${name.toLowerCase()} segun especie.`,
        observe: "Registrar hallazgos relevantes.",
        normal: "Sin alteraciones significativas.",
        abnormal: "Cambios compatibles con patologia.",
        error: "Omitir la evaluacion o registrar sin detalle."
      };
    }

    function generateExamReport() {
      const done = visibleExamSteps().filter((step) => state.exam.steps[step.id]?.done);
      const lines = done.map((step) => `${step.name}: ${state.exam.steps[step.id]?.finding || "sin hallazgos registrados"}`);
      return `Examen fisico ${examModeLabel(state.exam.mode)} en paciente ${state.exam.patientName || "[sin nombre]"}.\nSignos vitales: T=${state.exam.vitals.temperatura || "NA"}, FC=${state.exam.vitals.fc || "NA"}, FR=${state.exam.vitals.fr || "NA"}, TLLC=${state.exam.vitals.tllc || "NA"}.\nHallazgos: ${lines.join(" | ") || "Sin datos"}.\nProblemas clinicos: ${state.exam.problems.join(", ") || "Sin problemas agregados"}.`;
    }

    function buildExamPayload() {
      return {
        id: `EX-${Date.now()}`,
        updatedAt: new Date().toISOString(),
        patientName: state.exam.patientName,
        species: state.exam.species,
        speciesLabel: speciesLabel(state.exam.species),
        examMode: state.exam.mode,
        examModeLabel: examModeLabel(state.exam.mode),
        vitals: deepClone(state.exam.vitals),
        steps: visibleExamSteps().map((step) => ({
          id: step.id,
          name: step.name,
          finding: state.exam.steps[step.id]?.finding || "",
          done: !!state.exam.steps[step.id]?.done
        })),
        problems: state.exam.problems.slice(),
        report: state.exam.report || "",
        interpretation: state.exam.report || ""
      };
    }

    function buildExamPdfData() {
      return buildExamPayload();
    }

    function createParameterState() {
      return {
        species: "canino",
        values: { temperatura: "", fc: "", fr: "", tllc: "", ruminal: "", motilidad: "" },
        results: []
      };
    }

    function interpretParameter(species, param, value) {
      const ranges = (D.normalParameters || {})[species] || {};
      const minMax = ranges[param];
      const n = Number(value);
      if (!Number.isFinite(n)) return null;
      if (!Array.isArray(minMax)) return null;
      const [min, max] = minMax;
      const messages = (D.parameterMessages || {})[param] || {};
      if (n < min) return { status: "low", statusLabel: "Bajo", message: messages.low || "Valor bajo", value: n };
      if (n > max) return { status: "high", statusLabel: "Alto", message: messages.high || "Valor alto", value: n };
      return { status: "normal", statusLabel: "Normal", message: messages.normal || "Valor normal", value: n };
    }

    function handleParamInterpret() {
      const specie = state.parametros.species;
      const params = ["temperatura", "fc", "fr", "tllc", "ruminal", "motilidad"];
      state.parametros.results = params.map((key) => {
        const result = interpretParameter(specie, key, state.parametros.values[key]);
        if (!result) return null;
        return {
          key,
          label: keyLabel(key),
          status: result.status,
          statusLabel: result.statusLabel,
          message: result.message,
          value: result.value
        };
      }).filter(Boolean);
    }

    function keyLabel(key) {
      if (key === "fc") return "Frecuencia cardiaca";
      if (key === "fr") return "Frecuencia respiratoria";
      if (key === "tllc") return "TLLC";
      if (key === "ruminal") return "Movimientos ruminales";
      if (key === "motilidad") return "Motilidad intestinal";
      return capitalize(key);
    }

    function createOsceState() {
      return {
        stationId: (D.osceStations || [])[0]?.id || "",
        scores: {},
        comments: "",
        running: false,
        elapsedSec: 0,
        lastTick: 0,
        customManeuvers: []
      };
    }

    function startOsceTimerLoop() {
      window.setInterval(() => {
        if (!state.osce.running) return;
        const now = Date.now();
        const prev = state.osce.lastTick || now;
        const delta = Math.max(0, Math.floor((now - prev) / 1000));
        if (delta > 0) {
          state.osce.elapsedSec += delta;
          state.osce.lastTick = now;
          if (state.page === "osce") render();
        }
      }, 500);
    }

    function computeOsceScore(station) {
      const items = station?.checklist || [];
      const total = items.reduce((acc, item) => acc + Number(state.osce.scores[item.id] || 0), 0);
      const max = items.length * 2;
      const percent = max ? Math.round((total / max) * 100) : 0;
      const result = percent >= 85 ? "Excelente" : percent >= 70 ? "Bueno" : percent >= 50 ? "Suficiente" : "En practica";
      const feedback = [];
      (D.osceFeedbackRules || []).forEach((rule) => {
        const missed = items.some((item) => (item.tags || []).includes(rule.keyword) && Number(state.osce.scores[item.id] || 0) === 0);
        if (missed) feedback.push(rule.message);
      });
      return { total, max, percent, percentLabel: `${percent}%`, result, feedback };
    }

    function emptyScore() {
      return { total: 0, max: 0, percent: 0, percentLabel: "0%", result: "En practica", feedback: [] };
    }

    function createLogbookDraft() {
      return {
        skillName: "",
        category: "",
        species: "",
        state: (D.skillStates || [])[0] || "Observado",
        date: todayISODate(),
        comment: "",
        evidence: "",
        selfScore: "3"
      };
    }

    function fillSkillMeta() {
      const skill = (D.skills || []).find((item) => item.name === state.logbookDraft.skillName);
      if (!skill) return;
      state.logbookDraft.category = skill.category;
      state.logbookDraft.species = skill.species;
    }

    function logbookStats() {
      const total = (D.skills || []).length || 1;
      const counts = {
        observado: 0,
        practicado: 0,
        supervision: 0,
        solo: 0
      };
      state.logbook.forEach((entry) => {
        const n = norm(entry.state);
        if (n.includes("observado")) counts.observado += 1;
        else if (n.includes("practicado")) counts.practicado += 1;
        else if (n.includes("supervision")) counts.supervision += 1;
        else if (n.includes("solo")) counts.solo += 1;
      });
      const progressRaw = ((counts.practicado + counts.supervision + counts.solo) / total) * 100;
      return {
        total,
        observado: counts.observado,
        practicado: counts.practicado,
        supervision: counts.supervision,
        solo: counts.solo,
        progressLabel: `${Math.min(100, Math.round(progressRaw))}%`
      };
    }

    function loadTemplates() {
      const saved = loadJson(S.plantillas, {});
      const out = {};
      (D.templates || []).forEach((tpl) => {
        out[tpl.id] = saved[tpl.id] || tpl.content;
      });
      return out;
    }

    function registerGlobalSearch() {
      if (!window.SuiteVet?.registerSearch) return;
      window.SuiteVet.registerSearch("semiologia", (q) => {
        const results = [];
        (D.homeSections || []).forEach((sec) => {
          const blob = norm(`${sec.label} ${sec.description}`);
          if (!blob.includes(q)) return;
          results.push({
            title: sec.label,
            subtitle: "Semiologia & Anamnesis Pro",
            moduleId: "semiologia",
            action: () => {
              window.SuiteVet?.showView?.("semiologia");
              state.page = sec.id;
              render();
            }
          });
        });
        (D.caseLibrary || []).forEach((item) => {
          const blob = norm(`${item.title} ${item.species} ${item.system} ${item.objective}`);
          if (!blob.includes(q)) return;
          results.push({
            title: item.title,
            subtitle: `${item.species} · ${item.system}`,
            moduleId: "semiologia",
            action: () => {
              window.SuiteVet?.showView?.("semiologia");
              state.page = "casos";
              render();
            }
          });
        });
        return results.slice(0, 12);
      });
    }

    function mountBridgeFunctions() {
      window.enviarAnamnesisAClinicaIntegrada = enviarAnamnesisAClinicaIntegrada;
      window.enviarExamenFisicoAClinicaIntegrada = enviarExamenFisicoAClinicaIntegrada;
      window.crearCasoDesdeSemiologia = crearCasoDesdeSemiologia;
      window.exportarSemiologiaJSON = exportarSemiologiaJSON;
      window.importarSemiologiaJSON = importarSemiologiaJSON;

      window.SuiteVetSemiologia = {
        enviarAnamnesisAClinicaIntegrada,
        enviarExamenFisicoAClinicaIntegrada,
        crearCasoDesdeSemiologia,
        exportarSemiologiaJSON,
        importarSemiologiaJSON,
        interpretarParametro: interpretParameter
      };
    }

    function enviarAnamnesisAClinicaIntegrada(anamnesis) {
      const payload = anamnesis || buildAnamnesisPayload();
      return sendToClinicaBridge({
        type: "anamnesis",
        species: payload.patient?.species || "",
        reason: payload.reason || "",
        data: payload
      });
    }

    function enviarExamenFisicoAClinicaIntegrada(examen) {
      const payload = examen || buildExamPayload();
      return sendToClinicaBridge({
        type: "examen-fisico",
        species: payload.species || "",
        reason: payload.report || "",
        data: payload
      });
    }

    function crearCasoDesdeSemiologia(datos) {
      return sendToClinicaBridge({
        type: "caso-semiologia",
        species: datos?.species || "",
        reason: datos?.motive || datos?.title || "",
        data: datos || {}
      });
    }

    function exportarSemiologiaJSON(registro) {
      return JSON.stringify(
        registro || {
          anamnesis: buildAnamnesisPayload(),
          examen: buildExamPayload(),
          osceHistory: state.osceHistory.slice(0, 10),
          logbook: state.logbook.slice(0, 30)
        },
        null,
        2
      );
    }

    function importarSemiologiaJSON(json) {
      try {
        const parsed = typeof json === "string" ? JSON.parse(json) : json;
        if (!parsed || typeof parsed !== "object") return false;
        if (parsed.anamnesis) hydrateImportedAnamnesis(parsed.anamnesis);
        if (parsed.examen) hydrateImportedExam(parsed.examen);
        if (Array.isArray(parsed.logbook)) state.logbook = parsed.logbook.slice(0, 500);
        if (Array.isArray(parsed.osceHistory)) state.osceHistory = parsed.osceHistory.slice(0, 500);
        persistJson(S.logbook, state.logbook);
        persistJson(S.osce, state.osceHistory);
        render();
        notify("JSON importado en Semiologia.");
        return true;
      } catch {
        notify("No se pudo importar el JSON.");
        return false;
      }
    }

    function hydrateImportedAnamnesis(data) {
      if (!data) return;
      state.anamnesis.consultType = data.consultType || "";
      state.anamnesis.system = data.system || "";
      state.anamnesis.reason = data.reason || "";
      state.anamnesis.summary = data.summary || "";
      state.anamnesis.notes = data.notes || "";
      state.anamnesis.patientName = data.patient?.name || "";
      state.anamnesis.species = data.patient?.species || "";
      state.anamnesis.age = data.patient?.age || "";
      state.anamnesis.sex = data.patient?.sex || "";
      state.anamnesis.breed = data.patient?.breed || "";
      state.anamnesis.weight = data.patient?.weight || "";
      state.anamnesis.owner = data.patient?.owner || "";
      ensureAnamnesisQuestions();
      (data.questions || []).forEach((row) => {
        if (!state.anamnesis.questions[row.id]) return;
        state.anamnesis.questions[row.id].answer = row.answer || "";
        state.anamnesis.questions[row.id].asked = !!row.asked;
        state.anamnesis.questions[row.id].important = !!row.important;
      });
    }

    function hydrateImportedExam(data) {
      if (!data) return;
      state.exam.patientName = data.patientName || "";
      state.exam.species = data.species || "canino";
      state.exam.mode = data.examMode || "canino-felino";
      state.exam.vitals = deepClone(data.vitals || { temperatura: "", fc: "", fr: "", tllc: "" });
      state.exam.report = data.report || "";
      state.exam.problems = (data.problems || []).slice();
      state.exam.steps = {};
      (data.steps || []).forEach((step) => {
        state.exam.steps[step.id] = { done: !!step.done, finding: step.finding || "" };
      });
    }

    function sendToClinicaBridge(payload) {
      try {
        if (window.SuiteVetClinicaIntegrada?.importarCasoDesdeJson) {
          const casePayload = {
            id: `SEMI-${Date.now()}`,
            paciente: {
              especie: payload.species || "",
              motivo: payload.reason || ""
            },
            anamnesis: payload.type === "anamnesis" ? payload.data : {},
            examen: payload.type === "examen-fisico" ? payload.data : {},
            origen: "Semiologia & Anamnesis Pro",
            raw: payload.data
          };
          window.SuiteVetClinicaIntegrada.importarCasoDesdeJson(JSON.stringify(casePayload));
          notify("Datos enviados a Clinica Integrada.");
          return true;
        }
        const pending = loadJson("suiteVet_semiologia_bridge_pending", []);
        pending.unshift({ date: new Date().toISOString(), payload });
        persistJson("suiteVet_semiologia_bridge_pending", pending.slice(0, 100));
        notify("Datos preparados para Clinica Integrada. La conexion se activara cuando el modulo este disponible.");
        return false;
      } catch {
        notify("No se pudo preparar la conexion con Clinica Integrada.");
        return false;
      }
    }

    function selectField(label, field, options, selected, placeholder = "Selecciona") {
      const attrs = field.startsWith("exam.") ? `data-ex-field="${esc(field)}"` :
        field.startsWith("log.") ? `data-log-field="${esc(field.replace("log.", ""))}"` :
          field.startsWith("param.") ? `data-param-field="${esc(field.replace("param.", ""))}"` :
            `data-an-field="${esc(field)}"`;
      return `
        <label class="semi-field">
          <span>${esc(label)}</span>
          <select class="sv-select" ${attrs}>
            <option value="">${esc(placeholder)}</option>
            ${(options || []).map((opt) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const text = typeof opt === "string" ? opt : opt.label;
              return `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(text)}</option>`;
            }).join("")}
          </select>
        </label>
      `;
    }

    function speciesField(selectedId) {
      return `
        <label class="semi-field">
          <span>Especie</span>
          <select class="sv-select" data-an-field="species">
            <option value="">Selecciona</option>
            ${(D.species || []).map((item) => `<option value="${esc(item.id)}" ${item.id === selectedId ? "selected" : ""}>${esc(item.label)}</option>`).join("")}
          </select>
        </label>
      `;
    }

    function textField(label, field, value = "", placeholder = "") {
      const attrs = field.startsWith("exam.") ? `data-ex-field="${esc(field)}"` :
        field.startsWith("param.") ? `data-param-field="${esc(field.replace("param.", ""))}"` :
          field.startsWith("log.") ? `data-log-field="${esc(field.replace("log.", ""))}"` :
            `data-an-field="${esc(field)}"`;
      return `
        <label class="semi-field">
          <span>${esc(label)}</span>
          <input class="sv-input" type="text" ${attrs} value="${esc(value || "")}" placeholder="${esc(placeholder)}" />
        </label>
      `;
    }

    function textareaField(label, field, value = "", placeholder = "") {
      const attrs = field.startsWith("exam.") ? `data-ex-field="${esc(field)}"` :
        field.startsWith("log.") ? `data-log-field="${esc(field.replace("log.", ""))}"` :
          `data-an-field="${esc(field)}"`;
      return `
        <label class="semi-field">
          <span>${esc(label)}</span>
          <textarea class="sv-input" ${attrs} placeholder="${esc(placeholder)}">${esc(value || "")}</textarea>
        </label>
      `;
    }

    function notify(message) {
      if (Fav?.showToast) Fav.showToast(message);
      else console.log(`[Semiologia] ${message}`);
    }

    function loadJson(key, fallback) {
      if (!key) return deepClone(fallback);
      try {
        const raw = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
        return raw && typeof raw === "object" ? raw : deepClone(fallback);
      } catch {
        return deepClone(fallback);
      }
    }

    function persistJson(key, value) {
      if (!key) return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn("[Semiologia] Error guardando en localStorage:", error);
      }
    }

    function questionState() {
      return {
        asked: false,
        important: false,
        includeSummary: false,
        answer: ""
      };
    }

    function createAnamnesisState() {
      return {
        consultType: "",
        species: "",
        patientName: "",
        age: "",
        sex: "",
        breed: "",
        weight: "",
        owner: "",
        system: "",
        reason: "",
        summary: "",
        notes: "",
        questions: {}
      };
    }

    function createSimulationState() {
      return {
        caseId: "",
        draftQuestion: "",
        asked: [],
        showGuide: false
      };
    }

    function speciesLabel(id) {
      const item = (D.species || []).find((row) => row.id === id);
      return item?.label || id || "";
    }

    function speciesIdFromLabel(label) {
      const match = (D.species || []).find((item) => norm(item.label) === norm(label) || norm(item.id) === norm(label));
      return match?.id || cleanText(label || "").toLowerCase();
    }

    function systemLabel(id) {
      const item = (D.systems || []).find((row) => row.id === id);
      return item?.label || "";
    }

    function systemIdFromLabel(label) {
      const match = (D.systems || []).find((item) => norm(item.label) === norm(label) || norm(item.id) === norm(label));
      return match?.id || "";
    }

    function examModeLabel(id) {
      const item = (D.examSpeciesModes || []).find((row) => row.id === id);
      return item?.label || id || "";
    }

    function examModeIdFromLabel(label) {
      const match = (D.examSpeciesModes || []).find((item) => norm(item.label) === norm(label) || norm(item.id) === norm(label));
      return match?.id || "canino-felino";
    }

    function badgeByStatus(status) {
      if (status === "high") return "sv-badge-red";
      if (status === "low") return "sv-badge-yellow";
      return "sv-badge-green";
    }

    function badgeBySystem(system) {
      const id = systemIdFromLabel(system);
      return D.systemBadgeClass?.[id] || "sv-badge-blue";
    }

    function shortDate(value) {
      const d = new Date(value || Date.now());
      if (Number.isNaN(d.getTime())) return "";
      return new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
    }

    function todayISODate() {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    function formatClock(sec) {
      const s = Math.max(0, Number(sec) || 0);
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    }

    function copyToClipboard(text) {
      if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text || "");
      return new Promise((resolve, reject) => {
        const ta = document.createElement("textarea");
        ta.value = text || "";
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        if (ok) resolve();
        else reject(new Error("copy-failed"));
      });
    }

    function addUnique(list, value) {
      if (!value) return;
      if (!list.includes(value)) list.push(value);
    }

    function clampInt(value, min, max) {
      const n = Number(value);
      if (!Number.isFinite(n)) return min;
      return Math.max(min, Math.min(max, Math.round(n)));
    }

    function cleanText(value) {
      return String(value || "").trim();
    }

    function norm(value) {
      return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function capitalize(value) {
      const t = String(value || "");
      return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
    }

    function slug(value) {
      return norm(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    function esc(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function deepClone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    window.addEventListener("beforeunload", () => {
      state.osce.running = false;
    });

    // interpretacion expuesta para pruebas externas
    window.interpretarParametro = interpretParameter;

  });
})();
