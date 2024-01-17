import test from "tape";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureEach } from "@turf/meta";
import { featureCollection } from "@turf/helpers";
import { pointOnFeature } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("turf-point-on-feature", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      const { name } = path.parse(filepath);
      const geojson = loadJsonFileSync(filepath);
      const ptOnFeature = pointOnFeature(geojson);

      // Style Results
      const results = featureCollection([]);
      featureEach(geojson, (feature) => results.features.push(feature));
      ptOnFeature.properties["marker-color"] = "#F00";
      ptOnFeature.properties["marker-style"] = "star";
      results.features.push(truncate(ptOnFeature));

      // Save Tests
      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) writeJsonFileSync(out, results);
      t.deepEqual(results, loadJsonFileSync(out), name);
    });
  t.end();
});
