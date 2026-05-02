import { featureCollection } from "@turf/helpers";
import { bezierSpline } from "./index.ts";
import { testFixtures } from "../../support/testFixtures.mts";
import test from "node:test";

await test("turf-bezier-spline fixtures", async (t) => {
  await testFixtures(t, (geojson) => {
    const spline = colorize(bezierSpline(geojson));
    return featureCollection([spline, geojson]);
  });
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
