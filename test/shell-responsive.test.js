const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const indexSource = read("index.html");
const layoutSource = read("shared/layout.css");
const responsiveSource = read("shared/responsive.css");
const routerSource = read("shared/router.js");
const viteSource = read("vite.config.mjs");

test("el shell incluye skip link, main enfocable y navegación semántica", () => {
  assert.match(indexSource, /class="sv-skip-link" href="#sv-main-content"/);
  assert.match(indexSource, /<main class="sv-main" id="sv-main-content" tabindex="-1">/);
  assert.match(indexSource, /<nav class="sv-sidebar" id="sv-menu-panel"[^>]+aria-label=/);
});

test("el botón del drawer publica su relación y estado accesible", () => {
  assert.match(indexSource, /id="sv-menu-toggle"[^>]+aria-expanded="false"[^>]+aria-controls="sv-menu-panel"/);
  assert.match(routerSource, /setAttribute\("aria-expanded", "true"\)/);
  assert.match(routerSource, /setAttribute\("aria-expanded", "false"\)/);
});

test("CSS y JavaScript comparten el límite inclusivo de 900 px", () => {
  assert.match(responsiveSource, /@media screen and \(max-width: 900px\)/);
  assert.match(routerSource, /matchMedia\("\(max-width: 900px\)"\)/);
  assert.doesNotMatch(routerSource, /innerWidth/);
});

test("el drawer protege scroll, Escape, foco y cierre exterior", () => {
  assert.match(routerSource, /classList\.add\("sv-drawer-open"\)/);
  assert.match(routerSource, /event\.key === "Escape"/);
  assert.match(routerSource, /lastMenuTrigger/);
  assert.match(routerSource, /backdrop\.addEventListener\("click"/);
  assert.match(routerSource, /trapDrawerFocus/);
  assert.match(routerSource, /document\.addEventListener\("keydown", trapDrawerFocus\)/);
});

test("la ruta activa expone aria-current", () => {
  assert.match(routerSource, /setAttribute\("aria-current", "page"\)/);
  assert.match(routerSource, /removeAttribute\("aria-current"\)/);
});

test("el shell protege overflow, foco visible, targets y movimiento reducido", () => {
  assert.match(layoutSource, /overflow-x: (?:hidden|clip)/);
  assert.match(layoutSource, /min-width: 44px/);
  assert.match(layoutSource, /min-height: 44px/);
  assert.match(layoutSource, /:focus-visible/);
  assert.match(layoutSource, /prefers-reduced-motion: reduce/);
});

test("el sidebar colapsado conserva iconos circulares y el menú de tres líneas", () => {
  assert.match(layoutSource, /\.sv-sidebar-collapsed \.sv-menu-icon \{[\s\S]*width: 44px;[\s\S]*height: 44px;[\s\S]*aspect-ratio: 1 \/ 1;[\s\S]*border-radius: 50%;[\s\S]*flex: 0 0 44px;/);
  assert.match(layoutSource, /\.sv-sidebar-collapsed \.sv-sidebar \{[\s\S]*scrollbar-width: none;/);
  assert.match(layoutSource, /\.sv-menu-toggle\.is-open span:nth-child\(1\),[\s\S]*\.sv-menu-toggle\.is-collapsed span:nth-child\(3\) \{[\s\S]*opacity: 1;[\s\S]*transform: none;/);
});

test("la toolchain mantiene solo dependencias de desarrollo justificadas", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.deepEqual(pkg.scripts, {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
    test: "node --test",
  });
  assert.deepEqual(Object.keys(pkg.devDependencies), ["happy-dom", "vite"]);
  assert.match(pkg.devDependencies["happy-dom"], /^\^20\./);
  assert.match(pkg.devDependencies.vite, /^\^8\./);
  assert.deepEqual(pkg.dependencies, { "@supabase/supabase-js": "2.110.2" });
});

test("Vite preserva el runtime clásico sin convertir módulos clínicos", () => {
  assert.match(viteSource, /classicRuntimeDirectories = \["shared", "modules", "assets"\]/);
  assert.match(viteSource, /vite-ignore/);
  assert.match(viteSource, /cp\(resolve\(directory\), resolve\("dist", directory\)/);
});
