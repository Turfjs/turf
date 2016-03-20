var test = require('tap').test;
var fs = require('fs');
var lineDistance = require('./');

var route1 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/route1.geojson'));
var route2 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/route2.geojson'));

test('LineString', function (t) {
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

test('Polygon', function (t) {
    var feat = JSON.parse(fs.readFileSync(__dirname + '/fixtures/polygon.geojson'));
    t.equal(Math.round(1000 * lineDistance(feat, 'kilometers')), 5599);
    t.end();
})

test('MultiLineString', function (t) {
    var feat = JSON.parse(fs.readFileSync(__dirname + '/fixtures/multilinestring.geojson'));
    t.equal(Math.round(1000 * lineDistance(feat, 'kilometers')), 4705);
    t.end();
})

test('FeatureCollection', function (t) {
    var feat = JSON.parse(fs.readFileSync(__dirname + '/fixtures/featurecollection.geojson'));
    t.equal(Math.round(1000 * lineDistance(feat, 'kilometers')), 10304);
    t.end();
})
