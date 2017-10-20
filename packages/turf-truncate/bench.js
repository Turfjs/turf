import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import truncate from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
let fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});
// fixtures = fixtures.filter(fixture => fixture.name === 'polygons');

/**
 * Single Process Benchmark
 *
 * geometry-collection: 0.563ms
 * linestring-geometry: 0.076ms
 * point-elevation: 0.046ms
 * point-geometry: 0.012ms
 * point: 0.022ms
 * points: 0.028ms
 * polygon: 0.030ms
 * polygons: 0.030ms
 */
for (const {name, geojson} of fixtures) {
    console.time(name);
    truncate(geojson, 6, 2, true);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * geometry-collection x 3,720,722 ops/sec ±7.27% (73 runs sampled)
 * linestring-geometry x 3,752,722 ops/sec ±3.22% (81 runs sampled)
 * point-elevation x 3,972,732 ops/sec ±1.55% (85 runs sampled)
 * point-geometry x 4,279,585 ops/sec ±1.13% (84 runs sampled)
 * point x 4,239,752 ops/sec ±1.42% (88 runs sampled)
 * points x 4,235,613 ops/sec ±1.74% (88 runs sampled)
 * polygon x 2,854,454 ops/sec ±0.76% (84 runs sampled)
 * polygons x 1,565,315 ops/sec ±1.89% (85 runs sampled)
 */
const suite = new Benchmark.Suite('turf-truncate');
for (const {name, geojson} of fixtures) {
    suite.add(name, () => truncate(geojson, 6, 2, true));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
