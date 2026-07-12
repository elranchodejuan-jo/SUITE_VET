const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function loadFisioData() {
  const context = { console, window: {} };
  vm.createContext(context);
  [
    "modules/fisio/data/hormonasvitaminasdata.js",
    "modules/fisio/data/glosariodata.js",
    "modules/fisio/data.js"
  ].forEach((file) => vm.runInContext(read(file), context, { filename: file }));
  return context.window.FISIO_DATA;
}

test("Fisiologia mantiene conjuntos de datos independientes para Hormonas, Vitaminas y Glosario", () => {
  const data = loadFisioData();
  assert.equal(data.hormonas.length, 57);
  assert.equal(data.vitaminas.length, 17);
  assert.equal(data.glosario.length, 312);
});

async function createFisioDom() {
  const { Window } = await import("happy-dom");
  const window = new Window({ url: "http://localhost/" });
  const errors = [];
  const rendered = [];
  window.console.error = (...args) => errors.push(args.join(" "));
  window.SuiteVet = {
    Favorites: {
      attributes: () => "",
      bindWithin: (container) => rendered.push(container.id)
    },
    registerSearch: () => {},
    showView: () => {}
  };
  window.document.body.innerHTML = '<main><div id="fisio-root"></div></main>';
  [
    "modules/fisio/data/hormonasvitaminasdata.js",
    "modules/fisio/data/glosariodata.js",
    "modules/fisio/data.js",
    "modules/fisio/fisio.js",
    "shared/ui-system.js"
  ].forEach((file) => window.eval(read(file)));
  window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
  await window.happyDOM.whenAsyncComplete();
  return { window, root: window.document.querySelector("#fisio-root"), errors, rendered };
}

function assertSection(root, section, count, cardClass, label) {
  const tabs = Array.from(root.querySelectorAll(".sv-tab"));
  const panels = Array.from(root.querySelectorAll(".sv-pane"));
  const activeTab = tabs.find((tab) => tab.dataset.pane === section);
  const activePanel = root.querySelector(`#fisio-pane-${section}`);

  assert.equal(root.dataset.activeSection, section);
  assert.equal(activeTab.classList.contains("sv-tab-active"), true);
  assert.equal(activeTab.getAttribute("aria-selected"), "true");
  assert.equal(activeTab.tabIndex, 0);
  assert.equal(activePanel.hidden, false);
  assert.equal(activePanel.getAttribute("aria-hidden"), "false");
  assert.equal(activePanel.querySelector(".sv-label").textContent.trim(), label);
  assert.equal(activePanel.querySelectorAll(`.${cardClass}`).length, count);
  assert.equal(panels.filter((panel) => !panel.hidden).length, 1);

  tabs.filter((tab) => tab !== activeTab).forEach((tab) => {
    assert.equal(tab.getAttribute("aria-selected"), "false");
    assert.equal(tab.tabIndex, -1);
  });
}

test("Fisiologia cambia contenido real por clic sin filtros ni tarjetas residuales", async () => {
  const { window, root, errors } = await createFisioDom();
  assertSection(root, "hormonas", 57, "fisio-card-hormona", "Buscar hormonas");

  root.querySelector('[data-pane="vitaminas"]').click();
  assertSection(root, "vitaminas", 17, "fisio-card-vitamina", "Buscar vitaminas");
  assert.equal(root.querySelector("#fisio-pane-vitaminas #fisio-filtros-sistema"), null);
  assert.equal(root.querySelector("#fisio-pane-vitaminas .fisio-card-hormona"), null);

  root.querySelector('[data-pane="glosario"]').click();
  assertSection(root, "glosario", 312, "fisio-card-glosario", "Buscar en el glosario");
  assert.equal(root.querySelector("#fisio-pane-glosario #fisio-filtros-sistema"), null);
  assert.equal(root.querySelector("#fisio-pane-glosario .fisio-card-hormona"), null);

  root.querySelector('[data-pane="hormonas"]').click();
  assertSection(root, "hormonas", 57, "fisio-card-hormona", "Buscar hormonas");
  assert.deepEqual(errors, []);
  window.close();
});

test("Fisiologia usa el mismo controlador por teclado y la reinicializacion es idempotente", async () => {
  const { window, root, errors, rendered } = await createFisioDom();
  const hormoneTab = root.querySelector('[data-pane="hormonas"]');
  hormoneTab.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assertSection(root, "vitaminas", 17, "fisio-card-vitamina", "Buscar vitaminas");

  root.querySelector('[data-pane="vitaminas"]').dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "End", bubbles: true })
  );
  assertSection(root, "glosario", 312, "fisio-card-glosario", "Buscar en el glosario");

  window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
  for (let index = 0; index < 3; index += 1) {
    root.querySelector('[data-pane="hormonas"]').click();
    root.querySelector('[data-pane="vitaminas"]').click();
    root.querySelector('[data-pane="glosario"]').click();
  }
  assertSection(root, "glosario", 312, "fisio-card-glosario", "Buscar en el glosario");
  assert.equal(root.querySelectorAll(".fisio-card-hormona").length, 57);
  assert.equal(root.querySelectorAll(".fisio-card-vitamina").length, 17);
  assert.equal(root.querySelectorAll(".fisio-card-glosario").length, 312);
  assert.deepEqual(rendered, ["fisio-lista-hormonas", "fisio-lista-vitaminas", "fisio-lista-glosario"]);
  assert.deepEqual(errors, []);
  window.close();
});

test("Microbiologia imprime solo la hoja activa sobre fondo blanco y elimina la vista temporal", () => {
  const script = read("modules/micro/micro.js");
  const css = read("modules/micro/micro.css");
  const index = read("index.html");

  assert.equal((index.match(/id="micro-print-area"/g) || []).length, 1);
  assert.match(script, /window\.addEventListener\("beforeprint", prepareMicroPrint\)/);
  assert.match(script, /window\.addEventListener\("afterprint", closePrintView\)/);
  assert.match(script, /micro-print-document micro-print-doc/);
  assert.match(script, /micro-print-page-style/);
  assert.match(script, /@page \{ size: A4 portrait; margin: 12mm; \}/);
  assert.doesNotMatch(script, /micro-print-override/);
  assert.match(script, /<h1>SUITE VET<\/h1>/);
  assert.match(script, /M.dulo de Microbiolog/);

  assert.match(css, /body\.micro-printing > \*:not\(#micro-print-area\)\s*\{\s*display: none !important/);
  assert.match(css, /body\.micro-printing #micro-print-area\s*\{[\s\S]*?background: #fff !important/);
  assert.match(css, /body\.micro-printing #micro-print-area\s*\{[\s\S]*?position: static/);
  assert.match(css, /body\.micro-printing \.micro-print-doc\s*\{[\s\S]*?background: #fff !important/);
  assert.match(css, /body\.micro-printing \.micro-print-doc\s*\{[\s\S]*?color-scheme: light/);
  assert.match(css, /body\.micro-printing \.micro-print-doc\s*\{[\s\S]*?box-shadow: none !important/);
  assert.match(css, /body\.micro-printing \.micro-print-section\s*\{[\s\S]*?break-inside: auto !important/);
  assert.match(css, /body\.micro-printing \.micro-print-section tr\s*\{[\s\S]*?break-inside: avoid/);
  assert.match(css, /body\.micro-printing \.micro-print-section h2\s*\{[\s\S]*?break-after: avoid-page/);
  const sectionRule = css.match(/body\.micro-printing \.micro-print-section\s*\{([^}]+)\}/)?.[1] || "";
  assert.doesNotMatch(sectionRule, /break-inside:\s*avoid/);
});
