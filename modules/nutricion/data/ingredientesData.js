(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  function ingrediente(id, nombre, categoria, especies, riesgos, observaciones, comoReconocer) {
    return {
      id,
      nombre,
      categoria,
      materiaSeca: null,
      proteinaCruda: null,
      fibraCruda: null,
      extractoEtereo: null,
      energia: null,
      costoKg: null,
      especiesRecomendadas: especies,
      limiteInclusion: "Dato pendiente",
      riesgos,
      observaciones,
      comoReconocer
    };
  }

  const calidadBase = ["Moho", "Humedad elevada", "Olor rancio", "Presencia de insectos", "Material extraño"];

  const ingredientesData = [
    ingrediente("maiz", "Maiz", "Energetico", ["Aves", "Cerdos", "Bovinos"], ["Exceso de almidon en rumiantes"], "Ingrediente energetico comun.", {
      color: "Amarillo a dorado, segun variedad.",
      olor: "Caracteristico de grano seco; olor a moho indica mala conservacion.",
      textura: "Grano duro o molido, segun presentacion.",
      sabor: "Dato educativo. No probar alimentos desconocidos o contaminados.",
      alertaCalidad: calidadBase
    }),
    ingrediente("pasta_soya", "Pasta de soya", "Proteico", ["Aves", "Cerdos", "Bovinos", "Mascotas"], ["Factores antinutricionales si no esta correctamente procesada"], "Fuente proteica vegetal de uso amplio.", {
      color: "Crema a marron claro, variable.",
      olor: "Caracteristico; olor rancio o mohoso es alerta.",
      textura: "Harina o pellet.",
      sabor: "Dato educativo. No degustar materias primas desconocidas.",
      alertaCalidad: calidadBase
    }),
    ingrediente("afrecho", "Afrecho", "Fibroso", ["Bovinos", "Equinos", "Cerdos"], ["Variabilidad nutricional", "Rancidez si esta mal almacenado"], "Subproducto fibroso y energetico variable.", {
      color: "Marron claro a beige.",
      olor: "Cereal/fibra; moho o rancidez son alerta.",
      textura: "Particulas fibrosas finas.",
      sabor: "Dato educativo. No probar alimentos sospechosos.",
      alertaCalidad: calidadBase
    }),
    ingrediente("melaza", "Melaza", "Energetico", ["Bovinos", "Ovinos", "Caprinos"], ["Exceso puede alterar consumo o fermentacion"], "Fuente palatable de azucares.", {
      color: "Marron oscuro.",
      olor: "Dulce caracteristico; fermentado anormal es alerta.",
      textura: "Viscosa y pegajosa.",
      sabor: "Dulce como dato educativo; no se recomienda probar productos de origen desconocido.",
      alertaCalidad: ["Fermentacion anormal", "Contaminacion", "Envase sucio"]
    }),
    ingrediente("harina_pescado", "Harina de pescado", "Proteico", ["Aves", "Cerdos", "Mascotas"], ["Rancidez", "Olor intenso", "Variabilidad de calidad"], "Fuente proteica animal y mineral.", {
      color: "Marron claro a oscuro.",
      olor: "Marino caracteristico; olor putrefacto o rancio es alerta.",
      textura: "Harina fina o granulada.",
      sabor: "Dato educativo. No degustar materias primas.",
      alertaCalidad: calidadBase
    }),
    ingrediente("palmiste", "Palmiste", "Fibroso", ["Bovinos", "Ovinos", "Caprinos"], ["Variabilidad de fibra y grasa"], "Subproducto agroindustrial con aporte fibroso.", {
      color: "Marron.",
      olor: "Caracteristico; rancio indica mala conservacion.",
      textura: "Harina o pellet fibroso.",
      sabor: "Dato educativo. No probar alimentos desconocidos.",
      alertaCalidad: calidadBase
    }),
    ingrediente("alfalfa", "Alfalfa", "Fibroso", ["Bovinos", "Equinos", "Conejos", "Pequeños rumiantes"], ["Moho", "Polvo", "Desequilibrio mineral si se usa sin formular"], "Forraje leguminoso de buena calidad cuando esta bien conservado.", {
      color: "Verde en buen estado; amarillo o negro indica deterioro.",
      olor: "Vegetal fresco o heno agradable; moho es alerta.",
      textura: "Hojas y tallos secos o frescos.",
      sabor: "Dato educativo. No probar forrajes sospechosos.",
      alertaCalidad: ["Moho", "Polvo excesivo", "Humedad", "Material extraño"]
    }),
    ingrediente("pasto_saboya", "Pasto Saboya", "Fibroso", ["Bovinos", "Equinos", "Pequeños rumiantes"], ["Baja calidad si esta sobremaduro"], "Forraje tropical de uso comun.", {
      color: "Verde si fresco; amarillento si seco o maduro.",
      olor: "Vegetal; olor a fermentacion o moho es alerta.",
      textura: "Hojas y tallos fibrosos.",
      sabor: "Dato educativo. No probar forraje desconocido.",
      alertaCalidad: ["Moho", "Tierra", "Exceso de tallo", "Contaminacion"]
    }),
    ingrediente("heno", "Heno", "Fibroso", ["Bovinos", "Equinos", "Pequeños rumiantes"], ["Moho", "Polvo", "Baja palatabilidad si esta deteriorado"], "Forraje conservado seco.", {
      color: "Verde a amarillo segun calidad y especie.",
      olor: "Agradable a forraje seco; moho indica riesgo.",
      textura: "Seca y fibrosa.",
      sabor: "Dato educativo. No probar henos sospechosos.",
      alertaCalidad: ["Moho", "Polvo", "Humedad", "Calentamiento"]
    }),
    ingrediente("ensilaje", "Ensilaje", "Fibroso", ["Bovinos", "Pequeños rumiantes"], ["Mala fermentacion", "Moho", "Micotoxinas"], "Forraje fermentado que requiere buen manejo de conservacion.", {
      color: "Verde oliva a marron claro segun material.",
      olor: "Acido agradable; putrefacto o butirico es alerta.",
      textura: "Humeda y picada.",
      sabor: "Dato educativo. No probar ensilajes.",
      alertaCalidad: ["Moho", "Olor putrefacto", "Exceso de humedad", "Calentamiento"]
    }),
    ingrediente("carbonato_calcio", "Carbonato de calcio", "Mineral", ["Aves", "Bovinos", "Cerdos"], ["Desequilibrio calcio:fosforo"], "Fuente mineral de calcio.", {
      color: "Blanco a gris claro.",
      olor: "Generalmente neutro.",
      textura: "Polvo o granulado.",
      sabor: "Dato educativo. No probar suplementos minerales.",
      alertaCalidad: ["Humedad", "Terrones", "Contaminacion"]
    }),
    ingrediente("sal_mineral", "Sal mineral", "Mineral", ["Bovinos", "Pequeños rumiantes", "Equinos"], ["Exceso de sal", "Desequilibrios minerales", "Riesgo si falta agua"], "Mezcla mineral para suplementacion.", {
      color: "Variable segun composicion.",
      olor: "Generalmente neutro.",
      textura: "Polvo, granulo o bloque.",
      sabor: "Salado como dato educativo; no probar suplementos.",
      alertaCalidad: ["Humedad", "Terrones", "Etiqueta ausente", "Contaminacion"]
    }),
    ingrediente("aceite_vegetal", "Aceite vegetal", "Energetico", ["Aves", "Cerdos", "Mascotas", "Bovinos"], ["Rancidez", "Exceso de grasa"], "Fuente de energia concentrada y acidos grasos.", {
      color: "Amarillo a dorado, variable.",
      olor: "Caracteristico; rancio indica oxidacion.",
      textura: "Liquida y oleosa.",
      sabor: "Dato educativo. No probar aceites desconocidos.",
      alertaCalidad: ["Rancidez", "Envase sucio", "Exposicion a calor", "Sedimentos anormales"]
    }),
    ingrediente("harina_carne_hueso", "Harina de carne y hueso", "Proteico", ["Aves", "Cerdos", "Mascotas"], ["Restricciones sanitarias segun pais", "Rancidez", "Variabilidad mineral"], "Fuente proteica y mineral animal; revisar normativa local.", {
      color: "Marron a grisaceo.",
      olor: "Animal caracteristico; putrefacto o rancio es alerta.",
      textura: "Harina o granulado.",
      sabor: "Dato educativo. No degustar harinas animales.",
      alertaCalidad: calidadBase
    })
  ];

  const limitesPerrosAdultos = {
    maiz: "Como cereal dentro de 35-75% de la racion para perros adultos segun ejemplo del PDF.",
    pasta_soya: "Expeler de soya 0-15% en perros adultos.",
    afrecho: "Salvado de trigo 0-20% en perros adultos.",
    harina_pescado: "0-10% en perros adultos.",
    aceite_vegetal: "0-10% en perros adultos.",
    harina_carne_hueso: "Harina de carne 15-35% en perros adultos; verificar si la materia prima incluye hueso y normativa local."
  };

  ingredientesData.forEach((item) => {
    if (limitesPerrosAdultos[item.id]) {
      item.limitesPorEspecie = { perrosAdultos: limitesPerrosAdultos[item.id] };
      item.limiteInclusion = limitesPerrosAdultos[item.id];
    }
  });

  window.NUTRICION_DATA_PARTS.ingredientesData = ingredientesData;
})();
