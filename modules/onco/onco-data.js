(function () {
  "use strict";

  window.VETONCO_DATA = {
    appName: "VetOnco",
    title: "Oncologia Veterinaria",
    subtitle: "Protocolos oncologicos y calculo de superficie corporal",
    sourceNote: "Modulo portado desde la app Android VetOnco7 recibida el 18/06/2026.",
    credits: [
      "Washington Wong",
      "Dra. Lorena Chalco",
      "Ing. Paola Galvez"
    ],
    protocols: [
      {
        id: "carcinoma-hepatico",
        title: "Carcinoma Hepatico",
        system: "Hepatobiliar",
        summary: "Ficha base para organizar estadificacion, plan terapeutico, monitoreo y notas de seguimiento.",
        status: "Plantilla por completar"
      },
      {
        id: "hemangiosarcoma",
        title: "Hemangiosarcoma",
        system: "Vascular / esplenico",
        summary: "Espacio de trabajo para registrar diagnostico, extension, objetivos del tratamiento y controles.",
        status: "Plantilla por completar"
      },
      {
        id: "linfoma",
        title: "Linfoma",
        system: "Hematopoyetico",
        summary: "Base para consignar inmunofenotipo, estadio clinico, protocolo elegido y respuesta al tratamiento.",
        status: "Plantilla por completar"
      },
      {
        id: "melanoma-cutaneo",
        title: "Melanoma Cutaneo",
        system: "Piel",
        summary: "Ficha para completar localizacion, histopatologia, margenes, estadificacion y plan de control.",
        status: "Plantilla por completar"
      },
      {
        id: "melanoma-oral-maligno",
        title: "Melanoma Oral Maligno",
        system: "Cavidad oral",
        summary: "Plantilla para integrar estadificacion local, nodal y sistemica antes de decidir manejo.",
        status: "Plantilla por completar"
      },
      {
        id: "tvt",
        title: "TVT",
        system: "Reproductivo / transmisible",
        summary: "Ficha base para evolucion de lesiones, respuesta clinica, controles y alta.",
        status: "Plantilla por completar"
      }
    ],
    protocolSections: [
      "Confirmacion diagnostica",
      "Estadificacion minima",
      "Objetivo terapeutico",
      "Protocolo elegido",
      "Monitoreo y seguridad",
      "Seguimiento"
    ],
    bsa: {
      formula: "SC (m2) = K x peso(kg)^(2/3) / 100",
      species: [
        { id: "perro", label: "Perro", k: 10.1 },
        { id: "gato", label: "Gato", k: 10 }
      ],
      disclaimer: "Herramienta educativa. La dosis oncologica final debe ser validada por criterio clinico, especie, comorbilidades, laboratorio y protocolo institucional."
    }
  };
})();
