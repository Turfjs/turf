export default {
  input: "index.js",
  output: [
    { file: "dist/js/index.js", format: "cjs", exports: "named" },
    { file: "dist/es/index.js", format: "es" },
  ],
};
