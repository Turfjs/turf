import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { centroid } from "@turf/centroid";
import { featureEach } from "@turf/meta";
import { featureCollection } from "@turf/helpers";
import { nearestNeighborAnalysis } from "./index";

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

test("turf-nearest-neighbor", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const options = geojson.options;
    const results = featureCollection([]);
    featureEach(geojson, (feature) => results.features.push(truncate(feature)));
    if (geojson.features[0].geometry.type === "Polygon") {
      featureEach(geojson, (feature) =>
        results.features.push(
          truncate(
            centroid(feature, { properties: { "marker-color": "#0a0" } })
          )
        )
      );
    }
    results.features.push(truncate(nearestNeighborAnalysis(geojson, options)));
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEqual(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});
