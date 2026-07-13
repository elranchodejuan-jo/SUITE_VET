"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const authUiSource = read("shared/auth-ui.js");
const authCss = read("shared/auth.css");
const index = read("index.html");
const layoutCss = read("shared/layout.css");
const responsiveCss = read("shared/responsive.css");
const router = read("shared/router.js");

function feedbackMarkup() {
  return `
    <form id="sv-feedback-form">
      <select id="sv-feedback-subject"><option value="comment" selected>Comentario</option><option value="recommendation">Recomendación</option></select>
      <textarea id="sv-feedback-message">Comentario de prueba válido.</textarea>
      <input type="radio" name="rating" value="5" checked />
      <p id="sv-feedback-status"></p>
      <button type="submit">Enviar comentario</button>
    </form>
    <section class="sv-own-feedback">
      <p id="sv-own-feedback-status"></p><div id="sv-own-feedback-list"></div>
    </section>
    <section id="view-feedback-admin" hidden>
      <select id="sv-admin-subject"><option value="">Todos</option></select>
      <select id="sv-admin-rating"><option value="">Todas</option></select>
      <button id="sv-admin-refresh" type="button">Actualizar comentarios</button>
      <p id="sv-admin-status"></p><p id="sv-admin-last-refresh"></p>
      <div id="sv-admin-feedback-list"></div>
    </section>`;
}

async function createFeedbackUi(options = {}) {
  const { Window } = await import("happy-dom");
  const window = new Window({ url: "http://localhost/" });
  const user = options.user === null ? null : (options.user || { id: "student-1", email: "student@example.test" });
  const profile = options.profile || { display_name: "Estudiante", username: "estudiante", role: "student", complete: true, missingFields: [] };
  const calls = { submit: 0, own: 0, admin: 0, approval: 0, response: 0 };
  window.document.body.innerHTML = feedbackMarkup();
  window.SuiteVet = {
    currentView: "landing",
    showView(view) {
      this.currentView = view;
      window.document.dispatchEvent(new window.CustomEvent("suitevet:viewchange", { detail: { view } }));
    }
  };
  window.SuiteVetAuth = {
    subscribeToAuthChanges() {},
    async initialize() { return { configured: true }; },
    async getSession() { return user ? { user } : null; }
  };
  window.SuiteVetUserData = {
    CAREERS: [],
    INSTITUTIONS: [],
    SEMESTERS: [],
    SUBJECTS: { comment: "Comentario", recommendation: "Recomendación", observed_error: "Error observado" },
    async loadProfile() { return profile; },
    async submitFeedback(payload) { calls.submit += 1; return options.submitFeedback ? options.submitFeedback(payload) : { id: "feedback-1", ...payload }; },
    async loadOwnFeedback() { calls.own += 1; return options.loadOwnFeedback ? options.loadOwnFeedback() : []; },
    async loadAdminFeedback(filters) { calls.admin += 1; return options.loadAdminFeedback ? options.loadAdminFeedback(filters) : []; },
    async updateFeedbackApproval(id, approved) { calls.approval += 1; return options.updateFeedbackApproval ? options.updateFeedbackApproval(id, approved) : { id, approved }; },
    async updateFeedbackResponse(id, response) { calls.response += 1; return options.updateFeedbackResponse ? options.updateFeedbackResponse(id, response) : { id, response }; }
  };
  window.eval(authUiSource);
  await window.happyDOM.whenAsyncComplete();
  return { window, calls };
}

async function settle(window) {
  await window.happyDOM.whenAsyncComplete();
  await Promise.resolve();
}

test("la referencia estable del formulario permite completar un envío después de await", async () => {
  let resolveInsert;
  const insertion = new Promise((resolve) => { resolveInsert = resolve; });
  const { window } = await createFeedbackUi({ submitFeedback: () => insertion });
  const form = window.document.getElementById("sv-feedback-form");

  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  resolveInsert({ id: "feedback-1" });
  await settle(window);

  assert.equal(window.document.getElementById("sv-feedback-status").textContent, "Tu comentario fue enviado correctamente.");
  assert.equal(window.document.getElementById("sv-feedback-message").value, "");
  assert.equal(window.document.querySelector("[name='rating']:checked"), null);
  assert.equal(form.getAttribute("aria-busy"), "false");
  window.close();
});

test("el fallo conserva asunto, mensaje y calificación sin éxito falso ni detalles técnicos", async () => {
  const { window } = await createFeedbackUi({ submitFeedback: async () => { throw new Error("Cannot read properties of null (reading 'reset')"); } });
  const form = window.document.getElementById("sv-feedback-form");
  form.querySelector("#sv-feedback-subject").value = "recommendation";

  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await settle(window);

  const status = window.document.getElementById("sv-feedback-status").textContent;
  assert.match(status, /No fue posible enviar el comentario/);
  assert.doesNotMatch(status, /reset|null|properties/i);
  assert.equal(window.document.getElementById("sv-feedback-subject").value, "recommendation");
  assert.equal(window.document.getElementById("sv-feedback-message").value, "Comentario de prueba válido.");
  assert.equal(window.document.querySelector("[name='rating']:checked").value, "5");
  assert.equal(window.document.querySelector("button[type='submit']").disabled, false);
  window.close();
});

test("el botón bloquea doble envío y vuelve a su etiqueta al terminar", async () => {
  let resolveInsert;
  const insertion = new Promise((resolve) => { resolveInsert = resolve; });
  const { window, calls } = await createFeedbackUi({ submitFeedback: () => insertion });
  const form = window.document.getElementById("sv-feedback-form");

  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  assert.equal(calls.submit, 1);
  assert.equal(window.document.querySelector("button[type='submit']").textContent, "Enviando…");
  assert.equal(window.document.querySelector("button[type='submit']").disabled, true);

  resolveInsert({ id: "feedback-2" });
  await settle(window);
  assert.equal(window.document.querySelector("button[type='submit']").textContent, "Enviar comentario");
  assert.equal(window.document.querySelector("button[type='submit']").disabled, false);
  window.close();
});

test("Mis comentarios se actualiza con registros propios y respuestas administrativas como texto", async () => {
  const ownRecord = {
    id: "mine-1", created_at: "2026-07-13T10:30:00.000Z", subject: "comment",
    message: "<img src=x onerror=alert(1)>", rating: 4, approved: false, response: "Respuesta para el estudiante"
  };
  const { window, calls } = await createFeedbackUi({ loadOwnFeedback: async () => [ownRecord] });
  window.SuiteVet.showView("feedback");
  await settle(window);

  const card = window.document.querySelector(".sv-own-feedback-card");
  assert.equal(calls.own, 1);
  assert.match(card.textContent, /Comentario|Estado: Pendiente|Respuesta administrativa/);
  assert.match(card.textContent, /<img src=x onerror=alert\(1\)>/);
  assert.equal(card.querySelector("img"), null);
  assert.equal(card.querySelector("input, textarea, button"), null);
  window.close();
});

test("el panel Super Admin muestra texto completo y actualiza al entrar, enfocar o volver visible sin listeners duplicados", async () => {
  const item = {
    id: "admin-1", created_at: "2026-07-13T10:30:00.000Z", subject: "recommendation",
    message: "Texto completo del comentario enviado por el usuario.", rating: 5, approved: false, response: null,
    author: { display_name: "María Pérez", username: "maria_perez" }
  };
  const { window, calls } = await createFeedbackUi({
    profile: { display_name: "Admin", username: "admin", role: "super_admin", complete: true, missingFields: [] },
    loadAdminFeedback: async () => [item]
  });

  window.SuiteVet.showView("feedback-admin");
  await settle(window);
  const card = window.document.querySelector(".sv-admin-feedback-card");
  assert.equal(calls.admin, 1);
  assert.match(card.textContent, /María Pérez|@maria_perez|Asunto: Recomendación|Comentario del usuario|Texto completo/);
  assert.match(window.document.getElementById("sv-admin-last-refresh").textContent, /Última actualización/);

  window.document.getElementById("sv-admin-refresh").click();
  await settle(window);
  assert.equal(calls.admin, 2);
  window.dispatchEvent(new window.Event("focus"));
  await settle(window);
  assert.equal(calls.admin, 3);
  Object.defineProperty(window.document, "visibilityState", { configurable: true, value: "visible" });
  window.document.dispatchEvent(new window.Event("visibilitychange"));
  await settle(window);
  assert.equal(calls.admin, 4);
  window.SuiteVet.showView("home");
  await settle(window);
  window.dispatchEvent(new window.Event("focus"));
  await settle(window);
  assert.equal(calls.admin, 4);
  window.SuiteVet.showView("feedback-admin");
  await settle(window);
  window.dispatchEvent(new window.Event("focus"));
  await settle(window);
  assert.equal(calls.admin, 6);
  window.close();
});

test("si falla la respuesta administrativa, su texto queda disponible para reintentar", async () => {
  const item = {
    id: "admin-2", created_at: "2026-07-13T10:30:00.000Z", subject: "comment",
    message: "Comentario original", rating: 3, approved: false, response: null,
    author: { display_name: "Estudiante", username: "estudiante" }
  };
  const { window } = await createFeedbackUi({
    profile: { display_name: "Admin", username: "admin", role: "super_admin", complete: true, missingFields: [] },
    loadAdminFeedback: async () => [item],
    updateFeedbackResponse: async () => { throw new Error("internal persistence failure"); }
  });
  window.SuiteVet.showView("feedback-admin");
  await settle(window);
  const response = window.document.querySelector(".sv-admin-feedback-card textarea");
  response.value = "Respuesta que debe conservarse";
  window.document.querySelector(".sv-admin-feedback-card button").click();
  await settle(window);
  assert.equal(response.value, "Respuesta que debe conservarse");
  assert.match(window.document.getElementById("sv-admin-status").textContent, /No fue posible guardar la respuesta/);
  assert.doesNotMatch(window.document.getElementById("sv-admin-status").textContent, /internal/i);
  window.close();
});

test("el contrato visual mantiene controles administrativos ocultos al estudiante y un shell móvil compacto", () => {
  assert.doesNotMatch(index, /id="view-feedback-admin"/);
  assert.match(index, /id="view-admin"/);
  assert.match(index, /data-admin-panel="feedback"/);
  assert.match(index, /id="sv-own-feedback-list"/);
  assert.match(index, /Enviar comentario/);
  assert.match(index, /id="sv-drawer-feedback"/);
  assert.match(index, /id="sv-drawer-search"/);
  assert.match(index, /<span><\/span><span><\/span><span><\/span>/);
  assert.match(authUiSource, /const form = event\.currentTarget;/);
  assert.doesNotMatch(authUiSource, /await[\s\S]{0,600}event\.currentTarget\.reset/);
  assert.match(authUiSource, /root\.addEventListener\("focus", refreshAdminWhenActive\)/);
  assert.match(authUiSource, /document\.removeEventListener\("visibilitychange", handleAdminVisibilityChange\)/);
  assert.match(router, /sv-drawer-search/);
  assert.match(layoutCss, /\.sv-mobile-drawer-actions\s*\{\s*display: none/);
  assert.match(responsiveCss, /grid-template-columns: var\(--sv-topbar-control\) max-content minmax\(0, 1fr\)/);
  assert.match(responsiveCss, /#sv-feedback-toggle,[\s\S]*?\.sv-search-toggle[\s\S]*?display: none/);
  assert.match(responsiveCss, /\.sv-topbar-brand-context\s*\{\s*display: none/);
  assert.match(authCss, /#sv-feedback-form \.sv-rating-options\s*\{\s*display: grid/);
  assert.match(authCss, /#sv-feedback-form textarea\s*\{\s*min-height: 8rem/);
});
