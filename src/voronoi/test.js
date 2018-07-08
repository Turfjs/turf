import fs from 'fs';
import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import voronoi from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {filename, geojson: load.sync(directories.in + filename)};
});

test('turf-voronoi', t => {
    for (const {filename, geojson} of fixtures) {
        const results = voronoi(geojson, {bbox: geojson.bbox});

        if (process.env.REGEN) write.sync(directories.out + filename, results);

        const expected = load.sync(directories.out + filename);
        t.deepEquals(results, expected, path.parse(filename).name);
    };
    t.end();
});
