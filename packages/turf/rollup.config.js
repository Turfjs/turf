import node from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import base from "../../rollup.config";

const pckg = require("./package.json");
const input = "index.mjs";

export default [
  { ...base, input },
  {
    input,
    output: [{ file: pckg.browser, format: "umd", name: "turf" }],
    plugins: [commonjs(), node(), terser()],
  },
];
