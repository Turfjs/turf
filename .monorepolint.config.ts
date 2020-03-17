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
    ":alphabetical-scripts": {},

    ":package-entry": [
      {
        options: {
          entries: {
            main: "dist/js/index.js",
            types: "dist/js/index.d.ts",
            files: ["dist"]
          }
        },
        includePackages: TS_PACKAGES
      },
      {
        options: {
          entries: {
            main: "dist/js/index.js",
            module: "dist/es/index.js",
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
            bench: "npm-run-all prepare bench:run",
            "bench:run": "node bench.js",
            docs: "node ../../scripts/generate-readmes",
            prepare: "tsc",
            pretest: "tsc"
          }
        },
        includePackages: TS_PACKAGES
      },
      {
        options: {
          scripts: {
            pretest: "rollup -c ../../rollup.config.js",
            posttest: "node -r esm ../../scripts/validate-es5-dependencies.js"
          }
        },
        includePackages: JS_PACKAGES
      }
    ]
  }
};
