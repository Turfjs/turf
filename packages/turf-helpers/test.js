var test = require('tape');
var geometries = require('./');
var radiansToDistance = require('./').radiansToDistance;

var point = geometries.point;
var polygon = geometries.polygon;
var lineString = geometries.lineString;
var featureCollection = geometries.featureCollection;
var multiLineString = geometries.multiLineString;
var multiPoint = geometries.multiPoint;
var feature = geometries.feature;
var multipolygon = geometries.multiPolygon;
var geometrycollection = geometries.geometryCollection;

test('point', function(t){
  var ptArray = point([5, 10], {name: 'test point'});

  t.ok(ptArray);
  t.equal(ptArray.geometry.coordinates[0], 5);
  t.equal(ptArray.geometry.coordinates[1], 10);
  t.equal(ptArray.properties.name, 'test point');

  t.throws(function() {
      point('hey', 'invalid');
  }, 'numbers required');

  var noProps = point([0, 0]);
  t.deepEqual(noProps.properties, {}, 'no props becomes {}');

  t.end();
});

test('polygon', function(t){
  var poly = polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]] , {name: 'test polygon'});
  t.ok(poly);
  t.equal(poly.geometry.coordinates[0][0][0], 5);
  t.equal(poly.geometry.coordinates[0][1][0], 20);
  t.equal(poly.geometry.coordinates[0][2][0], 40);
  t.equal(poly.properties.name, 'test polygon');
  t.equal(poly.geometry.type, 'Polygon');
  t.throws(function() {
      t.equal(polygon([[[20.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0]]]).message);
  }, /First and last Position are not equivalent/, 'invalid ring - not wrapped');
  t.throws(function() {
      t.equal(polygon([[[20.0,0.0],[101.0,0.0]]]).message);
  }, /Each LinearRing of a Polygon must have 4 or more Positions/, 'invalid ring - too few positions');
  var noProperties = polygon([[[5, 10], [20, 40], [40, 0], [5, 10]]]);
  t.deepEqual(noProperties.properties, {});
  t.end();
});

test('lineString', function(t){
  var line = lineString([[5, 10], [20, 40]], {name: 'test line'});
  t.ok(line, 'creates a linestring');
  t.equal(line.geometry.coordinates[0][0], 5);
  t.equal(line.geometry.coordinates[1][0], 20);
  t.equal(line.properties.name, 'test line');
  t.throws(function() {
      var line = lineString();
  }, /No coordinates passed/, 'error on no coordinates');
  var noProps = lineString([[5, 10], [20, 40]]);
  t.deepEqual(noProps.properties, {}, 'no properties case');
  t.end();
});

test('featureCollection', function(t){
  t.plan(7);
  var p1 = point([0,0], {name: 'first point'}),
        p2 = point([0,10]),
        p3 = point([10,10]),
        p4 = point([10,0]);
  var fc = featureCollection([p1,p2,p3,p4]);
  t.ok(fc);
  t.equal(fc.features.length, 4);
  t.equal(fc.features[0].properties.name, 'first point');
  t.equal(fc.type, 'FeatureCollection');
  t.equal(fc.features[1].geometry.type, 'Point');
  t.equal(fc.features[1].geometry.coordinates[0], 0);
  t.equal(fc.features[1].geometry.coordinates[1], 10);
});

test('multilinestring', function(t){
  t.deepEqual(multiLineString([[[0,0],[10,10]], [[5,0],[15,8]]]), {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiLineString",
      coordinates: [[[0,0],[10,10]], [[5,0],[15,8]]]
    }
  }, 'takes coordinates');

  t.deepEqual(multiLineString([[[0,0],[10,10]], [[5,0],[15,8]]], {test: 23}), {
    type: "Feature",
    properties: {
      test: 23
    },
    geometry: {
      type: "MultiLineString",
      coordinates: [[[0,0],[10,10]], [[5,0],[15,8]]]
    }
  }, 'takes properties');


  t.throws(function(err){
    multiLineString();
  }, 'throws error with no coordinates');

  t.end();
});


test('multiPoint', function(t){
  t.deepEqual(multiPoint([[0,0],[10,10]]), {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPoint",
      coordinates: [
        [0,0],
        [10,10]
      ]
    }
  }, 'takes coordinates');

  t.deepEqual(multiPoint([[0,0],[10,10]], {test: 23}), {
    type: "Feature",
    properties: {
      test: 23
    },
    geometry: {
      type: "MultiPoint",
      coordinates: [
        [0,0],
        [10,10]
      ]
    }
  }, 'takes properties');


  t.throws(function(err){
    multiPoint();
  }, 'throws error with no coordinates');

  t.end();
});

test('feature', function(t){
  var pt = {
      type: "Point",
      coordinates: [
        67.5,
        32.84267363195431
      ]
    };
  var line = {
      type: "LineString",
      coordinates: [
        [
          82.96875,
          58.99531118795094
        ],
        [
          72.7734375,
          55.57834467218206
        ],
        [
          84.0234375,
          55.57834467218206
        ]
      ]
    };
  var polygon = {
      type: "Polygon",
      coordinates: [
        [
          [
            85.78125,
            -3.513421045640032
          ],
          [
            85.78125,
            13.581920900545844
          ],
          [
            92.46093749999999,
            13.581920900545844
          ],
          [
            92.46093749999999,
            -3.513421045640032
          ],
          [
            85.78125,
            -3.513421045640032
          ]
        ]
      ]
    };

  t.equal(feature(pt).type, 'Feature');
  t.equal(feature(line).type, 'Feature');
  t.equal(feature(polygon).type, 'Feature');
  t.deepEqual(feature(pt),
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [
          67.5,
          32.84267363195431
        ]
      }
    });

  t.end();
});

  test('multipolygon', function(t){
    t.deepEqual(multipolygon([[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]]), {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]]
      }
    }, 'takes coordinates');

    t.deepEqual(multipolygon([[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]], {test: 23}), {
      type: 'Feature',
      properties: {
        test: 23
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]]
      }
    }, 'takes properties');


    t.throws(function(err){
      multipolygon();
    }, 'throws error with no coordinates');

    t.end();
  });

test('geometrycollection', function(t){
  var pt = { 
    type: "Point",
    coordinates: [100, 0]
  };
  var line = { 
    type: "LineString",
    coordinates: [ [101, 0], [102, 1] ]
  };
  var gc = geometrycollection([pt, line]);

  t.deepEqual(gc, {
    type: "Feature",
    properties: {},
    geometry: { 
      type: "GeometryCollection",
      geometries: [
        { 
          type: "Point",
          coordinates: [100, 0]
        },
        { 
          type: "LineString",
          coordinates: [ [101, 0], [102, 1] ]
        }
      ]
    }
  }, 'creates a GeometryCollection');

  var gcWithProps = geometrycollection([pt, line], {a: 23});
  t.deepEqual(gcWithProps, {
    type: "Feature",
    properties: {a: 23},
    geometry: { 
      type: "GeometryCollection",
      geometries: [
        { 
          type: "Point",
          coordinates: [100, 0]
        },
        { 
          type: "LineString",
          coordinates: [ [101, 0], [102, 1] ]
        }
      ]
    }
  }, 'creates a GeometryCollection with properties');

  t.end();
});

test('radiansToDistance', function(t){
  t.equal(radiansToDistance(1, 'radians'), 1);
  t.equal(radiansToDistance(1, 'kilometers'), 6373);
  t.equal(radiansToDistance(1, 'miles'), 3960);

  t.end();
});
