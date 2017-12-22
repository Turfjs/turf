import path from 'path';
import fs from 'fs';
import test from 'tape';
import load from 'load-json-file';
import write from 'write-json-file';
import { feature } from '@turf/helpers';
import intersect from '.';

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

test('intersect', t => {
    fixtures.forEach(({name, geojson, filename}) => {
        if (name === 'issue-1132-line') return t.skip(name);

        const features = geojson.features;
        let result = intersect(features[0], features[1]);
        if (!result) result = feature(null);

        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    })
    t.end();
});
