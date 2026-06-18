// =============================================================================
// SUITE VET 2.0 - modules/farma/farma.js
// Farmacologia reorganizada en submodulos sin romper flujo existente.
// =============================================================================

(function () {
  "use strict";

  const STORAGE_CUSTOM = "suitevet_farma_custom_drugs_v1";
  const STORAGE_HISTORY = "suitevet_farma_history_v1";

  const FREE_DOSE_UNIT_OPTIONS = [
    "mg/kg",
    "ug/kg",
    "UI/kg",
    "mL/kg",
    "mg/animal",
    "ug/animal",
    "UI/animal",
    "mL/animal",
    "g/kg",
    "mg",
    "ug",
    "UI",
    "mL",
    "Otro"
  ];

  const FREE_CONC_UNIT_OPTIONS = [
    "mg/mL",
    "ug/mL",
    "UI/mL",
    "mg/tableta",
    "UI/tableta",
    "mg/g",
    "%",
    "g/100 mL",
    "mL/mL",
    "Otro"
  ];

  const WITHDRAWAL_TYPES = ["Carne", "Leche", "Huevos", "Miel", "General"];

  const WITHDRAWAL_STATUS_OPTIONS = [
    { value: "dias", label: "Indicar dias" },
    { value: "no_aplica", label: "No aplica" },
    { value: "no_especificado", label: "No especificado" }
  ];

  const CLINICAL_OBSERVATION_TEMPLATES = {
    contraindicaciones: [
      "Contraindicado en pacientes con hipersensibilidad al principio activo.",
      "Evitar en pacientes con dano hepatico severo.",
      "Evitar en pacientes con dano renal severo.",
      "No administrar en pacientes con insuficiencia cardiaca grave.",
      "No administrar en pacientes con ulceras gastrointestinales activas.",
      "No administrar en animales deshidratados severamente.",
      "No administrar durante la gestacion.",
      "No administrar durante la lactancia.",
      "No usar en neonatos.",
      "No usar en geriatricos sin evaluacion clinica previa.",
      "No aplicar en perros.",
      "No aplicar en gatos.",
      "No aplicar en bovinos.",
      "No aplicar en caprinos.",
      "No aplicar en ovinos.",
      "No aplicar en porcinos.",
      "No aplicar en equinos.",
      "No aplicar en aves.",
      "No combinar con AINEs.",
      "No combinar con corticoides.",
      "No combinar con otros farmacos nefrotoxicos.",
      "No combinar con otros farmacos hepatotoxicos.",
      "No usar en animales destinados a consumo humano sin establecer tiempo de retiro.",
      "Contraindicado si existe reaccion adversa previa al medicamento."
    ],
    precauciones: [
      "Usar con precaucion en pacientes con dano renal.",
      "Usar con precaucion en pacientes con dano hepatico.",
      "Usar con precaucion en pacientes con problemas cardiacos.",
      "Usar con precaucion en pacientes con problemas gastrointestinales.",
      "Usar con precaucion en animales deshidratados.",
      "Usar con precaucion en gestantes.",
      "Usar con precaucion durante la lactancia.",
      "Usar con precaucion en neonatos.",
      "Usar con precaucion en geriatricos.",
      "Ajustar dosis segun condicion clinica del paciente.",
      "Evaluar funcion renal antes de administrar.",
      "Evaluar funcion hepatica antes de administrar.",
      "Vigilar signos de toxicidad.",
      "Vigilar vomito, diarrea, anorexia o decaimiento.",
      "Puede requerir ajuste del intervalo de administracion.",
      "Mantener hidratacion adecuada durante el tratamiento.",
      "Verificar compatibilidad con otros medicamentos.",
      "Verificar tiempo de retiro en animales de produccion.",
      "Evitar sobredosificacion.",
      "Supervisar respuesta clinica durante el tratamiento.",
      "Suspender y reevaluar si aparecen reacciones adversas.",
      "Confirmar que la via de administracion seleccionada sea adecuada.",
      "Confirmar que la especie seleccionada sea compatible con el medicamento."
    ]
  };

  const CLINICAL_CONDITION_OPTIONS = [
    { key: "renal", label: "Dano renal", terms: ["dano renal", "renal", "nefrotoxico", "nefrotoxicos", "funcion renal", "insuficiencia renal"] },
    { key: "hepatico", label: "Dano hepatico", terms: ["dano hepatico", "hepatico", "hepatica", "hepatotoxico", "hepatotoxicos", "funcion hepatica", "insuficiencia hepatica"] },
    { key: "cardiaco", label: "Problemas cardiacos", terms: ["cardiaco", "cardiaca", "cardiacos", "cardiacas", "insuficiencia cardiaca", "corazon"] },
    { key: "gastrointestinal", label: "Problemas gastrointestinales", terms: ["gastrointestinal", "ulcera", "ulceras", "vomito", "diarrea", "anorexia"] },
    { key: "gestacion", label: "Gestacion", terms: ["gestacion", "gestante", "gestantes", "prenada", "prenez"] },
    { key: "lactancia", label: "Lactancia", terms: ["lactancia", "lactante", "lactantes"] },
    { key: "neonato", label: "Neonato", terms: ["neonato", "neonatos", "recien nacido"] },
    { key: "geriatrico", label: "Geriatrico", terms: ["geriatrico", "geriatricos", "edad avanzada"] },
    { key: "deshidratacion", label: "Deshidratacion", terms: ["deshidratado", "deshidratados", "deshidratacion", "hidratacion"] },
    { key: "condicion_baja", label: "Condicion corporal baja", terms: ["condicion corporal baja", "baja condicion", "caquexia", "debilitado"] },
    { key: "condicion_alta", label: "Condicion corporal alta", terms: ["condicion corporal alta", "obesidad", "sobrepeso"] },
    { key: "otra", label: "Otra condicion clinica", terms: [] }
  ];

  const INTERACTION_MESSAGES = {
    sinergismo:
      "Posible sinergismo: revise si la combinacion potencia el efecto terapeutico o la toxicidad.",
    antagonismo:
      "Posible antagonismo: esta combinacion podria disminuir la eficacia terapeutica.",
    precaucion:
      "Precaucion: evaluar especie, edad, estado renal, estado hepatico, gestacion y condicion clinica.",
    sin_alertas:
      "Sin alertas conocidas registradas, pero se recomienda verificar criterio clinico."
  };

  const SUBMODULES = [
    { id: "cargados", label: "Farmacos cargados" },
    { id: "libre", label: "Calculadora Libre" },
    { id: "personalizados", label: "Farmacos personalizados" },
    { id: "historial", label: "Historial" }
  ];

  const SPECIES_OPTIONS = [
    "Canino",
    "Felino",
    "Bovino",
    "Bufalino",
    "Equino",
    "Asnal",
    "Mular",
    "Porcino",
    "Ovino",
    "Caprino",
    "Camelido",
    "Cunicola",
    "Cobayo",
    "Aviar",
    "Piscicola",
    "Reptil",
    "Anfibio",
    "Fauna silvestre",
    "Exoticos"
  ];

  const ROUTE_OPTIONS = [
    { value: "IM", label: "IM (Intramuscular)" },
    { value: "IV", label: "IV (Intravenosa)" },
    { value: "SC", label: "SC/SQ (Subcutanea)" },
    { value: "ID", label: "ID (Intradermica)" },
    { value: "IP", label: "IP (Intraperitoneal)" },
    { value: "IA", label: "IA (Intraarticular)" },
    { value: "IO", label: "IO (Intraosea)" },
    { value: "IT", label: "IT (Intratecal)" },
    { value: "IN", label: "IN (Intranasal)" },
    { value: "VO", label: "VO/PO (Oral)" },
    { value: "SL", label: "SL (Sublingual)" },
    { value: "IR", label: "IR/PR (Rectal)" },
    { value: "Topica", label: "Topica" },
    { value: "Transdermica", label: "Transdermica" },
    { value: "Inhalatoria", label: "Inhalatoria / Nebulizada" },
    { value: "Oftalmica", label: "Oftalmica" },
    { value: "Otica", label: "Otica" },
    { value: "Intramamaria", label: "Intramamaria" },
    { value: "Intrauterina", label: "Intrauterina" },
    { value: "Intravaginal", label: "Intravaginal" },
    { value: "Implante", label: "Implante" }
  ];

  const MAX_PRODUCT_IMAGE_SIZE = 1800000;

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("farma-root");
    if (!root) return;

    const Cat = window.SuiteVet?.Categorias || null;
    if (!Cat) {
      console.warn("[Farma] shared/categorias.js no esta cargado. El modulo funcionara sin colores de categoria.");
    }

    const state = {
      farmacos: ((window.FARMA_DATA || {}).farmacos || []).slice(),
      cat: Cat,
      activeSubmodule: "cargados",

      loadedSearch: "",
      loadedCategory: "todas",

      freeForm: buildDefaultFreeForm(),
      freeAdvanced: buildDefaultAdvancedForm(),
      freeComponents: [],
      freeResult: null,
      freeAlerts: [],
      freeClinical: buildDefaultClinicalAnimalData(),
      freeClinicalAlerts: [],
      freeSaveMissing: [],
      freeSaveNotice: null,
      freePendingDuplicate: null,
      freeProcedureVisible: false,
      freeAdvancedVisible: false,
      freeLastHistoryId: "",
      clinicalObservationTarget: "",
      editingPersonalizedId: "",

      customItems: readStorageArray(STORAGE_CUSTOM),
      customCalcForms: {},
      customSearch: "",
      customFilterSpecies: "todas",
      customFilterGroup: "todas",
      customNotice: null,

      historyItems: readStorageArray(STORAGE_HISTORY),
      historySearch: "",
      historyFilterSpecies: "todas",
      historyFrom: "",
      historyTo: "",
      lastLoadedHistorySignature: ""
    };

    const customCompact = compactCustomItemsForStorage(state.customItems);
    state.customItems = customCompact.items;
    if (customCompact.compacted) {
      writeStorageArray(STORAGE_CUSTOM, state.customItems, { silent: true, replaceOnFail: true });
    }

    const historyCompact = compactLegacyHistorySnapshots(state.historyItems);
    state.historyItems = historyCompact.items;
    if (historyCompact.compacted) {
      writeStorageArray(STORAGE_HISTORY, state.historyItems, { silent: true, replaceOnFail: true });
    }

    root.innerHTML = `
      <section class="sv-module-shell farma-shell">
        <section class="sv-module-header">
          <h2>Farmacologia</h2>
          <p class="sv-view-intro">
            Vademecum veterinario con calculadoras y flujo integrado a recetario.
            Separa farmacos oficiales, calculadora libre, personalizados e historial.
          </p>
        </section>

        <div class="sv-module-subnav farma-subnav" id="farma-subnav" aria-label="Submodulos de Farmacologia"></div>

        <section class="farma-panel" id="farma-submodule-panel"></section>
      </section>
    `;

    const subnav = root.querySelector("#farma-subnav");
    const panel = root.querySelector("#farma-submodule-panel");

    renderSubnav(subnav, state);
    renderActiveSubmodule(panel, state);

    subnav?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-farma-submodule]");
      if (!btn) return;
      const next = btn.dataset.farmaSubmodule;
      if (!next || next === state.activeSubmodule) return;
      state.activeSubmodule = next;
      renderSubnav(subnav, state);
      renderActiveSubmodule(panel, state);
    });

    if (window.SuiteVet?.registerSearch) {
      window.SuiteVet.registerSearch("farma", (q) =>
        state.farmacos
          .filter((f) => `${f.principio} ${f.grupo} ${(f.comerciales || []).join(" ")}`.toLowerCase().includes(q))
          .map((f) => ({
            title: f.principio,
            subtitle: f.grupo,
            moduleId: "farma",
            action: () => {
              window.SuiteVet?.showView?.("farmacologia");
              state.activeSubmodule = "cargados";
              state.loadedSearch = f.principio;
              renderSubnav(subnav, state);
              renderActiveSubmodule(panel, state);
            }
          }))
      );
    }
  });

  function renderSubnav(container, state) {
    if (!container) return;
    container.innerHTML = SUBMODULES.map((item) => {
      const active = item.id === state.activeSubmodule ? "is-active" : "";
      return `
        <button class="sv-module-tab farma-subtab ${active}" type="button" data-farma-submodule="${item.id}">
          <strong>${escapeHtml(item.label)}</strong>
        </button>
      `;
    }).join("");
  }

  function renderActiveSubmodule(panel, state) {
    if (!panel) return;
    switch (state.activeSubmodule) {
      case "cargados":
        renderLoadedSubmodule(panel, state);
        return;
      case "libre":
        renderFreeCalculatorSubmodule(panel, state);
        return;
      case "personalizados":
        renderCustomDrugsSubmodule(panel, state);
        return;
      case "historial":
        renderHistorySubmodule(panel, state);
        return;
      default:
        panel.innerHTML = `<div class="sv-empty"><div class="sv-empty-icon">?</div>Submodulo no disponible.</div>`;
    }
  }

  // ---------------------------------------------------------------------------
  // SUBMODULO 1: FARMACOS CARGADOS (flujo existente)
  // ---------------------------------------------------------------------------
  function renderLoadedSubmodule(panel, state) {
    const categoriesUsed = new Set(state.farmacos.map((f) => f.categoria || f.grupoKey).filter(Boolean));

    panel.innerHTML = `
      <div class="farma-loaded-shell">
        <div class="sv-toolbar sv-module-toolbar">
          <input
            type="text"
            id="farma-search"
            class="sv-input"
            placeholder="Buscar por nombre, grupo o comercial..."
            style="max-width:360px;"
            autocomplete="off"
            value="${escapeAttr(state.loadedSearch)}"
          />
        </div>

        <div class="cat-chip-grid farma-chip-strip" id="farma-chips"></div>
        <div class="sv-grid" id="farma-lista"></div>
      </div>
    `;

    const searchInput = panel.querySelector("#farma-search");
    const chipsContainer = panel.querySelector("#farma-chips");
    const list = panel.querySelector("#farma-lista");

    renderLoadedCategoryChips(chipsContainer, state, categoriesUsed);
    renderLoadedCards(list, state);

    searchInput?.addEventListener("input", (event) => {
      state.loadedSearch = event.target.value || "";
      renderLoadedCards(list, state);
    });

    chipsContainer?.addEventListener("click", (event) => {
      const chip = event.target.closest(".cat-chip");
      if (!chip) return;
      state.loadedCategory = chip.dataset.cat || "todas";
      renderLoadedCategoryChips(chipsContainer, state, categoriesUsed);
      renderLoadedCards(list, state);
    });
  }

  function renderLoadedCategoryChips(container, state, categoriesUsed) {
    if (!container) return;

    const chips = [];
    chips.push(`
      <button class="cat-chip ${state.loadedCategory === "todas" ? "is-active" : ""}" data-cat="todas" type="button">
        <span>Todas</span>
        <span style="opacity:0.6">${state.farmacos.length}</span>
      </button>
    `);

    if (state.cat) {
      state.cat.familias().forEach((fam) => {
        state.cat.listByFamilia(fam.id)
          .filter((c) => categoriesUsed.has(c.id))
          .forEach((c) => {
            const count = state.farmacos.filter((f) => (f.categoria || f.grupoKey) === c.id).length;
            chips.push(`
              <button class="cat-chip ${state.loadedCategory === c.id ? "is-active" : ""}" type="button" data-cat="${escapeAttr(c.id)}" data-categoria="${escapeAttr(c.id)}">
                <span>${escapeHtml(c.icon || "")} </span>
                <span>${escapeHtml(c.label || c.id)}</span>
                <span style="opacity:0.6">${count}</span>
              </button>
            `);
          });
      });
    }

    container.innerHTML = chips.join("");
  }

  function renderLoadedCards(container, state) {
    if (!container) return;
    const q = (state.loadedSearch || "").trim().toLowerCase();
    const list = state.farmacos.filter((f) => {
      const blob = `${f.principio || ""} ${f.grupo || ""} ${(f.comerciales || []).join(" ")} ${f.mecanismo || ""}`.toLowerCase();
      const category = f.categoria || f.grupoKey;
      const matchQ = !q || blob.includes(q);
      const matchCat = state.loadedCategory === "todas" || category === state.loadedCategory;
      return matchQ && matchCat;
    });

    if (list.length === 0) {
      container.innerHTML = `
        <div class="sv-empty">
          <div class="sv-empty-icon">?</div>
          No se encontraron farmacos con ese criterio.
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    list.forEach((drug) => container.appendChild(createLoadedDrugCard(drug, state)));
  }

  function createLoadedDrugCard(drug, state) {
    const card = document.createElement("article");
    const catId = drug.categoria || drug.grupoKey || "default";
    const Cat = state.cat;
    const cat = Cat ? Cat.get(catId) : { label: drug.grupo || "Farmaco", icon: "?", riesgoBase: 1 };

    const slug = window.SuiteVet?.Favorites?.slugify || slugify;

    card.className = "cat-card sv-card sv-fade-in";
    card.setAttribute("data-categoria", catId);
    card.dataset.favId = `farmacologia-${slug(drug.id || drug.principio)}`;
    card.dataset.favTitle = drug.principio || "Farmaco";
    card.dataset.favModule = "Farmacologia";
    card.dataset.favSubmodule = "Farmacos cargados";
    card.dataset.favType = "Tarjeta";
    card.dataset.favDescription = drug.mecanismo || (drug.comerciales || []).join(", ");

    const optionsEspecie = (drug.especies || []).map((species, index) =>
      `<option value="${index}">${escapeHtml(species.nombre)} - ${formatNum(species.dosisMgKg)} mg/kg</option>`
    ).join("");

    const lowerContra = String(drug.contraindicaciones || "").toLowerCase();
    const alerts = [];
    if (lowerContra.includes("mdr1") || lowerContra.includes("collie")) alerts.push("mdr1");
    if (lowerContra.includes("gestacion") || lowerContra.includes("gestacion")) alerts.push("gestacion");
    if (lowerContra.includes("renal")) alerts.push("nefrotoxico");
    if (lowerContra.includes("hepato") || lowerContra.includes("hepat")) alerts.push("hepatotoxico");

    const unit = String(drug.unidad || "").toLowerCase();
    const isLiquid = !unit.includes("tableta") && !unit.includes("capsula") && !unit.includes("comprimido");
    const resultUnit = isLiquid ? "mL" : "tabletas";
    const risk = Number(drug.riesgo) || Number(cat.riesgoBase) || 1;

    card.innerHTML = `
      <div class="sv-card-header">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          ${Cat ? Cat.iconCircle(catId) : ""}
          <div>
            <div class="sv-card-title">${escapeHtml(drug.principio)}</div>
            <div class="sv-card-subtitle">${escapeHtml(drug.grupo || cat.label || "")}</div>
          </div>
        </div>
        ${Cat ? Cat.badge(catId) : ""}
      </div>

      <div class="sv-card-body">
        <p><strong>Mecanismo:</strong> ${escapeHtml(drug.mecanismo || "No registrado")}</p>
        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-top:0.4rem;">
          ${Cat ? Cat.riesgoBadge(risk) : ""}
          ${(drug.comerciales || []).map((brand) => `<span class="farma-comercial-tag">${escapeHtml(brand)}</span>`).join("")}
        </div>
      </div>

      ${alerts.length && Cat ? Cat.alerta(alerts) : ""}

      <div class="farma-calc-area">
        <div class="farma-calc-row">
          <div style="flex:2; min-width:160px;">
            <span class="farma-calc-label">Especie / Dosis por kg</span>
            <select class="sv-select _esp">${optionsEspecie}</select>
          </div>
          <div style="flex:1; min-width:100px;">
            <span class="farma-calc-label">Peso (kg)</span>
            <input type="number" class="sv-input _peso" placeholder="Ej. 25" min="0" step="0.1" />
          </div>
        </div>

        <div class="farma-calc-row">
          <div style="flex:1;">
            <span class="farma-calc-label">Presentacion disponible</span>
            <div class="farma-conc-wrap">
              <input
                type="number"
                class="sv-input _conc"
                value="${escapeAttr(formatNum(drug.concentracion))}"
                min="0.001"
                step="any"
                title="Modifica si tienes una presentacion diferente"
              />
              <span class="farma-conc-unit">${escapeHtml(drug.unidad || "")}</span>
            </div>
          </div>
          <div style="flex:1;" class="_dosis-por-especie-wrap">
            <span class="farma-calc-label">Dosis para esta especie</span>
            <div class="_dosis-esp-info farma-dosis-esp-info">- elige especie</div>
          </div>
        </div>

        <div class="farma-resultado _resultado"></div>
        <button class="sv-btn sv-btn-primary sv-btn-full _btn-receta" style="display:none;" type="button">
          Agregar a Receta
        </button>
      </div>
    `;

    window.SuiteVet?.Favorites?.bindCard?.(card);

    const speciesSelect = card.querySelector("._esp");
    const weightInput = card.querySelector("._peso");
    const concInput = card.querySelector("._conc");
    const resultBox = card.querySelector("._resultado");
    const recipeBtn = card.querySelector("._btn-receta");
    const infoBox = card.querySelector("._dosis-esp-info");

    let lastComputed = null;

    function updateSpeciesInfo() {
      const idx = Number(speciesSelect.value);
      const species = (drug.especies || [])[idx];
      if (!species || !infoBox) return;

      infoBox.innerHTML = `
        <strong style="color:var(--sv-text-primary)">${formatNum(species.dosisMgKg)} mg/kg</strong>
        <span style="opacity:0.6;font-size:0.75rem;display:block;margin-top:1px;">via ${escapeHtml(species.via || "N/D")}</span>
      `;
    }

    function calculate() {
      const weight = parseNum(weightInput.value);
      const conc = parseNum(concInput.value);
      const idx = Number(speciesSelect.value);
      const species = (drug.especies || [])[idx];

      updateSpeciesInfo();

      if (!species || weight <= 0 || conc <= 0) {
        resultBox.classList.remove("visible");
        recipeBtn.style.display = "none";
        lastComputed = null;
        return;
      }

      const totalMg = weight * parseNum(species.dosisMgKg);
      const finalQty = totalMg / conc;
      const finalText = `${formatNum(finalQty)} ${resultUnit}`;

      const retiro = (Number(species.retiroCarne) > 0 || Number(species.retiroLeche) > 0)
        ? `Carne: ${Number(species.retiroCarne) || 0} dias | Leche: ${Number(species.retiroLeche) || 0} dias`
        : "";

      resultBox.classList.add("visible");
      resultBox.innerHTML = `
        <div class="farma-dosis-valor">${escapeHtml(finalText)}</div>
        <div class="farma-calc-pasos">
          <span>${formatNum(weight)} kg x ${formatNum(species.dosisMgKg)} mg/kg</span>
          <span class="farma-calc-paso-igual">=</span>
          <strong>${formatNum(totalMg)} mg</strong>
          <span class="farma-calc-paso-igual">/</span>
          <span>${formatNum(conc)} ${escapeHtml(drug.unidad || "")}</span>
          <span class="farma-calc-paso-igual">=</span>
          <strong style="color:var(--sv-success)">${escapeHtml(finalText)}</strong>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-top:0.3rem;">
          <span class="cat-badge cat-badge-solid" data-categoria="${escapeAttr(catId)}">${escapeHtml(species.via || "N/D")}</span>
          <span class="sv-badge sv-badge-gray">${escapeHtml(species.nombre || "")}</span>
        </div>
        ${retiro ? `<div class="farma-retiro-box">${escapeHtml(retiro)}</div>` : ""}
        ${species.nota ? `<p class="farma-nota-especie">\"${escapeHtml(species.nota)}\"</p>` : ""}
      `;

      lastComputed = {
        nombre: drug.principio,
        especie: species.nombre,
        pesoKg: weight,
        dosis: species.dosisMgKg,
        unidadDosis: "mg/kg",
        concentracion: conc,
        unidadConcentracion: drug.unidad,
        dosisTotal: totalMg,
        dosisTotalUnidad: "mg",
        resultadoFinal: finalQty,
        unidadFinal: resultUnit,
        via: species.via || "N/D",
        tiempoRetiro: retiro,
        tipoCalculo: "simple",
        grupoKey: catId,
        fuente: "farmacos_cargados",
        advertencias: alerts.length && Cat ? alerts.map((key) => Cat.ALERTAS?.[key]?.texto).filter(Boolean) : []
      };

      recipeBtn.style.display = "block";

      // Guardado automatico al historial (con deduplicacion por firma).
      const signature = [
        drug.id || drug.principio,
        species.nombre,
        formatNum(weight),
        formatNum(conc),
        formatNum(finalQty)
      ].join("|");

      if (signature !== state.lastLoadedHistorySignature) {
        state.lastLoadedHistorySignature = signature;
        appendHistoryEntry(state, {
          farmaco: lastComputed.nombre,
          especie: lastComputed.especie,
          peso: lastComputed.pesoKg,
          dosis: lastComputed.dosis,
          unidadDosis: lastComputed.unidadDosis,
          concentracion: lastComputed.concentracion,
          unidadConcentracion: lastComputed.unidadConcentracion,
          dosisTotal: lastComputed.dosisTotal,
          dosisTotalUnidad: lastComputed.dosisTotalUnidad,
          resultadoCalculado: `${formatNum(lastComputed.resultadoFinal)} ${lastComputed.unidadFinal}`,
          tipoCalculo: "simple",
          enviadoRecetario: false,
          guardadoPersonalizado: false,
          contieneComponentes: false,
          advertencias: lastComputed.advertencias,
          interacciones: [],
          snapshot: {
            source: "cargados",
            base: {
              id: drug.id || "",
              nombre: drug.principio || "",
              especie: species.nombre || "",
              pesoKg: weight,
              dosisMgKg: species.dosisMgKg,
              concentracion: conc,
              unidadConcentracion: drug.unidad || "",
              via: species.via || "",
              grupoKey: catId,
              retiro
            }
          }
        }, { dedupeMs: 1200 });
      }
    }

    updateSpeciesInfo();

    speciesSelect.addEventListener("change", calculate);
    weightInput.addEventListener("input", calculate);
    concInput.addEventListener("input", calculate);

    recipeBtn.addEventListener("click", () => {
      if (!lastComputed) return;
      window.Recetario?.agregarItem?.(
        drug,
        `${formatNum(lastComputed.resultadoFinal)} ${lastComputed.unidadFinal}`,
        lastComputed.via,
        lastComputed.especie,
        lastComputed.tiempoRetiro
      );

      markLatestHistoryBySignature(state, {
        farmaco: lastComputed.nombre,
        especie: lastComputed.especie,
        peso: lastComputed.pesoKg,
        resultado: `${formatNum(lastComputed.resultadoFinal)} ${lastComputed.unidadFinal}`
      }, { enviadoRecetario: true });
    });

    return card;
  }

  // ---------------------------------------------------------------------------
  // SUBMODULO 2: CALCULADORA LIBRE
  // ---------------------------------------------------------------------------
  function renderFreeCalculatorSubmodule(panel, state) {
    panel.innerHTML = `
      <div class="farma-free-shell">
        <section class="sv-card farma-free-card">
          <div class="sv-card-header">
            <div>
              <span class="sv-card-title">Datos base del calculo</span>
              <span class="sv-card-subtitle">Completa solo lo necesario para calcular; los datos clinicos se agregan abajo si vas a guardar.</span>
            </div>
            ${state.editingPersonalizedId ? `<span class="sv-badge sv-badge-orange">Editando personalizado</span>` : `<span class="sv-badge sv-badge-blue">Modo estudiante</span>`}
          </div>

          <div class="farma-free-grid" id="farma-free-grid">
            ${renderFreeMainFields(state)}
          </div>

          <div class="farma-free-actions">
            <button class="sv-btn sv-btn-primary" type="button" id="farma-free-calc">Calcular</button>
            <button class="sv-btn sv-btn-ghost" type="button" id="farma-free-procedure">${state.freeProcedureVisible ? "Ocultar procedimiento" : "Ver procedimiento"}</button>
            <button class="sv-btn sv-btn-secondary" type="button" id="farma-free-toggle-advanced">${state.freeAdvancedVisible ? "Ocultar detalles" : "Agregar mas detalles"}</button>
            <button class="sv-btn sv-btn-secondary" type="button" id="farma-free-to-recipe">Agregar al recetario</button>
            <button class="sv-btn sv-btn-ghost" type="button" id="farma-free-reset">Limpiar</button>
          </div>

          <div id="farma-free-alerts">${renderFreeAlerts(state)}</div>
          <div id="farma-free-result">${renderFreeResult(state)}</div>
          <div id="farma-free-procedure-panel">${renderFreeProcedure(state)}</div>
        </section>

        ${state.freeAdvancedVisible ? renderAdvancedBlock(state) : ""}

        <div class="farma-free-save-end">
          ${state.freeSaveNotice ? renderSaveNotice(state.freeSaveNotice) : ""}
          ${renderFreeSaveReadiness(state)}
          ${renderDuplicatePrompt(state)}
          <button class="sv-btn sv-btn-primary sv-btn-full" type="button" id="farma-free-save-custom-end">${state.editingPersonalizedId ? "Actualizar personalizado" : "Guardar como farmaco personalizado"}</button>
        </div>
      </div>
    `;

    bindFreeCalculatorEvents(panel, state);
  }

  function renderFreeMainFields(state) {
    const form = state.freeForm;
    return `
      ${inputField("Nombre del farmaco", "farma-free-name", form.nombre)}
      ${speciesField("Especie", "farma-free-species-select", "farma-free-species-custom", form.especie)}
      ${routeField("Via de administracion", "farma-free-route-select", "farma-free-route-custom", form.viaAdministracion)}
      ${numberField("Peso (kg)", "farma-free-weight", form.pesoKg, "0", "0.01")}
      ${numberField("Dosis por especie", "farma-free-dose", form.dosis, "0", "any")}
      ${unitField("Unidad de dosis", "farma-free-dose-unit", form.unidadDosis, FREE_DOSE_UNIT_OPTIONS, form.unidadDosisCustom, "farma-free-dose-unit-custom")}
      ${numberField("Concentracion", "farma-free-conc", form.concentracion, "0", "any")}
      ${unitField("Unidad de concentracion", "farma-free-conc-unit", form.unidadConcentracion, FREE_CONC_UNIT_OPTIONS, form.unidadConcentracionCustom, "farma-free-conc-unit-custom")}
    `;
  }

  function renderFreeSaveReadiness(state) {
    const draft = getCustomSaveDraft(state);
    const checklist = buildCustomSaveChecklist(draft);
    const ready = checklist.every((item) => item.ok);

    return `
      <section class="farma-save-checklist ${ready ? "is-ready" : "is-pending"}">
        <div>
          <strong>${ready ? "Listo para guardar" : "Antes de guardar revisa"}</strong>
          <span>${ready ? "Los datos minimos clinicos estan completos." : "La calculadora puede funcionar, pero el personalizado requiere ficha clinica minima."}</span>
        </div>
        <ul class="farma-checklist-grid">
          ${checklist.map((item) => `
            <li class="${item.ok ? "is-ok" : "is-missing"}">
              <span>${item.ok ? "Completo" : "Pendiente"}</span>
              ${escapeHtml(item.label)}
            </li>
          `).join("")}
        </ul>
        ${ready ? `
          <p>Al guardar se enviara automaticamente a Farmacos personalizados como ficha reutilizable.</p>
        ` : ""}
      </section>
    `;
  }

  function renderDuplicatePrompt(state) {
    const duplicate = state.freePendingDuplicate;
    if (!duplicate) return "";
    return `
      <section class="farma-duplicate-box" role="alert">
        <div>
          <strong>Ya existe un farmaco similar</strong>
          <span>Coincide con "${escapeHtml(duplicate.name || "farmaco similar")}". Decide antes de guardar para evitar duplicados accidentales.</span>
        </div>
        <div class="farma-duplicate-actions">
          <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" id="farma-duplicate-update">Actualizar existente</button>
          <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" id="farma-duplicate-copy">Guardar como copia</button>
          <button class="sv-btn sv-btn-sm sv-btn-ghost" type="button" id="farma-duplicate-cancel">Cancelar</button>
        </div>
      </section>
    `;
  }

  function buildCustomSaveChecklist(draft) {
    const speciesDoses = Array.isArray(draft.speciesDoses) ? draft.speciesDoses : [];
    const routes = Array.isArray(draft.routes) ? draft.routes : [];
    const presentations = Array.isArray(draft.presentations) ? draft.presentations : [];
    const withdrawals = Array.isArray(draft.withdrawalItems) ? draft.withdrawalItems : [];
    const components = Array.isArray(draft.componentes) ? draft.componentes : [];

    const validSpeciesDose = speciesDoses.some((row) =>
      String(row.especie || "").trim() && Number(row.dosis) > 0 && String(row.unidadDosis || "").trim()
    );
    const validPresentation = presentations.some((row) =>
      Number(row.concentracion) > 0 && String(row.unidadConcentracion || "").trim()
    );
    const validWithdrawal = withdrawals.some(isValidWithdrawalItem);
    const completeComponents = !components.length || components.every(isCompleteComponent);

    return [
      { label: "Nombre del producto", ok: Boolean(String(draft.nombre || "").trim()) },
      { label: "Grupo farmacologico principal", ok: Boolean(String(draft.grupoKey || "").trim() && draft.grupoKey !== "default") },
      { label: "Funcion terapeutica", ok: Boolean(String(draft.funcionTerapeutica || "").trim()) },
      { label: "Descripcion u observacion", ok: Boolean(String(draft.descripcion || "").trim()) },
      { label: "Especies y dosis", ok: validSpeciesDose },
      { label: "Vias de administracion", ok: routes.length > 0 },
      { label: "Concentracion o presentacion", ok: validPresentation },
      { label: "Unidad de dosis", ok: Boolean(String(draft.unidadDosis || "").trim()) },
      { label: "Tiempo de retiro", ok: validWithdrawal },
      { label: "Componentes activos", ok: completeComponents }
    ];
  }

  function isCompleteComponent(comp) {
    return Boolean(
      String(comp.nombre || "").trim() &&
      String(comp.grupoKey || "").trim() &&
      Number(comp.concentracion) > 0 &&
      String(comp.unidadConcentracion || "").trim() &&
      Number(comp.dosis) > 0 &&
      String(comp.unidadDosis || "").trim()
    );
  }

  function isValidWithdrawalItem(item) {
    const status = String(item?.estado || "").trim();
    if (status === "no_aplica" || status === "no_especificado") return true;
    if (status === "dias") return Number(item?.dias) >= 0 && String(item?.tipo || "").trim();
    return false;
  }

  function bindFreeCalculatorEvents(panel, state) {
    bindInput(panel, "#farma-free-name", (value) => {
      state.freeForm.nombre = value;
      clearEditingIfManualNameChange(state);
    });
    bindSelect(panel, "#farma-free-species-select", (value) => {
      if (!value) {
        state.freeForm.especie = "";
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }
      if (value === "Otro") {
        if (SPECIES_OPTIONS.includes(state.freeForm.especie)) state.freeForm.especie = "";
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }
      state.freeForm.especie = value;
      renderFreeCalculatorSubmodule(panel, state);
    });
    bindInput(panel, "#farma-free-species-custom", (value) => {
      state.freeForm.especie = value;
    });
    bindSelect(panel, "#farma-free-route-select", (value) => {
      if (!value) {
        state.freeForm.viaAdministracion = "";
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }
      if (value === "Otro") {
        if (isKnownRoute(state.freeForm.viaAdministracion)) state.freeForm.viaAdministracion = "";
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }
      state.freeForm.viaAdministracion = value;
      renderFreeCalculatorSubmodule(panel, state);
    });
    bindInput(panel, "#farma-free-route-custom", (value) => {
      state.freeForm.viaAdministracion = value;
    });
    bindInput(panel, "#farma-free-weight", (value) => {
      state.freeForm.pesoKg = value;
    });
    bindInput(panel, "#farma-free-dose", (value) => {
      state.freeForm.dosis = value;
    });
    bindInput(panel, "#farma-free-conc", (value) => {
      state.freeForm.concentracion = value;
    });

    bindSelect(panel, "#farma-free-dose-unit", (value) => {
      state.freeForm.unidadDosis = value;
      renderFreeCalculatorSubmodule(panel, state);
    });
    bindInput(panel, "#farma-free-dose-unit-custom", (value) => {
      state.freeForm.unidadDosisCustom = value;
    });

    bindSelect(panel, "#farma-free-conc-unit", (value) => {
      state.freeForm.unidadConcentracion = value;
      renderFreeCalculatorSubmodule(panel, state);
    });
    bindInput(panel, "#farma-free-conc-unit-custom", (value) => {
      state.freeForm.unidadConcentracionCustom = value;
    });

    panel.querySelector("#farma-free-calc")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      const result = calculateFreeDose(state.freeForm);
      state.freeResult = result;
      state.freeAlerts = result.warnings || [];
      state.freeClinicalAlerts = [];
      state.freeSaveMissing = [];
      state.freeSaveNotice = null;

      if (result.ok) {
        const interactionAlerts = buildInteractionAlerts(state);
        const clinicalData = normalizeClinicalAnimalData(state.freeClinical);
        const clinicalAlerts = evaluateClinicalSafety({
          clinical: clinicalData,
          contraindicaciones: state.freeAdvanced.contraindicaciones,
          precauciones: state.freeAdvanced.precauciones
        });
        state.freeClinicalAlerts = clinicalAlerts;
        const historyId = appendHistoryEntry(state, {
          farmaco: state.freeForm.nombre,
          especie: state.freeForm.especie,
          peso: parseNum(state.freeForm.pesoKg),
          dosis: parseNum(state.freeForm.dosis),
          unidadDosis: resolveUnit(state.freeForm.unidadDosis, state.freeForm.unidadDosisCustom),
          viaAdministracion: getEffectiveRoutesFromState(state)[0] || state.freeAdvanced.viaAdministracion || state.freeForm.viaAdministracion || "",
          concentracion: parseNum(state.freeForm.concentracion),
          unidadConcentracion: resolveUnit(state.freeForm.unidadConcentracion, state.freeForm.unidadConcentracionCustom),
          presentacion: "Presentacion principal",
          concentracionModificada: false,
          dosisTotal: result.doseTotalValue,
          dosisTotalUnidad: result.doseTotalUnit,
          resultadoCalculado: `${formatNum(result.finalValue)} ${result.finalUnit}`,
          tipoCalculo: state.freeAdvancedVisible ? "profesional" : "simple",
          origen: "Calculadora Libre",
          enviadoRecetario: false,
          guardadoPersonalizado: false,
          contieneComponentes: normalizedComponents(state.freeComponents).length > 0,
          advertencias: state.freeAlerts,
          datosClinicos: clinicalData,
          alertasClinicas: clinicalAlerts,
          interacciones: interactionAlerts.map((x) => x.text),
          snapshot: buildFreeSnapshot(state)
        });
        state.freeLastHistoryId = historyId;
      }

      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelector("#farma-free-procedure")?.addEventListener("click", () => {
      state.freeProcedureVisible = !state.freeProcedureVisible;
      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelector("#farma-free-toggle-advanced")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      state.freeAdvancedVisible = !state.freeAdvancedVisible;
      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelector("#farma-free-to-recipe")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      const result = calculateFreeDose(state.freeForm);
      state.freeResult = result;
      state.freeAlerts = result.warnings || [];
      state.freeClinicalAlerts = [];
      state.freeSaveNotice = null;

      let historyId = "";
      if (result.ok) {
        const interactionAlerts = buildInteractionAlerts(state);
        const clinicalData = normalizeClinicalAnimalData(state.freeClinical);
        const clinicalAlerts = evaluateClinicalSafety({
          clinical: clinicalData,
          contraindicaciones: state.freeAdvanced.contraindicaciones,
          precauciones: state.freeAdvanced.precauciones
        });
        state.freeClinicalAlerts = clinicalAlerts;
        historyId = appendHistoryEntry(state, {
          farmaco: state.freeForm.nombre,
          especie: state.freeForm.especie,
          peso: parseNum(state.freeForm.pesoKg),
          dosis: parseNum(state.freeForm.dosis),
          unidadDosis: resolveUnit(state.freeForm.unidadDosis, state.freeForm.unidadDosisCustom),
          viaAdministracion: getEffectiveRoutesFromState(state)[0] || state.freeAdvanced.viaAdministracion || state.freeForm.viaAdministracion || "",
          concentracion: parseNum(state.freeForm.concentracion),
          unidadConcentracion: resolveUnit(state.freeForm.unidadConcentracion, state.freeForm.unidadConcentracionCustom),
          presentacion: "Presentacion principal",
          concentracionModificada: false,
          dosisTotal: result.doseTotalValue,
          dosisTotalUnidad: result.doseTotalUnit,
          resultadoCalculado: `${formatNum(result.finalValue)} ${result.finalUnit}`,
          tipoCalculo: state.freeAdvancedVisible ? "profesional" : "simple",
          origen: "Calculadora Libre",
          enviadoRecetario: false,
          guardadoPersonalizado: false,
          contieneComponentes: normalizedComponents(state.freeComponents).length > 0,
          advertencias: state.freeAlerts,
          datosClinicos: clinicalData,
          alertasClinicas: clinicalAlerts,
          interacciones: interactionAlerts.map((x) => x.text),
          snapshot: buildFreeSnapshot(state)
        }, { dedupeMs: 2000 });
        state.freeLastHistoryId = historyId;
      }

      if (!state.freeResult || !state.freeResult.ok) {
        state.freeSaveNotice = {
          level: "error",
          title: "No se envio al recetario",
          message: "No se pudo calcular una dosis valida. Revisa nombre, peso, dosis, concentracion y unidades."
        };
        toast("No se pudo calcular una dosis valida para enviar al recetario.");
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }

      const historyEntry = state.historyItems.find((entry) => entry.id === (historyId || state.freeLastHistoryId));
      const payload = historyEntry ? buildRecipePayloadFromHistory(historyEntry) : buildRecipePayloadFromFree(state);
      const added = addPayloadToRecipe(payload);
      if (added) {
        const targetHistoryId = historyEntry?.id || state.freeLastHistoryId;
        if (targetHistoryId) patchHistoryEntry(state, targetHistoryId, { enviadoRecetario: true });
        state.freeSaveNotice = {
          level: "success",
          title: "Agregado al recetario",
          message: `${state.freeForm.nombre || "El farmaco"} se envio correctamente al recetario.`
        };
      } else {
        state.freeSaveNotice = {
          level: "error",
          title: "No se envio al recetario",
          message: "El recetario no pudo recibir este calculo. Intenta nuevamente o revisa el almacenamiento del navegador."
        };
      }
      renderFreeCalculatorSubmodule(panel, state);
    });

    const saveCustomBtn = panel.querySelector("#farma-free-save-custom-end")
      || panel.querySelector("#farma-free-save-custom");
    saveCustomBtn?.addEventListener("click", () => {
      handleFreeCustomSave(panel, state);
    });

    panel.querySelector("#farma-duplicate-update")?.addEventListener("click", () => {
      handleFreeCustomSave(panel, state, "update");
    });

    panel.querySelector("#farma-duplicate-copy")?.addEventListener("click", () => {
      handleFreeCustomSave(panel, state, "copy");
    });

    panel.querySelector("#farma-duplicate-cancel")?.addEventListener("click", () => {
      state.freePendingDuplicate = null;
      state.freeSaveNotice = {
        level: "warning",
        title: "Guardado cancelado",
        message: "No se duplico ni actualizo el farmaco personalizado."
      };
      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelector("#farma-free-reset")?.addEventListener("click", () => {
      resetFreeCalculatorState(state);
      renderFreeCalculatorSubmodule(panel, state);
    });

    if (!state.freeAdvancedVisible) return;

    bindAdvancedInputs(panel, state);
    bindClinicalObservationEvents(panel, state);
    bindSpeciesDoseEvents(panel, state);
    bindRouteEvents(panel, state);
    bindPresentationEvents(panel, state);
    bindWithdrawalEvents(panel, state);
    bindPhotoEvents(panel, state);
    bindComponentsEvents(panel, state);
    bindInteractionMode(panel, state);
  }

  function handleFreeCustomSave(panel, state, duplicateMode = "") {
    syncFreeStateFromPanel(panel, state);
    state.freeSaveNotice = null;
    state.customNotice = null;

    let saveResult;
    try {
      saveResult = saveFreeAsCustomDrug(state, { duplicateMode });
    } catch (error) {
      console.warn("[Farma] Error inesperado al guardar personalizado:", error);
      state.freePendingDuplicate = null;
      state.freeSaveNotice = {
        level: "error",
        title: "No se guardo el farmaco",
        message: "Ocurrio un error interno al guardar. El formulario sigue intacto para que puedas intentar nuevamente."
      };
      toast("No se pudo guardar el farmaco personalizado por un error interno.");
      renderFreeCalculatorSubmodule(panel, state);
      return;
    }

    if (!saveResult.ok) {
      if (saveResult.reason === "calc") {
        state.freePendingDuplicate = null;
        state.freeSaveMissing = [];
        state.freeSaveNotice = {
          level: "error",
          title: "No se guardo el farmaco",
          message: "No se pudo calcular la dosis con los datos actuales. Revisa peso, dosis, concentracion y unidades."
        };
        toast("No se pudo calcular la dosis con los datos actuales. Revisa peso, dosis, concentracion y unidades.");
      }

      if (saveResult.reason === "minimal") {
        state.freePendingDuplicate = null;
        state.freeAdvancedVisible = true;
        state.freeSaveMissing = Array.isArray(saveResult.missingFields) ? saveResult.missingFields : [];
        const joined = state.freeSaveMissing.join(", ");
        state.freeSaveNotice = {
          level: "warning",
          title: "Faltan datos clinicos minimos",
          message: `Completa estos campos: ${joined || "campos obligatorios"}.`
        };
        toast(`Completa los datos clinicos minimos: ${joined || "campos obligatorios"}.`);
      }

      if (saveResult.reason === "duplicate") {
        state.freeAdvancedVisible = true;
        state.freePendingDuplicate = {
          id: saveResult.duplicate?.id || "",
          name: saveResult.duplicate?.nombre || saveResult.duplicate?.nombreComercial || "farmaco similar"
        };
        state.freeSaveNotice = {
          level: "warning",
          title: "Ya existe un farmaco similar",
          message: "Elige si quieres actualizar el existente, guardar una copia o cancelar."
        };
      }

      if (saveResult.reason === "storage") {
        state.freePendingDuplicate = null;
        state.freeSaveNotice = {
          level: "error",
          title: "No se guardo el farmaco",
          message: "El navegador no pudo guardar la informacion local. Libera espacio, evita imagenes pesadas o intenta limpiar registros antiguos."
        };
        toast("No se pudo guardar el farmaco personalizado en el navegador. Libera espacio o intenta limpiar registros antiguos.");
      }

      if (!["storage", "calc", "minimal", "duplicate"].includes(saveResult.reason)) {
        state.freePendingDuplicate = null;
        state.freeSaveNotice = {
          level: "error",
          title: "No se guardo el farmaco",
          message: "Para guardar este farmaco personalizado, completa los datos clinicos minimos."
        };
        toast("Para guardar este farmaco personalizado, completa los datos clinicos minimos.");
      }

      renderFreeCalculatorSubmodule(panel, state);
      if (saveResult.reason === "minimal") {
        focusFirstMissingCustomField(panel, state.freeSaveMissing);
      }
      return;
    }

    state.freePendingDuplicate = null;
    state.customNotice = {
      level: "success",
      title: "Farmaco personalizado guardado",
      message: `${saveResult.itemName || "El farmaco"} se agrego correctamente a Farmacos personalizados.`
    };
    state.customSearch = "";
    state.customFilterSpecies = "todas";
    state.customFilterGroup = "todas";
    state.activeSubmodule = "personalizados";
    renderSubmoduleFromPanel(panel, state);
  }

  function bindAdvancedInputs(panel, state) {
    const adv = state.freeAdvanced;
    bindInput(panel, "#farma-adv-commercial", (value) => { adv.nombreComercial = value; });
    bindInput(panel, "#farma-adv-lab", (value) => { adv.laboratorio = value; });
    bindSelect(panel, "#farma-adv-group", (value) => {
      adv.grupoKey = value;
      updateInteractionPanel(panel, state);
    });
    bindInput(panel, "#farma-adv-func", (value) => { adv.funcionTerapeutica = value; });
    bindInput(panel, "#farma-adv-mechanism", (value) => { adv.mecanismoAccion = value; });
    bindInput(panel, "#farma-adv-description", (value) => { adv.descripcion = value; });
    bindSelect(panel, "#farma-adv-via-select", (value) => {
      if (!value) {
        adv.viaAdministracion = "";
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }
      if (value === "Otro") {
        if (isKnownRoute(adv.viaAdministracion)) adv.viaAdministracion = "";
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }
      adv.viaAdministracion = value;
      renderFreeCalculatorSubmodule(panel, state);
    });
    bindInput(panel, "#farma-adv-via-custom", (value) => { adv.viaAdministracion = value; });
    bindInput(panel, "#farma-adv-frequency", (value) => { adv.frecuencia = value; });
    bindInput(panel, "#farma-adv-duration", (value) => { adv.duracion = value; });
    bindInput(panel, "#farma-adv-contra", (value) => { adv.contraindicaciones = value; });
    bindInput(panel, "#farma-adv-precautions", (value) => { adv.precauciones = value; });
    bindInput(panel, "#farma-adv-adverse", (value) => { adv.efectosAdversos = value; });
    bindInput(panel, "#farma-adv-withdraw", (value) => { adv.tiempoRetiro = value; });
    bindInput(panel, "#farma-adv-observations", (value) => { adv.observaciones = value; });
    bindInput(panel, "#farma-adv-source", (value) => { adv.bibliografia = value; });
  }

  function bindClinicalObservationEvents(panel, state) {
    panel.querySelectorAll("[data-clinical-observation-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        syncFreeStateFromPanel(panel, state);
        const target = button.dataset.clinicalObservationToggle || "";
        state.clinicalObservationTarget = state.clinicalObservationTarget === target ? "" : target;
        renderFreeCalculatorSubmodule(panel, state);
      });
    });

    panel.querySelector("[data-clinical-observation-close]")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      state.clinicalObservationTarget = "";
      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelectorAll("[data-clinical-template-select]").forEach((select) => {
      select.addEventListener("change", () => {
        const value = String(select.value || "").trim();
        if (!value) return;
        syncFreeStateFromPanel(panel, state);
        const target = select.dataset.clinicalTemplateSelect || "";
        applyClinicalObservationSelection(panel, state, target, { selected: [value], includeCustom: false });
        renderFreeCalculatorSubmodule(panel, state);
      });
    });

    panel.querySelectorAll("[data-clinical-observation-apply]").forEach((button) => {
      button.addEventListener("click", () => {
        syncFreeStateFromPanel(panel, state);
        const target = button.dataset.clinicalObservationApply || "";
        applyClinicalObservationSelection(panel, state, target, { includeCustom: true });
        renderFreeCalculatorSubmodule(panel, state);
      });
    });
  }

  function bindFreeClinicalAnimalEvents(panel, state) {
    const root = panel.querySelector("[data-clinical-animal-panel='free']");
    if (!root) return;
    root.addEventListener("change", () => syncFreeClinicalFromPanel(panel, state));
    root.addEventListener("input", () => syncFreeClinicalFromPanel(panel, state));
  }

  function applyClinicalObservationSelection(panel, state, target, opts = {}) {
    if (!["contraindicaciones", "precauciones"].includes(target)) return;
    const root = panel.querySelector(`[data-clinical-picker-panel="${target}"]`);
    if (!root) return;
    const selected = (Array.isArray(opts.selected) ? opts.selected : [])
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    const custom = opts.includeCustom === false ? "" : String(root.querySelector("[data-clinical-custom-text]")?.value || "").trim();
    const additions = custom ? selected.concat(custom) : selected;
    if (!additions.length) {
      state.clinicalObservationTarget = "";
      return;
    }

    const adv = state.freeAdvanced;
    adv.clinicalObservations = normalizeClinicalObservations(adv.clinicalObservations);
    adv[target] = appendClinicalText(adv[target], additions);
    adv.clinicalObservations[target] = listUnique((adv.clinicalObservations[target] || []).concat(selected));
    const customKey = `${target}Personalizadas`;
    if (custom) adv.clinicalObservations[customKey] = listUnique((adv.clinicalObservations[customKey] || []).concat(custom));
    state.clinicalObservationTarget = "";
  }

  function bindSpeciesDoseEvents(panel, state) {
    if (!Array.isArray(state.freeAdvanced.speciesDoses)) state.freeAdvanced.speciesDoses = [];

    panel.querySelector("#farma-add-species-dose")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      state.freeAdvanced.speciesDoses.push(buildDefaultSpeciesDose());
      renderFreeCalculatorSubmodule(panel, state);
    });

    const list = panel.querySelector("#farma-species-dose-list");
    if (!list) return;

    list.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-dose-remove]");
      if (!remove) return;
      syncFreeStateFromPanel(panel, state);
      const id = remove.dataset.doseRemove;
      state.freeAdvanced.speciesDoses = state.freeAdvanced.speciesDoses.filter((row) => row.id !== id);
      renderFreeCalculatorSubmodule(panel, state);
    });

    list.addEventListener("change", (event) => {
      const rowNode = event.target.closest("[data-dose-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.speciesDoses.find((item) => item.id === rowNode.dataset.doseId);
      if (!row) return;

      const name = event.target.name || "";
      if (name === "dose-especie-select") {
        if (!event.target.value) {
          row.especie = "";
        } else if (event.target.value === "Otro") {
          if (SPECIES_OPTIONS.includes(row.especie)) row.especie = "";
        } else {
          row.especie = event.target.value;
        }
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }

      if (name === "dose-unidadDosis") {
        row.unidadDosis = event.target.value;
        if (row.unidadDosis !== "Otro") row.unidadDosisCustom = "";
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }
    });

    list.addEventListener("input", (event) => {
      const rowNode = event.target.closest("[data-dose-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.speciesDoses.find((item) => item.id === rowNode.dataset.doseId);
      if (!row) return;

      const name = event.target.name || "";
      if (name === "dose-especie-custom") row.especie = event.target.value;
      if (name === "dose-dosis") row.dosis = event.target.value;
      if (name === "dose-unidadDosisCustom") row.unidadDosisCustom = event.target.value;
      if (name === "dose-frecuencia") row.frecuencia = event.target.value;
      if (name === "dose-duracion") row.duracion = event.target.value;
      if (name === "dose-observaciones") row.observaciones = event.target.value;
      if (name === "dose-notas") row.notas = event.target.value;
    });
  }

  function bindRouteEvents(panel, state) {
    if (!Array.isArray(state.freeAdvanced.routes)) state.freeAdvanced.routes = [];

    panel.querySelector("#farma-add-route")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      state.freeAdvanced.routes.push(buildDefaultRoute());
      renderFreeCalculatorSubmodule(panel, state);
    });

    const list = panel.querySelector("#farma-routes-list");
    if (!list) return;

    list.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-route-remove]");
      if (!remove) return;
      syncFreeStateFromPanel(panel, state);
      const id = remove.dataset.routeRemove;
      state.freeAdvanced.routes = state.freeAdvanced.routes.filter((row) => row.id !== id);
      renderFreeCalculatorSubmodule(panel, state);
    });

    list.addEventListener("change", (event) => {
      const rowNode = event.target.closest("[data-route-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.routes.find((item) => item.id === rowNode.dataset.routeId);
      if (!row) return;

      if (event.target.name === "route-select") {
        if (!event.target.value) {
          row.via = "";
        } else if (event.target.value === "Otro") {
          if (isKnownRoute(row.via)) row.via = "";
        } else {
          row.via = event.target.value;
        }
        renderFreeCalculatorSubmodule(panel, state);
      }
    });

    list.addEventListener("input", (event) => {
      const rowNode = event.target.closest("[data-route-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.routes.find((item) => item.id === rowNode.dataset.routeId);
      if (!row) return;
      if (event.target.name === "route-custom") row.via = event.target.value;
      if (event.target.name === "route-notas") row.notas = event.target.value;
    });
  }

  function bindPresentationEvents(panel, state) {
    if (!Array.isArray(state.freeAdvanced.presentations)) state.freeAdvanced.presentations = [];

    panel.querySelector("#farma-add-presentation")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      state.freeAdvanced.presentations.push(buildDefaultPresentation());
      renderFreeCalculatorSubmodule(panel, state);
    });

    const list = panel.querySelector("#farma-presentations-list");
    if (!list) return;

    list.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-presentation-remove]");
      if (!remove) return;
      syncFreeStateFromPanel(panel, state);
      const id = remove.dataset.presentationRemove;
      state.freeAdvanced.presentations = state.freeAdvanced.presentations.filter((row) => row.id !== id);
      renderFreeCalculatorSubmodule(panel, state);
    });

    list.addEventListener("change", (event) => {
      const rowNode = event.target.closest("[data-presentation-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.presentations.find((item) => item.id === rowNode.dataset.presentationId);
      if (!row) return;
      if (event.target.name === "presentation-unidadConcentracion") {
        row.unidadConcentracion = event.target.value;
        if (row.unidadConcentracion !== "Otro") row.unidadConcentracionCustom = "";
        renderFreeCalculatorSubmodule(panel, state);
      }
    });

    list.addEventListener("input", (event) => {
      const rowNode = event.target.closest("[data-presentation-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.presentations.find((item) => item.id === rowNode.dataset.presentationId);
      if (!row) return;
      const name = event.target.name || "";
      if (name === "presentation-nombre") row.nombre = event.target.value;
      if (name === "presentation-concentracion") row.concentracion = event.target.value;
      if (name === "presentation-unidadConcentracionCustom") row.unidadConcentracionCustom = event.target.value;
      if (name === "presentation-notas") row.notas = event.target.value;
    });
  }

  function bindWithdrawalEvents(panel, state) {
    if (!Array.isArray(state.freeAdvanced.withdrawalItems)) {
      state.freeAdvanced.withdrawalItems = [buildDefaultWithdrawalItem()];
    }

    panel.querySelector("#farma-add-withdrawal")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      state.freeAdvanced.withdrawalItems.push(buildDefaultWithdrawalItem("Carne", "dias"));
      renderFreeCalculatorSubmodule(panel, state);
    });

    const list = panel.querySelector("#farma-withdrawal-list");
    if (!list) return;

    list.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-withdrawal-remove]");
      if (!remove) return;
      syncFreeStateFromPanel(panel, state);
      const id = remove.dataset.withdrawalRemove;
      state.freeAdvanced.withdrawalItems = state.freeAdvanced.withdrawalItems.filter((row) => row.id !== id);
      if (!state.freeAdvanced.withdrawalItems.length) {
        state.freeAdvanced.withdrawalItems.push(buildDefaultWithdrawalItem());
      }
      renderFreeCalculatorSubmodule(panel, state);
    });

    list.addEventListener("change", (event) => {
      const rowNode = event.target.closest("[data-withdrawal-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.withdrawalItems.find((item) => item.id === rowNode.dataset.withdrawalId);
      if (!row) return;
      const name = event.target.name || "";
      if (name === "withdrawal-tipo") row.tipo = event.target.value;
      if (name === "withdrawal-estado") row.estado = event.target.value;
      renderFreeCalculatorSubmodule(panel, state);
    });

    list.addEventListener("input", (event) => {
      const rowNode = event.target.closest("[data-withdrawal-id]");
      if (!rowNode) return;
      const row = state.freeAdvanced.withdrawalItems.find((item) => item.id === rowNode.dataset.withdrawalId);
      if (!row) return;
      if (event.target.name === "withdrawal-dias") row.dias = event.target.value;
      if (event.target.name === "withdrawal-notas") row.notas = event.target.value;
    });
  }

  function bindPhotoEvents(panel, state) {
    bindInput(panel, "#farma-adv-photo-url", (value) => {
      const clean = String(value || "").trim();
      state.freeAdvanced.productImage = clean;
      state.freeAdvanced.productImageSource = clean ? "url" : "";
      state.freeAdvanced.productImageName = clean ? "URL de imagen" : "";
      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelector("#farma-photo-remove")?.addEventListener("click", () => {
      state.freeAdvanced.productImage = "";
      state.freeAdvanced.productImageSource = "";
      state.freeAdvanced.productImageName = "";
      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelector("#farma-adv-photo-file")?.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
        toast("La imagen es muy pesada. Usa una foto menor a 1.8 MB.");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        state.freeAdvanced.productImage = String(reader.result || "");
        state.freeAdvanced.productImageSource = "upload";
        state.freeAdvanced.productImageName = file.name || "Foto cargada";
        renderFreeCalculatorSubmodule(panel, state);
      };
      reader.onerror = () => {
        toast("No se pudo leer la imagen seleccionada.");
      };
      reader.readAsDataURL(file);
    });
  }

  function bindComponentsEvents(panel, state) {
    panel.querySelector("#farma-add-component")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      state.freeComponents.push(buildDefaultComponent());
      renderFreeCalculatorSubmodule(panel, state);
    });

    const componentsRoot = panel.querySelector("#farma-components-list");
    if (!componentsRoot) return;

    componentsRoot.addEventListener("click", (event) => {
      const delBtn = event.target.closest("[data-comp-remove]");
      if (!delBtn) return;
      syncFreeStateFromPanel(panel, state);
      const id = delBtn.dataset.compRemove;
      state.freeComponents = state.freeComponents.filter((comp) => comp.id !== id);
      renderFreeCalculatorSubmodule(panel, state);
    });

    componentsRoot.addEventListener("input", (event) => {
      const row = event.target.closest("[data-comp-id]");
      if (!row) return;
      const comp = state.freeComponents.find((x) => x.id === row.dataset.compId);
      if (!comp) return;

      const name = event.target.name || "";
      if (!name.startsWith("comp-")) return;

      const key = name.replace("comp-", "");
      comp[key] = event.target.value;
      recalcSingleComponent(comp, state.freeForm.pesoKg);
      updateSingleComponentResult(row, comp);
      updateInteractionPanel(panel, state);
    });

    componentsRoot.addEventListener("change", (event) => {
      const row = event.target.closest("[data-comp-id]");
      if (!row) return;
      const comp = state.freeComponents.find((x) => x.id === row.dataset.compId);
      if (!comp) return;

      const name = event.target.name || "";
      if (!name.startsWith("comp-")) return;

      const key = name.replace("comp-", "");
      comp[key] = event.target.value;
      recalcSingleComponent(comp, state.freeForm.pesoKg);
      updateSingleComponentResult(row, comp);
      updateInteractionPanel(panel, state);

      if (key === "unidadDosis" || key === "unidadConcentracion") {
        renderFreeCalculatorSubmodule(panel, state);
      }
    });

    state.freeComponents.forEach((comp) => recalcSingleComponent(comp, state.freeForm.pesoKg));
  }

  function bindInteractionMode(panel, state) {
    bindSelect(panel, "#farma-interaction-mode", (value) => {
      state.freeAdvanced.interactionMode = value;
      updateInteractionPanel(panel, state);
    });
    updateInteractionPanel(panel, state);
  }

  function updateSingleComponentResult(row, comp) {
    const el = row.querySelector("[data-comp-result]");
    if (!el) return;
    if (!comp.result || !comp.result.ok) {
      el.textContent = "Completa peso, dosis y concentracion del componente.";
      return;
    }
    el.textContent = `${formatNum(comp.result.finalValue)} ${comp.result.finalUnit}`;
  }

  function updateInteractionPanel(panel, state) {
    const interactionRoot = panel.querySelector("#farma-interaction-results");
    if (!interactionRoot) return;

    const alerts = buildInteractionAlerts(state);
    interactionRoot.innerHTML = alerts.map((item) => `
      <div class="farma-interaction-alert ${escapeAttr(item.level)}">
        <strong>${escapeHtml(item.title)}:</strong>
        <span>${escapeHtml(item.text)}</span>
      </div>
    `).join("");
  }

  function renderFreeAlerts(state) {
    const warnings = state.freeAlerts || [];
    const clinicalAlerts = state.freeClinicalAlerts || [];
    const missing = state.freeSaveMissing || [];
    const notice = state.freeSaveNotice;
    if (!warnings.length && !clinicalAlerts.length && !missing.length && !notice) return "";
    return `
      <div class="farma-free-warning">
        ${notice ? renderSaveNotice(notice) : ""}
        ${warnings.map((w) => `<p>${escapeHtml(w)}</p>`).join("")}
        ${renderClinicalAlerts(clinicalAlerts)}
        ${missing.length ? `<p><strong>Para guardar faltan:</strong> ${escapeHtml(missing.join(", "))}.</p>` : ""}
      </div>
    `;
  }

  function renderSaveNotice(notice) {
    if (!notice) return "";
    const level = ["success", "warning", "error"].includes(notice.level) ? notice.level : "info";
    return `
      <div class="farma-save-notice ${escapeAttr(level)}" role="status" aria-live="polite">
        <strong>${escapeHtml(notice.title || "Aviso")}</strong>
        <span>${escapeHtml(notice.message || "")}</span>
      </div>
    `;
  }

  function focusFirstMissingCustomField(panel, missingFields) {
    const missing = Array.isArray(missingFields) ? missingFields : [];
    const selectorsByMissing = {
      "Nombre del farmaco": "#farma-free-name",
      "Especie": "#farma-free-species-select",
      "Dosis": "#farma-free-dose",
      "Especies y dosis": "#farma-add-species-dose, #farma-free-species-select",
      "Unidad de dosis": "#farma-free-dose-unit",
      "Concentracion": "#farma-free-conc",
      "Concentracion o presentacion": "#farma-free-conc, #farma-add-presentation",
      "Unidad de concentracion": "#farma-free-conc-unit",
      "Grupo farmacologico": "#farma-adv-group",
      "Via de administracion": "#farma-adv-via-select, #farma-free-route-select",
      "Vias de administracion": "#farma-adv-via-select, #farma-free-route-select, #farma-add-route",
      "Funcion terapeutica": "#farma-adv-func",
      "Descripcion u observacion": "#farma-adv-description, #farma-adv-observations",
      "Tiempo de retiro": "#farma-withdrawal-list, #farma-add-withdrawal",
      "Componentes activos completos": "#farma-components-list, #farma-add-component"
    };

    const firstSelector = selectorsByMissing[missing[0]] || "#farma-free-save-custom-end";
    const target = panel.querySelector(firstSelector);
    const field = target?.closest?.(".farma-field") || target;
    if (!target) return;

    field?.classList?.add("is-missing-focus");
    target.scrollIntoView?.({ behavior: "smooth", block: "center" });
    target.focus?.({ preventScroll: true });
    window.setTimeout(() => field?.classList?.remove("is-missing-focus"), 2600);
  }

  function renderFreeResult(state) {
    if (!state.freeResult || !state.freeResult.ok) {
      return `
        <div class="farma-free-result muted">
          <p>Ingresa datos y presiona <strong>Calcular</strong>.</p>
        </div>
      `;
    }

    const res = state.freeResult;
    return `
      <div class="farma-free-result">
        <div class="farma-free-result-main">${formatNum(res.doseTotalValue)} ${escapeHtml(res.doseTotalUnit)}</div>
        <p>Dosis total requerida</p>
        <div class="farma-free-result-main farma-free-result-final">${formatNum(res.finalValue)} ${escapeHtml(res.finalUnit)}</div>
        <p>Resultado final a administrar</p>
      </div>
    `;
  }

  function clinicalObservationTextField(label, id, value, target, state) {
    const isOpen = state.clinicalObservationTarget === target;
    return `
      <div class="farma-field farma-field-wide farma-clinical-observation-field">
        <label>
          <span>${escapeHtml(label)}</span>
          <textarea class="sv-input" id="${escapeAttr(id)}">${escapeHtml(value || "")}</textarea>
        </label>
        <div class="farma-clinical-toolbar">
          <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-clinical-observation-toggle="${escapeAttr(target)}">Observaciones clinicas</button>
          <span>Plantillas rapidas; el texto final queda editable.</span>
        </div>
        ${isOpen ? renderClinicalObservationPicker(target) : ""}
      </div>
    `;
  }

  function renderClinicalObservationPicker(target) {
    const templates = CLINICAL_OBSERVATION_TEMPLATES[target] || [];
    return `
      <div class="farma-clinical-picker" data-clinical-picker-panel="${escapeAttr(target)}">
        <div class="farma-clinical-picker-head">
          <strong>Observaciones clinicas</strong>
          <span>Selecciona una observacion y se agregara automaticamente al campo editable.</span>
        </div>
        <label class="farma-field farma-field-wide">
          <span>Lista de observaciones</span>
          <select class="sv-select" data-clinical-template-select="${escapeAttr(target)}">
            <option value="">Seleccionar observacion clinica...</option>
            ${templates.map((text) => `<option value="${escapeAttr(text)}">${escapeHtml(text)}</option>`).join("")}
          </select>
        </label>
        <label class="farma-field farma-field-wide">
          <span>+ Agregar observacion personalizada</span>
          <textarea class="sv-input" data-clinical-custom-text placeholder="Ej. Evitar en pacientes con antecedentes de convulsiones."></textarea>
        </label>
        <div class="farma-clinical-picker-actions">
          <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-clinical-observation-apply="${escapeAttr(target)}">Agregar observacion personalizada</button>
          <button class="sv-btn sv-btn-sm sv-btn-ghost" type="button" data-clinical-observation-close>Cancelar</button>
        </div>
      </div>
    `;
  }

  function renderClinicalAnimalSection(prefix, clinicalData = {}) {
    const data = normalizeClinicalAnimalData(clinicalData);
    const isOpen = Boolean(data.open);
    const name = `${prefix}-clinical-condition`;
    const customId = prefix.startsWith("custom-") ? prefix.slice(7) : "";
    const toggleAttrs = customId
      ? `data-custom-calc-action="toggle-clinical" data-custom-id="${escapeAttr(customId)}"`
      : `data-clinical-animal-toggle="${escapeAttr(prefix)}"`;
    return `
      <section class="farma-clinical-animal ${isOpen ? "is-open" : ""}">
        <button class="farma-clinical-toggle" type="button" ${toggleAttrs}>
          <span>Datos clinicos del animal</span>
          <strong>${isOpen ? "Ocultar" : "Opcional"}</strong>
        </button>
        ${isOpen ? `
          <div class="farma-clinical-animal-panel" data-clinical-animal-panel="${escapeAttr(prefix)}">
            <p>Estos datos se comparan con contraindicaciones y precauciones guardadas. No bloquean el calculo.</p>
            <div class="farma-clinical-condition-grid">
              ${CLINICAL_CONDITION_OPTIONS.map((condition) => `
                <label class="farma-clinical-chip">
                  <input type="checkbox" name="${escapeAttr(name)}" value="${escapeAttr(condition.key)}" ${data.conditions.includes(condition.key) ? "checked" : ""} />
                  <span>${escapeHtml(condition.label)}</span>
                </label>
              `).join("")}
            </div>
            <label class="farma-field farma-field-wide">
              <span>+ Agregar condicion personalizada</span>
              <input class="sv-input" name="${escapeAttr(prefix)}-clinical-custom" value="${escapeAttr(data.custom || "")}" placeholder="Ej. Antecedente de convulsiones" />
            </label>
          </div>
        ` : ""}
      </section>
    `;
  }

  function renderClinicalAlerts(alerts = []) {
    const list = Array.isArray(alerts) ? alerts : [];
    if (!list.length) return "";
    return `
      <div class="farma-clinical-alerts" role="alert">
        <strong>Alertas clinicas detectadas</strong>
        <ul>
          ${list.map((alert) => `<li class="${escapeAttr(alert.level || "precaucion")}">${escapeHtml(alert.message || alert.text || "")}</li>`).join("")}
        </ul>
        <p>Esta alerta no reemplaza el criterio profesional. Revise la condicion clinica del paciente antes de administrar.</p>
      </div>
    `;
  }

  function renderFreeProcedure(state) {
    if (!state.freeProcedureVisible) return "";

    if (!state.freeResult || !state.freeResult.ok) {
      return `
        <section class="farma-procedure-box">
          <h3>Procedimiento</h3>
          <p>Primero calcula una dosis valida para mostrar formula y conversiones.</p>
        </section>
      `;
    }

    const result = state.freeResult;
    const conversionList = (result.conversions || []).length
      ? `<ul>${result.conversions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "<p>No se requirieron conversiones adicionales.</p>";

    return `
      <section class="farma-procedure-box">
        <h3>Procedimiento</h3>
        <p><strong>Formula base:</strong> Peso x dosis = dosis total requerida.</p>
        <p><strong>Formula final:</strong> Dosis total / concentracion = cantidad a administrar.</p>

        <div class="farma-procedure-steps">
          <p>1) ${escapeHtml(result.stepDose)}</p>
          <p>2) ${escapeHtml(result.stepDivision)}</p>
          <p>3) ${escapeHtml(result.stepFinal)}</p>
        </div>

        <h4>Regla de 3</h4>
        <p>${escapeHtml(result.ruleOfThree)}</p>

        <h4>Conversiones</h4>
        ${conversionList}

        <div class="farma-edu-warning">
          <strong>Recordatorio educativo:</strong>
          <span>No confundas mg/kg con mg/mL. mg/kg indica dosis segun peso; mg/mL indica concentracion del producto. Verifica especie, via y concentracion antes de administrar.</span>
        </div>
      </section>
    `;
  }

  function renderAdvancedBlock(state) {
    const groupOptions = buildGroupOptions(state.cat, state.freeAdvanced.grupoKey, state.farmacos);

    return `
      <section class="sv-card farma-advanced-card">
        <div class="sv-card-header">
          <div>
            <span class="sv-card-title">Modo profesional</span>
            <span class="sv-card-subtitle">Campos clinicos, componentes activos e interacciones educativas.</span>
          </div>
          <span class="sv-badge sv-badge-purple">Profesional</span>
        </div>

        <div class="farma-advanced-grid">
          ${inputField("Nombre comercial", "farma-adv-commercial", state.freeAdvanced.nombreComercial)}
          ${inputField("Laboratorio", "farma-adv-lab", state.freeAdvanced.laboratorio)}

          <label class="farma-field">
            <span>Grupo farmacologico</span>
            <select class="sv-select" id="farma-adv-group">
              <option value="">Seleccionar grupo</option>
              ${groupOptions}
            </select>
          </label>

          ${inputField("Funcion terapeutica", "farma-adv-func", state.freeAdvanced.funcionTerapeutica)}
          ${inputField("Mecanismo de accion (opcional)", "farma-adv-mechanism", state.freeAdvanced.mecanismoAccion)}
          ${textareaField("Descripcion", "farma-adv-description", state.freeAdvanced.descripcion)}
          ${routeField("Via principal", "farma-adv-via-select", "farma-adv-via-custom", state.freeAdvanced.viaAdministracion)}
          ${inputField("Frecuencia", "farma-adv-frequency", state.freeAdvanced.frecuencia)}
          ${inputField("Duracion del tratamiento", "farma-adv-duration", state.freeAdvanced.duracion)}
          ${clinicalObservationTextField("Contraindicaciones", "farma-adv-contra", state.freeAdvanced.contraindicaciones, "contraindicaciones", state)}
          ${clinicalObservationTextField("Precauciones", "farma-adv-precautions", state.freeAdvanced.precauciones, "precauciones", state)}
          ${textareaField("Efectos adversos", "farma-adv-adverse", state.freeAdvanced.efectosAdversos)}
          ${inputField("Tiempo de retiro / notas", "farma-adv-withdraw", state.freeAdvanced.tiempoRetiro)}
          ${textareaField("Observaciones clinicas", "farma-adv-observations", state.freeAdvanced.observaciones)}
          ${inputField("Bibliografia / fuente (opcional)", "farma-adv-source", state.freeAdvanced.bibliografia)}
        </div>

        <section class="farma-routes-block">
          <div class="farma-components-header">
            <h3>Vias de administracion adicionales</h3>
            <button type="button" class="sv-btn sv-btn-secondary" id="farma-add-route">+ Agregar via</button>
          </div>
          <div id="farma-routes-list" class="farma-routes-list">
            ${renderRouteList(state)}
          </div>
        </section>

        <section class="farma-dose-species-block">
          <div class="farma-components-header">
            <h3>Dosis por especies (profesional)</h3>
            <button type="button" class="sv-btn sv-btn-secondary" id="farma-add-species-dose">+ Agregar especie y dosis</button>
          </div>
          <div id="farma-species-dose-list" class="farma-species-dose-list">
            ${renderSpeciesDoseList(state)}
          </div>
        </section>

        <section class="farma-presentations-block">
          <div class="farma-components-header">
            <h3>Presentaciones y concentraciones</h3>
            <button type="button" class="sv-btn sv-btn-secondary" id="farma-add-presentation">+ Agregar presentacion</button>
          </div>
          <p class="farma-section-hint">La concentracion base de la calculadora queda como presentacion principal. Agrega otras solo si existen.</p>
          <div id="farma-presentations-list" class="farma-presentations-list">
            ${renderPresentationList(state)}
          </div>
        </section>

        <section class="farma-withdrawal-block">
          <div class="farma-components-header">
            <h3>Tiempo de retiro</h3>
            <button type="button" class="sv-btn sv-btn-secondary" id="farma-add-withdrawal">+ Agregar retiro</button>
          </div>
          <p class="farma-section-hint">Si no aplica o no esta especificado, dejalo marcado para que la ficha advierta al usuario.</p>
          <div id="farma-withdrawal-list" class="farma-withdrawal-list">
            ${renderWithdrawalList(state)}
          </div>
        </section>

        <section class="farma-product-photo-block">
          <div class="farma-components-header">
            <h3>Foto del producto</h3>
          </div>
          <div class="farma-product-photo-grid">
            <label class="farma-field">
              <span>Subir imagen</span>
              <input class="sv-input farma-file-input" type="file" id="farma-adv-photo-file" accept="image/*" />
            </label>
            ${inputField("O URL de imagen", "farma-adv-photo-url", state.freeAdvanced.productImageSource === "url" ? state.freeAdvanced.productImage : "")}
          </div>
          <div class="farma-product-photo-preview" id="farma-photo-preview">
            ${renderProductPhotoPreview(state)}
          </div>
          <div class="farma-product-photo-actions">
            <button type="button" class="sv-btn sv-btn-ghost" id="farma-photo-remove" ${state.freeAdvanced.productImage ? "" : "disabled"}>Quitar foto</button>
          </div>
        </section>

        <section class="farma-components-block">
          <div class="farma-components-header">
            <h3>Componentes activos</h3>
            <button type="button" class="sv-btn sv-btn-secondary" id="farma-add-component">+ Agregar componente activo</button>
          </div>
          <div id="farma-components-list" class="farma-components-list">
            ${renderComponentsList(state)}
          </div>
        </section>

        <section class="farma-interactions-block">
          <div class="farma-components-header">
            <h3>Interacciones farmacologicas</h3>
          </div>

          <label class="farma-field">
            <span>Evaluacion educativa</span>
            <select class="sv-select" id="farma-interaction-mode">
              <option value="auto" ${state.freeAdvanced.interactionMode === "auto" ? "selected" : ""}>Auto (segun grupos)</option>
              <option value="sinergismo" ${state.freeAdvanced.interactionMode === "sinergismo" ? "selected" : ""}>Posible sinergismo</option>
              <option value="antagonismo" ${state.freeAdvanced.interactionMode === "antagonismo" ? "selected" : ""}>Posible antagonismo</option>
              <option value="precaucion" ${state.freeAdvanced.interactionMode === "precaucion" ? "selected" : ""}>Precaucion</option>
              <option value="sin_alertas" ${state.freeAdvanced.interactionMode === "sin_alertas" ? "selected" : ""}>Sin alertas conocidas</option>
            </select>
          </label>

          <div id="farma-interaction-results" class="farma-interaction-results"></div>
        </section>
      </section>
    `;
  }

  function renderRouteList(state) {
    const rows = Array.isArray(state.freeAdvanced.routes) ? state.freeAdvanced.routes : [];
    if (!rows.length) {
      return `
        <div class="sv-empty">
          <div class="sv-empty-icon">+</div>
          Agrega vias adicionales si el producto puede usarse por mas de una ruta.
        </div>
      `;
    }

    return rows.map((row) => {
      const value = String(row.via || "").trim();
      const selectValue = !value ? "" : isKnownRoute(value) ? value : "Otro";
      return `
        <article class="sv-card farma-route-card" data-route-id="${escapeAttr(row.id)}">
          <div class="farma-route-grid">
            <label class="farma-field">
              <span>Via</span>
              <select class="sv-select" name="route-select">
                <option value="" ${!selectValue ? "selected" : ""}>Seleccionar via</option>
                ${ROUTE_OPTIONS.map((route) => `<option value="${escapeAttr(route.value)}" ${selectValue === route.value ? "selected" : ""}>${escapeHtml(route.label)}</option>`).join("")}
                <option value="Otro" ${selectValue === "Otro" ? "selected" : ""}>Otra</option>
              </select>
              ${selectValue === "Otro" ? `<input class="sv-input" name="route-custom" value="${escapeAttr(value)}" placeholder="Via personalizada" />` : ""}
            </label>
            ${inputFieldWithName("Observacion", "route-notas", row.notas || "")}
          </div>
          <div class="farma-species-dose-actions">
            <button type="button" class="sv-btn sv-btn-sm sv-btn-danger" data-route-remove="${escapeAttr(row.id)}">Eliminar</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderPresentationList(state) {
    const rows = Array.isArray(state.freeAdvanced.presentations) ? state.freeAdvanced.presentations : [];
    if (!rows.length) {
      return `
        <div class="sv-empty">
          <div class="sv-empty-icon">+</div>
          Sin presentaciones extra. Se usara la concentracion base del calculo como principal.
        </div>
      `;
    }

    return rows.map((row) => {
      const unit = row.unidadConcentracion || "mg/mL";
      const unitOptions = FREE_CONC_UNIT_OPTIONS.map((opt) =>
        `<option value="${escapeAttr(opt)}" ${unit === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`
      ).join("");

      return `
        <article class="sv-card farma-presentation-card" data-presentation-id="${escapeAttr(row.id)}">
          <div class="farma-presentation-grid">
            ${inputFieldWithName("Nombre de presentacion", "presentation-nombre", row.nombre || "")}
            ${numberFieldWithName("Concentracion", "presentation-concentracion", row.concentracion, "0", "any")}
            <label class="farma-field">
              <span>Unidad de concentracion</span>
              <select class="sv-select" name="presentation-unidadConcentracion">
                ${unitOptions}
              </select>
              ${unit === "Otro" ? `<input class="sv-input" name="presentation-unidadConcentracionCustom" placeholder="Unidad personalizada" value="${escapeAttr(row.unidadConcentracionCustom || "")}" />` : ""}
            </label>
            ${inputFieldWithName("Observacion", "presentation-notas", row.notas || "")}
          </div>
          <div class="farma-species-dose-actions">
            <button type="button" class="sv-btn sv-btn-sm sv-btn-danger" data-presentation-remove="${escapeAttr(row.id)}">Eliminar</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderWithdrawalList(state) {
    const rows = Array.isArray(state.freeAdvanced.withdrawalItems) && state.freeAdvanced.withdrawalItems.length
      ? state.freeAdvanced.withdrawalItems
      : [buildDefaultWithdrawalItem()];

    return rows.map((row) => {
      const status = row.estado || "no_especificado";
      return `
        <article class="sv-card farma-withdrawal-card" data-withdrawal-id="${escapeAttr(row.id)}">
          <div class="farma-withdrawal-grid">
            <label class="farma-field">
              <span>Producto</span>
              <select class="sv-select" name="withdrawal-tipo">
                ${WITHDRAWAL_TYPES.map((type) => `<option value="${escapeAttr(type)}" ${String(row.tipo || "") === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
              </select>
            </label>
            <label class="farma-field">
              <span>Estado</span>
              <select class="sv-select" name="withdrawal-estado">
                ${WITHDRAWAL_STATUS_OPTIONS.map((opt) => `<option value="${escapeAttr(opt.value)}" ${status === opt.value ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}
              </select>
            </label>
            ${status === "dias" ? numberFieldWithName("Dias", "withdrawal-dias", row.dias, "0", "1") : ""}
            ${inputFieldWithName("Observacion", "withdrawal-notas", row.notas || "")}
          </div>
          ${status === "no_especificado" ? `
            <p class="farma-withdrawal-warning">Tiempo de retiro no especificado. Verificar antes de usar en animales destinados a consumo humano.</p>
          ` : ""}
          <div class="farma-species-dose-actions">
            <button type="button" class="sv-btn sv-btn-sm sv-btn-danger" data-withdrawal-remove="${escapeAttr(row.id)}">Eliminar</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderComponentsList(state) {
    if (!state.freeComponents.length) {
      return `
        <div class="sv-empty">
          <div class="sv-empty-icon">+</div>
          Aun no hay componentes. Agrega uno solo si el producto es multicomponente.
        </div>
      `;
    }

    return state.freeComponents.map((comp) => {
      const groupOptions = buildGroupOptions(state.cat, comp.grupoKey || "", state.farmacos);
      const doseUnit = comp.unidadDosis || "mg/kg";
      const concUnit = comp.unidadConcentracion || "mg/mL";

      const doseUnitOptions = FREE_DOSE_UNIT_OPTIONS.map((opt) =>
        `<option value="${escapeAttr(opt)}" ${doseUnit === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`
      ).join("");

      const concUnitOptions = FREE_CONC_UNIT_OPTIONS.map((opt) =>
        `<option value="${escapeAttr(opt)}" ${concUnit === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`
      ).join("");

      const resultText = comp.result && comp.result.ok
        ? `${formatNum(comp.result.finalValue)} ${comp.result.finalUnit}`
        : "Completa peso, dosis y concentracion del componente.";

      return `
        <article class="sv-card farma-component-card" data-comp-id="${escapeAttr(comp.id)}">
          <div class="sv-card-header">
            <div>
              <span class="sv-card-title">Componente activo</span>
              <span class="sv-card-subtitle">Registro individual para productos combinados</span>
            </div>
            <button class="sv-btn sv-btn-sm sv-btn-danger" type="button" data-comp-remove="${escapeAttr(comp.id)}">Eliminar</button>
          </div>

          <div class="farma-component-grid">
            ${inputFieldWithName("Principio activo", `comp-nombre`, comp.nombre)}

            <label class="farma-field">
              <span>Grupo farmacologico</span>
              <select class="sv-select" name="comp-grupoKey">
                <option value="">Seleccionar grupo</option>
                ${groupOptions}
              </select>
            </label>

            ${numberFieldWithName("Concentracion", "comp-concentracion", comp.concentracion, "0", "any")}

            <label class="farma-field">
              <span>Unidad de concentracion</span>
              <select class="sv-select" name="comp-unidadConcentracion">
                ${concUnitOptions}
              </select>
              ${concUnit === "Otro" ? `<input class="sv-input" name="comp-unidadConcentracionCustom" placeholder="Unidad personalizada" value="${escapeAttr(comp.unidadConcentracionCustom || "")}" />` : ""}
            </label>

            ${numberFieldWithName("Dosis recomendada", "comp-dosis", comp.dosis, "0", "any")}

            <label class="farma-field">
              <span>Unidad de dosis</span>
              <select class="sv-select" name="comp-unidadDosis">
                ${doseUnitOptions}
              </select>
              ${doseUnit === "Otro" ? `<input class="sv-input" name="comp-unidadDosisCustom" placeholder="Unidad personalizada" value="${escapeAttr(comp.unidadDosisCustom || "")}" />` : ""}
            </label>

            <label class="farma-field farma-field-wide">
              <span>Funcion del componente</span>
              <input class="sv-input" name="comp-funcion" value="${escapeAttr(comp.funcion || "")}" />
            </label>

            <label class="farma-field farma-field-wide">
              <span>Observaciones</span>
              <textarea class="sv-input" name="comp-observaciones">${escapeHtml(comp.observaciones || "")}</textarea>
            </label>

            <label class="farma-field farma-field-wide">
              <span>Advertencias</span>
              <textarea class="sv-input" name="comp-advertencias">${escapeHtml(comp.advertencias || "")}</textarea>
            </label>

            <label class="farma-field farma-field-wide">
              <span>Resultado individual calculado</span>
              <div class="farma-component-result" data-comp-result>${escapeHtml(resultText)}</div>
            </label>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderSpeciesDoseList(state) {
    const rows = Array.isArray(state.freeAdvanced.speciesDoses) ? state.freeAdvanced.speciesDoses : [];
    if (!rows.length) {
      return `
        <div class="sv-empty">
          <div class="sv-empty-icon">+</div>
          Agrega dosis adicionales por especie cuando el producto cambie entre canino, felino, bovino, camelido, etc.
        </div>
      `;
    }

    return rows.map((row) => {
      const unit = row.unidadDosis || "mg/kg";
      const unitOptions = FREE_DOSE_UNIT_OPTIONS.map((opt) =>
        `<option value="${escapeAttr(opt)}" ${unit === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`
      ).join("");
      const speciesValue = String(row.especie || "").trim();
      const isKnownSpecies = SPECIES_OPTIONS.includes(speciesValue);
      const speciesSelect = !speciesValue ? "" : isKnownSpecies ? speciesValue : "Otro";

      return `
        <article class="sv-card farma-species-dose-card" data-dose-id="${escapeAttr(row.id)}">
          <div class="farma-species-dose-grid">
            <label class="farma-field">
              <span>Especie</span>
              <select class="sv-select" name="dose-especie-select">
                <option value="" ${!speciesSelect ? "selected" : ""}>Seleccionar especie</option>
                ${SPECIES_OPTIONS.map((species) => `<option value="${escapeAttr(species)}" ${speciesSelect === species ? "selected" : ""}>${escapeHtml(species)}</option>`).join("")}
                <option value="Otro" ${speciesSelect === "Otro" ? "selected" : ""}>Otro</option>
              </select>
              ${speciesSelect === "Otro" ? `<input class="sv-input" name="dose-especie-custom" value="${escapeAttr(speciesValue)}" placeholder="Especie personalizada" />` : ""}
            </label>

            ${numberFieldWithName("Dosis", "dose-dosis", row.dosis, "0", "any")}

            <label class="farma-field">
              <span>Unidad dosis</span>
              <select class="sv-select" name="dose-unidadDosis">
                ${unitOptions}
              </select>
              ${unit === "Otro" ? `<input class="sv-input" name="dose-unidadDosisCustom" placeholder="Unidad personalizada" value="${escapeAttr(row.unidadDosisCustom || "")}" />` : ""}
            </label>

            ${inputFieldWithName("Frecuencia sugerida", "dose-frecuencia", row.frecuencia || "")}
            ${inputFieldWithName("Duracion sugerida", "dose-duracion", row.duracion || "")}
            ${inputFieldWithName("Observacion por especie", "dose-observaciones", row.observaciones || row.notas || "")}
          </div>
          <div class="farma-species-dose-actions">
            <button type="button" class="sv-btn sv-btn-sm sv-btn-danger" data-dose-remove="${escapeAttr(row.id)}">Eliminar</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderProductPhotoPreview(state) {
    const image = String(state.freeAdvanced.productImage || "").trim();
    if (!image) {
      return `<p class="farma-photo-empty">Sin foto cargada.</p>`;
    }
    return `
      <img class="farma-photo-preview-image" src="${escapeAttr(image)}" alt="Foto de producto farmacologico" />
      <p class="farma-photo-name">${escapeHtml(state.freeAdvanced.productImageName || "Imagen cargada")}</p>
    `;
  }

  function buildInteractionAlerts(state) {
    const mode = state.freeAdvanced.interactionMode || "auto";
    const main = state.freeAdvanced.grupoKey;
    const compGroups = normalizedComponents(state.freeComponents).map((comp) => comp.grupoKey).filter(Boolean);

    if (mode !== "auto") {
      return [
        {
          level: normalizeInteractionLevel(mode),
          title: interactionTitle(mode),
          text: INTERACTION_MESSAGES[mode] || INTERACTION_MESSAGES.sin_alertas
        }
      ];
    }

    const alerts = [];

    if (main || compGroups.length) {
      alerts.push({
        level: "precaucion",
        title: "Precaucion",
        text: INTERACTION_MESSAGES.precaucion
      });
    }

    const categories = [main, ...compGroups].filter(Boolean);
    const inter = state.cat?.detectarInteracciones?.(categories) || [];

    inter.forEach((item) => {
      if (item.tipo === "sinergia") {
        alerts.push({ level: "sinergismo", title: "Posible sinergismo", text: INTERACTION_MESSAGES.sinergismo });
      } else if (item.tipo === "incompatible") {
        alerts.push({ level: "antagonismo", title: "Posible antagonismo", text: INTERACTION_MESSAGES.antagonismo });
      } else {
        alerts.push({ level: "precaucion", title: "Precaucion", text: INTERACTION_MESSAGES.precaucion });
      }

      if (item.texto) {
        alerts.push({ level: "precaucion", title: "Referencia de categoria", text: item.texto });
      }
    });

    if (!alerts.length) {
      alerts.push({
        level: "sin_alertas",
        title: "Sin alertas conocidas",
        text: INTERACTION_MESSAGES.sin_alertas
      });
    }

    return dedupeInteractionAlerts(alerts);
  }

  function dedupeInteractionAlerts(alerts) {
    const seen = new Set();
    const result = [];
    alerts.forEach((item) => {
      const key = `${item.level}|${item.text}`;
      if (seen.has(key)) return;
      seen.add(key);
      result.push(item);
    });
    return result;
  }

  function calculateFreeDose(form) {
    const warnings = [];

    const name = String(form.nombre || "").trim();
    const species = String(form.especie || "").trim();
    const weight = parseNum(form.pesoKg);
    const dose = parseNum(form.dosis);
    const conc = parseNum(form.concentracion);

    const doseUnit = resolveUnit(form.unidadDosis, form.unidadDosisCustom);
    const concUnit = resolveUnit(form.unidadConcentracion, form.unidadConcentracionCustom);

    if (!name) warnings.push("Advertencia educativa: ingresa nombre del farmaco para identificar el calculo.");
    if (!species) warnings.push("Advertencia educativa: especifica especie para contextualizar la dosis.");

    if (weight <= 0 || dose <= 0 || conc <= 0 || !doseUnit || !concUnit) {
      warnings.push("Advertencia educativa: faltan datos para calcular (peso, dosis, unidades y concentracion). ");
      return {
        ok: false,
        warnings
      };
    }

    const parsedDose = parseDoseUnit(doseUnit);
    const parsedConc = parseConcentrationUnit(concUnit, conc);

    if (!parsedDose.ok) {
      warnings.push(parsedDose.error || "No se pudo interpretar la unidad de dosis.");
      return { ok: false, warnings };
    }

    if (!parsedConc.ok) {
      warnings.push(parsedConc.error || "No se pudo interpretar la unidad de concentracion.");
      return { ok: false, warnings };
    }

    const conversions = [];
    let doseTotalValue = parsedDose.referenceKg ? (weight * dose) / parsedDose.referenceKg : parsedDose.isPerKg ? weight * dose : dose;
    const doseTotalUnit = parsedDose.baseUnit;
    const stepDoseText = parsedDose.referenceKg
      ? `${formatNum(weight)} kg x ${formatNum(dose)} ${doseUnit} / ${formatNum(parsedDose.referenceKg)} kg = ${formatNum(doseTotalValue)} ${doseTotalUnit}`
      : parsedDose.isPerKg
        ? `${formatNum(weight)} kg x ${formatNum(dose)} ${doseUnit} = ${formatNum(doseTotalValue)} ${doseTotalUnit}`
        : `Dosis fija por animal: ${formatNum(dose)} ${doseUnit} = ${formatNum(doseTotalValue)} ${doseTotalUnit}`;

    if (doseTotalUnit.toLowerCase() === parsedConc.denominatorUnit.toLowerCase()) {
      const stepDoseDirect = stepDoseText;
      const stepDivisionDirect = `La dosis ya esta expresada en ${parsedConc.denominatorUnit}; no se requiere dividir por concentracion.`;
      const stepFinalDirect = `${formatNum(doseTotalValue)} ${parsedConc.denominatorUnit}`;
      warnings.push("Nota educativa: la dosis esta en volumen por kg, por lo que la concentracion no modifica el resultado final.");
      return {
        ok: true,
        warnings,
        doseTotalValue,
        doseTotalUnit,
        finalValue: doseTotalValue,
        finalUnit: parsedConc.denominatorUnit,
        stepDose: stepDoseDirect,
        stepDivision: stepDivisionDirect,
        stepFinal: stepFinalDirect,
        ruleOfThree: `La dosis por kg ya determina el volumen final (${formatNum(doseTotalValue)} ${parsedConc.denominatorUnit}).`,
        conversions
      };
    }

    const converted = convertValue(doseTotalValue, doseTotalUnit, parsedConc.numeratorUnit);
    if (!converted.ok) {
      warnings.push(`No se pudo convertir ${doseTotalUnit} a ${parsedConc.numeratorUnit}. Verifica unidades.`);
      return { ok: false, warnings };
    }

    if (converted.note) conversions.push(converted.note);
    if (parsedConc.conversionNote) conversions.push(parsedConc.conversionNote);

    const finalValue = converted.value / parsedConc.valuePerDenominator;
    if (!Number.isFinite(finalValue) || finalValue <= 0) {
      warnings.push("Resultado no valido. Verifica dosis y concentracion.");
      return { ok: false, warnings };
    }

    const stepDose = stepDoseText;
    const stepDivision = `${formatNum(doseTotalValue)} ${doseTotalUnit} / ${formatNum(parsedConc.valuePerDenominator)} ${parsedConc.numeratorUnit}/${parsedConc.denominatorUnit}`;
    const stepFinal = `${formatNum(finalValue)} ${parsedConc.denominatorUnit}`;

    const ruleOfThree = `Si ${formatNum(parsedConc.valuePerDenominator)} ${parsedConc.numeratorUnit} estan en 1 ${parsedConc.denominatorUnit}, ${formatNum(converted.value)} ${parsedConc.numeratorUnit} estaran en ${formatNum(finalValue)} ${parsedConc.denominatorUnit}.`;

    return {
      ok: true,
      warnings,
      doseTotalValue,
      doseTotalUnit,
      finalValue,
      finalUnit: parsedConc.denominatorUnit,
      stepDose,
      stepDivision,
      stepFinal,
      ruleOfThree,
      conversions
    };
  }

  // ---------------------------------------------------------------------------
  // SUBMODULO 3: FARMACOS PERSONALIZADOS
  // ---------------------------------------------------------------------------
  function renderCustomDrugsSubmodule(panel, state) {
    const speciesOptions = listUnique(state.customItems.flatMap((item) => getCustomSpeciesDoses(item).map((row) => row.especie).filter(Boolean)));
    const groupOptions = listUnique(state.customItems.map((item) => item.grupoKey).filter(Boolean));

    panel.innerHTML = `
      <div class="farma-custom-shell">
        <div class="sv-toolbar sv-module-toolbar">
          <input type="text" class="sv-input" id="farma-custom-search" placeholder="Buscar por nombre..." value="${escapeAttr(state.customSearch)}" />

          <select class="sv-select" id="farma-custom-species" style="max-width:220px;">
            <option value="todas">Todas las especies</option>
            ${speciesOptions.map((sp) => `<option value="${escapeAttr(sp)}" ${state.customFilterSpecies === sp ? "selected" : ""}>${escapeHtml(sp)}</option>`).join("")}
          </select>

          <select class="sv-select" id="farma-custom-group" style="max-width:260px;">
            <option value="todas">Todos los grupos</option>
            ${groupOptions.map((group) => {
              const label = state.cat?.get?.(group)?.label || group;
              return `<option value="${escapeAttr(group)}" ${state.customFilterGroup === group ? "selected" : ""}>${escapeHtml(label)}</option>`;
            }).join("")}
          </select>

          <button type="button" class="sv-btn sv-btn-secondary" id="farma-custom-new">Nuevo desde Calculadora Libre</button>
        </div>

        ${state.customNotice ? renderSaveNotice(state.customNotice) : ""}

        <div class="sv-grid" id="farma-custom-list"></div>
      </div>
    `;

    const listRoot = panel.querySelector("#farma-custom-list");
    renderCustomCards(listRoot, state);

    bindInput(panel, "#farma-custom-search", (value) => {
      state.customSearch = value;
      renderCustomCards(listRoot, state);
    });

    bindSelect(panel, "#farma-custom-species", (value) => {
      state.customFilterSpecies = value;
      renderCustomCards(listRoot, state);
    });

    bindSelect(panel, "#farma-custom-group", (value) => {
      state.customFilterGroup = value;
      renderCustomCards(listRoot, state);
    });

    panel.querySelector("#farma-custom-new")?.addEventListener("click", () => {
      state.customNotice = null;
      resetFreeCalculatorState(state, { professional: true });
      state.activeSubmodule = "libre";
      renderSubmoduleFromPanel(panel, state);
    });

    listRoot?.addEventListener("click", (event) => {
      const emptyNew = event.target.closest("[data-custom-empty-new]");
      if (emptyNew) {
        state.customNotice = null;
        resetFreeCalculatorState(state, { professional: true });
        state.activeSubmodule = "libre";
        renderSubmoduleFromPanel(panel, state);
        return;
      }

      const calcAction = event.target.closest("[data-custom-calc-action]");
      if (calcAction) {
        const item = state.customItems.find((x) => x.id === calcAction.dataset.customId);
        if (!item) return;
        const actionType = calcAction.dataset.customCalcAction;

        if (actionType === "toggle-override") {
          const calc = getCustomCalcState(state, item);
          calc.overrideOpen = !calc.overrideOpen;
          renderCustomCards(listRoot, state);
          return;
        }

        if (actionType === "toggle-clinical") {
          const calc = getCustomCalcState(state, item);
          calc.clinicalOpen = !calc.clinicalOpen;
          renderCustomCards(listRoot, state);
          return;
        }

        if (actionType === "calculate") {
          calculateCustomCardDose(state, item);
          renderCustomCards(listRoot, state);
          return;
        }

        if (actionType === "save-presentation") {
          const saved = saveCustomTemporaryPresentation(state, item);
          if (saved) persistCustom(state);
          renderCustomCards(listRoot, state);
          return;
        }
      }

      const action = event.target.closest("[data-custom-action]");
      if (!action) return;
      const id = action.dataset.customId;
      const item = state.customItems.find((x) => x.id === id);
      if (!item) return;

      const act = action.dataset.customAction;
      if (act === "reuse") {
        loadCustomIntoCalculator(state, item, false);
        state.activeSubmodule = "libre";
        renderSubmoduleFromPanel(panel, state);
        return;
      }

      if (act === "edit") {
        loadCustomIntoCalculator(state, item, true);
        state.activeSubmodule = "libre";
        renderSubmoduleFromPanel(panel, state);
        return;
      }

      if (act === "recipe") {
        const calc = calculateCustomCardDose(state, item, { silent: true });
        if (!calc.ok) {
          renderCustomCards(listRoot, state);
          return;
        }
        const payload = buildRecipePayloadFromCustom(item, calc.calcState);
        const added = addPayloadToRecipe(payload);
        if (added) {
          if (calc.calcState.lastHistoryId) patchHistoryEntry(state, calc.calcState.lastHistoryId, { enviadoRecetario: true });
          calc.calcState.notice = { level: "success", text: "Agregado al recetario." };
        } else {
          calc.calcState.notice = { level: "error", text: "No se envio al recetario." };
        }
        renderCustomCards(listRoot, state);
        return;
      }

      if (act === "delete") {
        if (!confirm("Eliminar este farmaco personalizado?")) return;
        state.customItems = state.customItems.filter((x) => x.id !== item.id);
        persistCustom(state);
        renderCustomCards(listRoot, state);
      }
    });

    listRoot?.addEventListener("input", (event) => {
      updateCustomCalcField(state, event.target);
    });

    listRoot?.addEventListener("change", (event) => {
      if (updateCustomCalcField(state, event.target)) {
        renderCustomCards(listRoot, state);
      }
    });
  }

  function renderCustomCards(container, state) {
    if (!container) return;

    const query = (state.customSearch || "").trim().toLowerCase();
    const filtered = state.customItems.filter((item) => {
      const matchQuery = !query || `${item.nombre || ""} ${item.nombreComercial || ""} ${item.funcionTerapeutica || ""}`.toLowerCase().includes(query);
      const itemSpecies = getCustomSpeciesDoses(item).map((row) => row.especie);
      const matchSpecies = state.customFilterSpecies === "todas" || itemSpecies.includes(state.customFilterSpecies);
      const matchGroup = state.customFilterGroup === "todas" || item.grupoKey === state.customFilterGroup;
      return matchQuery && matchSpecies && matchGroup;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

    if (!filtered.length) {
      container.innerHTML = `
        <div class="sv-empty">
          <div class="sv-empty-icon">+</div>
          <p>No hay farmacos personalizados con ese criterio.</p>
          <button class="sv-btn sv-btn-secondary" type="button" data-custom-empty-new>Crear desde Calculadora Libre</button>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    filtered.forEach((item) => {
      const card = document.createElement("article");
      const groupLabel = state.cat?.get?.(item.grupoKey)?.label || item.grupoKey || "Sin grupo";
      const groupIcon = state.cat?.get?.(item.grupoKey)?.icon || "?";
      const components = normalizedComponents(item.componentes || []);
      const interactions = Array.isArray(item.interacciones) ? item.interacciones : [];
      const speciesDoses = getCustomSpeciesDoses(item);
      const routes = getCustomRoutes(item);
      const presentations = getCustomPresentations(item);
      const withdrawalItems = normalizeWithdrawalItems(item.withdrawalItems || item.tiemposRetiro || [], item.tiempoRetiro);
      const secondaryGroups = listUnique(components.map((comp) => comp.grupoKey).filter((group) => group && group !== item.grupoKey));
      const calcState = getCustomCalcState(state, item);
      const hasContra = Boolean(String(item.contraindicaciones || "").trim());
      const hasPrecautions = Boolean(String(item.precauciones || "").trim());
      const componentSummary = components.length
        ? components.map((comp) => `${comp.nombre || "Componente"} ${formatComponentConcentration(comp)}`.trim()).join(" + ")
        : "Sin componentes activos registrados";

      card.className = "cat-card sv-card sv-fade-in";
      card.setAttribute("data-categoria", item.grupoKey || "default");
      card.dataset.favId = `farmacologia-personalizado-${escapeAttr(item.id)}`;
      card.dataset.favTitle = item.nombre || "Farmaco personalizado";
      card.dataset.favModule = "Farmacologia";
      card.dataset.favSubmodule = "Farmacos personalizados";
      card.dataset.favType = "Personalizado";
      card.dataset.favDescription = item.descripcion || item.funcionTerapeutica || "";

      card.innerHTML = `
        <div class="sv-card-header">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            ${state.cat ? state.cat.iconCircle(item.grupoKey || "default") : `<span>${escapeHtml(groupIcon)}</span>`}
            <div>
              <span class="sv-card-title">${escapeHtml(item.nombre || "Farmaco")}</span>
              <span class="sv-card-subtitle">${escapeHtml(componentSummary)}</span>
            </div>
          </div>
          ${state.cat ? state.cat.badge(item.grupoKey || "default") : `<span class="sv-badge sv-badge-gray">${escapeHtml(groupLabel)}</span>`}
        </div>

        <div class="sv-card-body">
          ${item.nombreComercial ? `<p><strong>Nombre comercial:</strong> ${escapeHtml(item.nombreComercial)}</p>` : ""}
          <p><strong>Grupo principal:</strong> ${escapeHtml(groupLabel)}</p>
          ${secondaryGroups.length ? `<p><strong>Tambien contiene:</strong> ${secondaryGroups.map((group) => state.cat ? state.cat.badgeMini(group) : `<span class="sv-badge sv-badge-gray">${escapeHtml(group)}</span>`).join(" ")}</p>` : ""}
          <p><strong>Funcion terapeutica:</strong> ${escapeHtml(item.funcionTerapeutica || "N/D")}</p>
          ${item.mecanismoAccion ? `<p><strong>Mecanismo:</strong> ${escapeHtml(item.mecanismoAccion)}</p>` : ""}
          <p><strong>Descripcion:</strong> ${escapeHtml(item.descripcion || item.observaciones || "N/D")}</p>
          <p><strong>Vias:</strong> ${escapeHtml(routes.map(formatRouteShort).join(" / ") || "N/D")}</p>
          <p><strong>Concentracion principal:</strong> ${escapeHtml(formatPresentation(presentations[0]))}</p>
          <p><strong>Retiro:</strong> ${escapeHtml(formatWithdrawalSummary(withdrawalItems, item.tiempoRetiro) || "No especificado")}</p>
          <p><strong>Creado:</strong> ${escapeHtml(formatDateTime(item.createdAt))}</p>
          <p><strong>Ultima edicion:</strong> ${escapeHtml(formatDateTime(item.updatedAt || item.createdAt))}</p>
        </div>

        ${(hasContra || hasPrecautions) ? `
          <details class="farma-clinical-summary">
            <summary>
              ${hasContra ? `<span class="sv-badge sv-badge-red">Contraindicaciones registradas</span>` : ""}
              ${hasPrecautions ? `<span class="sv-badge sv-badge-orange">Precauciones clinicas</span>` : ""}
            </summary>
            <div>
              ${hasContra ? `<p><strong>Contraindicaciones:</strong> ${escapeHtml(item.contraindicaciones)}</p>` : ""}
              ${hasPrecautions ? `<p><strong>Precauciones:</strong> ${escapeHtml(item.precauciones)}</p>` : ""}
            </div>
          </details>
        ` : ""}

        ${item.productImage ? `
          <div class="farma-product-thumb-wrap">
            <img class="farma-product-thumb" src="${escapeAttr(item.productImage)}" alt="Foto de ${escapeAttr(item.nombre || "producto")}" />
          </div>
        ` : ""}

        ${components.length ? `
          <div class="farma-mini-box">
            <strong>Componentes activos:</strong>
            <ul>
              ${components.map((comp) => `<li>${escapeHtml(comp.nombre || "Componente")} - ${escapeHtml(formatComponentConcentration(comp))}${comp.grupoKey ? ` - ${escapeHtml(state.cat?.get?.(comp.grupoKey)?.label || comp.grupoKey)}` : ""}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${speciesDoses.length ? `
          <div class="farma-mini-box">
            <strong>Dosis disponibles:</strong>
            <ul>
              ${speciesDoses.map((row) => `<li>${escapeHtml(speciesDoseLabel(row))}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${presentations.length > 1 ? `
          <div class="farma-mini-box">
            <strong>Presentaciones:</strong>
            <ul>${presentations.map((row) => `<li>${escapeHtml(formatPresentation(row))}</li>`).join("")}</ul>
          </div>
        ` : ""}

        ${interactions.length ? `
          <div class="farma-mini-box">
            <strong>Interacciones registradas:</strong>
            <ul>
              ${interactions.map((it) => `<li>${escapeHtml(it.text || it)}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${renderCustomCalculatorPanel(item, state, calcState, speciesDoses, routes, presentations)}

        <div class="sv-card-footer farma-custom-actions">
          <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-custom-action="reuse" data-custom-id="${escapeAttr(item.id)}">Reutilizar</button>
          <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-custom-action="edit" data-custom-id="${escapeAttr(item.id)}">Editar ficha</button>
          <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-custom-action="recipe" data-custom-id="${escapeAttr(item.id)}">Agregar al recetario</button>
          <button class="sv-btn sv-btn-sm sv-btn-danger" type="button" data-custom-action="delete" data-custom-id="${escapeAttr(item.id)}">Eliminar</button>
        </div>
      `;

      window.SuiteVet?.Favorites?.bindCard?.(card);
      container.appendChild(card);
    });
  }

  function renderCustomCalculatorPanel(item, state, calcState, speciesDoses, routes, presentations) {
    const selectedSpeciesIndex = clampIndex(calcState.speciesIndex, speciesDoses.length);
    const selectedPresentationIndex = clampIndex(calcState.presentationIndex, presentations.length);
    const selectedRoute = calcState.route || routes[0] || "";
    const selectedPresentation = presentations[selectedPresentationIndex] || presentations[0] || null;
    const result = calcState.result;
    const notice = calcState.notice;
    const tempUnit = calcState.tempUnit || selectedPresentation?.unidadConcentracion || item.unidadConcentracion || "mg/mL";
    const tempUnitOptions = FREE_CONC_UNIT_OPTIONS.map((opt) =>
      `<option value="${escapeAttr(opt)}" ${tempUnit === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`
    ).join("");

    return `
      <section class="farma-custom-calc" data-custom-calc-id="${escapeAttr(item.id)}">
        <div class="farma-custom-calc-header">
          <strong>Calculo rapido desde ficha</strong>
          <span>Selecciona especie+dosis, via y peso.</span>
        </div>

        <div class="farma-custom-calc-grid">
          <label class="farma-field">
            <span>Especie + dosis</span>
            <select class="sv-select" name="custom-species-dose">
              ${speciesDoses.map((row, index) => `<option value="${index}" ${selectedSpeciesIndex === index ? "selected" : ""}>${escapeHtml(speciesDoseLabel(row))}</option>`).join("")}
            </select>
          </label>

          <label class="farma-field">
            <span>Via</span>
            <select class="sv-select" name="custom-route">
              ${routes.map((route) => `<option value="${escapeAttr(route)}" ${selectedRoute === route ? "selected" : ""}>${escapeHtml(formatRouteFull(route))}</option>`).join("")}
            </select>
          </label>

          <label class="farma-field">
            <span>Peso (kg)</span>
            <input type="number" class="sv-input" name="custom-weight" min="0" step="0.01" value="${escapeAttr(calcState.weight || "")}" />
          </label>

          <label class="farma-field">
            <span>Presentacion guardada</span>
            <select class="sv-select" name="custom-presentation">
              ${presentations.map((row, index) => `<option value="${index}" ${selectedPresentationIndex === index ? "selected" : ""}>${escapeHtml(formatPresentation(row))}</option>`).join("")}
            </select>
          </label>
        </div>

        <div class="farma-saved-concentration">
          <span>Concentracion guardada del producto</span>
          <strong>${escapeHtml(formatPresentation(selectedPresentation))}</strong>
          <button class="sv-btn sv-btn-sm sv-btn-ghost" type="button" data-custom-calc-action="toggle-override" data-custom-id="${escapeAttr(item.id)}">
            ${calcState.overrideOpen ? "Ocultar otra presentacion" : "Usar otra presentacion"}
          </button>
        </div>

        ${calcState.overrideOpen ? `
          <div class="farma-temp-presentation">
            ${numberFieldWithName("Concentracion temporal", "custom-temp-concentration", calcState.tempConcentration || "", "0", "any")}
            <label class="farma-field">
              <span>Unidad temporal</span>
              <select class="sv-select" name="custom-temp-unit">
                ${tempUnitOptions}
              </select>
              ${tempUnit === "Otro" ? `<input class="sv-input" name="custom-temp-unit-custom" placeholder="Unidad personalizada" value="${escapeAttr(calcState.tempUnitCustom || "")}" />` : ""}
            </label>
            ${inputFieldWithName("Nombre si se guarda", "custom-temp-name", calcState.tempName || "")}
            <div class="farma-temp-actions">
              <span>Modificar solo para este calculo no altera la ficha original.</span>
              <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-custom-calc-action="save-presentation" data-custom-id="${escapeAttr(item.id)}">Guardar como nueva presentacion</button>
            </div>
          </div>
        ` : ""}

        ${renderClinicalAnimalSection(`custom-${item.id}`, {
          open: calcState.clinicalOpen,
          conditions: calcState.clinicalConditions,
          custom: calcState.clinicalCustom
        })}

        ${notice ? `<div class="farma-custom-calc-notice ${escapeAttr(notice.level || "info")}">${escapeHtml(notice.text || "")}</div>` : ""}
        ${renderClinicalAlerts(calcState.clinicalAlerts)}

        ${result && result.ok ? `
          <div class="farma-custom-calc-result">
            <span>Dosis total: <strong>${formatNum(result.doseTotalValue)} ${escapeHtml(result.doseTotalUnit)}</strong></span>
            <span>Administrar: <strong>${formatNum(result.finalValue)} ${escapeHtml(result.finalUnit)}</strong></span>
          </div>
        ` : ""}

        <div class="farma-custom-calc-actions">
          <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-custom-calc-action="calculate" data-custom-id="${escapeAttr(item.id)}">Calcular</button>
        </div>
      </section>
    `;
  }

  function getCustomCalcState(state, item) {
    state.customCalcForms = state.customCalcForms || {};
    const id = item.id;
    const speciesDoses = getCustomSpeciesDoses(item);
    const routes = getCustomRoutes(item);
    const presentations = getCustomPresentations(item);
    const current = state.customCalcForms[id] || {};
    const selectedPresentation = presentations[clampIndex(current.presentationIndex, presentations.length)] || presentations[0] || {};
    const next = {
      speciesIndex: clampIndex(current.speciesIndex, speciesDoses.length),
      route: current.route || routes[0] || "",
      weight: current.weight != null ? String(current.weight) : (item.pesoKg ? String(item.pesoKg) : ""),
      presentationIndex: clampIndex(current.presentationIndex, presentations.length),
      overrideOpen: Boolean(current.overrideOpen),
      tempConcentration: current.tempConcentration || "",
      tempUnit: current.tempUnit || selectedPresentation.unidadConcentracion || item.unidadConcentracion || "mg/mL",
      tempUnitCustom: current.tempUnitCustom || "",
      tempName: current.tempName || "",
      clinicalOpen: Boolean(current.clinicalOpen),
      clinicalConditions: Array.isArray(current.clinicalConditions) ? current.clinicalConditions.slice() : [],
      clinicalCustom: current.clinicalCustom || "",
      clinicalAlerts: Array.isArray(current.clinicalAlerts) ? current.clinicalAlerts : [],
      result: current.result || null,
      notice: current.notice || null,
      lastHistoryId: current.lastHistoryId || ""
    };
    state.customCalcForms[id] = next;
    return next;
  }

  function updateCustomCalcField(state, target) {
    const root = target.closest?.("[data-custom-calc-id]");
    if (!root) return false;
    const item = state.customItems.find((x) => x.id === root.dataset.customCalcId);
    if (!item) return false;
    const calc = getCustomCalcState(state, item);
    const name = target.name || "";
    let rerender = false;

    if (name === "custom-species-dose") {
      calc.speciesIndex = parseNum(target.value);
      calc.result = null;
      rerender = true;
    }
    if (name === "custom-route") {
      calc.route = target.value;
      calc.result = null;
    }
    if (name === "custom-weight") {
      calc.weight = target.value;
      calc.result = null;
    }
    if (name === "custom-presentation") {
      calc.presentationIndex = parseNum(target.value);
      calc.result = null;
      rerender = true;
    }
    if (name === "custom-temp-concentration") {
      calc.tempConcentration = target.value;
      calc.result = null;
    }
    if (name === "custom-temp-unit") {
      calc.tempUnit = target.value;
      calc.tempUnitCustom = target.value === "Otro" ? calc.tempUnitCustom : "";
      calc.result = null;
      rerender = true;
    }
    if (name === "custom-temp-unit-custom") {
      calc.tempUnitCustom = target.value;
      calc.result = null;
    }
    if (name === "custom-temp-name") {
      calc.tempName = target.value;
    }
    if (name.endsWith("-clinical-condition")) {
      calc.clinicalConditions = Array.from(root.querySelectorAll("input[type='checkbox']:checked"))
        .filter((input) => input.name === name)
        .map((input) => input.value)
        .filter(Boolean);
      calc.clinicalAlerts = [];
    }
    if (name.endsWith("-clinical-custom")) {
      calc.clinicalCustom = target.value;
      calc.clinicalAlerts = [];
    }

    calc.notice = null;
    return rerender;
  }

  function calculateCustomCardDose(state, item, opts = {}) {
    const calcState = getCustomCalcState(state, item);
    const speciesDoses = getCustomSpeciesDoses(item);
    const presentations = getCustomPresentations(item);
    const doseRow = speciesDoses[clampIndex(calcState.speciesIndex, speciesDoses.length)];
    const presentation = presentations[clampIndex(calcState.presentationIndex, presentations.length)] || presentations[0];
    const overrideConc = parseNum(calcState.tempConcentration);
    const useOverride = calcState.overrideOpen && overrideConc > 0;
    const concentration = useOverride ? overrideConc : parseNum(presentation?.concentracion);
    const concentrationUnit = useOverride
      ? resolveUnit(calcState.tempUnit, calcState.tempUnitCustom)
      : String(presentation?.unidadConcentracion || item.unidadConcentracion || "").trim();

    const form = {
      nombre: item.nombre || "",
      especie: doseRow?.especie || item.especie || "",
      viaAdministracion: calcState.route || getCustomRoutes(item)[0] || "",
      pesoKg: calcState.weight,
      dosis: doseRow?.dosis,
      unidadDosis: doseRow?.unidadDosis || item.unidadDosis,
      unidadDosisCustom: "",
      concentracion: concentration,
      unidadConcentracion: concentrationUnit,
      unidadConcentracionCustom: ""
    };

    const result = calculateFreeDose(form);
    calcState.result = result;
    if (!result.ok) {
      calcState.clinicalAlerts = [];
      calcState.notice = {
        level: "warning",
        text: "No se pudo calcular. Revisa especie+dosis, peso, concentracion y unidad."
      };
      return { ok: false, calcState, result };
    }

    const presentationName = useOverride
      ? (calcState.tempName || "Presentacion temporal")
      : (presentation?.nombre || "Presentacion guardada");
    const clinicalData = normalizeClinicalAnimalData({
      open: calcState.clinicalOpen,
      conditions: calcState.clinicalConditions,
      custom: calcState.clinicalCustom
    });
    const clinicalAlerts = evaluateClinicalSafety({
      clinical: clinicalData,
      contraindicaciones: item.contraindicaciones,
      precauciones: item.precauciones
    });
    calcState.clinicalAlerts = clinicalAlerts;
    const historyId = appendHistoryEntry(state, {
      farmaco: item.nombre,
      especie: form.especie,
      peso: parseNum(form.pesoKg),
      dosis: parseNum(form.dosis),
      unidadDosis: form.unidadDosis,
      viaAdministracion: form.viaAdministracion,
      concentracion: concentration,
      unidadConcentracion: concentrationUnit,
      presentacion: presentationName,
      concentracionModificada: useOverride,
      dosisTotal: result.doseTotalValue,
      dosisTotalUnidad: result.doseTotalUnit,
      resultadoCalculado: `${formatNum(result.finalValue)} ${result.finalUnit}`,
      tipoCalculo: "profesional",
      origen: "Farmaco personalizado",
      enviadoRecetario: false,
      guardadoPersonalizado: true,
      contieneComponentes: (item.componentes || []).length > 0,
      advertencias: item.advertencias || [],
      datosClinicos: clinicalData,
      alertasClinicas: clinicalAlerts,
      interacciones: (item.interacciones || []).map((x) => x.text || x),
      snapshot: buildCustomCalcSnapshot(item, form, result, presentationName, useOverride, clinicalData, clinicalAlerts)
    }, { dedupeMs: opts.silent ? 2500 : 0 });

    calcState.lastHistoryId = historyId;
    calcState.notice = opts.silent ? null : {
      level: clinicalAlerts.length ? "warning" : "success",
      text: clinicalAlerts.length ? `Calculo guardado con ${clinicalAlerts.length} alerta(s) clinica(s).` : "Calculo guardado en historial."
    };
    return { ok: true, calcState, result };
  }

  function saveCustomTemporaryPresentation(state, item) {
    const calc = getCustomCalcState(state, item);
    const concentration = parseNum(calc.tempConcentration);
    const unit = resolveUnit(calc.tempUnit, calc.tempUnitCustom);
    if (!(concentration > 0) || !unit) {
      calc.notice = { level: "warning", text: "Completa concentracion y unidad para guardar la presentacion." };
      return false;
    }
    if (typeof confirm === "function" && !confirm("Guardar esta concentracion como nueva presentacion de la ficha?")) {
      calc.notice = { level: "warning", text: "No se guardo la presentacion." };
      return false;
    }

    const nextPresentation = {
      id: createId("presentation"),
      nombre: calc.tempName || "Nueva presentacion",
      concentracion: concentration,
      unidadConcentracion: unit,
      notas: "Agregada desde tarjeta personalizada",
      principal: false
    };

    state.customItems = state.customItems.map((current) => {
      if (current.id !== item.id) return current;
      const presentations = getCustomPresentations(current).concat(nextPresentation);
      return {
        ...current,
        presentations: normalizedPresentations(presentations),
        updatedAt: new Date().toISOString()
      };
    });

    calc.presentationIndex = getCustomPresentations({ ...item, presentations: getCustomPresentations(item).concat(nextPresentation) }).length - 1;
    calc.overrideOpen = false;
    calc.tempConcentration = "";
    calc.tempUnitCustom = "";
    calc.tempName = "";
    calc.notice = { level: "success", text: "Nueva presentacion guardada en la ficha." };
    return true;
  }

  function buildCustomCalcSnapshot(item, form, result, presentationName, modified, clinicalData = null, clinicalAlerts = []) {
    return {
      source: "farmaco_personalizado",
      customId: item.id,
      form: {
        nombre: form.nombre,
        especie: form.especie,
        viaAdministracion: form.viaAdministracion,
        pesoKg: parseNum(form.pesoKg),
        dosis: parseNum(form.dosis),
        unidadDosis: form.unidadDosis,
        concentracion: parseNum(form.concentracion),
        unidadConcentracion: form.unidadConcentracion
      },
      advanced: {
        nombreComercial: item.nombreComercial || "",
        laboratorio: item.laboratorio || "",
        grupoKey: item.grupoKey || "",
        funcionTerapeutica: item.funcionTerapeutica || "",
        mecanismoAccion: item.mecanismoAccion || "",
        descripcion: item.descripcion || "",
        viaAdministracion: form.viaAdministracion || "",
        routes: getCustomRoutes(item),
        speciesDoses: getCustomSpeciesDoses(item),
        presentations: getCustomPresentations(item),
        withdrawalItems: normalizeWithdrawalItems(item.withdrawalItems || item.tiemposRetiro || [], item.tiempoRetiro),
        frecuencia: item.frecuencia || "",
        duracion: item.duracion || "",
        contraindicaciones: item.contraindicaciones || "",
        precauciones: item.precauciones || "",
        clinicalObservations: normalizeClinicalObservations(item.clinicalObservations || item.observacionesClinicas),
        observaciones: item.observaciones || "",
        tiempoRetiro: item.tiempoRetiro || "",
        presentacionUsada: presentationName,
        concentracionModificada: Boolean(modified)
      },
      clinicalAnimal: normalizeClinicalAnimalData(clinicalData),
      clinicalAlerts: Array.isArray(clinicalAlerts) ? clinicalAlerts : [],
      components: normalizedComponents(item.componentes || []),
      result: {
        doseTotalValue: result.doseTotalValue,
        doseTotalUnit: result.doseTotalUnit,
        finalValue: result.finalValue,
        finalUnit: result.finalUnit
      }
    };
  }

  function getCustomSpeciesDoses(item) {
    const rows = Array.isArray(item.speciesDoses) ? item.speciesDoses : [];
    const fallback = {
      especie: item.especie || "",
      dosis: item.dosis,
      unidadDosis: item.unidadDosis || "",
      frecuencia: item.frecuencia || "",
      duracion: item.duracion || "",
      observaciones: item.observaciones || ""
    };
    return dedupeSpeciesDoses([fallback, ...rows]);
  }

  function getCustomRoutes(item) {
    return normalizedRoutes([
      item.viaAdministracion,
      ...(Array.isArray(item.vias) ? item.vias : []),
      ...(Array.isArray(item.routes) ? item.routes : [])
    ]);
  }

  function getCustomPresentations(item) {
    const main = {
      id: "main",
      nombre: "Presentacion principal",
      concentracion: item.concentracion,
      unidadConcentracion: item.unidadConcentracion,
      notas: ""
    };
    return normalizedPresentations(item.presentations || item.presentaciones || [], main);
  }

  function speciesDoseLabel(row) {
    const species = String(row?.especie || "Especie").trim();
    const dose = Number(row?.dosis) > 0 ? formatNum(row.dosis) : "N/D";
    const unit = String(row?.unidadDosis || "").trim();
    const freq = String(row?.frecuencia || "").trim();
    const dur = String(row?.duracion || "").trim();
    const note = String(row?.observaciones || row?.notas || "").trim();
    return [`${species} - ${dose} ${unit}`.trim(), freq, dur, note].filter(Boolean).join(" | ");
  }

  function formatRouteShort(route) {
    const value = String(route || "").trim();
    const found = ROUTE_OPTIONS.find((item) => item.value === value);
    return found ? found.value : value;
  }

  function formatRouteFull(route) {
    const value = String(route || "").trim();
    const found = ROUTE_OPTIONS.find((item) => item.value === value);
    return found ? found.label.replace("(", "- ").replace(")", "") : value;
  }

  function formatPresentation(row) {
    if (!row) return "N/D";
    const name = String(row.nombre || "Presentacion").trim();
    const concentration = Number(row.concentracion) > 0
      ? `${formatNum(row.concentracion)} ${row.unidadConcentracion || ""}`.trim()
      : "sin concentracion";
    return `${name}: ${concentration}`;
  }

  function formatComponentConcentration(comp) {
    const value = Number(comp?.concentracion);
    const unit = String(comp?.unidadConcentracion || "").trim();
    if (!Number.isFinite(value) || value <= 0 || !unit) return "";
    const equivalence = concentrationEquivalence(value, unit);
    return equivalence ? `${formatNum(value)} ${unit} (${equivalence})` : `${formatNum(value)} ${unit}`;
  }

  function concentrationEquivalence(value, unit) {
    const normalized = String(unit || "").replace(/\s+/g, "").toLowerCase();
    if (normalized === "%") return `${formatNum(Number(value) * 10)} mg/mL`;
    if (normalized === "g/100ml") return `${formatNum(Number(value) * 10)} mg/mL`;
    return "";
  }

  function clampIndex(index, length) {
    const size = Number(length) || 0;
    if (size <= 0) return 0;
    const n = Number(index);
    if (!Number.isFinite(n) || n < 0) return 0;
    if (n >= size) return size - 1;
    return Math.floor(n);
  }


  function loadCustomIntoCalculator(state, item, editingMode) {
    state.freeForm = {
      nombre: item.nombre || "",
      especie: item.especie || "",
      viaAdministracion: item.viaAdministracion || "",
      pesoKg: item.pesoKg != null ? String(item.pesoKg) : "",
      dosis: item.dosis != null ? String(item.dosis) : "",
      unidadDosis: normalizeFreeUnit(item.unidadDosis, FREE_DOSE_UNIT_OPTIONS),
      unidadDosisCustom: needsCustomUnit(item.unidadDosis, FREE_DOSE_UNIT_OPTIONS) ? item.unidadDosis : "",
      concentracion: item.concentracion != null ? String(item.concentracion) : "",
      unidadConcentracion: normalizeFreeUnit(item.unidadConcentracion, FREE_CONC_UNIT_OPTIONS),
      unidadConcentracionCustom: needsCustomUnit(item.unidadConcentracion, FREE_CONC_UNIT_OPTIONS) ? item.unidadConcentracion : ""
    };

    state.freeAdvanced = {
      nombreComercial: item.nombreComercial || "",
      laboratorio: item.laboratorio || "",
      grupoKey: item.grupoKey || "",
      funcionTerapeutica: item.funcionTerapeutica || "",
      mecanismoAccion: item.mecanismoAccion || "",
      descripcion: item.descripcion || "",
      viaAdministracion: item.viaAdministracion || "",
      frecuencia: item.frecuencia || "",
      duracion: item.duracion || "",
      contraindicaciones: item.contraindicaciones || "",
      precauciones: item.precauciones || "",
      clinicalObservations: normalizeClinicalObservations(item.clinicalObservations || item.observacionesClinicas),
      efectosAdversos: item.efectosAdversos || "",
      tiempoRetiro: item.tiempoRetiro || "",
      observaciones: item.observaciones || "",
      bibliografia: item.bibliografia || "",
      interactionMode: item.interactionMode || "auto",
      speciesDoses: (item.speciesDoses || []).map((row) => ({
        id: createId("sdose"),
        especie: row.especie || "",
        dosis: row.dosis != null ? String(row.dosis) : "",
        unidadDosis: normalizeFreeUnit(row.unidadDosis, FREE_DOSE_UNIT_OPTIONS),
        unidadDosisCustom: needsCustomUnit(row.unidadDosis, FREE_DOSE_UNIT_OPTIONS) ? row.unidadDosis : "",
        frecuencia: row.frecuencia || "",
        duracion: row.duracion || "",
        observaciones: row.observaciones || row.notas || "",
        notas: row.notas || ""
      })),
      routes: (item.vias || item.routes || []).map((row) => ({
        id: createId("route"),
        via: typeof row === "string" ? row : (row.via || row.value || ""),
        notas: typeof row === "string" ? "" : (row.notas || "")
      })),
      presentations: (item.presentations || item.presentaciones || [])
        .filter((row) => String(row.id || "") !== "main")
        .map((row) => ({
          id: createId("presentation"),
          nombre: row.nombre || row.name || "",
          concentracion: row.concentracion != null ? String(row.concentracion) : "",
          unidadConcentracion: normalizeFreeUnit(row.unidadConcentracion || row.unit, FREE_CONC_UNIT_OPTIONS),
          unidadConcentracionCustom: needsCustomUnit(row.unidadConcentracion || row.unit, FREE_CONC_UNIT_OPTIONS) ? (row.unidadConcentracion || row.unit || "") : "",
          notas: row.notas || ""
        })),
      withdrawalItems: normalizeWithdrawalItems(item.withdrawalItems || item.tiemposRetiro || [], item.tiempoRetiro)
        .map((row) => ({
          id: createId("withdrawal"),
          tipo: row.tipo || "General",
          estado: row.estado || "no_especificado",
          dias: row.dias != null ? String(row.dias) : "",
          notas: row.notas || ""
        })),
      productImage: item.productImage || "",
      productImageSource: item.productImageSource || (item.productImage ? "url" : ""),
      productImageName: item.productImageName || ""
    };

    state.freeComponents = (item.componentes || []).map((comp) => ({
      id: createId("comp"),
      nombre: comp.nombre || "",
      grupoKey: comp.grupoKey || "",
      concentracion: comp.concentracion != null ? String(comp.concentracion) : "",
      unidadConcentracion: normalizeFreeUnit(comp.unidadConcentracion, FREE_CONC_UNIT_OPTIONS),
      unidadConcentracionCustom: needsCustomUnit(comp.unidadConcentracion, FREE_CONC_UNIT_OPTIONS) ? comp.unidadConcentracion : "",
      dosis: comp.dosis != null ? String(comp.dosis) : "",
      unidadDosis: normalizeFreeUnit(comp.unidadDosis, FREE_DOSE_UNIT_OPTIONS),
      unidadDosisCustom: needsCustomUnit(comp.unidadDosis, FREE_DOSE_UNIT_OPTIONS) ? comp.unidadDosis : "",
      funcion: comp.funcion || "",
      observaciones: comp.observaciones || "",
      advertencias: comp.advertencias || "",
      result: null
    }));

    state.freeAdvancedVisible = true;
    state.freeResult = null;
    state.freeAlerts = [];
    state.freeClinical = buildDefaultClinicalAnimalData();
    state.freeClinicalAlerts = [];
    state.freeSaveMissing = [];
    state.freeSaveNotice = null;
    state.freePendingDuplicate = null;
    state.freeProcedureVisible = false;
    state.clinicalObservationTarget = "";
    state.editingPersonalizedId = editingMode ? item.id : "";
  }

  function normalizeFreeUnit(value, allowed) {
    const normalized = String(value || "").trim();
    if (!normalized) return allowed[0];
    return allowed.includes(normalized) ? normalized : "Otro";
  }

  function needsCustomUnit(value, allowed) {
    const normalized = String(value || "").trim();
    if (!normalized) return false;
    return !allowed.includes(normalized);
  }

  // ---------------------------------------------------------------------------
  // SUBMODULO 4: HISTORIAL
  // ---------------------------------------------------------------------------
  function renderHistorySubmodule(panel, state) {
    const speciesOptions = listUnique(state.historyItems.map((item) => item.especie).filter(Boolean));

    panel.innerHTML = `
      <div class="farma-history-shell">
        <div class="sv-toolbar sv-module-toolbar">
          <input class="sv-input" id="farma-history-search" placeholder="Buscar por farmaco..." value="${escapeAttr(state.historySearch)}" />

          <select class="sv-select" id="farma-history-species" style="max-width:220px;">
            <option value="todas">Todas las especies</option>
            ${speciesOptions.map((sp) => `<option value="${escapeAttr(sp)}" ${state.historyFilterSpecies === sp ? "selected" : ""}>${escapeHtml(sp)}</option>`).join("")}
          </select>

          <input class="sv-input" type="date" id="farma-history-from" value="${escapeAttr(state.historyFrom)}" style="max-width:180px;" />
          <input class="sv-input" type="date" id="farma-history-to" value="${escapeAttr(state.historyTo)}" style="max-width:180px;" />

          <button type="button" class="sv-btn sv-btn-danger" id="farma-history-clear">Limpiar historial</button>
        </div>

        <div class="sv-grid" id="farma-history-list"></div>
      </div>
    `;

    const listRoot = panel.querySelector("#farma-history-list");
    renderHistoryCards(listRoot, state);

    bindInput(panel, "#farma-history-search", (value) => {
      state.historySearch = value;
      renderHistoryCards(listRoot, state);
    });

    bindSelect(panel, "#farma-history-species", (value) => {
      state.historyFilterSpecies = value;
      renderHistoryCards(listRoot, state);
    });

    bindInput(panel, "#farma-history-from", (value) => {
      state.historyFrom = value;
      renderHistoryCards(listRoot, state);
    });

    bindInput(panel, "#farma-history-to", (value) => {
      state.historyTo = value;
      renderHistoryCards(listRoot, state);
    });

    panel.querySelector("#farma-history-clear")?.addEventListener("click", () => {
      if (!confirm("Limpiar todo el historial de calculos?")) return;
      state.historyItems = [];
      persistHistory(state);
      renderHistoryCards(listRoot, state);
    });

    listRoot?.addEventListener("click", (event) => {
      const emptyNew = event.target.closest("[data-history-empty-new]");
      if (emptyNew) {
        resetFreeCalculatorState(state);
        state.activeSubmodule = "libre";
        renderSubmoduleFromPanel(panel, state);
        return;
      }

      const action = event.target.closest("[data-history-action]");
      if (!action) return;
      const id = action.dataset.historyId;
      const entry = state.historyItems.find((x) => x.id === id);
      if (!entry) return;

      const actionType = action.dataset.historyAction;
      if (actionType === "reuse") {
        loadHistoryIntoCalculator(state, entry, false);
        state.activeSubmodule = "libre";
        renderSubmoduleFromPanel(panel, state);
        return;
      }

      if (actionType === "edit") {
        loadHistoryIntoCalculator(state, entry, true);
        state.activeSubmodule = "libre";
        renderSubmoduleFromPanel(panel, state);
        return;
      }

      if (actionType === "recipe") {
        const payload = buildRecipePayloadFromHistory(entry);
        const added = addPayloadToRecipe(payload);
        if (added) {
          patchHistoryEntry(state, id, { enviadoRecetario: true });
          renderHistoryCards(listRoot, state);
        }
        return;
      }

      if (actionType === "save-custom") {
        const save = saveHistoryAsCustomDrug(state, entry);
        if (!save.ok) {
          if (save.reason === "minimal") {
            const joined = Array.isArray(save.missingFields) ? save.missingFields.join(", ") : "";
            toast(`Completa los datos clinicos minimos para guardar: ${joined || "campos obligatorios"}.`);
            return;
          }
          if (save.reason !== "storage") {
            toast("Para guardar este farmaco personalizado, completa los datos clinicos minimos.");
          }
        } else {
          patchHistoryEntry(state, id, { guardadoPersonalizado: true });
          renderHistoryCards(listRoot, state);
        }
        return;
      }

      if (actionType === "delete") {
        state.historyItems = state.historyItems.filter((x) => x.id !== id);
        persistHistory(state);
        renderHistoryCards(listRoot, state);
      }
    });
  }

  function renderHistoryCards(container, state) {
    if (!container) return;

    const query = (state.historySearch || "").trim().toLowerCase();
    const fromTime = state.historyFrom ? new Date(`${state.historyFrom}T00:00:00`).getTime() : 0;
    const toTime = state.historyTo ? new Date(`${state.historyTo}T23:59:59`).getTime() : Infinity;

    const filtered = state.historyItems.filter((entry) => {
      const name = String(entry.farmaco || "").toLowerCase();
      const species = String(entry.especie || "");
      const ts = new Date(entry.timestamp || 0).getTime();

      const matchQuery = !query || name.includes(query);
      const matchSpecies = state.historyFilterSpecies === "todas" || species === state.historyFilterSpecies;
      const matchDate = Number.isFinite(ts) ? ts >= fromTime && ts <= toTime : true;

      return matchQuery && matchSpecies && matchDate;
    }).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    if (!filtered.length) {
      container.innerHTML = `
        <div class="sv-empty">
          <div class="sv-empty-icon">+</div>
          <p>Aun no hay calculos registrados en historial.</p>
          <button class="sv-btn sv-btn-secondary" type="button" data-history-empty-new>Ir a Calculadora Libre</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((entry) => {
      const warningList = Array.isArray(entry.advertencias) ? entry.advertencias : [];
      const interactionList = Array.isArray(entry.interacciones) ? entry.interacciones : [];
      const clinicalAlerts = Array.isArray(entry.alertasClinicas) ? entry.alertasClinicas : [];

      return `
        <article class="sv-card farma-history-card sv-fade-in">
          <div class="sv-card-header">
            <div>
              <span class="sv-card-title">${escapeHtml(entry.farmaco || "Farmaco")}</span>
              <span class="sv-card-subtitle">${escapeHtml(entry.especie || "Especie no definida")} - ${escapeHtml(formatDateTime(entry.timestamp))}</span>
            </div>
            <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
              <span class="sv-badge ${entry.tipoCalculo === "profesional" ? "sv-badge-purple" : "sv-badge-blue"}">${escapeHtml(entry.tipoCalculo || "simple")}</span>
              ${entry.enviadoRecetario ? `<span class="sv-badge sv-badge-green">En recetario</span>` : ""}
              ${entry.guardadoPersonalizado ? `<span class="sv-badge sv-badge-orange">Personalizado</span>` : ""}
              ${clinicalAlerts.length ? `<span class="sv-badge sv-badge-orange">${clinicalAlerts.length} alerta(s) clinica(s)</span>` : ""}
            </div>
          </div>

          <div class="sv-card-body">
            <p><strong>Peso:</strong> ${formatNum(entry.peso)} kg</p>
            <p><strong>Dosis:</strong> ${formatNum(entry.dosis)} ${escapeHtml(entry.unidadDosis || "")}</p>
            <p><strong>Via:</strong> ${escapeHtml(formatRouteFull(entry.viaAdministracion || entry.snapshot?.form?.viaAdministracion || "" ) || "N/D")}</p>
            <p><strong>Concentracion:</strong> ${formatNum(entry.concentracion)} ${escapeHtml(entry.unidadConcentracion || "")}</p>
            ${entry.presentacion ? `<p><strong>Presentacion:</strong> ${escapeHtml(entry.presentacion)}${entry.concentracionModificada ? " (modificada solo para este calculo)" : ""}</p>` : ""}
            <p><strong>Resultado:</strong> ${escapeHtml(entry.resultadoCalculado || "N/D")}</p>
            <p><strong>Origen:</strong> ${escapeHtml(entry.origen || "Calculadora Libre")}</p>
            ${entry.contieneComponentes ? `<p><strong>Componentes:</strong> Si</p>` : ""}
          </div>

          ${warningList.length ? `
            <div class="farma-mini-box">
              <strong>Advertencias:</strong>
              <ul>${warningList.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>
            </div>
          ` : ""}

          ${interactionList.length ? `
            <div class="farma-mini-box">
              <strong>Interacciones:</strong>
              <ul>${interactionList.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>
            </div>
          ` : ""}

          ${clinicalAlerts.length ? `
            <div class="farma-mini-box farma-clinical-history-box">
              <strong>Este calculo tuvo ${clinicalAlerts.length} alerta(s) clinica(s):</strong>
              <ul>${clinicalAlerts.map((alert) => `<li>${escapeHtml(alert.message || alert.text || "")}</li>`).join("")}</ul>
            </div>
          ` : ""}

          <div class="sv-card-footer farma-history-actions">
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-history-action="reuse" data-history-id="${escapeAttr(entry.id)}">Reutilizar</button>
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-history-action="edit" data-history-id="${escapeAttr(entry.id)}">Editar</button>
            <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-history-action="recipe" data-history-id="${escapeAttr(entry.id)}">Agregar al recetario</button>
            <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-history-action="save-custom" data-history-id="${escapeAttr(entry.id)}">Guardar como personalizado</button>
            <button class="sv-btn sv-btn-sm sv-btn-danger" type="button" data-history-action="delete" data-history-id="${escapeAttr(entry.id)}">Eliminar</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function loadHistoryIntoCalculator(state, entry, editMode) {
    const snapshot = entry.snapshot || {};
    const form = snapshot.form || {};
    const advanced = snapshot.advanced || {};
    const components = snapshot.components || [];

    state.freeForm = {
      nombre: form.nombre || entry.farmaco || "",
      especie: form.especie || entry.especie || "",
      viaAdministracion: form.viaAdministracion || advanced.viaAdministracion || "",
      pesoKg: form.pesoKg != null ? String(form.pesoKg) : String(entry.peso || ""),
      dosis: form.dosis != null ? String(form.dosis) : String(entry.dosis || ""),
      unidadDosis: normalizeFreeUnit(form.unidadDosis || entry.unidadDosis, FREE_DOSE_UNIT_OPTIONS),
      unidadDosisCustom: needsCustomUnit(form.unidadDosis || entry.unidadDosis, FREE_DOSE_UNIT_OPTIONS) ? (form.unidadDosis || entry.unidadDosis || "") : "",
      concentracion: form.concentracion != null ? String(form.concentracion) : String(entry.concentracion || ""),
      unidadConcentracion: normalizeFreeUnit(form.unidadConcentracion || entry.unidadConcentracion, FREE_CONC_UNIT_OPTIONS),
      unidadConcentracionCustom: needsCustomUnit(form.unidadConcentracion || entry.unidadConcentracion, FREE_CONC_UNIT_OPTIONS) ? (form.unidadConcentracion || entry.unidadConcentracion || "") : ""
    };

    state.freeAdvanced = {
      ...buildDefaultAdvancedForm(),
      ...advanced,
      clinicalObservations: normalizeClinicalObservations(advanced.clinicalObservations),
      interactionMode: advanced.interactionMode || "auto",
      speciesDoses: (advanced.speciesDoses || []).map((row) => ({
        id: createId("sdose"),
        especie: row.especie || "",
        dosis: row.dosis != null ? String(row.dosis) : "",
        unidadDosis: normalizeFreeUnit(row.unidadDosis, FREE_DOSE_UNIT_OPTIONS),
        unidadDosisCustom: needsCustomUnit(row.unidadDosis, FREE_DOSE_UNIT_OPTIONS) ? row.unidadDosis : "",
        frecuencia: row.frecuencia || "",
        duracion: row.duracion || "",
        observaciones: row.observaciones || row.notas || "",
        notas: row.notas || ""
      })),
      routes: (advanced.routes || advanced.vias || []).map((row) => ({
        id: createId("route"),
        via: typeof row === "string" ? row : (row.via || row.value || ""),
        notas: typeof row === "string" ? "" : (row.notas || "")
      })),
      presentations: (advanced.presentations || advanced.presentaciones || []).map((row) => ({
        id: createId("presentation"),
        nombre: row.nombre || row.name || "",
        concentracion: row.concentracion != null ? String(row.concentracion) : "",
        unidadConcentracion: normalizeFreeUnit(row.unidadConcentracion || row.unit, FREE_CONC_UNIT_OPTIONS),
        unidadConcentracionCustom: needsCustomUnit(row.unidadConcentracion || row.unit, FREE_CONC_UNIT_OPTIONS) ? (row.unidadConcentracion || row.unit || "") : "",
        notas: row.notas || ""
      })),
      withdrawalItems: normalizeWithdrawalItems(advanced.withdrawalItems || advanced.tiemposRetiro || [], advanced.tiempoRetiro)
        .map((row) => ({
          id: createId("withdrawal"),
          tipo: row.tipo || "General",
          estado: row.estado || "no_especificado",
          dias: row.dias != null ? String(row.dias) : "",
          notas: row.notas || ""
        })),
      productImage: advanced.productImage || "",
      productImageSource: advanced.productImageSource || (advanced.productImage ? "url" : ""),
      productImageName: advanced.productImageName || ""
    };

    state.freeComponents = (components || []).map((comp) => ({
      id: createId("comp"),
      nombre: comp.nombre || "",
      grupoKey: comp.grupoKey || "",
      concentracion: comp.concentracion != null ? String(comp.concentracion) : "",
      unidadConcentracion: normalizeFreeUnit(comp.unidadConcentracion, FREE_CONC_UNIT_OPTIONS),
      unidadConcentracionCustom: needsCustomUnit(comp.unidadConcentracion, FREE_CONC_UNIT_OPTIONS) ? comp.unidadConcentracion : "",
      dosis: comp.dosis != null ? String(comp.dosis) : "",
      unidadDosis: normalizeFreeUnit(comp.unidadDosis, FREE_DOSE_UNIT_OPTIONS),
      unidadDosisCustom: needsCustomUnit(comp.unidadDosis, FREE_DOSE_UNIT_OPTIONS) ? comp.unidadDosis : "",
      funcion: comp.funcion || "",
      observaciones: comp.observaciones || "",
      advertencias: comp.advertencias || "",
      result: null
    }));

    state.freeAdvancedVisible = entry.tipoCalculo === "profesional" || Boolean(state.freeComponents.length) || editMode;
    state.freeResult = null;
    state.freeAlerts = [];
    state.freeClinical = normalizeClinicalAnimalData(entry.datosClinicos || snapshot.clinicalAnimal);
    state.freeClinicalAlerts = Array.isArray(entry.alertasClinicas) ? entry.alertasClinicas : (snapshot.clinicalAlerts || []);
    state.freeSaveMissing = [];
    state.freeSaveNotice = null;
    state.freePendingDuplicate = null;
    state.freeProcedureVisible = false;
    state.clinicalObservationTarget = "";
    state.editingPersonalizedId = "";
  }

  function saveHistoryAsCustomDrug(state, entry) {
    const snapshot = entry.snapshot || {};
    const form = snapshot.form || {};
    const advanced = snapshot.advanced || {};
    const components = normalizedComponents(snapshot.components || []);
    const speciesDoses = dedupeSpeciesDoses([
      {
        especie: form.especie || entry.especie || "",
        dosis: form.dosis != null ? form.dosis : entry.dosis,
        unidadDosis: form.unidadDosis || entry.unidadDosis || "",
        frecuencia: advanced.frecuencia || "",
        duracion: advanced.duracion || "",
        observaciones: advanced.observaciones || ""
      },
      ...(advanced.speciesDoses || [])
    ]);
    const routes = normalizedRoutes([entry.viaAdministracion, advanced.viaAdministracion, form.viaAdministracion, ...(advanced.routes || advanced.vias || [])]);
    const presentations = normalizedPresentations(advanced.presentations || advanced.presentaciones || [], {
      id: "main",
      nombre: entry.presentacion || "Presentacion principal",
      concentracion: form.concentracion != null ? form.concentracion : entry.concentracion,
      unidadConcentracion: form.unidadConcentracion || entry.unidadConcentracion || "",
      notas: entry.concentracionModificada ? "Concentracion modificada en el calculo original" : ""
    });
    const withdrawalItems = normalizeWithdrawalItems(advanced.withdrawalItems || advanced.tiemposRetiro || [], advanced.tiempoRetiro || "");

    const toSave = {
      nombre: form.nombre || entry.farmaco || "",
      especie: speciesDoses[0]?.especie || form.especie || entry.especie || "",
      dosis: speciesDoses[0]?.dosis || parseNum(form.dosis != null ? form.dosis : entry.dosis),
      unidadDosis: speciesDoses[0]?.unidadDosis || form.unidadDosis || entry.unidadDosis || "",
      concentracion: presentations[0]?.concentracion || parseNum(form.concentracion != null ? form.concentracion : entry.concentracion),
      unidadConcentracion: presentations[0]?.unidadConcentracion || form.unidadConcentracion || entry.unidadConcentracion || "",
      grupoKey: advanced.grupoKey || "",
      viaAdministracion: routes[0] || advanced.viaAdministracion || form.viaAdministracion || "",
      routes,
      funcionTerapeutica: advanced.funcionTerapeutica || "",
      descripcion: advanced.descripcion || advanced.observaciones || "",
      componentes: components,
      speciesDoses,
      presentations,
      withdrawalItems,
      productImage: advanced.productImage || "",
      productImageSource: advanced.productImageSource || "",
      productImageName: advanced.productImageName || ""
    };

    const missingFields = getMissingCustomFields(toSave);
    if (missingFields.length) {
      return { ok: false, reason: "minimal", missingFields };
    }

    const now = new Date().toISOString();
    const nextItem = {
      id: createId("custom"),
      createdAt: now,
      updatedAt: now,
      nombre: toSave.nombre,
      especie: toSave.especie,
      dosis: toSave.dosis,
      unidadDosis: toSave.unidadDosis,
      concentracion: toSave.concentracion,
      unidadConcentracion: toSave.unidadConcentracion,
      grupoKey: toSave.grupoKey,
      viaAdministracion: toSave.viaAdministracion,
      vias: routes,
      funcionTerapeutica: toSave.funcionTerapeutica,
      mecanismoAccion: advanced.mecanismoAccion || "",
      descripcion: toSave.descripcion,
      nombreComercial: advanced.nombreComercial || "",
      laboratorio: advanced.laboratorio || "",
      frecuencia: advanced.frecuencia || "",
      duracion: advanced.duracion || "",
      contraindicaciones: advanced.contraindicaciones || "",
      precauciones: advanced.precauciones || "",
      clinicalObservations: normalizeClinicalObservations(advanced.clinicalObservations),
      observacionesClinicas: normalizeClinicalObservations(advanced.clinicalObservations),
      efectosAdversos: advanced.efectosAdversos || "",
      tiempoRetiro: formatWithdrawalSummary(withdrawalItems, advanced.tiempoRetiro || ""),
      withdrawalItems,
      tiemposRetiro: withdrawalItems,
      observaciones: advanced.observaciones || "",
      bibliografia: advanced.bibliografia || "",
      interactionMode: advanced.interactionMode || "auto",
      interacciones: (entry.interacciones || []).map((text) => ({ level: "precaucion", title: "Interaccion", text })),
      advertencias: entry.advertencias || [],
      componentes: components,
      speciesDoses: toSave.speciesDoses,
      presentations,
      productImage: toSave.productImage,
      productImageSource: toSave.productImageSource,
      productImageName: toSave.productImageName,
      pesoKg: form.pesoKg != null ? parseNum(form.pesoKg) : parseNum(entry.peso),
      tipoCalculo: entry.tipoCalculo || "simple",
      calculo: {
        dosisTotal: parseNum(entry.dosisTotal),
        dosisTotalUnidad: entry.dosisTotalUnidad || "",
        resultadoFinal: parseResultValue(entry.resultadoCalculado),
        unidadFinal: parseResultUnit(entry.resultadoCalculado)
      },
      snapshot
    };

    let nextCustomItems = [nextItem, ...state.customItems];
    let persisted = writeStorageArray(STORAGE_CUSTOM, nextCustomItems, { silent: true });
    if (!persisted) {
      const compact = compactCustomItemsForStorage(nextCustomItems);
      nextCustomItems = compact.items;
      persisted = writeStorageArray(STORAGE_CUSTOM, nextCustomItems, {
        message: "No se pudo guardar el farmaco personalizado desde historial. Se limpio contenido pesado, intenta nuevamente si el navegador sigue sin espacio.",
        replaceOnFail: true
      });
    }
    if (!persisted) return { ok: false, reason: "storage" };

    state.customItems = nextCustomItems;
    toast("Farmaco personalizado guardado desde historial.");
    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // Persistencia y acciones compartidas
  // ---------------------------------------------------------------------------
  function appendHistoryEntry(state, entry, opts = {}) {
    const now = new Date().toISOString();
    const id = createId("history");

    const next = {
      id,
      timestamp: now,
      farmaco: entry.farmaco || "",
      especie: entry.especie || "",
      peso: parseNum(entry.peso),
      dosis: parseNum(entry.dosis),
      unidadDosis: entry.unidadDosis || "",
      viaAdministracion: entry.viaAdministracion || "",
      concentracion: parseNum(entry.concentracion),
      unidadConcentracion: entry.unidadConcentracion || "",
      presentacion: entry.presentacion || "",
      concentracionModificada: Boolean(entry.concentracionModificada),
      dosisTotal: parseNum(entry.dosisTotal),
      dosisTotalUnidad: entry.dosisTotalUnidad || "",
      resultadoCalculado: entry.resultadoCalculado || "",
      tipoCalculo: entry.tipoCalculo || "simple",
      origen: entry.origen || "Calculadora Libre",
      enviadoRecetario: Boolean(entry.enviadoRecetario),
      guardadoPersonalizado: Boolean(entry.guardadoPersonalizado),
      contieneComponentes: Boolean(entry.contieneComponentes),
      advertencias: Array.isArray(entry.advertencias) ? entry.advertencias.filter(Boolean) : [],
      datosClinicos: normalizeClinicalAnimalData(entry.datosClinicos),
      alertasClinicas: Array.isArray(entry.alertasClinicas) ? entry.alertasClinicas.filter((item) => item && (item.message || item.text)) : [],
      interacciones: Array.isArray(entry.interacciones) ? entry.interacciones.filter(Boolean) : [],
      snapshot: entry.snapshot && typeof entry.snapshot === "object" ? entry.snapshot : {}
    };

    const last = state.historyItems[0];
    const dedupeMs = Number(opts.dedupeMs) || 0;
    if (last && dedupeMs > 0) {
      const delta = Math.abs(new Date(now).getTime() - new Date(last.timestamp || 0).getTime());
      const sameSignature =
        String(last.farmaco || "") === String(next.farmaco || "") &&
        String(last.especie || "") === String(next.especie || "") &&
        String(last.resultadoCalculado || "") === String(next.resultadoCalculado || "") &&
        Number(last.peso || 0) === Number(next.peso || 0);

      if (sameSignature && delta <= dedupeMs) {
        state.historyItems[0] = { ...last, ...next, id: last.id, timestamp: last.timestamp };
        persistHistory(state);
        return last.id;
      }
    }

    state.historyItems.unshift(next);
    state.historyItems = state.historyItems.slice(0, 350);
    persistHistory(state);
    return id;
  }

  function patchHistoryEntry(state, id, patch) {
    if (!id) return;
    state.historyItems = state.historyItems.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    persistHistory(state);
  }

  function markLatestHistoryBySignature(state, signature, patch) {
    const target = state.historyItems.find((entry) =>
      String(entry.farmaco || "") === String(signature.farmaco || "") &&
      String(entry.especie || "") === String(signature.especie || "") &&
      Number(entry.peso || 0) === Number(signature.peso || 0) &&
      String(entry.resultadoCalculado || "") === String(signature.resultado || "")
    );
    if (!target) return;
    patchHistoryEntry(state, target.id, patch);
  }

  function addPayloadToRecipe(payload) {
    const recetario = window.Recetario;
    if (!recetario || typeof recetario.agregarItemExtendido !== "function") {
      toast("No se pudo agregar al recetario: el recetario aun no esta disponible.");
      return false;
    }

    const prepared = prepareRecipePayload(payload);
    if (!prepared.ok) return false;

    try {
      return Boolean(recetario.agregarItemExtendido(prepared.payload));
    } catch (error) {
      console.warn("[Farma] Error al enviar al recetario:", error);
      toast("No se pudo agregar al recetario. Revisa los datos e intenta nuevamente.");
      return false;
    }
  }

  function prepareRecipePayload(payload) {
    const base = { ...(payload || {}) };
    const missing = [];
    if (!String(base.nombre || base.farmaco || "").trim()) missing.push("nombre del farmaco");
    if (!String(base.especie || "").trim()) missing.push("especie");
    if (!String(base.viaAdministracion || base.via || "").trim()) missing.push("via");
    if (!(Number(base.resultadoFinal) > 0) && !String(base.dosisTexto || "").trim()) missing.push("resultado calculado");

    if (missing.length && typeof window.confirm === "function") {
      const proceed = window.confirm(`El recetario recibira datos incompletos: ${missing.join(", ")}. Deseas continuar?`);
      if (!proceed) return { ok: false, reason: "missing" };
    }

    const suggested = buildClinicalInstruction(base);
    let edited = suggested;
    if (typeof window.prompt === "function") {
      const preview = buildRecipePreviewText(base, missing);
      const answer = window.prompt(preview, suggested);
      if (answer === null) return { ok: false, reason: "cancelled" };
      edited = String(answer || "").trim() || suggested;
    }

    return {
      ok: true,
      payload: {
        ...base,
        indicaciones: edited || base.indicaciones || "",
        observaciones: [base.observaciones, base.indicacionOriginal && base.indicacionOriginal !== edited ? `Indicacion base: ${base.indicacionOriginal}` : ""]
          .filter(Boolean)
          .join(" | ")
      }
    };
  }

  function buildClinicalInstruction(payload) {
    const result = Number(payload.resultadoFinal);
    const unit = String(payload.unidadFinal || "").trim();
    const route = String(payload.viaAdministracion || payload.via || "").trim();
    const frequency = String(payload.frecuencia || "").trim();
    const duration = String(payload.duracion || "").trim();
    const amount = Number.isFinite(result) && result > 0 ? `${formatNum(result)} ${unit}`.trim() : String(payload.dosisTexto || "").trim();
    if (!amount) return String(payload.indicaciones || "").trim();
    return [
      `Administrar ${amount}`,
      route ? `por via ${route}` : "",
      frequency ? frequency : "",
      duration ? `durante ${duration}` : ""
    ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim() + ".";
  }

  function buildRecipePreviewText(payload, missing = []) {
    const clinicalAlerts = clinicalAlertTexts(payload.alertasClinicas);
    const lines = [
      "Previsualizacion para recetario",
      "",
      `Producto: ${payload.nombre || payload.farmaco || "N/D"}`,
      payload.nombreComercial ? `Comercial: ${payload.nombreComercial}` : "",
      `Especie: ${payload.especie || "N/D"}`,
      Number(payload.pesoKg) > 0 ? `Peso: ${formatNum(payload.pesoKg)} kg` : "",
      Number(payload.dosis) > 0 ? `Dosis: ${formatNum(payload.dosis)} ${payload.unidadDosis || ""}` : "",
      Number(payload.resultadoFinal) > 0 ? `Resultado: ${formatNum(payload.resultadoFinal)} ${payload.unidadFinal || ""}` : "",
      `Via: ${payload.viaAdministracion || payload.via || "N/D"}`,
      payload.tiempoRetiro ? `Retiro: ${payload.tiempoRetiro}` : "",
      clinicalAlerts.length ? `Advertencias clinicas detectadas: ${clinicalAlerts.join(" | ")}` : "",
      missing.length ? `Pendiente: ${missing.join(", ")}` : "",
      "",
      "Edita la indicacion clinica sugerida:"
    ].filter((line) => line !== "");
    return lines.join("\n");
  }

  function saveFreeAsCustomDrug(state, opts = {}) {
    const result = calculateFreeDose(state.freeForm);
    const form = state.freeForm;
    const advanced = state.freeAdvanced;
    const components = normalizedComponents(state.freeComponents);
    const speciesDoses = getEffectiveSpeciesDoses(state);
    const routes = getEffectiveRoutesFromState(state);
    const presentations = getEffectivePresentations(state);
    const withdrawalItems = getEffectiveWithdrawalItems(state);
    const data = getCustomSaveDraft(state);

    state.freeResult = result;
    state.freeAlerts = result?.warnings || [];

    if (!result || !result.ok) {
      return { ok: false, reason: "calc" };
    }

    const missingFields = getMissingCustomFields(data);
    if (missingFields.length) {
      return { ok: false, reason: "minimal", missingFields };
    }

    state.freeSaveMissing = [];

    const now = new Date().toISOString();
    const interactionAlerts = buildInteractionAlerts(state);

    const payload = {
      id: state.editingPersonalizedId || createId("custom"),
      createdAt: now,
      updatedAt: now,
      nombre: String(form.nombre || "").trim(),
      especie: speciesDoses[0]?.especie || String(form.especie || "").trim(),
      pesoKg: parseNum(form.pesoKg),
      dosis: speciesDoses[0]?.dosis || parseNum(form.dosis),
      unidadDosis: speciesDoses[0]?.unidadDosis || resolveUnit(form.unidadDosis, form.unidadDosisCustom),
      concentracion: presentations[0]?.concentracion || parseNum(form.concentracion),
      unidadConcentracion: presentations[0]?.unidadConcentracion || resolveUnit(form.unidadConcentracion, form.unidadConcentracionCustom),
      nombreComercial: advanced.nombreComercial || "",
      laboratorio: advanced.laboratorio || "",
      grupoKey: data.grupoKey,
      funcionTerapeutica: data.funcionTerapeutica,
      mecanismoAccion: advanced.mecanismoAccion || "",
      descripcion: data.descripcion,
      viaAdministracion: routes[0] || data.viaAdministracion,
      vias: routes,
      frecuencia: advanced.frecuencia || "",
      duracion: advanced.duracion || "",
      contraindicaciones: advanced.contraindicaciones || "",
      precauciones: advanced.precauciones || "",
      efectosAdversos: advanced.efectosAdversos || "",
      tiempoRetiro: formatWithdrawalSummary(withdrawalItems, advanced.tiempoRetiro),
      withdrawalItems,
      tiemposRetiro: withdrawalItems,
      observaciones: advanced.observaciones || "",
      bibliografia: advanced.bibliografia || "",
      interactionMode: advanced.interactionMode || "auto",
      interacciones: interactionAlerts,
      advertencias: state.freeAlerts || [],
      componentes: components,
      speciesDoses,
      presentations,
      productImage: shouldStoreProductImage(advanced.productImage, advanced.productImageSource) ? advanced.productImage : "",
      productImageSource: advanced.productImageSource || "",
      productImageName: advanced.productImageName || "",
      tipoCalculo: state.freeAdvancedVisible ? "profesional" : "simple",
      calculo: {
        dosisTotal: result.doseTotalValue,
        dosisTotalUnidad: result.doseTotalUnit,
        resultadoFinal: result.finalValue,
        unidadFinal: result.finalUnit
      },
      snapshot: buildFreeSnapshot(state)
    };

    let nextCustomItems = state.customItems.slice();
    let successMessage = "Farmaco personalizado guardado.";
    const duplicate = !state.editingPersonalizedId
      ? findSimilarCustomDrug(state.customItems, payload)
      : null;
    const updateTargetId = state.editingPersonalizedId || (duplicate && opts.duplicateMode === "update" ? duplicate.id : "");

    if (duplicate && !opts.duplicateMode) {
      return { ok: false, reason: "duplicate", duplicate };
    }

    if (updateTargetId) {
      const current = state.customItems.find((item) => item.id === updateTargetId);
      payload.id = updateTargetId;
      payload.createdAt = current?.createdAt || now;
      nextCustomItems = state.customItems.map((item) =>
        item.id === updateTargetId ? { ...item, ...payload, updatedAt: now } : item
      );
      successMessage = duplicate && opts.duplicateMode === "update"
        ? "Farmaco personalizado similar actualizado."
        : "Farmaco personalizado actualizado.";
    } else {
      nextCustomItems.unshift(payload);
      if (duplicate && opts.duplicateMode === "copy") {
        successMessage = "Copia de farmaco personalizado guardada.";
      }
    }

    let persisted = writeStorageArray(STORAGE_CUSTOM, nextCustomItems, { silent: true });
    if (!persisted) {
      const compact = compactCustomItemsForStorage(nextCustomItems);
      nextCustomItems = compact.items;
      persisted = writeStorageArray(STORAGE_CUSTOM, nextCustomItems, {
        message: "No se pudo guardar el farmaco personalizado. Se limpio contenido pesado, intenta nuevamente si el navegador sigue sin espacio.",
        replaceOnFail: true
      });
    }
    if (!persisted) return { ok: false, reason: "storage" };

    state.customItems = nextCustomItems;
    toast(successMessage);

    if (state.freeLastHistoryId) {
      patchHistoryEntry(state, state.freeLastHistoryId, { guardadoPersonalizado: true });
    }

    state.editingPersonalizedId = payload.id;
    return { ok: true, itemName: payload.nombre, itemId: payload.id };
  }

  function findSimilarCustomDrug(items, payload, ignoreId = "") {
    const targetName = normalizeComparable(payload.nombre);
    const targetCommercial = normalizeComparable(payload.nombreComercial);
    const targetGroup = normalizeComparable(payload.grupoKey);
    const targetRoutes = normalizedRoutes(payload.vias || [payload.viaAdministracion]).map(normalizeComparable);
    const targetSpecies = getCustomSpeciesDoses(payload).map((row) => normalizeComparable(row.especie));
    const targetPresentation = getCustomPresentations(payload)[0] || {};
    const targetConc = Number(targetPresentation.concentracion || payload.concentracion || 0);
    const targetConcUnit = normalizeComparable(targetPresentation.unidadConcentracion || payload.unidadConcentracion);

    return (Array.isArray(items) ? items : []).find((item) => {
      if (!item || item.id === ignoreId) return false;
      const sameName = normalizeComparable(item.nombre) === targetName;
      const sameCommercial = !targetCommercial || !normalizeComparable(item.nombreComercial) || normalizeComparable(item.nombreComercial) === targetCommercial;
      const sameGroup = normalizeComparable(item.grupoKey) === targetGroup;
      const itemRoutes = getCustomRoutes(item).map(normalizeComparable);
      const itemSpecies = getCustomSpeciesDoses(item).map((row) => normalizeComparable(row.especie));
      const itemPresentation = getCustomPresentations(item)[0] || {};
      const itemConc = Number(itemPresentation.concentracion || item.concentracion || 0);
      const itemConcUnit = normalizeComparable(itemPresentation.unidadConcentracion || item.unidadConcentracion);
      const routeOverlap = !targetRoutes.length || !itemRoutes.length || targetRoutes.some((route) => itemRoutes.includes(route));
      const speciesOverlap = !targetSpecies.length || !itemSpecies.length || targetSpecies.some((species) => itemSpecies.includes(species));
      const sameConcentration = Math.abs(itemConc - targetConc) < 0.000001 && itemConcUnit === targetConcUnit;
      return sameName && sameCommercial && sameGroup && routeOverlap && speciesOverlap && sameConcentration;
    }) || null;
  }

  function normalizeComparable(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  function getCustomSaveDraft(state) {
    const form = state.freeForm || {};
    const advanced = state.freeAdvanced || {};
    const components = normalizedComponents(state.freeComponents);
    const description = String(advanced.descripcion || advanced.observaciones || "").trim();
    const speciesDoses = getEffectiveSpeciesDoses(state);
    const routes = getEffectiveRoutesFromState(state);
    const presentations = getEffectivePresentations(state);
    const withdrawalItems = getEffectiveWithdrawalItems(state);

    return {
      nombre: String(form.nombre || "").trim(),
      especie: speciesDoses[0]?.especie || String(form.especie || "").trim(),
      dosis: speciesDoses[0]?.dosis || parseNum(form.dosis),
      unidadDosis: speciesDoses[0]?.unidadDosis || resolveUnit(form.unidadDosis, form.unidadDosisCustom),
      concentracion: presentations[0]?.concentracion || parseNum(form.concentracion),
      unidadConcentracion: presentations[0]?.unidadConcentracion || resolveUnit(form.unidadConcentracion, form.unidadConcentracionCustom),
      grupoKey: String(advanced.grupoKey || "").trim(),
      viaAdministracion: routes[0] || String(advanced.viaAdministracion || form.viaAdministracion || "").trim(),
      routes,
      funcionTerapeutica: String(advanced.funcionTerapeutica || "").trim(),
      descripcion: description,
      componentes: components,
      speciesDoses,
      presentations,
      withdrawalItems
    };
  }

  function getMissingCustomFields(data) {
    const missing = [];
    const speciesDoses = Array.isArray(data.speciesDoses) ? data.speciesDoses : [];
    const routes = Array.isArray(data.routes) ? data.routes : [];
    const presentations = Array.isArray(data.presentations) ? data.presentations : [];
    const withdrawals = Array.isArray(data.withdrawalItems) ? data.withdrawalItems : [];
    const hasSpeciesDose = speciesDoses.some((row) =>
      String(row.especie || "").trim() && Number(row.dosis) > 0 && String(row.unidadDosis || "").trim()
    );
    const hasPresentation = presentations.some((row) =>
      Number(row.concentracion) > 0 && String(row.unidadConcentracion || "").trim()
    );

    if (!String(data.nombre || "").trim()) missing.push("Nombre del farmaco");
    if (!hasSpeciesDose) missing.push("Especies y dosis");
    if (!String(data.unidadDosis || "").trim()) missing.push("Unidad de dosis");
    if (!hasPresentation) missing.push("Concentracion o presentacion");
    if (!String(data.unidadConcentracion || "").trim()) missing.push("Unidad de concentracion");
    if (!String(data.grupoKey || "").trim() || data.grupoKey === "default") missing.push("Grupo farmacologico");
    if (!routes.length && !String(data.viaAdministracion || "").trim()) missing.push("Vias de administracion");
    if (!String(data.funcionTerapeutica || "").trim()) missing.push("Funcion terapeutica");
    if (!String(data.descripcion || "").trim()) missing.push("Descripcion u observacion");
    if (!withdrawals.some(isValidWithdrawalItem)) missing.push("Tiempo de retiro");
    const comps = Array.isArray(data.componentes) ? data.componentes : [];
    if (comps.length) {
      const validComponents = comps.every(isCompleteComponent);
      if (!validComponents) missing.push("Componentes activos completos");
    }

    return missing;
  }

  function validateCustomMinimalData(data) {
    return getMissingCustomFields(data).length === 0;
  }

  function buildRecipePayloadFromFree(state) {
    const form = state.freeForm;
    const advanced = state.freeAdvanced;
    const result = state.freeResult;
    const components = normalizedComponents(state.freeComponents);
    const interactions = buildInteractionAlerts(state);

    return {
      nombre: form.nombre,
      nombreComercial: advanced.nombreComercial,
      especie: form.especie,
      pesoKg: parseNum(form.pesoKg),
      dosis: parseNum(form.dosis),
      unidadDosis: resolveUnit(form.unidadDosis, form.unidadDosisCustom),
      dosisTotal: result?.doseTotalValue,
      dosisTotalUnidad: result?.doseTotalUnit,
      resultadoFinal: result?.finalValue,
      unidadFinal: result?.finalUnit,
      concentracion: parseNum(form.concentracion),
      unidadConcentracion: resolveUnit(form.unidadConcentracion, form.unidadConcentracionCustom),
      viaAdministracion: getEffectiveRoutesFromState(state)[0] || advanced.viaAdministracion || form.viaAdministracion || "",
      frecuencia: advanced.frecuencia,
      duracion: advanced.duracion,
      indicaciones: advanced.funcionTerapeutica,
      advertencias: (state.freeAlerts || []).concat(interactions.map((x) => x.text), clinicalAlertTexts(state.freeClinicalAlerts)).filter(Boolean),
      alertasClinicas: state.freeClinicalAlerts || [],
      datosClinicos: normalizeClinicalAnimalData(state.freeClinical),
      observaciones: advanced.observaciones || advanced.descripcion,
      componentes: components,
      speciesDoses: getEffectiveSpeciesDoses(state),
      vias: getEffectiveRoutesFromState(state),
      presentations: getEffectivePresentations(state),
      tiempoRetiro: formatWithdrawalSummary(getEffectiveWithdrawalItems(state), advanced.tiempoRetiro)
    };
  }

  function buildRecipePayloadFromCustom(item, calcState = null) {
    const speciesDoses = getCustomSpeciesDoses(item);
    const presentations = getCustomPresentations(item);
    const routes = getCustomRoutes(item);
    const selectedDose = speciesDoses[clampIndex(calcState?.speciesIndex, speciesDoses.length)] || speciesDoses[0] || {};
    const selectedPresentation = presentations[clampIndex(calcState?.presentationIndex, presentations.length)] || presentations[0] || {};
    const result = calcState?.result?.ok ? calcState.result : item.calculo || {};
    const useOverride = Boolean(calcState?.overrideOpen && parseNum(calcState.tempConcentration) > 0);
    const concentration = useOverride ? parseNum(calcState.tempConcentration) : (selectedPresentation.concentracion || item.concentracion);
    const concentrationUnit = useOverride ? resolveUnit(calcState.tempUnit, calcState.tempUnitCustom) : (selectedPresentation.unidadConcentracion || item.unidadConcentracion);

    return {
      nombre: item.nombre,
      nombreComercial: item.nombreComercial,
      especie: selectedDose.especie || item.especie,
      pesoKg: calcState?.weight || item.pesoKg,
      dosis: selectedDose.dosis || item.dosis,
      unidadDosis: selectedDose.unidadDosis || item.unidadDosis,
      dosisTotal: result.doseTotalValue || result.dosisTotal,
      dosisTotalUnidad: result.doseTotalUnit || result.dosisTotalUnidad,
      resultadoFinal: result.finalValue || result.resultadoFinal,
      unidadFinal: result.finalUnit || result.unidadFinal,
      concentracion: concentration,
      unidadConcentracion: concentrationUnit,
      viaAdministracion: calcState?.route || routes[0] || item.viaAdministracion,
      frecuencia: selectedDose.frecuencia || item.frecuencia,
      duracion: selectedDose.duracion || item.duracion,
      indicaciones: item.funcionTerapeutica,
      advertencias: (item.advertencias || []).concat((item.interacciones || []).map((x) => x.text || x), clinicalAlertTexts(calcState?.clinicalAlerts)).filter(Boolean),
      alertasClinicas: calcState?.clinicalAlerts || [],
      datosClinicos: normalizeClinicalAnimalData({
        open: calcState?.clinicalOpen,
        conditions: calcState?.clinicalConditions,
        custom: calcState?.clinicalCustom
      }),
      observaciones: item.observaciones || item.descripcion,
      componentes: item.componentes || [],
      speciesDoses,
      vias: routes,
      presentations,
      tiempoRetiro: formatWithdrawalSummary(item.withdrawalItems || item.tiemposRetiro || [], item.tiempoRetiro)
    };
  }

  function buildRecipePayloadFromHistory(entry) {
    const snapshot = entry.snapshot || {};
    const form = snapshot.form || {};
    const advanced = snapshot.advanced || {};

    return {
      nombre: form.nombre || entry.farmaco,
      nombreComercial: advanced.nombreComercial || "",
      especie: form.especie || entry.especie,
      pesoKg: form.pesoKg != null ? parseNum(form.pesoKg) : parseNum(entry.peso),
      dosis: form.dosis != null ? parseNum(form.dosis) : parseNum(entry.dosis),
      unidadDosis: form.unidadDosis || entry.unidadDosis,
      dosisTotal: parseNum(entry.dosisTotal),
      dosisTotalUnidad: entry.dosisTotalUnidad,
      resultadoFinal: parseResultValue(entry.resultadoCalculado),
      unidadFinal: parseResultUnit(entry.resultadoCalculado),
      concentracion: form.concentracion != null ? parseNum(form.concentracion) : parseNum(entry.concentracion),
      unidadConcentracion: form.unidadConcentracion || entry.unidadConcentracion,
      viaAdministracion: entry.viaAdministracion || advanced.viaAdministracion || form.viaAdministracion || "",
      frecuencia: advanced.frecuencia || "",
      duracion: advanced.duracion || "",
      indicaciones: advanced.funcionTerapeutica || "",
      advertencias: (entry.advertencias || []).concat(entry.interacciones || [], clinicalAlertTexts(entry.alertasClinicas)).filter(Boolean),
      alertasClinicas: entry.alertasClinicas || snapshot.clinicalAlerts || [],
      datosClinicos: normalizeClinicalAnimalData(entry.datosClinicos || snapshot.clinicalAnimal),
      observaciones: advanced.observaciones || advanced.descripcion || "",
      componentes: snapshot.components || [],
      speciesDoses: advanced.speciesDoses || [],
      presentations: advanced.presentations || [],
      presentacion: entry.presentacion || advanced.presentacionUsada || "",
      tiempoRetiro: formatWithdrawalSummary(advanced.withdrawalItems || advanced.tiemposRetiro || [], advanced.tiempoRetiro || "")
    };
  }

  function buildFreeSnapshot(state) {
    const hasProductImage = Boolean(String(state.freeAdvanced.productImage || "").trim());
    const clinicalData = normalizeClinicalAnimalData(state.freeClinical);
    return {
      source: "calculadora_libre",
      form: {
        nombre: state.freeForm.nombre,
        especie: state.freeForm.especie,
        viaAdministracion: state.freeForm.viaAdministracion || "",
        pesoKg: parseNum(state.freeForm.pesoKg),
        dosis: parseNum(state.freeForm.dosis),
        unidadDosis: resolveUnit(state.freeForm.unidadDosis, state.freeForm.unidadDosisCustom),
        concentracion: parseNum(state.freeForm.concentracion),
        unidadConcentracion: resolveUnit(state.freeForm.unidadConcentracion, state.freeForm.unidadConcentracionCustom)
      },
      advanced: {
        ...state.freeAdvanced,
        clinicalObservations: normalizeClinicalObservations(state.freeAdvanced.clinicalObservations),
        speciesDoses: getEffectiveSpeciesDoses(state),
        routes: getEffectiveRoutesFromState(state),
        presentations: getEffectivePresentations(state),
        withdrawalItems: getEffectiveWithdrawalItems(state),
        // Evita inflar historial con imagenes base64 y reduce errores de cuota.
        productImage: "",
        productImageSource: state.freeAdvanced.productImageSource || (hasProductImage ? "upload" : ""),
        productImageName: state.freeAdvanced.productImageName || ""
      },
      clinicalAnimal: clinicalData,
      clinicalAlerts: state.freeClinicalAlerts || [],
      components: normalizedComponents(state.freeComponents),
      result: state.freeResult ? {
        doseTotalValue: state.freeResult.doseTotalValue,
        doseTotalUnit: state.freeResult.doseTotalUnit,
        finalValue: state.freeResult.finalValue,
        finalUnit: state.freeResult.finalUnit
      } : null
    };
  }

  function normalizeClinicalObservations(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      contraindicaciones: listUnique(Array.isArray(source.contraindicaciones) ? source.contraindicaciones.filter(Boolean) : []),
      precauciones: listUnique(Array.isArray(source.precauciones) ? source.precauciones.filter(Boolean) : []),
      contraindicacionesPersonalizadas: listUnique(Array.isArray(source.contraindicacionesPersonalizadas) ? source.contraindicacionesPersonalizadas.filter(Boolean) : []),
      precaucionesPersonalizadas: listUnique(Array.isArray(source.precaucionesPersonalizadas) ? source.precaucionesPersonalizadas.filter(Boolean) : [])
    };
  }

  function normalizeClinicalAnimalData(data) {
    const source = data && typeof data === "object" ? data : {};
    const allowed = new Set(CLINICAL_CONDITION_OPTIONS.map((item) => item.key));
    return {
      open: Boolean(source.open),
      conditions: listUnique((Array.isArray(source.conditions) ? source.conditions : []).filter((key) => allowed.has(key))),
      custom: String(source.custom || "").trim()
    };
  }

  function syncFreeClinicalFromPanel(panel, state) {
    const root = panel.querySelector("[data-clinical-animal-panel='free']");
    const current = normalizeClinicalAnimalData(state.freeClinical);
    if (!root) {
      state.freeClinical = current;
      return current;
    }
    const checked = Array.from(root.querySelectorAll("input[name='free-clinical-condition']:checked"))
      .map((input) => input.value)
      .filter(Boolean);
    state.freeClinical = {
      ...current,
      conditions: listUnique(checked),
      custom: namedValue(root, "free-clinical-custom")
    };
    return state.freeClinical;
  }

  function appendClinicalText(existing, additions) {
    const current = String(existing || "").trim();
    const next = (Array.isArray(additions) ? additions : [additions])
      .map((item) => normalizeClinicalSentence(item))
      .filter(Boolean)
      .filter((item) => !normalizeTextForMatch(current).includes(normalizeTextForMatch(item)));
    if (!next.length) return current;
    return [current, ...next].filter(Boolean).join(current ? " " : "");
  }

  function normalizeClinicalSentence(text) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    return /[.!?]$/.test(clean) ? clean : `${clean}.`;
  }

  function evaluateClinicalSafety({ clinical, contraindicaciones, precauciones }) {
    const data = normalizeClinicalAnimalData(clinical);
    const selected = data.conditions
      .map((key) => CLINICAL_CONDITION_OPTIONS.find((item) => item.key === key))
      .filter(Boolean);
    if (data.custom) {
      selected.push({
        key: "custom",
        label: data.custom,
        terms: buildCustomClinicalTerms(data.custom)
      });
    }

    const contraText = normalizeTextForMatch(contraindicaciones);
    const precautionText = normalizeTextForMatch(precauciones);
    const alerts = [];

    selected.forEach((condition) => {
      const terms = (condition.terms || []).map(normalizeTextForMatch).filter(Boolean);
      const hasContra = terms.some((term) => contraText.includes(term));
      const hasPrecaution = terms.some((term) => precautionText.includes(term));

      if (hasContra) {
        alerts.push({
          level: "contraindicacion",
          type: "contraindicacion",
          condition: condition.label,
          message: `Alerta clinica: este farmaco tiene una contraindicacion registrada relacionada con ${condition.label.toLowerCase()}. Verifique antes de administrar.`
        });
      }

      if (hasPrecaution) {
        const highRisk = /sever|toxic|nefrotox|hepatotox|sobredos/.test(precautionText);
        alerts.push({
          level: highRisk ? "alto_riesgo" : "precaucion",
          type: highRisk ? "alto_riesgo" : "precaucion",
          condition: condition.label,
          message: `${highRisk ? "Alto riesgo clinico" : "Precaucion clinica"}: este farmaco tiene una advertencia registrada para pacientes con ${condition.label.toLowerCase()}. Revise dosis, intervalo o alternativa terapeutica.`
        });
      }
    });

    return dedupeClinicalAlerts(alerts);
  }

  function dedupeClinicalAlerts(alerts) {
    const seen = new Set();
    return (Array.isArray(alerts) ? alerts : []).filter((alert) => {
      const key = `${alert.type || ""}|${alert.condition || ""}|${alert.message || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return Boolean(alert.message);
    });
  }

  function buildCustomClinicalTerms(text) {
    const clean = normalizeTextForMatch(text);
    const words = clean.split(/\s+/).filter((word) => word.length >= 4);
    return listUnique([clean, ...words]);
  }

  function normalizeTextForMatch(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function clinicalAlertTexts(alerts) {
    return (Array.isArray(alerts) ? alerts : []).map((alert) => alert.message || alert.text || "").filter(Boolean);
  }

  function normalizedComponents(items) {
    return (Array.isArray(items) ? items : [])
      .map((comp) => {
        const doseUnit = resolveUnit(comp.unidadDosis, comp.unidadDosisCustom);
        const concUnit = resolveUnit(comp.unidadConcentracion, comp.unidadConcentracionCustom);
        return {
          nombre: String(comp.nombre || "").trim(),
          grupoKey: String(comp.grupoKey || "").trim(),
          concentracion: parseNum(comp.concentracion),
          unidadConcentracion: concUnit,
          dosis: parseNum(comp.dosis),
          unidadDosis: doseUnit,
          resultadoIndividual: comp.result && comp.result.ok ? `${formatNum(comp.result.finalValue)} ${comp.result.finalUnit}` : "",
          funcion: String(comp.funcion || "").trim(),
          observaciones: String(comp.observaciones || "").trim(),
          advertencias: String(comp.advertencias || "").trim()
        };
      })
      .filter((comp) =>
        comp.nombre || comp.grupoKey || comp.concentracion > 0 || comp.dosis > 0 || comp.funcion || comp.observaciones || comp.advertencias
      );
  }

  function getEffectiveSpeciesDoses(state) {
    const fromRows = normalizedSpeciesDoses(state.freeAdvanced?.speciesDoses || []);
    const form = state.freeForm || {};
    const base = {
      especie: String(form.especie || "").trim(),
      dosis: parseNum(form.dosis),
      unidadDosis: resolveUnit(form.unidadDosis, form.unidadDosisCustom),
      frecuencia: state.freeAdvanced?.frecuencia || "",
      duracion: state.freeAdvanced?.duracion || "",
      observaciones: ""
    };

    const combined = [];
    if (base.especie || base.dosis > 0 || base.unidadDosis) combined.push(base);
    fromRows.forEach((row) => combined.push(row));
    return dedupeSpeciesDoses(combined);
  }

  function dedupeSpeciesDoses(items) {
    const seen = new Set();
    const result = [];
    (Array.isArray(items) ? items : []).forEach((row) => {
      const normalized = {
        especie: String(row.especie || "").trim(),
        dosis: parseNum(row.dosis),
        unidadDosis: String(row.unidadDosis || "").trim(),
        frecuencia: String(row.frecuencia || "").trim(),
        duracion: String(row.duracion || "").trim(),
        observaciones: String(row.observaciones || row.notas || "").trim(),
        notas: String(row.notas || row.observaciones || "").trim()
      };
      const key = `${normalized.especie.toLowerCase()}|${normalized.dosis}|${normalized.unidadDosis.toLowerCase()}`;
      if (!normalized.especie && !(normalized.dosis > 0) && !normalized.unidadDosis) return;
      if (seen.has(key)) return;
      seen.add(key);
      result.push(normalized);
    });
    return result;
  }

  function getEffectiveRoutesFromState(state) {
    const advanced = state.freeAdvanced || {};
    const form = state.freeForm || {};
    const raw = [
      advanced.viaAdministracion,
      form.viaAdministracion,
      ...(Array.isArray(advanced.routes) ? advanced.routes.map((row) => row.via || row.value || row) : [])
    ];
    return normalizedRoutes(raw);
  }

  function normalizedRoutes(items) {
    const seen = new Set();
    const result = [];
    (Array.isArray(items) ? items : []).forEach((item) => {
      const value = String(typeof item === "string" ? item : (item?.via || item?.value || "")).trim();
      if (!value) return;
      const key = value.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      result.push(value);
    });
    return result;
  }

  function getEffectivePresentations(state) {
    const form = state.freeForm || {};
    const main = {
      id: "main",
      nombre: "Presentacion principal",
      concentracion: parseNum(form.concentracion),
      unidadConcentracion: resolveUnit(form.unidadConcentracion, form.unidadConcentracionCustom),
      notas: "Concentracion base registrada en Calculadora Libre"
    };
    return normalizedPresentations(state.freeAdvanced?.presentations || [], main);
  }

  function normalizedPresentations(items, mainPresentation = null) {
    const result = [];
    if (mainPresentation && (Number(mainPresentation.concentracion) > 0 || mainPresentation.unidadConcentracion)) {
      result.push({
        id: mainPresentation.id || "main",
        nombre: mainPresentation.nombre || "Presentacion principal",
        concentracion: parseNum(mainPresentation.concentracion),
        unidadConcentracion: String(mainPresentation.unidadConcentracion || "").trim(),
        notas: String(mainPresentation.notas || "").trim(),
        principal: true
      });
    }

    (Array.isArray(items) ? items : []).forEach((row) => {
      const unit = resolveUnit(row.unidadConcentracion || row.unit, row.unidadConcentracionCustom);
      const item = {
        id: row.id || createId("presentation"),
        nombre: String(row.nombre || row.name || "Presentacion").trim(),
        concentracion: parseNum(row.concentracion),
        unidadConcentracion: unit,
        notas: String(row.notas || "").trim(),
        principal: Boolean(row.principal)
      };
      if (item.concentracion > 0 || item.unidadConcentracion || item.nombre) result.push(item);
    });

    const seen = new Set();
    return result.filter((row) => {
      const key = `${row.nombre.toLowerCase()}|${row.concentracion}|${row.unidadConcentracion.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getEffectiveWithdrawalItems(state) {
    return normalizeWithdrawalItems(state.freeAdvanced?.withdrawalItems || [], state.freeAdvanced?.tiempoRetiro || "");
  }

  function normalizedSpeciesDoses(items) {
    return (Array.isArray(items) ? items : [])
      .map((row) => ({
        especie: String(row.especie || "").trim(),
        dosis: parseNum(row.dosis),
        unidadDosis: resolveUnit(row.unidadDosis, row.unidadDosisCustom),
        frecuencia: String(row.frecuencia || "").trim(),
        duracion: String(row.duracion || "").trim(),
        observaciones: String(row.observaciones || row.notas || "").trim(),
        notas: String(row.notas || row.observaciones || "").trim()
      }))
      .filter((row) => row.especie || row.dosis > 0 || row.unidadDosis || row.notas || row.frecuencia || row.duracion || row.observaciones);
  }

  function normalizeWithdrawalItems(items, fallbackText = "") {
    const normalized = (Array.isArray(items) ? items : [])
      .map((row) => ({
        id: row.id || createId("withdrawal"),
        tipo: String(row.tipo || row.type || "General").trim(),
        estado: String(row.estado || row.status || "no_especificado").trim(),
        dias: parseNum(row.dias != null ? row.dias : row.days),
        notas: String(row.notas || row.notes || "").trim()
      }))
      .filter((row) => row.tipo || row.estado || row.dias > 0 || row.notas);

    if (normalized.length) return normalized;
    const fallback = String(fallbackText || "").trim();
    if (fallback) {
      return [{
        id: createId("withdrawal"),
        tipo: "General",
        estado: "no_especificado",
        dias: 0,
        notas: fallback
      }];
    }
    return [buildDefaultWithdrawalItem()];
  }

  function formatWithdrawalSummary(items, fallback = "") {
    const hasItems = Array.isArray(items) && items.length > 0;
    if (!hasItems && String(fallback || "").trim()) return String(fallback || "").trim();
    const normalized = normalizeWithdrawalItems(items, fallback).filter(isValidWithdrawalItem);
    if (!normalized.length) return String(fallback || "").trim();
    return normalized.map(formatWithdrawalItem).filter(Boolean).join("; ");
  }

  function formatWithdrawalItem(item) {
    const type = String(item.tipo || "General").trim();
    const status = String(item.estado || "").trim();
    const notes = String(item.notas || "").trim();
    if (status === "no_aplica") return `${type}: No aplica${notes ? ` (${notes})` : ""}`;
    if (status === "no_especificado") return `${type}: No especificado${notes ? ` (${notes})` : ""}`;
    if (status === "dias") return `${type}: ${formatNum(item.dias)} dias${notes ? ` (${notes})` : ""}`;
    return notes || "";
  }

  function compactLegacyHistorySnapshots(items) {
    let compacted = false;
    const next = (Array.isArray(items) ? items : []).map((entry) => {
      if (!entry || typeof entry !== "object") return entry;
      const snapshot = entry.snapshot && typeof entry.snapshot === "object" ? entry.snapshot : null;
      const advanced = snapshot?.advanced && typeof snapshot.advanced === "object" ? snapshot.advanced : null;
      if (!advanced) return entry;

      const image = String(advanced.productImage || "").trim();
      if (!image) return entry;

      compacted = true;
      return {
        ...entry,
        snapshot: {
          ...snapshot,
          advanced: {
            ...advanced,
            productImage: "",
            productImageSource: advanced.productImageSource || "upload",
            productImageName: advanced.productImageName || "Imagen migrada"
          }
        }
      };
    });
    return { items: next, compacted };
  }

  function compactCustomItemsForStorage(items) {
    let compacted = false;
    const next = (Array.isArray(items) ? items : []).map((item) => {
      if (!item || typeof item !== "object") return item;

      let nextItem = item;
      if (String(item.productImage || "").startsWith("data:") && String(item.productImage || "").length > MAX_PRODUCT_IMAGE_SIZE) {
        compacted = true;
        nextItem = {
          ...nextItem,
          productImage: "",
          productImageSource: item.productImageSource || "upload",
          productImageName: item.productImageName || "Imagen cargada"
        };
      }

      const snapshot = nextItem.snapshot && typeof nextItem.snapshot === "object" ? nextItem.snapshot : null;
      const advanced = snapshot?.advanced && typeof snapshot.advanced === "object" ? snapshot.advanced : null;
      if (advanced && String(advanced.productImage || "").trim()) {
        compacted = true;
        nextItem = {
          ...nextItem,
          snapshot: {
            ...snapshot,
            advanced: {
              ...advanced,
              productImage: "",
              productImageSource: advanced.productImageSource || "upload",
              productImageName: advanced.productImageName || "Imagen cargada"
            }
          }
        };
      }

      return nextItem;
    });

    return { items: next, compacted };
  }

  function shouldStoreProductImage(image, source) {
    const clean = String(image || "").trim();
    if (!clean) return false;
    if (clean.startsWith("data:")) return clean.length <= MAX_PRODUCT_IMAGE_SIZE;
    return true;
  }

  function recalcSingleComponent(comp, sharedWeight) {
    const payload = {
      nombre: comp.nombre,
      especie: "",
      pesoKg: sharedWeight,
      dosis: comp.dosis,
      unidadDosis: comp.unidadDosis,
      unidadDosisCustom: comp.unidadDosisCustom,
      concentracion: comp.concentracion,
      unidadConcentracion: comp.unidadConcentracion,
      unidadConcentracionCustom: comp.unidadConcentracionCustom
    };
    comp.result = calculateFreeDose(payload);
  }

  function persistCustom(state) {
    return writeStorageArray(STORAGE_CUSTOM, state.customItems, { replaceOnFail: true });
  }

  function persistHistory(state) {
    return writeStorageArray(STORAGE_HISTORY, state.historyItems, { silent: true, replaceOnFail: true });
  }

  function renderSubmoduleFromPanel(panel, state) {
    const root = panel.closest("#farma-root");
    if (!root) return;
    const subnav = root.querySelector("#farma-subnav");
    const content = root.querySelector("#farma-submodule-panel");
    renderSubnav(subnav, state);
    renderActiveSubmodule(content, state);
  }

  function clearEditingIfManualNameChange(state) {
    if (!state.editingPersonalizedId) return;
    const custom = state.customItems.find((item) => item.id === state.editingPersonalizedId);
    if (!custom) {
      state.editingPersonalizedId = "";
      return;
    }

    if (String(state.freeForm.nombre || "").trim() !== String(custom.nombre || "").trim()) {
      state.editingPersonalizedId = "";
    }
  }

  // ---------------------------------------------------------------------------
  // Recetario utility mapper helpers
  // ---------------------------------------------------------------------------
  function parseResultValue(resultText) {
    const raw = String(resultText || "").trim();
    if (!raw) return 0;
    const num = Number(raw.split(" ")[0].replace(",", "."));
    return Number.isFinite(num) ? num : 0;
  }

  function parseResultUnit(resultText) {
    const raw = String(resultText || "").trim();
    if (!raw.includes(" ")) return "";
    return raw.split(" ").slice(1).join(" ");
  }

  // ---------------------------------------------------------------------------
  // Calculadora: parser y conversiones
  // ---------------------------------------------------------------------------
  function parseDoseUnit(unit) {
    const raw = String(unit || "").trim();
    if (!raw) return { ok: false, error: "Unidad de dosis vacia." };

    const normalized = raw.replace(/\s+/g, "").toLowerCase();
    if (normalized.includes("/kg")) {
      const base = raw.split("/")[0].trim();
      const baseNormalized = normalizeMicro(base);
      if (!baseNormalized) return { ok: false, error: "Unidad de dosis no reconocida." };
      return { ok: true, isPerKg: true, baseUnit: baseNormalized };
    }

    const referenceMatch = normalized.match(/^(.+)\/(\d+(?:[\.,]\d+)?)kg$/);
    if (referenceMatch) {
      const baseNormalized = normalizeMicro(referenceMatch[1]);
      const referenceKg = Number(referenceMatch[2].replace(",", "."));
      if (!baseNormalized || !(referenceKg > 0)) return { ok: false, error: "Unidad de dosis no reconocida." };
      return { ok: true, isPerKg: false, referenceKg, baseUnit: baseNormalized };
    }

    if (normalized.includes("/animal")) {
      const base = raw.split("/")[0].trim();
      const baseNormalized = normalizeMicro(base);
      if (!baseNormalized) return { ok: false, error: "Unidad de dosis no reconocida." };
      return { ok: true, isPerKg: false, baseUnit: baseNormalized };
    }

    const asBase = normalizeMicro(raw);
    if (!asBase) return { ok: false, error: "Unidad de dosis no reconocida." };
    return { ok: true, isPerKg: false, baseUnit: asBase };
  }

  function parseConcentrationUnit(unit, value) {
    const raw = String(unit || "").trim();
    if (!raw) return { ok: false, error: "Unidad de concentracion vacia." };

    const normalized = normalizeMicro(raw).replace(/\s+/g, "").toLowerCase();

    if (normalized === "%") {
      const mgPerMl = Number(value) * 10;
      return {
        ok: true,
        numeratorUnit: "mg",
        denominatorUnit: "mL",
        valuePerDenominator: mgPerMl,
        conversionNote: `${formatNum(value)}% equivale aproximadamente a ${formatNum(mgPerMl)} mg/mL (solucion p/v).`
      };
    }

    if (normalized === "g/100ml" || normalized === "g/100mL".toLowerCase()) {
      const mgPerMl = Number(value) * 10;
      return {
        ok: true,
        numeratorUnit: "mg",
        denominatorUnit: "mL",
        valuePerDenominator: mgPerMl,
        conversionNote: `${formatNum(value)} g/100 mL equivale a ${formatNum(mgPerMl)} mg/mL.`
      };
    }

    const chunks = raw.split("/").map((x) => x.trim()).filter(Boolean);
    if (chunks.length !== 2) {
      return { ok: false, error: "Formato de concentracion no valido. Usa por ejemplo mg/mL o mg/tableta." };
    }

    const numerator = normalizeMicro(chunks[0]);
    const denominator = normalizeDenominator(chunks[1]);

    if (!numerator || !denominator) {
      return { ok: false, error: "Unidad de concentracion no reconocida." };
    }

    return {
      ok: true,
      numeratorUnit: numerator,
      denominatorUnit: denominator,
      valuePerDenominator: Number(value),
      conversionNote: ""
    };
  }

  function normalizeDenominator(value) {
    const raw = normalizeMicro(String(value || "").trim().toLowerCase());
    if (!raw) return "";

    if (["ml", "mL".toLowerCase()].includes(raw.toLowerCase())) return "mL";
    if (["tableta", "tabletas", "comprimido", "comprimidos", "capsula", "capsulas"].includes(raw.toLowerCase())) return "tableta";
    if (["ui", "u.i."].includes(raw.toLowerCase())) return "UI";
    if (["g", "gramo", "gramos"].includes(raw.toLowerCase())) return "g";
    if (["mg"].includes(raw.toLowerCase())) return "mg";
    return raw;
  }

  function normalizeMicro(text) {
    return String(text || "")
      .replace(/[µμ]/g, "u")
      .replace(/\s+/g, " ")
      .trim();
  }

  function convertValue(value, fromUnit, toUnit) {
    const from = String(fromUnit || "").toLowerCase();
    const to = String(toUnit || "").toLowerCase();

    if (from === to) {
      return { ok: true, value: Number(value), note: "" };
    }

    // Base to mg
    const asMg = (() => {
      if (from === "mg") return Number(value);
      if (from === "g") return Number(value) * 1000;
      if (from === "ug") return Number(value) / 1000;
      return null;
    })();

    if (asMg == null) {
      if (from === "ui" && to === "ui") return { ok: true, value: Number(value), note: "" };
      if (from === "ml" && to === "ml") return { ok: true, value: Number(value), note: "" };
      return { ok: false, value: 0, note: "" };
    }

    let converted = null;
    if (to === "mg") converted = asMg;
    if (to === "g") converted = asMg / 1000;
    if (to === "ug") converted = asMg * 1000;

    if (converted == null) {
      return { ok: false, value: 0, note: "" };
    }

    const note = `Conversion aplicada: ${formatNum(value)} ${fromUnit} = ${formatNum(converted)} ${toUnit}.`;
    return { ok: true, value: converted, note };
  }

  function resolveUnit(selected, custom) {
    const value = String(selected || "").trim();
    if (!value) return "";
    if (value !== "Otro") return value;
    return String(custom || "").trim();
  }

  function normalizeInteractionLevel(mode) {
    if (mode === "sinergismo") return "sinergismo";
    if (mode === "antagonismo") return "antagonismo";
    if (mode === "precaucion") return "precaucion";
    return "sin_alertas";
  }

  function interactionTitle(mode) {
    if (mode === "sinergismo") return "Posible sinergismo";
    if (mode === "antagonismo") return "Posible antagonismo";
    if (mode === "precaucion") return "Precaucion";
    return "Sin alertas conocidas";
  }

  // ---------------------------------------------------------------------------
  // Formularios helpers
  // ---------------------------------------------------------------------------
  function buildDefaultFreeForm() {
    return {
      nombre: "",
      especie: "",
      viaAdministracion: "",
      pesoKg: "",
      dosis: "",
      unidadDosis: "mg/kg",
      unidadDosisCustom: "",
      concentracion: "",
      unidadConcentracion: "mg/mL",
      unidadConcentracionCustom: ""
    };
  }

  function buildDefaultAdvancedForm() {
    return {
      nombreComercial: "",
      laboratorio: "",
      grupoKey: "",
      funcionTerapeutica: "",
      mecanismoAccion: "",
      descripcion: "",
      viaAdministracion: "",
      frecuencia: "",
      duracion: "",
      contraindicaciones: "",
      precauciones: "",
      clinicalObservations: buildDefaultClinicalObservations(),
      efectosAdversos: "",
      tiempoRetiro: "",
      observaciones: "",
      bibliografia: "",
      interactionMode: "auto",
      speciesDoses: [],
      routes: [],
      presentations: [],
      withdrawalItems: [buildDefaultWithdrawalItem()],
      productImage: "",
      productImageSource: "",
      productImageName: ""
    };
  }

  function buildDefaultClinicalObservations() {
    return {
      contraindicaciones: [],
      precauciones: [],
      contraindicacionesPersonalizadas: [],
      precaucionesPersonalizadas: []
    };
  }

  function buildDefaultClinicalAnimalData() {
    return {
      open: false,
      conditions: [],
      custom: ""
    };
  }

  function resetFreeCalculatorState(state, opts = {}) {
    state.freeForm = buildDefaultFreeForm();
    state.freeAdvanced = buildDefaultAdvancedForm();
    state.freeComponents = [];
    state.freeResult = null;
    state.freeAlerts = [];
    state.freeClinical = buildDefaultClinicalAnimalData();
    state.freeClinicalAlerts = [];
    state.freeSaveMissing = [];
    state.freeSaveNotice = null;
    state.freePendingDuplicate = null;
    state.freeProcedureVisible = false;
    state.freeAdvancedVisible = Boolean(opts.professional);
    state.clinicalObservationTarget = "";
    state.editingPersonalizedId = "";
    state.freeLastHistoryId = "";
  }

  function buildDefaultSpeciesDose() {
    return {
      id: createId("sdose"),
      especie: "",
      dosis: "",
      unidadDosis: "mg/kg",
      unidadDosisCustom: "",
      frecuencia: "",
      duracion: "",
      observaciones: "",
      notas: ""
    };
  }

  function buildDefaultRoute() {
    return {
      id: createId("route"),
      via: "",
      notas: ""
    };
  }

  function buildDefaultPresentation() {
    return {
      id: createId("presentation"),
      nombre: "",
      concentracion: "",
      unidadConcentracion: "mg/mL",
      unidadConcentracionCustom: "",
      notas: ""
    };
  }

  function buildDefaultWithdrawalItem(tipo = "General", estado = "no_especificado") {
    return {
      id: createId("withdrawal"),
      tipo,
      estado,
      dias: "",
      notas: ""
    };
  }

  function buildDefaultComponent() {
    return {
      id: createId("comp"),
      nombre: "",
      grupoKey: "",
      concentracion: "",
      unidadConcentracion: "mg/mL",
      unidadConcentracionCustom: "",
      dosis: "",
      unidadDosis: "mg/kg",
      unidadDosisCustom: "",
      funcion: "",
      observaciones: "",
      advertencias: "",
      result: null
    };
  }

  function inputField(label, id, value) {
    return `
      <label class="farma-field">
        <span>${escapeHtml(label)}</span>
        <input class="sv-input" id="${escapeAttr(id)}" value="${escapeAttr(value || "")}" />
      </label>
    `;
  }

  function inputFieldWithName(label, name, value) {
    return `
      <label class="farma-field">
        <span>${escapeHtml(label)}</span>
        <input class="sv-input" name="${escapeAttr(name)}" value="${escapeAttr(value || "")}" />
      </label>
    `;
  }

  function numberField(label, id, value, min, step) {
    return `
      <label class="farma-field">
        <span>${escapeHtml(label)}</span>
        <input type="number" class="sv-input" id="${escapeAttr(id)}" value="${escapeAttr(value || "")}" min="${escapeAttr(min || "0")}" step="${escapeAttr(step || "any")}" />
      </label>
    `;
  }

  function numberFieldWithName(label, name, value, min, step) {
    return `
      <label class="farma-field">
        <span>${escapeHtml(label)}</span>
        <input type="number" class="sv-input" name="${escapeAttr(name)}" value="${escapeAttr(value || "")}" min="${escapeAttr(min || "0")}" step="${escapeAttr(step || "any")}" />
      </label>
    `;
  }

  function textareaField(label, id, value) {
    return `
      <label class="farma-field farma-field-wide">
        <span>${escapeHtml(label)}</span>
        <textarea class="sv-input" id="${escapeAttr(id)}">${escapeHtml(value || "")}</textarea>
      </label>
    `;
  }

  function unitField(label, selectId, selected, options, customValue, customId) {
    const opts = options.map((opt) => `<option value="${escapeAttr(opt)}" ${selected === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`).join("");

    return `
      <label class="farma-field">
        <span>${escapeHtml(label)}</span>
        <select class="sv-select" id="${escapeAttr(selectId)}">${opts}</select>
        ${selected === "Otro" ? `<input class="sv-input" id="${escapeAttr(customId)}" placeholder="Unidad personalizada" value="${escapeAttr(customValue || "")}" />` : ""}
      </label>
    `;
  }

  function speciesField(label, selectId, customId, currentValue) {
    const normalized = String(currentValue || "").trim();
    const known = SPECIES_OPTIONS.includes(normalized);
    const selectValue = !normalized ? "" : known ? normalized : "Otro";

    return `
      <label class="farma-field">
        <span>${escapeHtml(label)}</span>
        <select class="sv-select" id="${escapeAttr(selectId)}">
          <option value="" ${!selectValue ? "selected" : ""}>Seleccionar especie</option>
          ${SPECIES_OPTIONS.map((species) => `<option value="${escapeAttr(species)}" ${selectValue === species ? "selected" : ""}>${escapeHtml(species)}</option>`).join("")}
          <option value="Otro" ${selectValue === "Otro" ? "selected" : ""}>Otro</option>
        </select>
        ${selectValue === "Otro" ? `<input class="sv-input" id="${escapeAttr(customId)}" placeholder="Especie personalizada" value="${escapeAttr(normalized)}" />` : ""}
      </label>
    `;
  }

  function routeField(label, selectId, customId, currentValue) {
    const normalized = String(currentValue || "").trim();
    const known = isKnownRoute(normalized);
    const selectValue = !normalized ? "" : known ? normalized : "Otro";

    return `
      <label class="farma-field">
        <span>${escapeHtml(label)}</span>
        <select class="sv-select" id="${escapeAttr(selectId)}">
          <option value="" ${!selectValue ? "selected" : ""}>Seleccionar via</option>
          ${ROUTE_OPTIONS.map((route) => `<option value="${escapeAttr(route.value)}" ${selectValue === route.value ? "selected" : ""}>${escapeHtml(route.label)}</option>`).join("")}
          <option value="Otro" ${selectValue === "Otro" ? "selected" : ""}>Otro</option>
        </select>
        ${selectValue === "Otro" ? `<input class="sv-input" id="${escapeAttr(customId)}" placeholder="Via personalizada" value="${escapeAttr(normalized)}" />` : ""}
      </label>
    `;
  }

  function isKnownRoute(value) {
    const normalized = String(value || "").trim();
    return ROUTE_OPTIONS.some((route) => route.value === normalized);
  }

  function buildGroupOptions(Cat, selected, fallbackFarmacos = []) {
    if (Cat) {
      const groups = Cat.list();
      const options = groups.map((group) => `
        <option value="${escapeAttr(group.id)}" ${selected === group.id ? "selected" : ""}>${escapeHtml(group.label)}</option>
      `);
      if (selected && !groups.some((group) => group.id === selected)) {
        const fallbackLabel = Cat.get?.(selected)?.label || selected;
        options.unshift(`<option value="${escapeAttr(selected)}" selected>${escapeHtml(fallbackLabel)}</option>`);
      }
      return options.join("");
    }

    const fallback = listUnique((Array.isArray(fallbackFarmacos) ? fallbackFarmacos : [])
      .map((item) => String(item?.categoria || item?.grupoKey || item?.grupo || "").trim())
      .filter(Boolean));

    return fallback.map((groupKey) => `
      <option value="${escapeAttr(groupKey)}" ${selected === groupKey ? "selected" : ""}>${escapeHtml(groupKey)}</option>
    `).join("");
  }

  // ---------------------------------------------------------------------------
  // DOM helpers
  // ---------------------------------------------------------------------------
  function bindInput(scope, selector, cb) {
    scope.querySelector(selector)?.addEventListener("input", (event) => cb(event.target.value));
  }

  function bindSelect(scope, selector, cb) {
    scope.querySelector(selector)?.addEventListener("change", (event) => cb(event.target.value));
  }

  function syncFreeStateFromPanel(panel, state) {
    const form = state.freeForm;
    const adv = state.freeAdvanced;

    const previousName = form.nombre;
    if (panel.querySelector("#farma-free-name")) form.nombre = fieldValue(panel, "#farma-free-name");
    if (previousName !== form.nombre) clearEditingIfManualNameChange(state);

    const speciesSelect = panel.querySelector("#farma-free-species-select");
    if (speciesSelect) {
      form.especie = speciesSelect.value === "Otro"
        ? fieldValue(panel, "#farma-free-species-custom")
        : speciesSelect.value;
    }

    const routeSelect = panel.querySelector("#farma-free-route-select");
    if (routeSelect) {
      form.viaAdministracion = routeSelect.value === "Otro"
        ? fieldValue(panel, "#farma-free-route-custom")
        : routeSelect.value;
    }

    if (panel.querySelector("#farma-free-weight")) form.pesoKg = fieldValue(panel, "#farma-free-weight");
    if (panel.querySelector("#farma-free-dose")) form.dosis = fieldValue(panel, "#farma-free-dose");
    if (panel.querySelector("#farma-free-conc")) form.concentracion = fieldValue(panel, "#farma-free-conc");

    const doseUnit = panel.querySelector("#farma-free-dose-unit");
    if (doseUnit) {
      form.unidadDosis = doseUnit.value || "mg/kg";
      form.unidadDosisCustom = form.unidadDosis === "Otro" ? fieldValue(panel, "#farma-free-dose-unit-custom") : "";
    }

    const concUnit = panel.querySelector("#farma-free-conc-unit");
    if (concUnit) {
      form.unidadConcentracion = concUnit.value || "mg/mL";
      form.unidadConcentracionCustom = form.unidadConcentracion === "Otro" ? fieldValue(panel, "#farma-free-conc-unit-custom") : "";
    }

    syncFreeClinicalFromPanel(panel, state);

    if (panel.querySelector("#farma-adv-commercial")) adv.nombreComercial = fieldValue(panel, "#farma-adv-commercial");
    if (panel.querySelector("#farma-adv-lab")) adv.laboratorio = fieldValue(panel, "#farma-adv-lab");
    if (panel.querySelector("#farma-adv-group")) adv.grupoKey = fieldValue(panel, "#farma-adv-group");
    if (panel.querySelector("#farma-adv-func")) adv.funcionTerapeutica = fieldValue(panel, "#farma-adv-func");
    if (panel.querySelector("#farma-adv-mechanism")) adv.mecanismoAccion = fieldValue(panel, "#farma-adv-mechanism");
    if (panel.querySelector("#farma-adv-description")) adv.descripcion = fieldValue(panel, "#farma-adv-description");

    const advRoute = panel.querySelector("#farma-adv-via-select");
    if (advRoute) {
      adv.viaAdministracion = advRoute.value === "Otro"
        ? fieldValue(panel, "#farma-adv-via-custom")
        : advRoute.value;
    }

    if (panel.querySelector("#farma-adv-frequency")) adv.frecuencia = fieldValue(panel, "#farma-adv-frequency");
    if (panel.querySelector("#farma-adv-duration")) adv.duracion = fieldValue(panel, "#farma-adv-duration");
    if (panel.querySelector("#farma-adv-contra")) adv.contraindicaciones = fieldValue(panel, "#farma-adv-contra");
    if (panel.querySelector("#farma-adv-precautions")) adv.precauciones = fieldValue(panel, "#farma-adv-precautions");
    if (panel.querySelector("#farma-adv-adverse")) adv.efectosAdversos = fieldValue(panel, "#farma-adv-adverse");
    if (panel.querySelector("#farma-adv-withdraw")) adv.tiempoRetiro = fieldValue(panel, "#farma-adv-withdraw");
    if (panel.querySelector("#farma-adv-observations")) adv.observaciones = fieldValue(panel, "#farma-adv-observations");
    if (panel.querySelector("#farma-adv-source")) adv.bibliografia = fieldValue(panel, "#farma-adv-source");
    if (panel.querySelector("#farma-interaction-mode")) adv.interactionMode = fieldValue(panel, "#farma-interaction-mode");
    adv.clinicalObservations = normalizeClinicalObservations(adv.clinicalObservations);

    const photoUrl = panel.querySelector("#farma-adv-photo-url");
    if (photoUrl) {
      const cleanUrl = String(photoUrl.value || "").trim();
      if (cleanUrl) {
        adv.productImage = cleanUrl;
        adv.productImageSource = "url";
        adv.productImageName = "URL de imagen";
      } else if (adv.productImageSource === "url") {
        adv.productImage = "";
        adv.productImageSource = "";
        adv.productImageName = "";
      }
    }

    const speciesRows = panel.querySelectorAll("#farma-species-dose-list [data-dose-id]");
    if (speciesRows.length) {
      adv.speciesDoses = Array.from(speciesRows).map((row) => {
        const speciesValue = namedValue(row, "dose-especie-select");
        const unitValue = namedValue(row, "dose-unidadDosis") || "mg/kg";
        return {
          id: row.dataset.doseId || createId("sdose"),
          especie: speciesValue === "Otro" ? namedValue(row, "dose-especie-custom") : speciesValue,
          dosis: namedValue(row, "dose-dosis"),
          unidadDosis: unitValue,
          unidadDosisCustom: unitValue === "Otro" ? namedValue(row, "dose-unidadDosisCustom") : "",
          frecuencia: namedValue(row, "dose-frecuencia"),
          duracion: namedValue(row, "dose-duracion"),
          observaciones: namedValue(row, "dose-observaciones"),
          notas: namedValue(row, "dose-observaciones") || namedValue(row, "dose-notas")
        };
      });
    }

    const routeRows = panel.querySelectorAll("#farma-routes-list [data-route-id]");
    if (routeRows.length) {
      adv.routes = Array.from(routeRows).map((row) => {
        const routeValue = namedValue(row, "route-select");
        return {
          id: row.dataset.routeId || createId("route"),
          via: routeValue === "Otro" ? namedValue(row, "route-custom") : routeValue,
          notas: namedValue(row, "route-notas")
        };
      });
    }

    const presentationRows = panel.querySelectorAll("#farma-presentations-list [data-presentation-id]");
    if (presentationRows.length) {
      adv.presentations = Array.from(presentationRows).map((row) => {
        const unitValue = namedValue(row, "presentation-unidadConcentracion") || "mg/mL";
        return {
          id: row.dataset.presentationId || createId("presentation"),
          nombre: namedValue(row, "presentation-nombre"),
          concentracion: namedValue(row, "presentation-concentracion"),
          unidadConcentracion: unitValue,
          unidadConcentracionCustom: unitValue === "Otro" ? namedValue(row, "presentation-unidadConcentracionCustom") : "",
          notas: namedValue(row, "presentation-notas")
        };
      });
    }

    const withdrawalRows = panel.querySelectorAll("#farma-withdrawal-list [data-withdrawal-id]");
    if (withdrawalRows.length) {
      adv.withdrawalItems = Array.from(withdrawalRows).map((row) => ({
        id: row.dataset.withdrawalId || createId("withdrawal"),
        tipo: namedValue(row, "withdrawal-tipo") || "General",
        estado: namedValue(row, "withdrawal-estado") || "no_especificado",
        dias: namedValue(row, "withdrawal-dias"),
        notas: namedValue(row, "withdrawal-notas")
      }));
    }

    const componentRows = panel.querySelectorAll("#farma-components-list [data-comp-id]");
    if (componentRows.length) {
      state.freeComponents = Array.from(componentRows).map((row) => {
        const current = state.freeComponents.find((item) => item.id === row.dataset.compId) || {};
        const doseUnitValue = namedValue(row, "comp-unidadDosis") || "mg/kg";
        const concUnitValue = namedValue(row, "comp-unidadConcentracion") || "mg/mL";
        const next = {
          ...buildDefaultComponent(),
          ...current,
          id: row.dataset.compId || current.id || createId("comp"),
          nombre: namedValue(row, "comp-nombre"),
          grupoKey: namedValue(row, "comp-grupoKey"),
          concentracion: namedValue(row, "comp-concentracion"),
          unidadConcentracion: concUnitValue,
          unidadConcentracionCustom: concUnitValue === "Otro" ? namedValue(row, "comp-unidadConcentracionCustom") : "",
          dosis: namedValue(row, "comp-dosis"),
          unidadDosis: doseUnitValue,
          unidadDosisCustom: doseUnitValue === "Otro" ? namedValue(row, "comp-unidadDosisCustom") : "",
          funcion: namedValue(row, "comp-funcion"),
          observaciones: namedValue(row, "comp-observaciones"),
          advertencias: namedValue(row, "comp-advertencias")
        };
        recalcSingleComponent(next, form.pesoKg);
        return next;
      });
    }
  }

  function fieldValue(scope, selector) {
    return scope.querySelector(selector)?.value || "";
  }

  function namedValue(scope, name) {
    return scope.querySelector(`[name="${name}"]`)?.value || "";
  }

  // ---------------------------------------------------------------------------
  // utils
  // ---------------------------------------------------------------------------
  function readStorageArray(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeStorageArray(key, value, opts = {}) {
    const serialized = JSON.stringify(Array.isArray(value) ? value : []);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn("[Farma] No se pudo guardar en localStorage:", error);

      if (opts.replaceOnFail) {
        let previous = null;
        try {
          previous = localStorage.getItem(key);
          localStorage.removeItem(key);
          localStorage.setItem(key, serialized);
          return true;
        } catch (replaceError) {
          console.warn("[Farma] No se pudo reemplazar localStorage:", replaceError);
          if (previous != null) {
            try {
              localStorage.setItem(key, previous);
            } catch (restoreError) {
              console.warn("[Farma] No se pudo restaurar localStorage previo:", restoreError);
            }
          }
        }
      }

      if (!opts.silent) {
        toast(opts.message || "No se pudo guardar la informacion localmente. Libera espacio del navegador e intenta de nuevo.");
      }
      return false;
    }
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  function parseNum(value) {
    const n = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  function formatNum(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";
    if (Math.abs(num) >= 1000) return num.toLocaleString("es-EC", { maximumFractionDigits: 2 });
    if (Math.abs(num) >= 10) return num.toLocaleString("es-EC", { maximumFractionDigits: 3 });
    if (Math.abs(num) >= 1) return num.toLocaleString("es-EC", { maximumFractionDigits: 4 });
    return num.toLocaleString("es-EC", { maximumFractionDigits: 6 });
  }

  function formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("es-EC", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function listUnique(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), "es"));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item";
  }

  function toast(message) {
    window.SuiteVet?.Favorites?.showToast?.(message);
    if (window.SuiteVet?.Favorites?.showToast) return;

    const existing = document.getElementById("sv-toast");
    if (existing) existing.remove();
    const node = document.createElement("div");
    node.id = "sv-toast";
    node.className = "sv-toast sv-fade-in";
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2400);
  }
})();

