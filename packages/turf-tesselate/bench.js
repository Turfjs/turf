const Benchmark = require('benchmark');
const {polygon} = require('@turf/helpers');
const tesselate = require('./');

var poly = polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);

/**
 * Benchmark Results
 *
 */
const suite = new Benchmark.Suite('turf-tesselate');
suite
    .add('polygon', () => turf.tesselate(poly))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
