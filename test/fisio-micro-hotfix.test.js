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

test("Fisiologia activa exactamente un panel y sincroniza sus tabs sin reutilizar Hormonas", () => {
  const source = read("modules/fisio/fisio.js");
  assert.match(source, /const paneNames = new Set\(\["hormonas", "vitaminas", "glosario"\]\)/);
  assert.match(source, /function activatePane\(paneName\)/);
  assert.match(source, /tab\.classList\.toggle\("sv-tab-active", isActive\)/);
  assert.match(source, /pane\.classList\.toggle\("sv-pane-active", isActive\)/);
  assert.match(source, /tab\.setAttribute\("aria-selected", String\(isActive\)\)/);
  assert.match(source, /pane\.setAttribute\("aria-hidden", String\(!isActive\)\)/);
  assert.match(source, /event\.target\.closest\("\.sv-tab\[data-pane\]"\)/);
  assert.match(source, /activatePane\("vitaminas"\)/);
  assert.match(source, /activatePane\("glosario"\)/);
});

test("Microbiologia imprime solo la hoja activa sobre fondo blanco y elimina la vista temporal", () => {
  const script = read("modules/micro/micro.js");
  const css = read("modules/micro/micro.css");

  assert.match(script, /window\.addEventListener\("afterprint", closePrintView, \{ once: true \}\)/);
  assert.match(script, /window\.removeEventListener\("afterprint", closePrintView\)/);
  assert.doesNotMatch(script, /micro-print-override/);
  assert.match(script, /<h1>SUITE VET<\/h1>/);
  assert.match(script, /M.dulo de Microbiolog/);

  assert.match(css, /body\.micro-printing > \*:not\(#micro-print-area\)\s*\{\s*display: none !important/);
  assert.match(css, /body\.micro-printing #micro-print-area\s*\{[\s\S]*?background: #fff !important/);
  assert.match(css, /body\.micro-printing #micro-print-area\s*\{[\s\S]*?position: static/);
  assert.match(css, /body\.micro-printing \.micro-print-doc\s*\{[\s\S]*?background: #fff !important/);
  assert.match(css, /body\.micro-printing \.micro-print-doc\s*\{[\s\S]*?box-shadow: none !important/);
  assert.match(css, /@page\s*\{\s*margin: 12mm;\s*size: A4 portrait/);
});
