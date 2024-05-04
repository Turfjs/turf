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
            exports: {
              "./package.json": "./package.json",
              ".": {
                import: "./dist/es/index.js",
                require: "./dist/js/index.js",
              },
            },
          },
        },
        includePackages: [MAIN_PACKAGE],
      },
      {
        options: {
          entries: {
            main: "dist/js/index.js",
            module: "dist/es/index.js",
            sideEffects: false,
            publishConfig: {
              access: "public",
            },
            exports: {
              "./package.json": "./package.json",
              ".": {
                import: "./dist/es/index.js",
                require: "./dist/js/index.js",
              },
            },
          },
        },
        includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
      },
      {
        options: {
          entries: {
            types: "dist/js/index.d.ts",
            files: ["dist"],
          },
        },
        includePackages: TS_PACKAGES,
      },
      {
        options: {
          entries: {
            types: "index.d.ts",
            files: ["dist", "index.d.ts"],
          },
        },
        includePackages: JS_PACKAGES,
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
            build: "npm-run-all build:*",
            "build:js": "tsc",
            "build:es":
              'tsc --outDir dist/es --module esnext --declaration false && echo \'{"type":"module"}\' > dist/es/package.json',
          },
        },
        includePackages: TS_PACKAGES,
      },
      {
        options: {
          scripts: {
            build:
              'rollup -c ../../rollup.config.js && echo \'{"type":"module"}\' > dist/es/package.json',
          },
        },
        includePackages: JS_PACKAGES,
      },
      {
        options: {
          scripts: {
            build:
              'rollup -c rollup.config.js && echo \'{"type":"module"}\' > dist/es/package.json',
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
            rollup: "*",
          },
        },
        includePackages: JS_PACKAGES,
      },
    ],
  },
};
