const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const tin = require('@turf/tin').default;
const constrainedTin = require('./');

const points = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'in', 'Points.json')));

/**
 * Benchmark Results
 *
 * constrained Tin (cdt-js) with 1 edge: 2.012ms
 * constrained Tin (cdt-js) with 2 edges: 0.936ms
 * constrained Tin (cdt-js) with 3 edges: 1.744ms
 * normal Tin (as reference, no constrained): 0.365ms
 * constrained Tin (cdt-js) with 1 edge x 21,101 ops/sec ±3.98% (82 runs sampled)
 * constrained Tin (cdt-js) with 2 edges x 23,215 ops/sec ±3.96% (78 runs sampled)
 * constrained Tin (cdt-js) with 3 edges x 23,866 ops/sec ±1.61% (80 runs sampled)
 * normal Tin (as reference, no constrained) x 21,156 ops/sec ±1.44% (83 runs sampled)
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
