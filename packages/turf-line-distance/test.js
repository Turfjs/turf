var test = require('tape');
var fs = require('fs');
var lineDistance = require('./');

var route1 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/route2.geojson'));

test('turf-line-distance', function (t) {
	t.equal(Math.round(lineDistance(route1, 'miles')), 202);
	t.true((lineDistance(route2, 'kilometers') - 742) < 1 &&
			(lineDistance(route2, 'kilometers') - 742) > (-1) );

	t.end();
});

test('turf-line-distance with geometries', function (t) {
	t.equal(Math.round(lineDistance(route1.geometry, 'miles')), 202);
	t.true((lineDistance(route2.geometry, 'kilometers') - 742) < 1 &&
			(lineDistance(route2.geometry, 'kilometers') - 742) > (-1) );

	t.end();
});
