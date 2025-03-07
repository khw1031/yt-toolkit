import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * @param {import('vitest/config').ViteUserConfig['test']} test @default { environment: "node" }
 * @returns {ReturnType<import('vitest/config').defineConfig>}
 */
export const createVitestConfig = (
  { environment } = { environment: "node" }
) => {
  return defineConfig({
    plugins: [tsconfigPaths()],
    test: {
      environment,
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "json", "lcov"],
      },
      globals: true,
      include: ["**/*.(test|spec).ts"],
      setupFiles: [import.meta.dirname + "/setup.node.js"],
    },
  });
};
