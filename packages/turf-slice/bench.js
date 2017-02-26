const fs = require('fs');
const load = require('load-json-file');
const path = require('path');
const Benchmark = require('benchmark');
const slice = require('.');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(folder => {
    return {
        folder,
        polygon: load.sync(path.join(directories.in, folder, 'polygon.geojson')),
        linestring: load.sync(path.join(directories.in, folder, 'linestring.geojson'))
    };
});

const suite = new Benchmark.Suite('turf-slice');
fixtures.forEach(fixture => {
    const {folder, polygon, linestring} = fixture;
    suite.add(folder, () => {
        slice(polygon, linestring);
    });
});

suite
    .on('cycle', event => console.log(String(event.target)))
    .on('complete', () => {})
    .run();
