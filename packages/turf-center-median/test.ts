import test from "tape";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { center } from "@turf/center";
import { truncate } from "@turf/truncate";
import { centerMean } from "@turf/center-mean";
import { centerOfMass } from "@turf/center-of-mass";
import { featureCollection, round } from "@turf/helpers";
import { centerMedian } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("turf-center-median", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      // Define params
      const { name } = path.parse(filepath);
      const geojson = loadJsonFileSync(filepath);
      const options = geojson.properties;

      // Calculate Centers
      const meanCenter = centerMean(geojson, options);
      const medianCenter = centerMedian(geojson, options);
      const extentCenter = center(geojson);
      const massCenter = centerOfMass(geojson);

      // Truncate median properties
      medianCenter.properties.medianCandidates.forEach((candidate, index) => {
        medianCenter.properties.medianCandidates[index] = [
          round(candidate[0], 6),
          round(candidate[1], 6),
        ];
      });
      const results = featureCollection([
        ...geojson.features,
        colorize(meanCenter, "#a00"),
        colorize(medianCenter, "#0a0"),
        colorize(extentCenter, "#00a"),
        colorize(massCenter, "#aaa"),
      ]);

      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) writeJsonFileSync(out, results);
      t.deepEqual(results, loadJsonFileSync(out), name);
    });
  t.end();
});

function colorize(point, color) {
  point.properties["marker-color"] = color;
  point.properties["marker-symbol"] = "cross";
  return truncate(point);
}
