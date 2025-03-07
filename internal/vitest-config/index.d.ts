import { defineConfig, type ViteUserConfig } from "vitest/config";

export function createVitestConfig(
  test?: ViteUserConfig["test"]
): ReturnType<typeof defineConfig>;
