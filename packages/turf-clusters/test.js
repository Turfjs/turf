const test = require("tape");
const { point, featureCollection } = require("@turf/helpers");
const {
  getCluster,
  clusterEach,
  clusterReduce,
  // Below methods are not exposed in @turf/turf
  createBins,
  applyFilter,
  filterProperties,
  propertiesContainsFilter,
} = require("./index");

const properties = { foo: "bar", cluster: 0 };
const geojson = featureCollection([
  point([0, 0], { cluster: 0, foo: "null" }),
  point([2, 4], { cluster: 1, foo: "bar" }),
  point([3, 6], { cluster: 1 }),
  point([5, 1], { 0: "foo" }),
  point([4, 2], { bar: "foo" }),
  point([2, 4], {}),
  point([4, 3], undefined),
]);

test("clusters -- getCluster", (t) => {
  t.equal(getCluster(geojson, 0).features.length, 1, "number1");
  t.equal(getCluster(geojson, 1).features.length, 0, "number2");
  t.equal(getCluster(geojson, "bar").features.length, 1, "string1");
  t.equal(getCluster(geojson, "cluster").features.length, 3, "string2");
  t.equal(getCluster(geojson, { cluster: 1 }).features.length, 2, "object1");
  t.equal(getCluster(geojson, { cluster: 0 }).features.length, 1, "object2");
  t.equal(getCluster(geojson, ["cluster", { foo: "bar" }]).features.length, 1);
  t.equal(getCluster(geojson, ["cluster", "foo"]).features.length, 2);
  t.equal(getCluster(geojson, ["cluster"]).features.length, 3);
  t.end();
});

test("clusters -- clusterEach", (t) => {
  const clusters = [];
  let total = 0;
  clusterEach(geojson, "cluster", (cluster) => {
    total += cluster.features.length;
    clusters.push(cluster);
    if (!cluster.features[0]) t.fail("if feature is undefined");
  });
  t.equal(total, 3);
  t.equal(clusters.length, 2);
  t.end();
});

test("clusters -- clusterReduce", (t) => {
  const clusters = [];
  const total = clusterReduce(
    geojson,
    "cluster",
    (previousValue, cluster) => {
      clusters.push(cluster);
      return previousValue + cluster.features.length;
    },
    0
  );
  t.equal(total, 3);
  t.equal(clusters.length, 2);
  t.end();
});

test("clusters.utils -- applyFilter", (t) => {
  t.true(applyFilter(properties, "cluster"));
  t.true(applyFilter(properties, ["cluster"]));
  t.false(applyFilter(properties, { cluster: 1 }));
  t.true(applyFilter(properties, { cluster: 0 }));
  t.false(applyFilter(undefined, { cluster: 0 }));
  t.end();
});

test("clusters.utils -- filterProperties", (t) => {
  t.deepEqual(filterProperties(properties, ["cluster"]), { cluster: 0 });
  t.deepEqual(filterProperties(properties, []), {});
  t.deepEqual(filterProperties(properties, undefined), {});
  t.end();
});

test("clusters.utils -- propertiesContainsFilter", (t) => {
  t.deepEqual(propertiesContainsFilter(properties, { cluster: 0 }), true);
  t.deepEqual(propertiesContainsFilter(properties, { cluster: 1 }), false);
  t.deepEqual(propertiesContainsFilter(properties, { bar: "foo" }), false);
  t.end();
});

test("clusters.utils -- propertiesContainsFilter", (t) => {
  t.deepEqual(createBins(geojson, "cluster"), { 0: [0], 1: [1, 2] });
  t.end();
});
