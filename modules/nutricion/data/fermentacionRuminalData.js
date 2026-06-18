(function () {
  "use strict";

  window.NUTRICION_DATA_PARTS = window.NUTRICION_DATA_PARTS || {};

  const fermentacionRuminalData = [
    {
      id: "microbiota_ruminal",
      nombre: "Microbiota ruminal",
      tipo: "Ecosistema microbiano",
      origen: "Rumen",
      funcion: "Fermenta nutrientes, especialmente fibra y carbohidratos.",
      importancia: "Permite a rumiantes aprovechar forrajes, producir acidos grasos volatiles y proteina microbiana.",
      alerta: "Cambios bruscos de dieta pueden alterar el ecosistema ruminal."
    },
    {
      id: "carbohidratos_estructurales",
      nombre: "Carbohidratos estructurales",
      tipo: "Fibra",
      origen: "Pared celular vegetal",
      funcion: "Sostienen rumia, saliva y fermentacion de fibra.",
      importancia: "Promueven produccion de acetato y salud ruminal. Particulas grandes mayores a 4 mm estimulan rumia segun el material fuente.",
      alerta: "Dieta baja en fibra efectiva aumenta riesgo de acidosis."
    },
    {
      id: "carbohidratos_no_estructurales",
      nombre: "Carbohidratos no estructurales",
      tipo: "Almidones y azucares",
      origen: "Granos, melaza y concentrados",
      funcion: "Aportan energia rapidamente fermentable.",
      importancia: "Elevan densidad energetica de la dieta.",
      alerta: "Exceso o cambios bruscos favorecen acidosis ruminal."
    },
    {
      id: "agv",
      nombre: "Acidos grasos volatiles",
      tipo: "Producto de fermentacion",
      origen: "Fermentacion ruminal",
      funcion: "Fuente principal de energia para rumiantes.",
      importancia: "Incluyen acetato, propionato y butirato.",
      alerta: "El patron cambia segun fibra/concentrado."
    },
    {
      id: "acetato",
      nombre: "Acetato",
      tipo: "Acido graso volatil",
      origen: "Fermentacion de fibra",
      funcion: "Relacionado con sintesis de grasa lactea y energia.",
      importancia: "Predomina en dietas altas en forraje.",
      alerta: "Dietas muy bajas en fibra pueden reducir su produccion."
    },
    {
      id: "propionato",
      nombre: "Propionato",
      tipo: "Acido graso volatil",
      origen: "Fermentacion de carbohidratos no estructurales",
      funcion: "Precursor de glucosa en rumiantes.",
      importancia: "Aumenta con dietas mas concentradas.",
      alerta: "Debe balancearse con fibra para evitar trastornos."
    },
    {
      id: "butirato",
      nombre: "Butirato",
      tipo: "Acido graso volatil",
      origen: "Fermentacion ruminal",
      funcion: "Fuente energetica y apoyo al epitelio ruminal.",
      importancia: "El acido butirico estimula el desarrollo de papilas ruminales y se convierte en betahidroxibutirico en la pared ruminal.",
      alerta: "Dato pendiente"
    },
    {
      id: "metano",
      nombre: "Metano",
      tipo: "Gas ruminal",
      origen: "Fermentacion microbiana",
      funcion: "Producto de perdida energetica y emision ambiental.",
      importancia: "Depende de dieta, microbiota y manejo.",
      alerta: "Dato exacto pendiente de diapositivas o tablas."
    },
    {
      id: "ph_ruminal",
      nombre: "pH ruminal",
      tipo: "Indicador de ambiente ruminal",
      origen: "Balance entre fermentacion, saliva y dieta",
      funcion: "Condiciona microbiota y digestion de fibra.",
      importancia: "Depende de produccion de acido, capacidad tampon y eliminacion de protones por absorcion o flujo al tracto inferior.",
      alerta: "Valores exactos pendientes de fuente; no usar como diagnostico unico."
    },
    {
      id: "fibra_concentrado",
      nombre: "Relacion fibra/concentrado",
      tipo: "Balance dietario",
      origen: "Composicion de la racion",
      funcion: "Equilibra energia, rumia, pH y salud digestiva.",
      importancia: "Clave en produccion lechera y engorde.",
      alerta: "Cambios bruscos o exceso de concentrado aumentan riesgo de acidosis."
    },
    {
      id: "acidosis_ruminal",
      nombre: "Acidosis ruminal",
      tipo: "Trastorno nutricional",
      origen: "Exceso de carbohidratos rapidamente fermentables o baja fibra efectiva",
      funcion: "No aplica",
      importancia: "Puede afectar consumo, produccion, laminitis y salud general.",
      alerta: "Ante signos clinicos, consultar a un medico veterinario."
    }
  ];

  fermentacionRuminalData.push({
    id: "rumia",
    nombre: "Rumia",
    tipo: "Comportamiento ingestivo",
    origen: "Reticulo-rumen",
    funcion: "Regurgitacion, insalivacion, remasticacion y redeglucion del bolo.",
    importancia: "Reduce tamano de particula, aumenta saliva y favorece ambiente ruminal.",
    alerta: "Dietas blandas o altas en granos pueden reducir el tiempo de rumia; con alto grano puede ser cero."
  });

  fermentacionRuminalData.push({
    id: "ventajas_fermentacion",
    nombre: "Ventajas de la fermentacion ruminal",
    tipo: "Resumen",
    origen: "Microbiota ruminal",
    funcion: "Permite usar alimentos fibrosos, degradar celulosa, sintetizar proteina microbiana y vitaminas del complejo B si hay cobalto suficiente.",
    importancia: "El PDF indica que de 15 kg de materia seca consumida, cerca de 10 kg pueden degradarse y fermentarse por microorganismos ruminales.",
    alerta: "La eficiencia depende de dieta, ambiente ruminal y manejo."
  });

  window.NUTRICION_DATA_PARTS.fermentacionRuminalData = fermentacionRuminalData;
})();
