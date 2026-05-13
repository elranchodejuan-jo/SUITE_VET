// =============================================================================
// SUITE VET — shared/recetario.js
// Módulo del recetario médico veterinario.
// BUG FIXES:
//  1. Ahora se inicializa correctamente desde DOMContentLoaded.
//  2. La fecha se establece dinámicamente (no en HTML estático).
//  3. Los items se persisten en localStorage.
//  4. renderLista() refleja cambios en tiempo real.
//  5. Impresión solo muestra la hoja de receta.
// =============================================================================

const Recetario = {
  items: [],

  // ---------------------------------------------------------------------------
  init() {
    this._cacheDOM();
    this._bindEvents();
    this._cargarLocalStorage();
    this._renderBadge();
  },

  // ---------------------------------------------------------------------------
  _cacheDOM() {
    this.btnVer     = document.getElementById("sv-fab-receta");
    this.badge      = document.getElementById("sv-fab-badge");
    this.modal      = document.getElementById("sv-modal-receta");
    this.btnCerrar  = document.getElementById("sv-receta-cerrar");
    this.btnLimpiar = document.getElementById("sv-receta-limpiar");
    this.btnImprimir= document.getElementById("sv-receta-imprimir");
    this.lista      = document.getElementById("sv-lista-receta");
    this.inputFecha = document.getElementById("sv-receta-fecha");

    // Fecha de hoy por defecto
    if (this.inputFecha) {
      this.inputFecha.value = new Date().toISOString().split("T")[0];
    }
  },

  // ---------------------------------------------------------------------------
  _bindEvents() {
    this.btnVer?.addEventListener("click",     () => this.abrir());
    this.btnCerrar?.addEventListener("click",  () => this.cerrar());
    this.btnImprimir?.addEventListener("click",() => this._imprimir());

    this.btnLimpiar?.addEventListener("click", () => {
      if (confirm("¿Borrar toda la receta actual?")) {
        this.items = [];
        this._guardar();
        this._renderBadge();
        this._renderLista();
      }
    });

    // Cerrar modal al clickear fuera del contenido
    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) this.cerrar();
    });
  },

  // ---------------------------------------------------------------------------
  _cargarLocalStorage() {
    try {
      const guardado = localStorage.getItem("suitevet_receta");
      if (guardado) this.items = JSON.parse(guardado);
    } catch {
      this.items = [];
    }
  },

  // ---------------------------------------------------------------------------
  _guardar() {
    localStorage.setItem("suitevet_receta", JSON.stringify(this.items));
  },

  // ---------------------------------------------------------------------------
  // API PÚBLICA: llamado desde farma.js
  agregarItem(farmaco, dosisCalculada, via, especie, retiroInfo) {
    const item = {
      id:           Date.now(),
      nombre:       farmaco.principio,
      comercial:    farmaco.comerciales?.[0] || "",
      concentracion:`${farmaco.concentracion} ${farmaco.unidad}`,
      dosis:        dosisCalculada,
      via,
      especie,
      retiro:       retiroInfo,
      instrucciones:""
    };

    this.items.push(item);
    this._guardar();
    this._renderBadge();
    this._animarBadge();

    // Toast de confirmación (no usar alert)
    this._toast(`✅ ${item.nombre} agregado a la receta`);
  },

  eliminarItem(id) {
    this.items = this.items.filter((i) => i.id !== id);
    this._guardar();
    this._renderBadge();
    this._renderLista();
  },

  // ---------------------------------------------------------------------------
  abrir() {
    this._renderLista();
    this.modal?.classList.add("sv-modal-active");
  },

  cerrar() {
    this.modal?.classList.remove("sv-modal-active");
  },

  // ---------------------------------------------------------------------------
  _renderBadge() {
    const count = this.items.length;
    if (this.badge) {
      this.badge.textContent = count;
      this.badge.dataset.count = count;
    }
  },

  _animarBadge() {
    this.btnVer?.classList.add("sv-pulse");
    setTimeout(() => this.btnVer?.classList.remove("sv-pulse"), 350);
  },

  // ---------------------------------------------------------------------------
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
          <strong>${item.nombre}</strong>
          ${item.comercial ? `<span class="sv-receta-comercial">(${item.comercial})</span>` : ""}
          <button class="sv-btn sv-btn-sm sv-btn-danger sv-receta-del no-print"
                  onclick="window.Recetario.eliminarItem(${item.id})"
                  title="Eliminar">✕</button>
        </div>
        <div class="sv-receta-item-body">
          <span>${item.concentracion}</span> ·
          Administrar <strong>${item.dosis}</strong> vía <strong>${item.via}</strong>
          <span class="sv-receta-especie">(${item.especie})</span>
        </div>
        ${item.retiro ? `<div class="sv-receta-retiro">${item.retiro}</div>` : ""}
        <input
          type="text"
          class="sv-receta-nota sv-input"
          placeholder="Frecuencia y duración (Ej. Cada 24 h por 3 días)…"
          value="${item.instrucciones || ""}"
          oninput="window.Recetario._actualizarNota(${item.id}, this.value)"
        />
      `;
      this.lista.appendChild(li);
    });
  },

  _actualizarNota(id, valor) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.instrucciones = valor;
      this._guardar();
    }
  },

  // ---------------------------------------------------------------------------
  _imprimir() {
    // Guardar datos del formulario antes de imprimir
    const propietario = document.getElementById("sv-receta-propietario")?.value || "";
    const paciente    = document.getElementById("sv-receta-paciente")?.value || "";
    const peso        = document.getElementById("sv-receta-peso")?.value || "";
    const fecha       = document.getElementById("sv-receta-fecha")?.value || "";

    // Crear área de impresión temporal
    const printArea = document.getElementById("sv-print-area");
    if (printArea) {
      printArea.innerHTML = document.getElementById("sv-area-impresion-receta")?.innerHTML || "";
    }

    window.print();
  },

  // ---------------------------------------------------------------------------
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

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  Recetario.init();
  window.Recetario = Recetario;
});
