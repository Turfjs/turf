import path from 'path';
import test from 'tape';
import load from 'load-json-file';
import envelope from '.';

// Fixtures
const fc = load.sync(path.join(__dirname, 'test', 'in', 'feature-collection.geojson'));

test('envelope', t => {
    const enveloped = envelope(fc);
    t.ok(enveloped, 'should return a polygon that represents the bbox around a feature or feature collection');
    t.equal(enveloped.geometry.type, 'Polygon');
    t.deepEqual(enveloped.geometry.coordinates,
        [[[20, -10], [130, -10], [130, 4], [20, 4], [20, -10]]],
        'positions are correct');
    t.end();
});
