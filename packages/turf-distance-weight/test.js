const { point } = require("@turf/helpers");

const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const distanceWeight = require("./dist/js/index.js").default;
const { pNormDistance } = require("./dist/js/index.js");

test("pNormDistance function", (t) => {
  t.equal(pNormDistance(point([2, 0]), point([0, 0]), 2), 2, "2-norm is ok");
  t.equal(pNormDistance(point([1, 1]), point([0, 0]), 1), 2, "1-norm is ok");
  t.end();
});

test("turf-distance-weight", (t) => {
  const columbusPath = path.join(__dirname, "test", "in", "point.json");
  const columbusJson = load.sync(columbusPath);

  let result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 1,
    alpha: 1,
    standardization: false,
  });
  t.equal(result[0][1], 0.8320121090670778, "base arguments");

  // test threshold
  result = distanceWeight(columbusJson, {
    threshold: 2,
    binary: false,
    p: 1,
    alpha: 1,
  });
  t.equal(result[0][1], 0.8320121090670778, "change threshold");

  // test binary
  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: true,
    p: 1,
    alpha: 1,
  });
  t.equal(result[0][1], 1, "change binary");

  // test p
  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 2,
    alpha: 1,
  });
  t.equal(result[0][1], 0.5987182558007202, "change p");

  // test alpha
  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 1,
    alpha: -1,
  });
  t.equal(result[0][1], 1.201905584188293, "change alpha");

  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: false,
    p: 1,
    alpha: 1,
    standardization: true,
  });
  t.equal(result[0][1], 0.5311565480348293, "standardization 1");

  result = distanceWeight(columbusJson, {
    threshold: 1,
    binary: true,
    p: 1,
    alpha: 1,
    standardization: true,
  });
  t.equal(result[0][1], 0.5, "standardization 2");

  // test default
  result = distanceWeight(columbusJson);
  t.equal(result[0][1], 1.6702346893742355, "default arguments");

  t.end();
});
