import { type Options } from "tsup";

const baseOptions: Options = {
  tsconfig: "./tsconfig.build.json",
  clean: true,
  dts: true,
  sourcemap: true,
  // treeshake: true, causes "chunk.default" warning, breaks CJS exports?
  minify: false,
  cjsInterop: true,
  splitting: true,
  external: [
    /^@turf\//, // Externalize all @turf workspace packages
  ],
};

export { baseOptions };
