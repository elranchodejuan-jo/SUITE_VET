(function () {
  "use strict";

  window.SEMIOLOGIA_DATA = {
    moduleLabel: "Semiologia & Anamnesis Pro",
    subtitle: "Entrenador interactivo para preguntar, observar, explorar y documentar.",
    intro:
      "Modulo practico para entrenar anamnesis, examen fisico, habilidades OSCE y documentacion clinica veterinaria.",
    storage: {
      anamnesis: "suiteVet_semiologia_anamnesis",
      examenes: "suiteVet_semiologia_examenes",
      osce: "suiteVet_semiologia_osce",
      logbook: "suiteVet_semiologia_logbook",
      plantillas: "suiteVet_semiologia_plantillas"
    },
    homeSections: [
      { id: "anamnesis", label: "Entrenador de Anamnesis", icon: "AN", description: "Aprende a entrevistar con orden y criterio clinico." },
      { id: "examen", label: "Examen Fisico Guiado", icon: "EF", description: "Checklist por especie para explorar de forma sistematica." },
      { id: "maniobras", label: "Banco de Maniobras Semiologicas", icon: "BM", description: "Tarjetas de tecnicas, hallazgos y errores frecuentes." },
      { id: "osce", label: "Estaciones OSCE", icon: "OS", description: "Practica por estaciones con rubrica, tiempo y feedback." },
      { id: "parametros", label: "Parametros Normales por Especie", icon: "PN", description: "Interpreta signos vitales segun rangos fisiologicos." },
      { id: "logbook", label: "Registro de Habilidades Clinicas", icon: "LG", description: "Monitorea tu avance por habilidad y nivel de autonomia." },
      { id: "casos", label: "Biblioteca de Casos de Practica", icon: "CP", description: "Escenarios listos para entrenar antes de Clinica Integrada." },
      { id: "plantillas", label: "Plantillas y PDF Clinico", icon: "PDF", description: "Plantillas editables para documentar y compartir." }
    ],
    learningChips: [
      "Preguntar con orden",
      "Observar antes de tocar",
      "Identificar signos clinicos",
      "Explorar por sistemas",
      "Registrar hallazgos",
      "Crear lista de problemas",
      "Prepararte para casos clinicos",
      "Practicar tipo OSCE"
    ],
    consultTypes: [
      "Consulta individual",
      "Consulta de lote/hato",
      "Emergencia",
      "Control rutinario",
      "Seguimiento",
      "Prequirurgico",
      "Reproductivo",
      "Produccion"
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
    productionSpecies: ["bovino", "porcino", "ovino", "caprino", "ave"],
    systems: [
      { id: "digestivo", label: "Digestivo" },
      { id: "respiratorio", label: "Respiratorio" },
      { id: "urinario", label: "Urinario" },
      { id: "reproductor", label: "Reproductor" },
      { id: "nervioso", label: "Nervioso" },
      { id: "musculoesqueletico", label: "Musculoesqueletico" },
      { id: "tegumentario", label: "Tegumentario" },
      { id: "cardiovascular", label: "Cardiovascular" },
      { id: "hematologico", label: "Hematologico" },
      { id: "ocular", label: "Ocular" },
      { id: "multisistemico", label: "Multisistemico" },
      { id: "produccion-lote", label: "Produccion/Lote" }
    ],
    systemBadgeClass: {
      "digestivo": "sv-badge-orange",
      "respiratorio": "sv-badge-cyan",
      "urinario": "sv-badge-blue",
      "reproductor": "semi-badge-soft-rose",
      "nervioso": "sv-badge-purple",
      "musculoesqueletico": "semi-badge-soft-amber",
      "tegumentario": "sv-badge-green",
      "cardiovascular": "sv-badge-red",
      "hematologico": "sv-badge-yellow",
      "ocular": "sv-badge-blue",
      "multisistemico": "sv-badge-gray",
      "produccion-lote": "semi-badge-field"
    },
    essentialBlocks: [
      {
        id: "motivo",
        title: "Motivo de consulta",
        questions: [
          "Que problema observo?",
          "Cuando empezo?",
          "Fue repentino o progresivo?",
          "Ha mejorado, empeorado o sigue igual?",
          "Ocurre todo el tiempo o por episodios?",
          "Que signos le preocupan mas?"
        ]
      },
      {
        id: "historia",
        title: "Historia del problema actual",
        questions: [
          "Ha tenido este problema antes?",
          "Hay dolor aparente?",
          "Hay fiebre, decaimiento o cambios de comportamiento?",
          "Hay vomito, diarrea, tos, secreciones, cojera u otros signos?",
          "Hay cambios en consumo de alimento o agua?",
          "Hay cambios en orina o heces?"
        ]
      },
      {
        id: "antecedentes",
        title: "Antecedentes",
        questions: [
          "Vacunacion al dia?",
          "Desparasitacion reciente?",
          "Enfermedades previas?",
          "Cirugias previas?",
          "Alergias o reacciones a medicamentos?",
          "Tratamientos recientes?",
          "Medicacion actual?"
        ]
      },
      {
        id: "ambiente",
        title: "Ambiente y manejo",
        questions: [
          "Vive dentro o fuera de casa?",
          "Contacto con otros animales?",
          "Animales enfermos cercanos?",
          "Cambios recientes de ambiente?",
          "Viajes o traslados recientes?",
          "Cambios de dieta?",
          "Acceso a basura, toxicos, plantas o cuerpos extranos?"
        ]
      }
    ],
    productionQuestions: [
      "Numero total de animales",
      "Numero de animales enfermos",
      "Numero de muertos",
      "Edad o etapa productiva afectada",
      "Morbilidad estimada",
      "Mortalidad estimada",
      "Cambios recientes en alimento",
      "Cambios recientes en agua",
      "Vacunacion del lote",
      "Desparasitacion del lote",
      "Bioseguridad",
      "Ingreso de animales nuevos",
      "Manejo de camas/corrales/instalaciones",
      "Signos predominantes en el lote",
      "Produccion afectada"
    ],
    systemQuestions: {
      "digestivo": [
        "Hay vomito?",
        "Hay diarrea?",
        "Color y consistencia de heces?",
        "Hay sangre o moco?",
        "Hay dolor abdominal?",
        "Comio algo inusual?",
        "Perdio peso?",
        "Hay otros animales con diarrea?"
      ],
      "respiratorio": [
        "Hay tos?",
        "Tos seca o productiva?",
        "Hay secrecion nasal?",
        "Hay dificultad para respirar?",
        "Respira con boca abierta?",
        "Hay intolerancia al ejercicio?",
        "Contacto con animales enfermos?",
        "Hay polvo, humedad o mala ventilacion?"
      ],
      "urinario": [
        "Orina mas de lo normal?",
        "Toma mas agua?",
        "Hay sangre en la orina?",
        "Hay dolor al orinar?",
        "Orina poco o no orina?",
        "La orina cambio de color?",
        "Antecedentes de calculos?"
      ],
      "reproductor": [
        "Esta gestante?",
        "Fecha del ultimo celo?",
        "Fecha del ultimo parto?",
        "Hubo abortos?",
        "Hay secrecion vulvar o prepucial?",
        "Hubo dificultad al parto?",
        "Hay infertilidad o repeticiones de celo?",
        "Hay problemas en crias recien nacidas?"
      ],
      "nervioso": [
        "Hay convulsiones?",
        "Hay incoordinacion?",
        "Hay cambios de conducta?",
        "Hay inclinacion de cabeza?",
        "Hay ceguera aparente?",
        "Hay debilidad?",
        "Hubo golpes, caidas o intoxicacion?"
      ],
      "musculoesqueletico": [
        "Hay cojera?",
        "En que miembro?",
        "Es aguda o cronica?",
        "Empeora con ejercicio?",
        "Hay inflamacion?",
        "Hay rigidez?",
        "Hubo trauma?",
        "En equinos, hay sudoracion, rigidez y orina oscura?"
      ],
      "tegumentario": [
        "Hay prurito?",
        "Hay perdida de pelo?",
        "Hay heridas?",
        "Hay costras?",
        "Hay mal olor?",
        "Afecta a otros animales o personas?",
        "Se usaron productos topicos?"
      ],
      "produccion-lote": [
        "Cuando inicio el brote?",
        "Que grupo etario esta afectado?",
        "Que porcentaje esta enfermo?",
        "Que porcentaje murio?",
        "Hubo cambio de alimento?",
        "Hubo cambio de proveedor?",
        "Hay problemas de agua?",
        "Hay estres termico?",
        "Hubo vacunacion reciente?",
        "Hubo ingreso de animales nuevos?"
      ]
    },
    redFlagRules: [
      { id: "anuria", title: "Alerta urinaria grave", matchAny: ["no orina", "anuria", "no ha orinado"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." },
      { id: "disnea", title: "Emergencia respiratoria", matchAny: ["disnea severa", "no puede respirar", "respira con boca abierta"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." },
      { id: "convulsiones", title: "Emergencia neurologica", matchAny: ["convulsiones repetidas", "convulsiona", "status"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." },
      { id: "shock-anemia", title: "Posible shock o anemia", matchAny: ["mucosas palidas", "debilidad severa", "colapso"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." },
      { id: "colico-equino", title: "Sospecha de colico en equino", matchAny: ["distension abdominal aguda", "dolor abdominal severo", "patea abdomen"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." },
      { id: "rabdomiolisis", title: "Sospecha de mioglobinuria/rabdomiolisis", matchAny: ["orina oscura", "rigidez muscular", "sudoracion intensa"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." },
      { id: "lote-aves", title: "Alerta sanitaria en aves", matchAny: ["mortalidad rapida", "alta mortalidad"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." },
      { id: "abortos-rumiantes", title: "Alerta infecciosa/reproductiva", matchAny: ["abortos multiples", "varios abortos"], recommendation: "Este hallazgo requiere evaluacion prioritaria por un profesional veterinario." }
    ],
    simulationCases: [
      {
        id: "sim-1",
        title: "Canino con vomito y diarrea",
        species: "canino",
        motive: "Vomita desde ayer y tiene diarrea",
        owner: "Ana Torres",
        guide: "Prioriza inicio, frecuencia, vacunacion, desparasitacion y riesgo de cuerpo extrano.",
        keyQuestions: [
          { id: "inicio", label: "Inicio del problema", keywords: ["cuando", "inicio", "empezo"], response: "Empezo ayer en la noche, de forma repentina." },
          { id: "frecuencia-vomito", label: "Frecuencia de vomito", keywords: ["frecuencia", "vomito", "cuantas"], response: "Vomito 5 veces en 12 horas." },
          { id: "heces", label: "Caracteristicas de heces", keywords: ["heces", "diarrea", "consistencia"], response: "Diarrea liquida amarillenta, sin sangre." },
          { id: "vacunacion", label: "Vacunacion", keywords: ["vacuna"], response: "No esta al dia con sus vacunas." },
          { id: "desparasitacion", label: "Desparasitacion", keywords: ["desparas"], response: "No se desparasita hace 8 meses." },
          { id: "basura", label: "Ingesta de basura/cuerpo extrano", keywords: ["basura", "extrano", "comio"], response: "Ayer estuvo hurgando basura en el patio." },
          { id: "agua", label: "Consumo de agua", keywords: ["agua"], response: "Toma poca agua desde esta manana." },
          { id: "estado", label: "Estado general", keywords: ["estado", "animo", "decaido"], response: "Esta decaido y no quiere comer." }
        ]
      },
      {
        id: "sim-2",
        title: "Bovino con baja produccion de leche",
        species: "bovino",
        motive: "Vaca con caida de produccion en 3 dias",
        owner: "Finca El Molino",
        guide: "Investiga lactancia, dieta, agua, mastitis y comportamiento del lote.",
        keyQuestions: [
          { id: "lactancia", label: "Dias en lactancia", keywords: ["lactancia", "dias"], response: "Esta en dia 75 de lactancia." },
          { id: "alimentacion", label: "Alimentacion", keywords: ["aliment", "racion"], response: "Recibe silo de maiz y balanceado 2 veces al dia." },
          { id: "cambio-dieta", label: "Cambios de dieta", keywords: ["cambio", "dieta", "proveedor"], response: "Se cambio de proveedor de concentrado hace 1 semana." },
          { id: "fiebre", label: "Fiebre", keywords: ["fiebre", "temperatura"], response: "No se registro fiebre evidente." },
          { id: "ubre", label: "Ubre/mastitis", keywords: ["ubre", "mastitis", "leche"], response: "Un cuarto esta caliente y doloroso." },
          { id: "agua", label: "Consumo de agua", keywords: ["agua"], response: "El consumo de agua del corral bajo por falla en bebederos." },
          { id: "cc", label: "Condicion corporal", keywords: ["condicion", "corporal"], response: "Condicion corporal 2.5/5, un poco baja." },
          { id: "otros", label: "Otros animales afectados", keywords: ["otros", "afectados", "lote"], response: "Hay 5 vacas mas con caida de produccion." }
        ]
      },
      {
        id: "sim-3",
        title: "Equino con rigidez y orina oscura",
        species: "equino",
        motive: "Caballo rigido despues del entrenamiento",
        owner: "Carlos Mena",
        guide: "Relaciona ejercicio, dieta, descanso, dolor muscular y color de orina.",
        keyQuestions: [
          { id: "ejercicio", label: "Ejercicio reciente", keywords: ["ejercicio", "entreno"], response: "Trabajo intenso ayer por la tarde." },
          { id: "descanso", label: "Dias de descanso", keywords: ["descanso"], response: "Tuvo 4 dias de descanso previo al ejercicio." },
          { id: "dieta", label: "Dieta alta en concentrado", keywords: ["concentrado", "dieta"], response: "Recibe alto concentrado y poco forraje." },
          { id: "sudor", label: "Sudoracion", keywords: ["sudor"], response: "Sudo de forma excesiva durante y despues del trabajo." },
          { id: "dolor", label: "Dolor muscular", keywords: ["dolor", "muscular"], response: "Muestra dolor en grupa y region lumbar." },
          { id: "orina", label: "Color de orina", keywords: ["orina", "color"], response: "Orina color cafe oscuro." },
          { id: "temp", label: "Temperatura", keywords: ["temperatura", "fiebre"], response: "Temperatura 38.7 C." },
          { id: "fc", label: "Frecuencia cardiaca", keywords: ["frecuencia cardiaca", "pulso"], response: "Frecuencia cardiaca 62 lpm." }
        ]
      },
      {
        id: "sim-4",
        title: "Porcinos con tos en lote",
        species: "porcino",
        motive: "Lote de crecimiento con tos persistente",
        owner: "Granja San Pedro",
        guide: "Evalua edad afectada, ventilacion, mortalidad y bioseguridad.",
        keyQuestions: [
          { id: "afectados", label: "Numero de afectados", keywords: ["numero", "afectados"], response: "18 de 80 cerdos presentan tos." },
          { id: "edad", label: "Edad", keywords: ["edad", "semanas"], response: "Animales de 10 a 12 semanas." },
          { id: "ventilacion", label: "Ventilacion", keywords: ["ventilacion"], response: "Ventilacion deficiente y acumulacion de amoniaco." },
          { id: "temperatura", label: "Temperatura ambiental", keywords: ["temperatura", "ambiente"], response: "Picos de calor al mediodia." },
          { id: "vacunas", label: "Vacunacion", keywords: ["vacun"], response: "Vacunacion respiratoria incompleta." },
          { id: "mortalidad", label: "Mortalidad", keywords: ["mortalidad", "muertos"], response: "Mortalidad del 3% en una semana." },
          { id: "ganancia", label: "Ganancia de peso", keywords: ["peso", "ganancia"], response: "Caida marcada de ganancia diaria." },
          { id: "nuevos", label: "Animales nuevos", keywords: ["nuevos", "ingreso"], response: "Ingreso de animales nuevos hace 2 semanas." }
        ]
      },
      {
        id: "sim-5",
        title: "Felino con anorexia e ictericia",
        species: "felino",
        motive: "Gato no come y se ve amarillo",
        owner: "Maria Ponce",
        guide: "Pregunta tiempo sin comer, perdida de peso, farmacos y exposicion a toxicos.",
        keyQuestions: [
          { id: "tiempo", label: "Tiempo sin comer", keywords: ["tiempo", "sin comer", "anorexia"], response: "Lleva 4 dias sin comer casi nada." },
          { id: "peso", label: "Perdida de peso", keywords: ["peso"], response: "Perdio peso en el ultimo mes." },
          { id: "mucosas", label: "Color de mucosas", keywords: ["mucosa", "encia"], response: "Mucosas amarillas, claramente ictericas." },
          { id: "vomito", label: "Vomito", keywords: ["vomito"], response: "Vomito ocasional espumoso." },
          { id: "meds", label: "Medicamentos", keywords: ["medic", "farmaco"], response: "Recibio antibiotico hace 2 semanas." },
          { id: "toxicos", label: "Acceso a toxicos", keywords: ["toxico", "plantas", "quimico"], response: "Acceso a plantas de interior y productos de limpieza." },
          { id: "estres", label: "Estres reciente", keywords: ["estres", "mudanza", "cambio"], response: "Hubo mudanza reciente y cambio de rutina." }
        ]
      },
      {
        id: "sim-6",
        title: "Aves con mortalidad y diarrea",
        species: "ave",
        motive: "Lote de pollos con muertes diarias",
        owner: "Avicola Horizonte",
        guide: "Relaciona mortalidad, manejo de cama, consumo y signos respiratorios.",
        keyQuestions: [
          { id: "edad", label: "Edad del lote", keywords: ["edad"], response: "Lote de 24 dias." },
          { id: "mortalidad", label: "Mortalidad diaria", keywords: ["mortalidad", "muertes"], response: "Mortalidad de 2.8% por dia en los ultimos 3 dias." },
          { id: "vacunas", label: "Vacunas", keywords: ["vacun"], response: "Vacunacion incompleta para Newcastle." },
          { id: "cama", label: "Calidad de cama", keywords: ["cama"], response: "Cama humeda y con olor fuerte." },
          { id: "alimento", label: "Consumo de alimento", keywords: ["alimento"], response: "Disminucion marcada del consumo." },
          { id: "agua", label: "Consumo de agua", keywords: ["agua"], response: "Bebederos sucios y menor consumo." },
          { id: "resp", label: "Signos respiratorios", keywords: ["respir", "tos", "estorn"], response: "Hay estornudos y dificultad respiratoria." },
          { id: "necropsia", label: "Necropsia", keywords: ["necropsia"], response: "Se observaron lesiones respiratorias y entericas." }
        ]
      }
    ],
    examSpeciesModes: [
      { id: "canino-felino", label: "Canino/Felino" },
      { id: "bovino", label: "Bovino" },
      { id: "equino", label: "Equino" },
      { id: "porcino", label: "Porcino" },
      { id: "ovino-caprino", label: "Ovino/Caprino" },
      { id: "ave", label: "Aves" },
      { id: "sistemas", label: "Examen general por sistemas" }
    ],
    physicalExamSteps: {
      general: [
        { id: "obs-distancia", name: "Observacion a distancia", do: "Evalua sin manipular.", observe: "Postura, respiracion, interaccion.", normal: "Actitud alerta.", abnormal: "Disnea, decubito.", error: "Tocar antes de observar." },
        { id: "actitud", name: "Actitud y estado mental", do: "Valora respuesta al entorno.", observe: "Alerta/deprimido.", normal: "Reactivo.", abnormal: "Depresion/estupor.", error: "Confundir ansiedad con dolor." },
        { id: "postura", name: "Postura y marcha", do: "Observa en reposo y movimiento.", observe: "Simetria y apoyo.", normal: "Marcha regular.", abnormal: "Cojera/ataxia.", error: "No evaluar en superficie segura." },
        { id: "cc", name: "Condicion corporal", do: "Usa escala por especie.", observe: "Masa muscular y grasa.", normal: "Puntaje intermedio.", abnormal: "Caquexia/obesidad.", error: "No contextualizar por etapa." },
        { id: "piel", name: "Pelaje, piel o plumaje", do: "Inspecciona cobertura.", observe: "Brillo y lesiones.", normal: "Uniforme.", abnormal: "Alopecia/costras.", error: "No separar pelaje para revisar." },
        { id: "mucosas", name: "Mucosas", do: "Evalua color y humedad.", observe: "Rosadas/palidas/etc.", normal: "Rosadas humedas.", abnormal: "Palidas/cianoticas.", error: "No considerar pigmentacion." },
        { id: "tllc", name: "Tiempo de llenado capilar", do: "Presiona y libera mucosa.", observe: "Tiempo de retorno.", normal: "1-2 segundos.", abnormal: "Prolongado.", error: "Medir en mucosa inadecuada." },
        { id: "hidratacion", name: "Hidratacion", do: "Pliegue cutaneo y ojos.", observe: "Elasticidad.", normal: "Adecuada.", abnormal: "Deshidratacion.", error: "No cruzar con anamnesis." },
        { id: "temp", name: "Temperatura", do: "Toma temperatura.", observe: "Valor numerico.", normal: "Rango normal.", abnormal: "Fiebre/hipotermia.", error: "No registrar unidad." },
        { id: "fc", name: "Frecuencia cardiaca", do: "Ausculta o palpa pulso.", observe: "lpm.", normal: "Rango especie.", abnormal: "Taqui/bradicardia.", error: "Conteo incompleto." },
        { id: "fr", name: "Frecuencia respiratoria", do: "Cuenta movimientos toracicos.", observe: "rpm.", normal: "Ritmo regular.", abnormal: "Taquipnea/esfuerzo.", error: "Medir post-estres." },
        { id: "pulso", name: "Pulso", do: "Palpa arteria periferica.", observe: "Intensidad y ritmo.", normal: "Sincrono.", abnormal: "Pulso debil/irregular.", error: "No comparar con FC." },
        { id: "linfonodos", name: "Linfonodos", do: "Palpa nodos perifericos.", observe: "Tamano y dolor.", normal: "No aumentados.", abnormal: "Adenomegalia.", error: "No comparar bilateral." },
        { id: "ausc-cardiaca", name: "Auscultacion cardiaca", do: "Ausculta focos.", observe: "Ritmo/soplos.", normal: "Regular sin soplos.", abnormal: "Arritmias/soplos.", error: "Auscultar en ruido." },
        { id: "ausc-pulm", name: "Auscultacion pulmonar", do: "Ausculta campos pulmonares.", observe: "Murmullo y ruidos agregados.", normal: "Simetrico.", abnormal: "Estertores/sibilancias.", error: "No comparar ambos lados." },
        { id: "palp-abd", name: "Palpacion abdominal", do: "Palpa cuadrantes.", observe: "Dolor/distension.", normal: "Sin dolor marcado.", abnormal: "Defensa/dolor.", error: "Presion excesiva." },
        { id: "sis-digestivo", name: "Sistema digestivo", do: "Integra signos digestivos.", observe: "Apetito/heces/ruidos.", normal: "Transito regular.", abnormal: "Vomito/diarrea/ileo.", error: "No cruzar con historia." },
        { id: "sis-urinario", name: "Sistema urinario", do: "Evalua miccion.", observe: "Frecuencia/color.", normal: "Miccion normal.", abnormal: "Disuria/anuria.", error: "No preguntar cambios." },
        { id: "sis-repro", name: "Sistema reproductor", do: "Inspeccion segun sexo.", observe: "Secreciones/ciclo.", normal: "Sin anomalias.", abnormal: "Descargas/dolor.", error: "No adaptar por especie." },
        { id: "sis-musculo", name: "Sistema musculoesqueletico", do: "Evalua extremidades.", observe: "Rango/dolor.", normal: "Sin dolor.", abnormal: "Cojera/rigidez.", error: "No comparar lateral." },
        { id: "sis-nervioso", name: "Sistema nervioso basico", do: "Valora reflejos basicos.", observe: "Coordinacion.", normal: "Respuesta adecuada.", abnormal: "Ataxia/paresia.", error: "No localizar problema." },
        { id: "registro", name: "Registro final", do: "Resume y prioriza.", observe: "Coherencia de datos.", normal: "Registro completo.", abnormal: "Datos incompletos.", error: "No cerrar con lista de problemas." }
      ],
      bovino: ["Evaluacion ruminal", "Movimientos ruminales", "Ubre", "Pezunas", "Condicion corporal", "Produccion", "Evaluacion de hato"],
      equino: ["Evaluacion de colico", "Motilidad intestinal por cuadrantes", "Pulso digital", "Cascos", "Hidratacion", "Mucosas", "Dolor abdominal", "Marcha"],
      porcino: ["Evaluacion de lote", "Tos/estornudos", "Condicion corporal", "Piel", "Cojera", "Temperatura ambiental", "Manejo y densidad"],
      ave: ["Plumaje", "Cresta y barbillas", "Respiracion", "Heces", "Buche", "Patas", "Mortalidad de lote", "Produccion de huevos"]
    },
    normalParameters: {
      canino: { temperatura: [37.5, 39.2], fc: [60, 140], fr: [10, 30], tllc: [1, 2], notes: "Variacion por tamano y estres." },
      felino: { temperatura: [38.0, 39.2], fc: [140, 220], fr: [20, 40], tllc: [1, 2], notes: "FC/FR suben por manipulacion." },
      bovino: { temperatura: [38.0, 39.3], fc: [48, 84], fr: [10, 30], tllc: [1, 2], ruminal: [1, 3], notes: "Movimientos ruminales por 2 min." },
      equino: { temperatura: [37.2, 38.3], fc: [28, 44], fr: [8, 16], tllc: [1, 2], motilidad: [4, 12], notes: "Interpretar junto con dolor y ejercicio." },
      porcino: { temperatura: [38.7, 39.8], fc: [70, 120], fr: [10, 20], tllc: [1, 2], notes: "El estres altera signos rapidamente." },
      ovino: { temperatura: [38.3, 39.9], fc: [70, 90], fr: [12, 20], tllc: [1, 2], ruminal: [1, 3], notes: "Rangos varian por edad." },
      caprino: { temperatura: [38.5, 39.9], fc: [70, 95], fr: [15, 30], tllc: [1, 2], ruminal: [1, 3], notes: "Sensibles a deshidratacion." },
      ave: { temperatura: [40.6, 43.0], fc: [220, 360], fr: [15, 40], tllc: [1, 2], notes: "Interpretar con ambiente y lote." }
    },
    parameterMessages: {
      temperatura: {
        high: "Temperatura elevada. Puede asociarse a fiebre, estres, golpe de calor, inflamacion o infeccion.",
        low: "Temperatura baja. Puede asociarse a hipotermia, shock o sepsis avanzada.",
        normal: "Temperatura en rango fisiologico para la especie."
      },
      fc: {
        high: "Taquicardia. Puede asociarse a dolor, fiebre, estres, deshidratacion o shock.",
        low: "Bradicardia. Puede asociarse a alteraciones de conduccion o trastornos metabolicos.",
        normal: "Frecuencia cardiaca en rango fisiologico para la especie."
      },
      fr: {
        high: "Taquipnea. Puede asociarse a estres, dolor, fiebre o compromiso respiratorio.",
        low: "Bradipnea. Puede asociarse a depresion neurologica o fatiga.",
        normal: "Frecuencia respiratoria en rango fisiologico para la especie."
      },
      tllc: {
        high: "TLLC prolongado. Puede sugerir hipoperfusion o deshidratacion.",
        low: "TLLC corto. Puede aparecer en estados hiperdinamicos.",
        normal: "Perfusion capilar dentro de rango esperado."
      },
      ruminal: {
        high: "Movimientos ruminales aumentados. Correlacionar con dieta y cuadro digestivo.",
        low: "Hipomotilidad ruminal. Considerar atonia, dolor o enfermedad sistemica.",
        normal: "Motilidad ruminal esperada para rumiantes."
      },
      motilidad: {
        high: "Motilidad intestinal aumentada. Revisar dolor o alteracion digestiva.",
        low: "Motilidad intestinal disminuida. Puede asociarse a ileo o compromiso sistemico.",
        normal: "Motilidad intestinal esperada para equinos."
      }
    },
    maneuvers: [
      { id: "inspeccion-general", name: "Inspeccion general", system: "Multisistemico", species: "Todas", difficulty: "Basica", type: "Inspeccion", objective: "Detectar alteraciones globales antes de manipular.", how: "Observar desde distancia y luego acercamiento progresivo.", normal: "Actitud alerta y respiracion tranquila.", abnormal: "Decubito, disnea, posturas anti-dolor.", errors: "Iniciar palpacion sin observacion previa.", safety: "Reducir estres y usar contencion amable." },
      { id: "palpacion", name: "Palpacion", system: "Multisistemico", species: "Todas", difficulty: "Basica", type: "Palpacion", objective: "Valorar temperatura, dolor y consistencia.", how: "Palpacion superficial y profunda por regiones.", normal: "Sin dolor ni masas.", abnormal: "Dolor, edema, masas, crepitacion.", errors: "Aplicar presion brusca.", safety: "Respetar respuesta dolorosa." },
      { id: "percusion", name: "Percusion", system: "Digestivo", species: "Todas", difficulty: "Intermedia", type: "Percusion", objective: "Evaluar contenido aire/liquido.", how: "Percusion indirecta por cuadrantes.", normal: "Sonoridad esperada.", abnormal: "Timpanismo o matidez.", errors: "No comparar lados.", safety: "Evitar percusion intensa en dolor agudo." },
      { id: "ausc-cardiaca", name: "Auscultacion cardiaca", system: "Cardiovascular", species: "Todas", difficulty: "Basica", type: "Auscultacion", objective: "Detectar ritmo, frecuencia y soplos.", how: "Auscultar focos valvulares en silencio.", normal: "Ritmo regular sin soplos.", abnormal: "Soplos y arritmias.", errors: "Conteo insuficiente.", safety: "Inmovilizacion con minimo estres." },
      { id: "ausc-pulmonar", name: "Auscultacion pulmonar", system: "Respiratorio", species: "Todas", difficulty: "Basica", type: "Auscultacion", objective: "Reconocer ruidos respiratorios.", how: "Auscultar bilateralmente.", normal: "Murmullo vesicular simetrico.", abnormal: "Estertores, sibilancias.", errors: "Auscultar en ruido.", safety: "Evitar manipulacion excesiva en disnea." },
      { id: "ausc-ruminal", name: "Auscultacion ruminal", system: "Digestivo", species: "Bovino/Ovino/Caprino", difficulty: "Intermedia", type: "Auscultacion", objective: "Cuantificar motilidad ruminal.", how: "Auscultar 2 min en fosa paralumbar izquierda.", normal: "1-3 contracciones/2 min.", abnormal: "Atonia o hipermotilidad.", errors: "Tiempo insuficiente.", safety: "Posicion segura para evitar patadas." },
      { id: "temp", name: "Toma de temperatura", system: "Multisistemico", species: "Todas", difficulty: "Basica", type: "Medicion", objective: "Obtener temperatura confiable.", how: "Termometro rectal/cloacal segun especie.", normal: "Rango fisiologico.", abnormal: "Fiebre o hipotermia.", errors: "No esperar lectura completa.", safety: "Contencion segura y desinfeccion." },
      { id: "mucosas", name: "Evaluacion de mucosas", system: "Cardiovascular", species: "Todas", difficulty: "Basica", type: "Inspeccion", objective: "Valorar perfusion y oxigenacion.", how: "Inspeccion oral/conjuntival.", normal: "Rosadas y humedas.", abnormal: "Palidas/cianoticas/ictericas.", errors: "No considerar pigmentacion.", safety: "Manipulacion gentil." },
      { id: "tllc", name: "Tiempo de llenado capilar", system: "Cardiovascular", species: "Todas", difficulty: "Basica", type: "Medicion", objective: "Estimar perfusion periferica.", how: "Presionar mucosa y medir retorno.", normal: "1-2 segundos.", abnormal: ">2 segundos.", errors: "Usar mucosa inadecuada.", safety: "No forzar apertura oral." },
      { id: "hidratacion", name: "Evaluacion de hidratacion", system: "Multisistemico", species: "Todas", difficulty: "Basica", type: "Inspeccion", objective: "Estimar balance hidrico.", how: "Pliegue cutaneo, ojos y mucosas.", normal: "Elasticidad conservada.", abnormal: "Pliegue lento, ojos hundidos.", errors: "No integrar con historia.", safety: "Evitar piel lesionada." },
      { id: "palp-abd", name: "Palpacion abdominal", system: "Digestivo", species: "Canino/Felino/Equino", difficulty: "Intermedia", type: "Palpacion", objective: "Detectar dolor y organomegalia.", how: "Palpacion bimanual progresiva.", normal: "Sin dolor significativo.", abnormal: "Defensa, distension, masas.", errors: "Palpar bruscamente.", safety: "Suspender ante dolor severo." },
      { id: "linfonodos", name: "Evaluacion de linfonodos", system: "Inmunologico", species: "Todas", difficulty: "Basica", type: "Palpacion", objective: "Valorar respuesta inflamatoria.", how: "Palpacion bilateral de nodos accesibles.", normal: "No aumentados.", abnormal: "Adenomegalia o dolor.", errors: "No comparar lados.", safety: "Evitar presion excesiva." },
      { id: "dolor", name: "Evaluacion de dolor", system: "Multisistemico", species: "Todas", difficulty: "Intermedia", type: "Registro", objective: "Clasificar intensidad y origen.", how: "Escala conductual + palpacion focal.", normal: "Sin dolor evidente.", abnormal: "Vocalizacion, postura anti-dolor.", errors: "Subestimar signos sutiles.", safety: "Priorizar analgesia si corresponde." },
      { id: "marcha", name: "Evaluacion de marcha", system: "Musculoesqueletico", species: "Canino/Equino/Bovino", difficulty: "Intermedia", type: "Inspeccion", objective: "Detectar alteraciones locomotoras.", how: "Caminar/trotar en linea recta y giros.", normal: "Apoyo simetrico.", abnormal: "Cojera o ataxia.", errors: "No evaluar en varias velocidades.", safety: "Superficie no resbaladiza." },
      { id: "cojera", name: "Evaluacion de cojera", system: "Musculoesqueletico", species: "Canino/Equino/Bovino", difficulty: "Intermedia", type: "Registro", objective: "Localizar miembro y gravedad.", how: "Inspeccion dinamica + palpacion dirigida.", normal: "Sin claudicacion.", abnormal: "Apoyo parcial o nulo.", errors: "No usar escala de gravedad.", safety: "No forzar al paciente." },
      { id: "cc-escala", name: "Condicion corporal", system: "Produccion/Lote", species: "Todas", difficulty: "Basica", type: "Registro", objective: "Cuantificar reserva energetica.", how: "Escala BCS por especie.", normal: "Puntaje intermedio.", abnormal: "Delgadez extrema/obesidad.", errors: "No considerar etapa productiva.", safety: "Contencion suave." },
      { id: "ubre", name: "Evaluacion de ubre", system: "Reproductor", species: "Bovino/Caprino/Ovino", difficulty: "Intermedia", type: "Inspeccion", objective: "Detectar mastitis y alteraciones.", how: "Inspeccion, palpacion y prueba de leche.", normal: "Ubre uniforme.", abnormal: "Calor, dolor, induracion.", errors: "No higienizar pezones.", safety: "Bioseguridad durante examen." },
      { id: "pezuna", name: "Evaluacion de casco/pezuna", system: "Musculoesqueletico", species: "Bovino/Equino/Ovino/Caprino", difficulty: "Intermedia", type: "Inspeccion", objective: "Detectar lesiones podales.", how: "Limpieza e inspeccion detallada.", normal: "Superficie integra.", abnormal: "Grietas, ulceras, dolor.", errors: "No limpiar antes de evaluar.", safety: "Contencion fisica segura." },
      { id: "oral", name: "Exploracion oral basica", system: "Digestivo", species: "Canino/Felino/Equino", difficulty: "Intermedia", type: "Inspeccion", objective: "Detectar lesiones orales.", how: "Apertura controlada y luz frontal.", normal: "Mucosa integra.", abnormal: "Ulceras, dolor.", errors: "Iluminacion insuficiente.", safety: "Proteger manos y usar contencion." },
      { id: "ocular", name: "Exploracion ocular basica", system: "Ocular", species: "Todas", difficulty: "Basica", type: "Inspeccion", objective: "Valorar globo ocular y anexos.", how: "Inspeccion de parpados, conjuntiva, pupila.", normal: "Sin secrecion ni opacidad.", abnormal: "Secrecion, opacidad, dolor.", errors: "No comparar ambos ojos.", safety: "Evitar presion sobre globo." },
      { id: "neuro", name: "Exploracion neurologica basica", system: "Nervioso", species: "Todas", difficulty: "Avanzada", type: "Registro", objective: "Detectar deficits neurologicos.", how: "Estado mental, marcha y reacciones posturales.", normal: "Respuesta coordinada.", abnormal: "Ataxia, paresia, convulsiones.", errors: "No localizar lesion probable.", safety: "Evitar estimulos bruscos." }
    ],
    osceStations: [
      { id: "osce-1", title: "Anamnesis en canino con vomito y diarrea", timeMin: 10, objective: "Recolectar informacion clave y priorizar signos de alarma.", materials: ["Formato anamnesis", "Termometro", "Reloj"], instructions: "Realiza entrevista estructurada, identifica red flags y cierra con resumen.", checklist: [{ id: "inicio", label: "Pregunta inicio y evolucion", tags: ["inicio"] }, { id: "sintomas", label: "Caracteriza vomito y diarrea", tags: ["signos"] }, { id: "antecedentes", label: "Pregunta vacunas y desparasitacion", tags: ["antecedentes"] }, { id: "ingesta", label: "Explora dieta/basura/toxicos", tags: ["riesgo"] }, { id: "hidratacion", label: "Pregunta agua y estado general", tags: ["estado"] }, { id: "redflag", label: "Detecta signos de gravedad", tags: ["redflag"] }, { id: "resumen", label: "Cierra con resumen", tags: ["resumen"] }] },
      { id: "osce-2", title: "Examen fisico general en canino/felino", timeMin: 7, objective: "Realizar secuencia basica de examen fisico.", materials: ["Fonendoscopio", "Termometro", "Guantes"], instructions: "Sigue orden semiologico y comunica hallazgos.", checklist: [{ id: "obs", label: "Observa a distancia", tags: ["observacion"] }, { id: "mucosas", label: "Evalua mucosas y TLLC", tags: ["perfusion"] }, { id: "vitales", label: "Toma signos vitales", tags: ["vitales"] }, { id: "ausc", label: "Ausculta corazon y pulmon", tags: ["auscultacion"] }, { id: "palp", label: "Palpacion abdominal", tags: ["palpacion"] }, { id: "registro", label: "Registra hallazgos", tags: ["registro"] }] },
      { id: "osce-3", title: "Examen fisico bovino basico", timeMin: 8, objective: "Integrar examen individual con enfoque productivo.", materials: ["Termometro", "Fonendoscopio", "Formato lote"], instructions: "Incluye rumen, ubre/pezuna y estado productivo.", checklist: [{ id: "rumen", label: "Evalua motilidad ruminal", tags: ["rumen"] }, { id: "ubre", label: "Inspecciona ubre", tags: ["ubre"] }, { id: "pezuna", label: "Revisa pezunas y marcha", tags: ["locomocion"] }, { id: "vitales", label: "Registra signos vitales", tags: ["vitales"] }, { id: "problemas", label: "Formula lista de problemas", tags: ["problemas"] }] },
      { id: "osce-4", title: "Examen fisico equino basico", timeMin: 8, objective: "Reconocer signos clave de dolor abdominal y perfusion.", materials: ["Fonendoscopio", "Reloj", "Termometro"], instructions: "Incluye motilidad por cuadrantes y pulso digital.", checklist: [{ id: "motilidad", label: "Ausculta motilidad por cuadrantes", tags: ["motilidad"] }, { id: "pulso", label: "Evalua pulso digital", tags: ["pulso"] }, { id: "mucosas", label: "Revisa mucosas y TLLC", tags: ["perfusion"] }, { id: "dolor", label: "Valora dolor abdominal", tags: ["dolor"] }, { id: "vitales", label: "Registra signos vitales", tags: ["vitales"] }] },
      { id: "osce-5", title: "Evaluacion de lote porcino con tos", timeMin: 10, objective: "Recolectar datos epidemiologicos y ambientales.", materials: ["Ficha de lote", "Termohigrometro"], instructions: "Caracteriza brote, ventilacion y bioseguridad.", checklist: [{ id: "afectados", label: "Cuantifica afectados", tags: ["epidemiologia"] }, { id: "edad", label: "Identifica grupo etario", tags: ["epidemiologia"] }, { id: "ambiente", label: "Evalua ventilacion y temperatura", tags: ["ambiente"] }, { id: "vacunas", label: "Verifica vacunacion", tags: ["prevencion"] }, { id: "mortalidad", label: "Calcula mortalidad", tags: ["impacto"] }] },
      { id: "osce-6", title: "Evaluacion de ave de produccion con mortalidad", timeMin: 10, objective: "Detectar alertas sanitarias y pasos iniciales.", materials: ["Formato aviar", "Registro mortalidad"], instructions: "Integra consumo, bioseguridad y signos respiratorios.", checklist: [{ id: "mortalidad", label: "Registra mortalidad diaria", tags: ["mortalidad"] }, { id: "consumo", label: "Evalua consumo alimento/agua", tags: ["consumo"] }, { id: "cama", label: "Revisa calidad de cama", tags: ["ambiente"] }, { id: "resp", label: "Identifica signos respiratorios", tags: ["respiratorio"] }, { id: "alerta", label: "Reconoce alerta sanitaria", tags: ["redflag"] }] },
      { id: "osce-7", title: "Anamnesis reproductiva en bovino", timeMin: 8, objective: "Investigar variables reproductivas clave.", materials: ["Ficha reproductiva"], instructions: "Pregunta celo, partos, abortos y manejo de servicio.", checklist: [{ id: "celo", label: "Pregunta fecha de ultimo celo", tags: ["repro"] }, { id: "parto", label: "Pregunta fecha de ultimo parto", tags: ["repro"] }, { id: "abortos", label: "Indaga abortos", tags: ["redflag"] }, { id: "servicio", label: "Revisa historial de servicios", tags: ["repro"] }, { id: "resumen", label: "Resume riesgo reproductivo", tags: ["resumen"] }] },
      { id: "osce-8", title: "Evaluacion de paciente con sospecha de dolor abdominal", timeMin: 8, objective: "Priorizar perfusion, dolor y hallazgos digestivos.", materials: ["Termometro", "Fonendoscopio"], instructions: "No saltes signos vitales ni cierre de entrevista.", checklist: [{ id: "inicio", label: "Caracteriza inicio y progreso del dolor", tags: ["inicio"] }, { id: "mucosas", label: "Evalua mucosas/TLLC", tags: ["perfusion"] }, { id: "vitales", label: "Registra temperatura, FC y FR", tags: ["vitales"] }, { id: "palp", label: "Palpacion abdominal sistematica", tags: ["palpacion"] }, { id: "resumen", label: "Organiza lista de problemas", tags: ["resumen"] }] }
    ],
    osceFeedbackRules: [
      { keyword: "inicio", message: "Falta caracterizar el problema actual." },
      { keyword: "antecedentes", message: "Falta explorar antecedentes clinicos." },
      { keyword: "perfusion", message: "Falta valorar perfusion (mucosas/TLLC)." },
      { keyword: "vitales", message: "Falta informacion objetiva basica (signos vitales)." },
      { keyword: "resumen", message: "Falta cerrar entrevista y organizar la informacion." }
    ],
    skillStates: ["Observado", "Practicado", "Realizado con supervision", "Realizado solo"],
    skills: [
      { name: "Toma de temperatura", category: "Signos vitales", species: "Todas" },
      { name: "Frecuencia cardiaca", category: "Signos vitales", species: "Todas" },
      { name: "Frecuencia respiratoria", category: "Signos vitales", species: "Todas" },
      { name: "Evaluacion de mucosas", category: "Perfusion", species: "Todas" },
      { name: "TLLC", category: "Perfusion", species: "Todas" },
      { name: "Hidratacion", category: "Perfusion", species: "Todas" },
      { name: "Auscultacion cardiaca", category: "Cardiorespiratorio", species: "Todas" },
      { name: "Auscultacion pulmonar", category: "Cardiorespiratorio", species: "Todas" },
      { name: "Palpacion abdominal", category: "Digestivo", species: "Canino/Felino/Equino" },
      { name: "Auscultacion ruminal", category: "Digestivo", species: "Bovino/Ovino/Caprino" },
      { name: "Evaluacion de condicion corporal", category: "Produccion", species: "Todas" },
      { name: "Evaluacion de cojera", category: "Musculoesqueletico", species: "Canino/Equino/Bovino" },
      { name: "Anamnesis general", category: "Anamnesis", species: "Todas" },
      { name: "Anamnesis de lote", category: "Anamnesis", species: "Produccion" },
      { name: "Examen fisico canino", category: "Examen fisico", species: "Canino" },
      { name: "Examen fisico bovino", category: "Examen fisico", species: "Bovino" },
      { name: "Examen fisico equino", category: "Examen fisico", species: "Equino" },
      { name: "Examen fisico porcino", category: "Examen fisico", species: "Porcino" },
      { name: "Examen fisico aviar", category: "Examen fisico", species: "Ave" }
    ],
    caseLibrary: [
      { id: "case-1", title: "Canino con vomito y diarrea", species: "Canino", system: "Digestivo", level: "Basico", objective: "Ordenar anamnesis digestiva y detectar deshidratacion.", motive: "Vomito y diarrea de inicio agudo.", keyQuestions: ["Inicio", "Frecuencia de vomito", "Heces", "Vacunas", "Desparasitacion"], findings: "Deshidratacion leve, dolor abdominal leve.", problems: ["Vomito", "Diarrea", "Anorexia"], redFlags: ["No orina", "Decaimiento severo"], guide: "Prioriza estabilizacion e historia de riesgo alimentario." },
      { id: "case-2", title: "Bovino con baja produccion de leche", species: "Bovino", system: "Produccion/Lote", level: "Intermedio", objective: "Integrar semiologia individual y de lote.", motive: "Caida de produccion en varios animales.", keyQuestions: ["Dias en lactancia", "Dieta", "Agua", "Mastitis", "Otros afectados"], findings: "Ubre caliente en cuarto posterior, BCS bajo.", problems: ["Baja produccion", "Mastitis subclinica"], redFlags: ["Mortalidad creciente"], guide: "Relaciona produccion con manejo y sanidad de corral." },
      { id: "case-3", title: "Equino con rigidez y orina oscura", species: "Equino", system: "Musculoesqueletico", level: "Avanzado", objective: "Sospechar rabdomiolisis por anamnesis y examen.", motive: "Rigidez posterior a ejercicio.", keyQuestions: ["Ejercicio", "Descanso", "Dieta", "Sudoracion", "Color de orina"], findings: "FC alta, dolor muscular, orina oscura.", problems: ["Rigidez", "Orina oscura", "Taquicardia"], redFlags: ["Colapso", "Anuria"], guide: "Diferenciar colico de dano muscular y priorizar fluidoterapia." },
      { id: "case-4", title: "Porcino con tos en lote", species: "Porcino", system: "Respiratorio", level: "Intermedio", objective: "Aplicar enfoque epidemiologico en brotes.", motive: "Tos persistente en crecimiento.", keyQuestions: ["Afectados", "Edad", "Ventilacion", "Vacunas", "Mortalidad"], findings: "Tos seca, disnea leve, ambiente cargado.", problems: ["Tos", "Disnea", "Baja ganancia"], redFlags: ["Disnea severa", "Mortalidad en ascenso"], guide: "Relaciona ambiente y bioseguridad con cuadro respiratorio." },
      { id: "case-5", title: "Felino con anorexia e ictericia", species: "Felino", system: "Hepatobiliar", level: "Avanzado", objective: "Conectar anamnesis nutricional con signos hepatobiliares.", motive: "No come y presenta ictericia.", keyQuestions: ["Tiempo sin comer", "Peso", "Medicacion", "Toxicos", "Estres"], findings: "Mucosas ictericas, letargia.", problems: ["Anorexia", "Ictericia", "Perdida de peso"], redFlags: ["Deshidratacion severa", "Hipotermia"], guide: "Evita sesgo de cierre temprano; prioriza soporte y confirmacion." },
      { id: "case-6", title: "Ave de produccion con mortalidad", species: "Ave", system: "Multisistemico", level: "Avanzado", objective: "Detectar alerta sanitaria y respuesta inicial.", motive: "Mortalidad diaria y diarrea en lote.", keyQuestions: ["Edad del lote", "Mortalidad", "Vacunas", "Cama", "Consumo"], findings: "Diarrea, plumaje erizado, letargia.", problems: ["Mortalidad", "Diarrea", "Baja produccion"], redFlags: ["Mortalidad rapida"], guide: "Escalar bioseguridad y notificacion sanitaria segun contexto." },
      { id: "case-7", title: "Caprino con diarrea cronica", species: "Caprino", system: "Digestivo", level: "Intermedio", objective: "Diferenciar parasitismo de causas nutricionales.", motive: "Diarrea recurrente de semanas.", keyQuestions: ["Duracion", "Desparasitacion", "Lote", "Dieta", "Perdida de peso"], findings: "BCS bajo y deshidratacion moderada.", problems: ["Diarrea cronica", "Perdida de peso"], redFlags: ["Debilidad severa"], guide: "Orienta pruebas coproparasitarias y manejo del pastoreo." },
      { id: "case-8", title: "Bovino con problema reproductivo", species: "Bovino", system: "Reproductor", level: "Intermedio", objective: "Estructurar anamnesis reproductiva de campo.", motive: "Repeticion de celo y baja tasa de preniez.", keyQuestions: ["Ultimo celo", "Parto", "Servicios", "Abortos", "Nutricion"], findings: "Condicion corporal baja, descargas esporadicas.", problems: ["Infertilidad", "Repeticion de celo"], redFlags: ["Abortos multiples"], guide: "Cruza factores nutricionales, sanitarios y de manejo." },
      { id: "case-9", title: "Perro geriatrico con PU/PD", species: "Canino", system: "Urinario", level: "Intermedio", objective: "Priorizar preguntas sobre orina y agua.", motive: "Aumento de consumo de agua y orina.", keyQuestions: ["Cuanta agua", "Frecuencia de orina", "Peso", "Medicacion", "Apetito"], findings: "Poliuria/polidipsia y BCS bajo.", problems: ["PU/PD", "Perdida de peso"], redFlags: ["Anuria"], guide: "Plantea diferenciales endocrinos y renales sin sobrediagnosticar." },
      { id: "case-10", title: "Equino con colico", species: "Equino", system: "Digestivo", level: "Avanzado", objective: "Triage de urgencia con enfoque de perfusion.", motive: "Dolor abdominal agudo.", keyQuestions: ["Inicio", "Episodios previos", "Heces", "Agua", "Ejercicio"], findings: "FC elevada, dolor severo, motilidad disminuida.", problems: ["Dolor abdominal", "Taquicardia", "Hipomotilidad"], redFlags: ["Distension severa", "Mucosas palidas"], guide: "Activar protocolo de emergencia y referencia temprana." }
    ],
    templates: [
      { id: "tpl-anamnesis-individual", title: "Anamnesis individual", content: "Paciente:\\nEspecie:\\nEdad:\\nSexo:\\nMotivo de consulta:\\nInicio/Evolucion:\\nAntecedentes:\\nAmbiente/Manejo:\\nRed flags:\\nResumen:" },
      { id: "tpl-anamnesis-lote", title: "Anamnesis de lote/hato", content: "Lote:\\nEspecie:\\nNumero total:\\nEnfermos:\\nMuertos:\\nMorbilidad/Mortalidad:\\nManejo/Bioseguridad:\\nCambios recientes:\\nSignos predominantes:\\nResumen:" },
      { id: "tpl-examen-general", title: "Examen fisico general", content: "Fecha:\\nPaciente:\\nSignos vitales:\\nMucosas/TLLC:\\nHallazgos por sistemas:\\nLista de problemas:\\nInterpretacion:" },
      { id: "tpl-examen-especie", title: "Examen fisico por especie", content: "Especie:\\nChecklist aplicado:\\nHallazgos normales:\\nHallazgos anormales:\\nProblemas clinicos:\\nPlan de evaluacion:" },
      { id: "tpl-osce", title: "Estacion OSCE", content: "Estacion:\\nTiempo:\\nChecklist:\\nPuntaje:\\nResultado:\\nFeedback docente:" },
      { id: "tpl-habilidad", title: "Registro de habilidad clinica", content: "Habilidad:\\nCategoria:\\nEspecie:\\nEstado:\\nFecha:\\nComentario:\\nAutoevaluacion:" },
      { id: "tpl-resumen-clinica", title: "Resumen para Clinica Integrada", content: "Datos basicos:\\nAnamnesis resumida:\\nSignos vitales:\\nHallazgos relevantes:\\nLista de problemas:\\nRed flags:\\nPrioridades:" },
      { id: "tpl-soap", title: "Nota SOAP basica", content: "S - Subjetivo:\\nO - Objetivo:\\nA - Analisis:\\nP - Plan:" }
    ]
  };
})();
