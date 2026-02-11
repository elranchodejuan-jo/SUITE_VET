// antibio.js
// -----------------------------------------------------------------------------
// Módulo de ANTIBIÓTICOS (discos para antibiograma) de SUITE VET
// Tarjetas con familia, mecanismo, espectro y enlaces hacia microorganismos / agares
// -----------------------------------------------------------------------------

// 1) BASE DE DATOS DE DISCOS ANTIBIÓTICOS
// Campos clave:
//
// id               → id interno (para links entre módulos)
// nombre           → nombre del antibiótico
// siglaDisco       → código del disco (ej. ENR5, CN10, AMC30)
// familia          → nombre de la familia (cefalosporina, quinolona, etc.)
// familiaKey       → clave corta para filtros y colores
// mecanismo        → mecanismo de acción
// tipoAccion       → bactericida / bacteriostático (texto visible)
// espectro         → descripción corta del espectro
// espectroKey      → gram-positivo / gram-negativo / amplio
// usoLab           → texto corto orientado al laboratorio / antibiograma
// microorganismosEjemplo → nombres visibles (en cursiva en la tarjeta)
// microorganismosIds     → ids internos para “jugar” con el módulo de microorganismos
// agaresRecomendadosIds  → ids de agares para jugar con micro.js (Mueller Hinton, etc.)
// notasLab         → detalles finos de lectura o advertencias

const discosAntibioticos = [
  {
    id: "enrofloxacina",
    nombre: "Enrofloxacina",
    siglaDisco: "ENR5",
    familia: "Fluoroquinolona",
    familiaKey: "quinolona",
    mecanismo:
      "Inhibe la ADN-girasa y la topoisomerasa IV, bloqueando la replicación del ADN.",
    tipoAccion: "Bactericida",
    espectro:
      "Amplio espectro, con énfasis en bacilos Gram negativos y algunos Gram positivos.",
    espectroKey: "amplio",
    usoLab:
      "Disco para antibiogramas por difusión en agar frente a enterobacterias y patógenos urinarios.",
    microorganismosEjemplo: ["<em>Escherichia coli</em>", "<em>Salmonella spp.</em>"],
    microorganismosIds: ["escherichia-coli", "salmonella-spp"],
    agaresRecomendadosIds: ["mueller-hinton-agar"],
    notasLab:
      "Evaluar con guías CLSI/BRCAST. Evitar uso como monoterapia prolongada para reducir resistencia."
  },
  {
    id: "amoxicilina-clavulanato",
    nombre: "Amoxicilina / Ácido clavulánico",
    siglaDisco: "AMC30",
    familia: "Penicilina + inhibidor β-lactamasa",
    familiaKey: "betalactamico",
    mecanismo:
      "Inhibe la síntesis de pared (amoxicilina) y bloquea β-lactamasas (clavulanato).",
    tipoAccion: "Bactericida",
    espectro:
      "Principalmente Gram positivos y algunas enterobacterias productoras de β-lactamasa.",
    espectroKey: "gram-positivo",
    usoLab:
      "Disco usado para valorar producción de β-lactamasa y sensibilidad en infecciones de piel y tejidos blandos.",
    microorganismosEjemplo: [
      "<em>Staphylococcus intermedius group</em>",
      "<em>Escherichia coli</em>"
    ],
    microorganismosIds: ["staphylococcus-spp", "escherichia-coli"],
    agaresRecomendadosIds: ["mueller-hinton-agar"],
    notasLab:
      "Controlar halos en cepas productoras de β-lactamasa; interpretar según especie animal y sitio de infección."
  },
  {
    id: "gentamicina",
    nombre: "Gentamicina",
    siglaDisco: "CN10",
    familia: "Aminoglucósido",
    familiaKey: "aminoglucosido",
    mecanismo:
      "Se une de forma irreversible al ribosoma 30S, provocando lectura errónea del ARN mensajero.",
    tipoAccion: "Bactericida (dependiente de concentración)",
    espectro:
      "Bacilos Gram negativos aerobios, algunos cocos Gram positivos en combinación.",
    espectroKey: "gram-negativo",
    usoLab:
      "Disco de referencia en infecciones urinarias y septicemias por enterobacterias sensibles.",
    microorganismosEjemplo: [
      "<em>Escherichia coli</em>",
      "<em>Pseudomonas aeruginosa</em>"
    ],
    microorganismosIds: ["escherichia-coli", "pseudomonas-aeruginosa"],
    agaresRecomendadosIds: ["mueller-hinton-agar"],
    notasLab:
      "No interpretar en anaerobios y evitar uso empírico en pacientes con insuficiencia renal sin ajuste."
  },
  {
    id: "oxitetraciclina",
    nombre: "Oxitetraciclina",
    siglaDisco: "OT30",
    familia: "Tetraciclina",
    familiaKey: "tetraciclina",
    mecanismo:
      "Se une a la subunidad 30S inhibiendo la unión del ARNt y la síntesis proteica.",
    tipoAccion: "Bacteriostático",
    espectro:
      "Amplio espectro sobre Gram positivos, Gram negativos y algunas bacterias intracelulares.",
    espectroKey: "amplio",
    usoLab:
      "Disco útil en aislamiento de patógenos respiratorios y entéricos en animales de producción.",
    microorganismosEjemplo: [
      "<em>Pasteurella multocida</em>",
      "<em>Salmonella spp.</em>"
    ],
    microorganismosIds: ["pasteurella-multocida", "salmonella-spp"],
    agaresRecomendadosIds: ["mueller-hinton-agar"],
    notasLab:
      "Verificar uso en animales de producción según restricciones nacionales y tiempos de retiro."
  },
  {
    id: "ceftiofur",
    nombre: "Ceftiofur",
    siglaDisco: "EFT30",
    familia: "Cefalosporina de 3ª generación",
    familiaKey: "cefalosporina",
    mecanismo:
      "Inhibe la síntesis de pared celular uniéndose a PBP y bloqueando la formación de peptidoglucano.",
    tipoAccion: "Bactericida",
    espectro:
      "Amplio frente a enterobacterias y algunos cocos Gram positivos; estable frente a muchas β-lactamasas.",
    espectroKey: "amplio",
    usoLab:
      "Frecuente en pruebas de sensibilidad de patógenos respiratorios y sistémicos en bovinos y porcinos.",
    microorganismosEjemplo: ["<em>Salmonella spp.</em>", "<em>Escherichia coli</em>"],
    microorganismosIds: ["salmonella-spp", "escherichia-coli"],
    agaresRecomendadosIds: ["mueller-hinton-agar"],
    notasLab:
      "Interpretar con tablas específicas para medicina veterinaria. Vigilar aparición de cepas con resistencia extendida."
  }
];

// 2) INICIALIZACIÓN DE UI

document.addEventListener("DOMContentLoaded", () => {
  initAntibioUI();
});

function initAntibioUI() {
  const contenedor = document.getElementById("antibioCards");
  if (!contenedor) return; // Si aún no existe el HTML, no hacemos nada.

  const inputSearch = document.getElementById("searchAntibio");
  const selectFamilia = document.getElementById("filtroFamiliaAntibio");
  const selectAccion = document.getElementById("filtroAccionAntibio");

  const filtros = {
    texto: "",
    familiaKey: "",
    tipoAccionKey: ""
  };

  if (inputSearch) {
    inputSearch.addEventListener("input", (e) => {
      filtros.texto = e.target.value.toLowerCase();
      renderAntibioticos(contenedor, filtros);
    });
  }

  if (selectFamilia) {
    selectFamilia.addEventListener("change", (e) => {
      filtros.familiaKey = e.target.value;
      renderAntibioticos(contenedor, filtros);
    });
  }

  if (selectAccion) {
    selectAccion.addEventListener("change", (e) => {
      filtros.tipoAccionKey = e.target.value; // "bactericida" o "bacteriostatico"
      renderAntibioticos(contenedor, filtros);
    });
  }

  // Render inicial
  renderAntibioticos(contenedor, filtros);
}

// 3) RENDER DE TARJETAS

function renderAntibioticos(contenedor, filtros) {
  contenedor.innerHTML = "";

  const filtrados = discosAntibioticos.filter((d) => {
    // texto libre (nombre, sigla, familia, mecanismo, espectro, uso lab)
    if (filtros.texto) {
      const blob =
        (d.nombre +
          " " +
          d.siglaDisco +
          " " +
          d.familia +
          " " +
          d.mecanismo +
          " " +
          d.espectro +
          " " +
          d.usoLab).toLowerCase();
      if (!blob.includes(filtros.texto)) return false;
    }

    // filtro por familia
    if (filtros.familiaKey && d.familiaKey !== filtros.familiaKey) {
      return false;
    }

    // filtro por tipo de acción
    if (filtros.tipoAccionKey) {
      const accionLower = d.tipoAccion.toLowerCase();
      if (!accionLower.startsWith(filtros.tipoAccionKey)) {
        // "Bactericida (dependiente de concentración)" sigue matcheando "bactericida"
        return false;
      }
    }

    return true;
  });

  if (!filtrados.length) {
    const vacio = document.createElement("p");
    vacio.className = "cards-empty";
    vacio.textContent =
      "No hay antibióticos que coincidan con los filtros aplicados.";
    contenedor.appendChild(vacio);
    return;
  }

  filtrados.forEach((d) => {
    const card = document.createElement("article");
    card.className = `card card-antibio card-antibio-${d.familiaKey}`;

    // Header: nombre + sigla del disco
    const header = document.createElement("header");
    header.className = "card-header";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = `${d.nombre} (${d.siglaDisco})`;

    const familiaPill = document.createElement("span");
    familiaPill.className = "pill pill-familia";
    familiaPill.textContent = d.familia;

    header.appendChild(title);
    header.appendChild(familiaPill);

    // Subtítulo: tipo de acción + espectro
    const subtitle = document.createElement("p");
    subtitle.className = "card-subtitle";
    subtitle.textContent = `${d.tipoAccion} • ${d.espectro}`;

    // Body
    const body = document.createElement("div");
    body.className = "card-body";

    const pMecanismo = document.createElement("p");
    pMecanismo.innerHTML = `<strong>Mecanismo de acción:</strong> ${d.mecanismo}`;

    const pUsoLab = document.createElement("p");
    pUsoLab.innerHTML = `<strong>Uso en laboratorio:</strong> ${d.usoLab}`;

    const pMicro = document.createElement("p");
    pMicro.innerHTML = `<strong>Microorganismos ejemplo:</strong> ${
      d.microorganismosEjemplo ? d.microorganismosEjemplo.join(", ") : "—"
    }`;

    const pNotas = document.createElement("p");
    pNotas.className = "card-notas";
    pNotas.innerHTML = `<strong>Notas de laboratorio:</strong> ${d.notasLab}`;

    body.appendChild(pMecanismo);
    body.appendChild(pUsoLab);
    body.appendChild(pMicro);
    body.appendChild(pNotas);

    // Footer: botones de conexión
const footer = document.createElement("div");
footer.className = "card-footer card-footer-actions";

const btnMicro = document.createElement("button");
btnMicro.type = "button";
btnMicro.className = "btn btn-apple-secondary";
btnMicro.textContent = "Ver microorganismos";
// guardamos los ids para el cerebro
btnMicro.dataset.microorganismosIds = (d.microorganismosIds || []).join(",");

const btnAgares = document.createElement("button");
btnAgares.type = "button";
btnAgares.className = "btn btn-apple-secondary";
btnAgares.textContent = "Ver agares para antibiograma";
btnAgares.dataset.agaresIds = (d.agaresRecomendadosIds || []).join(",");

const btnHalos = document.createElement("button");
btnHalos.type = "button";
btnHalos.className = "btn btn-apple";
btnHalos.textContent = "Pasaporte del antibiótico";
btnHalos.addEventListener("click", () => {
  imprimirPasaporteAntibiotico(d);
});

// --- Acciones de salto WOW ---

btnMicro.addEventListener("click", () => {
  const idsStr = btnMicro.dataset.microorganismosIds || "";
  const ids = idsStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (window.SuiteVet && window.SuiteVet.microNav) {
    // preferimos ir por ids (usa el array del disco)
    if (
      typeof window.SuiteVet.microNav.irMicroorganismosPorIds === "function" &&
      ids.length
    ) {
      window.SuiteVet.microNav.irMicroorganismosPorIds(ids);
      return;
    }

    // plan B: usar el primer microorganismo de ejemplo
    if (
      typeof window.SuiteVet.microNav.irMicroorganismosPorTexto === "function" &&
      d.microorganismosEjemplo &&
      d.microorganismosEjemplo.length
    ) {
      const textoPlano = d.microorganismosEjemplo[0]
        .replace(/<[^>]+>/g, "")
        .trim()
        .split(" ")[0]; // género
      window.SuiteVet.microNav.irMicroorganismosPorTexto(textoPlano);
      return;
    }
  }

  // plan C: mínimo, abrir Microbiología → Microorganismos
  if (window.SuiteVet && typeof window.SuiteVet.showView === "function") {
    window.SuiteVet.showView("microbiologia");
    const tab = document.querySelector('.micro-tab[data-micro="microorganismos"]');
    if (tab) tab.click();
  }
});

btnAgares.addEventListener("click", () => {
  const idsStr = btnAgares.dataset.agaresIds || "";
  const ids = idsStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (window.SuiteVet && window.SuiteVet.microNav) {
    if (
      typeof window.SuiteVet.microNav.irAgaresPorIds === "function" &&
      ids.length
    ) {
      window.SuiteVet.microNav.irAgaresPorIds(ids);
      return;
    }
  }

  // Fallback: abrir Microbiología → Agares, sin filtro
  if (window.SuiteVet && typeof window.SuiteVet.showView === "function") {
    window.SuiteVet.showView("microbiologia");
    const tab = document.querySelector('.micro-tab[data-micro="agares"]');
    if (tab) tab.click();
  }
});

footer.appendChild(btnMicro);
footer.appendChild(btnAgares);
footer.appendChild(btnHalos);


    // Ensamblar tarjeta
    card.appendChild(header);
    card.appendChild(subtitle);
    card.appendChild(body);
    card.appendChild(footer);

    contenedor.appendChild(card);
  });
}

// 4) PASAPORTE DEL ANTIBIÓTICO (impresión PDF)
function imprimirPasaporteAntibiotico(disco) {
  const contPrint = document.getElementById("printPrep");
  if (!contPrint || !disco) return;

  const microEjemplo = disco.microorganismosEjemplo
    ? disco.microorganismosEjemplo.join(", ")
    : "—";

  contPrint.innerHTML = `
    <div class="pasaporte pasaporte-antibio">
      <header class="pasaporte-header">
        <div>
          <h2>Pasaporte del antibiótico</h2>
          <p>SUITE VET • Módulo de Microbiología</p>
        </div>
        <div class="pasaporte-meta">
          <p><strong>Disco:</strong> ${disco.siglaDisco || "—"}</p>
          <p><strong>Familia:</strong> ${disco.familia || "—"}</p>
          <p><strong>Espectro:</strong> ${disco.espectroKey || "—"}</p>
        </div>
      </header>

      <p style="font-size:9pt; margin: 0 0 6px 0;">
        <strong>Laboratorio:</strong> ________________________
        &nbsp;&nbsp; <strong>Fecha:</strong> ____ / ____ / ______
        &nbsp;&nbsp; <strong>Estudiante:</strong> ________________________
      </p>

      <section class="pasaporte-main">
        <div class="pasaporte-col pasaporte-identidad">
          <h3>Identidad</h3>
          <p><strong>Nombre:</strong> ${disco.nombre || "—"}</p>
          <p><strong>Sigla del disco:</strong> ${disco.siglaDisco || "—"}</p>
          <p><strong>Familia:</strong> ${disco.familia || "—"}</p>
          <p><strong>Tipo de acción:</strong> ${disco.tipoAccion || "—"}</p>
          <p><strong>Espectro:</strong> ${disco.espectro || "—"}</p>
          <p><strong>Mecanismo de acción:</strong> ${disco.mecanismo || "—"}</p>
          <p><strong>Uso en laboratorio:</strong> ${disco.usoLab || "—"}</p>
          <p><strong>Microorganismos de referencia:</strong> ${microEjemplo}</p>
        </div>

        <div class="pasaporte-col pasaporte-foto">
          <h3>Halo de inhibición</h3>
          <div class="foto-placeholder">
            <span>Fotografía del halo (no añadida aún)</span>
          </div>
          <p class="foto-nota">
            Adjunta aquí la fotografía real del halo medido en tu antibiograma
            (futuras versiones de SUITE VET podrán enlazarla automáticamente).
          </p>
        </div>
      </section>

      <section class="pasaporte-extra">
        <div class="pasaporte-col">
          <h3>Interpretación del halo</h3>
          <p>Registrar los puntos de corte según el manual de referencia del laboratorio (CLSI / EUCAST / guía local).</p>
          <table class="tabla-interpretacion">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Significado</th>
                <th>Puntos de corte (mm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>S</td>
                <td>Sensible</td>
                <td>________________</td>
              </tr>
              <tr>
                <td>I</td>
                <td>Sensible aumentando exposición</td>
                <td>________________</td>
              </tr>
              <tr>
                <td>R</td>
                <td>Resistente</td>
                <td>________________</td>
              </tr>
              <tr>
                <td>NS</td>
                <td>No susceptible</td>
                <td>________________</td>
              </tr>
              <tr>
                <td>T</td>
                <td>Solo detección</td>
                <td>________________</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pasaporte-col">
          <h3>Notas y observaciones</h3>
          <p><strong>Notas de laboratorio:</strong> ${disco.notasLab || "—"}</p>
          <p><strong>Observaciones clínicas:</strong> ____________________________</p>
          <p><strong>Resistencia detectada (patrón / especie):</strong> _____________________________</p>
          <p><strong>Caso / paciente:</strong> ___________________________________</p>
        </div>
      </section>
    </div>
  `;

  window.print();
}

