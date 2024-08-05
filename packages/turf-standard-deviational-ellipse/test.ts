import { Feature, FeatureCollection, Point } from "geojson";
import test from "tape";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { featureCollection } from "@turf/helpers";
import { standardDeviationalEllipse } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("turf-standard-deviational-ellipse", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      // Define params
      const { name } = path.parse(filepath);
      const geojson = loadJsonFileSync(filepath) as FeatureCollection<Point> & {
        options: any;
        esriEllipse: any;
      }; // Non-standard FeatureCollection options used for testing.
      const options = geojson.options;
      // Optional: ESRI Polygon in GeoJSON test/in to compare results
      const esriEllipse = geojson.esriEllipse;

      // Colorized results
      const results = featureCollection([
        colorize(standardDeviationalEllipse(geojson, options)),
      ]);
      if (esriEllipse)
        results.features.unshift(colorize(esriEllipse, "#A00", "#A00", 0.5));

      // Save to file
      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) writeJsonFileSync(out, results);
      t.deepEqual(results, loadJsonFileSync(out), name);
    });
  t.end();
});

function colorize(
  feature: Feature,
  stroke = "#0A0",
  fill = "#FFF",
  opacity = 0
) {
  const properties = {
    fill,
    stroke,
    "stroke-width": 3,
    "stroke-opacity": 1,
    "fill-opacity": opacity,
  };
  // Make sure feature properties is defined.
  feature.properties = feature.properties ?? {};
  Object.assign(feature.properties, properties);
  return feature;
}
