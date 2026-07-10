const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const indexSource = read("index.html");
const tokensSource = read("shared/tokens.css");
const componentsSource = read("shared/components.css");
const responsiveSource = read("shared/responsive.css");
const uiSource = read("shared/ui-system.js");

test("los tokens concentran tipografia, espaciado, formas, estados y colores de modulo", () => {
  assert.match(tokensSource, /--sv-font-heading:[^;]+Segoe UI/);
  ["0.25rem", "0.5rem", "0.75rem", "1rem", "1.25rem", "1.5rem", "2rem", "2.5rem"].forEach((value) => {
    assert.match(tokensSource, new RegExp(`--sv-space-\\d: ${value.replace(".", "\\.")}`));
  });
  assert.match(tokensSource, /--sv-control-height: 2\.75rem/);
  assert.match(tokensSource, /--sv-bg-selected:/);
  assert.match(tokensSource, /--sv-success-soft:/);
  assert.match(tokensSource, /--sv-casos360-color:/);
  assert.match(tokensSource, /--sv-onco-color:/);
});

test("los componentes compartidos cubren tarjetas, campos, alertas, tablas y carga", () => {
  assert.match(componentsSource, /\.sv-card-interactive:hover/);
  assert.doesNotMatch(componentsSource, /\n\.sv-card:hover\s*\{/);
  assert.match(componentsSource, /\.sv-form-grid/);
  assert.match(componentsSource, /\[aria-invalid="true"\]/);
  assert.match(componentsSource, /\.sv-alert-success/);
  assert.match(componentsSource, /\.sv-table-wrap/);
  assert.match(componentsSource, /\.sv-loading::before/);
  assert.match(componentsSource, /body\.sv-dialog-open/);
});

test("los tabs compartidos publican semantica y navegacion completa por teclado", () => {
  assert.match(indexSource, /shared\/ui-system\.js/);
  assert.match(uiSource, /setAttribute\("role", "tablist"\)/);
  assert.match(uiSource, /setAttribute\("role", "tab"\)/);
  assert.match(uiSource, /setAttribute\("role", "tabpanel"\)/);
  assert.match(uiSource, /setAttribute\("aria-selected"/);
  assert.match(uiSource, /event\.key === "ArrowRight"/);
  assert.match(uiSource, /event\.key === "Home"/);
  assert.match(uiSource, /event\.key === "End"/);
});

test("los modales compartidos tienen dialogo, estado, Escape, foco y restauracion", () => {
  assert.match(indexSource, /id="sv-modal-receta"[^>]+aria-hidden="true"/);
  assert.match(indexSource, /class="sv-receta-container" role="dialog" aria-modal="true"/);
  assert.match(read("modules/micro/micro.js"), /class="micro-modal" role="dialog" aria-modal="true"/);
  assert.match(uiSource, /overlay\.inert = !open/);
  assert.match(uiSource, /event\.key === "Escape"/);
  assert.match(uiSource, /event\.key !== "Tab"/);
  assert.match(uiSource, /returnFocus/);
});

test("los cuatro breakpoints aprobados gobiernan los ajustes internos", () => {
  assert.match(responsiveSource, /@media screen and \(max-width: 900px\)/);
  assert.match(responsiveSource, /@media screen and \(max-width: 640px\)/);
  assert.match(responsiveSource, /@media screen and \(max-width: 420px\)/);
  assert.match(responsiveSource, /min-height: 44px/);
  assert.match(responsiveSource, /\.c360-player-container/);
  assert.match(responsiveSource, /\.onco-protocol-layout/);
  assert.match(responsiveSource, /\.clinica-form-grid-4/);
  assert.match(responsiveSource, /\.semi-form-grid-3/);
});

test("los modulos densos contienen tablas dentro de wrappers responsive", () => {
  assert.match(read("modules/nutricion/nutricion.js"), /nutri-table-wrap sv-table-wrap/);
  assert.match(read("modules/micro/micro.js"), /class="sv-table-wrap"/);
  assert.match(read("modules/semiologia-anamnesis/semiologia.js"), /class="sv-table-wrap"/);
  assert.match(read("modules/casos-360/casos.js"), /c360-asset-table sv-table/);
});

test("los contratos de impresion y PDF permanecen presentes", () => {
  const protectedFiles = [
    "shared/recetario.css",
    "modules/micro/micro.css",
    "modules/nutricion/nutricion.css",
    "modules/clinica-integrada/clinica.css",
    "modules/semiologia-anamnesis/semiologia.css",
    "modules/onco/onco.css"
  ];
  protectedFiles.forEach((file) => assert.match(read(file), /@media print/));
  assert.match(read("shared/recetario.js"), /window\.print\(\)/);
  assert.match(read("modules/micro/micro.js"), /printFichaDoc/);
  assert.match(read("modules/nutricion/nutricion.js"), /window\.print\(\)/);
  assert.match(read("modules/clinica-integrada/clinica-pdf.js"), /window\.print\(\)/);
  assert.match(read("modules/semiologia-anamnesis/semiologia-pdf.js"), /window\.print\(\)/);
  assert.match(read("modules/onco/onco.js"), /window\.print\(\)/);
});
