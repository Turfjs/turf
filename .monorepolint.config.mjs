// @ts-check
import * as path from "node:path";
import { glob } from "glob";
import * as fs from "node:fs";
import {
  alphabeticalDependencies,
  alphabeticalScripts,
  packageOrder,
  packageEntry,
  packageScript,
  requireDependency,
} from "@monorepolint/rules";

const TS_PACKAGES = []; // projects that use typescript to build
const JS_PACKAGES = []; // projects that use javascript/rollup to build
const MAIN_PACKAGE = "@turf/turf";

const TAPE_PACKAGES = []; // projects that have tape tests
const TYPES_PACKAGES = []; // projects that have types tests
const BENCH_PACKAGES = []; // projects that have benchmarks

// iterate all the packages and figure out what buckets everything falls into
const __dirname = new URL(".", import.meta.url).pathname;
glob.sync(path.join(__dirname, "packages", "turf-*")).forEach((pk) => {
  const name = JSON.parse(
    fs.readFileSync(path.join(pk, "package.json"), "utf8")
  ).name;

  if (fs.existsSync(path.join(pk, "index.ts"))) {
    TS_PACKAGES.push(name);
  } else {
    JS_PACKAGES.push(name);
  }

  if (fs.existsSync(path.join(pk, "test.js"))) {
    TAPE_PACKAGES.push(name);
  }

  if (fs.existsSync(path.join(pk, "types.ts"))) {
    TYPES_PACKAGES.push(name);
  }
});

const TS_TAPE_PACKAGES = TAPE_PACKAGES.filter(
  (pkg) => -1 !== TS_PACKAGES.indexOf(pkg)
);
const JS_TAPE_PACKAGES = TAPE_PACKAGES.filter(
  (pkg) => -1 !== JS_PACKAGES.indexOf(pkg)
);

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
          // @turf/turf is commonly consumed through CDNs, moving this output file is a breaking change for anyone
          // who has a hardcoded reference to this specific file, instead of letting the CDN pick the path.
          // Example of a URL that will break: https://unpkg.com/@turf/turf/dist/turf.min.js
          // Example of a URL that will keep working: https://unpkg.com/@turf/turf
          browser: "turf.min.js",
          files: ["dist", "index.d.ts", "turf.min.js"],
          exports: {
            "./package.json": "./package.json",
            ".": {
              import: {
                types: "./dist/esm/index.d.mts",
                default: "./dist/esm/index.mjs",
              },
              require: {
                types: "./dist/cjs/index.d.ts",
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
          main: "dist/cjs/index.cjs",
          module: "dist/esm/index.mjs",
          types: "dist/cjs/index.d.ts",
          sideEffects: false,
          publishConfig: {
            access: "public",
          },
          exports: {
            "./package.json": "./package.json",
            ".": {
              import: {
                types: "./dist/esm/index.d.mts",
                default: "./dist/esm/index.mjs",
              },
              require: {
                types: "./dist/cjs/index.d.ts",
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
      includePackages: TS_PACKAGES,
    }),

    packageEntry({
      options: {
        entries: {
          files: ["dist", "index.d.ts"],
        },
      },
      includePackages: JS_PACKAGES,
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
          docs: "tsx ../../scripts/generate-readmes.ts",
          test: "npm-run-all --npm-path npm test:*",
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
        },
      },
      includePackages: [...TS_TAPE_PACKAGES, ...JS_TAPE_PACKAGES],
    }),

    packageScript({
      options: {
        scripts: {
          "test:types": "tsc --esModuleInterop --noEmit --strict types.ts",
        },
      },
      includePackages: TYPES_PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          benchmark: "^2.1.4",
          "npm-run-all": "^4.1.5",
          tape: "^5.7.2",
          tsx: "^4.6.2",
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
    }),

    requireDependency({
      options: {
        dependencies: {
          tslib: "^2.6.2",
        },
        devDependencies: {
          "@types/benchmark": "^2.1.5",
          "@types/tape": "^4.2.32",
          typescript: "^5.2.2",
        },
      },
      includePackages: TS_PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          rollup: "^2.79.1",
        },
      },
      includePackages: [MAIN_PACKAGE],
    }),
  ],
};
