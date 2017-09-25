const fs = require('fs');
const path = require('path');
const test = require('tape');
const featureCollection = require('@turf/helpers').featureCollection;
const along = require('./');

const line = JSON.parse(fs.readFileSync(path.join(__dirname, 'test', 'fixtures', 'dc-line.geojson')));

test('turf-along', t => {
    const pt1 = along(line, 1, 'miles');
    const pt2 = along(line.geometry, 1.2, 'miles');
    const pt3 = along(line, 1.4, 'miles');
    const pt4 = along(line.geometry, 1.6, 'miles');
    const pt5 = along(line, 1.8, 'miles');
    const pt6 = along(line.geometry, 2, 'miles');
    const pt7 = along(line, 100, 'miles');
    const pt8 = along(line.geometry, 0, 'miles');
    const fc = featureCollection([pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8]);

    fc.features.forEach(f => {
        t.ok(f);
        t.equal(f.type, 'Feature');
        t.equal(f.geometry.type, 'Point');
    });
    t.equal(fc.features.length, 8);
    t.equal(fc.features[7].geometry.coordinates[0], pt8.geometry.coordinates[0]);
    t.equal(fc.features[7].geometry.coordinates[1], pt8.geometry.coordinates[1]);

    t.end();
});
