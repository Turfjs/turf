import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { circle } from "@turf/circle";
import { destination } from "@turf/destination";
import {
  calculateNumberOfRegularPolygonSidesToApproximateCircle,
  calculatePolygonCircumRadius,
  featureCollection,
  point,
} from "@turf/helpers";
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
    // undefined steps should default to 64 + 1 points, 1 to 1 + 1,
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
  const steps = 7;
  const radius = 5;
  const bearing1 = 0;
  const bearing2 = 29;
  const arc = lineArc(center, radius, bearing1, bearing2, { steps });
  const coords = arc.geometry.coordinates;

  t.equals(coords.length, 7 + 1, "arc has steps + 1 vertices");

  // The final vertex must sit on bearing2 (29°). destination(center, r, 29)
  // gives the reference coordinate; the old code stopped at bearing ~24.857°.
  const circumRadius = calculatePolygonCircumRadius(radius, steps);
  const expectedLast = destination(center, circumRadius, bearing2).geometry
    .coordinates;
  t.deepEquals(
    truncate(point(coords[coords.length - 1])).geometry.coordinates,
    truncate(point(expectedLast)).geometry.coordinates,
    "last vertex lies on bearing2"
  );

  t.end();
});

test("turf-line-arc -- method parameter", (t) => {
  const center = point([-75, 40]);
  const radius = 5;
  const steps = 8;
  const bearing1 = 0;
  const bearing2 = 90;

  (["inscribed", "circumscribed", "equalarea"] as const).forEach((method) => {
    const arc = lineArc(center, radius, bearing1, bearing2, {
      steps,
      method,
    });
    // each of the 8 segments spans 90 / 8 degrees, i.e. a side of a regular
    // 32-gon, so the circumradius is the 32-gon's, not the 8-gon's
    const expectedCircumRadius = calculatePolygonCircumRadius(
      radius,
      (steps * 360) / (bearing2 - bearing1),
      method
    );
    const expectedFirstVertex = destination(
      center,
      expectedCircumRadius,
      bearing1
    ).geometry.coordinates;
    t.deepEquals(
      arc.geometry.coordinates[0],
      expectedFirstVertex,
      `${method} arc uses the ${method} circumradius`
    );
  });

  t.deepEquals(
    lineArc(center, radius, bearing1, bearing2, { steps }),
    lineArc(center, radius, bearing1, bearing2, {
      steps,
      method: "inscribed",
    }),
    "inscribed is the default method"
  );

  t.throws(
    () =>
      lineArc(center, radius, bearing1, bearing2, {
        steps,
        method: "bogus" as any,
      }),
    /method must be one of/,
    "throws for an unknown method"
  );

  t.end();
});

test("turf-line-arc -- full circle applies method once", (t) => {
  const center = point([-75, 40]);
  const radius = 5;
  const steps = 8;

  (["inscribed", "circumscribed", "equalarea"] as const).forEach((method) => {
    t.deepEquals(
      lineArc(center, radius, 0, 360, { steps, method }).geometry.coordinates,
      circle(center, radius, { steps, method }).geometry.coordinates[0],
      `${method}: full-circle arc matches circle() with the same method`
    );
    t.deepEquals(
      lineArc(center, radius, 0, 360, { arcTolerance: 0.01, method }).geometry
        .coordinates,
      circle(center, radius, { arcTolerance: 0.01, method }).geometry
        .coordinates[0],
      `${method}: full-circle arc matches circle() with the same arcTolerance`
    );
  });

  t.end();
});

test("turf-line-arc -- method with arcTolerance", (t) => {
  const center = point([-75, 40]);
  const radius = 5;
  const arcTolerance = 0.01;
  const bearing1 = 0;
  const bearing2 = 90;

  (["inscribed", "circumscribed", "equalarea"] as const).forEach((method) => {
    const fullCircleSteps =
      calculateNumberOfRegularPolygonSidesToApproximateCircle(
        radius,
        arcTolerance,
        method
      );
    // a 90 degree arc needs only a quarter of a full circle's sides
    const expectedSteps = Math.ceil(fullCircleSteps / 4);
    const arc = lineArc(center, radius, bearing1, bearing2, {
      arcTolerance,
      method,
    });
    t.equal(
      arc.geometry.coordinates.length,
      expectedSteps + 1,
      `${method}: step count is derived from arcTolerance using ${method}`
    );
    t.deepEquals(
      arc.geometry.coordinates[0],
      destination(
        center,
        calculatePolygonCircumRadius(radius, expectedSteps * 4, method),
        bearing1
      ).geometry.coordinates,
      `${method}: circumradius is computed for the derived step count`
    );
  });

  t.end();
});

test("turf-line-arc -- arcTolerance gives an arc only its share of a circle's steps", (t) => {
  const center = point([-75, 40]);
  const radius = 1000;
  const arcTolerance = 0.001;
  const fullCircleSteps =
    calculateNumberOfRegularPolygonSidesToApproximateCircle(
      radius,
      arcTolerance
    );
  const arc = lineArc(center, radius, 0, 10, { arcTolerance });
  t.equal(
    arc.geometry.coordinates.length,
    Math.ceil(fullCircleSteps / 36) + 1,
    "a 10 degree arc gets 1/36 of a full circle's steps"
  );

  t.end();
});

test("turf-line-arc -- short arcs with few steps stay near the radius", (t) => {
  // one 5 degree step: a circumscribed segment is tangent at its midpoint, so
  // its endpoints sit at radius / cos(2.5 degrees), not at the circumradius of
  // a triangle (2 x radius)
  const center = point([11.343, 44.495]);
  const radius = 500;
  const arc = lineArc(center, radius, 60, 65, {
    steps: 1,
    method: "circumscribed",
  });
  const halfAngle = (2.5 * Math.PI) / 180;
  t.deepEquals(
    arc.geometry.coordinates[0],
    destination(center, radius / Math.cos(halfAngle), 60).geometry.coordinates,
    "circumscribed endpoints are at radius / cos(half the segment angle)"
  );
  t.deepEquals(
    lineArc(center, radius, 60, 65, { steps: 1 }).geometry.coordinates[0],
    destination(center, radius, 60).geometry.coordinates,
    "inscribed endpoints are on the radius"
  );

  t.end();
});

test("turf-line-arc -- a zero or negative radius throws", (t) => {
  (["inscribed", "circumscribed", "equalarea"] as const).forEach((method) => {
    [0, -5].forEach((radius) => {
      t.throws(
        () => lineArc([-75, 40], radius, 0, 90, { method }),
        /must be positive/,
        `${method}: radius ${radius} throws for a partial arc`
      );
      t.throws(
        () => lineArc([-75, 40], radius, 0, 360, { method }),
        /must be positive/,
        `${method}: radius ${radius} throws for a full circle`
      );
    });
  });

  t.end();
});

test("turf-line-arc -- invalid arcTolerance throws instead of being ignored", (t) => {
  [-0.01, 0, NaN, "0.01" as any].forEach((arcTolerance) => {
    t.throws(
      () => lineArc([-75, 40], 5, 0, 90, { arcTolerance }),
      /arcTolerance must be positive/,
      `arcTolerance = ${JSON.stringify(arcTolerance)} throws`
    );
  });
  // the 20000-side limit applies to the full circle the arc is a part of
  t.throws(
    () => lineArc([-75, 40], 6000, 0, 1, { arcTolerance: 1e-9 }),
    /too small for circleRadius 6000/,
    "an arcTolerance needing more than 20000 sides for the circle throws"
  );

  t.end();
});

test("turf-line-arc -- fractional steps round up and still reach bearing2", (t) => {
  const center = [-75, 40];
  const radius = 5;
  const bearing1 = 0;
  const bearing2 = 90;

  const fractional = lineArc(center, radius, bearing1, bearing2, {
    steps: 2.5,
  });
  const whole = lineArc(center, radius, bearing1, bearing2, { steps: 3 });
  t.deepEquals(
    fractional.geometry.coordinates,
    whole.geometry.coordinates,
    "steps: 2.5 behaves like steps: 3"
  );
  t.deepEquals(
    fractional.geometry.coordinates[fractional.geometry.coordinates.length - 1],
    destination(center, calculatePolygonCircumRadius(radius, 3), bearing2)
      .geometry.coordinates,
    "the last vertex lies on bearing2"
  );

  t.end();
});

test("turf-line-arc -- invalid steps throw a descriptive error", (t) => {
  [0, -5, -0.5, NaN, Infinity, -Infinity].forEach((steps) => {
    t.throws(
      () => lineArc([-75, 40], 5, 0, 90, { steps }),
      /steps must be a positive finite number/,
      `steps = ${steps} throws`
    );
  });
  t.throws(
    () => lineArc([-75, 40], 5, 0, 90, { steps: "8" as any }),
    /steps must be a positive finite number/,
    "a non-number steps throws"
  );

  t.end();
});
