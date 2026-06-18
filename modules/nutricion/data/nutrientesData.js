(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const nutrientesData = [
    {
      id: "carbohidratos",
      nombre: "Carbohidratos",
      tipo: "Macronutriente energetico",
      funcion: "Principal fuente de energia.",
      energiaPorGramoKcal: 4,
      funcionesPdf: ["Energetica", "Metabolismo lipidico", "Desintoxicacion"],
      clasificacion: {
        simples: "Glucosa, sacarosa y otros azucares de absorcion rapida.",
        complejos: "Almidon y fibra; moleculas grandes que se degradan mas lentamente."
      },
      fuentes: ["Maiz", "Cereales", "Melaza", "Forrajes"],
      rumiantes: "Son fermentados en el rumen y producen acidos grasos volatiles.",
      monogastricos: "Se digieren principalmente como azucares simples en el intestino.",
      deficiencia: "Baja energia disponible y perdida de condicion corporal.",
      exceso: "Riesgo de obesidad o alteraciones digestivas segun especie.",
      recomendacionPdf: "El PDF cita como referencia general que 50-55% del total diario de calorias puede consistir en hidratos de carbono; ajustar por especie.",
      notaClinica: "En rumiantes, el exceso de carbohidratos rapidamente fermentables puede favorecer acidosis ruminal.",
      comoReconocer: {
        color: "Variable segun la fuente.",
        olor: "Variable segun la materia prima.",
        textura: "Los granos suelen ser duros; la melaza es viscosa.",
        identificacionPractica: "Revisar etiqueta, composicion bromatologica o analisis proximal."
      }
    },
    {
      id: "proteinas",
      nombre: "Proteinas",
      tipo: "Macronutriente estructural y funcional",
      funcion: "Aportan aminoacidos para tejidos, enzimas, hormonas y produccion.",
      energiaPorGramoKcal: 4,
      funcionesPdf: [
        "Estructurales: piel, pelo, musculo, cascos y pezuñas",
        "Metabolicas: enzimas, hormonas y anticuerpos",
        "Transporte y almacenamiento: hemoglobina y mioglobina",
        "Fuente de energia"
      ],
      aminoacidosEsencialesPdf: ["Isoleucina", "Leucina", "Lisina", "Metionina", "Fenilalanina", "Treonina", "Triptofano", "Valina", "Histidina en animales jovenes"],
      fuentes: ["Pasta de soya", "Harina de pescado", "Harinas animales", "Forrajes leguminosos"],
      rumiantes: "La proteina puede degradarse en rumen o pasar al intestino segun su fraccion.",
      monogastricos: "La calidad depende del perfil de aminoacidos y digestibilidad.",
      deficiencia: "Bajo crecimiento, perdida muscular, baja produccion y mala respuesta inmune.",
      exceso: "Mayor carga nitrogenada y posible desperdicio nutricional.",
      notaClinica: "Interpretar proteina cruda junto con energia, aminoacidos y etapa productiva.",
      comoReconocer: {
        color: "Variable segun ingrediente.",
        olor: "Olores rancios o putrefactos sugieren mala conservacion en fuentes animales.",
        textura: "Harinas y tortas proteicas suelen presentarse molidas o granuladas.",
        identificacionPractica: "Confirmar por etiqueta, analisis proximal y ficha tecnica."
      }
    },
    {
      id: "lipidos",
      nombre: "Lipidos / grasas",
      tipo: "Macronutriente energetico concentrado",
      funcion: "Aportan energia, acidos grasos esenciales y ayudan a absorber vitaminas liposolubles.",
      energiaPorGramoKcal: 9,
      caracteristicasPdf: ["Insolubles en agua", "Solubles en solventes organicos", "Unidad estructural: trigliceridos"],
      funcionesPdf: ["Membrana celular", "Almacenamiento y transporte de combustible metabolico", "Proteccion", "Hormonas", "Prostaglandinas y esteroides"],
      fuentes: ["Aceite vegetal", "Grasas animales", "Semillas oleaginosas", "Harina de pescado"],
      rumiantes: "El exceso de grasa puede afectar fermentacion ruminal; dato exacto pendiente.",
      monogastricos: "Mejoran densidad energetica y palatabilidad cuando se usan adecuadamente.",
      deficiencia: "Problemas de piel, pelo, crecimiento o energia segun especie.",
      exceso: "Riesgo de rancidez, diarrea, obesidad o alteracion digestiva.",
      notaClinica: "Olor rancio puede indicar oxidacion de grasas.",
      comoReconocer: {
        color: "Variable segun aceite o grasa fuente.",
        olor: "Olor rancio indica posible oxidacion.",
        textura: "Aceites liquidos o grasas solidas/semisolidas.",
        identificacionPractica: "Revisar frescura, etiqueta y almacenamiento."
      }
    },
    {
      id: "vitaminas",
      nombre: "Vitaminas",
      tipo: "Micronutriente organico",
      funcion: "Regulan metabolismo, inmunidad, vision, coagulacion, piel y reproduccion.",
      fuentes: ["Premezclas", "Forrajes verdes", "Ingredientes animales", "Suplementos"],
      rumiantes: "Algunas vitaminas pueden sintetizarse por microbiota, pero no todas ni en todas las etapas.",
      monogastricos: "Dependen mas de aporte dietario y premezclas balanceadas.",
      deficiencia: "Signos variables: piel, crecimiento, vision, reproduccion o inmunidad.",
      exceso: "Mayor riesgo con vitaminas liposolubles; dato exacto pendiente.",
      notaClinica: "No suplementar a ciegas cuando hay riesgo de toxicidad.",
      comoReconocer: {
        color: "Las premezclas pueden tener color variable por excipientes.",
        olor: "Variable; olores extranos pueden indicar mala conservacion.",
        textura: "Polvos, granulos, liquidos o mezclas.",
        identificacionPractica: "Identificar por etiqueta, lote, fecha y ficha tecnica."
      }
    },
    {
      id: "minerales",
      nombre: "Minerales",
      tipo: "Micronutriente inorganico",
      funcion: "Participan en hueso, contraccion muscular, equilibrio electrolitico, enzimas e inmunidad.",
      fuentes: ["Sales minerales", "Carbonato de calcio", "Fosfatos", "Forrajes", "Premezclas"],
      rumiantes: "Importantes en crecimiento, lactancia, reproduccion y equilibrio ruminal.",
      monogastricos: "La disponibilidad depende de fuente, fitatos, especie y balance dietario.",
      deficiencia: "Debilidad, problemas oseos, baja produccion o signos especificos por mineral.",
      exceso: "Puede causar toxicidad o antagonismos minerales.",
      notaClinica: "La relacion calcio:fosforo y antagonismos deben evaluarse profesionalmente.",
      comoReconocer: {
        color: "Sales minerales pueden variar por fuente y aditivos.",
        olor: "Generalmente neutro; olor anormal sugiere contaminacion.",
        textura: "Polvos, granulados, bloques o sales.",
        identificacionPractica: "Confirmar por etiqueta, composicion garantizada y analisis mineral."
      }
    },
    {
      id: "agua",
      nombre: "Agua",
      tipo: "Nutriente esencial",
      funcion: "Transporte, termorregulacion, digestion, metabolismo y produccion.",
      fuentes: ["Agua de bebida", "Forrajes verdes", "Alimentos humedos"],
      rumiantes: "Consumo aumenta con materia seca, lactancia, sales, proteina y calor.",
      monogastricos: "La restriccion reduce consumo de alimento, desempeno y bienestar.",
      deficiencia: "Deshidratacion, baja produccion, menor consumo y riesgo clinico.",
      exceso: "Dato pendiente",
      notaClinica: "La calidad del agua es tan importante como la cantidad.",
      comoReconocer: {
        color: "Debe ser clara para consumo; cambios de color requieren evaluacion.",
        olor: "Olores anormales sugieren contaminacion.",
        textura: "No aplica.",
        identificacionPractica: "Evaluar disponibilidad, limpieza de bebederos y analisis de agua cuando sea posible."
      }
    }
  ];

  window.NUTRICION_DATA_PARTS.nutrientesData = nutrientesData;
})();
