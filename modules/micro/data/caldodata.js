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
  }
];
})();
