const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const tin = require('@turf/tin').default;
const constrainedTin = require('./');

const points = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'Points.json')));

/**
 * Benchmark Results
 *
 * constrained Tin (cdt-js) with 1 edge: 5.494ms
 * constrained Tin (cdt-js) with 2 edges: 0.962ms
 * constrained Tin (cdt-js) with 3 edges: 0.953ms
 * normal Tin (as reference, no constrained): 0.842ms
 * constrained Tin (cdt-js) with 1 edge x 23,480 ops/sec ±2.20% (84 runs sampled)
 * constrained Tin (cdt-js) with 2 edges x 24,388 ops/sec ±4.17% (80 runs sampled)
 * constrained Tin (cdt-js) with 3 edges x 24,734 ops/sec ±1.38% (83 runs sampled)
 * normal Tin (as reference, no constrained) x 19,826 ops/sec ±2.74% (75 runs sampled)
 */
const suite = new Benchmark.Suite('turf-constrained-tin');
constrainedTin(points);
tin(points);
[[0, 10], [2, 6], [3, 4]].reduce(function(edges, edge, index, array) {
    edges.push(edge);
    let name = 'constrained Tin (cdt-js) with ' + edges.length + ' edge' + (edges.length > 1 ? 's' : '');

    console.time(name);
    constrainedTin(points, edges);
    console.timeEnd(name);
    suite.add(name, () => constrainedTin(points, edges));

    if (index == array.length-1) {
        name = 'normal Tin (as reference, no constrained)';
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
