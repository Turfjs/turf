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
 * // Clusters dbscan
 * fiji: 2.034ms
 * many-points: 50.185ms
 * noise: 1.027ms
 * points-with-properties: 0.355ms
 * points1: 0.769ms
 * points2: 0.325ms
 * fiji x 34,724 ops/sec ±12.09% (73 runs sampled)
 * many-points x 30.43 ops/sec ±5.53% (54 runs sampled)
 * noise x 5,955 ops/sec ±1.85% (86 runs sampled)
 * points-with-properties x 30,850 ops/sec ±7.87% (80 runs sampled)
 * points1 x 4,704 ops/sec ±12.26% (64 runs sampled)
 * points2 x 3,014 ops/sec ±7.66% (78 runs sampled)
 *
 * // Clusters kmeans
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
const suite = new Benchmark.Suite('turf-clusters-dbscan');
for (const {name, geojson} of fixtures) {
    let {distance} = geojson.properties || {};
    distance = distance || 100;

    console.time(name);
    clusters(geojson, distance);
    console.timeEnd(name);
    suite.add(name, () => clusters(geojson, distance));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
