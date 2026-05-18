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
  },
  {
    "id": "amikacina",
    "tipoEntidad": "antibiotico",
    "nombre": "Amikacina",
    "subtitulo": "Para: Gram negativos aerobios seleccionados",
    "siglaDisco": "AK30",
    "familia": "Aminoglucosido",
    "familiaKey": "aminoglucosido",
    "tipoAccion": "Bactericida concentracion-dependiente",
    "mecanismo": "Union a subunidad 30S con alteracion de sintesis proteica.",
    "espectro": "Gram negativos aerobios; actividad variable frente a Staphylococcus.",
    "espectroKey": "gram-negativo",
    "bacteriasSensiblesIds": [
      "escherichia-coli",
      "pseudomonas-aeruginosa",
      "klebsiella-pneumoniae"
    ],
    "bacteriasResistentesIds": [
      "clostridium-perfringens",
      "mycoplasma-bovis"
    ],
    "usoClinico": "Uso veterinario seleccionado segun cultivo, sensibilidad y evaluacion renal del paciente.",
    "interpretacion": "Interpretar con criterios veterinarios vigentes cuando existan para especie y bacteria.",
    "resistencia": "Enzimas modificadoras de aminoglucosidos, bombas de eflujo y menor entrada celular.",
    "observaciones": "No cubre anaerobios ni Mycoplasma; riesgo nefro/ototoxicidad segun contexto clinico.",
    "pruebasRelacionadasIds": [
      "oxidasa",
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "mueller-hinton-broth"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  },
  {
    "id": "cefalexina",
    "tipoEntidad": "antibiotico",
    "nombre": "Cefalexina",
    "subtitulo": "Para: Gram positivos cutaneos sensibles",
    "siglaDisco": "CN30",
    "familia": "Cefalosporina de primera generacion",
    "familiaKey": "cefalosporina",
    "tipoAccion": "Bactericida tiempo-dependiente",
    "mecanismo": "Inhibe sintesis de pared celular por union a PBPs.",
    "espectro": "Principalmente Gram positivos; limitada frente a Gram negativos.",
    "espectroKey": "gram-positivo",
    "bacteriasSensiblesIds": [
      "staphylococcus-spp",
      "streptococcus-spp"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "enterococcus-spp",
      "mycoplasma-bovis"
    ],
    "usoClinico": "Pioderma e infecciones cutaneas seleccionadas segun cultivo y normativa local.",
    "interpretacion": "No extrapolar a bacterias sin punto de corte aplicable.",
    "resistencia": "Beta-lactamasas, cambios de PBPs y resistencia a meticilina en Staphylococcus.",
    "observaciones": "No es opcion para Pseudomonas ni Enterococcus.",
    "pruebasRelacionadasIds": [
      "catalasa",
      "coagulasa",
      "dnasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "blood-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  },
  {
    "id": "ceftriaxona",
    "tipoEntidad": "antibiotico",
    "nombre": "Ceftriaxona",
    "subtitulo": "Para: vigilancia de cefalosporinas de tercera generacion",
    "siglaDisco": "CRO30",
    "familia": "Cefalosporina de tercera generacion",
    "familiaKey": "cefalosporina",
    "tipoAccion": "Bactericida tiempo-dependiente",
    "mecanismo": "Inhibe sintesis de pared celular.",
    "espectro": "Gram negativos y algunos Gram positivos; uso clinico veterinario depende de normativa local.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "salmonella-spp",
      "escherichia-coli",
      "yersinia-enterocolitica"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "enterococcus-spp",
      "mycoplasma-bovis"
    ],
    "usoClinico": "Marcador de laboratorio para vigilancia de Enterobacteriaceae; uso clinico solo bajo criterio normativo.",
    "interpretacion": "Interpretar con estandar aplicable y evitar extrapolacion entre especies.",
    "resistencia": "ESBL, AmpC, carbapenemasas y alteraciones de permeabilidad.",
    "observaciones": "Importante en vigilancia One Health; no usar como recomendacion empirica.",
    "pruebasRelacionadasIds": [
      "tsi",
      "citrato-simmons",
      "onpg"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "mueller-hinton-broth"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "WOAH / vigilancia de resistencia antimicrobiana"
    ]
  },
  {
    "id": "neomicina",
    "tipoEntidad": "antibiotico",
    "nombre": "Neomicina",
    "subtitulo": "Para: Gram negativos entercos sensibles",
    "siglaDisco": "N30",
    "familia": "Aminoglucosido",
    "familiaKey": "aminoglucosido",
    "tipoAccion": "Bactericida concentracion-dependiente",
    "mecanismo": "Interfiere sintesis proteica en subunidad 30S.",
    "espectro": "Gram negativos aerobios; uso frecuente como agente local o enterico segun producto.",
    "espectroKey": "gram-negativo",
    "bacteriasSensiblesIds": [
      "escherichia-coli",
      "salmonella-spp",
      "proteus-mirabilis"
    ],
    "bacteriasResistentesIds": [
      "clostridium-perfringens",
      "mycoplasma-bovis",
      "streptococcus-spp"
    ],
    "usoClinico": "Uso veterinario depende de especie, via, producto registrado y sensibilidad.",
    "interpretacion": "La difusion en disco debe seguir estandar validado para el microorganismo.",
    "resistencia": "Enzimas modificadoras de aminoglucosidos y menor entrada celular.",
    "observaciones": "Sin actividad util frente a anaerobios; vigilar toxicidad segun via.",
    "pruebasRelacionadasIds": [
      "gram-tincion",
      "tsi"
    ],
    "mediosIds": [
      "mueller-hinton-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  },
  {
    "id": "eritromicina",
    "tipoEntidad": "antibiotico",
    "nombre": "Eritromicina",
    "subtitulo": "Para: Gram positivos y Campylobacter sensibles",
    "siglaDisco": "E15",
    "familia": "Macrolido",
    "familiaKey": "macrolido",
    "tipoAccion": "Bacteriostatico",
    "mecanismo": "Union a subunidad 50S e inhibicion de sintesis proteica.",
    "espectro": "Gram positivos, algunos fastidiosos y Campylobacter; baja actividad frente a Enterobacteriaceae.",
    "espectroKey": "moderado",
    "bacteriasSensiblesIds": [
      "campylobacter-jejuni",
      "staphylococcus-spp",
      "streptococcus-spp"
    ],
    "bacteriasResistentesIds": [
      "escherichia-coli",
      "pseudomonas-aeruginosa",
      "klebsiella-pneumoniae"
    ],
    "usoClinico": "Indicaciones veterinarias seleccionadas; confirmar sensibilidad cuando sea posible.",
    "interpretacion": "Puede requerir prueba de resistencia inducible MLSb en estafilococos/estreptococos.",
    "resistencia": "Metilacion erm, eflujo mef y mutaciones ribosomales.",
    "observaciones": "No cubrir enterobacterias de forma empirica.",
    "pruebasRelacionadasIds": [
      "camp-test",
      "catalasa",
      "gram-tincion"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "blood-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  },
  {
    "id": "tilmicosina",
    "tipoEntidad": "antibiotico",
    "nombre": "Tilmicosina",
    "subtitulo": "Para: patogenos respiratorios de rumiantes sensibles",
    "siglaDisco": "TIL15",
    "familia": "Macrolido",
    "familiaKey": "macrolido",
    "tipoAccion": "Bacteriostatico; puede ser bactericida frente a algunos respiratorios",
    "mecanismo": "Inhibe sintesis proteica por union a subunidad 50S.",
    "espectro": "Pasteurellaceae y patogenos respiratorios veterinarios seleccionados.",
    "espectroKey": "respiratorio",
    "bacteriasSensiblesIds": [
      "mannheimia-haemolytica",
      "pasteurella-multocida",
      "histophilus-somni"
    ],
    "bacteriasResistentesIds": [
      "escherichia-coli",
      "pseudomonas-aeruginosa"
    ],
    "usoClinico": "Complejo respiratorio bovino/ovino segun etiqueta, especie y sensibilidad.",
    "interpretacion": "Usar criterios veterinarios y respetar especie de destino.",
    "resistencia": "Resistencia MLS, eflujo y seleccion por uso de macrolidos.",
    "observaciones": "Manejo con extrema precaucion segun ficha por riesgo en humanos; respetar tiempos de retiro.",
    "pruebasRelacionadasIds": [
      "oxidasa",
      "gram-tincion",
      "hemolisis"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "blood-agar",
      "chocolate-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  },
  {
    "id": "espectinomicina",
    "tipoEntidad": "antibiotico",
    "nombre": "Espectinomicina",
    "subtitulo": "Para: bacterias respiratorias y entericas seleccionadas",
    "siglaDisco": "SPT100",
    "familia": "Aminociclitol",
    "familiaKey": "aminociclitol",
    "tipoAccion": "Bacteriostatico",
    "mecanismo": "Interfiere sintesis proteica al actuar sobre subunidad 30S.",
    "espectro": "Actividad variable frente a Gram negativos y algunos patogenos veterinarios.",
    "espectroKey": "moderado",
    "bacteriasSensiblesIds": [
      "escherichia-coli",
      "pasteurella-multocida",
      "glaesserella-parasuis"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "enterococcus-spp"
    ],
    "usoClinico": "Uso veterinario segun producto registrado; interpretar con antibiograma cuando aplique.",
    "interpretacion": "Consultar criterios especificos disponibles para especie y patogeno.",
    "resistencia": "Modificacion del blanco ribosomal y enzimas inactivantes.",
    "observaciones": "No extrapolar sensibilidad entre combinaciones comerciales.",
    "pruebasRelacionadasIds": [
      "gram-tincion",
      "oxidasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "chocolate-agar"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  },
  {
    "id": "pradofloxacina",
    "tipoEntidad": "antibiotico",
    "nombre": "Pradofloxacina",
    "subtitulo": "Para: pequenos animales segun sensibilidad",
    "siglaDisco": "PRD5",
    "familia": "Fluoroquinolona",
    "familiaKey": "quinolona",
    "tipoAccion": "Bactericida concentracion-dependiente",
    "mecanismo": "Inhibe ADN-girasa y topoisomerasa IV.",
    "espectro": "Amplio; Gram negativos, algunos Gram positivos y anaerobios seleccionados segun especie.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "staphylococcus-spp",
      "escherichia-coli",
      "pasteurella-multocida"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "enterococcus-spp"
    ],
    "usoClinico": "Uso en pequenos animales segun indicacion registrada, cultivo y sensibilidad.",
    "interpretacion": "Interpretar con criterios veterinarios disponibles; evitar sustituciones entre quinolonas sin criterio.",
    "resistencia": "Mutaciones gyrA/parC, bombas de eflujo y resistencia cruzada de quinolonas.",
    "observaciones": "Antimicrobiano critico; uso prudente y documentado.",
    "pruebasRelacionadasIds": [
      "gram-tincion",
      "catalasa",
      "oxidasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "mueller-hinton-broth"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  },
  {
    "id": "tetraciclina",
    "tipoEntidad": "antibiotico",
    "nombre": "Tetraciclina",
    "subtitulo": "Para: bacterias sensibles y micoplasmas seleccionados",
    "siglaDisco": "TE30",
    "familia": "Tetraciclina",
    "familiaKey": "tetraciclina",
    "tipoAccion": "Bacteriostatico",
    "mecanismo": "Inhibe sintesis proteica por union reversible a subunidad 30S.",
    "espectro": "Amplio; actividad variable frente a Gram positivos, Gram negativos y bacterias sin pared celular.",
    "espectroKey": "amplio",
    "bacteriasSensiblesIds": [
      "mycoplasma-bovis",
      "pasteurella-multocida",
      "mannheimia-haemolytica"
    ],
    "bacteriasResistentesIds": [
      "pseudomonas-aeruginosa",
      "proteus-mirabilis"
    ],
    "usoClinico": "Uso veterinario segun especie, producto registrado y sensibilidad antimicrobiana.",
    "interpretacion": "Interpretar con criterios veterinarios vigentes; resistencia cruzada con otras tetraciclinas puede ocurrir.",
    "resistencia": "Bombas de eflujo tet, proteccion ribosomal y resistencia plasmidica.",
    "observaciones": "No usar como sustituto automatico de doxiciclina u oxitetraciclina sin criterio microbiologico.",
    "pruebasRelacionadasIds": [
      "gram-tincion",
      "oxidasa"
    ],
    "mediosIds": [
      "mueller-hinton-agar",
      "mueller-hinton-broth"
    ],
    "fuentes": [
      "CLSI VET vigente",
      "Ficha tecnica veterinaria del producto"
    ]
  }
];
})();
