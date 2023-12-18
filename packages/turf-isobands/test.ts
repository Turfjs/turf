import fs from "fs";
import test from "tape";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { envelope } from "@turf/envelope";
import { pointGrid } from "@turf/point-grid";
import { truncate } from "@turf/truncate";
import { getCoords } from "@turf/invariant";
import { lineString } from "@turf/helpers";
import { randomPolygon } from "@turf/random";
import { matrixToGrid } from "./lib/matrix-to-grid";
import { isobands } from "./index";

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

test("isobands", (t) => {
  fixtures.forEach(({ name, json }) => {
    const options = json.properties || json;
    const { breaks, matrix, origin, cellSize } = options;

    // allow GeoJSON featureCollection or matrix
    let points = json.properties
      ? json
      : matrixToGrid(matrix, origin, cellSize, options);

    // Results
    const results = truncate(isobands(points, breaks, options));

    // Add line around point data
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

test("isobands - flat data, from issue #1797", (t) => {
  const points = pointGrid(
    [-70.823364, -33.553984, -70.473175, -33.302986],
    5,
    {
      properties: { elevation: 1 },
    }
  );

  const lines = isobands(points, [0, 2]);
  t.assert(lines.features[0].geometry.coordinates[0][0].length > 4);
  t.end();
});

test("isobands -- throws", (t) => {
  const points = pointGrid([-70.823364, -33.553984, -70.473175, -33.302986], 5);

  t.throws(() => isobands(randomPolygon(), [1, 2, 3]), "invalid points");
  t.throws(() => isobands(points, ""), "invalid breaks");
  t.throws(
    () =>
      isobands(points, [1, 2, 3], {
        zProperty: "temp",
        breaksProperties: "hello",
      }),
    "invalid options"
  );

  t.end();
});
