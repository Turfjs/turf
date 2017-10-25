import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import along from '@turf/along';
import lineSliceAlong from '.';

var line1 = load.sync(path.join(__dirname, 'test', 'fixtures', 'line1.geojson'));
var route1 = load.sync(path.join(__dirname, 'test', 'fixtures', 'route1.geojson'));
var route2 = load.sync(path.join(__dirname, 'test', 'fixtures', 'route2.geojson'));

test('turf-line-slice -- line1', function (t) {
    var start = 500;
    var stop = 750;
    var options = {units: 'miles'};

    var start_point = along(line1, start, options);
    var end_point = along(line1, stop, options);
    var sliced = lineSliceAlong(line1, start, stop, options);
    t.equal(sliced.type, 'Feature');
    t.equal(sliced.geometry.type, 'LineString');
    t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
    t.deepEqual(sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1], end_point.geometry.coordinates);
    t.end();
});

test('turf-line-slice -- line1 overshoot', function (t) {
    var start = 500;
    var stop = 1500;
    var options = {units: 'miles'};

    var start_point = along(line1, start, options);
    var end_point = along(line1, stop, options);
    var sliced = lineSliceAlong(line1, start, stop, options);
    t.equal(sliced.type, 'Feature');
    t.equal(sliced.geometry.type, 'LineString');
    t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
    t.deepEqual(sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1], end_point.geometry.coordinates);
    t.end();
});

test('turf-line-slice-along -- route1', function (t) {
    var start = 500;
    var stop = 750;
    var options = {units: 'miles'};

    var start_point = along(route1, start, options);
    var end_point = along(route1, stop, options);
    var sliced = lineSliceAlong(route1, start, stop, options);
    t.equal(sliced.type, 'Feature');
    t.equal(sliced.geometry.type, 'LineString');
    t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
    t.deepEqual(sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1], end_point.geometry.coordinates);
    t.end();
});

test('turf-line-slice-along -- route2', function (t) {
    var start = 25;
    var stop = 50;
    var options = {units: 'miles'};

    var start_point = along(route2, start, options);
    var end_point = along(route2, stop, options);
    var sliced = lineSliceAlong(route2, start, stop, options);
    t.equal(sliced.type, 'Feature');
    t.equal(sliced.geometry.type, 'LineString');
    t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
    t.deepEqual(sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1], end_point.geometry.coordinates);
    t.end();
});
