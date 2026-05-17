// =============================================================================
// SUITE VET / FITBET 2.2 - modules/micro/data/antibioticosdata.js
// Base de antibioticos.
// =============================================================================

(function () {
  "use strict";

  window.MICRO_DATA_PARTS = window.MICRO_DATA_PARTS || {};
  window.MICRO_DATA_PARTS.antibioticos = [
  {
    "id": "enrofloxacina",
    "tipoEntidad": "antibiotico",
    "nombre": "Enrofloxacina",
    "subtitulo": "Para: bacilos Gram negativos y algunos Gram positivos",
    "siglaDisco": "ENR5",
    "familia": "Fluoroquinolona",
    "familiaKey": "quinolona",
    "tipoAccion": "Bactericida concentración-dependiente",
    "mecanismo": "Inhibe ADN-girasa y topoisomerasa IV.",
    "espectro": "Amplio; fuerte actividad frente a Gram negativos.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "escherichia-coli",
      "pasteurella-multocida",
      "salmonella-spp"
    ],
    "bacteriasResistentesIds": [
      "staphylococcus-spp",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Infecciones respiratorias, urinarias y entéricas según cultivo y sensibilidad.",
    "interpretacion": "Interpretar con criterios veterinarios vigentes cuando estén disponibles.",
    "resistencia": "Mutaciones gyrA/parC, bombas de eflujo y uso repetido favorecen resistencia.",
    "observaciones": "Evitar uso empírico prolongado; reservar cuando el antibiograma lo justifique.",
    "pruebasRelacionadasIds": [
      "oxidasa",
      "tsi"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ]
  },
  {
    "id": "ciprofloxacina",
    "tipoEntidad": "antibiotico",
    "nombre": "Ciprofloxacina",
    "subtitulo": "Para: Enterobacteriaceae y no fermentadores",
    "siglaDisco": "CIP5",
    "familia": "Fluoroquinolona",
    "familiaKey": "quinolona",
    "tipoAccion": "Bactericida",
    "mecanismo": "Bloqueo de replicación por inhibición de topoisomerasas.",
    "espectro": "Gram negativos, Pseudomonas variable y algunos Gram positivos.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "salmonella-spp",
      "escherichia-coli",
      "klebsiella-pneumoniae"
    ],
    "bacteriasResistentesIds": [
      "staphylococcus-spp"
    ],
    "usoClinico": "Referencia frecuente en antibiogramas; uso clínico veterinario depende de criterio local.",
    "interpretacion": "Comparar halos con estándar aplicable al microorganismo y especie.",
    "resistencia": "Resistencia cruzada dentro de quinolonas.",
    "observaciones": "Útil para vigilancia de resistencia.",
    "pruebasRelacionadasIds": [
      "tsi",
      "sim"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ]
  },
  {
    "id": "amoxicilina-clavulanato",
    "tipoEntidad": "antibiotico",
    "nombre": "Amoxicilina / Ácido clavulánico",
    "subtitulo": "Para: Gram positivos y beta-lactamasas sensibles",
    "siglaDisco": "AMC30",
    "familia": "Penicilina + inhibidor beta-lactamasa",
    "familiaKey": "betalactamico",
    "tipoAccion": "Bactericida tiempo-dependiente",
    "mecanismo": "Inhibe síntesis de pared; clavulanato inhibe beta-lactamasas.",
    "espectro": "Gram positivos, anaerobios y algunas enterobacterias.",
    "espectroKey": "gram-positivo",
    "bacteriasSensiblesIds": [
      "staphylococcus-spp",
      "streptococcus-spp",
      "pasteurella-multocida"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "klebsiella-pneumoniae"
    ],
    "usoClinico": "Piel, tejidos blandos, cavidad oral y respiratorio según sensibilidad.",
    "interpretacion": "La producción de beta-lactamasas no siempre predice sensibilidad final.",
    "resistencia": "Beta-lactamasas no inhibidas, cambios de PBPs, permeabilidad reducida.",
    "observaciones": "No cubrir Pseudomonas.",
    "pruebasRelacionadasIds": [
      "catalasa",
      "coagulasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "blood-agar"
    ]
  },
  {
    "id": "gentamicina",
    "tipoEntidad": "antibiotico",
    "nombre": "Gentamicina",
    "subtitulo": "Para: Gram negativos aerobios",
    "siglaDisco": "CN10",
    "familia": "Aminoglucósido",
    "familiaKey": "aminoglucosido",
    "tipoAccion": "Bactericida concentración-dependiente",
    "mecanismo": "Unión irreversible a subunidad 30S con lectura errónea del ARNm.",
    "espectro": "Gram negativos aerobios; sin actividad útil en anaerobios.",
    "espectroKey": "gram-negativo",
    "bacteriasSensiblesIds": [
      "escherichia-coli",
      "klebsiella-pneumoniae",
      "pseudomonas-aeruginosa"
    ],
    "bacteriasResistentesIds": [
      "streptococcus-spp"
    ],
    "usoClinico": "Infecciones graves por Gram negativos bajo monitoreo.",
    "interpretacion": "Halos muy sensibles a cationes del medio y espesor del agar.",
    "resistencia": "Enzimas modificadoras de aminoglucósidos, eflujo, menor entrada.",
    "observaciones": "Nefrotoxicidad y ototoxicidad: vigilar función renal.",
    "pruebasRelacionadasIds": [
      "oxidasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ]
  },
  {
    "id": "ceftiofur",
    "tipoEntidad": "antibiotico",
    "nombre": "Ceftiofur",
    "subtitulo": "Para: respiratorio y Gram negativos veterinarios",
    "siglaDisco": "XNL30",
    "familia": "Cefalosporina de tercera generación",
    "familiaKey": "cefalosporina",
    "tipoAccion": "Bactericida",
    "mecanismo": "Inhibe síntesis de peptidoglicano de pared bacteriana.",
    "espectro": "Gram negativos respiratorios y algunos Gram positivos.",
    "espectroKey": "gram-negativo",
    "bacteriasSensiblesIds": [
      "pasteurella-multocida",
      "escherichia-coli",
      "streptococcus-spp"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Respiratorio bovino/porcino y cuadros específicos según etiqueta y sensibilidad.",
    "interpretacion": "No extrapolar halos a otras cefalosporinas sin criterio validado.",
    "resistencia": "ESBL/AmpC y cambios de permeabilidad.",
    "observaciones": "Antimicrobiano crítico; usar con diagnóstico.",
    "pruebasRelacionadasIds": [
      "oxidasa",
      "catalasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ]
  },
  {
    "id": "oxitetraciclina",
    "tipoEntidad": "antibiotico",
    "nombre": "Oxitetraciclina",
    "subtitulo": "Para: amplio espectro y patógenos respiratorios",
    "siglaDisco": "OT30",
    "familia": "Tetraciclina",
    "familiaKey": "tetraciclina",
    "tipoAccion": "Bacteriostático",
    "mecanismo": "Se une a 30S e inhibe unión de ARNt.",
    "espectro": "Amplio: Gram positivos, Gram negativos, Mycoplasma y algunos intracelulares.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "pasteurella-multocida",
      "streptococcus-spp"
    ],
    "bacteriasResistentesIds": [
      "escherichia-coli",
      "salmonella-spp",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Respiratorio, anaplasmosis y cuadros donde sensibilidad local sea favorable.",
    "interpretacion": "Resistencia adquirida común en producción animal.",
    "resistencia": "Bombas de eflujo tet y protección ribosomal.",
    "observaciones": "No combinar de forma irreflexiva con bactericidas dependientes de crecimiento.",
    "pruebasRelacionadasIds": [
      "tsi"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ]
  },
  {
    "id": "trimetoprim-sulfa",
    "tipoEntidad": "antibiotico",
    "nombre": "Trimetoprim / Sulfonamida",
    "subtitulo": "Para: enterobacterias sensibles y urinario",
    "siglaDisco": "SXT25",
    "familia": "Antifolatos",
    "familiaKey": "sulfonamida",
    "tipoAccion": "Bactericida por bloqueo secuencial",
    "mecanismo": "Inhibe dos pasos de la síntesis de folato.",
    "espectro": "Gram positivos y Gram negativos variables.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "escherichia-coli",
      "salmonella-spp"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Urinario, piel y enterobacterias sensibles.",
    "interpretacion": "Mueller Hinton debe controlar timidina/timina para evitar falsos resultados.",
    "resistencia": "Genes dfr/sul, bypass metabólico y resistencia plasmídica.",
    "observaciones": "Vigilar efectos adversos idiosincráticos.",
    "pruebasRelacionadasIds": [
      "tsi",
      "indol"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ]
  },
  {
    "id": "ampicilina",
    "tipoEntidad": "antibiotico",
    "nombre": "Ampicilina",
    "subtitulo": "Para: Gram positivos y algunos Gram negativos sensibles",
    "siglaDisco": "AMP10",
    "familia": "Aminopenicilina",
    "familiaKey": "betalactamico",
    "tipoAccion": "Bactericida tiempo-dependiente",
    "mecanismo": "Inhibe s?ntesis de pared celular por uni?n a PBPs.",
    "espectro": "Moderado; Gram positivos y enterobacterias sensibles.",
    "espectroKey": "moderado",
    "bacteriasSensiblesIds": [
      "listeria-monocytogenes",
      "pasteurella-multocida",
      "streptococcus-spp"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "klebsiella-pneumoniae",
      "staphylococcus-spp"
    ],
    "usoClinico": "Uso seg?n cultivo y sensibilidad en infecciones respiratorias, urinarias, ent?ricas y listeriosis.",
    "interpretacion": "Interpretar con criterios veterinarios CLSI vigentes cuando existan.",
    "resistencia": "Beta-lactamasas, PBPs alteradas y barreras de permeabilidad.",
    "observaciones": "No asumir actividad frente a productores de beta-lactamasa.",
    "pruebasRelacionadasIds": [
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha t?cnica veterinaria del antimicrobiano"
    ]
  },
  {
    "id": "penicilina-g",
    "tipoEntidad": "antibiotico",
    "nombre": "Penicilina G",
    "subtitulo": "Para: Gram positivos sensibles y anaerobios seleccionados",
    "siglaDisco": "P10",
    "familia": "Penicilina natural",
    "familiaKey": "betalactamico",
    "tipoAccion": "Bactericida tiempo-dependiente",
    "mecanismo": "Inhibe s?ntesis de peptidoglicano.",
    "espectro": "Gram positivos sensibles; actividad limitada frente a muchos Gram negativos.",
    "espectroKey": "reducido",
    "bacteriasSensiblesIds": [
      "streptococcus-spp",
      "trueperella-pyogenes",
      "erysipelothrix-rhusiopathiae",
      "clostridium-perfringens"
    ],
    "bacteriasResistentesIds": [
      "staphylococcus-spp",
      "escherichia-coli",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Infecciones por Gram positivos sensibles, anaerobios seleccionados y cuadros donde el antibiograma lo respalde.",
    "interpretacion": "Interpretar seg?n especie bacteriana y sitio cl?nico.",
    "resistencia": "Beta-lactamasas y cambios en PBPs.",
    "observaciones": "En Staphylococcus la resistencia por beta-lactamasa es frecuente.",
    "pruebasRelacionadasIds": [
      "catalasa",
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Manual Merck Veterinary Manual / criterio cl?nico"
    ]
  },
  {
    "id": "doxiciclina",
    "tipoEntidad": "antibiotico",
    "nombre": "Doxiciclina",
    "subtitulo": "Para: bacterias sensibles, respiratorias y agentes intracelulares",
    "siglaDisco": "DO30",
    "familia": "Tetraciclina",
    "familiaKey": "tetraciclina",
    "tipoAccion": "Bacteriost?tico",
    "mecanismo": "Inhibe s?ntesis proteica por uni?n a subunidad 30S.",
    "espectro": "Amplio; Gram positivos, algunos Gram negativos y bacterias intracelulares.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "pasteurella-multocida",
      "bordetella-bronchiseptica",
      "mannheimia-haemolytica",
      "brucella-spp"
    ],
    "bacteriasResistentesIds": [
      "proteus-mirabilis",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Infecciones respiratorias, vectoriales o sensibles seg?n criterio veterinario.",
    "interpretacion": "Usar criterios veterinarios vigentes; no extrapolar sin validaci?n.",
    "resistencia": "Bombas de eflujo y protecci?n ribosomal.",
    "observaciones": "Considerar especie, edad y contraindicaciones.",
    "pruebasRelacionadasIds": [
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha t?cnica veterinaria del antimicrobiano"
    ]
  },
  {
    "id": "florfenicol",
    "tipoEntidad": "antibiotico",
    "nombre": "Florfenicol",
    "subtitulo": "Para: pat?genos respiratorios veterinarios sensibles",
    "siglaDisco": "FFC30",
    "familia": "Amfenicol",
    "familiaKey": "amfenicol",
    "tipoAccion": "Bacteriost?tico",
    "mecanismo": "Inhibe s?ntesis proteica por acci?n sobre subunidad 50S.",
    "espectro": "Amplio; frecuente uso veterinario en pat?genos respiratorios.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "pasteurella-multocida",
      "mannheimia-haemolytica",
      "actinobacillus-pleuropneumoniae"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Complejo respiratorio bovino/porcino y otras infecciones sensibles seg?n registro local.",
    "interpretacion": "Interpretar por criterios veterinarios y especie animal.",
    "resistencia": "Genes floR, bombas de eflujo y resistencia cruzada con fenicoles.",
    "observaciones": "Respetar tiempos de retiro y restricciones por especie/producto.",
    "pruebasRelacionadasIds": [
      "oxidasa",
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha t?cnica veterinaria del producto"
    ]
  },
  {
    "id": "marbofloxacina",
    "tipoEntidad": "antibiotico",
    "nombre": "Marbofloxacina",
    "subtitulo": "Para: Gram negativos sensibles y algunos Gram positivos",
    "siglaDisco": "MAR5",
    "familia": "Fluoroquinolona",
    "familiaKey": "quinolona",
    "tipoAccion": "Bactericida concentraci?n-dependiente",
    "mecanismo": "Inhibe ADN-girasa y topoisomerasa IV.",
    "espectro": "Amplio; Gram negativos y algunos Gram positivos sensibles.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "escherichia-coli",
      "pasteurella-multocida",
      "bordetella-bronchiseptica"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "staphylococcus-spp"
    ],
    "usoClinico": "Infecciones urinarias, piel o respiratorias seg?n cultivo y sensibilidad.",
    "interpretacion": "Usar criterios veterinarios; antimicrobiano de importancia cr?tica.",
    "resistencia": "Mutaciones gyrA/parC, eflujo y uso repetido.",
    "observaciones": "Evitar uso emp?rico si no es necesario.",
    "pruebasRelacionadasIds": [
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha t?cnica veterinaria del antimicrobiano"
    ]
  },
  {
    "id": "clindamicina",
    "tipoEntidad": "antibiotico",
    "nombre": "Clindamicina",
    "subtitulo": "Para: Gram positivos y anaerobios sensibles",
    "siglaDisco": "DA2",
    "familia": "Lincosamida",
    "familiaKey": "lincosamida",
    "tipoAccion": "Bacteriost?tico",
    "mecanismo": "Inhibe s?ntesis proteica por uni?n a subunidad 50S.",
    "espectro": "Gram positivos y anaerobios; sin cobertura ?til para Gram negativos aerobios.",
    "espectroKey": "reducido",
    "bacteriasSensiblesIds": [
      "staphylococcus-spp",
      "streptococcus-spp",
      "trueperella-pyogenes"
    ],
    "bacteriasResistentesIds": [
      "escherichia-coli",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Piodermas, infecciones orales, tejidos blandos y anaerobios sensibles seg?n especie.",
    "interpretacion": "Considerar prueba D/MLSb cuando corresponda en Staphylococcus.",
    "resistencia": "Metilaci?n ribosomal erm y bombas de eflujo.",
    "observaciones": "No usar para enterobacterias; precauci?n por especie animal.",
    "pruebasRelacionadasIds": [
      "coagulasa",
      "catalasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "blood-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha t?cnica veterinaria del antimicrobiano"
    ]
  },
  {
    "id": "metronidazol",
    "tipoEntidad": "antibiotico",
    "nombre": "Metronidazol",
    "subtitulo": "Para: anaerobios estrictos sensibles",
    "siglaDisco": "MTZ5",
    "familia": "Nitroimidazol",
    "familiaKey": "nitroimidazol",
    "tipoAccion": "Bactericida frente a anaerobios",
    "mecanismo": "Metabolitos reducidos da?an ADN en condiciones anaerobias.",
    "espectro": "Anaerobios estrictos; sin actividad frente a aerobios obligados.",
    "espectroKey": "anaerobios",
    "bacteriasSensiblesIds": [
      "clostridium-perfringens"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "escherichia-coli"
    ],
    "usoClinico": "Infecciones anaerobias y gastrointestinales seleccionadas seg?n criterio veterinario.",
    "interpretacion": "La prueba de sensibilidad requiere metodolog?a adecuada para anaerobios.",
    "resistencia": "Cambios en activaci?n reductiva y mecanismos de reparaci?n.",
    "observaciones": "No interpretar con antibiograma aer?bico est?ndar.",
    "pruebasRelacionadasIds": [
      "gram-tincion",
      "nitrate-reduction"
    ],
    "mediosIds": [
      "blood-agar"
    ],
    "fuentes": [
      "CLSI / gu?as de anaerobios",
      "Ficha t?cnica veterinaria"
    ]
  },
  {
    "id": "cefoxitina",
    "tipoEntidad": "antibiotico",
    "nombre": "Cefoxitina",
    "subtitulo": "Marcador de resistencia mecA en Staphylococcus",
    "siglaDisco": "FOX30",
    "familia": "Cefamicina",
    "familiaKey": "cefalosporina",
    "tipoAccion": "Bactericida tiempo-dependiente",
    "mecanismo": "Inhibe s?ntesis de pared; se usa como marcador fenot?pico de resistencia a meticilina.",
    "espectro": "Uso principal de laboratorio para Staphylococcus; no como elecci?n cl?nica directa en muchas especies.",
    "espectroKey": "laboratorio",
    "bacteriasSensiblesIds": [
      "staphylococcus-spp"
    ],
    "bacteriasResistentesIds": [
      "staphylococcus-spp"
    ],
    "usoClinico": "Herramienta de laboratorio para sospecha de MRSA/MRSP seg?n criterio CLSI.",
    "interpretacion": "Interpretar con puntos de corte espec?ficos para Staphylococcus y especie.",
    "resistencia": "mecA/mecC y PBP2a.",
    "observaciones": "Resultado resistente implica resistencia a beta-lact?micos antiestafiloc?cicos seg?n norma aplicable.",
    "pruebasRelacionadasIds": [
      "coagulasa",
      "catalasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Normas para detecci?n de resistencia a meticilina"
    ]
  },
  {
    "id": "azitromicina",
    "tipoEntidad": "antibiotico",
    "nombre": "Azitromicina",
    "subtitulo": "Para: bacterias sensibles e indicaciones seleccionadas",
    "siglaDisco": "AZM15",
    "familia": "Macr?lido",
    "familiaKey": "macrolido",
    "tipoAccion": "Bacteriost?tico",
    "mecanismo": "Inhibe s?ntesis proteica al unirse a la subunidad 50S.",
    "espectro": "Gram positivos, algunos Gram negativos fastidiosos y bacterias intracelulares seg?n especie.",
    "espectroKey": "moderado",
    "bacteriasSensiblesIds": [
      "campylobacter-jejuni",
      "bordetella-bronchiseptica"
    ],
    "bacteriasResistentesIds": [
      "escherichia-coli",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Indicaciones seleccionadas seg?n especie, cultivo y normativa local.",
    "interpretacion": "Usar criterios espec?ficos cuando existan; evitar extrapolaciones.",
    "resistencia": "Metilaci?n ribosomal erm, eflujo mef y mutaciones ribosomales.",
    "observaciones": "No usar como comod?n; confirmar indicaci?n veterinaria.",
    "pruebasRelacionadasIds": [
      "oxidasa",
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha t?cnica veterinaria del producto"
    ]
  },
  {
    "id": "tulamicina",
    "tipoEntidad": "antibiotico",
    "nombre": "Tulamicina",
    "subtitulo": "Para: pat?genos respiratorios bovinos y porcinos sensibles",
    "siglaDisco": "TUL30",
    "familia": "Macr?lido triamilida",
    "familiaKey": "macrolido",
    "tipoAccion": "Bacteriost?tico; puede ser bactericida frente a algunos pat?genos respiratorios",
    "mecanismo": "Inhibe s?ntesis proteica por uni?n a la subunidad 50S.",
    "espectro": "Pat?genos respiratorios veterinarios seleccionados.",
    "espectroKey": "respiratorio",
    "bacteriasSensiblesIds": [
      "mannheimia-haemolytica",
      "pasteurella-multocida"
    ],
    "bacteriasResistentesIds": [
      "escherichia-coli",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Complejo respiratorio bovino/porcino seg?n indicaci?n registrada y sensibilidad.",
    "interpretacion": "Usar criterios veterinarios y normativa local.",
    "resistencia": "Metilaci?n ribosomal, eflujo y selecci?n por uso de macr?lidos.",
    "observaciones": "Respetar tiempos de retiro y especie de destino.",
    "pruebasRelacionadasIds": [
      "oxidasa",
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha t?cnica veterinaria del producto"
    ]
  }
];
})();
