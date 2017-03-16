const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const fs = require('fs');
const isobands = require('./');

// Define Fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * points1 x 2,301 ops/sec ±15.73% (77 runs sampled)
 */
const suite = new Benchmark.Suite('turf-isobands');
for (const {name, geojson} of fixtures) {
    isobands(geojson, 'elevation', [5, 45, 55, 65, 85,  95, 105, 120, 180]);
    suite.add(name, () => isobands(geojson, 'elevation', [5, 45, 55, 65, 85,  95, 105, 120, 180]));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
