const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const { featureEach } = require("@turf/meta");
const { featureCollection, lineString } = require("@turf/helpers");
const polygonize = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
  };
});

test("turf-polygonize", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const polygonized = polygonize(geojson);

    const results = featureCollection([]);
    featureEach(geojson, (feature) => results.features.push(colorize(feature)));
    featureEach(polygonized, (feature) =>
      results.features.push(colorize(feature, "#00F", 3))
    );

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  }
  t.end();
});

test("turf-polygonize -- Geometry Support", (t) => {
  const line = lineString([
    [0, 0],
    [1, 1],
    [5, 2],
    [0, 0],
  ]);

  t.assert(polygonize(line.geometry), "line geometry");
  t.end();
});

test("turf-polygonize -- throws", (t) => {
  // const line = lineString([[0, 0], [1, 1]]);

  // t.throws(() => polygonize(line));
  t.end();
});

test("turf-polygonize -- input mutation", (t) => {
  const lines = featureCollection([
    lineString([
      [0, 0],
      [1, 1],
    ]),
    lineString([
      [1, 1],
      [-1, -1],
    ]),
    lineString([
      [-1, -1],
      [0, 0],
    ]),
  ]);
  const linesBefore = JSON.parse(JSON.stringify(lines));
  polygonize(lines);

  t.deepEquals(lines, linesBefore, "input does not mutate");
  t.end();
});

function colorize(feature, color = "#F00", width = 6) {
  feature.properties["fill"] = color;
  feature.properties["fill-opacity"] = 0.3;
  feature.properties["stroke"] = color;
  feature.properties["stroke-width"] = width;
  return feature;
}
