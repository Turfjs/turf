import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import length from './';

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
 * feature-collection x 240,519 ops/sec ±2.55% (83 runs sampled)
 * multi-linestring x 352,542 ops/sec ±8.44% (76 runs sampled)
 * multi-polygon x 308,500 ops/sec ±3.92% (83 runs sampled)
 * polygon x 534,768 ops/sec ±1.29% (84 runs sampled)
 * route1 x 1,280 ops/sec ±1.23% (89 runs sampled)
 * route2 x 1,452 ops/sec ±1.57% (87 runs sampled)
 */

// Define benchmark
const suite = new Benchmark.Suite('turf-line-distance');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => length(geojson));
}
suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
