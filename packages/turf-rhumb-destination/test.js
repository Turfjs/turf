const fs = require("fs");
const path = require("path");
const test = require("tape");
const write = require("write-json-file");
const load = require("load-json-file");
const truncate = require("@turf/truncate").default;
const { getCoords } = require("@turf/invariant");
const { featureCollection, lineString, point } = require("@turf/helpers");
const rhumbDestination = require("./index").default;

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

test("turf-rhumb-destination", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    let { bearing, dist, units } = geojson.properties || {};
    bearing = bearing !== undefined ? bearing : 180;
    dist = dist !== undefined ? dist : 100;

    const destinationPoint = rhumbDestination(geojson, dist, bearing, {
      units: units,
    });
    const line = truncate(
      lineString([getCoords(geojson), getCoords(destinationPoint)], {
        stroke: "#F00",
        "stroke-width": 4,
      })
    );
    geojson.properties["marker-color"] = "#F00";
    const result = featureCollection([line, geojson, destinationPoint]);

    if (process.env.REGEN) write.sync(directories.out + filename, result);
    t.deepEqual(result, load.sync(directories.out + filename), name);
  }
  t.end();
});

test("turf-rhumb-destintation -- throws error", (t) => {
  const pt = point([12, -54]);
  t.assert(
    rhumbDestination(pt, 0, 45).geometry.coordinates[0],
    "0 distance is valid"
  );
  t.assert(
    rhumbDestination(pt, 100, 0).geometry.coordinates[0],
    "0 bearing is valid"
  );
  // t.throws(() => rhumbDestination(pt, 100, 45, 'blah'), 'unknown option given to units');
  // t.throws(() => rhumbDestination(pt, null, 75), 'missing distance');
  // t.throws(() => rhumbDestination(pt, 'foo', 75), 'invalid distance - units param switched to distance');
  // t.throws(() => rhumbDestination('foo', 200, 75, {units: 'miles'}), 'invalid point');
  t.end();
});

test("turf-rhumb-destintation -- add properties", (t) => {
  const properties = { foo: "bar" };
  const pt = point([12, -54], properties);

  t.deepEqual(
    rhumbDestination(pt, 0, 45, { properties }).properties,
    properties,
    "add properties"
  );
  t.end();
});

test("turf-rhumb-destintation -- allows negative distance", (t) => {
  const pt = point([12, -54]);
  const out = rhumbDestination(pt, -100, 45);
  t.deepEqual(
    out.geometry.coordinates,
    [10.90974456038191, -54.63591552764877]
  );
  t.end();
});
