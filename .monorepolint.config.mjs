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

const TS_BENCH_PACKAGES = BENCH_PACKAGES.filter(
  (pkg) => -1 !== TS_PACKAGES.indexOf(pkg)
);
const JS_BENCH_PACKAGES = BENCH_PACKAGES.filter(
  (pkg) => -1 !== JS_PACKAGES.indexOf(pkg)
);
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
          "packageManager",
          "devDependencies",
          "dependencies",
        ],
      },
      includeWorkspaceRoot: true,
    }),

    alphabeticalDependencies({ includeWorkspaceRoot: true }),
    alphabeticalScripts({}),

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
                default: "./dist/cjs/index.js",
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
          main: "dist/cjs/index.js",
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
                default: "./dist/cjs/index.js",
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
          funding: "https://opencollective.com/turf",
        },
      },
    }),

    packageScript({
      options: {
        scripts: {
          docs: "node ../../scripts/generate-readmes",
          test: "npm-run-all test:*",
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
            "tsup --config ../../tsup.config.ts && rollup -c ./rollup.config.js",
        },
      },
      includePackages: [MAIN_PACKAGE],
    }),
    packageScript({
      options: {
        scripts: {
          "test:tape": "tsx test.js",
        },
      },
      includePackages: JS_TAPE_PACKAGES,
    }),
    packageScript({
      options: {
        scripts: {
          "test:tape": "tsx test.js",
        },
      },
      includePackages: TS_TAPE_PACKAGES,
    }),
    packageScript({
      options: {
        scripts: {
          bench: "tsx bench.js",
        },
      },
      includePackages: [...TS_TAPE_PACKAGES, ...JS_TAPE_PACKAGES],
    }),
    packageScript({
      options: {
        scripts: {
          "test:types": "tsc --esModuleInterop --noEmit types.ts",
        },
      },
      includePackages: TYPES_PACKAGES,
    }),

    requireDependency({
      options: {
        devDependencies: {
          "npm-run-all": "*",
        },
      },
      includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
    }),
    requireDependency({
      options: {
        devDependencies: {
          typescript: "~4.7.3",
        },
      },
      includePackages: TS_PACKAGES,
    }),
    requireDependency({
      options: {
        devDependencies: {
          rollup: "*",
        },
      },
      includePackages: JS_PACKAGES,
    }),
  ],
};
