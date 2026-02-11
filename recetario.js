// recetario.js
// -----------------------------------------------------------------------------
// Gestión del Carrito de Recetas y Generación de PDF
// -----------------------------------------------------------------------------

const Recetario = {
  items: [], // Aquí guardamos los fármacos

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.renderBadge();
    // Intentar recuperar del localStorage por si cerró la pestaña
    const guardado = localStorage.getItem("suitevet_receta");
    if (guardado) {
      this.items = JSON.parse(guardado);
      this.renderBadge();
    }
  },

  cacheDOM() {
    this.btnVer = document.getElementById("btn-ver-receta");
    this.badge = document.getElementById("badge-receta");
    this.modal = document.getElementById("modal-receta");
    this.btnCerrar = document.getElementById("btn-cerrar-receta");
    this.btnLimpiar = document.getElementById("btn-limpiar-receta");
    this.btnImprimir = document.getElementById("btn-imprimir-receta");
    this.lista = document.getElementById("lista-items-receta");
    this.inputFecha = document.getElementById("receta-fecha");
    
    // Poner fecha de hoy por defecto
    if(this.inputFecha) {
        this.inputFecha.value = new Date().toISOString().split('T')[0];
    }
  },

  bindEvents() {
    if(this.btnVer) this.btnVer.addEventListener("click", () => this.abrirModal());
    if(this.btnCerrar) this.btnCerrar.addEventListener("click", () => this.cerrarModal());
    
    if(this.btnLimpiar) {
        this.btnLimpiar.addEventListener("click", () => {
            if(confirm("¿Borrar toda la receta actual?")) {
                this.items = [];
                this.guardar();
                this.renderBadge();
                this.renderLista();
            }
        });
    }

    if(this.btnImprimir) {
        this.btnImprimir.addEventListener("click", () => {
            window.print();
        });
    }
  },

  // Función principal llamada desde farma.js
  agregarItem(farmaco, dosisCalculada, via, especie, retiroInfo) {
    const item = {
      id: Date.now(), // ID único temporal
      nombre: farmaco.principio,
      comercial: farmaco.comerciales[0] || "",
      concentracion: `${farmaco.concentracion} ${farmaco.unidad}`,
      dosis: dosisCalculada, // Ej: "15.5 mL"
      via: via,
      especie: especie,
      retiro: retiroInfo, // Texto del retiro
      instrucciones: "" // Para que el usuario edite después
    };

    this.items.push(item);
    this.guardar();
    this.renderBadge();
    
    // Efecto visual "WOW"
    this.animarBadge();
    alert(`Agregado a receta: ${item.nombre} (${item.dosis})`);
  },

  eliminarItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.guardar();
    this.renderBadge();
    this.renderLista();
  },

  guardar() {
    localStorage.setItem("suitevet_receta", JSON.stringify(this.items));
  },

  renderBadge() {
    if(this.badge) this.badge.textContent = this.items.length;
    if(this.items.length > 0) {
        this.btnVer.classList.add("con-items");
    } else {
        this.btnVer.classList.remove("con-items");
    }
  },

  animarBadge() {
    this.btnVer.classList.add("bump");
    setTimeout(() => this.btnVer.classList.remove("bump"), 300);
  },

  abrirModal() {
    this.renderLista();
    this.modal.classList.add("active");
  },

  cerrarModal() {
    this.modal.classList.remove("active");
  },

  renderLista() {
    if(!this.lista) return;
    this.lista.innerHTML = "";

    if(this.items.length === 0) {
        this.lista.innerHTML = `<li class="item-vacio">No hay medicamentos agregados aún. Ve al módulo de Farmacología.</li>`;
        return;
    }

    this.items.forEach(item => {
      const li = document.createElement("li");
      li.className = "receta-item";
      li.innerHTML = `
        <div class="item-main">
            <strong>${item.nombre} (${item.comercial})</strong>
            <span>${item.concentracion}</span>
        </div>
        <div class="item-detalles">
            Administrar <strong>${item.dosis}</strong> vía <strong>${item.via}</strong>.
        </div>
        <div class="item-retiro-warning">
            ${item.retiro}
        </div>
        <input type="text" class="item-nota-input" placeholder="Escribe frecuencia y duración (Ej. Cada 24h por 3 días)...">
        <button class="btn-borrar-item no-print" onclick="Recetario.eliminarItem(${item.id})">❌</button>
      `;
      this.lista.appendChild(li);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
    Recetario.init();
    // Exponer globalmente para que farma.js lo use
    window.Recetario = Recetario;
});