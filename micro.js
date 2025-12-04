// micro.js
// ============================================================================
// MÓDULO DE MICROBIOLOGÍA – SUITE VET
// Esqueleto funcional con algunos ejemplos de:
//  - Agares
//  - Caldos
//  - Pruebas bioquímicas
// Puedes ir agregando más medios copiando los ejemplos.
// ============================================================================

// =======================
// AGARES (medios sólidos)
// =======================
const mediosAgar = [
  {
    id: "tsa-agar",
    nombre: "Tryptic Soy Agar (TSA)",
    estado: "solido",
    tipos: ["basico", "uso general"],
    gramosPorLitro: 40.0,
    phFinal: "7.3 ± 0.2 (25 °C)",
    objetivo:
      "Medio nutritivo general para cultivo de bacterias no exigentes y control de esterilidad.",
    bacteriasObjetivo: ["<em>Escherichia coli</em>", "Flora ambiental no exigente"],
    observaciones:
      "Excelente crecimiento de bacterias no exigentes. Útil como base para conteos totales."
  },
  {
    id: "mannitol-salt-agar",
    nombre: "Mannitol Salt Agar",
    estado: "solido",
    tipos: ["selectivo", "diferencial"],
    gramosPorLitro: 111.0,
    phFinal: "7.4 ± 0.2 (25 °C)",
    objetivo:
      "Aislamiento y diferenciación de estafilococos por fermentación de manitol y tolerancia a alta sal.",
    bacteriasObjetivo: ["<em>Staphylococcus spp.</em>"],
    observaciones:
      "Alta concentración de NaCl inhibe flora acompañante. Viraje a amarillo indica fermentación de manitol."
  },
  {
    id: "mueller-hinton-agar",
    nombre: "Mueller Hinton Agar",
    estado: "solido",
    tipos: ["basico", "antibiograma"],
    gramosPorLitro: 38.0,
    phFinal: "7.3 ± 0.1 (25 °C)",
    objetivo:
      "Medio estándar para pruebas de sensibilidad a antimicrobianos por difusión en disco.",
    bacteriasObjetivo: [
      "<em>Escherichia coli</em>",
      "<em>Staphylococcus spp.</em>",
      "<em>Salmonella spp.</em>"
    ],
    observaciones:
      "Controlar espesor de la capa (~4 mm) y pH para evitar halos falsamente aumentados o disminuidos."
  }
];

// =====================
// CALDOS (medios líquidos)
// =====================
const mediosCaldo = [
  {
    id: "tsb-caldo",
    nombre: "Tryptic Soy Broth (TSB)",
    estado: "liquido",
    tipos: ["nutritivo", "no selectivo"],
    gramosPorLitro: 30.0,
    phFinal: "7.3 ± 0.2 (25 °C)",
    objetivo:
      "Medio líquido universal para cultivo de una amplia gama de bacterias y pruebas de esterilidad.",
    bacteriasObjetivo: ["Bacterias aerobias no exigentes"],
    observaciones:
      "Disolver 30 g/L en agua destilada y esterilizar a 121 °C durante 15 min."
  },
  {
    id: "agua-peptona",
    nombre: "Peptone Water",
    estado: "liquido",
    tipos: ["basico", "preenriquecimiento"],
    gramosPorLitro: 15.0,
    phFinal: "7.2 ± 0.2 (25 °C)",
    objetivo:
      "Medio simple para cultivo general, preparación de inóculos y base para pruebas de fermentación.",
    bacteriasObjetivo: ["Enterobacterias", "Bacterias no exigentes"],
    observaciones:
      "Reconstituir 15 g/L en agua y esterilizar a 121 °C durante 15 min."
  }
];

// ============================
// PRUEBAS BIOQUÍMICAS (fichas)
// ============================
const pruebasBioquimicas = [
  {
    id: "tsi",
    nombre: "TSI (Triple Sugar Iron)",
    categoria: "fermentacion",
    medioAgarId: "tsi-agar", // futuro: si creas el medio como agar aparte
    medioBase: "Triple Sugar Iron Agar",
    objetivo:
      "Diferenciar enterobacterias según fermentación de glucosa, lactosa, sacarosa y producción de gas/H₂S.",
    tipoInoculo: "Picadura en fondo + estría en la pendiente.",
    incubacion: "18–24 h a 35–37 °C.",
    interpretacion:
      "Fondo/pendiente amarillos → múltiples azúcares. Solo fondo amarillo → glucosa. Negro → H₂S. Elevación/rotura del agar → gas.",
    observaciones:
      "Leer dentro de las 24 h para evitar que el pico vuelva a alcalino y se pierda la lectura de azúcares."
  },
  {
    id: "citrato-simmons",
    nombre: "Citrato de Simmons",
    categoria: "citrato",
    medioAgarId: "", // opcional
    medioBase: "Simmons Citrate Agar",
    objetivo:
      "Evaluar la capacidad de utilizar citrato como única fuente de carbono.",
    tipoInoculo: "Estría superficial con asa recta.",
    incubacion: "24–48 h a 35–37 °C.",
    interpretacion:
      "Crecimiento con color azul → positivo. Verde sin crecimiento → negativo.",
    observaciones:
      "Evitar inóculos muy cargados que arrastren otros nutrientes y den falsos positivos."
  },
  {
    id: "ureasa",
    nombre: "Prueba de Ureasa",
    categoria: "lisina", // solo para tener alguna categoría, luego puedes ajustarla
    medioAgarId: "",
    medioBase: "Urea Agar / Urea Broth",
    objetivo:
      "Detectar producción de ureasa y liberación de amoníaco a partir de urea.",
    tipoInoculo: "Estría en superficie (agar) o inóculo directo (caldo).",
    incubacion: "4–24 h a 35–37 °C (algunas bacterias hasta 48 h).",
    interpretacion:
      "Viraje a rosa intenso → positivo. Sin cambio (amarillo/pálido) → negativo.",
    observaciones:
      "<em>Proteus spp.</em> suelen ser fuertemente ureasa positivos con viraje rápido."
  }
];

// ============================================================================
// HELPERS BÁSICOS
// ============================================================================
function normalizar(str) {
  if (!str) return "";
  return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatearML(valor) {
  if (!isFinite(valor)) return "";
  return `${valor.toFixed(0)} mL`;
}

function formatearGramos(valor) {
  if (!isFinite(valor)) return "";
  return `${valor.toFixed(2)} g`;
}

// ============================================================================
// INICIALIZACIÓN GENERAL
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM generales
  const contAgares = document.getElementById("agarCards");
  const contCaldos = document.getElementById("caldoCards");
  const contPruebas = document.getElementById("pruebasCards");

  const inputBuscarAgar = document.getElementById("searchMedio");
  const inputBuscarCaldo = document.getElementById("searchCaldo");
  const inputBuscarPrueba = document.getElementById("searchPrueba");

  const selectTipoAgar = document.getElementById("filtroTipoMedio");
  const selectTipoCaldo = document.getElementById("filtroTipoCaldo");
  const selectTipoPrueba = document.getElementById("filtroTipoPrueba");

  const selectCalcAgar = document.getElementById("calcMedio");
  const selectCalcCaldo = document.getElementById("calcCaldoMedio");
  const selectCalcPrueba = document.getElementById("calcPruebaMedio");

  const selectTamPlaca = document.getElementById("tamPlaca");
  const inputNumPlacas = document.getElementById("numPlacas");
  const btnCalcularAgar = document.getElementById("btnCalcularMedio");
  const btnImprimirAgar = document.getElementById("btnImprimirPreparacion");
  const contResultadoAgar = document.getElementById("resultadoCalcMedio");

  const inputVolCaldo = document.getElementById("volCaldoTotal");
  const btnCalcularCaldo = document.getElementById("btnCalcularCaldo");
  const btnImprimirCaldo = document.getElementById("btnImprimirCaldo");
  const contResultadoCaldo = document.getElementById("resultadoCalcCaldo");

  const inputNumTubos = document.getElementById("numTubos");
  const inputVolPruebaTotal = document.getElementById("volPruebaTotal");
  const btnCalcularPrueba = document.getElementById("btnCalcularPrueba");
  const btnImprimirPrueba = document.getElementById("btnImprimirPrueba");
  const contResultadoPrueba = document.getElementById("resultadoCalcPrueba");

  const contPrint = document.getElementById("printPrep");

  // Normas: botones de impresión
  const btnPrintAgares = document.getElementById("btn-print-agares");
  const btnPrintCaldos = document.getElementById("btn-print-caldos");
  const btnPrintPruebas = document.getElementById("btn-print-pruebas");

    // Tabs de microbiología
  const microTabs = document.querySelectorAll(".micro-tab");
  const microPanes = document.querySelectorAll(".micro-pane");

  // Helper: activar submódulo (agares / caldos / pruebas / antibióticos / microorganismos)
  function activarSubmoduloMicro(nombre) {
    if (!microTabs.length || !microPanes.length) return;

    microTabs.forEach((tab) => {
      const destino = tab.getAttribute("data-micro");
      tab.classList.toggle("micro-tab-active", destino === nombre);
    });

    microPanes.forEach((pane) => {
      pane.classList.toggle(
        "micro-pane-active",
        pane.id === `micro-${nombre}`
      );
    });
  }

  // Click normal en las pestañas
  if (microTabs.length && microPanes.length) {
    microTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const destino = tab.getAttribute("data-micro");
        activarSubmoduloMicro(destino);
      });
    });
  }

  // CEREBRO GLOBAL DE NAVEGACIÓN DE MICROBIOLOGÍA
  if (window.SuiteVet) {
    const showView =
      window.SuiteVet.showView ||
      function () {};

    window.SuiteVet.microNav = window.SuiteVet.microNav || {};

    // Permite ir desde otros módulos a Microorganismos con un texto de búsqueda
    window.SuiteVet.microNav.irMicroorganismosPorTexto = function (texto) {
      // 1) Cambiar a la vista "Microbiología"
      showView("microbiologia");

      // 2) Activar la pestaña "Microorganismos"
      activarSubmoduloMicro("microorganismos");

      // 3) Rellenar buscador del atlas y disparar filtrado
      const inputSearch = document.getElementById("searchMicroorg");
      if (inputSearch) {
        inputSearch.value = texto || "";
        const ev = new Event("input", { bubbles: true });
        inputSearch.dispatchEvent(ev);
      }
    };
  }

  // --------------------------------------------------------------------------
  // RENDER: AGARES
  // --------------------------------------------------------------------------
  function renderMediosAgar() {
  if (!contAgares) return;
  const texto = normalizar(inputBuscarAgar ? inputBuscarAgar.value : "");
  const tipo = selectTipoAgar ? selectTipoAgar.value : "";

  const filtrados = mediosAgar.filter((medio) => {
    if (tipo && !medio.tipos.includes(tipo)) return false;
    if (!texto) return true;
    const campo = normalizar(
      [
        medio.nombre,
        medio.objetivo,
        medio.bacteriasObjetivo ? medio.bacteriasObjetivo.join(", ") : "",
        medio.observaciones || ""
      ].join(" ")
    );
    return campo.includes(texto);
  });

  contAgares.innerHTML = "";
  if (!filtrados.length) {
    const p = document.createElement("p");
    p.className = "cards-empty";
    p.textContent = "No se encontraron agares con esos criterios.";
    contAgares.appendChild(p);
    return;
  }

  filtrados.forEach((medio) => {
      const card = document.createElement("article");

      // Línea de color según tipo de agar
      const tipos = medio.tipos || [];
      let tipoClass = "";

      if (tipos.includes("selectivo")) {
        tipoClass = "agar-selectivo";
      } else if (tipos.includes("diferencial")) {
        tipoClass = "agar-diferencial";
      } else if (tipos.includes("nutritivo")) {
        tipoClass = "agar-nutritivo";
      } else if (tipos.includes("enriquecido")) {
        tipoClass = "agar-enriquecido";
      } else if (tipos.includes("basico") || tipos.includes("básico")) {
        tipoClass = "agar-basico";
      } else if (tipos.includes("transporte")) {
        tipoClass = "agar-transporte";
      }

      card.className = `card card-agar ${tipoClass}`.trim();


    const header = document.createElement("header");
    header.className = "card-header";

    const h3 = document.createElement("h3");
    h3.className = "card-title";
    h3.textContent = medio.nombre;

    const tipoSpan = document.createElement("span");
    tipoSpan.className = "pill pill-tipo";
    tipoSpan.textContent = medio.tipos.join(" / ");

    header.appendChild(h3);
    header.appendChild(tipoSpan);

    const body = document.createElement("div");
    body.className = "card-body";

    const pObj = document.createElement("p");
    pObj.innerHTML = `<strong>Objetivo:</strong> ${medio.objetivo}`;

    const pPH = document.createElement("p");
    pPH.innerHTML = `<strong>pH final:</strong> ${medio.phFinal}`;

    // --- NUEVO: bacterias como links internos ---
    const pBact = document.createElement("p");
    pBact.innerHTML = `<strong>Reproduce / favorece:</strong> `;

    if (medio.bacteriasObjetivo && medio.bacteriasObjetivo.length) {
      const spanLista = document.createElement("span");

      medio.bacteriasObjetivo.forEach((nombre, index) => {
        const btnLink = document.createElement("button");
        btnLink.type = "button";
        btnLink.className = "link-interno-micro";
        btnLink.textContent = nombre;

        btnLink.addEventListener("click", () => {
          if (window.SuiteVet && window.SuiteVet.microNav) {
            window.SuiteVet.microNav.irMicroorganismosPorTexto(nombre);
          }
        });

        spanLista.appendChild(btnLink);

        // separador ", " entre bacterias
        if (index < medio.bacteriasObjetivo.length - 1) {
          const sep = document.createElement("span");
          sep.textContent = ", ";
          spanLista.appendChild(sep);
        }
      });

      pBact.appendChild(spanLista);
    } else {
      const spanVacio = document.createElement("span");
      spanVacio.textContent = "—";
      pBact.appendChild(spanVacio);
    }
    // --- FIN NUEVO ---

    const pObs = document.createElement("p");
    pObs.className = "card-notas";
    pObs.innerHTML = `<strong>Notas de laboratorio:</strong> ${
      medio.observaciones || "—"
    }`;

    body.appendChild(pObj);
    body.appendChild(pPH);
    body.appendChild(pBact);
    body.appendChild(pObs);

    card.appendChild(header);
    card.appendChild(body);
    contAgares.appendChild(card);
  });
}


  // --------------------------------------------------------------------------
  // RENDER: CALDOS
  // --------------------------------------------------------------------------
  function renderMediosCaldo() {
    if (!contCaldos) return;
    const texto = normalizar(inputBuscarCaldo ? inputBuscarCaldo.value : "");
    const tipo = selectTipoCaldo ? selectTipoCaldo.value : "";

    const filtrados = mediosCaldo.filter((medio) => {
      if (tipo && !medio.tipos.includes(tipo)) return false;
      if (!texto) return true;
      const campo = normalizar(
        [
          medio.nombre,
          medio.objetivo,
          medio.bacteriasObjetivo ? medio.bacteriasObjetivo.join(", ") : "",
          medio.observaciones || ""
        ].join(" ")
      );
      return campo.includes(texto);
    });

    contCaldos.innerHTML = "";
    if (!filtrados.length) {
      const p = document.createElement("p");
      p.className = "cards-empty";
      p.textContent = "No se encontraron caldos con esos criterios.";
      contCaldos.appendChild(p);
      return;
    }

    filtrados.forEach((medio) => {
      const card = document.createElement("article");

      // Línea de color según tipo de caldo
      const tipos = medio.tipos || [];
      let tipoClass = "";

      if (tipos.includes("selectivo")) {
        tipoClass = "caldo-selectivo";
      } else if (tipos.includes("nutritivo")) {
        tipoClass = "caldo-nutritivo";
      } else if (tipos.includes("preenriquecimiento")) {
        tipoClass = "caldo-preenriquecimiento";
      } else if (tipos.includes("basico") || tipos.includes("básico")) {
        tipoClass = "caldo-basico";
      }

      card.className = `card card-caldo ${tipoClass}`.trim();


      const header = document.createElement("header");
      header.className = "card-header";

      const h3 = document.createElement("h3");
      h3.className = "card-title";
      h3.textContent = medio.nombre;

      const tipoSpan = document.createElement("span");
      tipoSpan.className = "pill pill-tipo";
      tipoSpan.textContent = medio.tipos.join(" / ");

      header.appendChild(h3);
      header.appendChild(tipoSpan);

      const body = document.createElement("div");
      body.className = "card-body";

      const pObj = document.createElement("p");
      pObj.innerHTML = `<strong>Objetivo:</strong> ${medio.objetivo}`;

      const pPH = document.createElement("p");
      pPH.innerHTML = `<strong>pH final:</strong> ${medio.phFinal}`;

      const pBact = document.createElement("p");
      pBact.innerHTML = `<strong>Favorece:</strong> ${
        medio.bacteriasObjetivo ? medio.bacteriasObjetivo.join(", ") : "—"
      }`;

      const pObs = document.createElement("p");
      pObs.className = "card-notas";
      pObs.innerHTML = `<strong>Notas de laboratorio:</strong> ${medio.observaciones || "—"}`;

      body.appendChild(pObj);
      body.appendChild(pPH);
      body.appendChild(pBact);
      body.appendChild(pObs);

      card.appendChild(header);
      card.appendChild(body);
      contCaldos.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // RENDER: PRUEBAS BIOQUÍMICAS
  // --------------------------------------------------------------------------
  function renderPruebas() {
    if (!contPruebas) return;
    const texto = normalizar(inputBuscarPrueba ? inputBuscarPrueba.value : "");
    const tipo = selectTipoPrueba ? selectTipoPrueba.value : "";

    const filtrados = pruebasBioquimicas.filter((pr) => {
      if (tipo && pr.categoria !== tipo) return false;
      if (!texto) return true;
      const campo = normalizar(
        [
          pr.nombre,
          pr.medioBase,
          pr.objetivo,
          pr.interpretacion || "",
          pr.observaciones || ""
        ].join(" ")
      );
      return campo.includes(texto);
    });

    contPruebas.innerHTML = "";
    if (!filtrados.length) {
      const p = document.createElement("p");
      p.className = "cards-empty";
      p.textContent = "No se encontraron pruebas con esos criterios.";
      contPruebas.appendChild(p);
      return;
    }

    filtrados.forEach((pr) => {
      const card = document.createElement("article");

      // Línea de color según categoría de prueba
      const categoria = pr.categoria || "";
      const tipoClass = categoria ? `prueba-${categoria}` : "";

      card.className = `card card-prueba ${tipoClass}`.trim();


      const header = document.createElement("header");
      header.className = "card-header";

      const h3 = document.createElement("h3");
      h3.className = "card-title";
      h3.textContent = pr.nombre;

      const cat = document.createElement("span");
      cat.className = "pill pill-tipo";
      cat.textContent = pr.categoria || "Prueba";

      header.appendChild(h3);
      header.appendChild(cat);

      const body = document.createElement("div");
      body.className = "card-body";

      const pObj = document.createElement("p");
      pObj.innerHTML = `<strong>Objetivo:</strong> ${pr.objetivo}`;

      const pInc = document.createElement("p");
      pInc.innerHTML = `<strong>Incubación:</strong> ${pr.incubacion}`;

      const pInt = document.createElement("p");
      pInt.innerHTML = `<strong>Interpretación:</strong> ${pr.interpretacion}`;

      const pObs = document.createElement("p");
      pObs.className = "card-notas";
      pObs.innerHTML = `<strong>Notas de laboratorio:</strong> ${pr.observaciones || "—"}`;

      body.appendChild(pObj);
      body.appendChild(pInc);
      body.appendChild(pInt);
      body.appendChild(pObs);

      card.appendChild(header);
      card.appendChild(body);
      contPruebas.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // CALCULADORA: AGARES (placas)
  // --------------------------------------------------------------------------
  function poblarSelectAgar() {
    if (!selectCalcAgar) return;
    selectCalcAgar.innerHTML = "";
    mediosAgar.forEach((medio) => {
      const opt = document.createElement("option");
      opt.value = medio.id;
      opt.textContent = medio.nombre;
      selectCalcAgar.appendChild(opt);
    });
  }

  function calcularAgar() {
    if (!selectCalcAgar || !selectTamPlaca || !inputNumPlacas || !contResultadoAgar) return;
    const idMedio = selectCalcAgar.value;
    const medio = mediosAgar.find((m) => m.id === idMedio);
    if (!medio) return;

    const volPlaca = parseFloat(selectTamPlaca.value || "25");
    const numPlacas = parseInt(inputNumPlacas.value || "0", 10);
    const volTotal = volPlaca * numPlacas; // mL
    const litros = volTotal / 1000;
    const gramos = medio.gramosPorLitro * litros;

    contResultadoAgar.innerHTML = `
      <p><strong>Medio:</strong> ${medio.nombre}</p>
      <p><strong>Número de placas:</strong> ${numPlacas} (≈ ${formatearML(volPlaca)} c/u)</p>
      <p><strong>Volumen total:</strong> ${formatearML(volTotal)}</p>
      <p><strong>Cantidad de polvo:</strong> ${formatearGramos(gramos)}</p>
    `;

    if (btnImprimirAgar) btnImprimirAgar.disabled = false;
    // Guardamos en dataset para impresión
    if (contResultadoAgar) {
      contResultadoAgar.dataset.medioId = medio.id;
      contResultadoAgar.dataset.volTotal = volTotal;
      contResultadoAgar.dataset.gramos = gramos;
      contResultadoAgar.dataset.numPlacas = numPlacas;
    }
  }

  

  // --------------------------------------------------------------------------
  // CALCULADORA: CALDOS (volumen total en mL)
  // --------------------------------------------------------------------------
  function poblarSelectCaldo() {
    if (!selectCalcCaldo) return;
    selectCalcCaldo.innerHTML = "";
    mediosCaldo.forEach((medio) => {
      const opt = document.createElement("option");
      opt.value = medio.id;
      opt.textContent = medio.nombre;
      selectCalcCaldo.appendChild(opt);
    });
  }

  function calcularCaldo() {
    if (!selectCalcCaldo || !inputVolCaldo || !contResultadoCaldo) return;
    const idMedio = selectCalcCaldo.value;
    const medio = mediosCaldo.find((m) => m.id === idMedio);
    if (!medio) return;

    const volTotal = parseFloat(inputVolCaldo.value || "0");
    const litros = volTotal / 1000;
    const gramos = medio.gramosPorLitro * litros;

    contResultadoCaldo.innerHTML = `
      <p><strong>Medio:</strong> ${medio.nombre}</p>
      <p><strong>Volumen total:</strong> ${formatearML(volTotal)}</p>
      <p><strong>Cantidad de polvo:</strong> ${formatearGramos(gramos)}</p>
    `;

    if (btnImprimirCaldo) btnImprimirCaldo.disabled = false;
    contResultadoCaldo.dataset.medioId = medio.id;
    contResultadoCaldo.dataset.volTotal = volTotal;
    contResultadoCaldo.dataset.gramos = gramos;
  }

  function imprimirCaldo() {
    if (!contResultadoCaldo || !contPrint) return;
    const idMedio = contResultadoCaldo.dataset.medioId;
    const medio = mediosCaldo.find((m) => m.id === idMedio);
    if (!medio) return;

    const volTotal = parseFloat(contResultadoCaldo.dataset.volTotal || "0");
    const gramos = parseFloat(contResultadoCaldo.dataset.gramos || "0");

    contPrint.innerHTML = `
      <div class="print-card">
        <h2>Preparación de caldo: ${medio.nombre}</h2>
        <div class="print-resumen">
          <p><strong>Objetivo:</strong> ${medio.objetivo}</p>
          <p><strong>Favorece:</strong> ${
            medio.bacteriasObjetivo ? medio.bacteriasObjetivo.join(", ") : "—"
          }</p>
        </div>
        <div class="print-detalle">
          <p><strong>Volumen total:</strong> ${formatearML(volTotal)}</p>
          <p><strong>Polvo deshidratado:</strong> ${formatearGramos(gramos)}</p>
          <p><strong>pH final teórico:</strong> ${medio.phFinal}</p>
        </div>
        <div class="print-notas">
          <p><strong>Observaciones:</strong> ${medio.observaciones || "—"}</p>
          <p><strong>Notas de laboratorio:</strong> __________________________</p>
        </div>
      </div>
    `;
    window.print();
  }

  // --------------------------------------------------------------------------
  // CALCULADORA: PRUEBAS (tubos de 10 mL)
  // --------------------------------------------------------------------------
  function poblarSelectPrueba() {
    if (!selectCalcPrueba) return;
    selectCalcPrueba.innerHTML = "";
    pruebasBioquimicas.forEach((pr) => {
      const opt = document.createElement("option");
      opt.value = pr.id;
      opt.textContent = pr.nombre;
      selectCalcPrueba.appendChild(opt);
    });
  }

  function calcularPrueba() {
    if (!selectCalcPrueba || !inputNumTubos || !inputVolPruebaTotal || !contResultadoPrueba)
      return;

    const idPrueba = selectCalcPrueba.value;
    const prueba = pruebasBioquimicas.find((p) => p.id === idPrueba);
    if (!prueba) return;

    const numTubos = parseInt(inputNumTubos.value || "0", 10);
    const volTotal = numTubos * 10; // 10 mL por tubo
    inputVolPruebaTotal.value = volTotal ? `${volTotal}` : "";

    // Como esqueleto, asumimos 38 g/L si no tenemos medio definido.
    // Luego puedes hacer que busque el agar real por ID.
    const gramosPorLitro = 38.0;
    const litros = volTotal / 1000;
    const gramos = gramosPorLitro * litros;

    contResultadoPrueba.innerHTML = `
      <p><strong>Prueba:</strong> ${prueba.nombre}</p>
      <p><strong>Número de tubos:</strong> ${numTubos} (10 mL c/u)</p>
      <p><strong>Volumen total:</strong> ${formatearML(volTotal)}</p>
      <p><strong>Cantidad estimada de polvo (base 38 g/L):</strong> ${formatearGramos(
        gramos
      )}</p>
    `;

    if (btnImprimirPrueba) btnImprimirPrueba.disabled = false;
    contResultadoPrueba.dataset.pruebaId = prueba.id;
    contResultadoPrueba.dataset.volTotal = volTotal;
    contResultadoPrueba.dataset.gramos = gramos;
  }

  function imprimirPrueba() {
    if (!contResultadoPrueba || !contPrint) return;
    const idPrueba = contResultadoPrueba.dataset.pruebaId;
    const prueba = pruebasBioquimicas.find((p) => p.id === idPrueba);
    if (!prueba) return;

    const volTotal = parseFloat(contResultadoPrueba.dataset.volTotal || "0");
    const gramos = parseFloat(contResultadoPrueba.dataset.gramos || "0");

    contPrint.innerHTML = `
      <div class="print-card">
        <h2>Preparación de medio para: ${prueba.nombre}</h2>
        <div class="print-resumen">
          <p><strong>Objetivo:</strong> ${prueba.objetivo}</p>
          <p><strong>Medio base:</strong> ${prueba.medioBase}</p>
        </div>
        <div class="print-detalle">
          <p><strong>Volumen total:</strong> ${formatearML(volTotal)}</p>
          <p><strong>Polvo estimado (38 g/L):</strong> ${formatearGramos(gramos)}</p>
          <p><strong>Incubación:</strong> ${prueba.incubacion}</p>
        </div>
        <div class="print-notas">
          <p><strong>Observaciones:</strong> ${prueba.observaciones || "—"}</p>
          <p><strong>Notas de laboratorio:</strong> __________________________</p>
        </div>
      </div>
    `;
    window.print();
  }

  
  // ========================================================================
  // CEREBRO DE NAVEGACIÓN INTERNA (MICROBIOLOGÍA)
  // ========================================================================
  if (window.SuiteVet) {
    const showView = window.SuiteVet.showView || function () {};

    // Cambiar entre submódulos: agares / caldos / pruebas / antibióticos / microorgs
    function activarSubmoduloMicro(nombre) {
      if (!microTabs || !microPanes) return;

      microTabs.forEach((tab) => {
        const dest = tab.getAttribute("data-micro");
        tab.classList.toggle("micro-tab-active", dest === nombre);
      });

      microPanes.forEach((pane) => {
        pane.classList.toggle(
          "micro-pane-active",
          pane.id === `micro-${nombre}`
        );
      });
    }

    // Objeto global de navegación de microbiología
    window.SuiteVet.microNav = window.SuiteVet.microNav || {};

    Object.assign(window.SuiteVet.microNav, {
      // 1) Micro → Agares (se usa desde microorganismo.js)
      irAgaresPorMicroorganismo(micro) {
        const texto = micro?.nombreCientifico
          ? micro.nombreCientifico.split(" ")[0] // "Escherichia", "Salmonella", etc.
          : "";

        showView("microbiologia");
        activarSubmoduloMicro("agares");

        if (inputBuscarAgar) inputBuscarAgar.value = texto;
        if (selectTipoAgar) selectTipoAgar.value = "";
        renderMediosAgar();
      },

      // 2) Micro → Pruebas bioquímicas
      irPruebasPorMicroorganismo(micro) {
        const texto = micro?.nombreCientifico
          ? micro.nombreCientifico.split(" ")[0]
          : "";

        showView("microbiologia");
        activarSubmoduloMicro("pruebas");

        if (inputBuscarPrueba) inputBuscarPrueba.value = texto;
        if (selectTipoPrueba) selectTipoPrueba.value = "";
        renderPruebas();
      },

      // 3) Micro → Antibióticos / Discos
      irAntibiosPorMicroorganismo(micro) {
        const texto = micro?.nombreCientifico
          ? micro.nombreCientifico.split(" ")[0]
          : "";

        showView("microbiologia");
        activarSubmoduloMicro("antibioticos");

        const inputSearch = document.getElementById("searchAntibio");
        const selectFamilia = document.getElementById("filtroFamiliaAntibio");
        const selectAccion = document.getElementById("filtroAccionAntibio");

        if (inputSearch) inputSearch.value = texto;
        if (selectFamilia) selectFamilia.value = "";
        if (selectAccion) selectAccion.value = "";

        // Forzar a que antibio.js vuelva a renderizar usando su propio listener
        if (inputSearch) {
          const ev = new Event("input", { bubbles: true });
          inputSearch.dispatchEvent(ev);
        }
      }
    });

  }


  // ========================================================================
  // LISTENERS
  // ========================================================================
  // Buscadores
  if (inputBuscarAgar) inputBuscarAgar.addEventListener("input", renderMediosAgar);
  if (selectTipoAgar) selectTipoAgar.addEventListener("change", renderMediosAgar);

  if (inputBuscarCaldo) inputBuscarCaldo.addEventListener("input", renderMediosCaldo);
  if (selectTipoCaldo) selectTipoCaldo.addEventListener("change", renderMediosCaldo);

  if (inputBuscarPrueba) inputBuscarPrueba.addEventListener("input", renderPruebas);
  if (selectTipoPrueba) selectTipoPrueba.addEventListener("change", renderPruebas);

  // Calculadoras
  if (btnCalcularAgar) btnCalcularAgar.addEventListener("click", calcularAgar);
  if (btnImprimirAgar) {
    btnImprimirAgar.disabled = true;
    
    if (btnImprimirAgar && typeof imprimirAgar === "function") {
  btnImprimirAgar.addEventListener("click", imprimirAgar);
}

  if (btnCalcularCaldo) btnCalcularCaldo.addEventListener("click", calcularCaldo);
  if (btnImprimirCaldo) {
    btnImprimirCaldo.disabled = true;
    btnImprimirCaldo.addEventListener("click", imprimirCaldo);
  }

  if (btnCalcularPrueba) btnCalcularPrueba.addEventListener("click", calcularPrueba);
  if (btnImprimirPrueba) {
    btnImprimirPrueba.disabled = true;
    btnImprimirPrueba.addEventListener("click", imprimirPrueba);
  }

  // Impresión de normas
  if (btnPrintAgares) {
    btnPrintAgares.addEventListener("click", () => imprimirNormas("agares"));
  }
  if (btnPrintCaldos) {
    btnPrintCaldos.addEventListener("click", () => imprimirNormas("caldos"));
  }
  if (btnPrintPruebas) {
    btnPrintPruebas.addEventListener("click", () => imprimirNormas("pruebas"));
  }

  // Inicializaciones
  poblarSelectAgar();
  poblarSelectCaldo();
  poblarSelectPrueba();
  renderMediosAgar();
  renderMediosCaldo();
  renderPruebas();
}
});

document.addEventListener("DOMContentLoaded", () => {
  const normasBox = document.getElementById("micro-normas");
  const normasToggle = document.getElementById("btn-toggle-normas");

  if (normasBox && normasToggle) {
    normasToggle.addEventListener("click", () => {
      normasBox.classList.toggle("normas-open");
    });
  }
});
