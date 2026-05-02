import { bezierSpline } from "./index.ts";
import { benchFixtures } from "../../support/benchFixtures.mts";

// Benchmark Results
// linestring-single-line.geojson x 15,443,284 ops/sec ±0.31% (101 runs sampled)
// linestring.geojson x 264,982 ops/sec ±0.37% (98 runs sampled)
// multi-linestring.geojson x 7,798,170 ops/sec ±0.46% (100 runs sampled)
// multi-polygon.geojson x 135,112 ops/sec ±0.20% (98 runs sampled)
// polygon-crossing-hole.geojson x 152,794 ops/sec ±0.25% (99 runs sampled)
// polygon-holes.geojson x 140,602 ops/sec ±0.21% (99 runs sampled)
// polygon-point-intersection.geojson x 8,323,552 ops/sec ±0.61% (100 runs sampled)
// polygon.geojson x 116,567 ops/sec ±0.20% (96 runs sampled)
await benchFixtures("turf-bezier-spline", (input) => bezierSpline(input));
