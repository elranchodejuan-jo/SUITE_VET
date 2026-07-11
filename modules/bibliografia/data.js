// =============================================================================
// SUITE VET - modules/bibliografia/data.js
// Fallback local y facade temporal de compatibilidad para Bibliografia.
// =============================================================================

(function (root) {
  "use strict";

  const resources = [
    {
      id: "fisiologia-animal-1",
      slug: "fisiologia-animal-1",
      module_id: "fisio",
      title: "Fisiología animal I: regulación del medio interno y sistemas de soporte vital",
      short_title: "Fisiología Animal I",
      authors: ["R. A. Vitonera Rogel", "R. J. Herrera-Feijoo", "J. B. Mina Ortiz"],
      year: 2025,
      edition: "1ª Edición",
      publisher: "Editorial Grupo Compás",
      language: null,
      resource_type: "book",
      description: null,
      topics: [],
      species: [],
      citation_apa: "Vitonera Rogel, R. A., Herrera-Feijoo, R. J., & Mina Ortiz, J. B. (2025). Fisiología animal I: regulación del medio interno y sistemas de soporte vital. Editorial Grupo Compás. https://doi.org/10.48190/9789942530691",
      citation_vancouver: "1. Vitonera Rogel RA, Herrera-Feijoo RJ, Mina Ortiz JB. Fisiología animal I: regulación del medio interno y sistemas de soporte vital. 1ª ed. Guayaquil: Editorial Grupo Compás; 2025. doi: 10.48190/9789942530691",
      asset_key: "fisiologia-animal-i-pdf",
      file_available: true,
      review_status: "draft",
      rights_status: "unverified",
      source_status: "unverified"
    }
  ];

  const document = Object.freeze({
    schema_version: "1.0.0",
    catalog_version: "2.3.0",
    items: Object.freeze(resources.map((resource) => Object.freeze({ ...resource })))
  });

  function toLegacy(resource) {
    return Object.freeze({
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
      descargaUrl: resource.asset_key === "fisiologia-animal-i-pdf"
        ? "assets/libros/Fisiología Animal I - Publicado.pdf"
        : null,
      portadaGradient: "linear-gradient(135deg, #f43f5e, #be123c)"
    });
  }

  Object.defineProperty(root, "SuiteVetBibliographyFallback", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: document
  });
  root.BIBLIOGRAFIA_DATA = Object.freeze(document.items.map(toLegacy));
})(window);
