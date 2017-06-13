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
 * many-points: 9750.508ms
 * points1: 121.639ms
 * many-points x 0.42 ops/sec ±13.79% (5 runs sampled)
 * points1 x 8.27 ops/sec ±12.56% (24 runs sampled)
 */
const suite = new Benchmark.Suite('turf-clusters');
for (const {name, geojson, filename} of fixtures) {
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

