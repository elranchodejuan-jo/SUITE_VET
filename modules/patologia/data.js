// =============================================================================
// SUITE VET 2.0 — modules/patologia/data.js
// Módulo de Patología Veterinaria.
// Agrega tus lesiones y hallazgos aquí.
// =============================================================================

window.PATO_DATA = {
  lesiones: [
    {
      id: "hidropesia-amnios",
      nombre: "Hidropesía de amnios / alantoides",
      sistema: "reproductivo",
      tipo: "congénita",
      especie: ["bovino","ovino"],
      descripcion: "Acumulación anormal de líquido en las membranas fetales. Puede alcanzar 50-200 L en bovinos.",
      etiologia: "Anomalías del feto (hidrops fetal), placentitis, gemelos (bovinos), mola hidatiforme.",
      hallazgos: "Distensión abdominal progresiva, disnea, edema ventral, rumen desplazado.",
      diagnostico: "Palpación rectal, ecografía. Distensión marcada sin feto palpable.",
      pronostico: "Reservado. Resolver gestación."
    },
    {
      id: "lipidosis-hepatica",
      nombre: "Lipidosis hepática",
      sistema: "metabolico",
      tipo: "metabólica",
      especie: ["bovino","felino"],
      descripcion: "Acumulación excesiva de triglicéridos en hepatocitos. En bovinos: hígado graso posparto. En gatos: ictericia hepática por ayuno.",
      etiologia: "Balance energético negativo (BEN) en bovinos. Anorexia prolongada en gatos obesos.",
      hallazgos: "Hígado aumentado de tamaño, amarillo pálido o anaranjado, textura friable. Flotación en agua.",
      diagnostico: "Biopsia hepática (punción), perfil hepático (ALT, AST, GGT elevados), ecografía.",
      pronostico: "Grave en gatos sin tratamiento. En bovinos: recuperación con manejo nutricional."
    },
    {
      id: "neumonia-lobular",
      nombre: "Neumonía bronconeumonía",
      sistema: "respiratorio",
      tipo: "inflamatoria",
      especie: ["bovino","porcino","ovino","canino"],
      descripcion: "Inflamación del parénquima pulmonar con consolidación de lóbulos craneoventrales.",
      etiologia: "Mannheimia haemolytica, Pasteurella multocida, Mycoplasma spp., BVDV, BRSV.",
      hallazgos: "Consolidación craneventral, exudado fibrinoso o purulento en bronquios, pleuritis.",
      diagnostico: "Auscultación, radiografía, lavado broncoalveolar, necropsia.",
      pronostico: "Bueno con tratamiento temprano. Crónico si hay abscesos."
    },
    {
      id: "pericarditis-traumatica",
      nombre: "Pericarditis traumática",
      sistema: "cardiovascular",
      tipo: "inflamatoria",
      especie: ["bovino"],
      descripcion: "Inflamación del pericardio por perforación del retículo con cuerpo extraño metálico.",
      etiologia: "Reticuloperitonitis traumática (hardware disease). Cuerpo extraño metálico del retículo alcanza el pericardio.",
      hallazgos: "Derrame pericárdico, exudado fibrino-purulento, ruidos cardiacos apagados, ingurgitación yugular, edema submandibular.",
      diagnostico: "Auscultación (ruidos cardíacos velados), ultrasonido cardíaco, derrame pericárdico con punción.",
      pronostico: "Muy grave. Sacrificio humanitario en la mayoría de los casos."
    }
  ]
};
