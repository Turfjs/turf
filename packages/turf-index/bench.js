const Benchmark = require('benchmark');
const random = require('@turf/random');
const index = require('./');
const suite = new Benchmark.Suite('turf-index');

// Fixtures
const points = random('points', 100);
const point = points.features[0];
const polygons = random('polygons', 100);
const polygon = polygons.features[0];
const pointsTree = index(points);
const polygonsTree = index(polygons);

suite
    .add('index.points', () => index(points))
    .add('index.polygons', () => index(polygons))
    .add('search.points', () => pointsTree.search(point))
    .add('search.polygons', () => polygonsTree.search(polygon))
    .on('cycle', e => { console.log(String(e.target)); })
    .on('complete', () => {})
    .run();
