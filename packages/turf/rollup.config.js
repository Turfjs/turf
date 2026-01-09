import * as babelCore from "@babel/core";
import { readFileSync } from "fs";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pckg = JSON.parse(readFileSync("./package.json", "utf-8"));
const input = "index.ts";

export default [
  {
    input,
    output: [{ file: pckg.browser, format: "umd", name: "turf" }],
    plugins: [
      alias({
        entries: [
          {
            // Otherwise tries to require('jsbi/dist/jsbi.mjs') in output.
            find: "jsbi/dist/jsbi.mjs",
            replacement: resolve(__dirname, "node_modules/jsbi/dist/jsbi.mjs"),
          },
        ],
      }),
      nodeResolve(),
      commonjs(),
      {
        name: "transform-all-to-es5",
        transform(code, id) {
          // Skip commonjs synthetic modules.
          if (id.includes("?commonjs")) {
            return null;
          }

          console.log("Transforming to ES5:", id);

          // Don't apply bigint transforms to jsbi itself, but still transform
          // it.
          const plugins = id.includes("jsbi")
            ? []
            : [
                // Transform most JS 2020 native BigInt to JSBI library
                "babel-plugin-transform-bigint-to-jsbi",
                // Convert straglers the above misses e.g. Number()
                "@turf/internal/babel-plugin-bigint-patch",
              ];

          const result = babelCore.transformSync(code, {
            filename: id,
            plugins,
          });

          return {
            code: result.code,
            map: result.map,
          };
        },
      },
      nodePolyfills(),
      terser(),
    ],
  },
];
