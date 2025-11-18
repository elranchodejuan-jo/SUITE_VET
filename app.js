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
// Nota: dosis y concentraciones orientadas a estudio, NO sustituyen vademécum oficial.

// Cada entrada:
// grupoClave: para el filtro por grupo grande
// grupo: texto que se muestra (incluye subfamilia)
// nombre: fármaco principal
// dosisEspecies: solo en algunos, para usar en calculadora

const farmacos = [
  // ========== ANTIMICROBIANOS ==========
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Penicilinas",
    nombre: "Amoxicilina",
    nombreComercial: "Amoxivet®, Amoxicilina genéricos",
    especies: ["perro", "gato", "bovino", "porcino"],
    via: "VO, IM",
    indicaciones: "Infecciones de piel, tejidos blandos, respiratorias y urinarias sensibles a penicilinas.",
    contraindicaciones: "Alergia a penicilinas/β-lactámicos; cuidado en animales con insuficiencia renal.",
    dosis: "Perro/gato: 10–20 mg/kg VO cada 12 h; bovinos/porcinos: según etiqueta.",
    retiro: "Respetar tiempos de retiro en carne y leche según producto.",
    notas: "Representa el grupo de penicilinas (amoxicilina, ampicilina, etc.)."
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Cefalosporinas",
    nombre: "Cefalexina",
    nombreComercial: "Rilexine®, Cefalexina genéricos",
    especies: ["perro", "gato"],
    via: "VO",
    indicaciones: "Infecciones de piel, urinarias y respiratorias.",
    contraindicaciones: "Alergia a cefalosporinas/penicilinas.",
    dosis: "20–30 mg/kg VO cada 12 h.",
    retiro: "No usar en animales de consumo si el producto no está registrado.",
    notas: "Ejemplo del grupo cefalosporinas de primera generación."
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Carbapenémicos",
    nombre: "Meropenem",
    nombreComercial: "Meronem® (uso humano, excepcional en vet)",
    especies: ["perro", "gato"],
    via: "IV",
    indicaciones: "Infecciones graves por bacterias multirresistentes en entorno hospitalario.",
    contraindicaciones: "Uso restringido; solo bajo criterio especializado.",
    dosis: "Según protocolos hospitalarios.",
    retiro: "No usar en animales de consumo.",
    notas: "Antibiótico de reserva; se incluye para fines académicos."
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Monobactámicos",
    nombre: "Aztreonam",
    nombreComercial: "Azactam®",
    especies: ["perro", "gato"],
    via: "IV, IM",
    indicaciones: "Infecciones graves por Gram negativos; raro en vet.",
    contraindicaciones: "Hipersensibilidad al fármaco.",
    dosis: "Uso y dosis basados en protocolos humanos adaptados; solo estudio.",
    retiro: "No usar en animales de consumo.",
    notas: "Incluido por referencia académica."
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Aminoglucósidos",
    nombre: "Gentamicina",
    nombreComercial: "Genta-100®, Gentavet®",
    especies: ["perro", "gato", "bovino", "porcino"],
    via: "IV, IM",
    indicaciones: "Infecciones graves por Gram negativos.",
    contraindicaciones: "Insuficiencia renal, deshidratación; evitar en neonatos.",
    dosis: "4–6 mg/kg IV/IM cada 24 h (perros); otras especies según etiqueta.",
    retiro: "Retiro prolongado en animales de consumo.",
    notas: "Riesgo de nefrotoxicidad y ototoxicidad."
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Macrólidos",
    nombre: "Tilmicosina",
    nombreComercial: "Micotil®",
    especies: ["bovino"],
    via: "SC",
    indicaciones: "Neumonía bovina por patógenos respiratorios.",
    contraindicaciones: "POTENCIALMENTE LETAL EN HUMANOS, OVINOS Y CAPRINOS; no usar en estos.",
    dosis: "10 mg/kg SC dosis única.",
    retiro: "Respetar retiro oficial en carne/leche.",
    notas: "Manejo extremadamente cuidadoso."
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Lincosamidas",
    nombre: "Clindamicina",
    nombreComercial: "Antirobe®, Clindavet®",
    especies: ["perro", "gato"],
    via: "VO",
    indicaciones: "Infecciones de piel, cavidad oral, osteomielitis.",
    contraindicaciones: "No usar en herbívoros (riesgo de colitis grave).",
    dosis: "5–10 mg/kg VO cada 12 h.",
    retiro: "No usar en animales de consumo si no está registrado.",
    notas: ""
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Fenicoles",
    nombre: "Florfenicol",
    nombreComercial: "Nuflor®, Florfen®",
    especies: ["bovino", "porcino"],
    via: "IM, SC",
    indicaciones: "Enfermedad respiratoria bovina y porcina.",
    contraindicaciones: "No usar en hembras productoras de leche para consumo humano.",
    dosis: "Según etiqueta (20–40 mg/kg).",
    retiro: "Tiempos de retiro importantes en carne y leche.",
    notas: ""
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Tetraciclinas",
    nombre: "Doxiciclina",
    nombreComercial: "Doxiciclina genéricos",
    especies: ["perro", "gato"],
    via: "VO",
    indicaciones: "Erliquiosis, anaplasmosis, infecciones respiratorias.",
    contraindicaciones: "No usar en cachorros en crecimiento prolongadamente (afecta esmalte dental).",
    dosis: "5–10 mg/kg VO cada 12–24 h.",
    retiro: "No usar en animales de consumo sin registro.",
    notas: ""
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Sulfonamidas + Trimetoprim",
    nombre: "Trimetoprim-sulfa",
    nombreComercial: "TMS®, Trisulfa®",
    especies: ["perro", "gato", "bovino"],
    via: "VO, IV",
    indicaciones: "Infecciones urinarias, respiratorias y sistémicas.",
    contraindicaciones: "Alteraciones de médula ósea, insuficiencia renal/hepática.",
    dosis: "15–30 mg/kg VO cada 12 h (como combinación).",
    retiro: "Tiempos de retiro en animales de consumo.",
    notas: ""
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Fluoroquinolonas",
    nombre: "Enrofloxacina",
    nombreComercial: "Baytril®, Enroxil®, genéricos",
    especies: ["perro", "gato", "bovino", "porcino", "aves"],
    via: "VO, SC, IM",
    indicaciones: "Infecciones bacterianas del aparato respiratorio, digestivo, urinario y tejidos blandos.",
    contraindicaciones: "Cachorros en crecimiento, gestantes en algunas especies, animales con convulsiones.",
    dosis: "5–10 mg/kg según especie y formulación.",
    retiro: "Respetar tiempos específicos de cada presentación en bovinos, porcinos y aves.",
    notas: "Evitar uso indiscriminado por resistencia bacteriana.",
    dosisEspecies: {
      perro: {
        vias: ["VO", "SC"],
        mgKg: 5,
        concMgMl: 50,
        frecuencia: "cada 24 h",
        dias: "5–7 días"
      },
      gato: {
        vias: ["VO"],
        mgKg: 5,
        concMgMl: 25,
        frecuencia: "cada 24 h",
        dias: "5–7 días"
      },
      bovino: {
        vias: ["SC", "IM"],
        mgKg: 2.5,
        concMgMl: 100,
        frecuencia: "cada 24 h",
        dias: "3–5 días"
      },
      porcino: {
        vias: ["IM"],
        mgKg: 2.5,
        concMgMl: 100,
        frecuencia: "cada 24 h",
        dias: "3–5 días"
      },
      aves: {
        vias: ["VO"],
        mgKg: 10,
        concMgMl: 100,
        frecuencia: "en agua de bebida, según consumo",
        dias: "3–5 días"
      }
    }
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Nitroimidazoles",
    nombre: "Metronidazol",
    nombreComercial: "Flagyl®, genéricos",
    especies: ["perro", "gato"],
    via: "VO, IV",
    indicaciones: "Diarreas por Giardia/anaerobios, infecciones por anaerobios.",
    contraindicaciones: "Gestación temprana; precaución en hepatopatías.",
    dosis: "10–15 mg/kg VO cada 12 h.",
    retiro: "No usar en animales de consumo.",
    notas: ""
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Antimicóticos",
    nombre: "Ketoconazol",
    nombreComercial: "Nizoral®, genéricos",
    especies: ["perro"],
    via: "VO",
    indicaciones: "Dermatomicosis, levaduras cutáneas.",
    contraindicaciones: "Enfermedad hepática; riesgo de hepatotoxicidad.",
    dosis: "5–10 mg/kg VO cada 12–24 h.",
    retiro: "No indicado en animales de consumo.",
    notas: ""
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Antivirales",
    nombre: "Aciclovir (uso limitado)",
    nombreComercial: "Zovirax®, genéricos",
    especies: ["perro", "gato"],
    via: "VO, tópico",
    indicaciones: "Uso muy limitado en vet; infecciones por herpesvirus.",
    contraindicaciones: "Escasa evidencia; se incluye solo con fines académicos.",
    dosis: "Variable; consultar literatura específica.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "antimicrobiano",
    grupo: "Antimicrobiano – Antituberculosos",
    nombre: "Isoniazida",
    nombreComercial: "Isoniazida genéricos",
    especies: ["perro"],
    via: "VO",
    indicaciones: "Raro uso en vet; tuberculosis en contextos muy específicos.",
    contraindicaciones: "Tóxico en sobredosis; uso muy restringido.",
    dosis: "Solo con guía especializada.",
    retiro: "",
    notas: "Incluido solo para referencia académica."
  },

  // ========== ANTIPARASITARIOS ==========
  {
    grupoClave: "antiparasitario",
    grupo: "Antiparasitario – Endectocidas",
    nombre: "Ivermectina",
    nombreComercial: "Ivomec®, genéricos",
    especies: ["bovino", "equino", "ovino", "caprino", "porcino", "perro"],
    via: "SC, IM, VO (según especie).",
    indicaciones: "Control de parásitos gastrointestinales y ectoparásitos.",
    contraindicaciones: "Razas de perro sensibles a ivermectina (Collie y relacionadas); cuidado en animales debilitados.",
    dosis: "0,2–0,4 mg/kg según especie y vía.",
    retiro: "Tiempos de retiro prolongados en carne y leche según etiqueta.",
    notas: "No usar en gatos con formulaciones para grandes animales.",
    dosisEspecies: {
      bovino: {
        vias: ["SC"],
        mgKg: 0.2,
        concMgMl: 10,
        frecuencia: "dosis única",
        dias: "una sola aplicación"
      },
      equino: {
        vias: ["VO"],
        mgKg: 0.2,
        concMgMl: 10,
        frecuencia: "dosis única",
        dias: "una sola aplicación"
      },
      ovino: {
        vias: ["SC"],
        mgKg: 0.2,
        concMgMl: 10,
        frecuencia: "dosis única",
        dias: "una sola aplicación"
      },
      caprino: {
        vias: ["SC"],
        mgKg: 0.2,
        concMgMl: 10,
        frecuencia: "dosis única",
        dias: "una sola aplicación"
      },
      porcino: {
        vias: ["IM"],
        mgKg: 0.3,
        concMgMl: 10,
        frecuencia: "dosis única",
        dias: "una sola aplicación"
      },
      perro: {
        vias: ["SC"],
        mgKg: 0.2,
        concMgMl: 1,
        frecuencia: "según protocolo",
        dias: "variable"
      }
    }
  },
  {
    grupoClave: "antiparasitario",
    grupo: "Antiparasitario – Antinematodales",
    nombre: "Albendazol",
    nombreComercial: "Valbazen®, Albendazol genéricos",
    especies: ["bovino", "ovino", "caprino"],
    via: "VO",
    indicaciones: "Nematodos gastrointestinales, algunos cestodos.",
    contraindicaciones: "No usar en gestación temprana.",
    dosis: "5–10 mg/kg VO según especie.",
    retiro: "Respetar retiro en carne y leche.",
    notas: ""
  },
  {
    grupoClave: "antiparasitario",
    grupo: "Antiparasitario – Anticestodales",
    nombre: "Praziquantel",
    nombreComercial: "Drontal®, otros",
    especies: ["perro", "gato"],
    via: "VO",
    indicaciones: "Tenias intestinales.",
    contraindicaciones: "Muy seguro; seguir dosis recomendada.",
    dosis: "5–10 mg/kg VO dosis única.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "antiparasitario",
    grupo: "Antiparasitario – Antitrematodales",
    nombre: "Triclabendazol",
    nombreComercial: "Fasinex®",
    especies: ["bovino", "ovino"],
    via: "VO",
    indicaciones: "Fasciola hepática.",
    contraindicaciones: "Uso según etiqueta.",
    dosis: "10–12 mg/kg VO.",
    retiro: "Retiro prolongado en carne y leche.",
    notas: ""
  },
  {
    grupoClave: "antiparasitario",
    grupo: "Antiparasitario – Coccidiostatos",
    nombre: "Toltrazuril",
    nombreComercial: "Baycox®",
    especies: ["porcino", "aves"],
    via: "VO",
    indicaciones: "Coccidiosis.",
    contraindicaciones: "Respetar dosis; sobredosis puede ser tóxica.",
    dosis: "20 mg/kg VO dosis única (porcinos).",
    retiro: "Según etiqueta en animales de consumo.",
    notas: ""
  },
  {
    grupoClave: "antiparasitario",
    grupo: "Antiparasitario – Antiprotozoarios",
    nombre: "Imidocarb",
    nombreComercial: "Imizol®",
    especies: ["perro", "bovino"],
    via: "IM, SC",
    indicaciones: "Babesiosis, anaplasmosis.",
    contraindicaciones: "Puede causar dolor local, colinérgicos; usar con atropina.",
    dosis: "5–6 mg/kg SC/IM según protocolo.",
    retiro: "Retiro prolongado en animales de consumo.",
    notas: ""
  },

  // ========== AINEs ==========
  {
    grupoClave: "aine",
    grupo: "AINE – Oxicam",
    nombre: "Meloxicam",
    nombreComercial: "Metacam®, Meloxivet®, otros",
    especies: ["perro", "gato", "bovino"],
    via: "SC, IV, VO",
    indicaciones: "Dolor e inflamación músculo-esquelética, posoperatorio.",
    contraindicaciones: "Insuficiencia renal/hepática, deshidratación, úlcera gástrica, uso conjunto con otros AINEs o corticoides.",
    dosis: "Perro: 0,2 mg/kg inicial, luego 0,1 mg/kg; gato: dosis única; bovino: según etiqueta.",
    retiro: "Obligatorio en bovinos de acuerdo a producto.",
    notas: "Controlar función renal en tratamientos prolongados.",
    dosisEspecies: {
      perro: {
        vias: ["VO", "SC"],
        mgKg: 0.2,
        concMgMl: 5,
        frecuencia: "dosis inicial, luego 0,1 mg/kg cada 24 h",
        dias: "3–5 días"
      },
      gato: {
        vias: ["SC"],
        mgKg: 0.3,
        concMgMl: 5,
        frecuencia: "dosis única",
        dias: "una sola aplicación"
      },
      bovino: {
        vias: ["SC", "IV"],
        mgKg: 0.5,
        concMgMl: 20,
        frecuencia: "una vez al día",
        dias: "1–3 días"
      }
    }
  },
  {
    grupoClave: "aine",
    grupo: "AINE – Carboxílico",
    nombre: "Carprofeno",
    nombreComercial: "Rimadyl®, Carprodog®",
    especies: ["perro"],
    via: "VO, SC",
    indicaciones: "Dolor osteoarticular, posoperatorio.",
    contraindicaciones: "Enfermedad renal/hepática, úlceras.",
    dosis: "4,4 mg/kg VO/SC cada 24 h o dividido cada 12 h.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "aine",
    grupo: "AINE – Propiónico",
    nombre: "Ketoprofeno",
    nombreComercial: "Ketofen®",
    especies: ["perro", "gato", "bovino"],
    via: "IV, IM, VO",
    indicaciones: "Dolor agudo, fiebre.",
    contraindicaciones: "Riesgo gástrico y renal.",
    dosis: "Perro: 1 mg/kg; bovino: según etiqueta.",
    retiro: "Retiro en animales de consumo.",
    notas: ""
  },
  {
    grupoClave: "aine",
    grupo: "AINE – Flunixino",
    nombre: "Flunixin meglumine",
    nombreComercial: "Finadyne®, Banamine®",
    especies: ["bovino", "equino"],
    via: "IV, IM",
    indicaciones: "Cólicos, endotoxemia, inflamación aguda.",
    contraindicaciones: "Uso prolongado → úlceras, nefrotoxicidad.",
    dosis: "1,1 mg/kg IV.",
    retiro: "Respetar retiro en carne/leche.",
    notas: ""
  },
  {
    grupoClave: "aine",
    grupo: "AINE – Derivado acético",
    nombre: "Diclofenaco",
    nombreComercial: "Diclofenaco genéricos",
    especies: ["perro"],
    via: "VO",
    indicaciones: "Dolor leve a moderado.",
    contraindicaciones: "Alto riesgo gástrico; preferir otros AINEs en vet.",
    dosis: "Rango estrecho; uso limitado.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "aine",
    grupo: "AINE – Coxib",
    nombre: "Robenacoxib",
    nombreComercial: "Onsior®",
    especies: ["perro", "gato"],
    via: "VO, SC",
    indicaciones: "Dolor y inflamación posoperatoria.",
    contraindicaciones: "Enfermedad renal/hepática grave.",
    dosis: "Perro: 1–2 mg/kg; gato: 1–2 mg/kg por pocos días.",
    retiro: "",
    notas: ""
  },

  // ========== ANESTÉSICOS Y SEDANTES ==========
  {
    grupoClave: "anestesico",
    grupo: "Anestésico disociativo",
    nombre: "Ketamina",
    nombreComercial: "Ketalar®, Imalgene®, etc.",
    especies: ["perro", "gato", "equino", "bovino"],
    via: "IV, IM.",
    indicaciones: "Inducción anestésica, procedimientos cortos, combinado con otros sedantes.",
    contraindicaciones: "Pacientes con hipertensión, enfermedad cardiaca grave, aumento de presión intracraneal.",
    dosis: "Depende de protocolo combinado (xilazina, midazolam, etc.).",
    retiro: "En animales de consumo, seguir recomendaciones específicas de cada país.",
    notas: "Produce anestesia disociativa.",
    dosisEspecies: {
      perro: {
        vias: ["IV", "IM"],
        mgKg: 5,
        concMgMl: 50,
        frecuencia: "dosis única en inducción",
        dias: "una sola aplicación"
      },
      gato: {
        vias: ["IM"],
        mgKg: 10,
        concMgMl: 100,
        frecuencia: "dosis única en inducción",
        dias: "una sola aplicación"
      },
      equino: {
        vias: ["IV"],
        mgKg: 2.2,
        concMgMl: 100,
        frecuencia: "dosis única en inducción",
        dias: "una sola aplicación"
      },
      bovino: {
        vias: ["IV"],
        mgKg: 2,
        concMgMl: 100,
        frecuencia: "dosis única en inducción",
        dias: "una sola aplicación"
      }
    }
  },
  {
    grupoClave: "anestesico",
    grupo: "Anestésico general IV",
    nombre: "Propofol",
    nombreComercial: "Diprivan®, Propofol vet",
    especies: ["perro", "gato"],
    via: "IV",
    indicaciones: "Inducción y mantenimiento anestésico.",
    contraindicaciones: "Hipovolemia grave, shock.",
    dosis: "4–6 mg/kg IV en perros; menor en gatos.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Anestésico inhalatorio",
    nombre: "Isofluorano / Sevofluorano",
    nombreComercial: "Isoflo®, SevoFlo®",
    especies: ["multiespecie"],
    via: "Inhalatoria",
    indicaciones: "Mantenimiento anestésico.",
    contraindicaciones: "Equipo adecuado; evitar exposición del personal.",
    dosis: "Según CAM y protocolo.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Alfa-2 agonista",
    nombre: "Xilazina",
    nombreComercial: "Xilazin®, Rompun®",
    especies: ["perro", "gato", "bovino", "equino"],
    via: "IM, IV",
    indicaciones: "Sedación, analgesia, preanestesia.",
    contraindicaciones: "Gestación avanzada en rumiantes, cardiopatías.",
    dosis: "Depende de especie (muy sensibles bovinos).",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Alfa-2 agonista",
    nombre: "Dexmedetomidina",
    nombreComercial: "Dexdomitor®",
    especies: ["perro", "gato"],
    via: "IM, IV",
    indicaciones: "Sedación y analgesia.",
    contraindicaciones: "Cardiopatías, shock.",
    dosis: "5–10 µg/kg según vía.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Fenotiazina",
    nombre: "Acepromazina",
    nombreComercial: "Acepran®",
    especies: ["perro", "gato", "equino"],
    via: "IM, IV, VO",
    indicaciones: "Tranquilización, premedicación.",
    contraindicaciones: "Hipotensión, shock, epilepsia.",
    dosis: "0,02–0,05 mg/kg perro/gato.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Benzodiacepina",
    nombre: "Midazolam",
    nombreComercial: "Dormicum®, genéricos",
    especies: ["perro", "gato"],
    via: "IV, IM",
    indicaciones: "Sedación, coinducción anestésica.",
    contraindicaciones: "Raro; cuidado en pacientes agresivos solo con BDZ.",
    dosis: "0,2–0,5 mg/kg.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Benzodiacepina",
    nombre: "Diazepam",
    nombreComercial: "Valium®, genéricos",
    especies: ["perro", "gato"],
    via: "IV, rectal",
    indicaciones: "Anticonvulsivante agudo, sedación.",
    contraindicaciones: "Hepatopatías severas.",
    dosis: "0,5 mg/kg IV en crisis convulsiva.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Agonista opioide",
    nombre: "Butorfanol",
    nombreComercial: "Torbugesic®",
    especies: ["perro", "gato", "equino"],
    via: "IM, IV",
    indicaciones: "Analgesia moderada, tos.",
    contraindicaciones: "Insuficiencia respiratoria grave.",
    dosis: "0,2–0,4 mg/kg perros/gatos.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "anestesico",
    grupo: "Agonista parcial opioide",
    nombre: "Buprenorfina",
    nombreComercial: "Buprex®, Vetergesic®",
    especies: ["perro", "gato"],
    via: "IM, IV, transmucosa",
    indicaciones: "Analgesia moderada a intensa.",
    contraindicaciones: "Precaución con otros opioides plenos.",
    dosis: "0,01–0,02 mg/kg.",
    retiro: "",
    notas: ""
  },

  // ========== HORMONAS SINTÉTICAS ==========
  {
    grupoClave: "hormona",
    grupo: "Glucocorticoide sintético",
    nombre: "Dexametasona",
    nombreComercial: "Dexasone®, Dexavet®",
    especies: ["perro", "gato", "bovino"],
    via: "IV, IM",
    indicaciones: "Shock, alergias graves, terapia antiinflamatoria potente.",
    contraindicaciones: "Infecciones no controladas, úlceras GI, gestación avanzada (efecto abortivo).",
    dosis: "0,1–1 mg/kg según indicación.",
    retiro: "Respetar retiro en bovinos.",
    notas: "Puede inducir aborto en hembras gestantes."
  },
  {
    grupoClave: "hormona",
    grupo: "Prostaglandina F2α",
    nombre: "Cloprostenol (PGF2α análogo)",
    nombreComercial: "Estrumate®, otros",
    especies: ["bovino", "equino"],
    via: "IM",
    indicaciones: "Lisis de cuerpo lúteo, sincronización de celo, tratamiento de piometras.",
    contraindicaciones: "No usar en gestación avanzada si no se busca aborto.",
    dosis: "Según protocolo reproductivo.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "hormona",
    grupo: "Análogo de GnRH",
    nombre: "Buserelina",
    nombreComercial: "Receptal®",
    especies: ["bovino"],
    via: "IM",
    indicaciones: "Inducción de ovulación, protocolos Ovsynch.",
    contraindicaciones: "",
    dosis: "Según protocolo.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "hormona",
    grupo: "Oxitócico",
    nombre: "Oxitocina",
    nombreComercial: "Oxitocina vet",
    especies: ["bovino", "equino", "perro", "gato"],
    via: "IM, IV",
    indicaciones: "Atonía uterina, retención de placenta, ayuda en parto.",
    contraindicaciones: "Obstrucción mecánica del canal del parto.",
    dosis: "Variable según especie.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "hormona",
    grupo: "Progestágeno sintético",
    nombre: "Altrenogest / Progesterona sintética",
    nombreComercial: "Regumate®",
    especies: ["equino", "porcino"],
    via: "VO",
    indicaciones: "Control de celo, sincronización de ciclo.",
    contraindicaciones: "No usar en hembras con patología uterina.",
    dosis: "Según etiqueta.",
    retiro: "",
    notas: ""
  },

  // ========== CARDIOLÓGICOS ==========
  {
    grupoClave: "cardio",
    grupo: "Inodilatador cardiaco",
    nombre: "Pimobendan",
    nombreComercial: "Vetmedin®",
    especies: ["perro"],
    via: "VO",
    indicaciones: "Insuficiencia cardiaca congestiva por enfermedad valvular o DCM.",
    contraindicaciones: "Cardiomiopatías obstructivas, estenosis severas.",
    dosis: "0,2–0,3 mg/kg cada 12 h.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "cardio",
    grupo: "Diurético de asa",
    nombre: "Furosemida",
    nombreComercial: "Lasix®, Diurapid®",
    especies: ["perro", "gato", "bovino"],
    via: "IV, IM, VO",
    indicaciones: "Edema pulmonar, ascitis, insuficiencia cardiaca.",
    contraindicaciones: "Deshidratación, insuficiencia renal grave sin monitorización.",
    dosis: "2–4 mg/kg IV/IM/VO en perros.",
    retiro: "Respetar en bovinos.",
    notas: ""
  },
  {
    grupoClave: "cardio",
    grupo: "Diurético ahorrador de potasio",
    nombre: "Espironolactona",
    nombreComercial: "Aldactone®",
    especies: ["perro"],
    via: "VO",
    indicaciones: "Insuficiencia cardiaca congestiva (junto a otros fármacos).",
    contraindicaciones: "Hiperkalemia.",
    dosis: "1–2 mg/kg VO cada 12–24 h.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "cardio",
    grupo: "IECA",
    nombre: "Enalapril",
    nombreComercial: "Enacard®, Vastarel®",
    especies: ["perro"],
    via: "VO",
    indicaciones: "Insuficiencia cardiaca, hipertensión.",
    contraindicaciones: "Hipotensión, enfermedad renal grave.",
    dosis: "0,5 mg/kg VO cada 12–24 h.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "cardio",
    grupo: "Glicosido cardiaco",
    nombre: "Digoxina",
    nombreComercial: "Lanoxin®",
    especies: ["perro"],
    via: "VO, IV",
    indicaciones: "Control de frecuencia en fibrilación auricular.",
    contraindicaciones: "Bloqueos AV, hipokalemia.",
    dosis: "Muy estrecho margen terapéutico; ajustar con peso ideal.",
    retiro: "",
    notas: ""
  },

  // ========== NEUROLÓGICOS ==========
  {
    grupoClave: "neuro",
    grupo: "Anticonvulsivante barbitúrico",
    nombre: "Fenobarbital",
    nombreComercial: "Gardenal®, Luminal®",
    especies: ["perro", "gato"],
    via: "VO, IV",
    indicaciones: "Epilepsia idiopática, convulsiones crónicas.",
    contraindicaciones: "Enfermedad hepática severa.",
    dosis: "2–3 mg/kg VO cada 12 h (ajustado por niveles séricos).",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "neuro",
    grupo: "Anticonvulsivante",
    nombre: "Levetiracetam",
    nombreComercial: "Keppra®",
    especies: ["perro", "gato"],
    via: "VO, IV",
    indicaciones: "Epilepsia refractaria o como coadyuvante.",
    contraindicaciones: "Muy seguro; ajustar en insuficiencia renal.",
    dosis: "20–30 mg/kg VO cada 8 h.",
    retiro: "",
    notas: ""
  },

  // ========== PROTECTORES GÁSTRICOS ==========
  {
    grupoClave: "gastrico",
    grupo: "IBP (inhibidor bomba de protones)",
    nombre: "Omeprazol",
    nombreComercial: "Losec®, Gastrovet®",
    especies: ["perro", "gato", "equino"],
    via: "VO",
    indicaciones: "Úlceras gástricas, gastritis, reflujo.",
    contraindicaciones: "Muy seguro; uso prolongado con criterio.",
    dosis: "0,7–1 mg/kg VO cada 24 h en perros.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "gastrico",
    grupo: "Antihistamínico H2",
    nombre: "Ranitidina / Famotidina",
    nombreComercial: "Zantac®, Famodin®",
    especies: ["perro", "gato"],
    via: "VO, IV",
    indicaciones: "Reducción de secreción ácida gástrica.",
    contraindicaciones: "Insuficiencia renal grave (ajustar).",
    dosis: "Ranitidina: 2 mg/kg; famotidina: 0,5–1 mg/kg.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "gastrico",
    grupo: "Protector de mucosa",
    nombre: "Sucralfato",
    nombreComercial: "Ulcozid®, Carafate®",
    especies: ["perro", "gato", "equino"],
    via: "VO",
    indicaciones: "Úlceras gástricas y duodenales.",
    contraindicaciones: "Separar de otros fármacos (interfiere absorción).",
    dosis: "0,5–1 g/animal 2–3 veces al día (perros grandes).",
    retiro: "",
    notas: ""
  },

  // ========== OTROS CLÍNICOS IMPORTANTES ==========
  {
    grupoClave: "otros",
    grupo: "Antiemético neurocinético",
    nombre: "Maropitant",
    nombreComercial: "Cerenia®",
    especies: ["perro", "gato"],
    via: "SC, VO",
    indicaciones: "Vómitos agudos y crónicos, cinetosis.",
    contraindicaciones: "Cuidado en hepatopatías.",
    dosis: "1 mg/kg SC/VO cada 24 h.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "otros",
    grupo: "Inmunosupresor",
    nombre: "Ciclosporina",
    nombreComercial: "Atopica®",
    especies: ["perro", "gato"],
    via: "VO",
    indicaciones: "Dermatitis atópica, algunas enfermedades inmunomediadas.",
    contraindicaciones: "Neoplasias, infecciones graves.",
    dosis: "5 mg/kg VO cada 24 h.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "otros",
    grupo: "Corticoides varios",
    nombre: "Prednisolona",
    nombreComercial: "Prednidale®, otros",
    especies: ["perro", "gato"],
    via: "VO, IM",
    indicaciones: "Tratamiento antiinflamatorio e inmunosupresor.",
    contraindicaciones: "Infecciones no controladas, diabetes, úlceras GI.",
    dosis: "0,5–2 mg/kg según uso (antiinflamatorio vs inmunosupresor).",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "otros",
    grupo: "Vitaminas inyectables",
    nombre: "Complejo B / Multivitamínicos",
    nombreComercial: "Vita-B®, Complejo B vet",
    especies: ["multiespecie"],
    via: "IM, SC",
    indicaciones: "Soporte metabólico, anorexia, convalecencia.",
    contraindicaciones: "Cuidado con formulaciones muy concentradas en pequeños animales.",
    dosis: "Según etiqueta.",
    retiro: "",
    notas: ""
  },
  {
    grupoClave: "otros",
    grupo: "Hemoderivados",
    nombre: "Plasma / Concentrado eritrocitario",
    nombreComercial: "Banco de sangre veterinario",
    especies: ["perro", "gato", "equino"],
    via: "IV",
    indicaciones: "Anemia aguda, coagulopatías, hipoalbuminemia.",
    contraindicaciones: "Reacciones transfusionales; realizar pruebas de compatibilidad.",
    dosis: "ml/kg según déficit.",
    retiro: "",
    notas: ""
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

// Calculadora de fármacos
const calcPanel = document.getElementById("calc-farmaco");
const selFarmacoCalc = document.getElementById("calc-farmaco-select");
const selEspecieCalc = document.getElementById("calc-especie");
const selViaCalc = document.getElementById("calc-via");
const inputPesoCalc = document.getElementById("calc-peso");
const btnCalcular = document.getElementById("btn-calcular");
const resultadoCalc = document.getElementById("calc-resultado");

// Cuando hago clic en "Usar en calculadora" dentro de una tarjeta
contFarmacos.addEventListener("click", (ev) => {
  const boton = ev.target.closest(".btn-desde-card");
  if (!boton) return; // si no es el botón, ignorar

  const card = boton.closest(".card-farmaco");
  if (!card) return;

  const idx = card.dataset.index;
  if (idx === undefined) return;

  const f = farmacos[parseInt(idx, 10)];
  if (!f) return;

  // 1. Seleccionar fármaco en el select de la calculadora
  selFarmacoCalc.value = idx;
  selFarmacoCalc.dispatchEvent(new Event("change"));

  // 2. Si solo hay una especie con dosis configurada, seleccionarla
  if (f.dosisEspecies) {
    const especiesCalc = Object.keys(f.dosisEspecies);
    if (especiesCalc.length === 1) {
      selEspecieCalc.value = especiesCalc[0];
      selEspecieCalc.dispatchEvent(new Event("change"));
    }
  }

  // 3. Mostrar panel de Farmacología por si está en Hormonas
  cambiarModulo("farmacos");

  // 4. Hacer scroll suave hasta la calculadora
  calcPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});


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

// COLORES POR GRUPO FARMACOLÓGICO
const coloresFarmacos = {
  antimicrobiano: "#4cc9f0",
  antiparasitario: "#80ed99",
  aine: "#f4a261",
  anestesico: "#9d4edd",
  hormona: "#ffb703",
  cardio: "#ef476f",
  neuro: "#6d597a",
  gastrico: "#219ebc",
  otros : "#adb5bd",
};

// --------- RENDER FÁRMACOS --------- 
function renderFarmacos(lista = []) {
  const base = lista.length ? lista : farmacos;
  contFarmacos.innerHTML = "";

  if (!base.length) {
    contFarmacos.innerHTML =
      `<p class="mensaje-vacio">No se encontraron fármacos.</p>`;
    return;
  }

  base.forEach((f) => {
    const index = farmacos.indexOf(f);
    const card = document.createElement("article");
    card.className = "card card-farmaco";
    card.dataset.index = index;

    // ================================
    // 1. GENERAR clave del grupo (ROBUSTO)
    // ================================
    const grupoRaw = (f.grupo || "").toString();      // 👈 evita error si falta grupo
    let grupoClave = grupoRaw.split("–")[0].trim().toLowerCase();

    // Aliases para que coincida con coloresFarmacos
    if (grupoClave === "cardiológico") grupoClave = "cardio";
    if (grupoClave === "cardiologicos") grupoClave = "cardio";
    if (grupoClave === "a.i.n.e") grupoClave = "aine";

    // Guardar la clave para los filtros
    f.grupoClave = grupoClave;

    // ================================
    // 2. Color según grupo
    // ================================
    const color = coloresFarmacos[grupoClave] || "#888";
    card.style.setProperty("--borde-farmaco", color);

    // ================================
    // 3. Construir tarjeta
    // ================================
    const viasTexto = f.vias?.join(", ") || f.via || "—";
    const especiesTexto = f.especies?.join(", ") || "—";

    card.innerHTML = `
      <h3>${f.nombre}</h3>

      <p class="farmaco-comercial">
        <span>Nombre comercial:</span> ${f.nombreComercial || "—"}
      </p>

      <div class="chip-farmaco" style="background:${color}">
        ${grupoRaw || "—"}
      </div>

      <p><strong>Vías:</strong> ${viasTexto}</p>
      <p><strong>Especies:</strong> ${especiesTexto}</p>
      <p><strong>Indicaciones:</strong> ${f.indicaciones || "—"}</p>
      <p><strong>Contraindicaciones:</strong> ${f.contraindicaciones || "—"}</p>
      <p><strong>Dosis general:</strong> ${f.dosis || "—"}</p>
      <p><strong>Período de retiro:</strong> ${f.retiro || "—"}</p>
      <p><strong>Notas:</strong> ${f.notas || "—"}</p>

      <div class="card-acciones">
        <button class="btn-primario btn-desde-card">
          Usar en calculadora
        </button>
      </div>
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

function cambiarModulo(modulo) {
  moduloActual = modulo;

  if (modulo === "hormonas") {
    filtrosHormonasSec.classList.remove("oculto");
    contHormonas.classList.remove("oculto");
    filtrosFarmacosSec.classList.add("oculto");
    contFarmacos.classList.add("oculto");
    calcPanel.classList.add("oculto");
  } else {
    filtrosHormonasSec.classList.add("oculto");
    contHormonas.classList.add("oculto");
    filtrosFarmacosSec.classList.remove("oculto");
    contFarmacos.classList.remove("oculto");
    calcPanel.classList.remove("oculto");
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

// ==========================
// LÓGICA CALCULADORA FÁRMACOS
// ==========================
// Llenar select de fármacos al inicio
function poblarSelectFarmacos() {
  farmacos.forEach((f, idx) => {
    const opt = document.createElement("option");
    opt.value = idx.toString();
    opt.textContent = f.nombre;
    selFarmacoCalc.appendChild(opt);
  });
}

// Cuando cambia fármaco → poblar especies
selFarmacoCalc.addEventListener("change", () => {
  selEspecieCalc.innerHTML = '<option value="">Elige especie…</option>';
  selViaCalc.innerHTML = '<option value="">Primero especie…</option>';
  resultadoCalc.innerHTML = `<p>Selecciona especie, vía y peso para calcular.</p>`;

  const idx = selFarmacoCalc.value;
  if (idx === "") return;

  const f = farmacos[parseInt(idx, 10)];
  if (!f.dosisEspecies) return;

  Object.keys(f.dosisEspecies).forEach((esp) => {
    const opt = document.createElement("option");
    opt.value = esp;
    opt.textContent = esp.charAt(0).toUpperCase() + esp.slice(1);
    selEspecieCalc.appendChild(opt);
  });
});

// Cuando cambia especie → poblar vías
selEspecieCalc.addEventListener("change", () => {
  selViaCalc.innerHTML = '<option value="">Elige vía…</option>';
  resultadoCalc.innerHTML = `<p>Selecciona vía y peso para calcular.</p>`;

  const idx = selFarmacoCalc.value;
  const especie = selEspecieCalc.value;
  if (idx === "" || especie === "") return;

  const f = farmacos[parseInt(idx, 10)];
  const info = f.dosisEspecies?.[especie];
  if (!info) return;

  info.vias.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selViaCalc.appendChild(opt);
  });
});

// Botón Calcular
btnCalcular.addEventListener("click", () => {
  const idx = selFarmacoCalc.value;
  const especie = selEspecieCalc.value;
  const via = selViaCalc.value;
  const peso = parseFloat(inputPesoCalc.value);

  if (idx === "" || especie === "" || via === "" || isNaN(peso) || peso <= 0) {
    resultadoCalc.innerHTML = `<p>Completa fármaco, especie, vía y peso válido para calcular.</p>`;
    return;
  }

  const f = farmacos[parseInt(idx, 10)];
  const info = f.dosisEspecies?.[especie];

  if (!info) {
    resultadoCalc.innerHTML = `<p>No hay datos de dosis configurados para esa especie en este fármaco.</p>`;
    return;
  }

  const mgKg = info.mgKg;
  const conc = info.concMgMl || null;

  const dosisMg = peso * mgKg;
  const volumenMl = conc ? dosisMg / conc : null;

  let html = `
    <p><strong>Fármaco:</strong> ${f.nombre}</p>
    <p><strong>Especie:</strong> ${especie}</p>
    <p><strong>Vía seleccionada:</strong> ${via}</p>
    <p><strong>Dosis usada para el cálculo:</strong> ${mgKg} mg/kg</p>
    <p><strong>Peso:</strong> ${peso.toFixed(2)} kg</p>
    <p><strong>Total de fármaco:</strong> ${dosisMg.toFixed(2)} mg</p>
  `;

  if (volumenMl !== null) {
    html += `<p><strong>Concentración:</strong> ${conc} mg/ml → <strong>Volumen:</strong> ${volumenMl.toFixed(2)} ml</p>`;
  }

  html += `
    <p><strong>Frecuencia recomendada (estudio):</strong> ${info.frecuencia}</p>
    <p><strong>Días/veces recomendados (estudio):</strong> ${info.dias}</p>
    <p style="margin-top:0.4rem;font-size:0.78rem;color:#f97316;">
      ⚠ Esta calculadora es una herramienta de estudio. 
      Verificar siempre con vademécum veterinario y normativa local antes de aplicar en clínica real.
    </p>
  `;

  resultadoCalc.innerHTML = html;
});



// --------- ESTADO INICIAL ---------
cargarTema();
poblarSelectFarmacos();
cambiarModulo("hormonas");

