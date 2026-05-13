// =============================================================================
// SUITE VET 2.0 — modules/micro/micro.js
// Módulo de Microbiología: agares, caldos, pruebas, antibióticos, microorganismos.
// Datos en: modules/micro/data.js (window.MICRO_DATA)
// BUG FIX: filtros y buscadores ahora están correctamente conectados.
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("micro-root");
    if (!root) return;

    const D = window.MICRO_DATA || { agares: [], caldos: [], pruebas: [], antibioticos: [], microorganismos: [] };

    // -------------------------------------------------------------------------
    // 1. INYECTAR HTML DEL MÓDULO
    // -------------------------------------------------------------------------
    root.innerHTML = `
      <h2>Microbiología</h2>
      <p class="sv-view-intro">
        Medios de cultivo, pruebas bioquímicas, antibiograma y atlas bacteriano.
      </p>

      <div class="sv-subnav" id="micro-subnav">
        <button class="sv-tab sv-tab-active" data-pane="agares">Agares</button>
        <button class="sv-tab" data-pane="caldos">Caldos</button>
        <button class="sv-tab" data-pane="pruebas">Pruebas bioquímicas</button>
        <button class="sv-tab" data-pane="antibioticos">Antibióticos</button>
        <button class="sv-tab" data-pane="microorganismos">Atlas bacteriano</button>
      </div>

      <!-- AGARES -->
      <div id="micro-pane-agares" class="sv-pane sv-pane-active">
        <div class="sv-toolbar">
          <input type="text" id="micro-search-agar" class="sv-input" placeholder="Buscar agar…" style="max-width:300px;" />
          <select id="micro-filtro-agar" class="sv-select" style="max-width:200px;">
            <option value="">Todos los tipos</option>
            <option value="basico">Básico</option>
            <option value="selectivo">Selectivo</option>
            <option value="diferencial">Diferencial</option>
            <option value="antibiograma">Antibiograma</option>
            <option value="enriquecido">Enriquecido</option>
          </select>
        </div>
        <div class="sv-grid" id="micro-lista-agares"></div>
      </div>

      <!-- CALDOS -->
      <div id="micro-pane-caldos" class="sv-pane">
        <div class="sv-toolbar">
          <input type="text" id="micro-search-caldo" class="sv-input" placeholder="Buscar caldo…" style="max-width:300px;" />
        </div>
        <div class="sv-grid" id="micro-lista-caldos"></div>
      </div>

      <!-- PRUEBAS -->
      <div id="micro-pane-pruebas" class="sv-pane">
        <div class="sv-toolbar">
          <input type="text" id="micro-search-prueba" class="sv-input" placeholder="Buscar prueba…" style="max-width:300px;" />
          <select id="micro-filtro-prueba" class="sv-select" style="max-width:200px;">
            <option value="">Todas las categorías</option>
            <option value="fermentacion">Fermentación</option>
            <option value="citrato">Citrato</option>
            <option value="lisina">Lisina/Ureasa</option>
          </select>
        </div>
        <div class="sv-grid" id="micro-lista-pruebas"></div>
      </div>

      <!-- ANTIBIÓTICOS -->
      <div id="micro-pane-antibioticos" class="sv-pane">
        <div class="sv-toolbar">
          <input type="text" id="micro-search-antibio" class="sv-input" placeholder="Buscar antibiótico…" style="max-width:300px;" />
          <select id="micro-filtro-familia" class="sv-select" style="max-width:200px;">
            <option value="">Todas las familias</option>
            <option value="quinolona">Quinolona/Fluoroquinolona</option>
            <option value="betalactamico">Betalactámico</option>
            <option value="aminoglucosido">Aminoglucósido</option>
            <option value="tetraciclina">Tetraciclina</option>
            <option value="cefalosporina">Cefalosporina</option>
          </select>
          <select id="micro-filtro-espectro" class="sv-select" style="max-width:200px;">
            <option value="">Todo el espectro</option>
            <option value="amplio">Amplio espectro</option>
            <option value="gram-positivo">Gram positivo</option>
            <option value="gram-negativo">Gram negativo</option>
          </select>
        </div>
        <div class="sv-grid" id="micro-lista-antibioticos"></div>
      </div>

      <!-- ATLAS BACTERIANO -->
      <div id="micro-pane-microorganismos" class="sv-pane">
        <div class="sv-toolbar">
          <input type="text" id="micro-search-microorg" class="sv-input" placeholder="Buscar microorganismo…" style="max-width:300px;" />
          <select id="micro-filtro-gram" class="sv-select" style="max-width:160px;">
            <option value="">Gram: Todos</option>
            <option value="grampositivo">Gram positivo</option>
            <option value="gramnegativo">Gram negativo</option>
          </select>
          <select id="micro-filtro-morfologia" class="sv-select" style="max-width:160px;">
            <option value="">Morfología: Todas</option>
            <option value="bacilo">Bacilo</option>
            <option value="coco">Coco</option>
          </select>
          <select id="micro-filtro-sistema" class="sv-select" style="max-width:180px;">
            <option value="">Sistema: Todos</option>
            <option value="digestivo">Digestivo</option>
            <option value="respiratorio">Respiratorio</option>
            <option value="urinario">Urinario</option>
            <option value="sistemico">Sistémico</option>
            <option value="dermatologico">Dermatológico</option>
          </select>
        </div>
        <div class="sv-grid" id="micro-lista-microorg"></div>
      </div>
    `;

    // -------------------------------------------------------------------------
    // 2. TABS
    // -------------------------------------------------------------------------
    const tabs  = root.querySelectorAll(".sv-tab[data-pane]");
    const panes = root.querySelectorAll(".sv-pane");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t)  => t.classList.remove("sv-tab-active"));
        panes.forEach((p) => p.classList.remove("sv-pane-active"));
        tab.classList.add("sv-tab-active");
        root.querySelector(`#micro-pane-${tab.dataset.pane}`)?.classList.add("sv-pane-active");
      });
    });

    // -------------------------------------------------------------------------
    // 3. HELPER: normalizar texto para búsquedas
    // -------------------------------------------------------------------------
    function norm(str) {
      return (str || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function filtrarConQ(q, ...campos) {
      const qn = norm(q);
      return !q || campos.some((c) => norm(c).includes(qn));
    }

    // -------------------------------------------------------------------------
    // 4. AGARES — BUG FIX: filtro conectado
    // -------------------------------------------------------------------------
    const searchAgar  = root.querySelector("#micro-search-agar");
    const filtroAgar  = root.querySelector("#micro-filtro-agar");
    const listaAgares = root.querySelector("#micro-lista-agares");

    searchAgar?.addEventListener("input",  renderAgares);
    filtroAgar?.addEventListener("change", renderAgares);

    function renderAgares() {
      const q   = searchAgar?.value || "";
      const tip = filtroAgar?.value || "";

      const filtrados = D.agares.filter((a) => {
        const pasaQ   = filtrarConQ(q, a.nombre, a.objetivo, a.bacteriasObjetivo.join(" "));
        const pasaTip = !tip || a.tipos.includes(tip);
        return pasaQ && pasaTip;
      });

      listaAgares.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtrados.map((a) => `
          <article class="sv-card micro-card-agar sv-fade-in">
            <div class="sv-card-header">
              <span class="sv-card-title">${a.nombre}</span>
              <span class="sv-badge sv-badge-cyan">${a.gramosPorLitro} g/L</span>
            </div>
            <div class="sv-card-body">
              <p><strong>pH:</strong> ${a.phFinal}</p>
              <p><strong>Objetivo:</strong> ${a.objetivo}</p>
              <p><strong>Bacterias objetivo:</strong> ${a.bacteriasObjetivo.join(", ")}</p>
              <p><strong>Observaciones:</strong> ${a.observaciones}</p>
            </div>
            <div class="sv-card-footer">
              ${a.tipos.map((t) => `<span class="sv-badge sv-badge-gray">${t}</span>`).join("")}
              <div class="micro-calc">
                <div class="micro-calc-row">
                  <div>
                    <span class="micro-calc-label">N° placas (15 mL/placa)</span>
                    <input type="number" class="sv-input _np" placeholder="0" min="1" />
                  </div>
                  <div>
                    <span class="micro-calc-label">Polvo necesario</span>
                    <div class="micro-calc-result _res">—</div>
                  </div>
                </div>
              </div>
            </div>
          </article>`).join("");

      // Calculadoras de agares
      listaAgares.querySelectorAll(".sv-card").forEach((card, i) => {
        const a   = filtrados[i];
        const inp = card.querySelector("._np");
        const res = card.querySelector("._res");
        inp?.addEventListener("input", () => {
          const n = parseInt(inp.value, 10);
          if (!n || n <= 0) { res.textContent = "—"; return; }
          const ml   = n * 15;
          const g    = (a.gramosPorLitro * ml / 1000).toFixed(2);
          res.textContent = `${g} g → ${ml} mL`;
        });
      });
    }

    // -------------------------------------------------------------------------
    // 5. CALDOS
    // -------------------------------------------------------------------------
    const searchCaldo  = root.querySelector("#micro-search-caldo");
    const listaCaldos  = root.querySelector("#micro-lista-caldos");

    searchCaldo?.addEventListener("input", renderCaldos);

    function renderCaldos() {
      const q = searchCaldo?.value || "";
      const filtrados = D.caldos.filter((c) => filtrarConQ(q, c.nombre, c.objetivo));
      listaCaldos.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtrados.map((c) => `
          <article class="sv-card micro-card-caldo sv-fade-in">
            <div class="sv-card-header">
              <span class="sv-card-title">${c.nombre}</span>
              <span class="sv-badge sv-badge-purple">${c.gramosPorLitro} g/L</span>
            </div>
            <div class="sv-card-body">
              <p><strong>pH:</strong> ${c.phFinal}</p>
              <p><strong>Objetivo:</strong> ${c.objetivo}</p>
              <p><strong>Observaciones:</strong> ${c.observaciones}</p>
            </div>
            <div class="sv-card-footer">
              ${c.tipos.map((t) => `<span class="sv-badge sv-badge-gray">${t}</span>`).join("")}
            </div>
          </article>`).join("");
    }

    // -------------------------------------------------------------------------
    // 6. PRUEBAS — BUG FIX: filtro conectado
    // -------------------------------------------------------------------------
    const searchPrueba  = root.querySelector("#micro-search-prueba");
    const filtroPrueba  = root.querySelector("#micro-filtro-prueba");
    const listaPruebas  = root.querySelector("#micro-lista-pruebas");

    searchPrueba?.addEventListener("input",  renderPruebas);
    filtroPrueba?.addEventListener("change", renderPruebas);

    function renderPruebas() {
      const q   = searchPrueba?.value || "";
      const cat = filtroPrueba?.value || "";
      const filtrados = D.pruebas.filter((p) => {
        const pasaQ   = filtrarConQ(q, p.nombre, p.objetivo, p.medioBase);
        const pasaCat = !cat || p.categoria === cat;
        return pasaQ && pasaCat;
      });

      listaPruebas.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtrados.map((p) => `
          <article class="sv-card micro-card-prueba sv-fade-in">
            <div class="sv-card-header">
              <span class="sv-card-title">${p.nombre}</span>
              <span class="sv-badge sv-badge-yellow">${p.categoria}</span>
            </div>
            <div class="sv-card-body">
              <p><strong>Medio base:</strong> ${p.medioBase}</p>
              <p><strong>Objetivo:</strong> ${p.objetivo}</p>
              <p><strong>Inóculo:</strong> ${p.tipoInoculo}</p>
              <p><strong>Incubación:</strong> ${p.incubacion}</p>
              <p><strong>Interpretación:</strong> ${p.interpretacion}</p>
              <p><strong>Observaciones:</strong> ${p.observaciones}</p>
            </div>
          </article>`).join("");
    }

    // -------------------------------------------------------------------------
    // 7. ANTIBIÓTICOS — BUG FIX: ambos filtros conectados
    // -------------------------------------------------------------------------
    const searchAntibio   = root.querySelector("#micro-search-antibio");
    const filtroFamilia   = root.querySelector("#micro-filtro-familia");
    const filtroEspectro  = root.querySelector("#micro-filtro-espectro");
    const listaAntibios   = root.querySelector("#micro-lista-antibioticos");

    searchAntibio?.addEventListener("input",  renderAntibioticos);
    filtroFamilia?.addEventListener("change", renderAntibioticos);
    filtroEspectro?.addEventListener("change",renderAntibioticos);

    function renderAntibioticos() {
      const q   = searchAntibio?.value  || "";
      const fam = filtroFamilia?.value  || "";
      const esp = filtroEspectro?.value || "";

      const filtrados = D.antibioticos.filter((a) => {
        const pasaQ   = filtrarConQ(q, a.nombre, a.familia, a.siglaDisco, a.microorganismosEjemplo.join(" "));
        const pasaFam = !fam || a.familiaKey === fam;
        const pasaEsp = !esp || a.espectroKey === esp;
        return pasaQ && pasaFam && pasaEsp;
      });

      listaAntibios.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtrados.map((a) => `
          <article class="sv-card micro-card-antibio sv-fade-in">
            <div class="sv-card-header">
              <span class="sv-card-title">${a.nombre}</span>
              <span class="sv-badge sv-badge-green">${a.siglaDisco}</span>
            </div>
            <div class="sv-card-body">
              <p><strong>Familia:</strong> ${a.familia}</p>
              <p><strong>Mecanismo:</strong> ${a.mecanismo}</p>
              <p><strong>Tipo de acción:</strong> ${a.tipoAccion}</p>
              <p><strong>Espectro:</strong> ${a.espectro}</p>
              <p><strong>Microorganismos ejemplo:</strong> <em>${a.microorganismosEjemplo.join(", ")}</em></p>
              <p><strong>Notas de lab:</strong> ${a.notasLab}</p>
            </div>
          </article>`).join("");
    }

    // -------------------------------------------------------------------------
    // 8. MICROORGANISMOS — BUG FIX: los 3 filtros conectados
    // -------------------------------------------------------------------------
    const searchMicroorg  = root.querySelector("#micro-search-microorg");
    const filtroGram      = root.querySelector("#micro-filtro-gram");
    const filtroMorfologia= root.querySelector("#micro-filtro-morfologia");
    const filtroSistema   = root.querySelector("#micro-filtro-sistema");
    const listaMicroorg   = root.querySelector("#micro-lista-microorg");

    searchMicroorg?.addEventListener("input",   renderMicroorg);
    filtroGram?.addEventListener("change",      renderMicroorg);
    filtroMorfologia?.addEventListener("change",renderMicroorg);
    filtroSistema?.addEventListener("change",   renderMicroorg);

    function renderMicroorg() {
      const q   = searchMicroorg?.value    || "";
      const gr  = filtroGram?.value        || "";
      const mo  = filtroMorfologia?.value  || "";
      const sis = filtroSistema?.value     || "";

      const filtrados = D.microorganismos.filter((m) => {
        const pasaQ   = filtrarConQ(q, m.nombreCientifico, m.familia, m.importancia);
        const pasaGr  = !gr  || m.gramKey === gr;
        const pasaMo  = !mo  || m.morfologiaKey === mo;
        const pasaSis = !sis || (m.sistemasClave || []).includes(sis);
        return pasaQ && pasaGr && pasaMo && pasaSis;
      });

      listaMicroorg.innerHTML = filtrados.length === 0
        ? `<div class="sv-empty"><div class="sv-empty-icon">🔍</div>Sin resultados</div>`
        : filtrados.map((m) => `
          <article class="sv-card micro-card-microorg sv-fade-in">
            <div class="sv-card-header">
              <span class="sv-card-title" style="font-style:italic;">${m.nombreCientifico}</span>
              <span class="sv-badge ${m.gramKey === 'grampositivo' ? 'micro-gram-pos' : 'micro-gram-neg'}">${m.gramTexto}</span>
            </div>
            <span class="sv-card-subtitle">${m.familia} · ${m.morfologiaKey}</span>
            <div class="sv-card-body">
              <p><strong>Reservorio:</strong> ${m.reservorio}</p>
              <p><strong>Importancia clínica:</strong> ${m.importancia}</p>
              <p><strong>Patogenicidad:</strong> ${m.mecanismoPatogenicidad}</p>
              <p><strong>Lab:</strong> ${m.notasLab}</p>
            </div>
            <div class="sv-card-footer">
              ${(m.sistemasClave || []).map((s) => `<span class="sv-badge sv-badge-blue">${s}</span>`).join("")}
            </div>
          </article>`).join("");
    }

    // -------------------------------------------------------------------------
    // 9. RENDER INICIAL
    // -------------------------------------------------------------------------
    renderAgares();
    renderCaldos();
    renderPruebas();
    renderAntibioticos();
    renderMicroorg();

    // -------------------------------------------------------------------------
    // 10. BUSCADOR GLOBAL
    // -------------------------------------------------------------------------
    if (window.SuiteVet?.registerSearch) {
      window.SuiteVet.registerSearch("micro", (q) => {
        const results = [];
        D.agares.forEach((a) => {
          if (filtrarConQ(q, a.nombre)) results.push({ title: a.nombre, subtitle: "Agar · Microbiología", moduleId: "micro", action: () => { window.SuiteVet.showView("microbiologia"); searchAgar && (searchAgar.value = a.nombre); renderAgares(); }});
        });
        D.antibioticos.forEach((a) => {
          if (filtrarConQ(q, a.nombre, a.siglaDisco)) results.push({ title: a.nombre, subtitle: `${a.siglaDisco} · ${a.familia}`, moduleId: "micro", action: () => { window.SuiteVet.showView("microbiologia"); searchAntibio && (searchAntibio.value = a.nombre); renderAntibioticos(); }});
        });
        D.microorganismos.forEach((m) => {
          if (filtrarConQ(q, m.nombreCientifico, m.familia)) results.push({ title: m.nombreCientifico, subtitle: `${m.gramTexto} · ${m.familia}`, moduleId: "micro", action: () => { window.SuiteVet.showView("microbiologia"); searchMicroorg && (searchMicroorg.value = m.nombreCientifico); renderMicroorg(); }});
        });
        return results;
      });
    }
  });
})();
