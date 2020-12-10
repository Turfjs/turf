const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const truncate = require("@turf/truncate").default;
const centroid = require("@turf/centroid").default;
const { featureEach } = require("@turf/meta");
const { featureCollection } = require("@turf/helpers");
const nearestNeighborAnalysis = require("./index").default;

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

test("turf-nearest-neighbor", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const options = geojson.options;
    const results = featureCollection([]);
    featureEach(geojson, (feature) => results.features.push(truncate(feature)));
    if (geojson.features[0].geometry.type === "Polygon") {
      featureEach(geojson, (feature) =>
        results.features.push(
          truncate(
            centroid(feature, { properties: { "marker-color": "#0a0" } })
          )
        )
      );
    }
    results.features.push(truncate(nearestNeighborAnalysis(geojson, options)));
    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEqual(results, load.sync(directories.out + filename), name);
  });
  t.end();
});
