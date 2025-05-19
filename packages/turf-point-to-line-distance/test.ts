import fs from "fs";
import test from "tape";
import path from "path";
import { Feature, LineString, Point } from "geojson";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { circle } from "@turf/circle";
import { point, lineString, round } from "@turf/helpers";
import { pointToLineDistance } from "./index.js";

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
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, geojson);
  });
  if (process.env.REGEN)
    writeJsonFileSync(directories.out + "distances.json", results);
  t.deepEqual(loadJsonFileSync(directories.out + "distances.json"), results);
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

test("turf-point-to-line-distance -- issue 2270", (t) => {
  let pt: Feature<Point>;
  let line: Feature<LineString>;
  let d: number;

  // This point should be about 3.4m from the line. Definitely not 4.3!
  // https://github.com/Turfjs/turf/issues/2270#issuecomment-1073787691
  pt = point([10.748363481687537, 59.94785299224352]);
  line = lineString([
    [10.7482034954027, 59.9477463357725],
    [10.7484686179823, 59.9480515133037],
  ]);

  d = round(pointToLineDistance(pt, line, { units: "meters" }), 1);
  t.equal(d, 3.4, "Point is approx 3.4m from line");

  // This point should be about 1000m from the line. Definitely not 1017!
  // https://github.com/Turfjs/turf/issues/2270#issuecomment-2307907374
  pt = point([11.991689565382663, 34.00578044047174]);
  line = lineString([
    [12, 34],
    [11.993027757380355, 33.99311060965808],
  ]);

  d = round(pointToLineDistance(pt, line, { units: "meters" }));
  t.equal(d, 1000, "Point is approx 1000m from line");

  t.end();
});

test("turf-point-to-line-distance -- issue 1156", (t) => {
  // According to issue 1156 the result of pointToLineDistance varies suddenly
  // at a certain longitude. Code below

  // When the error occurs we would expect to see 'd' jump from about 188 to
  // over 800
  // ...
  // [ 11.028347, 41 ] 188.9853459755496 189.00642024172396
  // [ 11.028348, 41 ] 842.5784253401666 189.08988164279026
  //                   ^^^

  // https://github.com/Turfjs/turf/issues/1156#issue-279806209
  let lineCoords = [
    [10.964832305908203, 41.004681939880314],
    [10.977363586425781, 40.99096148527727],
    [10.983200073242188, 40.97075154073346],
    [11.02834701538086, 40.98372150040732],
    [11.02508544921875, 41.00716631272605],
    [10.994186401367188, 41.01947819666632],
    [10.964832305908203, 41.004681939880314],
  ];

  let line = lineString(lineCoords);

  let x0 = 11.02834;
  let x1 = 11.02835;
  let dx = 0.000001;
  for (let i = 0, x = x0; x <= x1; i++, x = x0 + i * dx) {
    let p = point([x, 41.0]);
    let d = pointToLineDistance(p, line, { units: "meters" });
    t.true(d < 190, "pointToLineDistance never jumps past 190");
  }

  t.end();
});
