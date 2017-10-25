import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import flatten from './';

// Define fixtures
const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(({name}) => (name === 'Polygon'));

/**
 * Benchmark Results
 *
 * FeatureCollection x 678,568 ops/sec ±2.21% (86 runs sampled)
 * GeometryCollection x 627,806 ops/sec ±1.28% (87 runs sampled)
 * GeometryObject x 3,209,419 ops/sec ±1.18% (82 runs sampled)
 * MultiLineString x 3,743,664 ops/sec ±1.87% (85 runs sampled)
 * MultiPoint x 3,428,413 ops/sec ±5.65% (78 runs sampled)
 * MultiPolygon x 3,114,204 ops/sec ±4.52% (82 runs sampled)
 * Polygon x 22,219,812 ops/sec ±0.82% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-flatten');
for (const {geojson, name} of fixtures) {
    suite.add(name, () => flatten(geojson));
}
suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
