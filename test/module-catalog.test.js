const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const catalogSource = fs.readFileSync(path.join(root, "shared", "module-catalog.js"), "utf8");
const routerSource = fs.readFileSync(path.join(root, "shared", "router.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const backendDocument = JSON.parse(fs.readFileSync(path.join(root, "backend", "app", "data", "modules.json"), "utf8"));

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

function loadCatalog({ payload, rejection } = {}) {
  const listeners = new Map();
  const dispatched = [];
  const info = [];
  const sandbox = {
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
  if (payload !== undefined) {
    sandbox.remotePayload = JSON.stringify(payload);
    vm.runInContext("this.SuiteVetAPI = { getCatalogModules: async () => JSON.parse(this.remotePayload) };", context);
  } else if (rejection) {
    sandbox.rejectionCode = rejection.code || "UNAVAILABLE";
    vm.runInContext("this.SuiteVetAPI = { getCatalogModules: async () => { const error = new Error('offline'); error.code = this.rejectionCode; throw error; } };", context);
  }
  vm.runInContext(catalogSource, context, { filename: "shared/module-catalog.js" });
  return { context, dispatched, info, listeners, sandbox };
}

test("el fallback esta disponible sin esperar red ni backend", () => {
  const { sandbox } = loadCatalog();
  const snapshot = plain(sandbox.SuiteVetCatalog.getSnapshot());

  assert.equal(snapshot.source, "fallback");
  assert.equal(snapshot.items.length, 16);
  assert.equal(sandbox.SuiteVetCatalog.find("vetonco").route, "oncologia");
  assert.equal(Object.isFrozen(sandbox.SuiteVetCatalog), true);
});

test("el fallback frontend conserva paridad exacta con el JSON autoritativo", () => {
  const { sandbox } = loadCatalog();
  const snapshot = plain(sandbox.SuiteVetCatalog.getSnapshot());

  assert.equal(snapshot.schema_version, backendDocument.schema_version);
  assert.equal(snapshot.catalog_version, backendDocument.catalog_version);
  assert.deepEqual(snapshot.items, backendDocument.items);
});

test("una respuesta valida reemplaza el fallback y emite un solo evento", async () => {
  const payload = responseFrom(backendDocument, { catalog_version: "2.2.1" });
  payload.items = payload.items.map((item) => item.id === "oncologia" ? { ...item, short_name: "VetOnco API" } : item);
  const { dispatched, sandbox } = loadCatalog({ payload });

  const first = await sandbox.SuiteVetCatalog.load();
  const second = await sandbox.SuiteVetCatalog.load();

  assert.equal(first, second);
  assert.equal(first.source, "api");
  assert.equal(first.catalog_version, "2.2.1");
  assert.equal(sandbox.SuiteVetCatalog.find("oncologia").short_name, "VetOnco API");
  assert.equal(dispatched.length, 1);
  assert.equal(dispatched[0].type, "suitevet:catalogready");
});

test("backend caido o timeout conserva el fallback sin rechazos", async () => {
  for (const code of ["UNAVAILABLE", "TIMEOUT", "HTTP_ERROR", "INVALID_JSON"]) {
    const { info, sandbox } = loadCatalog({ rejection: { code } });
    const snapshot = await sandbox.SuiteVetCatalog.load({ timeoutMs: 5 });
    assert.equal(snapshot.source, "fallback");
    assert.equal(snapshot.items.length, 16);
    assert.equal(info.length, 1);
  }
});

test("rechaza metadatos ejecutables, rutas y campos no autorizados", async () => {
  const maliciousCases = [
    (item) => ({ ...item, name: "<img src=x onerror=alert(1)>" }),
    (item) => ({ ...item, route: "javascript:alert(1)" }),
    (item) => ({ ...item, style: "background:url(javascript:alert(1))" })
  ];

  for (const mutate of maliciousCases) {
    const payload = responseFrom(backendDocument);
    payload.items = payload.items.map((item, index) => index === 1 ? mutate(item) : item);
    const { dispatched, sandbox } = loadCatalog({ payload });
    const snapshot = await sandbox.SuiteVetCatalog.load();
    assert.equal(snapshot.source, "fallback");
    assert.equal(dispatched.length, 0);
  }
});

test("rutas del catalogo coinciden con las vistas aprobadas y son unicas", () => {
  const routes = backendDocument.items.map((item) => item.route).filter(Boolean);
  assert.equal(new Set(routes).size, routes.length);
  assert.deepEqual(routes, [
    "home", "fisiologia", "farmacologia", "microbiologia", "patologia",
    "nutricion", "clinica", "semiologia", "casos360", "oncologia",
    "bibliografia", "favoritos", "about"
  ]);
});

test("sidebar, inicio y buscador consumen el catalogo con render de texto seguro", () => {
  assert.match(indexSource, /id="sv-home-catalog"/);
  assert.match(routerSource, /catalogItems\(\)\.filter\(\(item\) => item\.visible_in_sidebar\)/);
  assert.match(routerSource, /\.filter\(\(item\) => item\.visible_on_home\)/);
  assert.match(routerSource, /SuiteVetCatalog\?\.find\?\.\(moduleId\)/);
  assert.match(routerSource, /Safety\.createTextElement/);
  assert.match(routerSource, /panel\.replaceChildren/);
  assert.doesNotMatch(routerSource, /const labels\s*=\s*\{/);
});
