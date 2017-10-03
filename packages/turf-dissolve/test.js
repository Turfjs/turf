import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import dissolve from '.';

const directories = {
    out: path.join(__dirname, 'test', 'out') + path.sep,
    in: path.join(__dirname, 'test', 'in') + path.sep
};

test('turf-dissolve', t => {
    const polys = load.sync(directories.in + 'polys.geojson');

    // With Property
    const polysByProperty = dissolve(polys, {propertyName: 'combine'});
    if (process.env.REGEN) write.sync(directories.out + 'polysByProperty.geojson', polysByProperty);
    t.equal(polysByProperty.features.length, 3);
    t.deepEqual(polysByProperty, load.sync(directories.out + 'polysByProperty.geojson'));

    // Without Property
    const polysWithoutProperty = dissolve(polys);
    if (process.env.REGEN) write.sync(directories.out + 'polysWithoutProperty.geojson', polysWithoutProperty);
    t.equal(polysWithoutProperty.features.length, 2);
    t.deepEqual(polysWithoutProperty, load.sync(directories.out + 'polysWithoutProperty.geojson'));

    t.end();
});
