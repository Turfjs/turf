const rules = {
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/no-var-requires": "off",
  "no-constant-condition": "off",
  "no-redeclare": "off",
  "no-var": "off",
  "prefer-const": "off",
};

module.exports = {
  root: true,
  ignorePatterns: ["**/dist/**"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  env: { es6: true },
  rules,

  overrides: [
    {
      files: ["packages/*/types.ts"],
      rules: {
        // these are meant to test the typescript typings, unused variables are expected
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      files: [
        ".eslintrc.js",
        "packages/*/bench.js",
        "packages/*/test.js",
        "packages/turf/rollup.config.js",
        "scripts/check-dependencies.js",
      ],
      env: {
        node: true,
      },
    },
    {
      files: [
        // a few files use browser global variables
        "packages/turf-isobands/lib/marchingsquares-isobands.js",
        "packages/turf-isolines/lib/marchingsquares-isocontours.js",
      ],
      env: {
        browser: true,
      },
    },
  ],
};
