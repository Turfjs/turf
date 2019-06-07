const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const constrainedTin = require('./').default;
const tin = require('@turf/tin').default;

const points = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'Points.json')));

/**
 * Benchmark Results
 *
 * constrained Tin 1 edge: 12.816ms
 * constrained Tin 2 edges: 1.956ms
 * constrained Tin 3 edges: 1.227ms
 * normal Tin (as reference): 0.812ms
 * constrained Tin 1 edge x 1,720 ops/sec ±0.35% (96 runs sampled)
 * constrained Tin 2 edges x 1,715 ops/sec ±0.52% (95 runs sampled)
 * constrained Tin 3 edges x 1,701 ops/sec ±0.63% (95 runs sampled)
 * normal Tin (as reference) x 28,858 ops/sec ±2.21% (92 runs sampled)
 */
const suite = new Benchmark.Suite('turf-constrained-tin');
[[0, 10], [2, 6], [3, 4]].reduce(function(edges, edge, index, array) {
    edges.push(edge);
    let name = 'constrained Tin ' + edges.length + ' edge' + (edges.length > 1 ? 's' : '');

    console.time(name);
    constrainedTin(points, edges);
    console.timeEnd(name);
    suite.add(name, () => constrainedTin(points, edges));

    if (index == array.length-1) {
        name = 'normal Tin (as reference)';
        console.time(name);
        tin(points);
        console.timeEnd(name);
        suite.add(name, () => tin(points));
    }

    return edges;
},[]);
suite
  .on('cycle', event => console.log(String(event.target)))
  .on('complete', () => {})
  .run();
