document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const panelGlosario = document.querySelector("#glosarioList");
  const inputBusqueda = document.querySelector("#searchGlosario");
  const selectSistema = document.querySelector("#glosarioSistema");
  const tabGlosario = document.querySelector('.fisio-tab[data-fisio="glosario"]');
  const paneGlosario = document.querySelector("#fisio-glosario");

  if (!panelGlosario) return; // por si esta vista no existe por algún motivo

  // URL EXACTA de la API que ya probaste en el navegador
  const API_GLOSARIO_BASE = "http://localhost:3000/api/glosario";

  // Mapa sistema → clase CSS para el borde
  const sistemaClassMap = {
    Urinario: "card-glosario-sistema-urinario",
    Digestivo: "card-glosario-sistema-digestivo",
    Respiratorio: "card-glosario-sistema-respiratorio",
    Cardiovascular: "card-glosario-sistema-cardiovascular",
    Neurológico: "card-glosario-sistema-neurologico",
    Dermatológico: "card-glosario-sistema-dermatologico",
    Sistémico: "card-glosario-sistema-sistemico",
  };

  // ----------- PETICIÓN A LA API -----------
  async function fetchGlosario(opciones = {}) {
    const params = new URLSearchParams();

    if (opciones.sistema) params.append("sistema", opciones.sistema);
    if (opciones.q) params.append("q", opciones.q);

    const url = params.toString()
      ? `${API_GLOSARIO_BASE}?${params.toString()}`
      : API_GLOSARIO_BASE;

    console.log("[Glosario] Llamando a:", url);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} al consultar el glosario clínico`);
    }

    const data = await res.json();
    console.log("[Glosario] Respuesta OK, términos recibidos:", data.length);
    return data;
  }

  // ----------- RENDER DE TARJETAS -----------
  function renderGlosario(lista) {
    if (!lista || lista.length === 0) {
      panelGlosario.innerHTML =
        "<p>No se encontraron términos para ese filtro.</p>";
      return;
    }

    const cards = lista.map((t) => {
      const termino = t.termino ?? "";
      const categoria = t.categoria_clinica ?? "";
      const sistema = t.sistema_corporal ?? "";
      const definicionSimple = t.definicion_simple ?? "";
      const definicionAvanzada = t.definicion_avanzada ?? "";
      const notas = t.notas_etimologicas ?? "";
      const palabrasClave = t.palabras_clave ?? "";

      // Clase adicional según sistema (para el borde)
      const sistemaClass = sistemaClassMap[sistema] || "";

      return `
        <article class="card-glosario ${sistemaClass}">
          <h3>${termino}</h3>
          <div class="card-glosario-meta">
            ${categoria ? `<span>${categoria}</span>` : ""}
            ${sistema ? `<span>${sistema}</span>` : ""}
          </div>
          <p><strong>Definición simple:</strong> ${definicionSimple}</p>
          ${
            definicionAvanzada || notas || palabrasClave
              ? `
          <details>
            <summary>Ver más detalles</summary>
            ${
              definicionAvanzada
                ? `<p><strong>Definición avanzada:</strong> ${definicionAvanzada}</p>`
                : ""
            }
            ${
              notas
                ? `<p><strong>Notas etimológicas:</strong> ${notas}</p>`
                : ""
            }
            ${
              palabrasClave
                ? `<p><strong>Palabras clave:</strong> ${palabrasClave}</p>`
                : ""
            }
          </details>`
              : ""
          }
        </article>
      `;
    });

        panelGlosario.innerHTML = cards.join("");

    // Después de renderizar, activamos comportamiento tipo acordeón:
    activarAccordionDetalles();
  }
    // Hace que solo un <details> del glosario pueda estar abierto a la vez
  function activarAccordionDetalles() {
    const detallesList = panelGlosario.querySelectorAll("details");
    if (!detallesList.length) return;

    detallesList.forEach((det) => {
      det.addEventListener("toggle", () => {
        // Solo actuamos cuando se ABRE
        if (!det.open) return;

        detallesList.forEach((otro) => {
          if (otro !== det && otro.open) {
            otro.open = false;
          }
        });
      });
    });
  }


  // ----------- FUNCIÓN PRINCIPAL -----------
  async function cargarGlosario() {
    try {
      panelGlosario.innerHTML = "<p>Cargando glosario clínico...</p>";

      const opciones = {
        sistema:
          selectSistema && selectSistema.value
            ? selectSistema.value
            : undefined,
        q:
          inputBusqueda && inputBusqueda.value.trim()
            ? inputBusqueda.value.trim()
            : undefined,
      };

      const datos = await fetchGlosario(opciones);
      renderGlosario(datos);
    } catch (err) {
      console.error("[Glosario] Error al cargar:", err);
      panelGlosario.innerHTML =
        "<p>Error al cargar el glosario clínico. Verifica que la API Node esté encendida (npm run dev) y que la URL http://localhost:3000/api/glosario funcione en el navegador.</p>";
    }
  }

  // ----------- EVENTOS DE FILTRO / BÚSQUEDA -----------

  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", () => {
      cargarGlosario();
    });
  }

  if (selectSistema) {
    selectSistema.addEventListener("change", () => {
      cargarGlosario();
    });
  }

  // Cargar SOLO cuando entras por primera vez al tab "Glosario clínico"
  let cargadoUnaVez = false;

  if (tabGlosario && paneGlosario) {
    tabGlosario.addEventListener("click", () => {
      if (!cargadoUnaVez) {
        cargarGlosario();
        cargadoUnaVez = true;
      }
    });
  } else {
    // Si por algún bug ya está visible al cargar, se podría llamar directo:
    // cargarGlosario();
  }
});
