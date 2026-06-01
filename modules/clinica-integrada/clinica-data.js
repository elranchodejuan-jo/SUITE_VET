(function () {
  "use strict";

  window.CLINICA_DATA = {
    storageKeyCases: "suiteVet_clinica_casos",
    storageKeyTemplates: "suiteVet_clinica_templates",
    moduleLabel: "Clinica Integrada",
    subtitle: "Simulador de razonamiento clinico veterinario",
    intro:
      "Analiza casos clinicos paso a paso: anamnesis, examen fisico, problemas clinicos, diagnosticos diferenciales, examenes complementarios, tratamiento y formato SOAP.",
    trainingTags: [
      "Semiologia",
      "Patologia clinica",
      "Farmacologia",
      "Diagnostico diferencial",
      "Imagenologia",
      "Parasitologia",
      "Enfermedades infecciosas",
      "Produccion animal"
    ],
    species: [
      { id: "canino", label: "Canino" },
      { id: "felino", label: "Felino" },
      { id: "bovino", label: "Bovino" },
      { id: "equino", label: "Equino" },
      { id: "porcino", label: "Porcino" },
      { id: "ovino", label: "Ovino" },
      { id: "caprino", label: "Caprino" },
      { id: "ave", label: "Ave" },
      { id: "otro", label: "Otro" }
    ],
    sexOptions: [
      "Macho",
      "Hembra",
      "Macho castrado",
      "Hembra esterilizada"
    ],
    systems: [
      "Digestivo",
      "Respiratorio",
      "Reproductor",
      "Urinario",
      "Nervioso",
      "Musculoesqueletico",
      "Tegumentario",
      "Cardiovascular",
      "Hematologico",
      "Ocular",
      "Hepatobiliar",
      "Multisistemico"
    ],
    mucosaOptions: ["Rosadas", "Palidas", "Congestivas", "Ictericas", "Cianoticas"],
    tlcOptions: ["Normal", "Prolongado"],
    bodyConditionOptions: ["1/5", "2/5", "3/5", "4/5", "5/5"],
    mentalOptions: ["Alerta", "Deprimido", "Estuporoso", "Comatoso"],
    painOptions: ["Ausente", "Leve", "Moderado", "Severo"],
    linfonodosOptions: ["Normales", "Aumentados", "Dolorosos", "No evaluados"],
    hydrationOptions: ["Normal", "Leve deshidratacion", "Moderada", "Severa"],
    prognosisOptions: ["Bueno", "Reservado", "Malo"],
    problemCatalog: [
      { key: "fiebre", label: "Fiebre" },
      { key: "hipotermia", label: "Hipotermia" },
      { key: "anorexia", label: "Anorexia" },
      { key: "perdida-peso", label: "Perdida de peso" },
      { key: "diarrea", label: "Diarrea" },
      { key: "vomito", label: "Vomito" },
      { key: "tos", label: "Tos" },
      { key: "disnea", label: "Disnea" },
      { key: "secrecion-nasal", label: "Secrecion nasal" },
      { key: "cojera", label: "Cojera" },
      { key: "dolor-abdominal", label: "Dolor abdominal" },
      { key: "distension-abdominal", label: "Distension abdominal" },
      { key: "orina-oscura", label: "Orina oscura" },
      { key: "hematuria", label: "Hematuria" },
      { key: "polidipsia", label: "Polidipsia" },
      { key: "poliuria", label: "Poliuria" },
      { key: "ictericia", label: "Ictericia" },
      { key: "mucosas-palidas", label: "Mucosas palidas" },
      { key: "convulsiones", label: "Convulsiones" },
      { key: "prurito", label: "Prurito" },
      { key: "lesiones-cutaneas", label: "Lesiones cutaneas" },
      { key: "abortos", label: "Abortos" },
      { key: "baja-produccion", label: "Baja produccion" },
      { key: "mortalidad-lote", label: "Mortalidad en lote" },
      { key: "rigidez-muscular", label: "Rigidez muscular" },
      { key: "sudoracion", label: "Sudoracion" },
      { key: "letargia", label: "Letargia" },
      { key: "deshidratacion", label: "Deshidratacion" },
      { key: "taquicardia", label: "Taquicardia" }
    ],
    examCatalog: {
      laboratorio: [
        { key: "hemograma", label: "Hemograma" },
        { key: "bioquimica-sanguinea", label: "Bioquimica sanguinea" },
        { key: "urianalisis", label: "Urianalisis" },
        { key: "coproparasitario", label: "Coproparasitario" },
        { key: "raspado-cutaneo", label: "Raspado cutaneo" },
        { key: "citologia", label: "Citologia" },
        { key: "cultivo-bacteriano", label: "Cultivo bacteriano" },
        { key: "antibiograma", label: "Antibiograma" },
        { key: "serologia", label: "Serologia" },
        { key: "pcr", label: "PCR" },
        { key: "ck", label: "CK (Creatina quinasa)" },
        { key: "ast", label: "AST" },
        { key: "electrolitos", label: "Electrolitos" },
        { key: "bioquimica-hepatica", label: "Bioquimica hepatica" },
        { key: "prueba-rapida-parvovirus", label: "Prueba rapida de parvovirus" }
      ],
      imagen: [
        { key: "radiografia", label: "Radiografia" },
        { key: "ecografia", label: "Ecografia" },
        { key: "endoscopia", label: "Endoscopia" },
        { key: "otro-imagen", label: "Otro estudio de imagen" }
      ],
      campo: [
        { key: "evaluacion-lote", label: "Evaluacion de lote" },
        { key: "revision-alimento", label: "Revision de alimento" },
        { key: "revision-agua", label: "Revision de agua" },
        { key: "necropsia", label: "Necropsia" },
        { key: "evaluacion-bioseguridad", label: "Evaluacion de bioseguridad" }
      ],
      clinico: [
        { key: "examen-ortopedico", label: "Examen ortopedico" }
      ]
    },
    vitalRanges: {
      canino: { temperatura: [37.5, 39.2], fc: [60, 140], fr: [10, 30] },
      felino: { temperatura: [38.0, 39.2], fc: [140, 220], fr: [20, 40] },
      bovino: { temperatura: [38.0, 39.3], fc: [48, 84], fr: [10, 30] },
      equino: { temperatura: [37.2, 38.3], fc: [28, 44], fr: [8, 16] },
      porcino: { temperatura: [38.7, 39.8], fc: [70, 120], fr: [10, 20] },
      ovino: { temperatura: [38.3, 39.9], fc: [70, 90], fr: [12, 20] },
      caprino: { temperatura: [38.5, 39.9], fc: [70, 95], fr: [15, 30] },
      ave: { temperatura: [40.6, 43.0], fc: [220, 360], fr: [15, 40] }
    },
    vitalMessages: {
      temperatura: {
        high: "Temperatura elevada: compatible con fiebre, inflamacion, infeccion, golpe de calor o estres.",
        low: "Temperatura baja: compatible con hipotermia, shock, sepsis avanzada o exposicion al frio.",
        normal: "Temperatura en rango fisiologico para la especie."
      },
      fc: {
        high: "FC elevada (taquicardia): puede relacionarse con dolor, fiebre, deshidratacion, shock o estres.",
        low: "FC disminuida (bradicardia): valorar trastornos de conduccion, hipoperfusion o respuesta vagal.",
        normal: "Frecuencia cardiaca en rango fisiologico para la especie."
      },
      fr: {
        high: "FR elevada (taquipnea): puede relacionarse con dolor, fiebre, acidosis, alteracion respiratoria o estres.",
        low: "FR disminuida (bradipnea): valorar depresion neurologica, fatiga o trastorno metabolico.",
        normal: "Frecuencia respiratoria en rango fisiologico para la especie."
      }
    },
    diferentialRules: [
      {
        id: "bovino-digestivo-fiebre",
        species: "bovino",
        mustProblems: ["diarrea", "fiebre"],
        differentials: [
          {
            nombre: "Salmonelosis",
            sistema: "Digestivo",
            prioridad: "Alta",
            razon: "Diarrea y fiebre en bovinos pueden asociarse a infeccion enterica bacteriana."
          },
          {
            nombre: "Coccidiosis",
            sistema: "Digestivo",
            prioridad: "Media",
            razon: "Procesos entericos con diarrea en bovinos jovenes son compatibles con coccidiosis."
          },
          {
            nombre: "Diarrea viral bovina",
            sistema: "Digestivo",
            prioridad: "Media",
            razon: "El cuadro puede corresponder a enfermedad viral sistemica con compromiso digestivo."
          },
          {
            nombre: "Enterotoxemia",
            sistema: "Digestivo",
            prioridad: "Media",
            razon: "La evolucion aguda digestiva con fiebre puede orientar a clostridiosis enterica."
          },
          {
            nombre: "Parasitismo gastrointestinal",
            sistema: "Digestivo",
            prioridad: "Media",
            razon: "Las parasitosis digestivas siguen siendo un diferencial clave en diarrea bovina."
          }
        ]
      },
      {
        id: "equino-rigidez-orina",
        species: "equino",
        mustProblems: ["orina-oscura", "rigidez-muscular"],
        anyProblemsOrVitals: {
          problems: ["fiebre", "taquicardia"],
          vitals: ["temp-high", "fc-high"]
        },
        differentials: [
          {
            nombre: "Rabdomiolisis de esfuerzo",
            sistema: "Musculoesqueletico",
            prioridad: "Alta",
            razon: "Rigidez muscular y orina oscura en equino sugieren dano muscular con mioglobinuria."
          },
          {
            nombre: "Miopatia nutricional",
            sistema: "Musculoesqueletico",
            prioridad: "Media",
            razon: "Deficiencias antioxidantes pueden cursar con dolor y dano muscular."
          },
          {
            nombre: "Deshidratacion severa",
            sistema: "Multisistemico",
            prioridad: "Media",
            razon: "Hipovolemia y perfusion alterada agravan dano muscular y alteran parametros renales."
          },
          {
            nombre: "Golpe de calor",
            sistema: "Multisistemico",
            prioridad: "Media",
            razon: "Hipertermia por ejercicio y estres puede desencadenar alteraciones musculares."
          },
          {
            nombre: "Mioglobinuria",
            sistema: "Urinario",
            prioridad: "Alta",
            razon: "La orina oscura y antecedente muscular son compatibles con pigmenturia."
          }
        ]
      },
      {
        id: "canino-digestivo",
        species: "canino",
        mustProblems: ["vomito", "diarrea", "anorexia"],
        differentials: [
          {
            nombre: "Gastroenteritis",
            sistema: "Digestivo",
            prioridad: "Alta",
            razon: "Vomito, diarrea y anorexia son compatibles con proceso inflamatorio gastrointestinal agudo."
          },
          {
            nombre: "Parvovirosis",
            sistema: "Digestivo",
            prioridad: "Alta",
            razon: "En caninos, el cuadro digestivo agudo severo obliga a descartar parvovirus."
          },
          {
            nombre: "Intoxicacion",
            sistema: "Digestivo",
            prioridad: "Media",
            razon: "Toxicos alimentarios o domesticos pueden causar sindrome gastroenterico."
          },
          {
            nombre: "Pancreatitis",
            sistema: "Digestivo",
            prioridad: "Media",
            razon: "Pancreatitis puede presentar vomito recurrente, anorexia y dolor abdominal."
          },
          {
            nombre: "Parasitosis gastrointestinal",
            sistema: "Digestivo",
            prioridad: "Media",
            razon: "Las endoparasitosis son diferenciales frecuentes en gastroenteritis canina."
          }
        ]
      },
      {
        id: "porcino-respiratorio",
        species: "porcino",
        mustProblems: ["tos", "fiebre"],
        differentials: [
          {
            nombre: "Complejo respiratorio porcino",
            sistema: "Respiratorio",
            prioridad: "Alta",
            razon: "Tos y fiebre en lote porcino orientan a sindrome respiratorio multifactorial."
          },
          {
            nombre: "Neumonia enzootica",
            sistema: "Respiratorio",
            prioridad: "Media",
            razon: "Mycoplasma puede sostener tos cronica y bajo desempeno productivo."
          },
          {
            nombre: "Influenza porcina",
            sistema: "Respiratorio",
            prioridad: "Alta",
            razon: "Procesos virales agudos cursan con fiebre, tos y rapido contagio."
          },
          {
            nombre: "Actinobacillus pleuropneumoniae",
            sistema: "Respiratorio",
            prioridad: "Media",
            razon: "Brote respiratorio febril debe considerar pleuroneumonia bacteriana."
          }
        ]
      }
    ],
    examSuggestionRules: [
      {
        id: "diarrea-base",
        all: ["diarrea"],
        exams: ["coproparasitario", "hemograma", "bioquimica-sanguinea"]
      },
      {
        id: "diarrea-fiebre-cultivo",
        all: ["diarrea", "fiebre"],
        exams: ["cultivo-bacteriano"]
      },
      {
        id: "respiratorio",
        any: ["tos", "disnea"],
        exams: ["radiografia", "hemograma", "cultivo-bacteriano", "pcr"]
      },
      {
        id: "orina-oscura",
        all: ["orina-oscura"],
        exams: ["urianalisis", "ck", "ast", "bioquimica-sanguinea", "electrolitos"]
      },
      {
        id: "ictericia",
        all: ["ictericia"],
        exams: ["bioquimica-hepatica", "hemograma", "urianalisis"]
      },
      {
        id: "cojera",
        all: ["cojera"],
        exams: ["examen-ortopedico", "radiografia"]
      }
    ],
    practiceCases: [
      {
        id: "pc-001",
        titulo: "Canino con vomito y diarrea aguda",
        especie: "canino",
        sistema: "Digestivo",
        problemas: ["vomito", "diarrea", "anorexia", "deshidratacion"],
        diferenciales: ["Gastroenteritis", "Parvovirosis", "Parasitosis gastrointestinal", "Intoxicacion", "Pancreatitis"],
        examenes: ["hemograma", "coproparasitario", "prueba-rapida-parvovirus", "bioquimica-sanguinea"],
        guiaDocente:
          "Enfoca al estudiante en triage digestivo, hidratacion, descarte de parvovirosis y criterios de hospitalizacion."
      },
      {
        id: "pc-002",
        titulo: "Bovino con diarrea y fiebre",
        especie: "bovino",
        sistema: "Digestivo",
        problemas: ["diarrea", "fiebre", "anorexia", "deshidratacion"],
        diferenciales: ["Salmonelosis", "Coccidiosis", "Parasitismo gastrointestinal", "Diarrea viral bovina"],
        examenes: ["coproparasitario", "hemograma", "bioquimica-sanguinea", "cultivo-bacteriano"],
        guiaDocente:
          "Priorizacion por impacto productivo, bioseguridad y enfoque de medicina de poblaciones."
      },
      {
        id: "pc-003",
        titulo: "Equino con rigidez muscular y orina oscura",
        especie: "equino",
        sistema: "Musculoesqueletico",
        problemas: ["rigidez-muscular", "sudoracion", "orina-oscura", "taquicardia"],
        diferenciales: ["Rabdomiolisis de esfuerzo", "Miopatia nutricional", "Golpe de calor"],
        examenes: ["ck", "ast", "urianalisis", "electrolitos"],
        guiaDocente:
          "Relaciona ejercicio, nutricion y dano muscular con lectura secuencial de laboratorio."
      },
      {
        id: "pc-004",
        titulo: "Porcino con tos y fiebre",
        especie: "porcino",
        sistema: "Respiratorio",
        problemas: ["tos", "fiebre", "disnea", "baja-produccion"],
        diferenciales: ["Complejo respiratorio porcino", "Neumonia enzootica", "Influenza porcina"],
        examenes: ["necropsia", "pcr", "cultivo-bacteriano", "evaluacion-lote"],
        guiaDocente:
          "Trabajo por lotes: integrar epidemiologia, ambiente y manejo sanitario en granja."
      },
      {
        id: "pc-005",
        titulo: "Felino con anorexia e ictericia",
        especie: "felino",
        sistema: "Hepatobiliar",
        problemas: ["anorexia", "ictericia", "perdida-peso", "letargia"],
        diferenciales: ["Lipidosis hepatica", "Colangitis", "Hemoparasitosis", "Obstruccion biliar"],
        examenes: ["bioquimica-hepatica", "hemograma", "ecografia", "urianalisis"],
        guiaDocente:
          "Promueve correlacion entre examen clinico, bioquimica hepatica e imagen."
      },
      {
        id: "pc-006",
        titulo: "Ave de produccion con mortalidad en lote",
        especie: "ave",
        sistema: "Multisistemico",
        problemas: ["mortalidad-lote", "baja-produccion", "disnea", "diarrea"],
        diferenciales: ["Enfermedad de Newcastle", "Influenza aviar", "Colibacilosis", "Coccidiosis"],
        examenes: ["necropsia", "evaluacion-lote", "pcr", "cultivo-bacteriano", "coproparasitario"],
        guiaDocente:
          "Desarrolla decisiones rapidas de campo, contencion y notificacion sanitaria."
      }
    ],
    soapTemplates: [
      {
        id: "tpl-individual",
        titulo: "Caso clinico individual",
        cuerpo:
          "S - Subjetivo:\nMotivo de consulta y antecedentes relevantes.\n\nO - Objetivo:\nSignos vitales, examen fisico y hallazgos clave.\n\nA - Analisis:\nLista de problemas, diferenciales y sustento clinico.\n\nP - Plan:\nExamenes, tratamiento, educacion al propietario y seguimiento."
      },
      {
        id: "tpl-lote",
        titulo: "Caso de produccion / lote",
        cuerpo:
          "S - Subjetivo:\nAntecedentes del lote, cambios productivos, manejo y bioseguridad.\n\nO - Objetivo:\nMorbimortalidad, observaciones de campo, necropsias y ambiente.\n\nA - Analisis:\nSindrome principal, diferenciales de impacto poblacional y riesgo sanitario.\n\nP - Plan:\nMuestreos, medidas de contencion, tratamiento/metafilaxia y monitoreo por indicadores."
      },
      {
        id: "tpl-emergencia",
        titulo: "Emergencia",
        cuerpo:
          "S - Subjetivo:\nInicio agudo, evento desencadenante y signos reportados por tutor/encargado.\n\nO - Objetivo:\nABC, perfusion, dolor y hallazgos de emergencia.\n\nA - Analisis:\nProblemas criticos y diferenciales que comprometen vida.\n\nP - Plan:\nEstabilizacion inmediata, analgesia, fluidos, pruebas urgentes y reevaluacion continua."
      },
      {
        id: "tpl-postop",
        titulo: "Control posoperatorio",
        cuerpo:
          "S - Subjetivo:\nEvolucion desde cirugia, apetito, dolor y conducta.\n\nO - Objetivo:\nRevision de herida, temperatura, hidratacion, parametros cardiovasculares.\n\nA - Analisis:\nCurso esperado vs complicaciones tempranas.\n\nP - Plan:\nCuraciones, analgesia, antibiotico si aplica y fecha de control."
      },
      {
        id: "tpl-infeccioso",
        titulo: "Caso infeccioso",
        cuerpo:
          "S - Subjetivo:\nHistoria epidemiologica, vacunacion y contacto con animales enfermos.\n\nO - Objetivo:\nSignos sistemicos, sindrome predominante y pruebas rapidas disponibles.\n\nA - Analisis:\nDiferenciales infecciosos priorizados por especie y contexto.\n\nP - Plan:\nAislamiento, diagnostico confirmatorio, tratamiento inicial y bioseguridad."
      },
      {
        id: "tpl-parasitario",
        titulo: "Caso parasitario",
        cuerpo:
          "S - Subjetivo:\nDesparasitacion previa, ambiente y exposicion.\n\nO - Objetivo:\nEstado corporal, signos digestivos/cutaneos y carga presuntiva.\n\nA - Analisis:\nDiferenciales parasitarios y riesgos asociados.\n\nP - Plan:\nExamen coproparasitario/raspado, antiparasitarios, higiene y control del entorno."
      }
    ]
  };
})();
