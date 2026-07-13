// =============================================================================
// SUITE VET - Presentación pública integrada a la SPA.
// El catálogo existente conserva la autoridad sobre nombres, rutas y estados.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetLanding) return;

  const FEATURED_MODULE_IDS = Object.freeze([
    "fisio", "micro", "farma", "clinica", "semiologia", "nutricion",
    "bibliografia", "oncologia", "casos360"
  ]);
  const MODULE_SYMBOLS = Object.freeze({
    physiology: "FI",
    microbiology: "MB",
    pharmacology: "Rx",
    clinic: "CI",
    semiology: "SA",
    nutrition: "NA",
    bibliography: "BI",
    oncology: "ON",
    cases360: "360"
  });
  const BENEFITS = Object.freeze([
    ["Acceso organizado", "Módulos agrupados para acompañar diferentes momentos de estudio."],
    ["Navegación rápida", "Accede a cada herramienta desde un panel único y una búsqueda global."],
    ["Diseño responsive", "Consulta el contenido desde computadora, tableta o celular."],
    ["Herramientas académicas", "Recursos de estudio y consulta reunidos en una misma experiencia."],
    ["Cálculos controlados", "Flujos de cálculo y consulta conservan sus controles dentro de cada módulo."],
    ["Contenido consultable", "La plataforma mantiene disponibles sus módulos públicos sin iniciar sesión."]
  ]);
  const FUTURE_ITEMS = Object.freeze([
    "Búsqueda asistida",
    "IA con respuestas basadas en contenido verificado",
    "Hacer Diarios",
    "Nutrición — Racionar",
    "Nuevas conexiones académicas"
  ]);

  function element(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function button(label, className, viewName) {
    const node = element("button", className, label);
    node.type = "button";
    node.dataset.goView = viewName;
    return node;
  }

  function authButton(label) {
    const node = element("button", "sv-btn sv-btn-secondary sv-landing-action", label);
    node.type = "button";
    node.dataset.landingAuth = "signup";
    return node;
  }

  function sectionHeading(eyebrow, title, description) {
    const header = element("header", "sv-landing-section-heading");
    header.append(
      element("p", "sv-landing-eyebrow", eyebrow),
      element("h2", "", title),
      element("p", "", description)
    );
    return header;
  }

  function createInfoCard(className, title, text) {
    const card = element("article", className);
    card.append(element("h3", "", title), element("p", "", text));
    return card;
  }

  function featuredModules() {
    const items = root.SuiteVetCatalog?.getItems?.() || [];
    const byId = new Map(items.map((item) => [item.id, item]));
    return FEATURED_MODULE_IDS
      .map((id) => byId.get(id))
      .filter((item) => item && item.status === "active" && item.route);
  }

  function createModuleCard(item) {
    const card = button("", "sv-landing-module-card", item.route);
    card.setAttribute("aria-label", `Abrir ${item.name}`);
    const symbol = element("span", "sv-landing-module-symbol", MODULE_SYMBOLS[item.icon_id] || "SV");
    symbol.setAttribute("aria-hidden", "true");
    const copy = element("span", "sv-landing-module-copy");
    copy.append(
      element("strong", "", item.name),
      element("span", "", item.home_description || item.description)
    );
    card.append(symbol, copy);
    return card;
  }

  function render() {
    const mount = document.getElementById("sv-landing-root");
    if (!mount) return;

    const landing = element("div", "sv-landing");
    const hero = element("section", "sv-landing-hero");
    const heroCopy = element("div", "sv-landing-hero-copy");
    const title = element("h1", "", "SUITE VET");
    title.id = "sv-landing-title";
    const heroActions = element("div", "sv-landing-actions");
    heroActions.append(
      button("Explorar Suite Vet", "sv-btn sv-btn-primary sv-btn-lg sv-landing-action", "home"),
      authButton("Crear cuenta")
    );
    heroCopy.append(
      element("p", "sv-landing-eyebrow", "Plataforma académica veterinaria"),
      title,
      element("p", "sv-landing-lead", "Una experiencia modular para estudiar, consultar y organizar conocimientos de Medicina Veterinaria."),
      element("p", "sv-landing-support", "Explora herramientas académicas públicas y crea una cuenta cuando quieras personalizar tu experiencia."),
      heroActions
    );
    const heroPanel = element("aside", "sv-landing-hero-panel");
    heroPanel.setAttribute("aria-label", "Resumen de Suite Vet");
    heroPanel.append(
      element("span", "sv-landing-panel-mark", "SV"),
      element("strong", "", "Estudio y consulta, en un solo lugar"),
      element("p", "", "Módulos públicos, navegación contextual y una base preparada para perfiles académicos.")
    );
    hero.append(heroCopy, heroPanel);

    const problem = element("section", "sv-landing-section");
    problem.append(sectionHeading(
      "El reto",
      "Estudiar no debería depender de fuentes dispersas",
      "Durante clases y prácticas, localizar contenido, cálculos y referencias en distintos lugares puede romper el ritmo de aprendizaje."
    ));
    const problemGrid = element("div", "sv-landing-problem-grid");
    [
      ["Información dispersa", "Materiales y consultas académicas repartidos entre diferentes fuentes."],
      ["Búsqueda bajo presión", "Dificultad para ubicar contenido útil mientras se sigue una clase o práctica."],
      ["Herramientas separadas", "Cálculos y consultas académicas requieren cambiar continuamente de contexto."],
      ["Acceso desigual", "La necesidad de una herramienta organizada y accesible desde distintos dispositivos."]
    ].forEach(([titleText, bodyText]) => problemGrid.append(createInfoCard("sv-landing-problem-card", titleText, bodyText)));
    problem.append(problemGrid);

    const solution = element("section", "sv-landing-section sv-landing-solution");
    solution.append(sectionHeading(
      "La propuesta",
      "Una plataforma modular para el aprendizaje veterinario",
      "Suite Vet reúne herramientas académicas veterinarias en una sola experiencia responsive, manteniendo cada módulo dentro de su contexto de estudio."
    ));

    const modules = element("section", "sv-landing-section");
    modules.append(sectionHeading(
      "Módulos destacados",
      "Explora el catálogo académico actual",
      "Los nombres, rutas y estados se obtienen del catálogo existente de Suite Vet."
    ));
    const moduleGrid = element("div", "sv-landing-module-grid");
    featuredModules().forEach((item) => moduleGrid.append(createModuleCard(item)));
    modules.append(moduleGrid);

    const benefits = element("section", "sv-landing-section");
    benefits.append(sectionHeading(
      "Beneficios",
      "Pensada para acompañar el estudio",
      "Una interfaz académica que busca reducir fricción sin reemplazar el razonamiento profesional."
    ));
    const benefitGrid = element("div", "sv-landing-benefit-grid");
    BENEFITS.forEach(([titleText, bodyText]) => benefitGrid.append(createInfoCard("sv-landing-benefit-card", titleText, bodyText)));
    benefits.append(benefitGrid);

    const evolution = element("section", "sv-landing-section sv-landing-evolution");
    evolution.append(sectionHeading(
      "Evolución",
      "Disponible hoy y preparado para seguir creciendo",
      "Los módulos actuales están disponibles para explorar. Las siguientes capacidades se muestran como próximas, no como funciones activas."
    ));
    const futureList = element("ul", "sv-landing-future-list");
    FUTURE_ITEMS.forEach((item) => futureList.append(element("li", "", item)));
    evolution.append(element("p", "sv-landing-future-label", "Próximamente"), futureList);

    const security = element("section", "sv-landing-section sv-landing-security");
    security.append(sectionHeading(
      "Cuentas y participación",
      "Tu espacio académico, con controles claros",
      "Suite Vet incorpora perfiles personales, confirmación de correo, protección de datos mediante RLS y comentarios o recomendaciones de usuarios."
    ));

    const finalCta = element("section", "sv-landing-final-cta");
    const finalActions = element("div", "sv-landing-actions");
    finalActions.append(
      button("Comenzar a explorar", "sv-btn sv-btn-primary sv-btn-lg sv-landing-action", "home"),
      authButton("Crear mi cuenta")
    );
    finalCta.append(
      element("h2", "", "Empieza con los módulos públicos de Suite Vet"),
      element("p", "", "Explora la plataforma a tu ritmo y crea tu cuenta cuando estés listo."),
      finalActions
    );

    const disclaimer = element("p", "sv-landing-disclaimer", "Suite Vet es una herramienta educativa y no sustituye el criterio profesional, la evaluación clínica ni las indicaciones de un médico veterinario.");
    landing.append(hero, problem, solution, modules, benefits, evolution, security, finalCta, disclaimer);
    mount.replaceChildren(landing);
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-landing-auth]");
      if (!target) return;
      root.SuiteVetAuthUI?.openModal?.("signup");
    });
    document.addEventListener("suitevet:catalogready", render);
  }

  function initialize() {
    render();
    bindEvents();
  }

  root.SuiteVetLanding = Object.freeze({ initialize, render });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})(window);
