import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import truncate from "@turf/truncate";
import { featureCollection } from "@turf/helpers";
import greatCircle from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(path.join(directories.in, filename)),
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

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  });
  t.end();
});
