import { area } from "./index.js";
import { benchFixtures } from "../../support/benchFixtures.mts";

// Benchmark Results
// polygon.geojson x 22,944,912 ops/sec ±0.28% (98 runs sampled)
await benchFixtures("turf-area", (input) => area(input));
