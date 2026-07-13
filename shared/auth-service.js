// =============================================================================
// SUITE VET - Auth frontend centralizado sobre @supabase/supabase-js v2.
// La biblioteca oficial administra la persistencia; este archivo nunca guarda tokens.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetAuth) return;

  const PROD_ORIGIN = "https://elranchodejuan-jo.github.io";
  const PROD_PATH = "/SUITE_VET/";
  const DEV_ORIGINS = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]);
  const AUTH_EVENTS = new Set([
    "INITIAL_SESSION",
    "SIGNED_IN",
    "SIGNED_OUT",
    "TOKEN_REFRESHED",
    "USER_UPDATED",
    "PASSWORD_RECOVERY"
  ]);
  const SENSITIVE_QUERY_KEYS = new Set([
    "code",
    "token_hash",
    "type",
    "error",
    "error_code",
    "error_description"
  ]);
  const SENSITIVE_HASH_KEYS = /(?:^|[&#])(access_token|refresh_token|token_type|expires_in|type|error|error_code|error_description)=/i;

  const state = {
    client: null,
    configured: false,
    configurationError: null,
    initializePromise: null,
    authSubscription: null,
    listeners: new Set(),
    session: null,
    recoveryMode: false,
    initialNotified: false,
    disposed: false
  };

  class SuiteVetAuthError extends Error {
    constructor(message, details = {}) {
      super(message);
      this.name = "SuiteVetAuthError";
      this.code = details.code || "AUTH_ERROR";
      this.status = Number.isInteger(details.status) ? details.status : null;
      if (details.cause) this.cause = details.cause;
    }
  }

  function cleanString(value) {
    return String(value || "").trim();
  }

  function missingBuildValue(value) {
    const text = cleanString(value);
    return !text || /^%VITE_[A-Z0-9_]+%$/.test(text);
  }

  function normalizedConfiguration() {
    const config = root.SuiteVetPublicConfig || {};
    const supabaseUrl = cleanString(config.supabaseUrl);
    const publishableKey = cleanString(config.supabasePublishableKey);

    if (missingBuildValue(supabaseUrl) || missingBuildValue(publishableKey)) {
      throw new SuiteVetAuthError(
        "El acceso de usuarios todavía no está configurado en este entorno.",
        { code: "CONFIGURATION_MISSING" }
      );
    }

    let url;
    try {
      url = new URL(supabaseUrl);
    } catch (error) {
      throw new SuiteVetAuthError("La configuración de acceso no es válida.", {
        code: "CONFIGURATION_INVALID",
        cause: error
      });
    }

    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
      throw new SuiteVetAuthError("La configuración de acceso no es válida.", {
        code: "CONFIGURATION_INVALID"
      });
    }
    if (url.hostname !== "ibkbbzyrnaaqrjiidfjl.supabase.co") {
      throw new SuiteVetAuthError("La configuración no corresponde a Suite Vet.", {
        code: "PROJECT_MISMATCH"
      });
    }
    if (/^(?:sb_secret_|eyJ)/.test(publishableKey)) {
      throw new SuiteVetAuthError("La clave pública configurada no es válida.", {
        code: "UNSAFE_KEY"
      });
    }

    return Object.freeze({ supabaseUrl: url.origin, publishableKey });
  }

  function buildRedirectUrl(locationLike = root.location) {
    const origin = cleanString(locationLike?.origin);
    if (origin === PROD_ORIGIN) return `${PROD_ORIGIN}${PROD_PATH}`;
    if (DEV_ORIGINS.has(origin)) return `${origin}/`;
    throw new SuiteVetAuthError("Este origen no está autorizado para autenticación.", {
      code: "REDIRECT_NOT_ALLOWED"
    });
  }

  function urlContainsSensitiveAuthState(locationLike = root.location) {
    if (!locationLike) return false;
    const params = new URLSearchParams(locationLike.search || "");
    const sensitiveQuery = Array.from(params.keys()).some((key) => SENSITIVE_QUERY_KEYS.has(key));
    return sensitiveQuery || SENSITIVE_HASH_KEYS.test(locationLike.hash || "");
  }

  function cleanAuthCallbackUrl() {
    if (!root.location || !root.history?.replaceState || !urlContainsSensitiveAuthState()) return false;
    const url = new URL(root.location.href);
    Array.from(url.searchParams.keys()).forEach((key) => {
      if (SENSITIVE_QUERY_KEYS.has(key)) url.searchParams.delete(key);
    });
    if (SENSITIVE_HASH_KEYS.test(url.hash)) url.hash = "";
    const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
    root.history.replaceState(root.history.state, "", cleanUrl || "/");
    return true;
  }

  function publicError(error, fallbackCode = "AUTH_ERROR") {
    if (error instanceof SuiteVetAuthError) return error;
    const status = Number(error?.status) || null;
    const raw = cleanString(error?.message).toLowerCase();
    if (status === 429 || raw.includes("rate limit") || raw.includes("too many")) {
      return new SuiteVetAuthError(
        "Se alcanzó el límite temporal de solicitudes. Espera un momento antes de intentarlo otra vez.",
        { code: "RATE_LIMITED", status: 429, cause: error }
      );
    }
    if (raw.includes("email not confirmed")) {
      return new SuiteVetAuthError("Debes confirmar tu correo antes de iniciar sesión.", {
        code: "EMAIL_NOT_CONFIRMED",
        status,
        cause: error
      });
    }
    if (raw.includes("invalid login") || raw.includes("invalid credentials")) {
      return new SuiteVetAuthError("No fue posible iniciar sesión con esos datos.", {
        code: "INVALID_CREDENTIALS",
        status,
        cause: error
      });
    }
    if (raw.includes("fetch") || raw.includes("network") || error?.name === "TypeError") {
      return new SuiteVetAuthError("No fue posible conectar con el servicio de acceso.", {
        code: "NETWORK_ERROR",
        status,
        cause: error
      });
    }
    return new SuiteVetAuthError("No fue posible completar la operación de acceso.", {
      code: fallbackCode,
      status,
      cause: error
    });
  }

  function notify(event, session) {
    if (!AUTH_EVENTS.has(event)) return;
    if (event === "INITIAL_SESSION") {
      if (state.initialNotified) return;
      state.initialNotified = true;
    }
    state.session = session || null;
    if (event === "PASSWORD_RECOVERY") state.recoveryMode = Boolean(session);
    if (event === "SIGNED_OUT") state.recoveryMode = false;
    const snapshot = Object.freeze({
      event,
      session: state.session,
      user: state.session?.user || null,
      recoveryMode: state.recoveryMode
    });
    state.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (_error) {
        // Un consumidor defectuoso no debe romper la sesión ni revelar datos.
      }
    });
  }

  function ensureClient() {
    if (!state.client) {
      throw state.configurationError || new SuiteVetAuthError(
        "El acceso de usuarios todavía no está disponible.",
        { code: "NOT_INITIALIZED" }
      );
    }
    return state.client;
  }

  async function initialize() {
    if (state.initializePromise) return state.initializePromise;
    state.disposed = false;
    state.initializePromise = (async () => {
      let config;
      try {
        config = normalizedConfiguration();
        const factory = root.supabase?.createClient;
        if (typeof factory !== "function") {
          throw new SuiteVetAuthError("No fue posible cargar el cliente seguro de acceso.", {
            code: "CLIENT_UNAVAILABLE"
          });
        }
        state.client = factory(config.supabaseUrl, config.publishableKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce"
          }
        });
        state.configured = true;
        state.configurationError = null;

        const authResult = state.client.auth.onAuthStateChange((event, session) => {
          notify(event, session);
          if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
            root.setTimeout?.(cleanAuthCallbackUrl, 0);
          }
        });
        state.authSubscription = authResult?.data?.subscription || null;

        const { data, error } = await state.client.auth.getSession();
        if (error) throw error;
        state.session = data?.session || null;
        notify("INITIAL_SESSION", state.session);
        cleanAuthCallbackUrl();
        return getStatus();
      } catch (error) {
        const safeError = publicError(error, "INITIALIZATION_FAILED");
        state.configurationError = safeError;
        state.configured = false;
        cleanAuthCallbackUrl();
        return getStatus();
      }
    })();
    return state.initializePromise;
  }

  function getStatus() {
    return Object.freeze({
      configured: state.configured,
      initialized: Boolean(state.initializePromise),
      authenticated: Boolean(state.session?.user),
      recoveryMode: state.recoveryMode,
      error: state.configurationError
    });
  }

  async function getSession() {
    await initialize();
    return state.session;
  }

  async function getCurrentUser() {
    const session = await getSession();
    return session?.user || null;
  }

  async function signUp({ email, password }) {
    const client = ensureClient();
    try {
      const { data, error } = await client.auth.signUp({
        email: cleanString(email).toLowerCase(),
        password: String(password || ""),
        options: { emailRedirectTo: buildRedirectUrl() }
      });
      if (error) throw error;
      return Object.freeze({
        user: data?.user || null,
        session: data?.session || null,
        confirmationPending: Boolean(data?.user && !data?.session)
      });
    } catch (error) {
      throw publicError(error, "SIGN_UP_FAILED");
    }
  }

  async function signIn({ email, password }) {
    const client = ensureClient();
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanString(email).toLowerCase(),
        password: String(password || "")
      });
      if (error) throw error;
      state.session = data?.session || null;
      return data;
    } catch (error) {
      throw publicError(error, "SIGN_IN_FAILED");
    }
  }

  async function signOut() {
    const client = ensureClient();
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      state.session = null;
      state.recoveryMode = false;
    } catch (error) {
      throw publicError(error, "SIGN_OUT_FAILED");
    }
  }

  async function requestPasswordReset(email) {
    const client = ensureClient();
    try {
      const { error } = await client.auth.resetPasswordForEmail(
        cleanString(email).toLowerCase(),
        { redirectTo: buildRedirectUrl() }
      );
      if (error) throw error;
      return true;
    } catch (error) {
      throw publicError(error, "PASSWORD_RESET_REQUEST_FAILED");
    }
  }

  async function updatePassword(password) {
    const client = ensureClient();
    if (!state.recoveryMode || !state.session?.user) {
      throw new SuiteVetAuthError("La sesión de recuperación ya no es válida.", {
        code: "RECOVERY_SESSION_REQUIRED"
      });
    }
    try {
      const { data, error } = await client.auth.updateUser({
        password: String(password || "")
      });
      if (error) throw error;
      state.recoveryMode = false;
      return data;
    } catch (error) {
      throw publicError(error, "PASSWORD_UPDATE_FAILED");
    }
  }

  async function resendConfirmation(email) {
    const client = ensureClient();
    try {
      const { data, error } = await client.auth.resend({
        type: "signup",
        email: cleanString(email).toLowerCase(),
        options: { emailRedirectTo: buildRedirectUrl() }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw publicError(error, "RESEND_CONFIRMATION_FAILED");
    }
  }

  function subscribeToAuthChanges(listener) {
    if (typeof listener !== "function") throw new TypeError("listener debe ser una función");
    state.listeners.add(listener);
    return () => state.listeners.delete(listener);
  }

  function getClient() {
    return ensureClient();
  }

  function dispose() {
    state.authSubscription?.unsubscribe?.();
    state.authSubscription = null;
    state.listeners.clear();
    state.client = null;
    state.session = null;
    state.recoveryMode = false;
    state.initializePromise = null;
    state.initialNotified = false;
    state.configured = false;
    state.configurationError = null;
    state.disposed = true;
  }

  root.SuiteVetAuth = Object.freeze({
    AuthError: SuiteVetAuthError,
    buildRedirectUrl,
    cleanAuthCallbackUrl,
    dispose,
    getClient,
    getCurrentUser,
    getSession,
    getStatus,
    initialize,
    requestPasswordReset,
    resendConfirmation,
    signIn,
    signOut,
    signUp,
    subscribeToAuthChanges,
    updatePassword,
    urlContainsSensitiveAuthState
  });
})(window);
