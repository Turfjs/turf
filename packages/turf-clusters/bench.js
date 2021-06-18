const Benchmark = require("benchmark");
const { featureCollection, point } = require("@turf/helpers");
const {
  getCluster,
  clusterEach,
  clusterReduce,
  propertiesContainsFilter,
  filterProperties,
  applyFilter,
  createBins,
} = require("./index");

const geojson = featureCollection([
  point([0, 0], { cluster: 0 }),
  point([2, 4], { cluster: 1 }),
  point([3, 6], { cluster: 1 }),
  point([5, 1], { 0: "foo" }),
  point([4, 2], { bar: "foo" }),
  point([2, 4], {}),
  point([4, 3], undefined),
]);

/**
 * Benchmark Results
 *
 * testing -- createBins x 1,909,730 ops/sec ±2.70% (83 runs sampled)
 * testing -- propertiesContainsFilter x 10,378,738 ops/sec ±2.63% (86 runs sampled)
 * testing -- filterProperties x 26,212,665 ops/sec ±2.49% (85 runs sampled)
 * testing -- applyFilter x 21,368,185 ops/sec ±2.71% (84 runs sampled)
 * getCluster -- string filter x 3,051,513 ops/sec ±1.83% (84 runs sampled)
 * getCluster -- object filter x 673,824 ops/sec ±2.20% (86 runs sampled)
 * getCluster -- aray filter x 2,284,972 ops/sec ±1.90% (86 runs sampled)
 * clusterEach x 890,683 ops/sec ±1.48% (87 runs sampled)
 * clusterReduce x 837,383 ops/sec ±1.93% (87 runs sampled)
 */
const suite = new Benchmark.Suite("turf-clusters");

// Testing Purposes
suite
  .add("testing -- createBins", () => createBins(geojson, "cluster"))
  .add("testing -- propertiesContainsFilter", () =>
    propertiesContainsFilter({ foo: "bar", cluster: 0 }, { cluster: 0 })
  )
  .add("testing -- filterProperties", () =>
    filterProperties({ foo: "bar", cluster: 0 }, ["cluster"])
  )
  .add("testing -- applyFilter", () =>
    applyFilter({ foo: "bar", cluster: 0 }, ["cluster"])
  );

suite
  .add("getCluster -- string filter", () => getCluster(geojson, "cluster"))
  .add("getCluster -- object filter", () => getCluster(geojson, { cluster: 1 }))
  .add("getCluster -- aray filter", () => getCluster(geojson, ["cluster"]))
  .add("clusterEach", () =>
    clusterEach(geojson, "cluster", (cluster) => {
      return cluster;
    })
  )
  .add("clusterReduce", () =>
    clusterReduce(geojson, "cluster", (previousValue, cluster) => {
      return cluster;
    })
  )
  .on("cycle", (e) => console.log(String(e.target)))
  .run();
