const rules = {
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/no-var-requires": "off",
  "no-case-declarations": "off",
  "no-cond-assign": "off",
  "no-constant-condition": "off",
  "no-dupe-else-if": "off",
  "no-empty": "off",
  "no-explicit-any": "off",
  "no-prototype-builtins": "off",
  "no-redeclare": "off",
  "no-undef": "off",
  "no-unreachable": "off",
  "no-useless-escape": "off",
  "no-var": "off",
  "prefer-const": "off",
  "prefer-spread": "off",
};

module.exports = {
  root: true,
  ignorePatterns: ["**/dist/**"],
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
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
  ],
};
