import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { destination } from "@turf/destination";
import { featureCollection, point } from "@turf/helpers";
import { lineArc } from "./index.js";

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

test("turf-line-arc", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const { radius, bearing1, bearing2, steps, units } = geojson.properties;
    const arc = truncate(
      lineArc(geojson, radius, bearing1, bearing2, { steps, units })
    );
    const results = featureCollection([geojson, arc]);
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
    // Check the resulting arc geometry has the expected number of points.
    // undefined or 0 steps should default to 64 + 1 points, 1 to 1 + 1,
    // 2 to 2 + 1, ...
    const expectedPoints = geojson.properties?.steps
      ? geojson.properties?.steps + 1
      : 64 + 1;
    t.equals(
      arc.geometry.coordinates.length,
      expectedPoints,
      `${name} number of points in arc`
    );
  }
  t.end();
});

test("turf-line-arc #2524", (t) => {
  // Just test to make sure we're getting the correct number of points in the
  // resultant arc i.e. steps + 1
  const options = { steps: 10, units: "kilometers" };

  const center = point([115.959444, -31.945]);
  const startAngle = 223;
  const endAngle = 277;
  const radius = 130;
  const arc = lineArc(center, radius, startAngle, endAngle, options);

  t.equals(arc.geometry.coordinates.length, 10 + 1, "Number of points in arc");
  t.end();
});

test("turf-line-arc #2446", (t) => {
  // Test to make sure we're not getting an error, as described in
  // https://github.com/Turfjs/turf/issues/2446
  const options = { steps: 15, units: "kilometers" };

  const center = point([115.959444, -31.945]);
  const startAngle = 253;
  const endAngle = 277;
  const radius = 119.7195;

  t.doesNotThrow(() =>
    lineArc(center, radius * 1.852, startAngle, endAngle, options)
  );

  t.end();
});

test("turf-line-arc -- reaches bearing2 despite floating-point drift", (t) => {
  // For some bearing/step combinations arcStartDegree + steps * arcStep
  // overshoots arcEndDegree by a rounding epsilon (e.g. 0 + 7 * (29 / 7) ===
  // 29.000000000000004 > 29). The old `while (alpha <= arcEndDegree)` loop then
  // dropped the final vertex, returning `steps` points instead of `steps + 1`
  // and ending the arc a full step short of bearing2.
  const center = point([-75, 40]);
  const arc = lineArc(center, 5, 0, 29, { steps: 7 });
  const coords = arc.geometry.coordinates;

  t.equals(coords.length, 7 + 1, "arc has steps + 1 vertices");

  // The final vertex must sit on bearing2 (29°). destination(center, r, 29)
  // gives the reference coordinate; the old code stopped at bearing ~24.857°.
  const expectedLast = destination(center, 5, 29).geometry.coordinates;
  t.deepEquals(
    truncate(point(coords[coords.length - 1])).geometry.coordinates,
    truncate(point(expectedLast)).geometry.coordinates,
    "last vertex lies on bearing2"
  );

  t.end();
});
