import test from 'tape';
import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureEach } from '@turf/meta';
import kinks from '.';

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

test('turf-kinks', t => {
    for (const {name, filename, geojson} of fixtures) {
        const results = kinks(geojson);
        featureEach(geojson, feature => results.features.push(feature));

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
