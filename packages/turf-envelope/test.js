var test = require('tape');
var envelope = require('./');
var fc = require('./geojson/fc.js');

test('envelope', function(t){
  var enveloped = envelope(fc);
  t.ok(enveloped, 'should return a polygon that represents the bbox around a feature or feature collection');
  t.equal(enveloped.geometry.type, 'Polygon');
  t.end();
})