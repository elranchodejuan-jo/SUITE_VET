// =============================================================================
// SUITE VET - shared/api-client.js
// Cliente HTTP clasico y reutilizable para la API versionada.
// No realiza solicitudes automaticamente al cargarse.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetAPI) return;

  const DEFAULT_TIMEOUT_MS = 5000;
  const HEALTH_PATH = "/api/v1/health";
  const CATALOG_MODULES_PATH = "/api/v1/catalog/modules";
  const state = {
    baseUrl: "",
    timeoutMs: DEFAULT_TIMEOUT_MS
  };

  class SuiteVetAPIError extends Error {
    constructor(message, details = {}) {
      super(message);
      this.name = "SuiteVetAPIError";
      this.code = details.code || "API_ERROR";
      this.status = Number.isInteger(details.status) ? details.status : null;
      if (details.cause) this.cause = details.cause;
    }
  }

  function normalizedBaseUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function normalizedTimeout(value) {
    const timeout = Number(value);
    if (!Number.isFinite(timeout) || timeout <= 0) {
      throw new TypeError("timeoutMs debe ser un numero positivo");
    }
    return timeout;
  }

  function buildUrl(path, baseUrl) {
    if (typeof path !== "string" || !path.startsWith("/")) {
      throw new TypeError("La ruta de API debe comenzar con '/'");
    }
    return `${normalizedBaseUrl(baseUrl)}${path}`;
  }

  function configure(options = {}) {
    if (Object.prototype.hasOwnProperty.call(options, "baseUrl")) {
      state.baseUrl = normalizedBaseUrl(options.baseUrl);
    }
    if (Object.prototype.hasOwnProperty.call(options, "timeoutMs")) {
      state.timeoutMs = normalizedTimeout(options.timeoutMs);
    }
    return getConfiguration();
  }

  function getConfiguration() {
    return Object.freeze({
      baseUrl: state.baseUrl,
      timeoutMs: state.timeoutMs
    });
  }

  async function request(path, options = {}) {
    if (typeof root.fetch !== "function") {
      throw new SuiteVetAPIError("El navegador no dispone de fetch", {
        code: "UNSUPPORTED"
      });
    }
    if (typeof root.AbortController !== "function") {
      throw new SuiteVetAPIError("El navegador no permite cancelar solicitudes", {
        code: "UNSUPPORTED"
      });
    }

    const baseUrl = Object.prototype.hasOwnProperty.call(options, "baseUrl")
      ? options.baseUrl
      : state.baseUrl;
    const timeoutMs = Object.prototype.hasOwnProperty.call(options, "timeoutMs")
      ? normalizedTimeout(options.timeoutMs)
      : state.timeoutMs;
    const url = buildUrl(path, baseUrl);
    const controller = new root.AbortController();
    const timeoutId = root.setTimeout(() => controller.abort(), timeoutMs);

    let response;
    try {
      response = await root.fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new SuiteVetAPIError("La API no respondio dentro del tiempo esperado", {
          code: "TIMEOUT",
          cause: error
        });
      }
      throw new SuiteVetAPIError("No fue posible conectar con la API", {
        code: "UNAVAILABLE",
        cause: error
      });
    } finally {
      root.clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new SuiteVetAPIError(`La API respondio con HTTP ${response.status}`, {
        code: "HTTP_ERROR",
        status: response.status
      });
    }

    try {
      return await response.json();
    } catch (error) {
      throw new SuiteVetAPIError("La API devolvio una respuesta JSON invalida", {
        code: "INVALID_JSON",
        status: response.status,
        cause: error
      });
    }
  }

  function getHealth(options = {}) {
    return request(HEALTH_PATH, options);
  }

  function getCatalogModules(options = {}) {
    return request(CATALOG_MODULES_PATH, options);
  }

  Object.defineProperty(root, "SuiteVetAPI", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: Object.freeze({
      APIError: SuiteVetAPIError,
      configure,
      getCatalogModules,
      getConfiguration,
      getHealth,
      request
    })
  });
})(window);
