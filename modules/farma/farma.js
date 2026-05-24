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
    "%",
    "g/100 mL",
    "mL/mL",
    "Otro"
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
      freeSaveMissing: [],
      freeProcedureVisible: false,
      freeAdvancedVisible: false,
      freeLastHistoryId: "",
      editingPersonalizedId: "",

      customItems: readStorageArray(STORAGE_CUSTOM),
      customSearch: "",
      customFilterSpecies: "todas",
      customFilterGroup: "todas",

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

        <div class="cat-chip-grid sv-module-subnav" id="farma-chips"></div>
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
              <span class="sv-card-title">Calculadora Libre</span>
              <span class="sv-card-subtitle">Modo estudiante: calcula sin depender de la base oficial.</span>
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

  function bindFreeCalculatorEvents(panel, state) {
    bindInput(panel, "#farma-free-name", (value) => { state.freeForm.nombre = value; clearEditingIfManualNameChange(state); });
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
    bindInput(panel, "#farma-free-species-custom", (value) => { state.freeForm.especie = value; });
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
    bindInput(panel, "#farma-free-route-custom", (value) => { state.freeForm.viaAdministracion = value; });
    bindInput(panel, "#farma-free-weight", (value) => { state.freeForm.pesoKg = value; });
    bindInput(panel, "#farma-free-dose", (value) => { state.freeForm.dosis = value; });
    bindInput(panel, "#farma-free-conc", (value) => { state.freeForm.concentracion = value; });

    bindSelect(panel, "#farma-free-dose-unit", (value) => {
      state.freeForm.unidadDosis = value;
      renderFreeCalculatorSubmodule(panel, state);
    });
    bindInput(panel, "#farma-free-dose-unit-custom", (value) => { state.freeForm.unidadDosisCustom = value; });

    bindSelect(panel, "#farma-free-conc-unit", (value) => {
      state.freeForm.unidadConcentracion = value;
      renderFreeCalculatorSubmodule(panel, state);
    });
    bindInput(panel, "#farma-free-conc-unit-custom", (value) => { state.freeForm.unidadConcentracionCustom = value; });

    panel.querySelector("#farma-free-calc")?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      const result = calculateFreeDose(state.freeForm);
      state.freeResult = result;
      state.freeAlerts = result.warnings || [];
      state.freeSaveMissing = [];

      if (result.ok) {
        const interactionAlerts = buildInteractionAlerts(state);
        const historyId = appendHistoryEntry(state, {
          farmaco: state.freeForm.nombre,
          especie: state.freeForm.especie,
          peso: parseNum(state.freeForm.pesoKg),
          dosis: parseNum(state.freeForm.dosis),
          unidadDosis: resolveUnit(state.freeForm.unidadDosis, state.freeForm.unidadDosisCustom),
          concentracion: parseNum(state.freeForm.concentracion),
          unidadConcentracion: resolveUnit(state.freeForm.unidadConcentracion, state.freeForm.unidadConcentracionCustom),
          dosisTotal: result.doseTotalValue,
          dosisTotalUnidad: result.doseTotalUnit,
          resultadoCalculado: `${formatNum(result.finalValue)} ${result.finalUnit}`,
          tipoCalculo: state.freeAdvancedVisible ? "profesional" : "simple",
          enviadoRecetario: false,
          guardadoPersonalizado: false,
          contieneComponentes: normalizedComponents(state.freeComponents).length > 0,
          advertencias: state.freeAlerts,
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

      if (result.ok) {
        const interactionAlerts = buildInteractionAlerts(state);
        const historyId = appendHistoryEntry(state, {
          farmaco: state.freeForm.nombre,
          especie: state.freeForm.especie,
          peso: parseNum(state.freeForm.pesoKg),
          dosis: parseNum(state.freeForm.dosis),
          unidadDosis: resolveUnit(state.freeForm.unidadDosis, state.freeForm.unidadDosisCustom),
          concentracion: parseNum(state.freeForm.concentracion),
          unidadConcentracion: resolveUnit(state.freeForm.unidadConcentracion, state.freeForm.unidadConcentracionCustom),
          dosisTotal: result.doseTotalValue,
          dosisTotalUnidad: result.doseTotalUnit,
          resultadoCalculado: `${formatNum(result.finalValue)} ${result.finalUnit}`,
          tipoCalculo: state.freeAdvancedVisible ? "profesional" : "simple",
          enviadoRecetario: false,
          guardadoPersonalizado: false,
          contieneComponentes: normalizedComponents(state.freeComponents).length > 0,
          advertencias: state.freeAlerts,
          interacciones: interactionAlerts.map((x) => x.text),
          snapshot: buildFreeSnapshot(state)
        }, { dedupeMs: 2000 });
        state.freeLastHistoryId = historyId;
      }

      if (!state.freeResult || !state.freeResult.ok) {
        toast("No se pudo calcular una dosis valida para enviar al recetario.");
        renderFreeCalculatorSubmodule(panel, state);
        return;
      }

      const payload = buildRecipePayloadFromFree(state);
      const added = addPayloadToRecipe(payload);
      if (added && state.freeLastHistoryId) {
        patchHistoryEntry(state, state.freeLastHistoryId, { enviadoRecetario: true });
      }
    });

    const saveCustomBtn = panel.querySelector("#farma-free-save-custom-end")
      || panel.querySelector("#farma-free-save-custom");
    saveCustomBtn?.addEventListener("click", () => {
      syncFreeStateFromPanel(panel, state);
      const saveResult = saveFreeAsCustomDrug(state);
      if (!saveResult.ok) {
        if (saveResult.reason === "calc") {
          state.freeSaveMissing = [];
          toast("No se pudo calcular la dosis con los datos actuales. Revisa peso, dosis, concentracion y unidades.");
        }
        if (saveResult.reason === "minimal") {
          state.freeAdvancedVisible = true;
          state.freeSaveMissing = Array.isArray(saveResult.missingFields) ? saveResult.missingFields : [];
          const joined = state.freeSaveMissing.join(", ");
          toast(`Completa los datos clinicos minimos: ${joined || "campos obligatorios"}.`);
        }
        if (saveResult.reason !== "storage" && saveResult.reason !== "calc" && saveResult.reason !== "minimal") {
          toast("Para guardar este farmaco personalizado, completa los datos clinicos minimos.");
        }
      }
      renderFreeCalculatorSubmodule(panel, state);
    });

    panel.querySelector("#farma-free-reset")?.addEventListener("click", () => {
      state.freeForm = buildDefaultFreeForm();
      state.freeAdvanced = buildDefaultAdvancedForm();
      state.freeComponents = [];
      state.freeResult = null;
      state.freeAlerts = [];
      state.freeSaveMissing = [];
      state.freeProcedureVisible = false;
      state.freeAdvancedVisible = false;
      state.editingPersonalizedId = "";
      state.freeLastHistoryId = "";
      renderFreeCalculatorSubmodule(panel, state);
    });

    if (!state.freeAdvancedVisible) return;

    bindAdvancedInputs(panel, state);
    bindSpeciesDoseEvents(panel, state);
    bindPhotoEvents(panel, state);
    bindComponentsEvents(panel, state);
    bindInteractionMode(panel, state);
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
      if (name === "dose-notas") row.notas = event.target.value;
      if (name === "dose-unidadDosisCustom") row.unidadDosisCustom = event.target.value;
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
    const missing = state.freeSaveMissing || [];
    if (!warnings.length && !missing.length) return "";
    return `
      <div class="farma-free-warning">
        ${warnings.map((w) => `<p>${escapeHtml(w)}</p>`).join("")}
        ${missing.length ? `<p><strong>Para guardar faltan:</strong> ${escapeHtml(missing.join(", "))}.</p>` : ""}
      </div>
    `;
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
          ${textareaField("Descripcion", "farma-adv-description", state.freeAdvanced.descripcion)}
          ${routeField("Via de administracion", "farma-adv-via-select", "farma-adv-via-custom", state.freeAdvanced.viaAdministracion)}
          ${inputField("Frecuencia", "farma-adv-frequency", state.freeAdvanced.frecuencia)}
          ${inputField("Duracion del tratamiento", "farma-adv-duration", state.freeAdvanced.duracion)}
          ${textareaField("Contraindicaciones", "farma-adv-contra", state.freeAdvanced.contraindicaciones)}
          ${textareaField("Precauciones", "farma-adv-precautions", state.freeAdvanced.precauciones)}
          ${textareaField("Efectos adversos", "farma-adv-adverse", state.freeAdvanced.efectosAdversos)}
          ${inputField("Tiempo de retiro (si aplica)", "farma-adv-withdraw", state.freeAdvanced.tiempoRetiro)}
          ${textareaField("Observaciones clinicas", "farma-adv-observations", state.freeAdvanced.observaciones)}
          ${inputField("Bibliografia / fuente (opcional)", "farma-adv-source", state.freeAdvanced.bibliografia)}
        </div>

        <section class="farma-dose-species-block">
          <div class="farma-components-header">
            <h3>Dosis por especies (profesional)</h3>
            <button type="button" class="sv-btn sv-btn-secondary" id="farma-add-species-dose">+ Agregar especie</button>
          </div>
          <div id="farma-species-dose-list" class="farma-species-dose-list">
            ${renderSpeciesDoseList(state)}
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

            ${inputFieldWithName("Nota", "dose-notas", row.notas || "")}
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
    let doseTotalValue = parsedDose.isPerKg ? weight * dose : dose;
    const doseTotalUnit = parsedDose.baseUnit;

    if (doseTotalUnit.toLowerCase() === parsedConc.denominatorUnit.toLowerCase()) {
      const stepDoseDirect = `${formatNum(weight)} kg x ${formatNum(dose)} ${doseUnit} = ${formatNum(doseTotalValue)} ${doseTotalUnit}`;
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

    const stepDose = `${formatNum(weight)} kg x ${formatNum(dose)} ${doseUnit} = ${formatNum(doseTotalValue)} ${doseTotalUnit}`;
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
    const speciesOptions = listUnique(state.customItems.map((item) => item.especie).filter(Boolean));
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
      state.activeSubmodule = "libre";
      renderSubmoduleFromPanel(panel, state);
    });

    listRoot?.addEventListener("click", (event) => {
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
        const payload = buildRecipePayloadFromCustom(item);
        const added = addPayloadToRecipe(payload);
        if (added) {
          appendHistoryEntry(state, {
            farmaco: item.nombre,
            especie: item.especie,
            peso: parseNum(item.pesoKg),
            dosis: parseNum(item.dosis),
            unidadDosis: item.unidadDosis,
            concentracion: parseNum(item.concentracion),
            unidadConcentracion: item.unidadConcentracion,
            dosisTotal: parseNum(item.calculo?.dosisTotal),
            dosisTotalUnidad: item.calculo?.dosisTotalUnidad || "",
            resultadoCalculado: `${formatNum(parseNum(item.calculo?.resultadoFinal))} ${item.calculo?.unidadFinal || ""}`,
            tipoCalculo: item.tipoCalculo || "profesional",
            enviadoRecetario: true,
            guardadoPersonalizado: true,
            contieneComponentes: (item.componentes || []).length > 0,
            advertencias: item.advertencias || [],
            interacciones: (item.interacciones || []).map((x) => x.text || x),
            snapshot: item.snapshot || {}
          });
        }
        return;
      }

      if (act === "delete") {
        if (!confirm("Eliminar este farmaco personalizado?")) return;
        state.customItems = state.customItems.filter((x) => x.id !== item.id);
        persistCustom(state);
        renderCustomCards(listRoot, state);
      }
    });
  }

  function renderCustomCards(container, state) {
    if (!container) return;

    const query = (state.customSearch || "").trim().toLowerCase();
    const filtered = state.customItems.filter((item) => {
      const matchQuery = !query || `${item.nombre || ""} ${item.nombreComercial || ""} ${item.funcionTerapeutica || ""}`.toLowerCase().includes(query);
      const matchSpecies = state.customFilterSpecies === "todas" || item.especie === state.customFilterSpecies;
      const matchGroup = state.customFilterGroup === "todas" || item.grupoKey === state.customFilterGroup;
      return matchQuery && matchSpecies && matchGroup;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

    if (!filtered.length) {
      container.innerHTML = `
        <div class="sv-empty">
          <div class="sv-empty-icon">+</div>
          No hay farmacos personalizados con ese criterio.
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    filtered.forEach((item) => {
      const card = document.createElement("article");
      const groupLabel = state.cat?.get?.(item.grupoKey)?.label || item.grupoKey || "Sin grupo";
      const groupIcon = state.cat?.get?.(item.grupoKey)?.icon || "?";
      const components = Array.isArray(item.componentes) ? item.componentes : [];
      const interactions = Array.isArray(item.interacciones) ? item.interacciones : [];
      const speciesDoses = Array.isArray(item.speciesDoses) ? item.speciesDoses : [];

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
              <span class="sv-card-subtitle">${escapeHtml(item.nombreComercial || "Sin nombre comercial")}</span>
            </div>
          </div>
          ${state.cat ? state.cat.badge(item.grupoKey || "default") : `<span class="sv-badge sv-badge-gray">${escapeHtml(groupLabel)}</span>`}
        </div>

        <div class="sv-card-body">
          <p><strong>Especie:</strong> ${escapeHtml(item.especie || "N/D")}</p>
          <p><strong>Dosis:</strong> ${formatNum(item.dosis)} ${escapeHtml(item.unidadDosis || "")}</p>
          <p><strong>Concentracion:</strong> ${formatNum(item.concentracion)} ${escapeHtml(item.unidadConcentracion || "")}</p>
          <p><strong>Via:</strong> ${escapeHtml(item.viaAdministracion || "N/D")}</p>
          <p><strong>Funcion terapeutica:</strong> ${escapeHtml(item.funcionTerapeutica || "N/D")}</p>
          <p><strong>Descripcion:</strong> ${escapeHtml(item.descripcion || item.observaciones || "N/D")}</p>
          ${item.calculo?.resultadoFinal ? `<p><strong>Resultado final:</strong> ${formatNum(item.calculo.resultadoFinal)} ${escapeHtml(item.calculo.unidadFinal || "")}</p>` : ""}
          ${speciesDoses.length ? `<p><strong>Dosis por especies:</strong> ${speciesDoses.length}</p>` : ""}
          <p><strong>Creado:</strong> ${escapeHtml(formatDateTime(item.createdAt))}</p>
          <p><strong>Ultima edicion:</strong> ${escapeHtml(formatDateTime(item.updatedAt || item.createdAt))}</p>
        </div>

        ${item.productImage ? `
          <div class="farma-product-thumb-wrap">
            <img class="farma-product-thumb" src="${escapeAttr(item.productImage)}" alt="Foto de ${escapeAttr(item.nombre || "producto")}" />
          </div>
        ` : ""}

        ${components.length ? `
          <div class="farma-mini-box">
            <strong>Componentes activos:</strong>
            <ul>
              ${components.map((comp) => `<li>${escapeHtml(comp.nombre || "Componente")} - ${escapeHtml(comp.grupoKey || "sin grupo")}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        ${speciesDoses.length ? `
          <div class="farma-mini-box">
            <strong>Otras dosis por especie:</strong>
            <ul>
              ${speciesDoses.map((row) => `<li>${escapeHtml(row.especie || "Especie")} - ${formatNum(row.dosis)} ${escapeHtml(row.unidadDosis || "")}${row.notas ? ` (${escapeHtml(row.notas)})` : ""}</li>`).join("")}
            </ul>
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

        <div class="sv-card-footer farma-custom-actions">
          <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-custom-action="reuse" data-custom-id="${escapeAttr(item.id)}">Reutilizar</button>
          <button class="sv-btn sv-btn-sm sv-btn-secondary" type="button" data-custom-action="edit" data-custom-id="${escapeAttr(item.id)}">Editar</button>
          <button class="sv-btn sv-btn-sm sv-btn-primary" type="button" data-custom-action="recipe" data-custom-id="${escapeAttr(item.id)}">Agregar al recetario</button>
          <button class="sv-btn sv-btn-sm sv-btn-danger" type="button" data-custom-action="delete" data-custom-id="${escapeAttr(item.id)}">Eliminar</button>
        </div>
      `;

      window.SuiteVet?.Favorites?.bindCard?.(card);
      container.appendChild(card);
    });
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
      descripcion: item.descripcion || "",
      viaAdministracion: item.viaAdministracion || "",
      frecuencia: item.frecuencia || "",
      duracion: item.duracion || "",
      contraindicaciones: item.contraindicaciones || "",
      precauciones: item.precauciones || "",
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
    state.freeSaveMissing = [];
    state.freeProcedureVisible = false;
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
          Aun no hay calculos registrados en historial.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((entry) => {
      const warningList = Array.isArray(entry.advertencias) ? entry.advertencias : [];
      const interactionList = Array.isArray(entry.interacciones) ? entry.interacciones : [];

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
            </div>
          </div>

          <div class="sv-card-body">
            <p><strong>Peso:</strong> ${formatNum(entry.peso)} kg</p>
            <p><strong>Dosis:</strong> ${formatNum(entry.dosis)} ${escapeHtml(entry.unidadDosis || "")}</p>
            <p><strong>Concentracion:</strong> ${formatNum(entry.concentracion)} ${escapeHtml(entry.unidadConcentracion || "")}</p>
            <p><strong>Resultado:</strong> ${escapeHtml(entry.resultadoCalculado || "N/D")}</p>
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
      interactionMode: advanced.interactionMode || "auto",
      speciesDoses: (advanced.speciesDoses || []).map((row) => ({
        id: createId("sdose"),
        especie: row.especie || "",
        dosis: row.dosis != null ? String(row.dosis) : "",
        unidadDosis: normalizeFreeUnit(row.unidadDosis, FREE_DOSE_UNIT_OPTIONS),
        unidadDosisCustom: needsCustomUnit(row.unidadDosis, FREE_DOSE_UNIT_OPTIONS) ? row.unidadDosis : "",
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
    state.freeSaveMissing = [];
    state.freeProcedureVisible = false;
    state.editingPersonalizedId = "";
  }

  function saveHistoryAsCustomDrug(state, entry) {
    const snapshot = entry.snapshot || {};
    const form = snapshot.form || {};
    const advanced = snapshot.advanced || {};
    const components = normalizedComponents(snapshot.components || []);

    const toSave = {
      nombre: form.nombre || entry.farmaco || "",
      especie: form.especie || entry.especie || "",
      dosis: parseNum(form.dosis != null ? form.dosis : entry.dosis),
      unidadDosis: form.unidadDosis || entry.unidadDosis || "",
      concentracion: parseNum(form.concentracion != null ? form.concentracion : entry.concentracion),
      unidadConcentracion: form.unidadConcentracion || entry.unidadConcentracion || "",
      grupoKey: advanced.grupoKey || "default",
      viaAdministracion: advanced.viaAdministracion || form.viaAdministracion || "Dato pendiente",
      funcionTerapeutica: advanced.funcionTerapeutica || "Dato pendiente",
      descripcion: advanced.descripcion || advanced.observaciones || "Dato pendiente",
      componentes,
      speciesDoses: normalizedSpeciesDoses(advanced.speciesDoses || []),
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
      funcionTerapeutica: toSave.funcionTerapeutica,
      descripcion: toSave.descripcion,
      nombreComercial: advanced.nombreComercial || "",
      laboratorio: advanced.laboratorio || "",
      frecuencia: advanced.frecuencia || "",
      duracion: advanced.duracion || "",
      contraindicaciones: advanced.contraindicaciones || "",
      precauciones: advanced.precauciones || "",
      efectosAdversos: advanced.efectosAdversos || "",
      tiempoRetiro: advanced.tiempoRetiro || "",
      observaciones: advanced.observaciones || "",
      bibliografia: advanced.bibliografia || "",
      interactionMode: advanced.interactionMode || "auto",
      interacciones: (entry.interacciones || []).map((text) => ({ level: "precaucion", title: "Interaccion", text })),
      advertencias: entry.advertencias || [],
      componentes,
      speciesDoses: toSave.speciesDoses,
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
      concentracion: parseNum(entry.concentracion),
      unidadConcentracion: entry.unidadConcentracion || "",
      dosisTotal: parseNum(entry.dosisTotal),
      dosisTotalUnidad: entry.dosisTotalUnidad || "",
      resultadoCalculado: entry.resultadoCalculado || "",
      tipoCalculo: entry.tipoCalculo || "simple",
      enviadoRecetario: Boolean(entry.enviadoRecetario),
      guardadoPersonalizado: Boolean(entry.guardadoPersonalizado),
      contieneComponentes: Boolean(entry.contieneComponentes),
      advertencias: Array.isArray(entry.advertencias) ? entry.advertencias.filter(Boolean) : [],
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

    try {
      return Boolean(recetario.agregarItemExtendido(payload));
    } catch (error) {
      console.warn("[Farma] Error al enviar al recetario:", error);
      toast("No se pudo agregar al recetario. Revisa los datos e intenta nuevamente.");
      return false;
    }
  }

  function saveFreeAsCustomDrug(state) {
    const result = calculateFreeDose(state.freeForm);
    const form = state.freeForm;
    const advanced = state.freeAdvanced;
    const components = normalizedComponents(state.freeComponents);
    const speciesDoses = normalizedSpeciesDoses(advanced.speciesDoses || []);

    const data = {
      nombre: form.nombre,
      especie: form.especie,
      dosis: parseNum(form.dosis),
      unidadDosis: resolveUnit(form.unidadDosis, form.unidadDosisCustom),
      concentracion: parseNum(form.concentracion),
      unidadConcentracion: resolveUnit(form.unidadConcentracion, form.unidadConcentracionCustom),
      grupoKey: advanced.grupoKey || "default",
      viaAdministracion: advanced.viaAdministracion || form.viaAdministracion || "Dato pendiente",
      funcionTerapeutica: advanced.funcionTerapeutica || "Dato pendiente",
      descripcion: advanced.descripcion || advanced.observaciones || "Dato pendiente",
      componentes,
      speciesDoses
    };

    if (!result || !result.ok) {
      return { ok: false, reason: "calc" };
    }

    const missingFields = getMissingCustomFields(data);
    if (missingFields.length) {
      return { ok: false, reason: "minimal", missingFields };
    }

    state.freeResult = result;
    state.freeAlerts = result.warnings || [];
    state.freeSaveMissing = [];

    const now = new Date().toISOString();
    const interactionAlerts = buildInteractionAlerts(state);

    const payload = {
      id: state.editingPersonalizedId || createId("custom"),
      createdAt: now,
      updatedAt: now,
      nombre: String(form.nombre || "").trim(),
      especie: String(form.especie || "").trim(),
      pesoKg: parseNum(form.pesoKg),
      dosis: parseNum(form.dosis),
      unidadDosis: resolveUnit(form.unidadDosis, form.unidadDosisCustom),
      concentracion: parseNum(form.concentracion),
      unidadConcentracion: resolveUnit(form.unidadConcentracion, form.unidadConcentracionCustom),
      nombreComercial: advanced.nombreComercial || "",
      laboratorio: advanced.laboratorio || "",
      grupoKey: advanced.grupoKey || "default",
      funcionTerapeutica: advanced.funcionTerapeutica || "Dato pendiente",
      descripcion: advanced.descripcion || advanced.observaciones || "Dato pendiente",
      viaAdministracion: advanced.viaAdministracion || form.viaAdministracion || "Dato pendiente",
      frecuencia: advanced.frecuencia || "",
      duracion: advanced.duracion || "",
      contraindicaciones: advanced.contraindicaciones || "",
      precauciones: advanced.precauciones || "",
      efectosAdversos: advanced.efectosAdversos || "",
      tiempoRetiro: advanced.tiempoRetiro || "",
      observaciones: advanced.observaciones || "",
      bibliografia: advanced.bibliografia || "",
      interactionMode: advanced.interactionMode || "auto",
      interacciones: interactionAlerts,
      advertencias: state.freeAlerts || [],
      componentes,
      speciesDoses,
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

    if (state.editingPersonalizedId) {
      const current = state.customItems.find((item) => item.id === state.editingPersonalizedId);
      payload.createdAt = current?.createdAt || now;
      nextCustomItems = state.customItems.map((item) =>
        item.id === state.editingPersonalizedId ? { ...item, ...payload, updatedAt: now } : item
      );
      successMessage = "Farmaco personalizado actualizado.";
    } else {
      nextCustomItems.unshift(payload);
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
    return { ok: true };
  }

  function getMissingCustomFields(data) {
    const missing = [];
    if (!String(data.nombre || "").trim()) missing.push("Nombre del farmaco");
    if (!String(data.especie || "").trim()) missing.push("Especie");
    if (!(Number(data.dosis) > 0)) missing.push("Dosis");
    if (!String(data.unidadDosis || "").trim()) missing.push("Unidad de dosis");
    if (!(Number(data.concentracion) > 0)) missing.push("Concentracion");
    if (!String(data.unidadConcentracion || "").trim()) missing.push("Unidad de concentracion");
    const comps = Array.isArray(data.componentes) ? data.componentes : [];
    if (comps.length > 1) {
      const validComponents = comps.every((comp) =>
        String(comp.nombre || "").trim() &&
        String(comp.grupoKey || "").trim() &&
        Number(comp.concentracion) > 0 &&
        String(comp.unidadConcentracion || "").trim() &&
        Number(comp.dosis) > 0 &&
        String(comp.unidadDosis || "").trim()
      );
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
      viaAdministracion: advanced.viaAdministracion || form.viaAdministracion || "",
      frecuencia: advanced.frecuencia,
      duracion: advanced.duracion,
      indicaciones: advanced.funcionTerapeutica,
      advertencias: (state.freeAlerts || []).concat(interactions.map((x) => x.text)).filter(Boolean),
      observaciones: advanced.observaciones || advanced.descripcion,
      componentes,
      speciesDoses: normalizedSpeciesDoses(advanced.speciesDoses || []),
      tiempoRetiro: advanced.tiempoRetiro
    };
  }

  function buildRecipePayloadFromCustom(item) {
    return {
      nombre: item.nombre,
      nombreComercial: item.nombreComercial,
      especie: item.especie,
      pesoKg: item.pesoKg,
      dosis: item.dosis,
      unidadDosis: item.unidadDosis,
      dosisTotal: item.calculo?.dosisTotal,
      dosisTotalUnidad: item.calculo?.dosisTotalUnidad,
      resultadoFinal: item.calculo?.resultadoFinal,
      unidadFinal: item.calculo?.unidadFinal,
      concentracion: item.concentracion,
      unidadConcentracion: item.unidadConcentracion,
      viaAdministracion: item.viaAdministracion,
      frecuencia: item.frecuencia,
      duracion: item.duracion,
      indicaciones: item.funcionTerapeutica,
      advertencias: (item.advertencias || []).concat((item.interacciones || []).map((x) => x.text || x)).filter(Boolean),
      observaciones: item.observaciones || item.descripcion,
      componentes: item.componentes || [],
      speciesDoses: item.speciesDoses || [],
      tiempoRetiro: item.tiempoRetiro
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
      viaAdministracion: advanced.viaAdministracion || form.viaAdministracion || "",
      frecuencia: advanced.frecuencia || "",
      duracion: advanced.duracion || "",
      indicaciones: advanced.funcionTerapeutica || "",
      advertencias: (entry.advertencias || []).concat(entry.interacciones || []).filter(Boolean),
      observaciones: advanced.observaciones || advanced.descripcion || "",
      componentes: snapshot.components || [],
      speciesDoses: advanced.speciesDoses || [],
      tiempoRetiro: advanced.tiempoRetiro || ""
    };
  }

  function buildFreeSnapshot(state) {
    const hasProductImage = Boolean(String(state.freeAdvanced.productImage || "").trim());
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
        speciesDoses: normalizedSpeciesDoses(state.freeAdvanced.speciesDoses || []),
        // Evita inflar historial con imagenes base64 y reduce errores de cuota.
        productImage: "",
        productImageSource: state.freeAdvanced.productImageSource || (hasProductImage ? "upload" : ""),
        productImageName: state.freeAdvanced.productImageName || ""
      },
      components: normalizedComponents(state.freeComponents),
      result: state.freeResult ? {
        doseTotalValue: state.freeResult.doseTotalValue,
        doseTotalUnit: state.freeResult.doseTotalUnit,
        finalValue: state.freeResult.finalValue,
        finalUnit: state.freeResult.finalUnit
      } : null
    };
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

  function normalizedSpeciesDoses(items) {
    return (Array.isArray(items) ? items : [])
      .map((row) => ({
        especie: String(row.especie || "").trim(),
        dosis: parseNum(row.dosis),
        unidadDosis: resolveUnit(row.unidadDosis, row.unidadDosisCustom),
        notas: String(row.notas || "").trim()
      }))
      .filter((row) => row.especie || row.dosis > 0 || row.unidadDosis || row.notas);
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
      if (String(item.productImage || "").startsWith("data:")) {
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
    if (String(source || "") === "upload") return false;
    return !clean.startsWith("data:");
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
      descripcion: "",
      viaAdministracion: "",
      frecuencia: "",
      duracion: "",
      contraindicaciones: "",
      precauciones: "",
      efectosAdversos: "",
      tiempoRetiro: "",
      observaciones: "",
      bibliografia: "",
      interactionMode: "auto",
      speciesDoses: [],
      productImage: "",
      productImageSource: "",
      productImageName: ""
    };
  }

  function buildDefaultSpeciesDose() {
    return {
      id: createId("sdose"),
      especie: "",
      dosis: "",
      unidadDosis: "mg/kg",
      unidadDosisCustom: "",
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

    if (panel.querySelector("#farma-adv-commercial")) adv.nombreComercial = fieldValue(panel, "#farma-adv-commercial");
    if (panel.querySelector("#farma-adv-lab")) adv.laboratorio = fieldValue(panel, "#farma-adv-lab");
    if (panel.querySelector("#farma-adv-group")) adv.grupoKey = fieldValue(panel, "#farma-adv-group");
    if (panel.querySelector("#farma-adv-func")) adv.funcionTerapeutica = fieldValue(panel, "#farma-adv-func");
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
          notas: namedValue(row, "dose-notas")
        };
      });
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
