import test from 'tape';
import fs from 'fs';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import truncate from '@turf/truncate';
import { featureCollection } from '@turf/helpers';
import circle from '.';

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

test('turf-circle', t => {
    fixtures.forEach(fixture => {
        const filename = fixture.filename;
        const name = fixture.name;
        const geojson = fixture.geojson;
        const properties = geojson.properties || {};
        const radius = properties.radius;
        const steps = properties.steps;
        const units = properties.units;

        const C = truncate(circle(geojson, radius, steps, units));
        const results = featureCollection([geojson, C]);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    });
    t.end();
});
