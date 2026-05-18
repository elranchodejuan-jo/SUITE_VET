// =============================================================================
// SUITE VET 2.0 - modules/fisio/data/glosariodata.js
// Glosario fisiologico por sistemas.
// =============================================================================

(function () {
  "use strict";

  window.FISIO_DATA_PARTS = window.FISIO_DATA_PARTS || {};
  window.FISIO_DATA_PARTS.glosario = [
    // -------------------------------------------------------------------------
    // MEDIO INTERNO / HOMEOSTASIS
    // -------------------------------------------------------------------------
    {
      id: "medio-interno",
      termino: "Medio interno",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Concepto base",
      definicion: "Ambiente liquido que rodea a las celulas y permite que funcionen en condiciones estables.",
      importanciaClinica: "Ayuda a interpretar hidratacion, electrolitos, pH, perfusion y respuesta a enfermedad.",
      relacionados: ["homeostasis", "liquido-extracelular", "osmolaridad"]
    },
    {
      id: "homeostasis",
      termino: "Homeostasis",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Proceso regulador",
      definicion: "Capacidad del organismo para mantener variables internas dentro de rangos compatibles con la vida.",
      importanciaClinica: "Todo desequilibrio clinico puede leerse como una perdida parcial de control homeostatico.",
      relacionados: ["retroalimentacion-negativa", "medio-interno", "sistema-endocrino"]
    },
    {
      id: "retroalimentacion-negativa",
      termino: "Retroalimentacion negativa",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Mecanismo de control",
      definicion: "Respuesta que corrige una desviacion y devuelve la variable fisiologica hacia su rango normal.",
      importanciaClinica: "Explica mecanismos como control de glucosa, temperatura, presion arterial y osmolaridad.",
      relacionados: ["homeostasis", "aldosterona", "hormona-antidiuretica"]
    },
    {
      id: "retroalimentacion-positiva",
      termino: "Retroalimentacion positiva",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Mecanismo amplificador",
      definicion: "Respuesta que aumenta el estimulo inicial hasta completar un evento fisiologico concreto.",
      importanciaClinica: "Se observa en procesos como parto, coagulacion y algunos reflejos neuroendocrinos.",
      relacionados: ["hemostasia", "sistema-endocrino", "ciclo-cardiaco"]
    },
    {
      id: "sistema-endocrino",
      termino: "Sistema endocrino",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Sistema integrador",
      definicion: "Red de glandulas y hormonas que regula metabolismo, crecimiento, reproduccion y equilibrio interno.",
      importanciaClinica: "Conecta fisiologia con trastornos como diabetes, Cushing, Addison e hipotiroidismo.",
      relacionados: ["homeostasis", "sistema-metabolico", "aldosterona"]
    },
    {
      id: "sistema-inmunologico",
      termino: "Sistema inmunologico",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Defensa biologica",
      definicion: "Conjunto de celulas, organos y mediadores que reconocen amenazas y coordinan defensa tisular.",
      importanciaClinica: "Clave para comprender inflamacion, infecciones, alergias, vacunas y enfermedades autoinmunes.",
      relacionados: ["sistema-linfatico", "medio-interno", "homeostasis"]
    },
    {
      id: "sistema-metabolico",
      termino: "Sistema metabolico",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Red funcional",
      definicion: "Conjunto de rutas que transforman nutrientes en energia, reservas y moleculas utiles.",
      importanciaClinica: "Permite interpretar balance energetico, cetosis, hipoglucemia, obesidad y caquexia.",
      relacionados: ["homeostasis", "digestivo", "sistema-endocrino"]
    },
    {
      id: "liquido-intracelular",
      termino: "Liquido intracelular",
      sigla: "LIC",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Compartimento corporal",
      definicion: "Fraccion de agua corporal ubicada dentro de las celulas.",
      importanciaClinica: "Sus cambios afectan volumen celular, actividad enzimatica y excitabilidad neuromuscular.",
      relacionados: ["liquido-extracelular", "osmosis", "medio-interno"]
    },
    {
      id: "liquido-extracelular",
      termino: "Liquido extracelular",
      sigla: "LEC",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Compartimento corporal",
      definicion: "Fraccion de agua corporal fuera de las celulas, incluyendo plasma y liquido intersticial.",
      importanciaClinica: "Su evaluacion orienta fluidoterapia, shock, edema y alteraciones electroliticas.",
      relacionados: ["liquido-intracelular", "medio-interno", "presion-oncotica-capilar"]
    },
    {
      id: "osmosis",
      termino: "Osmosis",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Movimiento de agua",
      definicion: "Paso de agua a traves de una membrana segun diferencias de concentracion de solutos.",
      importanciaClinica: "Explica movimientos de agua en deshidratacion, edema, hipernatremia e hiponatremia.",
      relacionados: ["liquido-intracelular", "liquido-extracelular", "concentracion-orina"]
    },

    // -------------------------------------------------------------------------
    // DIGESTIVO
    // -------------------------------------------------------------------------
    {
      id: "ingestion",
      termino: "Ingestion",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Proceso digestivo",
      definicion: "Entrada voluntaria o refleja del alimento al organismo por la cavidad oral.",
      importanciaClinica: "Su alteracion se observa en anorexia, disfagia, dolor oral y trastornos neurologicos.",
      relacionados: ["deglucion", "bolo-alimenticio", "apetito"]
    },
    {
      id: "digestion-mecanica",
      termino: "Digestion mecanica",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Proceso digestivo",
      definicion: "Fragmentacion y mezcla fisica del alimento para facilitar la accion de enzimas y secreciones.",
      importanciaClinica: "Depende de denticion, motilidad y funcion gastrica; falla en dolor dental o ileo.",
      relacionados: ["masticacion", "peristalsis", "digestion-quimica"]
    },
    {
      id: "digestion-quimica",
      termino: "Digestion quimica",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Proceso digestivo",
      definicion: "Degradacion de nutrientes por enzimas, acidos, bilis y secreciones intestinales.",
      importanciaClinica: "Ayuda a entender maldigestion, insuficiencia pancreatica y trastornos biliares.",
      relacionados: ["amilasa-salival", "acido-clorhidrico", "absorcion-intestinal"]
    },
    {
      id: "bolo-alimenticio",
      termino: "Bolo alimenticio",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Contenido digestivo",
      definicion: "Masa de alimento masticado y mezclado con saliva antes de pasar al esofago.",
      importanciaClinica: "Su formacion correcta reduce riesgo de disfagia, regurgitacion y obstruccion esofagica.",
      relacionados: ["ingestion", "deglucion", "mucinas"]
    },
    {
      id: "amilasa-salival",
      termino: "Amilasa salival",
      sigla: "Ptialina",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Enzima",
      definicion: "Enzima salival que inicia la digestion de almidones en especies donde su actividad es relevante.",
      importanciaClinica: "Su importancia varia entre especies y dieta; no debe extrapolarse igual a todos los animales.",
      relacionados: ["saliva", "digestion-quimica", "carbohidratos"]
    },
    {
      id: "mucinas",
      termino: "Mucinas",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Glicoproteinas",
      definicion: "Moleculas viscosas del moco que lubrican y protegen superficies digestivas.",
      importanciaClinica: "Participan en proteccion de mucosas frente a friccion, acidez, bacterias e irritantes.",
      relacionados: ["bolo-alimenticio", "saliva", "mucosa-gastrica"]
    },
    {
      id: "deglucion",
      termino: "Deglucion",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Reflejo motor",
      definicion: "Paso coordinado del alimento desde la boca hacia esofago y estomago.",
      importanciaClinica: "Su falla orienta a problemas orofaringeos, neurologicos, esofagicos o dolorosos.",
      relacionados: ["ingestion", "bolo-alimenticio", "peristalsis"]
    },
    {
      id: "peristalsis",
      termino: "Peristalsis",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Motilidad",
      definicion: "Contracciones coordinadas que desplazan contenido a lo largo del tubo digestivo.",
      importanciaClinica: "Se altera en ileo, colicos, obstrucciones, diarrea y trastornos de motilidad.",
      relacionados: ["deglucion", "motilidad-gastrointestinal", "intestino-grueso"]
    },
    {
      id: "acido-clorhidrico",
      termino: "Acido clorhidrico",
      sigla: "HCl",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Secrecion gastrica",
      definicion: "Secrecion acida del estomago que activa digestion proteica y limita carga microbiana.",
      importanciaClinica: "Relaciona gastritis, ulceras, hipoclorhidria y uso de protectores gastricos.",
      relacionados: ["gastrina", "mucosa-gastrica", "digestion-quimica"]
    },
    {
      id: "microbiota-intestinal",
      termino: "Microbiota intestinal",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Ecosistema biologico",
      definicion: "Comunidad de microorganismos que participa en digestion, inmunidad y salud de la mucosa.",
      importanciaClinica: "Fundamental en rumiantes, equinos y neonatos; se altera con dieta, antibioticos y enfermedad.",
      relacionados: ["rumia", "intestino-grueso", "sistema-inmunologico"]
    },
    {
      id: "rumia",
      termino: "Rumia",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Adaptacion digestiva",
      definicion: "Proceso de regurgitacion, remasticacion y reinsalivacion propio de rumiantes.",
      importanciaClinica: "Su disminucion es un signo temprano de enfermedad, dolor, acidosis o alteracion alimentaria.",
      relacionados: ["microbiota-intestinal", "eructo", "saliva"]
    },
    {
      id: "eructo",
      termino: "Eructo",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Reflejo ruminal",
      definicion: "Eliminacion de gases de fermentacion ruminal hacia el exterior.",
      importanciaClinica: "Su bloqueo causa timpanismo, distension ruminal y compromiso respiratorio/circulatorio.",
      relacionados: ["rumia", "microbiota-intestinal", "homeostasis"]
    },

    // -------------------------------------------------------------------------
    // RESPIRATORIO
    // -------------------------------------------------------------------------
    {
      id: "vias-respiratorias-superiores",
      termino: "Vias respiratorias superiores",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Estructura",
      definicion: "Segmentos iniciales que conducen y acondicionan el aire antes de llegar a pulmones.",
      importanciaClinica: "Se afectan en rinitis, laringitis, obstruccion, estertores y sindromes braquicefalicos.",
      relacionados: ["laringe", "traquea-arbol-bronquial", "ventilacion-pulmonar"]
    },
    {
      id: "hematosis",
      termino: "Hematosis",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Intercambio gaseoso",
      definicion: "Oxigenacion de la sangre y eliminacion de dioxido de carbono en superficies respiratorias.",
      importanciaClinica: "Su falla se refleja en hipoxemia, cianosis, disnea y cambios en gases sanguineos.",
      relacionados: ["alveolos", "presion-parcial-gases", "ley-difusion-fick"]
    },
    {
      id: "laringe",
      termino: "Laringe",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Estructura",
      definicion: "Region que protege la via aerea, participa en fonacion y regula entrada de aire.",
      importanciaClinica: "Importante en paralisis laringea, aspiracion, estridor y anestesia.",
      relacionados: ["vias-respiratorias-superiores", "traquea-arbol-bronquial", "deglucion"]
    },
    {
      id: "traquea-arbol-bronquial",
      termino: "Traquea y arbol bronquial",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Conduccion aerea",
      definicion: "Sistema de tubos que distribuye el aire hacia bronquios, bronquiolos y alveolos.",
      importanciaClinica: "Clave en colapso traqueal, bronquitis, asma felina y neumonias.",
      relacionados: ["resistencia-vias-aereas", "alveolos", "ventilacion-pulmonar"]
    },
    {
      id: "alveolos",
      termino: "Alveolos",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Unidad de intercambio",
      definicion: "Pequenas cavidades pulmonares donde ocurre intercambio de oxigeno y dioxido de carbono.",
      importanciaClinica: "Se comprometen en edema pulmonar, neumonia, atelectasia y distrés respiratorio.",
      relacionados: ["hematosis", "surfactante-pulmonar", "ley-difusion-fick"]
    },
    {
      id: "sacos-aereos",
      termino: "Sacos aereos",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Adaptacion aviar",
      definicion: "Estructuras de aves que facilitan flujo continuo de aire a traves del sistema respiratorio.",
      importanciaClinica: "Relevantes en aerosaculitis, anestesia aviar y manejo de aves enfermas.",
      relacionados: ["ventilacion-pulmonar", "hematosis", "aves"]
    },
    {
      id: "pleura-espacio-pleural",
      termino: "Pleura y espacio pleural",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Membrana y cavidad",
      definicion: "Cubiertas serosas y espacio virtual que permiten expansion pulmonar con baja friccion.",
      importanciaClinica: "Se altera en neumotorax, derrame pleural, pleuritis y trauma toracico.",
      relacionados: ["presion-intrapleural", "ventilacion-pulmonar", "inspiracion"]
    },
    {
      id: "presion-intrapleural",
      termino: "Presion intrapleural",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Parametro mecanico",
      definicion: "Presion dentro del espacio pleural que ayuda a mantener los pulmones expandidos.",
      importanciaClinica: "Su perdida explica colapso pulmonar en neumotorax y dificultad ventilatoria.",
      relacionados: ["pleura-espacio-pleural", "inspiracion", "compliance-pulmonar"]
    },
    {
      id: "ventilacion-pulmonar",
      termino: "Ventilacion pulmonar",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Proceso mecanico",
      definicion: "Movimiento de aire hacia dentro y fuera de los pulmones.",
      importanciaClinica: "Permite evaluar disnea, hipoventilacion, hiperventilacion y soporte ventilatorio.",
      relacionados: ["inspiracion", "espiracion", "resistencia-vias-aereas"]
    },
    {
      id: "inspiracion",
      termino: "Inspiracion",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Fase ventilatoria",
      definicion: "Entrada de aire por expansion toracica y descenso de presion alveolar.",
      importanciaClinica: "Aumenta esfuerzo en obstrucciones, dolor toracico o enfermedad restrictiva.",
      relacionados: ["ventilacion-pulmonar", "presion-intrapleural", "compliance-pulmonar"]
    },
    {
      id: "espiracion",
      termino: "Espiracion",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Fase ventilatoria",
      definicion: "Salida de aire por retroceso elastico pulmonar y relajacion muscular.",
      importanciaClinica: "Puede hacerse activa en obstruccion, asma, bronquitis o esfuerzo respiratorio.",
      relacionados: ["ventilacion-pulmonar", "resistencia-vias-aereas", "efecto-bohr"]
    },
    {
      id: "compliance-pulmonar",
      termino: "Compliance pulmonar",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Propiedad mecanica",
      definicion: "Facilidad con la que pulmones y torax se expanden ante cambios de presion.",
      importanciaClinica: "Disminuye en fibrosis, edema y atelectasia; aumenta en perdida elastica.",
      relacionados: ["surfactante-pulmonar", "inspiracion", "presion-intrapleural"]
    },
    {
      id: "resistencia-vias-aereas",
      termino: "Resistencia de las vias aereas",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Parametro mecanico",
      definicion: "Oposicion al flujo de aire dentro de vias respiratorias.",
      importanciaClinica: "Aumenta en broncoconstriccion, secreciones, edema y obstrucciones.",
      relacionados: ["traquea-arbol-bronquial", "ventilacion-pulmonar", "espiracion"]
    },
    {
      id: "surfactante-pulmonar",
      termino: "Surfactante pulmonar",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Sustancia tensioactiva",
      definicion: "Mezcla lipoproteica que reduce tension superficial y evita colapso alveolar.",
      importanciaClinica: "Es esencial en neonatos y en enfermedades con atelectasia o daño alveolar.",
      relacionados: ["alveolos", "compliance-pulmonar", "hematosis"]
    },
    {
      id: "ley-difusion-fick",
      termino: "Ley de difusion de Fick",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Principio fisiologico",
      definicion: "Describe como area, grosor y gradiente de presion condicionan la difusion de gases.",
      importanciaClinica: "Explica hipoxemia en edema, fibrosis, neumonia y reduccion de superficie pulmonar.",
      relacionados: ["hematosis", "alveolos", "presion-parcial-gases"]
    },
    {
      id: "presion-parcial-gases",
      termino: "Presion parcial de gases",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Parametro gaseoso",
      definicion: "Presion atribuida a un gas dentro de una mezcla, como oxigeno o dioxido de carbono.",
      importanciaClinica: "Base para interpretar gasometria, oxigenoterapia y equilibrio acido-base.",
      relacionados: ["hematosis", "efecto-bohr", "efecto-haldane"]
    },
    {
      id: "efecto-bohr",
      termino: "Efecto Bohr",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Transporte de gases",
      definicion: "Cambios de pH y CO2 modifican la afinidad de hemoglobina por oxigeno.",
      importanciaClinica: "Favorece liberacion de oxigeno en tejidos metabolicamente activos.",
      relacionados: ["presion-parcial-gases", "hematosis", "efecto-haldane"]
    },
    {
      id: "efecto-haldane",
      termino: "Efecto Haldane",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Transporte de gases",
      definicion: "La oxigenacion de hemoglobina modifica su capacidad para transportar dioxido de carbono.",
      importanciaClinica: "Ayuda a comprender eliminacion de CO2 y cambios durante oxigenoterapia.",
      relacionados: ["efecto-bohr", "presion-parcial-gases", "hematosis"]
    },

    // -------------------------------------------------------------------------
    // RENAL
    // -------------------------------------------------------------------------
    {
      id: "rinon",
      termino: "Rinon",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Organo",
      definicion: "Organo que filtra sangre, regula volumen, electrolitos, acido-base y elimina desechos.",
      importanciaClinica: "Centro de interpretacion de azotemia, orina, hipertension y fluidoterapia.",
      relacionados: ["nefrona", "filtracion-glomerular", "concentracion-orina"]
    },
    {
      id: "nefrona",
      termino: "Nefrona",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Unidad funcional",
      definicion: "Unidad microscopica renal que filtra, reabsorbe, secreta y concentra la orina.",
      importanciaClinica: "Su dano reduce funcion renal y altera electrolitos, agua y eliminacion de toxinas.",
      relacionados: ["rinon", "filtracion-glomerular", "reabsorcion-tubular"]
    },
    {
      id: "filtracion-glomerular",
      termino: "Filtracion glomerular",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Proceso renal",
      definicion: "Paso de agua y solutos pequenos desde capilares glomerulares hacia el espacio tubular.",
      importanciaClinica: "Se reduce en hipoperfusion, enfermedad renal y obstrucciones severas.",
      relacionados: ["tasa-filtracion-glomerular", "nefrona", "presion-arterial"]
    },
    {
      id: "tasa-filtracion-glomerular",
      termino: "Tasa de filtracion glomerular",
      sigla: "TFG",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Parametro funcional",
      definicion: "Volumen de filtrado producido por los glomerulos en un tiempo determinado.",
      importanciaClinica: "Es uno de los indicadores mas importantes de funcion renal.",
      relacionados: ["filtracion-glomerular", "rinon", "presion-arterial"]
    },
    {
      id: "reabsorcion-tubular",
      termino: "Reabsorcion tubular",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Proceso renal",
      definicion: "Retorno de agua, electrolitos y nutrientes desde el tubulo hacia la sangre.",
      importanciaClinica: "Su alteracion modifica densidad urinaria, hidratacion y equilibrio electrolitico.",
      relacionados: ["nefrona", "secrecion-tubular", "aldosterona"]
    },
    {
      id: "secrecion-tubular",
      termino: "Secrecion tubular",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Proceso renal",
      definicion: "Transferencia activa de sustancias desde sangre peritubular hacia la luz tubular.",
      importanciaClinica: "Participa en eliminacion de farmacos, acidos, bases y productos metabolicos.",
      relacionados: ["nefrona", "reabsorcion-tubular", "homeostasis"]
    },
    {
      id: "concentracion-orina",
      termino: "Concentracion de la orina",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Funcion renal",
      definicion: "Ajuste de agua urinaria para conservar o eliminar liquido segun necesidades del organismo.",
      importanciaClinica: "Se evalua con densidad urinaria y orienta sobre ADH, medula renal e hidratacion.",
      relacionados: ["hormona-antidiuretica", "osmosis", "nefrona"]
    },
    {
      id: "hormona-antidiuretica",
      termino: "Hormona antidiuretica",
      sigla: "ADH",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Hormona",
      definicion: "Hormona que aumenta reabsorcion de agua en tubulos colectores.",
      importanciaClinica: "Relacionada con diabetes insipida, concentracion urinaria y manejo de agua corporal.",
      relacionados: ["concentracion-orina", "osmosis", "homeostasis"]
    },
    {
      id: "sistema-renina-angiotensina-aldosterona",
      termino: "Sistema renina-angiotensina-aldosterona",
      sigla: "RAA",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Sistema hormonal",
      definicion: "Cascada que responde a baja perfusion y regula presion arterial, sodio y volumen.",
      importanciaClinica: "Clave en enfermedad renal, insuficiencia cardiaca, hipertension y uso de IECA/ARA.",
      relacionados: ["renina", "aldosterona", "presion-arterial"]
    },
    {
      id: "renina",
      termino: "Renina",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Enzima hormonal",
      definicion: "Enzima renal que inicia la cascada renina-angiotensina-aldosterona.",
      importanciaClinica: "Aumenta ante baja perfusion renal y participa en hipertension secundaria.",
      relacionados: ["sistema-renina-angiotensina-aldosterona", "aldosterona", "filtracion-glomerular"]
    },
    {
      id: "aldosterona",
      termino: "Aldosterona",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Hormona mineralocorticoide",
      definicion: "Hormona que promueve retencion de sodio y agua, y excrecion de potasio.",
      importanciaClinica: "Relacionada con Addison, hiperaldosteronismo, presion arterial y electrolitos.",
      relacionados: ["sistema-renina-angiotensina-aldosterona", "reabsorcion-tubular", "presion-arterial"]
    },

    // -------------------------------------------------------------------------
    // CARDIOVASCULAR / LINFATICO
    // -------------------------------------------------------------------------
    {
      id: "sistema-linfatico",
      termino: "Sistema linfatico",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Sistema de drenaje y defensa",
      definicion: "Red que retorna liquido intersticial, transporta lipidos y participa en respuesta inmune.",
      importanciaClinica: "Explica edema, inflamacion, linfadenopatia, quilotorax y diseminacion de infecciones.",
      relacionados: ["capilar-linfatico", "sistema-inmunologico", "presion-oncotica-capilar"]
    },
    {
      id: "valvulas-cardiacas",
      termino: "Valvulas cardiacas",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Estructura cardiaca",
      definicion: "Estructuras que mantienen flujo unidireccional entre cavidades y grandes vasos.",
      importanciaClinica: "Su alteracion genera soplos, regurgitacion, estenosis y sobrecarga cardiaca.",
      relacionados: ["ciclo-cardiaco", "gasto-cardiaco", "presion-arterial"]
    },
    {
      id: "ciclo-cardiaco",
      termino: "Ciclo cardiaco",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Proceso mecanico",
      definicion: "Secuencia de llenado y eyeccion que ocurre en cada latido.",
      importanciaClinica: "Base para entender auscultacion, presiones, soplos, arritmias y ecocardiografia.",
      relacionados: ["valvulas-cardiacas", "precarga", "poscarga"]
    },
    {
      id: "inotropismo",
      termino: "Inotropismo",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Propiedad miocardica",
      definicion: "Capacidad del miocardio para modificar la fuerza de contraccion.",
      importanciaClinica: "Disminuye en falla cardiaca y cambia con farmacos inotropicos.",
      relacionados: ["gasto-cardiaco", "ciclo-cardiaco", "precarga"]
    },
    {
      id: "precarga",
      termino: "Precarga",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Parametro hemodinamico",
      definicion: "Grado de llenado y estiramiento ventricular antes de la contraccion.",
      importanciaClinica: "Se modifica con fluidos, hemorragia, deshidratacion y falla cardiaca.",
      relacionados: ["ciclo-cardiaco", "gasto-cardiaco", "presion-hidrostatica-capilar"]
    },
    {
      id: "poscarga",
      termino: "Poscarga",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Parametro hemodinamico",
      definicion: "Resistencia que debe vencer el ventriculo para eyectar sangre.",
      importanciaClinica: "Aumenta con hipertension y estenosis; afecta trabajo cardiaco y perfusion.",
      relacionados: ["presion-arterial", "gasto-cardiaco", "ciclo-cardiaco"]
    },
    {
      id: "gasto-cardiaco",
      termino: "Gasto cardiaco",
      sigla: "GC",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Parametro funcional",
      definicion: "Volumen de sangre bombeado por el corazon por minuto.",
      importanciaClinica: "Determina perfusion tisular y se altera en shock, arritmias y enfermedad cardiaca.",
      relacionados: ["precarga", "poscarga", "inotropismo"]
    },
    {
      id: "presion-arterial",
      termino: "Presion arterial",
      sigla: "PA",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Parametro vital",
      definicion: "Fuerza que ejerce la sangre sobre la pared arterial.",
      importanciaClinica: "Orienta perfusion, shock, hipertension, anestesia y funcion renal.",
      relacionados: ["gasto-cardiaco", "poscarga", "sistema-renina-angiotensina-aldosterona"]
    },
    {
      id: "electrocardiograma",
      termino: "Electrocardiograma",
      sigla: "ECG",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Prueba funcional",
      definicion: "Registro grafico de la actividad electrica cardiaca.",
      importanciaClinica: "Permite detectar arritmias, alteraciones de conduccion y cambios de frecuencia.",
      relacionados: ["ciclo-cardiaco", "gasto-cardiaco", "presion-arterial"]
    },
    {
      id: "presion-hidrostatica-capilar",
      termino: "Presion hidrostatica capilar",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Fuerza de Starling",
      definicion: "Presion que empuja liquido desde el capilar hacia el intersticio.",
      importanciaClinica: "Aumenta en congestion venosa y favorece edema.",
      relacionados: ["presion-oncotica-capilar", "sistema-linfatico", "precarga"]
    },
    {
      id: "presion-oncotica-capilar",
      termino: "Presion oncotica capilar",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Fuerza osmotica",
      definicion: "Atraccion de agua hacia el capilar generada principalmente por proteinas plasmaticas.",
      importanciaClinica: "Disminuye en hipoalbuminemia y favorece edema o derrames.",
      relacionados: ["presion-hidrostatica-capilar", "liquido-extracelular", "sistema-linfatico"]
    },
    {
      id: "capilar-linfatico",
      termino: "Capilar linfatico",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Estructura linfatica",
      definicion: "Vaso pequeno que recoge liquido intersticial, proteinas y particulas para retornarlas a circulacion.",
      importanciaClinica: "Su funcion evita acumulacion de liquido y participa en transporte de grasas intestinales.",
      relacionados: ["sistema-linfatico", "presion-oncotica-capilar", "microbiota-intestinal"]
    },

    // -------------------------------------------------------------------------
    // TERMINOS MEDICO-CLINICOS VETERINARIOS
    // -------------------------------------------------------------------------
    {
      id: "hipercalemia",
      termino: "Hipercalemia",
      sinonimos: ["Hiperpotasemia", "Hipercalemina"],
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno electrolitico",
      definicion: "Aumento de la concentracion de potasio en sangre.",
      importanciaClinica: "Puede causar debilidad, alteraciones neuromusculares y arritmias; es importante en obstruccion urinaria, enfermedad renal, Addison y dano tisular.",
      relacionados: ["hipocalemia", "arritmia", "electrocardiograma"]
    },
    {
      id: "hipocalemia",
      termino: "Hipocalemia",
      sinonimos: ["Hipopotasemia"],
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno electrolitico",
      definicion: "Disminucion de la concentracion de potasio en sangre.",
      importanciaClinica: "Puede provocar debilidad muscular, ileo, alteraciones cardiacas y ventroflexion cervical en gatos.",
      relacionados: ["hipercalemia", "debilidad", "arritmia"]
    },
    {
      id: "hipernatremia",
      termino: "Hipernatremia",
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno electrolitico",
      definicion: "Aumento de sodio en sangre, usualmente asociado a perdida de agua libre o exceso de sodio.",
      importanciaClinica: "Puede causar signos neurologicos por cambios osmolares; corregir de forma controlada.",
      relacionados: ["hiponatremia", "deshidratacion", "osmosis"]
    },
    {
      id: "hiponatremia",
      termino: "Hiponatremia",
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno electrolitico",
      definicion: "Disminucion de sodio en sangre.",
      importanciaClinica: "Puede aparecer en vomitos, diarrea, enfermedad renal, Addison o exceso de agua; puede producir signos neurologicos.",
      relacionados: ["hipernatremia", "hormona-antidiuretica", "osmosis"]
    },
    {
      id: "hipercalcemia",
      termino: "Hipercalcemia",
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno mineral",
      definicion: "Aumento de calcio en sangre.",
      importanciaClinica: "Puede asociarse a neoplasias, hiperparatiroidismo, intoxicacion por vitamina D o enfermedad granulomatosa.",
      relacionados: ["hipocalcemia", "rinon", "vitamina-d"]
    },
    {
      id: "hipocalcemia",
      termino: "Hipocalcemia",
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno mineral",
      definicion: "Disminucion de calcio en sangre.",
      importanciaClinica: "Puede causar tetania, temblores, convulsiones o eclampsia puerperal en hembras lactantes.",
      relacionados: ["hipercalcemia", "convulsion", "sistema-endocrino"]
    },
    {
      id: "acidosis-metabolica",
      termino: "Acidosis metabolica",
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno acido-base",
      definicion: "Disminucion del pH sanguineo por acumulacion de acidos o perdida de bicarbonato.",
      importanciaClinica: "Se observa en shock, diarrea severa, enfermedad renal, cetoacidosis y mala perfusion.",
      relacionados: ["alcalosis-metabolica", "shock", "rinon"]
    },
    {
      id: "alcalosis-metabolica",
      termino: "Alcalosis metabolica",
      sistema: "Renal/Metabolico",
      sistemaKey: "renal-metabolico",
      tipo: "Trastorno acido-base",
      definicion: "Aumento del pH sanguineo por ganancia de bicarbonato o perdida de acidos.",
      importanciaClinica: "Puede aparecer en vomitos gastricos, diureticos o alteraciones electroliticas.",
      relacionados: ["acidosis-metabolica", "emesis", "hipocalemia"]
    },
    {
      id: "acidosis-respiratoria",
      termino: "Acidosis respiratoria",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Trastorno acido-base",
      definicion: "Disminucion del pH por retencion de dioxido de carbono secundaria a hipoventilacion.",
      importanciaClinica: "Se relaciona con depresion respiratoria, enfermedad pulmonar, anestesia o fatiga ventilatoria.",
      relacionados: ["alcalosis-respiratoria", "ventilacion-pulmonar", "disnea"]
    },
    {
      id: "alcalosis-respiratoria",
      termino: "Alcalosis respiratoria",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Trastorno acido-base",
      definicion: "Aumento del pH por eliminacion excesiva de dioxido de carbono durante hiperventilacion.",
      importanciaClinica: "Puede verse en dolor, ansiedad, fiebre, hipoxemia o ventilacion excesiva.",
      relacionados: ["acidosis-respiratoria", "taquipnea", "presion-parcial-gases"]
    },
    {
      id: "hipoglucemia",
      termino: "Hipoglucemia",
      sinonimos: ["Hipoglicemia", "Hipoglusemia"],
      sistema: "Endocrino/Metabolico",
      sistemaKey: "endocrino-metabolico",
      tipo: "Trastorno metabolico",
      definicion: "Disminucion de la concentracion de glucosa en sangre.",
      importanciaClinica: "Puede causar debilidad, temblores, convulsiones, coma y urgencia metabolica, especialmente en neonatos, sepsis o exceso de insulina.",
      relacionados: ["hiperglucemia", "convulsion", "sistema-metabolico"]
    },
    {
      id: "hiperglucemia",
      termino: "Hiperglucemia",
      sinonimos: ["Hiperglicemia"],
      sistema: "Endocrino/Metabolico",
      sistemaKey: "endocrino-metabolico",
      tipo: "Trastorno metabolico",
      definicion: "Aumento de la concentracion de glucosa en sangre.",
      importanciaClinica: "Puede asociarse a estres, diabetes mellitus, glucocorticoides o enfermedad endocrina.",
      relacionados: ["hipoglucemia", "cetoacidosis-diabetica", "poliuria"]
    },
    {
      id: "cetosis",
      termino: "Cetosis",
      sistema: "Endocrino/Metabolico",
      sistemaKey: "endocrino-metabolico",
      tipo: "Trastorno energetico",
      definicion: "Aumento de cuerpos cetonicos por movilizacion intensa de grasa.",
      importanciaClinica: "Importante en vacas lecheras en balance energetico negativo y en animales con inanicion o diabetes.",
      relacionados: ["cetoacidosis-diabetica", "sistema-metabolico", "anorexia"]
    },
    {
      id: "cetoacidosis-diabetica",
      termino: "Cetoacidosis diabetica",
      sigla: "CAD",
      sistema: "Endocrino/Metabolico",
      sistemaKey: "endocrino-metabolico",
      tipo: "Urgencia metabolica",
      definicion: "Complicacion de diabetes con hiperglucemia, cetonas y acidosis metabolica.",
      importanciaClinica: "Urgencia potencialmente mortal que requiere estabilizacion, fluidos, insulina y monitoreo intensivo.",
      relacionados: ["hiperglucemia", "cetosis", "acidosis-metabolica"]
    },
    {
      id: "deshidratacion",
      termino: "Deshidratacion",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Estado clinico",
      definicion: "Deficit de agua corporal, con o sin alteraciones de electrolitos.",
      importanciaClinica: "Se estima por mucosas, turgor, perfusion, peso y laboratorio; orienta fluidoterapia.",
      relacionados: ["liquido-extracelular", "hipernatremia", "shock"]
    },
    {
      id: "fiebre",
      termino: "Fiebre",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Signo clinico",
      definicion: "Elevacion regulada de la temperatura corporal por cambio del punto de ajuste hipotalamico.",
      importanciaClinica: "Suele asociarse a inflamacion, infeccion, enfermedad inmune o neoplasia.",
      relacionados: ["hipertermia", "sistema-inmunologico", "letargia"]
    },
    {
      id: "hipertermia",
      termino: "Hipertermia",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Alteracion termica",
      definicion: "Aumento de temperatura corporal por produccion o ganancia de calor mayor a la capacidad de disiparlo.",
      importanciaClinica: "A diferencia de fiebre, no siempre responde a antipireticos; puede ser emergencia por golpe de calor.",
      relacionados: ["fiebre", "taquipnea", "shock"]
    },
    {
      id: "hipotermia",
      termino: "Hipotermia",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Alteracion termica",
      definicion: "Descenso de la temperatura corporal por debajo del rango fisiologico.",
      importanciaClinica: "Puede aparecer en neonatos, shock, anestesia, exposicion ambiental o enfermedad grave.",
      relacionados: ["shock", "bradicardia", "letargia"]
    },
    {
      id: "letargia",
      termino: "Letargia",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Signo clinico",
      definicion: "Disminucion del estado de alerta, actividad o respuesta al entorno.",
      importanciaClinica: "Es inespecifica, pero orienta a enfermedad sistemica, dolor, fiebre, anemia, hipoglucemia o sepsis.",
      relacionados: ["hipoglucemia", "anemia", "fiebre"]
    },
    {
      id: "caquexia",
      termino: "Caquexia",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Estado corporal",
      definicion: "Perdida marcada de masa muscular y condicion corporal asociada a enfermedad cronica.",
      importanciaClinica: "Se observa en neoplasias, enfermedad cardiaca, renal, hepatica o inflamacion persistente.",
      relacionados: ["anorexia", "sistema-metabolico", "hipoalbuminemia"]
    },
    {
      id: "emesis",
      termino: "Emesis",
      sinonimos: ["Vomito"],
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Signo digestivo",
      definicion: "Expulsion activa del contenido gastrico por la boca; sinonimo clinico de vomito.",
      importanciaClinica: "Ayuda a diferenciar enfermedad gastrointestinal, metabolica, toxica, neurologica o sistemica.",
      relacionados: ["regurgitacion", "hematemesis", "alcalosis-metabolica"]
    },
    {
      id: "anemesis-termino-a-validar",
      termino: "Anemesis",
      sinonimos: ["Termino no estandar", "Emesis", "Hematemesis", "Anamnesis"],
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Termino a validar",
      definicion: "No es un termino medico veterinario de uso comun; puede confundirse con emesis, hematemesis o anamnesis.",
      importanciaClinica: "Conviene verificar el contexto antes de usarlo en una ficha clinica o material educativo.",
      relacionados: ["emesis", "hematemesis", "anamnesis"]
    },
    {
      id: "anamnesis",
      termino: "Anamnesis",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Historia clinica",
      definicion: "Recopilacion ordenada de antecedentes, signos, ambiente, dieta, tratamientos y evolucion del paciente.",
      importanciaClinica: "Es base del razonamiento clinico y puede orientar el diagnostico antes del examen fisico.",
      relacionados: ["letargia", "emesis", "diarrea"]
    },
    {
      id: "hematemesis",
      termino: "Hematemesis",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Signo digestivo",
      definicion: "Vomito con sangre fresca o digerida.",
      importanciaClinica: "Sugiere sangrado gastrointestinal alto, ulceras, coagulopatias, toxicos o lesiones gastricas.",
      relacionados: ["emesis", "melena", "anemia"]
    },
    {
      id: "regurgitacion",
      termino: "Regurgitacion",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Signo digestivo",
      definicion: "Salida pasiva de contenido esofagico o faringeo sin esfuerzo abdominal marcado.",
      importanciaClinica: "Debe diferenciarse de emesis; orienta a enfermedad esofagica, megaesofago o disfagia.",
      relacionados: ["emesis", "deglucion", "bolo-alimenticio"]
    },
    {
      id: "diarrea",
      termino: "Diarrea",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Signo digestivo",
      definicion: "Aumento de agua fecal, frecuencia o volumen de deposiciones.",
      importanciaClinica: "Puede causar deshidratacion, alteraciones electroliticas y acidosis metabolica.",
      relacionados: ["deshidratacion", "acidosis-metabolica", "tenesmo"]
    },
    {
      id: "melena",
      termino: "Melena",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Signo digestivo",
      definicion: "Heces negras y alquitranadas por sangre digerida.",
      importanciaClinica: "Sugiere sangrado gastrointestinal alto o sangre deglutida; puede acompanarse de anemia.",
      relacionados: ["hematemesis", "anemia", "heces"]
    },
    {
      id: "tenesmo",
      termino: "Tenesmo",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Signo digestivo",
      definicion: "Esfuerzo repetido o doloroso para defecar u orinar con poca eliminacion.",
      importanciaClinica: "En digestivo sugiere colitis, proctitis, masa, dolor o irritacion distal.",
      relacionados: ["diarrea", "disuria", "intestino-grueso"]
    },
    {
      id: "anorexia",
      termino: "Anorexia",
      sistema: "Digestivo",
      sistemaKey: "digestivo",
      tipo: "Signo clinico",
      definicion: "Disminucion marcada o ausencia de consumo voluntario de alimento.",
      importanciaClinica: "Puede indicar enfermedad sistemica, dolor, fiebre, nausea, trastorno metabolico o estres.",
      relacionados: ["ingestion", "letargia", "cetosis"]
    },
    {
      id: "azotemia",
      termino: "Azotemia",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Hallazgo de laboratorio",
      definicion: "Aumento de compuestos nitrogenados en sangre, como urea y creatinina.",
      importanciaClinica: "Puede ser prerrenal, renal o posrenal; se interpreta junto a densidad urinaria y contexto clinico.",
      relacionados: ["uremia", "rinon", "tasa-filtracion-glomerular"]
    },
    {
      id: "uremia",
      termino: "Uremia",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Sindrome clinico",
      definicion: "Conjunto de signos clinicos asociados a acumulacion de toxinas uremicas por falla renal.",
      importanciaClinica: "Puede incluir anorexia, vomitos, ulceras orales, halitosis, letargia y alteraciones neurologicas.",
      relacionados: ["azotemia", "rinon", "emesis"]
    },
    {
      id: "poliuria",
      termino: "Poliuria",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Signo urinario",
      definicion: "Produccion excesiva de orina.",
      importanciaClinica: "Se asocia a enfermedad renal, diabetes mellitus, hiperadrenocorticismo, piometra, diureticos o polidipsia primaria.",
      relacionados: ["polidipsia", "hiperglucemia", "concentracion-orina"]
    },
    {
      id: "polidipsia",
      termino: "Polidipsia",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Signo clinico",
      definicion: "Aumento anormal del consumo de agua.",
      importanciaClinica: "Suele evaluarse junto a poliuria para orientar enfermedad renal, endocrina o hepatica.",
      relacionados: ["poliuria", "hormona-antidiuretica", "hiperglucemia"]
    },
    {
      id: "disuria",
      termino: "Disuria",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Signo urinario",
      definicion: "Dificultad o dolor al orinar.",
      importanciaClinica: "Puede sugerir cistitis, urolitiasis, obstruccion, inflamacion uretral o dolor urinario.",
      relacionados: ["hematuria", "tenesmo", "anuria"]
    },
    {
      id: "hematuria",
      termino: "Hematuria",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Hallazgo urinario",
      definicion: "Presencia de sangre o globulos rojos en orina.",
      importanciaClinica: "Puede asociarse a infeccion, urolitos, trauma, coagulopatia, neoplasia o inflamacion.",
      relacionados: ["disuria", "proteinuria", "trombocitopenia"]
    },
    {
      id: "proteinuria",
      termino: "Proteinuria",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Hallazgo urinario",
      definicion: "Presencia aumentada de proteinas en orina.",
      importanciaClinica: "Puede indicar enfermedad glomerular, inflamacion urinaria o perdida proteica renal.",
      relacionados: ["filtracion-glomerular", "hipoalbuminemia", "rinon"]
    },
    {
      id: "oliguria",
      termino: "Oliguria",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Signo urinario",
      definicion: "Produccion de orina menor a lo esperado.",
      importanciaClinica: "Puede indicar hipoperfusion, shock, falla renal aguda u obstruccion parcial.",
      relacionados: ["anuria", "shock", "tasa-filtracion-glomerular"]
    },
    {
      id: "anuria",
      termino: "Anuria",
      sistema: "Renal",
      sistemaKey: "renal",
      tipo: "Urgencia urinaria",
      definicion: "Ausencia o produccion extremadamente baja de orina.",
      importanciaClinica: "Es una alerta critica en obstruccion urinaria, falla renal grave o shock avanzado.",
      relacionados: ["oliguria", "disuria", "azotemia"]
    },
    {
      id: "taquipnea",
      termino: "Taquipnea",
      sinonimos: ["Polipnea"],
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Signo respiratorio",
      definicion: "Aumento de la frecuencia respiratoria.",
      importanciaClinica: "Puede aparecer por dolor, fiebre, estres, hipoxemia, acidosis, anemia o enfermedad pulmonar.",
      relacionados: ["bradipnea", "disnea", "alcalosis-respiratoria"]
    },
    {
      id: "bradipnea",
      termino: "Bradipnea",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Signo respiratorio",
      definicion: "Disminucion de la frecuencia respiratoria.",
      importanciaClinica: "Puede relacionarse con depresion neurologica, farmacos, fatiga respiratoria o enfermedad grave.",
      relacionados: ["taquipnea", "acidosis-respiratoria", "estupor"]
    },
    {
      id: "disnea",
      termino: "Disnea",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Signo respiratorio",
      definicion: "Dificultad respiratoria percibida por aumento del esfuerzo ventilatorio.",
      importanciaClinica: "Es un signo de urgencia; puede ser cardiaca, pulmonar, pleural, anemica, metabolica o obstructiva.",
      relacionados: ["taquipnea", "cianosis", "ortopnea"]
    },
    {
      id: "cianosis",
      termino: "Cianosis",
      sinonimos: ["Mucosas azuladas"],
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Signo de hipoxemia",
      definicion: "Coloracion azulada de mucosas o piel por aumento de hemoglobina desoxigenada.",
      importanciaClinica: "Indica oxigenacion comprometida y requiere evaluacion respiratoria/cardiovascular inmediata.",
      relacionados: ["disnea", "hematosis", "anemia"]
    },
    {
      id: "ortopnea",
      termino: "Ortopnea",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Postura respiratoria",
      definicion: "Postura adoptada para facilitar la respiracion, usualmente con cuello extendido y abduccion de codos.",
      importanciaClinica: "Suele indicar dificultad respiratoria moderada a severa.",
      relacionados: ["disnea", "taquipnea", "cianosis"]
    },
    {
      id: "tos",
      termino: "Tos",
      sistema: "Respiratorio",
      sistemaKey: "respiratorio",
      tipo: "Reflejo respiratorio",
      definicion: "Expulsion brusca de aire para limpiar vias respiratorias.",
      importanciaClinica: "Puede originarse en traquea, bronquios, pulmones, corazon o irritacion de vias aereas.",
      relacionados: ["traquea-arbol-bronquial", "disnea", "taquipnea"]
    },
    {
      id: "taquicardia",
      termino: "Taquicardia",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Alteracion de frecuencia",
      definicion: "Frecuencia cardiaca mayor a la esperada para especie, edad y contexto.",
      importanciaClinica: "Puede deberse a dolor, fiebre, shock, anemia, hipoxia, estres o arritmias.",
      relacionados: ["bradicardia", "arritmia", "shock"]
    },
    {
      id: "bradicardia",
      termino: "Bradicardia",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Alteracion de frecuencia",
      definicion: "Frecuencia cardiaca menor a la esperada para especie, edad y contexto.",
      importanciaClinica: "Puede aparecer por hipotermia, farmacos, alteraciones de conduccion, hipercalemia o tono vagal.",
      relacionados: ["taquicardia", "hipercalemia", "electrocardiograma"]
    },
    {
      id: "arritmia",
      termino: "Arritmia",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Alteracion del ritmo",
      definicion: "Ritmo cardiaco irregular o anormal por alteracion en generacion o conduccion electrica.",
      importanciaClinica: "Puede comprometer gasto cardiaco y perfusion; se evalua con auscultacion y ECG.",
      relacionados: ["electrocardiograma", "gasto-cardiaco", "hipercalemia"]
    },
    {
      id: "shock",
      termino: "Shock",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Urgencia circulatoria",
      definicion: "Estado de perfusion tisular insuficiente para cubrir demandas metabolicas.",
      importanciaClinica: "Puede ser hipovolemico, distributivo, cardiogenico u obstructivo; requiere manejo inmediato.",
      relacionados: ["presion-arterial", "gasto-cardiaco", "acidosis-metabolica"]
    },
    {
      id: "sincope",
      termino: "Sincope",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Perdida transitoria de conciencia",
      definicion: "Desmayo breve por reduccion temporal del flujo sanguineo cerebral.",
      importanciaClinica: "Puede relacionarse con arritmias, enfermedad cardiaca, hipotension o eventos reflejos.",
      relacionados: ["arritmia", "presion-arterial", "estupor"]
    },
    {
      id: "edema",
      termino: "Edema",
      sistema: "Cardiovascular-linfatico",
      sistemaKey: "cardiovascular-linfatico",
      tipo: "Acumulacion de liquido",
      definicion: "Exceso de liquido en tejido intersticial o cavidades.",
      importanciaClinica: "Puede deberse a presion hidrostatica alta, presion oncótica baja, inflamacion o drenaje linfatico deficiente.",
      relacionados: ["presion-hidrostatica-capilar", "presion-oncotica-capilar", "sistema-linfatico"]
    },
    {
      id: "anemia",
      termino: "Anemia",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Alteracion hematologica",
      definicion: "Disminucion de globulos rojos, hemoglobina o hematocrito por debajo de lo esperado.",
      importanciaClinica: "Puede causar palidez, debilidad, taquicardia, intolerancia al ejercicio y disnea.",
      relacionados: ["hematemesis", "melena", "taquicardia"]
    },
    {
      id: "policitemia",
      termino: "Policitemia",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Alteracion hematologica",
      definicion: "Aumento de la masa eritrocitaria o del hematocrito.",
      importanciaClinica: "Puede ser relativa por deshidratacion o absoluta por hipoxia cronica o enfermedad primaria.",
      relacionados: ["deshidratacion", "cianosis", "hematosis"]
    },
    {
      id: "leucocitosis",
      termino: "Leucocitosis",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Hallazgo hematologico",
      definicion: "Aumento del numero total de leucocitos en sangre.",
      importanciaClinica: "Suele orientar inflamacion, infeccion, estres, corticoides o neoplasia hematopoyetica.",
      relacionados: ["leucopenia", "neutrofilia", "sistema-inmunologico"]
    },
    {
      id: "leucopenia",
      termino: "Leucopenia",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Hallazgo hematologico",
      definicion: "Disminucion del numero total de leucocitos en sangre.",
      importanciaClinica: "Puede aparecer por infecciones graves, consumo inflamatorio, medula o inmunosupresion.",
      relacionados: ["leucocitosis", "neutropenia", "sistema-inmunologico"]
    },
    {
      id: "trombocitopenia",
      termino: "Trombocitopenia",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Hallazgo hematologico",
      definicion: "Disminucion del numero de plaquetas.",
      importanciaClinica: "Predispone a petequias, equimosis, sangrados y hemorragias segun severidad.",
      relacionados: ["hematuria", "hematemesis", "hemostasia"]
    },
    {
      id: "neutrofilia",
      termino: "Neutrofilia",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Hallazgo hematologico",
      definicion: "Aumento de neutrofilos en sangre.",
      importanciaClinica: "Frecuente en inflamacion, infeccion bacteriana, estres o uso de corticoides.",
      relacionados: ["neutropenia", "leucocitosis", "sistema-inmunologico"]
    },
    {
      id: "neutropenia",
      termino: "Neutropenia",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Hallazgo hematologico",
      definicion: "Disminucion de neutrofilos en sangre.",
      importanciaClinica: "Aumenta riesgo de infeccion y puede indicar consumo inflamatorio severo o falla medular.",
      relacionados: ["neutrofilia", "leucopenia", "fiebre"]
    },
    {
      id: "eosinofilia",
      termino: "Eosinofilia",
      sistema: "Hematologico",
      sistemaKey: "hematologico",
      tipo: "Hallazgo hematologico",
      definicion: "Aumento de eosinofilos en sangre.",
      importanciaClinica: "Puede relacionarse con parasitos, alergias, enfermedad cutanea, gastrointestinal o hipersensibilidad.",
      relacionados: ["sistema-inmunologico", "diarrea", "prurito"]
    },
    {
      id: "ictericia",
      termino: "Ictericia",
      sinonimos: ["Mucosas amarillas"],
      sistema: "Hepatico",
      sistemaKey: "hepatico",
      tipo: "Signo clinico",
      definicion: "Coloracion amarilla de mucosas, piel o esclera por aumento de bilirrubina.",
      importanciaClinica: "Puede ser prehepatica, hepatica o poshepatica; orienta hemolisis, enfermedad hepatica u obstruccion biliar.",
      relacionados: ["hiperbilirrubinemia", "colestasis", "anemia"]
    },
    {
      id: "hiperbilirrubinemia",
      termino: "Hiperbilirrubinemia",
      sistema: "Hepatico",
      sistemaKey: "hepatico",
      tipo: "Hallazgo de laboratorio",
      definicion: "Aumento de bilirrubina en sangre.",
      importanciaClinica: "Se interpreta junto a ictericia, hemolisis, enzimas hepaticas y flujo biliar.",
      relacionados: ["ictericia", "colestasis", "anemia"]
    },
    {
      id: "colestasis",
      termino: "Colestasis",
      sistema: "Hepatico",
      sistemaKey: "hepatico",
      tipo: "Alteracion hepatobiliar",
      definicion: "Disminucion o bloqueo del flujo normal de bilis.",
      importanciaClinica: "Puede causar ictericia, aumento de enzimas colestaticas y alteracion de digestion de grasas.",
      relacionados: ["ictericia", "hiperbilirrubinemia", "digestion-quimica"]
    },
    {
      id: "hipoalbuminemia",
      termino: "Hipoalbuminemia",
      sistema: "Hepatico",
      sistemaKey: "hepatico",
      tipo: "Hallazgo de laboratorio",
      definicion: "Disminucion de albumina en sangre.",
      importanciaClinica: "Puede favorecer edema y derrames; se asocia a perdida renal, intestinal, hepatica o inflamacion.",
      relacionados: ["edema", "proteinuria", "presion-oncotica-capilar"]
    },
    {
      id: "ataxia",
      termino: "Ataxia",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Signo neurologico",
      definicion: "Incoordinacion de movimientos sin perdida completa de fuerza.",
      importanciaClinica: "Ayuda a localizar lesiones vestibulares, cerebelosas, propioceptivas o medulares.",
      relacionados: ["paresia", "paralisis", "sistema-endocrino"]
    },
    {
      id: "paresia",
      termino: "Paresia",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Deficit motor",
      definicion: "Disminucion parcial de la fuerza o capacidad de movimiento voluntario.",
      importanciaClinica: "Sugiere lesion neurologica, neuromuscular, metabolica o dolor severo.",
      relacionados: ["paralisis", "ataxia", "hipocalemia"]
    },
    {
      id: "paralisis",
      termino: "Paralisis",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Deficit motor",
      definicion: "Perdida completa o casi completa de movimiento voluntario.",
      importanciaClinica: "Es un signo de localizacion neurologica y puede requerir atencion urgente segun evolucion.",
      relacionados: ["paresia", "ataxia", "shock"]
    },
    {
      id: "convulsion",
      termino: "Convulsion",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Evento neurologico",
      definicion: "Manifestacion motora o sensorial de actividad electrica cerebral anormal.",
      importanciaClinica: "Puede ser primaria, toxica, metabolica, inflamatoria, traumatica o estructural.",
      relacionados: ["hipoglucemia", "hipocalcemia", "estupor"]
    },
    {
      id: "estupor",
      termino: "Estupor",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Estado mental",
      definicion: "Disminucion profunda del estado de conciencia con respuesta solo a estimulos intensos.",
      importanciaClinica: "Indica compromiso neurologico o metabolico severo y exige evaluacion rapida.",
      relacionados: ["convulsion", "hipoglucemia", "sincope"]
    },
    {
      id: "prurito",
      termino: "Prurito",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Signo dermatologico",
      definicion: "Sensacion que provoca deseo de rascarse, lamerse, morderse o frotarse.",
      importanciaClinica: "Comun en alergias, ectoparasitos, infecciones cutaneas y trastornos inflamatorios.",
      relacionados: ["eosinofilia", "sistema-inmunologico", "dermatitis"]
    },
    {
      id: "dermatitis",
      termino: "Dermatitis",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Lesion/inflamacion",
      definicion: "Inflamacion de la piel por causas alergicas, infecciosas, parasitarias, irritativas o inmunes.",
      importanciaClinica: "Se interpreta con prurito, distribucion, lesiones primarias/secundarias y citologia.",
      relacionados: ["prurito", "eosinofilia", "sistema-inmunologico"]
    }
  ];
})();
