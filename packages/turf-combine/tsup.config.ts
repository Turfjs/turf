import { defineConfig } from "tsup";
import { baseOptions } from "../../tsup.config";

export default [
  defineConfig({
    ...baseOptions,
    entry: ["index.ts"],
    outDir: "dist/cjs",
    format: "cjs",
  }),
  defineConfig({
    ...baseOptions,
    entry: ["index.ts"],
    outDir: "dist/esm",
    format: "esm",
  }),
];
