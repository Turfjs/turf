import { truncate } from "@turf/truncate";
import { featureEach } from "@turf/meta";
import {
  featureCollection,
  point,
  polygon,
  geometryCollection,
} from "@turf/helpers";
import { buffer } from "./index.ts";
import { testFixtures } from "../../support/testFixtures.mts";
import test from "node:test";
import assert from "assert";

await test("buffer fixtures", async (t) => {
  await testFixtures(t, (geojson) => {
    const { radius = 50, units = "miles", steps } = geojson.properties ?? {};

    const buffered = truncate(
      buffer(geojson, radius, { units: units, steps: steps })!
    );

    // Add Results to FeatureCollection
    const results = featureCollection([]);
    featureEach(buffered, (feature) =>
      results.features.push(colorize(feature, "#F00"))
    );
    featureEach(geojson, (feature) =>
      results.features.push(colorize(feature, "#00F"))
    );

    return results;
  });
});

// https://github.com/Turfjs/turf/pull/736
test("turf-buffer - Support Negative Buffer", () => {
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

  assert(buffer(poly, -50), "allow negative buffer param");
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

  assert(buffer(gc, 10), "support Geometry Collection");
  assert(buffer(pt.geometry, 10), "support Point Geometry");
  assert(buffer(poly.geometry, 10), "support Polygon Geometry");
});

test("turf-buffer - Prevent Input Mutation", () => {
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
  const collection = featureCollection([pt as any, poly]);

  const beforePt = JSON.parse(JSON.stringify(pt));
  const beforePoly = JSON.parse(JSON.stringify(poly));
  const beforeCollection = JSON.parse(JSON.stringify(collection));

  buffer(pt, 10);
  buffer(poly, 10);
  buffer(collection, 10);

  assert.deepEqual(pt, beforePt, "pt should not mutate");
  assert.deepEqual(poly, beforePoly, "poly should not mutate");
  assert.deepEqual(
    collection,
    beforeCollection,
    "collection should not mutate"
  );
});

// https://github.com/Turfjs/turf/issues/745
// https://github.com/Turfjs/turf/pull/736#issuecomment-301937747
test("turf-buffer - morphological closing", () => {
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

  assert.strictEqual(
    buffer(poly, -500, { units: "miles" }),
    undefined,
    "empty geometry should be undefined"
  );
  assert.deepEqual(
    buffer(featureCollection([poly]), -500, { units: "miles" }),
    featureCollection([]),
    "empty geometries should be an empty FeatureCollection"
  );
});

test("turf-buffer - undefined return", () => {
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

  assert.strictEqual(
    buffer(poly, -100000000),
    undefined,
    "empty geometry should be undefined if the resulting geometry is invalid"
  );
});

function colorize(feature: any, color = "#F00") {
  if (feature.properties) {
    feature.properties.stroke = color;
    feature.properties.fill = color;
    feature.properties["marker-color"] = color;
    feature.properties["fill-opacity"] = 0.3;
  }
  return feature;
}
