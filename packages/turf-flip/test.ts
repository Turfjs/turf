import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { point } from "@turf/helpers";
import { flip } from "./index";

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

test("turf-flip", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const filename = fixture.filename;
    const geojson = fixture.geojson;
    const results = flip(geojson);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEqual(loadJsonFileSync(directories.out + filename), results, name);
  });
  t.end();
});

test("turf-flip - handle input mutation", (t) => {
  const geojson = point([120, 40]);
  flip(geojson);
  t.deepEqual(geojson, point([120, 40]), "does not mutate input");
  flip(geojson, { mutate: true });
  t.deepEqual(geojson, point([40, 120]), "does mutate input");
  t.end();
});
