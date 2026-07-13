const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "shared", "auth-service.js"), "utf8");

function loadAuth(options = {}) {
  const calls = [];
  let authCallback = null;
  let unsubscribed = 0;
  let replacedWith = null;
  const session = options.session ?? null;
  const authApi = {
    onAuthStateChange(callback) {
      authCallback = callback;
      return { data: { subscription: { unsubscribe() { unsubscribed += 1; } } } };
    },
    async getSession() { calls.push(["getSession"]); return { data: { session }, error: options.sessionError || null }; },
    async signUp(payload) { calls.push(["signUp", payload]); return options.signUpResult || { data: { user: { id: "u1" }, session: null }, error: null }; },
    async signInWithPassword(payload) { calls.push(["signIn", payload]); return options.signInResult || { data: { user: { id: "u1" }, session: { user: { id: "u1", email: payload.email } } }, error: null }; },
    async signOut() { calls.push(["signOut"]); return { error: options.signOutError || null }; },
    async resetPasswordForEmail(email, config) { calls.push(["reset", email, config]); return { error: options.resetError || null }; },
    async updateUser(payload) { calls.push(["updateUser", payload]); return { data: { user: { id: "u1" } }, error: options.updateError || null }; },
    async resend(payload) { calls.push(["resend", payload]); return { data: {}, error: options.resendError || null }; }
  };
  const href = options.href || "https://elranchodejuan-jo.github.io/SUITE_VET/";
  const parsed = new URL(href);
  const sandbox = {
    URL,
    URLSearchParams,
    Set,
    console,
    location: { href, origin: parsed.origin, pathname: parsed.pathname, search: parsed.search, hash: parsed.hash },
    history: { state: null, replaceState(_state, _title, value) { replacedWith = value; } },
    setTimeout(callback) { callback(); },
    SuiteVetPublicConfig: options.config === false ? {} : {
      supabaseUrl: "https://ibkbbzyrnaaqrjiidfjl.supabase.co",
      supabasePublishableKey: "sb_publishable_example"
    },
    supabase: { createClient(url, key, config) { calls.push(["createClient", url, key, config]); return { auth: authApi }; } }
  };
  sandbox.window = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "shared/auth-service.js" });
  return {
    auth: sandbox.SuiteVetAuth,
    calls,
    emit(event, nextSession) { authCallback?.(event, nextSession); },
    get replacedWith() { return replacedWith; },
    get unsubscribed() { return unsubscribed; }
  };
}

test("configuración ausente conserva el servicio en estado seguro", async () => {
  const { auth, calls } = loadAuth({ config: false });
  const status = await auth.initialize();
  assert.equal(status.configured, false);
  assert.equal(status.error.code, "CONFIGURATION_MISSING");
  assert.equal(calls.length, 0);
});

test("inicializa un único cliente con persistencia oficial y sesión nula", async () => {
  const { auth, calls } = loadAuth();
  const first = await auth.initialize();
  const second = await auth.initialize();
  assert.equal(first.configured, true);
  assert.equal(first.authenticated, false);
  assert.equal(second.configured, true);
  assert.equal(calls.filter(([name]) => name === "createClient").length, 1);
  const options = calls.find(([name]) => name === "createClient")[3].auth;
  assert.deepEqual(JSON.parse(JSON.stringify(options)), { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" });
});

test("restaura sesión y publica INITIAL_SESSION una sola vez", async () => {
  const restored = { user: { id: "u1", email: "student@example.test" } };
  const { auth, emit } = loadAuth({ session: restored });
  const events = [];
  auth.subscribeToAuthChanges((snapshot) => events.push(snapshot.event));
  await auth.initialize();
  emit("INITIAL_SESSION", restored);
  assert.equal((await auth.getCurrentUser()).id, "u1");
  assert.deepEqual(events, ["INITIAL_SESSION"]);
});

test("registro usa correo normalizado y redirect permitido sin guardar tokens", async () => {
  const { auth, calls } = loadAuth();
  await auth.initialize();
  const result = await auth.signUp({ email: "  USER@Example.Test ", password: "Valid#Pass1" });
  assert.equal(result.confirmationPending, true);
  const payload = calls.find(([name]) => name === "signUp")[1];
  assert.equal(payload.email, "user@example.test");
  assert.equal(payload.options.emailRedirectTo, "https://elranchodejuan-jo.github.io/SUITE_VET/");
  assert.doesNotMatch(source, /localStorage|sessionStorage|document\.cookie/);
});

test("login correcto, credenciales erróneas neutrales y correo no confirmado", async () => {
  const ok = loadAuth();
  await ok.auth.initialize();
  const result = await ok.auth.signIn({ email: "Student@Example.Test", password: "Valid#Pass1" });
  assert.equal(result.session.user.email, "student@example.test");

  const invalid = loadAuth({ signInResult: { data: null, error: { message: "Invalid login credentials", status: 400 } } });
  await invalid.auth.initialize();
  await assert.rejects(invalid.auth.signIn({ email: "x@example.test", password: "bad" }), (error) => error.code === "INVALID_CREDENTIALS" && !/registrad/.test(error.message));

  const pending = loadAuth({ signInResult: { data: null, error: { message: "Email not confirmed", status: 400 } } });
  await pending.auth.initialize();
  await assert.rejects(pending.auth.signIn({ email: "x@example.test", password: "bad" }), (error) => error.code === "EMAIL_NOT_CONFIRMED");
});

test("cierre, recuperación y reenvío solo ocurren por llamada explícita", async () => {
  const { auth, calls } = loadAuth();
  await auth.initialize();
  await auth.requestPasswordReset("User@Example.Test");
  await auth.resendConfirmation("User@Example.Test");
  await auth.signOut();
  assert.equal(calls.find(([name]) => name === "reset")[2].redirectTo, "https://elranchodejuan-jo.github.io/SUITE_VET/");
  assert.equal(calls.filter(([name]) => name === "resend").length, 1);
  assert.equal(calls.filter(([name]) => name === "signOut").length, 1);
});

test("429 produce espera amigable sin reintento automático", async () => {
  const { auth, calls } = loadAuth({ resetError: { status: 429, message: "rate limit" } });
  await auth.initialize();
  await assert.rejects(auth.requestPasswordReset("x@example.test"), (error) => error.code === "RATE_LIMITED");
  assert.equal(calls.filter(([name]) => name === "reset").length, 1);
});

test("PASSWORD_RECOVERY habilita una única actualización de contraseña", async () => {
  const { auth, calls, emit } = loadAuth();
  await auth.initialize();
  await assert.rejects(auth.updatePassword("Valid#Pass1"), (error) => error.code === "RECOVERY_SESSION_REQUIRED");
  emit("PASSWORD_RECOVERY", { user: { id: "u1" } });
  await auth.updatePassword("NewValid#Pass2");
  assert.equal(calls.filter(([name]) => name === "updateUser").length, 1);
  await assert.rejects(auth.updatePassword("Again#Pass3"), (error) => error.code === "RECOVERY_SESSION_REQUIRED");
});

test("limpia datos sensibles del callback y preserva la ruta", async () => {
  const loaded = loadAuth({ href: "https://elranchodejuan-jo.github.io/SUITE_VET/?code=secret&safe=1#access_token=hidden" });
  await loaded.auth.initialize();
  assert.equal(loaded.replacedWith, "/SUITE_VET/?safe=1");
});

test("redirect allowlist acepta localhost exacto y bloquea origen externo", () => {
  const { auth } = loadAuth();
  assert.equal(auth.buildRedirectUrl({ origin: "http://localhost:5173" }), "http://localhost:5173/");
  assert.equal(auth.buildRedirectUrl({ origin: "http://127.0.0.1:5173" }), "http://127.0.0.1:5173/");
  assert.throws(() => auth.buildRedirectUrl({ origin: "https://evil.example" }), (error) => error.code === "REDIRECT_NOT_ALLOWED");
});

test("suscripción de consumidores se retira y dispose cancela Supabase", async () => {
  const loaded = loadAuth();
  let notified = 0;
  const remove = loaded.auth.subscribeToAuthChanges(() => { notified += 1; });
  await loaded.auth.initialize();
  remove();
  loaded.emit("SIGNED_OUT", null);
  assert.equal(notified, 1);
  loaded.auth.dispose();
  assert.equal(loaded.unsubscribed, 1);
});
