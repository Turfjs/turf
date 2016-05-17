var test = require('tape');
var fs = require('fs');
var along = require('./');
var featurecollection = require('turf-helpers').featureCollection;

var line = JSON.parse(fs.readFileSync(__dirname + '/test/fixtures/dc-line.geojson'));

test('turf-along', function (t) {
	var pt1 = along(line, 1, 'miles');
	var pt2 = along(line.geometry, 1.2, 'miles');
	var pt3 = along(line, 1.4, 'miles');
	var pt4 = along(line.geometry, 1.6, 'miles');
	var pt5 = along(line, 1.8, 'miles');
	var pt6 = along(line.geometry, 2, 'miles');
	var pt7 = along(line, 100, 'miles');
	var pt8 = along(line.geometry, 0, 'miles');
    var fc = featurecollection([pt1,pt2,pt3,pt4,pt5,pt6,pt7,pt8]);

    fc.features.forEach(function (f) {
    	t.ok(f);
    	t.equal(f.type, 'Feature');
    	t.equal(f.geometry.type, 'Point');
    });
    t.equal(fc.features.length, 8);
    t.equal(fc.features[7].geometry.coordinates[0], pt8.geometry.coordinates[0]);
    t.equal(fc.features[7].geometry.coordinates[1], pt8.geometry.coordinates[1]);

	t.end();
});
