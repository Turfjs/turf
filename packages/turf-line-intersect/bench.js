const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const load = require('load-json-file');
const lineIntersect = require('.');

const suite = new Benchmark.Suite('turf-line-intersect');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(folder => {
    return {
        folder,
        line1: load.sync(path.join(directories.in, folder, 'line1.geojson')),
        line2: load.sync(path.join(directories.in, folder, 'line2.geojson'))
    };
});

for (const {folder, line1, line2} of fixtures) {
    suite.add(folder, () => lineIntersect(line1, line2, true));
}

suite
    .on('cycle', (event) => { console.log(String(event.target)); })
    .on('complete', () => {})
    .run();
