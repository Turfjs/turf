import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import lineToPolygon from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'multi-linestrings-with-holes');

/**
 * Benchmark Results
 *
 * collection-linestring x 2,337,816 ops/sec ±3.08% (86 runs sampled)
 * geometry-linestring x 6,574,088 ops/sec ±3.62% (83 runs sampled)
 * linestring-incomplete x 6,768,527 ops/sec ±3.60% (84 runs sampled)
 * linestring x 6,752,969 ops/sec ±1.94% (84 runs sampled)
 * multi-linestring-incomplete x 808,779 ops/sec ±8.86% (80 runs sampled)
 * multi-linestring-outer-ring-middle-position x 664,121 ops/sec ±1.52% (83 runs sampled)
 * multi-linestring-with-hole x 1,018,657 ops/sec ±1.35% (86 runs sampled)
 * multi-linestrings-with-holes x 421,758 ops/sec ±0.92% (88 runs sampled)
 */
const suite = new Benchmark.Suite('turf-linestring-to-polygon');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineToPolygon(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
