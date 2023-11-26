import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { area } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});

test("turf-area", (t) => {
  for (const fixture of fixtures) {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const results = Math.round(area(geojson));
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + name + ".json", results);
    t.equal(results, loadJsonFileSync(directories.out + name + ".json"), name);
  }
  t.end();
});
