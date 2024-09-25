import { babel } from "@rollup/plugin-babel";
import { readFileSync } from "fs";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const pckg = JSON.parse(readFileSync("./package.json", "utf-8"));
const input = "index.ts";

export default [
  {
    input,
    output: [{ file: pckg.browser, format: "umd", name: "turf" }],
    plugins: [
      commonjs(),
      nodeResolve(),
      nodePolyfills(),
      babel({ babelHelpers: "bundled" }),
      terser(),
    ],
  },
];
