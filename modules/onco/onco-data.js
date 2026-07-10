(function () {
  "use strict";

  const baseSections = {
    diagnosis: "Completar con citologia, histopatologia, inmunohistoquimica o prueba confirmatoria disponible.",
    staging: "Registrar examen fisico, imagenes, ganglios, torax/abdomen y laboratorio minimo antes de decidir tratamiento.",
    objective: "Definir si el objetivo es control local, control sistemico, citorreduccion, paliacion o seguimiento.",
    protocol: "Seleccionar el esquema validado por el medico tratante. La ficha permite cargar dosis mg/m2 para calcular la dosis total.",
    monitoring: "Completar hemograma, bioquimica, comorbilidades, toxicidad esperada y criterios para diferir la aplicacion.",
    followUp: "Programar controles, respuesta clinica, eventos adversos y proxima reevaluacion."
  };

  function protocol(id, title, system, summary, focus) {
    return {
      id,
      title,
      system,
      summary,
      status: "Calculable / completar dosis",
      sections: {
        diagnosis: focus.diagnosis || baseSections.diagnosis,
        staging: focus.staging || baseSections.staging,
        objective: focus.objective || baseSections.objective,
        protocol: focus.protocol || baseSections.protocol,
        monitoring: focus.monitoring || baseSections.monitoring,
        followUp: focus.followUp || baseSections.followUp
      },
      regimen: [
        {
          id: "principal",
          drug: focus.primaryDrug || "Farmaco principal",
          doseMgM2: null,
          unit: "mg/m2",
          route: focus.route || "",
          schedule: focus.schedule || "",
          notes: "Ingrese una dosis validada para calcular la cantidad a aplicar."
        },
        {
          id: "adyuvante",
          drug: focus.secondaryDrug || "Farmaco complementario / soporte",
          doseMgM2: null,
          unit: "mg/m2",
          route: "",
          schedule: "",
          notes: "Opcional. Usar solo si forma parte del protocolo elegido."
        }
      ],
      safety: focus.safety || [
        "Confirmar consentimiento informado y plan de monitoreo.",
        "No aplicar si el paciente no cumple los criterios clinicos definidos por el medico tratante."
      ]
    };
  }

  window.VETONCO_DATA = {
    appName: "VetOnco",
    title: "Oncologia Veterinaria",
    subtitle: "Protocolos oncologicos, calculo de superficie corporal e impresion de dosis",
    sourceNote: "Modulo portado desde la app Android VetOnco7 recibida el 18/06/2026 y ampliado como plantilla calculable.",
    credits: [
      "Washington Wong",
      "Dra. Lorena Chalco",
      "Ing. Paola Galvez"
    ],
    protocols: [
      protocol("carcinoma-hepatico", "Carcinoma Hepatico", "Hepatobiliar", "Ficha para organizar diagnostico, estadificacion, plan terapeutico y seguimiento hepatobiliar.", {
        diagnosis: "Confirmar origen primario/metastasico, histopatologia o citologia compatible y estado funcional hepatico.",
        staging: "Registrar ecografia/imagen abdominal, torax, hemograma, bioquimica, coagulacion y condicion quirurgica.",
        objective: "Definir si el manejo es quirurgico, sistemico, paliativo o de control de progresion.",
        primaryDrug: "Antineoplasico elegido"
      }),
      protocol("hemangiosarcoma", "Hemangiosarcoma", "Vascular / esplenico", "Espacio de trabajo para extension, riesgo hemorragico, tratamiento y controles.", {
        diagnosis: "Registrar localizacion primaria, citologia/histopatologia y estabilidad hemodinamica.",
        staging: "Completar torax, abdomen, ecocardiografia si aplica, hemograma y perfil de coagulacion.",
        objective: "Definir control de enfermedad microscopica, paliacion o seguimiento postquirurgico.",
        primaryDrug: "Antineoplasico elegido"
      }),
      protocol("linfoma", "Linfoma", "Hematopoyetico", "Ficha para inmunofenotipo, estadio clinico, protocolo elegido y respuesta al tratamiento.", {
        diagnosis: "Registrar citologia/histopatologia, inmunofenotipo si esta disponible y subestadio clinico.",
        staging: "Completar hemograma, bioquimica, urianalisis, imagenes, ganglios, higado/bazo y medula si corresponde.",
        objective: "Definir induccion, rescate, mantenimiento o paliacion segun el caso.",
        primaryDrug: "Farmaco del protocolo multiagente"
      }),
      protocol("melanoma-cutaneo", "Melanoma Cutaneo", "Piel", "Ficha para localizacion, histopatologia, margenes, estadificacion y plan de control.", {
        diagnosis: "Registrar histopatologia, indice mitotico, margenes y caracteristicas de invasion local.",
        staging: "Evaluar ganglio regional, torax y busqueda de enfermedad metastasica segun riesgo.",
        objective: "Definir control local, cirugia, radioterapia, inmunoterapia o seguimiento.",
        primaryDrug: "Tratamiento sistemico elegido"
      }),
      protocol("melanoma-oral-maligno", "Melanoma Oral Maligno", "Cavidad oral", "Plantilla para integrar estadificacion local, nodal y sistemica antes de decidir manejo.", {
        diagnosis: "Registrar histopatologia, ubicacion oral, tamano, invasion osea y compromiso funcional.",
        staging: "Evaluar linfonodos regionales, torax e imagen local avanzada si esta disponible.",
        objective: "Definir control local, control regional, manejo sistemico o paliacion.",
        primaryDrug: "Tratamiento sistemico elegido"
      }),
      protocol("tvt", "TVT", "Reproductivo / transmisible", "Ficha base para evolucion de lesiones, respuesta clinica, controles y alta.", {
        diagnosis: "Registrar citologia compatible, localizacion, tamano de lesiones y extension extragenital si existe.",
        staging: "Evaluar estado general, mucosas, hemograma y sitios de implantacion.",
        objective: "Definir remision clinica, numero de aplicaciones planificadas y criterio de alta.",
        primaryDrug: "Quimioterapico elegido",
        schedule: "Segun protocolo validado"
      }),
      protocol("mastocitoma", "Mastocitoma", "Piel / subcutaneo", "Ficha para grado, margenes, estadificacion ganglionar y decision adyuvante.", {
        diagnosis: "Registrar citologia/histopatologia, grado, margenes y marcadores si estan disponibles.",
        staging: "Evaluar ganglio regional, abdomen, hemograma, bioquimica y signos sistemicos.",
        objective: "Definir cirugia, tratamiento adyuvante, enfermedad medible o paliacion.",
        primaryDrug: "Antineoplasico / inhibidor elegido"
      }),
      protocol("osteosarcoma", "Osteosarcoma", "Oseo", "Ficha para dolor, imagen, metastasis, control local y tratamiento sistemico.", {
        diagnosis: "Registrar imagen compatible, citologia/histopatologia si procede, localizacion y dolor.",
        staging: "Completar torax, evaluacion ortopedica, laboratorio y condicion para cirugia o paliacion.",
        objective: "Definir control del dolor, control local, quimioterapia adyuvante o manejo paliativo.",
        primaryDrug: "Antineoplasico adyuvante elegido"
      }),
      protocol("sarcoma-tejidos-blandos", "Sarcoma de Tejidos Blandos", "Tejidos blandos", "Ficha para grado, margenes, resecabilidad, recurrencia y seguimiento.", {
        diagnosis: "Registrar histotipo, grado, margenes quirurgicos, tamano y profundidad.",
        staging: "Evaluar torax, ganglio si aplica y plan de control local.",
        objective: "Definir cirugia, reintervencion, radioterapia, manejo sistemico o vigilancia.",
        primaryDrug: "Tratamiento adyuvante elegido"
      }),
      protocol("tumor-mamario", "Tumor Mamario", "Mamario", "Ficha para cadena mamaria, histopatologia, estadificacion y plan postquirurgico.", {
        diagnosis: "Registrar histopatologia, tipo tumoral, tamano, ulceracion, margenes y ganglio.",
        staging: "Evaluar torax, abdomen, hemograma, bioquimica y estado reproductivo.",
        objective: "Definir control quirurgico, adyuvancia, paliacion o seguimiento.",
        primaryDrug: "Tratamiento sistemico elegido"
      }),
      protocol("carcinoma-celulas-escamosas", "Carcinoma de Celulas Escamosas", "Piel / oral / digital", "Ficha para localizacion, invasion local, ganglios y plan multimodal.", {
        diagnosis: "Registrar sitio primario, histopatologia, invasion local y compromiso de estructuras vecinas.",
        staging: "Evaluar ganglio regional, torax y extension local con imagen si aplica.",
        objective: "Definir control local, cirugia, radioterapia, manejo sistemico o paliacion.",
        primaryDrug: "Tratamiento elegido"
      }),
      protocol("carcinoma-vesical", "Carcinoma Vesical / TCC", "Urinario", "Ficha para signos urinarios, imagen, citologia/histologia y seguimiento.", {
        diagnosis: "Registrar imagen urinaria, citologia/histopatologia si esta disponible y localizacion trigonal/no trigonal.",
        staging: "Evaluar vias urinarias, ganglios, torax, funcion renal y riesgo obstructivo.",
        objective: "Definir control de sintomas, reduccion tumoral, manejo sistemico o soporte.",
        primaryDrug: "Tratamiento medico elegido"
      })
    ],
    protocolSections: [
      { id: "diagnosis", label: "Confirmacion diagnostica" },
      { id: "staging", label: "Estadificacion minima" },
      { id: "objective", label: "Objetivo terapeutico" },
      { id: "protocol", label: "Protocolo elegido" },
      { id: "monitoring", label: "Monitoreo y seguridad" },
      { id: "followUp", label: "Seguimiento" }
    ],
    printLabels: {
      patient: "Paciente",
      owner: "Tutor",
      clinician: "Medico tratante",
      date: "Fecha"
    },
    bsa: {
      formula: "SC (m2) = K x peso(kg)^(2/3) / 100",
      species: [
        { id: "perro", label: "Perro", k: 10.1 },
        { id: "gato", label: "Gato", k: 10 }
      ],
      disclaimer: "Herramienta educativa. La dosis oncologica final debe ser validada por criterio clinico, especie, comorbilidades, laboratorio y protocolo institucional antes de aplicar."
    }
  };
})();
