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
const clustersDbscan = require("./index").default;

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

test("clusters-dbscan", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const filename = fixture.filename;
    const geojson = fixture.geojson;
    const properties = geojson.properties || {};
    const distance = properties.distance || 100;
    const minPoints = properties.minPoints;
    const units = properties.units;

    // console.log(geojson.features.length);
    const clustered = clustersDbscan(geojson, distance, {
      units: units,
      minPoints: minPoints,
    });
    const result = styleResult(clustered);

    if (process.env.REGEN) write.sync(directories.out + filename, result);
    t.deepEqual(result, load.sync(directories.out + filename), name);
  });

  t.end();
});

const points = featureCollection([
  point([0, 0], { foo: "bar" }),
  point([2, 4], { foo: "bar" }),
  point([3, 6], { foo: "bar" }),
]);

test("clusters-dbscan -- prevent input mutation", (t) => {
  clustersDbscan(points, 2, { units: "kilometers", minPoints: 1 });
  t.true(
    points.features[0].properties.cluster === undefined,
    "cluster properties should be undefined"
  );
  t.end();
});

test("clusters-dbscan -- translate properties", (t) => {
  t.equal(
    clustersDbscan(points, 2, { units: "kilometers", minPoints: 1 }).features[0]
      .properties.foo,
    "bar"
  );
  t.end();
});

// style result
function styleResult(clustered) {
  const count = clusterReduce(clustered, "cluster", (i) => i + 1, 0);
  const colours = chromatism.adjacent(360 / count, count, "#0000FF").hex;
  const features = [];

  // Add all clusterd points
  featureEach(clustered, function (pt) {
    const dbscan = pt.properties.dbscan;
    const clusterId = pt.properties.cluster;

    switch (dbscan) {
      case "core":
      case "edge": {
        const coreColor = colours[clusterId];
        const edgeColor = chromatism.brightness(-20, colours[clusterId]).hex;
        pt.properties["marker-color"] =
          dbscan === "core" ? coreColor : edgeColor;
        pt.properties["marker-size"] = "small";
        break;
      }
      case "noise": {
        pt.properties["marker-color"] = "#AEAEAE";
        pt.properties["marker-symbol"] = "circle-stroked";
        pt.properties["marker-size"] = "medium";
        break;
      }
    }
    features.push(pt);
  });

  // Iterate over each Cluster
  clusterEach(clustered, "cluster", (cluster, clusterValue, clusterId) => {
    const color = chromatism.brightness(-25, colours[clusterId]).hex;

    // Add Centroid
    features.push(
      centroid(cluster, {
        properties: {
          "marker-color": colours[clusterId],
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

test("clusters-dbscan -- allow input mutation", (t) => {
  const oldPoints = featureCollection([
    point([0, 0], { foo: "bar" }),
    point([2, 4], { foo: "bar" }),
    point([3, 6], { foo: "bar" }),
  ]);
  // No mutation
  const newPoints = clustersDbscan(points, 2, { minPoints: 1 });
  t.equal(newPoints.features[1].properties.cluster, 1, "cluster is 1");
  t.equal(
    oldPoints.features[1].properties.cluster,
    undefined,
    "cluster is undefined"
  );

  // Allow mutation
  clustersDbscan(oldPoints, 2, { minPoints: 1, mutate: true });
  t.equal(oldPoints.features[1].properties.cluster, 1, "cluster is 1");
  t.end();
});
