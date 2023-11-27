import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { mask } from "./index";

const SKIP = ["multi-polygon.geojson", "overlapping.geojson"];

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(path.join(directories.in, filename)),
  };
});

test("turf-mask", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    if (-1 !== SKIP.indexOf(filename)) {
      continue;
    }

    const [polygon, masking] = geojson.features;
    const results = mask(polygon, masking);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});
