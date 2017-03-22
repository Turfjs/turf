const fs = require('fs');
const load = require('load-json-file');
const path = require('path');
const Benchmark = require('benchmark');
const polygonSlice = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    const geojson = load.sync(directories.in + filename);
    const polygon = geojson.features[0];
    const linestring = geojson.features[1];
    return {
        name: path.parse(filename).name,
        filename,
        geojson,
        polygon,
        linestring
    };
});

const suite = new Benchmark.Suite('turf-polygon-slice');
fixtures.forEach(fixture => {
    const {name, polygon, linestring} = fixture;
    polygonSlice(polygon, linestring);
    suite.add(name, () => polygonSlice(polygon, linestring));
});

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
