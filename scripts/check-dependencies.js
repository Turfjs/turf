// Check dependencies to figure out which ones would require transpilation to support ES5
// This is used to create the list of packages that require transpilation when using @turf/* packages,
// which is documented in the root README.md file

var dependencyTree = require("dependency-tree");
var acorn = require("acorn");
var fs = require("fs");

const acornOpts = {
  ecmaVersion: 5,
  silent: true,
};

// from @turf/turf's cjs root, spider all of the .js dependencies
var files = dependencyTree
  .toList({
    filename: "packages/turf/dist/js/index.js",
    directory: __dirname,
  })
  .filter((file) => {
    // filter to only include files that are NOT es5 compliant already
    const source = fs.readFileSync(file, "utf8");
    try {
      acorn.parse(source, acornOpts);
      return false;
    } catch (e) {
      return true;
    }
  });

// same as above, but run through the esm files instead, since they can be different
acornOpts.sourceType = "module";
var files2 = dependencyTree
  .toList({
    filename: "packages/turf/dist/es/index.js",
    directory: __dirname,
    nodeModulesConfig: {
      entry: "module",
    },
  })
  .filter((file) => {
    // again, only keep the files that aren't already es5
    const source = fs.readFileSync(file, "utf8");
    try {
      acorn.parse(source, acornOpts);
      return false;
    } catch (e) {
      return true;
    }
  });

// take the files from the steps above and transform them into their package name
// filter out the ones that are @turf/* since we're just going to claim all of them
// as needing transpilation
var needsTranspile = Array.from(new Set([...files, ...files2]))
  .map((file) => {
    const match = file.match(/node_modules(.*)$/);
    const partial = match[1].substring(1);
    if (partial.startsWith("@")) {
      return partial.match(/^([^/]+\/[^/]+)/)[1];
    } else {
      return partial.match(/^([^/]+)/)[1];
    }
  })
  .filter((package) => !package.startsWith("@turf/"));

// get the unique list of modules and then add @turf/* to the front of the list
var simpleNeedsTranspile = Array.from(new Set(needsTranspile));
simpleNeedsTranspile.unshift("@turf/*");

// output the list of modules that need to be transpiled
console.log(simpleNeedsTranspile);
