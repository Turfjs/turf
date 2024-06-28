import test from "tape";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { voronoi } from "./index.js";
import { FeatureCollection, Point } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("turf-voronoi", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      const { name } = path.parse(filepath);
      const geojson = loadJsonFileSync(filepath) as FeatureCollection<Point>;
      const results = voronoi(geojson, { bbox: geojson.bbox });

      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) writeJsonFileSync(out, results);
      t.deepEqual(results, loadJsonFileSync(out), name);
    });
  t.end();
});
