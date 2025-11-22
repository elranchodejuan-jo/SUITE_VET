document.addEventListener("DOMContentLoaded", () => {
  console.log("Mini-App Veterinaria v2.1 lista 🐾");

  const buttons = document.querySelectorAll(".nav-btn[data-view]");
  const views = document.querySelectorAll(".view");

  const menuToggle = document.querySelector("#menu-toggle");
  const menuPanel = document.querySelector("#menu-panel");

  // -------- FUNCIÓN PARA CAMBIAR DE VISTA --------
  function showView(viewName) {
    views.forEach((v) => {
      v.classList.toggle("view-active", v.id === `view-${viewName}`);
    });

    buttons.forEach((btn) => {
      btn.classList.toggle("nav-active", btn.dataset.view === viewName);
    });

    closeMenu();
  }

  // Botones de navegación (solo Inicio por ahora)
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const viewName = btn.dataset.view;
      showView(viewName);
    });
  });

  // Vista por defecto
  showView("home");

  // -------- MENÚ HAMBURGUESA --------

  function openMenu() {
    if (!menuPanel) return;
    menuPanel.classList.add("menu-panel-open");
    if (menuToggle) menuToggle.classList.add("is-open");
  }

  function closeMenu() {
    if (!menuPanel) return;
    menuPanel.classList.remove("menu-panel-open");
    if (menuToggle) menuToggle.classList.remove("is-open");
  }

  function toggleMenu() {
    if (!menuPanel) return;
    const isOpen = menuPanel.classList.contains("menu-panel-open");
    isOpen ? closeMenu() : openMenu();
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  document.addEventListener("click", (e) => {
    const clickDentroMenu = menuPanel && menuPanel.contains(e.target);
    const clickEnToggle = menuToggle && menuToggle.contains(e.target);
    if (!clickDentroMenu && !clickEnToggle) closeMenu();
  });

  // -------- TARJETAS DE INICIO (FISIO/FARMA) --------
  const homeCards = document.querySelectorAll("[data-go-view]");

  homeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const targetView = card.dataset.goView; // "fisiologia" o "farmacologia"
      showView(targetView);
    });
  });

  // ---------- BASE DE DATOS DE HORMONAS ----------
  // (igual que tu versión anterior)

  const hormonas = [
    // DIGESTIVO
    {
      nombre: "Gastrina",
      sigla: "-",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: células G del antro gástrico. Liberación: sangre portal → estómago y páncreas.",
      funcionPrincipal: "Estimula secreción de HCl y motilidad gástrica.",
      funcionSecundaria: "Estimula crecimiento de mucosa gástrica.",
      patologia:
        "↑: úlceras, hiperacidez. ↓: hipoclorhidria, mala digestión.",
      especieVariacion:
        "Rumiantes: modulada por tipo de dieta (fibra vs concentrado).",
      afeccionesFarmaco:
        "IBP (omeprazol) y anti-H2 reducen su efecto; AINEs favorecen daño gástrico."
    },
    {
      nombre: "Secretina",
      sigla: "-",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: células S del duodeno. Liberación: sangre → páncreas e hígado.",
      funcionPrincipal:
        "Estimula secreción de bicarbonato pancreático y biliar.",
      funcionSecundaria:
        "Inhibe vaciamiento gástrico y secreción de gastrina.",
      patologia:
        "↓: duodenitis, lesión mucosa. ↑ rara: diarrea acuosa (tumores).",
      especieVariacion:
        "Respuesta más marcada en monogástricos que en rumiantes.",
      afeccionesFarmaco: "Análogos de somatostatina inhiben su liberación."
    },
    {
      nombre: "Colecistoquinina",
      sigla: "CCK",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: células I duodenales. Liberación: sangre → páncreas y vesícula biliar.",
      funcionPrincipal:
        "Contracción de vesícula biliar y secreción de enzimas pancreáticas.",
      funcionSecundaria:
        "Participa en sensación de saciedad y regula vaciamiento gástrico.",
      patologia:
        "↓: mala digestión de grasas. ↑: cólicos biliares, dolor postprandial.",
      especieVariacion:
        "Carnívoros responden intensamente a dietas ricas en grasa.",
      afeccionesFarmaco: "Opioides alteran motilidad biliar e intestinal."
    },
    {
      nombre: "Grelina",
      sigla: "-",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: estómago (células oxínticas) principalmente. Liberación: sangre sistémica.",
      funcionPrincipal:
        "Estimula el apetito y aumenta la motilidad gástrica.",
      funcionSecundaria:
        "Modula secreción de GH y metabolismo energético.",
      patologia: "↑: hiperfagia, obesidad. ↓: anorexia, pérdida de peso.",
      especieVariacion:
        "En perros y gatos se relaciona con obesidad; en rumiantes con balance energético.",
      afeccionesFarmaco:
        "Corticoides y algunos psicofármacos alteran el apetito y su acción."
    },
    {
      nombre: "Péptido YY",
      sigla: "PYY",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: íleon y colon distal. Liberación: sangre posprandial.",
      funcionPrincipal:
        "Disminuye apetito y motilidad intestinal (efecto saciante).",
      funcionSecundaria:
        "Regula vaciamiento gástrico y tránsito intestinal.",
      patologia: "↑: hiporexia, pérdida de peso. ↓: hiperfagia.",
      especieVariacion:
        "Secreción modulada por tipo de dieta (fibra vs grasas).",
      afeccionesFarmaco:
        "Opioides, procinéticos y otros fármacos que modifican motilidad alteran su acción."
    },
    {
      nombre: "Motilina",
      sigla: "-",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: células endocrinas del intestino delgado. Liberación: sangre en fase interdigestiva.",
      funcionPrincipal:
        "Estimula complejos motores migratorios (motilidad en ayuno).",
      funcionSecundaria:
        "Coordina tránsito entre estómago e intestino.",
      patologia: "↓: íleo, hipomotilidad. ↑: hipermotilidad, cólicos.",
      especieVariacion:
        "Muy importante en equinos y pequeños animales; patrón particular en rumiantes.",
      afeccionesFarmaco:
        "Macrólidos (eritromicina) actúan como agonistas de motilina (procinéticos)."
    },
    {
      nombre: "Somatostatina entérica",
      sigla: "SST",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: células D gástricas, intestinales y páncreas. Liberación: local y sistémica.",
      funcionPrincipal:
        "Inhibe secreción de HCl y de otras hormonas digestivas.",
      funcionSecundaria:
        "Disminuye motilidad intestinal y flujo esplácnico.",
      patologia:
        "↑: hipoclorhidria, mala digestión. ↓: hipersecreción ácida.",
      especieVariacion: "Papel modulador importante en varias especies.",
      afeccionesFarmaco:
        "Análogos (octreótido) se usan en hipersecreciones."
    },
    {
      nombre: "GLP-1 (Péptido similar al glucagón-1)",
      sigla: "GLP-1",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      origenLiberacion:
        "Producción: células L de íleon y colon. Liberación: sangre portal.",
      funcionPrincipal:
        "Estimula secreción de insulina y reduce vaciamiento gástrico.",
      funcionSecundaria: "Contribuye a sensación de saciedad.",
      patologia:
        "↓: intolerancia a glucosa. ↑: riesgo de hipoglucemia en ciertas condiciones.",
      especieVariacion:
        "En perros y gatos se estudia en obesidad y diabetes.",
      afeccionesFarmaco:
        "Análogos de GLP-1 (uso humano) modulan glucemia y peso."
    },

    // RESPIRATORIO / CARDÍACO
    {
      nombre: "Adrenalina (Epinefrina)",
      sigla: "Epi",
      sistema: "Respiratorio/Cardíaco",
      sistemaKey: "respiratorio-cardiaco",
      origenLiberacion:
        "Producción: médula suprarrenal. Liberación: circulación sistémica.",
      funcionPrincipal:
        "Broncodilatación, aumento de frecuencia y fuerza cardiaca.",
      funcionSecundaria:
        "Moviliza glucosa y ácidos grasos (respuesta a estrés agudo).",
      patologia:
        "↑ crónica: cardiomiopatías, taquiarritmias. ↓: shock no compensado.",
      especieVariacion:
        "Caballos y gatos suelen ser muy sensibles a su efecto.",
      afeccionesFarmaco:
        "Uso en anafilaxia y paro cardiaco; sobredosis causa arritmias graves."
    },
    {
      nombre: "Noradrenalina (Norepinefrina)",
      sigla: "NE",
      sistema: "Respiratorio/Cardíaco",
      sistemaKey: "respiratorio-cardiaco",
      origenLiberacion:
        "Producción: terminaciones simpáticas y médula suprarrenal. Liberación: sinapsis y sangre.",
      funcionPrincipal:
        "Vasoconstricción periférica y aumento de presión arterial.",
      funcionSecundaria:
        "Modula tono simpático y respuesta al estrés.",
      patologia:
        "↑ crónica: hipertensión, daño vascular. ↓: hipotensión grave.",
      especieVariacion:
        "Variaciones de sensibilidad entre especies y razas.",
      afeccionesFarmaco:
        "Simpaticomiméticos y antidepresivos tricíclicos alteran su recaptación/acción."
    },

    // CARDÍACO / CIRCULATORIO
    {
      nombre: "Angiotensina II",
      sigla: "Ang II",
      sistema: "Cardíaco/Circulatorio",
      sistemaKey: "cardiaco-circulatorio",
      origenLiberacion:
        "Producción: a partir de angiotensina I por ECA (pulmón, endotelio). Liberación: sangre.",
      funcionPrincipal:
        "Vasoconstrictor potente; eleva presión arterial.",
      funcionSecundaria:
        "Estimula secreción de aldosterona y ADH.",
      patologia:
        "↑: hipertensión, daño cardiaco y renal. ↓: hipotensión, hipoperfusión.",
      especieVariacion:
        "Sistema muy relevante en perros y gatos con cardiopatías y nefropatías.",
      afeccionesFarmaco:
        "IECA (enalapril, benazepril) y ARA-II bloquean su formación/acción."
    },
    {
      nombre: "Péptido Natriurético Auricular",
      sigla: "ANP",
      sistema: "Cardíaco/Circulatorio",
      sistemaKey: "cardiaco-circulatorio",
      origenLiberacion:
        "Producción: aurícula cardiaca. Liberación: sangre cuando hay distensión auricular.",
      funcionPrincipal:
        "Favorece natriuresis y disminución de presión arterial.",
      funcionSecundaria:
        "Contrarregula sistema renina-angiotensina-aldosterona.",
      patologia:
        "↓: retención de sodio/agua. ↑: marcador de insuficiencia cardiaca.",
      especieVariacion:
        "Niveles plasmáticos útiles como biomarcador en perros y gatos.",
      afeccionesFarmaco:
        "Complementa efecto de diuréticos y vasodilatadores en terapia cardiaca."
    },
    {
      nombre: "Péptido Natriurético Cerebral",
      sigla: "BNP",
      sistema: "Cardíaco/Circulatorio",
      sistemaKey: "cardiaco-circulatorio",
      origenLiberacion:
        "Producción: ventrículos cardiacos. Liberación: sangre por estiramiento ventricular.",
      funcionPrincipal:
        "Favorece natriuresis y diuresis, disminuyendo carga de volumen.",
      funcionSecundaria: "Indicador de distensión ventricular.",
      patologia:
        "↑: insuficiencia cardiaca congestiva. ↓: menor capacidad compensatoria.",
      especieVariacion:
        "NT-proBNP se mide como prueba diagnóstica en pequeños animales.",
      afeccionesFarmaco:
        "Tratamientos con IECA, pimobendan y diuréticos reducen su elevación patológica."
    },
    {
      nombre: "Aldosterona",
      sigla: "-",
      sistema: "Cardíaco/Circulatorio",
      sistemaKey: "cardiaco-circulatorio",
      origenLiberacion:
        "Producción: zona glomerulosa de corteza suprarrenal. Liberación: sangre.",
      funcionPrincipal:
        "Aumenta reabsorción de sodio y agua, excreción de potasio.",
      funcionSecundaria: "Participa en equilibrio ácido-base.",
      patologia:
        "↑: hiperaldosteronismo, hipertensión, hipopotasemia. ↓: enfermedad de Addison.",
      especieVariacion:
        "En gatos se describe hiperaldosteronismo primario; en perros, Addison.",
      afeccionesFarmaco:
        "IECA y espironolactona bloquean su acción; diuréticos la modulan."
    },

    // NERVIOSO / NEUROENDOCRINO
    {
      nombre: "Dopamina",
      sigla: "DA",
      sistema: "Nervioso/Neuroendocrino",
      sistemaKey: "nervioso-neuroendocrino",
      origenLiberacion:
        "Producción: neuronas dopaminérgicas (SNC) y células renales. Liberación: sinapsis y circulación local.",
      funcionPrincipal:
        "Neurotransmisor que regula movimiento, conducta y prolactina.",
      funcionSecundaria:
        "Modula presión arterial y flujo renal.",
      patologia:
        "↓: trastornos motores, hiperprolactinemia. ↑: estereotipias, conductas anormales.",
      especieVariacion:
        "Sensibilidad dopaminérgica variable entre especies (equinos muy sensibles).",
      afeccionesFarmaco:
        "Agonistas (cabergolina) inhiben prolactina; antagonistas (metoclopramida) la aumentan."
    },
    {
      nombre: "Serotonina",
      sigla: "5-HT",
      sistema: "Nervioso/Neuroendocrino",
      sistemaKey: "nervioso-neuroendocrino",
      origenLiberacion:
        "Producción: neuronas del SNC y células enterocromafines. Liberación: sinapsis y mucosa intestinal.",
      funcionPrincipal:
        "Regula estado de ánimo, apetito y motilidad intestinal.",
      funcionSecundaria:
        "Influye en percepción del dolor y comportamiento.",
      patologia:
        "↑: síndrome serotoninérgico. ↓: depresión, alteraciones del sueño/apetito.",
      especieVariacion:
        "Especies difieren en tipo y distribución de receptores.",
      afeccionesFarmaco:
        "ISRS, tricíclicos y algunos analgésicos modulan su recaptación o liberación."
    },
    {
      nombre: "Oxitocina",
      sigla: "OT",
      sistema: "Nervioso/Neuroendocrino",
      sistemaKey: "nervioso-neuroendocrino",
      origenLiberacion:
        "Producción: núcleos supraóptico y paraventricular. Liberación: neurohipófisis.",
      funcionPrincipal:
        "Provoca contracciones uterinas y eyección de leche.",
      funcionSecundaria:
        "Modula conducta social y maternal.",
      patologia:
        "↓: inercia uterina, agalactia. ↑: riesgo de ruptura uterina si se abusa.",
      especieVariacion:
        "Usada en bovinos, equinos, perros y gatos en manejo obstétrico.",
      afeccionesFarmaco:
        "Oxitocina sintética es fármaco clave en partos."
    },
    {
      nombre: "Vasopresina (ADH)",
      sigla: "ADH / AVP",
      sistema: "Nervioso/Neuroendocrino",
      sistemaKey: "nervioso-neuroendocrino",
      origenLiberacion:
        "Producción: núcleos supraóptico y paraventricular. Liberación: neurohipófisis.",
      funcionPrincipal: "Aumenta reabsorción de agua en riñón.",
      funcionSecundaria: "Vasoconstricción en altas concentraciones.",
      patologia:
        "↓: diabetes insípida. ↑: intoxicación hídrica, hiponatremia.",
      especieVariacion:
        "Perros y gatos: formas central y nefrogénica.",
      afeccionesFarmaco:
        "Desmopresina es análogo terapéutico; diuréticos la contrarrestan."
    },

    // RENAL
    {
      nombre: "Eritropoyetina",
      sigla: "EPO",
      sistema: "Renal",
      sistemaKey: "renal",
      origenLiberacion:
        "Producción: células peritubulares renales. Liberación: sangre.",
      funcionPrincipal: "Estimula producción de eritrocitos.",
      funcionSecundaria: "Adecuación del transporte de oxígeno.",
      patologia: "↓: anemia por ERC. ↑ exógena: policitemia.",
      especieVariacion:
        "Perros y gatos con ERC tienen déficit relativo de EPO.",
      afeccionesFarmaco:
        "EPO recombinante puede inducir anticuerpos."
    },

    // RENAL / METABÓLICO
    {
      nombre: "Hormona Paratiroidea",
      sigla: "PTH",
      sistema: "Renal/Metabólico",
      sistemaKey: "renal-metabolico",
      origenLiberacion:
        "Producción: paratiroides. Liberación: sangre.",
      funcionPrincipal:
        "Aumenta calcio sanguíneo y excreción renal de fósforo.",
      funcionSecundaria:
        "Actúa sobre hueso e intestino (vía calcitriol).",
      patologia:
        "↑: hiperparatiroidismo, osteodistrofia. ↓: hipocalcemia, tetania.",
      especieVariacion:
        "Hipocalcemia puerperal en rumiantes se relaciona con su dinámica.",
      afeccionesFarmaco:
        "Vitamina D, calcimiméticos y quelantes de fósforo la modulan."
    },

    // REPRODUCTIVO (algunas clave)
    {
      nombre: "Progesterona",
      sigla: "P4",
      sistema: "Reproductivo",
      sistemaKey: "reproductivo",
      origenLiberacion:
        "Producción: cuerpo lúteo y placenta. Liberación: sangre.",
      funcionPrincipal: "Mantiene gestación y fase lútea.",
      funcionSecundaria: "Modula conducta y tono uterino.",
      patologia:
        "↓: abortos, falla de implantación. ↑ crónico: riesgo de piometra y quistes.",
      especieVariacion:
        "En perra hay diestro prolongado con niveles altos de P4.",
      afeccionesFarmaco:
        "Progestágenos sintéticos se usan en sincronización de celo y control reproductivo."
    },
    {
      nombre: "Estradiol",
      sigla: "E2",
      sistema: "Reproductivo",
      sistemaKey: "reproductivo",
      origenLiberacion:
        "Producción: folículos ováricos. Liberación: sangre.",
      funcionPrincipal:
        "Regula ciclo estral y caracteres sexuales femeninos.",
      funcionSecundaria:
        "Influye en comportamiento de celo y tono uterino.",
      patologia:
        "↑: hiperestrogenismo, aplasia medular. ↓: anestro.",
      especieVariacion:
        "Gatas poliéstricas estacionales; patrón depende de especie y fotoperiodo.",
      afeccionesFarmaco:
        "Uso inadecuado como abortivo es muy peligroso."
    },
    {
      nombre: "Testosterona",
      sigla: "T",
      sistema: "Reproductivo",
      sistemaKey: "reproductivo",
      origenLiberacion:
        "Producción: células de Leydig. Liberación: sangre.",
      funcionPrincipal:
        "Desarrollo sexual masculino y espermatogénesis.",
      funcionSecundaria: "Efecto anabólico proteico.",
      patologia:
        "↑: agresividad, hiperplasia prostática. ↓: infertilidad, baja libido.",
      especieVariacion:
        "Castración elimina su producción; criptorquidia la altera.",
      afeccionesFarmaco:
        "Esteroides anabólicos exógenos suprimen eje gonadal."
    },

    // ENDOCRINO / METABÓLICO
    {
      nombre: "Insulina",
      sigla: "-",
      sistema: "Endocrino/Metabólico",
      sistemaKey: "endocrino-metabolico",
      origenLiberacion:
        "Producción: células β pancreáticas. Liberación: sangre portal.",
      funcionPrincipal: "Disminuye glucosa sanguínea.",
      funcionSecundaria:
        "Estimula almacenamiento de grasa y síntesis proteica.",
      patologia:
        "↓: diabetes mellitus. ↑: hipoglucemia.",
      especieVariacion:
        "Diabetes felina difiere de la canina en fisiopatología.",
      afeccionesFarmaco:
        "Insulina exógena es tratamiento; corticoides y progestágenos inducen resistencia."
    },
    {
      nombre: "Glucagón",
      sigla: "-",
      sistema: "Endocrino/Metabólico",
      sistemaKey: "endocrino-metabolico",
      origenLiberacion:
        "Producción: células α pancreáticas. Liberación: sangre portal.",
      funcionPrincipal: "Aumenta glucosa sanguínea.",
      funcionSecundaria:
        "Favorece lipólisis y cetogénesis.",
      patologia:
        "↓: mayor riesgo de hipoglucemia. ↑: agrava diabetes.",
      especieVariacion:
        "Respuesta depende de reservas de glucógeno según especie.",
      afeccionesFarmaco:
        "Incretinas y fármacos hipoglucemiantes modulan su acción."
    },
    {
      nombre: "Cortisol",
      sigla: "-",
      sistema: "Endocrino/Metabólico",
      sistemaKey: "endocrino-metabolico",
      origenLiberacion:
        "Producción: zona fasciculada de corteza suprarrenal. Liberación: sangre.",
      funcionPrincipal:
        "Hormona del estrés; moviliza energía y es antiinflamatorio.",
      funcionSecundaria:
        "Modula inmunidad y presión arterial.",
      patologia: "↑: Cushing. ↓: Addison.",
      especieVariacion:
        "Perros: Cushing frecuente; caballos: síndromes relacionados con insulina.",
      afeccionesFarmaco:
        "Glucocorticoides sintéticos imitan su acción; retiro brusco es peligroso."
    },
    {
      nombre: "Tiroxina",
      sigla: "T4",
      sistema: "Endocrino/Metabólico",
      sistemaKey: "endocrino-metabolico",
      origenLiberacion:
        "Producción: tiroides. Liberación: sangre.",
      funcionPrincipal: "Aumenta metabolismo basal.",
      funcionSecundaria:
        "Influye en crecimiento y termorregulación.",
      patologia: "↓: hipotiroidismo. ↑: hipertiroidismo.",
      especieVariacion:
        "Perros: hipotiroidismo; gatos: hipertiroidismo geriátrico.",
      afeccionesFarmaco:
        "Levotiroxina, metimazol y yodo radiactivo modifican su nivel."
    },

    // INMUNOLÓGICO
    {
      nombre: "Interleucina-1",
      sigla: "IL-1",
      sistema: "Inmunológico",
      sistemaKey: "inmunologico",
      origenLiberacion:
        "Producción: macrófagos, monocitos y otras células inmunes. Liberación: tejidos y sangre.",
      funcionPrincipal: "Citocina proinflamatoria, induce fiebre.",
      funcionSecundaria: "Estimula proteínas de fase aguda.",
      patologia:
        "↑: sepsis, SIRS. ↓: menor respuesta inmune.",
      especieVariacion:
        "Respuesta depende de especie y tipo de infección.",
      afeccionesFarmaco:
        "AINEs y corticoides disminuyen sus efectos clínicos."
    },
    {
      nombre: "Interleucina-6",
      sigla: "IL-6",
      sistema: "Inmunológico",
      sistemaKey: "inmunologico",
      origenLiberacion:
        "Producción: macrófagos, células endoteliales, fibroblastos. Liberación: sangre.",
      funcionPrincipal: "Citocina clave de fase aguda.",
      funcionSecundaria:
        "Estimula síntesis hepática de proteínas de fase aguda.",
      patologia:
        "↑: inflamación crónica, SIRS. ↓: menor respuesta a infecciones.",
      especieVariacion: "Biomarcador útil en infecciones graves.",
      afeccionesFarmaco:
        "Corticoides y otros inmunosupresores la reducen."
    },
    {
      nombre: "Factor de necrosis tumoral alfa",
      sigla: "TNF-α",
      sistema: "Inmunológico",
      sistemaKey: "inmunologico",
      origenLiberacion:
        "Producción: macrófagos, linfocitos T. Liberación: tejidos y sangre.",
      funcionPrincipal:
        "Citocina clave en inflamación y sepsis.",
      funcionSecundaria:
        "Participa en apoptosis y defensa antitumoral.",
      patologia:
        "↑: shock séptico, caquexia. ↓: susceptibilidad a infecciones.",
      especieVariacion:
        "Niveles altos en infecciones graves en varias especies.",
      afeccionesFarmaco:
        "AINEs, corticoides e inmunomoduladores reducen su efecto."
    },

    // ÓSEO / PIEL
    {
      nombre: "Hormona Estimulante de Melanocitos",
      sigla: "MSH",
      sistema: "Óseo/Piel",
      sistemaKey: "oseo-piel",
      origenLiberacion:
        "Producción: hipófisis intermedia. Liberación: sangre.",
      funcionPrincipal: "Regula pigmentación cutánea.",
      funcionSecundaria:
        "Puede influir en apetito y comportamiento.",
      patologia:
        "↑: hiperpigmentación. ↓: despigmentación.",
      especieVariacion: "Niveles alterados en PPID equino.",
      afeccionesFarmaco:
        "Fármacos que actúan sobre hipófisis pueden modificarla."
    }
  ];

  // ---------- BASE DE DATOS DE VITAMINAS ----------

  const vitaminas = [
    {
      nombre: "Vitamina A",
      sigla: "A",
      tipo: "Liposoluble",
      tipoKey: "liposoluble",
      otrosNombres: "Retinol, β-carotenos",
      funcion:
        "Visión (rodopsina), mantenimiento de epitelios, reproducción y crecimiento óseo.",
      hipovitaminosis:
        "Ceguera nocturna, xeroftalmia, queratinización de epitelios, retraso del crecimiento, infertilidad.",
      hipervitaminosis:
        "Malformaciones óseas, hepatopatías, anorexia, pérdida de peso, teratogénesis en terneros y corderos.",
      variacionEspecies:
        "Muy relevante en bovinos y aves en sistemas intensivos; en carnívoros se asocia a dietas caseras desequilibradas.",
      afeccionesFarmaco:
        "Déficit aumenta infecciones respiratorias/digestivas; sobredosis potencia hepatotoxicidad de otros fármacos."
    },
    {
      nombre: "Vitamina D2",
      sigla: "D2",
      tipo: "Liposoluble",
      tipoKey: "liposoluble",
      otrosNombres: "Ergocalciferol",
      funcion:
        "Regula metabolismo calcio-fósforo, aumenta absorción intestinal y mineralización ósea.",
      hipovitaminosis:
        "Raquitismo en jóvenes, osteomalacia en adultos, debilidad muscular, fracturas patológicas.",
      hipervitaminosis:
        "Hipercalcemia, calcificación metastásica de tejidos blandos, vómitos, poliuria/polidipsia.",
      variacionEspecies:
        "Rumiantes y equinos aprovechan bien D2 de forrajes; en aves y porcinos su potencia es menor que D3.",
      afeccionesFarmaco:
        "Se suplementa con calcio; glucocorticoides crónicos y anticonvulsivantes pueden reducir su eficacia."
    },
    {
      nombre: "Vitamina D3",
      sigla: "D3",
      tipo: "Liposoluble",
      tipoKey: "liposoluble",
      otrosNombres: "Colecalciferol",
      funcion:
        "Principal forma activa en aves y monogástricos; regula Ca y P, y calidad de hueso y cáscara.",
      hipovitaminosis:
        "Raquitismo, huesos blandos, mala calidad de cáscara, hipocalcemia posparto.",
      hipervitaminosis:
        "Hipercalcemia grave, calcificación renal y vascular, fallo renal (incluida intoxicación por rodenticidas con D3).",
      variacionEspecies:
        "Clave en pollos y ponedoras; en vacas lecheras preparto contribuye a prevenir hipocalcemia si está en niveles adecuados.",
      afeccionesFarmaco:
        "Se usa junto con calcio en hipocalcemia; riesgo de hipercalcemia aumenta con diuréticos tiazídicos."
    },
    {
      nombre: "Vitamina K1",
      sigla: "K1",
      tipo: "Liposoluble",
      tipoKey: "liposoluble",
      otrosNombres: "Filoquinona",
      funcion:
        "Cofactor en la carboxilación de factores de coagulación II, VII, IX, X y proteínas C/S.",
      hipovitaminosis:
        "Coagulación deficiente, hemorragias, tiempos de protrombina prolongados.",
      hipervitaminosis:
        "Toxicidad muy baja en dosis terapéuticas.",
      variacionEspecies:
        "Crítica en perros y gatos intoxicados con rodenticidas; importante en aves intensivas.",
      afeccionesFarmaco:
        "Antídoto específico frente a warfarina y otros cumarínicos; antibióticos que alteran flora reducen su disponibilidad."
    },
    {
      nombre: "Vitamina K2",
      sigla: "K2",
      tipo: "Liposoluble",
      tipoKey: "liposoluble",
      otrosNombres: "Menaquinonas",
      funcion:
        "Participa en coagulación y metabolismo óseo y vascular (osteocalcina y proteínas de matriz).",
      hipovitaminosis:
        "Rara por síntesis intestinal; cuando aparece se manifiesta como hemorragias generalizadas.",
      hipervitaminosis:
        "Toxicidad muy baja; el exceso se excreta por bilis.",
      variacionEspecies:
        "Muy relevante en rumiantes con alteración de flora ruminal (acidosis, antibióticos prolongados).",
      afeccionesFarmaco:
        "Antibióticos de amplio espectro y enteropatías disminuyen su síntesis y potencian riesgo hemorrágico."
    },
    {
      nombre: "Vitamina K3",
      sigla: "K3",
      tipo: "Liposoluble",
      tipoKey: "liposoluble",
      otrosNombres: "Menadiona",
      funcion:
        "Forma sintética estable usada en premezclas; se transforma en formas activas de vitamina K.",
      hipovitaminosis:
        "Si la premezcla es insuficiente: hemorragias, anemia, mayor mortalidad en pollos.",
      hipervitaminosis:
        "Anemia hemolítica, metahemoglobinemia, ictericia y daño hepato-renal, sobre todo en perros, caballos y neonatos.",
      variacionEspecies:
        "Uso habitual en aves y porcinos; no recomendada en perros y gatos como suplemento rutinario.",
      afeccionesFarmaco:
        "No se utiliza como antídoto de elección en intoxicaciones por warfarina."
    },
    {
      nombre: "Vitamina E",
      sigla: "E",
      tipo: "Liposoluble",
      tipoKey: "liposoluble",
      otrosNombres: "Tocoferoles",
      funcion:
        "Antioxidante lipídico; protege membranas celulares, músculo y sistema inmune.",
      hipovitaminosis:
        "Distrofia muscular nutricional, encefalomalacia en pollos, retención de placenta en bovinos.",
      hipervitaminosis:
        "Rara; dosis muy altas pueden interferir levemente con la coagulación.",
      variacionEspecies:
        "Muy importante en rumiantes y ovinos en pastos pobres en vitamina E/selenio; también en pollos de engorde.",
      afeccionesFarmaco:
        "Actúa en sinergia con selenio; su déficit aumenta sensibilidad a miopatías y estrés oxidativo inducido por fármacos."
    },
    {
      nombre: "Vitamina B1",
      sigla: "B1",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Tiamina",
      funcion:
        "Cofactor en metabolismo de carbohidratos (piruvato → acetil-CoA) y función neurológica.",
      hipovitaminosis:
        "Polioencefalomalacia en rumiantes, anorexia, ataxia, convulsiones, debilidad.",
      hipervitaminosis:
        "Toxicidad muy rara; exceso se elimina por orina.",
      variacionEspecies:
        "Crítica en rumiantes con dietas altas en concentrado o plantas con tiaminasas.",
      afeccionesFarmaco:
        "Se usa como coadyuvante en polioencefalomalacia y cuadros neurológicos carenciales."
    },
    {
      nombre: "Vitamina B2",
      sigla: "B2",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Riboflavina",
      funcion:
        "Componente de coenzimas FAD y FMN en reacciones REDOX mitocondriales.",
      hipovitaminosis:
        "Estomatitis, dermatitis, retraso en crecimiento, lesiones cutáneas en aves y porcinos.",
      hipervitaminosis:
        "No suele haber toxicidad; exceso urinario.",
      variacionEspecies:
        "Importante en aves y porcinos intensivos.",
      afeccionesFarmaco:
        "Deficiencia puede modificar metabolismo de fármacos dependientes de sistemas oxidativos."
    },
    {
      nombre: "Vitamina B3",
      sigla: "B3",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Niacina, ácido nicotínico, nicotinamida",
      funcion:
        "Parte de NAD⁺/NADP⁺ en metabolismo energético de carbohidratos, lípidos y proteínas.",
      hipovitaminosis:
        "Síndrome tipo pelagra en cerdos y aves (dermatitis, diarrea, pérdida de peso).",
      hipervitaminosis:
        "Vasodilatación (rubor), hipotensión y posible daño hepático en dosis altas.",
      variacionEspecies:
        "Relevante en porcinos y aves; rumiantes la sintetizan parcialmente en rumen.",
      afeccionesFarmaco:
        "Usada ocasionalmente como modulador lipídico; a dosis altas requiere control hepático."
    },
    {
      nombre: "Vitamina B5",
      sigla: "B5",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Ácido pantoténico",
      funcion:
        "Componente de coenzima A; clave en metabolismo de lípidos y carbohidratos.",
      hipovitaminosis:
        "Dermatitis, alopecia, retraso en crecimiento, alteraciones neurológicas en pollos.",
      hipervitaminosis:
        "No se describen intoxicaciones significativas.",
      variacionEspecies:
        "Aves son las más sensibles al déficit.",
      afeccionesFarmaco:
        "Deficiencia podría alterar metabolismo de fármacos lipofílicos."
    },
    {
      nombre: "Vitamina B6",
      sigla: "B6",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Piridoxina, piridoxamina, piridoxal",
      funcion:
        "Metabolismo de aminoácidos y neurotransmisores; participa en síntesis de hemoglobina.",
      hipovitaminosis:
        "Convulsiones, anemia microcítica, dermatitis, retraso en crecimiento.",
      hipervitaminosis:
        "Neurotoxicidad periférica en dosis muy altas.",
      variacionEspecies:
        "Relevante en dietas basadas en subproductos vegetales o tratamientos prolongados con ciertos fármacos.",
      afeccionesFarmaco:
        "Se usa como suplemento neurometabólico y coadyuvante en anemias."
    },
    {
      nombre: "Vitamina B7",
      sigla: "B7",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Biotina, vitamina H",
      funcion:
        "Cofactor en carboxilasas del metabolismo de lípidos y carbohidratos.",
      hipovitaminosis:
        "Dermatitis seca, alopecia, pezuñas frágiles en bovinos y equinos.",
      hipervitaminosis:
        "No se reporta toxicidad relevante.",
      variacionEspecies:
        "Muy usada en vacas lecheras y caballos para mejorar pezuña/casco.",
      afeccionesFarmaco:
        "Componente típico de suplementos para piel y anexos."
    },
    {
      nombre: "Vitamina B8",
      sigla: "B8",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Inositol",
      funcion:
        "Relacionado con señalización celular (fosfatidilinositol) y metabolismo de lípidos hepáticos.",
      hipovitaminosis:
        "Trastornos de crecimiento, hígado graso en aves.",
      hipervitaminosis:
        "Rara vez tóxica.",
      variacionEspecies:
        "Importante en aves de engorde con dietas altas en energía.",
      afeccionesFarmaco:
        "Se incluye en premezclas; coadyuvante en hígado graso nutricional."
    },
    {
      nombre: "Vitamina B9",
      sigla: "B9",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Ácido fólico, folacina",
      funcion:
        "Síntesis de nucleótidos y división celular; clave en hematopoyesis y gestación.",
      hipovitaminosis:
        "Anemia megaloblástica, infertilidad, retraso en crecimiento.",
      hipervitaminosis:
        "Rara; exceso puede enmascarar déficit de B12.",
      variacionEspecies:
        "Importante en hembras gestantes y jóvenes en crecimiento rápido.",
      afeccionesFarmaco:
        "Interactúa con antagonistas del folato (sulfonamidas, trimetoprim)."
    },
    {
      nombre: "Vitamina B12",
      sigla: "B12",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Cobalamina",
      funcion:
        "Síntesis de ADN y metabolismo de ácidos grasos; muy ligada al cobalto en rumiantes.",
      hipovitaminosis:
        "Anemia megaloblástica, retraso en crecimiento, neuropatías; en rumiantes, déficit por falta de cobalto.",
      hipervitaminosis:
        "Muy rara; exceso se elimina fácilmente.",
      variacionEspecies:
        "Crítica en rumiantes de suelos pobres en cobalto; también en animales con malabsorción intestinal.",
      afeccionesFarmaco:
        "Se combina con hierro y folato en tratamientos de anemia."
    },
    {
      nombre: "Vitamina C",
      sigla: "C",
      tipo: "Hidrosoluble",
      tipoKey: "hidrosoluble",
      otrosNombres: "Ácido ascórbico",
      funcion:
        "Antioxidante; cofactor para síntesis de colágeno y favorece absorción de hierro.",
      hipovitaminosis:
        "Escorbuto en cobayos, primates y algunas aves ornamentales: hemorragias, dolor articular, mala cicatrización.",
      hipervitaminosis:
        "Rara; puede causar diarrea y favorecer cálculos renales de oxalato en dosis muy altas.",
      variacionEspecies:
        "La mayoría de animales domésticos la sintetizan en hígado; cobayos y primates requieren aporte dietético.",
      afeccionesFarmaco:
        "Se usa como antioxidante y coadyuvante inmunitario; puede acidificar ligeramente la orina."
    }
  ];

  // ---------- LÓGICA DE HORMONAS (BUSCADOR + FILTRO) ----------

  const hormonasListEl = document.querySelector("#hormonasList");
  const searchHormonaEl = document.querySelector("#searchHormona");
  const filtroBtns = document.querySelectorAll(".pill-btn[data-sistema]");

  let filtroSistemaKey = "todos";

  function crearTarjetaHormona(h) {
    const sistemaClass = h.sistemaKey ? `card-sistema-${h.sistemaKey}` : "";
    return `
      <article class="card-hormona ${sistemaClass}">
        <div class="card-hormona-header">
          <div class="card-hormona-nombre">${h.nombre}</div>
          <div class="card-hormona-sigla">Sigla: ${h.sigla || "—"}</div>
          <span class="badge-sistema">${h.sistema}</span>
        </div>

        <p><span>Origen y liberación:</span> ${h.origenLiberacion}</p>
        <p><span>Función principal:</span> ${h.funcionPrincipal}</p>
        <p><span>Función secundaria:</span> ${h.funcionSecundaria}</p>
        <p><span>Patología por déficit / exceso:</span> ${h.patologia}</p>

        <div class="card-hormona-footer">
          <p><span>Especie con variaciones:</span> ${h.especieVariacion}</p>
          <p><span>Afecciones farmacológicas:</span> ${h.afeccionesFarmaco}</p>
        </div>
      </article>
    `;
  }

  function renderHormonas() {
    if (!hormonasListEl) return;

    const texto = (searchHormonaEl?.value || "").trim().toLowerCase();

    const filtradas = hormonas.filter((h) => {
      const pasaSistema =
        filtroSistemaKey === "todos" || h.sistemaKey === filtroSistemaKey;

      const base = `${h.nombre} ${h.sigla} ${h.sistema}`.toLowerCase();
      const pasaTexto = !texto || base.includes(texto);

      return pasaSistema && pasaTexto;
    });

    if (filtradas.length === 0) {
      hormonasListEl.innerHTML =
        "<p>No se encontraron hormonas para los filtros seleccionados.</p>";
      return;
    }

    hormonasListEl.innerHTML = filtradas.map(crearTarjetaHormona).join("");
  }

  filtroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroBtns.forEach((b) => b.classList.remove("pill-active"));
      btn.classList.add("pill-active");
      filtroSistemaKey = btn.dataset.sistema;
      renderHormonas();
    });
  });

  if (searchHormonaEl) {
    searchHormonaEl.addEventListener("input", () => {
      renderHormonas();
    });
  }

  // Render inicial de hormonas
  renderHormonas();

  // ---------- LÓGICA DE VITAMINAS (BUSCADOR) ----------

  const vitaminasListEl = document.querySelector("#vitaminasList");
  const searchVitaminaEl = document.querySelector("#searchVitamina");

  function crearTarjetaVitamina(v) {
    const tipoClass = v.tipoKey ? `card-tipo-${v.tipoKey}` : "";
    return `
      <article class="card-vitamina ${tipoClass}">
        <div class="card-hormona-header">
          <div class="card-hormona-nombre">${v.nombre}</div>
          <div class="card-hormona-sigla">Sigla: ${v.sigla || "—"}</div>
          <span class="badge-sistema">${v.tipo}</span>
        </div>

        <p><span>Otros nombres:</span> ${v.otrosNombres}</p>
        <p><span>Función fisiológica:</span> ${v.funcion}</p>
        <p><span>Hipovitaminosis:</span> ${v.hipovitaminosis}</p>
        <p><span>Hipervitaminosis:</span> ${v.hipervitaminosis}</p>

        <div class="card-hormona-footer">
          <p><span>Variación por especie:</span> ${v.variacionEspecies}</p>
          <p><span>Relevancia farmacológica:</span> ${v.afeccionesFarmaco}</p>
        </div>
      </article>
    `;
  }

  function renderVitaminas() {
    if (!vitaminasListEl) return;

    const texto = (searchVitaminaEl?.value || "").trim().toLowerCase();

    const filtradas = vitaminas.filter((v) => {
      const base = `${v.nombre} ${v.sigla} ${v.otrosNombres} ${v.tipo}`.toLowerCase();
      return !texto || base.includes(texto);
    });

    if (filtradas.length === 0) {
      vitaminasListEl.innerHTML =
        "<p>No se encontraron vitaminas para ese criterio de búsqueda.</p>";
      return;
    }

    vitaminasListEl.innerHTML = filtradas.map(crearTarjetaVitamina).join("");
  }

  if (searchVitaminaEl) {
    searchVitaminaEl.addEventListener("input", () => {
      renderVitaminas();
    });
  }

  // Render inicial de vitaminas
  renderVitaminas();

  // -------- SUBPESTAÑAS FISIOLOGÍA (HORMONAS / VITAMINAS) --------
  const fisioTabs = document.querySelectorAll(".fisio-tab");
  const fisioPanes = document.querySelectorAll(".fisio-pane");

  fisioTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.fisio; // "hormonas" o "vitaminas"

      fisioTabs.forEach((t) => t.classList.remove("fisio-tab-active"));
      tab.classList.add("fisio-tab-active");

      fisioPanes.forEach((pane) => {
        pane.classList.toggle("fisio-pane-active", pane.id === `fisio-${target}`);
      });
    });
  });
});
