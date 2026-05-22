(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const etiquetasBalanceadoData = {
    rangosGenerales: {
      proteinaCruda: {
        bajo: "Contenido bajo de proteina.",
        medio: "Contenido moderado de proteina.",
        alto: "Contenido alto de proteina."
      },
      grasa: {
        bajo: "Contenido bajo de grasa.",
        medio: "Contenido moderado de grasa.",
        alto: "Contenido alto de grasa."
      },
      fibraCruda: {
        bajo: "Fibra baja.",
        medio: "Fibra moderada.",
        alto: "Fibra elevada."
      },
      humedad: {
        elevada: "Humedad elevada o dato que requiere revisar conservacion.",
        normal: "Humedad sin alerta general. Verificar segun tipo de alimento."
      }
    },
    umbralesEducativos: {
      proteinaCruda: { bajo: 12, alto: 22 },
      grasa: { bajo: 3, alto: 8 },
      fibraCruda: { bajo: 4, alto: 12 },
      humedad: { elevada: 14 }
    },
    posiblesUsos: ["mantenimiento", "crecimiento", "lactancia", "postura", "engorde", "mascotas"],
    advertencia: "Interpretacion educativa. No reemplaza analisis bromatologico ni formulacion profesional.",
    nota: "Los umbrales son generales para orientar la lectura; deben reemplazarse por tablas especificas cuando se integren las diapositivas."
  };

  window.NUTRICION_DATA_PARTS.etiquetasBalanceadoData = etiquetasBalanceadoData;
})();
