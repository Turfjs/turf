const Benchmark = require("benchmark");
const random = require("@turf/random");
const meta = require("./index");

const fixtures = {
  point: random.randomPoint(),
  points: random.randomPoint(1000),
  polygon: random.randomPolygon(),
  polygons: random.randomPolygon(1000),
};

const suite = new Benchmark.Suite("turf-meta");

/**
 * Benchmark Results
 * segmentEach   - point x 3,541,484 ops/sec ±6.03% (88 runs sampled)
 * segmentReduce - point x 3,245,821 ops/sec ±0.95% (86 runs sampled)
 * flattenEach   - point x 6,447,234 ops/sec ±5.56% (79 runs sampled)
 * flattenReduce - point x 5,415,555 ops/sec ±1.28% (85 runs sampled)
 * coordEach     - point x 19,941,547 ops/sec ±0.64% (84 runs sampled)
 * coordReduce   - point x 11,959,189 ops/sec ±1.53% (85 runs sampled)
 * propEach      - point x 29,317,809 ops/sec ±1.38% (85 runs sampled)
 * propReduce    - point x 14,552,839 ops/sec ±1.06% (90 runs sampled)
 * geomEach      - point x 22,137,140 ops/sec ±0.95% (88 runs sampled)
 * geomReduce    - point x 12,416,033 ops/sec ±0.94% (88 runs sampled)
 * featureEach   - point x 29,588,658 ops/sec ±1.02% (88 runs sampled)
 * featureReduce - point x 15,372,497 ops/sec ±1.11% (89 runs sampled)
 * coordAll      - point x 8,348,718 ops/sec ±0.68% (92 runs sampled)
 * segmentEach   - points x 7,568 ops/sec ±1.42% (90 runs sampled)
 * segmentReduce - points x 7,719 ops/sec ±0.88% (90 runs sampled)
 * flattenEach   - points x 18,821 ops/sec ±7.17% (76 runs sampled)
 * flattenReduce - points x 17,848 ops/sec ±1.10% (88 runs sampled)
 * coordEach     - points x 71,017 ops/sec ±0.80% (90 runs sampled)
 * coordReduce   - points x 46,986 ops/sec ±1.24% (91 runs sampled)
 * propEach      - points x 137,509 ops/sec ±0.38% (96 runs sampled)
 * propReduce    - points x 67,197 ops/sec ±1.44% (92 runs sampled)
 * geomEach      - points x 69,417 ops/sec ±0.77% (93 runs sampled)
 * geomReduce    - points x 45,830 ops/sec ±1.18% (92 runs sampled)
 * featureEach   - points x 151,234 ops/sec ±0.45% (92 runs sampled)
 * featureReduce - points x 71,235 ops/sec ±1.51% (92 runs sampled)
 * coordAll      - points x 40,960 ops/sec ±0.88% (94 runs sampled)
 * segmentEach   - polygon x 884,579 ops/sec ±2.06% (82 runs sampled)
 * segmentReduce - polygon x 770,112 ops/sec ±1.65% (85 runs sampled)
 * flattenEach   - polygon x 6,262,904 ops/sec ±2.84% (85 runs sampled)
 * flattenReduce - polygon x 4,944,606 ops/sec ±4.15% (82 runs sampled)
 * coordEach     - polygon x 6,153,922 ops/sec ±2.36% (87 runs sampled)
 * coordReduce   - polygon x 3,348,489 ops/sec ±2.08% (91 runs sampled)
 * propEach      - polygon x 30,816,868 ops/sec ±0.96% (88 runs sampled)
 * propReduce    - polygon x 15,664,358 ops/sec ±0.88% (91 runs sampled)
 * geomEach      - polygon x 21,426,447 ops/sec ±1.19% (91 runs sampled)
 * geomReduce    - polygon x 11,585,812 ops/sec ±2.61% (84 runs sampled)
 * featureEach   - polygon x 29,478,632 ops/sec ±1.86% (87 runs sampled)
 * featureReduce - polygon x 14,642,632 ops/sec ±2.62% (81 runs sampled)
 * coordAll      - polygon x 2,080,425 ops/sec ±13.27% (61 runs sampled)
 * segmentEach   - polygons x 1,042 ops/sec ±3.16% (76 runs sampled)
 * segmentReduce - polygons x 912 ops/sec ±4.70% (80 runs sampled)
 * flattenEach   - polygons x 17,587 ops/sec ±3.05% (85 runs sampled)
 * flattenReduce - polygons x 16,576 ops/sec ±1.33% (86 runs sampled)
 * coordEach     - polygons x 3,040 ops/sec ±15.62% (41 runs sampled)
 * coordReduce   - polygons x 4,100 ops/sec ±7.31% (85 runs sampled)
 * propEach      - polygons x 126,455 ops/sec ±0.85% (87 runs sampled)
 * propReduce    - polygons x 61,469 ops/sec ±2.96% (83 runs sampled)
 * geomEach      - polygons x 59,267 ops/sec ±5.22% (81 runs sampled)
 * geomReduce    - polygons x 24,424 ops/sec ±12.17% (52 runs sampled)
 * featureEach   - polygons x 110,212 ops/sec ±7.42% (71 runs sampled)
 * featureReduce - polygons x 63,244 ops/sec ±3.74% (81 runs sampled)
 * coordAll      - polygons x 1,662 ops/sec ±19.73% (44 runs sampled)
 * findSegment   - polygon x 2,558,258 ops/sec ±0.80% (84 runs sampled)
 * findSegment   - polygons x 2,512,410 ops/sec ±0.72% (93 runs sampled)
 * findPoint     - point x 2,339,238 ops/sec ±0.86% (85 runs sampled)
 * findPoint     - points x 2,298,279 ops/sec ±1.13% (88 runs sampled)
 * findPoint     - polygon x 2,216,808 ops/sec ±1.63% (86 runs sampled)
 * findPoint     - polygons x 2,160,583 ops/sec ±1.06% (87 runs sampled)
 */
Object.keys(fixtures).forEach((name) => {
  const geojson = fixtures[name];
  const noop = () => {
    /* no-op */
  };
  suite
    .add("segmentEach   - " + name, () => meta.segmentEach(geojson, noop))
    .add("segmentReduce - " + name, () => meta.segmentReduce(geojson, noop))
    .add("flattenEach   - " + name, () => meta.flattenEach(geojson, noop))
    .add("flattenReduce - " + name, () => meta.flattenReduce(geojson, noop))
    .add("coordEach     - " + name, () => meta.coordEach(geojson, noop))
    .add("coordReduce   - " + name, () => meta.coordReduce(geojson, noop))
    .add("propEach      - " + name, () => meta.propEach(geojson, noop))
    .add("propReduce    - " + name, () => meta.propReduce(geojson, noop))
    .add("geomEach      - " + name, () => meta.geomEach(geojson, noop))
    .add("geomReduce    - " + name, () => meta.geomReduce(geojson, noop))
    .add("featureEach   - " + name, () => meta.featureEach(geojson, noop))
    .add("featureReduce - " + name, () => meta.featureReduce(geojson, noop))
    .add("coordAll      - " + name, () => meta.coordAll(geojson))
    .add("findSegment   - " + name, () => meta.findSegment(geojson))
    .add("findPoint     - " + name, () => meta.findPoint(geojson));
});

suite.on("cycle", (e) => console.log(String(e.target))).run();
