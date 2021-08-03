const test = require("tape");
const glob = require("glob");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const bboxPolygon = require("@turf/bbox-polygon").default;
const bbox = require("@turf/bbox").default;
const { featureEach, coordEach } = require("@turf/meta");
const { lineString, featureCollection } = require("@turf/helpers");
const center = require("./index").default;

test("turf-center", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.geojson"))
    .forEach((filepath) => {
      const geojson = load.sync(filepath);
      const options = geojson.options || {};
      options.properties = { "marker-symbol": "star", "marker-color": "#F00" };
      const centered = center(geojson, options);

      // Display Results
      const results = featureCollection([centered]);
      featureEach(geojson, (feature) => results.features.push(feature));
      const extent = bboxPolygon(bbox(geojson));
      extent.properties = {
        stroke: "#00F",
        "stroke-width": 1,
        "fill-opacity": 0,
      };
      coordEach(extent, (coord) =>
        results.features.push(
          lineString([coord, centered.geometry.coordinates], {
            stroke: "#00F",
            "stroke-width": 1,
          })
        )
      );
      results.features.push(extent);

      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) write.sync(out, results);
      t.deepEqual(results, load.sync(out), path.parse(filepath).name);
    });
  t.end();
});

test("turf-center -- properties", (t) => {
  const line = lineString([
    [0, 0],
    [1, 1],
  ]);
  const pt = center(line, { properties: { foo: "bar" } });
  t.equal(pt.properties.foo, "bar", "translate properties");
  t.end();
});
