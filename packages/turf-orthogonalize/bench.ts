import { Feature, MultiPolygon, Polygon } from "geojson";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import Benchmark, { Event } from "benchmark";
import { orthogonalize } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directory = path.join(__dirname, "test", "in") + path.sep;
const fixtures = fs.readdirSync(directory).map((filename) => {
  return {
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directory + filename) as Feature<
      Polygon | MultiPolygon
    >,
  };
});

const suite = new Benchmark.Suite("turf-orthogonalize");
for (const { name, geojson } of fixtures) {
  suite.add(name, () => orthogonalize(geojson, geojson.properties ?? {}));
}

suite.on("cycle", (e: Event) => console.log(String(e.target))).run();
