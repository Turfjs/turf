import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import Benchmark from 'benchmark';
import buffer from './';

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Benchmark Results
 *
 * feature-collection-points: 139.101ms
 * geometry-collection-points: 20.334ms
 * issue-#783: 33.209ms
 * linestring: 6.371ms
 * multi-linestring: 48.786ms
 * multi-point: 7.627ms
 * multi-polygon: 38.921ms
 * negative-buffer: 5.621ms
 * north-latitude-points: 71.144ms
 * northern-polygon: 2.644ms
 * point: 8.155ms
 * polygon-with-holes: 6.965ms
 * feature-collection-points x 722 ops/sec ±14.28% (65 runs sampled)
 * geometry-collection-points x 1,314 ops/sec ±7.87% (66 runs sampled)
 * issue-#783 x 1,404 ops/sec ±6.81% (64 runs sampled)
 * linestring x 2,936 ops/sec ±6.94% (72 runs sampled)
 * multi-linestring x 623 ops/sec ±4.35% (79 runs sampled)
 * multi-point x 1,735 ops/sec ±8.60% (65 runs sampled)
 * multi-polygon x 1,125 ops/sec ±3.93% (80 runs sampled)
 * north-latitude-points x 1,649 ops/sec ±2.09% (86 runs sampled)
 * northern-polygon x 4,658 ops/sec ±3.08% (78 runs sampled)
 * point x 65,020 ops/sec ±1.29% (85 runs sampled)
 * polygon-with-holes x 2,795 ops/sec ±2.98% (81 runs sampled)
 */
const suite = new Benchmark.Suite('turf-buffer');
for (const {name, geojson} of fixtures) {
    console.time(name);
    buffer(geojson, 50, 'miles');
    console.timeEnd(name);
    suite.add(name, () => buffer(geojson, 50, 'miles'));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
