(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const reconocimientoBase = {
    color: "Dato pendiente",
    olor: "Dato pendiente",
    sabor: "Dato educativo. No se recomienda probar sustancias, suplementos o alimentos desconocidos.",
    textura: "Dato pendiente",
    presentacionComun: "Puede encontrarse en suplementos, premezclas, concentrados proteicos o ingredientes ricos en proteina.",
    identificacionPractica: "Reconocer principalmente por etiqueta, composicion nutricional, ficha tecnica o analisis de laboratorio.",
    advertencia: "No identificar aminoacidos por sabor u olor como metodo principal. Verificar etiqueta, ficha tecnica o analisis nutricional."
  };

  const aminoacidosData = [
    {
      id: "lisina",
      nombre: "Lisina",
      abreviatura: "Lys",
      letra: "K",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Bovinos"],
      funcion: "Participa en crecimiento, sintesis proteica y desarrollo muscular.",
      importanciaAnimales: "Aminoacido critico en produccion de carne, especialmente en monogastricos.",
      fuentes: ["Pasta de soya", "Harina de pescado", "Harinas animales"],
      deficiencia: "Bajo crecimiento, mala conversion alimenticia y menor desarrollo muscular.",
      observacion: "Importante en dietas de aves y cerdos por su relacion con ganancia de peso.",
      comoReconocer: {
        ...reconocimientoBase,
        presentacionComun: "Puede encontrarse en suplementos, premezclas o ingredientes proteicos.",
        fuentesPracticas: ["Pasta de soya", "Harina de pescado", "Harinas animales"]
      }
    },
    {
      id: "metionina",
      nombre: "Metionina",
      abreviatura: "Met",
      letra: "M",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Aporta azufre, participa en sintesis proteica, plumaje, pelo y metabolismo hepatico.",
      importanciaAnimales: "Suele ser limitante en aves; relevante para plumaje y produccion de huevo.",
      fuentes: ["Harina de pescado", "Harinas animales", "Suplementos de metionina"],
      deficiencia: "Crecimiento reducido, plumaje deficiente y menor desempeno productivo.",
      observacion: "Revisar siempre balance con cistina y proteina total.",
      comoReconocer: {
        ...reconocimientoBase,
        presentacionComun: "Suplementos cristalinos o premezclas. Dato exacto pendiente de diapositivas.",
        fuentesPracticas: ["Harina de pescado", "Premezclas", "Balanceados para aves"]
      }
    },
    {
      id: "treonina",
      nombre: "Treonina",
      abreviatura: "Thr",
      letra: "T",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Relacionada con sintesis proteica, mucinas intestinales e inmunidad de mucosas.",
      importanciaAnimales: "Importante para integridad intestinal y crecimiento.",
      fuentes: ["Pasta de soya", "Harina de pescado", "Suplementos"],
      deficiencia: "Menor crecimiento y posible compromiso de barrera intestinal.",
      observacion: "Puede ser relevante en dietas de alta eficiencia para monogastricos.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Ingredientes proteicos", "Premezclas", "Balanceados"]
      }
    },
    {
      id: "triptofano",
      nombre: "Triptofano",
      abreviatura: "Trp",
      letra: "W",
      tipo: "Esencial",
      especiesClave: ["Cerdos", "Aves", "Mascotas"],
      funcion: "Precursor de serotonina y niacina; participa en apetito, conducta y crecimiento.",
      importanciaAnimales: "Puede influir en consumo voluntario y bienestar en monogastricos.",
      fuentes: ["Pasta de soya", "Harina de pescado", "Proteinas animales"],
      deficiencia: "Bajo consumo, crecimiento reducido y cambios de conducta. Confirmar con evaluacion nutricional.",
      observacion: "La interpretacion debe considerar energia, proteina total y otros aminoacidos.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Pasta de soya", "Harina de pescado", "Premezclas"]
      }
    },
    {
      id: "arginina",
      nombre: "Arginina",
      abreviatura: "Arg",
      letra: "R",
      tipo: "Semi esencial",
      especiesClave: ["Aves", "Felinos", "Cerdos"],
      funcion: "Ciclo de la urea, inmunidad, crecimiento y metabolismo del nitrogeno.",
      importanciaAnimales: "Especialmente importante en aves y felinos por particularidades metabolicas.",
      fuentes: ["Harina de pescado", "Pasta de soya", "Harinas animales"],
      deficiencia: "Dato pendiente",
      observacion: "El PDF la destaca en aves por sintesis de hormonas, proteinas, poliaminas y oxido nitrico.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Ingredientes proteicos", "Suplementos", "Premezclas"]
      }
    },
    {
      id: "histidina",
      nombre: "Histidina",
      abreviatura: "His",
      letra: "H",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas", "Rumiantes"],
      funcion: "Participa en sintesis proteica, hemoglobina e histamina.",
      importanciaAnimales: "Puede ser relevante en crecimiento, sangre y produccion.",
      fuentes: ["Ingredientes proteicos", "Harina de pescado", "Pasta de soya"],
      deficiencia: "En broilers, el PDF relaciona su deficit con miopatias.",
      observacion: "Componente integral de tejidos, estimula secrecion digestiva de gastrina y posee propiedades antioxidantes.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Pasta de soya", "Harina de pescado", "Balanceados"]
      }
    },
    {
      id: "leucina",
      nombre: "Leucina",
      abreviatura: "Leu",
      letra: "L",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Aminoacido ramificado asociado a sintesis muscular y metabolismo energetico.",
      importanciaAnimales: "Importante para crecimiento y tejido muscular.",
      fuentes: ["Maiz", "Pasta de soya", "Harina de pescado"],
      deficiencia: "Dato pendiente",
      observacion: "En aves, el PDF agrupa leucina, isoleucina y valina como aminoacidos ramificados que intervienen en proteina de musculo e higado.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Maiz", "Pasta de soya", "Concentrados proteicos"]
      }
    },
    {
      id: "valina",
      nombre: "Valina",
      abreviatura: "Val",
      letra: "V",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Aminoacido ramificado relacionado con musculo, energia y sintesis proteica.",
      importanciaAnimales: "Relevante en dietas de alto desempeno para monogastricos.",
      fuentes: ["Pasta de soya", "Harina de pescado", "Harinas animales"],
      deficiencia: "Dato pendiente",
      observacion: "Balancear con otros aminoacidos ramificados.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Ingredientes proteicos", "Premezclas"]
      }
    },
    {
      id: "isoleucina",
      nombre: "Isoleucina",
      abreviatura: "Ile",
      letra: "I",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Aminoacido ramificado relacionado con sintesis de proteina en musculo e higado.",
      importanciaAnimales: "En aves se considera esencial junto con valina y leucina.",
      fuentes: ["Pasta de soya", "Harina de pescado", "Ingredientes proteicos"],
      deficiencia: "Dato pendiente",
      observacion: "Evaluar junto con valina y leucina.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Ingredientes proteicos", "Premezclas", "Balanceados"]
      }
    },
    {
      id: "fenilalanina",
      nombre: "Fenilalanina",
      abreviatura: "Phe",
      letra: "F",
      tipo: "Esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Participa en sintesis proteica y puede relacionarse con tirosina.",
      importanciaAnimales: "El PDF la incluye dentro de los aminoacidos esenciales; en aves, la tirosina puede sintetizarse a partir de fenilalanina.",
      fuentes: ["Ingredientes proteicos", "Harina de pescado", "Pasta de soya"],
      deficiencia: "Dato pendiente",
      observacion: "Dato especifico pendiente de tablas por especie.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Ingredientes proteicos", "Premezclas"]
      }
    },
    {
      id: "cisteina",
      nombre: "Cisteina",
      abreviatura: "Cys",
      letra: "C",
      tipo: "Semi esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Aminoacido azufrado relacionado con proteinas estructurales.",
      importanciaAnimales: "En aves se considera semi esencial y puede sintetizarse a partir de metionina.",
      fuentes: ["Proteinas animales", "Proteinas vegetales", "Harina de plumas hidrolizada"],
      deficiencia: "Dato pendiente",
      observacion: "Interpretar junto con metionina.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Ingredientes proteicos", "Premezclas"]
      }
    },
    {
      id: "tirosina",
      nombre: "Tirosina",
      abreviatura: "Tyr",
      letra: "Y",
      tipo: "Semi esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Participa en sintesis proteica y rutas metabolicas relacionadas con fenilalanina.",
      importanciaAnimales: "En aves se considera semi esencial y puede sintetizarse a partir de fenilalanina.",
      fuentes: ["Proteinas animales", "Proteinas vegetales", "Harina de plumas hidrolizada"],
      deficiencia: "Dato pendiente",
      observacion: "Interpretar junto con fenilalanina.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Ingredientes proteicos", "Premezclas"]
      }
    },
    {
      id: "glicina",
      nombre: "Glicina",
      abreviatura: "Gly",
      letra: "G",
      tipo: "No esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Participa en colageno, metabolismo del nitrogeno y sintesis de compuestos corporales.",
      importanciaAnimales: "Puede ser relevante en animales jovenes o dietas especificas.",
      fuentes: ["Harina de carne y hueso", "Gelatina", "Proteinas animales"],
      deficiencia: "Dato pendiente",
      observacion: "Aunque se clasifica como no esencial, su aporte puede importar segun etapa.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Harinas animales", "Ingredientes ricos en colageno"]
      }
    },
    {
      id: "glutamina",
      nombre: "Glutamina",
      abreviatura: "Gln",
      letra: "Q",
      tipo: "Semi esencial",
      especiesClave: ["Aves", "Cerdos", "Mascotas"],
      funcion: "Combustible para enterocitos y celulas inmunes; apoyo a mucosa intestinal.",
      importanciaAnimales: "Puede ser relevante en estres, crecimiento o recuperacion intestinal.",
      fuentes: ["Proteinas vegetales", "Proteinas animales", "Suplementos"],
      deficiencia: "Dato pendiente",
      observacion: "Su uso suplementario requiere criterio nutricional.",
      comoReconocer: {
        ...reconocimientoBase,
        fuentesPracticas: ["Suplementos", "Premezclas", "Ingredientes proteicos"]
      }
    }
  ];

  window.NUTRICION_DATA_PARTS.aminoacidosData = aminoacidosData;
})();
