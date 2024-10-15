import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureCollection, point, lineString } from "@turf/helpers";
import { greatCircle } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

test("turf-great-circle", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const filename = fixture.filename;
    const geojson = fixture.geojson;
    const start = geojson.features[0];
    const end = geojson.features[1];
    const line = truncate(greatCircle(start, end));
    const results = featureCollection([line, start, end]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

test("turf-great-circle with same input and output", (t) => {
  const start = point([0, 0]);
  const end = point([0, 0]);
  const line = greatCircle(start, end, {
    npoints: 4,
  });

  t.deepEquals(
    lineString([
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ]),
    line
  );

  t.end();
});
