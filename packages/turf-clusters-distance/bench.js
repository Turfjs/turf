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
 * // Clusters distance
 * fiji: 1.692ms
 * many-points: 14.448ms
 * points-with-properties: 0.164ms
 * points1: 0.087ms
 * points2: 0.694ms
 * fiji x 1,320,371 ops/sec ±1.72% (80 runs sampled)
 * many-points x 14,640 ops/sec ±2.20% (81 runs sampled)
 * points-with-properties x 1,257,709 ops/sec ±2.96% (77 runs sampled)
 * points1 x 545,118 ops/sec ±1.83% (80 runs sampled)
 * points2 x 393,770 ops/sec ±1.73% (83 runs sampled)
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
const suite = new Benchmark.Suite('turf-clusters');
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
