import test from "tape";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { center } from "@turf/center";
import { truncate } from "@turf/truncate";
import { centerMean } from "@turf/center-mean";
import { centerOfMass } from "@turf/center-of-mass";
import { featureCollection, point, round } from "@turf/helpers";
import { centerMedian } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("centerMedian weights agree with repeated observations", (t) => {
  const coordinates = [
    [0, 0],
    [4, 1],
    [2, 5],
    [8, 3],
  ];
  const weights = [1, 3, 5, 2];
  const repeated = featureCollection(
    coordinates.flatMap((coords, i) =>
      Array.from({ length: weights[i] }, () => point(coords))
    )
  );
  const options = { counter: 20, tolerance: 1e-8 };
  const expected = centerMedian(repeated, options).geometry.coordinates;

  for (const scale of [1, 0.5]) {
    const weighted = featureCollection(
      coordinates.map((coords, i) =>
        point(coords, { population: weights[i] * scale })
      )
    );
    const actual = centerMedian(weighted, { ...options, weight: "population" })
      .geometry.coordinates;
    for (let i = 0; i < 2; i++) {
      t.ok(
        Math.abs(actual[i] - expected[i]) < 1e-7,
        `coordinate ${i}, weight scale ${scale}`
      );
    }
  }
  t.end();
});

test("turf-center-median", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      // Define params
      const { name } = path.parse(filepath);
      const geojson = loadJsonFileSync(filepath);
      const options = geojson.properties;

      // Calculate Centers
      const meanCenter = centerMean(geojson, options);
      const medianCenter = centerMedian(geojson, options);
      const extentCenter = center(geojson);
      const massCenter = centerOfMass(geojson);

      // Truncate median properties
      medianCenter.properties.medianCandidates.forEach((candidate, index) => {
        medianCenter.properties.medianCandidates[index] = [
          round(candidate[0], 6),
          round(candidate[1], 6),
        ];
      });
      const results = featureCollection([
        ...geojson.features,
        colorize(meanCenter, "#a00"),
        colorize(medianCenter, "#0a0"),
        colorize(extentCenter, "#00a"),
        colorize(massCenter, "#aaa"),
      ]);

      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) writeJsonFileSync(out, results);
      t.deepEqual(results, loadJsonFileSync(out), name);
    });
  t.end();
});

function colorize(point, color) {
  point.properties["marker-color"] = color;
  point.properties["marker-symbol"] = "cross";
  return truncate(point);
}
