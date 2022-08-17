import typescript from "./rollup-plugins/typescript-export";

export default {
  input: "index.js",
  output: [
    { file: "dist/js/index.js", format: "cjs" },
    { file: "dist/es/index.js", format: "es" },
  ],
  plugins: [typescript()],
};
