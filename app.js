document.addEventListener("DOMContentLoaded", () => {
  console.log("Mini-App Veterinaria v2.0 lista 🐾");

  const buttons = document.querySelectorAll(".nav-btn[data-view]");
  const views = document.querySelectorAll(".view");

  const menuToggle = document.querySelector("#menu-toggle");
  const menuPanel = document.querySelector("#menu-panel");

  // -------- NAV PRINCIPAL --------

  function showView(viewName) {
    views.forEach((v) => {
      v.classList.toggle("view-active", v.id === `view-${viewName}`);
    });

    buttons.forEach((btn) => {
      btn.classList.toggle("nav-active", btn.dataset.view === viewName);
    });

    closeMenu();
  }

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

  // ---------- FISIOLOGÍA · HORMONAS ----------

  const hormonas = [
  // DIGESTIVO
  {
    nombre: "Gastrina",
    sigla: "-",
    sistema: "Digestivo",
    sistemaKey: "digestivo",
    origenLiberacion:
      "Producción: células G del antro gástrico. Liberación: sangre portal → estómago y páncreas.",
    funcionPrincipal:
      "Estimula secreción de HCl y motilidad gástrica.",
    funcionSecundaria:
      "Estimula crecimiento de mucosa gástrica.",
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
    afeccionesFarmaco:
      "Análogos de somatostatina inhiben su liberación."
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
    afeccionesFarmaco:
      "Opioides alteran motilidad biliar e intestinal."
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
    patologia:
      "↑: hiperfagia, obesidad. ↓: anorexia, pérdida de peso.",
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
    patologia:
      "↑: hiporexia, pérdida de peso. ↓: hiperfagia.",
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
    patologia:
      "↓: íleo, hipomotilidad. ↑: hipermotilidad, cólicos.",
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
    especieVariacion:
      "Papel modulador importante en varias especies.",
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
    funcionSecundaria:
      "Contribuye a sensación de saciedad.",
    patologia:
      "↓: intolerancia a glucosa. ↑: riesgo de hipoglucemia en ciertas condiciones.",
    especieVariacion:
      "En perros y gatos se estudia en obesidad y diabetes.",
    afeccionesFarmaco:
      "Análogos de GLP-1 (uso humano) modulan glucemia y peso."
  },

  // RESPIRATORIO/CARDÍACO
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

  // CARDÍACO/CIRCULATORIO
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
    funcionSecundaria:
      "Indicador de distensión ventricular.",
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
    funcionSecundaria:
      "Participa en equilibrio ácido-base.",
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
      "Producción: neuronas del SNC y células entero cromafines. Liberación: sinapsis y mucosa intestinal.",
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
    funcionPrincipal:
      "Aumenta reabsorción de agua en riñón.",
    funcionSecundaria:
      "Vasoconstricción en altas concentraciones.",
    patologia:
      "↓: diabetes insípida. ↑: intoxicación hídrica, hiponatremia.",
    especieVariacion:
      "Perros y gatos: formas central y nefrogénica.",
    afeccionesFarmaco:
      "Desmopresina es análogo terapéutico; diuréticos la contrarrestan."
  },
  {
    nombre: "CRH",
    sigla: "CRH",
    sistema: "Nervioso/Neuroendocrino",
    sistemaKey: "nervioso-neuroendocrino",
    origenLiberacion:
      "Producción: hipotálamo. Liberación: sistema porta hipofisario.",
    funcionPrincipal:
      "Estimula secreción de ACTH.",
    funcionSecundaria:
      "Participa en respuesta al estrés crónico.",
    patologia:
      "↑: activación excesiva del eje adrenal. ↓: hipoadrenocorticismo secundario.",
    especieVariacion:
      "Sensibilidad del eje HHA varía entre especies.",
    afeccionesFarmaco:
      "Trilostano y otros fármacos que reducen cortisol modifican retroalimentación."
  },
  {
    nombre: "TRH",
    sigla: "TRH",
    sistema: "Nervioso/Neuroendocrino",
    sistemaKey: "nervioso-neuroendocrino",
    origenLiberacion:
      "Producción: hipotálamo. Liberación: sistema porta hipofisario.",
    funcionPrincipal:
      "Estimula secreción de TSH (y prolactina en algunas especies).",
    funcionSecundaria:
      "Útil en pruebas de estimulación endocrina.",
    patologia:
      "↓: hipotiroidismo central. ↑ sostenida: hiperplasia tiroidea.",
    especieVariacion:
      "En equinos se usa en diagnóstico de PPID.",
    afeccionesFarmaco:
      "Fármacos tiroideos modifican su retroalimentación."
  },
  {
    nombre: "GnRH",
    sigla: "GnRH",
    sistema: "Nervioso/Neuroendocrino",
    sistemaKey: "nervioso-neuroendocrino",
    origenLiberacion:
      "Producción: hipotálamo. Liberación: sistema porta hipofisario.",
    funcionPrincipal:
      "Estimula secreción de FSH y LH.",
    funcionSecundaria:
      "Sincroniza ciclos reproductivos.",
    patologia:
      "↓: anestro, infertilidad. ↑ continua: desensibilización hipófisis.",
    especieVariacion:
      "Clave en protocolos de inseminación y sincronización en rumiantes.",
    afeccionesFarmaco:
      "Análogos (buserelina, deslorelina) inducen ovulación o suprimen eje gonadal."
  },

  // RENAL
  {
    nombre: "Eritropoyetina",
    sigla: "EPO",
    sistema: "Renal",
    sistemaKey: "renal",
    origenLiberacion:
      "Producción: células peritubulares renales. Liberación: sangre.",
    funcionPrincipal:
      "Estimula producción de eritrocitos.",
    funcionSecundaria:
      "Adecuación del transporte de oxígeno.",
    patologia:
      "↓: anemia por ERC. ↑ exógena: policitemia.",
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

  // REPRODUCTIVO
  {
    nombre: "Progesterona",
    sigla: "P4",
    sistema: "Reproductivo",
    sistemaKey: "reproductivo",
    origenLiberacion:
      "Producción: cuerpo lúteo y placenta. Liberación: sangre.",
    funcionPrincipal:
      "Mantiene gestación y fase lútea.",
    funcionSecundaria:
      "Modula conducta y tono uterino.",
    patologia:
      "↓: abortos, falla gestación. ↑: piometra, quistes luteínicos.",
    especieVariacion:
      "Diestro prolongado en perra con altos niveles de P4.",
    afeccionesFarmaco:
      "Progestágenos sintéticos alteran ciclo y aumentan riesgo uterino."
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
    funcionSecundaria:
      "Efecto anabólico proteico.",
    patologia:
      "↑: agresividad, hiperplasia prostática. ↓: infertilidad, baja libido.",
    especieVariacion:
      "Castración elimina su producción; criptorquidia la altera.",
    afeccionesFarmaco:
      "Esteroides anabólicos exógenos suprimen eje gonadal."
  },
  {
    nombre: "Hormona Luteinizante",
    sigla: "LH",
    sistema: "Reproductivo",
    sistemaKey: "reproductivo",
    origenLiberacion:
      "Producción: adenohipófisis. Liberación: sangre.",
    funcionPrincipal:
      "Induce ovulación y producción de testosterona.",
    funcionSecundaria:
      "Mantenimiento del cuerpo lúteo en algunas especies.",
    patologia:
      "↓: falla ovulatoria. ↑: desensibilización gonadal si es continua.",
    especieVariacion:
      "Curva de LH difiere entre perra, vaca, yegua, etc.",
    afeccionesFarmaco:
      "Análogos de GnRH alteran su secreción."
  },
  {
    nombre: "Hormona Foliculoestimulante",
    sigla: "FSH",
    sistema: "Reproductivo",
    sistemaKey: "reproductivo",
    origenLiberacion:
      "Producción: adenohipófisis. Liberación: sangre.",
    funcionPrincipal:
      "Desarrollo folicular y espermatogénesis.",
    funcionSecundaria:
      "Estimula producción de estrógenos por células foliculares.",
    patologia:
      "↓: infertilidad. ↑: rara en tumores hipofisarios.",
    especieVariacion:
      "Usada en programas de superovulación bovina.",
    afeccionesFarmaco:
      "GnRH, progestágenos y eCG modifican su perfil."
  },
  {
    nombre: "Prolactina",
    sigla: "PRL",
    sistema: "Reproductivo",
    sistemaKey: "reproductivo",
    origenLiberacion:
      "Producción: adenohipófisis. Liberación: sangre.",
    funcionPrincipal:
      "Estimula producción de leche.",
    funcionSecundaria:
      "Contribuye a conducta maternal.",
    patologia:
      "↑: pseudogestación, galactorrea. ↓: agalactia.",
    especieVariacion:
      "En perras aumenta en diestro y gestación.",
    afeccionesFarmaco:
      "Cabergolina y bromocriptina (agonistas dopaminérgicos) reducen PRL."
  },
  {
    nombre: "Relajina",
    sigla: "-",
    sistema: "Reproductivo",
    sistemaKey: "reproductivo",
    origenLiberacion:
      "Producción: placenta y ovario. Liberación: sangre al final de gestación.",
    funcionPrincipal:
      "Relaja ligamentos pélvicos y cuello uterino.",
    funcionSecundaria:
      "Facilita paso fetal por canal del parto.",
    patologia:
      "↓: partos distócicos. ↑ excesiva: debilidad ligamentosa.",
    especieVariacion:
      "Patrones de secreción varían entre especies.",
    afeccionesFarmaco:
      "Uso terapéutico limitado; interactúa con prostaglandinas y estrógenos."
  },
  {
    nombre: "Prostaglandina F2 alfa",
    sigla: "PGF2α",
    sistema: "Reproductivo",
    sistemaKey: "reproductivo",
    origenLiberacion:
      "Producción: endometrio uterino. Liberación: sangre local y sistémica.",
    funcionPrincipal:
      "Provoca luteólisis (regresión del cuerpo lúteo).",
    funcionSecundaria:
      "Estimula contracciones uterinas.",
    patologia:
      "↓: cuerpos lúteos persistentes. ↑: abortos si se aplica en gestación.",
    especieVariacion:
      "Muy usada en bovinos, ovinos, caprinos para sincronización de celo.",
    afeccionesFarmaco:
      "PGF2α sintética (cloprostenol, dinoprost) es fármaco clave; sobredosis causa cólicos."
  },

  // ENDOCRINO / METABÓLICO
  {
    nombre: "Insulina",
    sigla: "-",
    sistema: "Endocrino/Metabólico",
    sistemaKey: "endocrino-metabolico",
    origenLiberacion:
      "Producción: células β pancreáticas. Liberación: sangre portal.",
    funcionPrincipal:
      "Disminuye glucosa sanguínea.",
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
    funcionPrincipal:
      "Aumenta glucosa sanguínea.",
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
    patologia:
      "↑: Cushing. ↓: Addison.",
    especieVariacion:
      "Perros: Cushing frecuente; caballos: síndromes relacionados con insulina.",
    afeccionesFarmaco:
      "Glucocorticoides sintéticos imitan su acción; retiro brusco es peligroso."
  },
  {
    nombre: "Hormona del Crecimiento",
    sigla: "GH",
    sistema: "Endocrino/Metabólico",
    sistemaKey: "endocrino-metabolico",
    origenLiberacion:
      "Producción: adenohipófisis. Liberación: sangre.",
    funcionPrincipal:
      "Estimula crecimiento tisular y anabolismo.",
    funcionSecundaria:
      "Participa en metabolismo de lípidos y carbohidratos.",
    patologia:
      "↑: acromegalia, gigantismo. ↓: enanismo hipofisario.",
    especieVariacion:
      "GH bovina usada para producción láctea es altamente regulada.",
    afeccionesFarmaco:
      "Análogos de somatostatina la inhiben; dopaminérgicos la modulan."
  },
  {
    nombre: "Tiroxina",
    sigla: "T4",
    sistema: "Endocrino/Metabólico",
    sistemaKey: "endocrino-metabolico",
    origenLiberacion:
      "Producción: tiroides. Liberación: sangre.",
    funcionPrincipal:
      "Aumenta metabolismo basal.",
    funcionSecundaria:
      "Influye en crecimiento y termorregulación.",
    patologia:
      "↓: hipotiroidismo. ↑: hipertiroidismo.",
    especieVariacion:
      "Perros: hipotiroidismo; gatos: hipertiroidismo, sobre todo geriátricos.",
    afeccionesFarmaco:
      "Levotiroxina, metimazol y yodo radiactivo modifican su nivel."
  },
  {
    nombre: "Triyodotironina",
    sigla: "T3",
    sistema: "Endocrino/Metabólico",
    sistemaKey: "endocrino-metabolico",
    origenLiberacion:
      "Producción: tiroides y conversión periférica desde T4. Liberación: sangre.",
    funcionPrincipal:
      "Forma activa de hormonas tiroideas.",
    funcionSecundaria:
      "Importante para desarrollo neuromuscular.",
    patologia:
      "Alteraciones similares a T4.",
    especieVariacion:
      "Fracción T3 depende de nutrición y enfermedad sistémica.",
    afeccionesFarmaco:
      "Glucocorticoides y anticonvulsivantes alteran su conversión."
  },
  {
    nombre: "Calcitonina",
    sigla: "-",
    sistema: "Endocrino/Metabólico",
    sistemaKey: "endocrino-metabolico",
    origenLiberacion:
      "Producción: células C tiroideas. Liberación: sangre.",
    funcionPrincipal:
      "Disminuye calcio sanguíneo.",
    funcionSecundaria:
      "Contrarregula acción de PTH.",
    patologia:
      "↓: menor freno a hipercalcemia. ↑: hipocalcemia leve.",
    especieVariacion:
      "Papel relativo menor en algunas especies.",
    afeccionesFarmaco:
      "Calcitonina sintética se usa en ciertos casos de hipercalcemia."
  },
  {
    nombre: "Calcitriol (Vitamina D3 activa)",
    sigla: "-",
    sistema: "Endocrino/Metabólico",
    sistemaKey: "endocrino-metabolico",
    origenLiberacion:
      "Producción: riñón (a partir de vitamina D activada en hígado). Liberación: sangre.",
    funcionPrincipal:
      "Aumenta absorción intestinal de calcio y fósforo.",
    funcionSecundaria:
      "Importante en regulación de PTH y homeostasis mineral.",
    patologia:
      "↓: raquitismo, osteomalacia. ↑: hipercalcemia, mineralización de tejidos.",
    especieVariacion:
      "Conversión depende de función hepática y renal, con variaciones entre especies.",
    afeccionesFarmaco:
      "Suplementos de vitamina D y análogos se usan en hipocalcemia; exceso genera toxicidad."
  },

  // INMUNOLÓGICO
  {
    nombre: "Interleucina-1",
    sigla: "IL-1",
    sistema: "Inmunológico",
    sistemaKey: "inmunologico",
    origenLiberacion:
      "Producción: macrófagos, monocitos y otras células inmunes. Liberación: tejidos y sangre.",
    funcionPrincipal:
      "Citocina proinflamatoria, induce fiebre.",
    funcionSecundaria:
      "Estimula proteínas de fase aguda.",
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
    funcionPrincipal:
      "Citocina clave de fase aguda.",
    funcionSecundaria:
      "Estimula síntesis hepática de proteínas de fase aguda.",
    patologia:
      "↑: inflamación crónica, SIRS. ↓: menor respuesta a infecciones.",
    especieVariacion:
      "Biomarcador útil en infecciones graves.",
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
    funcionPrincipal:
      "Regula pigmentación cutánea.",
    funcionSecundaria:
      "Puede influir en apetito y comportamiento.",
    patologia:
      "↑: hiperpigmentación. ↓: despigmentación.",
    especieVariacion:
      "Niveles alterados en PPID equino.",
    afeccionesFarmaco:
      "Fármacos que actúan sobre hipófisis pueden modificarla."
  }
];


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

  // Render inicial
  renderHormonas();
});
