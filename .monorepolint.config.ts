const path = require("path");
const glob = require("glob");
const fs = require("fs");

const TS_PACKAGES = []; // projects that use typescript to build
const JS_PACKAGES = []; // projects that use javascript/rollup to build
const MAIN_PACKAGE = "@turf/turf";

const TAPE_PACKAGES = []; // projects that have tape tests
const TYPES_PACKAGES = []; // projects that have types tests
const BENCH_PACKAGES = []; // projects that have benchmarks

// iterate all the packages and figure out what buckets everything falls into
glob.sync(path.join(__dirname, "packages", "turf-*")).forEach(pk => {
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

const TS_BENCH_PACKAGES = BENCH_PACKAGES.filter(pkg => -1 !== TS_PACKAGES.indexOf(pkg));
const JS_BENCH_PACKAGES = BENCH_PACKAGES.filter(pkg => -1 !==  JS_PACKAGES.indexOf(pkg));
const TS_TAPE_PACKAGES = TAPE_PACKAGES.filter(pkg => -1 !==  TS_PACKAGES.indexOf(pkg));
const JS_TAPE_PACKAGES = TAPE_PACKAGES.filter(pkg => -1 !==  JS_PACKAGES.indexOf(pkg));

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
          "dependencies"
        ]
      },
      includeWorkspaceRoot: true
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
              import: "./dist/es/index.js",
              require: "./dist/js/index.js"
            }
          }
        },
        includePackages: [MAIN_PACKAGE]
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
              import: "./dist/es/index.js",
              require: "./dist/js/index.js"
            }
          }
        },
        includePackages: [...TS_PACKAGES, ...JS_PACKAGES]
      },
      {
        options: {
          entries: {
            types: "dist/js/index.d.ts",
            files: ["dist"]
          }
        },
        includePackages: TS_PACKAGES
      },
      {
        options: {
          entries: {
            types: "index.d.ts",
            files: ["dist", "index.d.ts"]
          }
        },
        includePackages: JS_PACKAGES
      }
    ],

    ":package-script": [
      {
        options: {
          scripts: {
            docs: "node ../../scripts/generate-readmes",
            test: "npm-run-all test:*"
          }
        },
        excludePackages: [MAIN_PACKAGE]
      },
      {
        options: {
          scripts: {
            build: "npm-run-all build:*",
            "build:js": "tsc",
            "build:es":
              "tsc --outDir dist/es --module esnext --declaration false && echo '{\"type\":\"module\"}' > dist/es/package.json"
          }
        },
        includePackages: TS_PACKAGES
      },
      {
        options: {
          scripts: {
            build: "rollup -c ../../rollup.config.js && echo '{\"type\":\"module\"}' > dist/es/package.json",
            posttest: "node -r esm ../../scripts/validate-es5-dependencies.js"
          }
        },
        includePackages: JS_PACKAGES
      },
      {
        options: {
          scripts: {
            build: "rollup -c rollup.config.js && echo '{\"type\":\"module\"}' > dist/es/package.json"
          }
        },
        includePackages: [MAIN_PACKAGE]
      },
      {
        options: {
          scripts: {
            "test:tape": "node -r esm test.js"
          }
        },
        includePackages: JS_TAPE_PACKAGES
      },
      {
        options: {
          scripts: {
            "test:tape": "ts-node -r esm test.js"
          }
        },
        includePackages: TS_TAPE_PACKAGES
      },
      {
        options: {
          scripts: {
            "bench": "node -r esm bench.js"
          }
        },
        includePackages: JS_TAPE_PACKAGES
      },
      {
        options: {
          scripts: {
            "bench": "ts-node bench.js"
          }
        },
        includePackages: TS_TAPE_PACKAGES
      },
      {
        options: {
          scripts: {
            "test:types": "tsc --esModuleInterop --noEmit types.ts"
          }
        },
        includePackages: TYPES_PACKAGES
      }
    ],

    ":alphabetical-dependencies": {
      includeWorkspaceRoot: true
    },

    ":require-dependency": [
      {
        options: {
          devDependencies: {
            "npm-run-all": "*"
          }
        },
        includePackages: [...TS_PACKAGES, ...JS_PACKAGES]
      },
      {
        options: {
          devDependencies: {
            "ts-node": "*",
            typescript: "*"
          }
        },
        includePackages: TS_PACKAGES
      },
      {
        options: {
          devDependencies: {
            rollup: "*"
          }
        },
        includePackages: JS_PACKAGES
      }
    ]
  }
};
