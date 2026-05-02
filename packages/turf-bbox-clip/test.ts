import { point, feature, featureCollection } from "@turf/helpers";
import { bbox as turfBBox } from "@turf/bbox";
import { bboxClip } from "./index.ts";
import { testFixtures } from "../../support/testFixtures.mts";
import assert from "assert";
import test from "node:test";

await test("bboxClip features", async (t) => {
  await testFixtures(t, (geojson) => {
    const feature = geojson.features[0];
    const bbox = turfBBox(geojson.features[1]);
    const clipped = bboxClip(feature, bbox);
    return featureCollection([
      colorize(feature, "#080"),
      colorize(clipped, "#F00"),
      colorize(geojson.features[1], "#00F", 3),
    ]);
  });
});

test("turf-bbox-clip -- throws", () => {
  assert.throws(() => {
    bboxClip(point([5, 10]) as any, [-180, -90, 180, 90]);
  }, /geometry Point not supported/);
});

test("turf-bbox-clip -- null geometries", () => {
  assert.throws(
    () => bboxClip(feature(null as any), [-180, -90, 180, 90]),
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
});

function colorize(feature: any, color = "#F00", width = 6) {
  feature.properties = {
    stroke: color,
    fill: color,
    "stroke-width": width,
    "fill-opacity": 0.1,
  };
  return feature;
}
