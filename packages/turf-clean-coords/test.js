const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const truncate = require("@turf/truncate").default;
const {
  point,
  multiPoint,
  lineString,
  multiPolygon,
  polygon,
} = require("@turf/helpers");
const write = require("write-json-file");
const cleanCoords = require("./index").default;

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

test("turf-clean-coords", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const results = cleanCoords(geojson);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEqual(results, load.sync(directories.out + filename), name);
  });
  t.end();
});

test("turf-clean-coords -- extras", (t) => {
  t.equal(cleanCoords(point([0, 0])).geometry.coordinates.length, 2, "point");
  t.equal(
    cleanCoords(
      lineString([
        [0, 0],
        [1, 1],
        [2, 2],
      ])
    ).geometry.coordinates.length,
    2,
    "lineString"
  );
  t.equal(
    cleanCoords(
      polygon([
        [
          [0, 0],
          [1, 1],
          [2, 2],
          [0, 2],
          [0, 0],
        ],
      ])
    ).geometry.coordinates[0].length,
    4,
    "polygon"
  );
  t.equal(
    cleanCoords(
      multiPoint([
        [0, 0],
        [0, 0],
        [2, 2],
      ])
    ).geometry.coordinates.length,
    2,
    "multiPoint"
  );
  t.end();
});

test("turf-clean-coords -- truncate", (t) => {
  t.equal(
    cleanCoords(
      truncate(
        lineString([
          [0, 0],
          [1.1, 1.123],
          [2.12, 2.32],
          [3, 3],
        ]),
        { precision: 0 }
      )
    ).geometry.coordinates.length,
    2
  );
  t.end();
});

test("turf-clean-coords -- throws", (t) => {
  t.throws(() => cleanCoords(null), /geojson is required/, "missing geojson");
  t.end();
});

test("turf-clean-coords -- prevent input mutation", (t) => {
  const line = lineString(
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    { foo: "bar" }
  );
  const lineBefore = JSON.parse(JSON.stringify(line));

  cleanCoords(line);
  t.deepEqual(lineBefore, line, "line should NOT be mutated");

  const multiPoly = multiPolygon(
    [
      [
        [
          [0, 0],
          [1, 1],
          [2, 2],
          [2, 0],
          [0, 0],
        ],
      ],
      [
        [
          [0, 0],
          [0, 5],
          [5, 5],
          [5, 5],
          [5, 0],
          [0, 0],
        ],
      ],
    ],
    { hello: "world" }
  );
  const multiPolyBefore = JSON.parse(JSON.stringify(multiPoly));
  cleanCoords(multiPoly);
  t.deepEqual(multiPolyBefore, multiPoly, "multiPolygon should NOT be mutated");
  t.end();
});
