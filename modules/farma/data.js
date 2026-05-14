// =============================================================================
// SUITE VET 2.0 — modules/farma/data.js
// Fuentes:
//   • Flashcards Farmacología en Medicina Veterinaria - FORMAVET 2024
//   • Farmacología para Médicos Veterinarios - Jazven 2013
// =============================================================================
// ✅ CÓMO AGREGAR UN FÁRMACO NUEVO:
//   1. Copia cualquier bloque { id: "..." } del array farmacos
//   2. Pega al final del array (antes del último ] )
//   3. Cambia id, principio, grupo, concentracion, unidad, mecanismo,
//      especies[], contraindicaciones y comerciales[]
//   4. Guarda y recarga el navegador — aparece automáticamente
// =============================================================================

window.FARMA_DATA = {
  farmacos: [

    // =====================================================================
    // SISTEMA NERVIOSO — ANESTÉSICOS / SEDANTES
    // =====================================================================
    {
      id: "acepromacina",
      principio: "Acepromacina",
      grupo: "Fenotiazínico / Tranquilizante",
      grupoKey: "anestesico",
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Tranquilizante fenotiazídico. Propiedades antiemeticas, antiespasmódicas e hipotérmicas. Estimula vasodilatación arterial, mantiene poco efecto depresor respiratorio. Revierte arritmias por epinefrina.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.05,  via: "IM / SC / IV",  retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.1 mg/kg IV, IM, SC. Razas gigantes más sensibles a los efectos." },
        { nombre: "Felino",  dosisMgKg: 0.1,   via: "IM / SC / IV",  retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.2 mg/kg. Usar con precaución en pacientes geriátricos." },
        { nombre: "Bovino",  dosisMgKg: 0.05,  via: "IV / IM",       retiroCarne: 3, retiroLeche: 1, nota: "0.01–0.02 mg/kg IV o 0.03–0.1 mg/kg IM. Sedación suave." },
        { nombre: "Equino",  dosisMgKg: 0.03,  via: "IV / IM",       retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.05 mg/kg. Puede causar protrusión del pene en caballos." },
        { nombre: "Porcino", dosisMgKg: 0.15,  via: "IV / IM / SC",  retiroCarne: 3, retiroLeche: 0, nota: "0.1–0.2 mg/kg IV, IM o SC." }
      ],
      contraindicaciones: "No usar con aminoglucósidos, fenitoína ni antidepresivos. Evitar en shock, hipovolemia y pacientes cardíacos graves.",
      comerciales: ["Acepromacina", "Promace", "Atravet"]
    },
    {
      id: "ketamina",
      principio: "Ketamina",
      grupo: "Anestésico Disociativo",
      grupoKey: "anestesico",
      concentracion: 100,
      unidad: "mg/mL",
      mecanismo: "Anestésico general disociativo. Inhibe receptores NMDA, bloquea serotonina, norepinefrina y dopamina en SNC. Actividad analgésica significativa. No produce relajación muscular completa.",
      especies: [
        { nombre: "Canino (con Xilacina)", dosisMgKg: 11,  via: "IM",           retiroCarne: 0, retiroLeche: 0, nota: "Premedicar con Xilacina 2.2 mg/kg IM 10 min antes. Reducir dosis 25% en >22 kg." },
        { nombre: "Canino (analgesia)",    dosisMgKg: 0.5, via: "IM / SC / Oral",retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg cada 4–6 h para dolor leve-moderado, junto con opioides." },
        { nombre: "Felino (sujeción)",     dosisMgKg: 11,  via: "IM",           retiroCarne: 0, retiroLeche: 0, nota: "11 mg/kg IM para sujeción; 22–33 mg/kg para procedimientos quirúrgicos menores." },
        { nombre: "Equino (inducción)",    dosisMgKg: 2.2, via: "IV",           retiroCarne: 0, retiroLeche: 0, nota: "Sedar con Xilacina 1 mg/kg IV 5–10 min antes. Solo para anestesia de campo." }
      ],
      contraindicaciones: "Hemorragia significativa. Hipertermia. Aumento de presión intraocular. Procedimientos en faringe/tráquea.",
      comerciales: ["Ketalar", "Vetalar", "Imalgène 1000"]
    },
    {
      id: "propofol",
      principio: "Propofol",
      grupo: "Anestésico General / Hipnótico",
      grupoKey: "anestesico",
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Hipnótico de acción corta. Potencia la inhibición GABAérgica. Rápida redistribución desde SNC. Biotransformación hepática por glucuronización hacia metabolitos inactivos.",
      especies: [
        { nombre: "Canino / Felino (inducción)", dosisMgKg: 6,  via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Dar 25% de la dosis cada 30 seg hasta efecto. Para sedación: 0.1 mg/kg/min en infusión." },
        { nombre: "Conejo",                      dosisMgKg: 10, via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "5–14 mg/kg IV lenta. Riesgo de apnea alto, tener ventilación lista." }
      ],
      contraindicaciones: "Hipersensibilidad al propofol. Cautela: estrés grave, hipoproteinemia, hiperlipidemia, convulsiones o antecedentes de anafilaxis.",
      comerciales: ["Propofol 1%", "Rapinovet", "PropoFlo"]
    },
    {
      id: "xilacina-2",
      principio: "Xilacina 2%",
      grupo: "Sedante Alfa-2 Agonista",
      grupoKey: "anestesico",
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Potente agonista alfa-2 adrenérgico. Sedante, analgésico y relajante muscular. Produce sedación, relajación muscular y depresión del SNC. No causa excitación en felinos, equinos y rumiantes.",
      especies: [
        { nombre: "Canino",          dosisMgKg: 1.1,  via: "IM / IV / SC", retiroCarne: 0, retiroLeche: 0, nota: "1.1–2.2 mg/kg. Como emético en caninos. Antídoto: Yohimbina 0.1–0.2 mg/kg IV." },
        { nombre: "Felino",          dosisMgKg: 1.1,  via: "IM / SC",      retiroCarne: 0, retiroLeche: 0, nota: "Premedicar con atropina. Como emético: 0.44 mg/kg IM. Como analgésico: 0.1–1 mg/kg." },
        { nombre: "Equino",          dosisMgKg: 1.1,  via: "IV",           retiroCarne: 0, retiroLeche: 0, nota: "1.1 mg/kg IV. Para cólico: 0.2–0.5 mg/kg IV (analgesia 20–30 min)." },
        { nombre: "Bovino",          dosisMgKg: 0.1,  via: "IV / IM",      retiroCarne: 3, retiroLeche: 2, nota: "⚠️ EXTREMA SENSIBILIDAD. 0.05–0.15 mg/kg IV. Usar 1/10 dosis equina." },
        { nombre: "Ovino / Caprino", dosisMgKg: 0.08, via: "IV / IM",      retiroCarne: 2, retiroLeche: 1, nota: "0.05–0.1 mg/kg IV; 0.1–0.22 mg/kg IM." }
      ],
      contraindicaciones: "Cardiópatas, obstrucción respiratoria, gestación avanzada. Antídoto: Yohimbina o Atipamezol 0.1–0.2 mg/kg IV.",
      comerciales: ["Rompun", "Procin", "Sedalvet", "Xilazol"]
    },
    {
      id: "tiletamina-zolazepam",
      principio: "Tiletamina + Zolazepam",
      grupo: "Anestésico Disociativo + Benzodiazepina",
      grupoKey: "anestesico",
      concentracion: 100,
      unidad: "mg/mL",
      mecanismo: "Tiletamina: ciclohexilamina disociativa. Zolazepam: benzodiazepina. Produce anestesia de corta duración (~30 min). Mantiene reflejo tusígeno, deglutorio, corneal y podal.",
      especies: [
        { nombre: "Canino (diagnóstico)",   dosisMgKg: 8.25,  via: "IM", retiroCarne: 0, retiroLeche: 0, nota: "6.6–9.9 mg/kg IM. Dosis total máxima: 26.4 mg/kg." },
        { nombre: "Felino (procedimiento)", dosisMgKg: 11.3,  via: "IM", retiroCarne: 0, retiroLeche: 0, nota: "9.7–15.8 mg/kg IM según tipo de procedimiento. Dosis total máx: 72 mg/kg." }
      ],
      contraindicaciones: "Enfermedad pancreática. Conejos. Enfermedad cardíaca grave. Cesárea o enfermedad pulmonar.",
      comerciales: ["Zoletil", "Telazol"]
    },
    {
      id: "diazepam",
      principio: "Diazepam",
      grupo: "Benzodiazepina",
      grupoKey: "anestesico",
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Potencia acción inhibitoria del GABA en el SNC sobre receptores GABA-A. Produce sedación, relajación muscular, actividad anticonvulsivante y ansiólisis.",
      especies: [
        { nombre: "Canino (convulsiones)",   dosisMgKg: 0.5, via: "IV / Rectal",    retiroCarne: 0, retiroLeche: 0, nota: "0.5–1 mg/kg IV lenta para estatus epiléptico. Rectal: 1–2 mg/kg para emergencias." },
        { nombre: "Felino",                  dosisMgKg: 0.5, via: "IV",             retiroCarne: 0, retiroLeche: 0, nota: "0.25–0.5 mg/kg IV lenta. Precaución: puede causar necrosis hepática fulminante en gatos." },
        { nombre: "Equino (premedicación)",  dosisMgKg: 0.1, via: "IV",             retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.2 mg/kg IV. Solo combinado con otros agentes (ketamina, xilacina)." }
      ],
      contraindicaciones: "Hepatopatía en gatos (riesgo de necrosis). Miastenia gravis. Glaucoma. No usar como único agente en equinos.",
      comerciales: ["Valium", "Diazepam 5 mg/mL", "Stesolid"]
    },

    // =====================================================================
    // SISTEMA CARDIOVASCULAR
    // =====================================================================
    {
      id: "adrenalina",
      principio: "Adrenalina (Epinefrina)",
      grupo: "Agonista Adrenérgico",
      grupoKey: "cardiovascular",
      concentracion: 1,
      unidad: "mg/mL",
      mecanismo: "Agonista alfa y beta-adrenérgico endógeno. Estimula directamente el corazón (aumenta FC y contractilidad), aumenta presión sistólica, relaja músculo liso bronquial, antagoniza efectos de histamina.",
      especies: [
        { nombre: "Canino (anafilaxis/PCR)", dosisMgKg: 0.01, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Anafilaxis: 0.01–0.02 mg/kg IV, IM, SC. PCR dosis alta: 0.1–0.2 mg/kg IV." },
        { nombre: "Felino (anafilaxis/PCR)", dosisMgKg: 0.01, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Anafilaxis: 0.01–0.02 mg/kg. PCR: 0.05–0.5 mg IV total." },
        { nombre: "Bovino / Porcino",        dosisMgKg: 0.02, via: "SC / IM",      retiroCarne: 1, retiroLeche: 1, nota: "0.5–1 mL/45 kg de solución 1:1000 SC o IM." },
        { nombre: "Equino (anafilaxis)",     dosisMgKg: 0.01, via: "IM / SC",      retiroCarne: 0, retiroLeche: 0, nota: "3–5 mL solución 1:1000 por cada 450 kg IM o SC." }
      ],
      contraindicaciones: "Glaucoma ángulo estrecho. Hipertensión. Dilatación cardíaca o insuficiencia coronaria. Durante el parto.",
      comerciales: ["Adrenalina 1:1000", "Epinefrina", "Adrenalin"]
    },
    {
      id: "atropina",
      principio: "Atropina",
      grupo: "Anticolinérgico / Parasimpaticolítico",
      grupoKey: "cardiovascular",
      concentracion: 0.5,
      unidad: "mg/mL",
      mecanismo: "Inhibe competitivamente acetilcolina en sitios neuroefectores parasimpáticos posganglionares. Aumenta FC, reduce secreciones, dilata bronquios. Antídoto para organofosforados.",
      especies: [
        { nombre: "Canino (bradicardia)", dosisMgKg: 0.033, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.022–0.044 mg/kg IM, SC o IV. Toxicidad OP: 0.2–2 mg/kg (¼ IV, resto SC/IM)." },
        { nombre: "Felino (bradicardia)", dosisMgKg: 0.033, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.022–0.044 mg/kg. Premedicación: evitar hipersalivación con xilacina." },
        { nombre: "Equino",               dosisMgKg: 0.14,  via: "IV / SC / IM", retiroCarne: 0, retiroLeche: 0, nota: "Bradiarritmia: 0.01–0.02 mg/kg IV. Intox. OP: 0.22 mg/kg." },
        { nombre: "Bovino",               dosisMgKg: 0.5,   via: "IV / SC / IM", retiroCarne: 3, retiroLeche: 2, nota: "Dosis promedio 0.5 mg/kg; dar ¼ IV y resto SC/IM para intox. organofosforados." }
      ],
      contraindicaciones: "Glaucoma ángulo estrecho. Insuficiencia cardíaca. Obstrucción gastrointestinal. Íleo paralítico. Colitis ulcerativa.",
      comerciales: ["Atropina sulfato 0.5 mg/mL", "Atropen"]
    },
    {
      id: "furosemida",
      principio: "Furosemida",
      grupo: "Diurético del Asa",
      grupoKey: "cardiovascular",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Reduce absorción de electrólitos en asa ascendente de Henle. Disminuye reabsorción de sodio y cloruro, aumenta excreción de potasio en túbulo distal. En equinos tiene efecto broncodilatador adicional.",
      especies: [
        { nombre: "Canino (diurético)", dosisMgKg: 2.5, via: "Oral / IV / IM", retiroCarne: 0, retiroLeche: 0, nota: "2.5–5 mg/kg 1–2 veces/día. Edema grave: 7.7 mg/kg IV o IM cada 1–2 h." },
        { nombre: "Felino (diurético)", dosisMgKg: 2.5, via: "Oral / IV / IM", retiroCarne: 0, retiroLeche: 0, nota: "2.5–5 mg/kg 1–2 veces/día. Edema grave: 4.4 mg/kg IV o IM cada 1–2 h." },
        { nombre: "Bovino (edema ubre)",dosisMgKg: 1,   via: "IM",             retiroCarne: 2, retiroLeche: 2, nota: "500 mg 1 vez/día o 250 mg 2 veces/día." },
        { nombre: "Equino",             dosisMgKg: 1.5, via: "IV / IM",        retiroCarne: 0, retiroLeche: 0, nota: "0.7–2 mg/kg IM o IV cada 6–12 h. Para epistaxis: 250 mg IV 4 h antes de carrera." }
      ],
      contraindicaciones: "Anuria, hipersensibilidad, electrólitos muy disminuidos, disfunción hepática, diabetes mellitus.",
      comerciales: ["Lasix", "Dimazon", "Furosix"]
    },
    {
      id: "enalapril",
      principio: "Enalapril",
      grupo: "IECA (Inhibidor ECA)",
      grupoKey: "cardiovascular",
      concentracion: 5,
      unidad: "mg/tableta",
      mecanismo: "Inhibidor de la ECA. Se convierte en enalaprilato en hígado. Impide formación de angiotensina II vasoconstricitora. Reduce resistencia periférica total y presión arterial.",
      especies: [
        { nombre: "Canino (IC)", dosisMgKg: 0.5,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.5 mg/kg oral 1–2 veces/día. Para urolitiasis: 0.25–0.5 mg/kg cada 12–24 h." },
        { nombre: "Felino (IC)", dosisMgKg: 0.375, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.25–0.5 mg/kg oral 1 vez/día (~1.25–2.5 mg/gato)." }
      ],
      contraindicaciones: "Hipersensibilidad a IECAs. Hiponatremia. Insuficiencia coronaria o cerebrovascular.",
      comerciales: ["Enacard", "Vasotec", "Renitec"]
    },
    {
      id: "digoxina",
      principio: "Digoxina",
      grupo: "Glucósido Cardíaco",
      grupoKey: "cardiovascular",
      concentracion: 0.05,
      unidad: "mg/mL",
      mecanismo: "Glucósido digitálico. Inotropismo positivo. Aumenta disponibilidad de Ca²⁺ a fibras miocárdicas. Aumenta diuresis con reducción del edema. Reduce FC y presiones venosas.",
      especies: [
        { nombre: "Canino (IC / Fibrilación atrial)", dosisMgKg: 0.0075, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.005–0.010 mg/kg oral cada 12 h (máx 0.375 mg/día). Margen terapéutico muy estrecho." },
        { nombre: "Felino (cardiomiopatía)",           dosisMgKg: 0.007, via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "0.007 mg/kg oral día por medio (dosis inicial). Vigilar signos de toxicidad." }
      ],
      contraindicaciones: "Fibrilación ventricular. Miocarditis aguda. Taquicardia ventricular. Hipoxia. Hipocalemia (aumenta toxicidad significativamente).",
      comerciales: ["Digoxina 0.25 mg", "Lanoxin"]
    },
    {
      id: "dopamina",
      principio: "Dopamina",
      grupo: "Simpaticomimético / Vasopresor",
      grupoKey: "cardiovascular",
      concentracion: 40,
      unidad: "mg/mL",
      mecanismo: "Precursor de norepinefrina. En dosis baja (0.5–3 µg/kg/min): dilata lechos vasculares renales y mesentéricos. En dosis alta (>5 µg/kg/min): aumenta resistencia periférica y trata hipotensión.",
      especies: [
        { nombre: "Canino / Felino (UCI)", dosisMgKg: 0.005, via: "IV (infusión)", retiroCarne: 0, retiroLeche: 0, nota: "Dosis renal: 0.5–3 µg/kg/min. IC aguda: 1–10 µg/kg/min IV infusión. SOLO UCI." }
      ],
      contraindicaciones: "Enfermedad cardíaca isquémica. Fibrilación ventricular. Taquiarritmias. Solo usar en ambiente de UCI con monitoreo.",
      comerciales: ["Dopamina 200 mg/5 mL", "Intropín"]
    },
    {
      id: "manitol",
      principio: "Manitol",
      grupo: "Diurético Osmótico",
      grupoKey: "cardiovascular",
      concentracion: 200,
      unidad: "mg/mL",
      mecanismo: "Diurético osmótico. Eleva osmolalidad del filtrado glomerular, retención de agua en nefrona. Incrementa excreción de sodio y cloruro. Reduce presión intraocular e intracraneal.",
      especies: [
        { nombre: "Canino / Felino (oliguria / glaucoma)", dosisMgKg: 0.375, via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Oliguria: 0.25–0.5 g/kg IV en 5–10 min. Glaucoma agudo: 0.5–1 g/kg IV en 15–20 min." },
        { nombre: "Bovino / Porcino / Ovino (edema cerebral)", dosisMgKg: 2, via: "IV", retiroCarne: 2, retiroLeche: 2, nota: "1–3 g/kg IV para edema cerebral. Como diurético renal: 1–2 g/kg." },
        { nombre: "Equino",  dosisMgKg: 1, via: "IV lenta (infusión)", retiroCarne: 0, retiroLeche: 0, nota: "0.25–2 g/kg como solución al 20% por infusión IV lenta." }
      ],
      contraindicaciones: "Anuria secundaria a enfermedad renal. Deshidratación marcada. Hemorragia endocraneal. Edema pulmonar grave.",
      comerciales: ["Manitol 20%", "Osmitrol"]
    },

    // =====================================================================
    // SISTEMA RESPIRATORIO
    // =====================================================================
    {
      id: "ambroxol",
      principio: "Ambroxol",
      grupo: "Mucolítico / Expectorante",
      grupoKey: "respiratorio",
      concentracion: 7.5,
      unidad: "mg/mL",
      mecanismo: "Actúa sobre secreción y transporte en vías respiratorias. Efecto sobre producción de surfactante pulmonar, calidad del moco y motilidad ciliar. Mejora mecanismos de autolimpieza pulmonar.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 2.5, via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "2.5 mg/kg oral cada 8–12 h. Para neumonías, bronconeumonías, sinusitis." },
        { nombre: "Felino",  dosisMgKg: 1,   via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "1 mg/kg oral cada 8–12 h." },
        { nombre: "Equino",  dosisMgKg: 3,   via: "IV",    retiroCarne: 2, retiroLeche: 2, nota: "3.0 mg/kg IV cada 12 h." }
      ],
      contraindicaciones: "No usar en pacientes sin tos moderada o severa (la tos leve puede ser mecanismo de limpieza útil).",
      comerciales: ["Mucosolvan", "Mucosolvente", "Ambroxol"]
    },
    {
      id: "salbutamol",
      principio: "Salbutamol (Albuterol)",
      grupo: "Broncodilatador Beta-2 Agonista",
      grupoKey: "respiratorio",
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Agonista beta-2 adrenérgico selectivo. Relaja músculo liso bronquial. Broncodilatación de acción rápida (5–15 min). Puede aumentar FC y causar temblor muscular a dosis altas.",
      especies: [
        { nombre: "Canino (broncoespasmo)", dosisMgKg: 0.05, via: "Inhalación / Oral",  retiroCarne: 0, retiroLeche: 0, nota: "50 µg/kg nebulización; 0.02–0.05 mg/kg oral cada 8 h." },
        { nombre: "Felino (asma felina)",   dosisMgKg: 0.05, via: "Inhalación",          retiroCarne: 0, retiroLeche: 0, nota: "100 µg por inhalación. 1–2 puffs cada 4–8 h mediante cámara espaciadora." },
        { nombre: "Equino (ORVA)",          dosisMgKg: 0.8,  via: "IV infusión / Nebul.",retiroCarne: 0, retiroLeche: 0, nota: "0.8 µg/kg/min IV diluido o nebulización 450 µg 3–4 veces/día." }
      ],
      contraindicaciones: "Taquiarritmias. Hipersensibilidad. Precaución en cardiopatías.",
      comerciales: ["Ventolin", "Salbuvent", "Albuterol inhalador"]
    },
    {
      id: "bromhexina",
      principio: "Bromhexina",
      grupo: "Mucolítico / Expectorante",
      grupoKey: "respiratorio",
      concentracion: 3,
      unidad: "mg/mL",
      mecanismo: "Regulador de la mucosidad. Activa secreción de glándulas seromucosas y rompe fibras de glicoproteína ácida del esputo mucoide. Restablece viscosidad y elasticidad de secreciones bronquiales.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,   via: "IM / Oral", retiroCarne: 0, retiroLeche: 0, nota: "3–15 mg/kg IM cada 12 h o 2.5–5 mg/kg oral cada 8 h." },
        { nombre: "Felino",  dosisMgKg: 3,   via: "IM / Oral", retiroCarne: 0, retiroLeche: 0, nota: "3 mg/kg IM cada 24 h o 1 mg/kg oral cada 24 h." },
        { nombre: "Bovino",  dosisMgKg: 0.5, via: "IM",        retiroCarne: 3, retiroLeche: 2, nota: "0.5 mg/kg IM. Para neumonías crónicas y bronconeumonías." },
        { nombre: "Equino",  dosisMgKg: 0.5, via: "IM",        retiroCarne: 0, retiroLeche: 0, nota: "0.5 mg/kg IM." }
      ],
      contraindicaciones: "No usar en edema pulmonar. No usar en infección grave por nematodos pulmonares hasta 3 días después del inicio antihelmíntico.",
      comerciales: ["Bisolvon", "Bromhexina 3 mg/mL"]
    },

    // =====================================================================
    // ENDOCRINOS
    // =====================================================================
    {
      id: "insulina",
      principio: "Insulina",
      grupo: "Hormona Pancreática",
      grupoKey: "endocrino",
      concentracion: 100,
      unidad: "UI/mL",
      mecanismo: "Se une a receptores de superficie celular. Facilita captación y almacenamiento de glucosa por células cardíacas, esqueléticas y adiposas. Inhibe gluconeogénesis y lipólisis.",
      especies: [
        { nombre: "Canino / Felino (cetoacidosis)", dosisMgKg: 0.1, via: "IM / IV infusión", retiroCarne: 0, retiroLeche: 0, nota: "CAD: 0.2 UI/kg IM inicial + 0.1 UI/kg/h IM. Infusión IV: 0.05–0.1 UI/kg/h." },
        { nombre: "Canino (diabetes mellitus)",     dosisMgKg: 0.5, via: "SC",               retiroCarne: 0, retiroLeche: 0, nota: "0.5 UI/kg SC cada 24 h. Junto con comida o justo después." },
        { nombre: "Felino (diabetes mellitus)",     dosisMgKg: 0.35,via: "SC",               retiroCarne: 0, retiroLeche: 0, nota: "Insulina PZI: 0.22–0.6 UI/kg SC cada 12–24 h. Insulina glargina: 0.5 UI/gato." },
        { nombre: "Bovino (cetosis)",               dosisMgKg: 0.5, via: "SC",               retiroCarne: 2, retiroLeche: 2, nota: "Insulina PZI 200 UI totales SC 1 vez cada 48 h como adyuvante de cetosis." }
      ],
      contraindicaciones: "No confundir tipos y potencias de insulina incluyendo jeringas. Monitorear glucemia regularmente. Hipoglucemia es la RAM más frecuente.",
      comerciales: ["Caninsulin", "ProZinc (gatos)", "Vetsulin", "NPH Insulina"]
    },
    {
      id: "levotiroxina",
      principio: "Levotiroxina (T4)",
      grupo: "Hormona Tiroidea",
      grupoKey: "endocrino",
      concentracion: 0.1,
      unidad: "mg/tableta",
      mecanismo: "Genera efecto idéntico a la hormona tiroidea natural. Se convierte en T3 activa en órganos periféricos. Afecta velocidad de muchos procesos fisiológicos y metabolismo basal.",
      especies: [
        { nombre: "Canino (hipotiroidismo)", dosisMgKg: 0.02,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "20 µg/kg oral 2 veces/día (máx 0.8 mg 2 veces/día). Evaluar T4 a las 4–8 semanas." },
        { nombre: "Felino (hipotiroidismo)", dosisMgKg: 0.075, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.1 mg/gato oral 1 vez/día." },
        { nombre: "Equino (hipotiroidismo)", dosisMgKg: 0.14,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "10 mg en 70 mL de jarabe de maíz 1 vez/día. Controlar T4 1 semana después del inicio." }
      ],
      contraindicaciones: "Infarto miocárdico agudo. Tirotoxicosis. Insuficiencia adrenal no tratada. Precaución en cardiopatías y diabetes.",
      comerciales: ["Soloxine", "Thyrozine", "Forthyron"]
    },
    {
      id: "oxitocina",
      principio: "Oxitocina",
      grupo: "Hormona Uterotónica / Galactogogo",
      grupoKey: "endocrino",
      concentracion: 10,
      unidad: "UI/mL",
      mecanismo: "Incrementa permeabilidad al sodio en miofibrillas uterinas, estimula contracción uterina. El umbral disminuye durante la gestación con altos niveles de estrógeno. Facilita la bajada de leche.",
      especies: [
        { nombre: "Canino / Felino (parto)",    dosisMgKg: 5,  via: "SC / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.5–3 UI SC o IM cada 30–60 min. Inercia uterina: 5–20 UI IM o goteo IV (10 UI/L)." },
        { nombre: "Bovino (retención placenta)", dosisMgKg: 50, via: "IM",           retiroCarne: 1, retiroLeche: 1, nota: "40–60 UI cada 2 h. Bajada de leche: 10–20 UI IV. Metritis: 20 UI IM 3–4 veces/día." },
        { nombre: "Equino (parto / placenta)",   dosisMgKg: 10, via: "IV / IM",      retiroCarne: 0, retiroLeche: 0, nota: "2.5–5 UI IV cada 15–20 min hasta nacimiento. Retención de membranas: 10–40 UI IM." },
        { nombre: "Porcino (agalactia / parto)", dosisMgKg: 20, via: "IM / IV",      retiroCarne: 1, retiroLeche: 1, nota: "Agalactia (MMA): 30–40 UI por animal en 3–4 h. Contracciones: 10 UI IM." }
      ],
      contraindicaciones: "Hipersensibilidad. Distocia. No usar antes del parto sin relajación cervical. Tratar hipocalcemia o hipoglucemia antes de su uso.",
      comerciales: ["Oxytocin 10 UI/mL", "Pitocin", "Ocitocina"]
    },

    // =====================================================================
    // GLUCOCORTICOIDES
    // =====================================================================
    {
      id: "dexametasona",
      principio: "Dexametasona",
      grupo: "Corticosteroide",
      grupoKey: "antiinflamatorio",
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Antiinflamatorio esteroidal potente (25–30x más que cortisol). Inhibe fosfolipasa A2, reduce síntesis de prostaglandinas y leucotrienos. Inmunosupresión, gluconeogénesis.",
      especies: [
        { nombre: "Bovino",                    dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 8, retiroLeche: 3, nota: "Abortivo en último tercio de gestación. Para inducción de parto: 20–30 mg IM." },
        { nombre: "Equino",                    dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 0, retiroLeche: 0, nota: "Riesgo de laminitis en uso prolongado. Usar con mucha precaución." },
        { nombre: "Canino (antiinflamatorio)", dosisMgKg: 0.1, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Dosis baja. No usar con AINEs. Para choque: 2–4 mg/kg IV lenta (dosis única)." },
        { nombre: "Canino (inmunosupresor)",   dosisMgKg: 0.3, via: "IV / IM / PO", retiroCarne: 0, retiroLeche: 0, nota: "Para alergias graves o enfermedades autoinmunes." },
        { nombre: "Felino",                    dosisMgKg: 0.1, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Vigilar diabetes transitoria. Los gatos toleran mejor los corticoides." }
      ],
      contraindicaciones: "Diabetes, úlceras, sarna demodécica, gestación. No usar simultáneamente con AINEs.",
      comerciales: ["Dexa-2", "Azium", "Dexafort", "Vexadrón"]
    },
    {
      id: "prednisolona",
      principio: "Prednisolona",
      grupo: "Corticosteroide (acción intermedia)",
      grupoKey: "antiinflamatorio",
      concentracion: 20,
      unidad: "mg/tableta",
      mecanismo: "Glucocorticoide de acción intermedia (4–5x más que cortisol). Activo directamente sin conversión hepática (a diferencia de prednisona). Inhibe fosfolipasa A2 y síntesis de mediadores inflamatorios.",
      especies: [
        { nombre: "Canino (antiinflamatorio)", dosisMgKg: 0.75, via: "Oral / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.5–1 mg/kg oral o IM cada 12–24 h. Reducir gradualmente al finalizar." },
        { nombre: "Canino (inmunosupresor)",   dosisMgKg: 2,    via: "Oral",           retiroCarne: 0, retiroLeche: 0, nota: "1–2 mg/kg oral cada 12–24 h para enfermedades autoinmunes." },
        { nombre: "Felino",                    dosisMgKg: 1.5,  via: "Oral / IM",      retiroCarne: 0, retiroLeche: 0, nota: "1–2 mg/kg oral cada 12–24 h. Gatos toleran mejor que los perros." }
      ],
      contraindicaciones: "Diabetes, úlceras GI, infecciones no tratadas, gestación. Nunca suspender abruptamente en tratamientos prolongados.",
      comerciales: ["Prednisolona 20 mg", "Delta-Cortef", "Presolona"]
    },
    {
      id: "betametasona",
      principio: "Betametasona",
      grupo: "Corticosteroide (alta potencia)",
      grupoKey: "antiinflamatorio",
      concentracion: 4,
      unidad: "mg/mL",
      mecanismo: "Glucocorticoide fluorado de alta potencia y larga acción (25–35x más que cortisol). Marcada actividad antiinflamatoria e inmunosupresora. Escasa retención de sodio.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.02, via: "IM / IV",  retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.025 mg/kg IM o IV. Para dermatitis alérgica: inyección intralesional." },
        { nombre: "Felino",  dosisMgKg: 0.02, via: "IM",       retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.02 mg/kg IM cada 2–3 semanas para mantenimiento en asma felina." },
        { nombre: "Equino",  dosisMgKg: 0.02, via: "IM / Intraarticular", retiroCarne: 0, retiroLeche: 0, nota: "0.02 mg/kg IM. Intraarticular: 3–18 mg por articulación." },
        { nombre: "Bovino",  dosisMgKg: 0.01, via: "IM",       retiroCarne: 14, retiroLeche: 3, nota: "0.01–0.02 mg/kg IM. Para maduración fetal: 20 mg IM dosis única en último tercio." }
      ],
      contraindicaciones: "Diabetes, gestación (puede inducir parto prematuro), infecciones sin tratar. Riesgo de laminitis en equinos.",
      comerciales: ["Betavet", "Celestone", "Betasona"]
    },

    // =====================================================================
    // AINEs
    // =====================================================================
    {
      id: "meloxicam",
      principio: "Meloxicam",
      grupo: "AINE (inhibidor COX-2 preferencial)",
      grupoKey: "antiinflamatorio",
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Inhibe COX-2 preferencialmente sobre COX-1. Propiedades antiinflamatorias, analgésicas y antipiréticas. Bloquea síntesis de prostaglandinas.",
      especies: [
        { nombre: "Bovino",          dosisMgKg: 0.5, via: "SC / IV",        retiroCarne: 15, retiroLeche: 5,  nota: "Excelente en mastitis, diarreas neonatales y enfermedades respiratorias." },
        { nombre: "Porcino",         dosisMgKg: 0.4, via: "IM",             retiroCarne: 5,  retiroLeche: 0,  nota: "Síndrome MMA posparto. Reduce inflamación sistémica." },
        { nombre: "Equino",          dosisMgKg: 0.6, via: "IV / Oral",      retiroCarne: 0,  retiroLeche: 0,  nota: "Cólico y dolor musculoesquelético. No usar más de 14 días." },
        { nombre: "Canino (carga)",  dosisMgKg: 0.2, via: "SC / IV / Oral", retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis de carga día 1: 0.2 mg/kg; mantenimiento: 0.1 mg/kg/día oral." },
        { nombre: "Felino",          dosisMgKg: 0.3, via: "SC / IV / Oral", retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis única: 0.3 mg/kg; mantenimiento: 0.1 mg/kg/día oral." },
        { nombre: "Conejo / Roedor", dosisMgKg: 0.2, via: "Oral / SC",      retiroCarne: 0,  retiroLeche: 0,  nota: "0.2 mg/kg oral o SC 1 vez/día." }
      ],
      contraindicaciones: "Hipersensibilidad, úlcera gástrica, hemorragia intestinal, fallo renal/hepático, deshidratación.",
      comerciales: ["Metacam", "Meloxivet", "Meloxi-Jet", "Loxicom"]
    },
    {
      id: "carprofeno",
      principio: "Carprofeno",
      grupo: "AINE (Propiónico)",
      grupoKey: "antiinflamatorio",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibe COX-1 y COX-2. Propiedades analgésicas, antipiréticas y antiinflamatorias. Menor efecto sobre COX-1 comparado con AINEs convencionales.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 4,   via: "Oral / SC / IV", retiroCarne: 0,  retiroLeche: 0, nota: "4 mg/kg oral 1 vez/día o 2 mg/kg 2 veces/día. SC/IV perioperatorio: 4 mg/kg dosis única." },
        { nombre: "Felino",  dosisMgKg: 4,   via: "SC (única)",     retiroCarne: 0,  retiroLeche: 0, nota: "Solo dosis única prequirúrgica SC. NO para uso crónico en gatos." },
        { nombre: "Bovino",  dosisMgKg: 1.4, via: "SC / IV",        retiroCarne: 21, retiroLeche: 0, nota: "1.4 mg/kg SC una sola vez. Para fiebre y dolor en bovinos." }
      ],
      contraindicaciones: "Hepatopatía conocida. Hipersensibilidad a AINEs. No usar en gatos por más de una dosis. Monitorear enzimas hepáticas en uso crónico.",
      comerciales: ["Rimadyl", "Canidryl", "Carprieve"]
    },
    {
      id: "flunixin-meglumina",
      principio: "Flunixin Meglumina",
      grupo: "AINE (potente)",
      grupoKey: "antiinflamatorio",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Potente inhibidor de COX no selectivo. Inhibe síntesis de prostaglandinas y tromboxanos. Analgésico, antipirético y antiinflamatorio de acción rápida y efecto prolongado.",
      especies: [
        { nombre: "Bovino",  dosisMgKg: 2.2, via: "IV / IM",  retiroCarne: 4,  retiroLeche: 36, nota: "2.2 mg/kg IV o IM cada 24 h. Retiro leche: 36 horas. Para mastitis, endotoxemia, fiebre." },
        { nombre: "Porcino", dosisMgKg: 2.2, via: "IM",       retiroCarne: 12, retiroLeche: 0,  nota: "2.2 mg/kg IM 1 vez/día." },
        { nombre: "Equino",  dosisMgKg: 1.1, via: "IV / IM",  retiroCarne: 0,  retiroLeche: 0,  nota: "1.1 mg/kg IV cada 12 h. Para cólico y endotoxemia. Preferir IV para efecto más rápido." },
        { nombre: "Canino",  dosisMgKg: 1.1, via: "IV",       retiroCarne: 0,  retiroLeche: 0,  nota: "1.1 mg/kg IV 1 vez/día máximo 3 días. Riesgo gastrointestinal alto." }
      ],
      contraindicaciones: "Úlceras GI. Disfunción renal. Deshidratación. Uso prolongado en perros. No combinar con corticoides ni otros AINEs.",
      comerciales: ["Finadyne", "Flunixin", "Banamine"]
    },
    {
      id: "dipirona",
      principio: "Dipirona (Metamizol)",
      grupo: "Analgésico Antipirético / AINE",
      grupoKey: "antiinflamatorio",
      concentracion: 500,
      unidad: "mg/mL",
      mecanismo: "Inhibe síntesis de prostaglandinas. Acción analgésica, antipirética y antiespasmódica. Buena tolerancia gástrica comparada con otros AINEs.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 25, via: "IV / IM / Oral",  retiroCarne: 0, retiroLeche: 0, nota: "25 mg/kg IV lenta, IM u oral cada 8–12 h." },
        { nombre: "Felino",  dosisMgKg: 25, via: "IM / SC",          retiroCarne: 0, retiroLeche: 0, nota: "25 mg/kg IM o SC cada 12 h. Usar con precaución." },
        { nombre: "Equino",  dosisMgKg: 22, via: "IV lenta / IM",    retiroCarne: 0, retiroLeche: 0, nota: "20–25 mg/kg IV lenta o IM. Para dolor cólico moderado." },
        { nombre: "Bovino",  dosisMgKg: 25, via: "IV / IM",          retiroCarne: 3, retiroLeche: 2, nota: "20–30 mg/kg IV lenta o IM cada 12 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Insuficiencia renal grave. Antecedentes de agranulocitosis. Precaución en gestación.",
      comerciales: ["Novalgin", "Dipirona 500 mg/mL", "Analgín"]
    },

    // =====================================================================
    // OPIOIDES / ANALGÉSICOS
    // =====================================================================
    {
      id: "tramadol",
      principio: "Tramadol",
      grupo: "Opioide Agonista Mixto / Analgésico",
      grupoKey: "analgesia",
      concentracion: 50,
      unidad: "mg/tableta",
      mecanismo: "Agonista opiáceo de acción central sobre receptores mu. Inhibe recaptación de serotonina y norepinefrina. Mecanismo dual que contribuye a propiedades analgésicas.",
      especies: [
        { nombre: "Canino (analgesia)",   dosisMgKg: 2.5, via: "Oral / SC / IM / IV",retiroCarne: 0, retiroLeche: 0, nota: "1–4 mg/kg oral cada 8–12 h. Para dolor crónico por cáncer: 1–4 mg/kg cada 6 h." },
        { nombre: "Felino (dolor crónico)",dosisMgKg: 4,  via: "Oral",               retiroCarne: 0, retiroLeche: 0, nota: "4 mg/kg oral 2 veces/día. Precaución: puede causar disforia en gatos." }
      ],
      contraindicaciones: "Hipersensibilidad. Desórdenes convulsionantes. Insuficiencia renal/hepática (ajustar dosis). Pacientes geriátricos (reducir dosis).",
      comerciales: ["Tramal", "Tramadol 50 mg", "Zydol"]
    },
    {
      id: "buprenorfina",
      principio: "Buprenorfina",
      grupo: "Opioide Agonista Parcial mu",
      grupoKey: "analgesia",
      concentracion: 0.3,
      unidad: "mg/mL",
      mecanismo: "Agonista parcial sobre receptor mu. 30 veces más potente que la morfina. Larga duración de acción. Difícilmente reversible con naloxona por alta afinidad al receptor.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.0125, via: "IM / IV / SC",   retiroCarne: 0, retiroLeche: 0, nota: "0.005–0.02 mg/kg cada 6–12 h IM, IV o SC." },
        { nombre: "Felino",  dosisMgKg: 0.02,   via: "IM / IV / Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.03 mg/kg IM, IV u oral. La vía oral transmucosa funciona muy bien en gatos." },
        { nombre: "Equino (neuroleptoanalgesia)",dosisMgKg: 0.004, via: "IV", retiroCarne: 0, retiroLeche: 0, nota: "0.004 mg/kg IV con acepromacina 0.02 mg/kg." },
        { nombre: "Conejo",  dosisMgKg: 0.035,  via: "SC / IM",        retiroCarne: 0, retiroLeche: 0, nota: "0.02–0.05 mg/kg cada 6–12 h SC o IM." }
      ],
      contraindicaciones: "Hipotiroidismo. Insuficiencia renal grave. Enfermedad de Addison. Traumatismo craneal. Pacientes geriátricos o muy debilitados.",
      comerciales: ["Vetergesic", "Buprenorfina 0.3 mg/mL", "Temgesic"]
    },
    {
      id: "morfina",
      principio: "Morfina",
      grupo: "Opioide Agonista Puro",
      grupoKey: "analgesia",
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Agonista puro de receptores mu, delta y kappa. Analgesia, sedación, depresión respiratoria, miosis y reducción del peristaltismo. El estándar de oro analgésico opioide.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.5, via: "IM / SC / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg IM o SC cada 4 h; 0.05–0.5 mg/kg IV lenta. Epidural: 0.1 mg/kg." },
        { nombre: "Felino",  dosisMgKg: 0.1, via: "IM / SC",            retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.2 mg/kg IM o SC cada 4–6 h. Puede causar disforia a dosis altas en gatos." },
        { nombre: "Equino",  dosisMgKg: 0.1, via: "IV lenta",           retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.1 mg/kg IV lenta con premedicación. Puede causar excitación si se da solo." }
      ],
      contraindicaciones: "Diarrea por toxinas. Traumatismo craneal. Insuficiencia respiratoria. Hipotiroidismo. Enfermedad de Addison.",
      comerciales: ["Morfina 10 mg/mL", "Morphine sulfate"]
    },
    {
      id: "butorfanol",
      principio: "Butorfanol",
      grupo: "Opioide Agonista-Antagonista Mixto",
      grupoKey: "analgesia",
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Opioide agonista/antagonista mixto de duración intermedia. Potente antitusivo. Efectivo para dolor visceral leve a moderado. Sedación y euforia menos marcadas que morfina. Efectos analgésicos 15 min – 3 h.",
      especies: [
        { nombre: "Canino (analgesia / antitusivo)", dosisMgKg: 0.3, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.1–0.5 mg/kg SC o IM cada 4–6 h. Antitusivo: 0.05–0.1 mg/kg oral cada 6–12 h." },
        { nombre: "Felino",                          dosisMgKg: 0.4, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.1–0.4 mg/kg cada 3–6 h. Como premedicación anestésica." },
        { nombre: "Equino",                          dosisMgKg: 0.1, via: "IV",            retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.1 mg/kg IV para analgesia. Combinado con detomidina o xilacina." },
        { nombre: "Conejo / Pequeños mamíferos",     dosisMgKg: 0.5, via: "SC / IM",       retiroCarne: 0, retiroLeche: 0, nota: "0.1–0.5 mg/kg SC o IM cada 4–6 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Precaución en enfermedad pulmonar grave. Evitar en traumatismo craneal.",
      comerciales: ["Torbugesic", "Butorphanol 10 mg/mL", "Stadol"]
    },

    // =====================================================================
    // ANTIBIÓTICOS
    // =====================================================================
    {
      id: "amoxicilina",
      principio: "Amoxicilina",
      grupo: "Aminopenicilina / Betalactámico",
      grupoKey: "antibiotico",
      concentracion: 150,
      unidad: "mg/mL",
      mecanismo: "Bactericida por inhibición de síntesis de pared celular. Amplio rango. Destruida por betalactamasas. Buena absorción oral. Se excreta bien en orina y bilis.",
      especies: [
        { nombre: "Canino (Gram +)",    dosisMgKg: 10, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "10 mg/kg cada 12 h hasta 2 días después de ceder signos clínicos." },
        { nombre: "Canino (Gram -)",    dosisMgKg: 20, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "20 mg/kg cada 8 h oral o IM/SC cada 12 h." },
        { nombre: "Felino",             dosisMgKg: 15, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "Gram +: 10 mg/kg c/12 h. Gram -: 20 mg/kg c/8 h oral." },
        { nombre: "Equino",             dosisMgKg: 25, via: "Oral",            retiroCarne: 4,  retiroLeche: 2, nota: "20–30 mg/kg cada 6 h oral para infecciones respiratorias." },
        { nombre: "Bovino",             dosisMgKg: 8,  via: "SC / IM",         retiroCarne: 14, retiroLeche: 2, nota: "6–10 mg/kg/día SC o IM. Infecciones respiratorias: 11 mg/kg cada 12 h." }
      ],
      contraindicaciones: "Hipersensibilidad a betalactámicos. No activa contra bacterias productoras de penicilinasas.",
      comerciales: ["Clamoxyl", "Amoxil", "Vetramox"]
    },
    {
      id: "amoxicilina-clavulanico",
      principio: "Amoxicilina / Ácido Clavulánico",
      grupo: "Aminopenicilina + Inhibidor Betalactamasa",
      grupoKey: "antibiotico",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Amoxicilina inhibe transpeptidasa de pared bacteriana. Ácido clavulánico bloquea beta-lactamasas por unión competitiva e irreversible, protegiendo a la amoxicilina.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 13.75, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "13.75 mg/kg oral cada 12 h. Piel/tejidos blandos: 12.5 mg/kg cada 12 h por 5–21 días." },
        { nombre: "Felino (Gram +)", dosisMgKg: 10, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "Gram +: 10 mg/kg 2 veces/día. Gram -: 20 mg/kg 3 veces/día." },
        { nombre: "Aves",    dosisMgKg: 75, via: "Oral", retiroCarne: 5, retiroLeche: 0, nota: "50–100 mg/kg cada 6–8 h." }
      ],
      contraindicaciones: "Hipersensibilidad a betalactámicos. No administrar por vía IM o SC.",
      comerciales: ["Synulox", "Clavaseptin", "Augmentin (adaptado)"]
    },
    {
      id: "oxitetraciclina-la",
      principio: "Oxitetraciclina LA",
      grupo: "Tetraciclina",
      grupoKey: "antibiotico",
      concentracion: 200,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático. Se une al ribosoma 30S inhibiendo unión del ARNt al ARNm. Amplio espectro: Gram +, Gram -, Rickettsia, Mycoplasma, Leptospira.",
      especies: [
        { nombre: "Bovino (LA)", dosisMgKg: 20, via: "IM profunda",  retiroCarne: 22, retiroLeche: 4,  nota: "Máximo 10 mL por sitio. Acción prolongada. Anaplasmosis, pododermatitis." },
        { nombre: "Porcino",     dosisMgKg: 20, via: "IM",           retiroCarne: 22, retiroLeche: 0,  nota: "Útil en neumonías y leptospirosis." },
        { nombre: "Canino",      dosisMgKg: 10, via: "IV lenta / IM",retiroCarne: 0,  retiroLeche: 0,  nota: "Dolorosa IM. En cachorros mancha dientes. Preferir Doxiciclina." },
        { nombre: "Felino",      dosisMgKg: 10, via: "IV lenta / IM",retiroCarne: 0,  retiroLeche: 0,  nota: "Usar con precaución. Riesgo de fiebre y vómitos." }
      ],
      contraindicaciones: "Falla renal, gestación (2da mitad), animales jóvenes. Alta resistencia en enterobacterias de producción.",
      comerciales: ["Terramicina LA", "Emicina", "Oxitop"]
    },
    {
      id: "enrofloxacina",
      principio: "Enrofloxacina",
      grupo: "Fluoroquinolona",
      grupoKey: "antibiotico",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibe ADN-girasa y topoisomerasa IV, bloqueando replicación del ADN bacteriano. Bactericida dependiente de concentración. Amplio espectro con énfasis en Gram negativos.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,   via: "Oral / SC / IV lenta", retiroCarne: 0,  retiroLeche: 0,  nota: "5 mg/kg oral o SC 1 vez/día. IV: diluir y administrar muy lentamente." },
        { nombre: "Felino",  dosisMgKg: 5,   via: "Oral / SC",            retiroCarne: 0,  retiroLeche: 0,  nota: "⚠️ 5 mg/kg MÁXIMO 1 vez/día. Dosis altas causan ceguera irreversible (degeneración retinal)." },
        { nombre: "Bovino",  dosisMgKg: 7.5, via: "SC",                   retiroCarne: 14, retiroLeche: 14, nota: "7.5 mg/kg SC 1 vez/día por 3–5 días para neumonía bovina." },
        { nombre: "Porcino", dosisMgKg: 2.5, via: "IM",                   retiroCarne: 5,  retiroLeche: 0,  nota: "2.5 mg/kg IM cada 24 h." },
        { nombre: "Equino",  dosisMgKg: 7.5, via: "IV lenta / Oral",      retiroCarne: 0,  retiroLeche: 0,  nota: "7.5 mg/kg IV muy lenta. Puede causar artropatía en potrillos en desarrollo." }
      ],
      contraindicaciones: "No usar en animales jóvenes en desarrollo (artropatía). En gatos NO superar 5 mg/kg/día. No combinar con AINEs de forma crónica.",
      comerciales: ["Baytril", "Enrox", "Floxabactin"]
    },
    {
      id: "doxiciclina",
      principio: "Doxiciclina",
      grupo: "Tetraciclina (2ª generación)",
      grupoKey: "antibiotico",
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático amplio espectro. Se une al ribosoma 30S. Mejor absorción oral y mayor liposolubilidad que oxitetraciclina. Activo frente a Ehrlichia, Rickettsia, Mycoplasma, Leptospira, Anaplasma.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,  via: "Oral / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "5–10 mg/kg oral cada 12 h. Ehrlichiosis: 5 mg/kg cada 12 h por 28 días mínimo." },
        { nombre: "Felino",  dosisMgKg: 5,  via: "Oral / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg oral cada 12 h. Para hemoplasmas: mínimo 14–21 días. Administrar con alimento." },
        { nombre: "Equino",  dosisMgKg: 10, via: "Oral",            retiroCarne: 0, retiroLeche: 0, nota: "10 mg/kg oral cada 12 h. Para Anaplasma y enfermedad de Lyme en equinos." }
      ],
      contraindicaciones: "Gestación (2da mitad), animales en desarrollo. En gatos administrar con alimento para evitar esofagitis. No usar con antiácidos.",
      comerciales: ["Ronaxan", "Vibravet", "Doxiciclina 20 mg/mL"]
    },
    {
      id: "gentamicina",
      principio: "Gentamicina",
      grupo: "Aminoglucósido",
      grupoKey: "antibiotico",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Se une irreversiblemente al ribosoma 30S. Dependiente de concentración. Activo contra bacilos Gram negativos aerobios y algunos cocos Gram positivos.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 6.6, via: "IV / IM / SC", retiroCarne: 0,  retiroLeche: 0, nota: "6.6 mg/kg IM o SC cada 24 h. Nefrotóxico y ototóxico. Monitorear función renal." },
        { nombre: "Felino",  dosisMgKg: 6,   via: "IV / IM / SC", retiroCarne: 0,  retiroLeche: 0, nota: "6 mg/kg SC o IM cada 24 h. Mayor riesgo de nefrotoxicidad. Asegurar hidratación." },
        { nombre: "Bovino",  dosisMgKg: 4,   via: "IM",           retiroCarne: 18, retiroLeche: 3, nota: "4 mg/kg IM 1 vez/día. Intrauterino: 500 mg diluidos. Riesgo nefrotóxico en deshidratados." },
        { nombre: "Equino",  dosisMgKg: 6.6, via: "IV / IM",      retiroCarne: 0,  retiroLeche: 0, nota: "6.6 mg/kg cada 24 h. Monitorear creatinina sérica y producción urinaria." }
      ],
      contraindicaciones: "Falla renal preexistente. No usar con furosemida simultáneamente (sinergismo nefrotóxico). No usar en animales deshidratados sin fluidoterapia.",
      comerciales: ["Gentocin", "Gentavet", "Gentamicina 50 mg/mL"]
    },
    {
      id: "ceftiofur",
      principio: "Ceftiofur",
      grupo: "Cefalosporina 3ª Generación",
      grupoKey: "antibiotico",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Inhibe síntesis de peptidoglicano de pared celular bacteriana. Resistente a betalactamasas de amplio espectro. Activo principalmente frente a Pasteurella, Mannheimia, E. coli.",
      especies: [
        { nombre: "Bovino",  dosisMgKg: 2.2, via: "IM / SC", retiroCarne: 4, retiroLeche: 0, nota: "⭐ Retiro en leche: 0 horas. Ideal para pododermatitis y neumonía sin descarte de leche." },
        { nombre: "Porcino", dosisMgKg: 3,   via: "IM",      retiroCarne: 4, retiroLeche: 0, nota: "Enfermedad respiratoria por Actinobacillus y Pasteurella." },
        { nombre: "Canino",  dosisMgKg: 2.2, via: "SC",      retiroCarne: 0, retiroLeche: 0, nota: "Uso off-label en infecciones urinarias resistentes." },
        { nombre: "Felino",  dosisMgKg: 4.4, via: "SC",      retiroCarne: 0, retiroLeche: 0, nota: "Infecciones de tejidos blandos. Uso off-label." }
      ],
      contraindicaciones: "Alergia a betalactámicos. No extrapolar interpretación de antibiograma a otras cefalosporinas.",
      comerciales: ["Excenel", "Cobactan", "Cefty", "Ceftiofur HCl"]
    },
    {
      id: "metronidazol",
      principio: "Metronidazol",
      grupo: "Nitroimidazol / Antibiótico-Antiprotozoario",
      grupoKey: "antibiotico",
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Se activa en células anaerobias formando radicales libres que dañan el ADN. Activo frente a bacterias anaerobias, Giardia, Trichomonas y Entamoeba.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 15, via: "Oral / IV", retiroCarne: 0, retiroLeche: 0, nota: "10–25 mg/kg oral cada 12 h. Giardia: 25 mg/kg cada 12 h por 5–7 días." },
        { nombre: "Felino",  dosisMgKg: 10, via: "Oral",      retiroCarne: 0, retiroLeche: 0, nota: "10–25 mg/kg oral cada 12–24 h por 5–7 días. Puede causar signos neurológicos a dosis altas." },
        { nombre: "Equino",  dosisMgKg: 15, via: "Oral / IV", retiroCarne: 5, retiroLeche: 3, nota: "15–25 mg/kg oral cada 8–12 h. IV: 10–15 mg/kg cada 8 h en colitis por Clostridium." }
      ],
      contraindicaciones: "Primeros 3 meses de gestación. Hepatopatías graves. Neurológicos previos a dosis altas. Evitar alcohol.",
      comerciales: ["Flagyl", "Metronidazol 250 mg", "Tricozole"]
    },
    {
      id: "clindamicina",
      principio: "Clindamicina",
      grupo: "Lincosamida / Antibiótico",
      grupoKey: "antibiotico",
      concentracion: 25,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático (bactericida a altas concentraciones). Inhibe síntesis proteica bacteriana uniéndose a ribosoma 50S. Excelente penetración en tejidos, incluido hueso. Activo frente a Gram positivos y anaerobios.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 11, via: "Oral / IM",   retiroCarne: 0, retiroLeche: 0, nota: "5.5–11 mg/kg oral cada 12 h. Toxoplasmosis: 12.5 mg/kg cada 12 h por 30 días." },
        { nombre: "Felino",  dosisMgKg: 11, via: "Oral / IM",   retiroCarne: 0, retiroLeche: 0, nota: "11–33 mg/kg oral cada 12–24 h. Para toxoplasmosis, enf. periodontal, piodermia." }
      ],
      contraindicaciones: "Colitis ulcerativa. Hipersensibilidad. No usar en équidos y lagomorfos (destruye flora intestinal causando enterocolitis fatal).",
      comerciales: ["Antirobe", "Clindamicina 25 mg/mL", "Cleocin"]
    },
    {
      id: "sulfametoxazol-trimetoprim",
      principio: "Sulfametoxazol + Trimetoprim",
      grupo: "Sulfonamida + Diaminopiridina",
      grupoKey: "antibiotico",
      concentracion: 48,
      unidad: "mg/mL",
      mecanismo: "Acción sinérgica doble: trimetoprim inhibe dihidrofolato reductasa; sulfametoxazol inhibe dihidropteroato sintasa. Bloquea síntesis de folatos en bacteria en dos pasos consecutivos.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 15, via: "Oral / IV",  retiroCarne: 0,  retiroLeche: 0, nota: "15–30 mg/kg oral cada 12 h. Para infecciones urinarias, respiratorias y cutáneas." },
        { nombre: "Felino",  dosisMgKg: 15, via: "Oral",       retiroCarne: 0,  retiroLeche: 0, nota: "15 mg/kg oral cada 12 h. Para Pneumocystis, toxoplasmosis." },
        { nombre: "Bovino",  dosisMgKg: 16, via: "IV / IM",    retiroCarne: 10, retiroLeche: 4, nota: "16 mg/kg cada 12–24 h. Excelente para terneros con septicemia y enfermedad respiratoria." },
        { nombre: "Equino",  dosisMgKg: 24, via: "IV / Oral",  retiroCarne: 0,  retiroLeche: 0, nota: "24 mg/kg oral o IV cada 12 h. Para potrillos: 15–30 mg/kg cada 12 h." }
      ],
      contraindicaciones: "Falla renal o hepática grave. Deshidratación (riesgo de cristaluria). Gestación avanzada. Anemia aplástica (sensibilidad idiosincrática en perros Doberman).",
      comerciales: ["Tribrissen", "Borgal", "Trimetosul", "TMS"]
    },

    // =====================================================================
    // ANTIPARASITARIOS
    // =====================================================================
    {
      id: "ivermectina-1",
      principio: "Ivermectina 1%",
      grupo: "Lactona Macrocíclica / Antiparasitario",
      grupoKey: "antiparasitario",
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Parálisis del parásito por apertura de canales de Cl- glutamato-dependientes en células nerviosas y musculares del parásito. Activa contra nemátodos y ectoparásitos.",
      especies: [
        { nombre: "Bovino",                        dosisMgKg: 0.2,   via: "Subcutánea",   retiroCarne: 35, retiroLeche: 28, nota: "Control de nematodos internos y externos (sarna, piojos, tábanos)." },
        { nombre: "Porcino",                       dosisMgKg: 0.3,   via: "Subcutánea",   retiroCarne: 28, retiroLeche: 0,  nota: "Específico para sarna sarcóptica." },
        { nombre: "Equino",                        dosisMgKg: 0.2,   via: "Oral (pasta)", retiroCarne: 0,  retiroLeche: 0,  nota: "200 µg/kg oral en pasta. Para Strongylus, bots, pinworms." },
        { nombre: "Canino (sarna demodécica)",     dosisMgKg: 0.4,   via: "SC / Oral",    retiroCarne: 0,  retiroLeche: 0,  nota: "⚠️ PELIGRO MORTAL en Collies/Pastores/Border Collies (MDR1/ABCB1). Confirmar seguridad genética." },
        { nombre: "Canino (prev. Dirofilaria)",    dosisMgKg: 0.006, via: "Oral",         retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis micro mensual (6 µg/kg). Segura para todas las razas a esta dosis." }
      ],
      contraindicaciones: "Razas con mutación MDR1/ABCB1 a dosis antiparasitarias. Cachorros < 6 semanas. No usar en ovejas lactantes que suministran leche para consumo.",
      comerciales: ["Ivomec", "Bovimec", "Iverfull", "Heartgard (perros)"]
    },
    {
      id: "prazicuantel",
      principio: "Prazicuantel",
      grupo: "Anticestodo / Antitrematodo",
      grupoKey: "antiparasitario",
      concentracion: 50,
      unidad: "mg/tableta",
      mecanismo: "Aumenta permeabilidad de la membrana de céstodos al Ca²⁺, causando parálisis espástica y daño del tegumento. Posterior destrucción por defensas del huésped.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,   via: "Oral / SC / IM", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg oral, SC o IM como dosis única para cestodos. Echinococcus: repetir a las 3 semanas." },
        { nombre: "Felino",  dosisMgKg: 5,   via: "Oral / SC",      retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg como dosis única oral o SC." },
        { nombre: "Equino",  dosisMgKg: 1.5, via: "Oral (pasta)",   retiroCarne: 0, retiroLeche: 0, nota: "1.5 mg/kg oral en pasta para Anoplocephala (combinado con pirantel)." }
      ],
      contraindicaciones: "Hipersensibilidad. Cachoros < 4 semanas. Gestación (precaución).",
      comerciales: ["Droncit", "Popantel", "Cestel"]
    },
    {
      id: "fenbendazol",
      principio: "Fenbendazol",
      grupo: "Bencimidazol / Antihelmíntico",
      grupoKey: "antiparasitario",
      concentracion: 100,
      unidad: "mg/mL",
      mecanismo: "Inhibe polimerización de tubulina parasitaria. Impide formación de microtúbulos, afectando captación de glucosa y reproducción. Activo contra nemátodos adultos, larvas y Giardia.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 50, via: "Oral", retiroCarne: 0,  retiroLeche: 0, nota: "50 mg/kg oral 1 vez/día por 3 días. Giardia: 50 mg/kg cada 24 h por 5 días." },
        { nombre: "Felino",  dosisMgKg: 50, via: "Oral", retiroCarne: 0,  retiroLeche: 0, nota: "50 mg/kg oral 1 vez/día por 5 días." },
        { nombre: "Bovino",  dosisMgKg: 7.5,via: "Oral", retiroCarne: 14, retiroLeche: 5, nota: "7.5 mg/kg oral. Excelente para Ostertagia y nemátodos gastrointestinales." },
        { nombre: "Equino",  dosisMgKg: 5,  via: "Oral (pasta)", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg oral en pasta. Migración larvaria: 10 mg/kg/día por 5 días." }
      ],
      contraindicaciones: "No activo contra céstodos ni trematodos. Primer tercio de gestación (precaución).",
      comerciales: ["Panacur", "Safe-Guard", "Fenbendazol 10%"]
    },
    {
      id: "closantel",
      principio: "Closantel",
      grupo: "Antiparasitario / Fasciolicida",
      grupoKey: "antiparasitario",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Desacopla la fosforilación oxidativa en el metabolismo del parásito. Activo principalmente frente a formas adultas de Fasciola hepatica, Haemonchus contortus y nemátodos hematófagos.",
      especies: [
        { nombre: "Bovino",         dosisMgKg: 10, via: "Oral / SC",  retiroCarne: 42, retiroLeche: 28, nota: "10 mg/kg oral o SC. Para fasciolosis y haemonchosis. Retiro leche: 28 días." },
        { nombre: "Ovino / Caprino",dosisMgKg: 10, via: "Oral / SC",  retiroCarne: 42, retiroLeche: 28, nota: "10 mg/kg oral o SC para Fasciola y Haemonchus." }
      ],
      contraindicaciones: "No usar en animales debilitados. No está activo frente a formas juveniles de Fasciola (<6 semanas). Respetar tiempos de retiro estrictamente.",
      comerciales: ["Flukiver", "Closantel 5%", "Clonalb"]
    }
  ]
};