import fs from 'fs';
import test from 'tape';
import path from 'path';
import glob from 'glob';
import load from 'load-json-file';
import write from 'write-json-file';
import polygonSmooth from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-polygon-smooth', t => {
    fixtures.forEach(fixture => {
        // Inputs
        const geojson = fixture.geojson;
        const options = geojson.options || {};
        const iterations = options.iterations || 3;

        // Results
        const results = polygonSmooth(geojson, {iterations});

        // Save Results
        if (process.env.REGEN) write.sync(directories.out + fixture.filename, geojson);
        t.deepEqual(load.sync(directories.out + fixture.filename), results);
    });
    t.end();
});
