const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const dbscan = require('@turf/clusters-dbscan');
const concave = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Single Process Benchmark
 *
 * concave-hull: 15.922ms
 * fiji: 3.523ms
 * hole: 8.207ms
 * issue-333: 24.505ms
 * pts1: 0.932ms
 * pts2: 13.297ms
 * pts3: 0.375ms
 */
for (const {name, geojson} of fixtures) {
    const {maxEdge, units} = geojson.properties || {maxEdge: 1};
    console.time(name);
    concave(geojson, maxEdge, units);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * concave-hull x 812 ops/sec ±4.31% (83 runs sampled)
 * concave-hull-- dbscan x 3,433 ops/sec ±1.06% (91 runs sampled)
 * fiji x 2,640 ops/sec ±0.96% (90 runs sampled)
 * fiji-- dbscan x 12,261 ops/sec ±1.45% (90 runs sampled)
 * hole x 1,071 ops/sec ±1.15% (89 runs sampled)
 * hole-- dbscan x 3,513 ops/sec ±1.43% (91 runs sampled)
 * issue-333 x 240 ops/sec ±3.62% (78 runs sampled)
 * issue-333-- dbscan x 368 ops/sec ±0.97% (85 runs sampled)
 * pts1 x 4,003 ops/sec ±2.25% (84 runs sampled)
 * pts1-- dbscan x 12,535 ops/sec ±1.35% (90 runs sampled)
 * pts2 x 182 ops/sec ±1.95% (77 runs sampled)
 * pts2-- dbscan x 214 ops/sec ±5.51% (74 runs sampled)
 * pts3 x 11,262 ops/sec ±3.38% (83 runs sampled)
 * pts3-- dbscan x 27,653 ops/sec ±1.17% (85 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-scale');
for (const {name, geojson} of fixtures) {
    const {maxEdge, units} = geojson.properties || {maxEdge: 1};
    suite.add(name, () => concave(geojson, maxEdge, units));
    suite.add(name + '-- dbscan', () => dbscan(geojson, maxEdge, units));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
