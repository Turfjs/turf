export default {
  input: "index.js",
  output: [
    { file: "dist/index.js", format: "cjs", exports: "named" },
    { file: "dist/index.mjs", format: "es" },
  ],
};
