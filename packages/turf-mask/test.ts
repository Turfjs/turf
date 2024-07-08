import {
  Feature,
  FeatureCollection,
  Polygon,
  Position,
  MultiPolygon,
} from "geojson";
import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { mask } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKIP = ["multi-polygon.geojson", "overlapping.geojson"];

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(
      path.join(directories.in, filename)
    ) as FeatureCollection<Polygon | MultiPolygon>,
  };
});

test("turf-mask", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    if (-1 !== SKIP.indexOf(filename)) {
      continue;
    }

    const [polygon, masking] = geojson.features;
    const results = mask(polygon, masking as Feature<Polygon>);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("turf-mask polygon geometry", (t) => {
  // A polygon somewhere
  const polyCoords: Position[] = [
    [9, 13],
    [68, 13],
    [68, 50],
    [9, 50],
    [9, 13],
  ];

  const polygonGeometry: Polygon = {
    type: "Polygon",
    coordinates: [polyCoords],
  };

  let expectedResult = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [180, 90],
          [-180, 90],
          [-180, -90],
          [180, -90],
          [180, 90],
        ],
        polyCoords,
      ],
    },
  };

  let result = mask(polygonGeometry);
  t.deepEquals(result, expectedResult, "default mask");

  // A slightly larger polygon surrounding the one above
  const customMaskCoords: Position[] = [
    [6, 10],
    [71, 10],
    [71, 53],
    [6, 53],
    [6, 10],
  ];

  const maskGeometry: Polygon = {
    type: "Polygon",
    coordinates: [customMaskCoords],
  };

  expectedResult = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [customMaskCoords, polyCoords],
    },
  };

  result = mask(polygonGeometry, maskGeometry);
  t.deepEquals(result, expectedResult, "custom mask");

  t.end();
});
