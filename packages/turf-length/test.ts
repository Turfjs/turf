import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { length } from "./index.js";

const directories = {
  in: path.join("test", "in") + path.sep,
  out: path.join("test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});

test("turf-length", (t) => {
  for (const { name, geojson } of fixtures) {
    const results = Math.round(length(geojson, { units: "feet" }));
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + name + ".json", results);
    t.equal(results, loadJsonFileSync(directories.out + name + ".json"), name);
  }
  t.end();
});
