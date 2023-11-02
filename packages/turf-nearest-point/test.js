const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const { featureCollection, point } = require("@turf/helpers");
const nearestPoint = require("./index").default;

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

test("turf-nearest-point", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const targetPoint = point(geojson.properties.targetPoint);
    const nearestPt = nearestPoint(targetPoint, geojson);

    // Style results
    nearestPt.properties["marker-color"] = "#F00";
    nearestPt.properties["marker-symbol"] = "star";
    targetPoint.properties["marker-color"] = "#00F";
    targetPoint.properties["marker-symbol"] = "circle";
    const results = featureCollection([
      ...geojson.features,
      targetPoint,
      nearestPt,
    ]);

    // Save output
    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEqual(results, load.sync(directories.out + filename), name);
  });
  t.end();
});

test("nearest-point -- prevent input mutation", (t) => {
  const pt1 = point([40, 50], { featureIndex: "foo" });
  const pt2 = point([20, -10], { distanceToPoint: "bar" });
  const pts = featureCollection([pt1, pt2]);
  const nearestPt = nearestPoint([0, 0], pts);

  // Check if featureIndex properties was added to properties
  t.equal(nearestPt.properties.featureIndex, 1);

  // Check if previous input points have been modified
  t.deepEqual(pt1.properties, { featureIndex: "foo" });
  t.deepEqual(pt2.properties, { distanceToPoint: "bar" });
  t.end();
});

test("nearest-point -- use different units", (t) => {
  const pt1 = point([40, 50], { featureIndex: "foo" });
  const pt2 = point([20, -10], { distanceToPoint: "bar" });
  const pts = featureCollection([pt1, pt2]);
  const distanceInKilometers = nearestPoint([0, 0], pts).properties
    .distanceToPoint;
  const distanceInMeters = nearestPoint([0, 0], pts, { units: "meters" })
    .properties.distanceToPoint;
  const oneKilometerInMeters = 1000;

  // Check if the proper distance gets returned when using "units" option
  t.equal(distanceInKilometers, distanceInMeters / oneKilometerInMeters);

  t.end();
});
