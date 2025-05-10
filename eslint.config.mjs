import globals from "globals";
import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tsEslint.config(
  js.configs.recommended,
  tsEslint.configs.recommended,
  {
    ignores: [
      "**/dist/**/*",
      "**/node_modules",
      "packages/turf/turf.js",
      "packages/turf/turf.min.js",
      "packages/turf/test.example.js",
    ],
  },
  {
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsEslint.parser,
      ecmaVersion: 6,
      sourceType: "module",
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-constant-condition": "off",
      "no-redeclare": "off",
      "no-var": "off",
      "prefer-const": "off",
    },
  },
  {
    files: ["packages/*/types.ts", "packages/*/test.ts"],

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    files: [
      "**/.eslintrc.js",
      "packages/*/bench.js",
      "packages/*/test.js",
      "packages/turf/rollup.config.js",
      "scripts/check-dependencies.js",
    ],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: [
      "packages/turf-isobands/lib/marchingsquares-isobands.js",
      "packages/turf-isolines/lib/marchingsquares-isocontours.js",
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  prettierRecommended
);
