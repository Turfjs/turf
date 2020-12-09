const fs = require("fs");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const write = require("write-json-file");
const { point } = require("@turf/helpers");
const distance = require("./index").default;

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

test("distance", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const pt1 = geojson.features[0];
    const pt2 = geojson.features[1];
    const distances = {
      miles: distance(pt1, pt2, { units: "miles" }),
      nauticalmiles: distance(pt1, pt2, { units: "nauticalmiles" }),
      kilometers: distance(pt1, pt2, { units: "kilometers" }),
      radians: distance(pt1, pt2, { units: "radians" }),
      degrees: distance(pt1, pt2, { units: "degrees" }),
    };
    if (process.env.REGEN)
      write.sync(directories.out + name + ".json", distances);
    t.deepEqual(distances, load.sync(directories.out + name + ".json"), name);
  });
  t.end();
});

// https://github.com/Turfjs/turf/issues/758
test("distance -- Issue #758", (t) => {
  t.equal(
    Math.round(distance(point([-180, -90]), point([180, -90]))),
    0,
    "should be 0"
  );
  t.end();
});

test("distance -- throws", (t) => {
  t.throws(
    () => distance(point([0, 0]), point([10, 10]), { units: "foo" }),
    /units is invalid/
  );
  t.end();
});
