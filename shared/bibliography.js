// =============================================================================
// SUITE VET - shared/bibliography.js
// Dominio bibliografico progresivo: fallback local y API validada en segundo plano.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetBibliography) return;

  const ALLOWED_KEYS = Object.freeze([
    "id", "slug", "module_id", "title", "short_title", "authors", "year",
    "edition", "publisher", "language", "resource_type", "description", "topics",
    "species", "citation_apa", "citation_vancouver", "asset_key", "file_available",
    "review_status", "rights_status", "source_status"
  ]);
  const IDENTIFIER = /^[a-z][a-z0-9-]{1,63}$/;
  const VERSION = /^\d+\.\d+\.\d+$/;
  const FORBIDDEN_TEXT = /[<>]|javascript:|onerror|onload|\.\.\/|\\/i;
  const MODULE_IDS = new Set(["fisio"]);
  const RESOURCE_TYPES = new Set(["book"]);
  const REVIEW_STATUSES = new Set(["draft", "reviewed", "verified"]);
  const RIGHTS_STATUSES = new Set(["unverified", "owned", "licensed", "public_domain"]);
  const SOURCE_STATUSES = new Set(["unverified", "local_legacy"]);
  const ASSET_PATHS = Object.freeze({
    "fisiologia-animal-i-pdf": "assets/libros/Fisiología Animal I - Publicado.pdf"
  });
  const CRITICAL_FIELDS = Object.freeze([
    "title", "authors", "citation_apa", "citation_vancouver", "asset_key", "file_available"
  ]);

  function isSafeText(value, min, max, nullable = false) {
    if (nullable && value === null) return true;
    return typeof value === "string" && value.length >= min && value.length <= max &&
      value.trim() === value && !FORBIDDEN_TEXT.test(value);
  }

  function validTextList(value, maxItems) {
    return Array.isArray(value) && value.length <= maxItems &&
      value.every((item) => isSafeText(item, 1, 120)) &&
      new Set(value).size === value.length;
  }

  function validResource(resource) {
    if (!resource || Object.getPrototypeOf(resource) !== Object.prototype) return false;
    const keys = Object.keys(resource);
    if (keys.length !== ALLOWED_KEYS.length || keys.some((key) => !ALLOWED_KEYS.includes(key))) return false;
    if (!IDENTIFIER.test(resource.id) || !IDENTIFIER.test(resource.slug) || !MODULE_IDS.has(resource.module_id)) return false;
    if (!isSafeText(resource.title, 1, 600) || !isSafeText(resource.short_title, 1, 120, true)) return false;
    if (!validTextList(resource.authors, 10) || resource.authors.length === 0) return false;
    if (resource.year !== null && (!Number.isInteger(resource.year) || resource.year < 1400 || resource.year > 2100)) return false;
    if (![resource.edition, resource.publisher, resource.language].every((value) => isSafeText(value, 1, 120, true))) return false;
    if (!RESOURCE_TYPES.has(resource.resource_type) || !isSafeText(resource.description, 1, 600, true)) return false;
    if (!validTextList(resource.topics, 12) || !validTextList(resource.species, 12)) return false;
    if (!isSafeText(resource.citation_apa, 1, 600, true) || !isSafeText(resource.citation_vancouver, 1, 600, true)) return false;
    if (resource.asset_key !== null && !Object.prototype.hasOwnProperty.call(ASSET_PATHS, resource.asset_key)) return false;
    if (typeof resource.file_available !== "boolean" || resource.file_available !== (resource.asset_key !== null)) return false;
    if (!REVIEW_STATUSES.has(resource.review_status) || !RIGHTS_STATUSES.has(resource.rights_status) || !SOURCE_STATUSES.has(resource.source_status)) return false;
    return true;
  }

  function cloneAndValidate(payload) {
    if (!payload || Object.getPrototypeOf(payload) !== Object.prototype) throw new TypeError("Bibliografia invalida");
    if (!VERSION.test(payload.schema_version) || !VERSION.test(payload.catalog_version)) throw new TypeError("Version bibliografica invalida");
    if (payload.source !== "static" || !Array.isArray(payload.items) || payload.total !== payload.items.length) throw new TypeError("Lista bibliografica invalida");
    if (!payload.items.every(validResource)) throw new TypeError("Recurso bibliografico invalido");

    const ids = new Set();
    const slugs = new Set();
    const items = payload.items.map((resource) => {
      if (ids.has(resource.id) || slugs.has(resource.slug)) throw new TypeError("Claves bibliograficas duplicadas");
      ids.add(resource.id);
      slugs.add(resource.slug);
      return Object.freeze({ ...resource, authors: Object.freeze([...resource.authors]), topics: Object.freeze([...resource.topics]), species: Object.freeze([...resource.species]) });
    }).sort((left, right) => left.title.localeCompare(right.title) || left.slug.localeCompare(right.slug));

    return Object.freeze({
      schema_version: payload.schema_version,
      catalog_version: payload.catalog_version,
      source: "api",
      remote_status: "accepted",
      items: Object.freeze(items)
    });
  }

  function differsInCriticalFields(remoteItems, fallbackItems) {
    if (remoteItems.length !== fallbackItems.length) return true;
    const fallbackById = new Map(fallbackItems.map((item) => [item.id, item]));
    return remoteItems.some((item) => {
      const fallbackItem = fallbackById.get(item.id);
      return !fallbackItem || CRITICAL_FIELDS.some((field) =>
        JSON.stringify(item[field]) !== JSON.stringify(fallbackItem[field])
      );
    });
  }

  function toLegacy(resources) {
    return Object.freeze(resources.map((resource) => Object.freeze({
      id: resource.id,
      modulo: resource.module_id,
      titulo: resource.title,
      tituloCorto: resource.short_title,
      autores: resource.authors.join(", "),
      edicion: resource.edition,
      ano: resource.year,
      editorial: resource.publisher,
      apa: resource.citation_apa,
      vancouver: resource.citation_vancouver,
      descargaUrl: getAssetPath(resource.asset_key),
      portadaGradient: resource.module_id === "fisio" ? "linear-gradient(135deg, #f43f5e, #be123c)" : null
    })));
  }

  function getAssetPath(assetKey) {
    return assetKey && Object.prototype.hasOwnProperty.call(ASSET_PATHS, assetKey)
      ? ASSET_PATHS[assetKey]
      : null;
  }

  const localDocument = root.SuiteVetBibliographyFallback;
  const fallback = cloneAndValidate({
    ...localDocument,
    source: "static",
    total: localDocument?.items?.length
  });
  let snapshot = Object.freeze({ ...fallback, source: "fallback", remote_status: "not_requested" });
  let loadPromise = null;

  function getSnapshot() {
    return snapshot;
  }

  function getResources() {
    return snapshot.items;
  }

  function getResource(identifier) {
    const key = String(identifier || "").trim().toLowerCase();
    return snapshot.items.find((item) => item.id === key || item.slug === key) || null;
  }

  async function load(options = {}) {
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      try {
        if (!root.SuiteVetAPI || typeof root.SuiteVetAPI.getBibliographyResources !== "function") return snapshot;
        const remote = cloneAndValidate(await root.SuiteVetAPI.getBibliographyResources(options));
        if (differsInCriticalFields(remote.items, fallback.items)) {
          snapshot = Object.freeze({ ...fallback, source: "fallback", remote_status: "critical_mismatch" });
          return snapshot;
        }
        snapshot = remote;
        root.BIBLIOGRAFIA_DATA = toLegacy(snapshot.items);
        if (root.document && typeof root.document.dispatchEvent === "function" && typeof root.CustomEvent === "function") {
          root.document.dispatchEvent(new root.CustomEvent("suitevet:bibliographyready", { detail: snapshot }));
        }
      } catch (error) {
        snapshot = Object.freeze({ ...fallback, source: "fallback", remote_status: error?.code || "unavailable" });
        if (root.console && typeof root.console.info === "function") {
          root.console.info("[SuiteVet] Bibliografia API no disponible; se conserva el fallback local.", snapshot.remote_status);
        }
      }
      return snapshot;
    })();
    return loadPromise;
  }

  Object.defineProperty(root, "SuiteVetBibliography", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: Object.freeze({ getAssetPath, getResource, getResources, getSnapshot, load })
  });

  if (root.document && typeof root.document.addEventListener === "function") {
    root.document.addEventListener("DOMContentLoaded", () => load(), { once: true });
  }
})(window);
