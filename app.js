// =========================
// BASE DE DATOS DE HORMONAS
// =========================

const hormonas = [
  // ===== DIGESTIVO =====
  {
    sistema: "Digestivo",
    nombre: "Gastrina",
    sigla: "-",
    origen: "Producción: células G del antro gástrico.\nLiberación: sangre portal hacia estómago y páncreas.",
    funcion: "Estimula secreción de HCl y motilidad gástrica.",
    patologia: "↑: úlceras, hiperacidez.\n↓: hipoclorhidria, mala digestión.",
    secundarias: "Estimula crecimiento de mucosa gástrica.",
    variaciones: "Rumiantes: modulada por tipo de dieta (fibra vs concentrado).",
    farmaco: "IBP (omeprazol) y anti-H2 reducen su efecto; AINEs favorecen daño gástrico."
  },
  {
    sistema: "Digestivo",
    nombre: "Secretina",
    sigla: "-",
    origen: "Producción: células S del duodeno.\nLiberación: sangre hacia páncreas e hígado.",
    funcion: "Estimula secreción de bicarbonato pancreático y biliar.",
    patologia: "↓: duodenitis, lesión de mucosa.\n↑ (raro): diarrea acuosa.",
    secundarias: "Inhibe gastrina y vaciamiento gástrico.",
    variaciones: "Respuesta más marcada en monogástricos.",
    farmaco: "Análogos de somatostatina pueden inhibir su secreción."
  },
  {
    sistema: "Digestivo",
    nombre: "Colecistoquinina",
    sigla: "CCK",
    origen: "Producción: células I del duodeno.\nLiberación: sangre hacia páncreas y vesícula biliar.",
    funcion: "Estimula contracción de vesícula biliar y secreción de enzimas pancreáticas.",
    patologia: "↓: mala digestión de grasas.\n↑: cólicos biliares, dolor postprandial.",
    secundarias: "Regula saciedad y vaciamiento gástrico.",
    variaciones: "Carnívoros responden fuerte a dietas ricas en grasa.",
    farmaco: "Opioides alteran motilidad biliar e intestinal."
  },
  {
    sistema: "Digestivo",
    nombre: "Grelina",
    sigla: "-",
    origen: "Producción: estómago (células oxínticas).\nLiberación: sangre sistémica.",
    funcion: "Estimula apetito y motilidad gástrica (hormona del hambre).",
    patologia: "↑: hiperfagia, obesidad.\n↓: anorexia, pérdida de peso.",
    secundarias: "Modula secreción de GH y metabolismo energético.",
    variaciones: "En perros y gatos se asocia a obesidad; en rumiantes al balance energético.",
    farmaco: "Corticoides y algunos psicofármacos aumentan el apetito y pueden potenciar su efecto."
  },
  {
    sistema: "Digestivo",
    nombre: "Péptido YY",
    sigla: "PYY",
    origen: "Producción: íleon y colon distal.\nLiberación: sangre posprandial.",
    funcion: "Disminuye apetito y motilidad intestinal.",
    patologia: "↑: hiporexia, pérdida de peso.\n↓: hiperfagia.",
    secundarias: "Regula vaciamiento gástrico.",
    variaciones: "Secreción influida por tipo de dieta (fibra vs grasa).",
    farmaco: "Opioides y procinéticos que alteran tránsito intestinal modifican su acción."
  },
  {
    sistema: "Digestivo",
    nombre: "Motilina",
    sigla: "-",
    origen: "Producción: células endocrinas del intestino delgado.\nLiberación: sangre en fase de ayuno.",
    funcion: "Activa complejos motores migratorios (motilidad en ayuno).",
    patologia: "↓: íleo, hipomotilidad.\n↑: hipermotilidad, cólicos.",
    secundarias: "Coordina tránsito entre estómago e intestino.",
    variaciones: "Muy importante en equinos y pequeños animales.",
    farmaco: "Macrólidos como eritromicina actúan como agonistas de motilina (procinéticos)."
  },
  {
    sistema: "Digestivo",
    nombre: "Somatostatina entérica",
    sigla: "SST",
    origen: "Producción: células D de estómago, intestino y páncreas.\nLiberación: local y sistémica.",
    funcion: "Inhibe secreción de HCl y de diversas hormonas digestivas.",
    patologia: "↑: hipoclorhidria, mala digestión.\n↓: hipersecreción ácida.",
    secundarias: "Disminuye motilidad intestinal y flujo esplácnico.",
    variaciones: "Papel modulador importante en varias especies domésticas.",
    farmaco: "Análogos (octreótido) se usan en hipersecreciones gastrointestinales."
  },
  {
    sistema: "Digestivo",
    nombre: "GLP-1 (Péptido similar al glucagón-1)",
    sigla: "GLP-1",
    origen: "Producción: células L de íleon y colon.\nLiberación: sangre portal.",
    funcion: "Estimula secreción de insulina y disminuye vaciamiento gástrico.",
    patologia: "↓: intolerancia a glucosa.\n↑: riesgo de hipoglucemia en algunas terapias.",
    secundarias: "Contribuye a sensación de saciedad.",
    variaciones: "En perros y gatos se estudia en obesidad y diabetes.",
    farmaco: "Análogos de GLP-1 (en humanos) se usan como hipoglucemiantes y para control de peso."
  },

  // ===== RESPIRATORIO / CARDÍACO =====
  {
    sistema: "Respiratorio/Cardíaco",
    nombre: "Adrenalina (Epinefrina)",
    sigla: "Epi",
    origen: "Producción: médula suprarrenal.\nLiberación: sangre sistémica.",
    funcion: "Aumenta frecuencia y fuerza cardiaca y produce broncodilatación.",
    patologia: "↑ crónica: taquiarritmias, cardiomiopatías.\n↓: incapacidad de respuesta al shock.",
    secundarias: "Moviliza glucosa y ácidos grasos (respuesta de estrés).",
    variaciones: "Caballos y gatos suelen ser muy sensibles.",
    farmaco: "Fármaco de elección en anafilaxia y paro cardiaco; sobredosis causa arritmias graves."
  },
  {
    sistema: "Respiratorio/Cardíaco",
    nombre: "Noradrenalina (Norepinefrina)",
    sigla: "NE",
    origen: "Producción: terminaciones simpáticas y médula suprarrenal.\nLiberación: sinapsis y sangre.",
    funcion: "Vasoconstricción periférica y aumento de presión arterial.",
    patologia: "↑ crónica: hipertensión, daño vascular.\n↓: hipotensión grave.",
    secundarias: "Modula tono simpático y respuesta al estrés.",
    variaciones: "Respuesta varía entre especies y razas.",
    farmaco: "Fármacos simpaticomiméticos y antidepresivos tricíclicos alteran su recaptación."
  },

  // ===== CARDÍACO / CIRCULATORIO =====
  {
    sistema: "Cardíaco/Circulatorio",
    nombre: "Angiotensina II",
    sigla: "Ang II",
    origen: "Producción: conversión de angiotensina I por ECA en pulmón y endotelio.\nLiberación: sangre.",
    funcion: "Vasoconstrictor potente; aumenta presión arterial.",
    patologia: "↑: hipertensión, daño cardiaco y renal.\n↓: hipotensión.",
    secundarias: "Estimula secreción de aldosterona y ADH.",
    variaciones: "Sistema muy relevante en perros y gatos cardiópatas y nefrópatas.",
    farmaco: "IECA (enalapril, benazepril) y ARA-II bloquean su formación/acción."
  },
  {
    sistema: "Cardíaco/Circulatorio",
    nombre: "Péptido natriurético auricular",
    sigla: "ANP",
    origen: "Producción: aurícula cardiaca.\nLiberación: sangre al aumentar la distensión auricular.",
    funcion: "Favorece natriuresis y disminución de la presión arterial.",
    patologia: "↓: retención de sodio y agua.\n↑: marcador de insuficiencia cardiaca.",
    secundarias: "Contrarregula el sistema renina-angiotensina-aldosterona.",
    variaciones: "Útil como biomarcador en perros y gatos con enfermedad cardiaca.",
    farmaco: "Su acción se complementa con diuréticos y vasodilatadores."
  },
  {
    sistema: "Cardíaco/Circulatorio",
    nombre: "Péptido natriurético cerebral",
    sigla: "BNP",
    origen: "Producción: ventrículos cardiacos.\nLiberación: sangre cuando hay estiramiento ventricular.",
    funcion: "Favorece diuresis y natriuresis, reduciendo la sobrecarga de volumen.",
    patologia: "↑: insuficiencia cardiaca congestiva.\n↓: menor capacidad compensatoria.",
    secundarias: "Indicador de distensión y remodelación ventricular.",
    variaciones: "NT-proBNP se usa en perros y gatos como prueba diagnóstica.",
    farmaco: "Tratamiento con IECA, pimobendan y diuréticos reduce sus niveles patológicos."
  },
  {
    sistema: "Cardíaco/Circulatorio",
    nombre: "Aldosterona",
    sigla: "-",
    origen: "Producción: zona glomerulosa de la corteza suprarrenal.\nLiberación: sangre.",
    funcion: "Aumenta reabsorción de sodio y agua y excreción de potasio.",
    patologia: "↑: hiperaldosteronismo, hipertensión, hipopotasemia.\n↓: enfermedad de Addison.",
    secundarias: "Contribuye al equilibrio ácido-base.",
    variaciones: "En gatos se describe hiperaldosteronismo primario; en perros, Addison con déficit de mineralocorticoides.",
    farmaco: "IECA y espironolactona bloquean su acción; otros diuréticos modifican su efecto."
  },

  // ===== NERVIOSO / NEUROENDOCRINO =====
  {
    sistema: "Nervioso/Neuroendocrino",
    nombre: "Dopamina",
    sigla: "DA",
    origen: "Producción: neuronas dopaminérgicas del SNC y algunas células renales.\nLiberación: sinapsis y circulación local.",
    funcion: "Neurotransmisor que regula movimiento, conducta y secreción de prolactina.",
    patologia: "↓: trastornos motores, hiperprolactinemia.\n↑: estereotipias, conductas anormales.",
    secundarias: "Modula flujo renal y presión arterial.",
    variaciones: "Equinos son especialmente sensibles a agonistas dopaminérgicos.",
    farmaco: "Cabergolina y bromocriptina (agonistas) inhiben prolactina; metoclopramida (antagonista) la aumenta."
  },
  {
    sistema: "Nervioso/Neuroendocrino",
    nombre: "Serotonina",
    sigla: "5-HT",
    origen: "Producción: neuronas del SNC y células entero cromafines intestinales.\nLiberación: sinapsis y mucosa intestinal.",
    funcion: "Regula ánimo, apetito y motilidad intestinal.",
    patologia: "↑: síndrome serotoninérgico.\n↓: depresión, alteraciones del sueño y apetito.",
    secundarias: "Influye en percepción del dolor y conducta.",
    variaciones: "Distribución de receptores varía entre especies.",
    farmaco: "ISRS, tricíclicos y algunos analgésicos modulan su recaptación o liberación."
  },
  {
    sistema: "Nervioso/Neuroendocrino",
    nombre: "Oxitocina",
    sigla: "OT",
    origen: "Producción: núcleos supraóptico y paraventricular del hipotálamo.\nLiberación: neurohipófisis hacia sangre.",
    funcion: "Estimula contracciones uterinas y eyección de leche.",
    patologia: "↓: inercia uterina, agalactia.\n↑: riesgo de ruptura uterina si se abusa.",
    secundarias: "Modula conducta maternal y social.",
    variaciones: "Muy usada en vacas, yeguas, perras y gatas en manejo obstétrico.",
    farmaco: "Oxitocina sintética es fármaco obstétrico común."
  },
  {
    sistema: "Nervioso/Neuroendocrino",
    nombre: "Vasopresina (Hormona antidiurética)",
    sigla: "ADH / AVP",
    origen: "Producción: núcleos supraóptico y paraventricular del hipotálamo.\nLiberación: neurohipófisis.",
    funcion: "Aumenta reabsorción de agua en riñón.",
    patologia: "↓: diabetes insípida (poliuria/polidipsia).\n↑: intoxicación hídrica, hiponatremia.",
    secundarias: "Vasoconstricción en altas concentraciones.",
    variaciones: "Perros y gatos presentan formas central y nefrogénica.",
    farmaco: "Desmopresina es análogo terapéutico; diuréticos disminuyen su efecto."
  },
  {
    sistema: "Nervioso/Neuroendocrino",
    nombre: "CRH (Hormona liberadora de corticotropina)",
    sigla: "CRH",
    origen: "Producción: hipotálamo.\nLiberación: sistema porta hipotálamo-hipófisis.",
    funcion: "Estimula secreción de ACTH.",
    patologia: "↑: hiperactividad del eje adrenal.\n↓: hipoadrenocorticismo secundario.",
    secundarias: "Participa en la respuesta al estrés crónico.",
    variaciones: "Sensibilidad del eje HHA varía entre especies.",
    farmaco: "Trilostano y otros fármacos que reducen cortisol alteran su retroalimentación."
  },
  {
    sistema: "Nervioso/Neuroendocrino",
    nombre: "TRH (Hormona liberadora de tirotropina)",
    sigla: "TRH",
    origen: "Producción: hipotálamo.\nLiberación: sistema porta hipofisario.",
    funcion: "Estimula secreción de TSH (y prolactina en algunas especies).",
    patologia: "↓: hipotiroidismo central.\n↑ prolongada: hiperplasia tiroidea.",
    secundarias: "Útil en pruebas de estimulación tiroidea.",
    variaciones: "En equinos se utiliza en diagnóstico de PPID.",
    farmaco: "Medicamentos tiroideos modifican su retroalimentación."
  },
  {
    sistema: "Nervioso/Neuroendocrino",
    nombre: "GnRH (Hormona liberadora de gonadotropinas)",
    sigla: "GnRH",
    origen: "Producción: hipotálamo.\nLiberación: sistema porta a adenohipófisis.",
    funcion: "Estimula secreción de FSH y LH.",
    patologia: "↓: anestro, infertilidad.\n↑ continua: desensibilización hipofisaria.",
    secundarias: "Permite sincronizar ciclos reproductivos.",
    variaciones: "Clave en protocolos de reproducción en bovinos, ovinos y caprinos.",
    farmaco: "Análogos (buserelina, deslorelina) inducen ovulación o suprimen eje gonadal."
  },

  // ===== RENAL / MINERAL =====
  {
    sistema: "Renal",
    nombre: "Eritropoyetina",
    sigla: "EPO",
    origen: "Producción: células peritubulares renales.\nLiberación: sangre.",
    funcion: "Estimula producción de eritrocitos en médula ósea.",
    patologia: "↓: anemia por enfermedad renal crónica.\n↑ exógena: policitemia.",
    secundarias: "Adecuación del transporte de oxígeno.",
    variaciones: "Perros y gatos con ERC tienen déficit relativo de EPO.",
    farmaco: "EPO recombinante puede inducir anticuerpos neutralizantes."
  },
  {
    sistema: "Renal/Metabólico",
    nombre: "Hormona paratiroidea",
    sigla: "PTH",
    origen: "Producción: glándulas paratiroides.\nLiberación: sangre.",
    funcion: "Aumenta calcio sanguíneo y excreción renal de fósforo.",
    patologia: "↑: hiperparatiroidismo, osteodistrofia fibrosa.\n↓: hipocalcemia, tetania.",
    secundarias: "Actúa en hueso e intestino (vía calcitriol).",
    variaciones: "Hipocalcemia puerperal en rumiantes y perras lactantes se relaciona con su dinámica.",
    farmaco: "Vitamina D, calcimiméticos y quelantes de fósforo modulan su acción."
  },

  // ===== REPRODUCTIVO =====
  {
    sistema: "Reproductivo",
    nombre: "Progesterona",
    sigla: "P4",
    origen: "Producción: cuerpo lúteo y placenta.\nLiberación: sangre.",
    funcion: "Mantiene la gestación y la fase lútea.",
    patologia: "↓: abortos, falla de gestación.\n↑: piometra, quistes luteínicos.",
    secundarias: "Modula conducta reproductiva y tono uterino.",
    variaciones: "En la perra existe un diestro prolongado con altos niveles de P4.",
    farmaco: "Progestágenos sintéticos aumentan el riesgo de patologías uterinas y mamarias."
  },
  {
    sistema: "Reproductivo",
    nombre: "Estradiol",
    sigla: "E2",
    origen: "Producción: folículos ováricos.\nLiberación: sangre.",
    funcion: "Regula el ciclo estral y caracteres sexuales femeninos.",
    patologia: "↑: hiperestrogenismo, aplasia medular.\n↓: anestro.",
    secundarias: "Influye en comportamiento de celo y tono uterino.",
    variaciones: "Gatas son poliéstricas estacionales; el patrón depende del fotoperiodo.",
    farmaco: "Uso inadecuado como abortivo en perras es altamente tóxico."
  },
  {
    sistema: "Reproductivo",
    nombre: "Testosterona",
    sigla: "T",
    origen: "Producción: células de Leydig testiculares.\nLiberación: sangre.",
    funcion: "Desarrollo sexual masculino y mantenimiento de espermatogénesis.",
    patologia: "↑: agresividad, hiperplasia prostática.\n↓: infertilidad, baja libido.",
    secundarias: "Efecto anabólico proteico y aumento de masa muscular.",
    variaciones: "Castración y criptorquidia modifican sus niveles.",
    farmaco: "Esteroides anabólicos exógenos suprimen el eje gonadal."
  },
  {
    sistema: "Reproductivo",
    nombre: "Hormona luteinizante",
    sigla: "LH",
    origen: "Producción: adenohipófisis.\nLiberación: sangre.",
    funcion: "Induce ovulación y producción de testosterona.",
    patologia: "↓: falla ovulatoria.\n↑ crónica: desensibilización gonadal.",
    secundarias: "Participa en la luteinización y mantenimiento del cuerpo lúteo.",
    variaciones: "Curva de LH difiere entre perra, vaca y yegua.",
    farmaco: "Análogos de GnRH modifican su secreción."
  },
  {
    sistema: "Reproductivo",
    nombre: "Hormona foliculoestimulante",
    sigla: "FSH",
    origen: "Producción: adenohipófisis.\nLiberación: sangre.",
    funcion: "Estimula desarrollo folicular y espermatogénesis.",
    patologia: "↓: infertilidad por falla de gametogénesis.",
    secundarias: "Estimula producción de estrógenos en células foliculares.",
    variaciones: "Usada en protocolos de superovulación bovina.",
    farmaco: "GnRH, progestágenos y eCG alteran su perfil."
  },
  {
    sistema: "Reproductivo",
    nombre: "Prolactina",
    sigla: "PRL",
    origen: "Producción: adenohipófisis.\nLiberación: sangre.",
    funcion: "Estimula producción de leche.",
    patologia: "↑: pseudogestación, galactorrea.\n↓: agalactia.",
    secundarias: "Participa en conducta maternal.",
    variaciones: "En perras aumenta en diestro y gestación.",
    farmaco: "Cabergolina y bromocriptina (agonistas dopaminérgicos) disminuyen PRL."
  },
  {
    sistema: "Reproductivo",
    nombre: "Relajina",
    sigla: "-",
    origen: "Producción: ovario y placenta.\nLiberación: sangre en gestación avanzada.",
    funcion: "Relaja ligamentos pélvicos y ablanda cuello uterino.",
    patologia: "↓: partos distócicos por rigidez.\n↑ excesiva: debilidad ligamentosa.",
    secundarias: "Facilita el paso fetal por el canal del parto.",
    variaciones: "Patrones de secreción varían entre especies.",
    farmaco: "Uso farmacológico directo limitado; interactúa con estrógenos y prostaglandinas."
  },
  {
    sistema: "Reproductivo",
    nombre: "Prostaglandina F2 alfa",
    sigla: "PGF2α",
    origen: "Producción: endometrio uterino.\nLiberación: circulación local y sistémica.",
    funcion: "Provoca luteólisis (regresión del cuerpo lúteo).",
    patologia: "↓: cuerpos lúteos persistentes.\n↑: abortos si se usa en gestación.",
    secundarias: "Estimula contracciones uterinas.",
    variaciones: "Muy utilizada en bovinos, ovinos y caprinos para sincronización de celo.",
    farmaco: "PGF2α sintética (cloprostenol, dinoprost) es de uso rutinario; sobredosis causa cólicos."
  },

  // ===== ENDOCRINO / METABÓLICO =====
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Insulina",
    sigla: "-",
    origen: "Producción: células β de islotes pancreáticos.\nLiberación: sangre portal.",
    funcion: "Disminuye glucosa sanguínea facilitando su entrada a las células.",
    patologia: "↓: diabetes mellitus.\n↑: hipoglucemia, convulsiones.",
    secundarias: "Promueve almacenamiento de grasa y síntesis proteica.",
    variaciones: "Diabetes felina suele ser tipo 2-like; en perros más tipo 1-like.",
    farmaco: "Insulina exógena es tratamiento; corticoides y progestágenos causan resistencia."
  },
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Glucagón",
    sigla: "-",
    origen: "Producción: células α pancreáticas.\nLiberación: sangre portal.",
    funcion: "Aumenta glucosa sanguínea (gluconeogénesis y glucogenólisis).",
    patologia: "↓: predisposición a hipoglucemia.\n↑: empeora control de diabetes.",
    secundarias: "Favorece lipólisis y cetogénesis.",
    variaciones: "Respuesta depende de reservas de glucógeno y especie.",
    farmaco: "Incretinas y fármacos hipoglucemiantes modulan su acción."
  },
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Cortisol",
    sigla: "-",
    origen: "Producción: zona fasciculada de la corteza suprarrenal.\nLiberación: sangre.",
    funcion: "Hormona del estrés; moviliza energía y es antiinflamatoria.",
    patologia: "↑: hiperadrenocorticismo (Cushing).\n↓: hipoadrenocorticismo (Addison).",
    secundarias: "Modula presión arterial, inmunidad y metabolismo proteico.",
    variaciones: "Perros: Cushing común; caballos: síndromes con resistencia a insulina.",
    farmaco: "Glucocorticoides sintéticos imitan su acción; retirada brusca puede causar insuficiencia."
  },
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Hormona del crecimiento",
    sigla: "GH",
    origen: "Producción: adenohipófisis.\nLiberación: sangre.",
    funcion: "Estimula crecimiento tisular y anabolismo.",
    patologia: "↑: acromegalia, gigantismo.\n↓: enanismo hipofisario.",
    secundarias: "Afecta metabolismo de lípidos y carbohidratos vía IGF-1.",
    variaciones: "GH bovina para producción láctea es de uso regulado.",
    farmaco: "Análogos de somatostatina inhiben GH; fármacos dopaminérgicos también la modulan."
  },
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Tiroxina",
    sigla: "T4",
    origen: "Producción: tiroides (células foliculares).\nLiberación: sangre.",
    funcion: "Aumenta metabolismo basal y consumo de oxígeno.",
    patologia: "↓: hipotiroidismo (común en perros).\n↑: hipertiroidismo (común en gatos).",
    secundarias: "Participa en crecimiento, termorregulación y función cardiaca.",
    variaciones: "Perros → hipo; gatos geriátricos → hiper.",
    farmaco: "Levotiroxina, metimazol, carbimazol y yodo radioactivo modifican su nivel."
  },
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Triyodotironina",
    sigla: "T3",
    origen: "Producción: tiroides y conversión periférica desde T4.\nLiberación: sangre.",
    funcion: "Forma más activa de las hormonas tiroideas; regula metabolismo energético.",
    patologia: "Alteraciones similares a T4, más relacionadas con actividad tisular.",
    secundarias: "Importante en desarrollo neurológico y muscular.",
    variaciones: "Concentraciones dependen de la nutrición y enfermedades sistémicas.",
    farmaco: "Glucocorticoides y fenobarbital alteran su conversión desde T4."
  },
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Calcitonina",
    sigla: "-",
    origen: "Producción: células C de la tiroides.\nLiberación: sangre.",
    funcion: "Disminuye calcio sanguíneo favoreciendo depósito óseo.",
    patologia: "↓: menor freno a hipercalcemia.\n↑: hipocalcemia leve.",
    secundarias: "Actúa como contrarregulador de PTH.",
    variaciones: "Papel fisiológico menor que PTH/calcitriol en algunas especies.",
    farmaco: "Calcitonina sintética se puede usar en ciertos casos de hipercalcemia."
  },
  {
    sistema: "Endocrino/Metabólico",
    nombre: "Calcitriol (Vitamina D3 activa)",
    sigla: "-",
    origen: "Producción: riñón a partir de vitamina D activada en hígado.\nLiberación: sangre.",
    funcion: "Aumenta absorción intestinal de calcio y fósforo.",
    patologia: "↓: raquitismo, osteomalacia.\n↑: hipercalcemia y mineralización de tejidos.",
    secundarias: "Regula PTH y homeostasis mineral.",
    variaciones: "Conversión depende de función hepática y renal.",
    farmaco: "Suplementos de vitamina D y análogos se usan en hipocalcemia; exceso produce toxicidad."
  },

  // ===== INMUNOLÓGICO =====
  {
    sistema: "Inmunológico",
    nombre: "Interleucina-1",
    sigla: "IL-1",
    origen: "Producción: macrófagos, monocitos y otras células inmunes.\nLiberación: tejidos y sangre.",
    funcion: "Citocina proinflamatoria que induce fiebre y activa linfocitos.",
    patologia: "↑: sepsis, síndrome de respuesta inflamatoria sistémica.\n↓: respuesta inmune deficiente.",
    secundarias: "Estimula síntesis de proteínas de fase aguda.",
    variaciones: "Producción y respuesta varían según especie y patógeno.",
    farmaco: "AINEs y corticoides reducen las manifestaciones clínicas de su acción."
  },
  {
    sistema: "Inmunológico",
    nombre: "Interleucina-6",
    sigla: "IL-6",
    origen: "Producción: macrófagos, células endoteliales, fibroblastos.\nLiberación: sangre.",
    funcion: "Citocina clave de fase aguda; promueve inflamación sistémica.",
    patologia: "↑: inflamación crónica, SIRS.\n↓: menor respuesta a infecciones.",
    secundarias: "Estimula síntesis hepática de proteínas de fase aguda.",
    variaciones: "Útil como biomarcador en infecciones graves.",
    farmaco: "Corticoides e inmunosupresores disminuyen su producción."
  },
  {
    sistema: "Inmunológico",
    nombre: "Factor de necrosis tumoral alfa",
    sigla: "TNF-α",
    origen: "Producción: macrófagos, linfocitos T.\nLiberación: tejidos y sangre.",
    funcion: "Citocina clave en inflamación y sepsis.",
    patologia: "↑: shock séptico, caquexia.\n↓: susceptibilidad a infecciones.",
    secundarias: "Participa en apoptosis y defensa antitumoral.",
    variaciones: "Elevado en infecciones graves de perros, gatos y rumiantes.",
    farmaco: "AINEs, corticoides e inmunomoduladores reducen sus efectos."
  },

  // ===== ÓSEO / PIEL =====
  {
    sistema: "Óseo/Piel",
    nombre: "Hormona estimulante de melanocitos",
    sigla: "MSH",
    origen: "Producción: hipófisis intermedia.\nLiberación: sangre.",
    funcion: "Regula pigmentación cutánea en algunas especies.",
    patologia: "↑: hiperpigmentación.\n↓: despigmentación localizada.",
    secundarias: "Puede influir en apetito y comportamiento.",
    variaciones: "Niveles alterados en PPID equino.",
    farmaco: "Fármacos que actúan sobre hipófisis pueden modificar su secreción."
  }
];

// =========================
// BASE DE DATOS DE FÁRMACOS
// =========================

const farmacos = [
  {
    grupo: "Antibiótico fluoroquinolona",
    grupoClave: "antibiotico",
    nombre: "Enrofloxacina",
    nombreComercial: "Baytril®, Enroxil®, genéricos",
    especies: ["perro", "gato", "bovino", "porcino", "aves"],
    via: "VO, SC, IM",
    indicaciones: "Infecciones bacterianas del aparato respiratorio, digestivo, urinario y tejidos blandos.",
    contraindicaciones: "Cachorros en crecimiento, gestantes en algunas especies, animales con convulsiones.",
    dosis: "5–10 mg/kg según especie y formulación.",
    retiro: "Respetar tiempos específicos de cada presentación en bovinos, porcinos y aves.",
    notas: "No combinar con AINEs que disminuyan el umbral convulsivo; evitar uso indiscriminado por resistencia."
  },
  {
    grupo: "Antiparasitario endectocida",
    grupoClave: "antiparasitario",
    nombre: "Ivermectina",
    nombreComercial: "Ivomec®, Genéricos",
    especies: ["bovino", "equino", "ovino", "caprino", "porcino", "perro"],
    via: "SC, IM, VO (según especie).",
    indicaciones: "Control de parásitos gastrointestinales y ectoparásitos.",
    contraindicaciones: "Raças de perro sensibles a ivermectina (Collie y relacionadas); cuidado en animales debilitados.",
    dosis: "0,2–0,4 mg/kg según especie y vía.",
    retiro: "Tiempos de retiro prolongados en carne y leche según etiqueta.",
    notas: "No usar en gatos con formulaciones para grandes animales; riesgo de toxicidad neurológica."
  },
  {
    grupo: "Antiinflamatorio no esteroideo (AINE)",
    grupoClave: "aine",
    nombre: "Meloxicam",
    nombreComercial: "Metacam®, Meloxivet®, otros",
    especies: ["perro", "gato", "bovino"],
    via: "SC, IV, VO (según fórmula).",
    indicaciones: "Dolor e inflamación músculo-esquelética, posoperatorio.",
    contraindicaciones: "Insuficiencia renal/hepática, deshidratación, úlcera gástrica, uso conjunto con otros AINEs o corticoides.",
    dosis: "Perro: 0,2 mg/kg inicial, luego 0,1 mg/kg; gato: dosis única; bovino: según etiqueta.",
    retiro: "Obligatorio en bovinos (carne/leche) de acuerdo a producto.",
    notas: "Controlar función renal en tratamientos prolongados."
  },
  {
    grupo: "Anestésico disociativo",
    grupoClave: "anestesico",
    nombre: "Ketamina",
    nombreComercial: "Ketalar®, Imalgene®, etc.",
    especies: ["perro", "gato", "equino", "bovino"],
    via: "IV, IM.",
    indicaciones: "Inducción anestésica, procedimientos cortos, combinado con otros sedantes.",
    contraindicaciones: "Pacientes con hipertensión, enfermedad cardiaca grave, aumento de presión intracraneal.",
    dosis: "Depende de protocolo combinado (xilazina, midazolam, etc.).",
    retiro: "En animales de consumo, seguir recomendaciones específicas de cada país.",
    notas: "Produce anestesia disociativa; conservar reflejos; no utilizar sola en procedimientos dolorosos."
  }
];


// =========================
// LÓGICA DE FILTRO Y RENDER
// =========================
// Añadimos un campo especies por defecto en hormonas si no existe
hormonas.forEach((h) => {
  if (!h.especies) {
    h.especies = ["multiespecie"];
  }
});

// ========= DOM =========
const filtroSistema = document.getElementById("filtro-sistema");
const filtroEspecie = document.getElementById("filtro-especie");
const buscador = document.getElementById("buscador");

const filtroGrupoFarmaco = document.getElementById("filtro-grupo-farmaco");
const filtroEspecieFarmaco = document.getElementById("filtro-especie-farmaco");
const buscadorFarmaco = document.getElementById("buscador-farmaco");

const contHormonas = document.getElementById("contenedor-hormonas");
const contFarmacos = document.getElementById("contenedor-farmacos");

const filtrosHormonasSec = document.getElementById("filtros-hormonas");
const filtrosFarmacosSec = document.getElementById("filtros-farmacos");

const toggleTema = document.getElementById("toggle-tema");
const btnMenu = document.getElementById("btn-menu");
const panelMenu = document.getElementById("panel-menu");
const itemsMenu = document.querySelectorAll(".item-menu");

let moduloActual = "hormonas";

// Mapea el sistema a una clase CSS para el color
function claseSistema(sistema) {
  const s = sistema.toLowerCase();
  if (s.startsWith("digestivo")) return "sis-digestivo";
  if (s.startsWith("respiratorio/cardíaco")) return "sis-respiratorio-cardíaco";
  if (s.startsWith("cardíaco/circulatorio")) return "sis-cardíaco-circulatorio";
  if (s.startsWith("nervioso/neuroendocrino")) return "sis-nervioso-neuroendocrino";
  if (s.startsWith("renal/metabólico")) return "sis-renal-metabólico";
  if (s.startsWith("renal")) return "sis-renal";
  if (s.startsWith("reproductivo")) return "sis-reproductivo";
  if (s.startsWith("endocrino/metabólico")) return "sis-endocrino-metabólico";
  if (s.startsWith("inmunológico")) return "sis-inmunológico";
  if (s.startsWith("óseo/piel")) return "sis-óseo-piel";
  return "";
}

// --------- RENDER HORMONAS ---------
function renderHormonas(lista, filtrosAplicados) {
  contHormonas.innerHTML = "";

  if (!filtrosAplicados) {
    contHormonas.innerHTML = `
      <p class="mensaje-inicial">
        Usa el filtro de <strong>sistema</strong>, el filtro de 
        <strong>especie</strong> o escribe algo en <strong>Buscar</strong> 
        para ver las hormonas.
      </p>
    `;
    return;
  }

  if (lista.length === 0) {
    contHormonas.innerHTML = `<p>No se encontraron hormonas con esos criterios.</p>`;
    return;
  }

  lista.forEach((h) => {
    const card = document.createElement("article");
    const claseSis = claseSistema(h.sistema);
    card.className = `tarjeta-hormona ${claseSis}`;

    card.innerHTML = `
      <h2>${h.nombre}</h2>
      <div class="sigla">Sigla: <strong>${h.sigla || "-"}</strong></div>
      <span class="badge-sistema">${h.sistema}</span>
      <p><strong>Origen:</strong><br>${h.origen.replace(/\n/g, "<br>")}</p>
      <p><strong>Función principal:</strong> ${h.funcion}</p>
      <p><strong>Patología (↓ / ↑):</strong><br>${h.patologia.replace(/\n/g, "<br>")}</p>
      <p><strong>Funciones secundarias:</strong> ${h.secundarias}</p>
      <p><strong>Variaciones por especie:</strong> ${h.variaciones}</p>
      <p><strong>Afecciones farmacológicas:</strong> ${h.farmaco}</p>
    `;

    contHormonas.appendChild(card);
  });
}

function aplicarFiltrosHormonas() {
  const sistemaSeleccionado = filtroSistema.value;
  const especieSeleccionada = filtroEspecie.value;
  const texto = buscador.value.toLowerCase().trim();

  const filtrosAplicados =
    sistemaSeleccionado !== "todos" ||
    especieSeleccionada !== "todas" ||
    texto !== "";

  const filtradas = hormonas.filter((h) => {
    const coincideSistema =
      sistemaSeleccionado === "todos" || h.sistema === sistemaSeleccionado;

    const coincideEspecie =
      especieSeleccionada === "todas" ||
      (h.especies &&
        h.especies.map((e) => e.toLowerCase()).includes(especieSeleccionada));

    const textoEnCampos =
      texto === "" ||
      h.nombre.toLowerCase().includes(texto) ||
      h.sigla.toLowerCase().includes(texto) ||
      h.sistema.toLowerCase().includes(texto) ||
      h.funcion.toLowerCase().includes(texto) ||
      h.patologia.toLowerCase().includes(texto) ||
      h.variaciones.toLowerCase().includes(texto) ||
      h.farmaco.toLowerCase().includes(texto);

    return coincideSistema && coincideEspecie && textoEnCampos;
  });

  renderHormonas(filtradas, filtrosAplicados);
}

// --------- RENDER FÁRMACOS ---------
function renderFarmacos(lista, filtrosAplicados) {
  contFarmacos.innerHTML = "";

  if (!filtrosAplicados) {
    contFarmacos.innerHTML = `
      <p class="mensaje-inicial">
        Usa el filtro de <strong>grupo</strong>, el de 
        <strong>especie</strong> o el <strong>buscador</strong>
        para ver los fármacos.
      </p>
    `;
    return;
  }

  if (lista.length === 0) {
    contFarmacos.innerHTML = `<p>No se encontraron fármacos con esos criterios.</p>`;
    return;
  }

  lista.forEach((f) => {
    const card = document.createElement("article");
    card.className = "tarjeta-farmaco";

    card.innerHTML = `
      <h2>${f.nombre}</h2>
      <div class="sigla">Nombre comercial: <strong>${f.nombreComercial}</strong></div>
      <span class="badge-grupo">${f.grupo}</span>
      <p><strong>Vías:</strong> ${f.via}</p>
      <p><strong>Especies:</strong> ${f.especies.join(", ")}</p>
      <p><strong>Indicaciones:</strong> ${f.indicaciones}</p>
      <p><strong>Contraindicaciones:</strong> ${f.contraindicaciones}</p>
      <p><strong>Dosis general:</strong> ${f.dosis}</p>
      <p><strong>Período de retiro:</strong> ${f.retiro}</p>
      <p><strong>Notas / advertencias:</strong> ${f.notas}</p>
    `;

    contFarmacos.appendChild(card);
  });
}

function aplicarFiltrosFarmacos() {
  const grupoSel = filtroGrupoFarmaco.value;
  const especieSel = filtroEspecieFarmaco.value;
  const texto = buscadorFarmaco.value.toLowerCase().trim();

  const filtrosAplicados =
    grupoSel !== "todos" ||
    especieSel !== "todas" ||
    texto !== "";

  const filtradas = farmacos.filter((f) => {
    const coincideGrupo =
      grupoSel === "todos" || f.grupoClave === grupoSel;

    const coincideEspecie =
      especieSel === "todas" ||
      f.especies.map((e) => e.toLowerCase()).includes(especieSel);

    const textoEnCampos =
      texto === "" ||
      f.nombre.toLowerCase().includes(texto) ||
      f.nombreComercial.toLowerCase().includes(texto) ||
      f.grupo.toLowerCase().includes(texto) ||
      f.indicaciones.toLowerCase().includes(texto) ||
      f.contraindicaciones.toLowerCase().includes(texto);

    return coincideGrupo && coincideEspecie && textoEnCampos;
  });

  renderFarmacos(filtradas, filtrosAplicados);
}

// --------- CAMBIO DE MÓDULO ---------
function cambiarModulo(modulo) {
  moduloActual = modulo;

  if (modulo === "hormonas") {
    filtrosHormonasSec.classList.remove("oculto");
    contHormonas.classList.remove("oculto");
    filtrosFarmacosSec.classList.add("oculto");
    contFarmacos.classList.add("oculto");
  } else {
    filtrosHormonasSec.classList.add("oculto");
    contHormonas.classList.add("oculto");
    filtrosFarmacosSec.classList.remove("oculto");
    contFarmacos.classList.remove("oculto");
  }

  itemsMenu.forEach((btn) => {
    btn.classList.toggle("activo", btn.dataset.modulo === modulo);
  });

  panelMenu.classList.add("oculto");

  if (modulo === "hormonas") {
    renderHormonas([], false);
  } else {
    renderFarmacos([], false);
  }
}

// --------- TEMA OSCURO ---------
function cargarTema() {
  const tema = localStorage.getItem("tema-hormonas-vet");
  if (tema === "dark") {
    document.body.classList.add("dark");
    toggleTema.textContent = "Modo claro";
  } else {
    document.body.classList.remove("dark");
    toggleTema.textContent = "Modo oscuro";
  }
}

toggleTema.addEventListener("click", () => {
  const esDark = document.body.classList.toggle("dark");
  localStorage.setItem("tema-hormonas-vet", esDark ? "dark" : "light");
  toggleTema.textContent = esDark ? "Modo claro" : "Modo oscuro";
});

// --------- EVENTOS ---------
filtroSistema.addEventListener("change", aplicarFiltrosHormonas);
filtroEspecie.addEventListener("change", aplicarFiltrosHormonas);
buscador.addEventListener("input", aplicarFiltrosHormonas);

filtroGrupoFarmaco.addEventListener("change", aplicarFiltrosFarmacos);
filtroEspecieFarmaco.addEventListener("change", aplicarFiltrosFarmacos);
buscadorFarmaco.addEventListener("input", aplicarFiltrosFarmacos);

btnMenu.addEventListener("click", () => {
  panelMenu.classList.toggle("oculto");
});

itemsMenu.forEach((btn) => {
  btn.addEventListener("click", () => {
    cambiarModulo(btn.dataset.modulo);
  });
});

// --------- ESTADO INICIAL ---------
cargarTema();
cambiarModulo("hormonas");
