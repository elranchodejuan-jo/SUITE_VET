const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "shared", "user-data-service.js"), "utf8");

class Query {
  constructor(table, resolver, calls) { this.table = table; this.resolver = resolver; this.calls = calls; this.operation = "select"; this.payload = null; this.filters = []; }
  select(columns) { this.columns = columns; return this; }
  update(payload) { this.operation = "update"; this.payload = payload; this.calls.push([this.table, "update", payload]); return this; }
  insert(payload) { this.operation = "insert"; this.payload = payload; this.calls.push([this.table, "insert", payload]); return this; }
  eq(column, value) { this.filters.push(["eq", column, value]); return this; }
  in(column, value) { this.filters.push(["in", column, value]); return this; }
  order(column, options) { this.filters.push(["order", column, options]); return this; }
  single() { return Promise.resolve(this.resolver(this)); }
  maybeSingle() { return Promise.resolve(this.resolver(this)); }
  then(resolve, reject) { return Promise.resolve(this.resolver(this)).then(resolve, reject); }
}

function loadData(resolver, user = { id: "u1", email: "student@example.test" }) {
  const calls = [];
  const queries = [];
  const client = {
    from(table) {
      calls.push([table, "from"]);
      const query = new Query(table, resolver, calls);
      queries.push(query);
      return query;
    }
  };
  const sandbox = { console, SuiteVetAuth: { async getCurrentUser() { return user; }, getClient() { return client; } } };
  sandbox.window = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "shared/user-data-service.js" });
  return { data: sandbox.SuiteVetUserData, calls, queries };
}

const validProfile = {
  first_name: "María José",
  last_name: "O'Connor",
  username: "  Vet_Student1 ",
  career: "Medicina Veterinaria",
  semester: "Séptimo",
  institution: "Universidad Técnica de Machala"
};

test("catálogos académicos son exactos, versionables y sin texto libre", () => {
  const { data } = loadData(() => ({ data: null, error: null }));
  assert.equal(data.CAREERS.length, 5);
  assert.equal(data.SEMESTERS.length, 13);
  assert.equal(data.INSTITUTIONS.length, 6);
  assert.ok(Object.isFrozen(data.CAREERS));
});

test("perfil valida nombres Unicode y normaliza username y display_name", () => {
  const { data } = loadData(() => ({ data: null, error: null }));
  const result = data.validateProfile(validProfile);
  assert.equal(result.username, "vet_student1");
  assert.equal(result.display_name, "María José O'Connor");
  assert.equal(Object.prototype.hasOwnProperty.call(result, "role"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(result, "id"), false);
});

test("perfil rechaza catálogos arbitrarios, HTML y username inválido", () => {
  const { data } = loadData(() => ({ data: null, error: null }));
  assert.throws(() => data.validateProfile({ ...validProfile, career: "Otra inventada" }), (error) => error.code === "PROFILE_INVALID" && Boolean(error.errors.career));
  assert.throws(() => data.validateProfile({ ...validProfile, first_name: "<script>" }), (error) => Boolean(error.errors.first_name));
  assert.throws(() => data.validateProfile({ ...validProfile, username: "Admin User" }), (error) => Boolean(error.errors.username));
});

test("carga únicamente perfil propio y rol desde user_roles autoritativo", async () => {
  const profile = { id: "u1", display_name: "Student", first_name: "Student", last_name: null };
  const loaded = loadData((query) => query.table === "profiles" ? { data: profile, error: null } : { data: [{ role: "student" }], error: null });
  const result = await loaded.data.loadProfile();
  assert.equal(result.email, "student@example.test");
  assert.equal(result.role, "student");
  assert.equal(result.complete, false);
  assert.ok(loaded.calls.some(([table]) => table === "user_roles"));
});

test("actualiza solo columnas permitidas del perfil propio", async () => {
  const loaded = loadData((query) => ({ data: { id: "u1", ...query.payload }, error: null }));
  const result = await loaded.data.updateProfile({ ...validProfile, id: "other", role: "super_admin", email: "other@example.test" });
  const payload = loaded.calls.find(([table, op]) => table === "profiles" && op === "update")[2];
  assert.equal(result.username, "vet_student1");
  assert.deepEqual(Object.keys(payload).sort(), ["career", "display_name", "first_name", "institution", "last_name", "semester", "username"]);
});

test("actualización fallida no devuelve éxito falso", async () => {
  const loaded = loadData(() => ({ data: null, error: { code: "23505", message: "duplicate" } }));
  await assert.rejects(loaded.data.updateProfile(validProfile), (error) => error.code === "USERNAME_TAKEN");
});

test("comentario válido usa contrato mínimo y no acepta campos administrativos", async () => {
  const loaded = loadData((query) => ({ data: { id: "f1", ...query.payload }, error: null }));
  const result = await loaded.data.submitFeedback({ subject: "comment", message: "Una observación válida.", rating: 5, approved: true, user_id: "other" });
  const payload = loaded.calls.find(([table, op]) => table === "user_feedback" && op === "insert")[2];
  assert.deepEqual(JSON.parse(JSON.stringify(payload)), { subject: "comment", message: "Una observación válida.", rating: 5 });
  assert.equal(result.approved, undefined);
});

test("comentario rechaza rating, asunto, HTML y longitud fuera de contrato", () => {
  const { data } = loadData(() => ({ data: null, error: null }));
  assert.throws(() => data.validateFeedback({ subject: "unknown", message: "Mensaje suficientemente largo", rating: 5 }), (error) => Boolean(error.errors.subject));
  assert.throws(() => data.validateFeedback({ subject: "comment", message: "Mensaje suficientemente largo", rating: 6 }), (error) => Boolean(error.errors.rating));
  assert.throws(() => data.validateFeedback({ subject: "comment", message: "<img onerror=x>", rating: 4 }), (error) => Boolean(error.errors.message));
  assert.throws(() => data.validateFeedback({ subject: "comment", message: "x".repeat(2001), rating: 4 }), (error) => Boolean(error.errors.message));
});

test("fallo de inserción no produce confirmación falsa", async () => {
  const loaded = loadData(() => ({ data: null, error: { message: "network fetch failed" } }));
  await assert.rejects(loaded.data.submitFeedback({ subject: "recommendation", message: "Comentario válido para probar", rating: 4 }), (error) => error.code === "NETWORK_ERROR");
});

test("una respuesta sin registro confirmado no produce éxito falso", async () => {
  const loaded = loadData(() => ({ data: null, error: null }));
  await assert.rejects(
    loaded.data.submitFeedback({ subject: "comment", message: "Comentario válido para confirmar", rating: 4 }),
    (error) => error.code === "FEEDBACK_INSERT_UNCONFIRMED"
  );
});

test("Mis comentarios consulta exclusivamente el user_id de la sesión", async () => {
  const loaded = loadData((query) => query.table === "user_feedback"
    ? { data: [{ id: "f1", user_id: "u1" }], error: null }
    : { data: null, error: null });
  const result = await loaded.data.loadOwnFeedback();
  const query = loaded.queries.find((item) => item.table === "user_feedback");
  assert.equal(result.length, 1);
  assert.deepEqual(query.filters.find(([kind]) => kind === "eq"), ["eq", "user_id", "u1"]);
});

test("panel administrativo exige super_admin desde user_roles", async () => {
  const normal = loadData((query) => query.table === "user_roles" ? { data: null, error: null } : { data: [], error: null });
  await assert.rejects(normal.data.loadAdminFeedback(), (error) => error.code === "FORBIDDEN");

  const admin = loadData((query) => {
    if (query.table === "user_roles") return { data: { role: "super_admin" }, error: null };
    if (query.table === "user_feedback") return { data: [], error: null };
    return { data: [], error: null };
  });
  assert.deepEqual(await admin.data.loadAdminFeedback(), []);
});

test("aprobación y respuesta actualizan columnas separadas del texto original", async () => {
  const loaded = loadData((query) => {
    if (query.table === "user_roles") return { data: { role: "super_admin" }, error: null };
    return { data: { id: "f1", message: "Original", ...query.payload }, error: null };
  });
  await loaded.data.updateFeedbackApproval("f1", true);
  await loaded.data.updateFeedbackResponse("f1", "Respuesta segura");
  const updates = loaded.calls.filter(([table, op]) => table === "user_feedback" && op === "update").map((call) => call[2]);
  assert.deepEqual(JSON.parse(JSON.stringify(updates)), [{ approved: true }, { response: "Respuesta segura" }]);
});

test("sin sesión no se consulta Supabase", async () => {
  const loaded = loadData(() => ({ data: null, error: null }), null);
  await assert.rejects(loaded.data.loadProfile(), (error) => error.code === "AUTH_REQUIRED");
  assert.equal(loaded.calls.length, 0);
});
