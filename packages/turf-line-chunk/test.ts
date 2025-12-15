import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { featureEach } from "@turf/meta";
import {
  lineString,
  featureCollection,
  point,
  geometryCollection,
} from "@turf/helpers";
import { lineChunk } from "./index.js";
import { Feature } from "geojson";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    geojson: loadJsonFileSync(directories.in + filename) as any,
  };
});

test("turf-line-chunk: shorter", (t) => {
  for (let { filename, geojson } of fixtures) {
    const chunked = colorize(
      truncate(lineChunk(geojson, 5, { units: "miles" }))
    );
    filename = filename.replace(".geojson", ".shorter.geojson");
    if (process.env.REGEN) {
      writeJsonFileSync(directories.out + filename, chunked);
    }

    const expected = loadJsonFileSync(directories.out + filename);
    t.deepEquals(chunked, expected, path.parse(filename).name);
  }
  t.end();
});

test("turf-line-chunk: longer", (t) => {
  for (let { filename, geojson } of fixtures) {
    const chunked = colorize(
      truncate(lineChunk(geojson, 50, { units: "miles" }))
    );
    filename = filename.replace(".geojson", ".longer.geojson");
    if (process.env.REGEN) {
      writeJsonFileSync(directories.out + filename, chunked);
    }

    const expected = loadJsonFileSync(directories.out + filename);
    t.deepEquals(chunked, expected, path.parse(filename).name);
  }
  t.end();
});

test("turf-line-chunk: reverse", (t) => {
  for (let { filename, geojson } of fixtures) {
    const chunked = colorize(
      truncate(lineChunk(geojson, 5, { units: "miles", reverse: true }))
    );
    filename = filename.replace(".geojson", ".reverse.geojson");
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, chunked);

    const expected = loadJsonFileSync(directories.out + filename);
    t.deepEquals(chunked, expected, path.parse(filename).name);
  }
  t.end();
});

test("turf-line-chunk: Support Geometry Objects", (t) => {
  const line = lineString([
    [11, 0],
    [22, 4],
    [31, 0],
    [31, 11],
    [21, 15],
    [11, 11],
    [11, 0],
  ]);
  t.assert(lineChunk(line.geometry, 10), "support geometry objects");
  t.end();
});

test("turf-line-chunk: Prevent input mutation", (t) => {
  const line = lineString([
    [11, 0],
    [22, 4],
    [31, 0],
    [31, 11],
    [21, 15],
    [11, 11],
    [11, 0],
  ]);
  const before = JSON.parse(JSON.stringify(line));
  lineChunk(line, 10);
  t.deepEqual(line, before, "input should not mutate");
  t.end();
});

test("turf-line-chunk: Validate behavior on unsupported geometry types", (t) => {
  // Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;

  // each of these `as any` casts are required to bypass the TypeScript rejection and actually test the validation underneath
  t.throws(() => {
    lineChunk({ type: "Point", geometry: [0, 0] } as any, 10);
  }, "Point geometries are rejected");

  t.throws(() => {
    lineChunk({ type: "MultiPoint", geometry: [[0, 0]] } as any, 10);
  }, "MultiPoint geometries are rejected");

  t.throws(() => {
    lineChunk(
      {
        type: "Polygon",
        geometry: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
      } as any,
      10
    );
  }, "Polygon geometries are rejected");

  t.throws(() => {
    lineChunk(
      {
        type: "MultiPolygon",
        geometry: [
          [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0],
            ],
          ],
        ],
      } as any,
      10
    );
  }, "MultiPolygons geometries are rejected");

  t.end();
});

/**
 * Colorize FeatureCollection
 *
 * @param {FeatureCollection|Feature<any>} geojson Feature or FeatureCollection
 * @returns {FeatureCollection<any>} colorized FeatureCollection
 */
function colorize(geojson: any) {
  const results: Feature[] = [];
  featureEach(geojson, (feature, index) => {
    const r = index % 2 === 0 ? "F" : "0";
    const g = index % 2 === 0 ? "0" : "0";
    const b = index % 2 === 0 ? "0" : "F";
    feature.properties = Object.assign(
      {
        stroke: "#" + r + g + b,
        "stroke-width": 10,
      },
      feature.properties
    );
    results.push(feature);
  });
  return featureCollection(results);
}
