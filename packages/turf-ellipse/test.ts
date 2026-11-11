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
import { Position } from "geojson";

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

// Normalizes longitude into (-180, 180] so that two representations of the
// same point 360° apart (e.g. -285 and 75) compare as equal. This arises from
// a signed-zero quirk in destination()'s atan2 call when a geodesic passes
// very close to a pole: bearing -0 and +0 are mathematically the same "due
// north", but produce longitudes 360° apart once the destination overshoots
// the pole, because atan2(-0, x) and atan2(+0, x) differ for x < 0.
function normalizeLon(coords: Position[][]): Position[][] {
  return coords.map((ring) =>
    ring.map(([lon, lat]) => [((((lon + 180) % 360) + 360) % 360) - 180, lat])
  );
}

test("turf-ellipse -- degenerate ellipse matches circle exactly", (t) => {
  // When xSemiAxis === ySemiAxis, ellipse takes the "isCircle" code path, which
  // uses the same circumRadius formula as turf-circle but starts its bearing
  // sweep from east (90°) instead of north (0°). Passing angle: -90 cancels
  // that offset, so the two vertex grids should line up exactly.
  const centers = [
    [-105, 40],
    [0, 60],
    [-179, -10],
  ];
  const radii = [1, 1000, 12345.6789];
  const stepsOptions = [8, 16, 64, 128];

  centers.forEach((center) => {
    radii.forEach((radius) => {
      stepsOptions.forEach((steps) => {
        const ellipseGeom = ellipse(center, radius, radius, {
          steps,
          angle: -90,
        });
        const circleGeom = circle(center, radius, { steps });

        t.deepEqual(
          normalizeLon(ellipseGeom.geometry.coordinates),
          normalizeLon(circleGeom.geometry.coordinates),
          `degenerate ellipse matches circle at center=${center}, radius=${radius}, steps=${steps}`
        );
      });
    });
  });
  t.end();
});

test("turf-ellipse -- degenerate ellipse is circular regardless of angle", (t) => {
  // Without the -90 offset correction, a degenerate ellipse's vertex grid is
  // simply rotated relative to turf-circle's, so coordinates won't match
  // directly -- but the resulting polygon must still have the same area as
  // the circle, for any rotation angle, since rotating a circle changes
  // nothing about its shape.
  const center = [-105, 40];
  const radius = 1000;
  const steps = 64;
  const angles = [0, 30, 45, 90, 180, 271];

  const circleGeom = circle(center, radius, { steps });
  const circleArea = area(circleGeom.geometry);

  angles.forEach((angle) => {
    const ellipseGeom = ellipse(center, radius, radius, { steps, angle });

    t.true(
      Math.abs(area(ellipseGeom.geometry) - circleArea) / circleArea < 1e-9,
      `degenerate ellipse area matches circle area at angle=${angle}`
    );
  });
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

test("turf-ellipse -- angle parameter rotates ellipse orientation", (t) => {
  // Create ellipse with major axis along x-axis (horizontal)
  const e0 = ellipse([0, 60], 2000, 1000, { steps: 64, angle: 0 });
  const coords0 = e0.geometry.coordinates[0];

  // Create same ellipse rotated 90 degrees (vertical)
  const e90 = ellipse([0, 60], 2000, 1000, { steps: 64, angle: 90 });
  const coords90 = e90.geometry.coordinates[0];

  // First coordinate should be different after rotation
  const dist = Math.sqrt(
    Math.pow(coords0[0][0] - coords90[0][0], 2) +
      Math.pow(coords0[0][1] - coords90[0][1], 2)
  );
  t.true(dist > 10, "first coordinates differ significantly after rotation");

  // Areas should be equal
  const area0 = area(e0.geometry);
  const area90 = area(e90.geometry);
  t.true(
    Math.abs(area0 - area90) / area0 < 0.001,
    "rotated ellipses have equal area"
  );

  // Verify rotation is actually changing orientation (not just offsetting start point)
  // Compare coordinate spreads in x and y directions
  const xSpread0 =
    Math.max(...coords0.map((c) => c[0])) -
    Math.min(...coords0.map((c) => c[0]));
  const ySpread0 =
    Math.max(...coords0.map((c) => c[1])) -
    Math.min(...coords0.map((c) => c[1]));
  const xSpread90 =
    Math.max(...coords90.map((c) => c[0])) -
    Math.min(...coords90.map((c) => c[0]));
  const ySpread90 =
    Math.max(...coords90.map((c) => c[1])) -
    Math.min(...coords90.map((c) => c[1]));

  // After 90° rotation, the orientation should change - not just swap perfectly due to projection,
  // but x-spread should decrease and y-spread should increase (for horizontal→vertical rotation)
  t.true(
    xSpread90 < xSpread0,
    "x-spread decreases after 90° rotation (becomes more vertical)"
  );
  t.true(
    ySpread90 > ySpread0,
    "y-spread increases after 90° rotation (becomes more vertical)"
  );

  t.end();
});

test("turf-ellipse -- angle parameter with 45 degree increments", (t) => {
  const center = [0, 60];
  const a = 2000;
  const b = 1000;

  // Test multiple angles to ensure consistent rotation
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const ellipses = angles.map((angle) =>
    ellipse(center, a, b, { steps: 32, angle })
  );

  // All should have same area
  const areas = ellipses.map((e) => area(e.geometry));
  const avgArea = areas.reduce((sum, a) => sum + a, 0) / areas.length;
  areas.forEach((a, i) => {
    t.true(
      Math.abs(a - avgArea) / avgArea < 0.001,
      `ellipse at angle ${angles[i]} has correct area`
    );
  });

  // Each should be rotated relative to the previous
  for (let i = 1; i < ellipses.length; i++) {
    const prev = ellipses[i - 1].geometry.coordinates[0][0];
    const curr = ellipses[i].geometry.coordinates[0][0];
    const dist = Math.sqrt(
      Math.pow(prev[0] - curr[0], 2) + Math.pow(prev[1] - curr[1], 2)
    );
    t.true(dist > 1, `ellipse at ${angles[i]}° differs from ${angles[i - 1]}°`);
  }

  t.end();
});

test("turf-ellipse -- smooth transition from circle to ellipse", (t) => {
  const center = [0, 60];
  const steps = 64;

  // Test gradual change from circle to ellipse
  const configs = [
    [2000, 2000], // circle
    [2000, 1999], // barely elliptical
    [2000, 1995],
    [2000, 1990],
    [2000, 1980],
  ];

  const ellipses = configs.map(([a, b]) => ellipse(center, a, b, { steps }));

  // First coordinate latitude should change smoothly
  const firstCoords = ellipses.map((e) => e.geometry.coordinates[0][0]);
  for (let i = 1; i < firstCoords.length; i++) {
    const prevLat = firstCoords[i - 1][1];
    const currLat = firstCoords[i][1];
    const change = Math.abs(currLat - prevLat);

    // Change should be small and monotonic (decreasing)
    t.true(change < 1, `smooth transition at step ${i}`);
    t.true(
      currLat <= prevLat + 0.01,
      `latitude decreases monotonically at step ${i}`
    );
  }

  t.end();
});

test("turf-ellipse -- arc-length distribution quality", (t) => {
  // Test on a highly elongated ellipse where uniform angles would fail
  const e = ellipse([0, 60], 2000, 500, { steps: 32 });
  const coords = e.geometry.coordinates[0];

  // Calculate segment lengths
  const segments = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const dx = coords[i + 1][0] - coords[i][0];
    const dy = coords[i + 1][1] - coords[i][1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    segments.push(dist);
  }

  // Calculate statistics
  const avg = segments.reduce((sum, d) => sum + d, 0) / segments.length;
  const variance =
    segments.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) /
    segments.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avg;

  // For good arc-length distribution, coefficient of variation should be small
  // (less than 10% for highly elongated ellipse, much less for moderate ellipses)
  t.true(
    coefficientOfVariation < 0.3,
    `arc-length distribution has reasonable variation (${(coefficientOfVariation * 100).toFixed(1)}%)`
  );

  t.end();
});

test("turf-ellipse -- area accuracy for various eccentricities", (t) => {
  const center = [0, 60];
  const steps = 64;

  // Test ellipses with different eccentricities
  const configs = [
    [2000, 2000], // circle (e=0)
    [2000, 1800], // mild (e≈0.44)
    [2000, 1500], // moderate (e≈0.66)
    [2000, 1000], // high (e≈0.87)
    [2000, 500], // very high (e≈0.97)
  ];

  configs.forEach(([a, b]) => {
    const e = ellipse(center, a, b, { steps, units: "meters" });
    const actualArea = area(e.geometry);
    const theoreticalArea = Math.PI * a * b;

    const error = Math.abs(actualArea - theoreticalArea) / theoreticalArea;

    // Area should be within 1% of theoretical
    // (Adaptive arc-length spacing trades some area accuracy for better point distribution)
    t.true(
      error < 0.01,
      `area accurate for a=${a}, b=${b} (error: ${(error * 100).toFixed(3)}%)`
    );
  });

  t.end();
});

test("turf-ellipse -- steps parameter controls resolution", (t) => {
  const center = [0, 60];
  const a = 2000;
  const b = 1000;

  // Test different step counts
  const stepCounts = [8, 16, 32, 64, 128];
  const ellipses = stepCounts.map((steps) => ellipse(center, a, b, { steps }));

  // Verify coordinate count matches steps (plus 1 for closing)
  ellipses.forEach((e, i) => {
    const coordCount = e.geometry.coordinates[0].length;
    t.equal(
      coordCount,
      stepCounts[i] + 1,
      `${stepCounts[i]} steps produces ${stepCounts[i] + 1} coordinates`
    );
  });

  // Higher resolution should have more accurate area
  const areas = ellipses.map((e) => area(e.geometry));
  const theoreticalArea = Math.PI * a * b;
  const errors = areas.map(
    (a) => Math.abs(a - theoreticalArea) / theoreticalArea
  );

  // Errors should generally decrease with more steps (with some tolerance)
  for (let i = 1; i < errors.length - 1; i++) {
    t.true(
      errors[i] <= errors[i - 1] * 1.1,
      `error at ${stepCounts[i]} steps not significantly worse than ${stepCounts[i - 1]} steps`
    );
  }

  t.end();
});

test("turf-ellipse -- units parameter", (t) => {
  const center = [0, 60];
  const value = 10;
  const steps = 32;

  // Test different units
  const e1 = ellipse(center, value, value / 2, { steps, units: "kilometers" });
  const e2 = ellipse(center, value, value / 2, { steps, units: "miles" });
  const e3 = ellipse(center, value, value / 2, { steps, units: "degrees" });
  const e4 = ellipse(center, value, value / 2, { steps, units: "meters" });

  // All should produce valid ellipses with different sizes
  t.ok(
    e1.geometry.coordinates[0].length > 0,
    "kilometers produces valid ellipse"
  );
  t.ok(e2.geometry.coordinates[0].length > 0, "miles produces valid ellipse");
  t.ok(e3.geometry.coordinates[0].length > 0, "degrees produces valid ellipse");
  t.ok(e4.geometry.coordinates[0].length > 0, "meters produces valid ellipse");

  t.ok(area(e1.geometry) > 0, "kilometers has positive area");
  t.ok(area(e2.geometry) > 0, "miles has positive area");
  t.ok(area(e3.geometry) > 0, "degrees has positive area");
  t.ok(area(e4.geometry) > 0, "meters has positive area");

  // Kilometers and miles should produce different sized ellipses
  const areaKm = area(e1.geometry);
  const areaMiles = area(e2.geometry);
  t.true(
    Math.abs(areaKm - areaMiles) / areaKm > 0.5,
    "kilometers and miles produce different sized ellipses"
  );

  t.end();
});

test("turf-ellipse -- properties parameter", (t) => {
  const e = ellipse([0, 60], 2000, 1000, {
    properties: { name: "test-ellipse", id: 123 },
  });

  t.ok(e.properties, "properties exist");
  t.equal(e.properties?.name, "test-ellipse", "name property preserved");
  t.equal(e.properties?.id, 123, "id property preserved");
  t.end();
});

test("turf-ellipse -- different axis configurations", (t) => {
  const center = [0, 60];

  // Test when xSemiAxis < ySemiAxis (swapped major/minor axes)
  const e1 = ellipse(center, 1000, 2000, { steps: 32 });
  t.ok(e1.geometry.coordinates[0].length > 0, "works when x < y");

  // Test equal axes (circle)
  const e2 = ellipse(center, 1500, 1500, { steps: 32 });
  t.ok(e2.geometry.coordinates[0].length > 0, "works when x = y");

  // Test very elongated
  const e3 = ellipse(center, 5000, 500, { steps: 32 });
  t.ok(e3.geometry.coordinates[0].length > 0, "works with high eccentricity");

  // All should have positive area
  [e1, e2, e3].forEach((e) => {
    t.true(area(e.geometry) > 0, "has positive area");
  });

  t.end();
});

test("turf-ellipse -- angle and rotation interact correctly", (t) => {
  // Test that angle parameter produces correct rotation for various ellipse shapes
  const center = [0, 60];

  // Nearly circular ellipse
  const e1_0 = ellipse(center, 2000, 1900, { steps: 32, angle: 0 });
  const e1_90 = ellipse(center, 2000, 1900, { steps: 32, angle: 90 });

  // Highly elongated ellipse
  const e2_0 = ellipse(center, 2000, 500, { steps: 32, angle: 0 });
  const e2_90 = ellipse(center, 2000, 500, { steps: 32, angle: 90 });

  // Rotation should produce different coordinates for both shapes
  const dist1 = Math.sqrt(
    Math.pow(
      e1_0.geometry.coordinates[0][0][0] - e1_90.geometry.coordinates[0][0][0],
      2
    ) +
      Math.pow(
        e1_0.geometry.coordinates[0][0][1] -
          e1_90.geometry.coordinates[0][0][1],
        2
      )
  );

  const dist2 = Math.sqrt(
    Math.pow(
      e2_0.geometry.coordinates[0][0][0] - e2_90.geometry.coordinates[0][0][0],
      2
    ) +
      Math.pow(
        e2_0.geometry.coordinates[0][0][1] -
          e2_90.geometry.coordinates[0][0][1],
        2
      )
  );

  t.true(
    dist1 > 5,
    "90° rotation significantly changes nearly-circular ellipse"
  );
  t.true(dist2 > 5, "90° rotation significantly changes elongated ellipse");

  // Areas should remain equal after rotation
  t.true(
    Math.abs(area(e1_0.geometry) - area(e1_90.geometry)) / area(e1_0.geometry) <
      0.001,
    "nearly-circular ellipse area preserved"
  );
  t.true(
    Math.abs(area(e2_0.geometry) - area(e2_90.geometry)) / area(e2_0.geometry) <
      0.001,
    "elongated ellipse area preserved"
  );

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
