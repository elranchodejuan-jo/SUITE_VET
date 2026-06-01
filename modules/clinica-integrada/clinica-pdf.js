(function () {
  "use strict";

  const PRINT_CLASS = "clinica-printing";
  const PRINT_AREA_ID = "clinica-print-area";
  let cleanupTimer = null;

  function ensurePrintArea() {
    let area = document.getElementById(PRINT_AREA_ID);
    if (area) return area;
    area = document.createElement("div");
    area.id = PRINT_AREA_ID;
    area.className = "clinica-print-area";
    area.setAttribute("aria-hidden", "true");
    document.body.appendChild(area);
    return area;
  }

  function cleanupPrintView() {
    const area = document.getElementById(PRINT_AREA_ID);
    if (!area) return;
    document.body.classList.remove(PRINT_CLASS);
    area.classList.remove("is-open");
    area.setAttribute("aria-hidden", "true");
    area.innerHTML = "";
    if (cleanupTimer) {
      window.clearTimeout(cleanupTimer);
      cleanupTimer = null;
    }
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

  function lineBreaks(value) {
    return esc(value || "").replace(/\n/g, "<br>");
  }

  function listHtml(items, className = "clinica-print-list-compact") {
    const list = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!list.length) return "<p class=\"clinica-print-empty\">Dato pendiente.</p>";
    return `<ul class="${esc(className)}">${list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }

  function section(title, body) {
    return `
      <section class="clinica-print-block">
        <h3>${esc(title)}</h3>
        ${body}
      </section>
    `;
  }

  function textOrPending(value, fallback = "Dato pendiente") {
    const text = String(value ?? "").trim();
    return text || fallback;
  }

  function kvItem(label, value, options = {}) {
    const classes = ["clinica-print-kv-item"];
    if (options.full) classes.push("is-full");
    const output = options.html ? lineBreaks(textOrPending(value)) : esc(textOrPending(value));
    return `
      <div class="${classes.join(" ")}">
        <span class="k">${esc(label)}</span>
        <span class="v">${output}</span>
      </div>
    `;
  }

  function kvGrid(items, cols = 2) {
    return `<div class="clinica-print-kv-grid cols-${cols}">${items.join("")}</div>`;
  }

  function dxTableHtml(rows) {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) return "<p class=\"clinica-print-empty\">Sin diagnosticos diferenciales cargados.</p>";
    return `
      <div class="clinica-print-table-wrap">
        <table class="clinica-print-table">
          <thead>
            <tr>
              <th>Diagnostico diferencial</th>
              <th>Prioridad</th>
              <th>Sistema</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((row) => `
              <tr>
                <td>${esc(textOrPending(row.nombre, "Pendiente"))}</td>
                <td>${esc(textOrPending(row.prioridad, "Media"))}</td>
                <td>${esc(textOrPending(row.sistema, "General"))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function examsTableHtml(rows) {
    const list = Array.isArray(rows) ? rows.filter((row) => row && row.checked) : [];
    if (!list.length) return "<p class=\"clinica-print-empty\">Sin examenes complementarios seleccionados.</p>";
    return `
      <div class="clinica-print-table-wrap">
        <table class="clinica-print-table">
          <thead>
            <tr>
              <th>Examen</th>
              <th>Justificacion</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((row) => `
              <tr>
                <td>${esc(textOrPending(row.label || row.key, "Examen"))}</td>
                <td>${lineBreaks(textOrPending(row.justificacion, "Pendiente"))}</td>
                <td>${lineBreaks(textOrPending(row.resultado, "Pendiente"))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function buildCaseHtml(caso) {
    const c = caso || {};
    const p = c.paciente || {};
    const a = c.anamnesis || {};
    const ex = c.examen || {};
    const v = c.vitalInterpretation || {};
    const i = c.interpretacion || {};
    const t = c.terapia || {};
    const soap = c.soap || {};
    const dxSel = (c.diferenciales?.seleccionados || [])
      .map((item) => (typeof item === "string" ? { nombre: item, prioridad: "Media", sistema: "General" } : item))
      .filter(Boolean);
    const exSel = (c.examenes?.items || {});
    const examRows = Object.values(exSel);
    const problems = (c.problemas?.seleccionadosEtiquetas || c.problemas?.seleccionados || []).concat(c.problemas?.personalizados || []);
    const soapText = soap.texto || [
      soap.s ? `S - Subjetivo:\n${soap.s}` : "",
      soap.o ? `O - Objetivo:\n${soap.o}` : "",
      soap.a ? `A - Analisis:\n${soap.a}` : "",
      soap.p ? `P - Plan:\n${soap.p}` : ""
    ].filter(Boolean).join("\n\n");

    const vitalLines = (v.items || []).map((item) =>
      `${textOrPending(item.label, "Parametro")}: ${textOrPending(item.statusLabel, "Dato pendiente")}. ${textOrPending(item.message, "Sin interpretacion.")}`
    );

    return `
      <article class="clinica-print-sheet">
        <header class="clinica-print-header">
          <div class="clinica-print-brand">
            <h1>SUITE VET - Clinica Integrada</h1>
            <p>Simulador de razonamiento clinico veterinario</p>
          </div>
          <div class="clinica-print-meta-grid">
            <div class="clinica-print-meta-card">
              <span>ID de caso</span>
              <strong>${esc(textOrPending(c.id))}</strong>
            </div>
            <div class="clinica-print-meta-card">
              <span>Fecha</span>
              <strong>${esc(textOrPending(dateLabel(c.updatedAt || c.createdAt)))}</strong>
            </div>
          </div>
        </header>

        ${section(
          "Identificacion del caso",
          `
            ${kvGrid([
              kvItem("Paciente / ID", p.nombre),
              kvItem("Especie", p.especieLabel || p.especie),
              kvItem("Raza", p.raza),
              kvItem("Edad", p.edad),
              kvItem("Sexo", p.sexo),
              kvItem("Peso (kg)", p.pesoKg),
              kvItem("Responsable", p.propietario),
              kvItem("Sistema afectado", p.sistema),
              kvItem("Diagnostico presuntivo", i.dxPresuntivo),
              kvItem("Diagnostico definitivo", i.dxDefinitivo),
              kvItem("Pronostico", i.pronostico),
              kvItem("Firma responsable", c.firmaResponsable, { full: false })
            ], 3)}
            <div class="clinica-print-note-line">
              <strong>Motivo de consulta:</strong> ${lineBreaks(textOrPending(p.motivo))}
            </div>
          `
        )}

        ${section(
          "Anamnesis",
          `
            ${kvGrid([
              kvItem("Inicio del problema", a.inicio, { html: true }),
              kvItem("Evolucion", a.evolucion, { html: true }),
              kvItem("Alimentacion", a.alimentacion, { html: true }),
              kvItem("Vacunacion", a.vacunacion, { html: true }),
              kvItem("Desparasitacion", a.desparasitacion, { html: true }),
              kvItem("Tratamientos previos", a.tratamientosPrevios, { html: true }),
              kvItem("Ambiente / manejo", a.ambiente, { html: true }),
              kvItem("Contacto con otros animales", a.contacto, { html: true }),
              kvItem("Observaciones adicionales", a.observaciones, { html: true, full: true })
            ], 2)}
          `
        )}

        ${section(
          "Examen fisico",
          `
            ${kvGrid([
              kvItem("Temperatura (C)", ex.temperatura),
              kvItem("FC (lpm)", ex.fc),
              kvItem("FR (rpm)", ex.fr),
              kvItem("Peso (kg)", ex.pesoKg || p.pesoKg),
              kvItem("Deshidratacion estimada (%)", ex.deshidratacionPct),
              kvItem("Mucosas", ex.mucosas),
              kvItem("TLC", ex.tlc),
              kvItem("Condicion corporal", ex.condicionCorporal),
              kvItem("Estado mental", ex.estadoMental),
              kvItem("Dolor", ex.dolor),
              kvItem("Linfonodos", ex.linfonodos),
              kvItem("Hidratacion", ex.hidratacion)
            ], 3)}
          `
        )}

        ${section(
          "Interpretacion de signos vitales",
          listHtml(vitalLines)
        )}

        ${section("Problemas clinicos", listHtml(problems))}
        ${section("Diagnosticos diferenciales", dxTableHtml(dxSel))}
        ${section("Examenes complementarios", examsTableHtml(examRows))}

        ${section(
          "Interpretacion clinica",
          `
            <div class="clinica-print-note-box">
              ${lineBreaks(textOrPending(i.texto))}
            </div>
          `
        )}

        ${section(
          "Plan terapeutico",
          `
            ${kvGrid([
              kvItem("Manejo inicial", t.manejoInicial, { html: true }),
              kvItem("Fluidoterapia", t.fluidoterapia, { html: true }),
              kvItem("Antimicrobianos", t.antimicrobianos, { html: true }),
              kvItem("Antiinflamatorios / analgesia", t.antiinflamatorios, { html: true }),
              kvItem("Antiparasitarios", t.antiparasitarios, { html: true }),
              kvItem("Soporte nutricional", t.soporteNutricional, { html: true }),
              kvItem("Aislamiento / bioseguridad", t.aislamiento, { html: true }),
              kvItem("Recomendaciones al propietario", t.recomendaciones, { html: true }),
              kvItem("Seguimiento", t.seguimiento, { html: true, full: true })
            ], 2)}
          `
        )}

        ${section(
          "Formato SOAP",
          `
            <div class="clinica-print-soap-grid">
              ${kvItem("S - Subjetivo", soap.s, { html: true })}
              ${kvItem("O - Objetivo", soap.o, { html: true })}
              ${kvItem("A - Analisis", soap.a, { html: true })}
              ${kvItem("P - Plan", soap.p, { html: true })}
            </div>
            <p class="clinica-print-soap">${lineBreaks(textOrPending(soapText))}</p>
          `
        )}

        <footer class="clinica-print-footer">
          <p><strong>Firma o responsable:</strong> ${esc(textOrPending(c.firmaResponsable, "________________________"))}</p>
          <p class="clinica-print-note">
            Documento generado como apoyo academico/clinico. La decision medica final depende del criterio del profesional veterinario.
          </p>
        </footer>
      </article>
    `;
  }

  function printCase(caso) {
    const area = ensurePrintArea();
    area.innerHTML = buildCaseHtml(caso);
    document.body.classList.add(PRINT_CLASS);
    area.classList.add("is-open");
    area.setAttribute("aria-hidden", "false");

    const onAfterPrint = () => {
      window.removeEventListener("afterprint", onAfterPrint);
      cleanupPrintView();
    };

    window.addEventListener("afterprint", onAfterPrint, { once: true });
    cleanupTimer = window.setTimeout(cleanupPrintView, 90000);
    window.setTimeout(() => window.print(), 80);
  }

  window.SuiteVet = window.SuiteVet || {};
  window.SuiteVet.ClinicaPdf = {
    buildCaseHtml,
    printCase
  };
})();
