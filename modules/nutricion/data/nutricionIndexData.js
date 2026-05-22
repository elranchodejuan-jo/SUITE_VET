(function () {
  "use strict";

  const parts = window.NUTRICION_DATA_PARTS || {};
  const submodulosNutricion = parts.submodulosNutricion || { secciones: [], submodulos: [] };

  const required = [
    "submodulosNutricion",
    "aminoacidosData",
    "nutrientesData",
    "acidosGrasosData",
    "vitaminasMineralesData",
    "aguaData",
    "weendeData",
    "ingredientesData",
    "digestionEspeciesData",
    "fermentacionRuminalData",
    "trastornosNutricionalesData",
    "racionesData",
    "etiquetasBalanceadoData"
  ];

  const missing = required.filter((key) => typeof parts[key] === "undefined");
  if (missing.length) {
    console.warn("[SUITE VET Nutricion] Faltan archivos de datos:", missing.join(", "));
  }

  window.NUTRICION_DATA = {
    secciones: submodulosNutricion.secciones || [],
    submodulos: submodulosNutricion.submodulos || [],
    aminoacidos: parts.aminoacidosData || [],
    nutrientes: parts.nutrientesData || [],
    acidosGrasos: parts.acidosGrasosData || [],
    vitaminasMinerales: parts.vitaminasMineralesData || {
      vitaminasLiposolubles: [],
      vitaminasHidrosolubles: [],
      macrominerales: [],
      microminerales: []
    },
    agua: parts.aguaData || {},
    weende: parts.weendeData || [],
    weendeFormulas: parts.weendeFormulas || {},
    ingredientes: parts.ingredientesData || [],
    digestionEspecies: parts.digestionEspeciesData || [],
    fermentacionRuminal: parts.fermentacionRuminalData || [],
    trastornosNutricionales: parts.trastornosNutricionalesData || [],
    trastornosAdvertencia: parts.trastornosAdvertencia || "Informacion educativa. Ante signos clinicos, consultar a un medico veterinario.",
    raciones: parts.racionesData || {},
    etiquetasBalanceado: parts.etiquetasBalanceadoData || {},
    migracion: {
      aminoacidosData: "aminoacidos",
      nutrientesData: "nutrientes",
      acidosGrasosData: "acidos_grasos",
      vitaminasMineralesData: "vitaminas_minerales",
      aguaData: "agua_nutricion",
      weendeData: "analisis_weende",
      ingredientesData: "ingredientes",
      digestionEspeciesData: "digestion_especies",
      fermentacionRuminalData: "fermentacion_ruminal",
      trastornosNutricionalesData: "trastornos_nutricionales",
      racionesData: "raciones",
      etiquetasBalanceadoData: "etiquetas_balanceado"
    }
  };
})();
