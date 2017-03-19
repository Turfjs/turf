var test = require('tape');
var truncate = require('@turf/truncate');
var path = require('path');
var load = require('load-json-file');
var write = require('write-json-file');
var fixtures = require('geojson-fixtures').all;
var buffer = require('.');

var directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

test('buffer', function (t) {
    Object.keys(fixtures).forEach(function (name) {
        var fixture = fixtures[name];
        var buffered = truncate(buffer(fixture, 10, 'miles'));

        if (process.env.REGEN) {
            write.sync(directories.in + name + '.geojson', fixture);
            write.sync(directories.out + name + '.geojson', buffered);
        }
        t.deepEqual(buffered, load.sync(directories.out + name + '.geojson'));
    });
    t.end();
});
