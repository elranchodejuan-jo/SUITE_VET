// =============================================================================
// SUITE VET / FITBET 2.2 - modules/micro/data/caldodata.js
// Base de caldos.
// =============================================================================

(function () {
  "use strict";

  window.MICRO_DATA_PARTS = window.MICRO_DATA_PARTS || {};
  window.MICRO_DATA_PARTS.caldos = [
  {
    "id": "buffered-peptone-water",
    "tipoEntidad": "caldo",
    "nombre": "Buffered Peptone Water",
    "alternativo": "BPW / Agua peptonada tamponada",
    "subtitulo": "Para: preenriquecimiento de enterobacterias",
    "tipos": [
      "preenriquecimiento",
      "nutritivo",
      "no selectivo"
    ],
    "gramosPorLitro": 20,
    "phFinal": "7.2 ± 0.2",
    "objetivo": "Recuperar bacterias lesionadas antes de enriquecimientos selectivos.",
    "bacteriasObjetivoIds": [
      "salmonella-spp",
      "escherichia-coli"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "NaCl",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Fosfato disódico",
        "cantidad": "3.5 g"
      },
      {
        "ingrediente": "Fosfato monopotásico",
        "cantidad": "1.5 g"
      }
    ],
    "preparacion": {
      "temperatura": "Disolver antes de esterilizar",
      "esterilizacion": "Autoclave 121 °C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender en agua destilada.",
        "Distribuir en frascos o tubos.",
        "Autoclavar.",
        "Enfriar antes de inocular."
      ]
    },
    "interpretacionVisual": "Turbidez sugiere crecimiento; no es diferencial.",
    "notasLab": "Paso previo útil antes de caldos selectivos para Salmonella.",
    "relaciones": {
      "bacterias": [
        "salmonella-spp",
        "escherichia-coli"
      ],
      "agares": [
        "bismuth-sulfite-agar",
        "xld-agar",
        "macconkey-agar"
      ],
      "pruebas": [
        "tsi",
        "sim",
        "citrato-simmons"
      ],
      "antibioticos": [
        "enrofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "selenite-cystine-broth",
    "tipoEntidad": "caldo",
    "nombre": "Caldo Selenito Cistina",
    "alternativo": "SC Broth",
    "subtitulo": "Para: enriquecimiento selectivo de Salmonella",
    "tipos": [
      "selectivo",
      "enriquecimiento",
      "salmonella"
    ],
    "gramosPorLitro": 23,
    "phFinal": "7.0 ± 0.2",
    "objetivo": "Favorecer Salmonella e inhibir parte de la flora intestinal competidora.",
    "bacteriasObjetivoIds": [
      "salmonella-spp"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Lactosa",
        "cantidad": "4 g"
      },
      {
        "ingrediente": "Selenito sódico",
        "cantidad": "4 g"
      },
      {
        "ingrediente": "L-cistina",
        "cantidad": "0.01 g"
      },
      {
        "ingrediente": "Fosfatos",
        "cantidad": "10 g"
      }
    ],
    "preparacion": {
      "temperatura": "Evitar sobrecalentamiento",
      "esterilizacion": "No autoclave en formulaciones sensibles",
      "noAutoclave": true,
      "pasos": [
        "Disolver con calor suave.",
        "Evitar ebullición prolongada.",
        "Distribuir asépticamente.",
        "Incubar según protocolo."
      ]
    },
    "interpretacionVisual": "Turbidez variable; subcultivar a agar selectivo.",
    "notasLab": "El selenito es tóxico; manipular polvo con cuidado.",
    "relaciones": {
      "bacterias": [
        "salmonella-spp"
      ],
      "agares": [
        "bismuth-sulfite-agar",
        "xld-agar"
      ],
      "pruebas": [
        "tsi",
        "sim",
        "citrato-simmons"
      ],
      "antibioticos": [
        "ciprofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "tetrathionate-broth",
    "tipoEntidad": "caldo",
    "nombre": "Caldo Tetrationato",
    "alternativo": "TT Broth",
    "subtitulo": "Para: enriquecimiento de Salmonella",
    "tipos": [
      "selectivo",
      "enriquecimiento",
      "salmonella"
    ],
    "gramosPorLitro": 46,
    "phFinal": "8.0 ± 0.2",
    "objetivo": "Enriquecimiento selectivo de Salmonella en muestras con flora mixta.",
    "bacteriasObjetivoIds": [
      "salmonella-spp"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Sales biliares",
        "cantidad": "1 g"
      },
      {
        "ingrediente": "Carbonato cálcico",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Tiosulfato sódico",
        "cantidad": "30 g"
      },
      {
        "ingrediente": "Yodo-yoduro",
        "cantidad": "Suplemento"
      }
    ],
    "preparacion": {
      "temperatura": "Agregar yodo cuando corresponda, ya frío",
      "esterilizacion": "No autoclave con suplementos termosensibles",
      "noAutoclave": true,
      "pasos": [
        "Preparar la base.",
        "Enfriar.",
        "Añadir suplemento yodo-yoduro de forma aséptica.",
        "Usar según protocolo."
      ]
    },
    "interpretacionVisual": "Subcultivar a agar selectivo; no usar color como diagnóstico final.",
    "notasLab": "Muy útil cuando se sospecha Salmonella con flora acompañante abundante.",
    "relaciones": {
      "bacterias": [
        "salmonella-spp"
      ],
      "agares": [
        "bismuth-sulfite-agar",
        "xld-agar"
      ],
      "pruebas": [
        "tsi",
        "sim"
      ],
      "antibioticos": [
        "enrofloxacina",
        "ciprofloxacina"
      ]
    }
  },
  {
    "id": "tryptic-soy-broth",
    "tipoEntidad": "caldo",
    "nombre": "Tryptic Soy Broth",
    "alternativo": "TSB",
    "subtitulo": "Para: crecimiento general",
    "tipos": [
      "nutritivo",
      "no selectivo",
      "uso general"
    ],
    "gramosPorLitro": 30,
    "phFinal": "7.3 ± 0.2",
    "objetivo": "Cultivo general, recuperación bacteriana y preparación de inóculos.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "staphylococcus-spp",
      "pseudomonas-aeruginosa",
      "pasteurella-multocida"
    ],
    "composicion": [
      {
        "ingrediente": "Digerido pancreático de caseína",
        "cantidad": "17 g"
      },
      {
        "ingrediente": "Digerido papaico de soya",
        "cantidad": "3 g"
      },
      {
        "ingrediente": "NaCl",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Fosfato dipotásico",
        "cantidad": "2.5 g"
      },
      {
        "ingrediente": "Glucosa",
        "cantidad": "2.5 g"
      }
    ],
    "preparacion": {
      "temperatura": "Disolver completamente",
      "esterilizacion": "Autoclave 121 °C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender 30 g/L.",
        "Distribuir.",
        "Autoclavar.",
        "Enfriar y almacenar protegido."
      ]
    },
    "interpretacionVisual": "Turbidez indica crecimiento.",
    "notasLab": "No selectivo; útil para reactivar cultivos antes de pruebas.",
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "staphylococcus-spp",
        "pseudomonas-aeruginosa",
        "pasteurella-multocida"
      ],
      "agares": [
        "mueller-hinton-agar",
        "blood-agar",
        "mannitol-salt-agar",
        "macconkey-agar"
      ],
      "pruebas": [
        "catalasa",
        "oxidasa",
        "coagulasa"
      ],
      "antibioticos": [
        "enrofloxacina",
        "gentamicina",
        "ceftiofur"
      ]
    }
  },
  {
    "id": "thioglycollate-broth",
    "tipoEntidad": "caldo",
    "nombre": "Caldo Tioglicolato",
    "alternativo": "Fluid Thioglycollate Medium",
    "subtitulo": "Para: aerobios, anaerobios y microaerófilos",
    "tipos": [
      "enriquecido",
      "redox",
      "anaerobios"
    ],
    "gramosPorLitro": 29.8,
    "phFinal": "7.1 ± 0.2",
    "objetivo": "Evaluar crecimiento según requerimiento de oxígeno y recuperar bacterias exigentes.",
    "bacteriasObjetivoIds": [
      "streptococcus-spp",
      "pasteurella-multocida",
      "staphylococcus-spp"
    ],
    "composicion": [
      {
        "ingrediente": "Peptonas",
        "cantidad": "20 g"
      },
      {
        "ingrediente": "Glucosa",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Tioglicolato sódico",
        "cantidad": "0.5 g"
      },
      {
        "ingrediente": "L-cistina",
        "cantidad": "0.5 g"
      },
      {
        "ingrediente": "Agar bajo",
        "cantidad": "0.75 g"
      },
      {
        "ingrediente": "Resazurina",
        "cantidad": "Indicador"
      }
    ],
    "preparacion": {
      "temperatura": "Recalentar suavemente si hay oxidación superficial",
      "esterilizacion": "Autoclave 121 °C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender el medio.",
        "Calentar hasta disolver.",
        "Distribuir en tubos profundos.",
        "Autoclavar y enfriar sin agitar excesivamente."
      ]
    },
    "interpretacionVisual": "Crecimiento superficial: aerobio; crecimiento profundo: anaerobio o microaerófilo.",
    "notasLab": "La banda rosada indica oxidación; no agitar antes de interpretar.",
    "relaciones": {
      "bacterias": [
        "streptococcus-spp",
        "pasteurella-multocida",
        "staphylococcus-spp"
      ],
      "agares": [
        "blood-agar",
        "mueller-hinton-agar"
      ],
      "pruebas": [
        "catalasa",
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
    "id": "brain-heart-infusion-broth",
    "tipoEntidad": "caldo",
    "nombre": "Brain Heart Infusion Broth",
    "alternativo": "BHI Broth / HiMedia M210",
    "subtitulo": "Para: bacterias exigentes y hemocultivo",
    "tipos": [
      "enriquecido",
      "fastidiosos",
      "no selectivo"
    ],
    "gramosPorLitro": 37,
    "phFinal": "7.4 ? 0.2",
    "objetivo": "Propagaci?n de cocos pat?genos y microorganismos fastidiosos en investigaci?n cl?nica y veterinaria.",
    "bacteriasObjetivoIds": [
      "staphylococcus-spp",
      "streptococcus-spp",
      "listeria-monocytogenes",
      "trueperella-pyogenes"
    ],
    "composicion": [
      {
        "ingrediente": "Infusi?n cerebro-coraz?n y peptonas",
        "cantidad": "Consultar ficha t?cnica oficial"
      },
      {
        "ingrediente": "Dextrosa / fosfatos / NaCl",
        "cantidad": "Consultar ficha t?cnica oficial"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a temperatura de uso despu?s de esterilizar",
      "esterilizacion": "Autoclave 121 ?C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender en agua destilada.",
        "Calentar si es necesario hasta disolver.",
        "Distribuir en tubos o frascos.",
        "Autoclavar a 121 ?C por 15 minutos."
      ]
    },
    "interpretacionVisual": "Turbidez indica crecimiento; confirmar pureza con subcultivo.",
    "observaciones": "?til para recuperaci?n de bacterias exigentes antes de pruebas o conservaci?n corta.",
    "fuentes": [
      "HiMedia Brain Heart Infusion Broth M210",
      "TM Media TD-TM-362 Brain Heart Infusion Broth product data sheet"
    ],
    "relaciones": {
      "bacterias": [
        "staphylococcus-spp",
        "streptococcus-spp",
        "listeria-monocytogenes",
        "trueperella-pyogenes"
      ],
      "agares": [
        "blood-agar",
        "baird-parker-agar",
        "listeria-oxford-agar"
      ],
      "pruebas": [
        "coagulasa",
        "camp-test",
        "gram-tincion"
      ],
      "antibioticos": [
        "penicilina-g",
        "ampicilina",
        "clindamicina"
      ]
    }
  },
  {
    "id": "nutrient-broth",
    "tipoEntidad": "caldo",
    "nombre": "Nutrient Broth",
    "alternativo": "Caldo nutritivo / HiMedia M002",
    "subtitulo": "Para: cultivo general",
    "tipos": [
      "nutritivo",
      "general",
      "no selectivo"
    ],
    "gramosPorLitro": 13,
    "phFinal": "7.4 ? 0.2",
    "objetivo": "Cultivo general de bacterias no exigentes y preparaci?n de in?culos.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "staphylococcus-spp",
      "bacillus-anthracis"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Extracto de carne",
        "cantidad": "3 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "5 g"
      }
    ],
    "preparacion": {
      "temperatura": "Usar despu?s de enfriar",
      "esterilizacion": "Autoclave 121 ?C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender en agua destilada.",
        "Distribuir en tubos o frascos.",
        "Autoclavar a 121 ?C por 15 minutos."
      ]
    },
    "interpretacionVisual": "Turbidez o sedimento compatible con crecimiento.",
    "observaciones": "No es selectivo; siempre confirmar pureza.",
    "fuentes": [
      "HiMedia Nutrient Broth M002 / Nutrient HiVeg Agar-Broth reference"
    ],
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "staphylococcus-spp",
        "bacillus-anthracis"
      ],
      "agares": [
        "nutrient-agar",
        "emb-agar"
      ],
      "pruebas": [
        "catalasa",
        "oxidasa"
      ],
      "antibioticos": [
        "doxiciclina",
        "gentamicina"
      ]
    }
  },
  {
    "id": "brucella-broth-base",
    "tipoEntidad": "caldo",
    "nombre": "Brucella Broth Base",
    "alternativo": "HiMedia M348",
    "subtitulo": "Para: Brucella, Campylobacter y anaerobios con suplementos",
    "tipos": [
      "enriquecido",
      "fastidiosos"
    ],
    "gramosPorLitro": 28.1,
    "phFinal": "7.0 ? 0.2",
    "objetivo": "Enriquecimiento y cultivo de Brucella spp. y microorganismos exigentes con suplementos adecuados.",
    "bacteriasObjetivoIds": [
      "brucella-spp",
      "campylobacter-jejuni"
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
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar antes de agregar suplementos",
      "esterilizacion": "Autoclave 121 ?C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender en agua destilada.",
        "Calentar si es necesario.",
        "Distribuir y autoclavar.",
        "Agregar suplemento est?ril si el protocolo lo requiere."
      ]
    },
    "interpretacionVisual": "Turbidez lenta; subcultivar para confirmar crecimiento.",
    "observaciones": "Manipular sospecha de Brucella solo bajo normas de bioseguridad aplicables.",
    "fuentes": [
      "HiMedia Brucella Broth Base M348 / Brucella Agar-Broth reference"
    ],
    "relaciones": {
      "bacterias": [
        "brucella-spp",
        "campylobacter-jejuni"
      ],
      "agares": [
        "brucella-agar-base",
        "campylobacter-agar-base"
      ],
      "pruebas": [
        "ureasa",
        "oxidasa",
        "catalasa"
      ],
      "antibioticos": [
        "doxiciclina",
        "gentamicina"
      ]
    }
  },
  {
    "id": "selenite-f-broth",
    "tipoEntidad": "caldo",
    "nombre": "Selenite F Broth",
    "alternativo": "Caldo selenito F / HiMedia M025S",
    "subtitulo": "Para: Salmonella y Shigella",
    "tipos": [
      "enriquecimiento",
      "selectivo",
      "enteropatogenos"
    ],
    "gramosPorLitro": 23,
    "phFinal": "7.1 ? 0.2",
    "objetivo": "Enriquecimiento selectivo de Salmonella/Shigella en muestras fecales, alimentos o materiales patol?gicos.",
    "bacteriasObjetivoIds": [
      "salmonella-spp"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Lactosa",
        "cantidad": "4 g"
      },
      {
        "ingrediente": "Fosfatos",
        "cantidad": "10 g aprox."
      },
      {
        "ingrediente": "Selenito ?cido de sodio",
        "cantidad": "4 g"
      }
    ],
    "preparacion": {
      "temperatura": "No sobrecalentar",
      "esterilizacion": "Ba?o de agua hirviendo o vapor fluente 30 min; no autoclave",
      "noAutoclave": true,
      "pasos": [
        "Disolver parte B y a?adir parte A seg?n ficha t?cnica.",
        "Calentar suavemente hasta disolver.",
        "Distribuir en tubos.",
        "Esterilizar por vapor fluente o ba?o hirviendo 30 minutos.",
        "No autoclave."
      ]
    },
    "interpretacionVisual": "Crecimiento/enriquecimiento no confirmatorio; subcultivar en XLD, HE o Bismuth Sulphite.",
    "observaciones": "El selenito es t?xico y corrosivo; manejar con cuidado.",
    "fuentes": [
      "HiMedia Selenite F Broth M025S / MM052 Technical Data"
    ],
    "relaciones": {
      "bacterias": [
        "salmonella-spp"
      ],
      "agares": [
        "xld-agar",
        "hektoen-enteric-agar",
        "bismuth-sulfite-agar"
      ],
      "pruebas": [
        "tsi",
        "lia",
        "sim"
      ],
      "antibioticos": [
        "ampicilina",
        "ciprofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "campylobacter-enrichment-broth",
    "tipoEntidad": "caldo",
    "nombre": "Campylobacter Enrichment Broth Base",
    "alternativo": "Preston Enrichment Broth Base / HiMedia M899",
    "subtitulo": "Para: Campylobacter spp.",
    "tipos": [
      "enriquecimiento",
      "selectivo",
      "microaerofilia"
    ],
    "gramosPorLitro": 25,
    "phFinal": "7.5 ? 0.2",
    "objetivo": "Enriquecimiento selectivo de Campylobacter termotolerantes desde alimentos, heces o muestras ambientales.",
    "bacteriasObjetivoIds": [
      "campylobacter-jejuni"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "HM peptone B / extracto equivalente",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "5 g"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a 45-50 ?C antes de agregar sangre/suplemento",
      "esterilizacion": "Autoclave 121 ?C por 15 min; suplemento despu?s de enfriar",
      "noAutoclave": false,
      "pasos": [
        "Suspender la base en agua destilada.",
        "Autoclavar a 121 ?C por 15 minutos.",
        "Enfriar a 45-50 ?C.",
        "Agregar sangre lisada y suplemento Preston/PRTC.",
        "Incubar en microaerofilia seg?n protocolo."
      ]
    },
    "interpretacionVisual": "Enriquecimiento no confirmatorio; subcultivar en Campylobacter Agar Base.",
    "observaciones": "Requiere microaerofilia y control de temperatura.",
    "fuentes": [
      "HiMedia Campylobacter Enrichment Broth Base M899 Technical Data"
    ],
    "relaciones": {
      "bacterias": [
        "campylobacter-jejuni"
      ],
      "agares": [
        "campylobacter-agar-base"
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
    "id": "rappaport-vassiliadis-soy-broth",
    "tipoEntidad": "caldo",
    "nombre": "Rappaport Vassiliadis Soya Broth",
    "alternativo": "RVS / RVSM Broth",
    "subtitulo": "Para: enriquecimiento selectivo de Salmonella",
    "tipos": [
      "selectivo",
      "enriquecimiento",
      "salmonella"
    ],
    "gramosPorLitro": 26.58,
    "phFinal": "5.2 +/- 0.2",
    "objetivo": "Enriquecimiento selectivo de Salmonella desde alimentos, heces y muestras ambientales.",
    "bacteriasObjetivoIds": [
      "salmonella-spp"
    ],
    "composicion": [
      {
        "ingrediente": "Digestos / peptonas",
        "cantidad": "Consultar ficha tecnica oficial"
      },
      {
        "ingrediente": "Cloruro de magnesio",
        "cantidad": "Consultar ficha tecnica oficial"
      },
      {
        "ingrediente": "Verde malaquita",
        "cantidad": "Consultar ficha tecnica oficial"
      },
      {
        "ingrediente": "Buffer fosfato",
        "cantidad": "Consultar ficha tecnica oficial"
      }
    ],
    "preparacion": {
      "temperatura": "Disolver antes de esterilizar",
      "esterilizacion": "Autoclave 115 C por 15 min o segun ficha tecnica",
      "noAutoclave": false,
      "pasos": [
        "Suspender en agua destilada.",
        "Calentar suavemente hasta disolver.",
        "Distribuir en tubos o frascos.",
        "Esterilizar segun ficha tecnica del fabricante.",
        "Incubar segun protocolo de Salmonella y subcultivar en agares selectivos."
      ]
    },
    "interpretacionVisual": "Turbidez no confirma Salmonella; requiere subcultivo en XLD, Bismuth Sulphite o Brilliant Green.",
    "observaciones": "Medio acido y selectivo; respetar temperatura y tiempo del protocolo.",
    "fuentes": [
      "HiMedia M1448I Rappaport Vassiliadis Soyabean Meal Broth Technical Data",
      "ISO 6579-1 como referencia de protocolo"
    ],
    "relaciones": {
      "bacterias": [
        "salmonella-spp"
      ],
      "agares": [
        "xld-agar",
        "bismuth-sulfite-agar",
        "brilliant-green-agar",
        "hektoen-enteric-agar"
      ],
      "pruebas": [
        "tsi",
        "sim",
        "lia",
        "citrato-simmons"
      ],
      "antibioticos": [
        "ampicilina",
        "ceftiofur",
        "ciprofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "alkaline-peptone-water",
    "tipoEntidad": "caldo",
    "nombre": "Alkaline Peptone Water",
    "alternativo": "APW / Agua peptonada alcalina",
    "subtitulo": "Para: enriquecimiento de Vibrio spp.",
    "tipos": [
      "enriquecimiento",
      "alcalino",
      "vibrio"
    ],
    "gramosPorLitro": 20,
    "phFinal": "8.4 +/- 0.2",
    "objetivo": "Favorecer Vibrio spp. antes del aislamiento en TCBS u otros medios selectivos.",
    "bacteriasObjetivoIds": [
      "vibrio-spp"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "10 g"
      }
    ],
    "preparacion": {
      "temperatura": "Disolver completamente antes de esterilizar",
      "esterilizacion": "Autoclave 121 C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender 20 g/L en agua destilada.",
        "Calentar si es necesario para disolver.",
        "Distribuir en tubos o frascos.",
        "Autoclavar a 121 C por 15 minutos.",
        "Inocular y subcultivar en TCBS segun protocolo."
      ]
    },
    "interpretacionVisual": "Turbidez indica crecimiento; no es prueba confirmatoria.",
    "observaciones": "El pH alcalino favorece Vibrio pero no excluye otras bacterias tolerantes.",
    "fuentes": [
      "HiMedia M618 Alkaline Peptone Water Technical Data"
    ],
    "relaciones": {
      "bacterias": [
        "vibrio-spp"
      ],
      "agares": [
        "tcbs-agar"
      ],
      "pruebas": [
        "oxidasa",
        "gram-tincion",
        "indol"
      ],
      "antibioticos": [
        "doxiciclina",
        "ciprofloxacina",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "fraser-broth-base",
    "tipoEntidad": "caldo",
    "nombre": "Fraser Broth Base",
    "alternativo": "Half Fraser / Fraser modificado",
    "subtitulo": "Para: enriquecimiento de Listeria spp.",
    "tipos": [
      "enriquecimiento",
      "selectivo",
      "listeria"
    ],
    "gramosPorLitro": 54.97,
    "phFinal": "7.2 +/- 0.2",
    "objetivo": "Enriquecimiento selectivo de Listeria en alimentos, ambiente o muestras clinicas compatibles.",
    "bacteriasObjetivoIds": [
      "listeria-monocytogenes"
    ],
    "composicion": [
      {
        "ingrediente": "Peptonas / extractos",
        "cantidad": "Consultar ficha tecnica oficial"
      },
      {
        "ingrediente": "Esculina",
        "cantidad": "1 g"
      },
      {
        "ingrediente": "Citrato ferrico amonico",
        "cantidad": "Consultar ficha tecnica oficial"
      },
      {
        "ingrediente": "Suplemento selectivo",
        "cantidad": "Agregar segun fabricante"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar a 45-50 C antes de agregar suplementos",
      "esterilizacion": "Autoclave 121 C por 15 min para la base",
      "noAutoclave": false,
      "pasos": [
        "Suspender la base en agua destilada.",
        "Calentar hasta disolver completamente.",
        "Autoclavar la base.",
        "Enfriar a 45-50 C.",
        "Agregar suplemento Fraser en condiciones asepticas.",
        "Incubar y subcultivar en Listeria Oxford u otro agar selectivo."
      ]
    },
    "interpretacionVisual": "Oscurecimiento del caldo puede sugerir hidrolisis de esculina, pero requiere aislamiento y confirmacion.",
    "observaciones": "Usar como parte de protocolo validado de Listeria; no emitir diagnostico solo por color.",
    "fuentes": [
      "HiMedia M1764 Fraser Broth Base Modified Technical Data"
    ],
    "relaciones": {
      "bacterias": [
        "listeria-monocytogenes"
      ],
      "agares": [
        "listeria-oxford-agar",
        "blood-agar"
      ],
      "pruebas": [
        "gram-tincion",
        "catalasa",
        "camp-test",
        "bile-esculin"
      ],
      "antibioticos": [
        "ampicilina",
        "penicilina-g",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "mueller-hinton-broth",
    "tipoEntidad": "caldo",
    "nombre": "Mueller Hinton Broth",
    "alternativo": "MHB",
    "subtitulo": "Para: sensibilidad antimicrobiana por dilucion",
    "tipos": [
      "antibiograma",
      "nutritivo",
      "estandarizado"
    ],
    "gramosPorLitro": 21,
    "phFinal": "7.3 +/- 0.1",
    "objetivo": "Determinacion in vitro de sensibilidad bacteriana por metodos de dilucion.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "staphylococcus-spp",
      "pseudomonas-aeruginosa"
    ],
    "composicion": [
      {
        "ingrediente": "Infusion HM B",
        "cantidad": "2 g"
      },
      {
        "ingrediente": "Acicase / caseina hidrolizada",
        "cantidad": "17.5 g"
      },
      {
        "ingrediente": "Almidon",
        "cantidad": "1.5 g"
      }
    ],
    "preparacion": {
      "temperatura": "Hervir antes de autoclavar para dispersar almidon",
      "esterilizacion": "Autoclave 121 C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender 21 g/L en agua destilada.",
        "Calentar hasta ebullicion y mezclar bien.",
        "Distribuir en tubos o frascos.",
        "Autoclavar a 121 C por 15 minutos.",
        "Ajustar cationes solo si el protocolo validado lo solicita."
      ]
    },
    "interpretacionVisual": "No es diferencial; se usa como base para MIC o dilucion.",
    "observaciones": "Interpretar sensibilidad con CLSI VET u otra norma aplicable.",
    "fuentes": [
      "HiMedia M391 Mueller Hinton Broth Technical Data",
      "CLSI VET vigente"
    ],
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "staphylococcus-spp",
        "pseudomonas-aeruginosa",
        "salmonella-spp"
      ],
      "agares": [
        "mueller-hinton-agar"
      ],
      "pruebas": [
        "gram-tincion",
        "oxidasa",
        "catalasa"
      ],
      "antibioticos": [
        "amikacina",
        "gentamicina",
        "ciprofloxacina",
        "ceftiofur",
        "trimetoprim-sulfa"
      ]
    }
  },
  {
    "id": "pplo-broth-base",
    "tipoEntidad": "caldo",
    "nombre": "PPLO Broth Base",
    "alternativo": "Mycoplasma Broth Base",
    "subtitulo": "Para: Mycoplasma spp.",
    "tipos": [
      "enriquecimiento",
      "fastidioso",
      "mycoplasma"
    ],
    "gramosPorLitro": 21,
    "phFinal": "7.8 +/- 0.2",
    "objetivo": "Base liquida para cultivo o enriquecimiento de micoplasmas con suplementos especificos.",
    "bacteriasObjetivoIds": [
      "mycoplasma-bovis"
    ],
    "composicion": [
      {
        "ingrediente": "Infusion de corazon bovino",
        "cantidad": "Equivalente segun fabricante"
      },
      {
        "ingrediente": "Peptona / digestos",
        "cantidad": "10 g"
      },
      {
        "ingrediente": "Cloruro de sodio",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Suplementos para micoplasma",
        "cantidad": "Agregar segun protocolo"
      }
    ],
    "preparacion": {
      "temperatura": "Enfriar antes de agregar suero/suplementos",
      "esterilizacion": "Autoclave 121 C por 15 min para la base",
      "noAutoclave": false,
      "pasos": [
        "Suspender la base en agua destilada.",
        "Disolver completamente.",
        "Autoclavar la base.",
        "Enfriar y agregar suplementos especificos.",
        "Incubar por tiempos prolongados segun protocolo de Mycoplasma."
      ]
    },
    "interpretacionVisual": "Cambio de color o turbidez depende del suplemento; confirmar por cultivo, PCR o metodo validado.",
    "observaciones": "Mycoplasma requiere protocolos estrictos; evitar interpretar como cultivo bacteriano comun.",
    "fuentes": [
      "HiMedia M267 Mycoplasma Broth / PPLO Broth Base Technical Data"
    ],
    "relaciones": {
      "bacterias": [
        "mycoplasma-bovis"
      ],
      "agares": [
        "pplo-agar-base"
      ],
      "pruebas": [
        "gram-tincion"
      ],
      "antibioticos": [
        "tetraciclina",
        "doxiciclina",
        "tilmicosina",
        "tulamicina"
      ]
    }
  },
  {
    "id": "lactose-broth",
    "tipoEntidad": "caldo",
    "nombre": "Lactose Broth",
    "alternativo": "Caldo lactosado",
    "subtitulo": "Para: coliformes y preenriquecimiento",
    "tipos": [
      "nutritivo",
      "diferencial",
      "coliformes"
    ],
    "gramosPorLitro": 13,
    "phFinal": "6.9 +/- 0.2",
    "objetivo": "Deteccion presuntiva de coliformes por produccion de acido/gas o preenriquecimiento de enterobacterias.",
    "bacteriasObjetivoIds": [
      "escherichia-coli",
      "klebsiella-pneumoniae"
    ],
    "composicion": [
      {
        "ingrediente": "Peptona",
        "cantidad": "5 g"
      },
      {
        "ingrediente": "Extracto de carne",
        "cantidad": "3 g"
      },
      {
        "ingrediente": "Lactosa",
        "cantidad": "5 g"
      }
    ],
    "preparacion": {
      "temperatura": "Disolver antes de esterilizar",
      "esterilizacion": "Autoclave 121 C por 15 min",
      "noAutoclave": false,
      "pasos": [
        "Suspender el medio en agua destilada.",
        "Distribuir en tubos con campana Durham si se evaluara gas.",
        "Autoclavar a 121 C por 15 minutos.",
        "Enfriar antes de inocular.",
        "Leer acido/gas segun protocolo."
      ]
    },
    "interpretacionVisual": "Turbidez y gas en Durham sugieren fermentacion de lactosa por coliformes.",
    "observaciones": "No es confirmatorio; subcultivar e identificar con pruebas complementarias.",
    "fuentes": [
      "Manual de microbiologia de alimentos",
      "Consultar ficha tecnica oficial del fabricante usado"
    ],
    "relaciones": {
      "bacterias": [
        "escherichia-coli",
        "klebsiella-pneumoniae"
      ],
      "agares": [
        "macconkey-agar",
        "emb-agar",
        "sorbitol-macconkey-agar"
      ],
      "pruebas": [
        "onpg",
        "indol",
        "mr-vp",
        "citrato-simmons"
      ],
      "antibioticos": [
        "enrofloxacina",
        "gentamicina",
        "trimetoprim-sulfa"
      ]
    }
  }
];
})();
