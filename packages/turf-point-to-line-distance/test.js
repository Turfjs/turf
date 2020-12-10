const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const circle = require("@turf/circle").default;
const { point, lineString, round } = require("@turf/helpers");
const pointToLineDistance = require("./index").default;

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

test("turf-point-to-line-distance", (t) => {
  const results = {};
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const point = geojson.features[0];
    const line = geojson.features[1];
    const properties = geojson.properties || {};
    const units = properties.units || "kilometers";
    // main method
    const options = { units: units };
    options.method = "geodesic";
    const distance = pointToLineDistance(point, line, options);

    // Store results
    results[name] = round(distance, 10);

    // debug purposes
    geojson.features.push(
      circle(point, distance, { steps: 200, units: units })
    );
    if (process.env.REGEN) write.sync(directories.out + filename, geojson);
  });
  if (process.env.REGEN)
    write.sync(directories.out + "distances.json", results);
  t.deepEqual(load.sync(directories.out + "distances.json"), results);
  t.end();
});

test("turf-point-to-line-distance -- throws", (t) => {
  const pt = point([0, 0]);
  const line = lineString([
    [1, 1],
    [-1, 1],
  ]);

  t.throws(
    () => pointToLineDistance(null, line),
    /pt is required/,
    "missing point"
  );
  t.throws(
    () => pointToLineDistance(pt, null),
    /line is required/,
    "missing line"
  );
  t.throws(
    () => pointToLineDistance(pt, line, { units: "invalid" }),
    /units is invalid/,
    "invalid units"
  );
  t.throws(
    () => pointToLineDistance(line, line),
    /Invalid input to point: must be a Point, given LineString/,
    "invalid line"
  );
  t.throws(
    () => pointToLineDistance(pt, pt),
    /Invalid input to line: must be a LineString, given Point/,
    "invalid point"
  );

  t.end();
});

test("turf-point-to-line-distance -- Geometry", (t) => {
  const pt = point([0, 0]);
  const line = lineString([
    [1, 1],
    [-1, 1],
  ]);

  t.assert(pointToLineDistance(pt.geometry, line.geometry));
  t.end();
});

test("turf-point-to-line-distance -- Check planar and geodesic results are different", (t) => {
  const pt = point([0, 0]);
  const line = lineString([
    [10, 10],
    [-1, 1],
  ]);

  const geoOut = pointToLineDistance(pt.geometry, line.geometry, {
    method: "geodesic",
  });
  const planarOut = pointToLineDistance(pt.geometry, line.geometry, {
    method: "planar",
  });
  t.notEqual(geoOut, planarOut);
  t.end();
});
