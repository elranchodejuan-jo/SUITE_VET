(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const digestionEspeciesData = [
    {
      id: "rumiantes",
      especie: "Rumiantes",
      tipoDigestivo: "Fermentador pregastrico",
      organos: ["Rumen", "Reticulo", "Omaso", "Abomaso"],
      nutrientesMejorAprovechados: ["Fibra", "Nitrogeno no proteico bajo criterio profesional", "Forrajes"],
      particularidad: "Aprovechan fibra mediante fermentacion microbiana ruminal.",
      riesgos: ["Acidosis ruminal", "Timpanismo", "Cetosis"],
      ejemplo: "La fibra efectiva estimula rumia y produccion de saliva."
    },
    {
      id: "aves",
      especie: "Aves",
      tipoDigestivo: "Monogastrico aviar",
      organos: ["Buche", "Proventriculo", "Molleja", "Intestino", "Ciegos"],
      nutrientesMejorAprovechados: ["Almidones", "Proteinas digestibles", "Grasas"],
      particularidad: "La molleja participa en molienda mecanica y la dieta debe considerar particula y etapa.",
      riesgos: ["Desequilibrios de calcio en postura", "Micotoxinas", "Exceso de fibra"],
      ejemplo: "La granulometria puede influir en consumo y funcionamiento de molleja."
    },
    {
      id: "cerdos",
      especie: "Cerdos",
      tipoDigestivo: "Monogastrico omnivoro",
      organos: ["Estomago", "Intestino delgado", "Ciego", "Colon"],
      nutrientesMejorAprovechados: ["Almidones", "Aminoacidos digestibles", "Grasas"],
      particularidad: "La formulacion depende mucho del perfil de aminoacidos y digestibilidad.",
      riesgos: ["Diarreas nutricionales", "Exceso de fibra", "Deficiencias de aminoacidos"],
      ejemplo: "Lisina y energia deben equilibrarse segun etapa de crecimiento."
    },
    {
      id: "equinos",
      especie: "Equinos",
      tipoDigestivo: "Fermentador postgastrico",
      organos: ["Estomago", "Intestino delgado", "Ciego", "Colon"],
      nutrientesMejorAprovechados: ["Fibra de buena calidad", "Forrajes", "Grasas con manejo adecuado"],
      particularidad: "Fermentan fibra en ciego y colon; cambios bruscos de dieta son riesgosos.",
      riesgos: ["Colico", "Laminitis asociada a dieta", "Disbiosis"],
      ejemplo: "El forraje debe ser base de la dieta y los cambios deben ser graduales."
    },
    {
      id: "caninos",
      especie: "Caninos",
      tipoDigestivo: "Monogastrico carnivoro facultativo",
      organos: ["Estomago", "Intestino delgado", "Colon"],
      nutrientesMejorAprovechados: ["Proteinas digestibles", "Grasas", "Carbohidratos procesados"],
      particularidad: "Requieren dietas completas segun etapa, tamano y condicion corporal.",
      riesgos: ["Obesidad", "Pancreatitis asociada a grasa", "Dietas caseras desbalanceadas"],
      ejemplo: "La etiqueta debe revisarse segun etapa: cachorro, adulto, senior o condicion clinica."
    },
    {
      id: "felinos",
      especie: "Felinos",
      tipoDigestivo: "Monogastrico carnivoro estricto",
      organos: ["Estomago", "Intestino delgado", "Colon"],
      nutrientesMejorAprovechados: ["Proteinas animales", "Grasas", "Aminoacidos esenciales especificos"],
      particularidad: "Tienen necesidades particulares de nutrientes como taurina; dato exacto pendiente.",
      riesgos: ["Deficiencias por dietas no formuladas", "Obesidad", "Baja ingesta de agua"],
      ejemplo: "La dieta debe estar formulada para felinos, no extrapolada de caninos."
    }
  ];

  window.NUTRICION_DATA_PARTS.digestionEspeciesData = digestionEspeciesData;
})();
