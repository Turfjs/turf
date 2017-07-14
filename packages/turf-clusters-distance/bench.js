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
 * // Clusters distance (dbscan)
 * fiji: 1.875ms
 * many-points: 57.541ms
 * noise: 0.937ms
 * points-with-properties: 0.087ms
 * points1: 0.495ms
 * points2: 0.380ms
 * fiji x 104,254 ops/sec ±2.31% (77 runs sampled)
 * many-points x 20.61 ops/sec ±6.17% (39 runs sampled)
 * noise x 7,929 ops/sec ±1.86% (80 runs sampled)
 * points-with-properties x 97,864 ops/sec ±1.68% (81 runs sampled)
 * points1 x 9,350 ops/sec ±1.71% (78 runs sampled)
 * points2 x 4,396 ops/sec ±1.94% (80 runs sampled)
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
