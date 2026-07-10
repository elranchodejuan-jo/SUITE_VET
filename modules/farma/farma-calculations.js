(function (root, factory) {
  "use strict";

  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.SuiteVetFarmaCalculations = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const RESULT_UNITS = {
    ml: "mL",
    capsula: "cápsulas",
    capsulas: "cápsulas",
    tableta: "tabletas",
    tabletas: "tabletas",
    comprimido: "comprimidos",
    comprimidos: "comprimidos"
  };

  const CONCENTRATION_UNITS = {
    ml: "mL",
    capsula: "cápsula",
    capsulas: "cápsula",
    tableta: "tableta",
    tabletas: "tableta",
    comprimido: "comprimido",
    comprimidos: "comprimido"
  };

  function normalizeForComparison(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function parsePositiveNumber(value) {
    if (typeof value === "string" && !value.trim()) return null;
    const normalized = typeof value === "string" ? value.trim().replace(",", ".") : value;
    const number = Number(normalized);
    return Number.isFinite(number) && number > 0 ? number : null;
  }

  function displayNumeratorUnit(value) {
    const normalized = normalizeForComparison(value);
    if (normalized === "ui") return "UI";
    if (normalized === "ug") return "ug";
    return normalized;
  }

  function parseConcentration(concentration, unitText) {
    const amount = parsePositiveNumber(concentration);
    if (amount === null) {
      return { ok: false, error: "La concentracion debe ser mayor que cero." };
    }

    const normalizedUnit = normalizeForComparison(unitText).replace(/\s+/g, " ");
    const match = normalizedUnit.match(/^([a-z]+)\s*\/\s*(?:(\d+(?:[.,]\d+)?)\s*)?([a-z]+)$/);

    if (!match) {
      return { ok: false, error: "Formato de concentracion no reconocido." };
    }

    const numeratorUnit = displayNumeratorUnit(match[1]);
    const denominatorQuantity = parsePositiveNumber(match[2] || 1);
    const denominatorKey = match[3];
    const resultUnit = RESULT_UNITS[denominatorKey];
    const concentrationUnit = CONCENTRATION_UNITS[denominatorKey];

    if (!numeratorUnit || denominatorQuantity === null || !resultUnit || !concentrationUnit) {
      return { ok: false, error: "Unidad de concentracion no reconocida." };
    }

    const amountPerUnit = amount / denominatorQuantity;
    if (!Number.isFinite(amountPerUnit) || amountPerUnit <= 0) {
      return { ok: false, error: "No se pudo obtener una concentracion valida." };
    }

    return {
      ok: true,
      numeratorUnit,
      denominatorQuantity,
      resultUnit,
      concentrationUnit,
      amountPerUnit,
      originalAmount: amount,
      originalUnit: String(unitText || "")
    };
  }

  function calculateLoadedDose(input) {
    const source = input && typeof input === "object" ? input : {};
    const weightKg = parsePositiveNumber(source.weightKg);
    const dosePerKg = parsePositiveNumber(source.dosePerKg);

    if (weightKg === null || dosePerKg === null) {
      return { ok: false, error: "Peso y dosis deben ser mayores que cero." };
    }

    const parsedConcentration = parseConcentration(source.concentration, source.concentrationUnit);
    if (!parsedConcentration.ok) return parsedConcentration;

    const totalDose = weightKg * dosePerKg;
    const finalQuantity = totalDose / parsedConcentration.amountPerUnit;

    if (!Number.isFinite(totalDose) || totalDose <= 0 || !Number.isFinite(finalQuantity) || finalQuantity <= 0) {
      return { ok: false, error: "El calculo produjo un resultado invalido." };
    }

    return {
      ...parsedConcentration,
      ok: true,
      weightKg,
      dosePerKg,
      totalDose,
      finalQuantity,
      doseUnitPerKg: `${parsedConcentration.numeratorUnit}/kg`
    };
  }

  function defaultFormatNumber(value) {
    return Number(value).toLocaleString("es-EC", { maximumFractionDigits: 4 });
  }

  function buildLegacyRecipeArgs(drug, calculation, species, withdrawal, formatNumber) {
    if (!calculation?.ok) return null;
    const formatter = typeof formatNumber === "function" ? formatNumber : defaultFormatNumber;
    return [
      drug,
      `${formatter(calculation.finalQuantity)} ${calculation.resultUnit}`,
      species?.via || "N/D",
      species?.nombre || "",
      withdrawal || ""
    ];
  }

  return {
    normalizeForComparison,
    parsePositiveNumber,
    parseConcentration,
    calculateLoadedDose,
    buildLegacyRecipeArgs
  };
});
