import fs from 'fs';
import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import truncate from '../truncate';
import { featureEach } from '../meta';
import { featureCollection } from '../helpers';
import pointOnFeature from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(directories.in + filename)
    };
});

test('turf-point-on-feature', t => {
    for (const {name, geojson} of fixtures) {

        const ptOnFeature = pointOnFeature(geojson);

        // Style Results
        const results = featureCollection([])
        featureEach(geojson, feature => results.features.push(feature));
        ptOnFeature.properties['marker-color'] = '#F00'
        ptOnFeature.properties['marker-style'] = 'star'
        results.features.push(truncate(ptOnFeature));

        // Save Tests
        if (process.env.REGEN) write.sync(directories.out + name + '.json', results);
        t.deepEqual(results, load.sync(directories.out + name + '.json'), name);
    };
    t.end();
});
