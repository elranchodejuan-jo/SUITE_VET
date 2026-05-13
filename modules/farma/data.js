// =============================================================================
// SUITE VET 2.0 — modules/farma/data.js
// SOLO DATOS. Nunca lógica de render aquí.
// Para agregar un fármaco: copia un bloque y pégalo al final del array.
// =============================================================================

window.FARMA_DATA = {
  farmacos: [
    {
      id: "oxitetraciclina-la",
      principio: "Oxitetraciclina",
      grupo: "Tetraciclina",
      grupoKey: "tetraciclina",
      concentracion: 200,
      unidad: "mg/mL",
      mecanismo: "Bacteriostático. Inhibe síntesis proteica (30S).",
      especies: [
        { nombre: "Bovino (LA)", dosisMgKg: 20,  via: "IM profunda", retiroCarne: 22, retiroLeche: 4,  nota: "Máximo 10 mL por sitio. Acción prolongada." },
        { nombre: "Porcino",     dosisMgKg: 20,  via: "IM",          retiroCarne: 22, retiroLeche: 0,  nota: "Útil en neumonías y leptospirosis." },
        { nombre: "Canino",      dosisMgKg: 10,  via: "IV lenta/IM", retiroCarne: 0,  retiroLeche: 0,  nota: "Dolorosa IM. En cachorros mancha dientes. Se prefiere Doxiciclina." },
        { nombre: "Felino",      dosisMgKg: 10,  via: "IV lenta/IM", retiroCarne: 0,  retiroLeche: 0,  nota: "Usar con precaución. Riesgo de fiebre y vómitos." }
      ],
      contraindicaciones: "Falla renal, gestación (2da mitad), animales jóvenes.",
      comerciales: ["Terramicina LA", "Emicina", "Oxitop"]
    },
    {
      id: "ceftiofur-sodico",
      principio: "Ceftiofur",
      grupo: "Cefalosporina",
      grupoKey: "cefalosporina",
      concentracion: 50,
      unidad: "mg/mL",
      mecanismo: "Bactericida. Pared celular. Resistente a betalactamasas.",
      especies: [
        { nombre: "Bovino",  dosisMgKg: 2.2, via: "IM / SC", retiroCarne: 4, retiroLeche: 0, nota: "Ideal para pododermatitis y respiratorio sin descartar leche." },
        { nombre: "Porcino", dosisMgKg: 3,   via: "IM",      retiroCarne: 4, retiroLeche: 0, nota: "Enfermedad respiratoria bacteriana." },
        { nombre: "Canino",  dosisMgKg: 2.2, via: "SC",      retiroCarne: 0, retiroLeche: 0, nota: "Uso en infecciones urinarias resistentes (Off-label)." },
        { nombre: "Felino",  dosisMgKg: 4.4, via: "SC",      retiroCarne: 0, retiroLeche: 0, nota: "Infecciones de tejidos blandos." }
      ],
      contraindicaciones: "Alergia a betalactámicos.",
      comerciales: ["Excenel", "Cobactan", "Cefty"]
    },
    {
      id: "dexametasona",
      principio: "Dexametasona",
      grupo: "Corticosteroide",
      grupoKey: "antiinflamatorio",
      concentracion: 2,
      unidad: "mg/mL",
      mecanismo: "Antiinflamatorio esteroidal potente.",
      especies: [
        { nombre: "Bovino",                dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 8, retiroLeche: 3, nota: "Abortivo en último tercio de gestación." },
        { nombre: "Equino",                dosisMgKg: 0.1, via: "IV / IM",       retiroCarne: 0, retiroLeche: 0, nota: "Riesgo de laminitis en uso prolongado." },
        { nombre: "Canino (Antiinflam.)",  dosisMgKg: 0.1, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Dosis baja. No usar con AINEs." },
        { nombre: "Canino (Inmunosupres.)",dosisMgKg: 0.3, via: "IV / IM / PO", retiroCarne: 0, retiroLeche: 0, nota: "Dosis alta para alergias graves o autoinmunes." },
        { nombre: "Felino",                dosisMgKg: 0.1, via: "IV / IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Vigilar diabetes transitoria." }
      ],
      contraindicaciones: "Diabetes, úlceras, sarna demodécica, gestación.",
      comerciales: ["Dexa-2", "Azium", "Cortiprex"]
    },
    {
      id: "ivermectina-1",
      principio: "Ivermectina 1%",
      grupo: "Lactona Macrocíclica",
      grupoKey: "antiparasitario",
      concentracion: 10,
      unidad: "mg/mL",
      mecanismo: "Parálisis del parásito (Cl- glutamato).",
      especies: [
        { nombre: "Bovino",                      dosisMgKg: 0.2,   via: "Subcutánea", retiroCarne: 35, retiroLeche: 28, nota: "Ardor al aplicar. Control parásitos internos/externos." },
        { nombre: "Porcino",                     dosisMgKg: 0.3,   via: "Subcutánea", retiroCarne: 28, retiroLeche: 0,  nota: "Específico para sarna sarcóptica." },
        { nombre: "Canino (Sarna)",              dosisMgKg: 0.4,   via: "SC / Oral",  retiroCarne: 0,  retiroLeche: 0,  nota: "⚠️ PELIGRO MORTAL en Collies/Pastores (MDR1). Confirmar seguridad." },
        { nombre: "Canino (Prev. Gusano Corazón)",dosisMgKg: 0.006,via: "Oral",       retiroCarne: 0,  retiroLeche: 0,  nota: "Dosis micro mensual. Segura para todas las razas." }
      ],
      contraindicaciones: "Razas sensibles (MDR1), cachorros < 6 semanas.",
      comerciales: ["Ivomec", "Bovimec", "Iverfull"]
    },
    {
      id: "meloxicam",
      principio: "Meloxicam",
      grupo: "AINE",
      grupoKey: "antiinflamatorio",
      concentracion: 5,
      unidad: "mg/mL",
      mecanismo: "Inhibe COX-2 preferencialmente. Analgésico y antipirético.",
      especies: [
        { nombre: "Bovino",         dosisMgKg: 0.5, via: "SC / IV",        retiroCarne: 15, retiroLeche: 5, nota: "Excelente en mastitis y diarreas." },
        { nombre: "Porcino",        dosisMgKg: 0.4, via: "IM",             retiroCarne: 5,  retiroLeche: 0, nota: "Síndrome MMA." },
        { nombre: "Equino",         dosisMgKg: 0.6, via: "IV / Oral",      retiroCarne: 0,  retiroLeche: 0, nota: "Cólico y dolor musculoesquelético." },
        { nombre: "Canino (Carga)", dosisMgKg: 0.2, via: "SC / IV / Oral", retiroCarne: 0,  retiroLeche: 0, nota: "Dosis de carga día 1." }
      ],
      contraindicaciones: "Úlceras, fallo renal/hepático, deshidratación.",
      comerciales: ["Metacam", "Meloxivet", "Meloxi-Jet"]
    },
    {
      id: "xilacina-2",
      principio: "Xilacina 2%",
      grupo: "Sedante Alfa-2",
      grupoKey: "anestesico",
      concentracion: 20,
      unidad: "mg/mL",
      mecanismo: "Sedación, relajación muscular, analgesia.",
      especies: [
        { nombre: "Bovino", dosisMgKg: 0.05, via: "IM / IV", retiroCarne: 3, retiroLeche: 2, nota: "⚠️ EXTREMA SENSIBILIDAD. Usar 1/10 dosis equina." },
        { nombre: "Equino", dosisMgKg: 1.1,  via: "IV",      retiroCarne: 0, retiroLeche: 0, nota: "Sedación estándar. Produce ataxia." },
        { nombre: "Canino", dosisMgKg: 1.1,  via: "IM / IV", retiroCarne: 0, retiroLeche: 0, nota: "Efecto emético (vómito). Usar con atropina." },
        { nombre: "Felino", dosisMgKg: 1.1,  via: "IM / SC", retiroCarne: 0, retiroLeche: 0, nota: "Induce vómito fuertemente." }
      ],
      contraindicaciones: "Cardiópatas, obstrucción respiratoria, gestación avanzada.",
      comerciales: ["Rompun", "Procin", "Sedalvet"]
    }
  ]
};
