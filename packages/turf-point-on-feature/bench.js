import fs from 'fs';
import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import pointOnFeature from './';

/**
 * Benchmark Results
 *
 * lines x 46,944 ops/sec ±1.16% (86 runs sampled)
 * multiline x 43,534 ops/sec ±2.47% (86 runs sampled)
 * multipoint x 151,733 ops/sec ±1.36% (88 runs sampled)
 * multipolygon x 52,131 ops/sec ±1.28% (88 runs sampled)
 * polygon-in-center x 492,494 ops/sec ±1.12% (86 runs sampled)
 * polygons x 31,270 ops/sec ±1.41% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-point-on-feature');

glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
  const {name} = path.parse(filepath);
  const geojson = load.sync(filepath);
  suite.add(name, () => pointOnFeature(geojson))
})

suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
