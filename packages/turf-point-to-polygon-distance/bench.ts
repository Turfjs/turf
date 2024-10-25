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
 * multi-polygon - outer x 16,672 ops/sec ±0.24% (98 runs sampled)
 * multi-polygon - inner1 x 16,442 ops/sec ±0.65% (100 runs sampled)
 * multi-polygon - inner2 x 16,172 ops/sec ±1.01% (97 runs sampled)
 * multi-polygon - inner3-close-to-hole x 16,405 ops/sec ±0.19% (99 runs sampled)
 * multi-polygon - in-hole-close-to-poly-in-hole x 16,597 ops/sec ±0.15% (99 runs sampled)
 * multi-polygon - in-hole-close-to-hole-border x 16,319 ops/sec ±0.14% (99 runs sampled)
 * multi-polygon - in-poly-in-hole x 16,857 ops/sec ±0.19% (101 runs sampled)
 * simple-polygon - outer x 117,860 ops/sec ±0.12% (102 runs sampled)
 * simple-polygon - inner x 121,045 ops/sec ±0.15% (100 runs sampled)
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
