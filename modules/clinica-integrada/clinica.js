(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("clinica-root");
    if (!root) return;

    const D = window.CLINICA_DATA || {};
    const Fav = window.SuiteVet?.Favorites || null;
    const Pdf = window.SuiteVet?.ClinicaPdf || null;
    const Safety = window.SuiteVetSafety;
    const STORAGE_KEY = D.storageKeyCases || "suiteVet_clinica_casos";
    const TEMPLATE_STORAGE_KEY = D.storageKeyTemplates || "suiteVet_clinica_templates";

    if (!Safety) {
      throw new Error("[Clinica] No se cargaron las utilidades de importacion segura.");
    }

    const state = {
      page: "inicio",
      cases: loadCases(),
      current: createEmptyCase(),
      filters: { query: "", especie: "", sistema: "", fecha: "", dx: "" },
      ui: {
        customProblemDraft: "",
        loadCaseId: "",
        showGuideId: "",
        templateSearch: ""
      },
      templateOverrides: loadTemplateOverrides()
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleInput);

    render();
    registerGlobalSearch();

    function render() {
      root.innerHTML = `
        <section class="clinica-shell sv-module-shell">
          ${renderHeader()}
          ${renderSubnav()}
          <div id="clinica-tabpanel" class="sv-module-panel">
            ${renderPage()}
          </div>
        </section>
      `;

      Fav?.bindWithin(root);
      bindDataList();
    }

    function renderHeader() {
      return `
        <section class="sv-module-header clinica-header">
          <p class="clinica-kicker">SUITE VET</p>
          <h2>Clinica Integrada</h2>
          <p class="sv-view-intro">
            ${escapeHtml(D.intro || "")}
          </p>
        </section>
      `;
    }

    function renderSubnav() {
      const tabs = [
        { id: "inicio", label: "Inicio", icon: "CI" },
        { id: "nuevo", label: "Nuevo caso clinico", icon: "NC" },
        { id: "guardados", label: "Casos guardados", icon: String(state.cases.length) },
        { id: "biblioteca", label: "Biblioteca de casos", icon: String((D.practiceCases || []).length) },
        { id: "plantillas", label: "Plantillas SOAP", icon: String((D.soapTemplates || []).length) }
      ];

      return `
        <div class="sv-module-subnav clinica-tabs" data-tabpanel="clinica-tabpanel" aria-label="Secciones de Clinica Integrada">
          ${tabs.map((tab) => `
            <button type="button" class="sv-module-tab ${state.page === tab.id ? "is-active" : ""}" data-cl-page="${tab.id}">
              <span>${escapeHtml(tab.icon)}</span>
              <strong>${escapeHtml(tab.label)}</strong>
            </button>
          `).join("")}
        </div>
      `;
    }

    function renderPage() {
      if (state.page === "nuevo") return renderCaseEditor();
      if (state.page === "guardados") return renderSavedCases();
      if (state.page === "biblioteca") return renderPracticeLibrary();
      if (state.page === "plantillas") return renderSoapTemplates();
      return renderHome();
    }

    function renderHome() {
      return `
        <section class="clinica-home">
          <section class="clinica-module-card">
            <h3>Navegacion simplificada</h3>
            <p class="clinica-subtitle">Usa las capsulas superiores para abrir cada seccion de Clinica Integrada.</p>
            <div class="clinica-chip-grid">
              ${(D.trainingTags || []).map((tag) => `<span class="sv-badge sv-badge-blue">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </section>
        </section>
      `;
    }

    function renderCaseEditor() {
      const c = state.current;
      const vitalSummary = c.vitalInterpretation?.summary || "Todavia no se interpreta signos vitales.";
      const suggestedDx = c.diferenciales?.sugeridos || [];
      const selectedDx = c.diferenciales?.seleccionados || [];
      const selectedProblems = selectedProblemLabels(c);
      const selectedExams = selectedExamLines(c);
      const savedOptions = state.cases.map((entry) => `
        <option value="${escapeAttr(entry.id)}">
          ${escapeHtml(entry.paciente?.nombre || "Sin paciente")} | ${escapeHtml(entry.paciente?.especieLabel || labelFromSpecies(entry.paciente?.especie) || "Sin especie")} | ${escapeHtml(shortDate(entry.updatedAt || entry.createdAt))}
        </option>
      `).join("");

      return `
        <section class="clinica-editor">
          <div class="clinica-module-card clinica-action-strip">
            <button class="sv-btn sv-btn-primary" type="button" data-cl-action="save-case">Guardar caso</button>
            <button class="sv-btn sv-btn-secondary" type="button" data-cl-action="print-current">Descargar/Imprimir PDF</button>
            <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="clear-current">Limpiar formulario</button>
            <div class="clinica-load-inline">
              <select class="sv-select" data-cl-input="load-case-id">
                <option value="">Cargar caso guardado</option>
                ${savedOptions}
              </select>
              <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="load-selected">Cargar</button>
            </div>
          </div>

          <details class="clinica-section" open>
            <summary>1. Datos del paciente</summary>
            <div class="clinica-form-grid clinica-form-grid-3">
              ${textField("Nombre o ID del paciente", "paciente.nombre", c.paciente?.nombre || "", "Ej. Canino 001")}
              ${speciesField(c.paciente?.especie || "")}
              ${textField("Raza", "paciente.raza", c.paciente?.raza || "", "Ej. Mestizo")}
              ${textField("Edad", "paciente.edad", c.paciente?.edad || "", "Ej. 3 anos")}
              ${selectField("Sexo", "paciente.sexo", D.sexOptions || [], c.paciente?.sexo || "", "Selecciona")}
              ${numberField("Peso (kg)", "paciente.pesoKg", c.paciente?.pesoKg || "", "0.01")}
              ${textField("Propietario o responsable", "paciente.propietario", c.paciente?.propietario || "", "Nombre del tutor")}
              ${selectField("Sistema principal afectado", "paciente.sistema", D.systems || [], c.paciente?.sistema || "", "Selecciona")}
            </div>
            ${textareaField("Motivo de consulta", "paciente.motivo", c.paciente?.motivo || "", "Describe el motivo principal.")}
          </details>

          <details class="clinica-section" open>
            <summary>2. Anamnesis</summary>
            <div class="clinica-form-grid clinica-form-grid-2">
              ${textareaField("Inicio del problema", "anamnesis.inicio", c.anamnesis?.inicio || "", "Desde cuando inicio?")}
              ${textareaField("Evolucion", "anamnesis.evolucion", c.anamnesis?.evolucion || "", "Aguda, subaguda, cronica...")}
              ${textareaField("Alimentacion", "anamnesis.alimentacion", c.anamnesis?.alimentacion || "", "Tipo y frecuencia de dieta")}
              ${textareaField("Vacunacion", "anamnesis.vacunacion", c.anamnesis?.vacunacion || "", "Esquema vigente o pendiente")}
              ${textareaField("Desparasitacion", "anamnesis.desparasitacion", c.anamnesis?.desparasitacion || "", "Fecha y producto")}
              ${textareaField("Tratamientos previos", "anamnesis.tratamientosPrevios", c.anamnesis?.tratamientosPrevios || "", "Medicaciones anteriores")}
              ${textareaField("Ambiente o manejo", "anamnesis.ambiente", c.anamnesis?.ambiente || "", "Condiciones de manejo")}
              ${textareaField("Contacto con otros animales", "anamnesis.contacto", c.anamnesis?.contacto || "", "Riesgo epidemiologico")}
            </div>
            ${textareaField("Observaciones adicionales", "anamnesis.observaciones", c.anamnesis?.observaciones || "", "Notas clinicas relevantes.")}
          </details>

          <details class="clinica-section" open>
            <summary>3. Examen fisico</summary>
            <div class="clinica-form-grid clinica-form-grid-3">
              ${numberField("Temperatura C", "examen.temperatura", c.examen?.temperatura || "", "0.1")}
              ${numberField("Frecuencia cardiaca (lpm)", "examen.fc", c.examen?.fc || "", "1")}
              ${numberField("Frecuencia respiratoria (rpm)", "examen.fr", c.examen?.fr || "", "1")}
              ${numberField("Peso (kg)", "examen.pesoKg", c.examen?.pesoKg || "", "0.01")}
              ${numberField("% deshidratacion estimado", "examen.deshidratacionPct", c.examen?.deshidratacionPct || "", "0.1")}
              ${selectField("Mucosas", "examen.mucosas", D.mucosaOptions || [], c.examen?.mucosas || "", "Selecciona")}
              ${selectField("Tiempo de llenado capilar", "examen.tlc", D.tlcOptions || [], c.examen?.tlc || "", "Selecciona")}
              ${selectField("Condicion corporal", "examen.condicionCorporal", D.bodyConditionOptions || [], c.examen?.condicionCorporal || "", "Selecciona")}
              ${selectField("Estado mental", "examen.estadoMental", D.mentalOptions || [], c.examen?.estadoMental || "", "Selecciona")}
              ${selectField("Dolor", "examen.dolor", D.painOptions || [], c.examen?.dolor || "", "Selecciona")}
              ${selectField("Linfonodos", "examen.linfonodos", D.linfonodosOptions || [], c.examen?.linfonodos || "", "Selecciona")}
              ${selectField("Hidratacion", "examen.hidratacion", D.hydrationOptions || [], c.examen?.hidratacion || "", "Selecciona")}
            </div>
            <div class="clinica-inline-actions">
              <button class="sv-btn sv-btn-secondary" type="button" data-cl-action="interpret-vitals">Interpretar signos vitales</button>
            </div>
            <div class="clinica-note ${c.vitalInterpretation?.items?.length ? "is-ready" : ""}">
              <strong>Interpretacion:</strong>
              <span>${escapeHtml(vitalSummary)}</span>
            </div>
            ${renderVitalBadges(c.vitalInterpretation?.items || [])}
          </details>

          <details class="clinica-section" open>
            <summary>4. Problemas clinicos</summary>
            <div class="clinica-problems-grid">
              ${(D.problemCatalog || []).map((problem) => `
                <label class="clinica-check">
                  <input type="checkbox" data-cl-problem="${escapeAttr(problem.key)}" ${isProblemSelected(c, problem.key) ? "checked" : ""} />
                  <span>${escapeHtml(problem.label)}</span>
                </label>
              `).join("")}
            </div>
            <div class="clinica-inline-actions">
              <input class="sv-input" type="text" placeholder="Otro problema personalizado" data-cl-input="custom-problem-draft" value="${escapeAttr(state.ui.customProblemDraft)}" />
              <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="add-custom-problem">Agregar problema personalizado</button>
            </div>
            <div class="clinica-chip-grid clinica-chip-selected">
              ${selectedProblems.length ? selectedProblems.map((label) => `<span class="sv-badge sv-badge-cyan">${escapeHtml(label)}</span>`).join("") : `<span class="clinica-muted">Sin problemas seleccionados.</span>`}
            </div>
          </details>

          <details class="clinica-section" open>
            <summary>5. Diagnosticos diferenciales</summary>
            <div class="clinica-inline-actions">
              <button class="sv-btn sv-btn-secondary" type="button" data-cl-action="suggest-diff">Sugerir diagnosticos diferenciales</button>
            </div>
            <div class="clinica-grid-diff">
              ${suggestedDx.length ? suggestedDx.map((dx) => renderDifferentialCard(dx)).join("") : `<div class="sv-empty"><div class="sv-empty-icon">?</div>Sin sugerencias automaticas todavia.</div>`}
            </div>
            <div class="clinica-selected-block">
              <h4>Diferenciales agregados al analisis</h4>
              <div class="clinica-chip-grid">
                ${selectedDx.length
                  ? selectedDx.map((dx) => `
                    <button type="button" class="clinica-chip-button" data-cl-action="remove-diff" data-diff-name="${escapeAttr(dx.nombre)}">
                      ${escapeHtml(dx.nombre)} (${escapeHtml(dx.prioridad || "Media")})
                    </button>
                  `).join("")
                  : `<span class="clinica-muted">Todavia no hay diferenciales seleccionados.</span>`
                }
              </div>
            </div>
            <div class="clinica-form-grid clinica-form-grid-4">
              ${textField("Diferencial manual", "diferenciales.manualDraft.nombre", c.diferenciales?.manualDraft?.nombre || "", "Nombre")}
              ${textField("Sistema", "diferenciales.manualDraft.sistema", c.diferenciales?.manualDraft?.sistema || "", "Sistema")}
              ${selectField("Prioridad", "diferenciales.manualDraft.prioridad", ["Alta", "Media", "Baja"], c.diferenciales?.manualDraft?.prioridad || "Media", "Selecciona")}
              ${textField("Razon clinica", "diferenciales.manualDraft.razon", c.diferenciales?.manualDraft?.razon || "", "Justificacion breve")}
            </div>
            <div class="clinica-inline-actions">
              <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="add-manual-diff">Agregar diferencial manual</button>
            </div>
          </details>

          <details class="clinica-section" open>
            <summary>6. Examenes complementarios</summary>
            <div class="clinica-inline-actions">
              <button class="sv-btn sv-btn-secondary" type="button" data-cl-action="suggest-exams">Sugerir examenes segun el caso</button>
            </div>
            ${renderExamGroups(c)}
          </details>

          <details class="clinica-section" open>
            <summary>7. Interpretacion clinica</summary>
            <div class="clinica-summary-box">
              <p><strong>Problemas principales:</strong> ${escapeHtml(selectedProblems.join(", ") || "Dato pendiente")}</p>
              <p><strong>Diferenciales seleccionados:</strong> ${escapeHtml(selectedDx.map((dx) => dx.nombre).join(", ") || "Dato pendiente")}</p>
              <p><strong>Examenes recomendados:</strong> ${escapeHtml(selectedExams.map((line) => line.label).join(", ") || "Dato pendiente")}</p>
            </div>
            ${textareaField("Interpretacion del caso", "interpretacion.texto", c.interpretacion?.texto || "", "Razonamiento clinico paso a paso.")}
            <div class="clinica-form-grid clinica-form-grid-3">
              ${textareaField("Diagnostico presuntivo", "interpretacion.dxPresuntivo", c.interpretacion?.dxPresuntivo || "", "Diagnostico probable")}
              ${textareaField("Diagnostico definitivo", "interpretacion.dxDefinitivo", c.interpretacion?.dxDefinitivo || "", "Confirmacion final")}
              ${selectField("Pronostico", "interpretacion.pronostico", D.prognosisOptions || [], c.interpretacion?.pronostico || "", "Selecciona")}
            </div>
            <div class="clinica-inline-actions">
              <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="draft-interpretation">Generar borrador de interpretacion</button>
            </div>
          </details>

          <details class="clinica-section" open>
            <summary>8. Plan terapeutico</summary>
            <div class="clinica-form-grid clinica-form-grid-2">
              ${textareaField("Manejo inicial", "terapia.manejoInicial", c.terapia?.manejoInicial || "", "Plan inmediato")}
              ${textareaField("Fluidoterapia", "terapia.fluidoterapia", c.terapia?.fluidoterapia || "", "Tipo, volumen y ritmo")}
              ${textareaField("Antimicrobianos", "terapia.antimicrobianos", c.terapia?.antimicrobianos || "", "Farmaco, dosis y via")}
              ${textareaField("Antiinflamatorios / analgesia", "terapia.antiinflamatorios", c.terapia?.antiinflamatorios || "", "Control de dolor e inflamacion")}
              ${textareaField("Antiparasitarios", "terapia.antiparasitarios", c.terapia?.antiparasitarios || "", "Esquema antiparasitario")}
              ${textareaField("Soporte nutricional", "terapia.soporteNutricional", c.terapia?.soporteNutricional || "", "Requerimientos nutricionales")}
              ${textareaField("Aislamiento / bioseguridad", "terapia.aislamiento", c.terapia?.aislamiento || "", "Medidas sanitarias")}
              ${textareaField("Recomendaciones al propietario", "terapia.recomendaciones", c.terapia?.recomendaciones || "", "Instrucciones de manejo")}
            </div>
            ${textareaField("Seguimiento", "terapia.seguimiento", c.terapia?.seguimiento || "", "Plan de control")}
            <div class="clinica-inline-actions">
              <button class="sv-btn sv-btn-secondary" type="button" data-cl-action="to-farma">Enviar a Farmacologia</button>
            </div>
          </details>

          <details class="clinica-section" open>
            <summary>9. Formato SOAP</summary>
            <div class="clinica-form-grid clinica-form-grid-2">
              ${textareaField("S - Subjetivo", "soap.s", c.soap?.s || "", "Motivo de consulta + anamnesis resumida")}
              ${textareaField("O - Objetivo", "soap.o", c.soap?.o || "", "Signos vitales + examen fisico")}
              ${textareaField("A - Analisis", "soap.a", c.soap?.a || "", "Problemas + diferenciales + interpretacion")}
              ${textareaField("P - Plan", "soap.p", c.soap?.p || "", "Examenes + tratamiento + seguimiento")}
            </div>
            <div class="clinica-inline-actions">
              <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="generate-soap">Generar SOAP</button>
            </div>
            ${textareaField("SOAP editable", "soap.texto", c.soap?.texto || "", "Texto integral SOAP")}
          </details>

          <details class="clinica-section" open>
            <summary>10. Guardar e imprimir</summary>
            <div class="clinica-form-grid clinica-form-grid-2">
              ${textField("ID unico del caso", "id", c.id || "", "")}
              ${textField("Firma o responsable", "firmaResponsable", c.firmaResponsable || "", "Nombre del responsable")}
            </div>
            <div class="clinica-action-row">
              <button class="sv-btn sv-btn-primary" type="button" data-cl-action="save-case">Guardar caso</button>
              <button class="sv-btn sv-btn-secondary" type="button" data-cl-action="print-current">Descargar/Imprimir PDF</button>
              <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="clear-current">Limpiar formulario</button>
              <button class="sv-btn sv-btn-ghost" type="button" data-cl-action="load-selected">Cargar caso guardado</button>
            </div>
          </details>
        </section>
      `;
    }

    function renderVitalBadges(items) {
      if (!items.length) return "";
      return `
        <div class="clinica-chip-grid">
          ${items.map((item) => `
            <span class="sv-badge ${badgeClassByStatus(item.status)}">${escapeHtml(item.label)}: ${escapeHtml(item.statusLabel)}</span>
          `).join("")}
        </div>
      `;
    }

    function renderDifferentialCard(dx) {
      return `
        <article class="sv-card clinica-diff-card" data-module="clinica">
          <div class="sv-card-header">
            <span class="sv-card-title">${escapeHtml(dx.nombre || "Diferencial")}</span>
            <span class="sv-badge ${priorityBadge(dx.prioridad)}">${escapeHtml(dx.prioridad || "Media")}</span>
          </div>
          <span class="sv-card-subtitle">${escapeHtml(dx.sistema || "Sistema no definido")}</span>
          <div class="sv-card-body">
            <p>${escapeHtml(dx.razon || "Sin razon clinica.")}</p>
          </div>
          <div class="sv-card-footer">
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-cl-action="add-diff" data-diff-name="${escapeAttr(dx.nombre)}">Agregar al analisis</button>
          </div>
        </article>
      `;
    }

    function renderExamGroups(caso) {
      const groups = D.examCatalog || {};
      const rows = [];

      Object.entries(groups).forEach(([groupName, exams]) => {
        rows.push(`
          <section class="clinica-exam-group">
            <h4>${escapeHtml(capitalize(groupName))}</h4>
            <div class="clinica-exam-list">
              ${(exams || []).map((exam) => renderExamRow(caso, groupName, exam)).join("")}
            </div>
          </section>
        `);
      });

      return rows.join("");
    }

    function renderExamRow(caso, groupName, exam) {
      const entry = caso.examenes?.items?.[exam.key] || buildExamEntry(groupName, exam);
      return `
        <article class="clinica-exam-row">
          <label class="clinica-check">
            <input type="checkbox" data-cl-exam="${escapeAttr(exam.key)}" ${entry.checked ? "checked" : ""} />
            <span>${escapeHtml(exam.label)}</span>
          </label>
          <input class="sv-input" type="text" placeholder="Justificacion" data-cl-field="examenes.items.${escapePath(exam.key)}.justificacion" value="${escapeAttr(entry.justificacion || "")}" />
          <input class="sv-input" type="text" placeholder="Resultado" data-cl-field="examenes.items.${escapePath(exam.key)}.resultado" value="${escapeAttr(entry.resultado || "")}" />
        </article>
      `;
    }

    function renderSavedCases() {
      const list = filterSavedCases(state.cases, state.filters);

      return `
        <section class="clinica-saved">
          <div class="clinica-module-card">
            <div class="clinica-saved-toolbar">
              <input class="sv-input" type="text" placeholder="Buscar por especie, paciente, diagnostico, sistema o problema..." data-cl-filter="query" value="${escapeAttr(state.filters.query)}" />
              <select class="sv-select" data-cl-filter="especie">
                <option value="">Todas las especies</option>
                ${(D.species || []).map((sp) => `<option value="${escapeAttr(sp.id)}" ${state.filters.especie === sp.id ? "selected" : ""}>${escapeHtml(sp.label)}</option>`).join("")}
              </select>
              <select class="sv-select" data-cl-filter="sistema">
                <option value="">Todos los sistemas</option>
                ${(D.systems || []).map((sys) => `<option value="${escapeAttr(sys)}" ${state.filters.sistema === sys ? "selected" : ""}>${escapeHtml(sys)}</option>`).join("")}
              </select>
              <input class="sv-input" type="date" data-cl-filter="fecha" value="${escapeAttr(state.filters.fecha)}" />
              <input class="sv-input" type="text" placeholder="Diagnostico" data-cl-filter="dx" value="${escapeAttr(state.filters.dx)}" />
            </div>
          </div>

          <div class="sv-grid clinica-saved-grid">
            ${list.length ? list.map(renderSavedCard).join("") : `<div class="sv-empty"><div class="sv-empty-icon">?</div>No hay casos que coincidan con los filtros.</div>`}
          </div>
        </section>
      `;
    }

    function renderSavedCard(caso) {
      const patient = caso.paciente || {};
      const problems = selectedProblemLabels(caso).slice(0, 6);
      const favData = {
        id: `clinica-caso-${caso.id}`,
        titulo: patient.nombre || `Caso ${caso.id}`,
        modulo: "Clinica Integrada",
        submodulo: "Casos guardados",
        tipo: "Caso clinico",
        descripcion: caso.interpretacion?.dxPresuntivo || patient.sistema || "",
        data: { caseId: caso.id }
      };

      return `
        <article class="sv-card clinica-case-card sv-fade-in" data-module="clinica"
          data-fav-id="${escapeAttr(favData.id)}"
          data-fav-title="${escapeAttr(favData.titulo)}"
          data-fav-module="${escapeAttr(favData.modulo)}"
          data-fav-submodule="${escapeAttr(favData.submodulo)}"
          data-fav-type="${escapeAttr(favData.tipo)}"
          data-fav-description="${escapeAttr(favData.descripcion)}"
          data-fav-data="${escapeAttr(JSON.stringify(favData.data))}">
          <div class="sv-card-header">
            <span class="sv-card-title">${escapeHtml(patient.nombre || "Sin paciente")}</span>
            <span class="sv-badge ${systemBadge(patient.sistema)}">${escapeHtml(patient.sistema || "Sin sistema")}</span>
          </div>
          <span class="sv-card-subtitle">
            ${escapeHtml(patient.especieLabel || labelFromSpecies(patient.especie) || "Sin especie")} · ${escapeHtml(shortDate(caso.updatedAt || caso.createdAt))}
          </span>
          <div class="sv-card-body">
            <p><strong>Dx presuntivo:</strong> ${escapeHtml(caso.interpretacion?.dxPresuntivo || "Dato pendiente")}</p>
            <p><strong>Dx definitivo:</strong> ${escapeHtml(caso.interpretacion?.dxDefinitivo || "Dato pendiente")}</p>
          </div>
          <div class="clinica-chip-grid">
            ${problems.map((item) => `<span class="sv-badge sv-badge-cyan">${escapeHtml(item)}</span>`).join("")}
          </div>
          <div class="clinica-card-actions">
            <button class="sv-btn sv-btn-sm sv-btn-ghost" type="button" data-cl-action="view-case" data-case-id="${escapeAttr(caso.id)}">Ver</button>
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-cl-action="edit-case" data-case-id="${escapeAttr(caso.id)}">Editar</button>
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-cl-action="duplicate-case" data-case-id="${escapeAttr(caso.id)}">Duplicar</button>
            <button class="sv-btn sv-btn-sm sv-btn-danger" type="button" data-cl-action="delete-case" data-case-id="${escapeAttr(caso.id)}">Eliminar</button>
            <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-cl-action="print-case" data-case-id="${escapeAttr(caso.id)}">Imprimir PDF</button>
          </div>
        </article>
      `;
    }

    function renderPracticeLibrary() {
      const q = norm(state.filters.query || "");
      const list = (D.practiceCases || []).filter((item) => {
        if (!q) return true;
        return norm(`${item.titulo} ${item.especie} ${item.sistema} ${(item.problemas || []).join(" ")}`).includes(q);
      });

      return `
        <section class="clinica-library">
          <div class="clinica-module-card">
            <div class="clinica-saved-toolbar">
              <input class="sv-input" type="text" placeholder="Buscar en biblioteca de casos..." data-cl-library-search value="${escapeAttr(state.filters.query)}" />
            </div>
          </div>
          <div class="sv-grid clinica-library-grid">
            ${list.map(renderPracticeCard).join("")}
          </div>
        </section>
      `;
    }

    function renderPracticeCard(item) {
      const expanded = state.ui.showGuideId === item.id;
      const favData = {
        id: `clinica-practica-${item.id}`,
        titulo: item.titulo,
        modulo: "Clinica Integrada",
        submodulo: "Biblioteca de casos",
        tipo: "Caso de practica",
        descripcion: `${item.sistema} - ${labelFromSpecies(item.especie)}`
      };

      return `
        <article class="sv-card clinica-practice-card" data-module="clinica"
          data-fav-id="${escapeAttr(favData.id)}"
          data-fav-title="${escapeAttr(favData.titulo)}"
          data-fav-module="${escapeAttr(favData.modulo)}"
          data-fav-submodule="${escapeAttr(favData.submodulo)}"
          data-fav-type="${escapeAttr(favData.tipo)}"
          data-fav-description="${escapeAttr(favData.descripcion)}">
          <div class="sv-card-header">
            <span class="sv-card-title">${escapeHtml(item.titulo)}</span>
            <span class="sv-badge ${systemBadge(item.sistema)}">${escapeHtml(item.sistema)}</span>
          </div>
          <span class="sv-card-subtitle">${escapeHtml(labelFromSpecies(item.especie))}</span>
          <div class="sv-card-body">
            <p><strong>Problemas:</strong> ${(item.problemas || []).map(labelFromProblem).join(", ")}</p>
            <p><strong>Diferenciales:</strong> ${(item.diferenciales || []).join(", ")}</p>
            <p><strong>Examenes sugeridos:</strong> ${(item.examenes || []).map(labelFromExam).join(", ")}</p>
          </div>
          ${expanded ? `<p class="clinica-guide">${escapeHtml(item.guiaDocente || "Sin guia docente.")}</p>` : ""}
          <div class="clinica-card-actions">
            <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-cl-action="resolve-practice" data-practice-id="${escapeAttr(item.id)}">Resolver caso</button>
            <button class="sv-btn sv-btn-sm sv-btn-ghost" type="button" data-cl-action="toggle-guide" data-practice-id="${escapeAttr(item.id)}">Ver guia docente</button>
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-cl-action="copy-practice" data-practice-id="${escapeAttr(item.id)}">Crear copia editable</button>
          </div>
        </article>
      `;
    }

    function renderSoapTemplates() {
      const base = D.soapTemplates || [];
      const q = norm(state.ui.templateSearch || "");
      const filtered = base.filter((item) => norm(item.titulo).includes(q) || norm(getTemplateText(item.id)).includes(q));

      return `
        <section class="clinica-templates">
          <div class="clinica-module-card">
            <div class="clinica-saved-toolbar">
              <input class="sv-input" type="text" placeholder="Buscar plantilla..." data-cl-template-search value="${escapeAttr(state.ui.templateSearch)}" />
            </div>
          </div>
          <div class="sv-grid clinica-templates-grid">
            ${filtered.map((item) => renderTemplateCard(item)).join("")}
          </div>
        </section>
      `;
    }

    function renderTemplateCard(item) {
      const text = getTemplateText(item.id);
      const favData = {
        id: `clinica-template-${item.id}`,
        titulo: item.titulo,
        modulo: "Clinica Integrada",
        submodulo: "Plantillas SOAP",
        tipo: "Plantilla"
      };
      return `
        <article class="sv-card clinica-template-card" data-module="clinica"
          data-fav-id="${escapeAttr(favData.id)}"
          data-fav-title="${escapeAttr(favData.titulo)}"
          data-fav-module="${escapeAttr(favData.modulo)}"
          data-fav-submodule="${escapeAttr(favData.submodulo)}"
          data-fav-type="${escapeAttr(favData.tipo)}">
          <div class="sv-card-header">
            <span class="sv-card-title">${escapeHtml(item.titulo)}</span>
          </div>
          <textarea class="clinica-template-editor" data-cl-template-id="${escapeAttr(item.id)}">${escapeHtml(text)}</textarea>
          <div class="clinica-card-actions">
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-cl-action="copy-template" data-template-id="${escapeAttr(item.id)}">Copiar al portapapeles</button>
            <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-cl-action="use-template" data-template-id="${escapeAttr(item.id)}">Usar en nuevo caso</button>
            <button class="sv-btn sv-btn-sm sv-btn-ghost" type="button" data-cl-action="save-template" data-template-id="${escapeAttr(item.id)}">Guardar edicion</button>
          </div>
        </article>
      `;
    }

    function handleClick(event) {
      const pageBtn = event.target.closest("[data-cl-page]");
      if (pageBtn) {
        state.page = pageBtn.dataset.clPage;
        render();
        return;
      }

      const actionBtn = event.target.closest("[data-cl-action]");
      if (!actionBtn) return;

      const action = actionBtn.dataset.clAction;
      const caseId = actionBtn.dataset.caseId;
      const practiceId = actionBtn.dataset.practiceId;
      const templateId = actionBtn.dataset.templateId;
      const diffName = actionBtn.dataset.diffName;

      if (action === "save-case") return saveCurrentCase();
      if (action === "print-current") return printCurrentCase();
      if (action === "clear-current") return clearCurrentCase();
      if (action === "load-selected") return loadSelectedCase();
      if (action === "interpret-vitals") return interpretVitalsAction();
      if (action === "add-custom-problem") return addCustomProblem();
      if (action === "suggest-diff") return suggestDifferentials();
      if (action === "add-diff") return addSuggestedDifferential(diffName);
      if (action === "remove-diff") return removeDifferential(diffName);
      if (action === "add-manual-diff") return addManualDifferential();
      if (action === "suggest-exams") return suggestExams();
      if (action === "draft-interpretation") return draftInterpretation();
      if (action === "to-farma") return conectarConFarmacologia(state.current);
      if (action === "generate-soap") return generateSoap();
      if (action === "view-case" || action === "edit-case") return openSavedCase(caseId);
      if (action === "duplicate-case") return duplicateCase(caseId);
      if (action === "delete-case") return deleteCase(caseId);
      if (action === "print-case") return printById(caseId);
      if (action === "resolve-practice") return resolvePracticeCase(practiceId, false);
      if (action === "copy-practice") return resolvePracticeCase(practiceId, true);
      if (action === "toggle-guide") return toggleGuide(practiceId);
      if (action === "copy-template") return copyTemplate(templateId);
      if (action === "use-template") return useTemplate(templateId);
      if (action === "save-template") return saveTemplate(templateId);
    }

    function handleInput(event) {
      const target = event.target;

      if (target.dataset.clField) {
        const value = target.type === "checkbox" ? target.checked : target.value;
        setPath(state.current, target.dataset.clField, value);
        return;
      }

      if (target.dataset.clInput === "custom-problem-draft") {
        state.ui.customProblemDraft = target.value || "";
        return;
      }

      if (target.dataset.clInput === "load-case-id") {
        state.ui.loadCaseId = target.value || "";
        return;
      }

      if (target.dataset.clProblem) {
        toggleProblem(target.dataset.clProblem, target.checked);
        render();
        return;
      }

      if (target.dataset.clExam) {
        toggleExam(target.dataset.clExam, target.checked);
        return;
      }

      if (target.dataset.clFilter) {
        state.filters[target.dataset.clFilter] = target.value || "";
        render();
        return;
      }

      if (target.dataset.clLibrarySearch !== undefined) {
        state.filters.query = target.value || "";
        render();
        return;
      }

      if (target.dataset.clTemplateSearch !== undefined) {
        state.ui.templateSearch = target.value || "";
        render();
        return;
      }

      if (target.dataset.clTemplateId) {
        state.templateOverrides[target.dataset.clTemplateId] = target.value || "";
      }
    }

    function saveCurrentCase() {
      const warnings = importantDataWarnings(state.current);
      const ready = prepareCaseForSave(state.current);
      const previousCases = state.cases.slice();
      const index = state.cases.findIndex((item) => item.id === ready.id);
      if (index >= 0) state.cases[index] = ready;
      else state.cases.unshift(ready);
      state.cases.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      if (!saveCases(state.cases)) {
        state.cases = previousCases;
        notify("No se pudo guardar el caso. Revisa el espacio disponible del navegador e intenta nuevamente.");
        return false;
      }
      state.current = deepClone(ready);
      notify("Caso guardado correctamente.");
      if (warnings.length) notify(`Faltan datos importantes: ${warnings.join(", ")}.`);
      render();
      return true;
    }

    function printCurrentCase() {
      const ready = prepareCaseForSave(state.current);
      if (Pdf?.printCase) Pdf.printCase(ready);
      else window.print();
      notify("PDF listo para imprimir.");
    }

    function clearCurrentCase() {
      state.current = createEmptyCase();
      state.ui.customProblemDraft = "";
      render();
      notify("Formulario limpiado.");
    }

    function loadSelectedCase() {
      if (!state.ui.loadCaseId) {
        notify("Selecciona un caso guardado para cargar.");
        return;
      }
      openSavedCase(state.ui.loadCaseId);
    }

    function openSavedCase(caseId) {
      const found = state.cases.find((item) => item.id === caseId);
      if (!found) {
        notify("No se encontro el caso solicitado.");
        return;
      }
      state.current = deepClone(found);
      state.page = "nuevo";
      state.ui.loadCaseId = caseId;
      render();
      notify("Caso cargado.");
    }

    function duplicateCase(caseId) {
      const found = state.cases.find((item) => item.id === caseId);
      if (!found) return;
      const copy = deepClone(found);
      copy.id = generateCaseId();
      copy.createdAt = new Date().toISOString();
      copy.updatedAt = copy.createdAt;
      copy.paciente = copy.paciente || {};
      if (copy.paciente.nombre) copy.paciente.nombre = `${copy.paciente.nombre} (Copia)`;
      state.cases.unshift(copy);
      saveCases(state.cases);
      render();
      notify("Caso duplicado.");
    }

    function deleteCase(caseId) {
      const before = state.cases.length;
      state.cases = state.cases.filter((item) => item.id !== caseId);
      if (state.cases.length === before) return;
      saveCases(state.cases);
      render();
      notify("Caso eliminado.");
    }

    function printById(caseId) {
      const found = state.cases.find((item) => item.id === caseId);
      if (!found) return;
      Pdf?.printCase ? Pdf.printCase(found) : window.print();
      notify("PDF listo para imprimir.");
    }

    function interpretVitalsAction() {
      state.current.vitalInterpretation = interpretVitals(state.current);
      render();
      notify("Interpretacion de signos vitales generada.");
    }

    function addCustomProblem() {
      const value = cleanText(state.ui.customProblemDraft);
      if (!value) {
        notify("Escribe un problema personalizado para agregar.");
        return;
      }
      state.current.problemas = state.current.problemas || {};
      state.current.problemas.personalizados = state.current.problemas.personalizados || [];
      if (!state.current.problemas.personalizados.some((item) => norm(item) === norm(value))) {
        state.current.problemas.personalizados.push(value);
      }
      state.ui.customProblemDraft = "";
      render();
    }

    function toggleProblem(key, checked) {
      state.current.problemas = state.current.problemas || {};
      const selected = new Set(state.current.problemas.seleccionados || []);
      if (checked) selected.add(key);
      else selected.delete(key);
      state.current.problemas.seleccionados = Array.from(selected);
    }

    function toggleExam(key, checked) {
      const item = ensureExamItem(state.current, key);
      item.checked = Boolean(checked);
    }

    function suggestDifferentials() {
      state.current.vitalInterpretation = interpretVitals(state.current);
      state.current.diferenciales = state.current.diferenciales || {};
      state.current.diferenciales.sugeridos = computeDifferentials(state.current);
      if (!state.current.diferenciales.sugeridos.length) notify("No hay reglas que coincidan con este caso.");
      else notify("Sugerencias diferenciales actualizadas.");
      render();
    }

    function addSuggestedDifferential(name) {
      const source = (state.current.diferenciales?.sugeridos || []).find((item) => item.nombre === name);
      if (!source) return;
      pushDifferential(source);
      render();
    }

    function removeDifferential(name) {
      state.current.diferenciales = state.current.diferenciales || {};
      state.current.diferenciales.seleccionados = (state.current.diferenciales.seleccionados || []).filter((item) => item.nombre !== name);
      render();
    }

    function addManualDifferential() {
      const draft = state.current.diferenciales?.manualDraft || {};
      const nombre = cleanText(draft.nombre);
      if (!nombre) {
        notify("Escribe el nombre del diferencial manual.");
        return;
      }
      const item = {
        nombre,
        sistema: cleanText(draft.sistema) || "General",
        prioridad: cleanText(draft.prioridad) || "Media",
        razon: cleanText(draft.razon) || "Diferencial agregado manualmente."
      };
      pushDifferential(item);
      state.current.diferenciales.manualDraft = { nombre: "", sistema: "", prioridad: "Media", razon: "" };
      render();
      notify("Diferencial manual agregado.");
    }

    function pushDifferential(item) {
      state.current.diferenciales = state.current.diferenciales || {};
      const selected = state.current.diferenciales.seleccionados || [];
      if (selected.some((entry) => norm(entry.nombre) === norm(item.nombre))) return;
      selected.push({
        nombre: item.nombre,
        sistema: item.sistema || "General",
        prioridad: item.prioridad || "Media",
        razon: item.razon || ""
      });
      state.current.diferenciales.seleccionados = selected;
    }

    function suggestExams() {
      const keys = activeProblemKeys(state.current);
      const selected = new Set();
      (D.examSuggestionRules || []).forEach((rule) => {
        const allMatch = (rule.all || []).every((req) => keys.has(req));
        const anyMatch = !(rule.any || []).length || (rule.any || []).some((req) => keys.has(req));
        if (allMatch && anyMatch) (rule.exams || []).forEach((key) => selected.add(key));
      });

      state.current.examenes = state.current.examenes || {};
      state.current.examenes.sugeridos = Array.from(selected);
      Array.from(selected).forEach((key) => {
        const entry = ensureExamItem(state.current, key);
        entry.checked = true;
        if (!entry.justificacion) entry.justificacion = "Sugerido automaticamente segun el caso.";
      });
      render();
      notify(selected.size ? "Sugerencia de examenes actualizada." : "No se activaron reglas de sugerencia.");
    }

    function draftInterpretation() {
      const species = labelFromSpecies(state.current.paciente?.especie || "");
      const system = state.current.paciente?.sistema || "sistema no especificado";
      const problems = selectedProblemLabels(state.current);
      const dx = (state.current.diferenciales?.seleccionados || []).map((item) => item.nombre);
      const exams = selectedExamLines(state.current).map((item) => item.label);

      const text = [
        `Paciente ${species.toLowerCase()} con cuadro ${system.toLowerCase()} caracterizado por ${problems.join(", ") || "hallazgos incompletos"}.`,
        `Los hallazgos sugieren un proceso clinico que requiere correlacion sindromica y confirmacion diagnostica.`,
        dx.length ? `Se consideran diferenciales principales: ${dx.join(", ")}.` : "Aun no se registran diferenciales principales.",
        exams.length ? `Se recomienda realizar: ${exams.join(", ")}.` : "Aun no se registran examenes complementarios prioritarios."
      ].join(" ");

      state.current.interpretacion = state.current.interpretacion || {};
      state.current.interpretacion.texto = text;
      if (!state.current.interpretacion.dxPresuntivo && dx.length) state.current.interpretacion.dxPresuntivo = dx[0];
      render();
      notify("Interpretacion generada.");
    }

    function generateSoap() {
      const c = state.current;
      const problems = selectedProblemLabels(c).join(", ") || "Sin problemas definidos";
      const diffs = (c.diferenciales?.seleccionados || []).map((item) => item.nombre).join(", ") || "Sin diferenciales definidos";
      const exams = selectedExamLines(c).map((item) => item.label).join(", ") || "Sin examenes definidos";

      const s = `Motivo de consulta: ${cleanText(c.paciente?.motivo) || "Dato pendiente"}. Anamnesis resumida: ${cleanText(c.anamnesis?.inicio) || "Dato pendiente"}; ${cleanText(c.anamnesis?.evolucion) || "Dato pendiente"}.`;
      const o = `Signos vitales: T=${cleanText(c.examen?.temperatura) || "?"} C, FC=${cleanText(c.examen?.fc) || "?"} lpm, FR=${cleanText(c.examen?.fr) || "?"} rpm. Hallazgos: mucosas ${cleanText(c.examen?.mucosas) || "no evaluadas"}, hidratacion ${cleanText(c.examen?.hidratacion) || "no evaluada"}.`;
      const a = `Problemas clinicos: ${problems}. Diferenciales: ${diffs}. Interpretacion: ${cleanText(c.interpretacion?.texto) || "Dato pendiente"}.`;
      const p = `Examenes complementarios: ${exams}. Plan terapeutico inicial: ${cleanText(c.terapia?.manejoInicial) || "Dato pendiente"}. Seguimiento: ${cleanText(c.terapia?.seguimiento) || "Dato pendiente"}.`;
      const full = `S - Subjetivo:\n${s}\n\nO - Objetivo:\n${o}\n\nA - Analisis:\n${a}\n\nP - Plan:\n${p}`;

      c.soap = c.soap || {};
      c.soap.s = s;
      c.soap.o = o;
      c.soap.a = a;
      c.soap.p = p;
      c.soap.texto = full;
      render();
      notify("SOAP generado.");
    }

    function resolvePracticeCase(practiceId, asCopy) {
      const found = (D.practiceCases || []).find((item) => item.id === practiceId);
      if (!found) return;

      const next = createEmptyCase();
      next.paciente.nombre = asCopy ? `${found.titulo} (Editable)` : found.titulo;
      next.paciente.especie = found.especie;
      next.paciente.especieLabel = labelFromSpecies(found.especie);
      next.paciente.sistema = found.sistema;
      next.paciente.motivo = found.titulo;
      next.problemas.seleccionados = (found.problemas || []).filter((key) => hasProblem(key));
      next.problemas.personalizados = (found.problemas || []).filter((key) => !hasProblem(key)).map(labelFromProblem);
      next.diferenciales.seleccionados = (found.diferenciales || []).map((name) => ({
        nombre: name,
        sistema: found.sistema,
        prioridad: "Media",
        razon: "Diferencial de biblioteca de practica."
      }));
      (found.examenes || []).forEach((key) => {
        const row = ensureExamItem(next, key);
        row.checked = true;
      });
      next.anamnesis.observaciones = `Caso de practica: ${found.titulo}.`;
      next.interpretacion.dxPresuntivo = found.diferenciales?.[0] || "";
      next.vitalInterpretation = interpretVitals(next);
      state.current = next;
      state.page = "nuevo";
      render();
      notify("Caso de practica cargado en editor.");
    }

    function toggleGuide(practiceId) {
      state.ui.showGuideId = state.ui.showGuideId === practiceId ? "" : practiceId;
      render();
    }

    function copyTemplate(templateId) {
      const text = getTemplateText(templateId);
      copyToClipboard(text)
        .then(() => notify("Plantilla copiada al portapapeles."))
        .catch(() => notify("No se pudo copiar automaticamente; copia manualmente."));
    }

    function useTemplate(templateId) {
      const text = getTemplateText(templateId);
      state.current.soap = state.current.soap || {};
      state.current.soap.texto = text;
      state.page = "nuevo";
      render();
      notify("Plantilla aplicada al caso actual.");
    }

    function saveTemplate(templateId) {
      const editor = root.querySelector(`[data-cl-template-id="${cssEscape(templateId)}"]`);
      if (!editor) return;
      state.templateOverrides[templateId] = editor.value || "";
      persistTemplateOverrides();
      notify("Plantilla guardada.");
    }

    function registerGlobalSearch() {
      if (!window.SuiteVet?.registerSearch) return;
      window.SuiteVet.registerSearch("clinica", (q) => {
        const query = norm(q);
        const items = [];

        state.cases.forEach((caso) => {
          const blob = norm([
            caso.paciente?.nombre,
            caso.paciente?.especieLabel,
            caso.paciente?.sistema,
            caso.interpretacion?.dxPresuntivo,
            selectedProblemLabels(caso).join(" ")
          ].join(" "));
          if (!blob.includes(query)) return;
          items.push({
            title: caso.paciente?.nombre || "Caso clinico",
            subtitle: `${caso.paciente?.especieLabel || labelFromSpecies(caso.paciente?.especie) || "Sin especie"} · ${caso.interpretacion?.dxPresuntivo || "Dx pendiente"}`,
            moduleId: "clinica",
            action: () => {
              window.SuiteVet.showView("clinica");
              state.page = "guardados";
              render();
            }
          });
        });

        (D.practiceCases || []).forEach((item) => {
          const blob = norm(`${item.titulo} ${item.sistema} ${item.especie} ${(item.problemas || []).join(" ")}`);
          if (!blob.includes(query)) return;
          items.push({
            title: item.titulo,
            subtitle: `Biblioteca · ${item.sistema}`,
            moduleId: "clinica",
            action: () => {
              window.SuiteVet.showView("clinica");
              state.page = "biblioteca";
              render();
            }
          });
        });

        return items.slice(0, 40);
      });
    }

    function ensureExamItem(caso, key) {
      caso.examenes = caso.examenes || {};
      caso.examenes.items = caso.examenes.items || {};
      if (!caso.examenes.items[key]) {
        const meta = examMeta(key);
        caso.examenes.items[key] = buildExamEntry(meta.group, meta);
      }
      return caso.examenes.items[key];
    }

    function examMeta(key) {
      const groups = D.examCatalog || {};
      for (const [groupName, entries] of Object.entries(groups)) {
        const found = (entries || []).find((item) => item.key === key);
        if (found) return { key: found.key, label: found.label, group: groupName };
      }
      return { key, label: key, group: "otros" };
    }

    function buildExamEntry(groupName, exam) {
      return {
        key: exam.key,
        label: exam.label,
        categoria: groupName,
        checked: false,
        justificacion: "",
        resultado: ""
      };
    }

    function selectedExamLines(caso) {
      const map = caso.examenes?.items || {};
      return Object.values(map).filter((item) => item.checked);
    }

    function selectedProblemLabels(caso) {
      const selected = (caso.problemas?.seleccionados || []).map(labelFromProblem);
      const custom = caso.problemas?.personalizados || [];
      return selected.concat(custom).filter(Boolean);
    }

    function hasProblem(key) {
      return (D.problemCatalog || []).some((item) => item.key === key);
    }

    function isProblemSelected(caso, key) {
      return (caso.problemas?.seleccionados || []).includes(key);
    }

    function activeProblemKeys(caso) {
      const out = new Set(caso.problemas?.seleccionados || []);
      const vitals = caso.vitalInterpretation || {};
      const flags = vitals.flags || [];
      if (flags.includes("temp-high")) out.add("fiebre");
      if (flags.includes("temp-low")) out.add("hipotermia");
      if (flags.includes("fc-high")) out.add("taquicardia");
      return out;
    }

    function computeDifferentials(caso) {
      const species = cleanText(caso.paciente?.especie).toLowerCase();
      const keys = activeProblemKeys(caso);
      const flags = new Set(caso.vitalInterpretation?.flags || []);
      const results = [];

      (D.diferentialRules || []).forEach((rule) => {
        if (rule.species && rule.species !== species) return;
        const mustOk = (rule.mustProblems || []).every((p) => keys.has(p));
        if (!mustOk) return;

        let anyOrOk = true;
        if (rule.anyProblemsOrVitals) {
          const problemHit = (rule.anyProblemsOrVitals.problems || []).some((p) => keys.has(p));
          const vitalHit = (rule.anyProblemsOrVitals.vitals || []).some((f) => flags.has(f));
          anyOrOk = problemHit || vitalHit;
        }
        if (!anyOrOk) return;

        (rule.differentials || []).forEach((dx) => {
          if (results.some((entry) => norm(entry.nombre) === norm(dx.nombre))) return;
          results.push({
            nombre: dx.nombre,
            sistema: dx.sistema || caso.paciente?.sistema || "General",
            prioridad: dx.prioridad || "Media",
            razon: dx.razon || "Regla clinica activada."
          });
        });
      });

      return results;
    }

    function interpretVitals(caso) {
      const species = cleanText(caso.paciente?.especie).toLowerCase();
      const ranges = D.vitalRanges?.[species];
      const ex = caso.examen || {};
      const items = [];
      const flags = [];
      const messages = D.vitalMessages || {};

      if (!ranges) {
        return {
          items: [],
          flags: [],
          summary: "Selecciona una especie con rangos fisiologicos configurados para interpretar signos vitales.",
          updatedAt: new Date().toISOString()
        };
      }

      const temp = numeric(ex.temperatura);
      const fc = numeric(ex.fc);
      const fr = numeric(ex.fr);

      items.push(vitalRow("Temperatura", temp, ranges.temperatura, messages.temperatura, "temp", flags));
      items.push(vitalRow("FC", fc, ranges.fc, messages.fc, "fc", flags));
      items.push(vitalRow("FR", fr, ranges.fr, messages.fr, "fr", flags));

      const summary = items.map((item) => `${item.label}: ${item.statusLabel}.`).join(" ");
      return { items, flags, summary, updatedAt: new Date().toISOString() };
    }

    function vitalRow(label, value, range, dictionary, key, flags) {
      const [min, max] = range || [null, null];
      if (!Number.isFinite(value)) {
        return {
          label,
          status: "pending",
          statusLabel: "Dato pendiente",
          message: "Falta dato para interpretar.",
          value: null,
          range: [min, max]
        };
      }
      if (Number.isFinite(max) && value > max) {
        flags.push(`${key}-high`);
        return { label, status: "high", statusLabel: "Elevado", message: dictionary?.high || "Valor elevado.", value, range: [min, max] };
      }
      if (Number.isFinite(min) && value < min) {
        flags.push(`${key}-low`);
        return { label, status: "low", statusLabel: "Disminuido", message: dictionary?.low || "Valor disminuido.", value, range: [min, max] };
      }
      flags.push(`${key}-normal`);
      return { label, status: "normal", statusLabel: "Normal", message: dictionary?.normal || "Valor normal.", value, range: [min, max] };
    }

    function filterSavedCases(cases, filters) {
      return (cases || []).filter((caso) => {
        const patient = caso.paciente || {};
        const problems = selectedProblemLabels(caso).join(" ");
        const blob = norm(`${patient.nombre} ${patient.especieLabel || labelFromSpecies(patient.especie)} ${patient.sistema} ${caso.interpretacion?.dxPresuntivo} ${caso.interpretacion?.dxDefinitivo} ${problems}`);
        const queryOk = !filters.query || blob.includes(norm(filters.query));
        const speciesOk = !filters.especie || patient.especie === filters.especie;
        const systemOk = !filters.sistema || patient.sistema === filters.sistema;
        const dateOk = !filters.fecha || String(caso.updatedAt || caso.createdAt || "").startsWith(filters.fecha);
        const dxOk = !filters.dx || norm(`${caso.interpretacion?.dxPresuntivo || ""} ${caso.interpretacion?.dxDefinitivo || ""}`).includes(norm(filters.dx));
        return queryOk && speciesOk && systemOk && dateOk && dxOk;
      });
    }

    function importantDataWarnings(caso) {
      const warnings = [];
      if (!cleanText(caso.paciente?.nombre)) warnings.push("paciente");
      if (!cleanText(caso.paciente?.especie)) warnings.push("especie");
      if (!cleanText(caso.paciente?.motivo)) warnings.push("motivo de consulta");
      if (!(caso.problemas?.seleccionados || []).length && !(caso.problemas?.personalizados || []).length) warnings.push("problemas clinicos");
      if (!cleanText(caso.interpretacion?.dxPresuntivo)) warnings.push("diagnostico presuntivo");
      return warnings;
    }

    function prepareCaseForSave(caso) {
      const copy = deepClone(caso);
      copy.id = cleanText(copy.id) || generateCaseId();
      copy.createdAt = copy.createdAt || new Date().toISOString();
      copy.updatedAt = new Date().toISOString();
      copy.paciente = copy.paciente || {};
      copy.paciente.especieLabel = labelFromSpecies(copy.paciente.especie || "");
      copy.vitalInterpretation = interpretVitals(copy);
      copy.problemas = copy.problemas || {};
      copy.problemas.seleccionadosEtiquetas = selectedProblemLabels(copy);
      copy.diferenciales = copy.diferenciales || {};
      copy.examenes = copy.examenes || { items: {} };
      copy.interpretacion = copy.interpretacion || {};
      copy.terapia = copy.terapia || {};
      copy.soap = copy.soap || {};
      if (!copy.soap.texto) {
        copy.soap.texto = [copy.soap.s, copy.soap.o, copy.soap.a, copy.soap.p].filter(Boolean).join("\n\n");
      }
      return copy;
    }

    function saveCases(cases) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cases || []));
        return true;
      } catch (error) {
        console.warn("[Clinica] No se pudo guardar casos:", error);
        return false;
      }
    }

    function loadCases() {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (!Array.isArray(parsed)) return [];
        return parsed.map((entry) => sanitizeCase(entry)).filter(Boolean);
      } catch {
        return [];
      }
    }

    function sanitizeCase(entry) {
      const result = sanitizeCaseResult(entry);
      return result.ok ? result.value : null;
    }

    function sanitizeCaseResult(entry) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return { ok: false, value: null, errors: ["La raiz del caso debe ser un objeto."], ignoredPaths: [] };
      }
      return Safety.safeMergeAllowed(createEmptyCase(), entry);
    }

    function createEmptyCase() {
      return {
        id: generateCaseId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paciente: {
          nombre: "",
          especie: "",
          especieLabel: "",
          raza: "",
          edad: "",
          sexo: "",
          pesoKg: "",
          propietario: "",
          sistema: "",
          motivo: ""
        },
        anamnesis: {
          inicio: "",
          evolucion: "",
          alimentacion: "",
          vacunacion: "",
          desparasitacion: "",
          tratamientosPrevios: "",
          ambiente: "",
          contacto: "",
          observaciones: ""
        },
        examen: {
          temperatura: "",
          fc: "",
          fr: "",
          pesoKg: "",
          deshidratacionPct: "",
          mucosas: "",
          tlc: "",
          condicionCorporal: "",
          estadoMental: "",
          dolor: "",
          linfonodos: "",
          hidratacion: ""
        },
        vitalInterpretation: {
          items: [],
          flags: [],
          summary: "",
          updatedAt: ""
        },
        problemas: {
          seleccionados: [],
          personalizados: [],
          seleccionadosEtiquetas: []
        },
        diferenciales: {
          sugeridos: [],
          seleccionados: [],
          manualDraft: {
            nombre: "",
            sistema: "",
            prioridad: "Media",
            razon: ""
          }
        },
        examenes: {
          items: buildExamItemsMap(),
          sugeridos: []
        },
        interpretacion: {
          texto: "",
          dxPresuntivo: "",
          dxDefinitivo: "",
          pronostico: "Reservado"
        },
        terapia: {
          manejoInicial: "",
          fluidoterapia: "",
          antimicrobianos: "",
          antiinflamatorios: "",
          antiparasitarios: "",
          soporteNutricional: "",
          aislamiento: "",
          recomendaciones: "",
          seguimiento: ""
        },
        soap: {
          s: "",
          o: "",
          a: "",
          p: "",
          texto: ""
        },
        firmaResponsable: ""
      };
    }

    function buildExamItemsMap() {
      const map = {};
      Object.entries(D.examCatalog || {}).forEach(([groupName, list]) => {
        (list || []).forEach((item) => {
          map[item.key] = buildExamEntry(groupName, item);
        });
      });
      return map;
    }

    function labelFromSpecies(id) {
      const found = (D.species || []).find((item) => item.id === id);
      return found ? found.label : (id || "Especie");
    }

    function labelFromProblem(key) {
      const found = (D.problemCatalog || []).find((item) => item.key === key);
      return found ? found.label : key;
    }

    function labelFromExam(key) {
      const meta = examMeta(key);
      return meta.label || key;
    }

    function notify(message) {
      if (Fav?.showToast) Fav.showToast(message);
      else console.log(`[Clinica] ${message}`);
    }

    function getTemplateText(templateId) {
      const base = (D.soapTemplates || []).find((item) => item.id === templateId);
      return state.templateOverrides[templateId] || base?.cuerpo || "";
    }

    function loadTemplateOverrides() {
      try {
        const parsed = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY) || "{}");
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    }

    function persistTemplateOverrides() {
      try {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(state.templateOverrides || {}));
      } catch (error) {
        console.warn("[Clinica] No se pudo guardar plantillas:", error);
      }
    }

    function bindDataList() {
      if (root.querySelector("#clinica-problems-datalist")) return;
      const list = document.createElement("datalist");
      list.id = "clinica-problems-datalist";
      list.innerHTML = (D.problemCatalog || []).map((item) => `<option value="${escapeAttr(item.label)}"></option>`).join("");
      root.appendChild(list);
    }

    function conectarConFarmacologia(caso) {
      const payload = {
        especie: caso.paciente?.especie || "",
        pesoKg: caso.paciente?.pesoKg || caso.examen?.pesoKg || "",
        problemaClinico: selectedProblemLabels(caso).join(", "),
        diagnosticoPresuntivo: caso.interpretacion?.dxPresuntivo || ""
      };
      console.log("[Clinica Integrada] Integracion Farmacologia preparada:", payload);
      notify("Integracion con Farmacologia preparada para futura conexion.");
    }

    function conectarConMicrobiologia(caso) {
      console.log("[Clinica Integrada] Integracion Microbiologia preparada:", caso);
      notify("Integracion con Microbiologia preparada para futura conexion.");
    }

    function conectarConPatologiaClinica(caso) {
      console.log("[Clinica Integrada] Integracion Patologia Clinica preparada:", caso);
      notify("Integracion con Patologia Clinica preparada para futura conexion.");
    }

    function conectarConImagenologia(caso) {
      console.log("[Clinica Integrada] Integracion Imagenologia preparada:", caso);
      notify("Integracion con Imagenologia preparada para futura conexion.");
    }

    function exportarCasoAJson(caso) {
      return JSON.stringify(caso || state.current, null, 2);
    }

    function importarCasoDesdeJson(json) {
      try {
        const parsed = JSON.parse(json);
        const result = sanitizeCaseResult(parsed);
        if (!result.ok) {
          notify(`No se pudo importar el JSON: ${result.errors[0] || "estructura invalida"}`);
          return false;
        }
        state.current = result.value;
        state.page = "nuevo";
        render();
        if (result.ignoredPaths.length) {
          notify("Caso importado. Se ignoraron campos que no pertenecen al esquema clinico permitido.");
        }
        return true;
      } catch {
        notify("No se pudo importar el JSON: el documento no contiene JSON valido.");
        return false;
      }
    }

    window.SuiteVetClinicaIntegrada = {
      conectarConFarmacologia,
      conectarConMicrobiologia,
      conectarConPatologiaClinica,
      conectarConImagenologia,
      exportarCasoAJson,
      importarCasoDesdeJson
    };

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

    function textField(label, path, value, placeholder) {
      return `
        <label class="clinica-field">
          <span>${escapeHtml(label)}</span>
          <input class="sv-input" type="text" data-cl-field="${escapeAttr(path)}" value="${escapeAttr(value)}" placeholder="${escapeAttr(placeholder || "")}" />
        </label>
      `;
    }

    function numberField(label, path, value, step) {
      return `
        <label class="clinica-field">
          <span>${escapeHtml(label)}</span>
          <input class="sv-input" type="number" data-cl-field="${escapeAttr(path)}" value="${escapeAttr(value)}" step="${escapeAttr(step || "1")}" />
        </label>
      `;
    }

    function selectField(label, path, options, selected, placeholder) {
      return `
        <label class="clinica-field">
          <span>${escapeHtml(label)}</span>
          <select class="sv-select" data-cl-field="${escapeAttr(path)}">
            <option value="">${escapeHtml(placeholder || "Selecciona")}</option>
            ${(options || []).map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const text = typeof option === "string" ? option : option.label;
              return `<option value="${escapeAttr(value)}" ${String(selected) === String(value) ? "selected" : ""}>${escapeHtml(text)}</option>`;
            }).join("")}
          </select>
        </label>
      `;
    }

    function speciesField(selected) {
      return `
        <label class="clinica-field">
          <span>Especie</span>
          <select class="sv-select" data-cl-field="paciente.especie">
            <option value="">Selecciona</option>
            ${(D.species || []).map((item) => `<option value="${escapeAttr(item.id)}" ${selected === item.id ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
      `;
    }

    function textareaField(label, path, value, placeholder) {
      return `
        <label class="clinica-field clinica-field-text">
          <span>${escapeHtml(label)}</span>
          <textarea class="sv-input clinica-textarea" data-cl-field="${escapeAttr(path)}" placeholder="${escapeAttr(placeholder || "")}">${escapeHtml(value || "")}</textarea>
        </label>
      `;
    }

    function systemBadge(system) {
      const key = norm(system);
      if (key.includes("digestivo")) return "sv-badge-orange";
      if (key.includes("respiratorio")) return "sv-badge-cyan";
      if (key.includes("reproductor")) return "clinica-badge-soft-rose";
      if (key.includes("urinario")) return "sv-badge-blue";
      if (key.includes("nervioso")) return "sv-badge-purple";
      if (key.includes("musculo")) return "clinica-badge-soft-amber";
      if (key.includes("tegumentario")) return "sv-badge-green";
      if (key.includes("cardiovascular")) return "sv-badge-red";
      if (key.includes("multisistemico")) return "sv-badge-gray";
      if (key.includes("hepato")) return "sv-badge-yellow";
      return "sv-badge-blue";
    }

    function badgeClassByStatus(status) {
      if (status === "high") return "sv-badge-red";
      if (status === "low") return "sv-badge-yellow";
      if (status === "normal") return "sv-badge-green";
      return "sv-badge-gray";
    }

    function priorityBadge(priority) {
      const key = norm(priority);
      if (key === "alta") return "sv-badge-red";
      if (key === "baja") return "sv-badge-green";
      return "sv-badge-yellow";
    }

    function shortDate(value) {
      const d = new Date(value || Date.now());
      if (Number.isNaN(d.getTime())) return "";
      return new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
    }

    function norm(value) {
      return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function numeric(value) {
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }

    function cleanText(value) {
      return String(value || "").trim();
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

    function escapePath(value) {
      return String(value || "").replace(/\./g, "\\.");
    }

    function cssEscape(value) {
      return String(value || "").replace(/"/g, '\\"');
    }

    function capitalize(value) {
      const str = String(value || "");
      return str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : str;
    }

    function setPath(obj, path, value) {
      if (!obj || !path) return;
      const parts = String(path).split(".");
      let current = obj;
      for (let i = 0; i < parts.length - 1; i += 1) {
        const part = parts[i];
        if (!current[part] || typeof current[part] !== "object") current[part] = {};
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
    }

    function deepClone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function generateCaseId() {
      const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
      const rand = Math.floor(Math.random() * 900 + 100);
      return `CL-${stamp}-${rand}`;
    }
  });
})();
