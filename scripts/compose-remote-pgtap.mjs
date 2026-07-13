import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputPath = process.argv[2];
if (!outputPath) throw new Error("Se requiere una ruta temporal de salida.");

const migrationPath = resolve("supabase/migrations/20260713000200_saas_admin_foundation.sql");
const testPath = resolve("supabase/tests/saas_admin_foundation.sql");

function unwrap(source, expectedEnd, label) {
  const withoutStart = source.replace(/^\uFEFF?\s*begin;\s*/i, "");
  const withoutEnd = withoutStart.replace(new RegExp(`\\s*${expectedEnd};\\s*$`, "i"), "");
  if (withoutEnd === withoutStart) throw new Error(`${label} no termina en ${expectedEnd.toUpperCase()}.`);
  if (/\b(?:begin|commit|rollback)\s*;/i.test(withoutEnd)) {
    throw new Error(`${label} contiene un límite transaccional interno no permitido.`);
  }
  return withoutEnd.trim();
}

const migration = unwrap(await readFile(migrationPath, "utf8"), "commit", "La migración");
const tests = unwrap(await readFile(testPath, "utf8"), "rollback", "La prueba pgTAP");

if ((tests.match(/insert\s+into\s+auth\.users/gi) || []).length !== 1) {
  throw new Error("La prueba debe contener un único bloque de usuarios temporales.");
}
if ((tests.match(/@example\.test/gi) || []).length > 2) {
  throw new Error("La prueba intenta usar más de dos correos temporales.");
}

const composite = [
  "begin;",
  "-- Migracion y fixtures del Hito 3.3: todo se descarta al cerrar esta transaccion.",
  migration,
  tests,
  "rollback;",
  ""
].join("\n\n");

await writeFile(outputPath, composite, { encoding: "utf8", flag: "wx" });
console.log("Composite pgTAP transaccional creado sin credenciales.");
