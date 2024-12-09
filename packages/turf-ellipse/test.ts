import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { circle } from "@turf/circle";
import { truncate } from "@turf/truncate";
import { check } from "@placemarkio/check-geojson";
import { featureCollection } from "@turf/helpers";
import { intersect } from "@turf/intersect";
import { area } from "@turf/area";
import { ellipse } from "./index.js";
import fs from "fs";

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

test("turf-ellipse", (t) => {
  fixtures.forEach((fixture) => {
    console.log(fixture.filename);
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const center = geojson.geometry.coordinates;
    let { xSemiAxis, ySemiAxis, steps, angle, units, accuracy } =
      geojson.properties;
    angle = angle || 0;
    const options = {
      steps: steps,
      angle: angle,
      units: units,
      accuracy: accuracy,
    };
    const maxAxis = Math.max(xSemiAxis, ySemiAxis);

    const results = featureCollection([
      geojson,
      truncate(colorize(circle(center, maxAxis, options), "#F00")),
      truncate(
        colorize(ellipse(center, xSemiAxis, ySemiAxis, options), "#00F")
      ),
      truncate(
        colorize(
          ellipse(center, xSemiAxis, ySemiAxis, {
            steps,
            angle: angle + 90,
            units,
            accuracy: accuracy,
          }),
          "#0F0"
        )
      ),
    ]);

    // Save to file
    const out = path.join(directories.out, filename);
    if (process.env.REGEN) writeJsonFileSync(out, results);
    t.deepEqual(results, loadJsonFileSync(out), name);
  });
  t.end();
});

test("turf-ellipse -- circle consistency", (t) => {
  const ellipseGeom = truncate(ellipse([0, 60], 2000, 2000, { steps: 300 }));
  const circleGeom = truncate(circle([0, 60], 2000, { steps: 300 }));
  const intersectionGeom = intersect(
    featureCollection([ellipseGeom, circleGeom])
  );
  const areaIntersection =
    intersectionGeom != null ? area(intersectionGeom.geometry) : 0;
  const areaCircle = circleGeom != null ? area(circleGeom.geometry) : 0;
  t.true(
    Math.abs(areaIntersection - areaCircle) / areaCircle < 0.00001,
    "both areas are equal"
  );
  t.end();
});

test("turf-ellipse -- rotation consistency", (t) => {
  const ellipseGeom = ellipse([0, 60], 2000, 2000, { angle: 0 });
  const ellipseTurnedGeom = ellipse([0, 60], 2000, 2000, { angle: 90 });
  const intersectionGeom = intersect(
    featureCollection([ellipseGeom, ellipseTurnedGeom])
  );
  const areaIntersection =
    intersectionGeom != null ? area(intersectionGeom.geometry) : 0;
  const areaEllipse = ellipseGeom != null ? area(ellipseGeom.geometry) : 0;
  t.true(
    Math.abs(areaIntersection - areaEllipse) / areaEllipse < 0.00001,
    "both areas are equal"
  );
  t.end();
});

test("turf-ellipse -- with coordinates", (t) => {
  t.assert(ellipse([-100, 75], 5, 1));
  t.end();
});

test("turf-ellipse -- validate geojson", (t) => {
  const E = ellipse([0, 0], 10, 20);
  try {
    check(JSON.stringify(E));
    t.pass();
  } catch (e) {
    t.fail(e.message);
  }
  t.end();
});

function colorize(feature, color) {
  color = color || "#F00";
  feature.properties["stroke-width"] = 6;
  feature.properties.stroke = color;
  feature.properties.fill = color;
  feature.properties["fill-opacity"] = 0;
  return feature;
}
