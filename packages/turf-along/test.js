const path = require('path');
const test = require('tape');
const load = require('load-json-file');
const write = require('write-json-file');
const { featureCollection } = require('@turf/helpers');
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
    
    fc.features.forEach(f => {
        t.ok(f);
        t.equal(f.type, 'Feature');
        t.equal(f.geometry.type, 'Point');
    });
    t.equal(fc.features.length, 8);
    
    if (process.env.REGEN) write.sync(path.join(__dirname, 'test', 'fixtures', 'dc-points.geojson'), fc);
    t.deepEqual(fc, load.sync(path.join(__dirname, 'test', 'fixtures', 'dc-points.geojson')));

    t.end();
});

const longLine = load.sync(path.join(__dirname, 'test', 'fixtures', 'long-line.geojson'));

test('turf-along-long', t => {
  const pt1 = along(longLine.features[0], 200, {units: 'miles'});
  t.deepEqual(pt1, longLine.features[1]);

  t.end();
});