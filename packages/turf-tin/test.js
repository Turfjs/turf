const fs = require('fs');
const path = require('path');
const test = require('tape');
const tin = require('./index.js');

const points = require(path.join(__dirname,  'test', 'Points.json'));

test('tin - z property', t => {
  const expected = require(path.join(__dirname,  'test', 'Tin.json'));
  const tinned = tin(points, 'elevation');
  t.equal(tinned.features[0].geometry.type, 'Polygon');
  t.equal(tinned.features.length, 24);
  t.deepEqual(tinned, expected, 'tinned polygons match');
  t.end();
});

test('tin - z coordinate', t => {
  const expected = require(path.join(__dirname,  'test', 'Tin-z.json'));
  const tinned = tin(points);
  t.equal(tinned.features[0].geometry.type, 'Polygon');
  t.equal(tinned.features.length, 24);
  t.deepEqual(tinned, expected, 'tinned polygons match');
  t.end();
});
