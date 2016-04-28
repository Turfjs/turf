var test = require('tape');
var distance = require('./');

test('distance', function(t){
  var pt1 = {
    type: "Feature",
    geometry: {type: "Point", coordinates: [-75.343, 39.984]}
  };
  var pt2 = {
    type: "Feature",
    geometry: {type: "Point", coordinates: [-75.534, 39.123]}
  };

  t.equal(distance(pt1, pt2, 'miles'), 60.37218405837491, 'miles');
  t.equal(distance(pt1, pt2, 'nauticalmiles'), 52.461979624130436, 'miles');
  t.equal(distance(pt1, pt2, 'kilometers'), 97.15957803131901, 'kilometers');
  t.equal(distance(pt1, pt2, 'kilometres'), 97.15957803131901, 'kilometres');
  t.equal(distance(pt1, pt2, 'radians'), 0.015245501024842149, 'radians');
  t.equal(distance(pt1, pt2, 'degrees'), 0.8735028650863799, 'degrees');
  t.equal(distance(pt1, pt2), 97.15957803131901, 'default=kilometers');

  t.throws(function() {
      distance(pt1, pt2, 'blah');
  }, 'unknown option given to units');

  t.end();
});
