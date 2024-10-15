import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { area } from "./index.js";
import { polygon } from "@turf/helpers";
import { Polygon } from "geojson";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});

test("turf-area", (t) => {
  for (const fixture of fixtures) {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const results = Math.round(area(geojson));
    if (process.env.REGEN)
      writeJsonFileSync(directories.out + name + ".json", results);
    t.equal(results, loadJsonFileSync(directories.out + name + ".json"), name);
  }
  t.end();
});

test("turf-area-length-check", (t) => {
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
  t.equal(result, 0);

  t.end();
});

test("turf-area-rotation-consistency", (t) => {
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
    t.equal(result, curResult);
  }
  t.end();
});
