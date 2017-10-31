import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { point, lineString } from '@turf/helpers';
import lineToPolygon from '.';

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
// fixtures = fixtures.filter(fixture => fixture.name === 'multi-linestrings-with-holes');

test('turf-linestring-to-polygon', t => {
    for (const {name, filename, geojson} of fixtures) {
        let {autoComplete, properties, orderCoords} = geojson.properties || {};
        properties = properties || {stroke: '#F0F', 'stroke-width': 6};
        const results = lineToPolygon(geojson, {
            properties: properties,
            autoComplete: autoComplete,
            orderCoords: orderCoords
        });

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEqual(load.sync(directories.out + filename), results, name);
    }
    // Handle Errors
    t.throws(() => lineToPolygon(point([10, 5])), 'throws - invalid geometry');
    t.throws(() => lineToPolygon(lineString([])), 'throws - empty coordinates');
    t.assert(lineToPolygon(lineString([[10, 5], [20, 10], [30, 20]]), {autocomplete: false}), 'is valid - autoComplete=false');
    t.end();
});
