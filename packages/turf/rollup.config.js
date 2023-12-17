import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";

const pckg = require("./package.json");
const input = "index.ts";

export default [
  {
    input,
    output: [{ file: pckg.browser, format: "umd", name: "turf" }],
    plugins: [
      commonjs(),
      nodeResolve(),
      babel({ babelHelpers: "bundled" }),
      terser(),
    ],
  },
];
