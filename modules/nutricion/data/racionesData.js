(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const racionesData = {
    especies: ["Bovinos", "Aves", "Cerdos", "Equinos", "Caninos", "Felinos", "Ovinos", "Caprinos"],
    etapas: ["Mantenimiento", "Crecimiento", "Lactancia", "Gestacion", "Postura", "Engorde", "Trabajo"],
    camposCalculados: ["costoKg", "proteinaCruda", "fibraCruda", "extractoEtereo"],
    ejemplosPdf: [
      {
        id: "perros_adultos_pienso_seco",
        nombre: "Ejemplo de pienso seco para perros adultos",
        ingredientes: [
          { ingrediente: "Maiz", inclusion: 53 },
          { ingrediente: "Salvado de trigo", inclusion: 17 },
          { ingrediente: "Harina de carne", inclusion: 15 },
          { ingrediente: "Grasa de rumiante", inclusion: 10 },
          { ingrediente: "Aceites vegetales", inclusion: 4 },
          { ingrediente: "Corrector vitaminico-mineral", inclusion: 1 }
        ],
        aditivos: ["Antioxidante", "Antifungico"]
      }
    ],
    advertencia: "Formulacion simple educativa. No reemplaza formulacion profesional, analisis bromatologico ni programacion lineal.",
    notaFutura: "Preparado para migrar a una tabla raciones y para futura optimizacion por programacion lineal."
  };

  window.NUTRICION_DATA_PARTS.racionesData = racionesData;
})();
