import { defineConfig } from "tsup";
import { baseOptions } from "../../tsup.config";

export default [
  defineConfig({
    ...baseOptions,
    entry: ["index.js"],
    outDir: "dist/cjs",
    format: "cjs",
  }),
  defineConfig({
    ...baseOptions,
    entry: ["index.js"],
    outDir: "dist/esm",
    format: "esm",
  }),
];
