// =============================================================================
// SUITE VET 2.0 — modules/farma/data.js
// VADEMÉCUM COMPLETO — 55 fármacos
// Fuentes:
//   • Flashcards Farmacología en Medicina Veterinaria - FORMAVET 2024
//   • Farmacología para Médicos Veterinarios - Jazven 2013
// =============================================================================
// ✅ CÓMO AGREGAR UN FÁRMACO NUEVO:
//   1. Copia cualquier bloque { id: "...", principio: "..." }
//   2. Modifica todos los campos (especialmente id — debe ser único)
//   3. Asigna la categoría correcta (ver lista abajo)
//   4. Guarda → Live Server lo recarga automáticamente
//
// 🎨 CATEGORÍAS DISPONIBLES:
//   anestesico | sedante | analgesico
//   bactericida | bacteriostatico | antifungico | antiseptico
//   antiparasitario-interno | antiparasitario-externo
//   aine | corticoide
//   cardiovascular | broncodilatador
//   antihistaminico | inmunomodulador | vacuna
//   gastrointestinal | hormona | vitamina | fluidoterapia
//
// 🔥 RIESGO: 1=seguro  2=moderado  3=atención  4=alto  5=crítico
// =============================================================================

window.FARMA_DATA = {
  farmacos: [

    // =========================================================================
    // ═══ ANESTÉSICOS ═══
    // =========================================================================
    {
      id: "acepromacina",
      principio: "Acepromacina",
      grupo: "Fenotiazínico / Tranquilizante",
      categoria: "sedante",
      riesgo: 3,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Tranquilizante fenotiazídico. Propiedades antiemeticas, antiespasmódicas e hipotérmicas. Vasodilatación arterial moderada. Depresión leve del SNC.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.05,  via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.1 mg/kg. Razas gigantes más sensibles." },
        { nombre: "Felino",  dosisMgKg: 0.1,   via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.2 mg/kg. Precaución en geriátricos." },
        { nombre: "Bovino",  dosisMgKg: 0.05,  via: "IV / IM",      retiroCarne: 3, retiroLeche: 1, nota: "0.01–0.02 mg/kg IV o 0.03–0.1 mg/kg IM." },
        { nombre: "Equino",  dosisMgKg: 0.03,  via: "IV / IM",      retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.05 mg/kg. Puede causar protrusión del pene." },
        { nombre: "Porcino", dosisMgKg: 0.15,  via: "IM / SC / IV", retiroCarne: 3, retiroLeche: 0, nota: "0.1–0.2 mg/kg." }
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
      mecanismo: "Anestésico disociativo. Inhibe receptores NMDA; bloquea serotonina, norepinefrina y dopamina en SNC. Actividad analgésica significativa. Puede ser útil como adyuvante en manejo del dolor.",
      especies: [
        { nombre: "Canino (con Xilacina)",   dosisMgKg: 11,  via: "IM",           retiroCarne: 0, retiroLeche: 0, nota: "Xilacina 2.2 mg/kg IM 10 min antes. En >22 kg reducir 25%." },
        { nombre: "Canino (analgesia)",       dosisMgKg: 0.5, via: "IM / SC / Oral",retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg cada 4–6 h para dolor leve-moderado junto con opioides." },
        { nombre: "Felino (sujeción)",        dosisMgKg: 11,  via: "IM",           retiroCarne: 0, retiroLeche: 0, nota: "11 mg/kg IM sujeción; 22–33 mg/kg para procedimientos menores." },
        { nombre: "Felino (analgesia)",       dosisMgKg: 0.5, via: "IM / SC / Oral",retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg cada 4–6 h junto con opioides." },
        { nombre: "Equino (inducción campo)", dosisMgKg: 2.2, via: "IV",           retiroCarne: 0, retiroLeche: 0, nota: "Sedar con Xilacina 1 mg/kg IV 5–10 min antes. Solo anestesia de campo." }
      ],
      contraindicaciones: "Hemorragia significativa. Hipertermia. Aumento de PIO. Procedimientos en faringe/tráquea.",
      comerciales: ["Ketalar", "Vetalar", "Imalgène 1000"]
    },
    {
      id: "propofol",
      principio: "Propofol",
      grupo: "Anestésico General / Hipnótico",
      categoria: "anestesico",
      riesgo: 4,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Hipnótico de acción corta no relacionado con otros anestésicos. Potencia inhibición GABAérgica. Distribución rápida desde SNC. Metabolismo hepático por glucuronización.",
      especies: [
        { nombre: "Canino / Felino (inducción)", dosisMgKg: 6,  via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Dar 25% de dosis cada 30 seg hasta efecto. Sedación: 0.1 mg/kg/min en infusión." },
        { nombre: "Conejo",                      dosisMgKg: 10, via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "5–14 mg/kg IV lenta. Alto riesgo de apnea — tener ventilación lista." }
      ],
      contraindicaciones: "Hipersensibilidad. Cautela en hipoproteinemia, hiperlipidemia, convulsiones y antecedentes de anafilaxis.",
      comerciales: ["Propofol 1%", "Rapinovet", "PropoFlo"]
    },
    {
      id: "tiletamina-zolazepam",
      principio: "Tiletamina + Zolazepam",
      grupo: "Anestésico Disociativo + Benzodiazepina",
      categoria: "anestesico",
      riesgo: 4,
      concentracion: 100,
      unidad: "mg/mL",
      mecanismo: "Tiletamina (ciclohexilamina disociativa) + Zolazepam (benzodiazepina). Anestesia ~30 min. Mantiene reflejos tusígeno, deglutorio, corneal y podal.",
      especies: [
        { nombre: "Canino (diagnóstico)",    dosisMgKg: 8.25,  via: "IM", retiroCarne: 0, retiroLeche: 0, nota: "6.6–9.9 mg/kg IM. Dosis total máxima: 26.4 mg/kg." },
        { nombre: "Canino (procedimientos)", dosisMgKg: 11.55, via: "IM", retiroCarne: 0, retiroLeche: 0, nota: "9.9–13.2 mg/kg IM." },
        { nombre: "Felino (procedimientos)", dosisMgKg: 11.3,  via: "IM", retiroCarne: 0, retiroLeche: 0, nota: "9.7–15.8 mg/kg IM. OSH/orquiectomía: 14.3–15.8 mg/kg. Máximo 72 mg/kg." }
      ],
      contraindicaciones: "Enfermedad pancreática. Conejos. Cardiopatía grave. Cesárea o enfermedad pulmonar.",
      comerciales: ["Zoletil", "Telazol"]
    },
    {
      id: "dexmedetomidina",
      principio: "Dexmedetomidina",
      grupo: "Agonista Alfa-2 Adrenérgico",
      categoria: "sedante",
      riesgo: 3,
      concentracion: 0.1,
      unidad: "mg/mL",
      mecanismo: "Enantiómero dextrógiro de la medetomidina. Agonista alfa-2 adrenérgico altamente selectivo. El doble de potencia que medetomidina. Sedación, analgesia y relajación muscular.",
      especies: [
        { nombre: "Canino (sedación/analgesia)", dosisMgKg: 0.02,  via: "IV / IM", retiroCarne: 0, retiroLeche: 0, nota: "375 µg/m² IV o 500 µg/m² IM (≈0.015–0.025 mg/kg). La dosis/kg disminuye con mayor peso. Como preanestésico: 125–375 µg/m² IM." },
        { nombre: "Felino (sedación/analgesia)", dosisMgKg: 0.04,  via: "IM",       retiroCarne: 0, retiroLeche: 0, nota: "40 µg/kg IM. Efecto en 15 min; dura hasta 60 min." }
      ],
      contraindicaciones: "Enfermedades cardíacas, hepáticas o renales. Shock grave. Animales muy debilitados. Antídoto: Yohimbina o Atipamezol 0.1–0.2 mg/kg IV.",
      comerciales: ["Dexdomitor", "Sileo", "Dexmedetomidina 0.1 mg/mL"]
    },
    {
      id: "xilacina-2",
      principio: "Xilacina 2%",
      grupo: "Agonista Alfa-2 Adrenérgico",
      categoria: "sedante",
      riesgo: 3,
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Potente agonista alfa-2 adrenérgico. Sedante, analgésico y relajante muscular. No causa excitación del SNC en felinos, equinos y rumiantes. Acción emética en felinos y caninos.",
      especies: [
        { nombre: "Canino",          dosisMgKg: 1.1,  via: "IM / IV / SC", retiroCarne: 0, retiroLeche: 0, nota: "1.1–2.2 mg/kg. Como emético: 0.6 mg/kg IV IM. Antídoto: Yohimbina 0.1–0.2 mg/kg IV." },
        { nombre: "Felino",          dosisMgKg: 1.1,  via: "IM / SC",      retiroCarne: 0, retiroLeche: 0, nota: "Premedicar con atropina. Como emético: 0.44 mg/kg IM." },
        { nombre: "Equino",          dosisMgKg: 1.1,  via: "IV",           retiroCarne: 0, retiroLeche: 0, nota: "1.1 mg/kg IV. Cólico: 0.2–0.5 mg/kg IV (analgesia 20–30 min)." },
        { nombre: "Bovino",          dosisMgKg: 0.1,  via: "IV / IM",      retiroCarne: 3, retiroLeche: 2, nota: "⚠️ EXTREMA SENSIBILIDAD. 0.05–0.15 mg/kg IV. 1/10 de la dosis equina." },
        { nombre: "Ovino / Caprino", dosisMgKg: 0.08, via: "IV / IM",      retiroCarne: 2, retiroLeche: 1, nota: "0.05–0.1 mg/kg IV; 0.1–0.22 mg/kg IM." }
      ],
      contraindicaciones: "Cardiópatas, obstrucción respiratoria, gestación avanzada. Antídoto: Yohimbina o Atipamezol 0.1–0.2 mg/kg IV.",
      comerciales: ["Rompun", "Procin", "Sedalvet", "Xilazol"]
    },
    {
      id: "lorazepam",
      principio: "Lorazepam",
      grupo: "Benzodiazepina",
      categoria: "sedante",
      riesgo: 3,
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Antagonismo de serotonina, aumento de actividad GABAérgica y disminución de liberación de acetilcolina en SNC. Anticonvulsivante, ansiolítico y relajante muscular.",
      especies: [
        { nombre: "Canino (estatus epiléptico)", dosisMgKg: 0.2,   via: "IV / IM / Intranasal", retiroCarne: 0, retiroLeche: 0, nota: "0.2 mg/kg IV, IM o intranasal 1 vez. Ansiolítico: 0.02–0.1 mg/kg oral cada 12–24 h." },
        { nombre: "Felino (ansiedad)",           dosisMgKg: 0.1,   via: "Oral",                 retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.25 mg/kg oral cada 12–24 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Insuficiencia respiratoria (sin ventilación mecánica). Antídoto: Flumazenil 0.02 mg/kg IV.",
      comerciales: ["Lorazepam", "Ativan"]
    },
    {
      id: "pentobarbital",
      principio: "Pentobarbital Sódico",
      grupo: "Barbitúrico / Eutanasia",
      categoria: "sedante",
      riesgo: 5,
      concentracion: 390,
      unidad: "mg/mL",
      mecanismo: "Derivado del ácido barbitúrico. Causa muerte por grave depresión de centros respiratorio y vasomotor bulbar a dosis altas. Sustancia controlada Clase III.",
      especies: [
        { nombre: "Canino / Felino (eutanasia)", dosisMgKg: 120, via: "IV",  retiroCarne: 0, retiroLeche: 0, nota: "120 mg/kg para los primeros 4.5 kg; 60 mg/kg por cada 4.5 kg siguientes. IV preferentemente. ⚠️ Solo con premedicación (acepromacina, xilacina)." },
        { nombre: "Grandes animales (eutanasia)", dosisMgKg: 18, via: "IV",  retiroCarne: 0, retiroLeche: 0, nota: "10–15 mL/45 kg según concentración. No usar en animales destinados a consumo." }
      ],
      contraindicaciones: "No usar en animales destinados a consumo humano o animal. Solo para eutanasia o anestesia general controlada.",
      comerciales: ["Eutasol", "Euthal", "Pentobarbital sódico"]
    },
    {
      id: "lidocaina",
      principio: "Lidocaína",
      grupo: "Anestésico Local / Antiarrítmico",
      categoria: "anestesico",
      riesgo: 3,
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Bloquea canales de Na⁺, impidiendo propagación del impulso nervioso. Efectos anestésico local, antiarrítmico, analgésico y anticonvulsivo.",
      especies: [
        { nombre: "Canino (arritmias ventriculares)", dosisMgKg: 2,    via: "IV lenta",    retiroCarne: 0, retiroLeche: 0, nota: "2–4 mg/kg IV lento (máx 8 mg/kg en 10 min); infusión: 25–75 µg/kg/min." },
        { nombre: "Felino (arritmias)",              dosisMgKg: 0.5,  via: "IV muy lenta", retiroCarne: 0, retiroLeche: 0, nota: "0.25–0.75 mg/kg IV muy lenta. Riesgo de nefrotoxicidad y convulsiones. Extrema precaución." },
        { nombre: "Bovino / Equino (anestesia local)", dosisMgKg: 2,  via: "Local",        retiroCarne: 0, retiroLeche: 0, nota: "Bloqueo epidural bajo: 5–10 mL. Infiltración: 1 mL/cm. Usar solución al 1–2% con epinefrina 1:200,000." }
      ],
      contraindicaciones: "Bloqueo AV de 2° o 3° grado. Hipersensibilidad. Daño hepático grave (metabolismo reducido). NO usar con epinefrina en dedos, oídos, nariz y pene.",
      comerciales: ["Lidocaína 2%", "Xilocaína", "Lignocaína", "Duncaína"]
    },

    // =========================================================================
    // ═══ ANTICONVULSIVANTES / ANALGÉSICOS CENTRALES ═══
    // =========================================================================
    {
      id: "fenobarbital",
      principio: "Fenobarbital",
      grupo: "Barbitúrico / Anticonvulsivante",
      categoria: "sedante",
      riesgo: 3,
      concentracion: 100,
      unidad: "mg/tableta",
      mecanismo: "Barbitúrico que deprime corteza sensitiva, reduce actividad motora. Potencia inhibición GABA e inhibe liberación de acetilcolina, norepinefrina y glutamato. Eleva umbral convulsivo.",
      especies: [
        { nombre: "Canino (mantenimiento epilepsia)", dosisMgKg: 3.5, via: "Oral / IV",  retiroCarne: 0, retiroLeche: 0, nota: "Inicio: 2.5 mg/kg oral c/12 h. Dosis de ataque: 16–20 mg/kg IV 1 vez. Mantenimiento: 2–5 mg/kg oral c/12 h." },
        { nombre: "Felino (epilepsia)",               dosisMgKg: 2,   via: "Oral / IV",  retiroCarne: 0, retiroLeche: 0, nota: "Inicio: 2 mg/kg c/12 h. Dosis ataque: 16–20 mg/kg IV 1 vez. Mantenimiento: 1–5 mg/kg c/12 h." },
        { nombre: "Equino (dosis de ataque)",         dosisMgKg: 12,  via: "IV lenta",   retiroCarne: 0, retiroLeche: 0, nota: "12 mg/kg IV en 20 min; luego 6.65 mg/kg IV en 20 min c/12 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Enfermedad hepática grave. Nefritis. Depresión respiratoria grave. Monitorear enzimas hepáticas periódicamente.",
      comerciales: ["Fenobarbital 100 mg", "Luminal", "Gardenal"]
    },
    {
      id: "gabapentina",
      principio: "Gabapentina",
      grupo: "Anticonvulsivante / Analgésico",
      categoria: "analgesico",
      riesgo: 2,
      concentracion: 100,
      unidad: "mg/cápsula",
      mecanismo: "Efectos analgésicos (previene alodinia e hiperalgesia) y anticonvulsionantes. Mecanismo exacto no completamente elucidado; se une a subunidades de canales de Ca²⁺ voltaje-dependientes.",
      especies: [
        { nombre: "Canino (convulsiones)",   dosisMgKg: 15,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "10–30 mg/kg oral c/12 h. Analgésico: 3 mg/kg oral 1 vez/día." },
        { nombre: "Felino (convulsiones)",   dosisMgKg: 5,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg oral 3 veces/día. Dolor neuropático: 2.5–5 mg/kg oral c/12 h." },
        { nombre: "Felino (analgesia)",      dosisMgKg: 2.5, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "1.25–10 mg/kg oral c/24 h. Dolor neuropático: 2.5–5 mg/kg c/12 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Insuficiencia renal (ajustar dosis). Evitar líquido oral con xilitol en perros.",
      comerciales: ["Gabapentina 100 mg", "Neurontin", "Gabapentin"]
    },

    // =========================================================================
    // ═══ CARDIOVASCULAR ═══
    // =========================================================================
    {
      id: "adrenalina",
      principio: "Adrenalina (Epinefrina)",
      grupo: "Catecolamina / Agonista Adrenérgico",
      categoria: "cardiovascular",
      riesgo: 5,
      concentracion: 1,
      unidad: "mg/mL",
      mecanismo: "Agonista alfa y beta-adrenérgico. Estimula corazón (↑ FC y contractilidad), ↑ presión sistólica, relaja músculo liso bronquial, antagoniza histamina.",
      especies: [
        { nombre: "Canino (anafilaxis / PCR)", dosisMgKg: 0.01, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Anafilaxis: 0.01–0.02 mg/kg. PCR (dosis alta): 0.1–0.2 mg/kg IV." },
        { nombre: "Felino (anafilaxis / PCR)", dosisMgKg: 0.01, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Anafilaxis: 0.01–0.02 mg/kg. PCR: 0.05–0.5 mg total IV." },
        { nombre: "Bovino / Porcino",          dosisMgKg: 0.02, via: "SC / IM",      retiroCarne: 1, retiroLeche: 1, nota: "0.5–1 mL/45 kg sol 1:1000 SC o IM." }
      ],
      contraindicaciones: "Glaucoma ángulo estrecho. Hipertensión grave. Insuficiencia coronaria. Durante el parto.",
      comerciales: ["Adrenalina 1:1000", "Epinefrina", "Adrenalin"]
    },
    {
      id: "atropina",
      principio: "Atropina",
      grupo: "Anticolinérgico / Parasimpaticolítico",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 0.5,
      unidad: "mg/mL",
      mecanismo: "Inhibe competitivamente acetilcolina en receptores muscarínicos posganglionares. Aumenta FC, reduce secreciones, dilata bronquios. Antídoto de organofosforados.",
      especies: [
        { nombre: "Canino (bradicardia / premedicación)", dosisMgKg: 0.033, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.022–0.044 mg/kg. Toxicidad OP: 0.2–2 mg/kg (¼ IV, resto SC/IM)." },
        { nombre: "Felino",                              dosisMgKg: 0.033, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.022–0.044 mg/kg. Premedicación para xilacina." },
        { nombre: "Bovino (intox. OP)",                  dosisMgKg: 0.5,   via: "IV / SC / IM", retiroCarne: 3, retiroLeche: 2, nota: "¼ IV lenta, resto SC/IM. Valorar respuesta pupilar." }
      ],
      contraindicaciones: "Glaucoma ángulo estrecho. Insuficiencia cardíaca descompensada. Íleo paralítico.",
      comerciales: ["Atropina sulfato 0.5 mg/mL", "Atropen"]
    },
    {
      id: "furosemida",
      principio: "Furosemida",
      grupo: "Diurético del Asa",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibe reabsorción de Na⁺ y Cl⁻ en asa ascendente de Henle. Potente diurético. En equinos tiene efecto broncodilatador adicional.",
      especies: [
        { nombre: "Canino",          dosisMgKg: 2.5, via: "Oral / IV / IM", retiroCarne: 0, retiroLeche: 0, nota: "Edema grave: 7.7 mg/kg IV o IM cada 1–2 h." },
        { nombre: "Felino",          dosisMgKg: 2.5, via: "Oral / IV / IM", retiroCarne: 0, retiroLeche: 0, nota: "Edema grave: 4.4 mg/kg IV o IM cada 1–2 h." },
        { nombre: "Bovino (edema ubre)", dosisMgKg: 1, via: "IM",           retiroCarne: 2, retiroLeche: 2, nota: "500 mg 1 vez/día o 250 mg 2 veces/día." },
        { nombre: "Equino",          dosisMgKg: 1.5, via: "IV / IM",        retiroCarne: 0, retiroLeche: 0, nota: "Para epistaxis: 250 mg IV 4 h antes de carrera." }
      ],
      contraindicaciones: "Anuria. Electrólitos muy disminuidos. Disfunción hepática. Diabetes mellitus.",
      comerciales: ["Lasix", "Dimazon", "Furosix"]
    },
    {
      id: "enalapril",
      principio: "Enalapril",
      grupo: "IECA (Inhibidor ECA)",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 5,
      unidad: "mg/tableta",
      mecanismo: "Inhibe la ECA. Se convierte en enalaprilato (activo) en hígado. Bloquea formación de angiotensina II vasoconstricitora. Reduce resistencia periférica y presión arterial.",
      especies: [
        { nombre: "Canino (IC)", dosisMgKg: 0.5,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.5 mg/kg oral 1–2 veces/día como vasodilatador en IC." },
        { nombre: "Felino (IC)", dosisMgKg: 0.375, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.25–0.5 mg/kg oral 1 vez/día (~1.25–2.5 mg/gato)." }
      ],
      contraindicaciones: "Hipersensibilidad a IECAs. Hiponatremia. Insuficiencia coronaria o cerebrovascular.",
      comerciales: ["Enacard", "Vasotec", "Renitec"]
    },
    {
      id: "pimobendan",
      principio: "Pimobendan",
      grupo: "Inodilatador Cardíaco",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 1.25,
      unidad: "mg/tableta",
      mecanismo: "Inodilatador: efecto inotrópico positivo (inhibe fosfodiesterasa III y aumenta sensibilidad al Ca²⁺) + efecto vasodilatador. Disminuye frecuencia cardíaca en ICC.",
      especies: [
        { nombre: "Canino (ICC cardiomiopatía)", dosisMgKg: 0.3, via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "0.2–0.6 mg/kg oral 2 veces/día ANTES de la comida. Total: 0.4–0.6 mg/kg/día dividido en 2 tomas." }
      ],
      contraindicaciones: "Hipersensibilidad. Cardiomiopatía hipertrófica. Estenosis aórtica.",
      comerciales: ["Vetmedin", "Pimobendan 1.25 mg", "Cardisure"]
    },
    {
      id: "ramipril",
      principio: "Ramipril",
      grupo: "IECA (Inhibidor ECA)",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 2.5,
      unidad: "mg/tableta",
      mecanismo: "IECA. Se convierte en ramiprilato (activo) en hígado. Reduce resistencia periférica total, resistencia vascular pulmonar y presiones de llenado ventricular.",
      especies: [
        { nombre: "Canino (IC / Enf. valvular)", dosisMgKg: 0.125, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.125 mg/kg oral 1 vez/día. Según gravedad de congestión pulmonar: hasta 0.250 mg/kg/día." },
        { nombre: "Felino (hipertensión)",        dosisMgKg: 0.125, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.125 mg/kg oral 1 vez/día." }
      ],
      contraindicaciones: "Hipersensibilidad a IECAs. Hipotensión severa. Insuficiencia renal aguda.",
      comerciales: ["Vasotop", "Altace", "Tritace"]
    },
    {
      id: "digoxina",
      principio: "Digoxina",
      grupo: "Glucósido Cardíaco",
      categoria: "cardiovascular",
      riesgo: 4,
      concentracion: 0.05,
      unidad: "mg/mL",
      mecanismo: "Glucósido digitálico. Inotropismo positivo (aumenta Ca²⁺ intracelular). Reduce FC (cronotropismo negativo). Reduce presiones venosas y pulmonar.",
      especies: [
        { nombre: "Canino (IC / Fibrilación atrial)", dosisMgKg: 0.0075, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.005–0.010 mg/kg oral cada 12 h (máx 0.375 mg/día). Margen terapéutico muy estrecho." },
        { nombre: "Felino",                           dosisMgKg: 0.007,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.007 mg/kg oral día por medio. Vigilar signos de toxicidad." }
      ],
      contraindicaciones: "Fibrilación ventricular. Miocarditis aguda. Taquicardia ventricular. Hipoxia. Hipocalemia (aumenta toxicidad).",
      comerciales: ["Digoxina 0.25 mg", "Lanoxin"]
    },
    {
      id: "dopamina",
      principio: "Dopamina",
      grupo: "Simpaticomimético / Vasopresor",
      categoria: "cardiovascular",
      riesgo: 4,
      concentracion: 40,
      unidad: "mg/mL",
      mecanismo: "Precursor de norepinefrina. Dosis baja (0.5–3 µg/kg/min): dilata vasos renales y mesentéricos. Dosis alta (>5 µg/kg/min): vasoconstricción e inotrópico positivo.",
      especies: [
        { nombre: "Canino / Felino (UCI)", dosisMgKg: 0.005, via: "IV (infusión)", retiroCarne: 0, retiroLeche: 0, nota: "Dosis renal: 0.5–3 µg/kg/min. IC aguda/shock: 5–10 µg/kg/min. SOLO en UCI con monitoreo." }
      ],
      contraindicaciones: "Taquiarritmias. Fibrilación ventricular. Solo usar en UCI con monitoreo constante.",
      comerciales: ["Dopamina 200 mg/5 mL", "Intropín"]
    },
    {
      id: "manitol",
      principio: "Manitol",
      grupo: "Diurético Osmótico",
      categoria: "cardiovascular",
      riesgo: 3,
      concentracion: 200,
      unidad: "mg/mL",
      mecanismo: "Eleva osmolalidad del filtrado glomerular, retiene agua en la nefrona. Reduce presión intraocular e intracraneal.",
      especies: [
        { nombre: "Canino / Felino (oliguria / glaucoma)", dosisMgKg: 0.375, via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Oliguria: 0.25–0.5 g/kg IV en 5–10 min. Glaucoma agudo: 0.5–1 g/kg IV en 15–20 min." },
        { nombre: "Bovino / Porcino (edema cerebral)",     dosisMgKg: 2,     via: "IV",       retiroCarne: 2, retiroLeche: 2, nota: "1–3 g/kg IV para edema cerebral." },
        { nombre: "Equino",                                dosisMgKg: 1,     via: "IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "0.25–2 g/kg en solución al 20% por infusión IV lenta." }
      ],
      contraindicaciones: "Anuria por enfermedad renal. Deshidratación marcada. Hemorragia endocraneal. Edema pulmonar grave.",
      comerciales: ["Manitol 20%", "Osmitrol"]
    },

    // =========================================================================
    // ═══ GLUCOCORTICOIDES ═══
    // =========================================================================
    {
      id: "dexametasona",
      principio: "Dexametasona",
      grupo: "Glucocorticoide Potente",
      categoria: "corticoide",
      riesgo: 4,
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Antiinflamatorio esteroidal potente (25–30× más que cortisol). Inhibe fosfolipasa A2, reduce síntesis de prostaglandinas y leucotrienos. Inmunosupresión y gluconeogénesis.",
      especies: [
        { nombre: "Bovino",                    dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 8, retiroLeche: 3, nota: "Abortivo en último tercio de gestación. Inducción del parto: 20–30 mg IM." },
        { nombre: "Equino",                    dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 0, retiroLeche: 0, nota: "Riesgo de laminitis en uso prolongado." },
        { nombre: "Canino (antiinflamatorio)", dosisMgKg: 0.1, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "No usar con AINEs. Shock: 2–4 mg/kg IV lenta (dosis única)." },
        { nombre: "Canino (inmunosupresor)",   dosisMgKg: 0.3, via: "IV / IM / PO", retiroCarne: 0, retiroLeche: 0, nota: "Para alergias graves o enfermedades autoinmunes." },
        { nombre: "Felino",                    dosisMgKg: 0.1, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Vigilar diabetes transitoria." }
      ],
      contraindicaciones: "Diabetes, úlceras, sarna demodécica, gestación. No combinar con AINEs.",
      comerciales: ["Dexa-2", "Azium", "Dexafort", "Vexadrón"]
    },
    {
      id: "prednisolona",
      principio: "Prednisolona",
      grupo: "Glucocorticoide Intermedio",
      categoria: "corticoide",
      riesgo: 3,
      concentracion: 20,
      unidad: "mg/tableta",
      mecanismo: "4–5× más potente que cortisol. Activo directamente sin conversión hepática (a diferencia de prednisona). Inhibe fosfolipasa A2 y mediadores inflamatorios.",
      especies: [
        { nombre: "Canino (antiinflamatorio)", dosisMgKg: 0.75, via: "Oral / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.5–1 mg/kg cada 12–24 h. Reducir gradualmente al finalizar." },
        { nombre: "Canino (inmunosupresor)",   dosisMgKg: 2,    via: "Oral",           retiroCarne: 0, retiroLeche: 0, nota: "1–2 mg/kg cada 12–24 h para enfermedades autoinmunes." },
        { nombre: "Felino",                    dosisMgKg: 1.5,  via: "Oral / IM",      retiroCarne: 0, retiroLeche: 0, nota: "1–2 mg/kg cada 12–24 h. Los gatos toleran mejor los corticoides." }
      ],
      contraindicaciones: "Diabetes, úlceras GI, infecciones no tratadas, gestación. Nunca suspender abruptamente.",
      comerciales: ["Prednisolona 20 mg", "Delta-Cortef", "Presolona"]
    },

    // =========================================================================
    // ═══ AINEs ═══
    // =========================================================================
    {
      id: "meloxicam",
      principio: "Meloxicam",
      grupo: "AINE Inhibidor COX-2 Preferencial",
      categoria: "aine",
      riesgo: 3,
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Inhibe COX-2 preferencialmente sobre COX-1. Antiinflamatorio, analgésico y antipirético. Reduce síntesis de prostaglandinas.",
      especies: [
        { nombre: "Bovino",          dosisMgKg: 0.5,  via: "SC / IV",        retiroCarne: 15, retiroLeche: 5,  nota: "Mastitis, diarreas neonatales, neumonía." },
        { nombre: "Porcino",         dosisMgKg: 0.4,  via: "IM",             retiroCarne: 5,  retiroLeche: 0,  nota: "Síndrome MMA posparto." },
        { nombre: "Equino",          dosisMgKg: 0.6,  via: "IV / Oral",      retiroCarne: 0,  retiroLeche: 0,  nota: "Cólico y dolor musculoesquelético. Máximo 14 días." },
        { nombre: "Canino (carga)",  dosisMgKg: 0.2,  via: "SC / IV / Oral", retiroCarne: 0,  retiroLeche: 0,  nota: "Carga día 1: 0.2 mg/kg; mantenimiento: 0.1 mg/kg/día." },
        { nombre: "Felino",          dosisMgKg: 0.3,  via: "SC / IV / Oral", retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis única: 0.3 mg/kg; mantenimiento: 0.1 mg/kg/día." }
      ],
      contraindicaciones: "Hipersensibilidad, úlcera gástrica, fallo renal/hepático, deshidratación.",
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
        { nombre: "Canino",  dosisMgKg: 4,   via: "Oral / SC / IV", retiroCarne: 0,  retiroLeche: 0, nota: "4 mg/kg 1 vez/día o 2 mg/kg 2 veces/día. Perioperatorio: 4 mg/kg SC/IV." },
        { nombre: "Felino",  dosisMgKg: 4,   via: "SC (única)",     retiroCarne: 0,  retiroLeche: 0, nota: "Solo dosis única prequirúrgica SC. NO para uso crónico en gatos." },
        { nombre: "Bovino",  dosisMgKg: 1.4, via: "SC / IV",        retiroCarne: 21, retiroLeche: 0, nota: "1.4 mg/kg SC una sola vez." }
      ],
      contraindicaciones: "Hepatopatía conocida. No uso crónico en gatos. Hipersensibilidad.",
      comerciales: ["Rimadyl", "Canidryl", "Carprieve"]
    },
    {
      id: "flunixin-meglumina",
      principio: "Flunixin Meglumina",
      grupo: "AINE Potente",
      categoria: "aine",
      riesgo: 4,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibidor potente de COX no selectivo. Antiinflamatorio, analgésico y antipirético de acción rápida.",
      especies: [
        { nombre: "Bovino",  dosisMgKg: 2.2, via: "IV / IM",  retiroCarne: 4,  retiroLeche: 36, nota: "Retiro leche: 36 horas. Mastitis, endotoxemia, fiebre." },
        { nombre: "Porcino", dosisMgKg: 2.2, via: "IM",       retiroCarne: 12, retiroLeche: 0,  nota: "Enfermedades respiratorias y reproductivas." },
        { nombre: "Equino",  dosisMgKg: 1.1, via: "IV / IM",  retiroCarne: 0,  retiroLeche: 0,  nota: "Cólico y endotoxemia. Preferir IV." },
        { nombre: "Canino",  dosisMgKg: 1.1, via: "IV",       retiroCarne: 0,  retiroLeche: 0,  nota: "Máximo 3 días. Alto riesgo GI." }
      ],
      contraindicaciones: "Úlceras GI. Disfunción renal. No combinar con corticoides ni otros AINEs.",
      comerciales: ["Finadyne", "Banamine"]
    },
    {
      id: "ketorolaco",
      principio: "Ketorolaco",
      grupo: "AINE (Pirrólico)",
      categoria: "aine",
      riesgo: 3,
      concentracion: 30,
      unidad: "mg/mL",
      mecanismo: "Inhibe COX-1 y COX-2. Potente efecto analgésico (mayor que otros AINEs). Duración ~8–12 h en perros.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.375, via: "IM / IV / Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.25–0.5 mg/kg cada 12 h IM solo por 2 días. 0.5 mg/kg IV 3 veces/día." },
        { nombre: "Felino",  dosisMgKg: 0.25,  via: "IM / IV",        retiroCarne: 0, retiroLeche: 0, nota: "Uso muy limitado. Solo dosis únicas. Vigilar función renal." }
      ],
      contraindicaciones: "Úlcera gástrica. Hemorragia digestiva. Insuficiencia renal. No superar 2–3 días de uso.",
      comerciales: ["Ketorolaco 30 mg/mL", "Toradol"]
    },
    {
      id: "dipirona",
      principio: "Dipirona (Metamizol)",
      grupo: "Analgésico Antipirético",
      categoria: "analgesico",
      riesgo: 2,
      concentracion: 500,
      unidad: "mg/mL",
      mecanismo: "Inhibe síntesis de prostaglandinas. Acción analgésica, antipirética y antiespasmódica. Buena tolerancia gástrica comparada con otros AINEs.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 25, via: "IV / IM / Oral", retiroCarne: 0, retiroLeche: 0, nota: "25 mg/kg IV lenta, IM u oral cada 8–12 h." },
        { nombre: "Felino",  dosisMgKg: 25, via: "IM / SC",        retiroCarne: 0, retiroLeche: 0, nota: "25 mg/kg IM o SC cada 12 h. Usar con precaución." },
        { nombre: "Equino",  dosisMgKg: 22, via: "IV lenta / IM",  retiroCarne: 0, retiroLeche: 0, nota: "20–25 mg/kg IV lenta o IM. Dolor cólico moderado." },
        { nombre: "Bovino",  dosisMgKg: 25, via: "IV / IM",        retiroCarne: 3, retiroLeche: 2, nota: "20–30 mg/kg IV lenta o IM cada 12 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Insuficiencia renal grave. Antecedentes de agranulocitosis.",
      comerciales: ["Novalgin", "Dipirona 500 mg/mL", "Analgín"]
    },

    // =========================================================================
    // ═══ ANALGÉSICOS OPIOIDES ═══
    // =========================================================================
    {
      id: "morfina",
      principio: "Morfina",
      grupo: "Opioide Agonista Puro",
      categoria: "analgesico",
      riesgo: 4,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Agonista puro de receptores mu, delta y kappa. El estándar de oro analgésico. Analgesia, sedación, depresión respiratoria, miosis, reducción del peristaltismo.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.5, via: "IM / SC / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg IM o SC cada 4 h; IV lenta 0.05–0.5 mg/kg. Epidural: 0.1 mg/kg." },
        { nombre: "Felino",  dosisMgKg: 0.1, via: "IM / SC",            retiroCarne: 0, retiroLeche: 0, nota: "0.05–0.2 mg/kg cada 4–6 h. Puede causar disforia a dosis altas." },
        { nombre: "Equino",  dosisMgKg: 0.1, via: "IV lenta",           retiroCarne: 0, retiroLeche: 0, nota: "Premedicar siempre. Puede causar excitación si se da solo." }
      ],
      contraindicaciones: "Traumatismo craneal. Insuficiencia respiratoria. Hipotiroidismo. Addison.",
      comerciales: ["Morfina 10 mg/mL"]
    },
    {
      id: "tramadol",
      principio: "Tramadol",
      grupo: "Opioide Mixto / Analgésico",
      categoria: "analgesico",
      riesgo: 3,
      concentracion: 50,
      unidad: "mg/tableta",
      mecanismo: "Agonista opioide mu + inhibidor de recaptación de serotonina y norepinefrina. Mecanismo dual de analgesia.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 2.5, via: "Oral / SC / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "1–4 mg/kg cada 8–12 h oral. Cáncer: 1–4 mg/kg cada 6 h." },
        { nombre: "Felino",  dosisMgKg: 4,   via: "Oral",                 retiroCarne: 0, retiroLeche: 0, nota: "4 mg/kg oral 2 veces/día. Puede causar disforia." }
      ],
      contraindicaciones: "Convulsiones. Ajustar en insuficiencia renal/hepática. Reducir dosis en geriátricos.",
      comerciales: ["Tramal", "Zydol"]
    },
    {
      id: "buprenorfina",
      principio: "Buprenorfina",
      grupo: "Opioide Agonista Parcial Mu",
      categoria: "analgesico",
      riesgo: 3,
      concentracion: 0.3,
      unidad: "mg/mL",
      mecanismo: "Agonista parcial mu. 30× más potente que morfina. Larga duración de acción. Alta afinidad al receptor — difícil reversión con naloxona.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.0125, via: "IM / IV / SC",   retiroCarne: 0, retiroLeche: 0, nota: "0.005–0.02 mg/kg cada 6–12 h." },
        { nombre: "Felino",  dosisMgKg: 0.02,   via: "IM / IV / Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.03 mg/kg. La vía oral transmucosa funciona muy bien en gatos." },
        { nombre: "Conejo",  dosisMgKg: 0.035,  via: "SC / IM",        retiroCarne: 0, retiroLeche: 0, nota: "0.02–0.05 mg/kg cada 6–12 h." }
      ],
      contraindicaciones: "Hipotiroidismo. Insuficiencia renal grave. Traumatismo craneal.",
      comerciales: ["Vetergesic", "Buprenorfina 0.3 mg/mL", "Temgesic"]
    },
    {
      id: "butorfanol",
      principio: "Butorfanol",
      grupo: "Opioide Agonista-Antagonista Mixto",
      categoria: "analgesico",
      riesgo: 3,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Agonista/antagonista opioide mixto. Potente antitusivo. Efectivo para dolor visceral leve-moderado.",
      especies: [
        { nombre: "Canino (analgesia)",   dosisMgKg: 0.3, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.1–0.5 mg/kg cada 4–6 h. Antitusivo: 0.05–0.1 mg/kg oral c/6–12 h." },
        { nombre: "Felino",               dosisMgKg: 0.4, via: "IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.1–0.4 mg/kg cada 3–6 h." },
        { nombre: "Equino",               dosisMgKg: 0.1, via: "IV",            retiroCarne: 0, retiroLeche: 0, nota: "0.01–0.1 mg/kg IV con detomidina o xilacina." },
        { nombre: "Aves / Pequeños mamíferos", dosisMgKg: 0.5, via: "SC / IM", retiroCarne: 0, retiroLeche: 0, nota: "0.1–0.5 mg/kg SC o IM cada 4–6 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Precaución en enfermedad pulmonar grave.",
      comerciales: ["Torbugesic", "Butorfanol 10 mg/mL"]
    },

    // =========================================================================
    // ═══ ANTIBIÓTICOS — BACTERICIDAS ═══
    // =========================================================================
    {
      id: "amoxicilina",
      principio: "Amoxicilina",
      grupo: "Aminopenicilina",
      categoria: "bactericida",
      riesgo: 2,
      concentracion: 150,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Inhibe síntesis de pared celular (transpeptidasa). Amplio rango. Destruida por beta-lactamasas.",
      especies: [
        { nombre: "Canino (Gram +)",    dosisMgKg: 10, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "10 mg/kg c/12 h oral." },
        { nombre: "Canino (Gram -)",    dosisMgKg: 20, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "20 mg/kg c/8 h oral." },
        { nombre: "Felino",             dosisMgKg: 15, via: "Oral / IM / SC",  retiroCarne: 0,  retiroLeche: 0, nota: "Gram +: 10 mg/kg c/12 h. Gram -: 20 mg/kg c/8 h." },
        { nombre: "Bovino",             dosisMgKg: 8,  via: "SC / IM",         retiroCarne: 14, retiroLeche: 2, nota: "6–10 mg/kg/día. Infecciones respiratorias: 11 mg/kg c/12 h." }
      ],
      contraindicaciones: "Hipersensibilidad a betalactámicos. No activa contra productoras de penicilinasas.",
      comerciales: ["Clamoxyl", "Amoxil", "Vetramox"]
    },
    {
      id: "amoxicilina-clavulanico",
      principio: "Amoxicilina + Clavulánico",
      grupo: "Aminopenicilina + Inhibidor Betalactamasa",
      categoria: "bactericida",
      riesgo: 2,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Clavulánico inhibe beta-lactamasas por unión irreversible, protegiendo a la amoxicilina.",
      especies: [
        { nombre: "Canino",      dosisMgKg: 13.75, via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "13.75 mg/kg oral c/12 h. Piel: 12.5 mg/kg c/12 h por 5–21 días." },
        { nombre: "Felino",      dosisMgKg: 10,    via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "Gram +: 10 mg/kg c/12 h. Gram -: 20 mg/kg c/8 h." }
      ],
      contraindicaciones: "Hipersensibilidad a betalactámicos.",
      comerciales: ["Synulox", "Clavaseptin"]
    },
    {
      id: "cefalexina",
      principio: "Cefalexina",
      grupo: "Cefalosporina 1ª Generación",
      categoria: "bactericida",
      riesgo: 2,
      concentracion: 250,
      unidad: "mg/tableta",
      mecanismo: "Bactericida. Inhibe síntesis de pared celular bacteriana. Activa contra Gram positivos (S. aureus, S. intermedius, Pasteurella). Resistente a algunas beta-lactamasas.",
      especies: [
        { nombre: "Canino (estafilococos)", dosisMgKg: 30, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "30 mg/kg c/12 h. Piodermia: 22–35 mg/kg c/12 h. Resp.: 20–40 mg/kg c/8 h." },
        { nombre: "Felino",                 dosisMgKg: 35, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "Tejido blando: 30–50 mg/kg c/12 h. Sistémicas: 35 mg/kg c/6–8 h." },
        { nombre: "Equino",                 dosisMgKg: 30, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "30 mg/kg c/8 h oral." }
      ],
      contraindicaciones: "Hipersensibilidad a betalactámicos. Reducir dosis en enfermedad renal.",
      comerciales: ["Cefalexina 250 mg", "Rilexine", "Cefalex"]
    },
    {
      id: "ceftiofur",
      principio: "Ceftiofur",
      grupo: "Cefalosporina 3ª Generación",
      categoria: "bactericida",
      riesgo: 2,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Inhibe síntesis de pared celular. Resistente a beta-lactamasas de amplio espectro. Activo frente a Pasteurella, Mannheimia, E. coli.",
      especies: [
        { nombre: "Bovino",  dosisMgKg: 2.2, via: "IM / SC", retiroCarne: 4, retiroLeche: 0, nota: "⭐ Retiro leche: 0 horas. Pododermatitis, neumonía." },
        { nombre: "Porcino", dosisMgKg: 3,   via: "IM",      retiroCarne: 4, retiroLeche: 0, nota: "Actinobacillus y Pasteurella respiratoria." }
      ],
      contraindicaciones: "Alergia a betalactámicos.",
      comerciales: ["Excenel", "Cobactan", "Cefty"]
    },
    {
      id: "enrofloxacina",
      principio: "Enrofloxacina",
      grupo: "Fluoroquinolona",
      categoria: "bactericida",
      riesgo: 3,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibe ADN-girasa y topoisomerasa IV. Bactericida dependiente de concentración. Amplio espectro.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,   via: "Oral / SC / IV lenta", retiroCarne: 0,  retiroLeche: 0,  nota: "5 mg/kg oral o SC 1 vez/día." },
        { nombre: "Felino",  dosisMgKg: 5,   via: "Oral / SC",            retiroCarne: 0,  retiroLeche: 0,  nota: "⚠️ MÁXIMO 5 mg/kg/día. Dosis altas = CEGUERA irreversible (degeneración retinal)." },
        { nombre: "Bovino",  dosisMgKg: 7.5, via: "SC",                   retiroCarne: 14, retiroLeche: 14, nota: "7.5 mg/kg SC 1 vez/día por 3–5 días para neumonía." }
      ],
      contraindicaciones: "Animales jóvenes en desarrollo (artropatía). En felinos NO superar 5 mg/kg/día.",
      comerciales: ["Baytril", "Enrox", "Floxabactin"]
    },
    {
      id: "gentamicina",
      principio: "Gentamicina",
      grupo: "Aminoglucósido",
      categoria: "bactericida",
      riesgo: 4,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Se une al ribosoma 30S. Dependiente de concentración. Activo contra Gram negativos aerobios.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 6.6, via: "IV / IM / SC", retiroCarne: 0,  retiroLeche: 0, nota: "6.6 mg/kg c/24 h. Nefrotóxico y ototóxico — monitorear función renal." },
        { nombre: "Felino",  dosisMgKg: 6,   via: "IV / IM / SC", retiroCarne: 0,  retiroLeche: 0, nota: "Mayor riesgo de nefrotoxicidad. Asegurar hidratación." },
        { nombre: "Bovino",  dosisMgKg: 4,   via: "IM",           retiroCarne: 18, retiroLeche: 3, nota: "Vigilar deshidratación." }
      ],
      contraindicaciones: "Falla renal preexistente. No combinar con furosemida (sinergismo nefrotóxico).",
      comerciales: ["Gentocin", "Gentavet"]
    },

    // =========================================================================
    // ═══ ANTIBIÓTICOS — BACTERIOSTÁTICOS ═══
    // =========================================================================
    {
      id: "oxitetraciclina-la",
      principio: "Oxitetraciclina LA",
      grupo: "Tetraciclina",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 200,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático. Se une al ribosoma 30S. Amplio espectro: Gram +, Gram -, Rickettsia, Mycoplasma, Leptospira.",
      especies: [
        { nombre: "Bovino (LA)", dosisMgKg: 20, via: "IM profunda",  retiroCarne: 22, retiroLeche: 4,  nota: "Máximo 10 mL por sitio. Anaplasmosis, pododermatitis, neumonías." },
        { nombre: "Porcino",     dosisMgKg: 20, via: "IM",           retiroCarne: 22, retiroLeche: 0,  nota: "Neumonías y leptospirosis." }
      ],
      contraindicaciones: "Falla renal, gestación (2da mitad), animales jóvenes.",
      comerciales: ["Terramicina LA", "Emicina", "Oxitop"]
    },
    {
      id: "doxiciclina",
      principio: "Doxiciclina",
      grupo: "Tetraciclina 2ª Generación",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático. Mejor absorción oral y mayor liposolubilidad que oxitetraciclina. Activo frente a Ehrlichia, Rickettsia, Mycoplasma, Leptospira, Anaplasma.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,  via: "Oral / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Ehrlichiosis: 5 mg/kg c/12 h por 28 días mínimo." },
        { nombre: "Felino",  dosisMgKg: 5,  via: "Oral / IV lenta", retiroCarne: 0, retiroLeche: 0, nota: "Hemoplasmas: mínimo 14–21 días. Administrar con alimento." },
        { nombre: "Equino",  dosisMgKg: 10, via: "Oral",            retiroCarne: 0, retiroLeche: 0, nota: "10 mg/kg c/12 h para Anaplasma y Lyme." }
      ],
      contraindicaciones: "Gestación. Animales en desarrollo. No combinar con antiácidos.",
      comerciales: ["Ronaxan", "Vibravet"]
    },
    {
      id: "metronidazol",
      principio: "Metronidazol",
      grupo: "Nitroimidazol / Antiprotozoario",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Se activa en células anaerobias formando radicales libres que dañan el ADN. Activo frente a bacterias anaerobias, Giardia, Trichomonas y Entamoeba.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 15, via: "Oral / IV", retiroCarne: 0, retiroLeche: 0, nota: "Giardia: 25 mg/kg c/12 h por 5–7 días." },
        { nombre: "Felino",  dosisMgKg: 10, via: "Oral",      retiroCarne: 0, retiroLeche: 0, nota: "Signos neurológicos posibles a dosis altas." }
      ],
      contraindicaciones: "Gestación temprana. Hepatopatías graves. Evitar alcohol.",
      comerciales: ["Flagyl", "Metronidazol 250 mg"]
    },
    {
      id: "azitromicina",
      principio: "Azitromicina",
      grupo: "Macrólido",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 200,
      unidad: "mg/5 mL",
      mecanismo: "Bacteriostático. Penetra pared celular y se une a subunidad ribosomal 50S. Activo frente a Gram +, Gram -, Bordetella, Mycoplasma, Borrelia, Toxoplasma.",
      especies: [
        { nombre: "Canino (infecciones susceptibles)", dosisMgKg: 7.5,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "5–10 mg/kg c/24 h por 3–5 días. Pioderma: 10 mg/kg/24 h por 5–10 días." },
        { nombre: "Felino",                            dosisMgKg: 7.5,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "5–10 mg/kg c/24 h por 3–5 días. Dérmicas: 7–15 mg/kg c/12 h por 5–7 días." },
        { nombre: "Equino (Rhodococcus equi potrillos)",dosisMgKg: 10,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "10 mg/kg/día oral. Combinada con rifampicina." }
      ],
      contraindicaciones: "Hipersensibilidad a macrólidos. Precaución con compromiso hepático.",
      comerciales: ["Azitromicina 200 mg/5 mL", "Zithromax", "Sumamed"]
    },
    {
      id: "clindamicina",
      principio: "Clindamicina",
      grupo: "Lincosamida",
      categoria: "bacteriostatico",
      riesgo: 3,
      concentracion: 25,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático (bactericida a altas concentraciones). Inhibe síntesis proteica en ribosoma 50S. Excelente penetración en hueso y tejidos.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 11, via: "Oral / IM",  retiroCarne: 0, retiroLeche: 0, nota: "5.5–11 mg/kg c/12 h. Toxoplasmosis: 12.5 mg/kg c/12 h por 30 días." },
        { nombre: "Felino",  dosisMgKg: 11, via: "Oral / IM",  retiroCarne: 0, retiroLeche: 0, nota: "11–33 mg/kg c/12–24 h. Toxoplasmosis, enf. periodontal." }
      ],
      contraindicaciones: "NO usar en équidos ni lagomorfos (enterocolitis fatal). Colitis ulcerativa.",
      comerciales: ["Antirobe", "Clindamicina 25 mg/mL", "Cleocin"]
    },
    {
      id: "sulfa-trimetoprim",
      principio: "Sulfametoxazol + Trimetoprim",
      grupo: "Sulfonamida + Diaminopiridina",
      categoria: "bacteriostatico",
      riesgo: 2,
      concentracion: 48,
      unidad: "mg/mL",
      mecanismo: "Sinergia doble: trimetoprim inhibe dihidrofolato reductasa; sulfametoxazol inhibe dihidropteroato sintasa. Bloqueo secuencial de síntesis de folatos.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 15, via: "Oral / IV",  retiroCarne: 0,  retiroLeche: 0, nota: "15–30 mg/kg oral c/12 h. Infecciones urinarias, respiratorias y cutáneas." },
        { nombre: "Bovino",  dosisMgKg: 16, via: "IV / IM",    retiroCarne: 10, retiroLeche: 4, nota: "16 mg/kg c/12–24 h. Terneros con septicemia y enf. respiratoria." }
      ],
      contraindicaciones: "Falla renal/hepática grave. Deshidratación (riesgo de cristaluria). Gestación avanzada.",
      comerciales: ["Tribrissen", "Borgal", "TMS"]
    },

    // =========================================================================
    // ═══ ANTIFÚNGICOS ═══
    // =========================================================================
    {
      id: "itraconazol",
      principio: "Itraconazol",
      grupo: "Triazol Antifúngico",
      categoria: "antifungico",
      riesgo: 3,
      concentracion: 100,
      unidad: "mg/cápsula",
      mecanismo: "Fungistático triazol. Altera permeabilidad de membrana celular fúngica, inhibe síntesis de ergosterol. Activo frente a Candida, Aspergillus, Cryptococcus, Histoplasma, Blastomyces.",
      especies: [
        { nombre: "Canino (dermatofitosis)",  dosisMgKg: 5,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg 2 días consecutivos/semana × 3 semanas (Malassezia). Blastomicosis: 5 mg/kg 1 vez/día ≥30 días." },
        { nombre: "Canino (histoplasmosis)",  dosisMgKg: 10,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "10 mg/kg/día oral." },
        { nombre: "Felino (criptococosis)",   dosisMgKg: 12,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "50–100 mg/gato/día oral. Blastomicosis: 10 mg/kg 1 vez/día." },
        { nombre: "Equino (aspergilosis)",    dosisMgKg: 3,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "3 mg/kg 2 veces/día." }
      ],
      contraindicaciones: "Hipersensibilidad. Disfunción hepática. Toxicidad hepática: el efecto adverso más importante.",
      comerciales: ["Itraconazol 100 mg", "Sporanox", "Itrafungol"]
    },
    {
      id: "ketoconazol",
      principio: "Ketoconazol",
      grupo: "Imidazol Antifúngico",
      categoria: "antifungico",
      riesgo: 3,
      concentracion: 200,
      unidad: "mg/tableta",
      mecanismo: "Fungistático/fungicida. Aumenta permeabilidad de membrana celular fúngica. Inhibe síntesis de ergosterol. Activo contra Blastomyces, Coccidioides, Cryptococcus, Histoplasma.",
      especies: [
        { nombre: "Canino (aspergilosis)",       dosisMgKg: 10,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "10 mg/kg oral 1 vez/día. Histoplasmosis: 10 mg/kg 1–2 veces/día × 3 meses." },
        { nombre: "Canino (hiperadrenocort.)",    dosisMgKg: 10,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "5–15 mg/kg oral 2 veces/día como alternativa al trilostano." },
        { nombre: "Canino (Malassezia)",          dosisMgKg: 5,   via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "2.5–10 mg/kg oral 1 vez/día × 7–14 días." },
        { nombre: "Felino",                       dosisMgKg: 10,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "Uso controvertido; considerar itraconazol. 10 mg/kg c/12 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Enfermedad hepática. Potencial teratogénico. Puede causar infertilidad en machos.",
      comerciales: ["Ketoconazol 200 mg", "Nizoral"]
    },
    {
      id: "fluconazol",
      principio: "Fluconazol",
      grupo: "Triazol Antifúngico",
      categoria: "antifungico",
      riesgo: 2,
      concentracion: 50,
      unidad: "mg/tableta",
      mecanismo: "Fungistático. Hidrosoluble. Excelente distribución tisular incluido LCR. Inhibe síntesis de ergosterol. Activo frente a Candida, Cryptococcus.",
      especies: [
        { nombre: "Canino (aspergilosis nasal)", dosisMgKg: 3.75, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "2.5–5 mg/kg oral 2 veces/día (hasta 8 semanas)." },
        { nombre: "Canino (criptococosis)",       dosisMgKg: 7.5,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "5–10 mg/kg oral 1–2 veces/día." },
        { nombre: "Felino (criptococosis)",        dosisMgKg: 10,  via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "50 mg/gato c/12 h oral. Candidiasis cistitis: elección." }
      ],
      contraindicaciones: "Hipersensibilidad. Precaución en insuficiencia hepática o renal.",
      comerciales: ["Fluconazol 50 mg", "Diflucan"]
    },

    // =========================================================================
    // ═══ ANTIHISTAMÍNICOS ═══
    // =========================================================================
    {
      id: "clorfeniramina",
      principio: "Clorfeniramina",
      grupo: "Antihistamínico H1",
      categoria: "antihistaminico",
      riesgo: 1,
      concentracion: 4,
      unidad: "mg/tableta",
      mecanismo: "Antagonista competitivo de receptores H1. No inactiva ni impide liberación de histamina. Actividad anticolinérgica variable. Efecto sedante por depresión del SNC.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.3, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "4–8 mg totales (máx 0.5 mg/kg) oral c/8–12 h. Como sedante: 2.5–5 mg oral c/12 h." },
        { nombre: "Felino",  dosisMgKg: 0.3, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "2 mg por gato oral c/12 h. Para prurito: 2–4 mg/gato 2 veces/día." }
      ],
      contraindicaciones: "Hipersensibilidad. Glaucoma ángulo cerrado. Hipertrofia prostática. Hipertiroidismo.",
      comerciales: ["Clorfeniramina 4 mg", "Clortrimetón"]
    },
    {
      id: "difenhidramina",
      principio: "Difenhidramina",
      grupo: "Antihistamínico H1 / Antiemético",
      categoria: "antihistaminico",
      riesgo: 2,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Inhibe competitivamente receptores H1. Efectos sedantes, anticolinérgicos, antitusivos y antieméticos potentes.",
      especies: [
        { nombre: "Canino (antihistamínico)", dosisMgKg: 2.5, via: "Oral / IM / SC / IV", retiroCarne: 0, retiroLeche: 0, nota: "2–4 mg/kg c/8–12 h oral; 1 mg/kg IM/SC/IV. Anafilaxis: 3–4 mg/kg IM." },
        { nombre: "Felino",                   dosisMgKg: 2.5, via: "Oral / IM",           retiroCarne: 0, retiroLeche: 0, nota: "2–4 mg/kg oral c/8 h." },
        { nombre: "Equino (anafilaxis)",       dosisMgKg: 0.6, via: "IV / IM",             retiroCarne: 0, retiroLeche: 0, nota: "0.25–1 mg/kg IV o IM." },
        { nombre: "Aves (psitácidas)",         dosisMgKg: 2,   via: "Oral",                retiroCarne: 0, retiroLeche: 0, nota: "2 mg/kg oral c/12 h para prurito." }
      ],
      contraindicaciones: "Hipersensibilidad. Mismas contraindicaciones que clorfeniramina. Glaucoma ángulo cerrado.",
      comerciales: ["Difenhidramina 50 mg/mL", "Benadryl"]
    },
    {
      id: "ondansetron",
      principio: "Ondansetrón",
      grupo: "Antagonista 5-HT3 / Antiemético",
      categoria: "antihistaminico",
      riesgo: 2,
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Antagonista selectivo de receptores 5-HT3 (serotonina tipo 3) en terminaciones vagales periféricas y en zona quimiorreceptora gatillo. Potente antiemético central y periférico.",
      especies: [
        { nombre: "Canino (vómito intratable)", dosisMgKg: 0.15,  via: "IV / Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg oral c/12–24 h. Parvovirus: 0.11–0.176 mg/kg IV lenta c/6–12 h." },
        { nombre: "Felino",                     dosisMgKg: 0.15,  via: "IV / Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.1–1 mg/kg oral c/12–24 h. Pancreatitis grave: 0.1–1 mg/kg IV c/12–24 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Razas con mutación MDR1. Disfunción hepática (reduce dosis).",
      comerciales: ["Ondansetrón 2 mg/mL", "Zofran"]
    },

    // =========================================================================
    // ═══ GASTROINTESTINAL ═══
    // =========================================================================
    {
      id: "metoclopramida",
      principio: "Metoclopramida",
      grupo: "Procinético / Antiemético",
      categoria: "gastrointestinal",
      riesgo: 2,
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Estimula motilidad GI aumentando contracciones gástricas y relajando esfínter pilórico. Aumenta peristalsis duodenal. Bloquea dopamina en zona quimiorreceptora gatillo (antiemético).",
      especies: [
        { nombre: "Canino (antiemético)",      dosisMgKg: 0.25, via: "Oral / SC / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.1–0.4 mg/kg c/6 h oral/SC/IM. Infusión IV: 1–2 mg/kg/día." },
        { nombre: "Canino (hipomotilidad)",     dosisMgKg: 0.35, via: "Oral",               retiroCarne: 0, retiroLeche: 0, nota: "0.2–0.5 mg/kg oral o parenteral." },
        { nombre: "Felino",                    dosisMgKg: 0.35, via: "Oral / IV",           retiroCarne: 0, retiroLeche: 0, nota: "0.2–0.5 mg/kg c/8 h. IV: 0.01–0.02 mg/kg/h en infusión." },
        { nombre: "Equino (estímulo GI)",      dosisMgKg: 0.04, via: "IV (infusión)",       retiroCarne: 0, retiroLeche: 0, nota: "0.04 mg/kg/h por infusión IV a velocidad constante." }
      ],
      contraindicaciones: "Hipersensibilidad. Pacientes con feocromocitoma. Desórdenes convulsivos (relativa). No combinar con atropina.",
      comerciales: ["Metoclopramida 5 mg/mL", "Primperan", "Maxolon"]
    },
    {
      id: "omeprazol",
      principio: "Omeprazol",
      grupo: "Inhibidor de la Bomba de Protones (IBP)",
      categoria: "gastrointestinal",
      riesgo: 1,
      concentracion: 20,
      unidad: "mg/tableta",
      mecanismo: "Se une irreversiblemente a la H⁺/K⁺-ATPasa (bomba de protones) en superficie secretora de células parietales. Inhibe secreción ácida gástrica basal y estimulada.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 0.75, via: "Oral / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.5–1 mg/kg oral 1 vez/día para enfermedad ulcerativa gastroduodenal." },
        { nombre: "Felino",  dosisMgKg: 0.7,  via: "Oral",      retiroCarne: 0, retiroLeche: 0, nota: "0.7 mg/kg oral 1 vez/día." },
        { nombre: "Equino",  dosisMgKg: 4,    via: "Oral",      retiroCarne: 0, retiroLeche: 0, nota: "4 mg/kg oral 1 vez/día durante 4 semanas para SGUE." }
      ],
      contraindicaciones: "Hipersensibilidad. Precaución en enfermedad hepática o renal.",
      comerciales: ["Omeprazol 20 mg", "Losec", "Ulcervet", "GastroGard (equinos)"]
    },
    {
      id: "ranitidina",
      principio: "Ranitidina",
      grupo: "Antihistamínico H2 / Anti-ulceroso",
      categoria: "gastrointestinal",
      riesgo: 1,
      concentracion: 25,
      unidad: "mg/mL",
      mecanismo: "Inhibe competitivamente la histamina en receptores H2 de células parietales. Reduce producción de ácido gástrico basal y estimulada.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 2.5, via: "Oral / IV / SC / IM", retiroCarne: 0, retiroLeche: 0, nota: "2–3.5 mg/kg c/8–12 h. IV en bolo puede causar vómitos; preferir infusión lenta." },
        { nombre: "Felino",  dosisMgKg: 2.5, via: "Oral / IV",           retiroCarne: 0, retiroLeche: 0, nota: "2.5 mg/kg c/12 h IV; 3.5 mg/kg c/12 h oral." },
        { nombre: "Equino",  dosisMgKg: 6.6, via: "Oral",                retiroCarne: 0, retiroLeche: 0, nota: "6.6 mg/kg oral c/8 h; 1.5 mg/kg IV c/8 h." }
      ],
      contraindicaciones: "Hipersensibilidad. Precaución en geriátricos e insuficiencia hepática o renal.",
      comerciales: ["Ranitidina 150 mg", "Zantac"]
    },
    {
      id: "sucralfato",
      principio: "Sucralfato",
      grupo: "Protector Gástrico / Citoprotector",
      categoria: "gastrointestinal",
      riesgo: 1,
      concentracion: 1000,
      unidad: "mg/tableta",
      mecanismo: "Acción local. Reacciona con HCl para formar complejo pastoso que se adhiere a exudados proteínáceos en úlceras. Actúa como barrera protectora frente a pepsina, ácido y bilis.",
      especies: [
        { nombre: "Canino (talla grande)",   dosisMgKg: 20, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "1 g oral c/8 h. Esofagitis: 0.5–1 g oral 3 veces/día." },
        { nombre: "Canino (talla pequeña)",  dosisMgKg: 20, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.5 g oral c/8 h." },
        { nombre: "Felino",                  dosisMgKg: 25, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "0.25–0.5 g oral c/8–12 h." },
        { nombre: "Equino",                  dosisMgKg: 30, via: "Oral", retiroCarne: 0, retiroLeche: 0, nota: "20–40 mg/kg oral c/8 h para SGUE." }
      ],
      contraindicaciones: "No hay contraindicaciones conocidas. El único efecto adverso reportado es constipación.",
      comerciales: ["Sucralfato 1 g", "Carafate", "Sulcrate"]
    },

    // =========================================================================
    // ═══ RESPIRATORIO ═══
    // =========================================================================
    {
      id: "ambroxol",
      principio: "Ambroxol",
      grupo: "Mucolítico / Expectorante",
      categoria: "broncodilatador",
      riesgo: 1,
      concentracion: 7.5,
      unidad: "mg/mL",
      mecanismo: "Mucolítico. Estimula producción de surfactante pulmonar, mejora calidad del moco y motilidad ciliar. Restablece mecanismos de autolimpieza bronquial.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 2.5, via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "2.5 mg/kg oral c/8–12 h." },
        { nombre: "Felino",  dosisMgKg: 1,   via: "Oral",  retiroCarne: 0, retiroLeche: 0, nota: "1 mg/kg oral c/8–12 h." },
        { nombre: "Equino",  dosisMgKg: 3,   via: "IV",    retiroCarne: 2, retiroLeche: 2, nota: "3.0 mg/kg IV c/12 h." }
      ],
      contraindicaciones: "No usar en edema pulmonar. Tos leve puede ser mecanismo de limpieza útil.",
      comerciales: ["Mucosolvan", "Bisolvon", "Ambroxol"]
    },
    {
      id: "salbutamol",
      principio: "Salbutamol (Albuterol)",
      grupo: "Broncodilatador Beta-2 Agonista",
      categoria: "broncodilatador",
      riesgo: 2,
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Agonista beta-2 adrenérgico selectivo. Relaja músculo liso bronquial. Broncodilatación rápida (5–15 min).",
      especies: [
        { nombre: "Canino (broncoespasmo)", dosisMgKg: 0.05, via: "Inhalación / Oral", retiroCarne: 0, retiroLeche: 0, nota: "50 µg/kg nebulización; 0.02–0.05 mg/kg oral c/8 h." },
        { nombre: "Felino (asma felina)",   dosisMgKg: 0.05, via: "Inhalación",         retiroCarne: 0, retiroLeche: 0, nota: "100 µg (1–2 puffs) c/4–8 h con cámara espaciadora." },
        { nombre: "Equino (ORVA)",          dosisMgKg: 0.8,  via: "IV infusión",        retiroCarne: 0, retiroLeche: 0, nota: "0.8 µg/kg/min IV diluido." }
      ],
      contraindicaciones: "Taquiarritmias. Precaución en cardiopatías.",
      comerciales: ["Ventolin", "Salbuvent"]
    },

    // =========================================================================
    // ═══ ANTIPARASITARIOS ═══
    // =========================================================================
    {
      id: "ivermectina-1",
      principio: "Ivermectina 1%",
      grupo: "Lactona Macrocíclica",
      categoria: "antiparasitario-interno",
      riesgo: 3,
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Apertura de canales de Cl⁻ glutamato-dependientes en parásitos. Parálisis y muerte del parásito.",
      especies: [
        { nombre: "Bovino",                     dosisMgKg: 0.2,   via: "SC",          retiroCarne: 35, retiroLeche: 28, nota: "Nematodos internos y ectoparásitos." },
        { nombre: "Porcino",                    dosisMgKg: 0.3,   via: "SC",          retiroCarne: 28, retiroLeche: 0,  nota: "Sarna sarcóptica." },
        { nombre: "Equino",                     dosisMgKg: 0.2,   via: "Oral (pasta)",retiroCarne: 0,  retiroLeche: 0,  nota: "200 µg/kg. Strongylus, bots, pinworms." },
        { nombre: "Canino (sarna demodécica)",  dosisMgKg: 0.4,   via: "SC / Oral",   retiroCarne: 0,  retiroLeche: 0,  nota: "⚠️ PELIGRO MORTAL en Collies/Pastores/Border Collies (MDR1/ABCB1)." },
        { nombre: "Canino (prev. Dirofilaria)", dosisMgKg: 0.006, via: "Oral",        retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis micro mensual. Segura para todas las razas." }
      ],
      contraindicaciones: "Razas MDR1/ABCB1 a dosis antiparasitarias. Cachorros < 6 semanas.",
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
      mecanismo: "Aumenta permeabilidad al Ca²⁺ en céstodos → parálisis espástica → destrucción por defensas del huésped.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 5,   via: "Oral / SC / IM", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg dosis única. Echinococcus: repetir a las 3 semanas." },
        { nombre: "Felino",  dosisMgKg: 5,   via: "Oral / SC",      retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg dosis única." },
        { nombre: "Equino",  dosisMgKg: 1.5, via: "Oral (pasta)",   retiroCarne: 0, retiroLeche: 0, nota: "Para Anoplocephala. Combinado con pirantel." }
      ],
      contraindicaciones: "Hipersensibilidad. Cachorros < 4 semanas.",
      comerciales: ["Droncit", "Cestel"]
    },
    {
      id: "fenbendazol",
      principio: "Fenbendazol",
      grupo: "Bencimidazol / Antihelmíntico",
      categoria: "antiparasitario-interno",
      riesgo: 1,
      concentracion: 100,
      unidad: "mg/mL",
      mecanismo: "Inhibe polimerización de tubulina parasitaria → afecta captación de glucosa y reproducción del parásito. Activo contra nemátodos y Giardia.",
      especies: [
        { nombre: "Canino",  dosisMgKg: 50,  via: "Oral", retiroCarne: 0,  retiroLeche: 0, nota: "50 mg/kg oral 1 vez/día × 3 días. Giardia: × 5 días." },
        { nombre: "Felino",  dosisMgKg: 50,  via: "Oral", retiroCarne: 0,  retiroLeche: 0, nota: "50 mg/kg oral × 5 días." },
        { nombre: "Bovino",  dosisMgKg: 7.5, via: "Oral", retiroCarne: 14, retiroLeche: 5, nota: "Excelente para Ostertagia y nematodos GI." },
        { nombre: "Equino",  dosisMgKg: 5,   via: "Oral (pasta)", retiroCarne: 0, retiroLeche: 0, nota: "5 mg/kg. Migración larvaria: 10 mg/kg × 5 días." }
      ],
      contraindicaciones: "Primer tercio de gestación (precaución).",
      comerciales: ["Panacur", "Safe-Guard"]
    },
    {
      id: "closantel",
      principio: "Closantel",
      grupo: "Fasciolicida",
      categoria: "antiparasitario-interno",
      riesgo: 2,
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Desacopla la fosforilación oxidativa en el metabolismo del parásito. Activo frente a formas adultas de Fasciola hepatica y Haemonchus contortus (hematófagos).",
      especies: [
        { nombre: "Bovino",          dosisMgKg: 10, via: "Oral / SC",  retiroCarne: 42, retiroLeche: 28, nota: "Para fasciolosis y haemonchosis. Retiro leche: 28 días." },
        { nombre: "Ovino / Caprino", dosisMgKg: 10, via: "Oral / SC",  retiroCarne: 42, retiroLeche: 28, nota: "Para Fasciola y Haemonchus." }
      ],
      contraindicaciones: "No activo frente a formas juveniles de Fasciola (<6 semanas). Respetar tiempos de retiro estrictamente.",
      comerciales: ["Flukiver", "Closantel 5%", "Clonalb"]
    },

    // =========================================================================
    // ═══ HORMONAS / ENDOCRINOS ═══
    // =========================================================================
    {
      id: "insulina",
      principio: "Insulina",
      grupo: "Hormona Pancreática",
      categoria: "hormona",
      riesgo: 4,
      concentracion: 100,
      unidad: "UI/mL",
      mecanismo: "Facilita captación celular de glucosa. Estimula metabolismo de carbohidratos. Inhibe gluconeogénesis y lipólisis.",
      especies: [
        { nombre: "Canino / Felino (cetoacidosis)", dosisMgKg: 0.1, via: "IM / IV infusión", retiroCarne: 0, retiroLeche: 0, nota: "CAD: 0.2 UI/kg IM inicial + 0.1 UI/kg/h. IV: 0.05–0.1 UI/kg/h." },
        { nombre: "Canino (diabetes mellitus)",     dosisMgKg: 0.5, via: "SC",               retiroCarne: 0, retiroLeche: 0, nota: "0.5 UI/kg SC c/24 h junto con comida." },
        { nombre: "Felino (diabetes mellitus)",     dosisMgKg: 0.35,via: "SC",               retiroCarne: 0, retiroLeche: 0, nota: "PZI: 0.22–0.6 UI/kg SC c/12–24 h. Glargina: 0.5 UI/gato." }
      ],
      contraindicaciones: "Confundir tipos y potencias puede ser letal. Monitorear glucemia regularmente.",
      comerciales: ["Caninsulin", "ProZinc (gatos)", "Vetsulin"]
    },
    {
      id: "oxitocina",
      principio: "Oxitocina",
      grupo: "Hormona Uterotónica / Galactogoga",
      categoria: "hormona",
      riesgo: 3,
      concentracion: 10,
      unidad: "UI/mL",
      mecanismo: "Estimula contracción uterina. Facilita eyección láctea. Umbral disminuye con altos niveles de estrógeno durante la gestación.",
      especies: [
        { nombre: "Canino / Felino (parto)",    dosisMgKg: 5,  via: "SC / IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "0.5–3 UI c/30–60 min. Inercia uterina: 5–20 UI IM." },
        { nombre: "Bovino (retención placenta)", dosisMgKg: 50, via: "IM",           retiroCarne: 1, retiroLeche: 1, nota: "40–60 UI c/2 h. Bajada de leche: 10–20 UI IV." },
        { nombre: "Equino",                     dosisMgKg: 10, via: "IV / IM",      retiroCarne: 0, retiroLeche: 0, nota: "2.5–5 UI IV c/15–20 min. Retención membranas: 10–40 UI IM." }
      ],
      contraindicaciones: "Distocia. No usar sin relajación cervical. Tratar hipocalcemia antes de su uso.",
      comerciales: ["Oxytocin 10 UI/mL", "Pitocin"]
    }
  ]
};