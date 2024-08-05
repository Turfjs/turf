import { defineConfig, type Options } from "tsup";

const baseOptions: Options = {
  clean: true,
  dts: true,
  entry: ["index.?s"], // while we have a mix of TS and JS packages
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: "es2017",
  tsconfig: "./tsconfig.json",
  // treeshake: true, causes "chunk.default" warning, breaks CJS exports?
  cjsInterop: true,
  splitting: true,
};

export default [
  defineConfig({
    ...baseOptions,
    outDir: "dist/cjs",
    format: "cjs",
  }),
  defineConfig({
    ...baseOptions,
    outDir: "dist/esm",
    format: "esm",
  }),
];
