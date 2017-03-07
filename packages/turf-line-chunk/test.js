var test = require('tape');
var path = require('path');
var fs = require('fs');
var load = require('load-json-file');
var write = require('write-json-file');
var truncate = require('@turf/truncate');
var lineChunk = require('./');

var directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

var fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

test('turf-line-chunk: shorter', t => {
    for (let {filename, geojson} of fixtures) {
        var chunked = truncate(lineChunk(geojson, 5, 'miles', false, true));
        filename = filename.replace('.geojson', '.shorter.geojson');
        if (process.env.REGEN) { write.sync(directories.out + filename, chunked); }

        const expected = load.sync(directories.out + filename);
        t.deepEquals(chunked, expected, path.parse(filename).name);
    }
    t.end();
});

test('turf-line-chunk: longer', t => {
    for (let {filename, geojson} of fixtures) {
        var chunked = truncate(lineChunk(geojson, 50, 'miles', false, true));
        filename = filename.replace('.geojson', '.longer.geojson');
        if (process.env.REGEN) { write.sync(directories.out + filename, chunked); }

        const expected = load.sync(directories.out + filename);
        t.deepEquals(chunked, expected, path.parse(filename).name);
    }
    t.end();
});

test('turf-line-chunk: reverse', t => {
    for (let {filename, geojson} of fixtures) {
        var chunked = truncate(lineChunk(geojson, 5, 'miles', true, true));
        filename = filename.replace('.geojson', '.reverse.geojson');
        if (process.env.REGEN) { write.sync(directories.out + filename, chunked); }

        const expected = load.sync(directories.out + filename);
        t.deepEquals(chunked, expected, path.parse(filename).name);
    }
    t.end();
});
