const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const index = read("index.html");
const ui = read("shared/auth-ui.js");
const css = read("shared/auth.css");
const auth = read("shared/auth-service.js");
const data = read("shared/user-data-service.js");
const migration = read("supabase/migrations/20260713000100_auth_profile_feedback.sql");
const visualFixture = read("test/fixtures/auth-visual.html");

test("la SPA pública conserva sus vistas y añade cuenta sin bloquear inicio", () => {
  assert.match(index, /id="view-landing" class="sv-view sv-view-active"/);
  assert.match(index, /id="view-home" class="sv-view"/);
  assert.match(index, /id="sv-auth-open"[^>]+aria-label="Iniciar sesión"[^>]*>Iniciar sesión/);
  assert.match(index, /id="view-profile"/);
  assert.match(index, /id="view-feedback"/);
  assert.doesNotMatch(auth, /location\.assign|location\.replace/);
});

test("modal de acceso tiene labels, autocomplete, estado vivo y cierre accesible", () => {
  assert.match(index, /id="sv-auth-modal" class="sv-modal-overlay" aria-hidden="true"/);
  assert.match(index, /role="dialog" aria-modal="true" aria-labelledby="sv-auth-title"/);
  assert.match(index, /autocomplete="email"/);
  assert.match(index, /autocomplete="current-password"/);
  assert.match(index, /autocomplete="new-password"/);
  assert.match(index, /id="sv-auth-message"[^>]*role="status" aria-live="polite"/);
  assert.match(index, /data-auth-close aria-label="Cerrar"/);
});

test("contraseña aplica las cinco reglas y confirmación coincidente", () => {
  assert.match(ui, /value\.length >= 10/);
  assert.match(ui, /\[a-z\]/);
  assert.match(ui, /\[A-Z\]/);
  assert.match(ui, /\[0-9\]/);
  assert.match(ui, /\[\^A-Za-z0-9\]/);
  assert.match(ui, /password !== confirm/);
});

test("callback confirmado abre un estado controlado antes de limpiar la URL", () => {
  assert.match(ui, /snapshot\.event === "SIGNED_IN" && auth\(\)\.urlContainsSensitiveAuthState\(\)/);
  assert.match(ui, /openModal\("confirmed"\)/);
});

test("datos de usuario se renderizan con textContent y nunca con innerHTML", () => {
  assert.match(ui, /element\.textContent = String/);
  assert.match(ui, /response\.value = item\.response/);
  assert.doesNotMatch(ui, /innerHTML|insertAdjacentHTML|outerHTML/);
  assert.doesNotMatch(data, /innerHTML|insertAdjacentHTML|outerHTML/);
});

test("panel admin empieza oculto y depende del rol autoritativo", () => {
  assert.match(index, /id="sv-admin-menu-item" hidden/);
  assert.match(ui, /profile\.role !== "super_admin"/);
  assert.match(data, /from\("user_roles"\)/);
  assert.doesNotMatch(data, /user_metadata|app_metadata/);
});

test("interfaz responsive cubre breakpoints y targets táctiles", () => {
  assert.match(css, /min-height: 44px/);
  assert.match(css, /@media screen and \(max-width: 900px\)/);
  assert.match(css, /@media screen and \(max-width: 640px\)/);
  assert.match(css, /@media screen and \(max-width: 420px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("configuración y dependencia Supabase son únicas y públicas", () => {
  assert.match(index, /VITE_SUPABASE_URL/);
  assert.match(index, /VITE_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(index, /@supabase\/supabase-js@2\.110\.2/);
  assert.equal((index.match(/shared\/auth-service\.js/g) || []).length, 1);
  const clientSources = [index, ui, auth, data].join("\n");
  assert.doesNotMatch(clientSources, /supabasePublishableKey\s*:\s*["'](?:sb_secret_|eyJ)/);
  assert.doesNotMatch(clientSources, /VITE_(?:SERVICE_ROLE|SUPABASE_DB_PASSWORD)/);
});

test("migración activa RLS y mantiene originales inmutables", () => {
  assert.match(migration, /alter table public\.user_feedback enable row level security/);
  assert.match(migration, /grant insert \(subject, message, rating\)/);
  assert.match(migration, /grant update \(approved, response\)/);
  assert.match(migration, /feedback original fields are immutable/);
  assert.doesNotMatch(migration, /grant execute on function private\.has_role/);
  assert.doesNotMatch(migration, /service_role.*grant|grant.*service_role/i);
});

test("fixture visual usa datos locales y texto malicioso escapado", () => {
  assert.match(visualFixture, /fixture@example\.test/);
  assert.match(visualFixture, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(visualFixture, /VITE_|sb_publishable_|service_role/);
});
