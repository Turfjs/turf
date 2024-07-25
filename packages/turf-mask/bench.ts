import { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import Benchmark, { Event } from "benchmark";
import { mask as turfMask } from "./index.js";
import clone from "@turf/clone";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKIP = ["multi-polygon.geojson", "overlapping.geojson"];

const suite = new Benchmark.Suite("turf-mask");

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(
      path.join(directories.in, filename)
    ) as FeatureCollection<Polygon | MultiPolygon>,
  };
});

for (const { name, filename, geojson } of fixtures) {
  if (SKIP.includes(filename)) continue;

  const [polygon, masking] = geojson.features;

  const getSuite = ({ mutate }: { mutate: boolean }) => ({
    name: `${name} (mutate = ${mutate})`,
    fn: () => {
      // We clone the inputs to prevent tests from affecting each other
      turfMask(clone(polygon), clone(masking), { mutate });
    },
  });

  suite.add(getSuite({ mutate: false }));
  suite.add(getSuite({ mutate: true }));
}

/**
 * Benchmark Results:
 *
 * basic (mutate = false) x 294,373 ops/sec ±0.25% (95 runs sampled)
 * basic (mutate = true) x 307,397 ops/sec ±0.13% (97 runs sampled)
 * mask-outside (mutate = false) x 100,575 ops/sec ±0.55% (97 runs sampled)
 * mask-outside (mutate = true) x 103,180 ops/sec ±0.40% (94 runs sampled)
 */
suite
  .on("cycle", (event: Event) => {
    console.log(String(event.target));
  })
  .run();
