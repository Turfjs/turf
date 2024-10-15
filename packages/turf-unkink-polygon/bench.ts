import { Feature, FeatureCollection, Polygon } from "geojson";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import Benchmark, { Event } from "benchmark";
import { unkinkPolygon as unkink } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  const geojson: FeatureCollection<Polygon> | Feature<Polygon> =
    loadJsonFileSync(directories.in + filename);
  return { filename, geojson };
});

const suite = new Benchmark.Suite("unkink-polygon");

// Add all fixtures to Benchmark
for (const fixture of fixtures) {
  suite.add(fixture.filename, () => unkink(fixture.geojson));
}

suite
  .on("cycle", (event: Event) => {
    console.log(String(event.target));
  })
  .run();
