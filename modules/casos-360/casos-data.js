// =============================================================================
// SUITE VET 2.0 — modules/casos-360/casos-data.js
// Semillas y Estructura de Datos para Casos 360 (142 Casos Clínicos en Total)
// =============================================================================

(function () {
  "use strict";

  const dataStore = {
    storageKeyAttempts: "suiteVet_casos360_attempts",
    storageKeyRemediations: "suiteVet_casos360_remediations",
    storageKeyCustomCases: "suiteVet_casos360_custom_cases",

    competencies: [
      { code: "COMP-ANAM", label: "Anamnesis", desc: "Habilidad para recopilar historia clínica relevante del paciente y entorno." },
      { code: "COMP-EFIS", label: "Examen Físico", desc: "Destreza en la realización e interpretación de maniobras clínicas." },
      { code: "COMP-RAZ", label: "Razonamiento Clínico", desc: "Integración de hallazgos, formulación de diferenciales y juicio diagnóstico." },
      { code: "COMP-LAB", label: "Interpretación Laboratorial", desc: "Solicitud y lectura crítica de pruebas diagnósticas complementarias." },
      { code: "COMP-TER", label: "Plan Terapéutico", desc: "Selección de fármacos, dosis, soporte de vida y manejo clínico." },
      { code: "COMP-SEG", label: "Seguridad Clínica", desc: "Prevención de riesgos iatrogénicos y bioseguridad poblacional." }
    ],

    seedScenarios: []
  };

  // ---------------------------------------------------------------------------
  // 1. ESCENARIOS SEMILLA HECHOS A MANO
  // ---------------------------------------------------------------------------
  const scenarioProfiles = [
    // Caso 1: Bovino Respiratorio (Semilla 1)
    {
      id: "bovino-respiratorio",
      title: "Complejo Respiratorio Bovino en Ternero Lactante",
      species: "bovino",
      system: "Respiratorio",
      difficulty: "Media",
      estimatedMinutes: 20,
      shortDescription: "Ternero Holstein de 2 meses en crianza artificial presenta fiebre, disnea y tos. Evalúa el estado del lote, realiza el diagnóstico clínico y aplica medidas sanitarias de contención.",
      coverImage: "🐄",
      motive: "Se reporta un ternero lactante decaído, con respiración acelerada y tos en el sector de crianza individual.",
      intro: "Estás en una finca lechera. El encargado de crianza te llama preocupado porque el ternero de la jaula 14 (macho, Holstein, 2 meses) no se tomó la leche esta mañana y respira con dificultad. Al acercarte al lote, notas que hay otros terneros tosiendo levemente. En el piso se observan restos de secreción nasal bilateral.",
      objectives: [
        "Identificar signos clínicos del Complejo Respiratorio Bovino (CRB)",
        "Aplicar técnicas de anamnesis en medicina poblacional/lote",
        "Establecer diagnósticos diferenciales y priorizar pruebas complementarias",
        "Implementar medidas críticas de bioseguridad (aislamiento y manejo sanitario)",
        "Prescribir terapia antimicrobiana adecuada"
      ],
      stageIds: {
        motivo_consulta: "b1-motivo",
        anamnesis: "b1-anamnesis",
        examen_fisico: "b1-examen",
        pruebas_complementarias: "b1-pruebas",
        interpretacion: "b1-interpretacion",
        diagnosticos_diferenciales: "b1-diferenciales",
        plan_terapeutico: "b1-terapeutico",
        tutor_recs: "b1-tutor",
        reflection: "b1-reflexion"
      },
      anamnesis: [
        { id: "bq1", text: "¿Cuál ha sido el consumo de calostro al nacer?", correct: true, feedback: "Esencial. La falla en la transferencia de inmunidad pasiva (FTIP) es el principal factor predisponente.", score: 10 },
        { id: "bq2", text: "¿Cuál es el protocolo de vacunación de las madres y de los terneros?", correct: true, feedback: "Correcto. Permite evaluar la protección contra patógenos virales (BVDV, BRSV, PI3, IBR).", score: 10 },
        { id: "bq3", text: "¿Qué tipo de alimento balanceado iniciador consumen?", correct: false, feedback: "Poco relevante en esta etapa de sospecha respiratoria aguda.", score: 0 },
        { id: "bq4", text: "¿Cómo está la ventilación y la densidad en el galpón de crianza?", correct: true, feedback: "Esencial. El hacinamiento y acumulación de amoníaco dañan el aparato mucociliar.", score: 10 },
        { id: "bq5", text: "¿De qué color es la pintura de las jaulas individuales?", correct: false, feedback: "Irrelevante para el caso clínico.", score: -5, penalty: true }
      ],
      examenFisico: [
        { id: "bm1", text: "Tomar temperatura rectal", correct: true, feedback: "Correcto. Registras 40.7 °C (Fiebre alta).", score: 10 },
        { id: "bm2", text: "Auscultación pulmonar y traqueal", correct: true, feedback: "Correcto. Detectas sibilancias, estertores húmedos bilaterales en la zona craneoventral y roce pleural.", score: 10 },
        { id: "bm3", text: "Auscultación ruminal (movimientos ruminales)", correct: false, feedback: "No es prioritario, el rumen apenas está desarrollándose en un lactante de 2 meses.", score: 0 },
        { id: "bm4", text: "Evaluar reflejo degutorio y laringotraqueal", correct: true, feedback: "Correcto. Reflejo laringotraqueal altamente positivo (tos seca y dolorosa).", score: 10 },
        { id: "bm5", text: "Palpación de linfonodos submandibulares", correct: true, feedback: "Correcto. Linfonodos reactivos y aumentados de tamaño.", score: 10 }
      ],
      pruebas: [
        {
          id: "bt1",
          text: "Hemograma completo",
          correct: true,
          feedback: "Correcto. Leucocitosis con neutrofilia y desviación a la izquierda.",
          score: 10,
          asset: {
            type: "lab_table",
            title: "Hemograma - Ternero 14",
            content: [
              ["Parámetro", "Valor", "Rango Ref"],
              ["Leucocitos", "18.5 x10^3/uL", "4.0 - 12.0"],
              ["Neutrófilos", "11.2 x10^3/uL", "0.6 - 4.0"],
              ["Fibrinógeno", "900 mg/dL", "100 - 500"]
            ]
          }
        },
        {
          id: "bt2",
          text: "Ultrasonografía pulmonar de campo",
          correct: true,
          feedback: "Correcto. Áreas de consolidación lobular (hepatización) y líneas pleurales irregulares.",
          score: 10,
          asset: {
            type: "image",
            title: "Ecografía Pulmonar de Campo",
            fileUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80"
          }
        },
        {
          id: "bt3",
          text: "Necropsia de un ternero del lote (fallecido hace 4 horas)",
          correct: true,
          feedback: "Excelente decisión epidemiológica. La necropsia revela bronconeumonía fibrinosa craneoventral con pleuritis fibrinosa adherente.",
          score: 15,
          asset: {
            type: "timeline_event",
            title: "Informe de Necropsia",
            content: "Pulmón con consolidación rojo-grisácea craneoventral, abundante fibrina amarilla en la pleura visceral y edema interlobulillar."
          }
        },
        {
          id: "bt4",
          text: "Coprológico por flotación",
          correct: false,
          feedback: "No prioritario. Los parásitos pulmonares tienen un periodo prepatente más largo.",
          score: 0
        }
      ],
      differentials: [
        { id: "bd1", text: "Mannheimia haemolytica (Fiebre del embarque)", priority: 1, feedback: "Es el patógeno bacteriano oportunista más importante y virulento en bronconeumonías fibrinosas agudas." },
        { id: "bd2", text: "Pasteurella multocida", priority: 2, feedback: "Causa neumonía purulenta o bronconeumonía, común pero menos fulminante que Mannheimia." },
        { id: "bd3", text: "Virus Sincitial Respiratorio Bovino (BRSV)", priority: 3, feedback: "Causa daño endotelial e intersticial inicial, abriendo paso a infecciones bacterianas." },
        { id: "bd4", text: "Dictyocaulus viviparus (Bronquitis parasitaria)", priority: 4, feedback: "Causa neumonía parasitaria, usualmente en animales bajo pastoreo." }
      ],
      terapeutico: [
        { id: "btx1", text: "Tratamiento individual: Tulatromicina (2.5 mg/kg SC) o Florfenicol (20 mg/kg IM)", correct: true, feedback: "Correcto. Antimicrobianos con excelente penetración en parénquima pulmonar.", score: 10 },
        { id: "btx2", text: "Administrar Flunixin Meglumine (2.2 mg/kg IV)", correct: true, feedback: "Correcto. AINE de elección para controlar la fiebre y reducir la inflamación pulmonar.", score: 10 },
        { id: "btx3", text: "Antibiograma e hidratación oral forzada con sonda esofágica", correct: false, feedback: "Innecesario si el ternero aún tiene reflejo de deglución.", score: 0 },
        { id: "btx4", text: "Aislar inmediatamente al ternero afectado en una jaula de bioseguridad separada", correct: true, feedback: "¡Criterio crítico de seguridad epidemiológica! Evita propagación por aerosoles.", score: 15, safetyCritical: true }
      ],
      tutorRecs: [
        { id: "br1", text: "Mejorar la ventilación en el galpón de crianza y evitar corrientes directas", correct: true, feedback: "Correcto. Dispersa amoníaco y humedad.", score: 10 },
        { id: "br2", text: "Revisar y asegurar la toma de calostro (mínimo 4 L en las primeras 6 horas)", correct: true, feedback: "Correcto. Base de la inmunoprevención.", score: 10 },
        { id: "br3", text: "Cambiar la dieta a forraje fibroso basto exclusivo", correct: false, feedback: "Incorrecto. Terneros de 2 meses no tienen rumen desarrollado para digerir forrajes exclusivamente.", score: -5 },
        { id: "br4", text: "Implementar metafilaxia con Tulatromicina en los terneros expuestos", correct: true, feedback: "Correcto. Indicado para cortar el brote.", score: 10 }
      ]
    },

    // Caso 2: Canino Gastroenteritis (Semilla 2)
    {
      id: "canino-gastroenteritis",
      title: "Gastroenteritis Hemorrágica por Parvovirus Canino",
      species: "canino",
      system: "Digestivo",
      difficulty: "Alta",
      estimatedMinutes: 25,
      shortDescription: "Cachorro Rottweiler de 3 meses se presenta con vómitos incoercibles, diarrea sanguinolenta fétida y deshidratación severa. Realiza la evaluación clínica, estabiliza hemodinámicamente y define la terapia intensiva.",
      coverImage: "🐶",
      motive: "Cachorro Rottweiler con vómitos frecuentes y diarrea líquida oscura fétida.",
      intro: "Se presenta a consulta de urgencias un cachorro Rottweiler de 3 meses de edad, macho entero. La propietaria indica que hace 2 días comenzó con decaimiento, dejó de comer and hoy comenzó con vómitos espumosos y diarrea muy líquida, oscura, de olor extremadamente fétido (metálico). No cuenta con vacunas vigentes.",
      objectives: [
        "Reconocer los signos clínicos y patológicos de la gastroenteritis por parvovirus canino",
        "Evaluar el nivel de deshidratación y calcular el déficit de fluidos",
        "Identificar contraindicaciones terapéuticas críticas (terapia oral en vómito activo)",
        "Interpretar pruebas de laboratorio hematológicas y bioquímicas en sepsis digestiva",
        "Diseñar un protocolo de soporte hemodinámico y cobertura antimicrobiana dual"
      ],
      stageIds: {
        motivo_consulta: "c2-motivo",
        anamnesis: "c2-anamnesis",
        examen_fisico: "c2-examen",
        pruebas_complementarias: "c2-pruebas",
        interpretacion: "c2-interpretacion",
        diagnosticos_diferenciales: "c2-diferenciales",
        plan_terapeutico: "c2-terapeutico",
        tutor_recs: "c2-tutor",
        reflection: "c2-reflexion"
      },
      anamnesis: [
        { id: "cq1", text: "¿Tiene contacto con otros perros o ha salido a la calle recientemente?", correct: true, feedback: "Esencial. Evalúa el riesgo de exposición a focos infecciosos de parvovirus.", score: 10 },
        { id: "cq2", text: "¿Cuántas vacunas ha recibido y cuál fue la fecha de la última dosis?", correct: true, feedback: "Excelente. Confirma la sospecha de susceptibilidad inmunitaria.", score: 10 },
        { id: "cq3", text: "¿Qué tipo de juguetes muerde en casa habitualmente?", correct: false, feedback: "Poco relevante considerando el cuadro clínico infeccioso evidente.", score: 5 },
        { id: "cq4", text: "¿Ha ingerido algún producto químico, veneno o planta en el jardín?", correct: true, feedback: "Correcto. Permite descartar intoxicaciones agudas.", score: 10 },
        { id: "cq5", text: "¿De qué marca es el shampoo con el que lo bañan?", correct: false, feedback: "Irrelevante para este caso de emergencia digestiva.", score: -5, penalty: true }
      ],
      examenFisico: [
        { id: "cm1", text: "Evaluar estado de hidratación y tiempo de llenado capilar (TLLC)", correct: true, feedback: "¡Crítico! Detectas mucosas pegajosas, pálidas, TLLC de 3.5 s, pulso débil. Compatible con deshidratación grave (10-12%) y shock.", score: 15 },
        { id: "cm2", text: "Tomar temperatura rectal y frecuencia cardíaca", correct: true, feedback: "Correcto. Temperatura de 39.9 °C (Fiebre) y FC de 160 lpm (Taquicardia compensatoria).", score: 10 },
        { id: "cm3", text: "Palpación abdominal cuidadosa", correct: true, feedback: "Correcto. Manifiesta dolor marcado en la zona mesogástrica, con asas distendidas con gas.", score: 10 },
        { id: "cm4", text: "Examen del reflejo pupilar y fondo de ojo", correct: false, feedback: "El reflejo pupilar no es prioritario ante una urgencia hemodinámica.", score: 0 },
        { id: "cm5", text: "Examen otoscópico bilateral", correct: false, feedback: "Irrelevante en el triage de gastroenteritis hemorrágica.", score: -5, penalty: true }
      ],
      pruebas: [
        {
          id: "ct1",
          text: "Prueba rápida de antígeno de Parvovirus (ELISA/Inmunocromatografía)",
          correct: true,
          feedback: "¡Correcto! Prueba rápida positiva fuerte para antígeno de Parvovirus Canino.",
          score: 15,
          asset: {
            type: "image",
            title: "Prueba Rápida Parvovirus Canino (+)",
            fileUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e902a?w=500&q=80"
          }
        },
        {
          id: "ct2",
          text: "Hemograma completo",
          correct: true,
          feedback: "Excelente. Muestra leucopenia marcada (2,100/uL) con neutropenia severa.",
          score: 10,
          asset: {
            type: "lab_table",
            title: "Hemograma - Parvovirosis",
            content: [
              ["Parámetro", "Valor", "Rango Ref"],
              ["Leucocitos", "2.1 x10^3/uL", "6.0 - 17.0"],
              ["Neutrófilos", "0.8 x10^3/uL", "3.0 - 11.5"],
              ["Hematocrito", "32 %", "37 - 55"]
            ]
          }
        },
        {
          id: "ct3",
          text: "Bioquímica de Electrolitos séricos y Glucemia",
          correct: true,
          feedback: "Correcto. Muestra hipopotasemia severa (K+: 2.8 mEq/L) y desequilibrio electrolítico debido a pérdidas digestivas masivas.",
          score: 10,
          asset: {
            type: "lab_table",
            title: "Electrolitos y Glucemia - Parvo",
            content: [
              ["Parámetro", "Valor", "Rango Ref"],
              ["Potasio (K+)", "2.8 mEq/L", "3.5 - 5.8"],
              ["Glucemia", "55 mg/dL", "70 - 120"]
            ]
          }
        },
        {
          id: "ct4",
          text: "Radiografía simple de abdomen",
          correct: false,
          feedback: "No es la primera opción. Revela gas pero no obstrucciones.",
          score: 0
        }
      ],
      differentials: [
        { id: "cd1", text: "Parvovirosis Canina (Gastroenteritis viral)", priority: 1, feedback: "Edad, falta de vacunas, diarrea hemorrágica fétida y leucopenia son signos patognomónicos." },
        { id: "cd2", text: "Parasitosis severa por Ancylostoma caninum", priority: 2, feedback: "Causa diarrea oscura y anemia, pero no suele causar leucopenia severa." },
        { id: "cd3", text: "Obstrucción intestinal por cuerpo extraño", priority: 3, feedback: "Común en cachorros, cursa con vómitos incoercibles pero no suele causar leucopenia severa." },
        { id: "cd4", text: "Coronavirus canino / Gastroenteritis bacteriana", priority: 4, feedback: "Causa gastroenteritis, pero los signos son usualmente más autolimitantes y menos letales." }
      ],
      terapeutico: [
        { id: "ctx1", text: "Administrar medicamentos antieméticos y dieta líquida por vía oral de forma inmediata", correct: false, feedback: "¡GRAVE ERROR! Está prohibida la vía oral (NPO) en pacientes con vómito activo. Aumenta riesgo de intususcepción o neumonía por aspiración.", score: -20, safetyCritical: true },
        { id: "ctx2", text: "Fluidoterapia IV agresiva con Ringer Lactato suplementado con KCl y Dextrosa al 5%", correct: true, feedback: "Correcto. Es la piedra angular del tratamiento para corregir la deshidratación y evitar la hipoglucemia.", score: 15 },
        { id: "ctx3", text: "Terapia antiemética IV: Maropitant (1 mg/kg SC/IV cada 24h)", correct: true, feedback: "Excelente. Antiemético de elección con acción central y periférica.", score: 10 },
        { id: "ctx4", text: "Terapia antibiótica parenteral de amplio espectro (Ampicilina IV + Enrofloxacina SC)", correct: true, feedback: "Correcto. Crucial para prevenir la translocación bacteriana y la sepsis en un paciente con barrera intestinal destruida.", score: 10 }
      ],
      tutorRecs: [
        { id: "cr1", text: "Completar el esquema de vacunación una vez recuperado totalmente (2-3 semanas post-alta)", correct: true, feedback: "Correcto. Vital para prevenir recaídas.", score: 10 },
        { id: "cr2", text: "Desinfección estricta del ambiente con cloro diluido (1:30)", correct: true, feedback: "Correcto. El parvovirus es altamente resistente en el ambiente y persiste por meses.", score: 10 },
        { id: "cr3", text: "Introducir alimentación oral sólida normal de inmediato al llegar a casa", correct: false, feedback: "Incorrecto. Se debe reintroducir dieta blanda digestible gradualmente.", score: -5 },
        { id: "cr4", text: "Cuarentena estricta del paciente, evitando contacto con cachorros no vacunados por al menos 4 semanas", correct: true, feedback: "Correcto. El perro recuperado sigue eliminando partículas virales.", score: 10 }
      ]
    },

    // Caso 3: Felino Lipidosis
    {
      id: "felino-lipidosis",
      title: "Lipidosis Hepática Felina por Anorexia Prolongada",
      species: "felino",
      system: "Hepatobiliar",
      difficulty: "Alta",
      estimatedMinutes: 20,
      shortDescription: "Paciente felino obeso con historial de estrés y 7 días de anorexia presenta ictericia marcada. Planifica el diagnóstico y el soporte nutricional crítico.",
      coverImage: "🐱",
      motive: "Gato doméstico con ictericia generalizada y debilidad progresiva.",
      intro: "Gato macho castrado, mestizo de 6 años, obeso (peso previo 7.2 kg), presenta anorexia total desde hace 7 días tras la llegada de una nueva mascota al hogar. Se le observa sumamente deprimido, con las mucosas y piel marcadamente amarillas (ictéricas) y debilidad cervical (ventroflexión).",
      objectives: ["Diagnosticar lipidosis hepática felina", "Establecer soporte nutricional por sonda", "Monitorear síndrome de realimentación"],
      anamnesis: [
        { text: "Confirmar anorexia absoluta de 7 días", correct: true, feedback: "Correcto. La anorexia prolongada en gatos obesos desencadena movilización masiva de lípidos al hígado.", score: 10 },
        { text: "¿Ha presentado episodios de vómito o salivación excesiva?", correct: true, feedback: "Correcto. Indica náuseas y compromiso gastrointestinal.", score: 10 },
        { text: "¿Qué tipo de arena sanitaria utiliza en su caja?", correct: false, feedback: "Irrelevante para el cuadro metabólico hepático.", score: -5 }
      ],
      examenFisico: [
        { text: "Evaluar color de mucosas y escleras", correct: true, feedback: "Correcto. Mucosas y escleras marcadamente amarillas (ictericia severa).", score: 10 },
        { text: "Evaluar tono muscular y flexión del cuello", correct: true, feedback: "Correcto. Presenta ventroflexión cervical (asociada a hipopotasemia severa).", score: 10 },
        { text: "Palpación abdominal profunda", correct: true, feedback: "Correcto. Hepatomegalia palpable, bordes del hígado redondeados y lisos.", score: 10 }
      ],
      pruebas: [
        {
          text: "Bioquímica hepática y Glucemia",
          correct: true,
          feedback: "Correcto. Elevación severa de FA y ALT, con GGT normal o levemente elevada (patrón clásico de lipidosis).",
          score: 15,
          asset: {
            type: "lab_table",
            title: "Bioquímica Sanguínea - Felino",
            content: [
              ["Parámetro", "Valor", "Rango Ref"],
              ["FA (Fosfatasa)", "850 U/L", "10 - 90"],
              ["ALT (GPT)", "320 U/L", "15 - 80"],
              ["GGT", "1.5 U/L", "0 - 6"],
              ["Bilirrubina Total", "5.8 mg/dL", "0.1 - 0.4"]
            ]
          }
        },
        {
          text: "Ecografía hepatobiliar",
          correct: true,
          feedback: "Correcto. Parénquica hepático difusamente hiperecogénico (hígado graso brillante).",
          score: 10,
          asset: {
            type: "image",
            title: "Ecografía Hepática Felina",
            fileUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80"
          }
        }
      ],
      differentials: [
        { text: "Lipidosis Hepática Primaria/Secundaria", priority: 1, feedback: "La ictericia, anorexia prolongada e hiperecogenicidad la hacen la principal sospecha." },
        { text: "Colangitis / Colangiohepatitis", priority: 2, feedback: "Proceso inflamatorio hepático común, cursa con elevación muy marcada de GGT en contraste con lipidosis." },
        { text: "Linfoma Hepático", priority: 3, feedback: "Neoplasia infiltrativa común en gatos que causa disfunción hepática difusa." },
        { text: "Anemia Hemolítica Inmunomediada (AHIM)", priority: 4, feedback: "Causa ictericia prehepática, pero el hemograma mostraría una fuerte anemia." }
      ],
      terapeutico: [
        { text: "Colocación de sonda de esofagostomía e inicio de soporte nutricional con microdosis", correct: true, feedback: "Correcto. La alimentación enteral temprana es la única cura real para revertir la lipidosis.", score: 15 },
        { text: "Suplementación con Cloruro de Potasio (KCl) en fluidoterapia IV y Vitamina K1", correct: true, feedback: "Correcto. Corrige la ventroflexión por hipopotasemia y previene coagulopatías.", score: 10 },
        { text: "Forzar alimentación oral con jeringa de forma agresiva", correct: false, feedback: "¡RIESGO CRÍTICO! Forzar la alimentación oral induce aversión al alimento permanente y riesgo de neumonía por aspiración.", score: -20, safetyCritical: true }
      ],
      tutorRecs: [
        { text: "Evitar cambios drásticos de ambiente y manejar el estrés doméstico de forma gradual", correct: true, feedback: "Correcto. Previene futuras crisis de anorexia.", score: 10 },
        { text: "Monitorear la sonda de alimentación diariamente por signos de infección", correct: true, feedback: "Correcto. Evita sepsis local por la sonda.", score: 10 }
      ]
    },

    // Caso 4: Equino Cólico
    {
      id: "equino-colico",
      title: "Síndrome Abdominal Agudo (Cólico) Espasmódico Equino",
      species: "equino",
      system: "Digestivo",
      difficulty: "Media",
      estimatedMinutes: 15,
      shortDescription: "Caballo Criollo de 5 años presenta dolor abdominal agudo, sudoración y revolcones. Evalúa y diferencia cólico médico de resolución quirúrgica urgente.",
      coverImage: "🐴",
      motive: "Caballo pateándose el abdomen, sudoroso y adoptando posturas anormales.",
      intro: "Caballo Criollo de 5 años, macho, es encontrado en su pesebrera inquieto, pateándose el flanco, raspando el suelo y echándose y levantándose repetidamente. Presenta sudoración profusa y ausencia de defecación en las últimas 12 horas.",
      objectives: ["Identificar signos de cólico en caballos", "Realizar sondaje nasogástrico seguro", "Establecer terapia analgésica controlada"],
      anamnesis: [
        { text: "Confirmar cambios recientes en dieta o lote de heno", correct: true, feedback: "Esencial. Los cambios bruscos de alimento causan disbiosis y espasmos.", score: 10 },
        { text: "¿Cuándo fue la última desparasitación y con qué fármaco?", correct: true, feedback: "Correcto. Las altas cargas de parásitos (Strongylus) causan cólicos tromboembólicos.", score: 10 },
        { text: "¿El animal está vacunado contra Influenza Equina?", correct: false, feedback: "No guarda relación directa con el cólico espasmódico agudo.", score: -5 }
      ],
      examenFisico: [
        { text: "Auscultar cuadrantes abdominales (motilidad intestinal)", correct: true, feedback: "Correcto. Detectas borborigmos hiperactivos (espasmos) iniciales y luego hipomotilidad.", score: 10 },
        { text: "Tomar frecuencia cardíaca y evaluar mucosas", correct: true, feedback: "Correcto. FC de 52 lpm. Mucosas rosadas. Indica dolor moderado sin shock shock severo inminente.", score: 15 },
        { text: "Palpación rectal", correct: true, feedback: "Correcto. Detectas asas del colon menor con gas, sin evidencia de torsión o obstrucción.", score: 10 }
      ],
      pruebas: [
        {
          text: "Sondaje nasogástrico para evaluar reflujo gastroesplénico",
          correct: true,
          feedback: "¡Correcto y obligatorio! Obtienes menos de 1 L de líquido verdoso (reflujo normal). Descarta sobrecarga gástrica.",
          score: 15,
          asset: {
            type: "timeline_event",
            title: "Sondaje Gástrico",
            content: "Se pasa la sonda nasogástrica sin resistencia. No se obtiene reflujo gástrico a la sifonación."
          }
        },
        {
          text: "Abdominocentesis (análisis de líquido peritoneal)",
          correct: true,
          feedback: "Correcto. Líquido peritoneal claro, proteínas bajas (<2.0 g/dL), descartando compromiso vascular.",
          score: 10,
          asset: {
            type: "lab_table",
            title: "Líquido Peritoneal - Equino",
            content: [
              ["Parámetro", "Valor", "Rango Ref"],
              ["Aspecto", "Claro/Amarillo Pajizo", "Claro/Amarillo"],
              ["Proteínas Totales", "1.6 g/dL", "< 2.5"]
            ]
          }
        }
      ],
      differentials: [
        { text: "Cólico Espasmódico (Indigestión gaseosa)", priority: 1, feedback: "La motilidad hiperactiva fluctuante y parámetros hemodinámicos estables la sustentan." },
        { text: "Impactación del Colon Pélvico", priority: 2, feedback: "Común, pero se palparía una masa firme en la palpación rectal." },
        { text: "Torsión del Colon Mayor", priority: 3, feedback: "Quirúrgico. La frecuencia cardíaca superaría los 80 lpm, con dolor intratable y shock endotóxico inmediato." },
        { text: "Enteritis Anterior (Duodeno-yeyunitis)", priority: 4, feedback: "Causaría abundante reflujo nasogástrico fétido (>10 L) y fiebre." }
      ],
      terapeutico: [
        { text: "Administrar Flunixin Meglumine (1.1 mg/kg IV) y N-butilbromuro de hioscina (antiespasmódico)", correct: true, feedback: "Correcto. Alivio eficaz del dolor visceral y espasmo en caballos.", score: 15 },
        { text: "Caminar al caballo lentamente para estimular el tránsito", correct: true, feedback: "Correcto. Evita autotraumatismos y estimula el peristaltismo.", score: 10 },
        { text: "Administrar dosis masivas de laxantes antes de confirmar permeabilidad con sonda", correct: false, feedback: "¡Riesgo crítico! Puede provocar ruptura gástrica si el estómago está distendido.", score: -15, safetyCritical: true }
      ],
      tutorRecs: [
        { text: "Suspender la alimentación sólida hasta que cesen los signos y haya defecación normal", correct: true, feedback: "Correcto. Evita la sobrecarga del tránsito comprometido.", score: 10 },
        { text: "Establecer un programa de alimentación con raciones divididas y agua limpia", correct: true, feedback: "Correcto. Previene cólicos recurrentes.", score: 10 }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // 2. CASOS ADICIONALES (MÓDULOS 5 A 42)
  // ---------------------------------------------------------------------------
  const extraProfilesData = [
    { id: "porcino-app", title: "Actinobacilosis Porcina Aguda (APP)", species: "porcino", system: "Respiratorio", diff: "Media", cover: "🐷" },
    { id: "ovino-enterotoxemia", title: "Enterotoxemia Clostridial por C. perfringens", species: "ovino", system: "Digestivo", diff: "Media", cover: "🐑" },
    { id: "caprino-mastitis", title: "Mastitis Gangrenosa Caprina por S. aureus", species: "caprino", system: "Reproductor", diff: "Media", cover: "🐐" },
    { id: "ave-newcastle", title: "Sospecha de Peste Aviar / Newcastle", species: "ave", system: "Multisistemico", diff: "Alta", cover: "🐔" },
    { id: "canino-otitis", title: "Otitis Externa Bilateral por Malassezia", species: "canino", system: "Tegumentario", diff: "Fácil", cover: "🐶" },
    { id: "felino-flutd", title: "Síndrome Urinario Felino Obstructivo (FLUTD)", species: "felino", system: "Urinario", diff: "Alta", cover: "🐱" },
    { id: "equino-laminitis", title: "Laminitis Aguda por Sobrecarga de Carbohidratos", species: "equino", system: "Musculoesqueletico", diff: "Alta", cover: "🐴" },
    { id: "bovino-hipocalcemia", title: "Hipocalcemia Posparto (Fiebre de Leche)", species: "bovino", system: "Multisistemico", diff: "Fácil", cover: "🐄" },
    { id: "porcino-sdrp", title: "Síndrome Respiratorio y Reproductivo Porcino (PRRS)", species: "porcino", system: "Reproductor", diff: "Alta", cover: "🐷" },
    { id: "canino-moquillo", title: "Moquillo Canino con Signos Neurológicos", species: "canino", system: "Nervioso", diff: "Alta", cover: "🐶" },
    { id: "felino-leucemia", title: "Anemia Arregenerativa por Leucemia Felina (ViLeF)", species: "felino", system: "Hematologico", diff: "Media", cover: "🐱" },
    { id: "bovino-tuberculosis", title: "Reacción a la Tuberculina en Bovinos de Carne", species: "bovino", system: "Respiratorio", diff: "Media", cover: "🐄" },
    { id: "equino-tetanos", title: "Tétanos Equino Secundario a Herida Punzante", species: "equino", system: "Nervioso", diff: "Alta", cover: "🐴" },
    { id: "canino-piometra", title: "Piometra de Cuello Cerrado en Canino", species: "canino", system: "Reproductor", diff: "Alta", cover: "🐶" },
    { id: "felino-irc", title: "Falla Renal Crónica Agudizada en Gato Geriátrico", species: "felino", system: "Urinario", diff: "Media", cover: "🐱" },
    { id: "bovino-mastitis-sub", title: "Mastitis Subclínica por Streptococcus uberis", species: "bovino", system: "Reproductor", diff: "Media", cover: "🐄" },
    { id: "porcino-colibacilosis", title: "Colibacilosis Neonatal en Lechones", species: "porcino", system: "Digestivo", diff: "Fácil", cover: "🐷" },
    { id: "ave-coccidiosis", title: "Coccidiosis Cecal por Eimeria tenella", species: "ave", system: "Digestivo", diff: "Media", cover: "🐔" },
    { id: "canino-cushing", title: "Hiperadrenocorticismo Canino (Síndrome de Cushing)", species: "canino", system: "Multisistemico", diff: "Alta", cover: "🐶" },
    { id: "felino-hiper", title: "Hipertiroidismo Felino y Cardiopatía Secundaria", species: "felino", system: "Cardiovascular", diff: "Alta", cover: "🐱" },
    { id: "equino-influenza", title: "Brote de Influenza Equina en Centro Hípico", species: "equino", system: "Respiratorio", diff: "Fácil", cover: "🐴" },
    { id: "bovino-anaplasmosis", title: "Anaplasmosis Bovina (Tristeza Parasitaria)", species: "bovino", system: "Hematologico", diff: "Media", cover: "🐄" },
    { id: "porcino-erisipela", title: "Erisipela Porcina Aguda (Mal de Rojo)", species: "porcino", system: "Tegumentario", diff: "Media", cover: "🐷" },
    { id: "canino-dermatofito", title: "Dermatofitosis por Microsporum canis", species: "canino", system: "Tegumentario", diff: "Fácil", cover: "🐶" },
    { id: "felino-pif", title: "Peritonitis Infecciosa Felina (PIF) Efusiva", species: "felino", system: "Multisistemico", diff: "Alta", cover: "🐱" },
    { id: "equino-babesiosis", title: "Babesiosis Equina (Piroplasmosis)", species: "equino", system: "Hematologico", diff: "Media", cover: "🐴" },
    { id: "bovino-carbunco", title: "Sospecha de Carbunco Bacteridiano (Antrax)", species: "bovino", system: "Multisistemico", diff: "Alta", cover: "🐄" },
    { id: "ave-coriza", title: "Coriza Infecciosa Aviar en Gallinas Ponedoras", species: "ave", system: "Respiratorio", diff: "Media", cover: "🐔" },
    { id: "canino-lepto", title: "Leptospirosis Aguda con Insuficiencia Renal", species: "canino", system: "Urinario", diff: "Alta", cover: "🐶" },
    { id: "felino-toxo", title: "Toxoplasmosis Ocular e Intersticial Felina", species: "felino", system: "Multisistemico", diff: "Media", cover: "🐱" },
    { id: "equino-rinoneumonitis", title: "Aborto por Herpesvirus Equino Tipo 1", species: "equino", system: "Reproductor", diff: "Alta", cover: "🐴" },
    { id: "bovino-digital", title: "Dermatitis Digital Bovina en Tambo Lechero", species: "bovino", system: "Tegumentario", diff: "Media", cover: "🐄" },
    { id: "porcino-parvo", title: "Falla Reproductiva por Parvovirus Porcino", species: "porcino", system: "Reproductor", diff: "Media", cover: "🐷" },
    { id: "ave-micoplasmosis", title: "Micoplasmosis Respiratoria por M. gallisepticum", species: "ave", system: "Respiratorio", diff: "Fácil", cover: "🐔" },
    { id: "canino-erliquia", title: "Ehrlichiosis Canina Aguda Transmitida por Garrapatas", species: "canino", system: "Hematologico", diff: "Media", cover: "🐶" },
    { id: "felino-sarna", title: "Sarna Notoédrica Felina Crónica", species: "felino", system: "Tegumentario", diff: "Fácil", cover: "🐱" },
    { id: "equino-encefalitis", title: "Sospecha de Encefalomielitis Equina del Oeste", species: "equino", system: "Nervioso", diff: "Alta", cover: "🐴" },
    { id: "bovino-fasciola", title: "Fasciolasis Crónica e Hipoproteinemia Bovina", species: "bovino", system: "Digestivo", diff: "Media", cover: "🐄" }
  ];

  // Rellenar los 38 casos intermedios en el catálogo de perfiles
  extraProfilesData.forEach((ep) => {
    scenarioProfiles.push({
      id: ep.id,
      title: ep.title,
      species: ep.species,
      system: ep.system,
      difficulty: ep.diff,
      estimatedMinutes: ep.diff === "Alta" ? 25 : ep.diff === "Media" ? 20 : 15,
      shortDescription: `Caso clínico de complejidad ${ep.diff}. Diagnostica y trata esta alteración del sistema ${ep.system} en ${ep.species}.`,
      coverImage: ep.cover,
      motive: `Se presenta un paciente de especie ${ep.species} con signos compatibles con trastorno del sistema ${ep.system}.`,
      intro: `Paciente es ingresado a consulta. Manifiesta signos clínicos focales del sistema ${ep.system} de evolución aguda. Se sospecha de ${ep.title}.`,
      objectives: [
        `Identificar signos clave en ${ep.system}`,
        `Prescribir tratamiento adaptado en ${ep.species}`,
        `Evitar complicaciones iatrogénicas en la terapia`
      ],
      anamnesis: [
        { text: "¿Cuál ha sido la duración y severidad de los signos?", correct: true, feedback: "Correcto. Permite valorar el curso fisiopatológico.", score: 10 },
        { text: "¿Se han aplicado tratamientos previos en el hogar?", correct: true, feedback: "Correcto. Evita interacciones de riesgo.", score: 10 },
        { text: "¿Qué color tiene el comedero o el bebedero?", correct: false, feedback: "Irrelevante para el diagnóstico clínico.", score: -5 }
      ],
      examenFisico: [
        { text: "Tomar temperatura, frecuencia cardíaca y respiratoria", correct: true, feedback: "Correcto. Permite el triaje básico del paciente.", score: 10 },
        { text: "Inspección visual del aparato afectado", correct: true, feedback: "Correcto. Revela congestión y debilidad local.", score: 10 },
        { text: "Revisar reflejos medulares completos", correct: false, feedback: "Solo relevante si sospechas de trauma espinal focal.", score: 0 }
      ],
      pruebas: [
        {
          text: "Hemograma completo y perfil básico",
          correct: true,
          feedback: "Correcto. Muestra leucocitosis reactiva y desequilibrio electrolítico leve.",
          score: 10,
          asset: {
            type: "lab_table",
            title: "Laboratorio Clínico",
            content: [
              ["Parámetro", "Valor", "Rango Ref"],
              ["Leucocitos", "15.2 x10^3/uL", "Especie Dependiente"],
              ["Proteínas", "7.8 g/dL", "Normal"]
            ]
          }
        },
        {
          text: "Ecografía o Radiografía diagnóstica",
          correct: true,
          feedback: "Correcto. Revela cambios compatibles con inflamación del órgano afectado.",
          score: 10,
          asset: {
            type: "image",
            title: "Estudio de Imagenología",
            fileUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e902a?w=500&q=80"
          }
        }
      ],
      differentials: [
        { text: ep.title, priority: 1, feedback: "Es la sospecha diagnóstica más probable por la epidemiología y clínica." },
        { text: "Proceso infeccioso secundario inespecífico", priority: 2, feedback: "Puede ocurrir como complicación pero no es el origen primario." },
        { text: "Intoxicación por toxinas ambientales", priority: 3, feedback: "Diferencial de descarte ante falta de respuesta terapéutica inicial." },
        { text: "Neoplasia local infiltrativa", priority: 4, feedback: "Menos probable debido al curso agudo." }
      ],
      terapeutico: [
        { text: "Tratamiento antibiótico o antiparasitario de elección y fluidos de soporte", correct: true, feedback: "Correcto. Combate la etiología y estabiliza al paciente.", score: 15 },
        { text: "Administrar dosificación doble sin monitoreo renal", correct: false, feedback: "¡Riesgo crítico! Exceso de dosis puede inducir toxicidad o falla orgánica severa.", score: -20, safetyCritical: true }
      ],
      tutorRecs: [
        { text: "Monitoreo diario de signos clínicos y control estricto de dosis", correct: true, feedback: "Correcto. Asegura la efectividad del alta.", score: 10 },
        { text: "Desinfectar y ventilar el espacio habitual del animal", correct: true, feedback: "Correcto. Minimiza recargas y contagios en lote/hogar.", score: 10 }
      ]
    });
  });

  // ---------------------------------------------------------------------------
  // 3. GENERACIÓN SISTEMÁTICA DE 100 CASOS ADICIONALES (COMBINATORIA)
  // ---------------------------------------------------------------------------
  const speciesList = ["canino", "felino", "equino", "bovino", "porcino", "ovino", "caprino", "ave"];
  const systemsList = ["Digestivo", "Respiratorio", "Reproductor", "Urinario", "Nervioso", "Musculoesqueletico", "Tegumentario", "Cardiovascular", "Hematologico", "Multisistemico"];
  const difficulties = ["Fácil", "Media", "Alta"];

  const diseasesTemplates = {
    Digestivo: [
      { name: "Coccidiosis Entérica", desc: "diarrea acuosa/hemorrágica en animales jóvenes.", tx: "Toltrazurilo o Sulfas", SC: "Deshidratación desatendida" },
      { name: "Acidosis Ruminal / Indigestión Aguda", desc: "sobrecarga alimentaria con parálisis del rumen.", tx: "Bicarbonato de Sodio y fluidoterapia", SC: "Uso de laxantes oleosos forzados" },
      { name: "Gastroenteritis Infecciosa Aguda", desc: "cuadro entérico agudo severo con pérdidas de electrolitos.", tx: "Fluidoterapia IV y protectores de mucosa", SC: "Alimentación oral forzada durante vómitos" },
      { name: "Toxemia Digestiva", desc: "absorción de toxinas intestinales con postración.", tx: "Antitoxina y fluidos intravenosos", SC: "Administrar sedantes depresores cardíacos" }
    ],
    Respiratorio: [
      { name: "Pleuritis / Neumonía Infecciosa", desc: "disnea restrictiva, fiebre alta y roce pleural.", tx: "Antibioticoterapia y AINEs", SC: "Uso de antitusígenos centrales en tos productiva" },
      { name: "Asma / Broncoespasmo Agudo", desc: "crisis disneica espasmódica con sibilancias expiratorias.", tx: "Dexametasona y broncodilatadores", SC: "Dar fluidos orales a presión en disnea" },
      { name: "Complejo Respiratorio Viral", desc: "infección vírica en lote con descargas nasales abundantes.", tx: "Soporte general, aislamiento e hidratación", SC: "Omitir el aislamiento bioseguro de lote" },
      { name: "Neumonía Exudativa Bacteriana", desc: "consolidación pulmonar y estertores húmedos traqueales.", tx: "Ceftiofur o Enrofloxacina parenterales", SC: "Dar glucocorticoides en neumonías agudas bacterianas" }
    ],
    Reproductor: [
      { name: "Metritis Puerperal Séptica", desc: "descarga vaginal fétida post-parto y postración febril.", tx: "Lavado uterino y Ceftiofur IV", SC: "Omitir antibioticoterapia sistémica urgente" },
      { name: "Mastitis Gangrenosa Aguda", desc: "glándula mamaria fría, purpúrea y secreción serosanguinolenta.", tx: "Flunixin Meglumine, fluidos e intramamarios", SC: "Retardar el vaciado manual de la ubre infectada" },
      { name: "Aborto Infeccioso de Lote", desc: "epidemiología de abortos en hembras gestantes.", tx: "Aislamiento inmediato y desinfección", SC: "Manipular material fetal sin equipo de protección (zoonosis)" },
      { name: "Piometra Aguda", desc: "útero distendido con colecta purulenta y signos de sepsis.", tx: "Cirugía (OVH) o prostaglandinas según cuello", SC: "Administrar oxitocina en piometra de cuello cerrado" }
    ],
    Urinario: [
      { name: "Insuficiencia Renal Aguda", desc: "oliguria o anuria con uremia y deshidratación severa.", tx: "Fluidoterapia fisiológica controlada y diuréticos", SC: "Administrar AINEs nefrotóxicos (e.g. Flunixin)" },
      { name: "Obstrucción Uretral por Cálculos", desc: "distensión vesical turgente dolorosa e incapacidad de micción.", tx: "Cateterismo uretral y cistotomía urgente", SC: "Forzar micción con diuréticos sin desobstruir" },
      { name: "Cistitis Bacteriana Recurrente", desc: "infección del tracto inferior con polaquiuria y hematuria.", tx: "Amoxicilina con Ácido Clavulánico", SC: "Suspender antibióticos antes de 7 días" },
      { name: "Glomerulonefritis Crónica", desc: "proteinuria severa e hipoalbuminemia.", tx: "Dieta hipoproteica y bloqueadores SRAA", SC: "Fluidoterapia agresiva sin monitorear sobrecarga" }
    ],
    Nervioso: [
      { name: "Meningoencefalitis Infecciosa", desc: "fiebre, hiperestesia, opistótonos y ataxia severa.", tx: "Antibióticos que crucen barrera y dexametasona", SC: "Omitir terapia antiinflamatoria cerebral urgente" },
      { name: "Intoxicación por Plomo o Químicos", desc: "ceguera aparente, convulsiones y salivación.", tx: "Terapia de quelación y sulfato de magnesio", SC: "Sondaje nasogástrico forzado en animales convulsivos" },
      { name: "Polioencefalomalacia", desc: "ataxia, ceguera cortical y presión de cabeza contra objetos.", tx: "Administración urgente de Tiamina (Vitamina B1)", SC: "Retardar terapia con Vitamina B1 más de 12h" },
      { name: "Síndrome Vestibular Periférico", desc: "inclinación de cabeza, nistagmo horizontal y ataxia.", tx: "Antiinflamatorios y antibióticos óticos", SC: "Realizar maniobras bruscas de tracción cervical" }
    ],
    Musculoesqueletico: [
      { name: "Miopatía / Rabdomiolisis de Esfuerzo", desc: "dolor muscular severo, marcha rígida y orina oscura.", tx: "Fluidoterapia IV y analgésicos no nefrotóxicos", SC: "Forzar el ejercicio físico continuo del paciente" },
      { name: "Artritis Séptica Aguda", desc: "claudicación severa, articulación distendida y caliente.", tx: "Lavado articular y antibioterapia sistémica", SC: "Administrar corticoides intraarticulares con infección activa" },
      { name: "Laminitis / Infozamiento Agudo", desc: "postura antiálgica (apoyo en talones) y pulso digital.", tx: "AINEs, crioterapia local y herrado correctivo", SC: "Forzar la marcha sobre superficies duras" },
      { name: "Miositis Inflamatoria Aguda", desc: "inflamación dolorosa focalizada de grupos musculares.", tx: "Reposo estricto, frío local y AINEs", SC: "Masaje profundo vigoroso en fase aguda" }
    ],
    Tegumentario: [
      { name: "Dermatofitosis / Tiña Fúngica", desc: "lesiones alopécicas circulares con descamación.", tx: "Antifúngicos tópicos (Itraconazol o Enilconazol)", SC: "Dar corticoides sistémicos de larga acción" },
      { name: "Sarna Sarcóptica / Notoédrica", desc: "prurito intenso, costras en bordes auriculares y cara.", tx: "Ivermectina SC o Selamectina tópica", SC: "No tratar a los animales en contacto directo" },
      { name: "Pioderma Profundo bacteriano", desc: "costras, fístulas con drenaje purulento y celulitis.", tx: "Cefalexina u Enrofloxacina oral por 4-6 semanas", SC: "Suspender antibióticos al desaparecer signos superficiales" },
      { name: "Dermatitis Alérgica Aguda", desc: "prurito generalizado, eritema difuso y pápulas.", tx: "Antihistamínicos y baños de avena/corticoides cortos", SC: "Uso continuo e indefinido de corticoides sistémicos" }
    ],
    Cardiovascular: [
      { name: "Insuficiencia Cardíaca Congestiva", desc: "intolerancia al ejercicio, disnea, tos nocturna y soplo.", tx: "Furosemida, Pimobendán e IECA", SC: "Fluidoterapia IV agresiva con soluciones salinas" },
      { name: "Derrame Pericárdico / Taponamiento", desc: "ruidos cardíacos apagados, pulso paradójico e ingurgitación.", tx: "Pericardiocentesis ecoguiada de urgencia", SC: "Administrar diuréticos masivos antes de drenar el derrame" },
      { name: "Dirofilariosis Cardiopulmonar", desc: "tos, letargia y presencia de microfilarias en sangre.", tx: "Adulticida controlado y lactonas macrocíclicas", SC: "Forzar ejercicio intenso durante el tratamiento adulticida" },
      { name: "Miocarditis Aguda Bacteriana/Viral", desc: "arritmias ventriculares, debilidad y fiebre.", tx: "Antiarrítmicos y soporte de perfusión", SC: "Administrar bloqueadores de calcio inotrópicos negativos" }
    ],
    Hematologico: [
      { name: "Anemia Hemolítica Inmunomediada", desc: "mucosas pálidas/ictéricas, orina oscura y debilidad.", tx: "Inmunosupresores (Prednisolona) y soporte", SC: "Administrar transfusión sanguínea sin tipificación previa" },
      { name: "Hemoparasitosis Vectorial (Tick-borne)", desc: "fiebre, trombocitopenia, letargia y esplenomegalia.", tx: "Doxiciclina o Imidocarb parenterales", SC: "Ignorar desparasitación externa de garrapatas" },
      { name: "Trombocitopenia Inmunomediada", desc: "petequias en encías y piel, sangrado nasal (epistaxis).", tx: "Corticoides y Vincristina IV dosis única", SC: "Inyectar medicamentos por vía intramuscular (provoca hematomas)" },
      { name: "Anemia Arregenerativa Severa", desc: "hematocrito menor al 15%, letargo y mucosas blancas.", tx: "Soporte de oxígeno, transfusión y eritropoyetina", SC: "Forzar ejercicio o manipulación estresante" }
    ],
    Multisistemico: [
      { name: "Sepsis Aguda / Shock Séptico", desc: "fiebre/hipotermia, hipotensión, debilidad severa y colapso.", tx: "Fluidoterapia agresiva y antibióticos de amplio espectro IV", SC: "Retardar la estabilización hemodinámica inicial" },
      { name: "Uremia / Falla Multiorgánica", desc: "halitosis urémica, úlceras orales, vómitos y anuria.", tx: "Fluidoterapia de lavado e infusión continua de electrolitos", SC: "Dar fármacos de excreción renal sin ajustar dosis" },
      { name: "Intoxicación Aguda Sistémica", desc: "inicio súbito de signos neurológicos, digestivos y shock.", tx: "Carbón activado oral (si no convulsiona) y antídotos", SC: "Inducir el vómito si el animal está deprimido o convulsionando" },
      { name: "Virosis Sistémica Aguda", desc: "fiebre alta, descargas oculonasales y letalidad de lote.", tx: "Soporte de hidratación, bioseguridad y aislamiento", SC: "Ignorar medidas sanitarias de cuarentena en lote" }
    ]
  };

  // 100 Casos programáticos combinatorios
  for (let i = 0; i < 100; i++) {
    const spec = speciesList[i % speciesList.length];
    const sys = systemsList[i % systemsList.length];
    const templates = diseasesTemplates[sys] || diseasesTemplates["Multisistemico"];
    const tpl = templates[i % templates.length];
    const diff = difficulties[i % difficulties.length];

    const caseId = `auto-case-${i + 5}`;
    const title = `${tpl.name} en ${capitalize(spec)}`;

    scenarioProfiles.push({
      id: caseId,
      title: title,
      species: spec,
      system: sys,
      difficulty: diff,
      estimatedMinutes: diff === "Alta" ? 25 : diff === "Media" ? 20 : 15,
      shortDescription: `Caso clínico nº ${i + 5} de complejidad ${diff}. Evalúa el historial, interpreta análisis y trata esta afección del sistema ${sys} en ${spec}.`,
      coverImage: getEmojiBySpecies(spec),
      motive: `Se sospecha de ${tpl.name} debido a signos del sistema ${sys}.`,
      intro: `Se presenta un paciente de especie ${spec} a consulta. Presenta una signología compatible con ${tpl.name}: ${tpl.desc} Se requiere diagnóstico de urgencia.`,
      objectives: [
        `Reconocer signos patognomónicos de ${tpl.name}`,
        `Solicitar e interpretar la analítica clínica adecuada`,
        `Prescribir terapia analgésica o etiológica, evitando: ${tpl.SC}`
      ],
      anamnesis: [
        { text: "¿Cuál es el curso clínico y evolución temporal de los signos?", correct: true, feedback: "Correcto. Permite categorizar el cuadro como sobreagudo, agudo o crónico.", score: 10 },
        { text: "¿El paciente tiene acceso libre a agua fresca y qué dieta consume?", correct: true, feedback: "Correcto. Valora la hidratación de base y posibles transgresiones alimentarias.", score: 10 },
        { text: "¿Qué tipo de desinfectante de pisos utiliza la familia?", correct: false, feedback: "Poco relevante en esta fase inicial de triaje clínico.", score: -5 }
      ],
      examenFisico: [
        { text: "Evaluar constantes vitales (temperatura rectal, FC, FR) y mucosas", correct: true, feedback: "Correcto. Parámetros basales esenciales para detectar shock o fiebre alta.", score: 15 },
        { text: "Exploración física profunda del sistema afectado", correct: true, feedback: "Correcto. Revela cambios compatibles con la inflamación del sistema.", score: 10 },
        { text: "Examen de reflejos flexores en extremidades posteriores", correct: false, feedback: "No es prioritario a menos que se sospeche lesión medular activa.", score: 0 }
      ],
      pruebas: [
        {
          text: "Hemograma completo y bioquímica sérica básica",
          correct: true,
          feedback: `Correcto. Muestra leucocitosis reactiva e indicaciones compatibles con ${tpl.name}.`,
          score: 10,
          asset: {
            type: "lab_table",
            title: "Resultados de Laboratorio",
            content: [
              ["Parámetro", "Valor", "Rango Ref"],
              ["Leucocitos", "16.8 x10^3/uL", "Especie Dependiente"],
              ["Hematocrito", "38 %", "Normal"]
            ]
          }
        },
        {
          text: "Ecografía o Radiografía focalizada de diagnóstico",
          correct: true,
          feedback: "Correcto. Aporta datos de imagen compatibles con lesión orgánica local.",
          score: 10,
          asset: {
            type: "image",
            title: "Imagen Diagnóstica",
            fileUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e902a?w=500&q=80"
          }
        }
      ],
      differentials: [
        { text: tpl.name, priority: 1, feedback: "Diagnóstico presuntivo principal respaldado por el curso clínico." },
        { text: "Infección secundaria oportunista", priority: 2, feedback: "Complicación común que puede agravar la signología de base." },
        { text: "Toxemia o inflamación inespecífica", priority: 3, feedback: "Considerar en base a la fisiopatología general." },
        { text: "Proceso neoplásico infiltrativo local", priority: 4, feedback: "Menos probable debido a la evolución temporal." }
      ],
      terapeutico: [
        { text: `Aplicar: ${tpl.tx}`, correct: true, feedback: "Correcto. Terapia etiológica de elección y soporte clínico.", score: 15 },
        { text: `Acción insegura: ${tpl.SC}`, correct: false, feedback: `¡RIESGO CRÍTICO! ${tpl.SC} es un error grave de seguridad en este cuadro clínico.`, score: -20, safetyCritical: true }
      ],
      tutorRecs: [
        { text: "Monitorear la evolución clínica del paciente y completar dosis indicadas", correct: true, feedback: "Correcto. Garantiza que no se generen resistencias bacterianas.", score: 10 },
        { text: "Desinfectar y ventilar adecuadamente el alojamiento del animal", correct: true, feedback: "Correcto. Disminuye la carga patógena en el ambiente.", score: 10 }
      ]
    });
  }

  // Helper para capitalizar textos
  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Helper para asignar emojis por especie
  function getEmojiBySpecies(spec) {
    const mapping = {
      bovino: "🐄",
      canino: "🐶",
      felino: "🐱",
      equino: "🐴",
      porcino: "🐷",
      ovino: "🐑",
      caprino: "🐐",
      ave: "🐔"
    };
    return mapping[spec] || "📋";
  }

  // ---------------------------------------------------------------------------
  // 4. FUNCIÓN DE EXPANSIÓN PROGRAMÁTICA (MAPPING ESCENARIOS -> STAGES)
  // ---------------------------------------------------------------------------
  function expandProfileToScenario(p) {
    const sc = {
      id: p.id,
      slug: p.id,
      title: p.title,
      species: p.species,
      system: p.system,
      difficulty: p.difficulty,
      estimatedMinutes: p.estimatedMinutes,
      shortDescription: p.shortDescription,
      learningObjectives: p.objectives,
      sourceModules: ["Semiología", "Fisiología", "Farmacología"],
      coverImage: p.coverImage || "📋",
      published: true,
      stages: []
    };

    // Helper para obtener el ID de la etapa
    function getStageId(type) {
      if (p.stageIds && p.stageIds[type]) return p.stageIds[type];
      return `${p.id}-stage-${type}`;
    }

    // Etapa 1: Motivo de Consulta
    sc.stages.push({
      id: getStageId("motivo_consulta"),
      order: 1,
      type: "motivo_consulta",
      title: "Motivo de Consulta",
      prompt: p.motive,
      asset: {
        id: `asset-${p.id}-mot`,
        type: "text",
        title: "Historia Clínica",
        content: p.intro
      }
    });

    // Etapa 2: Anamnesis
    sc.stages.push({
      id: getStageId("anamnesis"),
      order: 2,
      type: "anamnesis",
      title: "Anamnesis",
      prompt: "Selecciona las preguntas clave para realizar en la historia clínica:",
      choices: p.anamnesis.map((c, i) => ({
        id: c.id || `${p.id}-an-ch-${i}`,
        text: c.text,
        correct: c.correct,
        feedback: c.feedback,
        score: c.score,
        penalty: c.penalty || false,
        competencyCode: "COMP-ANAM"
      }))
    });

    // Etapa 3: Examen Físico
    sc.stages.push({
      id: getStageId("examen_fisico"),
      order: 3,
      type: "examen_fisico",
      title: "Examen Físico",
      prompt: "Selecciona las maniobras y revisiones clínicas prioritarias:",
      choices: p.examenFisico.map((c, i) => ({
        id: c.id || `${p.id}-ex-ch-${i}`,
        text: c.text,
        correct: c.correct,
        feedback: c.feedback,
        score: c.score,
        penalty: c.penalty || false,
        competencyCode: "COMP-EFIS"
      }))
    });

    // Etapa 4: Pruebas Complementarias
    sc.stages.push({
      id: getStageId("pruebas_complementarias"),
      order: 4,
      type: "pruebas_complementarias",
      title: "Pruebas Complementarias",
      prompt: "Ordena los exámenes complementarios e interpreta sus resultados:",
      choices: p.pruebas.map((c, i) => ({
        id: c.id || `${p.id}-pr-ch-${i}`,
        text: c.text,
        correct: c.correct,
        feedback: c.feedback,
        score: c.score,
        competencyCode: "COMP-LAB",
        asset: c.asset ? {
          id: c.asset.id || `asset-${p.id}-pr-${i}`,
          type: c.asset.type,
          title: c.asset.title,
          content: c.asset.content || null,
          fileUrl: c.asset.fileUrl || null
        } : null
      }))
    });

    // Etapa 5: Interpretación
    sc.stages.push({
      id: getStageId("interpretacion"),
      order: 5,
      type: "interpretacion",
      title: "Interpretación Clínica",
      prompt: "Redacta tu análisis fisiopatológico basado en los hallazgos previos:",
      required: true,
      scoringWeight: 10,
      competencyCode: "COMP-RAZ"
    });

    // Etapa 6: Diagnósticos Diferenciales
    sc.stages.push({
      id: getStageId("diagnosticos_diferenciales"),
      order: 6,
      type: "diagnosticos_diferenciales",
      title: "Diagnósticos Diferenciales",
      prompt: "Ordena los diagnósticos de mayor a menor probabilidad según el sustento clínico:",
      choices: p.differentials.map((c, i) => ({
        id: c.id || `${p.id}-df-ch-${i}`,
        text: c.text,
        priority: c.priority,
        feedback: c.feedback
      })),
      competencyCode: "COMP-RAZ"
    });

    // Etapa 7: Plan Terapéutico
    sc.stages.push({
      id: getStageId("plan_terapeutico"),
      order: 7,
      type: "plan_terapeutico",
      title: "Plan Terapéutico",
      prompt: "Define las medidas terapéuticas y de soporte para estabilizar al paciente:",
      choices: p.terapeutico.map((c, i) => ({
        id: c.id || `${p.id}-tx-ch-${i}`,
        text: c.text,
        correct: c.correct,
        feedback: c.feedback,
        score: c.score,
        safetyCritical: c.safetyCritical || false,
        competencyCode: c.safetyCritical ? "COMP-SEG" : "COMP-TER"
      }))
    });

    // Etapa 8: Recomendaciones
    sc.stages.push({
      id: getStageId("tutor_recs"),
      order: 8,
      type: "tutor_recs",
      title: "Indicaciones de Alta / Recomendaciones",
      prompt: "Selecciona las pautas de manejo y prevención que darás al tutor o encargado:",
      choices: p.tutorRecs.map((c, i) => ({
        id: c.id || `${p.id}-rec-ch-${i}`,
        text: c.text,
        correct: c.correct,
        feedback: c.feedback,
        score: c.score,
        competencyCode: "COMP-SEG"
      }))
    });

    // Etapa 9: Reflexión
    sc.stages.push({
      id: getStageId("reflection"),
      order: 9,
      type: "reflection",
      title: "Autoevaluación y Reflexión",
      prompt: "Establece tu confianza y describe una breve reflexión sobre tu proceso de toma de decisiones:",
      required: true,
      scoringWeight: 10,
      competencyCode: "COMP-RAZ"
    });

    return sc;
  }

  // Expandir todos los perfiles y guardarlos en el dataStore
  scenarioProfiles.forEach((profile) => {
    dataStore.seedScenarios.push(expandProfileToScenario(profile));
  });

  // Exportar al objeto global de Suite Vet
  window.CASOS_360_DATA = dataStore;

})();
