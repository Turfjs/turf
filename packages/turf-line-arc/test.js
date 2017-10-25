import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import truncate from '@turf/truncate';
import { featureCollection } from '@turf/helpers';
import lineArc from './index';

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

test('turf-line-arc', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const {radius, bearing1, bearing2, steps, units} = geojson.properties;
        const arc = truncate(lineArc(geojson, radius, bearing1, bearing2, steps, units));
        const results = featureCollection([geojson, arc]);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
