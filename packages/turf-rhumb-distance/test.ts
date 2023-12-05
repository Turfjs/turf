import fs from "fs";
import path from "path";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { distance } from "@turf/distance";
import { point, round } from "@turf/helpers";
import { rhumbDistance } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
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
      writeJsonFileSync(directories.out + name + ".json", distances);
    t.deepEqual(
      distances,
      loadJsonFileSync(directories.out + name + ".json"),
      name
    );
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
