// =============================================================================
// SUITE VET / FITBET 2.2 - modules/micro/data/agardata.js
// Base de agares.
// =============================================================================

(function () {
  "use strict";

  window.MICRO_DATA_PARTS = window.MICRO_DATA_PARTS || {};
  window.MICRO_DATA_PARTS.agares = [
  {
    "id": "bismuth-sulfite-agar",
    "tipoEntidad": "agar",
    "nombre": "Bismuth Sulphite Agar",
    "alternativo": "Agar sulfito de bismuto / Wilson-Blair",
    "subtitulo": "Para: Salmonella spp.",
    "tipos": [
      "selectivo",
      "diferencial",
      "salmonella"
    ],
    "gramosPorLitro": 52.3,
    "phFinal": "7.7 ± 0.2",
    "objetivo": "Aislamiento selectivo de Salmonella, especialmente cepas productoras de H2S.",
    "bacteriasObjetivoIds": [
      "salmonella-spp"
    ],
    "bacteriasInhibidas": [
      "Gram positivas",
      "flora acompañante intestinal",
      "coliformes sensibles"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona / polipeptona",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Extracto de carne",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Dextrosa",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Fosfato disódico",
        "cantidad": "4 g"
      },
      {
        "ingrediente": "Sulfato ferroso",
        "cantidad": "0.3 g"
      },
      {
        "ingrediente": "Sulfito de bismuto",
        "cantidad": "8 g"
      },
      {
        "ingrediente": "Verde brillante",
        "cantidad": "0.025 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "20 g"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a 45-50 °C antes de servir",
      "esterilizacion": "No autoclave",
      "noAutoclave": true,
      "pasos": [
        "Suspender el polvo en agua destilada.",
        "Calentar con agitación y hervir cerca de 1 minuto.",
        "No autoclave: la selectividad disminuye con calor excesivo.",
        "Servir 20 mL por placa en condiciones estériles.",
        "Preparar idealmente el día previo y proteger de la luz."
      ]
    },
    "interpretacionVisual": "Colonias negras, marrón-negras o con brillo metálico sugieren Salmonella productora de H2S.",
    "colorColonias": "Negras / brillo metálico sobre medio verde-pardo.",
    "riesgosBiologicos": [
      "Patógeno entérico",
      "Potencial zoonótico",
      "Manipular en bioseguridad adecuada"
    ],
    "notasLab": "La selectividad cae después de 48 h; mantener placas en oscuridad.",
    "relaciones": {
      "bacterias": [
        "salmonella-spp"
      ],
      "caldos": [
        "selenite-cystine-broth",
        "tetrathionate-broth",
        "buffered-peptone-water"
      ],
      "pruebas": [
        "tsi",
        "sim",
        "citrato-simmons",
        "ureasa"
      ],
      "antibioticos": [
        "enrofloxacina",
        "ciprofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "macconkey-agar",
    "tipoEntidad": "agar",
    "nombre": "MacConkey Agar",
    "alternativo": "MAC",
    "subtitulo": "Para: bacilos Gram negativos entéricos",
    "tipos": [
      "selectivo",
      "diferencial",
      "enterobacterias"
    ],
    "gramosPorLitro": 51.5,
    "phFinal": "7.1 ± 0.2",
    "objetivo": "Aislar enterobacterias y diferenciar fermentadoras de lactosa.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "salmonella-spp",
      "klebsiella-pneumoniae",
      "proteus-mirabilis"
    ],
    "bacteriasInhibidas": [
      "Gram positivas por sales biliares y cristal violeta"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "17 g"
      },
      {
        "ingrediente": "Lactosa",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Sales biliares",
        "cantidad": "1.5 g"
      },
      {
        "ingrediente": "NaCl",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Rojo neutro",
        "cantidad": "0.03 g"
      },
      {
        "ingrediente": "Cristal violeta",
        "cantidad": "0.001 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "13.5 g"
      }
    ],
    "preparacion": {
      "temperatura": "Servir a 45-50 °C",
      "esterilizacion": "Autoclave 121 °C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender el medio en agua destilada.",
        "Calentar hasta disolver completamente.",
        "Autoclavar a 121 °C por 15 minutos.",
        "Enfriar a 45-50 °C y servir en placas estériles."
      ]
    },
    "interpretacionVisual": "Colonias rosadas: lactosa positivas. Colonias incoloras: no fermentadoras de lactosa.",
    "colorColonias": "E. coli rosado intenso; Salmonella incolora; Klebsiella mucoide rosada.",
    "riesgosBiologicos": [
      "Muestras fecales",
      "Enterobacterias zoonóticas posibles"
    ],
    "notasLab": "Útil como punto de entrada para pruebas TSI, SIM, citrato e indol.",
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "salmonella-spp",
        "klebsiella-pneumoniae",
        "proteus-mirabilis"
      ],
      "caldos": [
        "buffered-peptone-water",
        "tryptic-soy-broth"
      ],
      "pruebas": [
        "tsi",
        "sim",
        "citrato-simmons",
        "indol"
      ],
      "antibioticos": [
        "enrofloxacina",
        "gentamicina",
        "trimetoprim-sulfa",
        "amoxicilina-clavulanato"
      ]
    }
  },
  {
    "id": "mueller-hinton-agar",
    "tipoEntidad": "agar",
    "nombre": "Mueller Hinton Agar",
    "alternativo": "MHA / agar para antibiograma",
    "subtitulo": "Para: sensibilidad antimicrobiana",
    "tipos": [
      "antibiograma",
      "nutritivo",
      "clsi"
    ],
    "gramosPorLitro": 38,
    "phFinal": "7.3 ± 0.2",
    "objetivo": "Estándar para difusión en disco y lectura de halos de inhibición.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "staphylococcus-spp",
      "pseudomonas-aeruginosa",
      "pasteurella-multocida",
      "klebsiella-pneumoniae"
    ],
    "bacteriasInhibidas": [
      "No selectivo: no inhibe de forma intencional"
    ],
    "composicion": [
      {
        "ingrediente": "Infusión de carne",
        "cantidad": "2 g"
      },
      {
        "ingrediente": "Hidrolizado ácido de caseína",
        "cantidad": "17.5 g"
      },
      {
        "ingrediente": "Almidón",
        "cantidad": "1.5 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "17 g"
      }
    ],
    "preparacion": {
      "temperatura": "Servir a 45-50 °C",
      "esterilizacion": "Autoclave 121 °C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender 38 g por litro en agua desmineralizada o destilada.",
        "Calentar hasta disolver.",
        "Autoclavar a 121 °C por 15 minutos.",
        "Servir a espesor uniforme para antibiograma."
      ]
    },
    "interpretacionVisual": "Césped bacteriano homogéneo con halos nítidos alrededor de discos.",
    "colorColonias": "Medio ámbar claro; colonias según microorganismo.",
    "riesgosBiologicos": [
      "Aerosoles al preparar inóculo",
      "Lectura dependiente de cepa y estándar"
    ],
    "notasLab": "Controlar pH, espesor y concentración del inóculo; pequeñas variaciones alteran halos.",
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "staphylococcus-spp",
        "pseudomonas-aeruginosa",
        "pasteurella-multocida",
        "klebsiella-pneumoniae"
      ],
      "caldos": [
        "tryptic-soy-broth",
        "thioglycollate-broth"
      ],
      "pruebas": [
        "catalasa",
        "oxidasa"
      ],
      "antibioticos": [
        "enrofloxacina",
        "ciprofloxacina",
        "gentamicina",
        "ceftiofur",
        "oxitetraciclina",
        "amoxicilina-clavulanato"
      ]
    }
  },
  {
    "id": "mannitol-salt-agar",
    "tipoEntidad": "agar",
    "nombre": "Mannitol Salt Agar",
    "alternativo": "MSA",
    "subtitulo": "Para: Staphylococcus spp.",
    "tipos": [
      "selectivo",
      "diferencial",
      "halotolerante"
    ],
    "gramosPorLitro": 111,
    "phFinal": "7.4 ± 0.2",
    "objetivo": "Seleccionar estafilococos por tolerancia a NaCl y diferenciar fermentación de manitol.",
    "bacteriasObjetivoIds": [
      "staphylococcus-spp"
    ],
    "bacteriasInhibidas": [
      "Bacterias no halotolerantes",
      "muchos Gram negativos"
    ],
    "composicion": [
      {
        "ingrediente": "Peptonas",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Extracto de carne",
        "cantidad": "1 g"
      },
      {
        "ingrediente": "NaCl",
        "cantidad": "75 g"
      },
      {
        "ingrediente": "D-manitol",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Rojo fenol",
        "cantidad": "0.025 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "15 g"
      }
    ],
    "preparacion": {
      "temperatura": "Servir a 45-50 °C",
      "esterilizacion": "Autoclave 121 °C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender el medio deshidratado.",
        "Calentar con agitación hasta disolver.",
        "Autoclavar a 121 °C por 15 minutos.",
        "Enfriar y servir placas."
      ]
    },
    "interpretacionVisual": "Viraje amarillo alrededor de colonias: fermentación de manitol.",
    "colorColonias": "Colonias cremosas; halo amarillo en fermentadoras.",
    "riesgosBiologicos": [
      "Estafilococos oportunistas",
      "Riesgo de cepas resistentes"
    ],
    "notasLab": "Confirmar con catalasa, coagulasa y perfil clínico.",
    "relaciones": {
      "bacterias": [
        "staphylococcus-spp"
      ],
      "caldos": [
        "tryptic-soy-broth"
      ],
      "pruebas": [
        "catalasa",
        "coagulasa"
      ],
      "antibioticos": [
        "amoxicilina-clavulanato",
        "ceftiofur",
        "oxitetraciclina"
      ]
    }
  },
  {
    "id": "blood-agar",
    "tipoEntidad": "agar",
    "nombre": "Agar Sangre",
    "alternativo": "BAP",
    "subtitulo": "Para: bacterias exigentes y hemólisis",
    "tipos": [
      "enriquecido",
      "diferencial",
      "hemolisis"
    ],
    "gramosPorLitro": 40,
    "phFinal": "7.3 ± 0.2",
    "objetivo": "Cultivar bacterias exigentes y observar patrones de hemólisis.",
    "bacteriasObjetivoIds": [
      "staphylococcus-spp",
      "streptococcus-spp",
      "pasteurella-multocida"
    ],
    "bacteriasInhibidas": [
      "No selectivo; puede requerir condiciones especiales"
    ],
    "composicion": [
      {
        "ingrediente": "Base nutritiva",
        "cantidad": "40 g"
      },
      {
        "ingrediente": "Sangre desfibrinada",
        "cantidad": "5-10%"
      }
    ],
    "preparacion": {
      "temperatura": "Agregar sangre a 45-50 °C",
      "esterilizacion": "Autoclave de la base; no autoclave con sangre",
      "noAutoclave": false,
      "pasos": [
        "Preparar y autoclavar la base.",
        "Enfriar a 45-50 °C.",
        "Agregar sangre desfibrinada estéril.",
        "Mezclar suavemente y servir placas."
      ]
    },
    "interpretacionVisual": "Beta: halo claro; alfa: halo verdoso; gamma: sin hemólisis.",
    "colorColonias": "Variable; observar hemólisis alrededor de la colonia.",
    "riesgosBiologicos": [
      "Material biológico",
      "Patógenos respiratorios o cutáneos"
    ],
    "notasLab": "Evitar agregar sangre con el medio demasiado caliente para no lisar células.",
    "relaciones": {
      "bacterias": [
        "staphylococcus-spp",
        "streptococcus-spp",
        "pasteurella-multocida"
      ],
      "caldos": [
        "tryptic-soy-broth",
        "thioglycollate-broth"
      ],
      "pruebas": [
        "catalasa",
        "coagulasa",
        "oxidasa"
      ],
      "antibioticos": [
        "amoxicilina-clavulanato",
        "ceftiofur",
        "enrofloxacina"
      ]
    }
  },
  {
    "id": "xld-agar",
    "tipoEntidad": "agar",
    "nombre": "XLD Agar",
    "alternativo": "Xylose Lysine Deoxycholate",
    "subtitulo": "Para: Salmonella y Shigella",
    "tipos": [
      "selectivo",
      "diferencial",
      "enteropatogenos"
    ],
    "gramosPorLitro": 55,
    "phFinal": "7.4 ± 0.2",
    "objetivo": "Diferenciar enteropatógenos por fermentación de xilosa, descarboxilación de lisina y H2S.",
    "bacteriasObjetivoIds": [
      "salmonella-spp"
    ],
    "bacteriasInhibidas": [
      "Gram positivas",
      "flora intestinal sensible a desoxicolato"
    ],
    "composicion": [
      {
        "ingrediente": "Extracto de levadura",
        "cantidad": "3 g"
      },
      {
        "ingrediente": "Xilosa / lactosa / sacarosa",
        "cantidad": "22.5 g"
      },
      {
        "ingrediente": "L-lisina",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Desoxicolato sódico",
        "cantidad": "2.5 g"
      },
      {
        "ingrediente": "Tiosulfato / citrato férrico",
        "cantidad": "6.8 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "13.5 g"
      }
    ],
    "preparacion": {
      "temperatura": "No sobrecalentar; servir a 45-50 °C",
      "esterilizacion": "Hervir hasta disolver; no sobreautoclavar",
      "noAutoclave": true,
      "pasos": [
        "Suspender y calentar con agitación.",
        "Evitar calentamiento prolongado.",
        "Enfriar a 45-50 °C.",
        "Servir placas en condiciones estériles."
      ]
    },
    "interpretacionVisual": "Salmonella: colonias rojas con centro negro. Fermentadoras: amarillas.",
    "colorColonias": "Rojo con centro negro para H2S positivo.",
    "riesgosBiologicos": [
      "Enteropatógenos zoonóticos",
      "Muestras fecales"
    ],
    "notasLab": "Usar junto a enriquecimiento selectivo y confirmación bioquímica.",
    "relaciones": {
      "bacterias": [
        "salmonella-spp",
        "escherichia-coli",
        "proteus-mirabilis"
      ],
      "caldos": [
        "selenite-cystine-broth",
        "tetrathionate-broth"
      ],
      "pruebas": [
        "tsi",
        "sim",
        "citrato-simmons"
      ],
      "antibioticos": [
        "enrofloxacina",
        "ciprofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "nutrient-agar",
    "tipoEntidad": "agar",
    "nombre": "Nutrient Agar",
    "alternativo": "Agar nutritivo / HiMedia M001",
    "subtitulo": "Para: cultivo general no exigente",
    "tipos": [
      "nutritivo",
      "general",
      "no selectivo"
    ],
    "gramosPorLitro": 28,
    "phFinal": "7.4 ? 0.2",
    "objetivo": "Cultivo, mantenimiento y recuento general de bacterias no exigentes.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "staphylococcus-spp",
      "bacillus-anthracis"
    ],
    "bacteriasInhibidas": [
      "No selectivo: no inhibe de forma intencional"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Extracto de carne / extracto equivalente",
        "cantidad": "3 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "15 g"
      },
      {
        "ingrediente": "Componentes ajustados por fabricante",
        "cantidad": "Consultar ficha t?cnica oficial"
      }
    ],
    "preparacion": {
      "temperatura": "Servir a 45-50 ?C",
      "esterilizacion": "Autoclave 121 ?C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender el medio en agua destilada.",
        "Calentar hasta disolver completamente.",
        "Autoclavar a 121 ?C por 15 minutos.",
        "Enfriar a 45-50 ?C y servir en placas est?riles."
      ]
    },
    "interpretacionVisual": "Crecimiento no diferencial; evaluar morfolog?a colonial general.",
    "colorColonias": "Variable seg?n microorganismo; medio ?mbar claro.",
    "riesgosBiologicos": [
      "Dependen del microorganismo inoculado",
      "Manipular con bioseguridad de laboratorio"
    ],
    "notasLab": "?til para control de viabilidad, mantenimiento y cultivos puros no fastidiosos.",
    "fuentes": [
      "HiMedia Nutrient Agar M001 Technical Data / ficha oficial del fabricante"
    ],
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "staphylococcus-spp",
        "bacillus-anthracis"
      ],
      "caldos": [
        "nutrient-broth",
        "tryptic-soy-broth"
      ],
      "pruebas": [
        "catalasa",
        "oxidasa",
        "gram-tincion"
      ],
      "antibioticos": [
        "doxiciclina",
        "florfenicol"
      ]
    }
  },
  {
    "id": "emb-agar",
    "tipoEntidad": "agar",
    "nombre": "Levine EMB Agar",
    "alternativo": "Eosin Methylene Blue Agar / EMB",
    "subtitulo": "Para: enterobacterias y coliformes",
    "tipos": [
      "selectivo",
      "diferencial",
      "enterobacterias"
    ],
    "gramosPorLitro": 37.46,
    "phFinal": "7.1 ? 0.2",
    "objetivo": "Aislar y diferenciar bacilos Gram negativos ent?ricos por fermentaci?n de lactosa.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "klebsiella-pneumoniae",
      "salmonella-spp"
    ],
    "bacteriasInhibidas": [
      "Gram positivas por colorantes eosina Y y azul de metileno"
    ],
    "composicion": [
      {
        "ingrediente": "Digesti?n pancre?tica de gelatina",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Fosfato dipot?sico",
        "cantidad": "2 g"
      },
      {
        "ingrediente": "Lactosa",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Eosina Y",
        "cantidad": "0.4 g"
      },
      {
        "ingrediente": "Azul de metileno",
        "cantidad": "0.065 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "15 g"
      }
    ],
    "preparacion": {
      "temperatura": "Servir a 45-50 ?C",
      "esterilizacion": "Autoclave 121 ?C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender en agua destilada.",
        "Calentar hasta disolver.",
        "Autoclavar a 121 ?C por 15 minutos.",
        "Enfriar y servir en placas est?riles protegidas de luz intensa."
      ]
    },
    "interpretacionVisual": "E. coli puede mostrar brillo verde met?lico; fermentadores de lactosa son oscuros; no fermentadores son incoloros o ?mbar.",
    "colorColonias": "E. coli verde met?lico; Salmonella incolora/?mbar; Klebsiella mucoide oscura.",
    "riesgosBiologicos": [
      "Enterobacterias zoon?ticas posibles",
      "Muestras fecales y alimentarias"
    ],
    "notasLab": "Complementa MacConkey para lectura de coliformes y enterobacterias.",
    "fuentes": [
      "FDA BAM Media M80 Levine EMB Agar",
      "HiMedia M022I Levine EMB Agar Technical Data"
    ],
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "klebsiella-pneumoniae",
        "salmonella-spp"
      ],
      "caldos": [
        "buffered-peptone-water",
        "nutrient-broth"
      ],
      "pruebas": [
        "indol",
        "mr-vp",
        "citrato-simmons"
      ],
      "antibioticos": [
        "ampicilina",
        "gentamicina",
        "doxiciclina"
      ]
    }
  },
  {
    "id": "hektoen-enteric-agar",
    "tipoEntidad": "agar",
    "nombre": "Hektoen Enteric Agar",
    "alternativo": "HE Agar",
    "subtitulo": "Para: Salmonella y Shigella en muestras ent?ricas",
    "tipos": [
      "selectivo",
      "diferencial",
      "enteropatogenos"
    ],
    "gramosPorLitro": 75.67,
    "phFinal": "7.5 ? 0.2",
    "objetivo": "Aislamiento diferencial de Salmonella y Shigella desde alimentos, heces o muestras ent?ricas.",
    "bacteriasObjetivoIds": [
      "salmonella-spp",
      "escherichia-coli"
    ],
    "bacteriasInhibidas": [
      "Gram positivas",
      "parte de flora coliforme acompa?ante"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "12 g"
      },
      {
        "ingrediente": "Extracto de levadura",
        "cantidad": "3 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Sales biliares",
        "cantidad": "9 g"
      },
      {
        "ingrediente": "Lactosa",
        "cantidad": "12 g"
      },
      {
        "ingrediente": "Sacarosa",
        "cantidad": "12 g"
      },
      {
        "ingrediente": "Salicina",
        "cantidad": "2 g"
      },
      {
        "ingrediente": "Tiosulfato de sodio",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Citrato f?rrico am?nico",
        "cantidad": "1.5 g"
      },
      {
        "ingrediente": "Indicadores",
        "cantidad": "Bromotimol blue / fucsina ?cida"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "14 g"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a 45-50 ?C antes de servir",
      "esterilizacion": "No autoclave",
      "noAutoclave": true,
      "pasos": [
        "Suspender en agua destilada.",
        "Calentar con agitaci?n hasta ebullici?n y disolver.",
        "No autoclave ni sobrecaliente.",
        "Enfriar a 45-50 ?C y servir en placas est?riles."
      ]
    },
    "interpretacionVisual": "Salmonella: colonias azul-verdosas con posible centro negro. Fermentadoras: naranja/salm?n.",
    "colorColonias": "Salmonella azul-verde con centro negro; coliformes naranja/salm?n.",
    "riesgosBiologicos": [
      "Enteropat?genos zoon?ticos",
      "Muestras fecales y alimentos contaminados"
    ],
    "notasLab": "Medio ?til como alternativa/confirmaci?n junto a XLD y Bismuth Sulphite.",
    "fuentes": [
      "FDA BAM Media M61 Hektoen Enteric Agar",
      "HiMedia Hektoen Enteric Agar M467F",
      "TM Media TD-TM-2107 Hektoen Enteric Agar Medium product data sheet"
    ],
    "relaciones": {
      "bacterias": [
        "salmonella-spp",
        "escherichia-coli"
      ],
      "caldos": [
        "selenite-f-broth",
        "tetrathionate-broth",
        "buffered-peptone-water"
      ],
      "pruebas": [
        "tsi",
        "lia",
        "sim",
        "ureasa"
      ],
      "antibioticos": [
        "ampicilina",
        "ciprofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "cetrimide-agar",
    "tipoEntidad": "agar",
    "nombre": "Cetrimide Agar",
    "alternativo": "Agar cetrimida / HiMedia M024",
    "subtitulo": "Para: Pseudomonas aeruginosa",
    "tipos": [
      "selectivo",
      "diferencial",
      "pseudomonas"
    ],
    "gramosPorLitro": 46,
    "phFinal": "7.2 ? 0.2",
    "objetivo": "Aislamiento selectivo y estimulaci?n de pigmentos caracter?sticos de Pseudomonas aeruginosa.",
    "bacteriasObjetivoIds": [
      "pseudomonas-aeruginosa"
    ],
    "bacteriasInhibidas": [
      "Muchas bacterias Gram positivas y parte de Gram negativas no resistentes a cetrimida"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona / digestos nutritivos",
        "cantidad": "Consultar ficha t?cnica oficial"
      },
      {
        "ingrediente": "Cloruro de magnesio / sulfato de potasio",
        "cantidad": "Consultar ficha t?cnica oficial"
      },
      {
        "ingrediente": "Cetrimida",
        "cantidad": "Agente selectivo"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "Consultar ficha t?cnica oficial"
      }
    ],
    "preparacion": {
      "temperatura": "Servir a 45-50 ?C",
      "esterilizacion": "Autoclave 121 ?C por 15 min; agregar glicerol si la f?rmula lo requiere",
      "noAutoclave": false,
      "pasos": [
        "Suspender el medio en agua destilada.",
        "Agregar glicerol si lo indica el fabricante.",
        "Calentar hasta disolver.",
        "Autoclavar a 121 ?C por 15 minutos y servir."
      ]
    },
    "interpretacionVisual": "P. aeruginosa puede producir pigmento azul-verde/fluorescente y olor caracter?stico.",
    "colorColonias": "Colonias verdosas, azuladas o fluorescentes seg?n cepa.",
    "riesgosBiologicos": [
      "Pat?geno oportunista",
      "Riesgo en heridas, otitis y ambiente hospitalario"
    ],
    "notasLab": "Confirmar con oxidasa, pigmento, olor, crecimiento y pruebas complementarias.",
    "fuentes": [
      "HiMedia Cetrimide Agar Base M024 / ficha t?cnica oficial",
      "Merck/Sigma Cetrimide Agar Base product information"
    ],
    "relaciones": {
      "bacterias": [
        "pseudomonas-aeruginosa"
      ],
      "caldos": [
        "tryptic-soy-broth",
        "nutrient-broth"
      ],
      "pruebas": [
        "oxidasa",
        "nitrate-reduction"
      ],
      "antibioticos": [
        "gentamicina",
        "ciprofloxacina",
        "marbofloxacina"
      ]
    }
  },
  {
    "id": "baird-parker-agar",
    "tipoEntidad": "agar",
    "nombre": "Baird Parker Agar Base",
    "alternativo": "Baird-Parker con yema de huevo/telurito",
    "subtitulo": "Para: Staphylococcus coagulasa positivos",
    "tipos": [
      "selectivo",
      "diferencial",
      "staphylococcus"
    ],
    "gramosPorLitro": 58,
    "phFinal": "7.2 ? 0.2",
    "objetivo": "Aislamiento y enumeraci?n de Staphylococcus coagulasa positivos en alimentos, leche y muestras veterinarias.",
    "bacteriasObjetivoIds": [
      "staphylococcus-spp"
    ],
    "bacteriasInhibidas": [
      "Flora acompa?ante sensible a telurito/litio y suplementos selectivos"
    ],
    "composicion": [
      {
        "ingrediente": "Tryptone / digestos de case?na",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Extracto de carne",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Extracto de levadura",
        "cantidad": "1 g"
      },
      {
        "ingrediente": "Glicina",
        "cantidad": "12 g"
      },
      {
        "ingrediente": "Piruvato de sodio",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Cloruro de litio",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "15 g"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a 45-50 ?C antes de suplementar",
      "esterilizacion": "Autoclave 121 ?C por 15 min; a?adir yema/telurito de forma as?ptica",
      "noAutoclave": false,
      "pasos": [
        "Suspender la base en agua destilada.",
        "Calentar hasta disolver.",
        "Autoclavar la base.",
        "Enfriar a 45-50 ?C.",
        "Agregar suplemento de yema de huevo/telurito seg?n fabricante y servir."
      ]
    },
    "interpretacionVisual": "S. aureus t?pico: colonias negras/brillantes con halo claro por actividad lecitinasa/lipasa.",
    "colorColonias": "Negras a gris oscuras con halo claro en cepas t?picas.",
    "riesgosBiologicos": [
      "Mastitis, piodermas, alimentos contaminados",
      "Manipular cepas toxig?nicas con precauci?n"
    ],
    "notasLab": "Confirmar con coagulasa, catalasa y pruebas complementarias.",
    "fuentes": [
      "HiMedia Baird Parker Agar Base M043I",
      "ISO 6888-1 referencia del fabricante"
    ],
    "relaciones": {
      "bacterias": [
        "staphylococcus-spp"
      ],
      "caldos": [
        "brain-heart-infusion-broth",
        "tryptic-soy-broth"
      ],
      "pruebas": [
        "coagulasa",
        "catalasa",
        "gram-tincion"
      ],
      "antibioticos": [
        "penicilina-g",
        "clindamicina",
        "cefoxitina",
        "doxiciclina"
      ]
    }
  },
  {
    "id": "brucella-agar-base",
    "tipoEntidad": "agar",
    "nombre": "Brucella Agar Base",
    "alternativo": "HiMedia M074",
    "subtitulo": "Para: Brucella y bacterias fastidiosas",
    "tipos": [
      "enriquecido",
      "fastidiosos",
      "zoonosis"
    ],
    "gramosPorLitro": 43.1,
    "phFinal": "7.0 ? 0.2",
    "objetivo": "Cultivo enriquecido de Brucella spp., Campylobacter y otros microorganismos exigentes con suplementos adecuados.",
    "bacteriasObjetivoIds": [
      "brucella-spp",
      "campylobacter-jejuni"
    ],
    "bacteriasInhibidas": [
      "No selectivo sin suplementos; selectividad depende de suplemento antibi?tico"
    ],
    "composicion": [
      {
        "ingrediente": "Tryptone",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Peptona",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Extracto de levadura",
        "cantidad": "2 g"
      },
      {
        "ingrediente": "Glucosa",
        "cantidad": "1 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Bisulfito de sodio",
        "cantidad": "0.1 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "15 g"
      }
    ],
    "preparacion": {
      "temperatura": "Servir a 45-50 ?C",
      "esterilizacion": "Autoclave 121 ?C por 15 min; agregar suero/sangre o suplemento si corresponde",
      "noAutoclave": false,
      "pasos": [
        "Suspender en agua destilada.",
        "Calentar hasta disolver.",
        "Autoclavar a 121 ?C por 15 minutos.",
        "Enfriar y agregar suplementos est?riles indicados.",
        "Servir en placas est?riles."
      ]
    },
    "interpretacionVisual": "Crecimiento de colonias peque?as y no hemol?ticas puede requerir incubaci?n prolongada y atm?sfera adecuada.",
    "colorColonias": "Variable; Brucella suele formar colonias peque?as, lisas y transl?cidas.",
    "riesgosBiologicos": [
      "Brucella spp. es zoon?tica y de alto riesgo ocupacional",
      "Trabajar solo con bioseguridad y normativa aplicable"
    ],
    "notasLab": "No manipular sospecha de Brucella fuera de laboratorio autorizado.",
    "fuentes": [
      "HiMedia Brucella Agar Base M074 Technical Data"
    ],
    "relaciones": {
      "bacterias": [
        "brucella-spp",
        "campylobacter-jejuni"
      ],
      "caldos": [
        "brucella-broth-base",
        "brain-heart-infusion-broth"
      ],
      "pruebas": [
        "oxidasa",
        "catalasa",
        "ureasa"
      ],
      "antibioticos": [
        "doxiciclina",
        "gentamicina"
      ]
    }
  },
  {
    "id": "campylobacter-agar-base",
    "tipoEntidad": "agar",
    "nombre": "Campylobacter Agar Base",
    "alternativo": "HiMedia M994 / Skirrow-Blaser-Wang seg?n suplemento",
    "subtitulo": "Para: Campylobacter spp.",
    "tipos": [
      "selectivo",
      "fastidiosos",
      "microaerofilia"
    ],
    "gramosPorLitro": 39.5,
    "phFinal": "7.4 ? 0.2",
    "objetivo": "Aislamiento selectivo de Campylobacter desde heces, alimentos o ambiente con sangre y suplemento antibi?tico.",
    "bacteriasObjetivoIds": [
      "campylobacter-jejuni"
    ],
    "bacteriasInhibidas": [
      "Flora fecal acompa?ante seg?n suplemento Blaser-Wang o Skirrow"
    ],
    "composicion": [
      {
        "ingrediente": "Proteose peptone",
        "cantidad": "15 g"
      },
      {
        "ingrediente": "Digest equivalente hep?tico",
        "cantidad": "2.5 g"
      },
      {
        "ingrediente": "Extracto de levadura",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "12 g"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a 40-50 ?C antes de agregar sangre/suplementos",
      "esterilizacion": "Autoclave 121 ?C por 15 min; suplementos despu?s de enfriar",
      "noAutoclave": false,
      "pasos": [
        "Suspender la base en agua destilada.",
        "Calentar hasta disolver completamente.",
        "Autoclavar a 121 ?C por 15 minutos.",
        "Enfriar a 40-50 ?C.",
        "Agregar sangre y suplemento selectivo en condiciones as?pticas.",
        "Incubar en microaerofilia."
      ]
    },
    "interpretacionVisual": "C. jejuni puede formar colonias grises, planas, no hemol?ticas o mucoides; crecimiento favorecido a 42 ?C.",
    "colorColonias": "Gris?ceas, transl?cidas o ligeramente rosadas seg?n cepa.",
    "riesgosBiologicos": [
      "Enteropat?geno zoon?tico",
      "Muestras fecales de aves, bovinos, caninos y alimentos"
    ],
    "notasLab": "Requiere atm?sfera microaerof?lica; una incubaci?n convencional puede dar falsos negativos.",
    "fuentes": [
      "HiMedia Campylobacter Agar Base M994"
    ],
    "relaciones": {
      "bacterias": [
        "campylobacter-jejuni"
      ],
      "caldos": [
        "campylobacter-enrichment-broth"
      ],
      "pruebas": [
        "oxidasa",
        "catalasa",
        "gram-tincion"
      ],
      "antibioticos": [
        "azitromicina",
        "doxiciclina"
      ]
    }
  },
  {
    "id": "listeria-oxford-agar",
    "tipoEntidad": "agar",
    "nombre": "Listeria Oxford Medium Base",
    "alternativo": "Oxford agar / HiMedia M1145",
    "subtitulo": "Para: Listeria spp.",
    "tipos": [
      "selectivo",
      "diferencial",
      "listeria"
    ],
    "gramosPorLitro": 55.5,
    "phFinal": "7.0 ? 0.2",
    "objetivo": "Aislamiento selectivo de Listeria desde muestras cl?nicas, alimentos o ambiente con suplemento Oxford.",
    "bacteriasObjetivoIds": [
      "listeria-monocytogenes"
    ],
    "bacteriasInhibidas": [
      "Gram negativos y parte de Gram positivos por litio y suplemento selectivo"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona especial",
        "cantidad": "23 g"
      },
      {
        "ingrediente": "Cloruro de litio",
        "cantidad": "15 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Almid?n de ma?z",
        "cantidad": "1 g"
      },
      {
        "ingrediente": "Esculina",
        "cantidad": "1 g"
      },
      {
        "ingrediente": "Citrato f?rrico am?nico",
        "cantidad": "0.5 g"
      },
      {
        "ingrediente": "Agar",
        "cantidad": "10 g"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a 45-50 ?C antes de suplementar",
      "esterilizacion": "Autoclave 121 ?C por 15 min; suplemento despu?s de enfriar",
      "noAutoclave": false,
      "pasos": [
        "Suspender la base en agua destilada.",
        "Calentar hasta disolver.",
        "Autoclavar a 121 ?C por 15 minutos.",
        "Enfriar a 45-50 ?C.",
        "Agregar suplemento Oxford o CM seg?n fabricante.",
        "Servir y secar placas antes de usar."
      ]
    },
    "interpretacionVisual": "Colonias de Listeria con ennegrecimiento del medio por hidr?lisis de esculina.",
    "colorColonias": "Colonias peque?as con halo/zonas negras.",
    "riesgosBiologicos": [
      "Zoonosis alimentaria",
      "Riesgo en rumiantes, aves, alimentos y gestantes"
    ],
    "notasLab": "Confirmar con Gram, catalasa, movilidad tumbling/CAMP y pruebas complementarias.",
    "fuentes": [
      "HiMedia Listeria Oxford Medium Base M1145"
    ],
    "relaciones": {
      "bacterias": [
        "listeria-monocytogenes"
      ],
      "caldos": [
        "brain-heart-infusion-broth",
        "tryptic-soy-broth"
      ],
      "pruebas": [
        "catalasa",
        "camp-test",
        "gram-tincion"
      ],
      "antibioticos": [
        "ampicilina",
        "penicilina-g",
        "doxiciclina"
      ]
    }
  }
];
})();
