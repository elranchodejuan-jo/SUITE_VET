"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const index = read("index.html");
const landing = read("shared/landing.js");
const landingCss = read("shared/landing.css");
const router = read("shared/router.js");
const vite = read("vite.config.mjs");
const workflow = read(".github/workflows/deploy-pages.yml");

test("Pages compila y publica solo dist con variables públicas por nombre", () => {
  assert.match(workflow, /^name: Deploy Suite Vet to GitHub Pages/m);
  assert.match(workflow, /push:\s+branches: \[main\]/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /VITE_SUPABASE_URL: \$\{\{ vars\.VITE_SUPABASE_URL \}\}/);
  assert.match(workflow, /VITE_SUPABASE_PUBLISHABLE_KEY: \$\{\{ vars\.VITE_SUPABASE_PUBLISHABLE_KEY \}\}/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3[\s\S]*path: \.\/dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.doesNotMatch(workflow, /service_role|SUPABASE_DB_|DATABASE_URL|connection string/i);
  assert.match(workflow, /\^\(sb_secret_\|eyJ\|example\|placeholder\|your_\)/);
});

test("Vite conserva la base de GitHub Pages y la landing se integra a la SPA", () => {
  assert.match(vite, /base: "\/SUITE_VET\/"/);
  assert.match(index, /href="shared\/landing\.css"/);
  assert.match(index, /src="shared\/landing\.js" defer/);
  assert.match(index, /id="view-landing" class="sv-view sv-view-active"/);
  assert.match(index, /id="view-home" class="sv-view"/);
  assert.match(index, /data-go-view="landing"/);
  assert.match(index, /name="description"/);
  assert.match(index, /property="og:title"/);
});

test("la landing consume el catálogo existente, identifica próximos pasos y mantiene el aviso académico", () => {
  assert.match(landing, /SuiteVetCatalog\?\.getItems\?\./);
  assert.match(landing, /FEATURED_MODULE_IDS/);
  assert.match(landing, /"fisio", "micro", "farma", "clinica", "semiologia", "nutricion"/);
  assert.match(landing, /"bibliografia", "oncologia", "casos360"/);
  assert.match(landing, /Próximamente/);
  assert.match(landing, /Suite Vet es una herramienta educativa y no sustituye el criterio profesional/);
  assert.doesNotMatch(landing, /innerHTML|insertAdjacentHTML|outerHTML/);
  assert.match(landingCss, /prefers-reduced-motion: reduce/);
  assert.match(landingCss, /@media print[\s\S]*#view-landing/);
});

test("la navegación de presentación preserva recarga y atrás sin alterar callbacks de Supabase", () => {
  assert.match(router, /ROUTE_QUERY_PARAM = "sv_view"/);
  assert.match(router, /window\.history\.pushState/);
  assert.match(router, /window\.addEventListener\("popstate"/);
  assert.match(router, /AUTH_CALLBACK_QUERY_KEYS/);
  assert.match(router, /if \(isSensitiveAuthCallbackUrl\(\)\) return DEFAULT_VIEW/);
  assert.match(router, /showView\(readRouteView\(\), \{ updateHistory: false \}\)/);
});

test("la landing renderiza catálogo, CTAs y aviso académico con DOM seguro", async () => {
  const { Window } = await import("happy-dom");
  const window = new Window({ url: "http://localhost/" });
  const moduleIds = ["fisio", "micro", "farma", "clinica", "semiologia", "nutricion", "bibliografia", "oncologia", "casos360"];
  const openedModes = [];
  window.document.body.innerHTML = '<main><div id="sv-landing-root"></div></main>';
  window.SuiteVetCatalog = {
    getItems: () => moduleIds.map((id) => ({
      id,
      name: `Módulo ${id}`,
      route: `route-${id}`,
      status: "active",
      icon_id: "physiology",
      description: "Descripción académica.",
      home_description: "Resumen académico."
    }))
  };
  window.SuiteVetAuthUI = { openModal: (mode) => openedModes.push(mode) };
  window.eval(landing);
  window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
  await window.happyDOM.whenAsyncComplete();

  assert.equal(window.document.querySelector("#sv-landing-title").textContent, "SUITE VET");
  assert.equal(window.document.querySelectorAll(".sv-landing-module-card").length, 9);
  assert.equal(window.document.querySelectorAll('[data-go-view="home"]').length, 2);
  assert.match(window.document.querySelector(".sv-landing-disclaimer").textContent, /herramienta educativa/);
  window.document.querySelector("[data-landing-auth]").click();
  assert.deepEqual(openedModes, ["signup"]);
  window.close();
});
