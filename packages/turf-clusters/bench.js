const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const cluster = require('./');

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
 * many-points: 37.029ms
 * points-with-properties: 0.163ms
 * points1: 0.270ms
 * points2: 0.140ms
 * many-points x 104 ops/sec ±15.08% (56 runs sampled)
 * points-with-properties x 101,021 ops/sec ±12.70% (69 runs sampled)
 * points1 x 35,439 ops/sec ±2.78% (77 runs sampled)
 * points2 x 21,726 ops/sec ±1.73% (82 runs sampled)
 */
const suite = new Benchmark.Suite('turf-cluster');
for (const {name, geojson, filename} of fixtures) {
    const {numberOfCentroids} = geojson.properties || {};

    console.time(name);
    cluster(geojson, numberOfCentroids);
    console.timeEnd(name);
    suite.add(name, () => cluster(geojson, numberOfCentroids));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();

