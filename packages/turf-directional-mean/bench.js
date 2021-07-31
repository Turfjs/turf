const Benchmark = require("benchmark");
const directionalMean = require("./index").default;
const glob = require("glob");
const path = require("path");
const load = require("load-json-file");

/**
 * Benchmark Results
 *
 * bus_route_gps: 35.172ms
 * bus_route_gps segment: 543.932ms
 * bus_route_utm: 26.696ms
 * bus_route_utm segment: 482.157ms
 * bus_route_gps x 45.72 ops/sec ±2.32% (60 runs sampled)
 * bus_route_gps segment x 2.48 ops/sec ±6.68% (10 runs sampled)
 * bus_route_utm x 46.85 ops/sec ±3.21% (62 runs sampled)
 * bus_route_utm segment x 2.19 ops/sec ±3.18% (10 runs sampled)
 */

const suite = new Benchmark.Suite("turf-directional-mean");
glob.sync(path.join(__dirname, "test", "in", "*.json")).forEach((filepath) => {
  const { name } = path.parse(filepath);
  const geojson = load.sync(filepath);
  if (name === "bus_route_gps.json") {
    console.time(name);
    directionalMean(geojson, {
      planar: false,
    });
    console.timeEnd(name);
    console.time(name + " segment");
    directionalMean(geojson, {
      planar: false,
      segment: true,
    });
    console.timeEnd(name + " segment");
    suite.add(name, () =>
      directionalMean(geojson, {
        planar: false,
      })
    );
    suite.add(name + " segment", () =>
      directionalMean(geojson, {
        planar: false,
        segment: true,
      })
    );
  } else {
    console.time(name);
    directionalMean(geojson, {
      planar: true,
    });
    console.timeEnd(name);
    console.time(name + " segment");
    directionalMean(geojson, {
      planar: true,
      segment: true,
    });
    console.timeEnd(name + " segment");
    suite.add(name, () =>
      directionalMean(geojson, {
        planar: true,
      })
    );
    suite.add(name + " segment", () =>
      directionalMean(geojson, {
        planar: true,
        segment: true,
      })
    );
  }
});

suite.on("cycle", (e) => console.log(String(e.target))).run();
