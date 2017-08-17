const fs = require('fs');
const test = require('tape');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const truncate = require('@turf/truncate');
const turfjsBuffer = require('@turf/buffer');
const {featureCollection, lineString} = require('@turf/helpers');
const buffer = require('./');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-buffer', t => {
    for (const {name, geojson} of fixtures) {
        let {distance, units} = geojson.properties || {};
        distance = distance || 50;
        const output = truncate(buffer(geojson, distance, units), 4);
        output.properties.stroke = '#00F';
        const results = featureCollection([output, geojson]);
        if (process.env.REGEN) write.sync(directories.out + name + '.geojson', results);
        t.deepEqual(results, load.sync(directories.out + name + '.geojson'), name);
    }
    t.end();
});

test('turf-buffer -- original @turf/buffer', t => {
    for (const {name, geojson} of fixtures) {
        let {distance, units} = geojson.properties || {};
        distance = distance || 50;
        const output = truncate(turfjsBuffer(geojson, distance, units), 4);
        output.properties.stroke = '#00F';
        const results = featureCollection([output, geojson]);
        if (process.env.REGEN) write.sync(directories.out + 'turfjs-' + name + '.geojson', results);
        t.deepEqual(results, load.sync(directories.out + 'turfjs-' + name + '.geojson'), name);
    }
    t.end();
});

