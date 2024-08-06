import * as fs from "fs";
import * as util from "util";
import * as glob from "glob";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function parseAndWriteFile(fileName: string) {
  try {
    // Read file
    const data = await readFile(fileName, "utf-8");

    // JSON Parse & Stringify
    const json = JSON.parse(data);
    let jsonString = JSON.stringify(json, null, 2) + "\n";

    // combine single number arrays into a single line
    jsonString = jsonString.replace(/\[\s*(-?\d+\.?\d*e?-?\d*)\s*\]/gm, "[$1]");

    // combine two number arrays into a single line
    jsonString = jsonString.replace(
      /\[\s*(-?\d+\.?\d*e?-?\d*),\s*(-?\d+\.?\d*e?-?\d*)\s*\]/gm,
      "[$1, $2]"
    );

    // combine 3 number arrays into a single line
    jsonString = jsonString.replace(
      /\[\s*(-?\d+\.?\d*e?-?\d*),\s*(-?\d+\.?\d*e?-?\d*)\s*,\s*(-?\d+\.?\d*e?-?\d*)\s*]/gm,
      "[$1, $2, $3]"
    );

    // combine 4 number arrays into a single line
    jsonString = jsonString.replace(
      /\[\s*(-?\d+\.?\d*e?-?\d*),\s*(-?\d+\.?\d*e?-?\d*)\s*,\s*(-?\d+\.?\d*e?-?\d*)\s*,\s*(-?\d+\.?\d*e?-?\d*)\s*]/gm,
      "[$1, $2, $3, $4]"
    );

    // Write back to same file
    await writeFile(fileName, jsonString);
  } catch (err) {
    console.error(`Error processing file ${fileName}: ${err}`);
  }
}

const files: string[] = process.argv.slice(2);

if (files.length === 0) {
  glob
    .glob("**/*.{json,geojson}", { ignore: "**/node_modules/**" })
    .then((files: string[]) => {
      files.forEach((file) => parseAndWriteFile(file));
    })
    .catch((err) => {
      console.error(`Error finding files to format ${err}`);
    });
} else {
  files.forEach((file) => parseAndWriteFile(file));
}
