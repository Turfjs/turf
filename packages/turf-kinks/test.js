const test = require("tape");
const fs = require("fs");
const path = require("path");
const { loadJsonFileSync } = require("load-json-file");
const { writeJsonFileSync } = require("write-json-file");
const { featureEach } = require("@turf/meta");
const kinks = require("./index").default;

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

test("turf-kinks", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    const results = kinks(geojson);
    featureEach(geojson, (feature) => results.features.push(feature));

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEqual(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});
