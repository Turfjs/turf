import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureCollection } from '@turf/helpers';
import voronoi from '.';

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

test('turf-voronoi', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const bbox = geojson.features[0].properties.bbox;
        const results = voronoi(geojson, bbox);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
