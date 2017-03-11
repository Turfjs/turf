const Benchmark = require('benchmark');
const random = require('@turf/random');
const rbush = require('./');
const suite = new Benchmark.Suite('turf-rbush');

// Fixtures
const points = random('points', 3);
const point = points.features[0];
const polygons = random('polygons', 3);
const polygon = polygons.features[0];

// Load trees before (used to benchmark search)
const pointsTree = rbush();
pointsTree.load(points);
const polygonsTree = rbush();
polygonsTree.load(polygons);

suite
    .add('rbush.points', () => {
        const tree = rbush();
        tree.load(points);
    })
    .add('rbush.polygons', () => {
        const tree = rbush();
        tree.load(polygons);
    })
    .add('search.points', () => pointsTree.search(point))
    .add('search.polygons', () => polygonsTree.search(polygon))
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
