const path = require("path");
const glob = require("glob");
const fs = require("fs");

const TS_PACKAGES: string[] = []; // projects that use typescript to build
const JS_PACKAGES: string[] = []; // projects that use javascript/rollup to build
const MAIN_PACKAGE = "@turf/turf";

const TAPE_PACKAGES: string[] = []; // projects that have tape tests
const TYPES_PACKAGES: string[] = []; // projects that have types tests
const BENCH_PACKAGES: string[] = []; // projects that have benchmarks

// iterate all the packages and figure out what buckets everything falls into
glob.sync(path.join(__dirname, "packages", "turf-*")).forEach((pk) => {
  const name: string = JSON.parse(
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
          "main",
          "module",
          "exports",
          "browser",
          "types",
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
                types: "./index.d.ts",
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
          },
        },
        includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
      },
      {
        options: {
          entries: {
            types: "dist/js/index.d.ts",
            files: ["dist"],
            exports: {
              "./package.json": "./package.json",
              ".": {
                types: "./dist/js/index.d.ts",
                import: "./dist/es/index.js",
                require: "./dist/js/index.js",
              },
            },
          },
        },
        includePackages: TS_PACKAGES,
      },
      {
        options: {
          entries: {
            types: "index.d.ts",
            files: ["dist", "index.d.ts"],
            exports: {
              "./package.json": "./package.json",
              ".": {
                types: "./index.d.ts",
                import: "./dist/es/index.js",
                require: "./dist/js/index.js",
              },
            },
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
            docs: "tsx ../../scripts/generate-readmes",
            test: "npm-run-all --npm-path npm test:*",
          },
        },
        excludePackages: [MAIN_PACKAGE],
      },
      {
        options: {
          scripts: {
            build: "npm-run-all --npm-path npm build:*",
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
            "test:tape": "tsx test.js",
          },
        },
        includePackages: JS_TAPE_PACKAGES,
      },
      {
        options: {
          scripts: {
            "test:tape": "tsx test.js",
          },
        },
        includePackages: TS_TAPE_PACKAGES,
      },
      {
        options: {
          scripts: {
            bench: "tsx bench.js",
          },
        },
        includePackages: JS_TAPE_PACKAGES,
      },
      {
        options: {
          scripts: {
            bench: "tsx bench.js",
          },
        },
        includePackages: TS_TAPE_PACKAGES,
      },
      {
        options: {
          scripts: {
            "test:types": "tsc --esModuleInterop --noEmit --strict types.ts",
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
          },
        },
        includePackages: [...TS_PACKAGES, ...JS_PACKAGES],
      },
      {
        options: {
          dependencies: {
            tslib: "^2.3.0",
          },
          devDependencies: {
            tsx: "*",
            typescript: "*",
          },
        },
        includePackages: TS_PACKAGES,
      },
      {
        options: {
          devDependencies: {
            rollup: "*",
            tsx: "*",
          },
        },
        includePackages: JS_PACKAGES,
      },
    ],
  },
};
