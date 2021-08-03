const test = require("tape");
const glob = require("glob");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const center = require("@turf/center").default;
const truncate = require("@turf/truncate").default;
const centerMean = require("@turf/center-mean").default;
const centerOfMass = require("@turf/center-of-mass").default;
const { featureCollection, round } = require("@turf/helpers");
const centerMedian = require("./index").default;

test("turf-center-median", (t) => {
  glob
    .sync(path.join(__dirname, "test", "in", "*.json"))
    .forEach((filepath) => {
      // Define params
      const { name } = path.parse(filepath);
      const geojson = load.sync(filepath);
      const options = geojson.properties;

      // Calculate Centers
      const meanCenter = centerMean(geojson, options);
      const medianCenter = centerMedian(geojson, options);
      const extentCenter = center(geojson);
      const massCenter = centerOfMass(geojson);

      // Truncate median properties
      medianCenter.properties.medianCandidates.forEach((candidate, index) => {
        medianCenter.properties.medianCandidates[index] = [
          round(candidate[0], 6),
          round(candidate[1], 6),
        ];
      });
      const results = featureCollection([
        ...geojson.features,
        colorize(meanCenter, "#a00"),
        colorize(medianCenter, "#0a0"),
        colorize(extentCenter, "#00a"),
        colorize(massCenter, "#aaa"),
      ]);

      const out = filepath.replace(
        path.join("test", "in"),
        path.join("test", "out")
      );
      if (process.env.REGEN) write.sync(out, results);
      t.deepEqual(results, load.sync(out), name);
    });
  t.end();
});

function colorize(point, color) {
  point.properties["marker-color"] = color;
  point.properties["marker-symbol"] = "cross";
  return truncate(point);
}
