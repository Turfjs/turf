import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureCollection, point, lineString } from "@turf/helpers";
import { lineSlice } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

test("turf-line-slice", (t) => {
  for (const { filename, geojson, name } of fixtures) {
    const [linestring, start, stop] = geojson.features;
    const sliced = truncate(lineSlice(start, stop, linestring));
    sliced.properties["stroke"] = "#f0f";
    sliced.properties["stroke-width"] = 6;
    const results = featureCollection(geojson.features);
    results.features.push(sliced);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-nearest-point-on-line -- issue 2023", (t) => {
  const ptStart = point([3.69140625, 51.72702815704774]);
  const ptEnd = point([0.31936718356317106, 47.93913163509963]);
  const line = lineString([
    [3.69140625, 51.72702815704774],
    [-5.3173828125, 41.60722821271717],
  ]);

  const slice = lineSlice(ptStart, ptEnd, line);

  t.deepEqual(
    truncate(slice, { precision: 8 }).geometry.coordinates,
    [
      [3.69140625, 51.72702816],
      [-0.03079923, 48.08596086],
    ],
    "slice should be [[3.69140625, 51.72702816], [-0.03079923, 48.08596086]]"
  );
  t.end();
});
