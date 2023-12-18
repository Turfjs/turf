import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { envelope } from "@turf/envelope";
import { truncate } from "@turf/truncate";
import { pointGrid } from "@turf/point-grid";
import { getCoords } from "@turf/invariant";
import { randomPolygon } from "@turf/random";
import { lineString } from "@turf/helpers";
import { matrixToGrid } from "./lib/matrix-to-grid";
import { isolines } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    json: loadJsonFileSync(directories.in + filename),
  };
});

test("isolines", (t) => {
  fixtures.forEach(({ name, json }) => {
    const options = json.properties || json;
    const { breaks, matrix, cellSize, origin } = options;

    // allow GeoJSON featureCollection or matrix
    let points = json.properties
      ? json
      : matrixToGrid(matrix, origin, cellSize, options);

    // Results
    const results = truncate(isolines(points, breaks, options));

    // Add red line around point data
    results.features.push(
      lineString(getCoords(envelope(points))[0], {
        description: "Debug line for testing",
        stroke: "#F00",
        "stroke-width": 1,
      })
    );

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + name + ".geojson", results);
    t.deepEqual(
      results,
      loadJsonFileSync(directories.out + name + ".geojson"),
      name
    );
  });

  t.end();
});

test("isolines - skipping first break, from issue #2129", (t) => {
  const points = pointGrid([0, 10, 20, 30], 100);
  for (var i = 0; i < points.features.length; i++) {
    points.features[i].properties.temperature = Math.random() * 12;
  }

  const breaks = [5, 10];

  const lines = isolines(points, breaks, {
    zProperty: "temperature",
    breaksProperties: [
      { name: "break5", stroke: "#F00" },
      { name: "break10", stroke: "#0F0" },
    ],
  });

  lines.features.push(
    lineString(getCoords(envelope(points))[0], {
      description: "Debug line for testing",
      stroke: "#F00",
      "stroke-width": 1,
    })
  );

  // Make sure an isoline is created for each break, and that its
  // geometry isn't empty.
  t.equal(lines.features[0].properties.name, "break5");
  t.assert(lines.features[0].geometry.coordinates[0].length > 1);
  t.equal(lines.features[1].properties.name, "break10");
  t.assert(lines.features[1].geometry.coordinates[0].length > 1);
  t.end();
});

test("isolines -- throws", (t) => {
  const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);

  t.throws(() => isolines(randomPolygon()), "invalid points");
  t.throws(() => isolines(points), /breaks is required/);
  t.throws(() => isolines(points, "string"), /breaks must be an Array/);
  t.throws(
    () => isolines(points, [1, 2, 3], { commonProperties: "foo" }),
    /commonProperties must be an Object/
  );
  t.throws(
    () => isolines(points, [1, 2, 3], { breaksProperties: "foo" }),
    /breaksProperties must be an Array/
  );

  // Updated tests since Turf 5.0
  t.assert(
    isolines(points, [1, 2, 3], { zProperty: 5 }),
    "zProperty can be a string"
  );
  t.end();
});

test("isolines -- handling properties", (t) => {
  const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);
  const commonProperties = { name: "unknown", source: "foobar" };
  const breaksProperties = [
    { name: "break1" },
    { name: "break2" },
    { name: "break3" },
  ];

  const lines = isolines(points, [1, 2, 3], {
    zProperty: "z",
    commonProperties: commonProperties,
    breaksProperties: breaksProperties,
  });
  t.equal(lines.features[0].properties.name, "break1");
  t.equal(lines.features[0].properties.source, "foobar");
  t.end();
});
