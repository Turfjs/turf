const Benchmark = require('benchmark');
const random = require('@turf/random');
const rbush = require('./');
const suite = new Benchmark.Suite('turf-rbush');

// Fixtures
const points = random('points', 100);
const point = points.features[0];
const polygons = random('polygons', 100);
const polygon = polygons.features[0];
const pointsTree = rbush(points);
const polygonsTree = rbush(polygons);

suite
    .add('rbush.points', () => rbush(points))
    .add('rbush.polygons', () => rbush(polygons))
    .add('search.points', () => pointsTree.search(point))
    .add('search.polygons', () => polygonsTree.search(polygon))
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
