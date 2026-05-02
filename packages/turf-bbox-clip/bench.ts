import { bbox } from "@turf/bbox";
import { bboxClip } from "./index.ts";
import { benchFixtures } from "../../support/benchFixtures.mts";

// Benchmark Results
// linestring-single-line.geojson x 15,871,930 ops/sec ±0.24% (98 runs sampled)
// linestring.geojson x 264,962 ops/sec ±1.14% (96 runs sampled)
// multi-linestring.geojson x 7,892,547 ops/sec ±0.35% (95 runs sampled)
// multi-polygon.geojson x 138,989 ops/sec ±0.31% (98 runs sampled)
// polygon-crossing-hole.geojson x 151,793 ops/sec ±0.35% (95 runs sampled)
// polygon-holes.geojson x 142,335 ops/sec ±0.30% (96 runs sampled)
// polygon-point-intersection.geojson x 8,580,181 ops/sec ±0.73% (94 runs sampled)
// polygon.geojson x 117,120 ops/sec ±0.18% (99 runs sampled)
await benchFixtures("turf-bbox-clip", (input) =>
  bboxClip(input.features[0], bbox(input.features[1]))
);
