// =============================================================================
// SUITE VET - Telemetria orientativa, minimizada y no bloqueante.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetTelemetry) return;

  const EVENTS = new Set(["login", "module_open", "plan_page_open", "feedback_submit", "academic_navigation"]);
  const METADATA_KEYS = new Set(["source", "viewport", "plan_slug"]);
  const state = { ready: false, user: null, sessionKey: null, recent: new Map(), initialized: false };

  function cleanResource(value) {
    const resource = String(value || "").trim().toLowerCase();
    return /^[a-z0-9][a-z0-9_./-]{0,79}$/.test(resource) ? resource : null;
  }

  function cleanMetadata(input) {
    const metadata = {};
    Object.entries(input && typeof input === "object" ? input : {}).forEach(([key, value]) => {
      const text = String(value ?? "").trim();
      if (METADATA_KEYS.has(key) && text && text.length <= 80) metadata[key] = text;
    });
    return metadata;
  }

  function createSessionKey() {
    try {
      const cached = root.sessionStorage?.getItem("suitevet_usage_session");
      if (/^[A-Za-z0-9_-]{12,64}$/.test(cached || "")) return cached;
      const bytes = new Uint8Array(18);
      root.crypto.getRandomValues(bytes);
      const key = Array.from(bytes, (value) => value.toString(36).padStart(2, "0")).join("").slice(0, 36);
      root.sessionStorage?.setItem("suitevet_usage_session", key);
      return key;
    } catch (_error) {
      return null;
    }
  }

  async function track(eventType, resourceKey = null, metadata = {}) {
    if (!state.ready || !state.user?.id || !EVENTS.has(eventType)) return false;
    const resource = cleanResource(resourceKey);
    if (["module_open", "academic_navigation"].includes(eventType) && !resource) return false;
    const dedupeKey = `${eventType}:${resource || ""}`;
    const now = Date.now();
    if (now - (state.recent.get(dedupeKey) || 0) < 60_000) return false;
    state.recent.set(dedupeKey, now);
    try {
      const client = root.SuiteVetAuth.getClient();
      const { error } = await client.from("usage_events").insert({
        event_type: eventType,
        resource_key: resource,
        session_key: state.sessionKey,
        metadata: cleanMetadata(metadata)
      });
      if (error) return false;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function trackView(view) {
    const resource = cleanResource(view);
    if (!resource || resource === "admin") return;
    if (resource === "profile") {
      track("plan_page_open", "profile", { source: "account" });
      return;
    }
    const item = root.SuiteVetCatalog?.getItems?.().find((candidate) => candidate.route === resource);
    if (item?.type === "primary") track("module_open", resource, { source: "navigation" });
    else if (["home", "landing", "bibliografia", "favoritos", "about"].includes(resource)) {
      track("academic_navigation", resource, { source: "navigation" });
    }
  }

  async function handleAuth(snapshot) {
    state.user = snapshot?.user || null;
    state.ready = Boolean(state.user);
    if (!state.ready) {
      state.recent.clear();
      return;
    }
    if (!state.sessionKey) state.sessionKey = createSessionKey();
    if (snapshot.event === "SIGNED_IN") await track("login", null, { source: "auth" });
  }

  async function initialize() {
    if (state.initialized) return;
    state.initialized = true;
    const auth = root.SuiteVetAuth;
    if (!auth) return;
    auth.subscribeToAuthChanges(handleAuth);
    document.addEventListener("suitevet:viewchange", (event) => trackView(event.detail?.view));
    try {
      const status = await auth.initialize();
      if (!status.configured) return;
      const session = await auth.getSession();
      await handleAuth({ event: "INITIAL_SESSION", user: session?.user || null });
    } catch (_error) {
      state.ready = false;
    }
  }

  root.SuiteVetTelemetry = Object.freeze({ cleanMetadata, initialize, track });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})(window);
