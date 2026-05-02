import test from "node:test";
import { area } from "./index.js";
import { polygon } from "@turf/helpers";
import { Polygon } from "geojson";
import { testFixtures } from "../../support/testFixtures.mts";
import assert from "assert";

await test("area fixtures", async (t) => {
  await testFixtures(t, (geojson) => {
    return Math.round(area(geojson));
  });
});

test("turf-area -- length-check", () => {
  const invalidPoly: Polygon = {
    type: "Polygon",
    coordinates: [
      [
        [101.0, 0.0],
        [101.0, 0.5],
        [101.5, 0.5],
      ],
    ],
  };
  const result = area(invalidPoly);
  assert.strictEqual(result, 0);
});

test("turf-area rotation-consistency", () => {
  const rotatingPoly = polygon([
    [
      [28.321755510202507, 16.35627490376781],
      [20.424575867090823, 1.7575215418945476],
      [48.254218513706036, 20.42650462625916],
      [36.310934132380964, 14.226760576846956],
      [28.321755510202507, 16.35627490376781],
    ],
  ]);
  const result = area(rotatingPoly);
  const changingPoly = polygon([
    [
      [0.0, 0.0],
      [0.0, 0.0],
      [0.0, 0.0],
      [0.0, 0.0],
      [0.0, 0.0],
    ],
  ]);
  for (let i = 1; i < 5; i++) {
    changingPoly.geometry.coordinates[0][0] =
      rotatingPoly.geometry.coordinates[0][i];
    changingPoly.geometry.coordinates[0][1] =
      rotatingPoly.geometry.coordinates[0][(i + 1) % 4];
    changingPoly.geometry.coordinates[0][2] =
      rotatingPoly.geometry.coordinates[0][(i + 2) % 4];
    changingPoly.geometry.coordinates[0][3] =
      rotatingPoly.geometry.coordinates[0][(i + 3) % 4];
    changingPoly.geometry.coordinates[0][4] =
      rotatingPoly.geometry.coordinates[0][i];

    const curResult = area(changingPoly);
    assert.strictEqual(result, curResult);
  }
});
