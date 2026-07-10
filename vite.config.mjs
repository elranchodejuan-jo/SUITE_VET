import { cp } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const classicRuntimeDirectories = ["shared", "modules", "assets"];
const localStylesheetTag = /<link(?![^>]*\bvite-ignore\b)(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["'](?!https?:|\/\/|data:))([^>]*)>/gi;
const localClassicScriptTag = /<script(?![^>]*\bvite-ignore\b)(?=[^>]*\bsrc=["'](?!https?:|\/\/|data:))([^>]*)>/gi;

function copyClassicRuntime() {
  return {
    name: "suite-vet-copy-classic-runtime",
    apply: "build",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html
          .replace(localStylesheetTag, "<link vite-ignore$1>")
          .replace(localClassicScriptTag, "<script vite-ignore$1>");
      },
    },
    async closeBundle() {
      await Promise.all(
        classicRuntimeDirectories.map((directory) =>
          cp(resolve(directory), resolve("dist", directory), { recursive: true })
        )
      );
    },
  };
}

export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [copyClassicRuntime()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
