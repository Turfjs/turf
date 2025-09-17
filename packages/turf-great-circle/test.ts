import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import type {
  FeatureCollection,
  LineString,
  Feature,
  Geometry,
  Point,
} from "geojson";
import { truncate } from "@turf/truncate";
import { featureCollection, point, lineString } from "@turf/helpers";
import { greatCircle } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(
      path.join(directories.in, filename)
    ) as FeatureCollection,
  };
});

// Function to get the start and end points from the fixture
function getStartEndPoints(fixture: (typeof fixtures)[0]) {
  const geojson = fixture.geojson;
  const start = geojson.features[0] as Feature<Point>;
  const end = geojson.features[1] as Feature<Point>;
  return { start, end };
}

test("turf-great-circle", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const filename = fixture.filename;
    const { start, end } = getStartEndPoints(fixture);

    const line = truncate(greatCircle(start, end));
    const results = featureCollection<Geometry>([line, start, end]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

test("turf-great-circle with same input and output", (t) => {
  const start = point([0, 0]);
  const end = point([0, 0]);
  const line = greatCircle(start, end, {
    npoints: 4,
  });

  t.deepEquals(
    lineString([
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ]),
    line as Feature<LineString>
  );

  t.end();
});

test("turf-great-circle accepts Feature<Point> inputs", (t) => {
  const { start, end } = getStartEndPoints(fixtures[0]);
  t.doesNotThrow(
    () => greatCircle(start, end),
    "accepts Feature<Point> inputs"
  );
  t.end();
});

test("turf-great-circle accepts Point geometry inputs", (t) => {
  const { start, end } = getStartEndPoints(fixtures[0]);
  t.doesNotThrow(
    () => greatCircle(start.geometry, end.geometry),
    "accepts Point geometry inputs"
  );
  t.end();
});

test("turf-great-circle accepts Position inputs", (t) => {
  const { start, end } = getStartEndPoints(fixtures[0]);
  t.doesNotThrow(
    () => greatCircle(start.geometry.coordinates, end.geometry.coordinates),
    "accepts Position inputs"
  );
  t.end();
});

test("turf-great-circle applies custom properties", (t) => {
  const { start, end } = getStartEndPoints(fixtures[0]);
  const withProperties = greatCircle(start, end, {
    properties: { name: "Test Route" },
  });
  t.equal(
    withProperties.properties?.name,
    "Test Route",
    "applies custom properties"
  );
  t.end();
});

test("turf-great-circle respects npoints option", (t) => {
  const { start, end } = getStartEndPoints(fixtures[0]);
  const withCustomPoints = greatCircle(start, end, { npoints: 5 });
  t.equal(
    (withCustomPoints.geometry as LineString).coordinates.length,
    5,
    "respects npoints option"
  );
  t.end();
});

test("turf-great-circle respects offset and npoints options", (t) => {
  const { start, end } = getStartEndPoints(fixtures[0]);
  const withOffset = greatCircle(start, end, { offset: 100, npoints: 10 });
  t.equal(
    (withOffset.geometry as LineString).coordinates.length,
    10,
    "respects offset and npoints options"
  );
  t.end();
});

test("turf-great-circle with antipodal start and end", (t) => {
  const start = point([0, 90]);
  const end = point([0, -90]);

  t.throws(() => {
    greatCircle(start, end, {
      npoints: 4,
    });
  }, "it appears 0,90 and 0,-90 are 'antipodal', e.g diametrically opposite, thus there is no single route but rather infinite");

  t.end();
});
