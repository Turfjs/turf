var test = require('tape');
var envelope = require('./');
var fc = require('./test/geojson/fc.json');

test('envelope', function(t){
  var enveloped = envelope(fc);
  t.ok(enveloped, 'should return a polygon that represents the bbox around a feature or feature collection');
  t.equal(enveloped.geometry.type, 'Polygon');
  t.deepEqual(enveloped.geometry.coordinates,
    [ [ [ 20, -10 ], [ 130, -10 ], [ 130, 4 ], [ 20, 4 ], [ 20, -10 ] ] ] ,
    'positions are correct');
  t.end();
})
