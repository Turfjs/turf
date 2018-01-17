import path from 'path';
import fs from 'fs';
import test from 'tape';
import load from 'load-json-file';
import write from 'write-json-file';
import combine from '@turf/combine';
import union from '.';

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

test('union', function (t) {
    for (const {name, geojson, filename} of fixtures) {
        let result = null;
        if (geojson.features.length > 2) {
            var last = geojson.features.pop();
            var multipoly = combine(geojson);
            result = union(last, multipoly.features[0]);
        } else {
            result = union(geojson.features[0], geojson.features[1]);
        }
        if (process.env.REGEN) write.sync(directories.out + filename, result);
        t.deepEqual(result, load.sync(directories.out + filename), name);
    }
    t.end();
});
