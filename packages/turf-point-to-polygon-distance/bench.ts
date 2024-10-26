import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import Benchmark from "benchmark";
import { pointToPolygonDistance } from "./index.js";
import { featureCollection } from "@turf/helpers";
import {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "test_fixtures") + path.sep;

const fixtures = fs.readdirSync(fixturesPath).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(fixturesPath + filename),
  };
});

/**
 * Benchmark Results
 *
 * long-lines-poly - pointA x 154,135 ops/sec ±0.36% (96 runs sampled)
 * long-lines-poly - pointB x 167,645 ops/sec ±0.30% (98 runs sampled)
 * long-lines-poly - pointC x 164,454 ops/sec ±0.25% (100 runs sampled)
 * multi-polygon - outer x 16,604 ops/sec ±0.22% (97 runs sampled)
 * multi-polygon - inner1 x 16,428 ops/sec ±0.20% (99 runs sampled)
 * multi-polygon - inner2 x 16,329 ops/sec ±0.19% (100 runs sampled)
 * multi-polygon - inner3-close-to-hole x 16,409 ops/sec ±0.26% (99 runs sampled)
 * multi-polygon - in-hole-close-to-poly-in-hole x 16,589 ops/sec ±0.27% (101 runs sampled)
 * multi-polygon - in-hole-close-to-hole-border x 16,251 ops/sec ±0.26% (98 runs sampled)
 * multi-polygon - in-poly-in-hole x 16,763 ops/sec ±0.50% (98 runs sampled)
 * simple-polygon - outer x 118,008 ops/sec ±0.17% (101 runs sampled)
 * simple-polygon - inner x 121,173 ops/sec ±0.17% (99 runs sampled)
 **/
const suite = new Benchmark.Suite("turf-point-to-polygon-distance");

for (const { name, geojson } of fixtures) {
  // @ts-expect-error geojson
  const fc = featureCollection(geojson?.features || []);
  const points = fc.features.filter(
    (f): f is Feature<Point, GeoJsonProperties> => f.geometry.type === "Point"
  );
  const polygon = fc.features.find((f) =>
    ["Polygon", "MultiPolygon"].includes(f.geometry.type)
  ) as Feature<Polygon | MultiPolygon, GeoJsonProperties>;
  if (!polygon) {
    throw new Error(`No polygon found in the feature collection in ${name}`);
  }
  for (const point of points) {
    const caseName = `${name} - ${point.properties?.name || "unnamed point"}`;
    suite.add(caseName, () => {
      pointToPolygonDistance(point, polygon);
    });
  }
}
// @ts-expect-error benchmark
suite.on("cycle", (e) => console.log(String(e.target))).run();
