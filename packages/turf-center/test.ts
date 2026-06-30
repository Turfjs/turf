import test from "node:test";
import center from "./index.ts";
import { featureCollection, lineString } from "@turf/helpers";
import { coordEach, featureEach } from "@turf/meta";
import bboxPolygon from "@turf/bbox-polygon";
import bbox from "@turf/bbox";
import type { Geometry } from "geojson";
import { testFixtures } from "../../support/testFixtures.mts";
import assert from "assert";

await test("center fixtures", async (t) => {
  await testFixtures(t, (geojson) => {
    const options = geojson.options || {};
    options.properties = { "marker-symbol": "star", "marker-color": "#F00" };
    const centered = center(geojson, options);

    // Display Results
    const results = featureCollection<Geometry>([centered]);
    featureEach(geojson, (feature) => results.features.push(feature));
    const extent = bboxPolygon(bbox(geojson));
    extent.properties = {
      stroke: "#00F",
      "stroke-width": 1,
      "fill-opacity": 0,
    };
    coordEach(extent, (coord) =>
      results.features.push(
        lineString([coord, centered.geometry.coordinates], {
          stroke: "#00F",
          "stroke-width": 1,
        })
      )
    );
    results.features.push(extent);

    return results;
  });
});

test("turf-center -- properties", () => {
  const line = lineString([
    [0, 0],
    [1, 1],
  ]);
  const pt = center(line, { properties: { foo: "bar" } });
  assert.strictEqual(pt.properties.foo, "bar", "translate properties");
});
