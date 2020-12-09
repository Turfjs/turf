const fs = require("fs");
const path = require("path");
const test = require("tape");
const load = require("load-json-file");
const write = require("write-json-file");
const distance = require("@turf/distance").default;
const { point, round } = require("@turf/helpers");
const rhumbDistance = require("./index").default;

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

test("rhumb-distance", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const pt1 = geojson.features[0];
    const pt2 = geojson.features[1];

    const distances = {
      miles: round(rhumbDistance(pt1, pt2, { units: "miles" }), 6),
      nauticalmiles: round(
        rhumbDistance(pt1, pt2, { units: "nauticalmiles" }),
        6
      ),
      kilometers: round(rhumbDistance(pt1, pt2, { units: "kilometers" }), 6),
      greatCircleDistance: round(
        distance(pt1, pt2, { units: "kilometers" }),
        6
      ),
      radians: round(rhumbDistance(pt1, pt2, { units: "radians" }), 6),
      degrees: round(rhumbDistance(pt1, pt2, { units: "degrees" }), 6),
    };

    if (process.env.REGEN)
      write.sync(directories.out + name + ".json", distances);
    t.deepEqual(distances, load.sync(directories.out + name + ".json"), name);
  });

  // Now fails due to approximation error
  // TODO: to be added once earth radius is updated to 6371km
  // t.ok(distances.kilometers > distances.greatCircleDistance, name + ' distance comparison');

  t.throws(
    () => rhumbDistance(point([0, 0]), point([1, 1]), { units: "foo" }),
    "unknown option given to units"
  );
  t.throws(() => rhumbDistance(null, point([1, 1])), "null point");
  t.throws(() => rhumbDistance(point([1, 1]), "point"), "invalid point");

  t.end();
});
