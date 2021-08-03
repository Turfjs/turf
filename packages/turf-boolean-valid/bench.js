const path = require("path");
const glob = require("glob");
const Benchmark = require("benchmark");
const load = require("load-json-file");
const bbox = require("@turf/bbox").default;
const isValid = require("./index").default;

/**
 * Benchmark Results
 *
 */
const suite = new Benchmark.Suite("turf-boolean-is-valid");
glob
  .sync(path.join(__dirname, "test", "**", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = load.sync(filepath);
    const [feature1] = geojson.features;

    feature1.bbox = bbox(feature1);

    console.time(name);
    isValid(feature1);
    console.timeEnd(name);
    suite.add(name, () => isValid(feature1));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
