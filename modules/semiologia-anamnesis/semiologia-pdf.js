(function () {
  "use strict";

  const PRINT_CLASS = "semi-printing";
  const PRINT_AREA_ID = "semiologia-print-area";

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function nl(value) {
    return esc(value || "").replace(/\n/g, "<br>");
  }

  function dateLabel(value) {
    const d = new Date(value || Date.now());
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  }

  function ensurePrintArea() {
    let area = document.getElementById(PRINT_AREA_ID);
    if (area) return area;
    area = document.createElement("div");
    area.id = PRINT_AREA_ID;
    area.className = "semi-print-area";
    area.setAttribute("aria-hidden", "true");
    document.body.appendChild(area);
    return area;
  }

  function cleanupPrint() {
    const area = document.getElementById(PRINT_AREA_ID);
    document.body.classList.remove(PRINT_CLASS);
    if (!area) return;
    area.classList.remove("is-open");
    area.setAttribute("aria-hidden", "true");
    area.innerHTML = "";
  }

  function listBlock(items) {
    const list = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!list.length) return `<p class="semi-print-empty">Dato pendiente.</p>`;
    return `<ul class="semi-print-list">${list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }

  function section(title, content) {
    return `
      <section class="semi-print-section">
        <h3>${esc(title)}</h3>
        ${content}
      </section>
    `;
  }

  function kv(label, value) {
    return `
      <div class="semi-print-kv-item">
        <span class="k">${esc(label)}</span>
        <span class="v">${nl(value || "Dato pendiente")}</span>
      </div>
    `;
  }

  function header(title, subtitle, date) {
    return `
      <header class="semi-print-header">
        <div>
          <h1>SUITE VET - Semiologia &amp; Anamnesis Pro</h1>
          <p>${esc(subtitle || "Documento clinico academico")}</p>
        </div>
        <div class="semi-print-meta">
          <span>Fecha</span>
          <strong>${esc(dateLabel(date))}</strong>
          <strong>${esc(title)}</strong>
        </div>
      </header>
    `;
  }

  function footer() {
    return `
      <footer class="semi-print-footer">
        Documento generado por SUITE VET como apoyo academico y clinico. No reemplaza el criterio del medico veterinario.
      </footer>
    `;
  }

  function buildAnamnesis(data) {
    const d = data || {};
    const patient = d.patient || {};
    return `
      <article class="semi-print-sheet">
        ${header("Anamnesis", "Resumen de entrevista clinica veterinaria", d.updatedAt)}
        ${section("Datos del paciente", `
          <div class="semi-print-kv-grid cols-3">
            ${kv("Paciente/ID", patient.name)}
            ${kv("Especie", patient.speciesLabel || patient.species)}
            ${kv("Edad", patient.age)}
            ${kv("Sexo", patient.sex)}
            ${kv("Raza", patient.breed)}
            ${kv("Peso", patient.weight)}
            ${kv("Responsable", patient.owner)}
            ${kv("Tipo de consulta", d.consultType)}
            ${kv("Sistema sospechado", d.systemLabel || d.system)}
          </div>
        `)}
        ${section("Motivo de consulta", `<p class="semi-print-note">${nl(d.reason || "Dato pendiente")}</p>`)}
        ${section("Historia y antecedentes", `
          <div class="semi-print-kv-grid cols-2">
            ${kv("Resumen anamnesis", d.summary || "")}
            ${kv("Ambiente y manejo", d.environmentSummary || "")}
          </div>
        `)}
        ${section("Preguntas realizadas", listBlock((d.questions || []).map((q) => `${q.label}: ${q.answer || "sin respuesta"}`)))}
        ${section("Red flags detectadas", listBlock((d.redFlags || []).map((flag) => `${flag.title}: ${flag.recommendation}`)))}
        ${section("Observaciones", `<p class="semi-print-note">${nl(d.notes || "Sin observaciones adicionales.")}</p>`)}
        ${footer()}
      </article>
    `;
  }

  function buildExam(data) {
    const d = data || {};
    return `
      <article class="semi-print-sheet">
        ${header("Examen Fisico", "Registro de exploracion clinica por pasos", d.updatedAt)}
        ${section("Datos generales", `
          <div class="semi-print-kv-grid cols-3">
            ${kv("Paciente/ID", d.patientName)}
            ${kv("Especie", d.speciesLabel)}
            ${kv("Modo de examen", d.examModeLabel)}
            ${kv("Temperatura", d.vitals?.temperatura)}
            ${kv("Frecuencia cardiaca", d.vitals?.fc)}
            ${kv("Frecuencia respiratoria", d.vitals?.fr)}
            ${kv("TLLC", d.vitals?.tllc)}
            ${kv("Interpretacion general", d.interpretation)}
            ${kv("Problemas clinicos", (d.problems || []).join(", "))}
          </div>
        `)}
        ${section("Hallazgos por pasos", listBlock((d.steps || []).map((step) => `${step.name}: ${step.finding || "sin hallazgo registrado"}`)))}
        ${section("Recomendaciones", `<p class="semi-print-note">${nl(d.recommendations || "Continuar evaluacion clinica segun criterio profesional.")}</p>`)}
        ${footer()}
      </article>
    `;
  }

  function buildOsce(data) {
    const d = data || {};
    return `
      <article class="semi-print-sheet">
        ${header("Rubrica OSCE", "Resultado de estacion clinica", d.updatedAt)}
        ${section("Datos de estacion", `
          <div class="semi-print-kv-grid cols-3">
            ${kv("Estacion", d.stationTitle)}
            ${kv("Tiempo sugerido (min)", d.timeMin)}
            ${kv("Tiempo real", d.timeLabel)}
            ${kv("Puntaje total", d.scoreTotal)}
            ${kv("Porcentaje", d.percentLabel)}
            ${kv("Resultado", d.resultLabel)}
          </div>
        `)}
        ${section("Rubrica", listBlock((d.items || []).map((item) => `${item.label}: ${item.statusLabel}`)))}
        ${section("Feedback", listBlock(d.feedback || []))}
        ${section("Comentarios", `<p class="semi-print-note">${nl(d.comments || "Sin comentarios adicionales.")}</p>`)}
        ${footer()}
      </article>
    `;
  }

  function buildProgress(data) {
    const d = data || {};
    return `
      <article class="semi-print-sheet">
        ${header("Progreso Clinico", "Logbook de habilidades semiologicas", d.updatedAt)}
        ${section("Resumen", `
          <div class="semi-print-kv-grid cols-3">
            ${kv("Total de habilidades", d.summary?.total)}
            ${kv("Observadas", d.summary?.observado)}
            ${kv("Practicadas", d.summary?.practicado)}
            ${kv("Con supervision", d.summary?.supervision)}
            ${kv("Realizadas solo", d.summary?.solo)}
            ${kv("Porcentaje de avance", d.summary?.progressLabel)}
          </div>
        `)}
        ${section("Ultimos registros", listBlock((d.entries || []).map((entry) => `${dateLabel(entry.date)} - ${entry.skill} (${entry.state}) - Autoevaluacion ${entry.selfScore}/5`)))}
        ${footer()}
      </article>
    `;
  }

  function buildDocument(type, data) {
    if (type === "anamnesis") return buildAnamnesis(data);
    if (type === "examen") return buildExam(data);
    if (type === "osce") return buildOsce(data);
    if (type === "progreso") return buildProgress(data);
    return `
      <article class="semi-print-sheet">
        ${header("Documento", "Salida generada por Semiologia & Anamnesis Pro", Date.now())}
        ${section("Contenido", `<p class="semi-print-note">${nl(JSON.stringify(data || {}, null, 2))}</p>`)}
        ${footer()}
      </article>
    `;
  }

  function printDocument(type, data) {
    const area = ensurePrintArea();
    area.innerHTML = buildDocument(type, data);
    area.classList.add("is-open");
    area.setAttribute("aria-hidden", "false");
    document.body.classList.add(PRINT_CLASS);

    const onAfterPrint = () => {
      cleanupPrint();
      window.removeEventListener("afterprint", onAfterPrint);
    };
    window.addEventListener("afterprint", onAfterPrint, { once: true });
    window.setTimeout(() => window.print(), 70);
    window.setTimeout(cleanupPrint, 90000);
  }

  window.SuiteVet = window.SuiteVet || {};
  window.SuiteVet.SemiologiaPdf = {
    buildDocument,
    printDocument
  };
})();
