const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const clusters = require('./');

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
 * fiji: 3.236ms
 * many-points: 32.563ms
 * points-with-properties: 0.123ms
 * points1: 0.569ms
 * points2: 0.119ms
 * fiji x 112,975 ops/sec ±7.64% (70 runs sampled)
 * many-points x 129 ops/sec ±20.10% (62 runs sampled)
 * points-with-properties x 151,784 ops/sec ±4.47% (80 runs sampled)
 * points1 x 44,736 ops/sec ±5.12% (77 runs sampled)
 * points2 x 26,771 ops/sec ±4.22% (83 runs sampled)
 */
const suite = new Benchmark.Suite('turf-clusters');
for (const {name, geojson} of fixtures) {
    const {numberOfCentroids} = geojson.properties || {};

    console.time(name);
    clusters(geojson, numberOfCentroids);
    console.timeEnd(name);
    suite.add(name, () => clusters(geojson, numberOfCentroids));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();

