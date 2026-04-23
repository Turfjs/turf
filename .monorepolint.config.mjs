// @ts-check
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
} from "@monorepolint/rules";

const TS_PACKAGES = []; // projects that use typescript to build
const JS_PACKAGES = []; // projects that use javascript/rollup to build
const MAIN_PACKAGE = "@turf/turf";

const TAPE_PACKAGES = []; // projects that have tape tests
const NODE_TEST_PACKAGES = []; // projects that use node's native test runner
const TYPES_PACKAGES = []; // projects that have types tests
const TSTYCHE_PACKAGES = []; // projects that use tstyche for type tests

// iterate all the packages and figure out what buckets everything falls into
const packagesPath = path.join(process.cwd(), "packages");
for (const pk of await fs.readdir(packagesPath)) {
  if (pk === "turf") {
    continue;
  }

  const name = JSON.parse(
    await fs.readFile(path.join(packagesPath, pk, "package.json"), "utf8")
  ).name;

  if (existsSync(path.join(packagesPath, pk, "index.ts"))) {
    TS_PACKAGES.push(name);
  } else {
    JS_PACKAGES.push(name);
  }

  if (existsSync(path.join(packagesPath, pk, "test.ts"))) {
    const testFileContents = await fs.readFile(
      path.join(packagesPath, pk, "test.ts"),
      "utf-8"
    );
    if (testFileContents.includes(`from "tape"`)) {
      TAPE_PACKAGES.push(name);
    } else {
      NODE_TEST_PACKAGES.push(name);
    }
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
    packageEntry({
      options: {
        entries: {
          type: "module",
          main: "dist/cjs/index.cjs",
          module: "dist/esm/index.js",
          types: "dist/esm/index.d.ts",
          sideEffects: false,
          publishConfig: {
            access: "public",
          },
          // @turf/turf is commonly consumed through CDNs, moving this output file is a breaking change for anyone
          // who has a hardcoded reference to this specific file, instead of letting the CDN pick the path.
          // Example of a URL that will break: https://unpkg.com/@turf/turf/dist/turf.min.js
          // Example of a URL that will keep working: https://unpkg.com/@turf/turf
          browser: "turf.min.js",
          files: ["dist", "turf.min.js"],
          exports: {
            "./package.json": "./package.json",
            ".": {
              import: {
                types: "./dist/esm/index.d.ts",
                default: "./dist/esm/index.js",
              },
              require: {
                types: "./dist/cjs/index.d.cts",
                default: "./dist/cjs/index.cjs",
              },
            },
          },
        },
      },
      includePackages: [MAIN_PACKAGE],
    }),

    packageEntry({
      options: {
        entries: {
          type: "module",
          main: "dist/cjs/index.cjs",
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
                types: "./dist/cjs/index.d.cts",
                default: "./dist/cjs/index.cjs",
              },
            },
          },
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
    }),

    packageEntry({
      options: {
        entries: {
          files: ["dist"],
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
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
          test: "pnpm run /test:.*/",
        },
      },
      excludePackages: [MAIN_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          build: "tsup --config ../../tsup.config.ts",
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
    }),

    packageScript({
      options: {
        scripts: {
          build:
            "tsup --config ../../tsup.config.ts && rollup -c rollup.config.js",
        },
      },
      includePackages: [MAIN_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          bench: "tsx bench.ts",
          "test:tape": "tsx test.ts",
          "test:node": REMOVE,
        },
      },
      includePackages: TAPE_PACKAGES,
    }),

    packageScript({
      options: {
        scripts: {
          bench: "node bench.ts",
          "test:node": "node --test",
          "test:tape": REMOVE,
        },
      },
      includePackages: NODE_TEST_PACKAGES,
    }),

    packageScript({
      options: {
        scripts: {
          "test:types":
            "tsc --esModuleInterop --module node16 --moduleResolution node16 --noEmit --strict types.ts",
        },
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
        devDependencies: {
          benchmark: "^2.1.4",
          glob: REMOVE,
          tape: "^5.9.0",
          tsup: "^8.4.0",
          tsx: "^4.19.4",
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
      excludePackages: NODE_TEST_PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          tape: "^5.9.0",
          "@types/tape": "^5.8.1",
        },
      },
      includePackages: TAPE_PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          "@types/benchmark": REMOVE,
          "@types/tape": REMOVE,
          benchmark: REMOVE,
          "load-json-file": REMOVE,
          tape: REMOVE,
          tsx: REMOVE,
          "write-json-file": REMOVE,
        },
      },
      includePackages: NODE_TEST_PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          "@types/benchmark": "^2.1.5",
          benchmark: "^2.1.4",
        },
      },
      includePackages: TS_PACKAGES,
      excludePackages: NODE_TEST_PACKAGES,
    }),

    requireDependency({
      options: {
        dependencies: {
          tslib: "^2.8.1",
        },
        devDependencies: {
          typescript: "^5.8.3",
        },
      },
      includePackages: TS_PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          tstyche: "^6.2.0",
        },
      },
      includePackages: TSTYCHE_PACKAGES,
    }),

    requireDependency({
      options: {
        dependencies: {
          "@types/geojson": "^7946.0.10",
        },
      },
      includePackages: [MAIN_PACKAGE, ...TS_PACKAGES, ...JS_PACKAGES],
    }),
  ],
};
