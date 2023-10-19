#!/usr/bin/env node

/**
 * This script adds '.js' extensions to our dist/es output for relative path imports.
 *
 * This is a workaround that gives us fully specified ES import statements in our output
 * while allowing our internal-facing code to be a little looser. Specifically in Typescript
 * modules, we would normally use .js as an extension for our other typescript code, but
 * that actually causes issues with ts-node's importing of the .ts files.
 */

const glob = require("glob");
const fs = require("fs");

const RELATIVE_IMPORT_REGEX = /^import (.*) from "(\.\/.*)";$/gm;

glob("packages/**/dist/es/**/*.js", (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    for (const file of files) {
      fs.readFile(file, (err, data) => {
        if (err) {
          console.error(`Error reading ${file}`, err);
        }

        const contents = data.toString();

        // replace any imports
        let count = 0;
        const output = contents.replace(
          RELATIVE_IMPORT_REGEX,
          (_match, imports, specifier) => {
            count++;
            return `import ${imports} from "${specifier}.js";`;
          }
        );

        if (count > 0) {
          console.log(`Updated ${count} import(s) for ${file}`);
          fs.writeFile(file, output, (err) => {
            if (err) {
              console.error(`Failed to write ${file}`, err);
              process.exit(1);
            }
          });
        }
      });
    }
  }
});
