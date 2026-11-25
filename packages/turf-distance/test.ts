import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { point } from "@turf/helpers";
import { distance } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      writeJsonFileSync(directories.out + name + ".json", distances);
    t.deepEqual(
      distances,
      loadJsonFileSync(directories.out + name + ".json"),
      name
    );
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

// https://github.com/Turfjs/turf/issues/3182
test("distance -- antipodal points -- Issue #3182", (t) => {
  const expected = distance(point([0, 30]), point([180, -30]));
  t.equal(
    distance(point([-180, -58]), point([0, 58])),
    expected,
    "should be finite for antipodal points"
  );
  t.equal(
    distance(
      point([0, 75.92808393761516]),
      point([179.99999998686485, -75.92808393761516])
    ),
    expected,
    "should be finite for nearly antipodal points"
  );
  t.end();
});
