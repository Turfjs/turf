import { defineConfig, type Options } from "tsup";

const baseOptions: Options = {
  tsconfig: "./tsconfig.build.json",
  clean: true,
  dts: true,
  sourcemap: true,
  // treeshake: true, causes "chunk.default" warning, breaks CJS exports?
  minify: false,
  skipNodeModulesBundle: true,
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

export { baseOptions };
