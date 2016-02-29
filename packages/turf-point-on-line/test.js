var test = require('tape');
var fs = require('fs');
var pointOnLine = require('./');
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;
var linestring = require('turf-helpers').lineString;

var route1 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/in/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/in/route2.geojson'));
var line1 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/in/line1.geojson'));

test('turf-point-on-line -- line1', function (t) {
    var pt = point([-97.79617309570312,22.254624939561698]);

    var snapped = pointOnLine(line1, pt);
    snapped.properties['marker-color'] = '#f0f';

    t.equal(snapped.geometry.type, 'Point');

    fs.writeFileSync(__dirname+ '/fixtures/out/line1_out.geojson',
    JSON.stringify(featurecollection([
    line1, pt, snapped
    ]), null, 2));

    t.end();
});

test('turf-point-on-line -- line2', function (t) {
    var pt = point([0.4,0.1]);
    var line2 = linestring([[0,0], [1,1]]);

    var snapped = pointOnLine(line2, pt);
    snapped.properties['marker-color'] = '#f0f';

    t.equal(snapped.geometry.type, 'Point');

    fs.writeFileSync(__dirname+ '/fixtures/out/line2_out.geojson',
    JSON.stringify(featurecollection([
    line2, pt, snapped
    ]), null, 2));

    t.end();
});


test('turf-point-on-line -- route1', function (t) {
    var pt = point([-79.0850830078125,37.60117623656667]);

    var snapped = pointOnLine(route1, pt);
    snapped.properties['marker-color'] = '#f0f';

    t.equal(snapped.geometry.type, 'Point');

    fs.writeFileSync(__dirname+ '/fixtures/out/route1_out.geojson',
    JSON.stringify(featurecollection([
    route1, pt, snapped
    ]), null, 2));

    t.end();
});

test('turf-point-on-line -- route2', function (t) {
    var pt = point([-112.60660171508789,45.96021963947196]);

    var snapped = pointOnLine(route2, pt);
    snapped.properties['marker-color'] = '#f0f';

    t.equal(snapped.geometry.type, 'Point');

    fs.writeFileSync(__dirname+ '/fixtures/out/route2_out.geojson',
    JSON.stringify(featurecollection([
    route2, pt, snapped
    ]), null, 2));

    t.end();
});
