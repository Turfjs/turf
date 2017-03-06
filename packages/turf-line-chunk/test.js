var chunk = require('./');
var test = require('tape');
var path = require('path');
var fs = require('fs');
var load = require('load-json-file');
var write = require('write-json-file');

var directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

var fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

test('turf-line-chunk: shorter', t => {
    for (let {filename, geojson} of fixtures) {
        var chunked = chunk(geojson, 5, 'miles');
        filename = filename.replace('.geojson', '.shorter.geojson');
        if (process.env.REGEN) { write.sync(directories.out + filename, chunked); }

        const expected = load.sync(directories.out + filename);
        t.deepEquals(chunked, expected, path.parse(filename).name);
    }
    t.end();
});

test('turf-line-chunk: longer', t => {
    for (let {filename, geojson} of fixtures) {
        var chunked = chunk(geojson, 50, 'miles');
        filename = filename.replace('.geojson', '.longer.geojson');
        if (process.env.REGEN) { write.sync(directories.out + filename, chunked); }

        const expected = load.sync(directories.out + filename);
        t.deepEquals(chunked, expected, path.parse(filename).name);
    }
    t.end();
});

test('turf-line-chunk: points', t => {
    for (let {filename, geojson} of fixtures) {
        var chunked = chunk(geojson, 5, 'miles', true);
        filename = filename.replace('.geojson', '.points.geojson');
        if (process.env.REGEN) { write.sync(directories.out + filename, chunked); }

        const expected = load.sync(directories.out + filename);
        t.deepEquals(chunked, expected, path.parse(filename).name);
    }
    t.end();
});
