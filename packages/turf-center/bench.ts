import { center } from "./index.ts";
import { benchFixtures } from "../../support/benchFixtures.mts";

// Benchmark Results
// feature-collection.geojson x 27,241,658 ops/sec ±0.34% (99 runs sampled)
// imbalanced-polygon.geojson x 14,679,583 ops/sec ±0.27% (98 runs sampled)
// linestring.geojson x 34,199,495 ops/sec ±0.52% (95 runs sampled)
// point.geojson x 52,230,993 ops/sec ±0.70% (96 runs sampled)
// points-with-weights.geojson x 24,802,237 ops/sec ±0.33% (100 runs sampled)
// polygon-without-weights.geojson x 18,423,881 ops/sec ±0.28% (100 runs sampled)
// polygon.geojson x 24,990,920 ops/sec ±0.45% (99 runs sampled)
await benchFixtures("turf-center", (input) => center(input));
