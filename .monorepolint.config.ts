const path = require("path");
const glob = require("glob");
const fs = require("fs");

const TS_PACKAGES = []; // projects that use typescript to build
const JS_PACKAGES = []; // projects that use javascript/rollup to build
const MAIN_PACKAGE = "@turf/turf";

const TAPE_PACKAGES = []; // projects that have tape tests
const TYPES_PACKAGES = []; // projects that have types tests

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
            main: "dist/js/index.js",
            module: "dist/es/index.js",
            sideEffects: false,
            publishConfig: {
              access: "public"
            }
          }
        },
        includePackages: [MAIN_PACKAGE, ...TS_PACKAGES, ...JS_PACKAGES]
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
        includePackages: [MAIN_PACKAGE, ...JS_PACKAGES]
      }
    ],

    ":package-script": [
      {
        options: {
          scripts: {
            bench: "npm-run-all prepare bench:run",
            "bench:run": "node bench.js",
            docs: "node ../../scripts/generate-readmes",
            test: "npm-run-all prepare test:*"
          }
        },
        excludePackages: [MAIN_PACKAGE]
      },
      {
        options: {
          scripts: {
            prepare: "npm-run-all prepare:*",
            "prepare:js": "tsc",
            "prepare:es":
              "tsc --outDir dist/es --module esnext --declaration false"
          }
        },
        includePackages: TS_PACKAGES
      },
      {
        options: {
          scripts: {
            prepare: "rollup -c ../../rollup.config.js",
            posttest: "node -r esm ../../scripts/validate-es5-dependencies.js"
          }
        },
        includePackages: JS_PACKAGES
      },
      {
        options: {
          scripts: {
            "test:tape": "node -r esm test.js"
          }
        },
        includePackages: TAPE_PACKAGES
      },
      {
        options: {
          scripts: {
            "test:types": "tsc --noEmit types.ts"
          }
        },
        includePackages: TYPES_PACKAGES
      }
    ]
  }
};
