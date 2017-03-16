const path = require('path');
const Benchmark = require('benchmark');
const load = require('load-json-file');
const dissolve = require('.');

const polys = load.sync(path.join(__dirname, 'test', 'in', 'polys.geojson'));

const suite = new Benchmark.Suite('turf-dissolve');
suite
    .add('polys', () => dissolve(polys))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
