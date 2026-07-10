const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const Farma = require("../modules/farma/farma-calculations.js");
const Safety = require("../shared/security-utils.js");

test("interpreta 200 mg/5 mL como 40 mg/mL", () => {
  const parsed = Farma.parseConcentration(200, "mg/5 mL");
  assert.equal(parsed.ok, true);
  assert.equal(parsed.amountPerUnit, 40);
  assert.equal(parsed.resultUnit, "mL");
});

test("interpreta mg/mL con denominador unitario", () => {
  const parsed = Farma.parseConcentration(50, "mg/mL");
  assert.equal(parsed.ok, true);
  assert.equal(parsed.amountPerUnit, 50);
  assert.equal(parsed.resultUnit, "mL");
});

test("conserva unidades UI/mL del catalogo", () => {
  const result = Farma.calculateLoadedDose({
    weightKg: 10,
    dosePerKg: 2,
    concentration: 40,
    concentrationUnit: "UI/mL"
  });
  assert.equal(result.ok, true);
  assert.equal(result.totalDose, 20);
  assert.equal(result.finalQuantity, 0.5);
  assert.equal(result.doseUnitPerKg, "UI/kg");
  assert.equal(result.resultUnit, "mL");
});

test("calcula azitromicina a 1.875 mL", () => {
  const result = Farma.calculateLoadedDose({
    weightKg: 10,
    dosePerKg: 7.5,
    concentration: 200,
    concentrationUnit: "mg/5 mL"
  });
  assert.equal(result.ok, true);
  assert.equal(result.totalDose, 75);
  assert.equal(result.amountPerUnit, 40);
  assert.equal(result.finalQuantity, 1.875);
  assert.equal(result.resultUnit, "mL");
});

test("reconoce capsula con y sin tilde", () => {
  const accented = Farma.parseConcentration(100, "mg/capsula".replace("capsula", "cápsula"));
  const plain = Farma.parseConcentration(100, "mg/capsula");
  assert.equal(accented.ok, true);
  assert.equal(plain.ok, true);
  assert.equal(accented.resultUnit, "cápsulas");
  assert.equal(plain.resultUnit, "cápsulas");
  assert.equal(accented.concentrationUnit, "cápsula");
});

test("expresa gabapentina en capsulas", () => {
  const result = Farma.calculateLoadedDose({
    weightKg: 10,
    dosePerKg: 15,
    concentration: 100,
    concentrationUnit: "mg/cápsula"
  });
  assert.equal(result.ok, true);
  assert.equal(result.finalQuantity, 1.5);
  assert.equal(result.resultUnit, "cápsulas");
});

test("normaliza acentos sin cambiar el texto original", () => {
  assert.equal(Farma.normalizeForComparison("Gestación"), "gestacion");
  assert.equal(Farma.normalizeForComparison("gestacion"), "gestacion");
  assert.equal(Farma.normalizeForComparison("CÁPSULA"), "capsula");
});

test("rechaza valores cero, negativos, vacios e invalidos", () => {
  assert.equal(Farma.parseConcentration(0, "mg/mL").ok, false);
  assert.equal(Farma.parseConcentration(-1, "mg/mL").ok, false);
  assert.equal(Farma.parseConcentration("", "mg/mL").ok, false);
  assert.equal(Farma.parseConcentration(100, "formato-invalido").ok, false);
  assert.equal(Farma.calculateLoadedDose({ weightKg: 0, dosePerKg: 1, concentration: 1, concentrationUnit: "mg/mL" }).ok, false);
  assert.equal(Farma.calculateLoadedDose({ weightKg: 1, dosePerKg: -1, concentration: 1, concentrationUnit: "mg/mL" }).ok, false);
});

test("conserva el contrato legacy enviado al Recetario", () => {
  const drug = { principio: "Azitromicina" };
  const species = { nombre: "Canino", via: "Oral" };
  const calculation = Farma.calculateLoadedDose({
    weightKg: 10,
    dosePerKg: 7.5,
    concentration: 200,
    concentrationUnit: "mg/5 mL"
  });
  const args = Farma.buildLegacyRecipeArgs(drug, calculation, species, "Sin retiro", String);
  assert.deepEqual(args, [drug, "1.875 mL", "Oral", "Canino", "Sin retiro"]);
});

test("crea resultados de busqueda con texto no confiable sin innerHTML", () => {
  const malicious = '<img src=x onerror="window.__xssExecuted=true">';
  const fakeDocument = {
    createElement(tagName) {
      return { tagName, className: "", textContent: "" };
    }
  };
  const element = Safety.createTextElement(fakeDocument, "span", "title", malicious);
  assert.equal(element.textContent, malicious);
  assert.equal(Object.prototype.hasOwnProperty.call(element, "innerHTML"), false);
});

function clinicalTemplate() {
  return {
    id: "",
    paciente: { nombre: "", especie: "", pesoKg: "" },
    anamnesis: { inicio: "", observaciones: "" },
    problemas: { seleccionados: [], personalizados: [] },
    firmaResponsable: ""
  };
}

test("rechaza __proto__ sin contaminar Object.prototype", () => {
  const payload = JSON.parse('{"id":"x","__proto__":{"polluted":true}}');
  const result = Safety.safeMergeAllowed(clinicalTemplate(), payload);
  assert.equal(result.ok, false);
  assert.equal(({}).polluted, undefined);
});

test("rechaza constructor.prototype y claves peligrosas anidadas", () => {
  const constructorPayload = JSON.parse('{"constructor":{"prototype":{"polluted":true}}}');
  const nestedPayload = JSON.parse('{"paciente":{"nombre":"Luna","__proto__":{"polluted":true}}}');
  const prototypePayload = JSON.parse('{"paciente":{"prototype":{"polluted":true}}}');
  assert.equal(Safety.safeMergeAllowed(clinicalTemplate(), constructorPayload).ok, false);
  assert.equal(Safety.safeMergeAllowed(clinicalTemplate(), nestedPayload).ok, false);
  assert.equal(Safety.safeMergeAllowed(clinicalTemplate(), prototypePayload).ok, false);
  assert.equal(({}).polluted, undefined);
});

test("valida tipos y limites de la importacion clinica", () => {
  const wrongType = Safety.safeMergeAllowed(clinicalTemplate(), { problemas: { seleccionados: "dolor" } });
  const oversized = Safety.safeMergeAllowed(
    clinicalTemplate(),
    { paciente: { nombre: "x".repeat(20001) } }
  );
  assert.equal(wrongType.ok, false);
  assert.equal(oversized.ok, false);
});

test("conserva datos permitidos de una importacion clinica valida", () => {
  const payload = {
    id: "CL-001",
    paciente: { nombre: "Luna", especie: "canino", pesoKg: 12.5, campoNoPermitido: "ignorar" },
    anamnesis: { inicio: "Ayer", observaciones: "Estable" },
    problemas: { seleccionados: ["dolor"], personalizados: [] },
    firmaResponsable: "Dra. Vet"
  };
  const result = Safety.safeMergeAllowed(clinicalTemplate(), payload);
  assert.equal(result.ok, true);
  assert.equal(result.value.id, "CL-001");
  assert.equal(result.value.paciente.nombre, "Luna");
  assert.equal(result.value.paciente.pesoKg, "12.5");
  assert.deepEqual(result.value.problemas.seleccionados, ["dolor"]);
  assert.deepEqual(result.ignoredPaths, ["paciente.campoNoPermitido"]);
  assert.equal(({}).polluted, undefined);
});

test("los puntos de integracion usan los helpers seguros", () => {
  const root = path.resolve(__dirname, "..");
  const farmaSource = fs.readFileSync(path.join(root, "modules/farma/farma.js"), "utf8");
  const routerSource = fs.readFileSync(path.join(root, "shared/router.js"), "utf8");
  const clinicSource = fs.readFileSync(path.join(root, "modules/clinica-integrada/clinica.js"), "utf8");

  assert.match(farmaSource, /LoadedCalc\.calculateLoadedDose/);
  assert.match(farmaSource, /LoadedCalc\.buildLegacyRecipeArgs/);
  assert.doesNotMatch(farmaSource, /const finalQty = totalMg \/ conc/);

  assert.match(routerSource, /Safety\.createTextElement/);
  assert.doesNotMatch(routerSource, /\$\{item\.title\}/);
  assert.doesNotMatch(routerSource, /\$\{item\.subtitle\}/);

  assert.match(clinicSource, /Safety\.safeMergeAllowed/);
  assert.doesNotMatch(clinicSource, /function deepMerge/);
});
