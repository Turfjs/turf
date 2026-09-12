import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { along } from "@turf/along";
import { length } from "@turf/length";
import { lineSliceAlong } from "./index.js";
import { Feature, LineString } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

var line1: Feature<LineString> = loadJsonFileSync(
  path.join(__dirname, "test", "fixtures", "line1.geojson")
);
var route1: Feature<LineString> = loadJsonFileSync(
  path.join(__dirname, "test", "fixtures", "route1.geojson")
);
var route2: Feature<LineString> = loadJsonFileSync(
  path.join(__dirname, "test", "fixtures", "route2.geojson")
);

test("turf-line-slice-along -- line1", function (t) {
  var start = 500;
  var stop = 750;
  var options = { units: "miles" } as const;

  var start_point = along(line1, start, options);
  var end_point = along(line1, stop, options);
  var sliced = lineSliceAlong(line1, start, stop, options);
  t.equal(sliced.type, "Feature");
  t.equal(sliced.geometry.type, "LineString");
  t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
  t.deepEqual(
    sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1],
    end_point.geometry.coordinates
  );
  t.end();
});

test("turf-line-slice-along -- line1 overshoot", function (t) {
  var start = 500;
  var stop = 1500;
  var options = { units: "miles" } as const;

  var start_point = along(line1, start, options);
  var end_point = along(line1, stop, options);
  var sliced = lineSliceAlong(line1, start, stop, options);
  t.equal(sliced.type, "Feature");
  t.equal(sliced.geometry.type, "LineString");
  t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
  t.deepEqual(
    sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1],
    end_point.geometry.coordinates
  );
  t.end();
});

test("turf-line-slice-along -- route1", function (t) {
  var start = 500;
  var stop = 750;
  var options = { units: "miles" } as const;

  var start_point = along(route1, start, options);
  var end_point = along(route1, stop, options);
  var sliced = lineSliceAlong(route1, start, stop, options);
  t.equal(sliced.type, "Feature");
  t.equal(sliced.geometry.type, "LineString");
  t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
  t.deepEqual(
    sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1],
    end_point.geometry.coordinates
  );
  t.end();
});

test("turf-line-slice-along -- route2", function (t) {
  var start = 25;
  var stop = 50;
  var options = { units: "miles" } as const;

  var start_point = along(route2, start, options);
  var end_point = along(route2, stop, options);
  var sliced = lineSliceAlong(route2, start, stop, options);
  t.equal(sliced.type, "Feature");
  t.equal(sliced.geometry.type, "LineString");
  t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
  t.deepEqual(
    sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1],
    end_point.geometry.coordinates
  );
  t.end();
});

test("turf-line-slice-along -- start longer than line length", function (t) {
  var start = 500000;
  var stop = 800000;
  var options = { units: "miles" } as const;

  t.throws(
    () => lineSliceAlong(line1, start, stop, options),
    "Start position is beyond line"
  );
  t.end();
});

test("turf-line-slice-along -- start equal to line length", function (t) {
  var options = { units: "miles" } as const;
  var start = length(line1, options);
  var stop = start + 100;

  var start_point = along(line1, start, options);
  var end_point = along(line1, stop, options);
  var sliced = lineSliceAlong(line1, start, stop, options);

  t.equal(sliced.type, "Feature");
  t.equal(sliced.geometry.type, "LineString");
  t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
  t.deepEqual(
    sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1],
    end_point.geometry.coordinates
  );
  t.end();
});
// Issue #3007: interpolated endpoint vertices must carry interpolated altitude,
// not the far-endpoint altitude copied by destination().
test("turf-line-slice-along -- altitude interpolation at stop (issue #3007)", function (t) {
  // A ~100 m segment from elevation 0 → 100.
  // Slicing at the approximate midpoint (0→50 m) must yield an interpolated
  // stop vertex near elevation 50, not the far endpoint's elevation of 100.
  const elevLine = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [
        [0, 0, 0],
        [0, 0.0009, 100], // ≈ 100 m north, elevation 100 m
      ],
    },
  };
  const sliced = lineSliceAlong(elevLine, 0, 50, { units: "meters" });
  const endCoord =
    sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1];
  t.equal(
    endCoord.length,
    3,
    "interpolated stop vertex has altitude component"
  );
  t.ok(
    Math.abs((endCoord[2] as number) - 50) < 2,
    `stop altitude should be ~50 m, got ${endCoord[2]}`
  );
  t.end();
});

test("turf-line-slice-along -- altitude interpolation at start (issue #3007)", function (t) {
  // Slicing a 3-D segment starting mid-segment: the interpolated start vertex
  // must have altitude proportional to position, not a copy of the near endpoint.
  const elevLine = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [
        [0, 0, 0],
        [0, 0.0009, 100], // ≈ 100 m, elevation 100 m
      ],
    },
  };
  // Slice from ≈25 m to end — the interpolated start vertex should be ~alt 25.
  const sliced = lineSliceAlong(elevLine, 25, 90, { units: "meters" });
  const startCoord = sliced.geometry.coordinates[0];
  t.equal(
    startCoord.length,
    3,
    "interpolated start vertex has altitude component"
  );
  t.ok(
    Math.abs((startCoord[2] as number) - 25) < 2,
    `start altitude should be ~25 m, got ${startCoord[2]}`
  );
  t.end();
});

test("turf-line-slice-along -- no spurious altitude on 2-D line (issue #3007)", function (t) {
  // A 2-D line must produce 2-D interpolated vertices — no altitude should appear.
  const line2d = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [
        [0, 0],
        [0, 0.0009],
      ],
    },
  };
  const sliced = lineSliceAlong(line2d, 0, 50, { units: "meters" });
  const endCoord =
    sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1];
  t.equal(endCoord.length, 2, "2-D line produces 2-D interpolated vertex");
  t.end();
});
