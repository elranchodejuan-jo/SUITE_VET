// farma.js
// =============================================================================
// MÓDULO DE FARMACOLOGÍA Y TERAPÉUTICA - SUITE VET
// Conecta con CATTLE (Retiros) y CARTILLA DIGITAL (Dosis mascotas)
// =============================================================================

// 1. BASE DE DATOS DE FÁRMACOS
const farmacosDB = [
  // --- 1. OXITETRACICLINA ---
  {
    id: "oxitetraciclina-la",
    principio: "Oxitetraciclina",
    grupo: "Tetraciclina",
    grupoKey: "tetraciclina",
    concentracion: 200, // 200 mg/mL (20%)
    unidad: "mg/mL",
    mecanismo: "Bacteriostático. Inhibe síntesis proteica (30S).",
    especies: [
      {
        nombre: "Bovino (LA)",
        dosisMgKg: 20,
        via: "IM profunda",
        retiroCarne: 22,
        retiroLeche: 4, 
        nota: "Máximo 10 mL por sitio. Acción prolongada."
      },
      {
        nombre: "Porcino",
        dosisMgKg: 20,
        via: "IM",
        retiroCarne: 22,
        retiroLeche: 0,
        nota: "Útil en neumonías y leptospirosis."
      },
      {
        nombre: "Canino",
        dosisMgKg: 10,
        via: "IV lenta / IM",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Dolorosa IM. En cachorros mancha dientes. Se prefiere Doxiciclina."
      },
      {
        nombre: "Felino",
        dosisMgKg: 10,
        via: "IV lenta / IM",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Usar con precaución. Riesgo de fiebre y vómitos."
      }
    ],
    contraindicaciones: "Falla renal, gestación (2da mitad), animales jóvenes.",
    comerciales: ["Terramicina LA", "Emicina", "Oxitop"]
  },

  // --- 2. CEFTIOFUR ---
  {
    id: "ceftiofur-sodico",
    principio: "Ceftiofur",
    grupo: "Cefalosporina",
    grupoKey: "cefalosporina",
    concentracion: 50, // 50 mg/mL
    unidad: "mg/mL",
    mecanismo: "Bactericida. Pared celular. Resistente a betalactamasas.",
    especies: [
      {
        nombre: "Bovino",
        dosisMgKg: 2.2,
        via: "IM / SC",
        retiroCarne: 4,
        retiroLeche: 0, // ¡CERO HORAS!
        nota: "Ideal para pododermatitis y respiratorio sin descartar leche."
      },
      {
        nombre: "Porcino",
        dosisMgKg: 3,
        via: "IM",
        retiroCarne: 4,
        retiroLeche: 0,
        nota: "Enfermedad respiratoria bacteriana."
      },
      {
        nombre: "Canino",
        dosisMgKg: 2.2,
        via: "SC",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Uso en infecciones urinarias resistentes (Off-label)."
      },
      {
        nombre: "Felino",
        dosisMgKg: 4.4,
        via: "SC",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Infecciones de tejidos blandos."
      }
    ],
    contraindicaciones: "Alergia a betalactámicos.",
    comerciales: ["Excenel", "Cobactan", "Cefty"]
  },

  // --- 3. DEXAMETASONA ---
  {
    id: "dexametasona",
    principio: "Dexametasona",
    grupo: "Corticosteroide",
    grupoKey: "antiinflamatorio",
    concentracion: 2, // 2 mg/mL
    unidad: "mg/mL",
    mecanismo: "Antiinflamatorio esteroidal potente.",
    especies: [
      {
        nombre: "Bovino",
        dosisMgKg: 0.1,
        via: "IV / IM",
        retiroCarne: 8,
        retiroLeche: 3,
        nota: "Abortivo en último tercio de gestación."
      },
      {
        nombre: "Equino",
        dosisMgKg: 0.1,
        via: "IV / IM",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Riesgo de laminitis en uso prolongado."
      },
      {
        nombre: "Canino (Antiinflamatorio)",
        dosisMgKg: 0.1,
        via: "IV / IM / SC",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Dosis baja. No usar con AINEs."
      },
      {
        nombre: "Canino (Inmunosupresor)",
        dosisMgKg: 0.3,
        via: "IV / IM / PO",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Dosis alta para alergias graves o autoinmunes."
      },
      {
        nombre: "Felino",
        dosisMgKg: 0.1,
        via: "IV / IM / SC",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Vigilar diabetes transitoria."
      }
    ],
    contraindicaciones: "Diabetes, úlceras, sarna demodécica, gestación.",
    comerciales: ["Dexa-2", "Azium", "Cortiprex"]
  },

  // --- 4. IVERMECTINA ---
  {
    id: "ivermectina-1",
    principio: "Ivermectina 1%",
    grupo: "Lactona Macrocíclica",
    grupoKey: "antiparasitario",
    concentracion: 10, // 10 mg/mL
    unidad: "mg/mL",
    mecanismo: "Parálisis del parásito (Cl- glutamato).",
    especies: [
      {
        nombre: "Bovino",
        dosisMgKg: 0.2,
        via: "Subcutánea",
        retiroCarne: 35,
        retiroLeche: 28,
        nota: "Ardor al aplicar. Control parásitos internos/externos."
      },
      {
        nombre: "Porcino",
        dosisMgKg: 0.3,
        via: "Subcutánea",
        retiroCarne: 28,
        retiroLeche: 0,
        nota: "Específico para sarna sarcóptica."
      },
      {
        nombre: "Canino (Sarna)",
        dosisMgKg: 0.4,
        via: "SC / Oral",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "⚠️ PELIGRO MORTAL en Collies/Pastores (MDR1). Confirmar seguridad."
      },
      {
        nombre: "Canino (Prev. Gusano Corazón)",
        dosisMgKg: 0.006,
        via: "Oral",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Dosis micro mensual. Segura para todas las razas."
      }
    ],
    contraindicaciones: "Razas sensibles (MDR1), cachorros < 6 semanas.",
    comerciales: ["Ivomec", "Bovimec", "Iverfull"]
  },

  // --- 5. MELOXICAM ---
  {
    id: "meloxicam",
    principio: "Meloxicam",
    grupo: "AINE",
    grupoKey: "antiinflamatorio",
    concentracion: 5, // Asumimos 5 mg/mL (Grandes)
    unidad: "mg/mL",
    mecanismo: "Inhibe COX-2 preferencialmente. Analgésico y antipirético.",
    especies: [
      {
        nombre: "Bovino",
        dosisMgKg: 0.5,
        via: "SC / IV",
        retiroCarne: 15,
        retiroLeche: 5,
        nota: "Excelente en mastitis y diarreas."
      },
      {
        nombre: "Porcino",
        dosisMgKg: 0.4,
        via: "IM",
        retiroCarne: 5,
        retiroLeche: 0,
        nota: "Síndrome MMA."
      },
      {
        nombre: "Equino",
        dosisMgKg: 0.6,
        via: "IV / Oral",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Cólico y dolor musculoesquelético."
      },
      {
        nombre: "Canino (Inicial)",
        dosisMgKg: 0.2,
        via: "SC / IV / Oral",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Dosis de carga día 1."
      }
    ],
    contraindicaciones: "Úlceras, fallo renal/hepático, deshidratación.",
    comerciales: ["Metacam", "Meloxivet", "Meloxi-Jet"]
  },

  // --- 6. XILACINA ---
  {
    id: "xilacina-2",
    principio: "Xilacina 2%",
    grupo: "Sedante Alfa-2",
    grupoKey: "anestesico",
    concentracion: 20, // 20 mg/mL
    unidad: "mg/mL",
    mecanismo: "Sedación, relajación muscular, analgesia.",
    especies: [
      {
        nombre: "Bovino",
        dosisMgKg: 0.05, // ¡Dosis muy baja!
        via: "IM / IV",
        retiroCarne: 3,
        retiroLeche: 2,
        nota: "⚠️ EXTREMA SENSIBILIDAD. Usar 1/10 dosis equina."
      },
      {
        nombre: "Equino",
        dosisMgKg: 1.1,
        via: "IV",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Sedación estándar. Produce ataxia."
      },
      {
        nombre: "Canino",
        dosisMgKg: 1.1,
        via: "IM / IV",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Efecto emético (vómito). Usar con atropina."
      },
      {
        nombre: "Felino",
        dosisMgKg: 1.1,
        via: "IM / SC",
        retiroCarne: 0,
        retiroLeche: 0,
        nota: "Induce vómito fuertemente."
      }
    ],
    contraindicaciones: "Cardiópatas, obstrucción respiratoria, gestación avanzada.",
    comerciales: ["Rompun", "Procin", "Sedalvet"]
  }
];

// 2. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  initFarmaUI();
});

function initFarmaUI() {
  const contenedor = document.getElementById("farmaCards");
  const searchInput = document.getElementById("searchFarma");

  // Si no existe la vista en el HTML, no hacemos nada
  if (!contenedor) return;

  // Render inicial
  renderFarmacos(contenedor, "");

  // Buscador
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const texto = e.target.value.toLowerCase().trim();
      renderFarmacos(contenedor, texto);
    });
  }
}

// 3. RENDERIZADO Y CALCULADORA
function renderFarmacos(contenedor, texto) {
  contenedor.innerHTML = "";

  const filtrados = farmacosDB.filter((f) => {
    const blob = (
      f.principio + " " +
      f.grupo + " " +
      f.comerciales.join(" ")
    ).toLowerCase();
    return !texto || blob.includes(texto);
  });

  if (filtrados.length === 0) {
    contenedor.innerHTML = `<p class="cards-empty">No se encontraron fármacos con ese nombre.</p>`;
    return;
  }

  filtrados.forEach((f) => {
    const card = document.createElement("article");
    // Clase dinámica para el color del borde según grupo
    const grupoClass = f.grupoKey ? `card-antibio-${f.grupoKey}` : "";
    card.className = `card card-farma ${grupoClass}`;

    // --- HEADER ---
    const header = document.createElement("header");
    header.className = "card-header";
    header.innerHTML = `
      <h3 class="card-title">${f.principio}</h3>
      <span class="pill pill-tipo">${f.grupo}</span>
    `;

    // --- BODY ---
    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `
      <p><strong>Concentración:</strong> ${f.concentracion} ${f.unidad}</p>
      <p><strong>Mecanismo:</strong> ${f.mecanismo}</p>
      <p><strong>Comerciales:</strong> <span style="color:#9ca3af; font-style:italic;">${f.comerciales.join(", ")}</span></p>
      <p style="margin-top:5px; font-size:0.8rem; color:#f87171;"><strong>Contraindicaciones:</strong> ${f.contraindicaciones}</p>
    `;

    // --- AREA DE CALCULADORA ---
    const calcArea = document.createElement("div");
    calcArea.className = "farma-calc-area";
    calcArea.style.marginTop = "1rem";
    calcArea.style.paddingTop = "0.8rem";
    calcArea.style.borderTop = "1px dashed #374151";

    // Generar opciones del select de especies
    const optionsEspecies = f.especies
      .map((e, idx) => `<option value="${idx}">${e.nombre}</option>`)
      .join("");

    calcArea.innerHTML = `
      <div style="display:flex; gap:10px; align-items:flex-end;">
          <div style="flex:1;">
              <label style="font-size:0.75rem; color:#9ca3af; display:block; margin-bottom:4px;">Especie / Indicación</label>
              <select class="farma-select-especie micro-select" style="width:100%;">${optionsEspecies}</select>
          </div>
          <div style="flex:1;">
              <label style="font-size:0.75rem; color:#9ca3af; display:block; margin-bottom:4px;">Peso (kg)</label>
              <input type="number" class="farma-input-peso" placeholder="0" style="width:100%; padding:0.4rem; border-radius:8px; border:1px solid #1f2937; background:#020617; color:white;">
          </div>
      </div>
      
      <div class="farma-resultado" style="margin-top:10px; font-size:0.9rem; background:#111827; padding:10px; border-radius:8px; display:none;">
      </div>
    `;

    // Lógica de cálculo
    const selectEsp = calcArea.querySelector(".farma-select-especie");
    const inputPeso = calcArea.querySelector(".farma-input-peso");
    const divRes = calcArea.querySelector(".farma-resultado");

    const calcular = () => {
      const idx = selectEsp.value;
      const peso = parseFloat(inputPeso.value);

      if (!peso || peso <= 0) {
        divRes.style.display = "none";
        return;
      }

      const datosEspecie = f.especies[idx];
      const dosisTotalMg = peso * datosEspecie.dosisMgKg;
      // Fórmula: DosisTotal / Concentración
      const mlAplicar = dosisTotalMg / f.concentracion;

      // Texto de retiros
      const textoRetiro = `🥩 Carne: ${datosEspecie.retiroCarne} días | 🥛 Leche: ${datosEspecie.retiroLeche} días`;

      divRes.style.display = "block";
      divRes.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
            <strong style="color:#4ade80; font-size:1.2rem;">${mlAplicar.toFixed(2)} mL</strong>
            <span class="pill" style="font-size:0.7rem;">${datosEspecie.via}</span>
        </div>
        
        <div style="font-size:0.75rem; color:#f87171; margin-bottom:8px; border:1px solid #7f1d1d; background:#450a0a; padding:4px; border-radius:4px;">
            ${textoRetiro}
        </div>

        <p style="font-size:0.75rem; color:#9ca3af; margin-bottom:8px;"><em>"${datosEspecie.nota}"</em></p>
        
        <button type="button" class="btn btn-apple-secondary btn-sm" style="width:100%; justify-content:center;" id="btn-add-${f.id}-${idx}">
           ➕ Agregar a Receta
        </button>
      `;

      // Listener del botón Agregar
      // Usamos setTimeout para asegurar que el botón existe en el DOM
      setTimeout(() => {
        const btnAdd = divRes.querySelector(`#btn-add-${f.id}-${idx}`);
        if (btnAdd) {
          btnAdd.onclick = () => {
            if (window.Recetario) {
              window.Recetario.agregarItem(
                f,
                `${mlAplicar.toFixed(2)} mL`,
                datosEspecie.via,
                datosEspecie.nombre,
                textoRetiro
              );
            } else {
              alert("El módulo de Recetario no está cargado. Revisa recetario.js");
            }
          };
        }
      }, 0);
    };

    selectEsp.addEventListener("change", calcular);
    inputPeso.addEventListener("input", calcular);

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(calcArea);
    contenedor.appendChild(card);
  });
}