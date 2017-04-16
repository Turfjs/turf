const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const lineStringToPolygon = require('./');

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
 * multi-linestring-incomplete x 3,263,278 ops/sec ±2.56% (88 runs sampled)
 * multi-linestring-with-hole x 3,381,728 ops/sec ±1.75% (88 runs sampled)
 * multi-linestrings-with-holes x 1,084,043 ops/sec ±2.28% (83 runs sampled)
 */
const suite = new Benchmark.Suite('turf-linestring-to-polygon');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => lineStringToPolygon(geojson));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
