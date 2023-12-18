import test from "tape";
import fs from "fs";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureCollection } from "@turf/helpers";
import { sector } from "./index";

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

test("turf-sector", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const { radius, bearing1, bearing2 } = geojson.properties;
    const sectored = colorize(
      truncate(sector(geojson, radius, bearing1, bearing2))
    );
    const results = featureCollection([geojson, sectored]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

function colorize(feature, color = "#FF0", width = 10) {
  feature.properties = {
    stroke: "#000000",
    "stroke-width": width,
    "stroke-opacity": 1,
    fill: color,
    "fill-opacity": 0.8,
  };
  return feature;
}
