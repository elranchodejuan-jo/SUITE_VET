(function (root, factory) {
  "use strict";

  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.SuiteVetSafety = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);
  const DEFAULT_LIMITS = {
    maxDepth: 12,
    maxArrayLength: 500,
    maxStringLength: 20000,
    maxKeys: 2500
  };

  function createTextElement(documentRef, tagName, className, value) {
    if (!documentRef?.createElement) throw new TypeError("Se requiere un documento valido.");
    const element = documentRef.createElement(tagName);
    if (className) element.className = className;
    element.textContent = String(value ?? "");
    return element;
  }

  function findUnsafeKey(value, limits = DEFAULT_LIMITS) {
    const seen = new WeakSet();
    let visitedKeys = 0;

    function visit(current, path, depth) {
      if (!current || typeof current !== "object") return null;
      if (depth > limits.maxDepth) return `${path || "raiz"}: profundidad maxima excedida`;
      if (seen.has(current)) return `${path || "raiz"}: referencia circular no permitida`;
      seen.add(current);

      if (Array.isArray(current)) {
        if (current.length > limits.maxArrayLength) return `${path || "raiz"}: arreglo demasiado grande`;
        for (let index = 0; index < current.length; index += 1) {
          const found = visit(current[index], `${path}[${index}]`, depth + 1);
          if (found) return found;
        }
        return null;
      }

      for (const key of Object.keys(current)) {
        visitedKeys += 1;
        if (visitedKeys > limits.maxKeys) return `${path || "raiz"}: demasiadas propiedades`;
        if (DANGEROUS_KEYS.has(key)) return `${path ? `${path}.` : ""}${key}`;
        const found = visit(current[key], path ? `${path}.${key}` : key, depth + 1);
        if (found) return found;
      }
      return null;
    }

    return visit(value, "", 0);
  }

  function safeMergeAllowed(template, source, options = {}) {
    const limits = { ...DEFAULT_LIMITS, ...(options.limits || {}) };
    const unsafePath = findUnsafeKey(source, limits);
    if (unsafePath) {
      return {
        ok: false,
        value: null,
        errors: [`La importacion contiene una propiedad no permitida: ${unsafePath}.`],
        ignoredPaths: []
      };
    }

    const errors = [];
    const ignoredPaths = [];

    function cloneGeneric(value, path, depth) {
      if (depth > limits.maxDepth) {
        errors.push(`${path}: profundidad maxima excedida.`);
        return null;
      }
      if (typeof value === "string") {
        if (value.length > limits.maxStringLength) {
          errors.push(`${path}: texto demasiado largo.`);
          return null;
        }
        return value;
      }
      if (value === null || typeof value === "number" || typeof value === "boolean") return value;
      if (Array.isArray(value)) {
        if (value.length > limits.maxArrayLength) {
          errors.push(`${path}: arreglo demasiado grande.`);
          return [];
        }
        return value.map((item, index) => cloneGeneric(item, `${path}[${index}]`, depth + 1));
      }
      if (value && typeof value === "object") {
        const copy = {};
        Object.keys(value).forEach((key) => {
          copy[key] = cloneGeneric(value[key], `${path}.${key}`, depth + 1);
        });
        return copy;
      }
      errors.push(`${path}: tipo de dato no permitido.`);
      return null;
    }

    function merge(target, incoming, path, depth) {
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
        errors.push(`${path || "raiz"}: se esperaba un objeto.`);
        return target;
      }

      Object.keys(incoming).forEach((key) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (!Object.prototype.hasOwnProperty.call(target, key)) {
          ignoredPaths.push(currentPath);
          return;
        }

        const expected = target[key];
        const received = incoming[key];

        if (Array.isArray(expected)) {
          if (!Array.isArray(received)) {
            errors.push(`${currentPath}: se esperaba un arreglo.`);
            return;
          }
          target[key] = cloneGeneric(received, currentPath, depth + 1);
          return;
        }

        if (expected && typeof expected === "object") {
          if (!received || typeof received !== "object" || Array.isArray(received)) {
            errors.push(`${currentPath}: se esperaba un objeto.`);
            return;
          }
          target[key] = merge(expected, received, currentPath, depth + 1);
          return;
        }

        if (typeof expected === "string") {
          if (!["string", "number", "boolean"].includes(typeof received)) {
            errors.push(`${currentPath}: se esperaba texto o un valor escalar.`);
            return;
          }
          const text = String(received);
          if (text.length > limits.maxStringLength) {
            errors.push(`${currentPath}: texto demasiado largo.`);
            return;
          }
          target[key] = text;
          return;
        }

        if (typeof received !== typeof expected) {
          errors.push(`${currentPath}: tipo de dato incompatible.`);
          return;
        }
        target[key] = received;
      });

      return target;
    }

    if (!template || typeof template !== "object" || Array.isArray(template)) {
      return { ok: false, value: null, errors: ["La plantilla de importacion no es valida."], ignoredPaths: [] };
    }

    const value = merge(template, source, "", 0);
    return { ok: errors.length === 0, value: errors.length ? null : value, errors, ignoredPaths };
  }

  return {
    DANGEROUS_KEYS,
    createTextElement,
    findUnsafeKey,
    safeMergeAllowed
  };
});
