var test = require('tap').test;
var midpoint = require('./');
var point = require('turf-helpers').point;

test('midpoint', function(t){
  var pt1 = point([0,0]);
  var pt2 = point([10, 0]);
  var expectedMidPoint = point([5, 0]);
  var actualMidPoint = midpoint(pt1, pt2);
  t.deepEqual(actualMidPoint, expectedMidPoint, 'should return the halfway point of a horizontal line starting off 0,0');

  var pt1 = point([0,0]);
  var pt2 = point([0,10]);
  var expectedMidPoint = point([0, 5]);
  var actualMidPoint = midpoint(pt1, pt2);
  t.deepEqual(actualMidPoint, expectedMidPoint, 'should return the halfway point of a vertical line starting off 0,0');

  var pt1 = point([1,1]);
  var pt2 = point([11,11]);
  var expectedMidPoint = point([6, 6]);
  var actualMidPoint = midpoint(pt1, pt2);
  t.deepEqual(actualMidPoint, expectedMidPoint, 'should return the halfway point of a diagonal line starting off 1,1');

  t.end();
});
