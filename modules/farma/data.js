// =============================================================================
// SUITE VET 2.0 — modules/farma/data.js
// Vademécum con categorías visuales del sistema farmacológico.
// =============================================================================
// 🎨 CAMPO `categoria` — clave para identidad visual:
//   bactericida | bacteriostatico | antifungico | antiseptico
//   antiparasitario-interno | antiparasitario-externo
//   aine | corticoide | analgesico
//   anestesico | sedante
//   broncodilatador | cardiovascular
//   vacuna | inmunomodulador | antihistaminico
//   hormona | vitamina | fluidoterapia
//
// 🔥 CAMPO `riesgo` — 1=seguro, 5=crítico. Si no se especifica, se usa el riesgo
//    base de la categoría (definido en shared/categorias.js)
// =============================================================================

window.FARMA_DATA = {
  farmacos: [

    // =====================================================================
    // ANESTÉSICOS / SEDANTES
    // =====================================================================
    {
      id: "acepromacina",
      principio: "Acepromacina",
      grupo: "Fenotiazínico / Tranquilizante",
      categoria: "sedante",
      riesgo: 3,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Tranquilizante fenotiazídico. Antiemético, antiespasmódico e hipotérmico. Vasodilatación arterial moderada.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.05, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.1 mg/kg. Razas gigantes más sensibles." },
        { nombre: "Felino",  dosisMgKg: 0.1,  via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.2 mg/kg. Precaución en geriátricos." },
        { nombre: "Bovino",  dosisMgKg: 0.05, via: "IV / IM",      retiroCarne: 3, retiroLeche: 1, nota: "Sedación suave." },
        { nombre: "Equino",  dosisMgKg: 0.03, via: "IV / IM",      retiroCarne: 0, retiroLeche: 0, nota: "Puede causar protrusión del pene." }
      ],
      contraindicaciones: "No usar con aminoglucósidos, fenitoína ni antidepresivos. Evitar en shock e hipovolemia.",
      comerciales: ["Acepromacina", "Promace", "Atravet"]
    },
    {
      id: "ketamina",
      principio: "Ketamina",
      grupo: "Anestésico Disociativo",
      categoria: "anestesico",
      riesgo: 4,
      concentracion: 100,
      unidad: "mg/mL",
      mecanismo: "Anestésico disociativo. Inhibe receptores NMDA. Analgésico significativo.",
      especies: [
        { nombre: "Canino (con Xilacina)", dosisMgKg: 11,  via: "IM",            retiroCarne: 0, retiroLeche: 0, nota: "Premedicar con Xilacina 2.2 mg/kg IM 10 min antes." },
        { nombre: "Felino (sujeción)",     dosisMgKg: 11,  via: "IM",            retiroCarne: 0, retiroLeche: 0, nota: "Para procedimientos cortos." },
        { nombre: "Equino (inducción)",    dosisMgKg: 2.2, via: "IV",            retiroCarne: 0, retiroLeche: 0, nota: "Sedar con Xilacina antes." }
      ],
      contraindicaciones: "Hemorragia. Hipertermia. Aumento de PIO.",
      comerciales: ["Ketalar", "Vetalar", "Imalgène 1000"]
    },
    {
      id: "propofol",
      principio: "Propofol",
      grupo: "Anestésico General",
      categoria: "anestesico",
      riesgo: 4,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Hipnótico de acción corta. Potencia inhibición GABAérgica.",
      especies: [
        { nombre: "Canino / Felino (inducción)", dosisMgKg: 6,  via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Dar 25% cada 30 seg hasta efecto." },
        { nombre: "Conejo",                      dosisMgKg: 10, via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Alto riesgo de apnea." }
      ],
      contraindicaciones: "Hipersensibilidad. Cautela en hiperlipidemia, convulsiones.",
      comerciales: ["Propofol 1%", "Rapinovet", "PropoFlo"]
    },
    {
      id: "xilacina-2",
      principio: "Xilacina 2%",
      grupo: "Agonista Alfa-2 Adrenérgico",
      categoria: "sedante",
      riesgo: 3,
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Agonista alfa-2 potente. Sedante, analgésico y relajante muscular.",
      especies: [
        { nombre: "Canino",          dosisMgKg: 1.1,  via: "IM / IV / SC", retiroCarne: 0, retiroLeche: 0, nota: "Antídoto: Yohimbina 0.1–0.2 mg/kg IV." },
        { nombre: "Felino",          dosisMgKg: 1.1,  via: "IM / SC",      retiroCarne: 0, retiroLeche: 0, nota: "Premedicar con atropina." },
        { nombre: "Equino",          dosisMgKg: 1.1,  via: "IV",           retiroCarne: 0, retiroLeche: 0, nota: "Para cólico: 0.2–0.5 mg/kg IV." },
        { nombre: "Bovino",          dosisMgKg: 0.1,  via: "IV / IM",      retiroCarne: 3, retiroLeche: 2, nota: "EXTREMA SENSIBILIDAD. 1/10 dosis equina." }
      ],
      contraindicaciones: "Cardiópatas, obstrucción respiratoria, gestación avanzada.",
      comerciales: ["Rompun", "Procin", "Sedalvet"]
    },

    // =====================================================================
    // CARDIOVASCULARES
    // =====================================================================
    {
      id: "adrenalina",
      principio: "Adrenalina",
      grupo: "Catecolamina / Simpaticomimético",
      categoria: "cardiovascular",
      riesgo: 5,
      concentracion: 1,
      unidad: "mg/mL",
      mecanismo: "Agonista alfa y beta-adrenérgico. Estimulación cardíaca directa. Broncodilatación.",
      especies: [
        { nombre: "Canino (PCR / anafilaxis)", dosisMgKg: 0.01, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Anafilaxis: 0.01–0.02 mg/kg. PCR: 0.1–0.2 mg/kg IV." },
        { nombre: "Felino (PCR / anafilaxis)", dosisMgKg: 0.01, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "PCR: 0.05–0.5 mg total IV." }
      ],
      contraindicaciones: "Glaucoma ángulo estrecho. Hipertensión grave. Dilatación cardíaca.",
      comerciales: ["Adrenalina 1:1000", "Epinefrina"]
    },
    {
      id: "atropina",
      principio: "Atropina",
      grupo: "Anticolinérgico",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 0.5,
      unidad: "mg/mL",
      mecanismo: "Inhibe competitivamente acetilcolina en receptores muscarínicos.",
      especies: [
        { nombre: "Canino (bradicardia)",     dosisMgKg: 0.033, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.022–0.044 mg/kg. Toxicidad OP: 0.2–2 mg/kg." },
        { nombre: "Bovino (intoxicación OP)", dosisMgKg: 0.5,   via: "IV / SC / IM", retiroCarne: 3, retiroLeche: 2, nota: "¼ IV, resto SC/IM." }
      ],
      contraindicaciones: "Glaucoma. Insuficiencia cardíaca. Íleo paralítico.",
      comerciales: ["Atropina sulfato 0.5 mg/mL"]
    },
    {
      id: "furosemida",
      principio: "Furosemida",
      grupo: "Diurético del Asa",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Reduce absorción de electrólitos en asa de Henle. Diurético potente.",
      especies: [
        { nombre: "Canino (diurético)",  dosisMgKg: 2.5, via: "Oral / IV / IM", retiroCarne: 0, retiroLeche: 0, nota: "Edema grave: 7.7 mg/kg IV." },
        { nombre: "Felino (diurético)",  dosisMgKg: 2.5, via: "Oral / IV / IM", retiroCarne: 0, retiroLeche: 0, nota: "Edema grave: 4.4 mg/kg IV." },
        { nombre: "Bovino (edema ubre)", dosisMgKg: 1,   via: "IM",             retiroCarne: 2, retiroLeche: 2, nota: "500 mg 1 vez/día." },
        { nombre: "Equino",              dosisMgKg: 1.5, via: "IV / IM",        retiroCarne: 0, retiroLeche: 0, nota: "0.7–2 mg/kg cada 6–12 h." }
      ],
      contraindicaciones: "Anuria. Electrólitos disminuidos. Disfunción hepática.",
      comerciales: ["Lasix", "Dimazon"]
    },
    {
      id: "enalapril",
      principio: "Enalapril",
      grupo: "IECA",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 5,
      unidad: "mg/tableta",
      mecanismo: "Inhibe la enzima convertidora de angiotensina. Reduce resistencia periférica.",
      especies: [
        { nombre: "Canino (IC)", dosisMgKg: 0.5,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.5 mg/kg oral 1–2 veces/día." },
        { nombre: "Felino (IC)", dosisMgKg: 0.375, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.25–0.5 mg/kg 1 vez/día." }
      ],
      contraindicaciones: "Hipersensibilidad a IECAs. Hiponatremia.",
      comerciales: ["Enacard", "Vasotec"]
    },

    // =====================================================================
    // CORTICOIDES
    // =====================================================================
    {
      id: "dexametasona",
      principio: "Dexametasona",
      grupo: "Glucocorticoide",
      categoria: "corticoide",
      riesgo: 4,
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Antiinflamatorio esteroidal potente (25–30x cortisol). Inmunosupresión.",
      especies: [
        { nombre: "Bovino",                    dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 8, retiroLeche: 3, nota: "Abortivo en último tercio." },
        { nombre: "Equino",                    dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 0, retiroLeche: 0, nota: "Riesgo de laminitis." },
        { nombre: "Canino (antiinflamatorio)", dosisMgKg: 0.1, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "No usar con AINEs." },
        { nombre: "Canino (inmunosupresor)",   dosisMgKg: 0.3, via: "IV / IM / PO", retiroCarne: 0, retiroLeche: 0, nota: "Para alergias graves." }
      ],
      contraindicaciones: "Diabetes, úlceras, sarna demodécica, gestación. No combinar con AINEs.",
      comerciales: ["Dexa-2", "Azium", "Dexafort"]
    },
    {
      id: "prednisolona",
      principio: "Prednisolona",
      grupo: "Glucocorticoide intermedio",
      categoria: "corticoide",
      riesgo: 3,
      concentracion: 20,
      unidad: "mg/tableta",
      mecanismo: "Glucocorticoide de acción intermedia (4–5x cortisol). Activo sin conversión hepática.",
      especies: [
        { nombre: "Canino (antiinflamatorio)", dosisMgKg: 0.75, via: "Oral / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.5–1 mg/kg cada 12–24 h." },
        { nombre: "Canino (inmunosupresor)",   dosisMgKg: 2,    via: "Oral",           retiroCarne: 0, retiroLeche: 0, nota: "1–2 mg/kg cada 12–24 h." },
        { nombre: "Felino",                    dosisMgKg: 1.5,  via: "Oral / IM",      retiroCarne: 0, retiroLeche: 0, nota: "Gatos toleran mejor que perros." }
      ],
      contraindicaciones: "Diabetes, úlceras GI, infecciones, gestación.",
      comerciales: ["Prednisolona 20 mg", "Delta-Cortef"]
    },

    // =====================================================================
    // AINEs
    // =====================================================================
    {
      id: "meloxicam",
      principio: "Meloxicam",
      grupo: "AINE inhibidor COX-2 preferencial",
      categoria: "aine",
      riesgo: 3,
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Inhibe COX-2 preferencialmente. Antiinflamatorio, analgésico y antipirético.",
      especies: [
        { nombre: "Bovino",          dosisMgKg: 0.5, via: "SC / IV",        retiroCarne: 15, retiroLeche: 5,  nota: "Excelente en mastitis y diarreas." },
        { nombre: "Porcino",         dosisMgKg: 0.4, via: "IM",             retiroCarne: 5,  retiroLeche: 0,  nota: "Síndrome MMA." },
        { nombre: "Equino",          dosisMgKg: 0.6, via: "IV / Oral",      retiroCarne: 0,  retiroLeche: 0,  nota: "Cólico y dolor musculoesquelético." },
        { nombre: "Canino (carga)",  dosisMgKg: 0.2, via: "SC / IV / Oral", retiroCarne: 0,  retiroLeche: 0,  nota: "Carga día 1; mantenimiento 0.1 mg/kg/día." },
        { nombre: "Felino",          dosisMgKg: 0.3, via: "SC / IV / Oral", retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis única: 0.3 mg/kg; mant.: 0.1 mg/kg/día." }
      ],
      contraindicaciones: "Hipersensibilidad, úlcera gástrica, fallo renal, deshidratación.",
      comerciales: ["Metacam", "Meloxivet", "Loxicom"]
    },
    {
      id: "carprofeno",
      principio: "Carprofeno",
      grupo: "AINE Propiónico",
      categoria: "aine",
      riesgo: 3,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibe COX-1 y COX-2. Analgésico, antipirético y antiinflamatorio.",
      especies: [
        { nombre: "Canino", dosisMgKg: 4,   via: "Oral / SC / IV", retiroCarne: 0,  retiroLeche: 0, nota: "4 mg/kg 1 vez/día o 2 mg/kg 2 veces/día." },
        { nombre: "Felino", dosisMgKg: 4,   via: "SC (única)",     retiroCarne: 0,  retiroLeche: 0, nota: "Solo dosis única prequirúrgica." },
        { nombre: "Bovino", dosisMgKg: 1.4, via: "SC / IV",        retiroCarne: 21, retiroLeche: 0, nota: "Dosis única SC para fiebre y dolor." }
      ],
      contraindicaciones: "Hepatopatía. Hipersensibilidad. No uso crónico en gatos.",
      comerciales: ["Rimadyl", "Canidryl"]
    },
    {
      id: "flunixin-meglumina",
      principio: "Flunixin Meglumina",
      grupo: "AINE",
      categoria: "aine",
      riesgo: 4,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Potente inhibidor de COX no selectivo. Antiinflamatorio rápido.",
      especies: [
        { nombre: "Bovino",  dosisMgKg: 2.2, via: "IV / IM",  retiroCarne: 4,  retiroLeche: 36, nota: "Retiro leche: 36 horas. Mastitis, endotoxemia." },
        { nombre: "Equino",  dosisMgKg: 1.1, via: "IV / IM",  retiroCarne: 0,  retiroLeche: 0,  nota: "Cólico y endotoxemia. Preferir IV." },
        { nombre: "Canino",  dosisMgKg: 1.1, via: "IV",       retiroCarne: 0,  retiroLeche: 0,  nota: "Máximo 3 días. Riesgo GI alto." }
      ],
      contraindicaciones: "Úlceras GI. Disfunción renal. No combinar con corticoides ni AINEs.",
      comerciales: ["Finadyne", "Banamine"]
    },

    // =====================================================================
    // ANALGÉSICOS / OPIOIDES
    // =====================================================================
    {
      id: "tramadol",
      principio: "Tramadol",
      grupo: "Opioide mixto",
      categoria: "analgesico",
      riesgo: 3,
      concentracion: 50,
      unidad: "mg/tableta",
      mecanismo: "Agonista opioide mu + inhibe recaptación de serotonina y NE.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 2.5, via: "Oral / SC / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "1–4 mg/kg cada 8–12 h." },
        { nombre: "Felino",  dosisMgKg: 4,   via: "Oral",                 retiroCarne: 0, retiroLeche: 0, nota: "Puede causar disforia." }
      ],
      contraindicaciones: "Convulsiones. Ajustar en insuf. renal/hepática.",
      comerciales: ["Tramal", "Zydol"]
    },
    {
      id: "morfina",
      principio: "Morfina",
      grupo: "Opioide Agonista Puro",
      categoria: "analgesico",
      riesgo: 4,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Agonista puro de receptores mu, delta y kappa. Analgesia, sedación, depresión respiratoria.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.5, via: "IM / SC / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg IM/SC cada 4 h." },
        { nombre: "Felino",  dosisMgKg: 0.1, via: "IM / SC",            retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.2 mg/kg. Puede causar disforia." }
      ],
      contraindicaciones: "Traumatismo craneal. Insuficiencia respiratoria.",
      comerciales: ["Morfina 10 mg/mL"]
    },

    // =====================================================================
    // ANTIBIÓTICOS — BACTERICIDAS
    // =====================================================================
    {
      id: "amoxicilina",
      principio: "Amoxicilina",
      grupo: "Aminopenicilina",
      categoria: "bactericida",
      riesgo: 2,
      concentracion: 150,
      unidad: "mg/mL",
      mecanismo: "Bactericida por inhibición de síntesis de pared celular.",
      especies: [
        { nombre: "Canino (Gram +)", dosisMgKg: 10, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "10 mg/kg cada 12 h." },
        { nombre: "Canino (Gram -)", dosisMgKg: 20, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "20 mg/kg cada 8 h oral." },
        { nombre: "Bovino",          dosisMgKg: 8,  via: "SC / IM",         retiroCarne: 14, retiroLeche: 2, nota: "Respiratorias: 11 mg/kg cada 12 h." }
      ],
      contraindicaciones: "Hipersensibilidad a betalactámicos.",
      comerciales: ["Clamoxyl", "Amoxil", "Vetramox"]
    },
    {
      id: "amoxicilina-clavulanico",
      principio: "Amoxicilina + Clavulánico",
      grupo: "Aminopenicilina + Inhibidor beta-lactamasa",
      categoria: "bactericida",
      riesgo: 2,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Clavulánico protege a la amoxicilina de beta-lactamasas.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 13.75, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "13.75 mg/kg cada 12 h." },
        { nombre: "Felino",  dosisMgKg: 10,    via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "Gram +: 10 mg/kg c/12 h." }
      ],
      contraindicaciones: "Hipersensibilidad a betalactámicos.",
      comerciales: ["Synulox", "Clavaseptin"]
    },
    {
      id: "enrofloxacina",
      principio: "Enrofloxacina",
      grupo: "Fluoroquinolona",
      categoria: "bactericida",
      riesgo: 3,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibe ADN-girasa y topoisomerasa IV. Bactericida dependiente de concentración.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,   via: "Oral / SC / IV lenta", retiroCarne: 0,  retiroLeche: 0,  nota: "5 mg/kg 1 vez/día." },
        { nombre: "Felino",  dosisMgKg: 5,   via: "Oral / SC",            retiroCarne: 0,  retiroLeche: 0,  nota: "MÁXIMO 5 mg/kg/día. Ceguera irreversible a dosis altas." },
        { nombre: "Bovino",  dosisMgKg: 7.5, via: "SC",                   retiroCarne: 14, retiroLeche: 14, nota: "Para neumonía bovina." }
      ],
      contraindicaciones: "Animales jóvenes (artropatía). Felinos > 5 mg/kg/día.",
      comerciales: ["Baytril", "Enrox"]
    },
    {
      id: "ceftiofur",
      principio: "Ceftiofur",
      grupo: "Cefalosporina 3ª generación",
      categoria: "bactericida",
      riesgo: 2,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Resistente a beta-lactamasas. Activo frente a Gram negativos.",
      especies: [
        { nombre: "Bovino",  dosisMgKg: 2.2, via: "IM / SC", retiroCarne: 4, retiroLeche: 0, nota: "Retiro leche: 0 horas." },
        { nombre: "Porcino", dosisMgKg: 3,   via: "IM",      retiroCarne: 4, retiroLeche: 0, nota: "Enfermedad respiratoria." }
      ],
      contraindicaciones: "Alergia a betalactámicos.",
      comerciales: ["Excenel", "Cobactan"]
    },
    {
      id: "gentamicina",
      principio: "Gentamicina",
      grupo: "Aminoglucósido",
      categoria: "bactericida",
      riesgo: 4,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Se une al ribosoma 30S. Activo contra Gram negativos aerobios.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 6.6, via: "IV / IM / SC", retiroCarne: 0,  retiroLeche: 0, nota: "Nefrotóxico y ototóxico." },
        { nombre: "Bovino",  dosisMgKg: 4,   via: "IM",           retiroCarne: 18, retiroLeche: 3, nota: "Vigilar deshidratación." }
      ],
      contraindicaciones: "Falla renal. No combinar con furosemida.",
      comerciales: ["Gentocin", "Gentavet"]
    },

    // =====================================================================
    // ANTIBIÓTICOS — BACTERIOSTÁTICOS
    // =====================================================================
    {
      id: "oxitetraciclina-la",
      principio: "Oxitetraciclina LA",
      grupo: "Tetraciclina",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 200,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático. Se une al ribosoma 30S. Amplio espectro.",
      especies: [
        { nombre: "Bovino (LA)", dosisMgKg: 20, via: "IM profunda",  retiroCarne: 22, retiroLeche: 4,  nota: "Máximo 10 mL por sitio." },
        { nombre: "Porcino",     dosisMgKg: 20, via: "IM",           retiroCarne: 22, retiroLeche: 0,  nota: "Neumonías y leptospirosis." }
      ],
      contraindicaciones: "Falla renal, gestación, animales jóvenes.",
      comerciales: ["Terramicina LA", "Emicina"]
    },
    {
      id: "doxiciclina",
      principio: "Doxiciclina",
      grupo: "Tetraciclina 2ª gen",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático amplio espectro. Mejor absorción y liposolubilidad.",
      especies: [
        { nombre: "Canino", dosisMgKg: 5,  via: "Oral / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Ehrlichiosis: 28 días mínimo." },
        { nombre: "Felino", dosisMgKg: 5,  via: "Oral / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Administrar con alimento." }
      ],
      contraindicaciones: "Gestación. Animales en desarrollo. No con antiácidos.",
      comerciales: ["Ronaxan", "Vibravet"]
    },
    {
      id: "metronidazol",
      principio: "Metronidazol",
      grupo: "Nitroimidazol",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Se activa en células anaerobias. Activo contra anaerobios y protozoos.",
      especies: [
        { nombre: "Canino", dosisMgKg: 15, via: "Oral / IV", retiroCarne: 0, retiroLeche: 0, nota: "Giardia: 25 mg/kg cada 12 h x 5–7 días." },
        { nombre: "Felino", dosisMgKg: 10, via: "Oral",      retiroCarne: 0, retiroLeche: 0, nota: "Cuidado con signos neurológicos." }
      ],
      contraindicaciones: "Gestación temprana. Hepatopatías graves.",
      comerciales: ["Flagyl", "Metronidazol 250 mg"]
    },

    // =====================================================================
    // ANTIPARASITARIOS INTERNOS
    // =====================================================================
    {
      id: "ivermectina-1",
      principio: "Ivermectina 1%",
      grupo: "Lactona Macrocíclica",
      categoria: "antiparasitario-interno",
      riesgo: 3,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Apertura de canales de Cl glutamato-dependientes. Parálisis del parásito.",
      especies: [
        { nombre: "Bovino",                       dosisMgKg: 0.2,   via: "SC",         retiroCarne: 35, retiroLeche: 28, nota: "Nematodos y ectoparásitos." },
        { nombre: "Porcino",                      dosisMgKg: 0.3,   via: "SC",         retiroCarne: 28, retiroLeche: 0,  nota: "Sarna sarcóptica." },
        { nombre: "Canino (sarna)",               dosisMgKg: 0.4,   via: "SC / Oral",  retiroCarne: 0,  retiroLeche: 0,  nota: "PELIGRO MORTAL en Collies/Pastores (MDR1)." },
        { nombre: "Canino (prev. Dirofilaria)",   dosisMgKg: 0.006, via: "Oral",       retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis micro mensual. Segura para todas las razas." }
      ],
      contraindicaciones: "Razas MDR1/ABCB1. Cachorros < 6 semanas.",
      comerciales: ["Ivomec", "Bovimec", "Heartgard"]
    },
    {
      id: "prazicuantel",
      principio: "Prazicuantel",
      grupo: "Anticestodo",
      categoria: "antiparasitario-interno",
      riesgo: 1,
      concentracion: 50,
      unidad: "mg/tableta",
      mecanismo: "Aumenta permeabilidad al Ca²⁺ en céstodos. Parálisis espástica.",
      especies: [
        { nombre: "Canino", dosisMgKg: 5,   via: "Oral / SC / IM", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg dosis única." },
        { nombre: "Felino", dosisMgKg: 5,   via: "Oral / SC",      retiroCarne: 0, retiroLeche: 0, nota: "Dosis única." },
        { nombre: "Equino", dosisMgKg: 1.5, via: "Oral (pasta)",   retiroCarne: 0, retiroLeche: 0, nota: "Para Anoplocephala." }
      ],
      contraindicaciones: "Hipersensibilidad. Cachorros < 4 semanas.",
      comerciales: ["Droncit", "Cestel"]
    },
    {
      id: "fenbendazol",
      principio: "Fenbendazol",
      grupo: "Bencimidazol",
      categoria: "antiparasitario-interno",
      riesgo: 1,
      concentracion: 100,
      unidad: "mg/mL",
      mecanismo: "Inhibe polimerización de tubulina parasitaria.",
      especies: [
        { nombre: "Canino", dosisMgKg: 50,  via: "Oral", retiroCarne: 0,  retiroLeche: 0, nota: "50 mg/kg cada 24 h x 3 días. Giardia: x 5 días." },
        { nombre: "Bovino", dosisMgKg: 7.5, via: "Oral", retiroCarne: 14, retiroLeche: 5, nota: "Excelente para Ostertagia." }
      ],
      contraindicaciones: "Primer tercio de gestación (precaución).",
      comerciales: ["Panacur", "Safe-Guard"]
    },

    // =====================================================================
    // RESPIRATORIO
    // =====================================================================
    {
      id: "ambroxol",
      principio: "Ambroxol",
      grupo: "Mucolítico",
      categoria: "broncodilatador",
      riesgo: 1,
      concentracion: 7.5,
      unidad: "mg/mL",
      mecanismo: "Mucolítico. Estimula producción de surfactante y motilidad ciliar.",
      especies: [
        { nombre: "Canino", dosisMgKg: 2.5, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "2.5 mg/kg cada 8–12 h." },
        { nombre: "Felino", dosisMgKg: 1,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "1 mg/kg cada 8–12 h." }
      ],
      contraindicaciones: "Pacientes sin tos. Edema pulmonar.",
      comerciales: ["Mucosolvan", "Bisolvon"]
    },
    {
      id: "salbutamol",
      principio: "Salbutamol",
      grupo: "Broncodilatador Beta-2 Agonista",
      categoria: "broncodilatador",
      riesgo: 2,
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Agonista beta-2 selectivo. Broncodilatación rápida.",
      especies: [
        { nombre: "Canino",            dosisMgKg: 0.05, via: "Inhalación / Oral", retiroCarne: 0, retiroLeche: 0, nota: "50 µg/kg nebulización." },
        { nombre: "Felino (asma)",     dosisMgKg: 0.05, via: "Inhalación",         retiroCarne: 0, retiroLeche: 0, nota: "1–2 puffs cada 4–8 h con espaciador." }
      ],
      contraindicaciones: "Taquiarritmias. Precaución en cardiopatías.",
      comerciales: ["Ventolin", "Salbuvent"]
    },

    // =====================================================================
    // ENDOCRINOS / HORMONAS
    // =====================================================================
    {
      id: "insulina",
      principio: "Insulina",
      grupo: "Hormona pancreática",
      categoria: "hormona",
      riesgo: 4,
      concentracion: 100,
      unidad: "UI/mL",
      mecanismo: "Facilita captación celular de glucosa. Inhibe gluconeogénesis.",
      especies: [
        { nombre: "Canino (DM)", dosisMgKg: 0.5, via: "SC", retiroCarne: 0, retiroLeche: 0, nota: "0.5 UI/kg SC cada 24 h con comida." },
        { nombre: "Felino (DM)", dosisMgKg: 0.35, via: "SC", retiroCarne: 0, retiroLeche: 0, nota: "PZI: 0.22–0.6 UI/kg cada 12–24 h." }
      ],
      contraindicaciones: "No confundir tipos y potencias. Monitorear glucemia.",
      comerciales: ["Caninsulin", "ProZinc", "Vetsulin"]
    },
    {
      id: "oxitocina",
      principio: "Oxitocina",
      grupo: "Hormona uterotónica",
      categoria: "hormona",
      riesgo: 3,
      concentracion: 10,
      unidad: "UI/mL",
      mecanismo: "Estimula contracción uterina. Facilita eyección láctea.",
      especies: [
        { nombre: "Canino / Felino (parto)",     dosisMgKg: 5,  via: "SC / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.5–3 UI cada 30–60 min." },
        { nombre: "Bovino (retención placenta)", dosisMgKg: 50, via: "IM",           retiroCarne: 1, retiroLeche: 1, nota: "40–60 UI cada 2 h." }
      ],
      contraindicaciones: "Distocia. No usar sin relajación cervical.",
      comerciales: ["Oxytocin 10 UI/mL", "Pitocin"]
    }
  ]
};