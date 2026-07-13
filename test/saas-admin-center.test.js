"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const index = read("index.html");
const router = read("shared/router.js");
const adminSource = read("shared/admin-center.js");
const adminCss = read("shared/admin-center.css");
const utilsSource = read("shared/saas-utils.js");
const serviceSource = read("shared/saas-service.js");
const telemetrySource = read("shared/telemetry-service.js");
const migration = read("supabase/migrations/20260713000200_saas_admin_foundation.sql");
const pgtap = read("supabase/tests/saas_admin_foundation.sql");

function loadUtils() {
  const sandbox = { Intl, Date, Map, Set, BigInt, Number, Object, String, TypeError, RangeError };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(utilsSource, sandbox, { filename: "shared/saas-utils.js" });
  return sandbox.SuiteVetSaasUtils;
}

const utils = loadUtils();

test("la ruta administrativa tiene shell propio y nueve secciones reales", () => {
  assert.match(index, /id="view-admin"/);
  assert.match(index, />Centro de Control Suite Vet</);
  ["dashboard", "users", "plans", "payments", "usage", "feedback", "activity", "settings", "security"].forEach((section) => {
    assert.match(index, new RegExp(`data-admin-section="${section}"`));
    assert.match(index, new RegExp(`data-admin-panel="${section}"`));
  });
  assert.match(index, /data-account-view="admin" id="sv-admin-menu-item" hidden/);
  assert.equal((index.match(/shared\/admin-center\.js/g) || []).length, 1);
});

test("#/admin y el panel legacy se resuelven al Centro de Control sin bucle", () => {
  assert.match(router, /hash \|\| ""\)\.toLowerCase\(\) === "#\/admin"/);
  assert.match(router, /viewName === "feedback-admin" && viewExists\("admin"\)/);
  assert.match(router, /url\.hash = "\/admin"/);
  assert.doesNotMatch(adminSource, /location\.(?:assign|replace)/);
});

test("conversión monetaria usa strings y centavos exactos", () => {
  assert.equal(utils.parseDecimalToCents("10.00"), 1000);
  assert.equal(utils.parseDecimalToCents("0,10"), 10);
  assert.equal(utils.parseDecimalToCents("123456.78"), 12345678);
  assert.throws(() => utils.parseDecimalToCents("1.001"), TypeError);
  assert.throws(() => utils.parseDecimalToCents("1e3"), TypeError);
  assert.match(utils.formatUsd(1000), /10[,.]00/);
});

test("dashboard vacío muestra ceros y no fabrica métricas", () => {
  const metrics = utils.computeDashboardMetrics({ accounts: [], subscriptions: [], plans: [], payments: [], usage: [], feedback: [] }, new Date("2026-07-13T12:00:00Z"));
  assert.deepEqual(JSON.parse(JSON.stringify(metrics)), {
    academicUsers: 0, newToday: 0, newWeek: 0, newMonth: 0, freeActive: 0, plusActive: 0,
    pendingFeedback: 0, pendingPayments: 0, incomeTodayCents: 0, incomeWeekCents: 0,
    incomeMonthCents: 0, incomeTotalCents: 0, activeToday: 0, activeWeek: 0, activeMonth: 0,
    moduleOpens: []
  });
  assert.doesNotMatch(adminSource, /Math\.random|demo|mockUser|fake/i);
});

test("Super Admin se excluye de clientes e ingresos solo incluye verified actual", () => {
  const snapshot = {
    accounts: [
      { user_id: "internal", role: "super_admin", auth_created_at: "2026-07-13T10:00:00Z" },
      { user_id: "student", role: "student", auth_created_at: "2026-07-13T10:00:00Z" }
    ],
    plans: [{ id: "free", slug: "free" }],
    subscriptions: [{ user_id: "student", plan_id: "free", status: "active" }],
    payments: [
      { status: "verified", amount_cents: 1000, verified_at: "2026-07-13T11:00:00Z" },
      { status: "pending", amount_cents: 5000, verified_at: null },
      { status: "refunded", amount_cents: 9000, verified_at: "2026-07-13T11:00:00Z" }
    ],
    usage: [], feedback: []
  };
  const metrics = utils.computeDashboardMetrics(snapshot, new Date("2026-07-13T12:00:00Z"));
  assert.equal(metrics.academicUsers, 1);
  assert.equal(metrics.freeActive, 1);
  assert.equal(metrics.incomeTotalCents, 1000);
});

test("migración SaaS es incremental, usa RLS y mantiene Plus sin precio", () => {
  ["account_directory", "plans", "plan_entitlements", "subscriptions", "payments", "usage_events", "audit_events", "saas_settings"].forEach((table) => {
    assert.match(migration, new RegExp(`create table public\\.${table}`));
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
  });
  assert.match(migration, /'plus'.*'Plus'.*null, 'none', true, true, false/s);
  assert.match(migration, /amount_cents bigint not null/);
  assert.match(migration, /price_cents bigint/);
  assert.doesNotMatch(migration, /\b(?:float|real|double precision)\b/i);
  assert.match(migration, /language plpgsql\s+security invoker[\s\S]*?assign_user_plan|assign_user_plan[\s\S]*?security invoker/i);
  assert.doesNotMatch(migration, /grant execute on function private\.has_role/i);
  assert.doesNotMatch(migration, /\bCASCADE\b|disable row level security/i);
});

test("pagos, telemetría y auditoría aplican contratos seguros", () => {
  assert.match(migration, /status in \('pending', 'verified', 'rejected', 'refunded'\)/);
  assert.match(migration, /where status = 'verified'/);
  assert.match(migration, /new payments must start pending/);
  assert.match(migration, /usage_events_frontend_dedupe_idx/);
  assert.match(migration, /'login', 'module_open', 'plan_page_open', 'feedback_submit', 'academic_navigation'/);
  assert.match(migration, /revoke all on table public\.audit_events/);
  assert.doesNotMatch(migration, /grant insert[^;]*audit_events/i);
  assert.match(migration, /octet_length\(metadata::text\) <= 2048/);
});

test("pgTAP cubre 50 contratos y dos identidades temporales con rollback", () => {
  assert.match(pgtap, /select plan\(50\)/);
  assert.equal((pgtap.match(/@example\.test/g) || []).length, 2);
  assert.equal((pgtap.match(/insert into auth\.users/gi) || []).length, 1);
  assert.match(pgtap, /student cannot assign a plan/);
  assert.match(pgtap, /Super Admin has no active commercial subscription/);
  assert.match(pgtap, /refunded payment no longer counts as verified income/);
  assert.match(pgtap, /rollback;\s*$/);
});

test("render administrativo y CSV usan texto seguro, no HTML remoto", () => {
  assert.doesNotMatch(adminSource, /innerHTML|insertAdjacentHTML|outerHTML/);
  assert.match(adminSource, /element\.textContent = String\(text\)/);
  assert.match(adminSource, /paymentsCsv/);
  assert.equal(utils.safeCsvCell("=IMPORTXML('x')"), '"\'=IMPORTXML(\'x\')"');
  assert.match(serviceSource, /client\.rpc\("assign_user_plan"/);
  assert.doesNotMatch(serviceSource, /service_role|auth\.users|raw_user_meta_data/);
});

test("telemetría espera sesión, minimiza metadata y nunca bloquea navegación", () => {
  assert.match(telemetrySource, /if \(!state\.ready \|\| !state\.user\?\.id/);
  assert.match(telemetrySource, /METADATA_KEYS = new Set\(\["source", "viewport", "plan_slug"\]\)/);
  assert.doesNotMatch(telemetrySource, /patient|diagnos|dose|password|token|location\.href/i);
  assert.match(telemetrySource, /catch \(_error\) \{\s*return false;/);
  assert.doesNotMatch(telemetrySource, /console\.(?:error|warn)/);
});

test("diseño administrativo cubre drawer, foco, targets y movimiento reducido", () => {
  assert.match(adminCss, /@media screen and \(max-width: 900px\)/);
  assert.match(adminCss, /@media screen and \(max-width: 640px\)/);
  assert.match(adminCss, /@media screen and \(max-width: 390px\)/);
  assert.match(adminCss, /min-height: 44px/);
  assert.match(adminCss, /:focus-visible/);
  assert.match(adminCss, /prefers-reduced-motion: reduce/);
  assert.match(adminSource, /event\.key === "Escape"/);
  assert.match(adminSource, /trapFocus/);
  assert.match(index, /aria-expanded="false" aria-controls="sv-admin-sidebar"/);
});

async function createAdminWindow({ admin, loadError = null }) {
  const { Window } = await import("happy-dom");
  const window = new Window({ url: "http://localhost/#/admin" });
  window.document.body.innerHTML = `
    <section id="view-admin">
      <div id="sv-admin-access"><h2 id="sv-admin-center-title"></h2><p id="sv-admin-access-message"></p><button id="sv-admin-signin" hidden></button></div>
      <div id="sv-admin-app" hidden><main id="sv-admin-main" tabindex="-1"><h1 id="sv-admin-section-title"></h1><p id="sv-admin-global-status"></p><section data-admin-panel="dashboard"><div id="sv-admin-dashboard-metrics"></div><div id="sv-admin-top-modules"></div></section></main></div>
      <div id="sv-admin-dialog"><div class="sv-admin-dialog" tabindex="-1"><h2 id="sv-admin-dialog-title"></h2><div id="sv-admin-dialog-body"></div><footer id="sv-admin-dialog-actions"></footer></div></div>
    </section>`;
  window.SuiteVet = { currentView: "admin", showView(view) { this.currentView = view; } };
  window.SuiteVetAuth = {
    subscribeToAuthChanges() {},
    async initialize() { return { configured: true }; },
    async getCurrentUser() { return { id: admin ? "admin" : "student", email: `${admin ? "admin" : "student"}@example.test` }; },
    async signOut() {}
  };
  window.SuiteVetUserData = { async isSuperAdmin() { return admin; }, SUBJECTS: {} };
  window.SuiteVetSaasUtils = utils;
  window.SuiteVetSaas = {
    async loadAdminSnapshot() {
      if (loadError) throw loadError;
      return { accounts: [], profiles: [], plans: [], entitlements: [], subscriptions: [], payments: [], usage: [], feedback: [], audit: [], settings: [] };
    }
  };
  window.eval(adminSource);
  await window.happyDOM.whenAsyncComplete();
  await Promise.resolve();
  return window;
}

test("estudiante recibe acceso restringido y no ve el shell", async () => {
  const window = await createAdminWindow({ admin: false });
  assert.equal(window.document.getElementById("sv-admin-app").hidden, true);
  assert.match(window.document.getElementById("sv-admin-center-title").textContent, /Acceso restringido/);
  window.close();
});

test("Super Admin ve shell real y dashboard con ceros", async () => {
  const window = await createAdminWindow({ admin: true });
  assert.equal(window.document.getElementById("sv-admin-app").hidden, false);
  assert.ok(window.document.querySelectorAll(".sv-admin-metric").length >= 15);
  assert.match(window.document.getElementById("sv-admin-dashboard-metrics").textContent, /Usuarios académicos0/);
  window.close();
});

test("sesión expirada muestra estado controlado sin stack trace", async () => {
  const window = await createAdminWindow({ admin: true, loadError: { code: "SESSION_EXPIRED", message: "jwt details" } });
  assert.match(window.document.getElementById("sv-admin-center-title").textContent, /Sesión expirada/);
  assert.doesNotMatch(window.document.body.textContent, /jwt details|stack/i);
  window.close();
});
