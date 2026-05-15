// =============================================================================
// SUITE VET 2.0 — shared/categorias.js
// Sistema de categorías farmacológicas: registro central + helpers visuales.
//
// USO BÁSICO:
//   const cat = SuiteVet.Categorias.get('aine');
//   element.innerHTML = SuiteVet.Categorias.badge('aine');
//   SuiteVet.Categorias.applyTo(cardElement, 'corticoide');
//
// AGREGAR UNA CATEGORÍA NUEVA:
//   1. Añade un bloque en REGISTRY abajo
//   2. Define los 4 tokens en shared/categorias.css
//   3. ¡Listo! Todos los módulos pueden usarla
// =============================================================================

(function () {
  "use strict";

  window.SuiteVet = window.SuiteVet || {};

  // ---------------------------------------------------------------------------
  // 1. REGISTRO CENTRAL DE CATEGORÍAS
  //    Single source of truth. Cualquier cambio aquí se propaga al sistema.
  // ---------------------------------------------------------------------------
  const REGISTRY = {

    // ── ANTIMICROBIANOS ──────────────────────────────────────────────────────
    "bactericida": {
      id: "bactericida",
      label: "Bactericida",
      labelLargo: "Antibiótico bactericida",
      familia: "antimicrobiano",
      icon: "🦠",
      tag: "BC",
      vibe: "destructor",
      descripcion: "Mata bacterias por destrucción de pared o ADN.",
      riesgoBase: 3
    },
    "bacteriostatico": {
      id: "bacteriostatico",
      label: "Bacteriostático",
      labelLargo: "Antibiótico bacteriostático",
      familia: "antimicrobiano",
      icon: "🚫",
      tag: "BS",
      vibe: "inhibe",
      descripcion: "Inhibe crecimiento bacteriano sin matar directamente.",
      riesgoBase: 2
    },
    "antifungico": {
      id: "antifungico",
      label: "Antifúngico",
      labelLargo: "Antimicótico",
      familia: "antimicrobiano",
      icon: "🍄",
      tag: "AF",
      vibe: "antimicótico",
      descripcion: "Activo frente a hongos y levaduras.",
      riesgoBase: 3
    },
    "antiseptico": {
      id: "antiseptico",
      label: "Antiséptico",
      labelLargo: "Antiséptico tópico",
      familia: "antimicrobiano",
      icon: "🧴",
      tag: "AS",
      vibe: "estéril",
      descripcion: "Desinfección de tejido vivo y mucosas.",
      riesgoBase: 1
    },

    // ── ANTIPARASITARIOS ─────────────────────────────────────────────────────
    "antiparasitario-interno": {
      id: "antiparasitario-interno",
      label: "Antiparasitario interno",
      labelLargo: "Antiparasitario endoparasitario",
      familia: "antiparasitario",
      icon: "🪱",
      tag: "API",
      vibe: "endoparásitos",
      descripcion: "Activo contra nematodos, cestodos y trematodos internos.",
      riesgoBase: 2
    },
    "antiparasitario-externo": {
      id: "antiparasitario-externo",
      label: "Antiparasitario externo",
      labelLargo: "Antiparasitario ectoparasitario",
      familia: "antiparasitario",
      icon: "🪰",
      tag: "APE",
      vibe: "ectoparásitos",
      descripcion: "Activo contra pulgas, garrapatas, ácaros y piojos.",
      riesgoBase: 2
    },

    // ── INFLAMACIÓN / DOLOR ──────────────────────────────────────────────────
    "aine": {
      id: "aine",
      label: "AINE",
      labelLargo: "Antiinflamatorio no esteroideo",
      familia: "antiinflamatorio",
      icon: "🔥",
      tag: "AINE",
      vibe: "antiinflamatorio",
      descripcion: "Inhibe COX y prostaglandinas. Analgésico y antipirético.",
      riesgoBase: 3
    },
    "corticoide": {
      id: "corticoide",
      label: "Corticoide",
      labelLargo: "Glucocorticoide",
      familia: "antiinflamatorio",
      icon: "⚡",
      tag: "CORT",
      vibe: "potente",
      descripcion: "Antiinflamatorio esteroidal e inmunosupresor.",
      riesgoBase: 4
    },
    "analgesico": {
      id: "analgesico",
      label: "Analgésico",
      labelLargo: "Analgésico opioide / no opioide",
      familia: "antiinflamatorio",
      icon: "🩹",
      tag: "ANLG",
      vibe: "alivio",
      descripcion: "Control del dolor agudo o crónico.",
      riesgoBase: 3
    },

    // ── SISTEMA NERVIOSO ─────────────────────────────────────────────────────
    "anestesico": {
      id: "anestesico",
      label: "Anestésico",
      labelLargo: "Anestésico general / local",
      familia: "neurologico",
      icon: "💤",
      tag: "ANE",
      vibe: "profundidad",
      descripcion: "Pérdida reversible de consciencia o sensibilidad.",
      riesgoBase: 4
    },
    "sedante": {
      id: "sedante",
      label: "Sedante",
      labelLargo: "Sedante / Tranquilizante",
      familia: "neurologico",
      icon: "🌙",
      tag: "SED",
      vibe: "calma",
      descripcion: "Sedación, relajación muscular y ansiólisis.",
      riesgoBase: 3
    },

    // ── CARDIORRESPIRATORIO ──────────────────────────────────────────────────
    "broncodilatador": {
      id: "broncodilatador",
      label: "Broncodilatador",
      labelLargo: "Broncodilatador / Mucolítico",
      familia: "respiratorio",
      icon: "🫁",
      tag: "BD",
      vibe: "respira",
      descripcion: "Relajación de músculo liso bronquial. Apertura de vías aéreas.",
      riesgoBase: 2
    },
    "cardiovascular": {
      id: "cardiovascular",
      label: "Cardiovascular",
      labelLargo: "Cardiovascular / Diurético",
      familia: "cardiovascular",
      icon: "❤️",
      tag: "CV",
      vibe: "corazón",
      descripcion: "Inotrópicos, vasodilatadores, antiarrítmicos, diuréticos.",
      riesgoBase: 4
    },

    // ── INMUNIDAD ────────────────────────────────────────────────────────────
    "vacuna": {
      id: "vacuna",
      label: "Vacuna",
      labelLargo: "Vacuna / Biológico preventivo",
      familia: "inmunologico",
      icon: "🛡️",
      tag: "VAC",
      vibe: "prevención",
      descripcion: "Inmunización activa o pasiva contra patógenos específicos.",
      riesgoBase: 1
    },
    "inmunomodulador": {
      id: "inmunomodulador",
      label: "Inmunomodulador",
      labelLargo: "Inmunomodulador / Inmunosupresor",
      familia: "inmunologico",
      icon: "🧬",
      tag: "IM",
      vibe: "equilibrio",
      descripcion: "Modula la respuesta inmune sistémica.",
      riesgoBase: 4
    },
    "antihistaminico": {
      id: "antihistaminico",
      label: "Antihistamínico",
      labelLargo: "Antihistamínico H1",
      familia: "inmunologico",
      icon: "🌸",
      tag: "AH",
      vibe: "antialérgico",
      descripcion: "Bloquea receptores H1 de histamina. Antialérgico.",
      riesgoBase: 1
    },

    // ── METABOLISMO / SOPORTE ────────────────────────────────────────────────
    "hormona": {
      id: "hormona",
      label: "Hormona",
      labelLargo: "Hormona / Análogo hormonal",
      familia: "metabolico",
      icon: "⚖️",
      tag: "HOR",
      vibe: "endocrino",
      descripcion: "Hormonas exógenas o análogos terapéuticos.",
      riesgoBase: 3
    },
    "vitamina": {
      id: "vitamina",
      label: "Vitamina",
      labelLargo: "Vitamina / Suplemento",
      familia: "metabolico",
      icon: "☀️",
      tag: "VIT",
      vibe: "vitalidad",
      descripcion: "Suplementación vitamínica y micronutricional.",
      riesgoBase: 1
    },
    "fluidoterapia": {
      id: "fluidoterapia",
      label: "Fluidoterapia",
      labelLargo: "Fluidoterapia / Electrolitos",
      familia: "metabolico",
      icon: "💧",
      tag: "FLU",
      vibe: "hidratación",
      descripcion: "Reposición de líquidos, electrolitos y equilibrio ácido-base.",
      riesgoBase: 2
    }
  };

  // ---------------------------------------------------------------------------
  // 2. FAMILIAS (para agrupación visual en filtros)
  // ---------------------------------------------------------------------------
  const FAMILIAS = {
    "antimicrobiano": { label: "Antimicrobianos", orden: 1 },
    "antiparasitario": { label: "Antiparasitarios", orden: 2 },
    "antiinflamatorio": { label: "Inflamación y dolor", orden: 3 },
    "neurologico": { label: "Sistema nervioso", orden: 4 },
    "respiratorio": { label: "Respiratorio", orden: 5 },
    "cardiovascular": { label: "Cardiovascular", orden: 6 },
    "inmunologico": { label: "Inmunidad", orden: 7 },
    "metabolico": { label: "Metabolismo y soporte", orden: 8 }
  };

  // ---------------------------------------------------------------------------
  // 3. SISTEMA DE RIESGO (1=mínimo, 5=crítico)
  // ---------------------------------------------------------------------------
  const RIESGO_LABELS = {
    1: { label: "Seguro",     color: "verde",    desc: "Bajo perfil de riesgo. Margen terapéutico amplio." },
    2: { label: "Moderado",   color: "amarillo", desc: "Vigilar dosificación y especies sensibles." },
    3: { label: "Atención",   color: "naranja",  desc: "Requiere monitoreo. Posibles efectos adversos relevantes." },
    4: { label: "Alto",       color: "rojo",     desc: "Uso solo bajo prescripción. Toxicidad significativa." },
    5: { label: "Crítico",    color: "rojo-pulsante", desc: "Margen terapéutico estrecho. Riesgo letal." }
  };

  // ---------------------------------------------------------------------------
  // 4. ALERTAS PRECONFIGURADAS (patrones reutilizables)
  // ---------------------------------------------------------------------------
  const ALERTAS = {
    "mdr1": {
      icono: "⚠️",
      titulo: "Sensibilidad MDR1",
      texto: "Peligro mortal en Collies, Pastores Australianos, Border Collies y razas afines. Confirmar genotipo antes de administrar."
    },
    "gestacion": {
      icono: "🤰",
      titulo: "Contraindicado en gestación",
      texto: "Riesgo teratogénico o abortivo. Evitar durante el ciclo gestacional."
    },
    "nefrotoxico": {
      icono: "💧",
      titulo: "Nefrotóxico",
      texto: "Monitorear función renal. Asegurar hidratación. Evitar en pacientes con falla renal preexistente."
    },
    "hepatotoxico": {
      icono: "🧪",
      titulo: "Hepatotóxico",
      texto: "Vigilar enzimas hepáticas en tratamientos prolongados."
    },
    "controlada": {
      icono: "🔒",
      titulo: "Sustancia controlada",
      texto: "Requiere prescripción especial y registro de uso."
    },
    "retiro-alimentos": {
      icono: "🥩",
      titulo: "Tiempo de retiro",
      texto: "Respetar tiempos de retiro en carne, leche o huevos antes de consumo humano."
    }
  };

  // ---------------------------------------------------------------------------
  // 5. INTERACCIONES MEDICAMENTOSAS (pares peligrosos)
  // ---------------------------------------------------------------------------
  const INTERACCIONES = [
    {
      categorias: ["corticoide", "aine"],
      severidad: 4,
      tipo: "incompatible",
      texto: "Riesgo grave de úlcera gástrica y nefrotoxicidad. Nunca combinar."
    },
    {
      categorias: ["aine", "aine"],
      severidad: 4,
      tipo: "incompatible",
      texto: "Dos AINEs simultáneos potencian toxicidad GI y renal sin beneficio terapéutico adicional."
    },
    {
      categorias: ["aine", "cardiovascular"],
      severidad: 2,
      tipo: "precaucion",
      texto: "AINEs pueden reducir eficacia de IECAs y diuréticos. Monitorear función renal."
    },
    {
      categorias: ["corticoide", "vacuna"],
      severidad: 3,
      tipo: "precaucion",
      texto: "Inmunosupresión puede reducir respuesta a vacunas vivas. Esperar 2 semanas tras corticoterapia."
    },
    {
      categorias: ["bactericida", "bacteriostatico"],
      severidad: 2,
      tipo: "precaucion",
      texto: "Antagonismo farmacológico. Bacteriostáticos pueden reducir eficacia de bactericidas dependientes de replicación."
    },
    {
      categorias: ["sedante", "anestesico"],
      severidad: 3,
      tipo: "sinergia",
      texto: "Efecto aditivo: requiere reducir dosis de inducción y monitoreo cardio-respiratorio."
    }
  ];

  // ---------------------------------------------------------------------------
  // 6. API PÚBLICA — HELPERS
  // ---------------------------------------------------------------------------
  const Categorias = {

    /**
     * Obtener configuración de una categoría
     * @returns objeto del registry o categoría default si no existe
     */
    get(id) {
      return REGISTRY[id] || {
        id: "default",
        label: "Sin categoría",
        labelLargo: "Sin categoría",
        familia: "otros",
        icon: "💊",
        tag: "—",
        vibe: "",
        descripcion: "",
        riesgoBase: 0
      };
    },

    /** Listar todas las categorías */
    list() {
      return Object.values(REGISTRY);
    },

    /** Listar categorías de una familia */
    listByFamilia(familiaId) {
      return Object.values(REGISTRY).filter(c => c.familia === familiaId);
    },

    /** Obtener familias ordenadas */
    familias() {
      return Object.entries(FAMILIAS)
        .map(([id, f]) => ({ id, ...f }))
        .sort((a, b) => a.orden - b.orden);
    },

    /**
     * Generar HTML del badge de categoría
     * @param {string} id - id de categoría
     * @param {object} opts - { variant: "soft"|"solid", showLabel: bool }
     */
    badge(id, opts = {}) {
      const cat = this.get(id);
      const variant = opts.variant === "solid" ? "cat-badge-solid" : "";
      const label = opts.showLabel === false ? cat.tag : cat.label;
      return `<span class="cat-badge ${variant}" data-categoria="${cat.id}">
        <span class="cat-badge-icon">${cat.icon}</span>${label}
      </span>`;
    },

    /** Badge mini (solo tag de 2-4 letras) */
    badgeMini(id) {
      const cat = this.get(id);
      return `<span class="cat-badge" data-categoria="${cat.id}" title="${cat.label}">
        ${cat.tag}
      </span>`;
    },

    /** HTML del icono circular */
    iconCircle(id, size = "") {
      const cat = this.get(id);
      const sizeClass = size === "lg" ? "cat-icon-lg" : "";
      return `<span class="cat-icon ${sizeClass}" data-categoria="${cat.id}">${cat.icon}</span>`;
    },

    /** Aplicar atributo de categoría a un elemento DOM */
    applyTo(element, id) {
      if (!element) return;
      const cat = this.get(id);
      element.setAttribute("data-categoria", cat.id);
    },

    /** Indicador de riesgo */
    riesgoBadge(nivel) {
      const lvl = Math.max(1, Math.min(5, nivel || 1));
      const meta = RIESGO_LABELS[lvl];
      const dots = "●".repeat(lvl) + "○".repeat(5 - lvl);
      return `<span class="riesgo-indicator riesgo-${lvl}" title="${meta.desc}">
        <span style="font-size:0.6rem;">${dots}</span>
        ${meta.label}
      </span>`;
    },

    /** Alerta inteligente por clave */
    alerta(claveOArray) {
      const claves = Array.isArray(claveOArray) ? claveOArray : [claveOArray];
      return claves.map(k => {
        const a = ALERTAS[k];
        if (!a) return "";
        return `<div class="cat-alert">
          <span class="cat-alert-icon">${a.icono}</span>
          <div>
            <strong>${a.titulo}:</strong> ${a.texto}
          </div>
        </div>`;
      }).join("");
    },

    /**
     * Detectar interacciones entre dos o más categorías
     * @param {string[]} categoriaIds
     * @returns array de interacciones encontradas
     */
    detectarInteracciones(categoriaIds) {
      const found = [];
      INTERACCIONES.forEach(inter => {
        const [a, b] = inter.categorias;
        if (a === b) {
          // Buscar duplicados
          const count = categoriaIds.filter(c => c === a).length;
          if (count >= 2) found.push(inter);
        } else if (categoriaIds.includes(a) && categoriaIds.includes(b)) {
          found.push(inter);
        }
      });
      return found;
    },

    /** Listas constantes para acceso desde otros módulos */
    REGISTRY,
    FAMILIAS,
    RIESGO_LABELS,
    ALERTAS,
    INTERACCIONES
  };

  // Exponer en namespace global
  window.SuiteVet.Categorias = Categorias;
})();