var test = require('tape');
var fs = require('fs');
var path = require('path');
var lineSliceAlong = require('./');
var along = require('turf-along');

var line1 = JSON.parse(fs.readFileSync(path.join(__dirname, '/test/fixtures/line1.geojson')));
var route1 = JSON.parse(fs.readFileSync(path.join(__dirname, '/test/fixtures/route1.geojson')));
var route2 = JSON.parse(fs.readFileSync(path.join(__dirname, '/test/fixtures/route2.geojson')));

test('turf-line-slice -- line1', function (t) {
		var start = 500;
		var stop = 750;
	  var units = 'miles';

		var start_point = along(line1, start, units);
		var end_point = along(line1, stop, units);
		var sliced = lineSliceAlong(line1, start, stop, units);
		t.equal(sliced.type, 'Feature');
		t.equal(sliced.geometry.type, 'LineString');
		t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
		t.deepEqual(sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1], end_point.geometry.coordinates);
		t.end();
});

test('turf-line-slice-along -- route1', function (t) {
		var start = 500;
		var stop = 750;
		var units = 'miles';

		var start_point = along(route1, start, units);
		var end_point = along(route1, stop, units);
		var sliced = lineSliceAlong(route1, start, stop, units);
		t.equal(sliced.type, 'Feature');
		t.equal(sliced.geometry.type, 'LineString');
		t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
		t.deepEqual(sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1], end_point.geometry.coordinates);
		t.end();
});

test('turf-line-slice-along -- route2', function (t) {
		var start = 25;
		var stop = 50;
		var units = 'miles';

		var start_point = along(route2, start, units);
		var end_point = along(route2, stop, units);
		var sliced = lineSliceAlong(route2, start, stop, units);
		t.equal(sliced.type, 'Feature');
		t.equal(sliced.geometry.type, 'LineString');
		t.deepEqual(sliced.geometry.coordinates[0], start_point.geometry.coordinates);
		t.deepEqual(sliced.geometry.coordinates[sliced.geometry.coordinates.length - 1], end_point.geometry.coordinates);
		t.end();
});
