var test = require('tape');
var isClockwise = require('./');

test('isClockwise', function(t){
  var ring = [[0,0],[1,1],[1,0],[0,0]];
  var clockwise = isClockwise(ring);
  t.equal(clockwise, true, 'should take a ring and return clockwise true');

  var ring = [[0,0],[1,0],[1,1],[0,0]];
  var counterClockwise = isClockwise(ring);
  t.equal(counterClockwise, false, 'should take a ring and return clockwise false');

  t.end();
})