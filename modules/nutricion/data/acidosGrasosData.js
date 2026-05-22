(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const acidosGrasosData = [
    {
      id: "acido_palmitico",
      nombre: "Acido palmitico",
      estructura: "Dato pendiente",
      tipo: "Saturado",
      familia: "Dato pendiente",
      fuentes: ["Grasas animales", "Aceites vegetales"],
      funcion: "Aporta energia y forma parte de lipidos corporales.",
      usoNutricional: "Fuente energetica dentro de grasas y aceites.",
      especiesImportantes: ["Aves", "Cerdos", "Rumiantes", "Mascotas"],
      comoReconocer: {
        presentacionComun: "Presente en grasas y aceites.",
        color: "Variable segun fuente.",
        olor: "Olor rancio puede indicar oxidacion.",
        textura: "Asociado a materias primas grasas.",
        alerta: "Evitar grasas con moho, suciedad u olor rancio."
      }
    },
    {
      id: "acido_estearico",
      nombre: "Acido estearico",
      estructura: "Dato pendiente",
      tipo: "Saturado",
      familia: "Dato pendiente",
      fuentes: ["Grasas animales", "Sebos", "Algunas grasas vegetales"],
      funcion: "Aporte energetico y componente de grasas.",
      usoNutricional: "Dato pendiente",
      especiesImportantes: ["Aves", "Cerdos", "Rumiantes"],
      comoReconocer: {
        presentacionComun: "Presente en grasas solidas o semisolidas.",
        color: "Variable.",
        olor: "Dato pendiente; olores rancios son alerta de calidad.",
        textura: "Puede asociarse a grasas mas firmes.",
        alerta: "Verificar frescura y almacenamiento."
      }
    },
    {
      id: "acido_oleico",
      nombre: "Acido oleico",
      estructura: "Dato pendiente",
      tipo: "Monoinsaturado",
      familia: "Omega 9",
      fuentes: ["Aceite de oliva", "Grasas animales", "Aceites vegetales"],
      funcion: "Aporta energia y participa en estructuras celulares.",
      usoNutricional: "Fuente lipidica dentro de ingredientes grasos.",
      especiesImportantes: ["Caninos", "Felinos", "Aves", "Cerdos"],
      comoReconocer: {
        presentacionComun: "Presente en aceites y grasas.",
        color: "Variable segun el aceite o grasa fuente.",
        olor: "Variable segun fuente y grado de rancidez.",
        textura: "Generalmente asociado a fuentes oleosas o grasas.",
        alerta: "Olores rancios pueden indicar oxidacion de grasas."
      }
    },
    {
      id: "acido_linoleico",
      nombre: "Acido linoleico",
      estructura: "Dato pendiente",
      tipo: "Poliinsaturado",
      familia: "Omega 6",
      fuentes: ["Aceite de maiz", "Aceite de soya", "Aceites vegetales"],
      funcion: "Acido graso esencial relacionado con piel, pelo y membranas.",
      usoNutricional: "Aporte de omega 6 en dietas de monogastricos y mascotas.",
      especiesImportantes: ["Caninos", "Felinos", "Aves", "Cerdos"],
      comoReconocer: {
        presentacionComun: "Presente en aceites vegetales y grasas de dietas comerciales.",
        color: "Variable.",
        olor: "Aceites rancios pierden calidad.",
        textura: "Liquida en aceites.",
        alerta: "Proteger de luz, calor y oxidacion."
      }
    },
    {
      id: "acido_linolenico",
      nombre: "Acido linolenico",
      estructura: "Dato pendiente",
      tipo: "Poliinsaturado",
      familia: "Omega 3",
      fuentes: ["Aceite de linaza", "Forrajes verdes", "Algunas semillas"],
      funcion: "Precursor de compuestos omega 3 y soporte de membranas.",
      usoNutricional: "Aporte de omega 3 de origen vegetal.",
      especiesImportantes: ["Mascotas", "Equinos", "Rumiantes", "Aves"],
      comoReconocer: {
        presentacionComun: "Aceites o semillas oleaginosas.",
        color: "Variable.",
        olor: "Rancidez es alerta de mala conservacion.",
        textura: "Oleosa si esta en aceite.",
        alerta: "Los poliinsaturados son sensibles a oxidacion."
      }
    },
    {
      id: "epa",
      nombre: "EPA",
      estructura: "Dato pendiente",
      tipo: "Poliinsaturado",
      familia: "Omega 3",
      fuentes: ["Aceite de pescado", "Fuentes marinas"],
      funcion: "Relacionado con modulacion inflamatoria y salud de membranas.",
      usoNutricional: "Suplementacion especifica cuando esta indicada.",
      especiesImportantes: ["Caninos", "Felinos", "Equinos"],
      comoReconocer: {
        presentacionComun: "Capsulas, aceites o suplementos marinos.",
        color: "Variable segun producto.",
        olor: "Olor fuerte a pescado puede ser normal; olor rancio es alerta.",
        textura: "Aceite liquido o capsulas.",
        alerta: "Usar productos rotulados y conservar segun indicacion."
      }
    },
    {
      id: "dha",
      nombre: "DHA",
      estructura: "Dato pendiente",
      tipo: "Poliinsaturado",
      familia: "Omega 3",
      fuentes: ["Aceite de pescado", "Fuentes marinas", "Algunas algas"],
      funcion: "Relacionado con sistema nervioso, retina y membranas celulares.",
      usoNutricional: "Interes en etapas de desarrollo y dietas especificas.",
      especiesImportantes: ["Caninos", "Felinos", "Aves", "Cerdos"],
      comoReconocer: {
        presentacionComun: "Aceites, capsulas o premezclas.",
        color: "Variable.",
        olor: "Olor rancio indica oxidacion.",
        textura: "Oleosa o encapsulada.",
        alerta: "No usar suplementos sin etiqueta o vencidos."
      }
    }
  ];

  window.NUTRICION_DATA_PARTS.acidosGrasosData = acidosGrasosData;
})();
