import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import mask from "./index";

const SKIP = [];

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(path.join(directories.in, filename)),
  };
});

test("turf-mask", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    if (-1 !== SKIP.indexOf(filename)) {
      continue;
    }

    const [polygon, masking] = geojson.features;
    const results = mask(polygon, masking);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  }
  t.end();
});

test("turf-mask-ignoreHoles", (t) => {
  const { name, geojson } = fixtures.find(
    (f) => f.name === "polygon-with-hole"
  );
  const [polygon, masking] = geojson.features;
  const results = mask(polygon, masking, {
    ignoreHoles: false,
  });

  t.deepEquals(
    results,
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [180, 90],
              [-180, 90],
              [-180, -90],
              [180, -90],
              [180, 90],
            ],
            [
              [0, 0],
              [16, 0],
              [16, 16],
              [0, 16],
              [0, 0],
            ],
          ],
          [
            [
              [6, 6],
              [6, 10],
              [10, 10],
              [10, 6],
              [6, 6],
            ],
          ],
        ],
      },
    },
    name
  );
  t.end();
});

test("turf-mask with options but no mask", (t) => {
  const { name, geojson } = fixtures.find(
    (f) => f.name === "polygon-with-hole"
  );
  const [polygon] = geojson.features;
  const results = mask(polygon, {
    ignoreHoles: false,
  });

  t.deepEquals(
    results,
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [180, 90],
              [-180, 90],
              [-180, -90],
              [180, -90],
              [180, 90],
            ],
            [
              [0, 0],
              [16, 0],
              [16, 16],
              [0, 16],
              [0, 0],
            ],
          ],
          [
            [
              [6, 6],
              [6, 10],
              [10, 10],
              [10, 6],
              [6, 6],
            ],
          ],
        ],
      },
    },
    name
  );
  t.end();
});
