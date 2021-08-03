const Benchmark = require("benchmark");
const {
  point,
  lineString,
  polygon,
  featureCollection,
} = require("@turf/helpers");
const clone = require("./index").default;

const fixtures = [
  point([0, 20]),
  lineString([
    [10, 40],
    [0, 20],
  ]),
  polygon([
    [
      [10, 40],
      [0, 20],
      [20, 0],
      [10, 40],
    ],
  ]),
  featureCollection([
    point([0, 20]),
    lineString([
      [10, 40],
      [0, 20],
    ]),
    polygon([
      [
        [10, 40],
        [0, 20],
        [20, 0],
        [10, 40],
      ],
    ]),
  ]),
];

/**
 * Benchmark Results
 *
 * Point: 0.380ms
 * LineString: 1.302ms
 * Polygon: 1.402ms
 * FeatureCollection: 0.293ms
 * Point                                x 1,889,028 ops/sec ±1.50% (90 runs sampled)
 * Point -- JSON.parse + JSON.stringify x 363,861 ops/sec ±1.02% (89 runs sampled)
 * LineString                                x 932,348 ops/sec ±1.34% (84 runs sampled)
 * LineString -- JSON.parse + JSON.stringify x 296,087 ops/sec ±1.07% (92 runs sampled)
 * Polygon                                x 577,070 ops/sec ±1.24% (86 runs sampled)
 * Polygon -- JSON.parse + JSON.stringify x 228,373 ops/sec ±1.03% (88 runs sampled)
 * FeatureCollection                                x 248,164 ops/sec ±1.50% (84 runs sampled)
 * FeatureCollection -- JSON.parse + JSON.stringify x 92,873 ops/sec ±0.91% (88 runs sampled)
 */
const suite = new Benchmark.Suite("turf-clone");
for (const fixture of fixtures) {
  const name = fixture.geometry ? fixture.geometry.type : fixture.type;
  console.time(name);
  clone(fixture, true);
  console.timeEnd(name);
  suite.add(name, () => clone(fixture));
  suite.add(name + " -- JSON.parse + JSON.stringify", () =>
    JSON.parse(JSON.stringify(fixture))
  );
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
