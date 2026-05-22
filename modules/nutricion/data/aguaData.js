(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const aguaData = {
    especies: [
      { id: "bovino", nombre: "Bovino", litrosPorKgPv: null, litrosPorKgMs: { min: 3, max: 5 }, litrosPorLitroLeche: { min: 4, max: 5 } },
      { id: "ternero", nombre: "Ternero", litrosPorKgPv: null, litrosPorKgMs: { min: 6, max: 7 }, litrosPorLitroLeche: null },
      { id: "ovino_caprino", nombre: "Ovino / caprino", litrosPorKgPv: null, litrosPorKgMs: null, litrosPorLitroLeche: null },
      { id: "equino", nombre: "Equino", litrosPorKgPv: null, litrosPorKgMs: null, litrosPorLitroLeche: null },
      { id: "porcino", nombre: "Porcino", litrosPorKgPv: null, litrosPorKgMs: null, litrosPorLitroLeche: null },
      { id: "ave", nombre: "Ave", litrosPorKgPv: null, litrosPorKgMs: null, litrosPorLitroLeche: null },
      { id: "canino", nombre: "Canino", litrosPorKgPv: null, litrosPorKgMs: null, litrosPorLitroLeche: null },
      { id: "felino", nombre: "Felino", litrosPorKgPv: null, litrosPorKgMs: null, litrosPorLitroLeche: null }
    ],
    etapas: ["Mantenimiento", "Crecimiento", "Lactancia", "Gestacion", "Postura", "Engorde", "Trabajo"],
    climas: ["Frio", "Templado", "Calido"],
    factoresAumento: [
      "Clima calido",
      "Lactancia",
      "Dieta alta en sal",
      "Dieta alta en proteina",
      "Postura de huevos"
    ],
    alertas: [
      "Agua contaminada",
      "Restriccion de agua",
      "Deshidratacion",
      "Alta carga de sales"
    ],
    fuentesAgua: [
      "Agua de bebida",
      "Agua contenida en los alimentos",
      "Agua metabolica"
    ],
    humedadAlimentos: {
      forrajesVerdesEnsilados: "70-90% de agua",
      alimentosSecos: "7-15% de agua",
      alertaHumedad: "Mas de 15% de humedad en alimentos secos no es aceptable por disminucion del valor alimenticio y predisposicion a hongos o putrefaccion."
    },
    aguaMetabolica: {
      carbohidratos: "0.6 g de agua por g oxidado",
      grasa: "1.1 g de agua por g oxidado",
      proteina: "0.4 g de agua por g oxidado",
      participacionGeneral: "En la mayoria de animales domesticos representa 5-10% del total de agua consumida."
    },
    perdidas: [
      "Aire espirado",
      "Evaporacion a traves de la piel",
      "Orina",
      "Heces"
    ],
    salesDisueltas: {
      toleranciaGanado: "1.3-1.5% de sales totales disueltas",
      alerta: "Altas cargas de sales causan danos por efecto osmotico y reducen desempeno."
    },
    restriccion: {
      moderada: "Reduce consumo de alimento.",
      severa: "Produce perdida rapida de peso por deshidratacion.",
      severidad: "Perdida de 10% del agua corporal es severa; 20% puede resultar mortal."
    },
    advertencia: "Calculo orientativo. Verificar con tablas nutricionales especificas para especie, etapa y sistema productivo.",
    notaDatos: "El PDF aporta coeficientes generales para ganado adulto, terneros y vacas lecheras; otras especies quedan en null hasta integrar tablas oficiales."
  };

  window.NUTRICION_DATA_PARTS.aguaData = aguaData;
})();
