import { buffer } from "./index.ts";
import { benchFixtures } from "../../support/benchFixtures.mts";

// Benchmark Results
// feature-collection-points.geojson x 10,741 ops/sec ±0.84% (96 runs sampled)
// geometry-collection-points.geojson x 16,229 ops/sec ±0.47% (99 runs sampled)
// issue-#783.geojson x 18,447 ops/sec ±0.27% (97 runs sampled)
// issue-#801-Ecuador.geojson x 27,774 ops/sec ±0.41% (97 runs sampled)
// issue-#801.geojson x 27,382 ops/sec ±0.18% (99 runs sampled)
// issue-#815.geojson x 42,241 ops/sec ±0.27% (98 runs sampled)
// issue-#900.geojson x 9,042 ops/sec ±0.32% (96 runs sampled)
// issue-#916.geojson x 23,689 ops/sec ±0.52% (97 runs sampled)
// linestring.geojson x 36,095 ops/sec ±0.41% (95 runs sampled)
// multi-linestring.geojson x 7,168 ops/sec ±0.15% (99 runs sampled)
// multi-point.geojson x 21,735 ops/sec ±0.60% (99 runs sampled)
// multi-polygon.geojson x 13,019 ops/sec ±0.18% (93 runs sampled)
// negative-buffer.geojson x 46,876 ops/sec ±0.19% (100 runs sampled)
// north-latitude-points.geojson x 16,680 ops/sec ±0.17% (98 runs sampled)
// northern-polygon.geojson x 46,875 ops/sec ±0.15% (99 runs sampled)
// point.geojson x 59,494 ops/sec ±0.17% (96 runs sampled)
// polygon-with-holes.geojson x 30,772 ops/sec ±0.59% (98 runs sampled)
benchFixtures("turf-buffer", (input) => buffer(input, 50, { units: "miles" }));
