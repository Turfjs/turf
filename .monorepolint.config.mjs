import * as path from "node:path";
import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import {
  alphabeticalDependencies,
  alphabeticalScripts,
  packageOrder,
  packageEntry,
  packageScript,
  requireDependency,
  REMOVE,
  standardTsconfig,
  fileContents,
} from "@monorepolint/rules";

const PACKAGES = []; // packages that aren't @turf/turf
const AGG_PACKAGE = "@turf/turf"; // aggregate package utilising rollup

const TAPE_PACKAGES = []; // packages with tape tests
const TYPES_PACKAGES = []; // packages with types tests
const TSTYCHE_PACKAGES = []; // packages that use tstyche for type tests.

// iterate all the packages and figure out what buckets everything falls into
const packagesPath = path.join(process.cwd(), "packages");
for (const pk of await fs.readdir(packagesPath)) {
  if (pk === "turf") {
    continue;
  }

  const name = JSON.parse(
    await fs.readFile(path.join(packagesPath, pk, "package.json"), "utf8")
  ).name;

  PACKAGES.push(name);

  if (existsSync(path.join(pk, "test.ts"))) {
    TAPE_PACKAGES.push(name);
  }

  if (existsSync(path.join(packagesPath, pk, "types.ts"))) {
    TYPES_PACKAGES.push(name);
  }

  if (existsSync(path.join(packagesPath, pk, "test/types.tst.ts"))) {
    TSTYCHE_PACKAGES.push(name);
  }
}

export default {
  rules: [
    packageOrder({
      options: {
        order: [
          "name",
          "version",
          "private",
          "description",
          "author",
          "contributors",
          "license",
          "bugs",
          "homepage",
          "repository",
          "funding",
          "publishConfig",
          "keywords",
          "type",
          "main",
          "module",
          "types",
          "exports",
          "browser",
          "sideEffects",
          "files",
          "scripts",
          "husky",
          "lint-staged",
          "packageManager",
          "devDependencies",
          "dependencies",
        ],
      },
      includeWorkspaceRoot: true,
    }),
    alphabeticalDependencies({ includeWorkspaceRoot: true }),
    alphabeticalScripts({ includeWorkspaceRoot: true }),
    standardTsconfig({
      options: { templateFile: "./templates/package/tsconfig.json" },
      includePackages: [...PACKAGES, AGG_PACKAGE],
    }),
    standardTsconfig({
      options: {
        file: "tsconfig.cjs.json",
        templateFile: "./templates/package/tsconfig.cjs.json",
      },
      includePackages: [...PACKAGES, AGG_PACKAGE],
    }),
    packageEntry({
      options: {
        entries: {
          type: "module",
          main: "dist/cjs/index.js",
          module: "dist/esm/index.js",
          types: "dist/esm/index.d.ts",
          sideEffects: false,
          publishConfig: {
            access: "public",
          },
          exports: {
            "./package.json": "./package.json",
            ".": {
              import: {
                types: "./dist/esm/index.d.ts",
                default: "./dist/esm/index.js",
              },
              require: {
                types: "./dist/cjs/index.d.ts",
                default: "./dist/cjs/index.js",
              },
            },
          },
        },
      },
      includePackages: PACKAGES,
    }),
    packageEntry({
      options: {
        entries: {
          files: ["dist"],
        },
      },
      includePackages: PACKAGES,
      excludePackages: [AGG_PACKAGE],
    }),
    packageEntry({
      options: {
        entries: {
          // @turf/turf is commonly consumed through CDNs, moving this output file is a breaking change for anyone
          // who has a hardcoded reference to this specific file, instead of letting the CDN pick the path.
          // Example of a URL that will break: https://unpkg.com/@turf/turf/dist/turf.min.js
          // Ex ample of a URL that will keep working: https://unpkg.com/@turf/turf
          browser: "turf.min.js",
          files: ["dist", "turf.min.js"],
        },
      },
      includePackages: [AGG_PACKAGE],
    }),
    packageEntry({
      options: {
        entries: {
          funding: "https://opencollective.com/turf",
        },
      },
    }),
    packageScript({
      options: {
        scripts: {
          docs: REMOVE,
          rollup: "rollup -c rollup.config.js",
          test: "pnpm run /test:.*/",
        },
      },
      includePackages: [AGG_PACKAGE],
    }),
    packageScript({
      options: {
        scripts: {
          build: "tsc -b",
          "build:cjs": REMOVE,
          "build:esm": REMOVE,
          prepack: "tsc -b tsconfig.cjs.json",
        },
      },
      includePackages: [...PACKAGES, AGG_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          bench: "tsx bench.ts",
          "test:tape": "tsx test.ts",
        },
      },
      includePackages: TAPE_PACKAGES,
    }),

    packageScript({
      options: {
        scripts: {
          "test:types": "tsc --project tsconfig.types.json",
        },
      },
      includePackages: TYPES_PACKAGES,
    }),

    fileContents({
      options: {
        file: "tsconfig.types.json",
        templateFile: "./templates/package/tsconfig.types.json",
      },
      includePackages: TYPES_PACKAGES,
    }),

    packageScript({
      options: {
        scripts: {
          "test:types": "tstyche",
        },
      },
      includePackages: TSTYCHE_PACKAGES,
    }),

    requireDependency({
      options: {
        dependencies: {
          "@types/geojson": "catalog:",
          tslib: "catalog:",
        },
        devDependencies: {
          "@types/benchmark": "catalog:",
          "@types/tape": "catalog:",
          benchmark: "catalog:",
          tape: "catalog:",
          tsx: "catalog:",
          typescript: "catalog:",
        },
      },
      includePackages: [...PACKAGES, AGG_PACKAGE],
    }),

    requireDependency({
      options: {
        devDependencies: {
          glob: REMOVE,
        },
      },
      // Keep glob for @turf/turf test for now. Remove after refactoring.
      includePackages: PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          tstyche: "catalog:",
        },
      },
      includePackages: TSTYCHE_PACKAGES,
    }),
  ],
};
