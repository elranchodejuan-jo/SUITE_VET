// =============================================================================
// SUITE VET / FITBET 2.2 - modules/micro/data/atlasdata.js
// Atlas bacteriano.
// =============================================================================

(function () {
  "use strict";

  window.MICRO_DATA_PARTS = window.MICRO_DATA_PARTS || {};
  window.MICRO_DATA_PARTS.microorganismos = [
  {
    "id": "escherichia-coli",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Escherichia coli",
    "subtitulo": "Enterobacteriaceae · bacilo Gram negativo",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "bacilo",
    "familia": "Enterobacteriaceae",
    "reservorio": "Microbiota intestinal de animales domésticos y humanos.",
    "importancia": "Diarrea neonatal, colibacilosis, ITU, mastitis y septicemia.",
    "patogenicidad": "Fimbrias, toxinas, adhesinas, cápsula y LPS según patotipo.",
    "toxinas": [
      "Enterotoxinas LT/ST",
      "Shiga-toxina en patotipos específicos",
      "LPS"
    ],
    "sistemasClave": [
      "digestivo",
      "urinario",
      "mamario",
      "sistemico"
    ],
    "agaresIds": [
      "macconkey-agar",
      "mueller-hinton-agar",
      "emb-agar",
      "nutrient-agar"
    ],
    "caldosIds": [
      "buffered-peptone-water",
      "tryptic-soy-broth",
      "nutrient-broth"
    ],
    "pruebasIds": [
      "tsi",
      "sim",
      "indol",
      "citrato-simmons",
      "mr-vp",
      "mio",
      "gram-tincion"
    ],
    "antibioticosIds": [
      "enrofloxacina",
      "gentamicina",
      "trimetoprim-sulfa",
      "amoxicilina-clavulanato",
      "ampicilina",
      "doxiciclina",
      "marbofloxacina"
    ],
    "resistencia": [
      "ESBL",
      "AmpC",
      "quinolonas",
      "sulfonamidas"
    ],
    "zoonosis": "Algunos patotipos son zoonóticos y de importancia alimentaria.",
    "observacionesClinicas": "Interpretar junto a muestra, carga bacteriana y signos clínicos.",
    "notasLab": "Lactosa positiva en MacConkey; indol usualmente positivo."
  },
  {
    "id": "salmonella-spp",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Salmonella spp.",
    "subtitulo": "Enterobacteriaceae · zoonosis entérica",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "bacilo",
    "familia": "Enterobacteriaceae",
    "reservorio": "Intestino de aves, reptiles, mamíferos y ambiente contaminado.",
    "importancia": "Enteritis, septicemia, abortos y brotes alimentarios.",
    "patogenicidad": "Invasión intestinal, supervivencia intracelular y endotoxemia.",
    "toxinas": [
      "Endotoxina LPS",
      "Factores de invasión SPI"
    ],
    "sistemasClave": [
      "digestivo",
      "sistemico",
      "reproductivo"
    ],
    "agaresIds": [
      "bismuth-sulfite-agar",
      "xld-agar",
      "macconkey-agar",
      "mueller-hinton-agar",
      "hektoen-enteric-agar"
    ],
    "caldosIds": [
      "buffered-peptone-water",
      "selenite-cystine-broth",
      "tetrathionate-broth",
      "selenite-f-broth"
    ],
    "pruebasIds": [
      "tsi",
      "sim",
      "citrato-simmons",
      "ureasa",
      "lia",
      "mio",
      "gram-tincion"
    ],
    "antibioticosIds": [
      "enrofloxacina",
      "ciprofloxacina",
      "trimetoprim-sulfa",
      "ceftiofur",
      "ampicilina",
      "doxiciclina"
    ],
    "resistencia": [
      "Quinolonas",
      "cefalosporinas de importancia crítica",
      "multirresistencia plasmídica"
    ],
    "zoonosis": "Alta relevancia zoonótica y de salud pública.",
    "observacionesClinicas": "Confirmar aislamiento con batería bioquímica y serotipificación si aplica.",
    "notasLab": "H2S frecuente; en Bismuth Sulphite puede formar colonias negras metálicas."
  },
  {
    "id": "staphylococcus-spp",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Staphylococcus spp.",
    "subtitulo": "Cocos Gram positivos · piel y mucosas",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "coco",
    "familia": "Staphylococcaceae",
    "reservorio": "Piel, mucosas y oído externo de perros, gatos y animales de producción.",
    "importancia": "Piodermia, otitis, mastitis, heridas y bacteriemias.",
    "patogenicidad": "Adhesinas, biopelícula, enzimas, toxinas y evasión inmune.",
    "toxinas": [
      "Hemolisinas",
      "Leucotoxinas",
      "Enterotoxinas en algunas cepas"
    ],
    "sistemasClave": [
      "dermatologico",
      "mamario",
      "sistemico",
      "urinario"
    ],
    "agaresIds": [
      "mannitol-salt-agar",
      "blood-agar",
      "mueller-hinton-agar",
      "baird-parker-agar",
      "nutrient-agar"
    ],
    "caldosIds": [
      "tryptic-soy-broth",
      "thioglycollate-broth",
      "brain-heart-infusion-broth",
      "nutrient-broth"
    ],
    "pruebasIds": [
      "catalasa",
      "coagulasa",
      "gram-tincion",
      "hemolisis"
    ],
    "antibioticosIds": [
      "amoxicilina-clavulanato",
      "ceftiofur",
      "oxitetraciclina",
      "penicilina-g",
      "clindamicina",
      "cefoxitina"
    ],
    "resistencia": [
      "Meticilina/mecA",
      "macrólidos",
      "tetraciclinas"
    ],
    "zoonosis": "Algunas especies y clones pueden transferirse entre animales y humanos.",
    "observacionesClinicas": "El antibiograma es clave en piodermias recurrentes.",
    "notasLab": "Catalasa positivo; coagulasa orienta especies patógenas."
  },
  {
    "id": "pasteurella-multocida",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Pasteurella multocida",
    "subtitulo": "Pasteurellaceae · respiratorio",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "cocobacilo",
    "familia": "Pasteurellaceae",
    "reservorio": "Nasofaringe de aves, conejos, rumiantes, perros y gatos.",
    "importancia": "Neumonía, septicemia, coriza, abscesos y mordeduras.",
    "patogenicidad": "Cápsula, LPS, adhesinas y toxina dermonecrótica en cepas específicas.",
    "toxinas": [
      "LPS",
      "Toxina dermonecrótica en cepas tipo D"
    ],
    "sistemasClave": [
      "respiratorio",
      "sistemico",
      "dermatologico"
    ],
    "agaresIds": [
      "blood-agar",
      "mueller-hinton-agar"
    ],
    "caldosIds": [
      "tryptic-soy-broth",
      "thioglycollate-broth",
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "oxidasa",
      "catalasa",
      "gram-tincion"
    ],
    "antibioticosIds": [
      "ceftiofur",
      "amoxicilina-clavulanato",
      "enrofloxacina",
      "oxitetraciclina",
      "doxiciclina",
      "florfenicol",
      "marbofloxacina",
      "tulamicina"
    ],
    "resistencia": [
      "Tetraciclinas variables",
      "beta-lactamasas ocasionales"
    ],
    "zoonosis": "Importante en heridas por mordedura y contacto estrecho.",
    "observacionesClinicas": "Muestra respiratoria debe tomarse antes de antibióticos.",
    "notasLab": "Oxidasa positiva; crecimiento en agar sangre."
  },
  {
    "id": "pseudomonas-aeruginosa",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Pseudomonas aeruginosa",
    "subtitulo": "No fermentador · oportunista ambiental",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "bacilo",
    "familia": "Pseudomonadaceae",
    "reservorio": "Agua, suelos húmedos, ambientes hospitalarios y biofilms.",
    "importancia": "Otitis crónica, heridas, neumonía, infecciones urinarias y sepsis oportunista.",
    "patogenicidad": "Biofilm, exotoxina A, elastasas, pigmentos y resistencia intrínseca.",
    "toxinas": [
      "Exotoxina A",
      "Piocianina",
      "Elastasas"
    ],
    "sistemasClave": [
      "dermatologico",
      "respiratorio",
      "urinario",
      "sistemico"
    ],
    "agaresIds": [
      "mueller-hinton-agar",
      "blood-agar",
      "cetrimide-agar"
    ],
    "caldosIds": [
      "tryptic-soy-broth"
    ],
    "pruebasIds": [
      "oxidasa",
      "catalasa",
      "nitrate-reduction",
      "gram-tincion"
    ],
    "antibioticosIds": [
      "gentamicina",
      "ciprofloxacina",
      "enrofloxacina",
      "marbofloxacina"
    ],
    "resistencia": [
      "Bombas de eflujo",
      "AmpC",
      "biofilm",
      "carbapenemasas"
    ],
    "zoonosis": "Oportunista; riesgo en pacientes inmunocomprometidos.",
    "observacionesClinicas": "Requiere antibiograma; resistencia impredecible.",
    "notasLab": "Oxidasa positiva; olor característico y pigmentos verdes/azules en algunos cultivos."
  },
  {
    "id": "klebsiella-pneumoniae",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Klebsiella pneumoniae",
    "subtitulo": "Enterobacteriaceae · cápsula marcada",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "bacilo",
    "familia": "Enterobacteriaceae",
    "reservorio": "Intestino, mucosas, ambiente y superficies hospitalarias.",
    "importancia": "Neumonía, mastitis, ITU y sepsis oportunista.",
    "patogenicidad": "Cápsula antífagocítica, sideróforos, LPS y biopelícula.",
    "toxinas": [
      "LPS"
    ],
    "sistemasClave": [
      "respiratorio",
      "urinario",
      "mamario",
      "sistemico"
    ],
    "agaresIds": [
      "macconkey-agar",
      "mueller-hinton-agar"
    ],
    "caldosIds": [
      "tryptic-soy-broth"
    ],
    "pruebasIds": [
      "citrato-simmons",
      "ureasa",
      "indol",
      "tsi"
    ],
    "antibioticosIds": [
      "gentamicina",
      "ceftiofur",
      "ciprofloxacina"
    ],
    "resistencia": [
      "ESBL",
      "carbapenemasas",
      "AmpC"
    ],
    "zoonosis": "Riesgo oportunista y nosocomial.",
    "observacionesClinicas": "Colonias mucoides sugieren cápsula abundante.",
    "notasLab": "Lactosa positiva mucoide en MacConkey; indol usualmente negativo."
  },
  {
    "id": "proteus-mirabilis",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Proteus mirabilis",
    "subtitulo": "Enterobacteriaceae · ureasa positivo",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "bacilo",
    "familia": "Enterobacteriaceae",
    "reservorio": "Intestino, suelo y ambiente contaminado.",
    "importancia": "ITU, urolitiasis por estruvita, heridas y otitis.",
    "patogenicidad": "Ureasa, motilidad swarming, adhesinas y endotoxina.",
    "toxinas": [
      "LPS",
      "Hemolisinas"
    ],
    "sistemasClave": [
      "urinario",
      "dermatologico"
    ],
    "agaresIds": [
      "macconkey-agar",
      "xld-agar",
      "mueller-hinton-agar"
    ],
    "caldosIds": [
      "tryptic-soy-broth"
    ],
    "pruebasIds": [
      "ureasa",
      "sim",
      "tsi",
      "indol"
    ],
    "antibioticosIds": [
      "gentamicina",
      "trimetoprim-sulfa",
      "amoxicilina-clavulanato"
    ],
    "resistencia": [
      "Tetraciclinas frecuentes",
      "resistencias plasmídicas variables"
    ],
    "zoonosis": "Oportunista; importancia clínica por ITU.",
    "observacionesClinicas": "La alcalinización urinaria puede favorecer cálculos.",
    "notasLab": "Ureasa rápida; swarming en medios no inhibitorios."
  },
  {
    "id": "streptococcus-spp",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Streptococcus spp.",
    "subtitulo": "Cocos Gram positivos · cadenas",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "coco",
    "familia": "Streptococcaceae",
    "reservorio": "Mucosas respiratorias, piel, tracto reproductivo y glándula mamaria.",
    "importancia": "Mastitis, neumonía, septicemia neonatal, abscesos y endometritis.",
    "patogenicidad": "Cápsula, hemolisinas, enzimas tisulares y evasión inmune.",
    "toxinas": [
      "Estreptolisinas",
      "Exoenzimas"
    ],
    "sistemasClave": [
      "mamario",
      "respiratorio",
      "reproductivo",
      "sistemico"
    ],
    "agaresIds": [
      "blood-agar",
      "mueller-hinton-agar"
    ],
    "caldosIds": [
      "thioglycollate-broth",
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "catalasa",
      "gram-tincion",
      "bile-esculin",
      "camp-test",
      "hemolisis"
    ],
    "antibioticosIds": [
      "amoxicilina-clavulanato",
      "ceftiofur",
      "oxitetraciclina",
      "penicilina-g",
      "ampicilina",
      "clindamicina"
    ],
    "resistencia": [
      "Macrólidos",
      "tetraciclinas"
    ],
    "zoonosis": "Algunas especies tienen importancia zoonótica.",
    "observacionesClinicas": "Interpretar hemólisis junto con especie animal y sitio anatómico.",
    "notasLab": "Catalasa negativo; alfa/beta/gamma hemólisis en agar sangre."
  },
  {
    "id": "listeria-monocytogenes",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Listeria monocytogenes",
    "subtitulo": "Listeriaceae ? bacilo Gram positivo",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "bacilo corto",
    "familia": "Listeriaceae",
    "reservorio": "Suelo, ensilaje, ambiente, alimentos y tracto intestinal de animales.",
    "importancia": "Listeriosis en rumiantes, septicemia, encefalitis, abortos y zoonosis alimentaria.",
    "patogenicidad": "Intracelular facultativa; internalinas, listeriolisina O y diseminaci?n c?lula a c?lula.",
    "toxinas": [
      "Listeriolisina O",
      "Fosfolipasas"
    ],
    "sistemasClave": [
      "nervioso",
      "reproductivo",
      "digestivo",
      "sistemico"
    ],
    "agaresIds": [
      "listeria-oxford-agar",
      "blood-agar"
    ],
    "caldosIds": [
      "brain-heart-infusion-broth",
      "tryptic-soy-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "catalasa",
      "camp-test",
      "bile-esculin"
    ],
    "antibioticosIds": [
      "ampicilina",
      "penicilina-g",
      "doxiciclina"
    ],
    "resistencia": [
      "Cefalosporinas: resistencia intr?nseca relevante"
    ],
    "zoonosis": "Zoonosis alimentaria importante; riesgo en gestantes e inmunocomprometidos.",
    "observacionesClinicas": "Sospechar en rumiantes con signos neurol?gicos, abortos o mala calidad de ensilaje.",
    "notasLab": "Colonias peque?as beta-hemol?ticas; esculina positiva en Oxford.",
    "fuentes": [
      "HiMedia Listeria Oxford Medium Base M1145",
      "WOAH/Merck Veterinary Manual para listeriosis"
    ]
  },
  {
    "id": "campylobacter-jejuni",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Campylobacter jejuni",
    "subtitulo": "Campylobacteraceae ? bacilo curvo Gram negativo",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "bacilo curvo",
    "familia": "Campylobacteraceae",
    "reservorio": "Aves, bovinos, porcinos, perros, gatos y tracto intestinal.",
    "importancia": "Enteritis zoon?tica, diarrea en animales j?venes y riesgo alimentario.",
    "patogenicidad": "Motilidad, adhesi?n, invasi?n intestinal y toxinas variables.",
    "toxinas": [
      "Cytolethal distending toxin en algunas cepas"
    ],
    "sistemasClave": [
      "digestivo",
      "zoonosis"
    ],
    "agaresIds": [
      "campylobacter-agar-base",
      "brucella-agar-base"
    ],
    "caldosIds": [
      "campylobacter-enrichment-broth",
      "brucella-broth-base"
    ],
    "pruebasIds": [
      "gram-tincion",
      "oxidasa",
      "catalasa"
    ],
    "antibioticosIds": [
      "azitromicina",
      "doxiciclina"
    ],
    "resistencia": [
      "Fluoroquinolonas en algunas regiones",
      "Macr?lidos variables seg?n vigilancia"
    ],
    "zoonosis": "Zoonosis alimentaria frecuente; aves y alimentos son fuentes relevantes.",
    "observacionesClinicas": "Requiere microaerofilia; no descartar por ausencia de crecimiento en atm?sfera com?n.",
    "notasLab": "Bacilos curvos en ?alas de gaviota?; crecimiento favorecido a 42 ?C.",
    "fuentes": [
      "HiMedia Campylobacter Agar Base M994",
      "HiMedia Campylobacter Enrichment Broth M899"
    ]
  },
  {
    "id": "brucella-spp",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Brucella spp.",
    "subtitulo": "Brucellaceae ? cocobacilo Gram negativo",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "cocobacilo",
    "familia": "Brucellaceae",
    "reservorio": "Bovinos, caprinos, ovinos, porcinos, caninos y fauna silvestre seg?n especie.",
    "importancia": "Abortos, infertilidad, orquitis, zoonosis ocupacional y enfermedad reglamentada.",
    "patogenicidad": "Intracelular facultativa con supervivencia en macr?fagos.",
    "toxinas": [
      "LPS menos endot?xico que enterobacterias"
    ],
    "sistemasClave": [
      "reproductivo",
      "sistemico",
      "zoonosis"
    ],
    "agaresIds": [
      "brucella-agar-base",
      "blood-agar"
    ],
    "caldosIds": [
      "brucella-broth-base",
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "oxidasa",
      "catalasa",
      "ureasa"
    ],
    "antibioticosIds": [
      "doxiciclina",
      "gentamicina"
    ],
    "resistencia": [
      "Interpretaci?n cl?nica depende de especie y normativa sanitaria"
    ],
    "zoonosis": "Alta importancia zoon?tica; manipulaci?n requiere laboratorio autorizado.",
    "observacionesClinicas": "Notificaci?n y confirmaci?n oficial seg?n pa?s; no manipular cultivos sospechosos sin bioseguridad.",
    "notasLab": "Crecimiento lento; colonias peque?as lisas; riesgo de aerosoles.",
    "fuentes": [
      "HiMedia Brucella Agar Base M074",
      "WOAH brucellosis guidance"
    ]
  },
  {
    "id": "clostridium-perfringens",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Clostridium perfringens",
    "subtitulo": "Clostridiaceae ? bacilo Gram positivo anaerobio",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "bacilo anaerobio",
    "familia": "Clostridiaceae",
    "reservorio": "Suelo, intestino de animales y materia org?nica.",
    "importancia": "Enterotoxemias, enteritis necr?tica, mionecrosis y enfermedad alimentaria.",
    "patogenicidad": "Producci?n de toxinas mayores y enzimas tisulares.",
    "toxinas": [
      "Alfa toxina",
      "Beta toxina",
      "?psilon toxina",
      "Iota toxina",
      "Enterotoxina"
    ],
    "sistemasClave": [
      "digestivo",
      "muscular",
      "sistemico"
    ],
    "agaresIds": [
      "blood-agar"
    ],
    "caldosIds": [
      "thioglycollate-broth",
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "nitrate-reduction",
      "hemolisis"
    ],
    "antibioticosIds": [
      "penicilina-g",
      "metronidazol",
      "ampicilina"
    ],
    "resistencia": [
      "Variable; confirmar con m?todos para anaerobios cuando corresponda"
    ],
    "zoonosis": "Algunas cepas tienen importancia alimentaria.",
    "observacionesClinicas": "Interpretar aislamiento junto a toxinas, signos y tipo de muestra.",
    "notasLab": "Anaerobio; doble zona de hem?lisis puede orientar.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria",
      "Merck Veterinary Manual"
    ]
  },
  {
    "id": "bacillus-anthracis",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Bacillus anthracis",
    "subtitulo": "Bacillaceae ? bacilo Gram positivo esporulado",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "bacilo esporulado",
    "familia": "Bacillaceae",
    "reservorio": "Suelo contaminado con esporas y herb?voros susceptibles.",
    "importancia": "Carbunco/?ntrax en herb?voros; zoonosis grave y enfermedad de notificaci?n.",
    "patogenicidad": "C?psula y toxinas edema/letal.",
    "toxinas": [
      "Factor protector",
      "Factor edema",
      "Factor letal"
    ],
    "sistemasClave": [
      "sistemico",
      "respiratorio",
      "cutaneo",
      "zoonosis"
    ],
    "agaresIds": [
      "blood-agar",
      "nutrient-agar"
    ],
    "caldosIds": [
      "nutrient-broth",
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "hemolisis",
      "catalasa"
    ],
    "antibioticosIds": [
      "penicilina-g",
      "doxiciclina",
      "ciprofloxacina"
    ],
    "resistencia": [
      "No manipular sin normativa; sensibilidad debe confirmarse en laboratorio autorizado"
    ],
    "zoonosis": "Zoonosis grave; sospecha requiere protocolos oficiales.",
    "observacionesClinicas": "No abrir cad?veres sospechosos; seguir normativa sanitaria.",
    "notasLab": "Bacilos grandes en cadenas; colonias no hemol?ticas t?picas, pero no realizar cultivos sin autorizaci?n.",
    "fuentes": [
      "WOAH anthrax guidance",
      "CDC anthrax laboratory biosafety guidance"
    ]
  },
  {
    "id": "trueperella-pyogenes",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Trueperella pyogenes",
    "subtitulo": "Actinomycetaceae ? bacilo Gram positivo pleom?rfico",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "bacilo pleomorfico",
    "familia": "Actinomycetaceae",
    "reservorio": "Mucosas y piel de rumiantes, porcinos y animales dom?sticos.",
    "importancia": "Abscesos, mastitis, metritis, neumon?a y piodermas profundas.",
    "patogenicidad": "Piolisina, adhesinas y formaci?n de abscesos.",
    "toxinas": [
      "Piolisina"
    ],
    "sistemasClave": [
      "reproductivo",
      "mamario",
      "respiratorio",
      "cutaneo"
    ],
    "agaresIds": [
      "blood-agar"
    ],
    "caldosIds": [
      "brain-heart-infusion-broth",
      "tryptic-soy-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "catalasa",
      "camp-test",
      "hemolisis"
    ],
    "antibioticosIds": [
      "penicilina-g",
      "clindamicina",
      "doxiciclina"
    ],
    "resistencia": [
      "Variable; cultivo y sensibilidad recomendados"
    ],
    "zoonosis": "Rara, oportunista.",
    "observacionesClinicas": "Frecuente en infecciones purulentas mixtas.",
    "notasLab": "Colonias peque?as beta-hemol?ticas; catalasa negativa.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria"
    ]
  },
  {
    "id": "corynebacterium-pseudotuberculosis",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Corynebacterium pseudotuberculosis",
    "subtitulo": "Corynebacteriaceae ? bacilo Gram positivo pleom?rfico",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "bacilo pleomorfico",
    "familia": "Corynebacteriaceae",
    "reservorio": "Ovinos, caprinos, equinos y ambiente contaminado.",
    "importancia": "Linfadenitis caseosa, abscesos internos y externos.",
    "patogenicidad": "Fosfolipasa D y supervivencia intracelular.",
    "toxinas": [
      "Fosfolipasa D"
    ],
    "sistemasClave": [
      "linfatico",
      "cutaneo",
      "respiratorio"
    ],
    "agaresIds": [
      "blood-agar"
    ],
    "caldosIds": [
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "catalasa",
      "ureasa",
      "nitrate-reduction"
    ],
    "antibioticosIds": [
      "penicilina-g",
      "doxiciclina"
    ],
    "resistencia": [
      "Tratamiento limitado por abscesos y encapsulaci?n; sensibilidad variable"
    ],
    "zoonosis": "Zoonosis ocasional ocupacional.",
    "observacionesClinicas": "Manejo sanitario y drenaje controlado son claves.",
    "notasLab": "Colonias peque?as secas; beta-hem?lisis estrecha puede observarse.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria",
      "Merck Veterinary Manual"
    ]
  },
  {
    "id": "bordetella-bronchiseptica",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Bordetella bronchiseptica",
    "subtitulo": "Alcaligenaceae ? cocobacilo Gram negativo",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "cocobacilo",
    "familia": "Alcaligenaceae",
    "reservorio": "V?as respiratorias de perros, gatos, cerdos y conejos.",
    "importancia": "Complejo respiratorio canino, rinitis atr?fica porcina y enfermedad respiratoria.",
    "patogenicidad": "Adhesinas, toxinas y ciliostasis.",
    "toxinas": [
      "Toxina dermonecr?tica en cepas asociadas a porcinos"
    ],
    "sistemasClave": [
      "respiratorio"
    ],
    "agaresIds": [
      "blood-agar",
      "macconkey-agar"
    ],
    "caldosIds": [
      "tryptic-soy-broth",
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "oxidasa",
      "ureasa",
      "citrato-simmons"
    ],
    "antibioticosIds": [
      "doxiciclina",
      "marbofloxacina",
      "azitromicina"
    ],
    "resistencia": [
      "Resistencia variable; cultivo y sensibilidad en casos cr?nicos"
    ],
    "zoonosis": "Zoonosis oportunista rara.",
    "observacionesClinicas": "Interpretar en contexto de coinfecciones respiratorias.",
    "notasLab": "Oxidasa y ureasa positivas frecuentemente; crecimiento en MacConkey variable.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria"
    ]
  },
  {
    "id": "erysipelothrix-rhusiopathiae",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Erysipelothrix rhusiopathiae",
    "subtitulo": "Erysipelotrichaceae ? bacilo Gram positivo delgado",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "bacilo delgado",
    "familia": "Erysipelotrichaceae",
    "reservorio": "Porcinos, aves, peces y ambiente.",
    "importancia": "Erisipela porcina, artritis, endocarditis y zoonosis ocupacional.",
    "patogenicidad": "C?psula, neuraminidasa y supervivencia tisular.",
    "toxinas": [
      "Factores de virulencia no exotoxina cl?sica principal"
    ],
    "sistemasClave": [
      "cutaneo",
      "articular",
      "cardiovascular",
      "zoonosis"
    ],
    "agaresIds": [
      "blood-agar"
    ],
    "caldosIds": [
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "catalasa",
      "hemolisis"
    ],
    "antibioticosIds": [
      "penicilina-g",
      "ampicilina"
    ],
    "resistencia": [
      "Resistencia intr?nseca reportada a vancomicina; confirmar seg?n laboratorio"
    ],
    "zoonosis": "Erisipeloide en humanos expuestos a animales/productos.",
    "observacionesClinicas": "En porcinos puede causar lesiones cut?neas romboidales.",
    "notasLab": "Catalasa negativa; colonias peque?as, alfa hem?lisis d?bil o no hemol?ticas.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria",
      "Merck Veterinary Manual"
    ]
  },
  {
    "id": "enterococcus-spp",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Enterococcus spp.",
    "subtitulo": "Enterococcaceae ? cocos Gram positivos",
    "gramKey": "grampositivo",
    "gramTexto": "Gram positivo",
    "morfologiaKey": "coco",
    "familia": "Enterococcaceae",
    "reservorio": "Intestino de animales y ambiente hospitalario.",
    "importancia": "ITU, heridas, endocarditis y vigilancia de resistencia antimicrobiana.",
    "patogenicidad": "Adhesinas, biofilm y resistencia ambiental.",
    "toxinas": [
      "Citolisinas en algunas cepas"
    ],
    "sistemasClave": [
      "urinario",
      "cutaneo",
      "cardiovascular",
      "hospitalario"
    ],
    "agaresIds": [
      "blood-agar"
    ],
    "caldosIds": [
      "brain-heart-infusion-broth",
      "tryptic-soy-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "catalasa",
      "bile-esculin"
    ],
    "antibioticosIds": [
      "ampicilina",
      "penicilina-g",
      "doxiciclina"
    ],
    "resistencia": [
      "VRE",
      "aminogluc?sidos alta concentraci?n",
      "multirresistencia hospitalaria"
    ],
    "zoonosis": "Oportunista; importancia One Health por resistencia.",
    "observacionesClinicas": "Diferenciar colonizaci?n de infecci?n verdadera seg?n muestra.",
    "notasLab": "Bilis esculina positiva; crecimiento en NaCl 6.5% seg?n prueba.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria",
      "CLSI VET vigente"
    ]
  },
  {
    "id": "actinobacillus-pleuropneumoniae",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Actinobacillus pleuropneumoniae",
    "subtitulo": "Pasteurellaceae ? cocobacilo Gram negativo",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "cocobacilo",
    "familia": "Pasteurellaceae",
    "reservorio": "Tracto respiratorio porcino.",
    "importancia": "Pleuropneumon?a porcina severa, fiebre, disnea y mortalidad.",
    "patogenicidad": "Toxinas Apx, c?psula, LPS y adhesi?n respiratoria.",
    "toxinas": [
      "ApxI",
      "ApxII",
      "ApxIII seg?n serotipo"
    ],
    "sistemasClave": [
      "respiratorio",
      "porcino"
    ],
    "agaresIds": [
      "blood-agar",
      "brucella-agar-base"
    ],
    "caldosIds": [
      "brain-heart-infusion-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "catalasa",
      "oxidasa"
    ],
    "antibioticosIds": [
      "florfenicol",
      "doxiciclina",
      "ceftiofur"
    ],
    "resistencia": [
      "Variable por granja y regi?n; antibiograma recomendado"
    ],
    "zoonosis": "No es zoonosis principal.",
    "observacionesClinicas": "Muestras respiratorias tempranas aumentan rendimiento diagn?stico.",
    "notasLab": "Algunas cepas requieren NAD/factor V; consultar protocolo del laboratorio.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria",
      "Ficha t?cnica de medios enriquecidos"
    ]
  },
  {
    "id": "mannheimia-haemolytica",
    "tipoEntidad": "microorganismo",
    "nombreCientifico": "Mannheimia haemolytica",
    "subtitulo": "Pasteurellaceae ? cocobacilo Gram negativo",
    "gramKey": "gramnegativo",
    "gramTexto": "Gram negativo",
    "morfologiaKey": "cocobacilo",
    "familia": "Pasteurellaceae",
    "reservorio": "Nasofaringe de bovinos, ovinos y caprinos.",
    "importancia": "Complejo respiratorio bovino, neumon?a fibrinosa y pleuritis.",
    "patogenicidad": "Leucotoxina, c?psula, LPS y factores de adhesi?n.",
    "toxinas": [
      "Leucotoxina LktA"
    ],
    "sistemasClave": [
      "respiratorio",
      "rumiantes"
    ],
    "agaresIds": [
      "blood-agar",
      "brucella-agar-base"
    ],
    "caldosIds": [
      "brain-heart-infusion-broth",
      "tryptic-soy-broth"
    ],
    "pruebasIds": [
      "gram-tincion",
      "oxidasa",
      "catalasa",
      "hemolisis"
    ],
    "antibioticosIds": [
      "florfenicol",
      "doxiciclina",
      "ceftiofur",
      "tulamicina"
    ],
    "resistencia": [
      "Macr?lidos, tetraciclinas o fenicoles pueden variar por regi?n"
    ],
    "zoonosis": "No es zoonosis principal; riesgo ocupacional bajo.",
    "observacionesClinicas": "Interpretar junto a aislamiento puro/carga y signos respiratorios.",
    "notasLab": "Colonias gris?ceas, beta-hemol?ticas en agar sangre.",
    "fuentes": [
      "Manual de microbiolog?a veterinaria",
      "CLSI VET vigente"
    ]
  }
];
})();
