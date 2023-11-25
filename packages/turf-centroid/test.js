const path = require("path");
const test = require("tape");
const { glob } = require("glob");
const { loadJsonFileSync } = require("load-json-file");
const { writeJsonFileSync } = require("write-json-file");
const { featureEach } = require("@turf/meta");
const { featureCollection, lineString } = require("@turf/helpers");
const centroid = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = glob.sync(directories.in + "*.geojson").map((input) => {
  const name = path.parse(input).name;
  const base = path.parse(input).base;
  return {
    name,
    filename: base,
    geojson: loadJsonFileSync(input),
    out: directories.out + base,
  };
});

test("centroid", (t) => {
  fixtures.forEach((fixture) => {
    const name = fixture.name;
    const geojson = fixture.geojson;
    const out = fixture.out;
    const centered = centroid(geojson, {
      properties: { "marker-symbol": "circle" },
    });
    const result = featureCollection([centered]);
    featureEach(geojson, (feature) => result.features.push(feature));

    if (process.env.REGEN) writeJsonFileSync(out, result);
    t.deepEqual(result, loadJsonFileSync(out), name);
  });
  t.end();
});

test("centroid -- properties", (t) => {
  const line = lineString([
    [0, 0],
    [1, 1],
  ]);
  const pt = centroid(line, { properties: { foo: "bar" } });
  t.equal(pt.properties.foo, "bar", "translate properties");
  t.end();
});
