import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import truncate from "@turf/truncate";
import { featureCollection } from "@turf/helpers";
import lineSlice from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
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

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  }
  t.end();
});
