import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import lineChunk from './';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

/**
 * Benchmark Results
 *
 * FeatureCollection.geojson x 54,653 ops/sec ±1.91% (88 runs sampled)
 * GeometryCollection.geojson x 53,065 ops/sec ±2.88% (83 runs sampled)
 * LineString.geojson x 113,926 ops/sec ±1.05% (90 runs sampled)
 * MultiLineString.geojson x 123,430 ops/sec ±1.57% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-chunk');
fixtures.forEach(({filename, geojson}) => {
    suite.add(filename, () => lineChunk(geojson, 5, 'miles'));
});

suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
