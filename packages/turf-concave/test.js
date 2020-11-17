const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const { point, featureCollection } = require("@turf/helpers");
const { featureEach } = require("@turf/meta");
const concave = require("./index").default;

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

test("turf-concave", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const properties = geojson.properties || {};
    const maxEdge = properties.maxEdge || 1;
    const units = properties.units;

    const hull = concave(geojson, { units, maxEdge });
    featureEach(geojson, stylePt);
    const results = featureCollection(geojson.features.concat(hull));

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  });
  t.end();
});

const onePoint = featureCollection([point([0, 0])]);

test("concave -- throw", (t) => {
  t.equal(
    concave(onePoint, { maxEdge: 5.5, units: "miles" }),
    null,
    "too few polygons found to compute concave hull"
  );
  t.equal(
    concave(onePoint),
    null,
    "too few polygons found to compute concave hull -- maxEdge too small"
  );

  t.end();
});

function stylePt(pt) {
  pt.properties["marker-color"] = "#f0f";
  pt.properties["marker-size"] = "small";
}
