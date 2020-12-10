import node from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import { rollup } from "rollup";

const input = "index.js";
const plugins = [commonjs(), node(), terser()];
const format = "cjs";

rollup({ input, plugins }).then(generate).catch(catchError);

function generate(value) {
  value.generate({ format }).then(illegalSyntax).catch(catchError);
}

function illegalSyntax({ output }) {
  for (const { code } of output) {
    if (code.includes("Object.assign("))
      throw new Error('"Object.assign" syntax is invalid');
    if (code.includes("const ")) throw new Error('"const" syntax is invalid');
    if (code.includes("let ")) throw new Error('"let" syntax is invalid');
    if (code.includes("=> ")) throw new Error('"=>" syntax is invalid');
  }
}

function catchError(e) {
  throw new Error(e);
}
