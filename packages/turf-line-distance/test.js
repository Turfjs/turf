var test = require('tape');
var fs = require('fs');
var lineDistance = require('./');

var route1 = JSON.parse(fs.readFileSync(__dirname + '/test/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/test/route2.geojson'));

test('Geometry', function (t) {
    t.equal(Math.round(lineDistance(route1.geometry, 'miles')), 202);
    t.true((lineDistance(route2.geometry, 'kilometers') - 742) < 1 && (lineDistance(route2.geometry, 'kilometers') - 742) > (-1) );
    t.end();
});

test('Point', function (t) {
    var point1 = {
        type: "Feature",
        geometry: {type: "Point", coordinates: [-75.343, 39.984]}
    };
    t.throws(function() {
        lineDistance(point1, 'miles');
    });
    t.end();
});

test('MultiPoint', function (t) {
    var multiPoint1 = {
        type: "Feature",
        geometry: {type: "MultiPoint", coordinates: [[-75.343, 39.984], [-75.534, 39.123]]}
    };
    t.throws(function() {
        lineDistance(multiPoint1, 'miles');
    });
    t.end();
});

test('LineString', function (t) {
    t.equal(Math.round(lineDistance(route1, 'miles')), 202);
    t.true((lineDistance(route2, 'kilometers') - 742) < 1 && (lineDistance(route2, 'kilometers') - 742) > (-1) );
    t.end();
});

test('Polygon', function (t) {
    var feat = JSON.parse(fs.readFileSync(__dirname + '/test/polygon.geojson'));
    t.equal(Math.round(1000 * lineDistance(feat, 'kilometers')), 5599);
    t.end();
});

test('MultiLineString', function (t) {
    var feat = JSON.parse(fs.readFileSync(__dirname + '/test/multilinestring.geojson'));
    t.equal(Math.round(1000 * lineDistance(feat, 'kilometers')), 4705);
    t.end();
});

test('MultiPolygon', function (t) {
    var feat = JSON.parse(fs.readFileSync(__dirname + '/test/multipolygon.geojson'));
    t.equal(Math.round(1000 * lineDistance(feat, 'kilometers')), 8334);
    t.end();
});

test('FeatureCollection', function (t) {
    var feat = JSON.parse(fs.readFileSync(__dirname + '/test/featurecollection.geojson'));
    t.equal(Math.round(1000 * lineDistance(feat, 'kilometers')), 10304);
    t.end();
});
