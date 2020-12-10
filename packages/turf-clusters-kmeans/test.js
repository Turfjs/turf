const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const centroid = require("@turf/centroid").default;
const chromatism = require("chromatism");
const concaveman = require("concaveman");
const { point, polygon, featureCollection } = require("@turf/helpers");
const { clusterReduce, clusterEach } = require("@turf/clusters");
const { coordAll, featureEach } = require("@turf/meta");
const clustersKmeans = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
  };
});

test("clusters-kmeans", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const numberOfClusters = (geojson.properties || {}).numberOfClusters;

    const clustered = clustersKmeans(geojson, {
      numberOfClusters: numberOfClusters,
    });
    const result = styleResult(clustered);

    if (process.env.REGEN)
      write.sync(directories.out + name + ".geojson", result);
    t.deepEqual(result, load.sync(directories.out + name + ".geojson"), name);
  });

  t.end();
});

const points = featureCollection([
  point([0, 0], { foo: "bar" }),
  point([2, 4], { foo: "bar" }),
  point([3, 6], { foo: "bar" }),
]);

test("clusters-kmeans -- translate properties", (t) => {
  t.equal(
    clustersKmeans(points, { numberOfClusters: 2 }).features[0].properties.foo,
    "bar"
  );
  t.end();
});

// style result
function styleResult(clustered) {
  const count = clusterReduce(clustered, "cluster", (i) => i + 1, 0);
  const colours = chromatism.adjacent(360 / count, count, "#0000FF").hex;
  const features = [];

  // Add all Point
  featureEach(clustered, function (pt) {
    const clusterId = pt.properties.cluster;
    pt.properties["marker-color"] = colours[clusterId];
    pt.properties["marker-size"] = "small";
    features.push(pt);
  });

  // Iterate over each Cluster
  clusterEach(clustered, "cluster", (cluster, clusterValue, clusterId) => {
    const color = chromatism.brightness(-25, colours[clusterId]).hex;

    // Add Centroid
    features.push(
      centroid(cluster, {
        properties: {
          "marker-color": color,
          "marker-symbol": "star-stroked",
          "marker-size": "large",
        },
      })
    );

    // Add concave polygon
    features.push(
      polygon([concaveman(coordAll(cluster))], {
        fill: color,
        stroke: color,
        "fill-opacity": 0.3,
      })
    );
  });
  return featureCollection(features);
}

test("clusters-kmeans -- allow input mutation", (t) => {
  const oldPoints = featureCollection([
    point([0, 0], { foo: "bar" }),
    point([2, 4], { foo: "bar" }),
    point([3, 6], { foo: "bar" }),
  ]);
  // No mutation
  const newPoints = clustersKmeans(points, { numberOfClusters: 3 });
  t.equal(newPoints.features[1].properties.cluster, 1, "cluster is 1");
  t.equal(
    oldPoints.features[1].properties.cluster,
    undefined,
    "cluster is undefined"
  );

  // Allow mutation
  clustersKmeans(oldPoints, { numberOfClusters: 2, mutate: true });
  t.equal(oldPoints.features[1].properties.cluster, 1, "cluster is 1");
  t.end();
});
