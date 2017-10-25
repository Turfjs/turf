import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import lineSegment from './';

// Fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * 2-vertex-segment x 1,172,641 ops/sec ±1.89% (80 runs sampled)
 * feature-collection x 270,916 ops/sec ±1.49% (89 runs sampled)
 * linestring x 938,353 ops/sec ±1.21% (88 runs sampled)
 * multi-linestring x 451,359 ops/sec ±1.14% (89 runs sampled)
 * multi-polygon x 447,952 ops/sec ±1.37% (92 runs sampled)
 * polygon-with-holes x 390,985 ops/sec ±1.19% (86 runs sampled)
 * polygon x 873,856 ops/sec ±1.28% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-segment');
fixtures.forEach(({name, geojson}) => suite.add(name, () => lineSegment(geojson)));
suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
