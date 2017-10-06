import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import clustersDbscan from './';

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
 * fiji: 2.472ms
 * many-points: 48.504ms
 * noise: 1.218ms
 * points-with-properties: 0.194ms
 * points1: 0.697ms
 * points2: 0.579ms
 * fiji x 42,125 ops/sec ±1.27% (90 runs sampled)
 * many-points x 33.21 ops/sec ±1.23% (57 runs sampled)
 * noise x 6,379 ops/sec ±0.98% (90 runs sampled)
 * points-with-properties x 35,111 ops/sec ±0.74% (94 runs sampled)
 * points1 x 7,199 ops/sec ±0.99% (90 runs sampled)
 * points2 x 4,047 ops/sec ±1.02% (91 runs sampled)
 */
const suite = new Benchmark.Suite('turf-clusters-dbscan');
for (const {name, geojson} of fixtures) {
    let {distance} = geojson.properties || {};
    distance = distance || 100;

    console.time(name);
    clustersDbscan(geojson, distance);
    console.timeEnd(name);
    suite.add(name, () => clustersDbscan(geojson, distance));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
