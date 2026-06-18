(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const weendeData = [
    {
      id: "humedad",
      nombre: "Humedad",
      abreviatura: "H",
      descripcion: "Fraccion de agua presente en el alimento.",
      queMide: "Contenido de agua del alimento.",
      formula: "%Humedad = 100 - %MS",
      importancia: "Permite valorar conservacion, concentracion de nutrientes y comparacion entre alimentos.",
      interpretacion: "A mayor humedad, menor concentracion de materia seca por kg de alimento fresco.",
      comoReconocer: "Forrajes verdes, ensilajes y alimentos humedos suelen presentar mayor humedad; confirmar con analisis.",
      metodologia: "Secado de muestra hasta peso constante; el PDF describe metodos a 95-100 C, 100-110 C o 135 +/- 2 C segun uso posterior."
    },
    {
      id: "materia_seca",
      nombre: "Materia seca",
      abreviatura: "MS",
      descripcion: "Fraccion del alimento que queda despues de retirar el agua.",
      queMide: "Nutrientes y componentes no acuosos del alimento.",
      formula: "%MS = peso muestra seca x 100 / peso muestra parcialmente seca",
      importancia: "Permite comparar alimentos en una misma base.",
      interpretacion: "A mayor materia seca, menor humedad del alimento.",
      comoReconocer: "Los alimentos secos suelen tener mayor concentracion de materia seca; forrajes verdes y ensilajes tienen mayor humedad.",
      metodologia: "Materia parcialmente seca: 60 a 65 C por 48 horas; materia seca: 105 a 110 C por 5 horas."
    },
    {
      id: "cenizas",
      nombre: "Cenizas",
      abreviatura: "CZ",
      descripcion: "Residuo mineral que queda luego de incinerar la muestra.",
      queMide: "Contenido mineral total aproximado.",
      formula: "%CEN = peso de ceniza x 100 x 100 / (peso de MPS x %MS)",
      importancia: "Orienta sobre carga mineral, contaminacion con tierra o inclusion de sales.",
      interpretacion: "Valores altos pueden reflejar minerales, sales o contaminacion; confirmar con analisis especifico.",
      comoReconocer: "No se reconoce de forma confiable a simple vista; revisar analisis proximal.",
      metodologia: "Pesar aprox. 2 g en crisol de porcelana, calcinar 5 horas a 550-600 C, enfriar y pesar."
    },
    {
      id: "proteina_cruda",
      nombre: "Proteina cruda",
      abreviatura: "PC",
      descripcion: "Estimacion del contenido proteico a partir del nitrogeno total.",
      queMide: "Nitrogeno convertido a proteina por factor analitico.",
      formula: "Metodo Kjeldahl: determina nitrogeno total sin diferenciar la forma de presentacion de la proteina bruta.",
      importancia: "Ayuda a valorar aporte proteico, aunque no sustituye perfil de aminoacidos ni digestibilidad.",
      interpretacion: "Mayor PC no siempre significa mejor calidad proteica.",
      comoReconocer: "Confirmar por etiqueta, analisis bromatologico o ficha tecnica."
    },
    {
      id: "extracto_etereo",
      nombre: "Extracto etereo",
      abreviatura: "EE",
      descripcion: "Fraccion grasa extraida por solvente.",
      queMide: "Grasas, aceites y otros compuestos solubles en eter.",
      formula: "Dato pendiente",
      importancia: "Indica densidad energetica y riesgo de rancidez.",
      interpretacion: "Un EE alto puede elevar energia, pero requiere control de calidad de grasas.",
      comoReconocer: "Materias primas grasas tienen textura oleosa; olores rancios alertan oxidacion.",
      metodologia: "Cuantifica sustancias extraibles en eter etilico: grasas, aceites, ceras, acidos organicos, pigmentos, esteroles y vitaminas liposolubles."
    },
    {
      id: "fibra_cruda",
      nombre: "Fibra cruda",
      abreviatura: "FC",
      descripcion: "Fraccion fibrosa aproximada del metodo Weende.",
      queMide: "Parte de componentes estructurales menos digestibles por el metodo clasico.",
      formula: "%FC = perdida de peso por incineracion x 100 x 100 / (peso de muestra antes de secarse y extraerse con eter x %MS)",
      importancia: "Orienta sobre fibra, volumen y digestibilidad.",
      interpretacion: "Valores altos pueden indicar menor densidad energetica en monogastricos; en rumiantes debe interpretarse con fibra efectiva.",
      comoReconocer: "Forrajes, henos y afrechos suelen aportar mas fibra que granos energeticos.",
      metodologia: "Muestra libre de humedad y grasa digerida con acido debil y luego base debil; el residuo se incinera."
    },
    {
      id: "eln",
      nombre: "Extracto libre de nitrogeno",
      abreviatura: "ELN",
      descripcion: "Fraccion calculada por diferencia que representa principalmente carbohidratos no fibrosos.",
      queMide: "Carbohidratos solubles o de reserva estimados por diferencia.",
      formula: "%ELN = 100 - (%Humedad + %Cenizas + %Proteina cruda + %Extracto etereo + %Fibra cruda)",
      importancia: "Ayuda a estimar fraccion energetica no fibrosa.",
      interpretacion: "Es un valor calculado; errores en otros componentes afectan el resultado. El PDF recalca que ELN y FC no son entidades quimicas definidas.",
      comoReconocer: "Se interpreta con analisis, no por observacion directa."
    }
  ];

  const weendeFormulas = {
    mps: "%MPS = peso de muestra parcialmente seca x 100 / peso de muestra humeda",
    ms: "%MS = peso de muestra seca x 100 / peso de muestra parcialmente seca",
    humedad: "%Humedad = 100 - %MS",
    eln: "%ELN = 100 - (%Humedad + %Cenizas + %Proteina cruda + %Extracto etereo + %Fibra cruda)",
    advertencia: "Calculos educativos. Verificar con analisis bromatologico y criterios profesionales."
  };

  window.NUTRICION_DATA_PARTS.weendeData = weendeData;
  window.NUTRICION_DATA_PARTS.weendeFormulas = weendeFormulas;
})();
