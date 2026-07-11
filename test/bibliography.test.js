const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "modules", "bibliografia", "data.js"), "utf8");
const domainSource = fs.readFileSync(path.join(root, "shared", "bibliography.js"), "utf8");
const moduleSource = fs.readFileSync(path.join(root, "modules", "bibliografia", "bibliografia.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const backendDocument = JSON.parse(fs.readFileSync(path.join(root, "backend", "app", "data", "bibliography.json"), "utf8"));

function responseFrom(document, overrides = {}) {
  return {
    schema_version: document.schema_version,
    catalog_version: document.catalog_version,
    source: "static",
    total: document.items.length,
    items: document.items,
    ...overrides
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadBibliography({ payload, rejection } = {}) {
  const dispatched = [];
  const info = [];
  const listeners = new Map();
  const sandbox = {
    calls: 0,
    console: { info: (...args) => info.push(args) },
    CustomEvent: class CustomEvent {
      constructor(type, options = {}) {
        this.type = type;
        this.detail = options.detail;
      }
    },
    document: {
      addEventListener(type, callback) {
        listeners.set(type, callback);
      },
      dispatchEvent(event) {
        dispatched.push(event);
      }
    }
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  vm.runInContext(dataSource, context, { filename: "modules/bibliografia/data.js" });
  if (payload !== undefined) {
    sandbox.remotePayload = JSON.stringify(payload);
    vm.runInContext("this.SuiteVetAPI = { getBibliographyResources: async () => { this.calls += 1; return JSON.parse(this.remotePayload); } };", context);
  } else if (rejection) {
    sandbox.rejectionCode = rejection.code || "UNAVAILABLE";
    vm.runInContext("this.SuiteVetAPI = { getBibliographyResources: async () => { this.calls += 1; const error = new Error('offline'); error.code = this.rejectionCode; throw error; } };", context);
  }
  vm.runInContext(domainSource, context, { filename: "shared/bibliography.js" });
  return { dispatched, info, listeners, sandbox };
}

test("bibliografia tiene fallback inmediato y reporta su fuente", () => {
  const { sandbox } = loadBibliography();
  const snapshot = plain(sandbox.SuiteVetBibliography.getSnapshot());

  assert.equal(snapshot.source, "fallback");
  assert.equal(snapshot.remote_status, "not_requested");
  assert.equal(snapshot.items.length, 1);
  assert.equal(sandbox.SuiteVetBibliography.getResource("fisiologia-animal-1").title, backendDocument.items[0].title);
});

test("fallback frontend mantiene paridad exacta con bibliography.json", () => {
  const { sandbox } = loadBibliography();
  const fallback = plain(sandbox.SuiteVetBibliography.getSnapshot());

  assert.equal(fallback.schema_version, backendDocument.schema_version);
  assert.equal(fallback.catalog_version, backendDocument.catalog_version);
  assert.deepEqual(fallback.items, backendDocument.items);
});

test("API valida actualiza una vez, conserva campos criticos y emite evento", async () => {
  const payload = responseFrom(backendDocument);
  payload.items = payload.items.map((item) => ({ ...item, review_status: "reviewed" }));
  const { dispatched, sandbox } = loadBibliography({ payload });

  const first = await sandbox.SuiteVetBibliography.load();
  const second = await sandbox.SuiteVetBibliography.load();

  assert.equal(first, second);
  assert.equal(first.source, "api");
  assert.equal(first.items[0].review_status, "reviewed");
  assert.equal(sandbox.calls, 1);
  assert.equal(dispatched.length, 1);
  assert.equal(dispatched[0].type, "suitevet:bibliographyready");
});

test("backend caido, timeout, HTTP y JSON invalido conservan fallback", async () => {
  for (const code of ["UNAVAILABLE", "TIMEOUT", "HTTP_ERROR", "INVALID_JSON"]) {
    const { info, sandbox } = loadBibliography({ rejection: { code } });
    const snapshot = await sandbox.SuiteVetBibliography.load({ timeoutMs: 5 });
    assert.equal(snapshot.source, "fallback");
    assert.equal(snapshot.remote_status, code);
    assert.equal(info.length, 1);
  }
});

test("payload malicioso no ejecuta HTML ni cambia el fallback", async () => {
  const cases = [
    (item) => ({ ...item, title: "<img src=x onerror=alert(1)>" }),
    (item) => ({ ...item, asset_key: "../fuera.pdf" }),
    (item) => ({ ...item, citation_apa: "javascript:alert(1)" }),
    (item) => ({ ...item, style: "background:url(javascript:alert(1))" })
  ];

  for (const mutate of cases) {
    const payload = responseFrom(backendDocument);
    payload.items = payload.items.map((item, index) => index === 0 ? mutate(item) : item);
    const { dispatched, sandbox } = loadBibliography({ payload });
    const snapshot = await sandbox.SuiteVetBibliography.load();
    assert.equal(snapshot.source, "fallback");
    assert.equal(dispatched.length, 0);
  }
});

test("diferencias criticas de API se retienen en fallback controlado", async () => {
  const payload = responseFrom(backendDocument);
  payload.items = payload.items.map((item) => ({ ...item, title: "Titulo remoto distinto" }));
  const { sandbox } = loadBibliography({ payload });

  const snapshot = await sandbox.SuiteVetBibliography.load();

  assert.equal(snapshot.source, "fallback");
  assert.equal(snapshot.remote_status, "critical_mismatch");
  assert.equal(snapshot.items[0].title, backendDocument.items[0].title);
});

test("APA, Vancouver y la ruta del PDF conservan el texto y whitelist aprobados", () => {
  const { sandbox } = loadBibliography();
  const resource = sandbox.SuiteVetBibliography.getResource("fisiologia-animal-1");

  assert.equal(resource.citation_apa, backendDocument.items[0].citation_apa);
  assert.equal(resource.citation_vancouver, backendDocument.items[0].citation_vancouver);
  assert.equal(sandbox.SuiteVetBibliography.getAssetPath(resource.asset_key), "assets/libros/Fisiología Animal I - Publicado.pdf");
  assert.equal(sandbox.SuiteVetBibliography.getAssetPath("../outside"), null);
  assert.equal(fs.existsSync(path.join(root, sandbox.SuiteVetBibliography.getAssetPath(resource.asset_key))), true);
});

test("la fachada legacy conserva compatibilidad sin etiquetas HTML", () => {
  const { sandbox } = loadBibliography();
  const legacy = plain(sandbox.BIBLIOGRAFIA_DATA[0]);

  assert.equal(legacy.titulo, backendDocument.items[0].title);
  assert.equal(legacy.apa, backendDocument.items[0].citation_apa);
  assert.doesNotMatch(legacy.apa, /<i>|<script>|onerror/i);
});

test("el modulo carga el dominio antes del controlador y usa nodos de texto para recursos", () => {
  assert.match(indexSource, /modules\/bibliografia\/data\.js" defer><\/script>\s*<script src="shared\/bibliography\.js" defer><\/script>\s*<script src="modules\/bibliografia\/bibliografia\.js" defer>/);
  assert.match(moduleSource, /window\.SuiteVetBibliography\?\.getResources/);
  assert.match(moduleSource, /element\.textContent/);
  assert.match(moduleSource, /getAssetPath/);
  assert.doesNotMatch(moduleSource, /book\.apa|book\.titulo|book\.descargaUrl/);
});

test("API global conserva health, catalogo y bibliografia", () => {
  const source = fs.readFileSync(path.join(root, "shared", "api-client.js"), "utf8");
  assert.match(source, /getHealth/);
  assert.match(source, /getCatalogModules/);
  assert.match(source, /getBibliographyResources/);
  assert.match(source, /getBibliographyResource/);
});
