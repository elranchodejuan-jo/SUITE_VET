(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const secciones = [
    {
      id: "aprender",
      titulo: "Aprender",
      descripcion: "Tarjetas educativas sobre nutrientes, aminoacidos, vitaminas, minerales y digestion animal.",
      estado: "Disponible",
      icono: "book-open",
      submodulos: ["aminoacidos", "nutrientes", "acidos-grasos", "vitaminas-minerales", "digestion", "fermentacion-ruminal"]
    },
    {
      id: "calcular",
      titulo: "Calcular",
      descripcion: "Herramientas orientativas para analisis proximal, materia seca, agua y lectura de etiquetas.",
      estado: "Beta",
      icono: "calculator",
      submodulos: ["weende", "materia-seca", "eln", "base-fresca-seca", "agua", "etiquetas"]
    },
    {
      id: "formular",
      titulo: "Formular",
      descripcion: "Ingredientes, comparaciones, raciones simples y costos de alimentacion.",
      estado: "Beta",
      icono: "scale",
      submodulos: ["ingredientes", "comparador", "formulacion", "costo-kg", "costo-animal"]
    },
    {
      id: "clinica",
      titulo: "Clinica nutricional",
      descripcion: "Trastornos, deficiencias, excesos, signos y recomendaciones preventivas por especie.",
      estado: "Fusionable",
      icono: "stethoscope",
      submodulos: ["trastornos", "deficiencias", "excesos", "signos", "prevencion", "recomendaciones"]
    }
  ];

  const submodulos = [
    {
      id: "aminoacidos",
      titulo: "Aminoacidos",
      categoria: "Aprender",
      estado: "Disponible",
      descripcion: "Tarjetas educativas de aminoacidos, siglas, letras, tipo, funcion nutricional y reconocimiento.",
      icono: "dna"
    },
    {
      id: "nutrientes",
      titulo: "Nutrientes principales",
      categoria: "Aprender",
      estado: "Disponible",
      descripcion: "Carbohidratos, proteinas, lipidos, vitaminas, minerales y agua con enfoque por especie.",
      icono: "layers"
    },
    {
      id: "acidos-grasos",
      titulo: "Acidos grasos",
      categoria: "Aprender",
      estado: "Disponible",
      descripcion: "Saturados, insaturados y familias omega con fuentes y alertas de calidad.",
      icono: "droplets"
    },
    {
      id: "vitaminas-minerales",
      titulo: "Vitaminas y minerales",
      categoria: "Aprender",
      estado: "Disponible",
      descripcion: "Micronutrientes separados en liposolubles, hidrosolubles, macro y microminerales.",
      icono: "sparkles"
    },
    {
      id: "digestion",
      titulo: "Digestión por especie",
      categoria: "Aprender",
      estado: "Disponible",
      descripcion: "Comparacion de rumiantes, aves, cerdos, equinos, caninos y felinos.",
      icono: "route"
    },
    {
      id: "fermentacion-ruminal",
      titulo: "Fermentacion ruminal",
      categoria: "Aprender",
      estado: "Disponible",
      descripcion: "Microbiota, fibra, AGV, pH, metano, fibra/concentrado y acidosis.",
      icono: "activity"
    },
    {
      id: "weende",
      titulo: "Analisis proximal de Weende",
      categoria: "Calcular",
      estado: "Disponible",
      descripcion: "Ficha educativa y calculadora de MPS, MS, humedad y ELN.",
      icono: "flask"
    },
    {
      id: "materia-seca",
      titulo: "Materia seca y humedad",
      categoria: "Calcular",
      estado: "Beta",
      descripcion: "Calculadora rapida de materia seca, humedad y conversion de bases.",
      icono: "percent"
    },
    {
      id: "eln",
      titulo: "ELN",
      categoria: "Calcular",
      estado: "Beta",
      descripcion: "Extracto libre de nitrogeno por diferencia en el analisis proximal.",
      icono: "minus-square"
    },
    {
      id: "base-fresca-seca",
      titulo: "Base fresca / base seca",
      categoria: "Calcular",
      estado: "Beta",
      descripcion: "Conversion orientativa de nutrientes entre base fresca y base seca.",
      icono: "repeat"
    },
    {
      id: "agua",
      titulo: "Consumo de agua",
      categoria: "Calcular",
      estado: "Beta",
      descripcion: "Estimador educativo con factores de aumento y alertas de riesgo.",
      icono: "water"
    },
    {
      id: "etiquetas",
      titulo: "Interpretador de etiquetas",
      categoria: "Calcular",
      estado: "Beta",
      descripcion: "Lectura textual de proteina, grasa, fibra, humedad, cenizas, ELN y energia.",
      icono: "tag"
    },
    {
      id: "ingredientes",
      titulo: "Ingredientes y materias primas",
      categoria: "Formular",
      estado: "Disponible",
      descripcion: "Base inicial de materias primas con categoria, riesgos, observaciones y reconocimiento.",
      icono: "wheat"
    },
    {
      id: "comparador",
      titulo: "Comparador de alimentos",
      categoria: "Formular",
      estado: "Beta",
      descripcion: "Comparacion de 2 o 3 ingredientes usando la base independiente de materias primas.",
      icono: "columns"
    },
    {
      id: "formulacion",
      titulo: "Formulacion simple de raciones",
      categoria: "Formular",
      estado: "Beta",
      descripcion: "Inclusion porcentual, costo por kg y aportes estimados de nutrientes registrados.",
      icono: "pie-chart"
    },
    {
      id: "costo-kg",
      titulo: "Costo por kg de alimento",
      categoria: "Formular",
      estado: "Beta",
      descripcion: "Costo final por kilogramo a partir de ingredientes y porcentajes.",
      icono: "coins"
    },
    {
      id: "costo-animal",
      titulo: "Costo por animal/dia",
      categoria: "Formular",
      estado: "Disponible",
      descripcion: "Costo diario, semanal, mensual y por lote segun consumo y numero de animales.",
      icono: "wallet"
    },
    {
      id: "trastornos",
      titulo: "Trastornos nutricionales",
      categoria: "Clinica nutricional",
      estado: "Disponible",
      descripcion: "Tarjetas clinicas de deficiencias, excesos, desequilibrios y trastornos metabolicos.",
      icono: "alert-triangle"
    },
    {
      id: "deficiencias",
      titulo: "Deficiencias nutricionales",
      categoria: "Clinica nutricional",
      estado: "Fusionable",
      descripcion: "Vista filtrada de trastornos por carencias nutricionales.",
      icono: "trending-down"
    },
    {
      id: "excesos",
      titulo: "Excesos nutricionales",
      categoria: "Clinica nutricional",
      estado: "Fusionable",
      descripcion: "Vista filtrada de trastornos por exceso o toxicidad.",
      icono: "trending-up"
    },
    {
      id: "signos",
      titulo: "Signos clinicos asociados",
      categoria: "Clinica nutricional",
      estado: "Fusionable",
      descripcion: "Busqueda por signos clinicos asociados a alteraciones nutricionales.",
      icono: "list-plus"
    },
    {
      id: "prevencion",
      titulo: "Prevencion nutricional",
      categoria: "Clinica nutricional",
      estado: "Proximamente",
      descripcion: "Checklist preventivo por etapa productiva y especie.",
      icono: "shield"
    },
    {
      id: "recomendaciones",
      titulo: "Recomendaciones por especie",
      categoria: "Clinica nutricional",
      estado: "Proximamente",
      descripcion: "Orientaciones generales por especie. Pendiente de tablas y diapositivas fuente.",
      icono: "clipboard-list"
    }
  ];

  window.NUTRICION_DATA_PARTS.submodulosNutricion = { secciones, submodulos };
})();
