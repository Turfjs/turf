var test = require('tap').test;
var fs = require('fs');
var lineSlice = require('./');
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;
var linestring = require('turf-helpers').lineString;

var route1 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/in/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/in/route2.geojson'));
var line1 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/in/line1.geojson'));

test('turf-line-slice -- line1', function (t) {
	var start = point([-97.79617309570312,22.254624939561698]);
	var stop = point([-97.72750854492188,22.057641623615734]);

	var sliced = lineSlice(start, stop, line1);
	sliced.properties['stroke'] = '#f0f';
	sliced.properties['stroke-width'] = 6;

	if (process.env.UPDATE) {
		fs.writeFileSync(__dirname+ '/fixtures/out/line1_out.geojson',
			JSON.stringify(featurecollection([
					line1, start, stop, sliced
				]), null, 2));
	}

	t.deepEqual(featurecollection([
					line1, start, stop, sliced
				]), JSON.parse(fs.readFileSync(__dirname + '/fixtures/out/line1_out.geojson')));

	t.end();
});

test('turf-line-slice -- line2', function (t) {
	var start = point([0,0.1]);
	var stop = point([.9,.8]);
	var line2 = linestring([[0,0], [1,1]])

	var sliced = lineSlice(start, stop, line2);
	sliced.properties['stroke'] = '#f0f';
	sliced.properties['stroke-width'] = 6;

	if (process.env.UPDATE) {
		fs.writeFileSync(__dirname+ '/fixtures/out/line2_out.geojson',
			JSON.stringify(featurecollection([
					line2, start, stop, sliced
				]), null, 2));
	}

	t.deepEqual(featurecollection([
					line2, start, stop, sliced
				]), JSON.parse(fs.readFileSync(__dirname + '/fixtures/out/line2_out.geojson')));
	t.end();
});


test('turf-line-slice -- route1', function (t) {
	var start = point([-79.0850830078125,37.60117623656667]);
	var stop = point([-77.7667236328125,38.65119833229951]);

	var sliced = lineSlice(start, stop, route1);
	sliced.properties['stroke'] = '#f0f';
	sliced.properties['stroke-width'] = 6;

	if (process.env.UPDATE) {
		fs.writeFileSync(__dirname+ '/fixtures/out/route1_out.geojson',
			JSON.stringify(featurecollection([
					route1, start, stop, sliced
				]), null, 2));
	}

	t.deepEqual(featurecollection([
					route1, start, stop, sliced
				]), JSON.parse(fs.readFileSync(__dirname + '/fixtures/out/route1_out.geojson')));

	t.end();
});

test('turf-line-slice -- route2', function (t) {
	var start = point([-112.60660171508789,45.96021963947196]);
	var stop = point([-111.97265625,48.84302835299516]);

	var sliced = lineSlice(start, stop, route2);
	sliced.properties['stroke'] = '#f0f';
	sliced.properties['stroke-width'] = 6;

	if (process.env.UPDATE) {
		fs.writeFileSync(__dirname+ '/fixtures/out/route2_out.geojson',
			JSON.stringify(featurecollection([
					route2, start, stop, sliced
				]), null, 2));
	}

	t.deepEqual(featurecollection([
					route2, start, stop, sliced
				]), JSON.parse(fs.readFileSync(__dirname + '/fixtures/out/route2_out.geojson')));

	t.end();
});
