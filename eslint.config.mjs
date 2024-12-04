import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/dist/**/*",
      "**/node_modules",
      "packages/turf/turf.js",
      "packages/turf/turf.min.js",
      "packages/turf/test.example.js",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
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
];
