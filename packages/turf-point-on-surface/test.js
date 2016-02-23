var test = require('tape');
var centroid = require('./');
var fs = require('fs');
var inside = require('turf-inside');

test('point-on-surface -- closest vertex on polygons', function(t) {
  var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/polygons.geojson'));
  var cent = centroid(fc);

  t.ok(cent, 'centroid returned');
  t.equal(cent.type, 'Feature');
  t.equal(cent.geometry.type, 'Point');
  t.equal(typeof cent.geometry.coordinates[0], 'number');
  t.equal(typeof cent.geometry.coordinates[1], 'number');

  t.end();
});

test('point-on-surface -- centroid on polygon surface', function(t) {
  var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/polygon-in-center.geojson'));
  var cent = centroid(fc);
  
  t.ok(cent, 'centroid returned');
  t.equal(cent.type, 'Feature');
  t.equal(cent.geometry.type, 'Point');
  t.equal(typeof cent.geometry.coordinates[0], 'number');
  t.equal(typeof cent.geometry.coordinates[1], 'number');
  t.true(inside(cent, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              13.270797729492186,
              52.42042920678164
            ],
            [
              13.270797729492186,
              52.573846203920276
            ],
            [
              13.5186767578125,
              52.573846203920276
            ],
            [
              13.5186767578125,
              52.42042920678164
            ],
            [
              13.270797729492186,
              52.42042920678164
            ]
          ]
        ]
      }
    }));

  t.end();
});

test('point-on-surface -- closest vertex on lines', function(t) {
  var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/lines.geojson'));
  var cent = centroid(fc);

  t.ok(cent, 'centroid returned');
  t.equal(cent.type, 'Feature');
  t.equal(cent.geometry.type, 'Point');
  t.equal(typeof cent.geometry.coordinates[0], 'number');
  t.equal(typeof cent.geometry.coordinates[1], 'number');

  t.end();
});

test('point-on-surface -- closest vertex on multilinestring', function(t) {
  var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/multiline.geojson'));
  var cent = centroid(fc);

  t.ok(cent, 'centroid returned');
  t.equal(cent.type, 'Feature');
  t.equal(cent.geometry.type, 'Point');
  t.equal(typeof cent.geometry.coordinates[0], 'number');
  t.equal(typeof cent.geometry.coordinates[1], 'number');
  
  t.end();
});

test('point-on-surface -- multipolygon', function(t) {
  var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/multipolygon.geojson'));
  var cent = centroid(fc);

  t.ok(cent, 'centroid returned');
  t.equal(cent.type, 'Feature');
  t.equal(cent.geometry.type, 'Point');
  t.equal(typeof cent.geometry.coordinates[0], 'number');
  t.equal(typeof cent.geometry.coordinates[1], 'number');
  
  t.end();
});

test('point-on-surface -- multipoint', function(t) {
  var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/multipoint.geojson'));
  var cent = centroid(fc);

  t.ok(cent, 'centroid returned');
  t.equal(cent.type, 'Feature');
  t.equal(cent.geometry.type, 'Point');
  t.equal(typeof cent.geometry.coordinates[0], 'number');
  t.equal(typeof cent.geometry.coordinates[1], 'number');
  
  t.end();
});