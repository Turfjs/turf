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
  polygon,
  geometryCollection,
} from "@turf/helpers";
import { buffer } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

var fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});
// fixtures = fixtures.filter(({name}) => name === 'feature-collection-points');

test("turf-buffer", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const properties = geojson.properties || {};
    const radius = properties.radius || 50;
    const units = properties.units || "miles";
    const steps = properties.steps;

    const buffered = truncate(
      buffer(geojson, radius, { units: units, steps: steps })
    );

    // Add Results to FeatureCollection
    const results = featureCollection([]);
    featureEach(buffered, (feature) =>
      results.features.push(colorize(feature, "#F00"))
    );
    featureEach(geojson, (feature) =>
      results.features.push(colorize(feature, "#00F"))
    );

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEqual(results, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

// https://github.com/Turfjs/turf/pull/736
test("turf-buffer - Support Negative Buffer", (t) => {
  const poly = polygon([
    [
      [11, 0],
      [22, 4],
      [31, 0],
      [31, 11],
      [21, 15],
      [11, 11],
      [11, 0],
    ],
  ]);

  t.assert(buffer(poly, -50), "allow negative buffer param");
  t.end();
});

test("turf-buffer - Support Geometry Objects", (t) => {
  const pt = point([61, 5]);
  const poly = polygon([
    [
      [11, 0],
      [22, 4],
      [31, 0],
      [31, 11],
      [21, 15],
      [11, 11],
      [11, 0],
    ],
  ]);
  const gc = geometryCollection([pt.geometry, poly.geometry]);

  t.assert(buffer(gc, 10), "support Geometry Collection");
  t.assert(buffer(pt.geometry, 10), "support Point Geometry");
  t.assert(buffer(poly.geometry, 10), "support Polygon Geometry");
  t.end();
});

test("turf-buffer - Prevent Input Mutation", (t) => {
  const pt = point([61, 5]);
  const poly = polygon([
    [
      [11, 0],
      [22, 4],
      [31, 0],
      [31, 11],
      [21, 15],
      [11, 11],
      [11, 0],
    ],
  ]);
  const collection = featureCollection([pt, poly]);

  const beforePt = JSON.parse(JSON.stringify(pt));
  const beforePoly = JSON.parse(JSON.stringify(poly));
  const beforeCollection = JSON.parse(JSON.stringify(collection));

  buffer(pt, 10);
  buffer(poly, 10);
  buffer(collection, 10);

  t.deepEqual(pt, beforePt, "pt should not mutate");
  t.deepEqual(poly, beforePoly, "poly should not mutate");
  t.deepEqual(collection, beforeCollection, "collection should not mutate");
  t.end();
});

// https://github.com/Turfjs/turf/issues/745
// https://github.com/Turfjs/turf/pull/736#issuecomment-301937747
test("turf-buffer - morphological closing", (t) => {
  const poly = polygon([
    [
      [11, 0],
      [22, 4],
      [31, 0],
      [31, 11],
      [21, 15],
      [11, 11],
      [11, 0],
    ],
  ]);

  t.equal(
    buffer(poly, -500, { units: "miles" }),
    undefined,
    "empty geometry should be undefined"
  );
  t.deepEqual(
    buffer(featureCollection([poly]), -500, { units: "miles" }),
    featureCollection([]),
    "empty geometries should be an empty FeatureCollection"
  );
  t.end();
});

test("turf-buffer - undefined return", (t) => {
  const poly: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-101.87842323574378, 52.250446362382775],
          [-101.87842323574378, 49.56446202085259],
          [-98.29404114999511, 49.56446202085259],
          [-98.29404114999511, 52.250446362382775],
          [-101.87842323574378, 52.250446362382775],
        ],
      ],
    },
  };

  t.equal(
    buffer(poly, -100000000),
    undefined,
    "empty geometry should be undefined if the resulting geometry is invalid"
  );
  t.end();
});

test("turf-buffer - endcap styles", (t) => {
  const pt = point([-97, 49.8]);

  const pointFc = featureCollection([pt]);

  const pointDefault = buffer(pointFc, 10, { units: "miles" });
  const pointRound = buffer(pointFc, 10, {
    units: "miles",
    endCapStyle: "round",
  });
  const pointButt = buffer(pointFc, 10, {
    units: "miles",
    endCapStyle: "butt",
  });

  t.deepEqual(
    pointDefault,
    pointRound,
    "point - default and round produce the same result"
  );
  t.deepEqual(
    pointDefault,
    pointButt,
    "point - buffers are not affected by end cap style"
  );

  const poly = polygon([
    [
      [11, 0],
      [22, 4],
      [31, 0],
      [31, 11],
      [21, 15],
      [11, 11],
      [11, 0],
    ],
  ]);

  const polyDefault = buffer(poly, 10, { units: "miles" });
  const polyFlat = buffer(poly, 10, {
    units: "miles",
    endCapStyle: "flat",
  });
  t.deepEqual(
    polyDefault,
    polyFlat,
    "polygon - buffers are not affected by end cap style"
  );

  const ln = lineString([
    [-113.5, 53.5],
    [-114, 51.1],
    [-97, 49.8],
  ]);

  const lineFc = featureCollection([ln]);
  const lineDefault = buffer(lineFc, 10, { units: "miles" });
  const lineRound = buffer(lineFc, 10, {
    units: "miles",
    endCapStyle: "round",
  });
  const lineFlat = buffer(lineFc, 10, { units: "miles", endCapStyle: "flat" });
  const lineButt = buffer(lineFc, 10, { units: "miles", endCapStyle: "butt" });
  const lineSquare = buffer(lineFc, 10, {
    units: "miles",
    endCapStyle: "square",
  });

  t.deepEqual(
    lineDefault,
    lineRound,
    "line - default and round produce the same result"
  );
  t.deepEqual(
    lineFlat,
    lineButt,
    "line - flat and butt produce the same result"
  );
  t.isNotDeepEqual(
    lineRound,
    lineFlat,
    "line - round and flat produce different results"
  );
  t.isNotDeepEqual(
    lineRound,
    lineSquare,
    "line - round and square produce different results"
  );
  t.isNotDeepEqual(
    lineSquare,
    lineFlat,
    "line - square and flat produce different results"
  );

  t.end();
});

function colorize(feature, color) {
  color = color || "#F00";
  if (feature.properties) {
    feature.properties.stroke = color;
    feature.properties.fill = color;
    feature.properties["marker-color"] = color;
    feature.properties["fill-opacity"] = 0.3;
  }
  return feature;
}
