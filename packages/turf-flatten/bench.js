const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const flatten = require('.');

const suite = new Benchmark.Suite('turf-flatten');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename: filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

// fixtures = fixtures.filter(({name}) => (name === 'MultiPolygon'));

for (const {geojson, name} of fixtures) {
    suite.add(name, () => flatten(geojson));
}

suite
    .on('cycle', (event) => { console.log(String(event.target)); })
    .on('complete', () => {})
    .run();
