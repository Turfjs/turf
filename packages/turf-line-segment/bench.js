const Benchmark = require('benchmark');
const load = require('load-json-file');
const path = require('path');
const fs = require('fs');
const lineSegment = require('./');

const suite = new Benchmark.Suite('turf-line-segment');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

for (const {name, geojson} of fixtures) {
    suite.add(name, () => { lineSegment(geojson); });
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
