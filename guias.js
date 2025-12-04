// guias.js
document.addEventListener("DOMContentLoaded", () => {
  const printPrep = document.getElementById("printPrep");
  if (!printPrep) return;

  const microGuiaConfig = {
    agares: {
      titulo: "Guía rápida de medios sólidos (Agares)",
      subtitulo: "Preparación básica, uso y buenas prácticas.",
      shortLabel: "agares",
      objetivo:
        "Ofrecer una referencia rápida para la preparación y uso correcto de agares en prácticas de microbiología veterinaria.",
      usos: [
        "Cultivo de bacterias en placa para observación de colonias.",
        "Aislamiento de microorganismos a partir de muestras clínicas.",
        "Pruebas de pureza y control de contaminación."
      ],
      tips: [
        "Disolver el medio completamente antes de llevar al autoclave.",
        "Servir las placas a ~50 °C para evitar condensación excesiva.",
        "Marcar siempre el fondo de la placa con nombre del medio, fecha y muestra."
      ],
      errores: [
        "Dejar grumos por mala disolución del agar.",
        "Servir el medio demasiado caliente y agrietar las placas.",
        "No invertir las placas durante incubación, generando gotas que arrastran colonias."
      ]
    },
    caldos: {
      titulo: "Guía rápida de medios líquidos (Caldos)",
      subtitulo: "Enriquecimiento, transporte y pruebas en tubo.",
      shortLabel: "caldos",
      objetivo:
        "Resumir el uso de caldos como medios de enriquecimiento, transporte y observación de crecimiento microbiano.",
      usos: [
        "Enriquecimiento previo de bacterias de muestras poco concentradas.",
        "Pruebas bioquímicas en tubo (por ejemplo, producción de gas, turbidez).",
        "Conservación temporal de cepas en refrigeración."
      ],
      tips: [
        "Respetar los volúmenes por tubo para mantener la relación oxígeno/medio.",
        "Evitar agitar en exceso caldos con fase de superficie (anillos, películas).",
        "Registrar siempre tiempo y temperatura de incubación."
      ],
      errores: [
        "Llenar demasiado los tubos e impedir intercambio gaseoso.",
        "Reutilizar tubos contaminados sin esterilización adecuada.",
        "No mezclar suavemente antes de leer turbidez o sedimento."
      ]
    },
    pruebas: {
      titulo: "Guía rápida de Pruebas Bioquímicas",
      subtitulo: "Lectura, tiempos críticos y control de calidad.",
      shortLabel: "pruebas bioquímicas",
      objetivo:
        "Guiar la correcta interpretación y manejo de pruebas bioquímicas para identificación bacteriana.",
      usos: [
        "Identificación presuntiva de bacterias entéricas y no entéricas.",
        "Confirmación de resultados obtenidos en medios diferenciales.",
        "Construcción de perfiles bioquímicos comparables con tablas de referencia."
      ],
      tips: [
        "Respetar estrictamente los tiempos de lectura recomendados para cada prueba.",
        "Utilizar siempre un control positivo y uno negativo cuando sea posible.",
        "Registrar resultados de forma ordenada inmediatamente después de leer."
      ],
      errores: [
        "Leer demasiado tarde y confundir reacciones revertidas.",
        "Contaminar tubos al usar ansas o agujas sin flambar correctamente.",
        "No homogenizar el tubo antes de leer cambios de color o precipitados."
      ]
    },
    siembras: {
      titulo: "Guía rápida de tipos de siembra en placa",
      subtitulo: "Aislamiento, estriado y distribución uniforme.",
      shortLabel: "tipos de siembra",
      objetivo:
        "Resumir las principales técnicas de siembra en placa para obtener cultivos útiles y legibles.",
      usos: [
        "Obtención de colonias aisladas por estriado en cuadrantes.",
        "Recuento estimado de colonias por siembra en superficie o vertido.",
        "Pruebas de sensibilidad (base para antibiogramas en disco)."
      ],
      tips: [
        "Trabajar siempre cerca de la llama o en cabina para reducir contaminación.",
        "Enfriar el asa unos segundos antes de tocar el inóculo.",
        "Mantener la tapa de la placa semiabierta el menor tiempo posible."
      ],
      errores: [
        "Cruzar demasiadas veces por el mismo sector y perder el aislamiento.",
        "Tocar el borde de la placa con el asa contaminada.",
        "No mezclar bien la dilución antes de sembrar en técnicas de recuento."
      ]
    },
    antibiogramas: {
      titulo: "Guía rápida de preparación de antibiogramas",
      subtitulo: "Estandarización del inóculo y lectura de halos.",
      shortLabel: "antibiogramas",
      objetivo:
        "Proporcionar una referencia rápida para estandarizar la preparación y lectura de antibiogramas por difusión en disco.",
      usos: [
        "Evaluación de la sensibilidad de bacterias frente a distintos antibióticos.",
        "Apoyo a la selección racional de terapias antimicrobianas en clínica veterinaria.",
        "Monitoreo de patrones de resistencia en un laboratorio."
      ],
      tips: [
        "Ajustar el inóculo a una turbidez similar a 0.5 McFarland antes de sembrar.",
        "Sembrar toda la superficie del agar de forma uniforme (tres pasadas con giro de 60°).",
        "Colocar los discos a distancia adecuada y presionarlos ligeramente para asegurar contacto."
      ],
      errores: [
        "Usar un inóculo demasiado concentrado o demasiado diluido.",
        "Incubar a temperaturas o tiempos distintos a los recomendados.",
        "Medir halos de inhibición de forma imprecisa o sin regla milimetrada."
      ]
    }
  };

  function renderMicroGuide(tipo) {
    const cfg = microGuiaConfig[tipo];
    if (!cfg) return;

    const now = new Date();
    const fecha = now.toLocaleDateString("es-EC");
    const hora = now.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const usosHtml = cfg.usos.map((u) => `<li>${u}</li>`).join("");
    const tipsHtml = cfg.tips.map((t) => `<li>${t}</li>`).join("");
    const erroresHtml = cfg.errores.map((e) => `<li>${e}</li>`).join("");

    printPrep.innerHTML = `
      <article class="micro-guide">
        <header class="micro-guide-header">
          <div>
            <h1 class="micro-guide-title">${cfg.titulo}</h1>
            <p class="micro-guide-subtitle">${cfg.subtitulo}</p>
          </div>
          <div class="micro-guide-meta">
            <p>SUITE VET · Módulo de Microbiología</p>
            <p>${fecha} · ${hora}</p>
          </div>
        </header>

        <section class="micro-guide-body">
          <div class="micro-guide-col">
            <h2>Objetivo de la guía</h2>
            <p>${cfg.objetivo}</p>

            <h2>Usos principales</h2>
            <ul>
              ${usosHtml}
            </ul>
          </div>

          <div class="micro-guide-col">
            <h2>Tips rápidos</h2>
            <ul>
              ${tipsHtml}
            </ul>

            <h2>Errores frecuentes</h2>
            <ul>
              ${erroresHtml}
            </ul>
          </div>
        </section>

        <footer class="micro-guide-footer">
          <div class="micro-guide-notes">
            Notas del laboratorio (observaciones propias):
          </div>
          <div class="micro-guide-qr">
            <div class="micro-guide-qr-box">
              Aquí irá el QR hacia la calculadora de ${cfg.shortLabel}
            </div>
          </div>
        </footer>
      </article>
    `;

    window.print();
  }

  const buttonMap = [
    ["btn-print-agares", "agares"],
    ["btn-print-caldos", "caldos"],
    ["btn-print-pruebas", "pruebas"],
    ["btn-print-siembras", "siembras"],
    ["btn-print-antibiogramas", "antibiogramas"]
  ];

  buttonMap.forEach(([id, tipo]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => renderMicroGuide(tipo));
    }
  });
});
