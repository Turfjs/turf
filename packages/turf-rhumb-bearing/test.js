import path from 'path';

// const {point, lineString, featureCollection} = require('@turf/helpers');
import { point } from '@turf/helpers';

// const rhumbDestination = require('@turf/rhumb-destination');
import load from 'load-json-file';

import fs from 'fs';
import test from 'tape';
import write from 'write-json-file';

// const getCoords = require('@turf/invariant').getCoords;
import rhumbBearing from '.';

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

test('bearing', t => {
    fixtures.forEach(fixture => {
        const name = fixture.name;
        const filename = fixture.filename;
        const geojson = fixture.geojson;

        const start = geojson.features[0];
        const end = geojson.features[1];

        const initialBearing = rhumbBearing(start, end);
        const finalBearing = rhumbBearing(start, end, {final: true});

        const result = {
            'initialBearing': initialBearing,
            'finalBearing': finalBearing
        };
        if (process.env.REGEN) write.sync(directories.out + name + '.json', result);
        t.deepEqual(load.sync(directories.out + name + '.json'), result, name);

        // TODO adopt the following graphical output once rhumbDestination is published
        //
        // const initialDestination = rhumbDestination(start, 1000, initialBearing);
        // const initialLine = lineString([getCoords(start), getCoords(initialDestination)], {
        //     'stroke': '#F00',
        //     'stroke-width': 6
        // });
        //
        // const finalDestination = rhumbDestination(end, 1000, finalBearing - 180);
        // const finalLine = lineString([getCoords(end), getCoords(finalDestination)], {
        //     'stroke': '#00F',
        //     'stroke-width': 6
        // });
        //
        // const result = featureCollection([start, end, initialLine, finalLine]);
        //
        // if (process.env.REGEN) write.sync(directories.out + filename, result);
        // t.deepEqual(load.sync(directories.out + filename), result, name);
    });

    t.throws(() => { rhumbBearing(point([12, -54]), 'point'); }, 'invalid point');
    t.end();
});
