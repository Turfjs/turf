const test = require("tape");
const glob = require("glob");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const truncate = require("@turf/truncate").default;
const { featureEach, coordEach } = require("@turf/meta");
const { lineString, featureCollection } = require("@turf/helpers");
const center = require("@turf/center").default;
const centerMean = require("./index").default;

test("turf-center-mean", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.geojson"))
    .forEach((filepath) => {
      const geojson = load.sync(filepath);
      const options = geojson.options || {};
      options.properties = { "marker-symbol": "star", "marker-color": "#F00" };
      const centered = truncate(centerMean(geojson, options));

      // Display Results
      const results = featureCollection([]);
      featureEach(geojson, (feature) => results.features.push(feature));
      coordEach(geojson, (coord) =>
        results.features.push(
          lineString([coord, centered.geometry.coordinates], {
            stroke: "#00F",
            "stroke-width": 1,
          })
        )
      );
      // Add @turf/center to compare position
      results.features.push(
        truncate(
          center(geojson, {
            properties: { "marker-symbol": "circle", "marker-color": "#00F" },
          })
        )
      );
      results.features.push(centered);

      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) write.sync(out, results);
      t.deepEqual(results, load.sync(out), path.parse(filepath).name);
    });
  t.end();
});

test("turf-center-mean -- properties", (t) => {
  const line = lineString([
    [0, 0],
    [1, 1],
  ]);
  const pt = centerMean(line, { properties: { foo: "bar" } });
  t.equal(pt.properties.foo, "bar", "translate properties");
  t.end();
});
