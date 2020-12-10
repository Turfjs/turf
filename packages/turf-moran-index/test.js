const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const moranIndex = require("./dist/js/index.js").default;

test("turf-moran-index", (t) => {
  const pointPath = path.join(__dirname, "test", "in", "point.json");
  const pointJson = load.sync(pointPath);

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
  const columbusJson = load.sync(columbusPath);

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
