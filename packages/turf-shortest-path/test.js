import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureCollection } from '@turf/helpers';
import shortestPath from './';

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

test('turf-shortest-path', t => {
    for (const {filename, name, geojson}  of fixtures) {
        const {start, end, obstacles, options} = geojson;
        const path = shortestPath(start, end, obstacles, options);
        path.properties['stroke'] = '#F00';
        path.properties['stroke-width'] = 5;

        var features = obstacles.features;
        features.push(start);
        features.push(end);
        features.push(path);
        const results = featureCollection(features);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(results, load.sync(directories.out + filename), name);
    }
    t.end();
});

