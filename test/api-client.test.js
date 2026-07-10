const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const clientSource = fs.readFileSync(path.join(root, "shared", "api-client.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const viteSource = fs.readFileSync(path.join(root, "vite.config.mjs"), "utf8");

function successfulResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return payload;
    }
  };
}

function loadClient(fetchImpl) {
  const calls = [];
  const sandbox = {
    AbortController,
    clearTimeout,
    console,
    setTimeout,
    fetch: async (...args) => {
      calls.push(args);
      return fetchImpl(...args);
    }
  };
  sandbox.window = sandbox;
  vm.runInNewContext(clientSource, sandbox, { filename: "shared/api-client.js" });
  return { calls, sandbox };
}

test("el cliente no realiza solicitudes al cargarse y usa un namespace unico", () => {
  const { calls, sandbox } = loadClient(async () => successfulResponse({}));

  assert.equal(calls.length, 0);
  assert.equal(typeof sandbox.SuiteVetAPI.getHealth, "function");
  assert.equal(sandbox.getHealth, undefined);
  assert.equal(Object.isFrozen(sandbox.SuiteVetAPI), true);
});

test("health usa la URL versionada y devuelve JSON", async () => {
  const payload = { status: "ok" };
  const { calls, sandbox } = loadClient(async () => successfulResponse(payload));
  sandbox.SuiteVetAPI.configure({ baseUrl: "http://127.0.0.1:8000/" });

  const result = await sandbox.SuiteVetAPI.getHealth();

  assert.deepEqual(result, payload);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "http://127.0.0.1:8000/api/v1/health");
  assert.equal(calls[0][1].method, "GET");
  assert.equal(calls[0][1].headers.Accept, "application/json");
});

test("un error HTTP conserva codigo y estado", async () => {
  const { sandbox } = loadClient(async () => successfulResponse({}, 503));

  await assert.rejects(
    sandbox.SuiteVetAPI.getHealth(),
    (error) => error.code === "HTTP_ERROR" && error.status === 503
  );
});

test("una respuesta JSON invalida se distingue del error HTTP", async () => {
  const { sandbox } = loadClient(async () => ({
    ok: true,
    status: 200,
    async json() {
      throw new SyntaxError("invalid json");
    }
  }));

  await assert.rejects(
    sandbox.SuiteVetAPI.getHealth(),
    (error) => error.code === "INVALID_JSON" && error.status === 200
  );
});

test("un backend inaccesible produce UNAVAILABLE", async () => {
  const { sandbox } = loadClient(async () => {
    throw new TypeError("network down");
  });

  await assert.rejects(
    sandbox.SuiteVetAPI.getHealth(),
    (error) => error.code === "UNAVAILABLE" && error.status === null
  );
});

test("AbortController convierte el vencimiento en TIMEOUT", async () => {
  const { sandbox } = loadClient((_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => {
      const error = new Error("aborted");
      error.name = "AbortError";
      reject(error);
    }, { once: true });
  }));

  await assert.rejects(
    sandbox.SuiteVetAPI.getHealth({ timeoutMs: 5 }),
    (error) => error.code === "TIMEOUT"
  );
});

test("index carga el cliente clasico sin invocarlo", () => {
  assert.match(indexSource, /<script src="shared\/api-client\.js" defer><\/script>/);
  assert.doesNotMatch(indexSource, /SuiteVetAPI\.getHealth\s*\(/);
});

test("Vite limita el proxy de desarrollo al prefijo API", () => {
  assert.match(viteSource, /["']\/api["']\s*:/);
  assert.match(viteSource, /target:\s*["']http:\/\/127\.0\.0\.1:8000["']/);
});
