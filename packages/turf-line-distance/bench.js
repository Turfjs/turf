const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const fs = require('fs');
const lineDistance = require('./');

// Define fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benmark Results
 *
 * feature-collection x 274,292 ops/sec ±6.58% (75 runs sampled)
 * multi-linestring x 606,888 ops/sec ±1.65% (87 runs sampled)
 * multi-polygon x 425,090 ops/sec ±4.51% (80 runs sampled)
 * polygon x 617,824 ops/sec ±4.31% (76 runs sampled)
 * route1 x 1,234 ops/sec ±0.89% (87 runs sampled)
 * route2 x 1,356 ops/sec ±0.89% (90 runs sampled)
 */

// Define benchmark
const suite = new Benchmark.Suite('turf-line-distance');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineDistance(geojson));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
