// =============================================================================
// SUITE VET — shared/recetario.js
// Recetario medico veterinario: borrador, guardado local y folios numerados.
// =============================================================================

const Recetario = {
  items: [],
  recetasGuardadas: [],
  recetaActivaId: null,
  folioActual: 1,

  STORAGE_RECETA: "suitevet_receta",
  STORAGE_RECETAS: "suitevet_recetas_guardadas",
  STORAGE_DOCTOR: "suitevet_doctor_nombre",
  STORAGE_DRAFT_FIELDS: "suitevet_receta_draft_fields",

  init() {
    this._cacheDOM();
    this._bindEvents();
    this._cargarLocalStorage();
    this._renderTodo();
    this._actualizarVisibilidad(window.SuiteVet?.currentView || "home");
  },

  _cacheDOM() {
    this.btnVer = document.getElementById("sv-fab-receta");
    this.badge = document.getElementById("sv-fab-badge");
    this.modal = document.getElementById("sv-modal-receta");
    this.titulo = document.getElementById("sv-receta-titulo");
    this.btnCerrar = document.getElementById("sv-receta-cerrar");
    this.btnLimpiar = document.getElementById("sv-receta-limpiar");
    this.btnGuardar = document.getElementById("sv-receta-guardar");
    this.btnImprimir = document.getElementById("sv-receta-imprimir");
    this.lista = document.getElementById("sv-lista-receta");
    this.listaGuardadas = document.getElementById("sv-recetas-lista");
    this.totalGuardadas = document.getElementById("sv-recetas-total");
    this.folio = document.getElementById("sv-receta-folio");
    this.numeroLateral = document.getElementById("sv-receta-numero");
    this.inputDoctor = document.getElementById("sv-receta-doctor");
    this.inputFecha = document.getElementById("sv-receta-fecha");
    this.inputPropietario = document.getElementById("sv-receta-propietario");
    this.inputPaciente = document.getElementById("sv-receta-paciente");
    this.inputPeso = document.getElementById("sv-receta-peso");
    this.inputIndicaciones = document.getElementById("sv-receta-indicaciones");
  },

  _bindEvents() {
    this.btnVer?.addEventListener("click", () => this.abrir());
    this.btnCerrar?.addEventListener("click", () => this.cerrar());
    this.btnGuardar?.addEventListener("click", () => this.guardarReceta());
    this.btnImprimir?.addEventListener("click", () => this._imprimir());

    this.btnLimpiar?.addEventListener("click", () => {
      if (confirm("¿Borrar la receta actual y empezar una nueva?")) {
        this.nuevaReceta();
      }
    });

    this.inputDoctor?.addEventListener("input", () => {
      this._setStorageText(this.STORAGE_DOCTOR, this.inputDoctor.value.trim());
      this._guardarDraftFields();
    });

    [
      this.inputFecha,
      this.inputPropietario,
      this.inputPaciente,
      this.inputPeso,
      this.inputIndicaciones
    ].forEach((input) => {
      input?.addEventListener("input", () => this._guardarDraftFields());
      input?.addEventListener("change", () => this._guardarDraftFields());
    });

    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) this.cerrar();
    });

    document.addEventListener("suitevet:viewchange", (e) => {
      this._actualizarVisibilidad(e.detail?.view || "");
    });

    window.addEventListener("afterprint", () => this._limpiarImpresion());
  },

  _cargarLocalStorage() {
    try {
      const guardado = JSON.parse(localStorage.getItem(this.STORAGE_RECETA) || "[]");
      this.items = Array.isArray(guardado) ? guardado : (guardado.items || []);
    } catch {
      this.items = [];
    }

    try {
      const recetas = JSON.parse(localStorage.getItem(this.STORAGE_RECETAS) || "[]");
      this.recetasGuardadas = Array.isArray(recetas) ? recetas : [];
    } catch {
      this.recetasGuardadas = [];
    }

    this.folioActual = this._siguienteNumero();

    const doctor = localStorage.getItem(this.STORAGE_DOCTOR) || "";
    if (this.inputDoctor) this.inputDoctor.value = doctor;

    try {
      const draftFields = JSON.parse(localStorage.getItem(this.STORAGE_DRAFT_FIELDS) || "{}");
      this._setFormData(draftFields, { keepDoctor: true });
    } catch {
      this._setFormData({}, { keepDoctor: true });
    }
  },

  _setStorageJson(key, value, errorMessage = "") {
    const serialized = JSON.stringify(value);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn("[Recetario] No se pudo guardar en localStorage:", key, error);
      if (this._replaceStorageValue(key, serialized)) return true;
      if (errorMessage) this._toast(errorMessage);
      return false;
    }
  },

  _setStorageText(key, value, errorMessage = "") {
    const text = String(value ?? "");
    try {
      localStorage.setItem(key, text);
      return true;
    } catch (error) {
      console.warn("[Recetario] No se pudo guardar texto en localStorage:", key, error);
      if (this._replaceStorageValue(key, text)) return true;
      if (errorMessage) this._toast(errorMessage);
      return false;
    }
  },

  _replaceStorageValue(key, serialized) {
    let previous = null;
    try {
      previous = localStorage.getItem(key);
      localStorage.removeItem(key);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn("[Recetario] No se pudo reemplazar localStorage:", key, error);
      if (previous != null) {
        try {
          localStorage.setItem(key, previous);
        } catch (restoreError) {
          console.warn("[Recetario] No se pudo restaurar localStorage previo:", key, restoreError);
        }
      }
      return false;
    }
  },

  _removeStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("[Recetario] No se pudo limpiar localStorage:", key, error);
      return false;
    }
  },

  _guardar() {
    return this._setStorageJson(
      this.STORAGE_RECETA,
      this.items,
      "No se pudo guardar el recetario. Libera espacio del navegador y vuelve a intentar."
    );
  },

  _guardarRecetas() {
    return this._setStorageJson(
      this.STORAGE_RECETAS,
      this.recetasGuardadas,
      "No se pudo guardar la receta. Libera espacio del navegador y vuelve a intentar."
    );
  },

  _guardarDraftFields() {
    if (this.recetaActivaId) return;
    this._setStorageJson(this.STORAGE_DRAFT_FIELDS, this._getFormData());
  },

  agregarItem(farmaco, dosisCalculada, via, especie, retiroInfo) {
    const item = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      nombre: farmaco.principio,
      comercial: farmaco.comerciales?.[0] || "",
      concentracion: `${farmaco.concentracion} ${farmaco.unidad}`,
      dosis: dosisCalculada,
      via,
      especie,
      retiro: retiroInfo,
      instrucciones: ""
    };

    this.items.push(item);
    if (!this._guardar()) {
      this.items.pop();
      return false;
    }
    this._renderBadge();
    this._animarBadge();
    this._toast(`${item.nombre} agregado a la receta`);
    return true;
  },

  agregarItemExtendido(payload = {}) {
    const nombre = String(payload.nombre || payload.farmaco || "").trim();
    if (!nombre) {
      this._toast("No se pudo agregar al recetario: falta nombre del farmaco.");
      return false;
    }

    const formatNum = (value) => {
      const n = Number(value);
      if (!Number.isFinite(n)) return "";
      if (Math.abs(n) >= 1000) return n.toLocaleString("es-EC", { maximumFractionDigits: 2 });
      if (Math.abs(n) >= 10) return n.toLocaleString("es-EC", { maximumFractionDigits: 3 });
      if (Math.abs(n) >= 1) return n.toLocaleString("es-EC", { maximumFractionDigits: 4 });
      return n.toLocaleString("es-EC", { maximumFractionDigits: 6 });
    };

    const especieBase = String(payload.especie || "").trim() || "N/D";
    const pesoTxt = Number(payload.pesoKg) > 0 ? `, ${formatNum(payload.pesoKg)} kg` : "";
    const especie = `${especieBase}${pesoTxt}`;

    const resultadoFinal = Number(payload.resultadoFinal);
    const dosisTotal = Number(payload.dosisTotal);
    const dosisBase = Number(payload.dosis);

    const resultadoTxt = Number.isFinite(resultadoFinal)
      ? `${formatNum(resultadoFinal)} ${String(payload.unidadFinal || "").trim()}`.trim()
      : "";

    const dosisTotalTxt = Number.isFinite(dosisTotal)
      ? `${formatNum(dosisTotal)} ${String(payload.dosisTotalUnidad || "").trim()}`.trim()
      : "";

    const dosisSimpleTxt = Number.isFinite(dosisBase)
      ? `${formatNum(dosisBase)} ${String(payload.unidadDosis || "").trim()}`.trim()
      : "";

    const dosis = [resultadoTxt, dosisTotalTxt ? `dosis total: ${dosisTotalTxt}` : "", !resultadoTxt ? dosisSimpleTxt : ""]
      .filter(Boolean)
      .join(" · ");

    const concValue = Number(payload.concentracion);
    const concText = Number.isFinite(concValue)
      ? `${formatNum(concValue)} ${String(payload.unidadConcentracion || "").trim()}`.trim()
      : String(payload.concentracionTexto || "").trim();

    const advertencias = Array.isArray(payload.advertencias)
      ? payload.advertencias.filter(Boolean).join("; ")
      : String(payload.advertencias || "").trim();

    const componentes = Array.isArray(payload.componentes)
      ? payload.componentes
          .map((comp) => String(comp?.nombre || "").trim())
          .filter(Boolean)
          .join(", ")
      : "";

    const dosisEspecies = Array.isArray(payload.speciesDoses)
      ? payload.speciesDoses
          .map((row) => {
            const especie = String(row?.especie || "").trim();
            const dosis = Number(row?.dosis);
            const unidad = String(row?.unidadDosis || "").trim();
            const nota = String(row?.notas || "").trim();
            if (!especie || !Number.isFinite(dosis) || dosis <= 0 || !unidad) return "";
            return `${especie}: ${formatNum(dosis)} ${unidad}${nota ? ` (${nota})` : ""}`;
          })
          .filter(Boolean)
          .join("; ")
      : "";

    const instrucciones = [
      payload.frecuencia ? `Frecuencia: ${payload.frecuencia}` : "",
      payload.duracion ? `Duracion: ${payload.duracion}` : "",
      payload.indicaciones ? `Indicaciones: ${payload.indicaciones}` : "",
      payload.observaciones ? `Observaciones: ${payload.observaciones}` : "",
      advertencias ? `Advertencias: ${advertencias}` : "",
      componentes ? `Componentes: ${componentes}` : "",
      dosisEspecies ? `Dosis por especies: ${dosisEspecies}` : ""
    ]
      .filter(Boolean)
      .join(" | ");

    const retiro = payload.tiempoRetiro
      ? `Tiempo de retiro: ${payload.tiempoRetiro}`
      : String(payload.retiro || "").trim();

    const item = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      nombre,
      comercial: String(payload.nombreComercial || payload.comercial || "").trim(),
      concentracion: concText || "N/D",
      dosis: dosis || "N/D",
      via: String(payload.viaAdministracion || payload.via || "N/D").trim(),
      especie,
      retiro,
      instrucciones
    };

    this.items.push(item);
    if (!this._guardar()) {
      this.items.pop();
      return false;
    }
    this._renderBadge();
    this._animarBadge();
    this._toast(`${item.nombre} agregado a la receta`);
    return true;
  },

  eliminarItem(id) {
    const prevItems = this._clone(this.items);
    this.items = this.items.filter((i) => i.id !== id);
    if (!this._guardar()) {
      this.items = prevItems;
      return;
    }
    this._renderBadge();
    this._renderLista();
  },

  guardarReceta() {
    if (this.items.length === 0) {
      this._toast("Agrega al menos un medicamento antes de guardar.");
      return;
    }

    const datos = this._getFormData();
    const items = this._clone(this.items);

    if (this.recetaActivaId) {
      const receta = this.recetasGuardadas.find((r) => r.id === this.recetaActivaId);
      if (!receta) return;
      receta.datos = datos;
      receta.items = items;
      receta.actualizadaEn = new Date().toISOString();
      if (!this._guardarRecetas()) return;
      this._renderRecetasGuardadas();
      this._toast(`Receta ${this._formatNumero(receta.numero)} actualizada.`);
      return;
    }

    const numero = this._siguienteNumero();
    const receta = {
      id: String(Date.now()),
      numero,
      creadaEn: new Date().toISOString(),
      actualizadaEn: new Date().toISOString(),
      datos,
      items
    };

    this.recetasGuardadas.push(receta);
    if (!this._guardarRecetas()) {
      this.recetasGuardadas = this.recetasGuardadas.filter((r) => r.id !== receta.id);
      return;
    }
    this._toast(`Receta ${this._formatNumero(numero)} guardada.`);
    this.nuevaReceta({ silent: true });
  },

  nuevaReceta(opts = {}) {
    this.recetaActivaId = null;
    this.items = [];
    this.folioActual = this._siguienteNumero();
    this._setFormData({}, { keepDoctor: true });
    this._guardar();
    this._removeStorage(this.STORAGE_DRAFT_FIELDS);
    this._renderTodo();
    if (!opts.silent) this._toast("Nuevo recetario listo.");
  },

  abrirRecetaGuardada(id) {
    const receta = this.recetasGuardadas.find((r) => r.id === id);
    if (!receta) return;

    this.recetaActivaId = receta.id;
    this.folioActual = receta.numero;
    this.items = this._clone(receta.items || []);
    this._setFormData(receta.datos || {}, { keepDoctor: false });
    this._guardar();
    this._renderTodo();
  },

  abrir() {
    this._renderTodo();
    this.modal?.classList.add("sv-modal-active");
  },

  cerrar() {
    this._guardarDraftFields();
    this.modal?.classList.remove("sv-modal-active");
  },

  _actualizarNota(id, valor) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;
    const prev = item.instrucciones;
    item.instrucciones = valor;
    if (!this._guardar()) {
      item.instrucciones = prev;
    }
  },

  _getFormData() {
    const doctor = this.inputDoctor?.value.trim() || "";
    this._setStorageText(this.STORAGE_DOCTOR, doctor);

    return {
      doctor,
      fecha: this.inputFecha?.value || this._today(),
      propietario: this.inputPropietario?.value.trim() || "",
      paciente: this.inputPaciente?.value.trim() || "",
      peso: this.inputPeso?.value.trim() || "",
      indicaciones: this.inputIndicaciones?.value.trim() || ""
    };
  },

  _setFormData(data = {}, opts = {}) {
    if (!opts.keepDoctor && this.inputDoctor) {
      this.inputDoctor.value = data.doctor || localStorage.getItem(this.STORAGE_DOCTOR) || "";
      this._setStorageText(this.STORAGE_DOCTOR, this.inputDoctor.value.trim());
    }

    if (this.inputFecha) this.inputFecha.value = data.fecha || this._today();
    if (this.inputPropietario) this.inputPropietario.value = data.propietario || "";
    if (this.inputPaciente) this.inputPaciente.value = data.paciente || "";
    if (this.inputPeso) this.inputPeso.value = data.peso || "";
    if (this.inputIndicaciones) this.inputIndicaciones.value = data.indicaciones || "";
  },

  _renderTodo() {
    this._renderBadge();
    this._renderFolio();
    this._renderTitulo();
    this._renderLista();
    this._renderRecetasGuardadas();
  },

  _renderTitulo() {
    const numero = this._formatNumero(this.folioActual);
    if (this.titulo) {
      this.titulo.textContent = this.recetaActivaId
        ? `📋 Receta ${numero}`
        : `📋 Borrador de Receta ${numero}`;
    }
    if (this.btnGuardar) {
      this.btnGuardar.textContent = this.recetaActivaId ? "Guardar cambios" : "Guardar receta";
    }
  },

  _renderFolio() {
    const numero = this._formatNumero(this.folioActual);
    if (this.folio) this.folio.textContent = `Folio: ${numero}`;
    if (this.numeroLateral) this.numeroLateral.textContent = numero;
  },

  _renderBadge() {
    const count = this.items.length;
    if (this.badge) {
      this.badge.textContent = count;
      this.badge.dataset.count = count;
    }
  },

  _renderRecetasGuardadas() {
    if (this.totalGuardadas) this.totalGuardadas.textContent = this.recetasGuardadas.length;
    if (!this.listaGuardadas) return;

    this.listaGuardadas.innerHTML = "";

    if (this.recetasGuardadas.length === 0) {
      const empty = document.createElement("span");
      empty.className = "sv-recetas-vacio";
      empty.textContent = "Todavía no hay recetas guardadas.";
      this.listaGuardadas.appendChild(empty);
      return;
    }

    [...this.recetasGuardadas]
      .sort((a, b) => a.numero - b.numero)
      .forEach((receta) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sv-receta-chip";
        if (receta.id === this.recetaActivaId) btn.classList.add("is-active");

        const nombre = receta.datos?.paciente || receta.datos?.propietario || "Sin paciente";
        btn.textContent = `${this._formatNumero(receta.numero)} · ${nombre}`;
        btn.addEventListener("click", () => this.abrirRecetaGuardada(receta.id));
        this.listaGuardadas.appendChild(btn);
      });
  },

  _renderLista() {
    if (!this.lista) return;

    if (this.items.length === 0) {
      this.lista.innerHTML = `
        <li class="sv-receta-vacia">
          <span>📋</span>
          <p>No hay medicamentos agregados.<br>Ve al módulo de Farmacología y calcula una dosis.</p>
        </li>`;
      return;
    }

    this.lista.innerHTML = "";
    this.items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "sv-receta-item sv-fade-in";
      li.innerHTML = `
        <div class="sv-receta-item-header">
          <strong>${this._escape(item.nombre)}</strong>
          ${item.comercial ? `<span class="sv-receta-comercial">(${this._escape(item.comercial)})</span>` : ""}
          <button class="sv-btn sv-btn-sm sv-btn-danger sv-receta-del no-print"
                  type="button"
                  title="Eliminar">✕</button>
        </div>
        <div class="sv-receta-item-body">
          <span>${this._escape(item.concentracion)}</span> ·
          Administrar <strong>${this._escape(item.dosis)}</strong> vía <strong>${this._escape(item.via)}</strong>
          <span class="sv-receta-especie">(${this._escape(item.especie)})</span>
        </div>
        ${item.retiro ? `<div class="sv-receta-retiro">${this._escape(item.retiro)}</div>` : ""}
        <input
          type="text"
          class="sv-receta-nota sv-input"
          placeholder="Frecuencia y duración (Ej. Cada 24 h por 3 días)…"
          value="${this._escape(item.instrucciones || "")}"
        />
      `;

      li.querySelector(".sv-receta-del")?.addEventListener("click", () => this.eliminarItem(item.id));
      li.querySelector(".sv-receta-nota")?.addEventListener("input", (e) => {
        this._actualizarNota(item.id, e.target.value);
      });

      this.lista.appendChild(li);
    });
  },

  _actualizarVisibilidad(viewName) {
    const visible = viewName === "farmacologia";
    this.btnVer?.classList.toggle("sv-fab-hidden", !visible);
    if (!visible) this.cerrar();
  },

  _animarBadge() {
    this.btnVer?.classList.add("sv-pulse");
    setTimeout(() => this.btnVer?.classList.remove("sv-pulse"), 350);
  },

  _imprimir() {
    this._guardarDraftFields();
    this._prepararImpresion();
    window.print();
  },

  _prepararImpresion() {
    const area = document.getElementById("sv-area-impresion-receta");
    const main = area?.querySelector(".sv-receta-main");
    const list = area?.querySelector("#sv-lista-receta");
    const footer = area?.querySelector(".sv-receta-footer");
    if (!area || !main || !list || !footer) return;

    const estimatedItemsHeight = Array.from(list.querySelectorAll(".sv-receta-item")).reduce((total, item) => {
      const note = item.querySelector(".sv-receta-nota")?.value || "";
      const text = item.textContent || "";
      const base = 68;
      const extra = Math.ceil((text.length + note.length) / 135) * 12;
      return total + base + extra;
    }, 0);

    const pageHeight = 794; // A4 horizontal a 96 dpi, coincide con @page landscape.
    const fixedBlocks = 310; // encabezado, Rp/, separaciones, margen y pie.
    const printableHeight = Math.max(420, pageHeight - fixedBlocks);
    const pages = Math.max(1, Math.ceil(estimatedItemsHeight / printableHeight));

    area.style.setProperty("--sv-print-pages", String(pages));
  },

  _limpiarImpresion() {
    document
      .getElementById("sv-area-impresion-receta")
      ?.style
      ?.removeProperty("--sv-print-pages");
  },

  _siguienteNumero() {
    const usados = this.recetasGuardadas.map((r) => Number(r.numero) || 0);
    return Math.max(0, ...usados) + 1;
  },

  _formatNumero(numero) {
    return `#${String(numero || 1).padStart(4, "0")}`;
  },

  _today() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  },

  _clone(value) {
    return JSON.parse(JSON.stringify(value));
  },

  _escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  _toast(mensaje) {
    const existing = document.getElementById("sv-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "sv-toast";
    toast.className = "sv-toast sv-fade-in";
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.Recetario = Recetario;
  Recetario.init();
});

