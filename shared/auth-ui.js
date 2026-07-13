// =============================================================================
// SUITE VET - Interfaz accesible de autenticacion, perfil y comentarios.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetAuthUI) return;

  const state = {
    mode: "signin",
    user: null,
    profile: null,
    pendingView: null,
    busy: false,
    initialized: false
  };

  const byId = (id) => document.getElementById(id);
  const auth = () => root.SuiteVetAuth;
  const data = () => root.SuiteVetUserData;

  function setText(element, value) {
    if (element) element.textContent = String(value || "");
  }

  function setStatus(id, message, kind = "") {
    const target = byId(id);
    if (!target) return;
    setText(target, message);
    target.dataset.kind = kind;
  }

  function openModal(mode = "signin") {
    setMode(mode);
    const modal = byId("sv-auth-modal");
    modal?.classList.add("sv-modal-active");
    modal?.setAttribute("aria-hidden", "false");
    root.requestAnimationFrame?.(() => {
      const first = mode === "recovery" ? byId("sv-auth-password") : byId("sv-auth-email");
      first?.focus({ preventScroll: true });
    });
  }

  function closeModal() {
    const modal = byId("sv-auth-modal");
    modal?.classList.remove("sv-modal-active");
    modal?.setAttribute("aria-hidden", "true");
    setStatus("sv-auth-message", "");
  }

  function passwordChecks(password) {
    const value = String(password || "");
    return {
      length: value.length >= 10,
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value)
    };
  }

  function validPassword(password) {
    return Object.values(passwordChecks(password)).every(Boolean);
  }

  function updatePasswordRules() {
    const checks = passwordChecks(byId("sv-auth-password")?.value);
    Object.entries(checks).forEach(([rule, valid]) => {
      const item = document.querySelector(`[data-password-rule="${rule}"]`);
      item?.classList.toggle("is-valid", valid);
    });
  }

  function setMode(mode) {
    const allowed = new Set(["signin", "signup", "forgot", "recovery", "check-email", "confirmed"]);
    state.mode = allowed.has(mode) ? mode : "signin";
    const titles = {
      signin: "Iniciar sesión",
      signup: "Crear cuenta",
      forgot: "Recuperar contraseña",
      recovery: "Establecer nueva contraseña",
      "check-email": "Revisa tu correo",
      confirmed: "Correo confirmado"
    };
    const submits = {
      signin: "Iniciar sesión",
      signup: "Crear cuenta",
      forgot: "Enviar instrucciones",
      recovery: "Actualizar contraseña",
      "check-email": "Listo",
      confirmed: "Continuar"
    };
    setText(byId("sv-auth-title"), titles[state.mode]);
    setText(byId("sv-auth-submit"), submits[state.mode]);
    setStatus("sv-auth-message", "");

    const emailVisible = !["recovery", "check-email", "confirmed"].includes(state.mode);
    const passwordVisible = ["signin", "signup", "recovery"].includes(state.mode);
    const confirmVisible = ["signup", "recovery"].includes(state.mode);
    const rulesVisible = confirmVisible;
    const form = byId("sv-auth-form");
    const email = byId("sv-auth-email");
    const password = byId("sv-auth-password");
    const confirm = byId("sv-auth-password-confirm");
    email?.closest("label")?.toggleAttribute("hidden", !emailVisible);
    byId("sv-auth-password-label")?.toggleAttribute("hidden", !passwordVisible);
    byId("sv-auth-password-confirm-label")?.toggleAttribute("hidden", !confirmVisible);
    byId("sv-password-rules")?.toggleAttribute("hidden", !rulesVisible);
    byId("sv-auth-terms-label")?.toggleAttribute("hidden", state.mode !== "signup");
    if (email) email.required = emailVisible;
    if (password) {
      password.required = passwordVisible;
      password.autocomplete = state.mode === "signin" ? "current-password" : "new-password";
    }
    if (confirm) confirm.required = confirmVisible;
    form?.toggleAttribute("data-message-only", ["check-email", "confirmed"].includes(state.mode));
    document.querySelectorAll("[data-auth-mode]").forEach((button) => {
      button.hidden = button.dataset.authMode === state.mode ||
        (state.mode === "signin" && button.dataset.authMode === "signin") ||
        (["check-email", "confirmed", "recovery"].includes(state.mode) && button.dataset.authMode !== "signin");
    });
    byId("sv-auth-resend")?.toggleAttribute("hidden", state.mode !== "check-email");
    if (state.mode === "check-email") setStatus("sv-auth-message", "Enviamos un enlace de confirmación. Ábrelo desde este dispositivo; el reenvío solo ocurre si lo solicitas.", "success");
    if (state.mode === "confirmed") setStatus("sv-auth-message", "Tu correo fue confirmado. Ya puedes iniciar sesión.", "success");
    updatePasswordRules();
  }

  function setBusy(busy) {
    state.busy = busy;
    const submit = byId("sv-auth-submit");
    if (submit) submit.disabled = busy;
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    if (state.busy) return;
    if (["check-email", "confirmed"].includes(state.mode)) {
      setMode("signin");
      return;
    }
    const email = byId("sv-auth-email")?.value.trim() || "";
    const password = byId("sv-auth-password")?.value || "";
    const confirm = byId("sv-auth-password-confirm")?.value || "";
    if (["signup", "recovery"].includes(state.mode)) {
      if (!validPassword(password)) return setStatus("sv-auth-message", "La contraseña aún no cumple todos los requisitos.", "error");
      if (password !== confirm) return setStatus("sv-auth-message", "Las contraseñas no coinciden.", "error");
      if (state.mode === "signup" && !byId("sv-auth-terms")?.checked) return setStatus("sv-auth-message", "Debes aceptar los Términos de uso y la Política de privacidad.", "error");
    }
    setBusy(true);
    setStatus("sv-auth-message", "Procesando…");
    try {
      if (state.mode === "signup") {
        const result = await auth().signUp({ email, password });
        if (result.confirmationPending) setMode("check-email");
        else closeModal();
      } else if (state.mode === "signin") {
        await auth().signIn({ email, password });
        closeModal();
      } else if (state.mode === "forgot") {
        await auth().requestPasswordReset(email);
        setStatus("sv-auth-message", "Si el correo corresponde a una cuenta, recibirás instrucciones para continuar.", "success");
      } else if (state.mode === "recovery") {
        await auth().updatePassword(password);
        setMode("signin");
        setStatus("sv-auth-message", "La contraseña fue actualizada. Ya puedes continuar.", "success");
      }
    } catch (error) {
      setStatus("sv-auth-message", error?.message || "No fue posible completar la operación.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function resendConfirmation() {
    if (state.busy) return;
    const email = byId("sv-auth-email")?.value.trim() || "";
    if (!email) return setStatus("sv-auth-message", "Escribe el correo usado para crear la cuenta.", "error");
    setBusy(true);
    try {
      await auth().resendConfirmation(email);
      setStatus("sv-auth-message", "Se solicitó un nuevo enlace. Revisa tu correo y espera antes de volver a intentarlo.", "success");
    } catch (error) {
      setStatus("sv-auth-message", error?.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function fillSelect(id, values) {
    const select = byId(id);
    if (!select || select.options.length) return;
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Selecciona una opción";
    select.append(empty);
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }

  function profileValue(profile, key) {
    return typeof profile?.[key] === "string" ? profile[key] : "";
  }

  function renderProfile(profile) {
    state.profile = profile;
    const fields = {
      "sv-profile-first-name": "first_name", "sv-profile-last-name": "last_name",
      "sv-profile-username": "username", "sv-profile-career": "career",
      "sv-profile-semester": "semester", "sv-profile-institution": "institution",
      "sv-profile-email": "email", "sv-profile-role": "role"
    };
    Object.entries(fields).forEach(([id, key]) => { const el = byId(id); if (el) el.value = profileValue(profile, key); });
    byId("sv-profile-incomplete")?.toggleAttribute("hidden", profile.complete);
    (profile.missingFields || []).forEach((field) => document.querySelector(`[name="${field}"]`)?.setAttribute("aria-invalid", "true"));
  }

  async function loadProfile({ welcome = false } = {}) {
    if (!state.user) return;
    setStatus("sv-profile-status", "Cargando…");
    try {
      const profile = await data().loadProfile();
      renderProfile(profile);
      setText(byId("sv-account-name"), profile.display_name || profile.username || state.user.email || "Cuenta");
      setText(byId("sv-account-avatar"), (profile.display_name || profile.username || state.user.email || "U").charAt(0).toUpperCase());
      byId("sv-admin-menu-item")?.toggleAttribute("hidden", profile.role !== "super_admin");
      setStatus("sv-profile-status", welcome && !profile.complete ? "Completa tu perfil cuando lo desees." : "");
    } catch (error) {
      setStatus("sv-profile-status", error?.message || "No fue posible cargar el perfil.", "error");
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setStatus("sv-profile-status", "Guardando…");
    document.querySelectorAll("#sv-profile-form [aria-invalid]").forEach((node) => node.removeAttribute("aria-invalid"));
    try {
      await data().updateProfile({
        first_name: byId("sv-profile-first-name")?.value,
        last_name: byId("sv-profile-last-name")?.value,
        username: byId("sv-profile-username")?.value,
        career: byId("sv-profile-career")?.value,
        semester: byId("sv-profile-semester")?.value,
        institution: byId("sv-profile-institution")?.value
      });
      await loadProfile();
      setStatus("sv-profile-status", "Perfil guardado correctamente.", "success");
    } catch (error) {
      Object.keys(error?.errors || {}).forEach((field) => document.querySelector(`#sv-profile-form [name="${field}"]`)?.setAttribute("aria-invalid", "true"));
      setStatus("sv-profile-status", error?.message || "No fue posible guardar el perfil.", "error");
    }
  }

  async function submitFeedback(event) {
    event.preventDefault();
    setStatus("sv-feedback-status", "Enviando…");
    try {
      await data().submitFeedback({
        subject: byId("sv-feedback-subject")?.value,
        message: byId("sv-feedback-message")?.value,
        rating: document.querySelector("#sv-feedback-form [name='rating']:checked")?.value
      });
      event.currentTarget.reset();
      setStatus("sv-feedback-status", "Tu comentario fue enviado correctamente.", "success");
    } catch (error) {
      setStatus("sv-feedback-status", error?.message || "No fue posible enviar el comentario.", "error");
    }
  }

  function appendText(parent, tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = String(text || "");
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  function renderAdminFeedback(items) {
    const list = byId("sv-admin-feedback-list");
    if (!list) return;
    list.replaceChildren();
    if (!items.length) return appendText(list, "p", "No hay comentarios para estos filtros.", "sv-auth-empty");
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "sv-auth-card sv-admin-feedback-card";
      appendText(card, "p", new Date(item.created_at).toLocaleString("es-EC"), "sv-admin-meta");
      appendText(card, "h3", `${item.author?.display_name || item.author?.username || "Usuario"} · ${data().SUBJECTS[item.subject] || item.subject}`);
      appendText(card, "p", item.message, "sv-admin-message");
      appendText(card, "p", `${item.rating} de 5 estrellas`, "sv-admin-rating");
      const approved = document.createElement("label");
      approved.className = "sv-admin-approved";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(item.approved);
      approved.append(checkbox, document.createTextNode(" Aprobado"));
      checkbox.addEventListener("change", async () => {
        checkbox.disabled = true;
        try { await data().updateFeedbackApproval(item.id, checkbox.checked); }
        catch (error) { checkbox.checked = !checkbox.checked; setStatus("sv-admin-status", error?.message, "error"); }
        finally { checkbox.disabled = false; }
      });
      card.append(approved);
      const responseLabel = appendText(card, "label", "Respuesta administrativa");
      const response = document.createElement("textarea");
      response.maxLength = 2000;
      response.rows = 3;
      response.value = item.response || "";
      responseLabel.append(response);
      const save = appendText(card, "button", "Guardar respuesta", "sv-btn sv-btn-secondary");
      save.type = "button";
      save.addEventListener("click", async () => {
        save.disabled = true;
        try { await data().updateFeedbackResponse(item.id, response.value); setStatus("sv-admin-status", "Respuesta guardada.", "success"); }
        catch (error) { setStatus("sv-admin-status", error?.message, "error"); }
        finally { save.disabled = false; }
      });
      list.append(card);
    });
  }

  async function loadAdminFeedback() {
    setStatus("sv-admin-status", "Cargando…");
    try {
      const items = await data().loadAdminFeedback({ subject: byId("sv-admin-subject")?.value, rating: byId("sv-admin-rating")?.value });
      renderAdminFeedback(items);
      setStatus("sv-admin-status", "");
    } catch (error) {
      renderAdminFeedback([]);
      setStatus("sv-admin-status", error?.message || "No fue posible cargar los comentarios.", "error");
    }
  }

  function showProtectedView(view) {
    if (!state.user) {
      state.pendingView = view;
      openModal("signin");
      return false;
    }
    root.SuiteVet?.showView?.(view);
    return true;
  }

  async function handleAuthState(snapshot) {
    const confirmedCallback = snapshot.event === "SIGNED_IN" && auth().urlContainsSensitiveAuthState();
    state.user = snapshot.user || null;
    byId("sv-auth-open")?.toggleAttribute("hidden", Boolean(state.user));
    byId("sv-account-button")?.toggleAttribute("hidden", !state.user);
    if (!state.user) {
      state.profile = null;
      byId("sv-account-menu")?.toggleAttribute("hidden", true);
      byId("sv-admin-menu-item")?.toggleAttribute("hidden", true);
      setText(byId("sv-account-name"), "Cuenta");
    } else {
      await loadProfile({ welcome: snapshot.event === "SIGNED_IN" });
      if (state.pendingView) {
        const target = state.pendingView;
        state.pendingView = null;
        root.SuiteVet?.showView?.(target);
      }
      if (confirmedCallback) openModal("confirmed");
    }
    if (snapshot.event === "PASSWORD_RECOVERY") openModal("recovery");
  }

  function bindEvents() {
    byId("sv-auth-open")?.addEventListener("click", () => openModal("signin"));
    document.querySelectorAll("[data-auth-close]").forEach((button) => button.addEventListener("click", closeModal));
    document.querySelectorAll("[data-auth-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.authMode)));
    byId("sv-auth-form")?.addEventListener("submit", handleAuthSubmit);
    byId("sv-auth-resend")?.addEventListener("click", resendConfirmation);
    byId("sv-auth-password")?.addEventListener("input", updatePasswordRules);
    byId("sv-password-toggle")?.addEventListener("click", () => {
      const password = byId("sv-auth-password");
      if (!password) return;
      const show = password.type === "password";
      password.type = show ? "text" : "password";
      setText(byId("sv-password-toggle"), show ? "Ocultar" : "Mostrar");
      byId("sv-password-toggle")?.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
    });
    byId("sv-feedback-toggle")?.addEventListener("click", () => showProtectedView("feedback"));
    byId("sv-account-button")?.addEventListener("click", () => {
      const menu = byId("sv-account-menu");
      if (!menu) return;
      const open = menu.hidden;
      menu.hidden = !open;
      byId("sv-account-button")?.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll("[data-account-view]").forEach((button) => button.addEventListener("click", () => {
      byId("sv-account-menu").hidden = true;
      byId("sv-account-button")?.setAttribute("aria-expanded", "false");
      showProtectedView(button.dataset.accountView);
    }));
    byId("sv-sign-out")?.addEventListener("click", async () => {
      byId("sv-account-menu").hidden = true;
      try { await auth().signOut(); root.SuiteVet?.showView?.("home"); }
      catch (error) { openModal("signin"); setStatus("sv-auth-message", error?.message, "error"); }
    });
    byId("sv-profile-form")?.addEventListener("submit", saveProfile);
    byId("sv-feedback-form")?.addEventListener("submit", submitFeedback);
    byId("sv-admin-refresh")?.addEventListener("click", loadAdminFeedback);
    document.addEventListener("suitevet:viewchange", (event) => {
      if (event.detail?.view === "profile") loadProfile();
      if (event.detail?.view === "feedback-admin") loadAdminFeedback();
    });
    document.addEventListener("click", (event) => {
      const shell = event.target instanceof Element ? event.target.closest(".sv-account-shell") : null;
      if (!shell && byId("sv-account-menu")) {
        byId("sv-account-menu").hidden = true;
        byId("sv-account-button")?.setAttribute("aria-expanded", "false");
      }
    });
  }

  async function initialize() {
    if (state.initialized) return;
    state.initialized = true;
    fillSelect("sv-profile-career", data().CAREERS);
    fillSelect("sv-profile-semester", data().SEMESTERS);
    fillSelect("sv-profile-institution", data().INSTITUTIONS);
    bindEvents();
    auth().subscribeToAuthChanges(handleAuthState);
    try {
      const status = await auth().initialize();
      if (!status.configured) {
        byId("sv-auth-config-message")?.toggleAttribute("hidden", false);
        return;
      }
      const session = await auth().getSession();
      await handleAuthState({ event: "INITIAL_SESSION", session, user: session?.user || null });
    } catch (error) {
      byId("sv-auth-config-message")?.toggleAttribute("hidden", false);
      setStatus("sv-auth-message", "El contenido público está disponible. Las funciones de cuenta requieren configuración del entorno.");
    }
  }

  root.SuiteVetAuthUI = Object.freeze({ initialize, openModal, setMode, showProtectedView, validPassword });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})(window);
