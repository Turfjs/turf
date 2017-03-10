const Benchmark = require('benchmark');
const {point} = require('@turf/helpers');
const greatCircle = require('./');

const point1 = point([-75, 45]);
const point2 = point([30, 45]);

const suite = new Benchmark.Suite('turf-great-circle');

suite
    .add('greatCircle', () => { greatCircle(point1, point2); })
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
