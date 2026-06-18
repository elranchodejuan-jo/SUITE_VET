(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  function item(id, nombre, simbolo, tipo, funcion, fuentes, deficiencia, exceso, especiesSensibles, notaClinica, signosDeficiencia, signosExceso) {
    return {
      id,
      nombre,
      simbolo,
      tipo,
      funcion,
      fuentes,
      deficiencia,
      exceso,
      especiesSensibles,
      notaClinica,
      comoReconocer: {
        signosDeficiencia: signosDeficiencia || ["Dato pendiente"],
        signosExceso: signosExceso || ["Dato pendiente"],
        identificacionPractica: "Evaluar dieta, etapa productiva, signos clinicos, etiqueta y analisis cuando este disponible."
      }
    };
  }

  const vitaminasMineralesData = {
    vitaminasLiposolubles: [
      item(
        "vitamina_a",
        "Vitamina A",
        "A",
        "Vitamina liposoluble",
        "Vision, epitelios, reproduccion e inmunidad.",
        ["Forrajes verdes", "Premezclas", "Suplementos"],
        "Alteraciones visuales, piel/epitelios y baja respuesta inmune. Dato exacto pendiente.",
        "Riesgo de toxicidad por exceso de vitamina liposoluble. Dato exacto pendiente.",
        ["Aves", "Bovinos", "Mascotas"],
        "Importante en crecimiento, reproduccion y salud epitelial.",
        ["Problemas de vision", "Piel o mucosas alteradas", "Baja respuesta productiva"],
        ["Dato pendiente"]
      ),
      item(
        "vitamina_d",
        "Vitamina D",
        "D",
        "Vitamina liposoluble",
        "Metabolismo de calcio y fosforo, salud osea y mineralizacion.",
        ["Premezclas", "Exposicion solar", "Suplementos"],
        "Raquitismo, osteomalacia o problemas oseos. Confirmar con evaluacion profesional.",
        "Puede provocar alteraciones por exceso de calcio/fosforo. Dato exacto pendiente.",
        ["Animales jovenes", "Aves de postura", "Mascotas"],
        "Clave para hueso y produccion de huevo.",
        ["Debilidad", "Problemas oseos", "Crecimiento deficiente"],
        ["Dato pendiente"]
      ),
      item(
        "vitamina_e",
        "Vitamina E",
        "E",
        "Vitamina liposoluble",
        "Antioxidante y soporte de musculo, reproduccion e inmunidad.",
        ["Aceites vegetales", "Forrajes", "Premezclas"],
        "Trastornos musculares o reproductivos segun especie. Dato exacto pendiente.",
        "Dato pendiente",
        ["Rumiantes", "Aves", "Mascotas"],
        "Interpretar junto con selenio.",
        ["Debilidad muscular", "Problemas reproductivos", "Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "vitamina_k",
        "Vitamina K",
        "K",
        "Vitamina liposoluble",
        "Coagulacion sanguinea.",
        ["Forrajes", "Premezclas", "Sintesis microbiana segun especie"],
        "Problemas de coagulacion o sangrado. Dato exacto pendiente.",
        "Dato pendiente",
        ["Aves", "Mascotas", "Rumiantes"],
        "Relevante ante signos hemorragicos o interferencias dietarias.",
        ["Sangrados", "Coagulacion alterada"],
        ["Dato pendiente"]
      )
    ],
    vitaminasHidrosolubles: [
      item(
        "complejo_b",
        "Complejo B",
        "B",
        "Vitamina hidrosoluble",
        "Metabolismo energetico, sistema nervioso, piel, sangre y enzimas.",
        ["Premezclas", "Levaduras", "Ingredientes vegetales y animales"],
        "Signos variables segun vitamina B especifica.",
        "Dato pendiente",
        ["Monogastricos", "Rumiantes jovenes", "Mascotas"],
        "En rumiantes adultos puede existir sintesis microbiana, pero depende del contexto.",
        ["Bajo crecimiento", "Signos neurologicos", "Piel o pelaje alterado"],
        ["Dato pendiente"]
      ),
      item(
        "vitamina_c",
        "Vitamina C",
        "C",
        "Vitamina hidrosoluble",
        "Antioxidante y soporte de tejido conectivo e inmunidad.",
        ["Suplementos", "Algunos vegetales", "Sintesis endogena segun especie"],
        "Dato pendiente",
        "Dato pendiente",
        ["Cobayos", "Primates", "Mascotas en condiciones especificas"],
        "No todas las especies dependen igual del aporte dietario.",
        ["Dato pendiente"],
        ["Dato pendiente"]
      )
    ],
    macrominerales: [
      item(
        "calcio",
        "Calcio",
        "Ca",
        "Macromineral",
        "Formacion osea, contraccion muscular, coagulacion y produccion lactea.",
        ["Carbonato de calcio", "Harinas minerales", "Forrajes", "Lacteos"],
        "Problemas oseos, debilidad e hipocalcemia.",
        "Puede alterar la relacion calcio:fosforo.",
        ["Vacas lecheras", "Aves de postura", "Animales jovenes"],
        "Importante en lactancia y produccion de huevo.",
        ["Debilidad", "Problemas oseos", "Baja produccion"],
        ["Dato pendiente"]
      ),
      item(
        "fosforo",
        "Fosforo",
        "P",
        "Macromineral",
        "Hueso, energia celular y metabolismo.",
        ["Fosfatos", "Harinas animales", "Granos", "Premezclas"],
        "Problemas oseos, baja produccion o apetito alterado. Dato exacto pendiente.",
        "Desequilibrio calcio:fosforo y posible impacto ambiental por excrecion.",
        ["Rumiantes", "Aves", "Animales jovenes"],
        "Evaluar junto con calcio y disponibilidad.",
        ["Debilidad", "Crecimiento deficiente", "Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "sodio",
        "Sodio",
        "Na",
        "Macromineral",
        "Equilibrio electrolitico, transmision nerviosa y consumo.",
        ["Sal comun", "Sales minerales", "Premezclas"],
        "Bajo consumo, lamido, menor desempeno. Dato exacto pendiente.",
        "Exceso puede aumentar consumo de agua y riesgo por sales.",
        ["Aves", "Cerdos", "Rumiantes"],
        "Revisar junto con disponibilidad de agua.",
        ["Lamido", "Bajo consumo", "Dato pendiente"],
        ["Sed aumentada", "Dato pendiente"]
      ),
      item(
        "potasio",
        "Potasio",
        "K",
        "Macromineral",
        "Balance electrolitico, musculo y funcion celular.",
        ["Forrajes", "Sales minerales", "Ingredientes vegetales"],
        "Dato pendiente",
        "Dato pendiente",
        ["Rumiantes", "Equinos"],
        "Puede ser alto en algunos forrajes; interpretar con analisis.",
        ["Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "magnesio",
        "Magnesio",
        "Mg",
        "Macromineral",
        "Funcion neuromuscular, enzimas y metabolismo.",
        ["Oxido de magnesio", "Sales minerales", "Forrajes"],
        "Tetania o alteraciones neuromusculares en rumiantes. Dato exacto pendiente.",
        "Dato pendiente",
        ["Rumiantes en pastoreo", "Vacas lactantes"],
        "Relevante en sistemas pastoriles.",
        ["Temblor", "Debilidad", "Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "cloro",
        "Cloro",
        "Cl",
        "Macromineral",
        "Equilibrio acido-base y componente de acido gastrico.",
        ["Sal comun", "Sales minerales"],
        "Dato pendiente",
        "Dato pendiente",
        ["Aves", "Cerdos", "Rumiantes"],
        "Interpretar junto con sodio y potasio.",
        ["Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "azufre",
        "Azufre",
        "S",
        "Macromineral",
        "Componente de aminoacidos azufrados y metabolismo ruminal.",
        ["Forrajes", "Sulfatos", "Ingredientes proteicos"],
        "Dato pendiente",
        "Exceso puede ser riesgoso; dato exacto pendiente.",
        ["Rumiantes"],
        "Revisar con nitrogeno no proteico y agua.",
        ["Dato pendiente"],
        ["Dato pendiente"]
      )
    ],
    microminerales: [
      item(
        "hierro",
        "Hierro",
        "Fe",
        "Micromineral",
        "Hemoglobina, transporte de oxigeno y enzimas.",
        ["Sales minerales", "Harinas animales", "Suplementos"],
        "Anemia, debilidad y bajo crecimiento.",
        "Dato pendiente",
        ["Lechones", "Animales jovenes", "Mascotas"],
        "Relevante en anemia por deficiencia.",
        ["Palidez", "Debilidad", "Bajo crecimiento"],
        ["Dato pendiente"]
      ),
      item(
        "zinc",
        "Zinc",
        "Zn",
        "Micromineral",
        "Piel, pezuñas, inmunidad, enzimas y reproduccion.",
        ["Premezclas", "Sales minerales", "Ingredientes proteicos"],
        "Problemas de piel, pelo, pezuñas o crecimiento. Dato exacto pendiente.",
        "Dato pendiente",
        ["Cerdos", "Aves", "Mascotas", "Rumiantes"],
        "Evaluar con calidad de piel, casco/pezuna y dieta.",
        ["Dermatitis", "Pelo alterado", "Crecimiento deficiente"],
        ["Dato pendiente"]
      ),
      item(
        "cobre",
        "Cobre",
        "Cu",
        "Micromineral",
        "Pigmentacion, sangre, enzimas y sistema inmune.",
        ["Sales minerales", "Premezclas", "Forrajes"],
        "Anemia, despigmentacion o alteraciones oseas. Dato exacto pendiente.",
        "Toxicidad posible en especies sensibles.",
        ["Ovinos", "Bovinos", "Caprinos"],
        "Atencion especial en ovinos por sensibilidad al exceso.",
        ["Despigmentacion", "Debilidad", "Anemia"],
        ["Dato pendiente"]
      ),
      item(
        "selenio",
        "Selenio",
        "Se",
        "Micromineral",
        "Antioxidante junto con vitamina E y funcion muscular/inmune.",
        ["Sales minerales", "Premezclas", "Suplementos"],
        "Enfermedad muscular nutricional u otros signos segun especie.",
        "Margen de seguridad estrecho; dato exacto pendiente.",
        ["Rumiantes", "Equinos", "Aves"],
        "No suplementar sin criterio profesional.",
        ["Debilidad muscular", "Problemas reproductivos", "Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "yodo",
        "Yodo",
        "I",
        "Micromineral",
        "Sintesis de hormonas tiroideas.",
        ["Sal yodada", "Premezclas", "Fuentes marinas"],
        "Bocio o alteraciones metabolicas/reproductivas. Dato exacto pendiente.",
        "Dato pendiente",
        ["Rumiantes", "Aves", "Mascotas"],
        "Evaluar con funcion tiroidea y dieta.",
        ["Bocio", "Crecimiento deficiente", "Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "manganeso",
        "Manganeso",
        "Mn",
        "Micromineral",
        "Cartilago, hueso, reproduccion y enzimas.",
        ["Premezclas", "Sales minerales", "Ingredientes vegetales"],
        "Problemas oseos o reproductivos. Dato exacto pendiente.",
        "Dato pendiente",
        ["Aves", "Cerdos", "Rumiantes"],
        "Importante en crecimiento y reproduccion.",
        ["Problemas oseos", "Dato pendiente"],
        ["Dato pendiente"]
      ),
      item(
        "cobalto",
        "Cobalto",
        "Co",
        "Micromineral",
        "Relacionado con sintesis ruminal de vitamina B12.",
        ["Sales minerales", "Forrajes", "Premezclas"],
        "Baja produccion, anemia o perdida de condicion en rumiantes. Dato exacto pendiente.",
        "Dato pendiente",
        ["Rumiantes"],
        "Clave para metabolismo ruminal de B12.",
        ["Perdida de condicion", "Bajo crecimiento", "Dato pendiente"],
        ["Dato pendiente"]
      )
    ]
  };

  window.NUTRICION_DATA_PARTS.vitaminasMineralesData = vitaminasMineralesData;
})();
