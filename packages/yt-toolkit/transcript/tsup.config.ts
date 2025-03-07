import { defineConfig } from "tsup";

export default defineConfig([
  // Node.js build
  {
    entry: {
      index: "./src/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    platform: "node",
    target: "node18",
    outDir: "dist/node",
  },
  // Browser build
  {
    entry: {
      index: "./src/index.ts",
    },
    format: ["esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    platform: "browser",
    target: "es2020",
    outDir: "dist/browser",
    esbuildOptions(options) {
      options.conditions = ["browser"];
    },
  },
]);
