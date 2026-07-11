// =============================================================================
// SUITE VET - shared/module-catalog.js
// Catalogo progresivo: fallback local inmediato y actualizacion opcional por API.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetCatalog) return;

  const ALLOWED_KEYS = Object.freeze([
    "id", "slug", "name", "short_name", "description", "home_description",
    "badge", "route", "type", "status", "order", "searchable",
    "visible_on_home", "visible_in_sidebar", "theme", "icon_id"
  ]);
  const ROUTES = new Set([
    "home", "fisiologia", "farmacologia", "microbiologia", "patologia",
    "nutricion", "clinica", "semiologia", "casos360", "oncologia",
    "bibliografia", "favoritos", "about"
  ]);
  const TYPES = new Set(["primary", "auxiliary", "planned"]);
  const STATUSES = new Set(["active", "disabled", "future"]);
  const THEMES = new Set([
    "accent", "fisio", "farma", "micro", "pato", "nutri", "clinica",
    "semiologia", "casos360", "onco", "biblio", "favoritos", "muted"
  ]);
  const ICONS = new Set([
    "home", "physiology", "pharmacology", "microbiology", "pathology",
    "nutrition", "clinic", "semiology", "cases360", "oncology",
    "bibliography", "favorites", "about", "recipe", "cartilla", "cattle"
  ]);
  const IDENTIFIER = /^[a-z][a-z0-9-]{1,63}$/;
  const VERSION = /^\d+\.\d+\.\d+$/;
  const FORBIDDEN_TEXT = /[<>]|javascript:|onerror|onload/i;

  const FALLBACK_DOCUMENT = {
    schema_version: "1.0.0",
    catalog_version: "2.2.0",
    items: [
      { id: "home", slug: "inicio", name: "Inicio", short_name: "Inicio", description: "Vista principal de la plataforma", home_description: null, badge: null, route: "home", type: "auxiliary", status: "active", order: 0, searchable: false, visible_on_home: false, visible_in_sidebar: true, theme: "accent", icon_id: "home" },
      { id: "fisio", slug: "fisiologia", name: "Fisiología", short_name: "Fisiología", description: "Hormonas, vitaminas y glosario", home_description: "Hormonas, vitaminas y glosario clínico por sistema.", badge: null, route: "fisiologia", type: "primary", status: "active", order: 10, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "fisio", icon_id: "physiology" },
      { id: "farma", slug: "farmacologia", name: "Farmacología", short_name: "Farmacología", description: "Vademécum, dosis y recetario", home_description: "Vademécum, dosis por especie y tiempos de retiro.", badge: null, route: "farmacologia", type: "primary", status: "active", order: 20, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "farma", icon_id: "pharmacology" },
      { id: "micro", slug: "microbiologia", name: "Microbiología", short_name: "Microbiología", description: "Agares, caldos, pruebas y atlas", home_description: "Agares, pruebas bioquímicas, antibiogramas y atlas bacteriano.", badge: null, route: "microbiologia", type: "primary", status: "active", order: 30, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "micro", icon_id: "microbiology" },
      { id: "pato", slug: "patologia", name: "Patología", short_name: "Patología", description: "Lesiones y diagnóstico diferencial", home_description: "Lesiones, hallazgos y diagnóstico diferencial.", badge: "Nuevo módulo", route: "patologia", type: "primary", status: "active", order: 40, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "pato", icon_id: "pathology" },
      { id: "nutricion", slug: "nutricion-animal", name: "Nutrición Animal", short_name: "Nutrición", description: "Nutrientes, raciones y clínica nutricional", home_description: "Nutrientes, Weende, agua, raciones, ingredientes y clínica nutricional.", badge: "Lab", route: "nutricion", type: "primary", status: "active", order: 50, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "nutri", icon_id: "nutrition" },
      { id: "clinica", slug: "clinica-integrada", name: "Clínica Integrada", short_name: "Clínica", description: "Casos clínicos guiados para razonamiento veterinario", home_description: "Casos clínicos guiados para aprender a razonar como médico veterinario.", badge: "Nuevo", route: "clinica", type: "primary", status: "active", order: 60, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "clinica", icon_id: "clinic" },
      { id: "semiologia", slug: "semiologia-anamnesis", name: "Semiología & Anamnesis Pro", short_name: "Semiología", description: "Entrenador de anamnesis, examen físico y OSCE", home_description: "Entrenador clínico para anamnesis, examen físico, OSCE, logbook y reporte profesional.", badge: "Pro", route: "semiologia", type: "primary", status: "active", order: 70, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "semiologia", icon_id: "semiology" },
      { id: "casos360", slug: "casos-360", name: "Casos 360", short_name: "Casos 360", description: "Casos clínicos con evaluación por competencias", home_description: "Casos clínicos multimodales con evaluación objetiva por competencias.", badge: "Nuevo", route: "casos360", type: "primary", status: "active", order: 80, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "casos360", icon_id: "cases360" },
      { id: "oncologia", slug: "vetonco", name: "Oncología", short_name: "VetOnco", description: "VetOnco, protocolos base y superficie corporal", home_description: "VetOnco: protocolos base y calculadora de superficie corporal.", badge: "VetOnco", route: "oncologia", type: "primary", status: "active", order: 90, searchable: true, visible_on_home: true, visible_in_sidebar: true, theme: "onco", icon_id: "oncology" },
      { id: "bibliografia", slug: "bibliografia", name: "Bibliografía", short_name: "Bibliografía", description: "Referencias y biblioteca de libros", home_description: null, badge: null, route: "bibliografia", type: "auxiliary", status: "active", order: 100, searchable: false, visible_on_home: false, visible_in_sidebar: true, theme: "biblio", icon_id: "bibliography" },
      { id: "favoritos", slug: "favoritos", name: "Favoritos", short_name: "Favoritos", description: "Recursos guardados", home_description: null, badge: null, route: "favoritos", type: "auxiliary", status: "active", order: 110, searchable: false, visible_on_home: false, visible_in_sidebar: true, theme: "favoritos", icon_id: "favorites" },
      { id: "recetario", slug: "recetario", name: "Recetario", short_name: "Receta", description: "Borrador, guardado e impresión de recetas", home_description: null, badge: null, route: null, type: "auxiliary", status: "active", order: 115, searchable: false, visible_on_home: false, visible_in_sidebar: false, theme: "accent", icon_id: "recipe" },
      { id: "cartilla-digital", slug: "cartilla-digital", name: "Cartilla Digital", short_name: "Cartilla", description: "Próximamente", home_description: null, badge: null, route: null, type: "planned", status: "future", order: 120, searchable: false, visible_on_home: false, visible_in_sidebar: true, theme: "muted", icon_id: "cartilla" },
      { id: "cattle", slug: "cattle", name: "CATTLE", short_name: "CATTLE", description: "Próximamente", home_description: "Manejo bovino, retiros y protocolos.", badge: "Próximamente", route: null, type: "planned", status: "future", order: 130, searchable: false, visible_on_home: true, visible_in_sidebar: true, theme: "muted", icon_id: "cattle" },
      { id: "about", slug: "sobre-suite-vet", name: "Sobre SUITE VET", short_name: "Acerca de", description: "Proyecto, creador y créditos", home_description: null, badge: null, route: "about", type: "auxiliary", status: "active", order: 140, searchable: false, visible_on_home: false, visible_in_sidebar: true, theme: "muted", icon_id: "about" }
    ]
  };

  function isSafeText(value, min, max, nullable = false) {
    if (nullable && value === null) return true;
    return typeof value === "string" && value.length >= min && value.length <= max &&
      value.trim() === value && !FORBIDDEN_TEXT.test(value);
  }

  function validItem(item) {
    if (!item || Object.getPrototypeOf(item) !== Object.prototype) return false;
    const keys = Object.keys(item);
    if (keys.length !== ALLOWED_KEYS.length || keys.some((key) => !ALLOWED_KEYS.includes(key))) return false;
    if (!IDENTIFIER.test(item.id) || !IDENTIFIER.test(item.slug)) return false;
    if (!isSafeText(item.name, 1, 80) || !isSafeText(item.short_name, 1, 40)) return false;
    if (!isSafeText(item.description, 1, 180)) return false;
    if (!isSafeText(item.home_description, 1, 220, true) || !isSafeText(item.badge, 1, 32, true)) return false;
    if (item.route !== null && !ROUTES.has(item.route)) return false;
    if (!TYPES.has(item.type) || !STATUSES.has(item.status) || !THEMES.has(item.theme) || !ICONS.has(item.icon_id)) return false;
    if (!Number.isInteger(item.order) || item.order < 0 || item.order > 10000) return false;
    if (![item.searchable, item.visible_on_home, item.visible_in_sidebar].every((value) => typeof value === "boolean")) return false;
    if (item.visible_on_home && item.home_description === null) return false;
    if (item.status === "active" && (item.visible_on_home || item.visible_in_sidebar) && item.route === null) return false;
    if (item.type === "planned" && item.status === "active") return false;
    return true;
  }

  function cloneAndValidate(payload) {
    if (!payload || Object.getPrototypeOf(payload) !== Object.prototype) throw new TypeError("Catalogo invalido");
    if (!VERSION.test(payload.schema_version) || !VERSION.test(payload.catalog_version)) throw new TypeError("Version de catalogo invalida");
    if (!Array.isArray(payload.items) || payload.total !== payload.items.length) throw new TypeError("Lista de catalogo invalida");
    if (payload.source !== "static") throw new TypeError("Fuente de catalogo invalida");
    if (!payload.items.every(validItem)) throw new TypeError("Entrada de catalogo invalida");

    const ids = new Set();
    const slugs = new Set();
    const routes = new Set();
    const items = payload.items.map((item) => {
      if (ids.has(item.id) || slugs.has(item.slug) || (item.route !== null && routes.has(item.route))) {
        throw new TypeError("Claves de catalogo duplicadas");
      }
      ids.add(item.id);
      slugs.add(item.slug);
      if (item.route !== null) routes.add(item.route);
      return Object.freeze({ ...item });
    }).sort((left, right) => left.order - right.order || left.slug.localeCompare(right.slug));

    return Object.freeze({
      schema_version: payload.schema_version,
      catalog_version: payload.catalog_version,
      source: "api",
      items: Object.freeze(items)
    });
  }

  const fallback = cloneAndValidate({ ...FALLBACK_DOCUMENT, source: "static", total: FALLBACK_DOCUMENT.items.length });
  let snapshot = Object.freeze({ ...fallback, source: "fallback" });
  let loadPromise = null;

  function getSnapshot() {
    return snapshot;
  }

  function getItems() {
    return snapshot.items;
  }

  function find(identifier) {
    const key = String(identifier || "").trim().toLowerCase();
    return snapshot.items.find((item) =>
      item.id.toLowerCase() === key || item.slug.toLowerCase() === key ||
      (item.route && item.route.toLowerCase() === key)
    ) || null;
  }

  async function load(options = {}) {
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      try {
        if (!root.SuiteVetAPI || typeof root.SuiteVetAPI.getCatalogModules !== "function") return snapshot;
        snapshot = cloneAndValidate(await root.SuiteVetAPI.getCatalogModules(options));
        if (root.document && typeof root.document.dispatchEvent === "function" && typeof root.CustomEvent === "function") {
          root.document.dispatchEvent(new root.CustomEvent("suitevet:catalogready", { detail: snapshot }));
        }
      } catch (error) {
        if (root.console && typeof root.console.info === "function") {
          root.console.info("[SuiteVet] Catalogo API no disponible; se conserva el fallback local.", error?.code || error?.message || error);
        }
      }
      return snapshot;
    })();
    return loadPromise;
  }

  Object.defineProperty(root, "SuiteVetCatalog", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: Object.freeze({ find, getItems, getSnapshot, load })
  });

  if (root.document && typeof root.document.addEventListener === "function") {
    root.document.addEventListener("DOMContentLoaded", () => load(), { once: true });
  }
})(window);
