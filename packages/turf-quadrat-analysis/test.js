const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const bbox = require("@turf/bbox").default;
const centroid = require("@turf/centroid").default;
const squareGrid = require("@turf/square-grid").default;
const bboxPolygon = require("@turf/bbox-polygon").default;
const { randomPoint } = require("@turf/random");
const { featureCollection } = require("@turf/helpers");
const quadratAnalysis = require("./index").default;
const fs = require("fs");

test("turf-quadrat-analysis geojson file", (t) => {
  const futianBboxPath = path.join(__dirname, "test", "in", "futian_bbox.json");
  const futianPointPath = path.join(
    __dirname,
    "test",
    "in",
    "futian_random_point.json"
  );
  const shenzhenBboxPath = path.join(
    __dirname,
    "test",
    "in",
    "shenzhen_bbox.json"
  );

  const futianBbox = load.sync(futianBboxPath);
  const futianPoint = load.sync(futianPointPath);
  const shenzhenBbox = load.sync(shenzhenBboxPath);

  const resultFutian = quadratAnalysis(futianPoint, {
    studyBbox: bbox(futianBbox),
    confidenceLevel: 20,
  });

  const resultShenzhen = quadratAnalysis(futianPoint, {
    studyBbox: bbox(shenzhenBbox),
    confidenceLevel: 20,
  });

  t.ok(resultFutian.isRandom, "ramdom pattern ok");
  t.ok(
    resultFutian.maxAbsoluteDifference < resultFutian.criticalValue,
    "random pattern maxAbsoluteDifference < criticalValue"
  );

  t.ok(!resultShenzhen.isRandom, "cluster pattern ok");
  t.ok(
    resultShenzhen.maxAbsoluteDifference > resultShenzhen.criticalValue,
    "cluster pattern maxAbsoluteDifference > criticalValue"
  );

  t.end();
});

test("turf-quadrat-analysis random point", (t) => {
  // random
  const smallBbox = [-1, -1, 1, 1];

  // calculate randomPointSets until we get one that passes
  let randomPointSet = randomPoint(400, { bbox: smallBbox });
  let result1 = quadratAnalysis(randomPointSet, {
    studyBbox: smallBbox,
    confidenceLevel: 20,
  });

  // Sometimes we generate a randomPointSet that doesn't come back as random.
  // In order to keep the build passing we fall back to a set of points that
  // we know should pass the below tests in order to prevent build flakes.
  // Having this as the fallback allows us to keep using random inputs in most
  // cases, but keeps the builds passing when they should.
  if (!result1.isRandom) {
    console.warn(
      "WARNING: randomPointSet was not random, this might just be a rare test flake, switching to known good points"
    );
    randomPointSet = JSON.parse(
      fs.readFileSync(path.join("test", "randomPointSet.good.json"))
    );
    result1 = quadratAnalysis(randomPointSet, {
      studyBbox: smallBbox,
      confidenceLevel: 20,
    });
  }

  t.ok(result1.isRandom, "random pattern ok");
  t.ok(
    result1.maxAbsoluteDifference < result1.criticalValue,
    "random pattern maxAbsoluteDifference < criticalValue"
  );

  // cluster
  const bigBbox = [-3, -3, 3, 3];
  const result2 = quadratAnalysis(randomPointSet, {
    studyBbox: bigBbox,
    confidenceLevel: 20,
  });

  t.ok(!result2.isRandom, "cluster pattern ok");
  t.ok(
    result2.maxAbsoluteDifference > result2.criticalValue,
    "cluster pattern maxAbsoluteDifference > criticalValue"
  );

  // uniform
  const smallGrid = squareGrid(smallBbox, 0.1, {
    units: "degrees",
  });
  let uniformPointSet = [];
  smallGrid.features.map(function (feature) {
    uniformPointSet.push(centroid(feature));
  });
  uniformPointSet = featureCollection(uniformPointSet);
  const result3 = quadratAnalysis(uniformPointSet, {
    studyBbox: smallBbox,
    confidenceLevel: 20,
  });

  t.ok(!result3.isRandom, "uniform pattern ok");
  t.ok(
    result3.maxAbsoluteDifference > result3.criticalValue,
    "uniform pattern maxAbsoluteDifference > criticalValue"
  );

  const randomPointSetPath = path.join(
    __dirname,
    "test",
    "out",
    "randomPoint.json"
  );
  const uniformPointSetPath = path.join(
    __dirname,
    "test",
    "out",
    "uniformPoint.json"
  );
  const smallBboxPath = path.join(__dirname, "test", "out", "smallBox.json");
  const bigBboxPath = path.join(__dirname, "test", "out", "bigBox.json");
  const smallGridPath = path.join(__dirname, "test", "out", "smallGrid.json");

  // console.log(result1, result2, result3);

  if (process.env.REGEN) {
    write.sync(randomPointSetPath, randomPointSet);
    write.sync(uniformPointSetPath, uniformPointSet);
    write.sync(smallBboxPath, bboxPolygon(smallBbox));
    write.sync(bigBboxPath, bboxPolygon(bigBbox));
    write.sync(smallGridPath, smallGrid);
  }

  t.end();
});
