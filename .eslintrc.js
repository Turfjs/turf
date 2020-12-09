const rules = {
  "@typescript-eslint/ban-types": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-empty-function": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-inferrable-types": "off",
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/no-unused-vars": "off",
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
  "no-unused-vars": "off",
  "no-useless-escape": "off",
  "no-var": "off",
  "prefer-const": "off",
  "prefer-spread": "off",
};

module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      env: { es6: true },
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "prettier/@typescript-eslint",
      ],
      rules,
    },
  ],
  rules,
};
