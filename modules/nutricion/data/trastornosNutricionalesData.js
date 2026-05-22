(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const advertenciaGeneral = "Informacion educativa. Ante signos clinicos, consultar a un medico veterinario.";

  const trastornosNutricionalesData = [
    {
      id: "hipocalcemia",
      nombre: "Hipocalcemia",
      tipo: "Deficiencia / trastorno metabolico",
      especiesAfectadas: ["Vacas lecheras", "Pequeños rumiantes"],
      causaNutricional: "Desequilibrio del calcio alrededor del parto o lactancia.",
      signosClinicos: ["Debilidad", "Decubito", "Disminucion de produccion", "Frialdad periferica"],
      prevencion: "Manejo nutricional adecuado en preparto y lactancia.",
      correccionNutricional: "Revision de dieta, minerales y manejo profesional.",
      alertaVeterinaria: "Ante signos clinicos, consultar a un medico veterinario.",
      comoReconocer: {
        observacionAnimal: "Animal debil, con dificultad para levantarse o en decubito.",
        etapaRiesgo: "Periparto o inicio de lactancia.",
        confirmacion: "Evaluacion clinica y pruebas complementarias."
      }
    },
    {
      id: "cetosis",
      nombre: "Cetosis",
      tipo: "Metabolico",
      especiesAfectadas: ["Vacas lecheras", "Pequeños rumiantes"],
      causaNutricional: "Balance energetico negativo o manejo inadecuado de energia en lactancia.",
      signosClinicos: ["Baja produccion", "Perdida de condicion", "Menor consumo", "Dato pendiente"],
      prevencion: "Manejo de condicion corporal, energia y transicion.",
      correccionNutricional: "Revisar energia, consumo y estrategia profesional.",
      alertaVeterinaria: advertenciaGeneral,
      comoReconocer: {
        observacionAnimal: "Baja de consumo o produccion en etapa de alta demanda.",
        etapaRiesgo: "Inicio de lactancia.",
        confirmacion: "Evaluacion clinica y pruebas complementarias."
      }
    },
    {
      id: "acidosis_ruminal",
      nombre: "Acidosis ruminal",
      tipo: "Desequilibrio",
      especiesAfectadas: ["Bovinos", "Ovinos", "Caprinos"],
      causaNutricional: "Exceso de carbohidratos rapidamente fermentables o baja fibra efectiva.",
      signosClinicos: ["Disminucion de rumia", "Diarrea", "Baja produccion", "Laminitis asociada"],
      prevencion: "Adaptacion gradual, fibra efectiva y balance fibra/concentrado.",
      correccionNutricional: "Revisar racion y manejo con profesional.",
      alertaVeterinaria: advertenciaGeneral,
      comoReconocer: {
        observacionAnimal: "Menor rumia, heces alteradas o baja de consumo.",
        etapaRiesgo: "Cambios de dieta, engorde intensivo o alta inclusion de concentrado.",
        confirmacion: "Evaluacion clinica, historia dietaria y pruebas cuando correspondan."
      }
    },
    {
      id: "timpanismo",
      nombre: "Timpanismo",
      tipo: "Desequilibrio digestivo",
      especiesAfectadas: ["Bovinos", "Pequeños rumiantes"],
      causaNutricional: "Acumulacion de gas asociada a fermentacion, dieta o manejo.",
      signosClinicos: ["Distension abdominal", "Inquietud", "Dificultad respiratoria", "Riesgo agudo"],
      prevencion: "Manejo de pasturas, cambios graduales y supervision.",
      correccionNutricional: "Atencion veterinaria y ajuste dietario posterior.",
      alertaVeterinaria: "Puede ser una emergencia. Consultar inmediatamente.",
      comoReconocer: {
        observacionAnimal: "Distension visible del flanco izquierdo y malestar.",
        etapaRiesgo: "Pastoreo o cambios dietarios.",
        confirmacion: "Evaluacion clinica urgente."
      }
    },
    {
      id: "raquitismo",
      nombre: "Raquitismo",
      tipo: "Deficiencia",
      especiesAfectadas: ["Animales jovenes", "Aves", "Mascotas"],
      causaNutricional: "Desequilibrio de calcio, fosforo o vitamina D.",
      signosClinicos: ["Problemas oseos", "Crecimiento deficiente", "Debilidad"],
      prevencion: "Dieta balanceada con minerales y vitamina D segun especie.",
      correccionNutricional: "Revisar dieta completa, no solo un nutriente aislado.",
      alertaVeterinaria: advertenciaGeneral,
      comoReconocer: {
        observacionAnimal: "Deformidades o debilidad en crecimiento.",
        etapaRiesgo: "Animales jovenes.",
        confirmacion: "Evaluacion clinica, radiografia o analisis segun criterio."
      }
    },
    {
      id: "deficiencia_vitamina_a",
      nombre: "Deficiencia de vitamina A",
      tipo: "Deficiencia",
      especiesAfectadas: ["Bovinos", "Aves", "Mascotas"],
      causaNutricional: "Bajo aporte o disponibilidad de vitamina A.",
      signosClinicos: ["Problemas visuales", "Alteraciones epiteliales", "Baja respuesta inmune", "Dato pendiente"],
      prevencion: "Asegurar aporte en dieta y premezcla segun especie.",
      correccionNutricional: "Revisar dieta, almacenamiento y suplementacion profesional.",
      alertaVeterinaria: advertenciaGeneral,
      comoReconocer: {
        observacionAnimal: "Signos oculares, piel/mucosas alteradas o bajo desempeno.",
        etapaRiesgo: "Crecimiento, reproduccion o dietas pobres en fuentes.",
        confirmacion: "Evaluacion clinica y revision nutricional."
      }
    },
    {
      id: "deficiencia_vitamina_e_selenio",
      nombre: "Deficiencia de vitamina E/Selenio",
      tipo: "Deficiencia",
      especiesAfectadas: ["Rumiantes", "Equinos", "Aves"],
      causaNutricional: "Bajo aporte de antioxidantes nutricionales.",
      signosClinicos: ["Debilidad muscular", "Problemas reproductivos", "Dato pendiente"],
      prevencion: "Manejo de premezclas y minerales segun zona y especie.",
      correccionNutricional: "No suplementar sin criterio por riesgo de toxicidad de selenio.",
      alertaVeterinaria: advertenciaGeneral,
      comoReconocer: {
        observacionAnimal: "Debilidad o problemas musculares.",
        etapaRiesgo: "Animales jovenes o dietas deficitarias.",
        confirmacion: "Evaluacion clinica y pruebas complementarias."
      }
    },
    {
      id: "anemia_hierro",
      nombre: "Anemia por deficiencia de hierro",
      tipo: "Deficiencia",
      especiesAfectadas: ["Lechones", "Animales jovenes", "Mascotas"],
      causaNutricional: "Aporte insuficiente de hierro o alta demanda.",
      signosClinicos: ["Palidez", "Debilidad", "Bajo crecimiento", "Letargia"],
      prevencion: "Manejo preventivo en especies y etapas de riesgo.",
      correccionNutricional: "Confirmar causa y corregir con supervision profesional.",
      alertaVeterinaria: advertenciaGeneral,
      comoReconocer: {
        observacionAnimal: "Mucosas palidas y bajo vigor.",
        etapaRiesgo: "Animales jovenes.",
        confirmacion: "Hemograma y evaluacion clinica."
      }
    },
    {
      id: "obesidad_mascotas",
      nombre: "Obesidad en mascotas",
      tipo: "Exceso",
      especiesAfectadas: ["Caninos", "Felinos"],
      causaNutricional: "Exceso energetico, baja actividad o alimentacion sin control.",
      signosClinicos: ["Aumento de condicion corporal", "Intolerancia al ejercicio", "Dato pendiente"],
      prevencion: "Control de raciones, pesaje, actividad y dieta acorde a etapa.",
      correccionNutricional: "Plan de reduccion de peso gradual con supervision veterinaria.",
      alertaVeterinaria: advertenciaGeneral,
      comoReconocer: {
        observacionAnimal: "Costillas dificiles de palpar, cintura poco visible o aumento de peso.",
        etapaRiesgo: "Adultos, esterilizados o baja actividad.",
        confirmacion: "Condicion corporal y peso seriado."
      }
    },
    {
      id: "laminitis_dieta",
      nombre: "Laminitis asociada a dieta",
      tipo: "Desequilibrio",
      especiesAfectadas: ["Equinos", "Bovinos"],
      causaNutricional: "Exceso de carbohidratos, cambios bruscos o alteraciones digestivas.",
      signosClinicos: ["Dolor en miembros", "Cojera", "Postura anormal", "Dato pendiente"],
      prevencion: "Cambios graduales, control de almidones/azucares y manejo de condicion corporal.",
      correccionNutricional: "Atencion veterinaria y revision de dieta.",
      alertaVeterinaria: "Puede ser grave. Consultar a un medico veterinario.",
      comoReconocer: {
        observacionAnimal: "Cojera, dolor o postura de descarga.",
        etapaRiesgo: "Cambios de dieta, pasturas ricas o exceso de concentrado.",
        confirmacion: "Evaluacion clinica veterinaria."
      }
    }
  ];

  window.NUTRICION_DATA_PARTS.trastornosNutricionalesData = trastornosNutricionalesData;
  window.NUTRICION_DATA_PARTS.trastornosAdvertencia = advertenciaGeneral;
})();
