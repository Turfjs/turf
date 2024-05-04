import path from "path";
import glob from "glob";
import fs from "fs";

const TS_PACKAGES = [] as string[]; // projects that use typescript to build
const JS_PACKAGES = [] as string[]; // projects that use javascript/rollup to build
const MAIN_PACKAGE = "@turf/turf";

const TYPES_PACKAGES = [] as string[]; // projects that have types tests

// iterate all the packages and figure out what buckets everything falls into
glob.sync(path.join(__dirname, "packages", "turf-*")).forEach((pk: string) => {
  const name = JSON.parse(
    fs.readFileSync(path.join(pk, "package.json"), "utf8")
  ).name;

  if (fs.existsSync(path.join(pk, "index.ts"))) {
    TS_PACKAGES.push(name);
  } else {
    JS_PACKAGES.push(name);
  }

  if (fs.existsSync(path.join(pk, "types.ts"))) {
    TYPES_PACKAGES.push(name);
  }
});
const ALL_PACKAGES = [...JS_PACKAGES, ...TS_PACKAGES];

module.exports = {
  rules: {
    ":package-order": {
      options: {
        order: [
          "name",
          "version",
          "private",
          "description",
          "workspaces",
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
          "browser",
          "exports",
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
    },

    ":alphabetical-scripts": {},

    ":package-entry": [
      {
        options: {
          entries: {
            // @turf/turf is commonly consumed through CDNs, moving this output file is a breaking change for anyone
            // who has a hardcoded reference to this specific file, instead of letting the CDN pick the path.
            // Example of a URL that will break: https://unpkg.com/@turf/turf/dist/turf.min.js
            // Example of a URL that will keep working: https://unpkg.com/@turf/turf
            browser: "turf.min.js",
            files: ["dist", "index.d.ts", "turf.min.js"],
          },
        },
        includePackages: [MAIN_PACKAGE],
      },
      {
        options: {
          entries: {
            type: "commonjs",
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
        includePackages: [MAIN_PACKAGE, ...TS_PACKAGES, ...JS_PACKAGES],
      },
      {
        options: {
          entries: {
            funding: "https://opencollective.com/turf",
          },
        },
      },
    ],

    ":package-script": [
      {
        options: {
          scripts: {
            docs: "node ../../scripts/generate-readmes",
            test: "npm-run-all test:*",
          },
        },
        excludePackages: [MAIN_PACKAGE],
      },
      {
        options: {
          scripts: {
            build: "tsup --config ../../tsup.config.ts",
          },
        },
        includePackages: [...JS_PACKAGES, ...TS_PACKAGES],
      },
      {
        options: {
          scripts: {
            build:
              "tsup --config ../../tsup.config.ts && rollup -c ./rollup.config.js",
          },
        },
        includePackages: [MAIN_PACKAGE],
      },
      {
        options: {
          scripts: {
            bench: "tsx bench.js",
            "test:tape": "tsx test.js",
          },
        },
        includePackages: ALL_PACKAGES,
      },
      {
        options: {
          scripts: {
            "test:types": "tsc --esModuleInterop --noEmit types.ts",
          },
        },
        includePackages: TYPES_PACKAGES,
      },
    ],

    ":alphabetical-dependencies": {
      includeWorkspaceRoot: true,
    },

    ":require-dependency": [
      {
        options: {
          devDependencies: {
            "npm-run-all": "*",
            tsx: "^4.9.1",
            typescript: "~4.7.3",
          },
        },
        includePackages: ALL_PACKAGES,
      },
      {
        options: {
          devDependencies: {
            tsup: "^8.0.1",
          },
        },
        includePackages: ALL_PACKAGES,
      },
    ],
  },
};
