import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import envelope from "@turf/envelope";
import truncate from "@turf/truncate";
import pointGrid from "@turf/point-grid";
import { getCoords } from "@turf/invariant";
import { randomPolygon } from "@turf/random";
import { lineString } from "@turf/helpers";
import matrixToGrid from "./lib/matrix-to-grid";
import isolines from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    json: load.sync(directories.in + filename),
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
        stroke: "#F00",
        "stroke-width": 1,
      })
    );

    if (process.env.REGEN)
      write.sync(directories.out + name + ".geojson", results);
    t.deepEqual(results, load.sync(directories.out + name + ".geojson"), name);
  });

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
  t.equal(lines.features[0].properties.name, "break2");
  t.equal(lines.features[0].properties.source, "foobar");
  t.end();
});
