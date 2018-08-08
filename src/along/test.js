const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const { featureCollection } = require('../helpers');
const isPointOnLine = require('../boolean-point-on-line').default;
const pointToLineDistance = require('../point-to-line-distance').default;

const along = require('./').default;

const line = load.sync(path.join(__dirname, 'test', 'fixtures', 'dc-line.geojson'));

test('turf-along', t => {
    const options = {units: 'miles'}
    const pt1 = along(line, 1, options);
    const pt2 = along(line.geometry, 1.2, options);
    const pt3 = along(line, 1.4, options);
    const pt4 = along(line.geometry, 1.6, options);
    const pt5 = along(line, 1.8, options);
    const pt6 = along(line.geometry, 2, options);
    const pt7 = along(line, 100, options);
    const pt8 = along(line.geometry, 0, options);
    const fc = featureCollection([pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8]);

    fc.features.forEach((f, i) => {
        t.ok(f);
        t.equal(f.type, 'Feature');
        t.equal(f.geometry.type, 'Point');
        t.equal(pointToLineDistance(f, line, {units: 'centimeters'}) < 0.2, true)
    });

    t.end();
});

test('turf-along-long', t => {
  const fixtures = load.sync(path.join(__dirname, 'test', 'fixtures', 'long-line.geojson'));
  const longLine = fixtures.features[0];
  const pointOnLongLine = fixtures.features[1];

  const pt1 = along(longLine, 200, {units: 'miles'});
  t.deepEqual(pt1, pointOnLongLine);
  t.equal(pointToLineDistance(pt1, longLine, {units: 'kilometers'}) < 1, true)

  t.end();
});