const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const lineChunk = require('./');

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
 * FeatureCollection.geojson x 47,826 ops/sec ±3.59% (77 runs sampled)
 * GeometryCollection.geojson x 50,569 ops/sec ±2.39% (85 runs sampled)
 * LineString.geojson x 86,579 ops/sec ±10.94% (72 runs sampled)
 * MultiLineString.geojson x 83,800 ops/sec ±10.76% (69 runs sampled)
 */
const suite = new Benchmark.Suite('turf-line-chunk');
fixtures.forEach(({filename, geojson}) => {
    suite.add(filename, () => lineChunk(geojson, 5, 'miles'));
});

suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
