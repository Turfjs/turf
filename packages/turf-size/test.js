var test = require('tape');
var size = require('./');

test('size', function(t){
  var bbox = [0, 0, 10, 10];
  var sized = size(bbox, 2);
  t.deepEqual(sized, [-5, -5, 15, 15], 'should double the size of a bbox at 0,0,10,10');

  var bbox = [0, 0, 4, 4];
  var sized = size(bbox, 1);
  t.deepEqual(sized, [0, 0, 4, 4], 'should do nothing to the size of a bbox at 0,0,4,4');

  var bbox = [0, 0, 4, 4];
  var sized = size(bbox, 2);
  t.deepEqual(sized, [-2, -2, 6, 6], 'should double the size of a bbox at 0,0,4,4');

  var bbox = [0, 0, 4, 4];
  var sized = size(bbox, 0.5);
  t.deepEqual(sized, [1, 1, 3, 3], 'should shrink a bbox by 50% at 0,0,4,4');

  var bbox = [-10, -10, 0, 0];
  var sized = size(bbox, 2);
  t.deepEqual(sized, [-15, -15, 5, 5], 'should double the size of a bbox at -10,-10');

  var bbox = [0, 0, 10, 10];
  var sized = size(bbox, 1.5);
  t.deepEqual(sized, [-2.5, -2.5, 12.5, 12.5], 'should expand the size of a bbox by 50% at 0,0,10,10');

  var bbox = [0, 0, 10, 10];
  var sized = size(bbox, 0.5);
  t.deepEqual(sized, [2.5, 2.5, 7.5, 7.5], 'should shrink a bbox by 50%');

  t.end();
});