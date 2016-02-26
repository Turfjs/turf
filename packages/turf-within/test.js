var test = require('tape');
var within = require('./');
var point = require('turf-helpers').point;
var polygon = require('turf-helpers').polygon;
var featureCollection = require('turf-helpers').featureCollection;

test('within', function(t){
  t.plan(4);

  // test with a single point
  var poly = polygon([[[0,0], [0,100], [100,100], [100,0],[0,0]]]);
  var pt = point([50, 50]);
  var polyFC = featureCollection([poly]);
  var ptFC = featureCollection([pt]);
  
  var counted = within(ptFC, polyFC);

  t.ok(counted, 'returns a featurecollection');
  t.equal(counted.features.length, 1, '1 point in 1 polygon');

  // test with multiple points and multiple polygons
  var poly1 = polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]);
  var poly2 = polygon([[[10,0],[20,10],[20,20], [20,0],[10,0]]]);
  var polyFC = featureCollection([poly1, poly2]);
  var pt1 = point([1,1], {population: 500});
  var pt2 = point([1,3], {population: 400});
  var pt3 = point([14,2], {population: 600});
  var pt4 = point([13,1], {population: 500});
  var pt5 = point([19,7], {population: 200});
  var pt6 = point([100,7], {population: 200});
  var ptFC = featureCollection([pt1, pt2, pt3, pt4, pt5, pt6]);

  var counted = within(ptFC, polyFC);
  t.ok(counted, 'returns a featurecollection');
  t.equal(counted.features.length, 5, 'multiple points in multiple polygons');
});
