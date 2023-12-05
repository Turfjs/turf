import test from "tape";
import { glob } from "glob";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { voronoi } from "./index";

test("turf-voronoi", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      const { name } = path.parse(filepath);
      const geojson = loadJsonFileSync(filepath);
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
