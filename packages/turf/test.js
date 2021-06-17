const fs = require("fs");
const path = require("path");
const glob = require("glob");
const test = require("tape");
const camelcase = require("camelcase");
const documentation = require("documentation");
const turf = require("./dist/js/index.js");

// Helpers
const directory = path.join(__dirname, "..");
let modules = [];
for (const name of fs.readdirSync(directory)) {
  if (!name.includes("turf")) continue;
  const pckgPath = path.join(directory, name, "package.json");

  if (!fs.existsSync(pckgPath)) continue;
  const pckg = JSON.parse(fs.readFileSync(pckgPath));

  let mainFile = path.join(directory, name, pckg.main);
  if (!fs.existsSync(mainFile)) {
    mainFile += ".js";
  }

  const index = fs.readFileSync(mainFile, "utf8");
  const test = fs.readFileSync(path.join(directory, name, "test.js"), "utf8");

  modules.push({
    name,
    pckg,
    index,
    test,
    dir: path.join(directory, name),
    dependencies: pckg.dependencies || {},
    devDependencies: pckg.devDependencies || {},
  });
}
// Exclude main Turf module
modules = modules.filter(({ name }) => name !== "turf");

test("turf -- invalid dependencies", (t) => {
  for (const { name, dependencies, devDependencies } of modules) {
    for (const invalidDependency of [
      "load-json-file",
      "write-json-file",
      "tape",
      "benchmark",
      "glob",
      "lerna",
      "documentation",
      "uglify-js",
    ]) {
      if (dependencies[invalidDependency])
        t.fail(
          `${name} ${invalidDependency} should be defined as devDependencies`
        );
    }
    if (devDependencies["eslint"] || devDependencies["eslint-config-mourner"])
      t.fail(`${name} eslint is handled at the root level`);
    if (devDependencies["@turf/helpers"])
      t.fail(
        `${name} @turf/helpers should be located in Dependencies instead of DevDependencies`
      );
    // if (devDependencies['mkdirp']) t.fail(`${name} tests should not have to create folders`);
  }
  t.skip('remove "mkdirp" from testing');
  t.end();
});

test("turf -- strict version dependencies", (t) => {
  for (const { name, dependencies } of modules) {
    if (dependencies["jsts"]) t.fail(name + " jsts must use turf-jsts");
    if (dependencies["jsts-es"]) t.fail(name + " jsts-es must use turf-jsts");
  }
  t.end();
});

test("turf -- duplicate dependencies", (t) => {
  for (const { name, dependencies, devDependencies } of modules) {
    for (const dependency of Object.keys(dependencies)) {
      if (devDependencies[dependency])
        t.fail(`${name} ${dependency} is duplicated in devDependencies`);
    }
  }
  t.end();
});

test("turf -- check if files exists", (t) => {
  for (const { name, dir, pckg } of modules) {
    const { files } = pckg;
    if (!files || !files.length)
      t.fail(`${name} (files) must be included in package.json`);
    for (const file of files) {
      // ignore Rollup bundle
      if (file === "main.js") continue;
      if (file === "main.es.js") continue;
      if (file === "index.d.ts") continue;
      if (!fs.existsSync(path.join(dir, file)))
        t.fail(`${name} missing file ${file} in "files"`);
    }
  }
  t.end();
});

test("turf -- external files must be in the lib folder", (t) => {
  for (const { pckg } of modules) {
    const { files } = pckg;
    for (const file of files) {
      switch (file) {
        case "main.js":
        case "main.es.js":
        case "index.js":
        case "index.ts":
        case "index.mjs":
        case "index.d.ts":
        case "lib":
          break;
        default:
        // t.fail(`${name} external files must be in the lib folder`)
      }
    }
  }
  t.end();
});

test("turf -- MIT license", (t) => {
  const text = fs.readFileSync(path.join(__dirname, "LICENSE"), "utf8");
  for (const { name, dir, pckg } of modules) {
    const { license } = pckg;
    if (license !== "MIT") t.fail(`${name} (license) must be "MIT"`);
    if (fs.readFileSync(path.join(dir, "LICENSE"), "utf8") !== text)
      t.fail(`${name} (LICENSE) is different from @turf/turf`);
  }
  t.end();
});

test("turf -- contributors", (t) => {
  for (const { name, pckg } of modules) {
    for (const contributor of pckg.contributors || []) {
      if (!contributor.match(/<@.+>/))
        t.fail(
          `${name} ${contributor} (contributors) should use "Full Name <@GitHub>"`
        );
    }
  }
  t.end();
});

test("turf -- scoped package name", (t) => {
  for (const { name, pckg } of modules) {
    const expected = name.replace("turf-", "@turf/");
    if (pckg.name !== expected)
      t.fail(`${name} (name) must use ${expected} in package.json`);
  }
  t.end();
});

test("turf -- pre-defined attributes in package.json", (t) => {
  for (const { name, pckg } of modules) {
    if (pckg.author !== "Turf Authors")
      t.fail(name + ' (author) should be "Turf Authors"');
    // if (pckg.main !== 'main.js') t.skip(`${name} (main) must be "main.js" in package.json`);
    // if (pckg.module !== 'main.es.js') t.skip(`${name} (module) must be "main.es.js" in package.json`);
    if (pckg["jsnext:main"])
      t.fail(
        `${name} (jsnext:main) is no longer required in favor of using (module) in package.json`
      );
    // if (pckg.types !== 'index.d.ts') t.fail(`${name} (types) must be "index.d.ts" in package.json`);
    if (!pckg.bugs || pckg.bugs.url !== "https://github.com/Turfjs/turf/issues")
      t.fail(
        `${name} (bugs.url) must be "https://github.com/Turfjs/turf/issues" in package.json`
      );
    if (pckg.homepage !== "https://github.com/Turfjs/turf")
      t.fail(
        `${name} (homepage) must be "https://github.com/Turfjs/turf" in package.json`
      );
  }
  t.end();
});

test("turf -- parsing dependencies from index.js", (t) => {
  for (const { name, dependencies, index } of modules) {
    // Read Depedencies from index.js
    const dependenciesUsed = new Set();
    for (const dependency of index.match(/(require\(|from )'[@/a-z-\d]+'/gi) ||
      []) {
      if (dependency.includes("jsts")) continue;
      const dependencyName = dependency.split(/'/)[1];
      if (!dependencies[dependencyName])
        t.skip(`${name} ${dependencyName} is missing from dependencies`);
      if (dependenciesUsed.has(dependencyName))
        t.skip(`${name} ${dependencyName} is duplicated in index.js`);
      dependenciesUsed.add(dependencyName);
    }

    // Read Dependencies from package.json
    for (const dependencyName of Object.keys(dependencies)) {
      // Ignore @turf/helpers since it could be used in Typescript definition
      switch (dependencyName) {
        case "@turf/helpers":
        case "@turf/invariant":
        case "@turf/meta":
        case "jsts":
        case "rbush":
        case "topojson-client":
        case "topojson-server":
          continue;
      }
      if (!dependenciesUsed.has(dependencyName))
        t.skip(`${name} ${dependencyName} is not required in index.js`);
    }
  }
  t.end();
});

// Test for missing modules
test("turf -- missing modules", (t) => {
  const files = {
    typescript: fs.readFileSync(path.join(__dirname, "index.d.ts")),
    modules: fs.readFileSync(path.join(__dirname, "dist/js/index.js")),
  };

  modules.forEach(({ name }) => {
    name = camelcase(name.replace("turf-", ""));
    // name exception with linestring => lineString
    name = name
      .replace("linestring", "lineString")
      .replace("Linestring", "LineString");

    // if (!files.typescript.includes(name)) t.skip(name + ' is missing from index.d.ts');
    if (!files.modules.includes(name))
      t.skip(name + " is missing from index.js");

    switch (typeof turf[name]) {
      case "function":
        break;
      case "object":
        break;
      case "undefined":
        t.skip(name + " is missing from index.js");
    }
  });
  t.end();
});

const deprecated = {
  modules: [
    "@turf/idw",
    "@turf/line-distance",
    "@turf/point-on-line",
    "@turf/bezier",
    "@turf/within",
    "@turf/inside",
    "@turf/nearest",
    "@turf/polygon-to-linestring",
    "@turf/linestring-to-polygon",
    "@turf/point-on-surface",
  ],
  methods: [
    "radians2degrees",
    "degrees2radians",
    "distanceToDegrees",
    "distanceToRadians",
    "radiansToDistance",
    "bearingToAngle",
    "convertDistance",
  ],
};

test("turf -- check for deprecated modules", (t) => {
  for (const { name, dependencies, devDependencies } of modules) {
    for (const dependency of [
      ...Object.keys(dependencies),
      ...Object.keys(devDependencies),
    ]) {
      if (deprecated.modules.indexOf(dependency) !== -1) {
        throw new Error(
          `${name} module has deprecated dependency ${dependency}`
        );
      }
    }
  }
  t.end();
});

test("turf -- check for deprecated methods", (t) => {
  for (const { name, index, test } of modules) {
    // Exclude @turf/helpers from this test
    if (name === "turf-helpers") continue;
    for (const method of deprecated.methods) {
      if ((test + index).match(method))
        throw new Error(`${name} repo has deprecated method ${method}`);
    }
  }
  t.end();
});

// TurfJS v5.0 Typescript definition uses @turf/helpers
test("turf -- update to newer Typescript definitions", (t) => {
  glob.sync(turfTypescriptPath).forEach((filepath) => {
    const typescript = fs.readFileSync(filepath, "utf8");
    if (typescript.includes('reference types="geojson"'))
      t.skip(filepath + " update Typescript definition v5.0");
  });
  t.end();
});

// test('turf -- require() not allowed in favor of import', t => {
//     for (const {name, index, test} of modules) {
//         if ((index).includes('= require(')) throw new Error(`${name} module cannot use require(), use ES import instead`);
//     }
//     t.end();
// });

/**
 * =========================
 * Builds => test.example.js
 * =========================
 * will be run as `posttest`
 */

// File Paths
const testFilePath = path.join(__dirname, "test.example.js");
const turfModulesPath = path.join(__dirname, "..", "turf-*", "index.js");
const turfTypescriptPath = path.join(__dirname, "..", "turf-*", "index.d.ts");

// Test Strings
const requireString = `const test = require('tape');
const turf = require('./dist/js/index.js');
`;

/**
 * Generate Test String
 *
 * @param {Object} turfFunction Documentation function object
 * @param {Object} example Documentation example object
 * @returns {string} Test String
 */
function testString(turfFunction, example) {
  const turfName = turfFunction.name;
  const testFunctionName = turfName + "Test";

  // New modules will be excluded from tests
  if (!turf[turfName])
    return `
test('turf-example-${turfName}', t => {
    t.skip('${turfName}');
    t.end();
});
`;
  // Specific moduels will exclude testing @example
  switch (turfName) {
    case "isolines":
    case "isobands":
      return `
        test('turf-example-${turfName}', t => {
            t.skip('${turfName}');
            t.end();
        });
        `;
  }
  return `
test('turf-example-${turfName}', t => {
    const ${testFunctionName} = () => {
        ${example.description}
    }
    ${testFunctionName}();
    t.pass('${turfName}');
    t.end();
});
`;
}

// Iterate over each module and retrieve @example to build tests from them
glob(turfModulesPath, (err, files) => {
  if (err) throw err;

  // Read each JSDocs from index.js files
  documentation.build(files, {}).then((turfFunctions) => {
    if (err) throw err;

    // Write header of test.js
    const writeableStream = fs.createWriteStream(testFilePath);
    writeableStream.write(requireString);
    writeableStream.on("error", (err) => {
      throw err;
    });

    // Retrieve @example
    turfFunctions.forEach((turfFunction) => {
      if (turfFunction.examples) {
        // Save to test.js
        turfFunction.examples.forEach((example) => {
          writeableStream.write(testString(turfFunction, example));
        });
      }
    });
    writeableStream.end();
  });
});
