import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { moranIndex } from "./index.js";
import { featureCollection, point } from "@turf/helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("moranIndex forwards a zero decay exponent", (t) => {
  const points = featureCollection(
    [
      [0, 0],
      [1, 2],
      [3, 4],
      [7, 1],
    ].map((coords, i) => point(coords, { value: i * i }))
  );
  for (const standardization of [false, true]) {
    const options = { inputField: "value", standardization };
    const actual = moranIndex(points, { ...options, alpha: 0 });
    const uniform = moranIndex(points, { ...options, binary: true });
    t.equal(
      actual.moranIndex,
      uniform.moranIndex,
      `zero decay equals uniform weights, standardized=${standardization}`
    );
  }
  t.end();
});

test("turf-moran-index", (t) => {
  const pointPath = path.join(__dirname, "test", "in", "point.json");
  const pointJson = loadJsonFileSync(pointPath);

  const result = moranIndex(pointJson, {
    inputField: "CRIME",
  });

  t.deepEqual(
    result,
    {
      moranIndex: 0.15665417693293948,
      expectedMoranIndex: -0.020833333333333332,
      stdNorm: 0.022208244679327364,
      zNorm: 7.991964823383264,
    },
    "point clustered pattern"
  );

  const columbusPath = path.join(__dirname, "test", "in", "columbus.json");
  const columbusJson = loadJsonFileSync(columbusPath);

  const result1 = moranIndex(columbusJson, {
    inputField: "CRIME",
  });

  t.deepEqual(
    result1,
    {
      moranIndex: 0.14834323679862615,
      expectedMoranIndex: -0.020833333333333332,
      stdNorm: 0.023841569242427897,
      zNorm: 7.0958655620241995,
    },
    "polygon clustered pattern"
  );

  t.end();
});
