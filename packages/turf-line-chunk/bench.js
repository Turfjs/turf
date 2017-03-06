const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const chunk = require('.');

const line = load.sync(path.join(__dirname, 'test', 'in', 'feature.geojson'));

const suite = new Benchmark.Suite('turf-line-chunk');
suite
    .add('lines', () => chunk(line, '15', 'miles'))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
