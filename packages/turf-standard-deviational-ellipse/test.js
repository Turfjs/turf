import test from "tape";
import glob from "glob";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import { featureCollection } from "@turf/helpers";
import standardDeviationalEllipse from "./dist/js/index.js";

test("turf-standard-deviational-ellipse", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      // Define params
      const { name } = path.parse(filepath);
      const geojson = load.sync(filepath);
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
      if (process.env.REGEN) write.sync(out, results);
      t.deepEqual(results, load.sync(out), name);
    });
  t.end();
});

function colorize(feature, stroke = "#0A0", fill = "#FFF", opacity = 0) {
  const properties = {
    fill,
    stroke,
    "stroke-width": 3,
    "stroke-opacity": 1,
    "fill-opacity": opacity,
  };
  Object.assign(feature.properties, properties);
  return feature;
}
