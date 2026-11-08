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

// https://github.com/Turfjs/turf/issues/3182
test("distance -- Issue #3182", (t) => {
  const from = point([0, 8]);
  // This pair can round the haversine intermediate above 1.
  const antipodal = distance(from, point([180, -8]), { units: "radians" });
  t.ok(
    Number.isFinite(antipodal) && antipodal <= Math.PI,
    "antipodal distance should be finite and at most pi radians"
  );
  t.ok(
    antipodal >= Math.PI - 1e-7,
    "antipodal distance should be close to pi radians"
  );

  const nearAntipodal = distance(from, point([180, -7.999]), {
    units: "radians",
  });
  const expected = (179.999 * Math.PI) / 180;
  t.ok(
    Math.abs(nearAntipodal - expected) < 1e-7,
    "near-antipodal distance should match the shorter meridian arc"
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
