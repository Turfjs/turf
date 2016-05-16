var test = require('tape');
var midpoint = require('./');

test('midpoint', function(t){
  var pt1 = { type: 'Point', coordinates: [0,0] };
  var pt2 = { type: 'Point', coordinates: [10, 0] };
  var expectedMidPoint = { type: 'Point', coordinates: [5, 0] };
  var actualMidPoint = midpoint(pt1, pt2);
  t.deepEqual(actualMidPoint, expectedMidPoint, 'should return the halfway point of a horizontal line starting off 0,0');

  var pt1 = { type: 'Point', coordinates: [0,0] };
  var pt2 = { type: 'Point', coordinates: [0,10] };
  var expectedMidPoint = { type: 'Point', coordinates: [0, 5] };
  var actualMidPoint = midpoint(pt1, pt2);
  t.deepEqual(actualMidPoint, expectedMidPoint, 'should return the halfway point of a vertical line starting off 0,0');

  var pt1 = { type: 'Point', coordinates: [1,1] };
  var pt2 = { type: 'Point', coordinates: [11,11] };
  var expectedMidPoint = { type: 'Point', coordinates: [6, 6] };
  var actualMidPoint = midpoint(pt1, pt2);
  t.deepEqual(actualMidPoint, expectedMidPoint, 'should return the halfway point of a diagonal line starting off 1,1');

  t.end();
});
