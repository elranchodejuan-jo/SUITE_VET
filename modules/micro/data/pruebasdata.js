// =============================================================================
// SUITE VET / FITBET 2.2 - modules/micro/data/pruebasdata.js
// Base de pruebas bioquimicas.
// =============================================================================

(function () {
  "use strict";

  window.MICRO_DATA_PARTS = window.MICRO_DATA_PARTS || {};
  window.MICRO_DATA_PARTS.pruebas = [
  {
    "id": "tsi",
    "tipoEntidad": "prueba",
    "nombre": "TSI",
    "alternativo": "Triple Sugar Iron Agar",
    "subtitulo": "Para: enterobacterias",
    "tipos": [
      "fermentación",
      "h2s",
      "gas"
    ],
    "fundamento": "Evalúa fermentación de glucosa, lactosa/sacarosa, producción de gas y H2S.",
    "principioBioquimico": "Cambios de pH por fermentación y precipitado negro por sulfuro de hierro.",
    "reactivos": [
      "Rojo fenol",
      "Tiosulfato",
      "Sales de hierro"
    ],
    "interpretacionPositiva": "A/A o K/A con gas o H2S según patrón.",
    "interpretacionNegativa": "K/K o sin fermentación significativa.",
    "utilidadDiagnostica": "Separación rápida de enterobacterias fermentadoras y H2S positivas.",
    "erroresComunes": [
      "Leer después de 24 h puede revertir la pendiente",
      "Inóculo excesivo altera lectura"
    ],
    "bacteriasIds": [
      "salmonella-spp",
      "escherichia-coli",
      "klebsiella-pneumoniae",
      "proteus-mirabilis"
    ],
    "mediosIds": [
      "macconkey-agar",
      "bismuth-sulfite-agar",
      "xld-agar"
    ],
    "pruebasComplementariasIds": [
      "sim",
      "citrato-simmons",
      "ureasa"
    ]
  },
  {
    "id": "sim",
    "tipoEntidad": "prueba",
    "nombre": "SIM",
    "alternativo": "Sulfuro Indol Motilidad",
    "subtitulo": "Para: enterobacterias móviles/H2S",
    "tipos": [
      "motilidad",
      "indol",
      "h2s"
    ],
    "fundamento": "Evalúa producción de H2S, indol y motilidad bacteriana en medio semisólido.",
    "principioBioquimico": "Tiosulfato y hierro detectan H2S; Kovacs detecta indol.",
    "reactivos": [
      "Reactivo de Kovacs",
      "Sales de hierro",
      "Tiosulfato"
    ],
    "interpretacionPositiva": "Negro: H2S; anillo rojo: indol; difusión: motilidad.",
    "interpretacionNegativa": "Sin negro, sin anillo rojo o crecimiento solo en línea de punción.",
    "utilidadDiagnostica": "Complementa TSI en sospecha de Salmonella, E. coli y Proteus.",
    "erroresComunes": [
      "Agitar el tubo",
      "Punción torcida",
      "Añadir Kovacs antes de leer motilidad"
    ],
    "bacteriasIds": [
      "salmonella-spp",
      "escherichia-coli",
      "proteus-mirabilis"
    ],
    "mediosIds": [
      "macconkey-agar",
      "xld-agar",
      "bismuth-sulfite-agar"
    ],
    "pruebasComplementariasIds": [
      "tsi",
      "citrato-simmons",
      "indol"
    ]
  },
  {
    "id": "citrato-simmons",
    "tipoEntidad": "prueba",
    "nombre": "Citrato Simmons",
    "alternativo": "Simmons Citrate Agar",
    "subtitulo": "Para: uso de citrato como carbono",
    "tipos": [
      "citrato",
      "metabolismo"
    ],
    "fundamento": "Determina si la bacteria usa citrato como única fuente de carbono.",
    "principioBioquimico": "Alcalinización del medio con azul de bromotimol.",
    "reactivos": [
      "Azul de bromotimol",
      "Citrato sódico"
    ],
    "interpretacionPositiva": "Crecimiento con viraje azul.",
    "interpretacionNegativa": "Verde sin crecimiento visible.",
    "utilidadDiagnostica": "Diferencia Salmonella/Klebsiella de E. coli en esquemas clásicos.",
    "erroresComunes": [
      "Inóculo cargado arrastra nutrientes",
      "Leer crecimiento sin cambio de color"
    ],
    "bacteriasIds": [
      "salmonella-spp",
      "klebsiella-pneumoniae",
      "escherichia-coli"
    ],
    "mediosIds": [
      "macconkey-agar",
      "bismuth-sulfite-agar"
    ],
    "pruebasComplementariasIds": [
      "tsi",
      "sim",
      "ureasa"
    ]
  },
  {
    "id": "ureasa",
    "tipoEntidad": "prueba",
    "nombre": "Ureasa",
    "alternativo": "Urea Agar / Urea Broth",
    "subtitulo": "Para: Proteus y ureasa positivos",
    "tipos": [
      "enzimática",
      "urea"
    ],
    "fundamento": "Detecta hidrólisis de urea a amoníaco por ureasa.",
    "principioBioquimico": "El amoníaco alcaliniza el medio y cambia el indicador a rosa intenso.",
    "reactivos": [
      "Urea",
      "Rojo fenol"
    ],
    "interpretacionPositiva": "Rosa/fucsia intenso.",
    "interpretacionNegativa": "Sin cambio o amarillo pálido.",
    "utilidadDiagnostica": "Identifica Proteus y diferencia enterobacterias ureasa positivas.",
    "erroresComunes": [
      "Incubar demasiado y leer falsos tardíos",
      "Medio vencido por degradación de urea"
    ],
    "bacteriasIds": [
      "proteus-mirabilis",
      "klebsiella-pneumoniae"
    ],
    "mediosIds": [
      "macconkey-agar"
    ],
    "pruebasComplementariasIds": [
      "tsi",
      "sim",
      "citrato-simmons"
    ]
  },
  {
    "id": "catalasa",
    "tipoEntidad": "prueba",
    "nombre": "Catalasa",
    "alternativo": "Prueba con H2O2",
    "subtitulo": "Para: cocos Gram positivos",
    "tipos": [
      "enzimática",
      "rápida"
    ],
    "fundamento": "Detecta degradación de peróxido de hidrógeno por catalasa.",
    "principioBioquimico": "Liberación de oxígeno visible como burbujeo.",
    "reactivos": [
      "Peróxido de hidrógeno 3%"
    ],
    "interpretacionPositiva": "Burbujeo inmediato.",
    "interpretacionNegativa": "Sin burbujeo.",
    "utilidadDiagnostica": "Diferencia Staphylococcus (positivo) de Streptococcus (negativo).",
    "erroresComunes": [
      "Tomar colonia de agar sangre y arrastrar eritrocitos",
      "Usar reactivo viejo"
    ],
    "bacteriasIds": [
      "staphylococcus-spp",
      "streptococcus-spp"
    ],
    "mediosIds": [
      "blood-agar",
      "mannitol-salt-agar"
    ],
    "pruebasComplementariasIds": [
      "coagulasa"
    ]
  },
  {
    "id": "coagulasa",
    "tipoEntidad": "prueba",
    "nombre": "Coagulasa",
    "alternativo": "Coagulasa en porta/tubo",
    "subtitulo": "Para: estafilococos patógenos",
    "tipos": [
      "enzimática",
      "virulencia"
    ],
    "fundamento": "Detecta coagulasa libre o ligada asociada a patogenicidad estafilocócica.",
    "principioBioquimico": "Conversión de fibrinógeno en fibrina visible como coágulo.",
    "reactivos": [
      "Plasma citratado"
    ],
    "interpretacionPositiva": "Coágulo o aglutinación según método.",
    "interpretacionNegativa": "Suspensión homogénea sin coagulación.",
    "utilidadDiagnostica": "Apoya identificación de Staphylococcus aureus/pseudintermedius.",
    "erroresComunes": [
      "Leer porta como definitivo cuando hay dudas",
      "Incubación excesiva con fibrinólisis"
    ],
    "bacteriasIds": [
      "staphylococcus-spp"
    ],
    "mediosIds": [
      "mannitol-salt-agar",
      "blood-agar"
    ],
    "pruebasComplementariasIds": [
      "catalasa"
    ]
  },
  {
    "id": "oxidasa",
    "tipoEntidad": "prueba",
    "nombre": "Oxidasa",
    "alternativo": "Citocromo c oxidasa",
    "subtitulo": "Para: Pseudomonas, Pasteurella y no fermentadores",
    "tipos": [
      "enzimática",
      "respiratoria"
    ],
    "fundamento": "Detecta presencia de citocromo c oxidasa.",
    "principioBioquimico": "El reactivo se oxida y vira a púrpura oscuro.",
    "reactivos": [
      "Tetrametil-p-fenilendiamina"
    ],
    "interpretacionPositiva": "Púrpura en segundos.",
    "interpretacionNegativa": "Sin viraje.",
    "utilidadDiagnostica": "Diferencia no fermentadores oxidasa positivos de enterobacterias oxidasa negativas.",
    "erroresComunes": [
      "Leer tarde produce falsos positivos",
      "Usar asas metálicas oxidadas"
    ],
    "bacteriasIds": [
      "pseudomonas-aeruginosa",
      "pasteurella-multocida",
      "escherichia-coli"
    ],
    "mediosIds": [
      "blood-agar",
      "mueller-hinton-agar"
    ],
    "pruebasComplementariasIds": [
      "catalasa",
      "tsi"
    ]
  },
  {
    "id": "indol",
    "tipoEntidad": "prueba",
    "nombre": "Indol",
    "alternativo": "Kovacs / Ehrlich",
    "subtitulo": "Para: producción de indol",
    "tipos": [
      "enzimática",
      "triptofano"
    ],
    "fundamento": "Detecta degradación de triptófano a indol por triptofanasa.",
    "principioBioquimico": "Kovacs reacciona con indol y forma anillo rojo.",
    "reactivos": [
      "Reactivo de Kovacs"
    ],
    "interpretacionPositiva": "Anillo rojo cereza.",
    "interpretacionNegativa": "Anillo amarillo o sin cambio.",
    "utilidadDiagnostica": "Apoya diferenciación de E. coli frente a Klebsiella/Enterobacter.",
    "erroresComunes": [
      "Medio sin triptófano",
      "Agregar reactivo antes de incubación adecuada"
    ],
    "bacteriasIds": [
      "escherichia-coli",
      "klebsiella-pneumoniae",
      "proteus-mirabilis"
    ],
    "mediosIds": [
      "macconkey-agar"
    ],
    "pruebasComplementariasIds": [
      "sim",
      "tsi",
      "citrato-simmons"
    ]
  },
  {
    "id": "gram-tincion",
    "tipoEntidad": "prueba",
    "nombre": "Tinci?n de Gram",
    "alternativo": "Gram stain",
    "subtitulo": "Para: clasificaci?n inicial bacteriana",
    "tipos": [
      "microscopia",
      "clasificacion",
      "basica"
    ],
    "fundamento": "Diferencia bacterias seg?n estructura de pared celular y retenci?n del complejo cristal violeta-yodo.",
    "principioBioquimico": "No es bioqu?mica estricta; es una tinci?n diferencial basada en pared celular.",
    "reactivos": [
      "Cristal violeta",
      "Lugol",
      "Decolorante",
      "Safranina o fucsina"
    ],
    "interpretacionPositiva": "Gram positivas: violeta/p?rpura.",
    "interpretacionNegativa": "Gram negativas: rosado/rojo.",
    "utilidadDiagnostica": "Primer paso para orientar medios, pruebas y antibi?ticos.",
    "erroresComunes": [
      "Sobredecoloraci?n",
      "Cultivos viejos",
      "Frotis demasiado grueso"
    ],
    "bacteriasIds": [
      "staphylococcus-spp",
      "streptococcus-spp",
      "escherichia-coli",
      "campylobacter-jejuni",
      "listeria-monocytogenes"
    ],
    "mediosIds": [
      "blood-agar",
      "nutrient-agar"
    ],
    "pruebasComplementariasIds": [
      "catalasa",
      "oxidasa"
    ],
    "fuentes": [
      "Manual de microbiolog?a veterinaria / protocolo institucional de tinci?n Gram"
    ]
  },
  {
    "id": "mr-vp",
    "tipoEntidad": "prueba",
    "nombre": "MR-VP",
    "alternativo": "Methyl Red / Voges-Proskauer",
    "subtitulo": "Para: diferenciaci?n coli-aerogenes",
    "tipos": [
      "fermentacion",
      "enterobacterias"
    ],
    "fundamento": "Eval?a rutas de fermentaci?n de glucosa: ?cidos mixtos (MR) o acetoin/2,3-butanodiol (VP).",
    "principioBioquimico": "Indicadores detectan acidificaci?n estable o producci?n de acetoin.",
    "reactivos": [
      "Rojo de metilo",
      "Reactivos VP A y VP B / Barritt"
    ],
    "interpretacionPositiva": "MR positivo: rojo. VP positivo: rojo/rosado tras reactivos.",
    "interpretacionNegativa": "MR negativo: amarillo/naranja. VP negativo: sin viraje rojo.",
    "utilidadDiagnostica": "Diferencia Escherichia, Enterobacter/Klebsiella y otros bacilos ent?ricos.",
    "erroresComunes": [
      "Lectura prematura",
      "No separar al?cuotas para MR y VP",
      "Reactivos VP vencidos"
    ],
    "bacteriasIds": [
      "escherichia-coli",
      "klebsiella-pneumoniae"
    ],
    "mediosIds": [
      "emb-agar",
      "macconkey-agar"
    ],
    "pruebasComplementariasIds": [
      "indol",
      "citrato-simmons"
    ],
    "fuentes": [
      "HiMedia MR-VP Medium technical data",
      "Manuales ASM de identificaci?n bacteriana"
    ]
  },
  {
    "id": "lia",
    "tipoEntidad": "prueba",
    "nombre": "Lysine Iron Agar",
    "alternativo": "LIA",
    "subtitulo": "Para: Salmonella y enterobacterias",
    "tipos": [
      "descarboxilacion",
      "h2s",
      "enterobacterias"
    ],
    "fundamento": "Eval?a descarboxilaci?n/desaminaci?n de lisina y producci?n de H2S.",
    "principioBioquimico": "Lisina, indicador pH, tiosulfato y sal f?rrica permiten lectura de alcalinizaci?n, acidificaci?n y H2S.",
    "reactivos": [
      "Medio LIA en pico de flauta profundo"
    ],
    "interpretacionPositiva": "Lisina descarboxilasa positiva: fondo p?rpura; H2S: ennegrecimiento.",
    "interpretacionNegativa": "Fondo amarillo o slant rojizo compatible con reacciones negativas/desaminaci?n.",
    "utilidadDiagnostica": "Confirmaci?n de Salmonella y diferenciaci?n de enterobacterias.",
    "erroresComunes": [
      "In?culo superficial insuficiente",
      "No picar profundo",
      "Incubaci?n inadecuada"
    ],
    "bacteriasIds": [
      "salmonella-spp",
      "proteus-mirabilis",
      "escherichia-coli"
    ],
    "mediosIds": [
      "xld-agar",
      "hektoen-enteric-agar"
    ],
    "pruebasComplementariasIds": [
      "tsi",
      "sim",
      "citrato-simmons"
    ],
    "fuentes": [
      "HiMedia Lysine Iron Agar M377 Technical Data",
      "FDA BAM LIA references"
    ]
  },
  {
    "id": "mio",
    "tipoEntidad": "prueba",
    "nombre": "MIO Medium",
    "alternativo": "Motility Indole Ornithine",
    "subtitulo": "Para: Enterobacteriaceae",
    "tipos": [
      "motilidad",
      "indol",
      "ornitina"
    ],
    "fundamento": "Integra motilidad, producci?n de indol y descarboxilaci?n de ornitina en un tubo.",
    "principioBioquimico": "Semis?lido con tript?fano, ornitina e indicador bromocresol p?rpura.",
    "reactivos": [
      "Medio MIO",
      "Reactivo de Kovacs para indol"
    ],
    "interpretacionPositiva": "Motilidad: crecimiento difuso; indol: anillo rojo; ornitina: p?rpura alcalino.",
    "interpretacionNegativa": "Crecimiento solo en l?nea de punci?n, sin anillo rojo, amarillo persistente.",
    "utilidadDiagnostica": "Diferencia enterobacterias y apoya identificaci?n de Proteus, Salmonella y E. coli.",
    "erroresComunes": [
      "Leer indol antes de motilidad/ornitina",
      "Punci?n m?ltiple",
      "Cultivo viejo"
    ],
    "bacteriasIds": [
      "escherichia-coli",
      "salmonella-spp",
      "proteus-mirabilis"
    ],
    "mediosIds": [
      "macconkey-agar",
      "emb-agar"
    ],
    "pruebasComplementariasIds": [
      "tsi",
      "citrato-simmons",
      "ureasa"
    ],
    "fuentes": [
      "HiMedia MIO Medium M378 Technical Data"
    ]
  },
  {
    "id": "nitrate-reduction",
    "tipoEntidad": "prueba",
    "nombre": "Reducci?n de nitrato",
    "alternativo": "Nitrate reduction test",
    "subtitulo": "Para: bacilos Gram negativos y anaerobios",
    "tipos": [
      "respiracion",
      "nitrato"
    ],
    "fundamento": "Detecta la capacidad bacteriana de reducir nitrato a nitrito u otros productos nitrogenados.",
    "principioBioquimico": "La enzima nitrato reductasa permite respiraci?n anaerobia con nitrato como aceptor final.",
    "reactivos": [
      "Caldo nitrato",
      "Reactivos A/B de Griess",
      "Zinc si corresponde"
    ],
    "interpretacionPositiva": "Rojo tras A/B o ausencia de rojo despu?s de zinc indica reducci?n.",
    "interpretacionNegativa": "Rojo despu?s de zinc indica nitrato no reducido.",
    "utilidadDiagnostica": "Apoya identificaci?n de Pseudomonas, Enterobacteriaceae y anaerobios.",
    "erroresComunes": [
      "Omitir zinc",
      "Interpretar gas sin control",
      "Incubaci?n insuficiente"
    ],
    "bacteriasIds": [
      "pseudomonas-aeruginosa",
      "clostridium-perfringens",
      "escherichia-coli"
    ],
    "mediosIds": [
      "cetrimide-agar",
      "blood-agar"
    ],
    "pruebasComplementariasIds": [
      "oxidasa",
      "catalasa"
    ],
    "fuentes": [
      "HiMedia Nitrate Broth M439 Technical Data",
      "Manuales ASM de pruebas bioqu?micas"
    ]
  },
  {
    "id": "bile-esculin",
    "tipoEntidad": "prueba",
    "nombre": "Bilis esculina",
    "alternativo": "Bile Esculin Test",
    "subtitulo": "Para: Enterococcus y algunos Streptococcus",
    "tipos": [
      "esculina",
      "gram positivos"
    ],
    "fundamento": "Eval?a hidr?lisis de esculina en presencia de bilis.",
    "principioBioquimico": "Esculetina reacciona con sales f?rricas y produce ennegrecimiento.",
    "reactivos": [
      "Agar/caldo bilis esculina"
    ],
    "interpretacionPositiva": "Ennegrecimiento del medio.",
    "interpretacionNegativa": "Sin ennegrecimiento significativo.",
    "utilidadDiagnostica": "Diferenciaci?n de Enterococcus y estreptococos del grupo D.",
    "erroresComunes": [
      "Lectura tard?a excesiva",
      "In?culo mixto"
    ],
    "bacteriasIds": [
      "enterococcus-spp",
      "streptococcus-spp",
      "listeria-monocytogenes"
    ],
    "mediosIds": [
      "blood-agar"
    ],
    "pruebasComplementariasIds": [
      "catalasa",
      "gram-tincion"
    ],
    "fuentes": [
      "Manual de microbiolog?a veterinaria / fichas de bilis esculina"
    ]
  },
  {
    "id": "camp-test",
    "tipoEntidad": "prueba",
    "nombre": "CAMP Test",
    "alternativo": "Christie-Atkins-Munch-Petersen",
    "subtitulo": "Para: Streptococcus agalactiae y Listeria",
    "tipos": [
      "hemolisis",
      "sinergia"
    ],
    "fundamento": "Detecta potenciaci?n de hem?lisis por interacci?n con beta-lisina de Staphylococcus aureus.",
    "principioBioquimico": "Factor CAMP intensifica lisis de eritrocitos cerca de la estr?a de S. aureus.",
    "reactivos": [
      "Agar sangre",
      "Cepa control S. aureus beta-lisina positiva"
    ],
    "interpretacionPositiva": "Zona de hem?lisis en forma de flecha.",
    "interpretacionNegativa": "Sin aumento caracter?stico de hem?lisis.",
    "utilidadDiagnostica": "Apoyo para Streptococcus agalactiae, Listeria monocytogenes y Trueperella pyogenes seg?n contexto.",
    "erroresComunes": [
      "Distancia incorrecta entre estr?as",
      "Usar cepa control inadecuada"
    ],
    "bacteriasIds": [
      "streptococcus-spp",
      "listeria-monocytogenes",
      "trueperella-pyogenes"
    ],
    "mediosIds": [
      "blood-agar"
    ],
    "pruebasComplementariasIds": [
      "gram-tincion",
      "catalasa"
    ],
    "fuentes": [
      "Manual de microbiolog?a veterinaria / protocolos CAMP"
    ]
  },
  {
    "id": "hemolisis",
    "tipoEntidad": "prueba",
    "nombre": "Hem?lisis en agar sangre",
    "alternativo": "Alfa, beta o gamma hem?lisis",
    "subtitulo": "Para: cocos Gram positivos y bacterias veterinarias",
    "tipos": [
      "hemolisis",
      "agar sangre"
    ],
    "fundamento": "Eval?a lisis parcial o completa de eritrocitos alrededor de colonias.",
    "principioBioquimico": "Hemolisinas bacterianas alteran eritrocitos y generan patrones alfa, beta o gamma.",
    "reactivos": [
      "Agar sangre al 5%"
    ],
    "interpretacionPositiva": "Beta: halo claro; alfa: verdoso; gamma: sin hem?lisis.",
    "interpretacionNegativa": "No aplica como positiva/negativa ?nica; patr?n orienta identificaci?n.",
    "utilidadDiagnostica": "Clave en Streptococcus, Staphylococcus, Trueperella, Bacillus y Clostridium.",
    "erroresComunes": [
      "Placas viejas",
      "Sangre inadecuada",
      "Lectura sin incubaci?n correcta"
    ],
    "bacteriasIds": [
      "streptococcus-spp",
      "staphylococcus-spp",
      "trueperella-pyogenes",
      "clostridium-perfringens",
      "bacillus-anthracis"
    ],
    "mediosIds": [
      "blood-agar"
    ],
    "pruebasComplementariasIds": [
      "catalasa",
      "coagulasa",
      "gram-tincion"
    ],
    "fuentes": [
      "Manual de microbiolog?a veterinaria / protocolos de agar sangre"
    ]
  },
  {
    "id": "onpg",
    "tipoEntidad": "prueba",
    "nombre": "ONPG",
    "alternativo": "o-nitrofenil-beta-D-galactopiranosido",
    "subtitulo": "Para: beta-galactosidasa en enterobacterias",
    "tipos": [
      "enzimatica",
      "lactosa",
      "enterobacterias"
    ],
    "fundamento": "Detecta beta-galactosidasa aun cuando la fermentacion de lactosa sea lenta o tardia.",
    "principioBioquimico": "La enzima rompe ONPG y libera o-nitrofenol de color amarillo.",
    "reactivos": [
      "Disco o solucion ONPG",
      "Suspension bacteriana pura"
    ],
    "interpretacionPositiva": "Viraje amarillo.",
    "interpretacionNegativa": "Sin cambio de color dentro del tiempo indicado.",
    "utilidadDiagnostica": "Apoya diferenciacion de enterobacterias lactosa tardias, Yersinia y otros bacilos Gram negativos.",
    "erroresComunes": [
      "Usar cultivo mixto",
      "Leer fuera del tiempo del fabricante",
      "Inoculo demasiado bajo"
    ],
    "bacteriasIds": [
      "escherichia-coli",
      "klebsiella-pneumoniae",
      "yersinia-enterocolitica"
    ],
    "mediosIds": [
      "macconkey-agar",
      "sorbitol-macconkey-agar",
      "yersinia-cin-agar",
      "lactose-broth"
    ],
    "pruebasComplementariasIds": [
      "tsi",
      "indol",
      "citrato-simmons",
      "mr-vp"
    ],
    "fuentes": [
      "Manual ASM de pruebas bioquimicas",
      "Consultar ficha tecnica del kit usado"
    ]
  },
  {
    "id": "malonato",
    "tipoEntidad": "prueba",
    "nombre": "Malonato",
    "alternativo": "Malonate utilization test",
    "subtitulo": "Para: uso de malonato como fuente de carbono",
    "tipos": [
      "metabolismo",
      "enterobacterias"
    ],
    "fundamento": "Evalua si la bacteria puede utilizar malonato como fuente de carbono.",
    "principioBioquimico": "El uso de malonato alcaliniza el medio y cambia el indicador.",
    "reactivos": [
      "Caldo malonato",
      "Indicador azul de bromotimol"
    ],
    "interpretacionPositiva": "Viraje azul con crecimiento.",
    "interpretacionNegativa": "Medio verde sin alcalinizacion significativa.",
    "utilidadDiagnostica": "Complementa esquemas de Enterobacteriaceae, especialmente Klebsiella/Enterobacter frente a Salmonella y E. coli.",
    "erroresComunes": [
      "Inoculo excesivo",
      "Leer antes del tiempo recomendado",
      "Interpretar turbidez sin cambio de color"
    ],
    "bacteriasIds": [
      "klebsiella-pneumoniae",
      "salmonella-spp",
      "escherichia-coli"
    ],
    "mediosIds": [
      "macconkey-agar",
      "nutrient-agar",
      "tryptic-soy-broth"
    ],
    "pruebasComplementariasIds": [
      "citrato-simmons",
      "mr-vp",
      "tsi"
    ],
    "fuentes": [
      "Manual ASM de pruebas bioquimicas",
      "Consultar ficha tecnica del fabricante"
    ]
  },
  {
    "id": "gelatinasa",
    "tipoEntidad": "prueba",
    "nombre": "Gelatinasa",
    "alternativo": "Hidrolisis de gelatina",
    "subtitulo": "Para: enzimas proteoliticas",
    "tipos": [
      "enzimatica",
      "proteolisis"
    ],
    "fundamento": "Detecta capacidad de hidrolizar gelatina por gelatinasa u otras proteasas.",
    "principioBioquimico": "La gelatina licuada no solidifica al enfriar despues de incubacion.",
    "reactivos": [
      "Medio de gelatina nutritiva",
      "Refrigeracion para lectura"
    ],
    "interpretacionPositiva": "Medio permanece liquido despues de enfriar.",
    "interpretacionNegativa": "Medio solidifica despues de enfriar.",
    "utilidadDiagnostica": "Apoya identificacion de Pseudomonas, Proteus, Clostridium y otros generos proteoliticos.",
    "erroresComunes": [
      "No enfriar antes de interpretar",
      "Incubacion insuficiente",
      "Cultivo mixto"
    ],
    "bacteriasIds": [
      "pseudomonas-aeruginosa",
      "proteus-mirabilis",
      "clostridium-perfringens",
      "aeromonas-hydrophila"
    ],
    "mediosIds": [
      "nutrient-agar",
      "blood-agar",
      "tryptic-soy-broth"
    ],
    "pruebasComplementariasIds": [
      "oxidasa",
      "catalasa",
      "tsi"
    ],
    "fuentes": [
      "Manual ASM de pruebas bioquimicas"
    ]
  },
  {
    "id": "dnasa",
    "tipoEntidad": "prueba",
    "nombre": "DNasa",
    "alternativo": "Desoxirribonucleasa",
    "subtitulo": "Para: Staphylococcus y otros productores de DNasa",
    "tipos": [
      "enzimatica",
      "identificacion"
    ],
    "fundamento": "Detecta enzimas que hidrolizan ADN en el medio.",
    "principioBioquimico": "La hidrolisis de ADN genera halo claro o viraje del indicador segun formulacion.",
    "reactivos": [
      "Agar DNasa",
      "HCl o indicador segun medio"
    ],
    "interpretacionPositiva": "Halo claro o viraje compatible alrededor del crecimiento.",
    "interpretacionNegativa": "Sin halo o sin viraje.",
    "utilidadDiagnostica": "Complementa coagulasa/catalasa en estafilococos y puede apoyar identificacion de otros generos.",
    "erroresComunes": [
      "Capa de inoculo demasiado gruesa",
      "Lectura sin agregar reactivo cuando la formulacion lo requiere",
      "Incubacion insuficiente"
    ],
    "bacteriasIds": [
      "staphylococcus-spp",
      "moraxella-bovis"
    ],
    "mediosIds": [
      "blood-agar",
      "mannitol-salt-agar"
    ],
    "pruebasComplementariasIds": [
      "catalasa",
      "coagulasa",
      "hemolisis"
    ],
    "fuentes": [
      "Manual ASM de pruebas bioquimicas",
      "Consultar ficha tecnica del medio DNasa"
    ]
  },
  {
    "id": "crecimiento-nacl-65",
    "tipoEntidad": "prueba",
    "nombre": "Crecimiento en NaCl 6.5%",
    "alternativo": "Salt tolerance test",
    "subtitulo": "Para: Enterococcus spp.",
    "tipos": [
      "tolerancia",
      "identificacion"
    ],
    "fundamento": "Evalua tolerancia a alta concentracion de cloruro de sodio.",
    "principioBioquimico": "Enterococcus suele crecer en caldo con NaCl 6.5%, a diferencia de varios estreptococos.",
    "reactivos": [
      "Caldo NaCl 6.5%",
      "Indicador si el formato comercial lo incluye"
    ],
    "interpretacionPositiva": "Turbidez o cambio de indicador con crecimiento.",
    "interpretacionNegativa": "Sin crecimiento visible.",
    "utilidadDiagnostica": "Apoya diferenciacion Enterococcus vs Streptococcus en muestras clinicas.",
    "erroresComunes": [
      "Usar inoculo viejo",
      "Interpretar precipitado como crecimiento",
      "No comparar con control"
    ],
    "bacteriasIds": [
      "enterococcus-spp",
      "streptococcus-spp"
    ],
    "mediosIds": [
      "blood-agar",
      "brain-heart-infusion-broth"
    ],
    "pruebasComplementariasIds": [
      "bile-esculin",
      "catalasa",
      "gram-tincion"
    ],
    "fuentes": [
      "Manual ASM de pruebas bioquimicas",
      "CLSI VET vigente para interpretacion clinica cuando aplique"
    ]
  },
  {
    "id": "hipurato",
    "tipoEntidad": "prueba",
    "nombre": "Hipurato",
    "alternativo": "Hippurate hydrolysis",
    "subtitulo": "Para: Campylobacter jejuni",
    "tipos": [
      "enzimatica",
      "campylobacter"
    ],
    "fundamento": "Detecta hidrolisis de hipurato, util en diferenciacion de Campylobacter jejuni.",
    "principioBioquimico": "La glicina liberada reacciona con ninhidrina y genera coloracion positiva.",
    "reactivos": [
      "Sustrato hipurato",
      "Ninhidrina"
    ],
    "interpretacionPositiva": "Color violeta o purpura intenso segun kit.",
    "interpretacionNegativa": "Sin viraje significativo o color debil no compatible.",
    "utilidadDiagnostica": "Diferencia C. jejuni de otras especies termotolerantes cuando se usa en panel validado.",
    "erroresComunes": [
      "Inoculo bajo",
      "Leer color tenue como positivo",
      "No usar cultivo puro"
    ],
    "bacteriasIds": [
      "campylobacter-jejuni"
    ],
    "mediosIds": [
      "campylobacter-agar-base",
      "campylobacter-enrichment-broth"
    ],
    "pruebasComplementariasIds": [
      "oxidasa",
      "catalasa",
      "gram-tincion"
    ],
    "fuentes": [
      "Manual ASM de pruebas bioquimicas",
      "Consultar ficha tecnica del kit usado"
    ]
  },
  {
    "id": "factor-x-v",
    "tipoEntidad": "prueba",
    "nombre": "Factores X y V",
    "alternativo": "Requerimiento de hemina/NAD",
    "subtitulo": "Para: Pasteurellaceae fastidiosas",
    "tipos": [
      "crecimiento",
      "fastidioso",
      "respiratorio"
    ],
    "fundamento": "Evalua requerimientos de factor X, factor V o ambos para bacterias fastidiosas.",
    "principioBioquimico": "El crecimiento alrededor de discos o en medio suplementado indica dependencia de factores especificos.",
    "reactivos": [
      "Discos factor X",
      "Discos factor V",
      "Discos XV o medio enriquecido"
    ],
    "interpretacionPositiva": "Crecimiento alrededor del disco o en medio que contiene el factor requerido.",
    "interpretacionNegativa": "Ausencia de crecimiento sin el factor necesario.",
    "utilidadDiagnostica": "Apoya identificacion de bacterias respiratorias fastidiosas de cerdos y bovinos.",
    "erroresComunes": [
      "Medio base con arrastre de factores",
      "Inoculo no puro",
      "Incubacion sin CO2 cuando se requiere"
    ],
    "bacteriasIds": [
      "glaesserella-parasuis",
      "histophilus-somni",
      "actinobacillus-pleuropneumoniae"
    ],
    "mediosIds": [
      "chocolate-agar",
      "blood-agar",
      "brain-heart-infusion-broth"
    ],
    "pruebasComplementariasIds": [
      "gram-tincion",
      "oxidasa",
      "catalasa"
    ],
    "fuentes": [
      "Manual de microbiologia veterinaria",
      "Consultar protocolo diagnostico del laboratorio"
    ]
  },
  {
    "id": "fermentacion-manitol",
    "tipoEntidad": "prueba",
    "nombre": "Fermentacion de manitol",
    "alternativo": "Manitol / rojo fenol",
    "subtitulo": "Para: Staphylococcus y enterobacterias seleccionadas",
    "tipos": [
      "fermentacion",
      "diferencial"
    ],
    "fundamento": "Evalua produccion de acido a partir de manitol.",
    "principioBioquimico": "La acidificacion cambia el indicador de pH hacia amarillo en formulaciones con rojo fenol.",
    "reactivos": [
      "Medio con manitol",
      "Indicador de pH"
    ],
    "interpretacionPositiva": "Viraje amarillo o acido segun formulacion.",
    "interpretacionNegativa": "Sin viraje acido.",
    "utilidadDiagnostica": "Complementa agar sal manitol y paneles de identificacion.",
    "erroresComunes": [
      "Confundir crecimiento con fermentacion",
      "Lectura tardia",
      "Medio deshidratado vencido o mal almacenado"
    ],
    "bacteriasIds": [
      "staphylococcus-spp",
      "yersinia-enterocolitica",
      "escherichia-coli"
    ],
    "mediosIds": [
      "mannitol-salt-agar",
      "yersinia-cin-agar",
      "nutrient-agar"
    ],
    "pruebasComplementariasIds": [
      "catalasa",
      "coagulasa",
      "onpg"
    ],
    "fuentes": [
      "Manual ASM de pruebas bioquimicas"
    ]
  }
];
})();
