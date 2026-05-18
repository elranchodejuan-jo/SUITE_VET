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
    },

    // -------------------------------------------------------------------------
    // NEUROFISIOLOGIA CLINICA
    // -------------------------------------------------------------------------
    {
      id: "sistema-nervioso-central",
      termino: "Sistema nervioso central",
      sigla: "SNC",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Division anatomica",
      definicion: "Conjunto formado por encefalo y medula espinal, encargado de integrar informacion y coordinar respuestas.",
      importanciaClinica: "Permite localizar lesiones centrales cuando hay convulsiones, alteracion mental, ataxia, paresia o deficits posturales.",
      relacionados: ["sistema-nervioso-periferico", "centro-integrador", "neurona-motora-superior"]
    },
    {
      id: "sistema-nervioso-periferico",
      termino: "Sistema nervioso periferico",
      sigla: "SNP",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Division anatomica",
      definicion: "Red de nervios craneales, espinales y ganglios que conecta el SNC con organos, musculos y piel.",
      importanciaClinica: "Se evalua en neuropatias, lesiones de raices, deficits de reflejos, dolor radicular y alteraciones sensitivas.",
      relacionados: ["sistema-nervioso-central", "neurona-aferente", "neurona-eferente"]
    },
    {
      id: "sistema-nervioso-somatico",
      termino: "Sistema nervioso somatico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Division funcional",
      definicion: "Parte del sistema nervioso que controla sensibilidad consciente y movimiento voluntario de musculo esqueletico.",
      importanciaClinica: "Se explora con marcha, postura, propiocepcion, tono, reflejos espinales y respuesta al dolor.",
      relacionados: ["sistema-nervioso-periferico", "neurona-eferente", "arco-reflejo"]
    },
    {
      id: "sistema-nervioso-autonomo",
      termino: "Sistema nervioso autonomo",
      sigla: "SNA",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Division funcional",
      definicion: "Sistema que regula funciones viscerales involuntarias como frecuencia cardiaca, motilidad, secrecion y tono vascular.",
      importanciaClinica: "Explica taquicardia, midriasis, salivacion, ileo, diarrea por estres y respuestas de lucha o reposo.",
      relacionados: ["simpatico", "parasimpatico", "sistema-nervioso-enterico"]
    },
    {
      id: "neurona",
      termino: "Neurona",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Celula excitable",
      definicion: "Celula especializada en recibir, procesar y transmitir informacion mediante cambios electricos y señales quimicas.",
      importanciaClinica: "Su funcion sostiene sensibilidad, movimiento, reflejos, dolor, conducta y control visceral.",
      relacionados: ["axon", "dendrita", "sinapsis-quimica"]
    },
    {
      id: "neuroglia",
      termino: "Neuroglia",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Celulas de soporte",
      definicion: "Conjunto de celulas que sostienen, protegen, nutren y modulan la actividad de las neuronas.",
      importanciaClinica: "La activacion glial participa en neuroinflamacion y dolor cronico.",
      relacionados: ["neuroinflamacion", "microglia", "astrocito"]
    },
    {
      id: "microglia",
      termino: "Microglia",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Celula glial inmune",
      definicion: "Celula defensiva del sistema nervioso que responde a daño, inflamacion o estimulos persistentes.",
      importanciaClinica: "Su activacion sostenida puede amplificar dolor cronico y sensibilizacion central.",
      relacionados: ["neuroglia", "neuroinflamacion", "dolor-cronico"]
    },
    {
      id: "astrocito",
      termino: "Astrocito",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Celula glial",
      definicion: "Celula glial que participa en soporte metabolico, barrera, regulacion ionica y modulacion sinaptica.",
      importanciaClinica: "Puede contribuir a neuroinflamacion, reparacion y cambios de excitabilidad neuronal.",
      relacionados: ["neuroglia", "sinapsis-quimica", "neuroinflamacion"]
    },
    {
      id: "axon",
      termino: "Axon",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Prolongacion neuronal",
      definicion: "Prolongacion que conduce potenciales de accion desde el cuerpo neuronal hacia terminales sinapticas.",
      importanciaClinica: "El daño axonal altera conduccion, reflejos, sensibilidad y funcion motora.",
      relacionados: ["neurona", "mielina", "potencial-accion"]
    },
    {
      id: "dendrita",
      termino: "Dendrita",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Prolongacion neuronal",
      definicion: "Rama neuronal que recibe señales sinapticas de otras celulas.",
      importanciaClinica: "Su integridad permite integracion de señales excitadoras e inhibidoras.",
      relacionados: ["neurona", "peps", "pips"]
    },
    {
      id: "mielina",
      termino: "Mielina",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Aislante nervioso",
      definicion: "Cubierta lipidica que rodea axones y aumenta la velocidad de conduccion nerviosa.",
      importanciaClinica: "La desmielinizacion enlentece o bloquea señales, generando debilidad, ataxia o deficits neurologicos.",
      relacionados: ["nodo-ranvier", "conduccion-saltatoria", "fibra-a-delta"]
    },
    {
      id: "nodo-ranvier",
      termino: "Nodo de Ranvier",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Region axonal",
      definicion: "Espacio entre segmentos de mielina donde se concentran canales ionicos y se regenera el potencial de accion.",
      importanciaClinica: "Es clave para conduccion saltatoria rapida en fibras mielinizadas.",
      relacionados: ["mielina", "conduccion-saltatoria", "potencial-accion"]
    },
    {
      id: "potencial-reposo",
      termino: "Potencial de reposo",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Biofisica celular",
      definicion: "Diferencia electrica de la membrana neuronal cuando la celula no esta disparando.",
      importanciaClinica: "Depende de gradientes ionicos; alteraciones de potasio, calcio o energia cambian excitabilidad.",
      relacionados: ["bomba-sodio-potasio", "hipercalemia", "despolarizacion"]
    },
    {
      id: "potencial-accion",
      termino: "Potencial de accion",
      sigla: "PA",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Señal electrica",
      definicion: "Cambio rapido y propagado del voltaje de membrana que transmite informacion en neuronas y musculo.",
      importanciaClinica: "Es base de sensibilidad, movimiento, dolor, reflejos y efecto de anestesicos locales.",
      relacionados: ["despolarizacion", "repolarizacion", "canal-sodio-voltaje"]
    },
    {
      id: "despolarizacion",
      termino: "Despolarizacion",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Cambio electrico",
      definicion: "Disminucion de la diferencia electrica de membrana, acercandola al umbral de disparo.",
      importanciaClinica: "Facilita excitabilidad; se altera por cambios ionicos o farmacos que bloquean canales.",
      relacionados: ["potencial-accion", "umbral-neuronal", "canal-sodio-voltaje"]
    },
    {
      id: "repolarizacion",
      termino: "Repolarizacion",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Cambio electrico",
      definicion: "Retorno del potencial de membrana hacia valores de reposo despues de un potencial de accion.",
      importanciaClinica: "Depende de canales de potasio y condiciona frecuencia de disparo neuronal o cardiaco.",
      relacionados: ["potencial-accion", "hiperpolarizacion", "hipercalemia"]
    },
    {
      id: "hiperpolarizacion",
      termino: "Hiperpolarizacion",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Cambio electrico",
      definicion: "Aumento de la negatividad de membrana que aleja a la celula del umbral.",
      importanciaClinica: "Reduce excitabilidad y participa en señales inhibitorias.",
      relacionados: ["pips", "gaba", "repolarizacion"]
    },
    {
      id: "umbral-neuronal",
      termino: "Umbral neuronal",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Biofisica celular",
      definicion: "Nivel de despolarizacion necesario para iniciar un potencial de accion.",
      importanciaClinica: "Baja en sensibilizacion y sube con algunos analgesicos, anestesicos o inhibicion sinaptica.",
      relacionados: ["potencial-accion", "sensibilizacion-periferica", "pips"]
    },
    {
      id: "bomba-sodio-potasio",
      termino: "Bomba sodio-potasio",
      sigla: "Na/K ATPasa",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Transporte activo",
      definicion: "Proteina de membrana que mantiene gradientes de sodio y potasio usando ATP.",
      importanciaClinica: "Sostiene excitabilidad celular; falla energetica altera neuronas, musculo y equilibrio ionico.",
      relacionados: ["potencial-reposo", "hipercalemia", "liquido-intracelular"]
    },
    {
      id: "canal-sodio-voltaje",
      termino: "Canal de sodio dependiente de voltaje",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Canal ionico",
      definicion: "Canal que se abre ante despolarizacion y permite entrada de sodio para iniciar el potencial de accion.",
      importanciaClinica: "Diana de anestesicos locales; su bloqueo impide conduccion del dolor.",
      relacionados: ["potencial-accion", "anestesia-local", "transmision-nociceptiva"]
    },
    {
      id: "conduccion-saltatoria",
      termino: "Conduccion saltatoria",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Conduccion nerviosa",
      definicion: "Propagacion rapida del impulso entre nodos de Ranvier en fibras mielinizadas.",
      importanciaClinica: "Explica la mayor velocidad de fibras mielinicas y la lentitud de fibras amielinicas.",
      relacionados: ["mielina", "nodo-ranvier", "fibra-a-delta"]
    },
    {
      id: "excitabilidad-neuronal",
      termino: "Excitabilidad neuronal",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Propiedad neuronal",
      definicion: "Capacidad de una neurona para responder a estimulos con cambios de voltaje.",
      importanciaClinica: "Aumenta en convulsiones, dolor cronico y sensibilizacion; disminuye con depresores o anestesia.",
      relacionados: ["potencial-accion", "umbral-neuronal", "convulsion"]
    },
    {
      id: "conductividad-neuronal",
      termino: "Conductividad neuronal",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Propiedad neuronal",
      definicion: "Capacidad de propagar un impulso electrico a lo largo del axon.",
      importanciaClinica: "Se compromete por desmielinizacion, bloqueo de canales, neuropatia o daño axonal.",
      relacionados: ["axon", "mielina", "conduccion-saltatoria"]
    },
    {
      id: "transmisibilidad-neuronal",
      termino: "Transmisibilidad neuronal",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Propiedad neuronal",
      definicion: "Capacidad de comunicar la señal a otra celula mediante sinapsis.",
      importanciaClinica: "Es base de reflejos, dolor, aprendizaje, movimiento y accion de farmacos neuroactivos.",
      relacionados: ["sinapsis-quimica", "neurotransmisor", "hendidura-sinaptica"]
    },

    // -------------------------------------------------------------------------
    // SINAPSIS Y NEUROTRANSMISORES
    // -------------------------------------------------------------------------
    {
      id: "sinapsis-quimica",
      termino: "Sinapsis quimica",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Comunicacion neuronal",
      definicion: "Union funcional donde una celula libera neurotransmisores que actuan sobre receptores de otra celula.",
      importanciaClinica: "Es la base de la mayoria de farmacos neuroactivos, analgesicos, sedantes y moduladores autonomicos.",
      relacionados: ["neurotransmisor", "hendidura-sinaptica", "receptor-ionotropico"]
    },
    {
      id: "sinapsis-electrica",
      termino: "Sinapsis electrica",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Comunicacion rapida",
      definicion: "Comunicacion directa entre celulas a traves de uniones que permiten paso de corriente ionica.",
      importanciaClinica: "Favorece sincronizacion rapida en redes ritmicas y algunos tejidos excitables.",
      relacionados: ["conexon", "sinapsis-quimica", "conductividad-neuronal"]
    },
    {
      id: "conexon",
      termino: "Conexon",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Union intercelular",
      definicion: "Canal proteico de una union gap que conecta el citoplasma de celulas vecinas.",
      importanciaClinica: "Permite sincronizacion electrica rapida en tejidos y redes especificas.",
      relacionados: ["sinapsis-electrica", "conductividad-neuronal", "ciclo-cardiaco"]
    },
    {
      id: "hendidura-sinaptica",
      termino: "Hendidura sinaptica",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Espacio sinaptico",
      definicion: "Espacio entre terminal presinaptica y membrana postsinaptica donde difunden neurotransmisores.",
      importanciaClinica: "Es el sitio donde recaptacion, degradacion o bloqueo receptor modifican la señal.",
      relacionados: ["sinapsis-quimica", "neurotransmisor", "recaptacion"]
    },
    {
      id: "neurotransmisor",
      termino: "Neurotransmisor",
      sigla: "NT",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Mensajero quimico",
      definicion: "Sustancia liberada por una neurona para modificar la actividad de otra celula.",
      importanciaClinica: "Explica accion de farmacos sobre dolor, conducta, motilidad, tono autonomico y convulsiones.",
      relacionados: ["acetilcolina", "glutamato", "gaba"]
    },
    {
      id: "receptor-ionotropico",
      termino: "Receptor ionotropico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Receptor rapido",
      definicion: "Receptor que funciona como canal ionico activado por ligando.",
      importanciaClinica: "Produce respuestas rapidas; ejemplos relevantes incluyen nicotinico, AMPA, NMDA y GABA-A.",
      relacionados: ["receptor-metabotropico", "peps", "pips"]
    },
    {
      id: "receptor-metabotropico",
      termino: "Receptor metabotropico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Receptor modulador",
      definicion: "Receptor acoplado a proteinas G o segundos mensajeros que modifica funciones celulares de forma mas lenta.",
      importanciaClinica: "Importante en analgesia, conducta, motilidad, efectos autonomicos y modulacion farmacologica.",
      relacionados: ["receptor-ionotropico", "receptor-muscarinico", "receptor-opioide"]
    },
    {
      id: "peps",
      termino: "Potencial excitatorio postsinaptico",
      sigla: "PEPS",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Señal sinaptica",
      definicion: "Cambio postsinaptico que acerca la membrana al umbral y aumenta probabilidad de disparo.",
      importanciaClinica: "La suma excesiva de señales excitadoras favorece hiperexcitabilidad, dolor o convulsiones.",
      relacionados: ["pips", "sumacion-temporal", "glutamato"]
    },
    {
      id: "pips",
      termino: "Potencial inhibitorio postsinaptico",
      sigla: "PIPS",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Señal sinaptica",
      definicion: "Cambio postsinaptico que aleja la membrana del umbral y reduce probabilidad de disparo.",
      importanciaClinica: "La perdida de inhibicion puede favorecer convulsiones, espasticidad o dolor amplificado.",
      relacionados: ["peps", "gaba", "hiperpolarizacion"]
    },
    {
      id: "sumacion-temporal",
      termino: "Sumacion temporal",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Integracion sinaptica",
      definicion: "Acumulacion de señales repetidas que llegan rapidamente desde una misma sinapsis.",
      importanciaClinica: "Puede aumentar disparo neuronal y contribuir a amplificacion de señales dolorosas.",
      relacionados: ["sumacion-espacial", "peps", "wind-up"]
    },
    {
      id: "sumacion-espacial",
      termino: "Sumacion espacial",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Integracion sinaptica",
      definicion: "Acumulacion de señales que llegan desde varias sinapsis al mismo tiempo.",
      importanciaClinica: "Permite que circuitos integren informacion de multiples entradas sensitivas o motoras.",
      relacionados: ["sumacion-temporal", "peps", "pips"]
    },
    {
      id: "recaptacion",
      termino: "Recaptacion",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Inactivacion sinaptica",
      definicion: "Retiro de neurotransmisores de la hendidura sinaptica hacia la celula presinaptica o glia.",
      importanciaClinica: "Diana de farmacos que modifican serotonina, noradrenalina, dopamina o GABA.",
      relacionados: ["hendidura-sinaptica", "serotonina", "noradrenalina"]
    },
    {
      id: "degradacion-enzimatica-nt",
      termino: "Degradacion enzimatica del neurotransmisor",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Inactivacion sinaptica",
      definicion: "Ruptura quimica del neurotransmisor por enzimas para terminar la señal.",
      importanciaClinica: "Explica efectos de inhibidores de colinesterasa y toxicos que alteran sinapsis colinergicas.",
      relacionados: ["acetilcolina", "hendidura-sinaptica", "sinapsis-quimica"]
    },
    {
      id: "acetilcolina",
      termino: "Acetilcolina",
      sigla: "ACh",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurotransmisor",
      definicion: "Neurotransmisor clave en union neuromuscular, parasimpatico y neuronas preganglionares autonomicas.",
      importanciaClinica: "Relevante en motilidad, secreciones, bradicardia, intoxicaciones colinergicas y bloqueo neuromuscular.",
      relacionados: ["receptor-nicotinico", "receptor-muscarinico", "parasimpatico"]
    },
    {
      id: "receptor-nicotinico",
      termino: "Receptor nicotinico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Receptor colinergico",
      definicion: "Receptor ionotropico activado por acetilcolina en placa neuromuscular y ganglios autonomicos.",
      importanciaClinica: "Diana de bloqueantes neuromusculares y toxicos colinergicos.",
      relacionados: ["acetilcolina", "receptor-ionotropico", "union-neuromuscular"]
    },
    {
      id: "receptor-muscarinico",
      termino: "Receptor muscarinico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Receptor colinergico",
      definicion: "Receptor metabotropico activado por acetilcolina en organos efectores parasimpaticos.",
      importanciaClinica: "Relaciona salivacion, bradicardia, miosis, motilidad intestinal y efectos de atropina.",
      relacionados: ["acetilcolina", "parasimpatico", "receptor-metabotropico"]
    },
    {
      id: "noradrenalina",
      termino: "Noradrenalina",
      sigla: "NA",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurotransmisor simpatico",
      definicion: "Catecolamina liberada por muchas neuronas postganglionares simpaticas.",
      importanciaClinica: "Aumenta tono vascular, alerta y respuestas de estres; diana de farmacos adrenergicos.",
      relacionados: ["simpatico", "receptor-adrenergico", "catecolaminas"]
    },
    {
      id: "receptor-adrenergico",
      termino: "Receptor adrenergico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Receptor autonomico",
      definicion: "Receptor sensible a catecolaminas como noradrenalina y adrenalina.",
      importanciaClinica: "Participa en frecuencia cardiaca, vasoconstriccion, broncodilatacion y respuesta a shock.",
      relacionados: ["noradrenalina", "catecolaminas", "simpatico"]
    },
    {
      id: "glutamato",
      termino: "Glutamato",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurotransmisor excitador",
      definicion: "Principal neurotransmisor excitador del sistema nervioso central.",
      importanciaClinica: "Participa en aprendizaje, plasticidad, dolor, excitotoxicidad y activacion NMDA.",
      relacionados: ["receptor-nmda", "peps", "wind-up"]
    },
    {
      id: "receptor-nmda",
      termino: "Receptor NMDA",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Receptor glutamatergico",
      definicion: "Receptor ionotropico del glutamato permeable a calcio y relacionado con plasticidad sinaptica.",
      importanciaClinica: "Su activacion repetida contribuye a wind-up y sensibilizacion central; ketamina lo antagoniza.",
      relacionados: ["glutamato", "wind-up", "sensibilizacion-central"]
    },
    {
      id: "gaba",
      termino: "GABA",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurotransmisor inhibidor",
      definicion: "Principal neurotransmisor inhibidor del sistema nervioso central.",
      importanciaClinica: "Su funcion reduce excitabilidad; muchos sedantes, anticonvulsivos y anestesicos potencian inhibicion GABAergica.",
      relacionados: ["pips", "hiperpolarizacion", "convulsion"]
    },
    {
      id: "glicina",
      termino: "Glicina",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurotransmisor inhibidor",
      definicion: "Neurotransmisor inhibidor importante en medula espinal y tronco encefalico.",
      importanciaClinica: "Participa en reflejos y tono motor; toxicos que bloquean su accion pueden causar rigidez o convulsiones.",
      relacionados: ["pips", "arco-reflejo", "espasticidad"]
    },
    {
      id: "serotonina",
      termino: "Serotonina",
      sigla: "5-HT",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurotransmisor/modulador",
      definicion: "Monoamina que modula animo, sueño, dolor, apetito y motilidad gastrointestinal.",
      importanciaClinica: "Conecta neurofisiologia con conducta, dolor, farmacos serotoninergicos y eje intestino-cerebro.",
      relacionados: ["serotonina-intestinal", "recaptacion", "eje-intestino-cerebro"]
    },
    {
      id: "dopamina",
      termino: "Dopamina",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurotransmisor/modulador",
      definicion: "Catecolamina que participa en movimiento, recompensa, conducta y control neuroendocrino.",
      importanciaClinica: "Relacionada con signos extrapiramidales, vomito, conducta y farmacos dopaminergicos/antidopaminergicos.",
      relacionados: ["catecolaminas", "emesis", "sistema-endocrino"]
    },
    {
      id: "sustancia-p",
      termino: "Sustancia P",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Neuropeptido",
      definicion: "Neuropeptido que participa en transmision nociceptiva e inflamacion neurogenica.",
      importanciaClinica: "Relevante en dolor, vomito y accion de antagonistas NK1 como antiemeticos.",
      relacionados: ["nocicepcion", "emesis", "neuroinflamacion"]
    },
    {
      id: "opioides-endogenos",
      termino: "Opioides endogenos",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Neuromoduladores analgesicos",
      definicion: "Peptidos producidos por el organismo que activan receptores opioides y reducen transmision dolorosa.",
      importanciaClinica: "Explican parte de la analgesia endogena y la accion farmacologica de opioides.",
      relacionados: ["receptor-opioide", "modulacion-nociceptiva", "analgesia-multimodal"]
    },
    {
      id: "receptor-opioide",
      termino: "Receptor opioide",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Receptor analgesico",
      definicion: "Receptor metabotropico activado por opioides endogenos o farmacos opioides.",
      importanciaClinica: "Diana central y periferica para analgesia, sedacion y efectos secundarios gastrointestinales/respiratorios.",
      relacionados: ["opioides-endogenos", "receptor-metabotropico", "modulacion-nociceptiva"]
    },

    // -------------------------------------------------------------------------
    // REFLEJOS, SNA Y ESTRES
    // -------------------------------------------------------------------------
    {
      id: "arco-reflejo",
      termino: "Arco reflejo",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Circuito neurologico",
      definicion: "Circuito que conecta receptor, via aferente, centro integrador, via eferente y efector para producir respuesta automatica.",
      importanciaClinica: "Es una herramienta de localizacion neurologica en examen fisico veterinario.",
      relacionados: ["receptor-sensorial", "neurona-aferente", "neurona-eferente"]
    },
    {
      id: "receptor-sensorial",
      termino: "Receptor sensorial",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Detector de estimulo",
      definicion: "Estructura que detecta estimulos mecanicos, termicos, quimicos o dolorosos.",
      importanciaClinica: "Permite evaluar sensibilidad, reflejos, dolor superficial/profundo y funcion aferente.",
      relacionados: ["arco-reflejo", "nociceptor", "neurona-aferente"]
    },
    {
      id: "neurona-aferente",
      termino: "Neurona aferente",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Via sensitiva",
      definicion: "Neurona que conduce informacion desde receptores perifericos hacia el sistema nervioso central.",
      importanciaClinica: "Su lesion altera sensibilidad, reflejos y percepcion del dolor.",
      relacionados: ["arco-reflejo", "receptor-sensorial", "centro-integrador"]
    },
    {
      id: "centro-integrador",
      termino: "Centro integrador",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Procesamiento neural",
      definicion: "Region del SNC donde se procesa la informacion y se genera una respuesta.",
      importanciaClinica: "Ayuda a diferenciar lesiones medulares, troncoencefalicas o corticales.",
      relacionados: ["sistema-nervioso-central", "arco-reflejo", "interneurona"]
    },
    {
      id: "interneurona",
      termino: "Interneurona",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Neurona de integracion",
      definicion: "Neurona ubicada entre neuronas aferentes y eferentes que modula circuitos locales.",
      importanciaClinica: "Permite reflejos polisinapticos, coordinacion y respuestas mas elaboradas.",
      relacionados: ["reflejo-polisinaptico", "centro-integrador", "arco-reflejo"]
    },
    {
      id: "neurona-eferente",
      termino: "Neurona eferente",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Via motora",
      definicion: "Neurona que conduce respuestas desde el SNC hacia musculo o glandula.",
      importanciaClinica: "Su lesion causa deficit motor, hiporreflexia, atrofia neurogena o flacidez.",
      relacionados: ["arco-reflejo", "organo-efector", "neurona-motora-inferior"]
    },
    {
      id: "organo-efector",
      termino: "Organo efector",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Destino de respuesta",
      definicion: "Musculo o glandula que ejecuta la respuesta final de un reflejo o via nerviosa.",
      importanciaClinica: "Permite interpretar respuesta motora, secreciones, tono muscular y funcion autonomica.",
      relacionados: ["neurona-eferente", "arco-reflejo", "sistema-nervioso-autonomo"]
    },
    {
      id: "reflejo-monosinaptico",
      termino: "Reflejo monosinaptico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Reflejo simple",
      definicion: "Reflejo con una sola sinapsis directa entre neurona aferente y eferente.",
      importanciaClinica: "El reflejo patelar es ejemplo clasico para evaluar segmentos medulares y nervios perifericos.",
      relacionados: ["reflejo-patelar", "arco-reflejo", "neurona-eferente"]
    },
    {
      id: "reflejo-polisinaptico",
      termino: "Reflejo polisinaptico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Reflejo complejo",
      definicion: "Reflejo que utiliza una o mas interneuronas para generar respuestas coordinadas.",
      importanciaClinica: "Permite evaluar circuitos protectores como reflejo flexor y respuestas perineales.",
      relacionados: ["interneurona", "reflejo-flexor", "reflejo-perineal"]
    },
    {
      id: "reflejo-patelar",
      termino: "Reflejo patelar",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Reflejo espinal",
      definicion: "Extension refleja de la rodilla al percutir el ligamento patelar.",
      importanciaClinica: "Ayuda a localizar lesiones femorales, segmentos lumbares o vias motoras superiores/inferiores.",
      relacionados: ["reflejo-monosinaptico", "hiperreflexia", "hiporreflexia"]
    },
    {
      id: "reflejo-flexor",
      termino: "Reflejo flexor",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Reflejo protector",
      definicion: "Retirada refleja de una extremidad ante estimulo nocivo o molesto.",
      importanciaClinica: "Evalua vias sensitivas, motoras y segmentos medulares de la extremidad.",
      relacionados: ["reflejo-polisinaptico", "nociceptor", "arco-reflejo"]
    },
    {
      id: "reflejo-perineal",
      termino: "Reflejo perineal",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Reflejo espinal",
      definicion: "Contraccion anal y respuesta de cola/perineo ante estimulo perineal.",
      importanciaClinica: "Ayuda a evaluar segmentos sacros, nervio pudendo y funcion neurologica caudal.",
      relacionados: ["reflejo-polisinaptico", "arco-reflejo", "neurona-eferente"]
    },
    {
      id: "neurona-motora-superior",
      termino: "Neurona motora superior",
      sigla: "NMS",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Via motora",
      definicion: "Neurona o via que desciende desde centros superiores para modular neuronas motoras inferiores.",
      importanciaClinica: "Su lesion suele producir hiperreflexia, aumento de tono y paresia espastica caudal a la lesion.",
      relacionados: ["hiperreflexia", "espasticidad", "neurona-motora-inferior"]
    },
    {
      id: "neurona-motora-inferior",
      termino: "Neurona motora inferior",
      sigla: "NMI",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Via motora",
      definicion: "Neurona que conecta directamente con el musculo esqueletico.",
      importanciaClinica: "Su lesion produce hiporreflexia, flacidez, atrofia rapida y debilidad marcada.",
      relacionados: ["hiporreflexia", "flacidez", "neurona-motora-superior"]
    },
    {
      id: "hiperreflexia",
      termino: "Hiperreflexia",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Hallazgo neurologico",
      definicion: "Respuesta refleja aumentada frente a un estimulo.",
      importanciaClinica: "Sugiere lesion de neurona motora superior o perdida de control inhibitorio descendente.",
      relacionados: ["neurona-motora-superior", "reflejo-patelar", "espasticidad"]
    },
    {
      id: "hiporreflexia",
      termino: "Hiporreflexia",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Hallazgo neurologico",
      definicion: "Respuesta refleja reducida o ausente.",
      importanciaClinica: "Sugiere lesion de neurona motora inferior, nervio periferico, raiz o union neuromuscular.",
      relacionados: ["neurona-motora-inferior", "flacidez", "reflejo-patelar"]
    },
    {
      id: "espasticidad",
      termino: "Espasticidad",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Alteracion del tono",
      definicion: "Aumento del tono muscular asociado a lesion de vias motoras superiores.",
      importanciaClinica: "Acompaña hiperreflexia y paresia espastica en lesiones centrales.",
      relacionados: ["neurona-motora-superior", "hiperreflexia", "paresia"]
    },
    {
      id: "flacidez",
      termino: "Flacidez",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Alteracion del tono",
      definicion: "Disminucion del tono muscular por falla de via motora inferior o unidad neuromuscular.",
      importanciaClinica: "Se observa junto a hiporreflexia y atrofia neurogena.",
      relacionados: ["neurona-motora-inferior", "hiporreflexia", "paresia"]
    },
    {
      id: "simpatico",
      termino: "Simpatico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Rama autonomica",
      definicion: "Rama del SNA asociada a respuestas de alerta, movilizacion energetica y adaptacion al estres.",
      importanciaClinica: "Predomina en dolor, miedo, shock, estres calórico y situaciones de emergencia.",
      relacionados: ["noradrenalina", "catecolaminas", "eje-sam"]
    },
    {
      id: "parasimpatico",
      termino: "Parasimpatico",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Rama autonomica",
      definicion: "Rama del SNA asociada a reposo, digestion, secreciones y conservacion energetica.",
      importanciaClinica: "Modula motilidad digestiva, tono vagal, bradicardia, salivacion y respuesta visceral.",
      relacionados: ["acetilcolina", "nervio-vago", "tono-vagal"]
    },
    {
      id: "eje-sam",
      termino: "Eje simpatico-adreno-medular",
      sigla: "SAM",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Respuesta rapida al estres",
      definicion: "Sistema de activacion simpatica y liberacion de catecolaminas ante estres agudo.",
      importanciaClinica: "Explica taquicardia, midriasis, hiperglucemia, redistribucion sanguinea y alerta.",
      relacionados: ["simpatico", "catecolaminas", "midriasis"]
    },
    {
      id: "eje-hha",
      termino: "Eje hipotalamo-hipofisis-adrenal",
      sigla: "HHA",
      sistema: "Endocrino/Metabolico",
      sistemaKey: "endocrino-metabolico",
      tipo: "Respuesta sostenida al estres",
      definicion: "Eje endocrino que activa liberacion de cortisol ante estres fisico o psicologico.",
      importanciaClinica: "Relaciona estres cronico con inmunidad, metabolismo, reproduccion, conducta y productividad.",
      relacionados: ["cortisol", "estres-cronico", "sistema-endocrino"]
    },
    {
      id: "cortisol",
      termino: "Cortisol",
      sistema: "Endocrino/Metabolico",
      sistemaKey: "endocrino-metabolico",
      tipo: "Glucocorticoide",
      definicion: "Hormona adrenal relacionada con metabolismo, inflamacion y respuesta sostenida al estres.",
      importanciaClinica: "Clave en estres, Cushing, Addison, inmunosupresion y adaptacion metabolica.",
      relacionados: ["eje-hha", "estres-cronico", "hiperglucemia"]
    },
    {
      id: "catecolaminas",
      termino: "Catecolaminas",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Mediadores de estres",
      definicion: "Grupo de aminas como adrenalina, noradrenalina y dopamina.",
      importanciaClinica: "Participan en shock, respuesta de estres, frecuencia cardiaca, tono vascular y metabolismo.",
      relacionados: ["noradrenalina", "eje-sam", "taquicardia"]
    },
    {
      id: "estres-agudo",
      termino: "Estres agudo",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Respuesta adaptativa",
      definicion: "Respuesta rapida ante amenaza o demanda intensa de corta duracion.",
      importanciaClinica: "Puede elevar frecuencia cardiaca, respiratoria, glucosa y activar conducta de escape o defensa.",
      relacionados: ["eje-sam", "simpatico", "catecolaminas"]
    },
    {
      id: "estres-cronico",
      termino: "Estres cronico",
      sistema: "Clinico general",
      sistemaKey: "clinico-general",
      tipo: "Respuesta maladaptativa",
      definicion: "Activacion prolongada de sistemas de estres con costos fisiologicos acumulados.",
      importanciaClinica: "Afecta inmunidad, reproduccion, crecimiento, conducta, motilidad digestiva y productividad.",
      relacionados: ["eje-hha", "cortisol", "alostasis"]
    },
    {
      id: "alostasis",
      termino: "Alostasis",
      sistema: "Homeostasis",
      sistemaKey: "homeostasis",
      tipo: "Adaptacion fisiologica",
      definicion: "Ajuste activo de variables fisiologicas para responder a demandas cambiantes.",
      importanciaClinica: "Cuando la carga alostatica es alta, el estres deja de ser adaptativo y favorece enfermedad.",
      relacionados: ["homeostasis", "estres-cronico", "cortisol"]
    },
    {
      id: "midriasis",
      termino: "Midriasis",
      sistema: "Neurologico",
      sistemaKey: "nervioso-neuroendocrino",
      tipo: "Signo autonomico",
      definicion: "Dilatacion de la pupila.",
      importanciaClinica: "Puede aparecer por activacion simpatica, dolor, miedo, farmacos, lesiones neurologicas o hipoxia.",
      relacionados: ["simpatico", "eje-sam", "dolor"]
    },

    // -------------------------------------------------------------------------
    // DOLOR Y NOCICEPCION
    // -------------------------------------------------------------------------
    {
      id: "dolor",
      termino: "Dolor",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Experiencia sensorial y emocional",
      definicion: "Experiencia desagradable asociada a daño real o potencial, integrada por componentes sensoriales, autonomicos y emocionales.",
      importanciaClinica: "Debe evaluarse por conducta, postura, respuesta a palpacion, signos autonomicos y contexto de especie.",
      relacionados: ["nocicepcion", "dolor-agudo", "dolor-cronico"]
    },
    {
      id: "nocicepcion",
      termino: "Nocicepcion",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Procesamiento de estimulos nocivos",
      definicion: "Proceso neural que detecta, transmite y modula estimulos potencialmente dañinos.",
      importanciaClinica: "Permite diseñar analgesia racional segun la etapa afectada.",
      relacionados: ["nociceptor", "transduccion-nociceptiva", "transmision-nociceptiva"]
    },
    {
      id: "nociceptor",
      termino: "Nociceptor",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Receptor de daño",
      definicion: "Receptor sensorial especializado en detectar estimulos mecanicos, termicos o quimicos nocivos.",
      importanciaClinica: "Su sensibilizacion reduce umbral y aumenta dolor inflamatorio.",
      relacionados: ["transduccion-nociceptiva", "sensibilizacion-periferica", "receptor-sensorial"]
    },
    {
      id: "transduccion-nociceptiva",
      termino: "Transduccion nociceptiva",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Etapa de nocicepcion",
      definicion: "Conversion de un estimulo nocivo en una señal electrica en el nociceptor.",
      importanciaClinica: "Diana de AINEs y estrategias que reducen inflamacion periferica.",
      relacionados: ["nociceptor", "sensibilizacion-periferica", "analgesia-multimodal"]
    },
    {
      id: "transmision-nociceptiva",
      termino: "Transmision nociceptiva",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Etapa de nocicepcion",
      definicion: "Conduccion de la señal dolorosa desde periferia hacia medula y centros superiores.",
      importanciaClinica: "Diana de anestesicos locales que bloquean canales de sodio.",
      relacionados: ["fibra-a-delta", "fibra-c", "anestesia-local"]
    },
    {
      id: "modulacion-nociceptiva",
      termino: "Modulacion nociceptiva",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Etapa de nocicepcion",
      definicion: "Ajuste de la señal dolorosa por circuitos medulares y vias descendentes que inhiben o facilitan dolor.",
      importanciaClinica: "Diana de opioides, ketamina y analgesia multimodal.",
      relacionados: ["opioides-endogenos", "receptor-nmda", "teoria-compuerta"]
    },
    {
      id: "percepcion-dolor",
      termino: "Percepcion del dolor",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Etapa cortical",
      definicion: "Integracion consciente de la experiencia dolorosa en el sistema nervioso central.",
      importanciaClinica: "Se modifica con anestesia general, sedacion profunda y estado emocional del paciente.",
      relacionados: ["dolor", "analgesia-multimodal", "sistema-nervioso-central"]
    },
    {
      id: "fibra-a-delta",
      termino: "Fibra A-delta",
      sinonimos: ["Fibra Aδ"],
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Fibra nociceptiva",
      definicion: "Fibra mielinica fina que conduce dolor rapido, agudo y relativamente localizado.",
      importanciaClinica: "Explica la primera respuesta dolorosa ante un estimulo nocivo.",
      relacionados: ["transmision-nociceptiva", "mielina", "dolor-agudo"]
    },
    {
      id: "fibra-c",
      termino: "Fibra C",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Fibra nociceptiva",
      definicion: "Fibra amielinica que conduce dolor lento, sordo, difuso y persistente.",
      importanciaClinica: "Importante en dolor inflamatorio, visceral y cronico.",
      relacionados: ["transmision-nociceptiva", "dolor-visceral", "dolor-cronico"]
    },
    {
      id: "dolor-somatico",
      termino: "Dolor somatico",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Tipo de dolor",
      definicion: "Dolor originado en piel, musculo, articulaciones o estructuras de la pared corporal.",
      importanciaClinica: "Suele ser mejor localizado y proporcional al estimulo; responde a analgesia antiinflamatoria y opioide segun caso.",
      relacionados: ["dolor", "fibra-a-delta", "nociceptor"]
    },
    {
      id: "dolor-visceral",
      termino: "Dolor visceral",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Tipo de dolor",
      definicion: "Dolor originado en organos internos, frecuentemente difuso y mal localizado.",
      importanciaClinica: "Puede acompañarse de signos autonomicos como taquicardia, nausea, sudoracion o cambios de conducta.",
      relacionados: ["dolor-referido", "fibra-c", "simpatico"]
    },
    {
      id: "dolor-neuropatico",
      termino: "Dolor neuropatico",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Tipo de dolor",
      definicion: "Dolor causado por lesion o disfuncion del sistema nervioso.",
      importanciaClinica: "Puede persistir sin lesion tisular activa y requerir analgesia dirigida a modulacion neural.",
      relacionados: ["sensibilizacion-central", "dolor-cronico", "alodinia"]
    },
    {
      id: "dolor-agudo",
      termino: "Dolor agudo",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Curso temporal",
      definicion: "Dolor reciente con funcion protectora y relacionado con lesion o estimulo actual.",
      importanciaClinica: "Debe tratarse temprano para evitar sensibilizacion y dolor cronico.",
      relacionados: ["dolor", "nocicepcion", "analgesia-preventiva"]
    },
    {
      id: "dolor-cronico",
      termino: "Dolor cronico",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Curso temporal",
      definicion: "Dolor persistente que puede mantenerse por cambios maladaptativos del sistema nervioso.",
      importanciaClinica: "Puede convertirse en enfermedad propia con sensibilizacion central, neuroinflamacion y cambios conductuales.",
      relacionados: ["neuroinflamacion", "sensibilizacion-central", "dolor-neuropatico"]
    },
    {
      id: "dolor-referido",
      termino: "Dolor referido",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Patron doloroso",
      definicion: "Dolor percibido en una zona distinta al sitio real de origen.",
      importanciaClinica: "Ocurre por convergencia de aferentes viscerales y somaticas en circuitos medulares.",
      relacionados: ["dolor-visceral", "asta-dorsal", "convergencia-viscerosomatica"]
    },
    {
      id: "asta-dorsal",
      termino: "Asta dorsal",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Region medular",
      definicion: "Zona de la medula espinal donde ingresan y se procesan muchas señales sensitivas y nociceptivas.",
      importanciaClinica: "Sitio clave de modulacion, wind-up y sensibilizacion central.",
      relacionados: ["modulacion-nociceptiva", "wind-up", "dolor-referido"]
    },
    {
      id: "convergencia-viscerosomatica",
      termino: "Convergencia viscerosomatica",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Mecanismo de dolor referido",
      definicion: "Convergencia de aferentes viscerales y somaticas sobre neuronas medulares compartidas.",
      importanciaClinica: "Explica por que el dolor visceral puede percibirse como dolor corporal mal localizado.",
      relacionados: ["dolor-referido", "dolor-visceral", "asta-dorsal"]
    },
    {
      id: "sensibilizacion-periferica",
      termino: "Sensibilizacion periferica",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Amplificacion periferica",
      definicion: "Reduccion del umbral de nociceptores por mediadores inflamatorios locales.",
      importanciaClinica: "Produce dolor aumentado en zonas lesionadas y es diana de AINEs.",
      relacionados: ["nociceptor", "hiperalgesia", "transduccion-nociceptiva"]
    },
    {
      id: "sensibilizacion-central",
      termino: "Sensibilizacion central",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Amplificacion central",
      definicion: "Aumento de excitabilidad de circuitos medulares o centrales por estimulacion repetida o intensa.",
      importanciaClinica: "Puede causar hiperalgesia, alodinia y dolor persistente despues de la lesion inicial.",
      relacionados: ["wind-up", "receptor-nmda", "dolor-cronico"]
    },
    {
      id: "wind-up",
      termino: "Wind-up",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Potenciacion dolorosa",
      definicion: "Aumento progresivo de respuesta neuronal ante estimulos nociceptivos repetidos.",
      importanciaClinica: "Relaciona receptor NMDA, entrada de calcio y dolor cronico; ketamina puede ayudar a bloquearlo.",
      relacionados: ["receptor-nmda", "sensibilizacion-central", "sumacion-temporal"]
    },
    {
      id: "hiperalgesia",
      termino: "Hiperalgesia",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Dolor aumentado",
      definicion: "Respuesta dolorosa exagerada ante un estimulo que normalmente seria doloroso.",
      importanciaClinica: "Puede ser periferica o secundaria a sensibilizacion central.",
      relacionados: ["sensibilizacion-periferica", "sensibilizacion-central", "alodinia"]
    },
    {
      id: "alodinia",
      termino: "Alodinia",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Dolor anormal",
      definicion: "Dolor provocado por un estimulo que normalmente no deberia doler.",
      importanciaClinica: "Sugiere sensibilizacion central o dolor neuropatico.",
      relacionados: ["hiperalgesia", "dolor-neuropatico", "sensibilizacion-central"]
    },
    {
      id: "neuroinflamacion",
      termino: "Neuroinflamacion",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Inflamacion neural",
      definicion: "Activacion inflamatoria de celulas y mediadores dentro del sistema nervioso.",
      importanciaClinica: "Participa en dolor cronico, activacion glial y cambios persistentes de excitabilidad.",
      relacionados: ["microglia", "astrocito", "dolor-cronico"]
    },
    {
      id: "teoria-compuerta",
      termino: "Teoria de la compuerta",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Modelo de modulacion",
      definicion: "Modelo donde señales tactiles o circuitos inhibitorios reducen transmision dolorosa en medula.",
      importanciaClinica: "Explica por que frotar, presion, fisioterapia o estimulacion pueden disminuir dolor.",
      relacionados: ["modulacion-nociceptiva", "asta-dorsal", "pips"]
    },
    {
      id: "anestesia-local",
      termino: "Anestesia local",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Bloqueo de transmision",
      definicion: "Bloqueo reversible de conduccion nerviosa en una zona especifica.",
      importanciaClinica: "Reduce transmision nociceptiva al bloquear canales de sodio dependientes de voltaje.",
      relacionados: ["canal-sodio-voltaje", "transmision-nociceptiva", "analgesia-multimodal"]
    },
    {
      id: "analgesia-multimodal",
      termino: "Analgesia multimodal",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Estrategia analgesica",
      definicion: "Uso combinado de tecnicas o farmacos que actuan en diferentes etapas del dolor.",
      importanciaClinica: "Permite mejor control del dolor y reduce dosis o efectos adversos de un solo farmaco.",
      relacionados: ["transduccion-nociceptiva", "modulacion-nociceptiva", "percepcion-dolor"]
    },
    {
      id: "analgesia-preventiva",
      termino: "Analgesia preventiva",
      sistema: "Dolor/Nocicepcion",
      sistemaKey: "dolor-nocicepcion",
      tipo: "Estrategia analgesica",
      definicion: "Analgesia aplicada antes o durante el estimulo doloroso para reducir sensibilizacion posterior.",
      importanciaClinica: "Importante en cirugia, trauma y manejo temprano de dolor agudo.",
      relacionados: ["dolor-agudo", "sensibilizacion-central", "analgesia-multimodal"]
    },

    // -------------------------------------------------------------------------
    // SISTEMA NERVIOSO ENTERICO Y EJE INTESTINO-CEREBRO
    // -------------------------------------------------------------------------
    {
      id: "sistema-nervioso-enterico",
      termino: "Sistema nervioso enterico",
      sigla: "SNE",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Red neural digestiva",
      definicion: "Red de neuronas del tubo digestivo capaz de coordinar motilidad, secrecion y flujo local.",
      importanciaClinica: "Explica autonomia intestinal, ileo por estres, diarrea funcional y conexion digestivo-neural.",
      relacionados: ["plexo-mienterico", "plexo-submucoso", "eje-intestino-cerebro"]
    },
    {
      id: "plexo-mienterico",
      termino: "Plexo mienterico",
      sinonimos: ["Plexo de Auerbach"],
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Plexo enterico",
      definicion: "Red neuronal entre capas musculares del intestino que regula principalmente la motilidad.",
      importanciaClinica: "Alteraciones se reflejan en ileo, hipomotilidad, espasmos o dismotilidad.",
      relacionados: ["sistema-nervioso-enterico", "peristalsis-enterica", "motilidad-intestinal"]
    },
    {
      id: "plexo-submucoso",
      termino: "Plexo submucoso",
      sinonimos: ["Plexo de Meissner"],
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Plexo enterico",
      definicion: "Red neuronal de la submucosa que regula secrecion, flujo sanguineo local e interaccion mucosa.",
      importanciaClinica: "Participa en secrecion intestinal, diarrea y respuesta mucosa a irritantes o inflamacion.",
      relacionados: ["sistema-nervioso-enterico", "secrecion-intestinal", "galt"]
    },
    {
      id: "peristalsis-enterica",
      termino: "Peristalsis enterica",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Motilidad digestiva",
      definicion: "Patron coordinado de contraccion y relajacion que desplaza contenido intestinal.",
      importanciaClinica: "Su falla contribuye a ileo, estreñimiento, distension o trastornos de transito.",
      relacionados: ["plexo-mienterico", "motilidad-intestinal", "peristalsis"]
    },
    {
      id: "segmentacion-intestinal",
      termino: "Segmentacion intestinal",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Motilidad digestiva",
      definicion: "Contracciones locales que mezclan contenido intestinal y favorecen digestion/absorcion.",
      importanciaClinica: "Su alteracion puede afectar mezcla, absorcion y transito intestinal.",
      relacionados: ["plexo-mienterico", "motilidad-intestinal", "digestion-quimica"]
    },
    {
      id: "motilidad-intestinal",
      termino: "Motilidad intestinal",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Funcion digestiva",
      definicion: "Conjunto de movimientos que mezclan, retienen o propulsan contenido intestinal.",
      importanciaClinica: "Se modifica por estres, dolor, inflamacion, farmacos, vago y simpatico.",
      relacionados: ["peristalsis-enterica", "segmentacion-intestinal", "tono-vagal"]
    },
    {
      id: "ileo",
      termino: "Ileo",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Trastorno de motilidad",
      definicion: "Disminucion o ausencia funcional de motilidad intestinal sin necesariamente existir obstruccion mecanica.",
      importanciaClinica: "Puede aparecer por dolor, cirugia, inflamacion, shock, hipocalemia o activacion simpatica.",
      relacionados: ["motilidad-intestinal", "hipocalemia", "simpatico"]
    },
    {
      id: "eje-intestino-cerebro",
      termino: "Eje intestino-cerebro",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Comunicacion bidireccional",
      definicion: "Red de comunicacion neural, endocrina e inmune entre intestino, microbiota y sistema nervioso.",
      importanciaClinica: "Relaciona dieta, microbiota, estres, apetito, conducta, dolor visceral y motilidad.",
      relacionados: ["nervio-vago", "microbiota-intestinal", "serotonina-intestinal"]
    },
    {
      id: "nervio-vago",
      termino: "Nervio vago",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Via neurovisceral",
      definicion: "Nervio craneal que comunica visceras con tronco encefalico y modula funciones digestivas y autonomicas.",
      importanciaClinica: "Su tono influye en motilidad, secrecion, apetito, frecuencia cardiaca y respuesta al estres.",
      relacionados: ["tono-vagal", "eje-intestino-cerebro", "parasimpatico"]
    },
    {
      id: "tono-vagal",
      termino: "Tono vagal",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Estado autonomico",
      definicion: "Nivel de actividad funcional del nervio vago sobre organos viscerales.",
      importanciaClinica: "Tono vagal adecuado favorece motilidad y reposo; cambios se relacionan con estres, colico, bradicardia o digestion.",
      relacionados: ["nervio-vago", "parasimpatico", "motilidad-intestinal"]
    },
    {
      id: "nucleo-tracto-solitario",
      termino: "Nucleo del tracto solitario",
      sigla: "NTS",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Centro integrador visceral",
      definicion: "Region del tronco encefalico que recibe informacion visceral aferente, incluida señal vagal.",
      importanciaClinica: "Integra señales de apetito, saciedad, nausea, presion y estado visceral.",
      relacionados: ["nervio-vago", "eje-intestino-cerebro", "centro-integrador"]
    },
    {
      id: "galt",
      termino: "Tejido linfoide asociado a intestino",
      sigla: "GALT",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Inmunidad mucosa",
      definicion: "Sistema inmune especializado de la mucosa intestinal.",
      importanciaClinica: "Conecta microbiota, inflamacion intestinal, barrera mucosa y respuesta inmunitaria.",
      relacionados: ["sistema-inmunologico", "microbiota-intestinal", "barrera-intestinal"]
    },
    {
      id: "celula-enterocromafin",
      termino: "Celula enterocromafin",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Celula enteroendocrina",
      definicion: "Celula intestinal que produce y libera serotonina en respuesta a estimulos luminales.",
      importanciaClinica: "Participa en motilidad, secrecion, nausea, dolor visceral y comunicacion intestino-cerebro.",
      relacionados: ["serotonina-intestinal", "eje-intestino-cerebro", "motilidad-intestinal"]
    },
    {
      id: "serotonina-intestinal",
      termino: "Serotonina intestinal",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Mediador intestinal",
      definicion: "Serotonina producida principalmente en el intestino por celulas enterocromafines.",
      importanciaClinica: "Regula motilidad, secrecion, sensibilidad visceral y señales hacia el eje intestino-cerebro.",
      relacionados: ["serotonina", "celula-enterocromafin", "motilidad-intestinal"]
    },
    {
      id: "acidos-grasos-cadena-corta",
      termino: "Acidos grasos de cadena corta",
      sigla: "AGCC",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Metabolitos microbianos",
      definicion: "Metabolitos como acetato, propionato y butirato producidos por fermentacion microbiana.",
      importanciaClinica: "Nutren epitelio, modulan inflamacion, barrera intestinal y comunicacion microbiota-huesped.",
      relacionados: ["butirato", "microbiota-intestinal", "barrera-intestinal"]
    },
    {
      id: "butirato",
      termino: "Butirato",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "AGCC",
      definicion: "Acido graso de cadena corta usado por colonocitos como fuente energetica.",
      importanciaClinica: "Favorece barrera intestinal, salud de mucosa y modulacion inflamatoria.",
      relacionados: ["acidos-grasos-cadena-corta", "barrera-intestinal", "microbiota-intestinal"]
    },
    {
      id: "barrera-intestinal",
      termino: "Barrera intestinal",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Proteccion mucosa",
      definicion: "Conjunto de epitelio, moco, uniones estrechas, inmunidad y microbiota que separa lumen y medio interno.",
      importanciaClinica: "Su falla favorece inflamacion, translocacion bacteriana, diarrea y respuesta sistemica.",
      relacionados: ["permeabilidad-intestinal", "galt", "microbiota-intestinal"]
    },
    {
      id: "permeabilidad-intestinal",
      termino: "Permeabilidad intestinal",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Funcion de barrera",
      definicion: "Grado en que sustancias del lumen pueden atravesar la barrera intestinal.",
      importanciaClinica: "Aumenta con inflamacion, estres, disbiosis o daño epitelial y puede agravar enfermedad sistemica.",
      relacionados: ["barrera-intestinal", "disbiosis", "galt"]
    },
    {
      id: "disbiosis",
      termino: "Disbiosis",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Desequilibrio microbiano",
      definicion: "Alteracion de composicion o funcion de la microbiota intestinal.",
      importanciaClinica: "Puede asociarse a diarrea, inflamacion intestinal, cambios de motilidad, conducta o recuperacion lenta.",
      relacionados: ["microbiota-intestinal", "barrera-intestinal", "eje-intestino-cerebro"]
    },
    {
      id: "vip",
      termino: "Peptido intestinal vasoactivo",
      sigla: "VIP",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Neurotransmisor enterico",
      definicion: "Peptido que modula relajacion de musculo liso, secrecion y flujo sanguineo intestinal.",
      importanciaClinica: "Participa en regulacion enterica fina de motilidad, secrecion y vasodilatacion.",
      relacionados: ["sistema-nervioso-enterico", "plexo-submucoso", "oxido-nitrico"]
    },
    {
      id: "oxido-nitrico",
      termino: "Oxido nitrico",
      sigla: "NO",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Mediador inhibidor",
      definicion: "Gasotransmisor que participa en relajacion de musculo liso y regulacion vascular.",
      importanciaClinica: "Importante en motilidad gastrointestinal, tono vascular y control local de flujo.",
      relacionados: ["vip", "motilidad-intestinal", "plexo-mienterico"]
    },
    {
      id: "vagotomia",
      termino: "Vagotomia",
      sistema: "Enterico",
      sistemaKey: "enterico",
      tipo: "Interrupcion neural",
      definicion: "Seccion o bloqueo funcional del nervio vago.",
      importanciaClinica: "Permite entender que el intestino conserva actividad enterica, aunque pierde modulacion vagal eficiente.",
      relacionados: ["nervio-vago", "sistema-nervioso-enterico", "tono-vagal"]
    }
  ];
})();
