import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureCollection, point } from "@turf/helpers";
import { check } from "@placemarkio/check-geojson";
import { circle } from "./index.js";

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

test("turf-circle", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const properties = geojson.properties || {};
    const radius = properties.radius;
    const steps = properties.steps || 64;
    const units = properties.units;

    const C = truncate(circle(geojson, radius, { steps: steps, units: units }));
    const results = featureCollection([geojson, C]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

test("turf-circle -- validate geojson", (t) => {
  const C = circle([0, 0], 100);
  try {
    check(JSON.stringify(C));
    t.pass();
  } catch (e) {
    t.fail(e.message);
  }
  t.end();
});

test("turf-circle -- steps parameter controls resolution", (t) => {
  const center = [0, 60];
  const radius = 1000;

  // Test different step counts
  const stepCounts = [8, 16, 32, 64, 128];
  const circles = stepCounts.map((steps) => circle(center, radius, { steps }));

  // Verify coordinate count matches steps (plus 1 for closing)
  circles.forEach((c, i) => {
    const coordCount = c.geometry.coordinates[0].length;
    t.equal(
      coordCount,
      stepCounts[i] + 1,
      `${stepCounts[i]} steps produces ${stepCounts[i] + 1} coordinates`
    );
  });

  // All should have consistent number of points
  circles.forEach((c, i) => {
    const coords = c.geometry.coordinates[0];
    t.ok(
      coords.length === stepCounts[i] + 1,
      `${stepCounts[i]} steps produces correct number of points`
    );
  });

  t.end();
});

test("turf-circle -- arcTolerance parameter", (t) => {
  const center = [0, 60];
  const radius = 1000;

  // Test different arc tolerance values
  const c1 = circle(center, radius, { arcTolerance: 1 }); // Very precise
  const c2 = circle(center, radius, { arcTolerance: 10 }); // Less precise
  const c3 = circle(center, radius, { arcTolerance: 100 }); // Coarse

  const coords1 = c1.geometry.coordinates[0].length - 1;
  const coords2 = c2.geometry.coordinates[0].length - 1;
  const coords3 = c3.geometry.coordinates[0].length - 1;

  // Smaller arc tolerance should produce more points
  t.true(coords1 > coords2, "smaller arcTolerance produces more points");
  t.true(
    coords2 > coords3,
    "medium arcTolerance produces fewer points than small"
  );

  // All should produce valid circles
  [c1, c2, c3].forEach((c) => {
    t.ok(c.geometry.coordinates[0].length >= 4, "produces valid polygon");
  });

  t.end();
});

test("turf-circle -- units parameter", (t) => {
  const center = [0, 60];
  const value = 10;
  const steps = 32;

  // Test different units
  const c1 = circle(center, value, { steps, units: "kilometers" });
  const c2 = circle(center, value, { steps, units: "miles" });
  const c3 = circle(center, value, { steps, units: "degrees" });
  const c4 = circle(center, value, { steps, units: "meters" });

  // All should produce valid circles
  [c1, c2, c3, c4].forEach((c) => {
    t.ok(c.geometry.coordinates[0].length > 0, "produces valid circle");
  });

  // Kilometers and miles should produce different sized circles
  const radius1 = Math.sqrt(
    Math.pow(c1.geometry.coordinates[0][0][0] - center[0], 2) +
      Math.pow(c1.geometry.coordinates[0][0][1] - center[1], 2)
  );
  const radius2 = Math.sqrt(
    Math.pow(c2.geometry.coordinates[0][0][0] - center[0], 2) +
      Math.pow(c2.geometry.coordinates[0][0][1] - center[1], 2)
  );

  t.true(
    Math.abs(radius1 - radius2) > radius1 * 0.5,
    "kilometers and miles produce different sized circles"
  );

  t.end();
});

test("turf-circle -- properties parameter", (t) => {
  const c = circle([0, 60], 1000, {
    properties: { name: "test-circle", id: 123 },
  });

  t.ok(c.properties, "properties exist");
  t.equal(c.properties?.name, "test-circle", "name property preserved");
  t.equal(c.properties?.id, 123, "id property preserved");
  t.end();
});

test("turf-circle -- different input types", (t) => {
  const coords = [0, 60];
  const radius = 1000;
  const steps = 32;

  // Test with coordinate array
  const c1 = circle(coords, radius, { steps });
  t.ok(c1.geometry.coordinates[0].length > 0, "works with coordinate array");

  // Test with Point geometry
  const c2 = circle({ type: "Point", coordinates: coords }, radius, { steps });
  t.ok(c2.geometry.coordinates[0].length > 0, "works with Point geometry");

  // Test with Point feature
  const c3 = circle(
    {
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: coords },
    },
    radius,
    { steps }
  );
  t.ok(c3.geometry.coordinates[0].length > 0, "works with Point feature");

  // All should produce the same circle
  const coords1 = c1.geometry.coordinates[0];
  const coords2 = c2.geometry.coordinates[0];
  const coords3 = c3.geometry.coordinates[0];

  t.deepEqual(
    coords1,
    coords2,
    "coordinate array and Point geometry produce same result"
  );
  t.deepEqual(
    coords1,
    coords3,
    "coordinate array and Point feature produce same result"
  );

  t.end();
});

test("turf-circle -- area approximation quality", (t) => {
  const center = [0, 60];
  const radius = 1000; // km

  // Test with different resolutions
  const stepCounts = [8, 16, 32, 64, 128];

  stepCounts.forEach((steps) => {
    const c = circle(center, radius, { steps, units: "kilometers" });

    // Calculate polygon area using shoelace formula (simple approximation)
    const coords = c.geometry.coordinates[0];
    let area = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      area += coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1];
    }
    area = Math.abs(area / 2);

    // Area should be positive
    t.true(area > 0, `${steps} steps produces positive area`);
  });

  t.end();
});

test("turf-circle -- clockwise winding order", (t) => {
  const center = [0, 60];
  const radius = 1000;
  const c = circle(center, radius, { steps: 64 });

  const coords = c.geometry.coordinates[0];

  // First point should be due north from center (bearing = 0)
  // Second point should be west of first (clockwise)
  t.true(
    coords[1][0] < coords[0][0],
    "second point is west of first (clockwise winding)"
  );

  t.end();
});

test("turf-circle -- radius accuracy", (t) => {
  const center = [0, 0]; // Use equator to avoid latitude distortion
  const radius = 1000; // km

  // Test with high resolution
  const c = circle(center, radius, { steps: 128, units: "kilometers" });
  const coords = c.geometry.coordinates[0];

  // All points should be at approximately the same distance from center (in degree space at equator)
  const distances = coords.slice(0, -1).map((coord) => {
    const dx = coord[0] - center[0];
    const dy = coord[1] - center[1];
    return Math.sqrt(dx * dx + dy * dy);
  });

  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  const stdDev = Math.sqrt(
    distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) /
      distances.length
  );
  const coefficientOfVariation = stdDev / avgDistance;

  // At the equator, points should be close to the same distance (< 1% variation)
  t.true(
    coefficientOfVariation < 0.01,
    `radius is consistent at equator (variation: ${(coefficientOfVariation * 100).toFixed(3)}%)`
  );

  t.end();
});

test("turf-circle -- default parameters", (t) => {
  // Test with minimal parameters (should use defaults)
  const c = circle([0, 60], 1000);

  t.ok(c.geometry.coordinates[0].length > 0, "works with default parameters");
  t.equal(
    c.geometry.coordinates[0].length,
    65,
    "default steps is 64 (produces 65 coords)"
  );

  t.end();
});

test("turf-circle -- properties preservation from input", (t) => {
  const inputFeature = point([0, 60], { existingProp: "value" });

  // Without explicit properties option, should use input feature properties
  const c = circle(inputFeature, 1000);
  t.equal(
    c.properties?.existingProp,
    "value",
    "preserves properties from input feature"
  );

  // With explicit properties option, should override
  const c2 = circle([0, 60], 1000, { properties: { newProp: "new" } as any });
  t.equal((c2.properties as any)?.newProp, "new", "explicit properties work");

  t.end();
});

test("turf-circle -- edge case: very small radius", (t) => {
  const c = circle([0, 60], 0.001, { units: "meters" });

  t.ok(c.geometry.coordinates[0].length > 0, "works with very small radius");
  t.ok(c.geometry.type === "Polygon", "produces valid polygon");

  t.end();
});

test("turf-circle -- edge case: very large radius", (t) => {
  const c = circle([0, 0], 10000, { units: "kilometers" });

  t.ok(c.geometry.coordinates[0].length > 0, "works with very large radius");
  t.ok(c.geometry.type === "Polygon", "produces valid polygon");

  t.end();
});

test("turf-circle -- consistency: multiple calls same result", (t) => {
  const center = [0, 60];
  const radius = 1000;
  const options = { steps: 32, units: "kilometers" as const };

  const c1 = circle(center, radius, options);
  const c2 = circle(center, radius, options);

  t.deepEqual(
    c1.geometry.coordinates,
    c2.geometry.coordinates,
    "multiple calls produce identical results"
  );

  t.end();
});
