const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const tangents = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * concave x 1,040,917 ops/sec ±0.61% (89 runs sampled)
 * high x 874,099 ops/sec ±1.02% (92 runs sampled)
 * multipolygon x 519,682 ops/sec ±1.23% (90 runs sampled)
 * polygonWithHole x 1,054,454 ops/sec ±0.82% (91 runs sampled)
 * square x 1,050,479 ops/sec ±0.94% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-polygon-tangents');
for (const {name, geojson} of fixtures) {
    const [poly, pt] = geojson.features;
    suite.add(name, () => tangents(pt, poly));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
