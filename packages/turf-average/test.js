var average = require('./');
var test = require('tape');
var polygon = require('turf-helpers').polygon;
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;

test('average', function(t){
  var poly1 = polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]);
  var poly2 = polygon([[[10,0],[20,10],[20,20],[20,0],[10,0]]]);
  var polyFC = featurecollection([poly1, poly2]);
  var pt1 = point([5,5], {population: 200});
  var pt2 = point([1,3], {population: 600});
  var pt3 = point([14,2], {population: 100});
  var pt4 = point([13,1], {population: 200});
  var pt5 = point([19,7], {population: 300});
  var ptFC = featurecollection([pt1, pt2, pt3, pt4, pt5]);

  var averaged = average(polyFC, ptFC, 'population', 'pop_avg');

  t.equal(averaged.features[0].geometry.type, 'Polygon');
  t.equal(averaged.features[0].properties.pop_avg, 400);
  t.equal(averaged.features[1].properties.pop_avg, 200);

  t.end()
})
